function checkAll() {
    const label = document.getElementById('labelCheckAllMajeurs');
    if (checkboxAll.checked) {
        label.textContent = "Tout décocher";
    } else {
        label.textContent = "Tout cocher";
    }
    const checkboxes = document.querySelectorAll('#majeur-form input[type="checkbox"]:not(#checkAll)');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
}

function validerFormulaire() {
    const emailField = document.querySelector("#mailMajeurs");
    const checkboxesFields = document.querySelectorAll('#majeur-form input[type=checkbox]:checked');

    if (emailField.value.trim() !== '' && checkboxesFields.length > 0) {
        document.querySelector('#generate-email-majeurs').disabled = false;
    } else {
        document.querySelector('#generate-email-majeurs').disabled = true;
    }
}

const checkboxAllMajeurs = document.getElementById('checkAllMajeurs');
const formulaireMajeurs = document.querySelector('#majeur-form');
const emailFieldMajeurs = document.querySelector("#mailMajeurs");
const generateEmailMajeurs = document.querySelector("#generate-email-majeurs");
const sendEmailMajeurs = document.querySelector('#send-email-majeurs');
const datePrepaFrMajeurs = new Date(localStorage.getItem('datePreparation')).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
});

checkboxAllMajeurs.addEventListener('change', checkAll);
emailFieldMajeurs.addEventListener('input', validerFormulaire);
formulaireMajeurs.addEventListener('change', validerFormulaire);


const subjectMajeurs = encodeURIComponent("Urgent – Poursuite de votre préadmission en ligne avant votre intervention");
let bodyMajeurs = encodeURIComponent("Madame, Monsieur,\n\nVotre intervention est programmée pour le " + datePrepaFrMajeurs + " et, à ce jour, votre espace patient n'a pas encore été renseigné.\nNous vous invitons à compléter la préadmission en ligne dans les plus brefs délais, afin de préparer au mieux la prise en charge le jour de votre venue.\n");

formulaireMajeurs.addEventListener('submit', function (e) {
    e.preventDefault();
    const missingDocuments = formulaireMajeurs.querySelectorAll('input[type=checkbox]:checked');
    if (missingDocuments.length > 1) {
        bodyMajeurs += encodeURIComponent("\nLes documents manquants sont les suivants : \n\n");
    } else if (missingDocuments == 1) {
        bodyMajeurs += encodeURIComponent("\nLe document manquant est le suivant : \n\n");
    }
    missingDocuments.forEach(element => {
        if (element.checked) {
            switch (element.id) {
                case 'cni-patient-majeur':
                    bodyMajeurs += encodeURIComponent("• Passeport ou carte d'identité\n");
                    break;
                case 'ca-majeur':
                    bodyMajeurs += encodeURIComponent("• Consentement à l'anesthésie\n");
                    break;
                case 'cc-majeur':
                    bodyMajeurs += encodeURIComponent("• Consentement à la chirurgie\n");
                    break;
                case 'da-majeur':
                    bodyMajeurs += encodeURIComponent("• Directives anticipées\n");
                    break;
                case 'pap-majeur':
                    bodyMajeurs += encodeURIComponent("• Personne à prévenir et de confiance\n");
                    break;
                case 'tt-donnees-majeur':
                    bodyMajeurs += encodeURIComponent("• Accord pour le traitement des données personnelles\n");
                    break;
            }
        }
    })

    bodyMajeurs += encodeURIComponent("\nSi vous rencontrez des difficultés pour remplir votre dossier en ligne, vous pouvez vous rendre directement à l’accueil de la clinique, où nos équipes pourront vous accompagner dans cette démarche.\n");
    bodyMajeurs += encodeURIComponent("\n ⚠️ Important : Conformément à nos procédures, tout dossier de préadmission non complété à J 2 entraînera le report de l’intervention.\n");
    bodyMajeurs += encodeURIComponent("Nous vous remercions pour votre réactivité et restons à votre disposition pour toute question.\n");
    bodyMajeurs += encodeURIComponent("Cordialement,\n\n");


    let sendEmailMajeurs = document.querySelector('#send-email-majeurs');
    sendEmailMajeurs.href = `mailto:${emailFieldMajeurs.value.trim()}?subject=${subjectMajeurs}&body=${bodyMajeurs}`;
    sendEmailMajeurs.style.display = "block";
})

sendEmailMajeurs.addEventListener('click', () => {
    setTimeout(() => {
        formulaireMajeurs.reset();
        sendEmailMajeurs.style.display = "none";
        sendEmailMajeurs.setAttribute('href', '');
        generateEmailMajeurs.disabled = true;
    }, 5000)

})