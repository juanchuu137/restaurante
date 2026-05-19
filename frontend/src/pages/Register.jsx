import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, Navigate } from 'react-router-dom'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [peso, setPeso] = useState('')
  const [estatura, setEstatura] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, registro } = useAuth()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await registro({
        nombre,
        email,
        password,
        peso: peso ? parseFloat(peso) : null,
        estatura: estatura ? parseFloat(estatura) : null,
      })
    } catch (err) {
      setError(err.message || 'Error al registrar la cuenta')
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
        <h2 className="text-center">Crear Cuenta</h2>
        <p className="text-center text-light mb-6">Regístrate para comenzar a ordenar</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              required
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Peso (kg) <span className="text-light">(Opcional)</span></label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="75.0"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Estatura (m) <span className="text-light">(Opcional)</span></label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={estatura}
                onChange={(e) => setEstatura(e.target.value)}
                placeholder="1.75"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '20px', fontSize: '0.9rem' }}>
          ¿Ya tienes una cuenta? <Link to="/login" className="link">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  )
}
