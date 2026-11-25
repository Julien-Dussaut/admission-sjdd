
const navLinks = [...document.querySelectorAll('nav a')];
const sections = [...document.querySelectorAll('main > section')];
const fadeDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 140;
let activeSection = sections.find(section => getComputedStyle(section).display !== 'none');
let transitionId = 0;
const HOME_KEY = 'pageAccueil';
const pinButton = document.getElementById('pin-home');
let currentId = activeSection ? activeSection.id : null;

function readHome() {
    try { return localStorage.getItem(HOME_KEY); } catch (e) { return null; }
}

function updatePin() {
    const isHome = currentId !== null && readHome() === currentId;
    const name = navLinks.find(link => link.getAttribute('href') === `#${currentId}`)?.textContent.trim() || 'cette page';
    pinButton.setAttribute('aria-pressed', String(isHome));
    pinButton.dataset.tip = isHome
        ? `« ${name} » est la page d'accueil : cliquer pour retirer`
        : `Définir « ${name} » comme page d'accueil`;
    pinButton.setAttribute('aria-label', pinButton.dataset.tip);
    document.body.dataset.page = currentId || '';
}

pinButton.addEventListener('click', () => {
    try {
        if (readHome() === currentId) {
            localStorage.removeItem(HOME_KEY);
        } else {
            localStorage.setItem(HOME_KEY, currentId);
        }
    } catch (e) { /* stockage indisponible : on ignore */ }
    updatePin();
});

function showInitial(id) {
    const target = document.getElementById(id);
    if (!sections.includes(target) || target === activeSection) {
        return;
    }
    if (activeSection) {
        activeSection.style.display = 'none';
    }
    target.style.display = 'flex';
    activeSection = target;
    currentId = id;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
}

// Page affichée à l'ouverture : lien précis > page d'accueil du poste > Informations
showInitial(window.location.hash.replace('#', '') || readHome() || '');
updatePin();

function fadeSection(section, keyframes) {
    if (!fadeDuration || typeof section.animate !== 'function') {
        return Promise.resolve();
    }

    return section.animate(keyframes, {
        duration: fadeDuration,
        easing: 'ease-out'
    }).finished.catch(() => {});
}

navLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    link.addEventListener('click', async event => {
        event.preventDefault();

        const sectionToActivate = document.getElementById(id);
        if (!sections.includes(sectionToActivate)) {
            return;
        }

        const currentTransitionId = ++transitionId;
        navLinks.forEach(navLink => navLink.classList.toggle('active', navLink === link));
        window.history.pushState(null, '', link.hash);

        if (sectionToActivate === activeSection) {
            return;
        }

        if (activeSection) {
            await fadeSection(activeSection, [{ opacity: 1 }, { opacity: 0 }]);
            if (currentTransitionId !== transitionId) {
                return;
            }
            activeSection.style.display = 'none';
        }

        if (currentTransitionId !== transitionId) {
            return;
        }

        sectionToActivate.style.display = 'flex';
        window.scrollTo(0, 0);
        activeSection = sectionToActivate;
        currentId = id;
        updatePin();
        fadeSection(sectionToActivate, [{ opacity: 0 }, { opacity: 1 }]);
    });
});

// Liens internes entre pages : ouvre la page cible puis fait défiler jusqu'au bloc visé
document.addEventListener('click', event => {
    const link = event.target.closest('a[data-goto]');
    if (!link) {
        return;
    }
    event.preventDefault();
    const navLink = navLinks.find(item => item.getAttribute('href') === link.getAttribute('href'));
    const target = document.getElementById(link.dataset.goto);
    if (!navLink || !target) {
        return;
    }
    navLink.click();
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450);
});
