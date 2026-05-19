package com.restaurante.api.repository;

import com.restaurante.api.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, UUID> {
}
