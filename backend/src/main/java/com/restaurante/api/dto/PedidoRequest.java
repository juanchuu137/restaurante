package com.restaurante.api.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoRequest {

    @NotEmpty(message = "El pedido debe contener al menos un producto")
    @Valid
    private List<PedidoItemRequest> items;
}
