import { Link } from 'react-router-dom'
import { usePostsStore } from '../store/posts'

export default function PostsList() {
  const { posts } = usePostsStore()

  return (
    <div className="container">
      <h1>익명 게시판</h1>
      <Link to="/write" className="write-btn">✏️ 새 글 작성</Link>
      <ul className="post-list">
        {posts.length === 0 ? (
          <p>아직 글이 없습니다.</p>
        ) : (
          posts
            .slice()
            .reverse()
            .map(p => (
              <li key={p.id} className="post-item">
                <Link to={`/post/${p.id}`} className="title">{p.title}</Link>
                <div className="meta">
                  <span>익명</span> |{' '}
                  <span>{new Date(p.createdAt).toLocaleString()}</span>
                </div>
              </li>
            ))
        )}
      </ul>
    </div>
  )
}
