package com.restaurante.api.controller;

import com.restaurante.api.dto.ClienteDTO;
import com.restaurante.api.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    /**
     * Devuelve los datos del cliente autenticado.
     * GET /api/clientes/me
     * Requiere: Bearer token (rol CLIENTE)
     */
    @GetMapping("/me")
    public ResponseEntity<ClienteDTO> obtenerMiPerfil(@AuthenticationPrincipal Jwt jwt) {
        UUID usuarioId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(clienteService.obtenerPorUsuarioId(usuarioId));
    }

    /**
     * Actualiza los datos del cliente autenticado.
     * PUT /api/clientes/me
     * Body: { nombre, peso, estatura } (todos opcionales)
     */
    @PutMapping("/me")
    public ResponseEntity<ClienteDTO> actualizarMiPerfil(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ClienteDTO datos) {
        UUID usuarioId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(clienteService.actualizar(usuarioId, datos));
    }
}
