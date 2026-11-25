// Taille du texte : choix mémorisé par poste (aucune donnée patient)
(() => {
    const NIVEAUX = [90, 100, 112, 125, 140];
    const KEY = 'taillePolice';
    const root = document.documentElement;
    const minus = document.getElementById('font-minus');
    const plus = document.getElementById('font-plus');
    const reset = document.getElementById('font-reset');

    let niveau = Number(localStorage.getItem(KEY));
    if (!NIVEAUX.includes(niveau)) niveau = 100;

    function appliquer(valeur) {
        niveau = valeur;
        root.style.fontSize = niveau + '%';
        try { localStorage.setItem(KEY, String(niveau)); } catch (e) { /* ignoré */ }
        reset.textContent = niveau + ' %';
        minus.disabled = niveau === NIVEAUX[0];
        plus.disabled = niveau === NIVEAUX[NIVEAUX.length - 1];
        mesurerHeader();
    }

    // Hauteur réelle du header (il peut passer sur deux lignes à grande taille) pour les éléments collants
    function mesurerHeader() {
        root.style.setProperty('--header-h', document.querySelector('header').offsetHeight + 'px');
    }

    const decaler = pas => {
        const index = NIVEAUX.indexOf(niveau) + pas;
        if (index >= 0 && index < NIVEAUX.length) appliquer(NIVEAUX[index]);
    };

    minus.addEventListener('click', () => decaler(-1));
    plus.addEventListener('click', () => decaler(1));
    reset.addEventListener('click', () => appliquer(100));

    if (typeof ResizeObserver === 'function') {
        new ResizeObserver(mesurerHeader).observe(document.querySelector('header'));
    }
    appliquer(niveau);
})();
