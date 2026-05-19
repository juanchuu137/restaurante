package com.restaurante.api.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductoRequest {
    private String nombre;
    private BigDecimal precio;
    private Integer stock;
    private BigDecimal calorias;
    private BigDecimal proteinas;
    private BigDecimal grasas;
    private BigDecimal carbohidratos;
}
