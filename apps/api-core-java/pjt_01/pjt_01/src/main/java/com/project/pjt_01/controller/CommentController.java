package com.project.pjt_01.controller;

import com.project.pjt_01.dto.comment.CommentRequest;
import com.project.pjt_01.dto.comment.CommentResponse;
import com.project.pjt_01.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // 글 기준 댓글 목록
    @GetMapping("/{postId}")
    public ResponseEntity<List<CommentResponse>> list(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.listByPost(postId));
    }

    // 댓글 작성
    @PostMapping
    public ResponseEntity<CommentResponse> create(@RequestBody @Valid CommentRequest req) {
        return ResponseEntity.ok(commentService.create(req));
    }
}
