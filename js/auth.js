window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const accesoLogin = document.getElementById("acceso");

    const token = getCookie("token");
    const rolExistente = getCookie("rol");

    if (token && accesoLogin) {
        if (rolExistente === "admin") {
            accesoLogin.setAttribute("href", "profile_admin.html");
        } else {
            accesoLogin.setAttribute("href", "profile.html");
        }
    }

    if(!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        try {
            const response = await fetch("api/auth/auth.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result);

            const respuestaSpan = document.getElementById("respuesta");
            if (respuestaSpan) {
                respuestaSpan.textContent = result.mensaje || "";
            }

            if (result.status === "success") {
                // 1) Guardamos cookie de login (1 día)
                setCookie("token", "true", 1);
                const rol = result.rol ?? "user";
                setCookie("rol", rol, 1);

                document.cookie = `user_correo=${encodeURIComponent(result.correo)}; path=/; max-age=${86400}`;
                document.cookie = `id=${result.id}; path=/`;

                // 2) Icono ahora apunta al perfil admin
                if (accesoLogin) {
                    if (rol === "admin") {
                        accesoLogin.setAttribute("href", "profile_admin.html");
                    } else {
                        accesoLogin.setAttribute("href", "profile.html");
                    }
                }

                // 3) Cerramos modal
                const overlay = document.getElementById("login-overlay");
                if (overlay) {
                    overlay.classList.remove("activo");
                }

                // 4) Redirigimos al admin
                if (rol === "admin") {
                    window.location.href = "profile_admin.html";
                } else {
                    window.location.href = "profile.html";
                }
            }
        } catch (err) {
            console.error(err);
            const respuestaSpan = document.getElementById("respuesta");
            if (respuestaSpan) {
                respuestaSpan.textContent = "Error de conexión. Intenta de nuevo.";
            }
        }
    });
});

function setCookie(cname , cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}