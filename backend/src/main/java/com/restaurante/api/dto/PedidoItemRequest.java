package com.restaurante.api.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoItemRequest {

    @NotNull(message = "El id del producto es requerido")
    private UUID productoId;

    @NotNull(message = "La cantidad es requerida")
    @Positive(message = "La cantidad debe ser mayor que cero")
    private Integer cantidad;
}
