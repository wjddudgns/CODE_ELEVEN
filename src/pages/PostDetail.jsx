import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { usePostsStore } from '../store/posts'

export default function PostDetail() {
  const { id } = useParams()
  const { posts, deletePost } = usePostsStore()
  const post = posts.find(p => p.id === Number(id))
  const [pwd, setPwd] = useState('')
  const navigate = useNavigate()

  if (!post) return <p>존재하지 않는 글입니다.</p>

  const handleDelete = () => {
    deletePost(post.id, pwd)
    navigate('/')
  }

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <div className="meta">익명 | {new Date(post.createdAt).toLocaleString()}</div>
      <p className="content">{post.content}</p>

      <div className="actions">
        <Link to={`/edit/${post.id}`}>✏️ 수정</Link>
      </div>

      <div className="delete-box">
        <h4>🗑 글 삭제</h4>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="비밀번호 입력"
        />
        <button onClick={handleDelete}>삭제</button>
      </div>
      <Link to="/">← 목록으로</Link>
    </div>
  )
}
