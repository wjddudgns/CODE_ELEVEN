import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostsList from './pages/PostsList'
import PostDetail from './pages/PostDetail'
import WritePost from './pages/WritePost'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostsList />} />
        <Route path="/board/:boardName" element={<PostsList />} />
        <Route path="/tag/:tagName" element={<PostsList />} /> {/* ✅ 추가 */}
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/write" element={<WritePost />} />
        <Route path="/edit/:id" element={<WritePost />} />
        <Route path="*" element={<p>404 - 페이지를 찾을 수 없습니다.</p>} />
      </Routes>
    </BrowserRouter>
  )
}
