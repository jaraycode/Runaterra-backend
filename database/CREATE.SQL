-- CREATE DATABASE RUNATERRANS;

CREATE TABLE indicador(
    indicador_id SERIAL NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_indicador PRIMARY KEY (indicador_id)
);

CREATE TABLE usuario(
    usuario_id SERIAL NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    rol VARCHAR(10) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    CONSTRAINT check_rol CHECK (rol in ('admin', 'dpto', 'salcedo'))
    CONSTRAINT pk_usuario PRIMARY KEY (usuario_id)
);

CREATE TABLE departamento(
    dpto_id SERIAL NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    CONSTRAINT pk_departamento PRIMARY KEY (dpto_id)
);

CREATE TABLE dept_usuario(
    usuario_id NUMERIC NOT NULL,
    dpto_id NUMERIC NOT NULL,
    CONSTRAINT fk_usuario FOREIGN KEY usuario_id REFERENCES usuario(usuario_id),
    CONSTRAINT fk_dpto FOREIGN KEY dpto_id REFERENCES departamento(dpto_id),
    CONSTRAINT pk_categoria_dpto PRIMARY KEY (usuario_id, dpto_id)
);

CREATE TABLE categoria_dpto(
    categoria_id NUMERIC NOT NULL,
    dpto_id NUMERIC NOT NULL,
    CONSTRAINT fk_categoria FOREIGN KEY categoria_id REFERENCES categoria(categoria_id),
    CONSTRAINT fk_dpto FOREIGN KEY dpto_id REFERENCES departamento(dpto_id),
    CONSTRAINT pk_categoria_dpto PRIMARY KEY (categoria_id, dpto_id)
);

CREATE TABLE aporteDeInformacion(
    adi_id SERIAL NOT NULL,
    usuario_id NUMERIC NOT NULL
    fecha_hora TIMESTAMP NOT NULL,
    descripcion TEXT,

);

CREATE TABLE criterio(
    criterio_id SERIAL NOT NULL,
    indicador_id NUMERIC NOT NULL,
    nombre VARCHAR(50),
    descripcion TEXT,
    CONSTRAINT fk_indicador FOREIGN KEY indicador_id REFERENCES indicador(indicador_id),
    CONSTRAINT pk_criterio PRIMARY KEY (criterio_id, indicador_id)
);

CREATE TABLE categoria(
    categoria_id SERIAL NOT NULL,
    indicador_id NUMERIC NOT NULL,
    criterio_id NUMERIC NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT, 
    CONSTRAINT fk_indicador_criterio FOREIGN KEY indicador_id, criterio_id REFERENCES criterio(indicador_id, criterio_id),
    CONSTRAINT pk_categoria PRIMARY KEY (categoria_id, indicador_id, criterio_id)
);

CREATE TABLE archivo(
    archivo_id SERIAL NOT NULL,
    url VARCHAR(100) NOT NULL,
    CONSTRAINT pk_archivo PRIMARY KEY (archivo_id)
);

CREATE TABLE evidencia(
    evidencia_id SERIAL NOT NULL,
    link VARCHAR(100) NOT NULL,
    photo, -- Por determinar tipo de dato
    CONSTRAINT pk_archivo PRIMARY KEY (archivo_id)
);
