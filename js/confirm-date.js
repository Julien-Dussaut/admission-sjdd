// Rappel régulier : la date affichée est-elle toujours celle de la journée en préparation ?
(() => {
    const DELAI = 30 * 60 * 1000; // 30 minutes après la dernière confirmation
    const INACTIVITE = 5 * 1000; // on attend que l'utilisateur ait arrêté de saisir
    const REPORT = 5 * 60 * 1000; // délai avant de redemander si la date n'a pas été confirmée
    const KEY = 'dateConfirmedAt';

    const box = document.getElementById('confirm-modal');
    const dateEl = document.getElementById('confirm-date');
    const dateModal = document.getElementById('modal');
    let derniereActivite = Date.now();
    let derniereQuestion = 0;

    const derniereConfirmation = () => {
        const set = Date.parse(localStorage.getItem('dateSettedAt')) || 0;
        const conf = Number(localStorage.getItem(KEY)) || 0;
        return Math.max(set, conf);
    };
    const ouverte = () => box.style.visibility === 'visible';

    ['keydown', 'pointerdown', 'input'].forEach((evt) =>
        document.addEventListener(evt, () => { derniereActivite = Date.now(); }, true));

    const verifier = () => {
        const date = localStorage.getItem('datePreparation');
        const now = Date.now();
        if (!date || ouverte() || dateModal.style.visibility === 'visible') return;
        if (now - derniereConfirmation() < DELAI) return;
        if (now - derniereActivite < INACTIVITE) return;
        if (now - derniereQuestion < REPORT) return;
        derniereQuestion = now;
        const texte = new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long'
        });
        dateEl.textContent = texte.charAt(0).toUpperCase() + texte.slice(1);
        box.style.visibility = 'visible';
    };

    document.getElementById('confirm-yes').addEventListener('click', () => {
        localStorage.setItem(KEY, String(Date.now()));
        box.style.visibility = 'hidden';
    });

    document.getElementById('confirm-no').addEventListener('click', () => {
        box.style.visibility = 'hidden';
        document.getElementById('open-modal').click();
    });

    setInterval(verifier, 15 * 1000);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) setTimeout(verifier, INACTIVITE);
    });
})();
