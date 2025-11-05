import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    setIsLoading(true);
    try {
      // 模拟加载文章数据 - 后续替换为真实API
      const mockPosts = {
        '1': {
          id: 1,
          title: "Getting Started with WriteFlow",
          content: "This is the full content of the post about getting started with WriteFlow...",
          excerpt: "A beginner's guide to using our CMS platform...",
          status: "published",
          author: "Admin",
          updatedAt: new Date().toISOString()
        },
        '2': {
          id: 2,
          title: "Content Strategy Tips",
          content: "Learn how to create effective content strategies for your blog...",
          excerpt: "Learn how to create effective content strategies...",
          status: "draft",
          author: "Admin",
          updatedAt: new Date().toISOString()
        }
      };

      const postData = mockPosts[id] || mockPosts['1'];
      setPost({
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        status: postData.status
      });
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (status) => {
    setIsSaving(true);
    try {
      const postToSave = {
        ...post,
        status,
        id: isEditing ? parseInt(id) : Date.now()
      };

      // 模拟保存 - 后续替换为真实API
      console.log('Saving post:', postToSave);

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 保存成功后返回文章列表
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/posts');
  };

  if (isLoading) {
    return (
      <div className="content-container">
        <div className="loading-posts">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="editor-content">
        <div className="editor-header">
          <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
          <div className="editor-actions">
            <button
              className="btn-secondary"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              className="btn-draft"
              onClick={() => handleSave('draft')}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              className="btn-publish"
              onClick={() => handleSave('published')}
              disabled={isSaving}
            >
              {isSaving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="editor-form">
          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              value={post.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter post title..."
              className="title-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-excerpt">Excerpt</label>
            <textarea
              id="post-excerpt"
              value={post.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Brief description of your post..."
              rows="3"
              className="excerpt-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              value={post.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your post content here..."
              rows="20"
              className="content-textarea"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <div className="status-display">
              <span className={`status-badge ${post.status}`}>
                {post.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
