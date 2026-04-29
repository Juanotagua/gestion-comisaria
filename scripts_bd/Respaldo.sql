--
-- PostgreSQL database dump
--

\restrict n78NOkakspSNIe363cQEjymjO419Y6m7Yv0LcRxrdXc1shFFbepCCQlgKKVjd2u

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-28 20:38:47

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 275 (class 1255 OID 16747)
-- Name: cambiar_prioridad(integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.cambiar_prioridad(IN p_id_caso integer, IN p_prioridad integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

UPDATE casos
SET id_prioridad = p_prioridad
WHERE id_caso = p_id_caso;

END;
$$;


ALTER PROCEDURE public.cambiar_prioridad(IN p_id_caso integer, IN p_prioridad integer) OWNER TO postgres;

--
-- TOC entry 276 (class 1255 OID 16746)
-- Name: cerrar_caso(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.cerrar_caso(IN p_id_caso integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

UPDATE casos
SET id_estado = 3
WHERE id_caso = p_id_caso;

END;
$$;


ALTER PROCEDURE public.cerrar_caso(IN p_id_caso integer) OWNER TO postgres;

--
-- TOC entry 273 (class 1255 OID 16744)
-- Name: crear_caso(character varying, integer, integer, integer, text, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.crear_caso(IN p_radicado character varying, IN p_tipo integer, IN p_estado integer, IN p_prioridad integer, IN p_descripcion text, IN p_usuario integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

INSERT INTO casos(
numero_radicado,
id_tipo_proceso,
id_estado,
id_prioridad,
descripcion_hechos,
fecha_apertura,
id_usuario_creador
)
VALUES(
p_radicado,
p_tipo,
p_estado,
p_prioridad,
p_descripcion,
CURRENT_DATE,
p_usuario
);

END;
$$;


ALTER PROCEDURE public.crear_caso(IN p_radicado character varying, IN p_tipo integer, IN p_estado integer, IN p_prioridad integer, IN p_descripcion text, IN p_usuario integer) OWNER TO postgres;

--
-- TOC entry 255 (class 1255 OID 16710)
-- Name: impedir_borrar_ciudadano(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.impedir_borrar_ciudadano() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

IF EXISTS (
SELECT 1
FROM participantes_caso
WHERE id_ciudadano = OLD.id_ciudadano
)

THEN

RAISE EXCEPTION
'No se puede eliminar un ciudadano asociado a expedientes';

END IF;

RETURN OLD;

END;
$$;


ALTER FUNCTION public.impedir_borrar_ciudadano() OWNER TO postgres;

--
-- TOC entry 272 (class 1255 OID 16741)
-- Name: log_auditoria_general(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_auditoria_general() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

INSERT INTO auditoria_general(
tabla_afectada,
accion,
usuario_bd,
detalle
)

VALUES(
TG_TABLE_NAME,
TG_OP,
CURRENT_USER,
TG_OP || ' ejecutado sobre ' || TG_TABLE_NAME
);

RETURN NEW;

END;
$$;


ALTER FUNCTION public.log_auditoria_general() OWNER TO postgres;

--
-- TOC entry 252 (class 1255 OID 16704)
-- Name: log_cambio_estado(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_cambio_estado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

IF OLD.id_estado <> NEW.id_estado THEN

INSERT INTO seguimiento(
id_caso,
id_usuario,
id_accion,
descripcion
)

VALUES(
NEW.id_caso,
NEW.id_usuario_creador,
2,
'Actualizacion automatica del estado del expediente'
);

END IF;

RETURN NEW;

END;
$$;


ALTER FUNCTION public.log_cambio_estado() OWNER TO postgres;

--
-- TOC entry 258 (class 1255 OID 16715)
-- Name: log_cambios_ciudadano(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_cambios_ciudadano() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

RAISE NOTICE
'Se modificaron datos de ciudadano';

RETURN NEW;

END;
$$;


ALTER FUNCTION public.log_cambios_ciudadano() OWNER TO postgres;

--
-- TOC entry 270 (class 1255 OID 16716)
-- Name: log_cambios_detallados(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_cambios_detallados() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE

detalle TEXT := '';

estado_old TEXT;
estado_new TEXT;

prioridad_old TEXT;
prioridad_new TEXT;

tipo_old TEXT;
tipo_new TEXT;

BEGIN


-- CAMBIO DE ESTADO
IF OLD.id_estado <> NEW.id_estado THEN

SELECT nombre_estado
INTO estado_old
FROM catalogo_estados_caso
WHERE id_estado=OLD.id_estado;

SELECT nombre_estado
INTO estado_new
FROM catalogo_estados_caso
WHERE id_estado=NEW.id_estado;

detalle := detalle ||
'Estado cambió de '
|| estado_old ||
' a '
|| estado_new || '. ';

END IF;



-- CAMBIO PRIORIDAD
IF OLD.id_prioridad <> NEW.id_prioridad THEN

SELECT nombre_prioridad
INTO prioridad_old
FROM catalogo_prioridades
WHERE id_prioridad=OLD.id_prioridad;

SELECT nombre_prioridad
INTO prioridad_new
FROM catalogo_prioridades
WHERE id_prioridad=NEW.id_prioridad;

detalle := detalle ||
'Prioridad cambió de '
|| prioridad_old ||
' a '
|| prioridad_new || '. ';

END IF;



-- CAMBIO TIPO PROCESO
IF OLD.id_tipo_proceso <> NEW.id_tipo_proceso THEN

SELECT nombre_proceso
INTO tipo_old
FROM catalogo_tipos_proceso
WHERE id_tipo_proceso=OLD.id_tipo_proceso;

SELECT nombre_proceso
INTO tipo_new
FROM catalogo_tipos_proceso
WHERE id_tipo_proceso=NEW.id_tipo_proceso;

detalle := detalle ||
'Tipo de proceso cambió de '
|| tipo_old ||
' a '
|| tipo_new || '. ';

END IF;



-- CAMBIO DESCRIPCION
IF OLD.descripcion_hechos <> NEW.descripcion_hechos THEN

detalle := detalle ||
'Descripción del expediente actualizada. ';

END IF;



IF detalle <> '' THEN

INSERT INTO seguimiento(
id_caso,
id_usuario,
id_accion,
descripcion
)

VALUES(
NEW.id_caso,
NEW.id_usuario_creador,
2,
detalle
);

END IF;


RETURN NEW;

END;
$$;


ALTER FUNCTION public.log_cambios_detallados() OWNER TO postgres;

--
-- TOC entry 253 (class 1255 OID 16706)
-- Name: log_creacion_caso(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_creacion_caso() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

INSERT INTO seguimiento(
id_caso,
id_usuario,
id_accion,
descripcion
)

VALUES(
NEW.id_caso,
NEW.id_usuario_creador,
1,
'Creacion automatica del expediente'
);

RETURN NEW;

END;
$$;


ALTER FUNCTION public.log_creacion_caso() OWNER TO postgres;

--
-- TOC entry 257 (class 1255 OID 16714)
-- Name: log_estado_inteligente(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_estado_inteligente() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

IF OLD.id_estado <> NEW.id_estado THEN

IF NEW.id_estado=3 THEN

INSERT INTO seguimiento(
id_caso,
id_usuario,
id_accion,
descripcion
)
VALUES(
NEW.id_caso,
NEW.id_usuario_creador,
5,
'Cierre automatico del expediente'
);

ELSE

INSERT INTO seguimiento(
id_caso,
id_usuario,
id_accion,
descripcion
)
VALUES(
NEW.id_caso,
NEW.id_usuario_creador,
2,
'Cambio de estado del expediente'
);

END IF;

END IF;

RETURN NEW;

END;
$$;


ALTER FUNCTION public.log_estado_inteligente() OWNER TO postgres;

--
-- TOC entry 256 (class 1255 OID 16712)
-- Name: log_modificacion_general(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_modificacion_general() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

IF ROW(OLD.*) IS DISTINCT FROM ROW(NEW.*) THEN

INSERT INTO seguimiento(
id_caso,
id_usuario,
id_accion,
descripcion
)
VALUES(
NEW.id_caso,
NEW.id_usuario_creador,
2,
'Modificacion general del expediente'
);

END IF;

RETURN NEW;

END;
$$;


ALTER FUNCTION public.log_modificacion_general() OWNER TO postgres;

--
-- TOC entry 254 (class 1255 OID 16708)
-- Name: log_reasignacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_reasignacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

INSERT INTO seguimiento(
id_caso,
id_usuario,
id_accion,
descripcion
)

VALUES(
NEW.id_caso,
NEW.usuario_nuevo,
3,
'Reasignacion automatica del expediente'
);

RETURN NEW;

END;
$$;


ALTER FUNCTION public.log_reasignacion() OWNER TO postgres;

--
-- TOC entry 271 (class 1255 OID 16728)
-- Name: log_reasignacion_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_reasignacion_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE

usuario_old TEXT;
usuario_new TEXT;

detalle TEXT;

BEGIN

IF OLD.id_usuario_asignado IS DISTINCT FROM NEW.id_usuario_asignado THEN

SELECT nombre
INTO usuario_old
FROM usuarios
WHERE id_usuario=OLD.id_usuario_asignado;

SELECT nombre
INTO usuario_new
FROM usuarios
WHERE id_usuario=NEW.id_usuario_asignado;

detalle :=
'Caso reasignado de '
|| usuario_old ||
' a '
|| usuario_new;

INSERT INTO seguimiento(
id_caso,
id_usuario,
id_accion,
descripcion
)

VALUES(
NEW.id_caso,
NEW.id_usuario_creador,
3,
detalle
);

END IF;

RETURN NEW;

END;
$$;


ALTER FUNCTION public.log_reasignacion_update() OWNER TO postgres;

--
-- TOC entry 274 (class 1255 OID 16745)
-- Name: reasignar_caso(integer, integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.reasignar_caso(IN p_id_caso integer, IN p_nuevo_usuario integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

UPDATE casos
SET id_usuario_asignado = p_nuevo_usuario
WHERE id_caso = p_id_caso;

END;
$$;


ALTER PROCEDURE public.reasignar_caso(IN p_id_caso integer, IN p_nuevo_usuario integer) OWNER TO postgres;

--
-- TOC entry 277 (class 1255 OID 16769)
-- Name: validar_cierre(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validar_cierre() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
rol_usuario VARCHAR(50);
BEGIN

SELECT r.nombre_rol
INTO rol_usuario
FROM usuarios u
JOIN catalogo_roles_usuario r
ON u.id_rol=r.id_rol
WHERE u.id_usuario=NEW.id_usuario_asignado;

IF NEW.id_estado=3
AND rol_usuario<>'COMISARIO' THEN

RAISE EXCEPTION
'Solo un comisario puede cerrar casos';

END IF;

RETURN NEW;

END;
$$;


ALTER FUNCTION public.validar_cierre() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 242 (class 1259 OID 16668)
-- Name: asignaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asignaciones (
    id_asignacion integer NOT NULL,
    id_caso integer NOT NULL,
    usuario_anterior integer,
    usuario_nuevo integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asignaciones OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16667)
-- Name: asignaciones_id_asignacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asignaciones_id_asignacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asignaciones_id_asignacion_seq OWNER TO postgres;

--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 241
-- Name: asignaciones_id_asignacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asignaciones_id_asignacion_seq OWNED BY public.asignaciones.id_asignacion;


--
-- TOC entry 244 (class 1259 OID 16731)
-- Name: auditoria_general; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria_general (
    id_auditoria integer NOT NULL,
    tabla_afectada character varying(50),
    accion character varying(50),
    usuario_bd character varying(50),
    fecha_evento timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    detalle text
);


ALTER TABLE public.auditoria_general OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16730)
-- Name: auditoria_general_id_auditoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditoria_general_id_auditoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_general_id_auditoria_seq OWNER TO postgres;

--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 243
-- Name: auditoria_general_id_auditoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditoria_general_id_auditoria_seq OWNED BY public.auditoria_general.id_auditoria;


--
-- TOC entry 234 (class 1259 OID 16567)
-- Name: casos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.casos (
    id_caso integer NOT NULL,
    numero_radicado character varying(30) NOT NULL,
    id_tipo_proceso integer NOT NULL,
    id_estado integer NOT NULL,
    id_prioridad integer NOT NULL,
    descripcion_hechos text NOT NULL,
    fecha_apertura date DEFAULT CURRENT_DATE,
    id_usuario_creador integer NOT NULL,
    id_usuario_asignado integer
);


ALTER TABLE public.casos OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16566)
-- Name: casos_id_caso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.casos_id_caso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.casos_id_caso_seq OWNER TO postgres;

--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 233
-- Name: casos_id_caso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.casos_id_caso_seq OWNED BY public.casos.id_caso;


--
-- TOC entry 240 (class 1259 OID 16657)
-- Name: catalogo_acciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_acciones (
    id_accion integer NOT NULL,
    nombre_accion character varying(50) NOT NULL
);


ALTER TABLE public.catalogo_acciones OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16656)
-- Name: catalogo_acciones_id_accion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_acciones_id_accion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_acciones_id_accion_seq OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 239
-- Name: catalogo_acciones_id_accion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_acciones_id_accion_seq OWNED BY public.catalogo_acciones.id_accion;


--
-- TOC entry 226 (class 1259 OID 16516)
-- Name: catalogo_estados_caso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_estados_caso (
    id_estado integer NOT NULL,
    nombre_estado character varying(30) NOT NULL
);


ALTER TABLE public.catalogo_estados_caso OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16515)
-- Name: catalogo_estados_caso_id_estado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_estados_caso_id_estado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_estados_caso_id_estado_seq OWNER TO postgres;

--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 225
-- Name: catalogo_estados_caso_id_estado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_estados_caso_id_estado_seq OWNED BY public.catalogo_estados_caso.id_estado;


--
-- TOC entry 228 (class 1259 OID 16527)
-- Name: catalogo_prioridades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_prioridades (
    id_prioridad integer NOT NULL,
    nombre_prioridad character varying(20) NOT NULL
);


ALTER TABLE public.catalogo_prioridades OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16526)
-- Name: catalogo_prioridades_id_prioridad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_prioridades_id_prioridad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_prioridades_id_prioridad_seq OWNER TO postgres;

--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 227
-- Name: catalogo_prioridades_id_prioridad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_prioridades_id_prioridad_seq OWNED BY public.catalogo_prioridades.id_prioridad;


--
-- TOC entry 230 (class 1259 OID 16538)
-- Name: catalogo_roles_participacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_roles_participacion (
    id_rol_part integer NOT NULL,
    nombre_rol character varying(50) NOT NULL
);


ALTER TABLE public.catalogo_roles_participacion OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16537)
-- Name: catalogo_roles_participacion_id_rol_part_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_roles_participacion_id_rol_part_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_roles_participacion_id_rol_part_seq OWNER TO postgres;

--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 229
-- Name: catalogo_roles_participacion_id_rol_part_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_roles_participacion_id_rol_part_seq OWNED BY public.catalogo_roles_participacion.id_rol_part;


--
-- TOC entry 224 (class 1259 OID 16494)
-- Name: catalogo_roles_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_roles_usuario (
    id_rol integer NOT NULL,
    nombre_rol character varying(50) NOT NULL
);


ALTER TABLE public.catalogo_roles_usuario OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16493)
-- Name: catalogo_roles_usuario_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_roles_usuario_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_roles_usuario_id_rol_seq OWNER TO postgres;

--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 223
-- Name: catalogo_roles_usuario_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_roles_usuario_id_rol_seq OWNED BY public.catalogo_roles_usuario.id_rol;


--
-- TOC entry 222 (class 1259 OID 16475)
-- Name: catalogo_tipos_proceso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_tipos_proceso (
    id_tipo_proceso integer CONSTRAINT tipos_proceso_id_tipo_proceso_not_null NOT NULL,
    nombre_proceso character varying(100) CONSTRAINT tipos_proceso_nombre_proceso_not_null NOT NULL,
    descripcion text
);


ALTER TABLE public.catalogo_tipos_proceso OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16407)
-- Name: ciudadanos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudadanos (
    id_ciudadano integer NOT NULL,
    tipo_documento character varying(20) NOT NULL,
    numero_documento character varying(20) NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    telefono character varying(20) NOT NULL,
    correo character varying(100),
    direccion text NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento date NOT NULL,
    genero character varying(20) NOT NULL,
    CONSTRAINT chk_fecha_nacimiento CHECK ((fecha_nacimiento <= CURRENT_DATE)),
    CONSTRAINT chk_genero CHECK (((genero)::text = ANY ((ARRAY['Femenino'::character varying, 'Masculino'::character varying, 'Otro'::character varying])::text[]))),
    CONSTRAINT chk_tipo_documento CHECK (((tipo_documento)::text = ANY ((ARRAY['CC'::character varying, 'TI'::character varying, 'CE'::character varying, 'PAS'::character varying])::text[])))
);


ALTER TABLE public.ciudadanos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16406)
-- Name: ciudadanos_id_ciudadano_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ciudadanos_id_ciudadano_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ciudadanos_id_ciudadano_seq OWNER TO postgres;

--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 219
-- Name: ciudadanos_id_ciudadano_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ciudadanos_id_ciudadano_seq OWNED BY public.ciudadanos.id_ciudadano;


--
-- TOC entry 236 (class 1259 OID 16606)
-- Name: participantes_caso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participantes_caso (
    id_participacion integer NOT NULL,
    id_caso integer NOT NULL,
    id_ciudadano integer NOT NULL,
    id_rol_part integer NOT NULL
);


ALTER TABLE public.participantes_caso OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16605)
-- Name: participantes_caso_id_participacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participantes_caso_id_participacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participantes_caso_id_participacion_seq OWNER TO postgres;

--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 235
-- Name: participantes_caso_id_participacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participantes_caso_id_participacion_seq OWNED BY public.participantes_caso.id_participacion;


--
-- TOC entry 250 (class 1259 OID 16771)
-- Name: reporte_casos_estado; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.reporte_casos_estado AS
 SELECT e.nombre_estado,
    count(*) AS cantidad
   FROM (public.casos c
     JOIN public.catalogo_estados_caso e ON ((c.id_estado = e.id_estado)))
  GROUP BY e.nombre_estado;


ALTER VIEW public.reporte_casos_estado OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16775)
-- Name: reporte_tipos_proceso; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.reporte_tipos_proceso AS
 SELECT p.nombre_proceso,
    count(*) AS cantidad
   FROM (public.casos c
     JOIN public.catalogo_tipos_proceso p ON ((c.id_tipo_proceso = p.id_tipo_proceso)))
  GROUP BY p.nombre_proceso;


ALTER VIEW public.reporte_tipos_proceso OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16633)
-- Name: seguimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seguimiento (
    id_seguimiento integer NOT NULL,
    id_caso integer NOT NULL,
    id_usuario integer NOT NULL,
    descripcion text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_accion integer NOT NULL
);


ALTER TABLE public.seguimiento OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16632)
-- Name: seguimiento_id_seguimiento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seguimiento_id_seguimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seguimiento_id_seguimiento_seq OWNER TO postgres;

--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 237
-- Name: seguimiento_id_seguimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seguimiento_id_seguimiento_seq OWNED BY public.seguimiento.id_seguimiento;


--
-- TOC entry 221 (class 1259 OID 16474)
-- Name: tipos_proceso_id_tipo_proceso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_proceso_id_tipo_proceso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_proceso_id_tipo_proceso_seq OWNER TO postgres;

--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 221
-- Name: tipos_proceso_id_tipo_proceso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_proceso_id_tipo_proceso_seq OWNED BY public.catalogo_tipos_proceso.id_tipo_proceso;


--
-- TOC entry 232 (class 1259 OID 16549)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(100),
    correo character varying(100),
    password_hash character varying(255),
    id_rol integer NOT NULL,
    estado boolean DEFAULT true,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16548)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 231
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 247 (class 1259 OID 16756)
-- Name: vista_carga_funcionarios; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_carga_funcionarios AS
 SELECT u.nombre,
    count(c.id_caso) AS total_casos
   FROM (public.usuarios u
     LEFT JOIN public.casos c ON ((u.id_usuario = c.id_usuario_asignado)))
  GROUP BY u.nombre;


ALTER VIEW public.vista_carga_funcionarios OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16748)
-- Name: vista_casos_activos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_casos_activos AS
 SELECT c.id_caso,
    c.numero_radicado,
    e.nombre_estado,
    p.nombre_prioridad
   FROM ((public.casos c
     JOIN public.catalogo_estados_caso e ON ((c.id_estado = e.id_estado)))
     JOIN public.catalogo_prioridades p ON ((c.id_prioridad = p.id_prioridad)))
  WHERE (c.id_estado <> 5);


ALTER VIEW public.vista_casos_activos OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16752)
-- Name: vista_casos_cerrados; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_casos_cerrados AS
 SELECT id_caso,
    numero_radicado,
    id_tipo_proceso,
    id_estado,
    id_prioridad,
    descripcion_hechos,
    fecha_apertura,
    id_usuario_creador,
    id_usuario_asignado
   FROM public.casos
  WHERE (id_estado = 5);


ALTER VIEW public.vista_casos_cerrados OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 16761)
-- Name: vista_historial_casos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_historial_casos AS
 SELECT id_caso,
    descripcion,
    fecha_registro
   FROM public.seguimiento s;


