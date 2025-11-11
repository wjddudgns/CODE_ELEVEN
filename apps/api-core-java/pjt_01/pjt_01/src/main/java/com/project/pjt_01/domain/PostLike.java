package com.project.pjt_01.domain;

import jakarta.persistence.*;

@Entity
@Table(
        name = "post_likes",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_like_post_user", columnNames = {"post_id","user_id"})
        },
        indexes = {
                @Index(name = "idx_like_post", columnList = "post_id"),
                @Index(name = "idx_like_user", columnList = "user_id")
        }
)
public class PostLike extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private User user;

    protected PostLike() {}

    public PostLike(Post post, User user) {
        this.post = post;
        this.user = user;
    }

    // getter
    public Long getId() { return id; }
    public Post getPost() { return post; }
    public User getUser() { return user; }
}
