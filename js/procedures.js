// Page Procédures : liste à gauche, procédure sélectionnée à droite
(() => {
    const list = document.getElementById('proc-list');
    const title = document.getElementById('proc-title');
    const search = document.getElementById('proc-search');
    const emptyMessage = document.getElementById('proc-empty');
    if (!list) {
        return;
    }

    const bodies = [...document.querySelectorAll('.proc-body')];
    const soon = document.getElementById('proc-soon');

    const show = name => {
        let found = false;
        bodies.forEach(body => {
            const match = body.dataset.proc === name;
            body.hidden = !match;
            found = found || match;
        });
        soon.hidden = found;
    };

    const buttons = [...list.querySelectorAll('.proc-item')];

    const normalize = text => text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(other => other.removeAttribute('aria-current'));
            button.setAttribute('aria-current', 'true');
            title.textContent = button.textContent;
            show(button.dataset.proc);
        });
    });

    show('Préadmission');

    document.querySelectorAll('input[name="preadm-type"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.proc-variant').forEach(variant => {
                variant.hidden = variant.dataset.variant !== radio.value;
            });
        });
    });

    search.addEventListener('input', () => {
        const query = normalize(search.value.trim());
        buttons.forEach(button => {
            button.parentElement.hidden = Boolean(query) && !normalize(button.textContent).includes(query);
        });
        emptyMessage.hidden = buttons.some(button => !button.parentElement.hidden);
    });
})();
