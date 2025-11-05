import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './guards/ProtectedRoute';
import AdminLayout from './routes/AdminLayout';
import AdminLogin from './routes/AdminLogin';
import AdminDashboard from './routes/AdminDashboard';
import AdminPosts from './routes/AdminPosts';
import PostEditor from './routes/PostEditor';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/posts" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminPosts />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* 新增编辑器路由 */}
        <Route path="/admin/posts/new" element={
          <ProtectedRoute>
            <AdminLayout>
              <PostEditor />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/posts/edit/:id" element={
          <ProtectedRoute>
            <AdminLayout>
              <PostEditor />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
