package com.restaurante.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "informacion_nutricional")
public class InformacionNutricional {

    @Id
    @Column(name = "id")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", referencedColumnName = "id")
    private Producto producto;

    @Column(name = "calorias")
    private BigDecimal calorias;

    @Column(name = "proteinas")
    private BigDecimal proteinas;

    @Column(name = "grasas")
    private BigDecimal grasas;

    @Column(name = "carbohidratos")
    private BigDecimal carbohidratos;
}
