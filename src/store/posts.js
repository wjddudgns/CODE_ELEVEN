import { create } from 'zustand'

const persist = (posts) => localStorage.setItem('posts', JSON.stringify(posts))
const getInitial = () => JSON.parse(localStorage.getItem('posts') || '[]')

// id별 편집 허용 토큰(비밀번호 검증 성공 시 true로 표기)
const EDIT_TOKENS_KEY = 'editTokens'
const getTokens = () => JSON.parse(localStorage.getItem(EDIT_TOKENS_KEY) || '{}')
const setTokens = (t) => localStorage.setItem(EDIT_TOKENS_KEY, JSON.stringify(t))

export const usePostsStore = create((set, get) => ({
  posts: getInitial(),

  addPost: (post) => set((state) => {
    const updated = [
      ...state.posts,
      { ...post, comments: post.comments ?? [], likes: 0 } // ✅
    ]
    persist(updated)
    return { posts: updated }
  }),

  editPost: (id, newData) => set((state) => {
    const updated = state.posts.map(p => p.id === id ? { ...p, ...newData } : p)
    persist(updated)
    return { posts: updated }
  }),

  deletePost: (id, password) => set((state) => {
    const target = state.posts.find(p => p.id === id)
    if (!target || target.password !== password) return state
    const updated = state.posts.filter(p => p.id !== id)
    persist(updated)
    const tokens = getTokens(); delete tokens[id]; setTokens(tokens)
    return { posts: updated }
  }),

  // ✅ 추가된 부분
  likePost: (postId) => set((state) => {
    const updated = state.posts.map(p =>
      p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
    )
    persist(updated)
    return { posts: updated }
  }),

  // 🔹 댓글
  addComment: (postId, { author, password, text }) => set((state) => {
    const updated = state.posts.map(p =>
      p.id === postId
        ? {
            ...p,
            comments: [
              ...(p.comments || []),
              {
                id: Date.now(),
                author: author || '익명',
                password,
                text,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : p
    )
    persist(updated)
    return { posts: updated }
  }),

  deleteComment: (postId, commentId, password) => set((state) => {
    const updated = state.posts.map(p => {
      if (p.id !== postId) return p
      const comments = (p.comments || []).filter(c => {
        if (c.id === commentId) {
          if (!password || c.password !== password) return true
          return false
        }
        return true
      })
      return { ...p, comments }
    })
    persist(updated)
    return { posts: updated }
  }),

  // 🔹 편집 권한 토큰 관련 (기존 그대로)
  canEdit: (postId) => !!getTokens()[postId],
  verifyPasswordAndGrantEdit: (postId, password) => {
    const post = get().posts.find(p => p.id === postId)
    if (!post) return false
    const ok = post.password === password
    if (ok) {
      const tokens = getTokens()
      tokens[postId] = true
      setTokens(tokens)
    }
    return ok
  },
  revokeEdit: (postId) => {
    const tokens = getTokens(); delete tokens[postId]; setTokens(tokens)
  }
}))
