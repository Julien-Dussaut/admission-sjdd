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

formulaireMajeurs.addEventListener('submit', function (e) {
    e.preventDefault();

    let bodyMajeurs = encodeURIComponent("Madame, Monsieur,\n\nVotre intervention est programmée le " + datePrepaFrMajeurs + " et nous sommes heureux de vous accueillir prochainement au sein de notre établissement.\n");
    bodyMajeurs += encodeURIComponent("Afin de valider votre prise en charge, nous vous remercions de bien vouloir compléter dès que possible la préadmission en ligne ");

    const missingDocuments = formulaireMajeurs.querySelectorAll('input[type=checkbox]:checked');
    if (missingDocuments.length > 1) {
        bodyMajeurs += encodeURIComponent("\n et d'y joindre les documents suivants : \n\n");
    } else if (missingDocuments == 1) {
        bodyMajeurs += encodeURIComponent("\n et d'y joindre le document suivant : \n\n");
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

    bodyMajeurs += encodeURIComponent("\n ⚠️ À noter : Tout dossier incomplet à J 2 entraînera le report de l’intervention.\n");
    bodyMajeurs += encodeURIComponent("\nSi vous rencontrez la moindre difficulté, notre équipe d'accueil reste disponible pour vous accompagner, directement à la clinique ou par mail à l'adresse : admissionsambu@clinique-stjeandedieu.com .\n");
    bodyMajeurs += encodeURIComponent("Nous vous remercions de votre diligence et demeurons à votre disposition pour toute question.\n");
    bodyMajeurs += encodeURIComponent("Cordialement,\n\n");


    let sendEmailMajeurs = document.querySelector('#send-email-majeurs');
    sendEmailMajeurs.href = `mailto:${emailFieldMajeurs.value.trim()}?subject=${subjectMajeurs}&body=${bodyMajeurs}`;
    sendEmailMajeurs.style.display = "block";
});

sendEmailMajeurs.addEventListener('click', () => {
    setTimeout(() => {
        formulaireMajeurs.reset();
        sendEmailMajeurs.style.display = "none";
        sendEmailMajeurs.setAttribute('href', '');
        generateEmailMajeurs.disabled = true;
    }, 5000)
});