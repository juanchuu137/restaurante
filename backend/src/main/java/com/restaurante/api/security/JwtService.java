package com.restaurante.api.security;

import com.restaurante.api.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final long expirationHours;

    public JwtService(JwtEncoder jwtEncoder,
                      @Value("${app.jwt.expiration-hours:24}") long expirationHours) {
        this.jwtEncoder = jwtEncoder;
        this.expirationHours = expirationHours;
    }

    /**
     * Genera un JWT firmado con el secret propio de la aplicación.
     * El subject es el UUID del usuario; el rol se incluye como claim personalizado.
     */
    public String generarToken(Usuario usuario) {
        Instant ahora = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(usuario.getId().toString())
                .issuedAt(ahora)
                .expiresAt(ahora.plus(expirationHours, ChronoUnit.HOURS))
                .claim("email", usuario.getEmail())
                .claim("rol", usuario.getRol().name())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
