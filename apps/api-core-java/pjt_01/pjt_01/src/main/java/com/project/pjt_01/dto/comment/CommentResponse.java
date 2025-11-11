package com.project.pjt_01.dto.comment;

import com.project.pjt_01.domain.Comment;
import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;

    public CommentResponse() {}

    public CommentResponse(Long id, String content, String authorName, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.authorName = authorName;
        this.createdAt = createdAt;
    }

    public static CommentResponse from(Comment c) {
        String name = (c.getAuthor() != null) ? c.getAuthor().getUsername() : null;
        return new CommentResponse(
                c.getId(),
                c.getContent(),
                name,
                c.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public String getContent() { return content; }
    public String getAuthorName() { return authorName; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