ALTER VIEW public.vista_historial_casos OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16765)
-- Name: vista_usuarios_roles; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_usuarios_roles AS
 SELECT u.id_usuario,
    u.nombre,
    u.correo,
    r.nombre_rol,
    u.estado
   FROM (public.usuarios u
     JOIN public.catalogo_roles_usuario r ON ((u.id_rol = r.id_rol)));


ALTER VIEW public.vista_usuarios_roles OWNER TO postgres;

--
-- TOC entry 4975 (class 2604 OID 16671)
-- Name: asignaciones id_asignacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignaciones ALTER COLUMN id_asignacion SET DEFAULT nextval('public.asignaciones_id_asignacion_seq'::regclass);


--
-- TOC entry 4977 (class 2604 OID 16734)
-- Name: auditoria_general id_auditoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_general ALTER COLUMN id_auditoria SET DEFAULT nextval('public.auditoria_general_id_auditoria_seq'::regclass);


--
-- TOC entry 4969 (class 2604 OID 16570)
-- Name: casos id_caso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.casos ALTER COLUMN id_caso SET DEFAULT nextval('public.casos_id_caso_seq'::regclass);


--
-- TOC entry 4974 (class 2604 OID 16660)
-- Name: catalogo_acciones id_accion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_acciones ALTER COLUMN id_accion SET DEFAULT nextval('public.catalogo_acciones_id_accion_seq'::regclass);


