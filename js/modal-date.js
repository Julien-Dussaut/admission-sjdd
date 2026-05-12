// localStorage.setItem('dateSettedAt', new Date());

const datePreparation = localStorage.getItem('datePreparation');
const dateSettedAt = localStorage.getItem('dateSettedAt');
const dateNeededToSet = !dateSettedAt || new Date(dateSettedAt).toLocaleDateString() !== new Date().toLocaleDateString();

const modal = document.getElementById('modal');

const closeModalButton = document.getElementById('close-modal');

closeModalButton.addEventListener('click', () => {
    modal.style.visibility = 'hidden';
});

const form = document.querySelector('#modal-content form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedDate = document.getElementById('date-prepa').value;
    if (selectedDate) {
        localStorage.setItem('datePreparation', selectedDate);
        localStorage.setItem('dateSettedAt', new Date());
        modal.style.visibility = 'hidden';
    }
});

if (dateNeededToSet) {
    const predefinedDate = new Date();
    predefinedDate.setDate(predefinedDate.getDate() + 3);
    document.getElementById('date-prepa').value = predefinedDate.toISOString().split('T')[0];
    modal.style.visibility = 'visible';
} 