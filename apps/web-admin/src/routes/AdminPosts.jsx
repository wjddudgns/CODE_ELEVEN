import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const mockPosts = [
        {
          id: 1,
          title: "Getting Started with WriteFlow",
          excerpt: "A beginner's guide to using our CMS platform...",
          status: "published",
          author: "Admin",
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          title: "Content Strategy Tips",
          excerpt: "Learn how to create effective content strategies...",
          status: "draft",
          author: "Admin",
          updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ];
      setPosts(mockPosts);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate('/admin/posts/new');
  };

  const handleEditPost = (postId) => {
    navigate(`/admin/posts/edit/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // 模拟删除 - 后续替换为真实API
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Failed to delete post');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="content-container">
        <div className="loading-posts">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="posts-content">
        <div className="posts-header">
          <h2>Post Management</h2>
          <button
            className="create-post-btn"
            onClick={handleCreatePost}
          >
            + Create New Post
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Author</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="post-title">
                      <strong>{post.title}</strong>
                      <div className="post-excerpt">{post.excerpt}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{post.author}</td>
                  <td>{formatDate(post.updatedAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditPost(post.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-posts">
                    No posts found. Click "Create New Post" to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPosts;