--
-- TOC entry 4963 (class 2604 OID 16519)
-- Name: catalogo_estados_caso id_estado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_estados_caso ALTER COLUMN id_estado SET DEFAULT nextval('public.catalogo_estados_caso_id_estado_seq'::regclass);


--
-- TOC entry 4964 (class 2604 OID 16530)
-- Name: catalogo_prioridades id_prioridad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_prioridades ALTER COLUMN id_prioridad SET DEFAULT nextval('public.catalogo_prioridades_id_prioridad_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 16541)
-- Name: catalogo_roles_participacion id_rol_part; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles_participacion ALTER COLUMN id_rol_part SET DEFAULT nextval('public.catalogo_roles_participacion_id_rol_part_seq'::regclass);


--
-- TOC entry 4962 (class 2604 OID 16497)
-- Name: catalogo_roles_usuario id_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles_usuario ALTER COLUMN id_rol SET DEFAULT nextval('public.catalogo_roles_usuario_id_rol_seq'::regclass);


--
-- TOC entry 4961 (class 2604 OID 16478)
-- Name: catalogo_tipos_proceso id_tipo_proceso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tipos_proceso ALTER COLUMN id_tipo_proceso SET DEFAULT nextval('public.tipos_proceso_id_tipo_proceso_seq'::regclass);


--
-- TOC entry 4959 (class 2604 OID 16410)
-- Name: ciudadanos id_ciudadano; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudadanos ALTER COLUMN id_ciudadano SET DEFAULT nextval('public.ciudadanos_id_ciudadano_seq'::regclass);


--
-- TOC entry 4971 (class 2604 OID 16609)
-- Name: participantes_caso id_participacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes_caso ALTER COLUMN id_participacion SET DEFAULT nextval('public.participantes_caso_id_participacion_seq'::regclass);


--
-- TOC entry 4972 (class 2604 OID 16636)
-- Name: seguimiento id_seguimiento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento ALTER COLUMN id_seguimiento SET DEFAULT nextval('public.seguimiento_id_seguimiento_seq'::regclass);


--
-- TOC entry 4966 (class 2604 OID 16552)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 5225 (class 0 OID 16668)
-- Dependencies: 242
-- Data for Name: asignaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asignaciones (id_asignacion, id_caso, usuario_anterior, usuario_nuevo, fecha_asignacion) FROM stdin;
1	1	1	5	2026-04-28 11:45:06.387148
2	1	5	2	2026-04-28 14:19:54.733149
\.


--
-- TOC entry 5227 (class 0 OID 16731)
-- Dependencies: 244
-- Data for Name: auditoria_general; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditoria_general (id_auditoria, tabla_afectada, accion, usuario_bd, fecha_evento, detalle) FROM stdin;
1	casos	UPDATE	postgres	2026-04-28 14:37:29.418907	Operacion registrada automaticamente
2	casos	INSERT	postgres	2026-04-28 15:10:43.380077	INSERT ejecutado sobre casos
3	casos	UPDATE	postgres	2026-04-28 15:14:46.251313	UPDATE ejecutado sobre casos
4	casos	UPDATE	postgres	2026-04-28 15:20:21.218613	UPDATE ejecutado sobre casos
5	casos	INSERT	postgres	2026-04-28 15:24:46.468666	INSERT ejecutado sobre casos
6	casos	UPDATE	postgres	2026-04-28 15:26:35.932083	UPDATE ejecutado sobre casos
7	casos	UPDATE	postgres	2026-04-28 15:27:00.097762	UPDATE ejecutado sobre casos
8	casos	UPDATE	postgres	2026-04-28 15:27:35.051308	UPDATE ejecutado sobre casos
9	casos	UPDATE	postgres	2026-04-28 15:28:29.415454	UPDATE ejecutado sobre casos
10	casos	UPDATE	postgres	2026-04-28 15:31:48.984534	UPDATE ejecutado sobre casos
11	casos	UPDATE	postgres	2026-04-28 15:33:49.344459	UPDATE ejecutado sobre casos
12	casos	UPDATE	postgres	2026-04-28 15:34:42.317754	UPDATE ejecutado sobre casos
13	casos	UPDATE	postgres	2026-04-28 15:36:00.959997	UPDATE ejecutado sobre casos
14	casos	UPDATE	postgres	2026-04-28 15:59:59.456164	UPDATE ejecutado sobre casos
15	casos	UPDATE	postgres	2026-04-28 16:00:06.328564	UPDATE ejecutado sobre casos
\.


--
-- TOC entry 5217 (class 0 OID 16567)
-- Dependencies: 234
-- Data for Name: casos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.casos (id_caso, numero_radicado, id_tipo_proceso, id_estado, id_prioridad, descripcion_hechos, fecha_apertura, id_usuario_creador, id_usuario_asignado) FROM stdin;
2	RAD-002	2	1	2	Caso de alimentos	2026-04-28	1	\N
1	RAD-001	3	1	1	Descripcion modificada por auditoria	2026-04-28	1	2
4	RAD-004	1	3	2	Caso creado con procedimiento almacenado	2026-04-28	1	\N
3	RAD-003	2	3	1	Caso actualizado desde backend para probar trigger	2026-04-28	1	1
\.


--
-- TOC entry 5223 (class 0 OID 16657)
-- Dependencies: 240
-- Data for Name: catalogo_acciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_acciones (id_accion, nombre_accion) FROM stdin;
1	Creacion caso
2	Actualizacion
3	Reasignacion
4	Seguimiento
5	Cierre
\.


--
-- TOC entry 5209 (class 0 OID 16516)
-- Dependencies: 226
-- Data for Name: catalogo_estados_caso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_estados_caso (id_estado, nombre_estado) FROM stdin;
1	Abierto
2	En tramite
3	Inactivo
4	Pendiente audiencia
5	Cerrado
\.


--
-- TOC entry 5211 (class 0 OID 16527)
-- Dependencies: 228
-- Data for Name: catalogo_prioridades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_prioridades (id_prioridad, nombre_prioridad) FROM stdin;
1	Alta
2	Media
3	Baja
\.


--
-- TOC entry 5213 (class 0 OID 16538)
-- Dependencies: 230
-- Data for Name: catalogo_roles_participacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_roles_participacion (id_rol_part, nombre_rol) FROM stdin;
1	Denunciante
2	Denunciado
3	Victima
4	Testigo
5	Acudiente
6	Representante
\.


--
-- TOC entry 5207 (class 0 OID 16494)
-- Dependencies: 224
-- Data for Name: catalogo_roles_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_roles_usuario (id_rol, nombre_rol) FROM stdin;
1	ADMIN
2	COMISARIO
3	AUXILIAR
4	TECNICO
5	TRABAJADOR_SOCIAL
6	PSICOLOGO
7	ABOGADO
8	NOTIFICADOR
\.


--
-- TOC entry 5205 (class 0 OID 16475)
-- Dependencies: 222
-- Data for Name: catalogo_tipos_proceso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_tipos_proceso (id_tipo_proceso, nombre_proceso, descripcion) FROM stdin;
1	Violencia intrafamiliar	Procesos por violencia intrafamiliar
2	Alimentos	Procesos de cuota alimentaria
3	Custodia	Procesos relacionados con custodia
4	PARD	Proceso Administrativo de Restablecimiento de Derechos
5	Verificacion de derechos	Proceso de verificación de derechos
6	Verificacion adulto mayor	Proceso protección adulto mayor
\.


--
-- TOC entry 5203 (class 0 OID 16407)
-- Dependencies: 220
-- Data for Name: ciudadanos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciudadanos (id_ciudadano, tipo_documento, numero_documento, nombre_completo, telefono, correo, direccion, fecha_registro, fecha_nacimiento, genero) FROM stdin;
1	CC	1088123456	Maria Gomez	3001234567	maria@test.com	Barrio Cuba, Pereira	2026-04-28 10:54:30.560534	1990-05-14	Femenino
3	CC	10881221356	Maria Rodriguez	3001111111	maria@mail.com	Pereira	2026-04-28 11:39:22.156422	1990-05-14	Femenino
4	CC	109953444	Juan Rodriguez	3002222222	juan@mail.com	Dosquebradas	2026-04-28 11:39:22.156422	1988-07-10	Masculino
5	CC	1077331211	Laura Martinez	3003333333	laura@mail.com	Pereira	2026-04-28 11:39:22.156422	1995-02-21	Femenino
\.


--
-- TOC entry 5219 (class 0 OID 16606)
-- Dependencies: 236
-- Data for Name: participantes_caso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participantes_caso (id_participacion, id_caso, id_ciudadano, id_rol_part) FROM stdin;
3	1	4	2
4	1	3	1
\.


--
-- TOC entry 5221 (class 0 OID 16633)
-- Dependencies: 238
-- Data for Name: seguimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seguimiento (id_seguimiento, id_caso, id_usuario, descripcion, fecha_registro, id_accion) FROM stdin;
1	1	1	Estado cambió de En tramite a Abierto. Prioridad cambió de Media a Alta. 	2026-04-28 14:33:18.723733	2
2	1	1	Tipo de proceso cambió de Violencia intrafamiliar a Custodia. 	2026-04-28 14:35:07.013254	2
3	1	1	Caso reasignado de Maria Gomez a Carlos Ruiz	2026-04-28 14:36:49.94594	3
4	3	1	Creacion automatica del expediente	2026-04-28 15:10:43.380077	1
5	3	1	Estado cambió de Abierto a En tramite. Prioridad cambió de Alta a Baja. Descripción del expediente actualizada. 	2026-04-28 15:14:46.251313	2
6	3	1	\N	2026-04-28 15:20:21.218613	3
7	4	1	Creacion automatica del expediente	2026-04-28 15:24:46.468666	1
8	3	1	Caso reasignado de Carlos Ruiz a Pedro Diaz	2026-04-28 15:26:35.932083	3
9	3	1	Estado cambió de En tramite a Inactivo. 	2026-04-28 15:27:00.097762	2
10	3	1	Prioridad cambió de Baja a Alta. 	2026-04-28 15:31:48.984534	2
11	4	1	Estado cambió de Abierto a Inactivo. 	2026-04-28 15:33:49.344459	2
12	3	1	Caso reasignado de Pedro Diaz a Maria Gomez	2026-04-28 15:59:59.456164	3
\.


--
-- TOC entry 5215 (class 0 OID 16549)
-- Dependencies: 232
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, nombre, correo, password_hash, id_rol, estado, fecha_creacion) FROM stdin;
1	Maria Gomez	comisario@demo.com	123	2	t	2026-04-28 11:37:40.940097
2	Carlos Ruiz	auxiliar@demo.com	123	3	t	2026-04-28 11:37:40.940097
3	Laura Torres	trabsocial@demo.com	123	5	t	2026-04-28 11:37:40.940097
4	Ana Perez	psicologa@demo.com	123	6	t	2026-04-28 11:37:40.940097
5	Pedro Diaz	abogado@demo.com	123	7	t	2026-04-28 11:37:40.940097
6	Luis Moreno	notificador@demo.com	123	8	t	2026-04-28 11:37:40.940097
\.


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 241
-- Name: asignaciones_id_asignacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asignaciones_id_asignacion_seq', 2, true);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 243
-- Name: auditoria_general_id_auditoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditoria_general_id_auditoria_seq', 15, true);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 233
-- Name: casos_id_caso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.casos_id_caso_seq', 4, true);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 239
-- Name: catalogo_acciones_id_accion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_acciones_id_accion_seq', 5, true);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 225
-- Name: catalogo_estados_caso_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_estados_caso_id_estado_seq', 4, true);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 227
-- Name: catalogo_prioridades_id_prioridad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_prioridades_id_prioridad_seq', 3, true);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 229
-- Name: catalogo_roles_participacion_id_rol_part_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_roles_participacion_id_rol_part_seq', 6, true);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 223
-- Name: catalogo_roles_usuario_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_roles_usuario_id_rol_seq', 9, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 219
-- Name: ciudadanos_id_ciudadano_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciudadanos_id_ciudadano_seq', 5, true);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 235
-- Name: participantes_caso_id_participacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participantes_caso_id_participacion_seq', 4, true);


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 237
-- Name: seguimiento_id_seguimiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seguimiento_id_seguimiento_seq', 12, true);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 221
-- Name: tipos_proceso_id_tipo_proceso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_proceso_id_tipo_proceso_seq', 6, true);


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 231
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 6, true);


