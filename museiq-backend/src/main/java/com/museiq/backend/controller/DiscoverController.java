package com.museiq.backend.controller;

import com.museiq.backend.model.Album;
import com.museiq.backend.model.User;
import com.museiq.backend.payload.response.RecommendationDTO;
import com.museiq.backend.repository.AlbumRepository;
import com.museiq.backend.repository.UserRepository;
import com.museiq.backend.service.GeminiService;
import com.museiq.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/discover")
public class DiscoverController {

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiService geminiService;

    private final List<RecommendationDTO> mockDatabase = Arrays.asList(
            new RecommendationDTO("1450695723", "When We All Fall Asleep, Where Do We Go?", "Billie Eilish", "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/300x300bb.jpg", "Alternative", "2019-03-29", 14, ""),
            new RecommendationDTO("1717680174", "IGOR", "Tyler, The Creator", "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6f/e3/09/6fe30938-89fb-e4ae-d67a-648746c26db1/196871668248.jpg/300x300bb.jpg", "Pop", "2024-03-22", 14, ""),
            new RecommendationDTO("1537676681", "Punisher", "Phoebe Bridgers", "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/5a/5d/1f/5a5d1fde-7f6f-9997-3bca-d75f1e799464/656605154565.jpg/300x300bb.jpg", "Alternative", "2020-11-20", 4, ""),
            new RecommendationDTO("1445278500", "Blonde", "Frank Ocean", "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/8d/76/23/8d76234b-5101-fa9b-58b3-5e17645d5b05/00602527744209.rgb.jpg/300x300bb.jpg", "Alternative", "2011-01-01", 1, ""),
            new RecommendationDTO("1440875696", "Currents", "Tame Impala", "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/64/48/5c/64485cc9-968c-68cc-764e-9a7c71733def/00602567155454.rgb.jpg/300x300bb.jpg", "Alternative", "2017-11-16", 5, ""),
            new RecommendationDTO("1421658111", "ASTROWORLD", "Travis Scott", "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e7/49/8f/e7498f65-df8f-bead-d6e3-2a8d4d642a79/886447235317.jpg/300x300bb.jpg", "Hip-Hop/Rap", "2018-08-03", 17, ""),
            new RecommendationDTO("594061854", "Rumours", "Fleetwood Mac", "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4d/13/ba/4d13bac3-d3d5-7581-2c74-034219eadf2b/081227970949.jpg/300x300bb.jpg", "Rock", "1977-02-04", 11, "")
    );

    @GetMapping
    public ResponseEntity<List<RecommendationDTO>> getRecommendations() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Album> userLibrary = albumRepository.findByUser(user);
        
        // Filter out albums the user already has
        List<String> libraryAlbumIds = userLibrary.stream().map(Album::getId).collect(Collectors.toList());
        List<RecommendationDTO> availableRecommendations = new ArrayList<>();
        
        for (RecommendationDTO rec : mockDatabase) {
            if (!libraryAlbumIds.contains(rec.getId())) {
                availableRecommendations.add(rec);
            }
        }
        
        // Formulate rationales based on user's library
        if (!userLibrary.isEmpty()) {
            // Find most common artist and genres for prompt
            Map<String, Long> artistCounts = userLibrary.stream()
                .collect(Collectors.groupingBy(Album::getArtist, Collectors.counting()));
            
            String topArtist = artistCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("unknown");
                
            Map<String, Long> genreCounts = userLibrary.stream()
                .filter(a -> a.getGenre() != null && !a.getGenre().isEmpty())
                .collect(Collectors.groupingBy(Album::getGenre, Collectors.counting()));
                
            String topGenre = genreCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("unknown");

            // Build available album list string for prompt
            StringBuilder availableAlbumsStr = new StringBuilder();
            for (RecommendationDTO rec : availableRecommendations) {
                availableAlbumsStr.append("{ \"id\": \"").append(rec.getId())
                                  .append("\", \"title\": \"").append(rec.getTitle())
                                  .append("\", \"artist\": \"").append(rec.getArtist())
                                  .append("\", \"genre\": \"").append(rec.getGenre())
                                  .append("\" }, ");
            }

            String prompt = "You are an expert music recommendation AI. The user loves the artist '" + topArtist + "' and the genre '" + topGenre + "'. " +
                    "Select exactly 5 albums from the following available list that they would enjoy based on their taste. " +
                    "For each selected album, write a 1-2 sentence personalized rationale explaining why they would like it. " +
                    "Available albums: [" + availableAlbumsStr.toString() + "]. " +
                    "Return ONLY a strict JSON array of objects, where each object has fields: 'id' (the exact id from the list) and 'rationale' (the string explanation). " +
                    "Do not include any markdown formatting, just the raw JSON array.";

            List<RecommendationDTO> geminiRecommendations = geminiService.generateRecommendations(prompt, availableRecommendations);
            
            if (geminiRecommendations != null && !geminiRecommendations.isEmpty()) {
                return ResponseEntity.ok(geminiRecommendations);
            }
        }
        
        // Fallback if library is empty or Gemini fails
        for (RecommendationDTO rec : availableRecommendations) {
            rec.setRationale("A highly acclaimed album perfect for starting your collection.");
        }
        
        // Shuffle and return top 5
        Collections.shuffle(availableRecommendations);
        List<RecommendationDTO> finalRecommendations = availableRecommendations.stream().limit(5).collect(Collectors.toList());
        
        return ResponseEntity.ok(finalRecommendations);
    }
}
