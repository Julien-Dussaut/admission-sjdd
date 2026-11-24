const datePrepa = localStorage.getItem('datePreparation');
const datePrepaValue = document.getElementById('date-prepa-value');
const dateFr = new Date(datePrepa).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
});

if (datePrepa) {
    datePrepaValue.textContent = dateFr;
} else {
    datePrepaValue.textContent = 'Aucune date définie';
}
