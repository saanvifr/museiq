package com.museiq.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "album_id", nullable = false)
    private String albumId;
    
    private String title;
    private String artist;
    private String coverUrl;
    private Integer releaseYear;
    private String genre;
    private Integer trackCount;

    @Column(name = "played_at", nullable = false)
    private LocalDateTime playedAt;
}
