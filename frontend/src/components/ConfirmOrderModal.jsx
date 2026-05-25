import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { buildPedidoObject, guardarPedidoLocal, enviarPedido } from '../services/pedidosService'

export default function ConfirmOrderModal({ onClose, onSuccess }) {
  const { items, totalPrecio, totalCalorias, limpiarCarrito } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConfirmar = async () => {
    setLoading(true)
    setError(null)
    try {
      const pedido = buildPedidoObject(items, user)
      await enviarPedido(pedido)
      guardarPedidoLocal(pedido)
      limpiarCarrito()
      onSuccess(pedido)
    } catch (err) {
      setError(err.message || 'Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        
        {/* Header */}
        <div className="modal-header">
          <h3 id="confirm-modal-title">Confirmar Pedido</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        {/* Pregunta de confirmación */}
        <div className="confirm-modal__question">
          <span className="confirm-modal__icon">🛍️</span>
          <p>¿Estás seguro de que quieres realizar este pedido?</p>
        </div>

        {/* Resumen de ítems */}
        <div className="confirm-modal__items">
          {items.map(({ producto, cantidad }) => (
            <div key={producto.id} className="confirm-item">
              <span className="confirm-item__qty">{cantidad}×</span>
              <span className="confirm-item__nombre">{producto.nombre}</span>
              <span className="confirm-item__subtotal">
                ${(producto.precio * cantidad).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="confirm-modal__totals">
          <div className="confirm-total-row">
            <span>Total kcal</span>
            <span>{Math.round(totalCalorias)} kcal</span>
          </div>
          <div className="confirm-total-row confirm-total-row--destacado">
            <span>Total a pagar</span>
            <span className="confirm-precio-total">${totalPrecio.toFixed(2)}</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Acciones */}
        <div className="modal-actions">
          <button
            id="btn-cancelar-pedido"
            className="btn btn-outline"
            style={{ width: 'auto', padding: '10px 24px' }}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            id="btn-confirmar-pedido"
            className="btn btn-primary"
            style={{ width: 'auto', padding: '10px 28px' }}
            onClick={handleConfirmar}
            disabled={loading}
          >
            {loading ? 'Procesando...' : '✓ Confirmar Pedido'}
          </button>
        </div>
      </div>
    </div>
  )
}
