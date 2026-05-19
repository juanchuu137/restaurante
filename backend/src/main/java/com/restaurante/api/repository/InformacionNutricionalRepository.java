package com.restaurante.api.repository;

import com.restaurante.api.model.InformacionNutricional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InformacionNutricionalRepository extends JpaRepository<InformacionNutricional, UUID> {
    Optional<InformacionNutricional> findByProductoId(UUID productoId);
}
