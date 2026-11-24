// Page Procédures : liste à gauche, procédure sélectionnée à droite
(() => {
    const list = document.getElementById('proc-list');
    const title = document.getElementById('proc-title');
    const search = document.getElementById('proc-search');
    const emptyMessage = document.getElementById('proc-empty');
    if (!list) {
        return;
    }

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
