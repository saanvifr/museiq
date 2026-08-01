package com.museiq.backend.repository;

import com.museiq.backend.model.Album;
import com.museiq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findByUser(User user);
    Optional<Album> findByIdAndUser(String id, User user);
    void deleteByIdAndUser(String id, User user);
}
