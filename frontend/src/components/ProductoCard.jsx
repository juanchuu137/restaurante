import { useCart } from '../context/CartContext'

export default function ProductoCard({ producto }) {
  const { agregarItem, eliminarItem, cantidadEnCarrito } = useCart()
  const cantidad = cantidadEnCarrito(producto.id)
  const stockDisponible = producto.stock ?? 0
  const sinStock = stockDisponible <= 0
  const maxReached = cantidad > 0 && cantidad >= stockDisponible

  return (
    <div className={`producto-card ${sinStock ? 'producto-card--agotado' : ''}`}>
      {cantidad > 0 && (
        <span className="producto-card__badge">{cantidad}</span>
      )}

      <div className="producto-card__header">
        <div className="producto-card__emoji">
          {getEmoji(producto.nombre)}
        </div>
        <div className="producto-card__info">
          <h3 className="producto-card__nombre">{producto.nombre}</h3>
          <span className={`producto-card__stock ${sinStock ? 'stock-empty' : 'stock-available'}`}>
            {sinStock ? 'Agotado' : `${producto.stock} disponibles`}
          </span>
        </div>
      </div>

      <div className="producto-card__precio">
        ${producto.precio?.toFixed(2)}
      </div>

      {/* Info nutricional */}
      <div className="producto-card__macros">
        {producto.calorias != null && (
          <div className="macro-chip macro-chip--cal">
            <span className="macro-chip__value">{producto.calorias}</span>
            <span className="macro-chip__label">kcal</span>
          </div>
        )}
        {producto.proteinas != null && (
          <div className="macro-chip macro-chip--prot">
            <span className="macro-chip__value">{producto.proteinas}g</span>
            <span className="macro-chip__label">prot</span>
          </div>
        )}
        {producto.grasas != null && (
          <div className="macro-chip macro-chip--gras">
            <span className="macro-chip__value">{producto.grasas}g</span>
            <span className="macro-chip__label">grasas</span>
          </div>
        )}
        {producto.carbohidratos != null && (
          <div className="macro-chip macro-chip--carb">
            <span className="macro-chip__value">{producto.carbohidratos}g</span>
            <span className="macro-chip__label">carbs</span>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="producto-card__controls">
        {cantidad === 0 ? (
          <button
            className="btn-agregar"
            onClick={() => agregarItem(producto)}
            disabled={sinStock}
            id={`agregar-${producto.id}`}
          >
            + Agregar al pedido
          </button>
        ) : (
          <div className="quantity-control">
            <button
              className="qty-btn qty-btn--minus"
              onClick={() => eliminarItem(producto.id)}
              id={`reducir-${producto.id}`}
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span className="qty-display">{cantidad}</span>
            <button
              className="qty-btn qty-btn--plus"
              onClick={() => agregarItem(producto)}
              disabled={sinStock || maxReached}
              id={`aumentar-${producto.id}`}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        )}
        {maxReached && (
          <div className="producto-card__stock-limit">
            Has alcanzado el máximo stock disponible
          </div>
        )}
      </div>
    </div>
  )
}

/** Asigna un emoji temático según el nombre del producto */
function getEmoji(nombre = '') {
  const n = nombre.toLowerCase()
  if (n.includes('burger') || n.includes('hambur')) return '🍔'
  if (n.includes('pizza')) return '🍕'
  if (n.includes('pasta') || n.includes('espagueti')) return '🍝'
  if (n.includes('ensalada') || n.includes('salad')) return '🥗'
  if (n.includes('pollo') || n.includes('chicken')) return '🍗'
  if (n.includes('carne') || n.includes('steak')) return '🥩'
  if (n.includes('sopa') || n.includes('soup')) return '🍲'
  if (n.includes('sandwich') || n.includes('sándwich')) return '🥪'
  if (n.includes('taco')) return '🌮'
  if (n.includes('arroz')) return '🍚'
  if (n.includes('jugo') || n.includes('bebida') || n.includes('agua')) return '🥤'
  if (n.includes('cafe') || n.includes('café')) return '☕'
  if (n.includes('postre') || n.includes('torta') || n.includes('helado')) return '🍰'
  if (n.includes('fruta')) return '🍎'
  if (n.includes('wrap')) return '🌯'
  return '🍽️'
}
