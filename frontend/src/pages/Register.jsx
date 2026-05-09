import { useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Link, Navigate } from 'react-router-dom'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Pasamos el "nombre" dentro de los metadatos de supabase (options.data)
    // Así el Trigger de la base de datos podrá leerlo y guardarlo en la tabla 'cliente'.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: nombre
        }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  // if (user) {
  //   return <Navigate to="/dashboard" replace />
  // }

  return (
    <div className="page-wrapper">
      <div className="glass-container">
        <h2 className="text-center">Crear una Cuenta</h2>
        <p className="text-center text-light mb-6">Únete a nuestro restaurante para hacer pedidos</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            ¡Registro exitoso! Ya puedes iniciar sesión.
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
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
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '20px', fontSize: '0.9rem' }}>
          ¿Ya tienes una cuenta? <Link to="/login" className="link">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  )
}
