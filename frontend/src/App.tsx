import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Review from './pages/Review'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#1E1E1E',
    }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        border: '2px solid #569CD6', borderTopColor: 'transparent',
        animation: 'spin 0.6s linear infinite',
      }} />
    </div>
  )
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/reviews/new" element={<ProtectedRoute><Review key="new" /></ProtectedRoute>} />
      <Route path="/reviews/:id" element={<ProtectedRoute><Review key={location.pathname} /></ProtectedRoute>} />
    </Routes>
  )
}


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#2D2D2D',
              color: '#D4D4D4',
              border: '1px solid #3C3C3C',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            },
          }}
        />
          <AppRoutes />
          {/* <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/reviews/new" element={<ProtectedRoute><Review key="new" /></ProtectedRoute>} />
          <Route path="/reviews/:id" element={<ProtectedRoute><Review /></ProtectedRoute>} /> */}
      </BrowserRouter>
    </AuthProvider>
  )
}