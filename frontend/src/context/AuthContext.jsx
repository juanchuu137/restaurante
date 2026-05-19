import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Al cargar la app, recuperar datos de localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')
    const nombre = localStorage.getItem('nombre')
    const email = localStorage.getItem('email')

    if (token && rol) {
      setUser({ token, rol, nombre, email })
    }
    setLoading(false)
  }, [])

  /**
   * Inicia sesión con email y contraseña.
   * Retorna { token, rol, nombre }.
   */
  const login = async (email, password) => {
    const data = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('rol', data.rol)
    localStorage.setItem('nombre', data.nombre || '')
    localStorage.setItem('email', email)
    setUser({ token: data.token, rol: data.rol, nombre: data.nombre || '', email })
    return data
  }

  /**
   * Registra un nuevo usuario (cliente).
   * Retorna { token, rol, nombre }.
   */
  const registro = async ({ nombre, email, password, peso, estatura }) => {
    const data = await api.post('/api/auth/registro', { nombre, email, password, peso, estatura })
    localStorage.setItem('token', data.token)
    localStorage.setItem('rol', data.rol)
    localStorage.setItem('nombre', data.nombre || '')
    localStorage.setItem('email', email)
    setUser({ token: data.token, rol: data.rol, nombre: data.nombre || '', email })
    return data
  }

  /**
   * Cierra la sesión del usuario.
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('nombre')
    localStorage.removeItem('email')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, registro, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
