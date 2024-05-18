-- CREATE DATABASE IF NOT EXISTS runaterrans;
\c runaterrans
CREATE TABLE IF NOT EXISTS indicador(
    indicador_id SERIAL NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_indicador PRIMARY KEY (indicador_id)
);

CREATE TABLE IF NOT EXISTS usuario(
    usuario_id SERIAL NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    rol VARCHAR(10) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    CONSTRAINT check_rol CHECK (rol in ('admin', 'dpto', 'salcedo')),
    CONSTRAINT pk_usuario PRIMARY KEY (usuario_id)
);

CREATE TABLE IF NOT EXISTS departamento(
    dpto_id SERIAL NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    CONSTRAINT pk_departamento PRIMARY KEY (dpto_id)
);

CREATE TABLE IF NOT EXISTS dept_usuario(
    usuario_id INTEGER NOT NULL,
    dpto_id INTEGER NOT NULL,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id),
    CONSTRAINT fk_dpto FOREIGN KEY (dpto_id) REFERENCES departamento(dpto_id),
    CONSTRAINT pk_usuario_dpto PRIMARY KEY (usuario_id, dpto_id)
);

CREATE TABLE IF NOT EXISTS aporteDeInformacion(
    adi_id SERIAL NOT NULL,
    usuario_id NUMERIC NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS criterio(
    criterio_id SERIAL NOT NULL,
    indicador_id INTEGER NOT NULL,
    nombre VARCHAR(50),
    descripcion TEXT,
    CONSTRAINT fk_indicador FOREIGN KEY (indicador_id) REFERENCES indicador(indicador_id),
    CONSTRAINT pk_criterio PRIMARY KEY (criterio_id, indicador_id)
);

CREATE TABLE IF NOT EXISTS categoria(
    categoria_id SERIAL NOT NULL,
    indicador_id INTEGER NOT NULL,
    criterio_id INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT, 
    CONSTRAINT fk_indicador_criterio FOREIGN KEY (indicador_id, criterio_id) REFERENCES criterio(indicador_id, criterio_id),
    CONSTRAINT pk_categoria PRIMARY KEY (categoria_id, indicador_id, criterio_id)
);

CREATE TABLE IF NOT EXISTS categoria_dpto(
    categoria_id INTEGER NOT NULL,
    indicador_id INTEGER NOT NULL,
    criterio_id INTEGER NOT NULL,
    dpto_id INTEGER NOT NULL,
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_id, indicador_id, criterio_id) REFERENCES categoria(categoria_id, indicador_id, criterio_id),
    CONSTRAINT fk_dpto FOREIGN KEY (dpto_id) REFERENCES departamento(dpto_id),
    CONSTRAINT pk_categoria_dpto PRIMARY KEY (categoria_id, dpto_id)
);

CREATE TABLE IF NOT EXISTS archivo(
    archivo_id SERIAL NOT NULL,
    url VARCHAR(100) NOT NULL,
    CONSTRAINT pk_archivo PRIMARY KEY (archivo_id)
);

CREATE TABLE IF NOT EXISTS evidencia(
    evidencia_id SERIAL NOT NULL,
    link VARCHAR(100) NOT NULL,
    --photo, -- Por determinar tipo de dato
    CONSTRAINT pk_evidencia PRIMARY KEY (evidencia_id)
);
