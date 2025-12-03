import { BrowserRouter, Routes, Route, useLocation, Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { jwtDecode } from "jwt-decode"
import PostsList from "./PostsList"
import PostDetail from "./PostDetail"
import WritePost from "./WritePost"
import NotFound from "./NotFound"
import ThemeToggle from "./ThemeToggle"
import ScrollToTop from './ScrollToTop'
import 'react-quill/dist/quill.snow.css'
import ReportsList from './ReportsList'
import Login from './Login'
import Signup from './Signup'
import MyPage from './MyPage'
import { useUserStore } from "./store/user"

// Layout 컴포넌트: 모든 페이지에 공통 헤더 제공
function Layout() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useUserStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // 로그아웃 처리
  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate("/")
  }

  return (
    <>
      <header className="app-header">
        <h1 className="site-title">
          <Link to="/">WriteFlow</Link>
        </h1>

        {/* 헤더 오른쪽 영역 */}
        <div className="header-right" ref={menuRef}>
          {/* 로그인된 경우 네비게이션 메뉴 표시 */}
          {isAuthenticated && user && (
            <nav className="main-nav user-nav">
              <Link to="/read" className="nav-link">글 읽기</Link>
              <Link to="/write" className="nav-link">글 쓰기</Link>
              <Link to="/mypage" className="nav-link">내 페이지</Link>
            </nav>
          )}

          {/* 인증 상태에 따른 버튼 표시 */}
          {!isAuthenticated ? (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">로그인</Link>
              <Link to="/signup" className="signup-btn">회원가입</Link>
            </div>
          ) : (
            <div className="user-menu">
              <button onClick={() => setMenuOpen(!menuOpen)} className="mypage-btn">
                {user?.nickname || "마이페이지"} ▼
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <Link to="/mypage" onClick={() => setMenuOpen(false)}>내 정보</Link>
                  <button onClick={handleLogout}>로그아웃</button>
                </div>
              )}
            </div>
          )}

          {/* 테마 토글 버튼 */}
          <ThemeToggle />
        </div>
      </header>

      <main>
        <AppRoutes />
      </main>
    </>
  )
}

// AppRoutes 컴포넌트: 모든 라우트 정의
function AppRoutes() {
  const location = useLocation()
  const { isAuthenticated } = useUserStore()

  return (
    <Routes>
      {/* 기본 라우트 */}
      <Route path="/" element={<PostsList key="home" />} />
      <Route path="/board/:boardName" element={<PostsList key={location.pathname} />} />
      <Route path="/category/:categorySlug" element={<PostsList key={location.pathname} />} />
      <Route path="/tag/:slug" element={<PostsList key={location.pathname} />} />
      <Route path="/author/:id" element={<PostsList key={location.pathname} />} />
      <Route path="/popular" element={<PostsList key="popular" />} />
      <Route path="/read" element={<PostsList key="read" />} />

      {/* 인증 라우트 */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/mypage" element={
        isAuthenticated ? <MyPage /> : <Login />
      } />

      {/* 검색 라우트 */}
      <Route path="/search" element={<PostsList key={`search-${location.search}`} />} />

      {/* 내가 쓴 글 라우트 */}
      <Route path="/my-posts" element={<PostsList key="my-posts" />} />

      {/* 상세 / 작성 / 수정 라우트 */}
      <Route path="/post/:id/:slug?" element={<PostDetail />} />
      <Route path="/write" element={
        isAuthenticated ? <WritePost /> : <Login />
      } />
      <Route path="/edit/:id" element={
        isAuthenticated ? <WritePost /> : <Login />
      } />

      {/* 관리자 라우트 */}
      <Route path="/reports" element={<ReportsList />} />

      {/* 404 라우트 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

// 메인 App 컴포넌트
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  )
}
