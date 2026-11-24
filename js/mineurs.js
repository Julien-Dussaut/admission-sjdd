const DOCS_MINEURS = {
    'cni-patient': "Passeport ou carte d'identité de l'enfant",
    'cni-pere': "Passeport ou carte d'identité du père",
    'cni-mere': "Passeport ou carte d'identité de la mère",
    'lf-naissance': "Acte de naissance ou livret de famille complet",
    'adm-mineur': "Fiche d'admission des mineurs signée par les deux parents",
    'ca': "Consentement à l'anesthésie signé par les deux parents",
    'cc': "Consentement à la chirurgie signée par les deux parents",
    'pap': "Personne à prévenir et de confiance",
    'vitale': "Carte vitale ou attestation de droit",
    'tt-donnees': "Accord pour le traitement des données personnelles",
    'mutuelle': "Carte de mutuelle"
};

const formulaire = document.querySelector('#mineur-form');
const checkboxAll = document.getElementById('checkAll');
const emailField = document.querySelector('#mail');
const filesNumberField = document.querySelector('#files-number-mineurs');
const countLabel = document.getElementById('mineurs-count');

function documentCheckboxes() {
    return [...formulaire.querySelectorAll('.doc-grid input[type="checkbox"]')];
}

function missingDocuments() {
    return documentCheckboxes().filter(checkbox => checkbox.checked);
}

function buildMineurs() {
    const filesNumber = filesNumberField.value.trim();
    const subject = "Urgent – Poursuite de votre préadmission en ligne avant votre intervention"
        + ` - Références à rappeler ${filesNumber}`;

    let body = "Madame, Monsieur,\n\nL'intervention de votre enfant est programmée le " + Mail.datePrepa()
        + " et nous sommes heureux de l'accueillir prochainement.\n\n Afin de valider sa prise en charge, nous vous remercions de bien vouloir compléter dès que possible la préadmission en ligne et d'y joindre les documents suivants, obligatoires avant toute intervention : \n";

    const missing = missingDocuments();
    if (missing.length > 1) {
        body += "\nLes documents manquants sont les suivants : \n\n";
    } else if (missing.length === 1) {
        body += "\nLe document manquant est le suivant : \n\n";
    }
    missing.forEach(checkbox => {
        body += `• ${DOCS_MINEURS[checkbox.id]}\n`;
    });

    body += "\n ⚠️ À noter : Tout dossier incomplet à J 2 entraînera le report de l’intervention.\n";
    body += "\nSi vous rencontrez la moindre difficulté, notre équipe d'accueil reste disponible pour vous accompagner, directement à la clinique ou par mail à l'adresse : admissionsambu@clinique-stjeandedieu.com .\n";
    body += "Nous vous remercions de votre diligence et demeurons à votre disposition pour toute question.\n\n";
    body += "Cordialement,\n\n";

    return {
        to: emailField.value.trim() || '[email du parent]',
        cc: '',
        subject,
        body
    };
}

function mineursValide() {
    return emailField.value.trim() !== '' && emailField.checkValidity() && missingDocuments().length > 0;
}

function majCompteur() {
    const count = missingDocuments().length;
    countLabel.textContent = count > 1 ? `${count} sélectionnés` : `${count} sélectionné`;
    const all = count === documentCheckboxes().length;
    checkboxAll.checked = all;
    document.getElementById('labelCheckAll').textContent = all ? "Tout décocher" : "Tout cocher";
}

const updateMineurs = Mail.bind({
    prefix: 'mineurs',
    form: formulaire,
    build: buildMineurs,
    isValid: mineursValide
});

formulaire.addEventListener('change', majCompteur);
formulaire.addEventListener('reset', () => setTimeout(majCompteur));

checkboxAll.addEventListener('change', () => {
    documentCheckboxes().forEach(checkbox => {
        checkbox.checked = checkboxAll.checked;
    });
    majCompteur();
    updateMineurs();
});

majCompteur();
