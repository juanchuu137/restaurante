-- ============================================================
-- MIGRACIÓN: Creación de tabla usuario y ajuste de tabla cliente
-- Ejecutar en el panel SQL de Supabase (schema: public)
-- ============================================================

-- 1. Crear la tabla usuario
CREATE TABLE IF NOT EXISTS public.usuario (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email        VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol          VARCHAR(20) NOT NULL DEFAULT 'CLIENTE'
                 CHECK (rol IN ('CLIENTE', 'ADMIN')),
    activo       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas frecuentes por email
CREATE INDEX IF NOT EXISTS idx_usuario_email ON public.usuario(email);

-- 2. Ajustar tabla cliente
--    a) Eliminar el campo email (ya no pertenece a cliente)
ALTER TABLE public.cliente
    DROP COLUMN IF EXISTS email;

--    b) Agregar campos nutricionales/personales
ALTER TABLE public.cliente
    ADD COLUMN IF NOT EXISTS peso      NUMERIC(5, 2),
    ADD COLUMN IF NOT EXISTS estatura  NUMERIC(4, 2);

--    c) Agregar FK a usuario
ALTER TABLE public.cliente
    ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES public.usuario(id);

-- (Opcional) Hacer usuario_id NOT NULL una vez migrados los datos existentes:
-- ALTER TABLE public.cliente ALTER COLUMN usuario_id SET NOT NULL;

-- ============================================================
-- CREACIÓN DE ADMIN (solo para el equipo desarrollador)
-- Reemplazar 'HASH_AQUI' con el resultado de BCrypt para la contraseña admin
-- ============================================================
-- INSERT INTO public.usuario (email, password_hash, rol)
-- VALUES ('admin@restaurante.com', 'HASH_AQUI', 'ADMIN');
