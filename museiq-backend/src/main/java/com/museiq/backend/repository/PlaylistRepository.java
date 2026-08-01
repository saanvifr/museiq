package com.museiq.backend.repository;

import com.museiq.backend.model.Playlist;
import com.museiq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUser(User user);
    Optional<Playlist> findByIdAndUser(Long id, User user);
    void deleteByIdAndUser(Long id, User user);
}
