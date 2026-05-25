package com.restaurante.api.service;

import com.restaurante.api.dto.AuthResponse;
import com.restaurante.api.dto.LoginRequest;
import com.restaurante.api.dto.RegistroRequest;
import com.restaurante.api.exception.EmailYaRegistradoException;
import com.restaurante.api.exception.CredencialesInvalidasException;
import com.restaurante.api.model.Cliente;
import com.restaurante.api.model.Rol;
import com.restaurante.api.model.Usuario;
import com.restaurante.api.repository.ClienteRepository;
import com.restaurante.api.repository.UsuarioRepository;
import com.restaurante.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Registra un nuevo cliente: crea Usuario (rol=CLIENTE) + Cliente asociado.
     * Lanza EmailYaRegistradoException si el email ya existe.
     */
    @Transactional
    public AuthResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new EmailYaRegistradoException("El email ya está registrado: " + request.getEmail());
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Rol.CLIENTE);
        usuario = usuarioRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setNombre(request.getNombre());
        cliente.setPeso(request.getPeso());
        cliente.setEstatura(request.getEstatura());
        cliente.setUsuario(usuario);
        clienteRepository.save(cliente);

        String token = jwtService.generarToken(usuario);
        return new AuthResponse(token, usuario.getRol().name(), cliente.getNombre());
    }

    /**
     * Autentica un usuario verificando email + contraseña contra la tabla usuario.
     * Lanza CredencialesInvalidasException si el email no existe o la contraseña no coincide.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CredencialesInvalidasException("Credenciales inválidas"));

        if (!usuario.isActivo()) {
            throw new CredencialesInvalidasException("Credenciales inválidas");
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new CredencialesInvalidasException("Contraseña inválida");
        }

        // Obtener nombre según el rol
        String nombre = "";
        if (usuario.getRol() == Rol.CLIENTE) {
            nombre = clienteRepository.findByUsuarioId(usuario.getId())
                    .map(Cliente::getNombre)
                    .orElse("");
        }

        String token = jwtService.generarToken(usuario);
        return new AuthResponse(token, usuario.getRol().name(), nombre);
    }
}
