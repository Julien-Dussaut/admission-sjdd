// Recherche dans la page Informations utiles
(() => {
    const input = document.getElementById('info-search');
    const section = document.getElementById('informations');
    const emptyMessage = document.getElementById('info-empty');
    if (!input || !section) {
        return;
    }

    const normalize = text => text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');

    const items = [...section.querySelectorAll('.search-item')];
    const groups = [...section.querySelectorAll('.search-group')];
    const blocks = [...section.querySelectorAll('.search-block')];

    function filter() {
        const query = normalize(input.value.trim());

        // Une recherche qui correspond au titre d'un groupe (ex. « 2ème ») garde tout le groupe
        const groupMatches = new Map();
        groups.forEach(group => {
            const label = group.querySelector('.group-label');
            groupMatches.set(group, Boolean(query) && label && normalize(label.textContent).includes(query));
        });

        items.forEach(item => {
            const group = item.closest('.search-group');
            const matches = !query
                || normalize(item.textContent).includes(query)
                || (group && groupMatches.get(group));
            item.hidden = !matches;
        });

        groups.forEach(group => {
            group.hidden = !group.querySelector('.search-item:not([hidden])');
        });

        blocks.forEach(block => {
            block.hidden = !block.querySelector('.search-item:not([hidden])');
        });

        emptyMessage.hidden = items.some(item => !item.hidden);
    }

    input.addEventListener('input', filter);
})();
