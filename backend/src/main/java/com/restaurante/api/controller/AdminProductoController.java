package com.restaurante.api.controller;

import com.restaurante.api.dto.ProductoRequest;
import com.restaurante.api.dto.ProductoResponse;
import com.restaurante.api.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/productos")
@RequiredArgsConstructor
public class AdminProductoController {

    private final ProductoService productoService;

    /**
     * Lista todos los productos.
     * GET /api/admin/productos
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductoResponse>> listarTodos() {
        return ResponseEntity.ok(productoService.listarTodos());
    }

    /**
     * Obtiene un producto por ID.
     * GET /api/admin/productos/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> obtenerPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    /**
     * Crea un nuevo producto con su información nutricional.
     * POST /api/admin/productos
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> crear(@RequestBody ProductoRequest request) {
        ProductoResponse response = productoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Actualiza un producto existente.
     * PUT /api/admin/productos/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable UUID id, @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.actualizar(id, request));
    }

    /**
     * Actualiza solo el stock de un producto.
     * PATCH /api/admin/productos/{id}/stock
     * Body: { "stock": 50 }
     */
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> actualizarStock(@PathVariable UUID id, @RequestBody Map<String, Integer> body) {
        Integer nuevoStock = body.get("stock");
        if (nuevoStock == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(productoService.actualizarStock(id, nuevoStock));
    }

    /**
     * Elimina un producto.
     * DELETE /api/admin/productos/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
