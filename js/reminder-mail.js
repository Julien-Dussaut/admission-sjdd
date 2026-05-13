function checkAll() {
    const label = document.getElementById('labelCheckAll');
    if (checkboxAll.checked) {
        label.textContent = "Tout décocher";
    } else {
        label.textContent = "Tout cocher";
    }
    const idCheckboxes = window.location.pathname.includes('mineurs') ? '#mineur-form input[type="checkbox"]:not(#checkAll)' : '#majeur-form input[type="checkbox"]:not(#checkAll)';
    const checkboxes = document.querySelectorAll(idCheckboxes);
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
}

function validerFormulaire() {
    const emailField = document.querySelector("#mail");
    const checkboxesFields = window.location.pathname.includes('mineurs') ? document.querySelectorAll('#mineur-form input[type=checkbox]:checked') : document.querySelectorAll('#majeur-form input[type=checkbox]:checked');

    if (emailField.value.trim() !== '' && checkboxesFields.length > 0) {
        document.querySelector('#generate-email').disabled = false;
    } else {
        document.querySelector('#generate-email').disabled = true;
    }
}

const checkboxAll = document.getElementById('checkAll');
const formulaire = window.location.pathname.includes('mineurs') ? document.querySelector('#mineur-form') : document.querySelector('#majeur-form');
const emailField = document.querySelector("#mail");
const sendEmail = document.querySelector('#send-email');
const datePrepaFr = new Date(localStorage.getItem('datePreparation')).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
});

checkboxAll.addEventListener('change', checkAll);
emailField.addEventListener('input', validerFormulaire);
formulaire.addEventListener('change', validerFormulaire);


const subject = encodeURIComponent("Urgent – Poursuite de votre préadmission en ligne avant votre intervention");
let body = window.location.pathname.includes('mineurs') ? encodeURIComponent("Madame, Monsieur,\n\nL'intervention de votre enfant est programmée pour le " + datePrepaFr + " et, à ce jour, des documents nous font défaut.\nNous vous invitons à compléter la préadmission en ligne de votre enfant dans les plus brefs délais, afin de préparer au mieux la prise en charge de votre enfant lors de sa venue.\n") : encodeURIComponent("Madame, Monsieur,\n\nVotre intervention est programmée pour le " + datePrepaFr + " et, à ce jour, votre espace patient n'a pas encore été renseigné.\nNous vous invitons à compléter la préadmission en ligne dans les plus brefs délais, afin de préparer au mieux la prise en charge le jour de votre venue.\n");

formulaire.addEventListener('submit', function (e) {
    e.preventDefault();
    const missingDocuments = formulaire.querySelectorAll('input[type=checkbox]:checked');
    if (missingDocuments.length > 1) {
        body += encodeURIComponent("\nLes documents manquants sont les suivants : \n\n");
    } else if (missingDocuments == 1) {
        body += encodeURIComponent("\nLe document manquant est le suivant : \n\n");
    }
    missingDocuments.forEach(element => {
        if (element.checked) {
            switch (element.id) {
                case 'cni-patient':
                    if (window.location.pathname.includes('mineurs')) {
                        body += encodeURIComponent("• Passeport ou carte d'identité de l'enfant\n");
                    } else {
                        body += encodeURIComponent("• Passeport ou carte d'identité\n");
                    }
                    break;
                case 'cni-pere':
                    body += encodeURIComponent("• Passeport ou carte d'identité du père\n");
                    break;
                case 'cni-mere':
                    body += encodeURIComponent("• Passeport ou carte d'identité de la mère\n");
                    break;
                case 'lf-naissance':
                    body += encodeURIComponent("• Acte de naissance ou livret de famille complet\n");
                    break;
                case 'adm-mineur':
                    body += encodeURIComponent("• Fiche d'admission des mineurs signée par les deux parents\n");
                    break;
                case 'ca':
                    body += encodeURIComponent("• Consentement à l'anesthésie\n");
                    break;
                case 'cc':
                    body += encodeURIComponent("• Consentement à la chirurgie\n");
                    break;
                case 'da':
                    body += encodeURIComponent("• Directives anticipées\n");
                    break;
                case 'pap':
                    body += encodeURIComponent("• Personne à prévenir et de confiance\n");
                    break;
                case 'tt-donnees':
                    body += encodeURIComponent("• Accord pour le traitement des données personnelles\n");
                    break;
            }
        }
    })

    body += encodeURIComponent("\nSi vous rencontrez des difficultés pour remplir votre dossier en ligne, vous pouvez vous rendre directement à l’accueil de la clinique, où nos équipes pourront vous accompagner dans cette démarche.\n");
    body += encodeURIComponent("\n ⚠️ Important : Conformément à nos procédures, tout dossier de préadmission non complété à J 2 entraînera le report de l’intervention.\n");
    body += encodeURIComponent("Nous vous remercions pour votre réactivité et restons à votre disposition pour toute question.\n");
    body += encodeURIComponent("Cordialement,\n\n");


    let sendEmail = document.querySelector('#send-email');
    sendEmail.href = `mailto:${emailField.value.trim()}?subject=${subject}&body=${body}`;
    sendEmail.style.display = "block";
})

sendEmail.addEventListener('click', () => {
    setTimeout(() => {
        formulaire.reset();
        sendEmail.style.display = "none";
        generateEmail.disabled = true;
    }, 5000)

})