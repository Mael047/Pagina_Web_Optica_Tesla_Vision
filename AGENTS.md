# Optica Tesla Vision - Development Notes

## Architecture
- Vanilla PHP/PostgreSQL backend with vanilla HTML/CSS/JS frontend
- No build tools, no npm, no bundler
- Database: PostgreSQL `opticateslavision` in Docker (localhost:5432)

## Database Connection
- Driver: PDO PostgreSQL
- Host: localhost, Port: 5432
- Database: opticateslavision
- User: opticauser, Password: optica2024
- Connection file: `api/conexion_pg.php` (MySQL backup: `api/conexion_mysql.php`)

## Running
- Requires PHP server (e.g., `php -S localhost:8000`) and PostgreSQL Docker container running
- Start DB: `docker start optica_pg`
- Open `index.html` or any `.html` file via the PHP server

## Authentication
Three auth JS files for different page types:
- `js/auth.js` - Login page (index.html modal)
- `js/auth2.js` - Admin pages (profile_admin.html)
- `js/auth3.js` - User pages (profile.html)

Cookie-based auth: `token`, `rol` (admin/user), `user_correo`, `id`

## Database Tables
- `usuarios` - Users (id, nombre, correo, password, rol, telefono, direccion)
- `productos` - Products (id, nombre, marca, material, valor, descuento, referencia, descripcion, imagen, imagen2, imagen3, categoria)
- `pedidos` - Orders (id, usuario_id, order_id, total, estado, datos_envio, datos_pago)
- `pedido_items` - Order items (id, pedido_id, producto_referencia, nombre, cantidad, precio)

## API Endpoints
- `api/auth/auth.php` - Login (prepared statements)
- `api/get/productos.php` - List products
- `api/get/producto.php` - Get single product
- `api/get/get_usuario.php` - Get user(s)
- `api/post/registro.php` - Create product
- `api/post/usuario.php` - Create user
- `api/post/actualizar_producto.php` - Update product
- `api/post/actualizar_usuario.php` - Update user
- `api/post/orden.php` - Create order (uses relational tables)
- `api/delete/eliminar_producto.php` - Delete product

## Security
- All queries use PDO prepared statements (SQL injection protected)
- Passwords hashed with `password_hash()` / `password_verify()`
- Input validation on all endpoints

## Directory Structure
- `api/` - PHP endpoints (auth/, get/, post/, delete/)
- `api/setup/` - Database schema (migrate_schema.sql)
- `js/` - JavaScript modules (one per feature)
- `css/` - Stylesheets (estilos_paginas/ for page-specific, estilo_*.css for components)
- `components/` - Reusable HTML snippets (nav_bar, footer, etc.)
- `datos/productos.json` - Static product data (backup)
- `imagenes/` - Product images (uploaded via admin)
- `img/` - Site assets (logo, banners)

## Accomplished

### Database & Backend
- ✅ Set up PostgreSQL in Docker with connection file `api/conexion_pg.php`
- ✅ Created `api/setup/migrate_schema.sql` with 4 tables
- ✅ Refactored all 9 PHP APIs to use PDO prepared statements
- ✅ Created admin user: admin@teslavision.com / password

### Frontend Updates
- ✅ Added responsive hamburger menu to navbar (all pages now consistent)
- ✅ Fixed login modal CSS
- ✅ Created offers section in homepage with `js/ofertas.js`
- ✅ Moved offers section after carousel
- ✅ Improved homepage styles (gradients, shadows, hover effects)
- ✅ Improved catalog styles (badges, cards, placeholders)

### Pages with Updated Navbar (new structure without `<ul><li>`)
- `index.html`
- `Catalogo.html`
- `carrito.html`
- `producto.html` (also fixed HTML bug in register modal)
- `acc_catalogo.html`
- `search.html`
- `components/nav_bar.html`

### Pending
- Review cart page CSS (`estilo_carrito.css`)
- Review product page CSS (`productos.css`)
- Test responsive behavior on mobile
