package com.restaurante.api.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RegistroRequest {
    private String nombre;
    private String email;
    private String password;
    private BigDecimal peso;
    private BigDecimal estatura;
}
