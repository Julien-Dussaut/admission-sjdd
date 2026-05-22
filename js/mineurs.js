function checkAll() {
    const label = document.getElementById('labelCheckAll');
    if (checkboxAll.checked) {
        label.textContent = "Tout décocher";
    } else {
        label.textContent = "Tout cocher";
    }
    const checkboxes = document.querySelectorAll('#mineur-form input[type="checkbox"]:not(#checkAll)');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
}

function validerFormulaire() {
    const emailField = document.querySelector("#mail");
    const checkboxesFields = document.querySelectorAll('#mineur-form input[type=checkbox]:checked');

    if (emailField.value.trim() !== '' && checkboxesFields.length > 0) {
        document.querySelector('#generate-email-mineurs').disabled = false;
    } else {
        document.querySelector('#generate-email-mineurs').disabled = true;
    }
}

const checkboxAll = document.getElementById('checkAll');
const formulaire = document.querySelector('#mineur-form');
const emailField = document.querySelector("#mail");
const generateEmail = document.querySelector('#generate-email-mineurs')
const sendEmail = document.querySelector('#send-email-mineurs');
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

formulaire.addEventListener('submit', function (e) {
    e.preventDefault();

    let body = encodeURIComponent("Madame, Monsieur,\n\nL'intervention de votre enfant est programmée le " + datePrepaFr + " et nous sommes heureux de l'accueillir prochainement.\n\n Afin de valider sa prise en charge, nous vous remercions de bien vouloir compléter dès que possible la préadmission en ligne et d'y joindre les documents suivants, obligatoires avant toute intervention : \n");

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
                    body += encodeURIComponent("• Passeport ou carte d'identité de l'enfant\n");
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
                case 'vitale':
                    body += encodeURIComponent("• Carte vitale ou attestation de droit\n");
                    break;
                case 'tt-donnees':
                    body += encodeURIComponent("• Accord pour le traitement des données personnelles\n");
                    break;
            }
        }
    })

    body += encodeURIComponent("\n ⚠️ À noter : Tout dossier incomplet à J 2 entraînera le report de l’intervention.\n");
    body += encodeURIComponent("\nSi vous rencontrez la moindre difficulté, notre équipe d'accueil reste disponible pour vous accompagner, directement à la clinique ou par mail à l'adresse : admissionsambu@clinique-stjeandedieu.com .\n");
    body += encodeURIComponent("Nous vous remercions de votre diligence et demeurons à votre disposition pour toute question.\n\n");
    body += encodeURIComponent("Cordialement,\n\n");


    let sendEmail = document.querySelector('#send-email-mineurs');
    sendEmail.href = `mailto:${emailField.value.trim()}?subject=${subject}&body=${body}`;
    sendEmail.style.display = "block";
});

sendEmail.addEventListener('click', () => {
    setTimeout(() => {
        formulaire.reset();
        sendEmail.style.display = "none";
        generateEmail.disabled = true;
    }, 5000)

});