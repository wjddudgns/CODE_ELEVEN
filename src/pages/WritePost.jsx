import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePostsStore } from '../store/posts'

export default function WritePost() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { posts, addPost, editPost } = usePostsStore()
  const existing = posts.find(p => p.id === Number(id))

  const [title, setTitle] = useState(existing?.title || '')
  const [content, setContent] = useState(existing?.content || '')
  const [password, setPassword] = useState(existing?.password || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (id) {
      editPost(Number(id), { title, content })
    } else {
      addPost({
        id: Date.now(),
        title,
        content,
        createdAt: new Date().toISOString(),
        password,
      })
    }
    navigate('/')
  }

  return (
    <div className="container">
      <h1>{id ? '글 수정' : '새 글 작성'}</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        {!id && (
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">{id ? '수정 완료' : '작성 완료'}</button>
      </form>
      <button onClick={() => navigate('/')}>← 돌아가기</button>
    </div>
  )
}
