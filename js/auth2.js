document.addEventListener("DOMContentLoaded", () => {

    const token = getCookie("token");
    const rol = getCookie("rol");
    const correo = getCookie("user_correo");
    const id = getCookie("id");


    if (!token || rol !== "admin") {
        window.location.href = "index.html";
        return;
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            deleteCookie("token");
            deleteCookie("rol");
            deleteCookie("user_correo");
            deleteCookie("id");
            window.location.href = "index.html";
        });
    }
});


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

function deleteCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}