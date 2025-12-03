import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "./store/user";
import { apiGet } from "./lib/api";
import "./MyPage.css";

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

interface EmotionStats {
  [key: string]: number;
}

export default function MyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [emotionStats, setEmotionStats] = useState<EmotionStats>({});
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    fetchUserData();
  }, [isAuthenticated, user, navigate]);

  const fetchUserData = async () => {
    try {
      // For development: mock user posts
      // Replace with real API when backend is ready
      if (process.env.NODE_ENV === "development") {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock user posts data
        const mockPosts: Post[] = [
          {
            id: 1,
            content: "Today was a wonderful day! I felt so joyful and grateful for everything in my life.",
            emotion: "JOY",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            buttons: [
              { buttonType: "EMPATHY", label: "공감", clickCount: 5 },
              { buttonType: "HAPPY", label: "행복", clickCount: 3 },
            ],
          },
          {
            id: 2,
            content: "Feeling a bit anxious about the upcoming project deadline.",
            emotion: "SADNESS",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            buttons: [
              { buttonType: "COMFORT", label: "위로", clickCount: 2 },
              { buttonType: "EMPATHY", label: "공감", clickCount: 4 },
            ],
          },
          {
            id: 3,
            content: "The sunset today was absolutely breathtaking!",
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

        // Calculate emotion statistics
        const stats: EmotionStats = {};
        mockPosts.forEach((post) => {
          const emotion = post.emotion.toLowerCase();
          stats[emotion] = (stats[emotion] || 0) + 1;
        });
        setEmotionStats(stats);

        setLoading(false);
        return;
      }

      // Production: real API call
      const userPosts = await apiGet(`/posts/me?userId=${user?.id}`);
      setPosts(userPosts.items || []);
      setTotalPosts(userPosts.totalElements || 0);

      // Calculate emotion statistics
      const stats: EmotionStats = {};
      (userPosts.items || []).forEach((post: Post) => {
        const emotion = post.emotion.toLowerCase();
        stats[emotion] = (stats[emotion] || 0) + 1;
      });
      setEmotionStats(stats);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const emotionLabels: { [key: string]: string } = {
    joy: "😊 기쁨",
    anger: "😠 분노",
    sadness: "😢 슬픔",
    pleasure: "😄 즐거움",
    love: "💕 사랑",
    hate: "💔 미움",
    ambition: "🔥 야망",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

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
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.nickname}!</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p className="stat-value">{totalPosts}</p>
        </div>

        <div className="stat-card">
          <h3>Emotions Shared</h3>
          <p className="stat-value">{Object.keys(emotionStats).length}</p>
        </div>

        <div className="stat-card">
          <h3>Last Active</h3>
          <p className="stat-value">
            {posts.length > 0 ? formatDate(posts[0].createdAt) : "No posts yet"}
          </p>
        </div>
      </div>

      {/* Emotion Distribution */}
      <div className="emotion-distribution">
        <h2>Emotion Distribution</h2>
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

      {/* Recent Posts */}
      <div className="recent-posts-section">
        <div className="section-header">
          <h2>My Recent Posts</h2>
          <Link to="/write" className="new-post-button">
            + Write New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <p>You haven't written any posts yet.</p>
            <Link to="/write" className="new-post-button">
              Start Writing
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
                  onClick={() => alert("View all posts feature coming soon!")}
                  style={{ maxWidth: "200px" }}
                >
                  View All Posts ({posts.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
