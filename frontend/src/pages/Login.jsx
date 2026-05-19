import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, Navigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    }
    setLoading(false)
  }

  // Si ya está logueado, redirigir según rol
  if (user) {
    if (user.rol === 'ADMIN') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="page-wrapper">
      <div className="glass-container">
        <h2 className="text-center">Bienvenido de Nuevo</h2>
        <p className="text-center text-light mb-6">Inicia sesión en tu cuenta para continuar</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '20px', fontSize: '0.9rem' }}>
          ¿No tienes una cuenta? <Link to="/register" className="link">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}
