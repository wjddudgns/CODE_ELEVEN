package com.project.pjt_01.service;

import com.project.pjt_01.domain.Comment;
import com.project.pjt_01.domain.Post;
import com.project.pjt_01.domain.User;
import com.project.pjt_01.dto.comment.CommentRequest;
import com.project.pjt_01.dto.comment.CommentResponse;
import com.project.pjt_01.repository.CommentRepository;
import com.project.pjt_01.repository.PostRepository;
import com.project.pjt_01.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    /** 특정 글의 댓글 목록 */
    @Transactional(readOnly = true)
    public List<CommentResponse> listByPost(Long postId) {
        // 글 존재 검증
        postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글이 존재하지 않습니다."));
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream().map(CommentResponse::from).toList();
    }

    /** 댓글 등록 */
    @Transactional
    public CommentResponse create(CommentRequest req) {
        Post post = postRepository.findById(req.getPostId())
                .orElseThrow(() -> new EntityNotFoundException("게시글이 존재하지 않습니다."));
        User author = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("작성자(유저)가 존재하지 않습니다."));

        Comment c = new Comment(req.getContent(), author, post);
        Comment saved = commentRepository.save(c);
        return CommentResponse.from(saved);
    }
}
