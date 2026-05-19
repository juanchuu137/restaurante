package com.restaurante.api.service;

import com.restaurante.api.dto.ClienteDTO;
import com.restaurante.api.model.Cliente;
import com.restaurante.api.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    /**
     * Devuelve los datos del cliente asociado al usuario autenticado.
     */
    @Transactional(readOnly = true)
    public ClienteDTO obtenerPorUsuarioId(UUID usuarioId) {
        Cliente cliente = clienteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado para el usuario: " + usuarioId));
        return toDTO(cliente);
    }

    /**
     * Actualiza los datos personales del cliente (nombre, peso, estatura).
     */
    @Transactional
    public ClienteDTO actualizar(UUID usuarioId, ClienteDTO datos) {
        Cliente cliente = clienteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado para el usuario: " + usuarioId));

        if (datos.getNombre() != null) cliente.setNombre(datos.getNombre());
        if (datos.getPeso() != null) cliente.setPeso(datos.getPeso());
        if (datos.getEstatura() != null) cliente.setEstatura(datos.getEstatura());

        return toDTO(clienteRepository.save(cliente));
    }

    private ClienteDTO toDTO(Cliente cliente) {
        return new ClienteDTO(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getPeso(),
                cliente.getEstatura()
        );
    }
}
