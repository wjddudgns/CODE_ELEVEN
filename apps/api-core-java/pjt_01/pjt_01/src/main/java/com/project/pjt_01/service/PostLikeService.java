package com.project.pjt_01.service;

import com.project.pjt_01.domain.Post;
import com.project.pjt_01.domain.PostLike;
import com.project.pjt_01.domain.User;
import com.project.pjt_01.dto.like.LikeResponse;
import com.project.pjt_01.repository.PostLikeRepository;
import com.project.pjt_01.repository.PostRepository;
import com.project.pjt_01.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostLikeService {

    private final PostLikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Autowired
    public PostLikeService(PostLikeRepository likeRepository,
                           PostRepository postRepository,
                           UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    /** 좋아요 토글: 있으면 삭제, 없으면 생성 */
    @Transactional
    public LikeResponse toggle(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글이 존재하지 않습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("유저가 존재하지 않습니다."));

        return likeRepository.findByPostIdAndUserId(postId, userId)
                .map(exist -> {
                    likeRepository.delete(exist);
                    return new LikeResponse(false, postId, userId); // 취소됨
                })
                .orElseGet(() -> {
                    likeRepository.save(new PostLike(post, user));
                    return new LikeResponse(true, postId, userId);  // 좋아요됨
                });
    }
}
