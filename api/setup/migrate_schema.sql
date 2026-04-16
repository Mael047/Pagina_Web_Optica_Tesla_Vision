-- Migración MySQL → PostgreSQL para Óptica Tesla Vision
-- Schema inicial - sin datos (base vacía)

-- Tabla productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(100),
    material VARCHAR(100),
    valor DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    referencia VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255),
    imagen2 VARCHAR(255),
    imagen3 VARCHAR(255),
    categoria VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'user',
    telefono VARCHAR(20),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla pedidos (reemplaza el JSON en columna TEXT)
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    order_id VARCHAR(50) UNIQUE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pagado',
    datos_envio JSONB,
    datos_pago JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla items del pedido (normalización)
CREATE TABLE pedido_items (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_referencia VARCHAR(50),
    nombre VARCHAR(255),
    cantidad INTEGER DEFAULT 1,
    precio DECIMAL(10,2)
);

-- Índices para rendimiento
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_referencia ON productos(referencia);
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_order_id ON pedidos(order_id);
CREATE INDEX idx_pedido_items_pedido ON pedido_items(pedido_id);