--
-- TOC entry 5023 (class 2606 OID 16677)
-- Name: asignaciones asignaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT asignaciones_pkey PRIMARY KEY (id_asignacion);


--
-- TOC entry 5025 (class 2606 OID 16740)
-- Name: auditoria_general auditoria_general_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_general
    ADD CONSTRAINT auditoria_general_pkey PRIMARY KEY (id_auditoria);


--
-- TOC entry 5011 (class 2606 OID 16584)
-- Name: casos casos_numero_radicado_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.casos
    ADD CONSTRAINT casos_numero_radicado_key UNIQUE (numero_radicado);


--
-- TOC entry 5013 (class 2606 OID 16582)
-- Name: casos casos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.casos
    ADD CONSTRAINT casos_pkey PRIMARY KEY (id_caso);


--
-- TOC entry 5019 (class 2606 OID 16666)
-- Name: catalogo_acciones catalogo_acciones_nombre_accion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_acciones
    ADD CONSTRAINT catalogo_acciones_nombre_accion_key UNIQUE (nombre_accion);


--
-- TOC entry 5021 (class 2606 OID 16664)
-- Name: catalogo_acciones catalogo_acciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_acciones
    ADD CONSTRAINT catalogo_acciones_pkey PRIMARY KEY (id_accion);


