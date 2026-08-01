package com.museiq.backend.repository;

import com.museiq.backend.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findTop20ByUserIdOrderByPlayedAtDesc(Long userId);
    Optional<History> findByUserIdAndAlbumId(Long userId, String albumId);
}
