import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'
import { Navigate } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()

  // if (!user) {
  //   return <Navigate to="/login" replace />
  // }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f6' }}>
      <nav className="dashboard-nav">
        <div className="logo">RestauranteApp</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.9rem', color: '#555' }}>
            Hola, <strong>{user ? (user.user_metadata?.nombre || user.email) : 'Invitado'}</strong>
          </span>
          {user && <button onClick={handleLogout} className="btn btn-outline">Cerrar Sesión</button>}
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
