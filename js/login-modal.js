// Helper local para leer cookie en esta página
function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let c of ca) {
        c = c.trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

document.addEventListener('DOMContentLoaded', () => {
    // -------- Referencias generales --------
    const loginOverlay = document.getElementById('login-overlay');
    const registerOverlay = document.getElementById('register-overlay');

    const openLoginBtns = document.querySelectorAll('.js-open-login');
    const openRegLinks = document.querySelectorAll('.js-open-register');
    const backToLogin = document.querySelectorAll('.js-back-to-login');

    const loginCloseBtn = loginOverlay?.querySelector('.js-close-login');
    const regCloseBtn = registerOverlay?.querySelector('.js-close-register');

    const registerForm = document.getElementById('register-form');

    // -------- Helpers para mostrar/ocultar --------
    const openLogin = () => {
        if (!loginOverlay) return;
        loginOverlay.classList.add('activo');
        registerOverlay?.classList.remove('activo');
    };

    const openRegister = () => {
        if (!registerOverlay) return;
        registerOverlay.classList.add('activo');
        loginOverlay?.classList.remove('activo');
    };

    const closeAll = () => {
        loginOverlay?.classList.remove('activo');
        registerOverlay?.classList.remove('activo');
    };

    // -------- Abrir login (icono perfil, etc.) --------
    openLoginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isLogged = Boolean(getCookie("token"));

            // Si YA está logueado, dejamos que el link funcione normal
            // (href lo pone auth.js a profile_admin.html)
            if (isLogged) {
                return; // NO hacemos preventDefault, NO abrimos modal
            }

            // Si NO está logueado, abrimos el modal
            e.preventDefault();
            openLogin();
        });
    });

    // -------- Desde login → registro ("Crear cuenta") --------
    openRegLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openRegister();
        });
    });

    // -------- Desde registro → login ("Ingresar") --------
    backToLogin.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openLogin();
        });
    });

    // -------- Botones de cerrar --------
    loginCloseBtn?.addEventListener('click', closeAll);
    regCloseBtn?.addEventListener('click', closeAll);

    // -------- Cerrar clicando fuera --------
    loginOverlay?.addEventListener('click', (e) => {
        if (e.target === loginOverlay) closeAll();
    });
    registerOverlay?.addEventListener('click', (e) => {
        if (e.target === registerOverlay) closeAll();
    });

    // -------- Cerrar con ESC --------
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAll();
        }
    });

    if (registerForm) {
        const msg = document.getElementById('register-msg');

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(registerForm);

            const payload = {
                usuario: formData.get('name-reg'),     // <input name="name">
                correo: formData.get('correo-reg'),     // <input name="email">
                password: formData.get('password-reg') // <input name="password">
            };

            try {
                const resp = await fetch("api/post/usuario.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await resp.json();
                console.log(result);

                if (msg) {
                    msg.textContent = result.mensaje || '';
                }

                if (result.status === "success") {
                    setTimeout(() => {
                        if (msg) msg.textContent = '';
                        // cerrar registro y abrir login
                        if (registerOverlay) registerOverlay.classList.remove('activo');
                        if (loginOverlay) loginOverlay.classList.add('activo');
                    }, 1200);
                }
            } catch (err) {
                console.error(err);
                if (msg) {
                    msg.textContent = 'Error de conexión. Intenta de nuevo.';
                }
            }
        });
    }
});
