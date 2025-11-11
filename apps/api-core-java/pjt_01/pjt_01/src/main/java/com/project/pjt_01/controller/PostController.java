package com.project.pjt_01.controller;

import com.project.pjt_01.dto.post.PostRequest;
import com.project.pjt_01.dto.post.PostResponse;
import com.project.pjt_01.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 목록 + 검색 + 페이지네이션
    @GetMapping
    public ResponseEntity<Page<PostResponse>> list(
            @RequestParam(name = "q", required = false) String q,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(postService.list(q, pageable));
    }

    // 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(postService.get(id));
    }

    // 등록
    @PostMapping
    public ResponseEntity<PostResponse> create(@RequestBody @Valid PostRequest req) {
        return ResponseEntity.ok(postService.create(req));
    }

    // 수정
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> update(@PathVariable Long id,
                                               @RequestBody @Valid PostRequest req) {
        return ResponseEntity.ok(postService.update(id, req));
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

