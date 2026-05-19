package com.restaurante.api;

import com.restaurante.api.dto.AuthResponse;
import com.restaurante.api.dto.LoginRequest;
import com.restaurante.api.model.Rol;
import com.restaurante.api.model.Usuario;
import com.restaurante.api.repository.UsuarioRepository;
import com.restaurante.api.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RestauranteApiApplicationTests {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private AuthService authService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@BeforeEach
	void setUpDatabase() {
		System.out.println(">>> Ejecutando DDL de migración en la base de datos...");
		try {
			// 1. Crear tabla usuario si no existe
			jdbcTemplate.execute(
				"CREATE TABLE IF NOT EXISTS public.usuario (" +
				"    id           UUID PRIMARY KEY DEFAULT gen_random_uuid()," +
				"    email        VARCHAR(255) NOT NULL UNIQUE," +
				"    password_hash VARCHAR(255) NOT NULL," +
				"    rol          VARCHAR(20) NOT NULL DEFAULT 'CLIENTE' CHECK (rol IN ('CLIENTE', 'ADMIN'))," +
				"    activo       BOOLEAN NOT NULL DEFAULT TRUE," +
				"    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()" +
				")"
			);
			
			// Asegurarse de agregar todas las columnas necesarias si la tabla ya existía
			try {
				jdbcTemplate.execute("ALTER TABLE public.usuario DROP COLUMN IF EXISTS password");
			} catch (Exception e) {
				System.out.println("Nota al borrar columna obsoleta password: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE");
			} catch (Exception e) {
				System.out.println("Nota al alterar columna email: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)");
			} catch (Exception e) {
				System.out.println("Nota al alterar columna password_hash: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'CLIENTE'");
			} catch (Exception e) {
				System.out.println("Nota al alterar columna rol: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE");
			} catch (Exception e) {
				System.out.println("Nota al alterar columna activo: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()");
			} catch (Exception e) {
				System.out.println("Nota al alterar columna created_at: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("UPDATE public.usuario SET rol = UPPER(rol)");
			} catch (Exception e) {
				System.out.println("Nota al normalizar roles a mayúsculas: " + e.getMessage());
			}

			// 3. Ajustar tabla producto: agregar columna stock
			try {
				jdbcTemplate.execute("ALTER TABLE public.producto ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0");
			} catch (Exception e) {
				System.out.println("Nota al agregar columna stock: " + e.getMessage());
			}

			// Mostrar columnas actuales para depuración
			System.out.println("--- COLUMNAS ACTUALES EN LA TABLA 'usuario' ---");
			jdbcTemplate.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuario'", (rs, rowNum) -> {
				System.out.println("Columna: " + rs.getString("column_name") + " (" + rs.getString("data_type") + ")");
				return null;
			});

			// Crear índice
			jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_usuario_email ON public.usuario(email)");

			// 2. Ajustar tabla cliente
			try {
				jdbcTemplate.execute("ALTER TABLE public.cliente DROP COLUMN IF EXISTS email");
			} catch (Exception e) {
				System.out.println("Nota al borrar columna email de cliente: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE public.cliente ADD COLUMN IF NOT EXISTS peso NUMERIC(5, 2)");
			} catch (Exception e) {
				System.out.println("Nota al agregar columna peso: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE public.cliente ADD COLUMN IF NOT EXISTS estatura NUMERIC(4, 2)");
			} catch (Exception e) {
				System.out.println("Nota al agregar columna estatura: " + e.getMessage());
			}

			try {
				jdbcTemplate.execute("ALTER TABLE public.cliente ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES public.usuario(id)");
			} catch (Exception e) {
				System.out.println("Nota al agregar FK usuario_id: " + e.getMessage());
			}

			System.out.println(">>> DDL de migración ejecutado con éxito.");
		} catch (Exception e) {
			System.err.println("Error durante la inicialización de la base de datos: " + e.getMessage());
			e.printStackTrace();
		}
	}

	@Test
	void contextLoads() {
	}

	@Test
	void testAdminAuthentication() {
		String adminEmail = "admin@restaurante.com";
		String adminPassword = "admin123_secure_password";

		// 1. Asegurar que existe el usuario admin en la base de datos
		Optional<Usuario> existingAdmin = usuarioRepository.findByEmail(adminEmail);
		if (existingAdmin.isEmpty()) {
			Usuario admin = new Usuario();
			admin.setEmail(adminEmail);
			admin.setPasswordHash(passwordEncoder.encode(adminPassword));
			admin.setRol(Rol.ADMIN);
			admin.setActivo(true);
			usuarioRepository.save(admin);
			System.out.println(">>> Creado nuevo usuario admin de prueba: " + adminEmail);
		} else {
			Usuario admin = existingAdmin.get();
			admin.setRol(Rol.ADMIN);
			admin.setActivo(true);
			admin.setPasswordHash(passwordEncoder.encode(adminPassword));
			usuarioRepository.save(admin);
			System.out.println(">>> Usuario admin de prueba actualizado en DB: " + adminEmail);
		}

		// 2. Probar autenticación del administrador
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail(adminEmail);
		loginRequest.setPassword(adminPassword);
		AuthResponse response = authService.login(loginRequest);

		assertNotNull(response, "La respuesta de autenticación no debe ser nula");
		assertEquals("ADMIN", response.getRol(), "El rol retornado debe ser ADMIN");
		assertNotNull(response.getToken(), "El token JWT no debe ser nulo");

		System.out.println(">>> ¡Autenticación de ADMIN exitosa!");
		System.out.println(">>> Token generado para ADMIN: " + response.getToken());
		System.out.println(">>> Rol devuelto: " + response.getRol());
	}

	@Test
	void testInspectUsers() {
		System.out.println(">>> LISTANDO TODOS LOS USUARIOS EN LA DB:");
		usuarioRepository.findAll().forEach(u -> {
			System.out.println("Email: " + u.getEmail() + " | Rol: " + u.getRol() + " | Activo: " + u.isActivo() + " | Hash: " + u.getPasswordHash());
		});
	}
}
