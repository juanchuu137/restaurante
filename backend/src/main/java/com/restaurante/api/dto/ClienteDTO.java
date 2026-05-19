package com.restaurante.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    private UUID id;
    private String nombre;
    private BigDecimal peso;
    private BigDecimal estatura;
}