--
-- TOC entry 4995 (class 2606 OID 16525)
-- Name: catalogo_estados_caso catalogo_estados_caso_nombre_estado_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_estados_caso
    ADD CONSTRAINT catalogo_estados_caso_nombre_estado_key UNIQUE (nombre_estado);


--
-- TOC entry 4997 (class 2606 OID 16523)
-- Name: catalogo_estados_caso catalogo_estados_caso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_estados_caso
    ADD CONSTRAINT catalogo_estados_caso_pkey PRIMARY KEY (id_estado);


--
-- TOC entry 4999 (class 2606 OID 16536)
-- Name: catalogo_prioridades catalogo_prioridades_nombre_prioridad_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_prioridades
    ADD CONSTRAINT catalogo_prioridades_nombre_prioridad_key UNIQUE (nombre_prioridad);


--
-- TOC entry 5001 (class 2606 OID 16534)
-- Name: catalogo_prioridades catalogo_prioridades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_prioridades
    ADD CONSTRAINT catalogo_prioridades_pkey PRIMARY KEY (id_prioridad);


--
-- TOC entry 5003 (class 2606 OID 16547)
-- Name: catalogo_roles_participacion catalogo_roles_participacion_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles_participacion
    ADD CONSTRAINT catalogo_roles_participacion_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 5005 (class 2606 OID 16545)
