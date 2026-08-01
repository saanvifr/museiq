package com.museiq.backend.controller;

import com.museiq.backend.model.History;
import com.museiq.backend.model.User;
import com.museiq.backend.repository.HistoryRepository;
import com.museiq.backend.repository.UserRepository;
import com.museiq.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
    }

    @PostMapping
    public ResponseEntity<?> addToHistory(@RequestBody Map<String, Object> request) {
        User user = getCurrentUser();
        String albumId = String.valueOf(request.get("id"));
        
        Optional<History> existingHistory = historyRepository.findByUserIdAndAlbumId(user.getId(), albumId);
        
        History history;
        if (existingHistory.isPresent()) {
            history = existingHistory.get();
            history.setPlayedAt(LocalDateTime.now());
        } else {
            history = History.builder()
                    .user(user)
                    .albumId(albumId)
                    .title((String) request.get("title"))
                    .artist((String) request.get("artist"))
                    .coverUrl((String) request.get("coverUrl"))
                    .releaseYear(request.get("releaseYear") != null ? Integer.parseInt(String.valueOf(request.get("releaseYear"))) : null)
                    .genre((String) request.get("genre"))
                    .trackCount(request.get("trackCount") != null ? Integer.parseInt(String.valueOf(request.get("trackCount"))) : null)
                    .playedAt(LocalDateTime.now())
                    .build();
        }
        
        historyRepository.save(history);
        return ResponseEntity.ok(Map.of("message", "History updated successfully"));
    }

    @GetMapping
    public ResponseEntity<List<History>> getHistory() {
        User user = getCurrentUser();
        List<History> recentHistory = historyRepository.findTop20ByUserIdOrderByPlayedAtDesc(user.getId());
        return ResponseEntity.ok(recentHistory);
    }
}
