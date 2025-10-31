import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { usePostsStore } from '../store/posts'

export default function PostDetail() {
  const { id } = useParams()
  const postId = Number(id)
  const { posts, deletePost, addComment, deleteComment } = usePostsStore()
  const post = posts.find(p => p.id === postId)
  const navigate = useNavigate()
  // ✅ 추천 기능 상태 관리
  const { likePost } = usePostsStore()
  const [liked, setLiked] = useState(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    return likedPosts.includes(postId)
  })

  const handleLike = () => {
    if (liked) return
    likePost(postId)
    setLiked(true)
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    likedPosts.push(postId)
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
  }


  const [deletePwd, setDeletePwd] = useState('')
  const [editPwd, setEditPwd] = useState('')
  const [comment, setComment] = useState('')
  const [nickname, setNickname] = useState('')
  const [commentPwd, setCommentPwd] = useState('')
  const [showEditPrompt, setShowEditPrompt] = useState(false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [editError, setEditError] = useState('')

  if (!post) return <p>존재하지 않는 글입니다.</p>

  // 수정 시 비밀번호 확인
  const handleEditConfirm = () => {
    if (editPwd === post.password) {
      navigate(`/edit/${postId}`)
    } else {
      setEditError('비밀번호가 올바르지 않습니다.')
    }
  }

  // 삭제 시 비밀번호 확인
  const handleDeleteConfirm = () => {
    deletePost(postId, deletePwd)
    navigate('/')
  }

  // 댓글 등록
  const handleAddComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    addComment(postId, {
      author: nickname || '익명',
      password: commentPwd,
      text: comment.trim(),
    })
    setComment('')
    setNickname('')
    setCommentPwd('')
  }

  // 댓글 삭제 확인
  const [commentDeleteId, setCommentDeleteId] = useState(null)
  const [commentDeletePwd, setCommentDeletePwd] = useState('')

  const handleCommentDelete = (id) => {
    deleteComment(postId, id, commentDeletePwd)
    setCommentDeleteId(null)
    setCommentDeletePwd('')
  }

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <div className="meta">익명 | {new Date(post.createdAt).toLocaleString()}</div>
      <p className="content">{post.content}</p>
{/* ✅ 추천 버튼 */}
<div className="like-section">
  <button
    className={`like-btn ${liked ? 'liked' : ''}`}
    onClick={handleLike}
    disabled={liked}
  >
    {liked ? '👍 추천됨' : '👍 추천하기'}
  </button>
  <span className="like-count">추천 수: {post.likes || 0}</span>
</div>


      {/* 수정/삭제 버튼 */}
      <div className="post-actions">
        <button onClick={() => setShowEditPrompt(!showEditPrompt)}>✏️ 수정</button>
        <button onClick={() => setShowDeletePrompt(!showDeletePrompt)}>🗑 삭제</button>
      </div>

      {/* 수정 비밀번호 입력 */}
      {showEditPrompt && (
        <div className="popup-box">
          <h4>글 수정 비밀번호 확인</h4>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={editPwd}
            onChange={(e) => setEditPwd(e.target.value)}
          />
          <button onClick={handleEditConfirm}>확인</button>
          {editError && <p className="error">{editError}</p>}
        </div>
      )}

      {/* 삭제 비밀번호 입력 */}
      {showDeletePrompt && (
        <div className="popup-box">
          <h4>글 삭제 비밀번호 확인</h4>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={deletePwd}
            onChange={(e) => setDeletePwd(e.target.value)}
          />
          <button onClick={handleDeleteConfirm}>삭제</button>
        </div>
      )}

      {/* 댓글 섹션 */}
      <div className="comments">
        <h3>댓글</h3>
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            placeholder="닉네임 (선택)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호 (삭제용)"
            value={commentPwd}
            onChange={(e) => setCommentPwd(e.target.value)}
          />
          <input
            type="text"
            placeholder="댓글을 입력하세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">등록</button>
        </form>

        <ul className="comment-list">
          {(post.comments || []).slice().reverse().map((c) => (
            <li key={c.id} className="comment-item">
              <div className="c-head">
                <strong>{c.author}</strong>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
                <button onClick={() => setCommentDeleteId(c.id)}>삭제</button>
              </div>
              <div className="c-body">{c.text}</div>

              {/* 댓글 삭제 입력창 */}
              {commentDeleteId === c.id && (
                <div className="popup-box">
                  <input
                    type="password"
                    placeholder="댓글 비밀번호 입력"
                    value={commentDeletePwd}
                    onChange={(e) => setCommentDeletePwd(e.target.value)}
                  />
                  <button onClick={() => handleCommentDelete(c.id)}>삭제 확인</button>
                </div>
              )}
            </li>
          ))}
          {(!post.comments || post.comments.length === 0) && <p>첫 댓글을 남겨보세요.</p>}
        </ul>
      </div>

      <Link to="/">← 목록으로</Link>
    </div>
  )
}
