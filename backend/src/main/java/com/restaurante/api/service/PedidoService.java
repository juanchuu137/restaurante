package com.restaurante.api.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurante.api.dto.PedidoItemRequest;
import com.restaurante.api.dto.PedidoItemResponse;
import com.restaurante.api.dto.PedidoRequest;
import com.restaurante.api.dto.PedidoResponse;
import com.restaurante.api.exception.RecursoNoEncontradoException;
import com.restaurante.api.exception.StockInsuficienteException;
import com.restaurante.api.model.Cliente;
import com.restaurante.api.model.DetallePedido;
import com.restaurante.api.model.Pedido;
import com.restaurante.api.model.Producto;
import com.restaurante.api.repository.ClienteRepository;
import com.restaurante.api.repository.PedidoRepository;
import com.restaurante.api.repository.ProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;

    @Transactional
    public PedidoResponse crearPedido(UUID usuarioId, PedidoRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("El pedido debe contener al menos un producto");
        }

        Cliente cliente = clienteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado"));

        Map<UUID, Integer> cantidadesPorProducto = request.getItems().stream()
                .collect(Collectors.toMap(
                        PedidoItemRequest::getProductoId,
                        PedidoItemRequest::getCantidad,
                        Integer::sum
                ));

        List<UUID> productoIds = new ArrayList<>(cantidadesPorProducto.keySet());
        List<Producto> productos = productoRepository.findAllById(productoIds);

        if (productos.size() != productoIds.size()) {
            Set<UUID> encontrados = productos.stream()
                    .map(Producto::getId)
                    .collect(Collectors.toSet());
            UUID missing = productoIds.stream()
                    .filter(id -> !encontrados.contains(id))
                    .findFirst()
                    .orElse(null);
            throw new RecursoNoEncontradoException("Producto no encontrado con id: " + missing);
        }

        Map<UUID, Producto> productoMap = productos.stream()
                .collect(Collectors.toMap(Producto::getId, Function.identity()));

        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (PedidoItemRequest item : request.getItems()) {
            Producto producto = productoMap.get(item.getProductoId());
            int cantidad = item.getCantidad();

            if (cantidad <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor que cero para el producto: " + producto.getNombre());
            }

            if (producto.getStock() == null || producto.getStock() < cantidad) {
                throw new StockInsuficienteException("No hay suficiente stock para el producto: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - cantidad);

            BigDecimal precioUnitario = producto.getPrecio() != null ? producto.getPrecio() : BigDecimal.ZERO;
            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
            total = total.add(subtotal);

            DetallePedido detalle = new DetallePedido();
            detalle.setId(UUID.randomUUID());
            detalle.setPedido(null);
            detalle.setProducto(producto);
            detalle.setCantidad(cantidad);
            detalles.add(detalle);
        }

        Pedido pedido = new Pedido();
        pedido.setId(UUID.randomUUID());
        pedido.setFecha(LocalDateTime.now());
        pedido.setCliente(cliente);
        pedido.setEstado("PENDIENTE");
        detalles.forEach(detalle -> detalle.setPedido(pedido));
        pedido.setDetalles(detalles);

        productoRepository.saveAll(productos);
        pedidoRepository.save(pedido);

        return toResponse(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPedidosCliente(UUID usuarioId) {
        List<Pedido> pedidos = pedidoRepository.findByClienteUsuarioId(usuarioId);
        return pedidos.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPedidosAdmin(String estado) {
        List<Pedido> pedidos;
        if (estado == null || estado.isBlank()) {
            pedidos = pedidoRepository.findAllByOrderByFechaDesc();
        } else {
            pedidos = pedidoRepository.findByEstadoOrderByFechaDesc(estado.toUpperCase());
        }
        return pedidos.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PedidoResponse actualizarEstado(UUID pedidoId, String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Pedido no encontrado"));

        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            throw new IllegalArgumentException("Estado inválido");
        }

        String estadoUpper = nuevoEstado.toUpperCase();
        if (!"PENDIENTE".equals(estadoUpper) && !"REALIZADO".equals(estadoUpper)) {
            throw new IllegalArgumentException("Estado no permitido: " + nuevoEstado);
        }

        pedido.setEstado(estadoUpper);
        pedidoRepository.save(pedido);
        return toResponse(pedido);
    }

    private PedidoResponse toResponse(Pedido pedido) {
        List<PedidoItemResponse> items = pedido.getDetalles().stream()
                .map(detalle -> {
                    BigDecimal unitario = detalle.getProducto().getPrecio() != null
                            ? detalle.getProducto().getPrecio()
                            : BigDecimal.ZERO;
                    BigDecimal subtotal = unitario.multiply(BigDecimal.valueOf(detalle.getCantidad()));
                    return new PedidoItemResponse(
                            detalle.getProducto().getId(),
                            detalle.getProducto().getNombre(),
                            detalle.getCantidad(),
                            unitario,
                            subtotal
                    );
                })
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(PedidoItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new PedidoResponse(
                pedido.getId(),
                pedido.getFecha(),
                pedido.getEstado(),
                total,
                items
        );
    }
}
