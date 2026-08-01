package com.museiq.backend.payload.response;

public class RecommendationDTO {
    private String id;
    private String title;
    private String artist;
    private String coverUrl;
    private String genre;
    private String releaseDate;
    private Integer trackCount;
    private String rationale;

    public RecommendationDTO() {
    }

    public RecommendationDTO(String id, String title, String artist, String coverUrl, String genre, String releaseDate, Integer trackCount, String rationale) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.coverUrl = coverUrl;
        this.genre = genre;
        this.releaseDate = releaseDate;
        this.trackCount = trackCount;
        this.rationale = rationale;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Integer getTrackCount() {
        return trackCount;
    }

    public void setTrackCount(Integer trackCount) {
        this.trackCount = trackCount;
    }

    public String getRationale() {
        return rationale;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }
}
