function validerFormulaire() {
    const emailField = document.querySelector("#mail");
    const checkboxesFields = document.querySelectorAll('#mineur-form input[type=checkbox]:checked');

    if (emailField.value.trim() !== '' && checkboxesFields.length > 0) {
        document.querySelector('#generate-email').disabled = false;
    } else {
        document.querySelector('#generate-email').disabled = true;
    }
}

const formulaire = document.querySelector('#mineur-form');

const emailField = document.querySelector("#mail");
emailField.addEventListener('input', validerFormulaire);

formulaire.addEventListener('change', validerFormulaire);


const subject = encodeURIComponent("Pièces manquantes pour admission - Clinique Saint-Jean de Dieu");
let body = encodeURIComponent("Madame, Monsieur,\n\nVotre enfant va être opéré dans notre établissement et des documents nous font défaut.\nNous vous invitons à compléter la préadmission en ligne dans les plus brefs délais, afin de préparer au mieux la prise en charge de votre enfant.\n")

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
                    body += encodeURIComponent("• Consentement à l'anesthésie signé par les deux parents\n");
                    break;
                case 'cc':
                    body += encodeURIComponent("• Consentement à la chirurgie signé par les deux parents\n");
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

    body += encodeURIComponent("\n\n\nConformément à nos procédures, tout dossier de préadmission non complété à J-2 entraînera le report de l'intervention.");
    body += encodeURIComponent("\nNous vous remercions pour votre réactivité et restons à votre disposition pour toute question.");
    body += encodeURIComponent("\nCordialement,");
    body += encodeURIComponent("\n\nClinique Saint Jean de Dieu,");

    let sendEmail = document.querySelector('#send-email');
    sendEmail.href = `mailto:${emailField.value.trim()}?subject=${subject}&body=${body}`;
    sendEmail.style.display = "block";
})

const sendEmail = document.querySelector('#send-email');

sendEmail.addEventListener('click', () => {
    setTimeout(() => {
        formulaire.reset();
        sendEmail.style.display = "none";
    }, 5000)

})