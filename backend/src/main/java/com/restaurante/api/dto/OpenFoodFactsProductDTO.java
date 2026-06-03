package com.restaurante.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenFoodFactsProductDTO {
    private String code;
    private String productName;
    private String genericName;
    private String brands;
    private String imageUrl;
}
