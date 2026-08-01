package com.museiq.backend.controller;

import com.museiq.backend.model.Album;
import com.museiq.backend.model.User;
import com.museiq.backend.repository.AlbumRepository;
import com.museiq.backend.repository.UserRepository;
import com.museiq.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/library")
public class LibraryController {

    @Autowired
    AlbumRepository albumRepository;

    @Autowired
    UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Error: User is not found."));
    }

    @GetMapping
    public ResponseEntity<List<Album>> getLibrary() {
        User user = getCurrentUser();
        List<Album> library = albumRepository.findByUser(user);
        return ResponseEntity.ok(library);
    }

    @PostMapping
    public ResponseEntity<?> addAlbum(@RequestBody Album albumRequest) {
        User user = getCurrentUser();

        // Check if album already exists for this user
        Optional<Album> existingAlbum = albumRepository.findByIdAndUser(albumRequest.getId(), user);
        if (existingAlbum.isPresent()) {
            return ResponseEntity.badRequest().body("Error: Album already exists in library.");
        }

        albumRequest.setUser(user);
        Album savedAlbum = albumRepository.save(albumRequest);

        return ResponseEntity.ok(savedAlbum);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAlbum(@PathVariable String id, @RequestBody Album updateRequest) {
        User user = getCurrentUser();

        Album album = albumRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Error: Album not found."));

        if (updateRequest.getRating() != null) {
            album.setRating(updateRequest.getRating());
        }
        if (updateRequest.getNotes() != null) {
            album.setNotes(updateRequest.getNotes());
        }

        Album updatedAlbum = albumRepository.save(album);
        return ResponseEntity.ok(updatedAlbum);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteAlbum(@PathVariable String id) {
        User user = getCurrentUser();

        if (albumRepository.findByIdAndUser(id, user).isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Album not found in library.");
        }

        albumRepository.deleteByIdAndUser(id, user);
        return ResponseEntity.ok().build();
    }
}
