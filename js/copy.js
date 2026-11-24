// Boutons de copie génériques : <button class="copy-btn" data-copy="valeur">
(() => {
    const copyIcon = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>';
    const checkIcon = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>';

    document.querySelectorAll('.copy-btn[data-copy]').forEach(button => {
        const baseLabel = button.getAttribute('aria-label');
        let resetTimer;

        button.addEventListener('click', async () => {
            window.clearTimeout(resetTimer);

            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                button.innerHTML = checkIcon;
                button.classList.add('is-copied');
                button.setAttribute('aria-label', 'Copié');
                button.title = 'Copié';
            } catch {
                button.setAttribute('aria-label', 'Copie impossible');
                button.title = 'Copie impossible';
            }

            resetTimer = window.setTimeout(() => {
                button.innerHTML = copyIcon;
                button.classList.remove('is-copied');
                button.setAttribute('aria-label', baseLabel);
                button.removeAttribute('title');
            }, 2000);
        });
    });
})();
