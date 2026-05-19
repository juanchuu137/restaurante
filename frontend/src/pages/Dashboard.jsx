import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si es admin, redirigir al panel de admin
  if (user.rol === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f6' }}>
      <nav className="dashboard-nav">
        <div className="logo">RestauranteApp</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.9rem', color: '#555' }}>
            Hola, <strong>{user.nombre || user.email}</strong>
          </span>
          <button onClick={logout} className="btn btn-outline">Cerrar Sesión</button>
        </div>
      </nav>

      <main style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Dashboard Principal</h2>
        <p className="text-light">¡Bienvenido! Aquí pronto podrás ver el menú y hacer tus pedidos.</p>

        <div style={{
          marginTop: '40px',
          padding: '30px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#aaa', margin: 0 }}>Menú en Construcción... 🚧</h3>
        </div>
      </main>
    </div>
  )
}
