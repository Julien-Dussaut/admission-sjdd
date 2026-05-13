
function resetBeforeChange() {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    sections.forEach(section => {
        section.style.display = "none";
    });
}

const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');
navLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    link.addEventListener('click', () => {
        resetBeforeChange();
        const sectionToActivate = document.getElementById(id);
        sectionToActivate.style.display = "block";
        link.classList.add('active');
    });
})