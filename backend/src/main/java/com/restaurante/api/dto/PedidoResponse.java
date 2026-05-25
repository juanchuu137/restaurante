package com.restaurante.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoResponse {
    private UUID id;
    private LocalDateTime fecha;
    private String estado;
    private BigDecimal total;
    private List<PedidoItemResponse> items;
}
