package com.project.pjt_01.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CommentRequest {

    @NotNull(message = "게시글 ID는 필수입니다.")
    private Long postId;

    @NotNull(message = "작성자 ID는 필수입니다.")
    private Long userId;

    @NotBlank(message = "댓글 내용은 비어 있을 수 없습니다.")
    private String content;

    public CommentRequest() {}

    public CommentRequest(Long postId, Long userId, String content) {
        this.postId = postId;
        this.userId = userId;
        this.content = content;
    }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
