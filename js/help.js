// Aide : carrousel expliquant chaque page, ouvert sur la page affichée
(() => {
    const modal = document.getElementById('help-modal');
    const content = document.getElementById('help-content');
    const slides = [...modal.querySelectorAll('.help-slide')];
    const prev = document.getElementById('help-prev');
    const next = document.getElementById('help-next');
    const dots = document.getElementById('help-dots');
    const opener = document.getElementById('open-help');
    let index = 0;
    let lastFocus = null;

    slides.forEach((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Aller à : ${slide.querySelector('h2').textContent}`);
        dot.addEventListener('click', () => show(i));
        dots.appendChild(dot);
    });

    function show(i) {
        index = Math.max(0, Math.min(slides.length - 1, i));
        slides.forEach((slide, n) => { slide.hidden = n !== index; });
        [...dots.children].forEach((dot, n) => dot.setAttribute('aria-current', String(n === index)));
        prev.setAttribute('aria-disabled', String(index === 0));
        next.setAttribute('aria-disabled', String(index === slides.length - 1));
        prev.disabled = index === 0;
        next.disabled = index === slides.length - 1;
    }

    function open() {
        const page = document.body.dataset.page;
        const found = slides.findIndex(slide => slide.dataset.help === page);
        show(found === -1 ? 0 : found);
        lastFocus = document.activeElement;
        modal.hidden = false;
        content.focus();
    }

    function close() {
        modal.hidden = true;
        if (lastFocus) lastFocus.focus();
    }

    opener.addEventListener('click', open);
    document.getElementById('help-close').addEventListener('click', close);
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    modal.addEventListener('click', event => { if (event.target === modal) close(); });

    document.addEventListener('keydown', event => {
        if (modal.hidden) return;
        if (event.key === 'Escape') close();
        else if (event.key === 'ArrowRight') show(index + 1);
        else if (event.key === 'ArrowLeft') show(index - 1);
        else if (event.key === 'Tab') {
            const focusables = [...content.querySelectorAll('button:not(:disabled)')];
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === content)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
})();
