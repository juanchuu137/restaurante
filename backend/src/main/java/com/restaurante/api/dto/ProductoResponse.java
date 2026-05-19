package com.restaurante.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {
    private UUID id;
    private String nombre;
    private BigDecimal precio;
    private Integer stock;
    private BigDecimal calorias;
    private BigDecimal proteinas;
    private BigDecimal grasas;
    private BigDecimal carbohidratos;
}
