
const navLinks = [...document.querySelectorAll('nav a')];
const sections = [...document.querySelectorAll('main > section')];
const fadeDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 140;
let activeSection = sections.find(section => getComputedStyle(section).display !== 'none');
let transitionId = 0;

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

        sectionToActivate.style.display = sectionToActivate.id === 'informations' ? 'grid' : 'block';
        activeSection = sectionToActivate;
        fadeSection(sectionToActivate, [{ opacity: 0 }, { opacity: 1 }]);
    });
});