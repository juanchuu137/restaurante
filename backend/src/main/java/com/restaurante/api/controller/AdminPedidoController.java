package com.restaurante.api.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurante.api.dto.PedidoResponse;
import com.restaurante.api.service.PedidoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/pedidos")
@RequiredArgsConstructor
public class AdminPedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PedidoResponse>> listarPedidos(@RequestParam(required = false) String estado) {
        return ResponseEntity.ok(pedidoService.listarPedidosAdmin(estado));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PedidoResponse> actualizarEstado(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String estado = body.get("estado");
        if (estado == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(pedidoService.actualizarEstado(id, estado));
    }
}
