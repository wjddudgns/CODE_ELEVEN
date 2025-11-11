package com.project.pjt_01.dto.like;

public class LikeResponse {

    private boolean liked; // true=좋아요 생성, false=취소
    private Long postId;
    private Long userId;

    public LikeResponse() {}

    public LikeResponse(boolean liked, Long postId, Long userId) {
        this.liked = liked;
        this.postId = postId;
        this.userId = userId;
    }

    public boolean isLiked() { return liked; }
    public void setLiked(boolean liked) { this.liked = liked; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
