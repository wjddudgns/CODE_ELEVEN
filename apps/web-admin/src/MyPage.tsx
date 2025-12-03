import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "./store/user";
import { apiGet } from "./lib/api";
import "./MyPage.css";

// 게시글 인터페이스
interface Post {
  id: number;
  content: string;
  emotion: string;
  createdAt: string;
  buttons: Array<{
    buttonType: string;
    label: string;
    clickCount: number;
  }>;
}

// 감정 통계 인터페이스
interface EmotionStats {
  [key: string]: number;
}

// 마이페이지 컴포넌트
export default function MyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [emotionStats, setEmotionStats] = useState<EmotionStats>({});
  const [totalPosts, setTotalPosts] = useState(0);

  // 인증 상태 확인 및 데이터 로드
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    fetchUserData();
  }, [isAuthenticated, user, navigate]);

  // 사용자 데이터 가져오기
  const fetchUserData = async () => {
    try {
      // 개발 환경: 모의 데이터 사용
      if (process.env.NODE_ENV === "development") {
        // 네트워크 지연 모의
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 모의 게시글 데이터
        const mockPosts: Post[] = [
          {
            id: 1,
            content: "오늘은 정말 멋진 날이었어요! 제 인생의 모든 것에 감사하게 느껴졌습니다.",
            emotion: "JOY",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            buttons: [
              { buttonType: "EMPATHY", label: "공감", clickCount: 5 },
              { buttonType: "HAPPY", label: "행복", clickCount: 3 },
            ],
          },
          {
            id: 2,
            content: "다가오는 프로젝트 마감 때문에 조금 불안해요.",
            emotion: "SADNESS",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            buttons: [
              { buttonType: "COMFORT", label: "위로", clickCount: 2 },
              { buttonType: "EMPATHY", label: "공감", clickCount: 4 },
            ],
          },
          {
            id: 3,
            content: "오늘의 일몰은 정말 숨이 멎을 정도로 아름다웠어요!",
            emotion: "LOVE",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            buttons: [
              { buttonType: "GOOD", label: "좋음", clickCount: 6 },
              { buttonType: "HAPPY", label: "행복", clickCount: 2 },
            ],
          },
        ];

        setPosts(mockPosts);
        setTotalPosts(mockPosts.length);

        // 감정 통계 계산
        const stats: EmotionStats = {};
        mockPosts.forEach((post) => {
          const emotion = post.emotion.toLowerCase();
          stats[emotion] = (stats[emotion] || 0) + 1;
        });
        setEmotionStats(stats);

        setLoading(false);
        return;
      }

      // 프로덕션: 실제 API 호출
      const userPosts = await apiGet(`/posts/me?userId=${user?.id}`);
      setPosts(userPosts.items || []);
      setTotalPosts(userPosts.totalElements || 0);

      // 감정 통계 계산
      const stats: EmotionStats = {};
      (userPosts.items || []).forEach((post: Post) => {
        const emotion = post.emotion.toLowerCase();
        stats[emotion] = (stats[emotion] || 0) + 1;
      });
      setEmotionStats(stats);
    } catch (error) {
      console.error("사용자 데이터 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 감정 라벨 매핑
  const emotionLabels: { [key: string]: string } = {
    joy: "😊 기쁨",
    anger: "😠 분노",
    sadness: "😢 슬픔",
    pleasure: "😄 즐거움",
    love: "💕 사랑",
    hate: "💔 미움",
    ambition: "🔥 야망",
  };

  // 날짜 형식화
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 내용 축약
  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h1>나의 대시보드</h1>
        <p>다시 오신 것을 환영합니다, {user?.nickname}님!</p>
      </div>

      {/* 통계 그리드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>총 게시글</h3>
          <p className="stat-value">{totalPosts}</p>
        </div>

        <div className="stat-card">
          <h3>공유한 감정</h3>
          <p className="stat-value">{Object.keys(emotionStats).length}</p>
        </div>

        <div className="stat-card">
          <h3>마지막 활동</h3>
          <p className="stat-value">
            {posts.length > 0 ? formatDate(posts[0].createdAt) : "아직 게시글이 없습니다"}
          </p>
        </div>
      </div>

      {/* 감정 분포 */}
      <div className="emotion-distribution">
        <h2>감정 분포</h2>
        <div className="emotion-tags">
          {Object.entries(emotionStats).map(([emotion, count]) => (
            <div
              key={emotion}
              className="emotion-tag"
            >
              <span className="emotion-tag-icon">
                {emotionLabels[emotion]?.split(" ")[0]}
              </span>
              <span className="emotion-tag-count">{count}</span>
              <span className="emotion-tag-label">
                {emotionLabels[emotion]?.split(" ")[1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 게시글 */}
      <div className="recent-posts-section">
        <div className="section-header">
          <h2>나의 최근 게시글</h2>
          <Link to="/write" className="new-post-button">
            + 새 글 쓰기
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <p>아직 게시글을 작성하지 않으셨습니다.</p>
            <Link to="/write" className="new-post-button">
              글쓰기 시작하기
            </Link>
          </div>
        ) : (
          <div className="posts-list">
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="post-card"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="post-card-header">
                  <span className="emotion-badge">
                    {emotionLabels[post.emotion.toLowerCase()]}
                  </span>
                  <span className="post-date">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <div className="post-content">
                  <p>{truncateContent(post.content)}</p>
                </div>
                <div className="post-stats">
                  {post.buttons.map((button) => (
                    <span
                      key={button.buttonType}
                      className="stat-badge"
                    >
                      {button.label} ({button.clickCount})
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {posts.length > 5 && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  className="auth-button"
                  onClick={() => alert("모든 게시글 보기 기능은 준비 중입니다!")}
                  style={{ maxWidth: "200px" }}
                >
                  모든 게시글 보기 ({posts.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
