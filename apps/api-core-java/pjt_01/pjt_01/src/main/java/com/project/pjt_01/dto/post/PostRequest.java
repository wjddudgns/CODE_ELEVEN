package com.project.pjt_01.dto.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PostRequest {

    @NotNull(message = "작성자 ID는 필수입니다.")
    private Long userId;

    @NotBlank(message = "제목은 비어 있을 수 없습니다.")
    @Size(max = 120, message = "제목은 120자 이하여야 합니다.")
    private String title;

    @NotBlank(message = "본문은 비어 있을 수 없습니다.")
    private String content;

    public PostRequest() {}

    public PostRequest(Long userId, String title, String content) {
        this.userId = userId;
        this.title = title;
        this.content = content;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
