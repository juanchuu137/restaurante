package com.restaurante.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurante.api.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, UUID> {
    List<Pedido> findByClienteUsuarioId(UUID usuarioId);
    List<Pedido> findByEstadoOrderByFechaDesc(String estado);
    List<Pedido> findAllByOrderByFechaDesc();
}
