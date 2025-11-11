package com.project.pjt_01.domain;

import jakarta.persistence.*;

@Entity
@Table(
        name = "posts",
        indexes = {
                @Index(name = "idx_posts_created", columnList = "createdAt"),
                @Index(name = "idx_posts_title",   columnList = "title")
        }
)
public class Post extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    protected Post() {}

    public Post(String title, String content, User author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }

    // 비즈니스 메서드(수정용)
    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    // getter/setter
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
}
