package com.restaurante.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AgregarProductoOpenFoodFactsRequest {
    @NotBlank(message = "El código del producto es obligatorio")
    private String code;

    private String nombre;

    @NotNull(message = "El precio es obligatorio")
    private BigDecimal precio;

    @NotNull(message = "El stock es obligatorio")
    private Integer stock;
}
