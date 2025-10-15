(function () {
    const btn = document.getElementById('btnTryon');
    const modal = document.getElementById('modalTryon');
    if (!btn || !modal) return;

    const modalCard = modal.querySelector('.modal-card');
    const closers = modal.querySelectorAll('[data-action="close"]');

    function openModal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        // foco para accesibilidad
        modalCard.focus();
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        btn.focus();
        document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') closeModal();
    }

    btn.addEventListener('click', openModal);
    closers.forEach(c => c.addEventListener('click', closeModal));

    // cerrar clic en backdrop
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) closeModal();
    });

    // evitar que clics dentro del card cierren el modal
    modalCard.addEventListener('click', (e) => e.stopPropagation());
})();