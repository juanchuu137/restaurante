package com.restaurante.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductoRequest {
    private String nombre;
    private BigDecimal precio;
    private Integer stock;

    @NotNull(message = "Las calorías son obligatorias")
    private BigDecimal calorias;

    @NotNull(message = "Las proteínas son obligatorias")
    private BigDecimal proteinas;

    @NotNull(message = "Las grasas son obligatorias")
    private BigDecimal grasas;

    @NotNull(message = "Los carbohidratos son obligatorios")
    private BigDecimal carbohidratos;
}
