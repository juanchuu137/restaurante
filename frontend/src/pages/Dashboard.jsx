import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { api } from '../services/api'
import ProductoCard from '../components/ProductoCard'
import OrderPanel from '../components/OrderPanel'
import ConfirmOrderModal from '../components/ConfirmOrderModal'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pedidoExitoso, setPedidoExitoso] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  if (!user) return <Navigate to="/login" replace />
  if (user.rol === 'ADMIN') return <Navigate to="/admin" replace />

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.get('/api/productos')
        setProductos(data)
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los productos')
      } finally {
        setLoading(false)
      }
    }
    cargarProductos()
  }, [])

  const productosFiltrados = productos.filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handlePedidoExitoso = (pedido) => {
    setShowConfirm(false)
    setPedidoExitoso(pedido)
    setTimeout(() => setPedidoExitoso(null), 5000)
  }

  return (
    <div className="client-page">
      {/* Navbar */}
      <nav className="client-nav">
        <div className="logo">
          <span className="logo-icon">🍽️</span> RestauranteApp
        </div>
        <div className="client-nav__right">
          <span className="client-nav__welcome">
            Hola, <strong>{user.nombre || user.email}</strong>
          </span>
          <button onClick={logout} className="btn btn-outline" id="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Notificación de éxito */}
      {pedidoExitoso && (
        <div className="pedido-success-banner">
          ✅ ¡Pedido realizado con éxito! Tu pedido ha sido registrado.
        </div>
      )}

      {/* Layout principal */}
      <div className="client-layout">
        {/* Zona izquierda — Catálogo */}
        <main className="client-catalog">
          <div className="catalog-header">
            <div>
              <h2 className="catalog-title">Menú del Día</h2>
              <p className="catalog-subtitle text-light">
                Selecciona los productos que deseas pedir
              </p>
            </div>
            {/* Buscador */}
            <input
              id="buscar-producto"
              type="text"
              className="catalog-search"
              placeholder="🔍 Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {loading && (
            <div className="catalog-loading">
              <div className="spinner spinner--dark" />
              <p>Cargando menú...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {!loading && !error && productosFiltrados.length === 0 && (
            <div className="catalog-empty">
              <span>🍽️</span>
              <p>{busqueda ? 'No hay productos que coincidan con tu búsqueda.' : 'No hay productos disponibles en este momento.'}</p>
            </div>
          )}

          {!loading && !error && productosFiltrados.length > 0 && (
            <div className="productos-grid">
              {productosFiltrados.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </main>

        {/* Zona derecha — Panel de pedido */}
        <OrderPanel onRealizarPedido={() => setShowConfirm(true)} />
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <ConfirmOrderModal
          onClose={() => setShowConfirm(false)}
          onSuccess={handlePedidoExitoso}
        />
      )}
    </div>
  )
}
