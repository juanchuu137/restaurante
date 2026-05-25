import { useCart } from '../context/CartContext'

export default function OrderPanel({ onRealizarPedido }) {
  const {
    items,
    quitarItem,
    agregarItem,
    eliminarItem,
    totalPrecio,
    totalCalorias,
    totalProteinas,
    totalGrasas,
    totalCarbohidratos,
    totalItems,
  } = useCart()

  const carritoVacio = items.length === 0

  return (
    <aside className="order-panel" id="order-panel">
      <div className="order-panel__header">
        <h3 className="order-panel__title">
          🛒 Mi Pedido
          {totalItems > 0 && (
            <span className="order-panel__count">{totalItems}</span>
          )}
        </h3>
      </div>

      <div className="order-panel__body">
        {carritoVacio ? (
          <div className="order-panel__empty">
            <span className="order-panel__empty-icon">🛍️</span>
            <p>Tu pedido está vacío</p>
            <p className="order-panel__empty-sub">Agrega productos del menú</p>
          </div>
        ) : (
          <>
            {/* Lista de ítems */}
            <ul className="order-items">
              {items.map(({ producto, cantidad }) => (
                <li key={producto.id} className="order-item">
                  <div className="order-item__info">
                    <span className="order-item__nombre">{producto.nombre}</span>
                    <span className="order-item__precio-unit">
                      ${producto.precio?.toFixed(2)} c/u
                    </span>
                  </div>
                  <div className="order-item__right">
                    <div className="order-item__qty-ctrl">
                      <button
                        className="qty-btn qty-btn--minus qty-btn--sm"
                        onClick={() => eliminarItem(producto.id)}
                        aria-label="Reducir"
                      >−</button>
                      <span className="qty-display qty-display--sm">{cantidad}</span>
                      <button
                        className="qty-btn qty-btn--plus qty-btn--sm"
                        onClick={() => agregarItem(producto)}
                        aria-label="Aumentar"
                      >+</button>
                    </div>
                    <span className="order-item__subtotal">
                      ${(producto.precio * cantidad).toFixed(2)}
                    </span>
                    <button
                      className="order-item__remove"
                      onClick={() => quitarItem(producto.id)}
                      title="Quitar del pedido"
                      aria-label={`Quitar ${producto.nombre}`}
                    >✕</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Resumen nutricional */}
            <div className="order-macros">
              <p className="order-macros__title">Info nutricional total</p>
              <div className="order-macros__grid">
                <div className="order-macro-item">
                  <span className="order-macro-item__val">{Math.round(totalCalorias)}</span>
                  <span className="order-macro-item__label">kcal</span>
                </div>
                <div className="order-macro-item">
                  <span className="order-macro-item__val">{totalProteinas.toFixed(1)}g</span>
                  <span className="order-macro-item__label">prot</span>
                </div>
                <div className="order-macro-item">
                  <span className="order-macro-item__val">{totalGrasas.toFixed(1)}g</span>
                  <span className="order-macro-item__label">grasas</span>
                </div>
                <div className="order-macro-item">
                  <span className="order-macro-item__val">{totalCarbohidratos.toFixed(1)}g</span>
                  <span className="order-macro-item__label">carbs</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer con total y botón */}
      <div className="order-panel__footer">
        <div className="order-total">
          <span className="order-total__label">Total</span>
          <span className="order-total__value">${totalPrecio.toFixed(2)}</span>
        </div>
        <button
          id="btn-realizar-pedido"
          className="btn btn-primary btn-realizar-pedido"
          disabled={carritoVacio}
          onClick={onRealizarPedido}
        >
          {carritoVacio ? 'Agrega productos' : 'Realizar Pedido →'}
        </button>
      </div>
    </aside>
  )
}
