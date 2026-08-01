package com.museiq.backend.controller;

import com.museiq.backend.model.User;
import com.museiq.backend.repository.UserRepository;
import com.museiq.backend.security.UserDetailsImpl;
import com.museiq.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserDetails() {
        User user = getCurrentUser();
        Map<String, String> response = new HashMap<>();
        response.put("id", user.getId().toString());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        User user = getCurrentUser();
        
        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
        }
        
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("id", user.getId().toString());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        User user = getCurrentUser();

        String fileName = fileStorageService.storeFile(file);
        
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/avatars/")
                .path(fileName)
                .toUriString();

        user.setAvatarUrl(fileDownloadUri);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("avatarUrl", fileDownloadUri);
        
        return ResponseEntity.ok(response);
    }
}
