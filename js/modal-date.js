const datePreparation = localStorage.getItem('datePreparation');
const dateSettedAt = localStorage.getItem('dateSettedAt');
const dateNeededToSet = !dateSettedAt || new Date(dateSettedAt).toLocaleDateString() !== new Date().toLocaleDateString();

const modal = document.getElementById('modal');

const closeModalButton = document.getElementById('close-modal');

closeModalButton.addEventListener('click', () => {
    modal.style.visibility = 'hidden';
});

const openModalButton = document.getElementById('open-modal');

openModalButton.addEventListener('click', () => {
    console.log(new Date(datePreparation).toLocaleDateString());
    document.getElementById('date-prepa-modal').valueAsDate = datePreparation ? new Date(datePreparation) : '';
    modal.style.visibility = 'visible';
});
const form = document.querySelector('#modal-content form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedDate = document.getElementById('date-prepa-modal').value;
    if (selectedDate) {
        localStorage.setItem('datePreparation', selectedDate);
        localStorage.setItem('dateSettedAt', new Date());
        modal.style.visibility = 'hidden';
        location.reload();
    }
});

if (dateNeededToSet) {
    const predefinedDate = new Date();
    predefinedDate.setDate(predefinedDate.getDate() + 3);
    document.getElementById('date-prepa-modal').value = predefinedDate.toISOString().split('T')[0];
    modal.style.visibility = 'visible';
}