-- Name: catalogo_roles_participacion catalogo_roles_participacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles_participacion
    ADD CONSTRAINT catalogo_roles_participacion_pkey PRIMARY KEY (id_rol_part);


--
-- TOC entry 4991 (class 2606 OID 16503)
-- Name: catalogo_roles_usuario catalogo_roles_usuario_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles_usuario
    ADD CONSTRAINT catalogo_roles_usuario_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 4993 (class 2606 OID 16501)
-- Name: catalogo_roles_usuario catalogo_roles_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_roles_usuario
    ADD CONSTRAINT catalogo_roles_usuario_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4983 (class 2606 OID 16421)
-- Name: ciudadanos ciudadanos_numero_documento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudadanos
    ADD CONSTRAINT ciudadanos_numero_documento_key UNIQUE (numero_documento);


--
-- TOC entry 4985 (class 2606 OID 16419)
-- Name: ciudadanos ciudadanos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudadanos
    ADD CONSTRAINT ciudadanos_pkey PRIMARY KEY (id_ciudadano);


--
-- TOC entry 5015 (class 2606 OID 16615)
-- Name: participantes_caso participantes_caso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes_caso
    ADD CONSTRAINT participantes_caso_pkey PRIMARY KEY (id_participacion);


--
-- TOC entry 5017 (class 2606 OID 16645)
-- Name: seguimiento seguimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento
    ADD CONSTRAINT seguimiento_pkey PRIMARY KEY (id_seguimiento);


