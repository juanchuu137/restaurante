package com.restaurante.api.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurante.api.dto.AgregarProductoOpenFoodFactsRequest;
import com.restaurante.api.dto.OpenFoodFactsProductDTO;
import com.restaurante.api.dto.OpenFoodFactsProductDetailDTO;
import com.restaurante.api.dto.ProductoRequest;
import com.restaurante.api.dto.ProductoResponse;
import com.restaurante.api.service.OpenFoodFactsService;
import com.restaurante.api.service.ProductoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/productos")
@RequiredArgsConstructor
public class AdminProductoController {

    private final ProductoService productoService;
    private final OpenFoodFactsService openFoodFactsService;

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
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse response = productoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Actualiza un producto existente.
     * PUT /api/admin/productos/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable UUID id, @Valid @RequestBody ProductoRequest request) {
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

    /**
     * Busca alimentos en OpenFoodFacts por nombre.
     */
    @GetMapping("/openfoodfacts/buscar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OpenFoodFactsProductDTO>> buscarEnOpenFoodFacts(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<OpenFoodFactsProductDTO> resultados = openFoodFactsService.buscarProductos(query.trim());
        return ResponseEntity.ok(resultados);
    }

    /**
     * Obtiene los detalles de un alimento en OpenFoodFacts.
     */
    @GetMapping("/openfoodfacts/{code}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OpenFoodFactsProductDetailDTO> obtenerDetalleOpenFoodFacts(@PathVariable String code) {
        return ResponseEntity.ok(openFoodFactsService.obtenerDetalle(code));
    }

    /**
     * Agrega un producto al menú desde OpenFoodFacts.
     */
    @PostMapping("/openfoodfacts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> agregarDesdeOpenFoodFacts(
            @Valid @RequestBody AgregarProductoOpenFoodFactsRequest request) {
        OpenFoodFactsProductDetailDTO detalle = openFoodFactsService.obtenerDetalle(request.getCode());

        ProductoRequest productoRequest = new ProductoRequest();
        productoRequest.setNombre(request.getNombre() != null && !request.getNombre().isBlank()
                ? request.getNombre()
                : detalle.getProductName());
        productoRequest.setPrecio(request.getPrecio());
        productoRequest.setStock(request.getStock());
        productoRequest.setImagenUrl(detalle.getImageUrl());
        productoRequest.setCalorias(detalle.getCalorias());
        productoRequest.setProteinas(detalle.getProteinas());
        productoRequest.setGrasas(detalle.getGrasas());
        productoRequest.setCarbohidratos(detalle.getCarbohidratos());

        ProductoResponse response = productoService.crear(productoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
