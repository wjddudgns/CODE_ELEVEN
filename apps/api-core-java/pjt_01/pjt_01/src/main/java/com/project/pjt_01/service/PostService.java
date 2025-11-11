package com.project.pjt_01.service;

import com.project.pjt_01.domain.Post;
import com.project.pjt_01.domain.User;
import com.project.pjt_01.dto.post.PostRequest;
import com.project.pjt_01.dto.post.PostResponse;
import com.project.pjt_01.repository.PostRepository;
import com.project.pjt_01.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Autowired
    public PostService(PostRepository postRepository,
                       UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    /** 목록 + 검색 + 페이지네이션 (읽기전용 트랜잭션) */
    @Transactional(readOnly = true)
    public Page<PostResponse> list(String q, Pageable pageable) {
        Page<Post> page;
        if (StringUtils.hasText(q)) {
            page = postRepository
                    .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(q, q, pageable);
        } else {
            page = postRepository.findAll(pageable);
        }
        return page.map(PostResponse::from);
    }

    /** 단건 조회 */
    @Transactional(readOnly = true)
    public PostResponse get(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("게시글이 존재하지 않습니다."));
        return PostResponse.from(post);
    }

    /** 등록 */
    @Transactional
    public PostResponse create(PostRequest req) {
        User author = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("작성자(유저)가 존재하지 않습니다."));
        Post post = new Post(req.getTitle(), req.getContent(), author);
        Post saved = postRepository.save(post);
        return PostResponse.from(saved);
    }

    /** 수정 */
    @Transactional
    public PostResponse update(Long id, PostRequest req) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("게시글이 존재하지 않습니다."));
        post.update(req.getTitle(), req.getContent());
        return PostResponse.from(post);
    }

    /** 삭제 */
    @Transactional
    public void delete(Long id) {
        if (!postRepository.existsById(id)) {
            throw new EntityNotFoundException("삭제 대상 게시글이 존재하지 않습니다.");
        }
        postRepository.deleteById(id);
    }
}
