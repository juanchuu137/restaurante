import { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext({})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]) // [{ producto, cantidad }]

  /**
   * Agrega un producto al carrito o incrementa su cantidad.
   */
  const agregarItem = (producto) => {
    setItems((prev) => {
      const stockDisponible = producto.stock ?? 0
      const existe = prev.find((i) => i.producto.id === producto.id)
      if (existe) {
        if (existe.cantidad >= stockDisponible) {
          return prev
        }
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      }
      if (stockDisponible <= 0) {
        return prev
      }
      return [...prev, { producto, cantidad: 1 }]
    })
  }

  /**
   * Reduce la cantidad de un producto o lo elimina si llega a 0.
   */
  const eliminarItem = (productoId) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.producto.id === productoId)
      if (!existe) return prev
      if (existe.cantidad <= 1) {
        return prev.filter((i) => i.producto.id !== productoId)
      }
      return prev.map((i) =>
        i.producto.id === productoId
          ? { ...i, cantidad: i.cantidad - 1 }
          : i
      )
    })
  }

  /**
   * Elimina completamente un producto del carrito.
   */
  const quitarItem = (productoId) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId))
  }

  /**
   * Vacía el carrito por completo.
   */
  const limpiarCarrito = () => setItems([])

  /**
   * Calcula la cantidad en carrito de un producto específico.
   */
  const cantidadEnCarrito = (productoId) => {
    const item = items.find((i) => i.producto.id === productoId)
    return item ? item.cantidad : 0
  }

  // Totales calculados con useMemo para eficiencia
  const totales = useMemo(() => {
    return items.reduce(
      (acc, { producto, cantidad }) => ({
        precio: acc.precio + (producto.precio ?? 0) * cantidad,
        calorias: acc.calorias + (producto.calorias ?? 0) * cantidad,
        proteinas: acc.proteinas + (producto.proteinas ?? 0) * cantidad,
        grasas: acc.grasas + (producto.grasas ?? 0) * cantidad,
        carbohidratos: acc.carbohidratos + (producto.carbohidratos ?? 0) * cantidad,
      }),
      { precio: 0, calorias: 0, proteinas: 0, grasas: 0, carbohidratos: 0 }
    )
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        agregarItem,
        eliminarItem,
        quitarItem,
        limpiarCarrito,
        cantidadEnCarrito,
        totalPrecio: totales.precio,
        totalCalorias: totales.calorias,
        totalProteinas: totales.proteinas,
        totalGrasas: totales.grasas,
        totalCarbohidratos: totales.carbohidratos,
        totalItems: items.reduce((a, i) => a + i.cantidad, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
