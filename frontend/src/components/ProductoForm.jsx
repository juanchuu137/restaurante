import { useState } from 'react'

export default function ProductoForm({ producto, onSave, onCancel }) {
  const [form, setForm] = useState({
    nombre: producto?.nombre || '',
    precio: producto?.precio || '',
    stock: producto?.stock ?? '',
    calorias: producto?.calorias || '',
    proteinas: producto?.proteinas || '',
    grasas: producto?.grasas || '',
    carbohidratos: producto?.carbohidratos || '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        nombre: form.nombre,
        precio: parseFloat(form.precio) || 0,
        stock: parseInt(form.stock) || 0,
        calorias: form.calorias ? parseFloat(form.calorias) : null,
        proteinas: form.proteinas ? parseFloat(form.proteinas) : null,
        grasas: form.grasas ? parseFloat(form.grasas) : null,
        carbohidratos: form.carbohidratos ? parseFloat(form.carbohidratos) : null,
      })
    } catch {
      // error is handled by parent
    }
    setLoading(false)
  }

  const isEditing = !!producto

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre del producto</label>
            <input
              type="text"
              name="nombre"
              className="form-input"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Hamburguesa clásica"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Precio ($)</label>
              <input
                type="number"
                name="precio"
                step="0.01"
                min="0"
                className="form-input"
                value={form.precio}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                className="form-input"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-section-title">Información Nutricional</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Calorías (kcal)</label>
              <input
                type="number"
                name="calorias"
                step="0.1"
                min="0"
                className="form-input"
                value={form.calorias}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Proteínas (g)</label>
              <input
                type="number"
                name="proteinas"
                step="0.1"
                min="0"
                className="form-input"
                value={form.proteinas}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Grasas (g)</label>
              <input
                type="number"
                name="grasas"
                step="0.1"
                min="0"
                className="form-input"
                value={form.grasas}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Carbohidratos (g)</label>
              <input
                type="number"
                name="carbohidratos"
                step="0.1"
                min="0"
                className="form-input"
                value={form.carbohidratos}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel} style={{ width: 'auto' }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: 'auto' }}>
              {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
