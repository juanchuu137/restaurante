import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

/**
 * Componente wrapper para proteger rutas.
 * - Si no hay usuario, redirige a /login.
 * - Si se especifica requiredRole y el usuario no lo tiene, redirige a /dashboard.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
