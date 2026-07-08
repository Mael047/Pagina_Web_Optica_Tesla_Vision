# Optica Tesla Vision

Vanilla PHP/PostgreSQL backend + vanilla HTML/CSS/JS frontend. No build tools, no npm, no bundler, no tests, no CI.

## Running

```bash
docker start optica_pg
php -S localhost:8000
# Open http://localhost:8000
```

## Database

- **Host:** localhost:5432, **DB:** opticateslavision, **User:** opticauser, **Pass:** optica2024
- Driver: PDO PostgreSQL (`api/conexion_pg.php`). Old MySQL backup at `api/conexion_mysql.php` (unused).
- Schema: `api/setup/migrate_schema.sql` — 4 tables: `usuarios`, `productos`, `pedidos`, `pedido_items`
- Admin user: `admin@teslavision.com` / `password`

## API Conventions

All endpoints live in `api/{auth,get,post,delete}/`. Every API:
- Sets `header("Content-Type: application/json")` and `include_once "../conexion_pg.php"`
- Uses PDO prepared statements
- Reads JSON body via `json_decode(file_get_contents("php://input"), true)`
- No CORS headers (works only when served by same PHP server)

### Endpoint naming quirks

| File | Actual purpose |
|---|---|
| `api/post/registro.php` | **Create product** (not registration) |
| `api/post/usuario.php` | Create user (registration) |
| `api/post/orden.php` | Create order (reads `id` and `user_correo` from **cookies** server-side) |

## Auth

Cookie-based (no JWT/sessions). Cookies set on login: `token=true`, `rol` (admin/user), `user_correo`, `id`.

Three auth JS files scoped by page:
- `js/auth.js` — Login page (`index.html` modal), also sets cookies
- `js/auth2.js` — Admin pages (`profile_admin.html`), redirects if not admin
- `js/auth3.js` — User pages (`profile.html`), redirects if not logged in

## Image Upload

Products store up to 3 images (`imagen`, `imagen2`, `imagen3` columns). Uploaded as base64 data URLs in the JSON body. Saved to `imagenes/` by `guardarImagen()` (duplicated in `registro.php` and `actualizar_producto.php`). Delete endpoint also removes image files from disk.

## Notable Patterns

- **Navbar** is duplicated inline in every HTML page (no server-side include). `components/nav_bar.html` is a reference copy.
- **Search** uses `search.html?q=...` powered by `js/search.js`
- **Orders** require login cookies (`id`, `user_correo`) to be set on the client before POST
- **Language:** All UI text, DB schema, error messages, and code comments are in Spanish
- **File naming:** Mixed case — `Catalogo.html`, `acc_catalogo.html`, `producto.html`, `carrito.html`, `search.html`, `registro.html`
- **Static backups:** `datos/productos.json` and `datos/productos.xml` exist but are unused (historical)
