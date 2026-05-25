package com.restaurante.api.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "detalle_pedido")
public class DetallePedido {

    @Id
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", referencedColumnName = "id")
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "producto_id", referencedColumnName = "id", nullable = true)
    private Producto producto;

    @Column(name = "producto_nombre")
    private String nombreProducto;

    @Column(name = "precio_unitario")
    private java.math.BigDecimal precioUnitario;

    @Column(name = "cantidad")
    private Integer cantidad;
}
