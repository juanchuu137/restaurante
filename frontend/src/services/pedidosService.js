import { api } from './api'

/**
 * Construye el objeto de pedido listo para enviar al backend.
 * @param {Array} items - Array de { producto, cantidad }
 * @param {Object} user  - Objeto del usuario autenticado { email, nombre }
 * @returns {Object} Pedido estructurado
 */
export function buildPedidoObject(items, user) {
  const pedidoItems = items.map(({ producto, cantidad }) => ({
    productoId: producto.id,
    nombre: producto.nombre,
    cantidad,
    precioUnitario: producto.precio ?? 0,
    subtotal: (producto.precio ?? 0) * cantidad,
    caloriasSubtotal: (producto.calorias ?? 0) * cantidad,
    proteinasSubtotal: (producto.proteinas ?? 0) * cantidad,
    grasasSubtotal: (producto.grasas ?? 0) * cantidad,
    carbohidratosSubtotal: (producto.carbohidratos ?? 0) * cantidad,
  }))

  const totalPrecio = pedidoItems.reduce((acc, i) => acc + i.subtotal, 0)
  const totalCalorias = pedidoItems.reduce((acc, i) => acc + i.caloriasSubtotal, 0)
  const totalProteinas = pedidoItems.reduce((acc, i) => acc + i.proteinasSubtotal, 0)
  const totalGrasas = pedidoItems.reduce((acc, i) => acc + i.grasasSubtotal, 0)
  const totalCarbohidratos = pedidoItems.reduce((acc, i) => acc + i.carbohidratosSubtotal, 0)

  return {
    clienteEmail: user?.email ?? '',
    clienteNombre: user?.nombre ?? '',
    fecha: new Date().toISOString(),
    estado: 'PENDIENTE',
    items: pedidoItems,
    totalPrecio,
    totalCalorias,
    totalProteinas,
    totalGrasas,
    totalCarbohidratos,
  }
}

/**
 * Guarda el pedido en localStorage para uso futuro / historial local.
 * @param {Object} pedido
 */
export function guardarPedidoLocal(pedido) {
  try {
    const historial = JSON.parse(localStorage.getItem('historialPedidos') ?? '[]')
    historial.unshift(pedido) // más reciente primero
    localStorage.setItem('historialPedidos', JSON.stringify(historial))
    localStorage.setItem('ultimoPedido', JSON.stringify(pedido))
  } catch (e) {
    console.error('Error guardando pedido local:', e)
  }
}

/**
 * Envía el pedido al backend.
 * @param {Object} pedido
 * @returns {Promise}
 */
export async function enviarPedido(pedido) {
  const payload = {
    items: pedido.items.map((item) => ({
      productoId: item.productoId,
      cantidad: item.cantidad,
    })),
  }

  return await api.post('/api/pedidos', payload)
}
