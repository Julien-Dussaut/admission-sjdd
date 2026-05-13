const datePrepa = localStorage.getItem('datePreparation');
const datePrepaValue = document.getElementById('date-prepa-value');
const dateFr = new Date(datePrepa).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
});

if (datePrepa) {
    datePrepaValue.textContent = dateFr;
} else {
    datePrepaValue.textContent = 'Aucune date définie pour la journée en préparation';
}

const nav = document.querySelector('nav');
const navPosition = nav.getBoundingClientRect();

console.log(navPosition.right);

const datePrepaElement = document.getElementById('date-prepa');
datePrepaElement.style.right = (window.innerWidth - navPosition.right) + 'px';

window.addEventListener('resize', function () {
    const navPosition = nav.getBoundingClientRect();
    datePrepaElement.style.right = (window.innerWidth - navPosition.right) + 'px';
});

