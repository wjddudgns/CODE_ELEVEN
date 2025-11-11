package com.project.pjt_01.dto.post;

import com.project.pjt_01.domain.Post;
import java.time.LocalDateTime;

public class PostResponse {

    private Long id;
    private String title;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;

    public PostResponse() {}

    public PostResponse(Long id, String title, String content, String authorName, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorName = authorName;
        this.createdAt = createdAt;
    }

    /** Entity → DTO 변환 도우미 */
    public static PostResponse from(Post post) {
        String name = (post.getAuthor() != null) ? post.getAuthor().getUsername() : null;
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                name,
                post.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getAuthorName() { return authorName; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
