package com.restaurante.api.controller;

import com.restaurante.api.dto.ProductoResponse;
import com.restaurante.api.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoint de productos accesible por clientes autenticados.
 * Solo expone lectura (GET) — sin creación, edición ni eliminación.
 */
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    /**
     * Lista todos los productos disponibles con su información nutricional.
     * GET /api/productos
     * Requiere: Bearer token (rol CLIENTE)
     */
    @GetMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<ProductoResponse>> listarProductos() {
        return ResponseEntity.ok(productoService.listarTodos());
    }
}
