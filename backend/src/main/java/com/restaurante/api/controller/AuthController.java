package com.restaurante.api.controller;

import com.restaurante.api.dto.AuthResponse;
import com.restaurante.api.dto.LoginRequest;
import com.restaurante.api.dto.RegistroRequest;
import com.restaurante.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Registra un nuevo cliente.
     * POST /api/auth/registro
     * Body: { nombre, email, password, peso, estatura }
     */
    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registro(@RequestBody RegistroRequest request) {
        AuthResponse response = authService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Autentica un usuario (cliente o admin).
     * POST /api/auth/login
     * Body: { email, password }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
