import { Link, useParams, useNavigate } from 'react-router-dom'
import { usePostsStore } from '../store/posts'
import { useState, useEffect } from 'react'

export default function PostsList() {
  const { boardName, tagName } = useParams()
  const { posts } = usePostsStore()
  const navigate = useNavigate()

  const [board, setBoard] = useState(boardName || '전체')
  const [query, setQuery] = useState(tagName ? `#${tagName}` : '')
  const [mode, setMode] = useState(tagName ? 'tag' : 'all')

  useEffect(() => {
    setBoard(boardName || '전체')
    setQuery(tagName ? `#${tagName}` : '')
    setMode(tagName ? 'tag' : 'all')
  }, [boardName, tagName])

  // 검색어에 #이 들어있으면 태그 검색 모드로 전환
  useEffect(() => {
    if (query.startsWith('#')) {
      setMode('tag')
      const t = query.slice(1).trim().toLowerCase()
      navigate(t ? `/tag/${t}` : '/')
    }
  }, [query])

  const filtered = posts.filter((p) => {
    const q = query.replace(/^#/, '').toLowerCase()
    const boardMatch = board === '전체' || p.board === board

    if (mode === 'tag') {
      return boardMatch && (p.tags || []).some(t => t.toLowerCase() === q)
    }

    const match =
      mode === 'title'
        ? p.title.toLowerCase().includes(q)
        : mode === 'content'
        ? p.content.toLowerCase().includes(q)
        : p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
    return boardMatch && match
  })

  const handleBoardChange = (e) => {
    const selected = e.target.value
    setBoard(selected)
    if (selected === '전체') navigate('/')
    else navigate(`/board/${selected}`)
  }

  return (
    <div className="container">
      <h1>익명 게시판</h1>

      {/* 게시판 탭 */}
      <div className="board-tabs">
        {['전체', '자유', '유머', '질문'].map((b) => (
          <button
            key={b}
            className={board === b ? 'tab active' : 'tab'}
            onClick={() => navigate(b === '전체' ? '/' : `/board/${b}`)}
          >
            {b}
          </button>
        ))}
      </div>

      {/* 검색창 */}
      <div className="filter-row">
        <select value={board} onChange={handleBoardChange}>
          <option value="전체">전체 게시판</option>
          <option value="자유">자유게시판</option>
          <option value="유머">유머게시판</option>
          <option value="질문">질문게시판</option>
        </select>

        <input
          type="text"
          placeholder="검색어를 입력하세요 (#태그 검색 가능)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-box"
        />

        <div className="search-mode">
          <button
            className={mode === 'all' ? 'active' : ''}
            onClick={() => setMode('all')}
          >
            전체
          </button>
          <button
            className={mode === 'title' ? 'active' : ''}
            onClick={() => setMode('title')}
          >
            제목
          </button>
          <button
            className={mode === 'content' ? 'active' : ''}
            onClick={() => setMode('content')}
          >
            본문
          </button>
        </div>
      </div>

      <Link to="/write" className="write-btn">✏️ 새 글 작성</Link>

      <ul className="post-list">
        {filtered.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          filtered.slice().reverse().map((p) => (
            <li key={p.id} className="post-item">
              <Link to={`/post/${p.id}`} className="title">{p.title}</Link>
              <div className="meta">
                <Link to={`/board/${p.board}`} className="board-link">{p.board}</Link> | 익명 |{' '}
                <span>{new Date(p.createdAt).toLocaleString()}</span>
              </div>
              {p.tags?.length > 0 && (
                <div className="tags">
                  {p.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/tag/${tag}`}
                      className="tag tag-link"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
