package com.museiq.backend.controller;

import com.museiq.backend.model.Album;
import com.museiq.backend.model.User;
import com.museiq.backend.repository.AlbumRepository;
import com.museiq.backend.repository.UserRepository;
import com.museiq.backend.security.UserDetailsImpl;
import com.museiq.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    GeminiService geminiService;

    @Autowired
    AlbumRepository albumRepository;

    @Autowired
    UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Error: User is not found."));
    }

    @PostMapping("/summary")
    public ResponseEntity<?> getAiSummary() {
        User user = getCurrentUser();
        List<Album> library = albumRepository.findByUser(user);

        if (library.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Your library is empty. Add some albums first!"));
        }

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Analyze the following music library and provide insights and recommendations.\n");
        promptBuilder.append("Here are the albums in the user's library:\n");

        for (Album album : library) {
            promptBuilder.append("- ").append(album.getTitle())
                    .append(" by ").append(album.getArtist())
                    .append(" (").append(album.getGenre() != null ? album.getGenre() : "Unknown").append(")");
            if (album.getRating() != null && album.getRating() > 0) {
                promptBuilder.append(" - Rated: ").append(album.getRating()).append("/5");
            }
            promptBuilder.append("\n");
        }

        promptBuilder.append("\nReturn a JSON object strictly matching this format:\n");
        promptBuilder.append("{\n");
        promptBuilder.append("  \"summaryMarkdown\": \"A markdown-formatted string analyzing their musical DNA, spotting patterns, and identifying an era bias.\",\n");
        promptBuilder.append("  \"recommendations\": [\n");
        promptBuilder.append("    {\n");
        promptBuilder.append("      \"album\": \"Recommended Album Title\",\n");
        promptBuilder.append("      \"artist\": \"Artist Name\",\n");
        promptBuilder.append("      \"reason\": \"Why they would like it based on their library.\",\n");
        promptBuilder.append("      \"artwork\": null\n");
        promptBuilder.append("    }\n");
        promptBuilder.append("  ] (Exactly 3 recommendations)\n");
        promptBuilder.append("}\n");
        promptBuilder.append("Return ONLY valid JSON and no other text or formatting. Do not wrap in ```json tags.");

        String geminiResponse = geminiService.generateContent(promptBuilder.toString());

        if (geminiResponse == null) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to generate insights from Gemini."));
        }

        // Clean up markdown json blocks if Gemini returns them despite instructions
        String cleanJson = geminiResponse.trim();
        if (cleanJson.startsWith("```json")) {
            cleanJson = cleanJson.substring(7);
        } else if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.substring(3);
        }
        if (cleanJson.endsWith("```")) {
            cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
        }

        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(cleanJson);
    }
}
