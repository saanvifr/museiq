package com.museiq.backend.controller;

import com.museiq.backend.model.Album;
import com.museiq.backend.model.Playlist;
import com.museiq.backend.model.User;
import com.museiq.backend.repository.AlbumRepository;
import com.museiq.backend.repository.PlaylistRepository;
import com.museiq.backend.repository.UserRepository;
import com.museiq.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    @Autowired
    PlaylistRepository playlistRepository;

    @Autowired
    AlbumRepository albumRepository;

    @Autowired
    UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Error: User is not found."));
    }

    @GetMapping
    public ResponseEntity<List<Playlist>> getPlaylists() {
        User user = getCurrentUser();
        List<Playlist> playlists = playlistRepository.findByUser(user);
        return ResponseEntity.ok(playlists);
    }

    @PostMapping
    public ResponseEntity<?> createPlaylist(@RequestBody Playlist playlistRequest) {
        User user = getCurrentUser();
        playlistRequest.setUser(user);
        Playlist savedPlaylist = playlistRepository.save(playlistRequest);
        return ResponseEntity.ok(savedPlaylist);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlaylist(@PathVariable Long id, @RequestBody Playlist updateRequest) {
        User user = getCurrentUser();

        Playlist playlist = playlistRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Error: Playlist not found."));

        if (updateRequest.getName() != null) {
            playlist.setName(updateRequest.getName());
        }
        if (updateRequest.getDescription() != null) {
            playlist.setDescription(updateRequest.getDescription());
        }

        Playlist updatedPlaylist = playlistRepository.save(playlist);
        return ResponseEntity.ok(updatedPlaylist);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletePlaylist(@PathVariable Long id) {
        User user = getCurrentUser();
        if (playlistRepository.findByIdAndUser(id, user).isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Playlist not found.");
        }

        playlistRepository.deleteByIdAndUser(id, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{playlistId}/albums/{albumId}")
    @Transactional
    public ResponseEntity<?> addAlbumToPlaylist(@PathVariable Long playlistId, @PathVariable String albumId) {
        User user = getCurrentUser();

        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user)
                .orElseThrow(() -> new RuntimeException("Error: Playlist not found."));

        Album album = albumRepository.findByIdAndUser(albumId, user)
                .orElseThrow(() -> new RuntimeException("Error: Album not found in your library. Add it to library first."));

        // Check if album is already in playlist to avoid duplicates
        boolean exists = playlist.getAlbums().stream().anyMatch(a -> a.getId().equals(album.getId()));
        if (!exists) {
            playlist.getAlbums().add(album);
            playlistRepository.save(playlist);
        }

        return ResponseEntity.ok(playlist);
    }

    @DeleteMapping("/{playlistId}/albums/{albumId}")
    @Transactional
    public ResponseEntity<?> removeAlbumFromPlaylist(@PathVariable Long playlistId, @PathVariable String albumId) {
        User user = getCurrentUser();

        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user)
                .orElseThrow(() -> new RuntimeException("Error: Playlist not found."));

        playlist.getAlbums().removeIf(a -> a.getId().equals(albumId));
        playlistRepository.save(playlist);

        return ResponseEntity.ok(playlist);
    }
}
