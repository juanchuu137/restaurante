package com.restaurante.api.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenFoodFactsProductDetailDTO {
    private String code;
    private String productName;
    private String genericName;
    private String brands;
    private String imageUrl;
    private String servingSize;
    private BigDecimal calorias;
    private BigDecimal proteinas;
    private BigDecimal grasas;
    private BigDecimal carbohidratos;
}
