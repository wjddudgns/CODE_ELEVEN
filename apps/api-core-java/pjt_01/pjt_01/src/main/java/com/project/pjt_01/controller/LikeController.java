package com.project.pjt_01.controller;

import com.project.pjt_01.dto.like.LikeResponse;
import com.project.pjt_01.service.PostLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final PostLikeService postLikeService;

    @Autowired
    public LikeController(PostLikeService postLikeService) {
        this.postLikeService = postLikeService;
    }

    // POST /api/likes/{postId}/toggle?userId=2
    @PostMapping("/{postId}/toggle")
    public ResponseEntity<LikeResponse> toggle(@PathVariable Long postId,
                                               @RequestParam Long userId) {
        return ResponseEntity.ok(postLikeService.toggle(postId, userId));
    }
}
