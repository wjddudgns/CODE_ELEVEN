package com.project.pjt_01.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "post_button_stats",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_post_button",
                columnNames = {"post_id", "button_type"}
        ))
public class PostButtonStat {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Enumerated(EnumType.STRING)
    @Column(name = "button_type", nullable = false, length = 20)
    private ButtonType buttonType;

    // 🆕 글에서 보여줄 실제 버튼 이름 (사용자 입력)
    @Column(name = "button_label", length = 50)
    private String buttonLabel;

    @Column(name = "click_count", nullable = false)
    private int clickCount = 0;

    protected PostButtonStat() {}

    // 🆕 새 생성자: 내부 코드 + 사용자 정의 이름
    public PostButtonStat(Post post, ButtonType buttonType, String buttonLabel) {
        this.post = post;
        this.buttonType = buttonType;
        this.buttonLabel = buttonLabel;
    }

    public Long getId() { return id; }
    public Post getPost() { return post; }
    public ButtonType getButtonType() { return buttonType; }
    public int getClickCount() { return clickCount; }

    public String getButtonLabel() { return buttonLabel; }

    public void changeLabel(String buttonLabel) {
        this.buttonLabel = buttonLabel;
    }

    public void increase() {
        this.clickCount++;
    }
}

