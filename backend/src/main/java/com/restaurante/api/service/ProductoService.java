package com.restaurante.api.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurante.api.dto.ProductoRequest;
import com.restaurante.api.dto.ProductoResponse;
import com.restaurante.api.model.InformacionNutricional;
import com.restaurante.api.model.Producto;
import com.restaurante.api.repository.DetallePedidoRepository;
import com.restaurante.api.repository.ProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final DetallePedidoRepository detallePedidoRepository;

    /**
     * Lista todos los productos con su información nutricional.
     */
    public List<ProductoResponse> listarTodos() {
        return productoRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un producto por su ID.
     */
    public ProductoResponse obtenerPorId(UUID id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        return toResponse(producto);
    }

    /**
     * Crea un nuevo producto con su información nutricional.
     */
    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        Integer stock = request.getStock();
        producto.setStock(stock != null ? stock : 0);

        InformacionNutricional info = new InformacionNutricional();
        info.setCalorias(request.getCalorias());
        info.setProteinas(request.getProteinas());
        info.setGrasas(request.getGrasas());
        info.setCarbohidratos(request.getCarbohidratos());
        info.setProducto(producto);

        producto.setInformacionNutricional(info);

        producto = productoRepository.save(producto);
        return toResponse(producto);
    }

    /**
     * Actualiza un producto existente y su información nutricional.
     */
    @Transactional
    public ProductoResponse actualizar(UUID id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock() != null ? request.getStock() : producto.getStock());

        InformacionNutricional info = producto.getInformacionNutricional();
        if (info == null) {
            info = new InformacionNutricional();
            info.setProducto(producto);
            producto.setInformacionNutricional(info);
        }
        info.setCalorias(request.getCalorias());
        info.setProteinas(request.getProteinas());
        info.setGrasas(request.getGrasas());
        info.setCarbohidratos(request.getCarbohidratos());

        producto = productoRepository.save(producto);
        return toResponse(producto);
    }

    /**
     * Actualiza solo el stock de un producto.
     */
    @Transactional
    public ProductoResponse actualizarStock(UUID id, Integer nuevoStock) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        producto.setStock(nuevoStock);
        producto = productoRepository.save(producto);
        return toResponse(producto);
    }

    /**
     * Elimina un producto por su ID.
     */
    @Transactional
    public void eliminar(UUID id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con id: " + id);
        }

        detallePedidoRepository.clearProductoReference(id);
        productoRepository.deleteById(id);
    }

    /**
     * Convierte un Producto a ProductoResponse.
     */
    private ProductoResponse toResponse(Producto producto) {
        InformacionNutricional info = producto.getInformacionNutricional();
        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getPrecio(),
                producto.getStock(),
                info != null ? info.getCalorias() : null,
                info != null ? info.getProteinas() : null,
                info != null ? info.getGrasas() : null,
                info != null ? info.getCarbohidratos() : null
        );
    }
}
