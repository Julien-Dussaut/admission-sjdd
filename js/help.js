// Aide : carrousel expliquant chaque page, ouvert sur la page affichée
(() => {
    const modal = document.getElementById('help-modal');
    const content = document.getElementById('help-content');
    const slides = [...modal.querySelectorAll('.help-slide')];
    const prev = document.getElementById('help-prev');
    const next = document.getElementById('help-next');
    const tabs = document.getElementById('help-tabs');
    const opener = document.getElementById('open-help');
    let index = 0;
    let lastFocus = null;

    const LABELS = {
        'Les outils en haut de page': 'Outils',
        'Relance mineurs': 'Mineurs',
        'Relance majeurs': 'Majeurs'
    };

    slides.forEach((slide, i) => {
        const title = slide.querySelector('h2').textContent;
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.setAttribute('role', 'tab');
        tab.textContent = LABELS[title] || title;
        tab.addEventListener('click', () => show(i));
        tabs.appendChild(tab);
    });

    function show(i) {
        // Carrousel infini : on boucle entre le début et la fin
        index = (i + slides.length) % slides.length;
        slides.forEach((slide, n) => { slide.hidden = n !== index; });
        [...tabs.children].forEach((tab, n) => {
            tab.setAttribute('aria-selected', String(n === index));
            tab.tabIndex = n === index ? 0 : -1;
        });
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
            const focusables = [...content.querySelectorAll('button')];
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
