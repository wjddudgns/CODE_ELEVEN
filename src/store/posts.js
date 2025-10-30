import { create } from 'zustand'

export const usePostsStore = create((set) => ({
  posts: JSON.parse(localStorage.getItem('posts') || '[]'),
  
  addPost: (post) => set((state) => {
    const updated = [...state.posts, post]
    localStorage.setItem('posts', JSON.stringify(updated))
    return { posts: updated }
  }),

  editPost: (id, newData) => set((state) => {
    const updated = state.posts.map(p => p.id === id ? {...p, ...newData} : p)
    localStorage.setItem('posts', JSON.stringify(updated))
    return { posts: updated }
  }),

  deletePost: (id, password) => set((state) => {
    const target = state.posts.find(p => p.id === id)
    if (!target || target.password !== password) return state
    const updated = state.posts.filter(p => p.id !== id)
    localStorage.setItem('posts', JSON.stringify(updated))
    return { posts: updated }
  }),
}))
