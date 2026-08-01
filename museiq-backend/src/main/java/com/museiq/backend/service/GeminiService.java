package com.museiq.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.museiq.backend.payload.response.RecommendationDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateContent(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build the request body
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> part = new HashMap<>();
        part.put("parts", new Object[]{textPart});

        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("contents", new Object[]{part});

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBodyMap, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode candidatesNode = rootNode.path("candidates");
                
                if (candidatesNode.isArray() && candidatesNode.size() > 0) {
                    JsonNode partsNode = candidatesNode.get(0).path("content").path("parts");
                    if (partsNode.isArray() && partsNode.size() > 0) {
                        return partsNode.get(0).path("text").asText();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
        }
        
        return null;
    }

    public List<RecommendationDTO> generateRecommendations(String prompt, List<RecommendationDTO> availableAlbums) {
        String responseText = generateContent(prompt);
        if (responseText == null) return null;

        // Clean up markdown json blocks if Gemini returns them
        String cleanJson = responseText.trim();
        if (cleanJson.startsWith("```json")) {
            cleanJson = cleanJson.substring(7);
        } else if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.substring(3);
        }
        if (cleanJson.endsWith("```")) {
            cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
        }

        try {
            List<Map<String, String>> resultList = objectMapper.readValue(cleanJson, new TypeReference<List<Map<String, String>>>() {});
            List<RecommendationDTO> finalRecommendations = new ArrayList<>();

            for (Map<String, String> item : resultList) {
                String id = item.get("id");
                String rationale = item.get("rationale");

                // Find the matching album in availableAlbums
                for (RecommendationDTO rec : availableAlbums) {
                    if (rec.getId().equals(id)) {
                        RecommendationDTO enrichedRec = new RecommendationDTO(
                                rec.getId(), rec.getTitle(), rec.getArtist(), rec.getCoverUrl(),
                                rec.getGenre(), rec.getReleaseDate(), rec.getTrackCount(), rationale
                        );
                        finalRecommendations.add(enrichedRec);
                        break;
                    }
                }
            }
            return finalRecommendations;

        } catch (Exception e) {
            System.err.println("Failed to parse Gemini recommendation JSON: " + e.getMessage());
            return null;
        }
    }
}
