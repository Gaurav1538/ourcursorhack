package com.RiskAnalyse.project.dto.response;



public class NewsResponseDto {

    private String title;
    private String link;
    private String source;
    private String publishedAt;
    private String image;

    public NewsResponseDto() {}

    public NewsResponseDto(String title, String link, String source,
                           String publishedAt, String image) {
        this.title = title;
        this.link = link;
        this.source = source;
        this.publishedAt = publishedAt;
        this.image = image;
    }

    // Getters & Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getPublishedAt() { return publishedAt; }
    public void setPublishedAt(String publishedAt) { this.publishedAt = publishedAt; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}