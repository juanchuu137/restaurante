import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { Navigate } from 'react-router-dom'
import ProductoForm from '../components/ProductoForm'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [productos, setProductos] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [selectedImportProduct, setSelectedImportProduct] = useState(null)
  const [importPrice, setImportPrice] = useState('')
  const [importStock, setImportStock] = useState('')
  const [importLoading, setImportLoading] = useState(false)
  const [importError, setImportError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  if (!user) return <Navigate to="/login" replace />
  if (user.rol !== 'ADMIN') return <Navigate to="/dashboard" replace />

  const fetchProductos = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get('/api/admin/productos')
      setProductos(data)
    } catch (err) {
      setError(err.message || 'Error al cargar productos')
    }
    setLoading(false)
  }

  const fetchPendingOrders = async () => {
    try {
      const data = await api.get('/api/admin/pedidos?estado=PENDIENTE')
      setPendingOrders(data)
    } catch (err) {
      console.error('Error al cargar pedidos pendientes:', err)
    }
  }

  const searchOpenFoodFacts = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Ingresa un término de búsqueda')
      return
    }

    setSearchLoading(true)
    setSearchError(null)
    setSearchResults([])
    try {
      const resultados = await api.get(`/api/admin/productos/openfoodfacts/buscar?query=${encodeURIComponent(searchQuery.trim())}`)
      setSearchResults(resultados)
    } catch (err) {
      setSearchError(err.message || 'Error al buscar en OpenFoodFacts')
    }
    setSearchLoading(false)
  }

  const handleSelectImport = async (product) => {
    setImportLoading(true)
    setImportError(null)
    try {
      const detalle = await api.get(`/api/admin/productos/openfoodfacts/${encodeURIComponent(product.code)}`)
      setSelectedImportProduct(detalle)
      setImportPrice('')
      setImportStock('')
    } catch (err) {
      setImportError(err.message || 'Error al obtener detalle del producto')
    }
    setImportLoading(false)
  }

  const handleImportProduct = async () => {
    if (!selectedImportProduct) return
    if (!importPrice || Number(importPrice) <= 0) {
      setImportError('Ingresa un precio válido')
      return
    }
    if (!importStock || Number(importStock) < 0) {
      setImportError('Ingresa un stock válido')
      return
    }

    setImportLoading(true)
    setImportError(null)
    try {
      await api.post('/api/admin/productos/openfoodfacts', {
        code: selectedImportProduct.code,
        nombre: selectedImportProduct.productName,
        precio: Number(importPrice),
        stock: Number(importStock),
      })
      showSuccess('Producto importado desde OpenFoodFacts')
      setSelectedImportProduct(null)
      setSearchResults([])
      setSearchQuery('')
      fetchProductos()
    } catch (err) {
      setImportError(err.message || 'Error al importar el producto')
    }
    setImportLoading(false)
  }

  useEffect(() => {
    fetchProductos()
    fetchPendingOrders()
  }, [])

  const handleUpdateOrderStatus = async (orderId, nuevoEstado) => {
    try {
      await api.patch(`/api/admin/pedidos/${orderId}/estado`, { estado: nuevoEstado })
      showSuccess('Estado del pedido actualizado')
      fetchPendingOrders()
      fetchProductos()
    } catch (err) {
      setError(err.message || 'Error actualizando estado')
    }
  }

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const handleCreate = async (data) => {
    try {
      await api.post('/api/admin/productos', data)
      showSuccess('Producto creado exitosamente')
      setShowForm(false)
      fetchProductos()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdate = async (data) => {
    try {
      await api.put(`/api/admin/productos/${editingProduct.id}`, data)
      showSuccess('Producto actualizado exitosamente')
      setEditingProduct(null)
      fetchProductos()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return
    try {
      await api.delete(`/api/admin/productos/${id}`)
      showSuccess('Producto eliminado exitosamente')
      fetchProductos()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page">
      <nav className="admin-nav">
        <div className="logo">
          <span className="logo-icon">🍽️</span> RestauranteApp
          <span className="admin-badge">ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className="admin-user-info">
            <strong>{user.nombre || user.email}</strong>
          </span>
          <button onClick={logout} className="btn btn-outline" style={{ width: 'auto', padding: '8px 16px' }}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h2 className="admin-title">Gestión de Productos</h2>
            <p className="text-light">Administra los productos, stock e información nutricional del menú.</p>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '12px 24px' }}
            onClick={() => setShowForm(true)}
          >
            + Nuevo Producto
          </button>
        </div>

        <section className="openfoodfacts-search">
          <div className="search-panel">
            <h3>Buscar en OpenFoodFacts</h3>
            <div className="search-row">
              <input
                className="form-input"
                type="text"
                placeholder="Buscar alimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" onClick={searchOpenFoodFacts} disabled={searchLoading}>
                {searchLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            {searchError && <div className="alert alert-error">{searchError}</div>}
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              <h4>Resultados</h4>
              <div className="results-table">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Marca</th>
                      <th>Código</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((product) => (
                      <tr key={product.code}>
                        <td>
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.productName} className="result-thumb" />
                          ) : '—'}
                        </td>
                        <td>{product.productName || product.genericName || 'Sin nombre'}</td>
                        <td>{product.brands || '—'}</td>
                        <td className="result-code">{product.code}</td>
                        <td>
                          <button className="btn btn-primary" style={{ fontWeight: 'bold' }} onClick={() => handleSelectImport(product)}>
                            Importar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {pendingOrders.length > 0 && (
          <div className="alert alert-info admin-pending-orders">
            <strong>Pedidos pendientes: {pendingOrders.length}</strong>
            <span style={{ marginLeft: 12 }}>
              Hay pedidos nuevos que necesitan revisión.
            </span>
            <div className="pending-orders-list">
              <table className="admin-table" style={{ marginTop: 12 }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="product-name">{String(o.id).slice(0, 8)}</td>
                      <td>{new Date(o.fecha).toLocaleString()}</td>
                      <td>
                        {o.items.map((it) => `${it.nombre}×${it.cantidad}`).join(', ')}
                      </td>
                      <td>${o.total?.toFixed(2)}</td>
                      <td>
                        <button className="btn btn-primary" onClick={() => handleUpdateOrderStatus(o.id, 'REALIZADO')}>
                          Marcar Realizado
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">📦</span>
            <h3>No hay productos registrados</h3>
            <p className="text-light">Comienza agregando tu primer producto al menú.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Calorías</th>
                  <th>Proteínas</th>
                  <th>Grasas</th>
                  <th>Carbohidratos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td className="product-name">{p.nombre}</td>
                    <td>${p.precio?.toFixed(2)}</td>
                    <td>
                      <span className={`stock-badge ${p.stock > 0 ? 'stock-available' : 'stock-empty'}`}>
                        {p.stock ?? 0}
                      </span>
                    </td>
                    <td>{p.calorias ?? '—'}</td>
                    <td>{p.proteinas ?? '—'}</td>
                    <td>{p.grasas ?? '—'}</td>
                    <td>{p.carbohidratos ?? '—'}</td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit-btn"
                        title="Editar"
                        onClick={() => setEditingProduct(p)}
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Eliminar"
                        onClick={() => handleDelete(p.id, p.nombre)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showForm && (
        <ProductoForm
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingProduct && (
        <ProductoForm
          producto={editingProduct}
          onSave={handleUpdate}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {selectedImportProduct && (
        <div className="modal-overlay" onClick={() => setSelectedImportProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Importar producto desde OpenFoodFacts</h3>
              <button className="modal-close" onClick={() => setSelectedImportProduct(null)}>&times;</button>
            </div>
            <div className="modal-body">
              {selectedImportProduct.imageUrl && (
                <div className="modal-image">
                  <img src={selectedImportProduct.imageUrl} alt={selectedImportProduct.productName} />
                </div>
              )}
              <p><strong>Nombre:</strong> {selectedImportProduct.productName}</p>
              <p><strong>Marca:</strong> {selectedImportProduct.brands || 'No disponible'}</p>
              <p><strong>Código:</strong> {selectedImportProduct.code}</p>
              <p><strong>Porción:</strong> {selectedImportProduct.servingSize || 'No disponible'}</p>
              <div className="nutrition-grid">
                <div><strong>Calorías:</strong> {selectedImportProduct.calorias ?? '—'}</div>
                <div><strong>Proteínas:</strong> {selectedImportProduct.proteinas ?? '—'}</div>
                <div><strong>Grasas:</strong> {selectedImportProduct.grasas ?? '—'}</div>
                <div><strong>Carbohidratos:</strong> {selectedImportProduct.carbohidratos ?? '—'}</div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    value={importPrice}
                    onChange={(e) => setImportPrice(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={importStock}
                    onChange={(e) => setImportStock(e.target.value)}
                  />
                </div>
              </div>
              {importError && <div className="alert alert-error">{importError}</div>}
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setSelectedImportProduct(null)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleImportProduct} disabled={importLoading}>
                {importLoading ? 'Importando...' : 'Importar producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
