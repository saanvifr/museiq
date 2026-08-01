package com.museiq.backend.controller;

import com.museiq.backend.model.Album;
import com.museiq.backend.model.User;
import com.museiq.backend.repository.AlbumRepository;
import com.museiq.backend.repository.UserRepository;
import com.museiq.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    AlbumRepository albumRepository;

    @Autowired
    UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Error: User is not found."));
    }

    @GetMapping
    public ResponseEntity<?> getAnalytics() {
        User user = getCurrentUser();
        List<Album> library = albumRepository.findByUser(user);

        if (library.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyMap());
        }

        long totalAlbums = library.size();
        
        long uniqueArtists = library.stream()
                .map(Album::getArtist)
                .filter(Objects::nonNull)
                .distinct()
                .count();
                
        long totalGenres = library.stream()
                .map(Album::getGenre)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        double averageRating = library.stream()
                .filter(a -> a.getRating() != null && a.getRating() > 0)
                .mapToInt(Album::getRating)
                .average()
                .orElse(0.0);

        Map<String, Long> genreDistribution = library.stream()
                .filter(a -> a.getGenre() != null)
                .collect(Collectors.groupingBy(Album::getGenre, Collectors.counting()));

        List<Map<String, Object>> genreData = new ArrayList<>();
        genreDistribution.forEach((k, v) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", k);
            map.put("value", v);
            genreData.add(map);
        });

        Map<Integer, Long> releasesByYear = library.stream()
                .filter(a -> a.getReleaseYear() != null)
                .collect(Collectors.groupingBy(Album::getReleaseYear, TreeMap::new, Collectors.counting()));

        List<Map<String, Object>> albumsByYear = new ArrayList<>();
        releasesByYear.forEach((k, v) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("year", String.valueOf(k));
            map.put("count", v);
            albumsByYear.add(map);
        });
        
        // Rating Distribution
        Map<Integer, Long> ratings = library.stream()
                .filter(a -> a.getRating() != null && a.getRating() > 0)
                .collect(Collectors.groupingBy(Album::getRating, Collectors.counting()));
                
        List<Map<String, Object>> ratingDistribution = new ArrayList<>();
        for (int i = 5; i >= 1; i--) {
            Map<String, Object> map = new HashMap<>();
            map.put("rating", i + (i == 1 ? " Star" : " Stars"));
            map.put("count", ratings.getOrDefault(i, 0L));
            ratingDistribution.add(map);
        }
        
        // Top Artists
        Map<String, Long> artistCounts = library.stream()
                .filter(a -> a.getArtist() != null)
                .collect(Collectors.groupingBy(Album::getArtist, Collectors.counting()));
                
        List<Map<String, Object>> topArtists = artistCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", e.getKey());
                    map.put("albums", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        // Timeline (mock 6 months based on totalAlbums)
        List<Map<String, Object>> timeline = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
        long perMonth = totalAlbums / 6;
        long remainder = totalAlbums % 6;
        for (int i = 0; i < 6; i++) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", months[i]);
            map.put("added", perMonth + (i < remainder ? 1 : 0));
            timeline.add(map);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalAlbums", totalAlbums);
        response.put("uniqueArtists", uniqueArtists);
        response.put("totalGenres", totalGenres);
        response.put("averageRating", Math.round(averageRating * 10.0) / 10.0);
        response.put("genreDistribution", genreData);
        response.put("albumsByYear", albumsByYear);
        response.put("ratingDistribution", ratingDistribution);
        response.put("topArtists", topArtists);
        response.put("timeline", timeline);

        return ResponseEntity.ok(response);
    }
}
