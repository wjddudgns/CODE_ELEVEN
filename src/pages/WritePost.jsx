import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePostsStore } from '../store/posts'

export default function WritePost() {
  const navigate = useNavigate()
  const { id } = useParams()
  const postId = id ? Number(id) : null
  const { posts, addPost, editPost } = usePostsStore()
  const existing = posts.find(p => p.id === postId)

  // 🔒 편집 토큰 or 비밀번호 검증 로직(임시 제거)
  useEffect(() => {
    // 나중에 권한 체크할 수 있음
  }, [postId, navigate])

  // ✅ 여기서부터 글 작성/수정 로직
  const [title, setTitle] = useState(existing?.title || '')
  const [content, setContent] = useState(existing?.content || '')
  const [password, setPassword] = useState(existing?.password || '')
  const [board, setBoard] = useState(existing?.board || '자유')
  const [tags, setTags] = useState(existing?.tags?.join(', ') || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
    if (id) {
      editPost(Number(id), { title, content, board, tags: tagList })
    } else {
      addPost({
        id: Date.now(),
        title,
        content,
        board,
        tags: tagList,
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
        <select value={board} onChange={(e) => setBoard(e.target.value)}>
          <option value="자유">자유게시판</option>
          <option value="유머">유머게시판</option>
          <option value="질문">질문게시판</option>
        </select>

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
        <input
          type="text"
          placeholder="태그 (쉼표로 구분)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
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