--
-- TOC entry 4987 (class 2606 OID 16486)
-- Name: catalogo_tipos_proceso tipos_proceso_nombre_proceso_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tipos_proceso
    ADD CONSTRAINT tipos_proceso_nombre_proceso_key UNIQUE (nombre_proceso);


--
-- TOC entry 4989 (class 2606 OID 16484)
-- Name: catalogo_tipos_proceso tipos_proceso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_tipos_proceso
    ADD CONSTRAINT tipos_proceso_pkey PRIMARY KEY (id_tipo_proceso);


--
-- TOC entry 5007 (class 2606 OID 16560)
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- TOC entry 5009 (class 2606 OID 16558)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 5042 (class 2620 OID 16770)
-- Name: casos trg_validar_cierre; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_validar_cierre BEFORE UPDATE OF id_estado ON public.casos FOR EACH ROW EXECUTE FUNCTION public.validar_cierre();


--
-- TOC entry 5043 (class 2620 OID 16743)
-- Name: casos trigger_auditoria_casos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_auditoria_casos AFTER INSERT OR DELETE OR UPDATE ON public.casos FOR EACH ROW EXECUTE FUNCTION public.log_auditoria_general();


--
-- TOC entry 5044 (class 2620 OID 16717)
-- Name: casos trigger_cambios_detallados; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_cambios_detallados AFTER UPDATE ON public.casos FOR EACH ROW EXECUTE FUNCTION public.log_cambios_detallados();


--
-- TOC entry 5045 (class 2620 OID 16707)
-- Name: casos trigger_creacion_caso; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_creacion_caso AFTER INSERT ON public.casos FOR EACH ROW EXECUTE FUNCTION public.log_creacion_caso();


--
-- TOC entry 5041 (class 2620 OID 16711)
-- Name: ciudadanos trigger_proteger_ciudadano; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_proteger_ciudadano BEFORE DELETE ON public.ciudadanos FOR EACH ROW EXECUTE FUNCTION public.impedir_borrar_ciudadano();


--
-- TOC entry 5047 (class 2620 OID 16709)
-- Name: asignaciones trigger_reasignacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_reasignacion AFTER INSERT ON public.asignaciones FOR EACH ROW EXECUTE FUNCTION public.log_reasignacion();


--
-- TOC entry 5046 (class 2620 OID 16729)
-- Name: casos trigger_reasignacion_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_reasignacion_update AFTER UPDATE ON public.casos FOR EACH ROW EXECUTE FUNCTION public.log_reasignacion_update();


--
-- TOC entry 5038 (class 2606 OID 16678)
-- Name: asignaciones asignaciones_id_caso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT asignaciones_id_caso_fkey FOREIGN KEY (id_caso) REFERENCES public.casos(id_caso);


--
-- TOC entry 5039 (class 2606 OID 16683)
-- Name: asignaciones asignaciones_usuario_anterior_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT asignaciones_usuario_anterior_fkey FOREIGN KEY (usuario_anterior) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 5040 (class 2606 OID 16688)
-- Name: asignaciones asignaciones_usuario_nuevo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT asignaciones_usuario_nuevo_fkey FOREIGN KEY (usuario_nuevo) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 5027 (class 2606 OID 16590)
-- Name: casos casos_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.casos
    ADD CONSTRAINT casos_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.catalogo_estados_caso(id_estado);


--
-- TOC entry 5028 (class 2606 OID 16595)
-- Name: casos casos_id_prioridad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.casos
    ADD CONSTRAINT casos_id_prioridad_fkey FOREIGN KEY (id_prioridad) REFERENCES public.catalogo_prioridades(id_prioridad);


--
-- TOC entry 5029 (class 2606 OID 16723)
-- Name: casos casos_id_usuario_asignado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.casos
    ADD CONSTRAINT casos_id_usuario_asignado_fkey FOREIGN KEY (id_usuario_asignado) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 5030 (class 2606 OID 16600)
-- Name: casos casos_id_usuario_creador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.casos
    ADD CONSTRAINT casos_id_usuario_creador_fkey FOREIGN KEY (id_usuario_creador) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 5035 (class 2606 OID 16698)
-- Name: seguimiento fk_accion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento
    ADD CONSTRAINT fk_accion FOREIGN KEY (id_accion) REFERENCES public.catalogo_acciones(id_accion);


--
-- TOC entry 5031 (class 2606 OID 16693)
-- Name: casos fk_tipo_proceso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.casos
    ADD CONSTRAINT fk_tipo_proceso FOREIGN KEY (id_tipo_proceso) REFERENCES public.catalogo_tipos_proceso(id_tipo_proceso);


--
-- TOC entry 5032 (class 2606 OID 16616)
-- Name: participantes_caso participantes_caso_id_caso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes_caso
    ADD CONSTRAINT participantes_caso_id_caso_fkey FOREIGN KEY (id_caso) REFERENCES public.casos(id_caso);


--
-- TOC entry 5033 (class 2606 OID 16621)
-- Name: participantes_caso participantes_caso_id_ciudadano_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes_caso
    ADD CONSTRAINT participantes_caso_id_ciudadano_fkey FOREIGN KEY (id_ciudadano) REFERENCES public.ciudadanos(id_ciudadano);


--
-- TOC entry 5034 (class 2606 OID 16626)
-- Name: participantes_caso participantes_caso_id_rol_part_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes_caso
    ADD CONSTRAINT participantes_caso_id_rol_part_fkey FOREIGN KEY (id_rol_part) REFERENCES public.catalogo_roles_participacion(id_rol_part);


--
-- TOC entry 5036 (class 2606 OID 16646)
-- Name: seguimiento seguimiento_id_caso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento
    ADD CONSTRAINT seguimiento_id_caso_fkey FOREIGN KEY (id_caso) REFERENCES public.casos(id_caso);


--
-- TOC entry 5037 (class 2606 OID 16651)
-- Name: seguimiento seguimiento_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento
    ADD CONSTRAINT seguimiento_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 5026 (class 2606 OID 16561)
-- Name: usuarios usuarios_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.catalogo_roles_usuario(id_rol);


-- Completed on 2026-04-28 20:38:48

--
-- PostgreSQL database dump complete
--

\unrestrict n78NOkakspSNIe363cQEjymjO419Y6m7Yv0LcRxrdXc1shFFbepCCQlgKKVjd2u

