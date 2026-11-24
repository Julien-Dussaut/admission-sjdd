const DOCS_MAJEURS = {
    'cni-patient-majeur': "Passeport ou carte d'identité",
    'ca-majeur': "Consentement à l'anesthésie",
    'cc-majeur': "Consentement à la chirurgie",
    'da-majeur': "Directives anticipées",
    'pap-majeur': "Personne à prévenir et de confiance",
    'vitale-majeur': "Carte vitale ou attestation de droit",
    'tt-donnees-majeur': "Accord pour le traitement des données personnelles",
    'mutuelle-majeur': "Carte de mutuelle"
};

const formulaireMajeurs = document.querySelector('#majeur-form');
const checkboxAllMajeurs = document.getElementById('checkAllMajeurs');
const emailFieldMajeurs = document.querySelector('#mailMajeurs');
const filesNumberFieldMajeurs = document.querySelector('#files-number-majeurs');
const countLabelMajeurs = document.getElementById('majeurs-count');

function documentCheckboxesMajeurs() {
    return [...formulaireMajeurs.querySelectorAll('.doc-grid input[type="checkbox"]')];
}

function missingDocumentsMajeurs() {
    return documentCheckboxesMajeurs().filter(checkbox => checkbox.checked);
}

function buildMajeurs() {
    const madameChecked = formulaireMajeurs.querySelector('#madame').checked;
    const monsieurChecked = formulaireMajeurs.querySelector('#monsieur').checked;
    const salutation = madameChecked !== monsieurChecked
        ? (madameChecked ? 'Madame' : 'Monsieur')
        : 'Madame, Monsieur';
    const filesNumber = filesNumberFieldMajeurs.value.trim();
    const subject = "Urgent – Poursuite de votre préadmission en ligne avant votre intervention"
        + ` - Références à rappeler ${filesNumber}`;

    let body = salutation + ",\n\nVotre intervention est programmée le " + Mail.datePrepa()
        + " et nous sommes heureux de vous accueillir prochainement au sein de notre établissement.\n";
    body += "Afin de valider votre prise en charge, nous vous remercions de bien vouloir compléter dès que possible la préadmission en ligne ";

    const missing = missingDocumentsMajeurs();
    if (missing.length > 1) {
        body += "\n et d'y joindre les documents suivants : \n\n";
    } else if (missing.length === 1) {
        body += "\n et d'y joindre le document suivant : \n\n";
    }
    body += Mail.groupedList(missing.map(checkbox => ({
        group: checkbox.closest('.doc-group').dataset.group,
        text: DOCS_MAJEURS[checkbox.id]
    })));

    body += "\n ⚠️ À noter : Tout dossier incomplet à J 2 entraînera le report de l’intervention.\n";
    body += "\nSi vous rencontrez la moindre difficulté, notre équipe d'accueil reste disponible pour vous accompagner, directement à la clinique ou par mail à l'adresse : admissionsambu@clinique-stjeandedieu.com .\n";
    body += "Nous vous remercions de votre diligence et demeurons à votre disposition pour toute question.\n";
    body += "Cordialement,\n\n";

    return {
        to: emailFieldMajeurs.value.trim() || '[email du patient]',
        cc: '',
        subject,
        body
    };
}

function majeursValide() {
    return emailFieldMajeurs.value.trim() !== '' && emailFieldMajeurs.checkValidity() && missingDocumentsMajeurs().length > 0;
}

function majCompteurMajeurs() {
    const count = missingDocumentsMajeurs().length;
    countLabelMajeurs.textContent = count > 1 ? `${count} sélectionnés` : `${count} sélectionné`;
    const all = count === documentCheckboxesMajeurs().length;
    checkboxAllMajeurs.checked = all;
    document.getElementById('labelCheckAllMajeurs').textContent = all ? "Tout décocher" : "Tout cocher";
}

const updateMajeurs = Mail.bind({
    prefix: 'majeurs',
    form: formulaireMajeurs,
    build: buildMajeurs,
    isValid: majeursValide
});

formulaireMajeurs.addEventListener('change', majCompteurMajeurs);
formulaireMajeurs.addEventListener('reset', () => setTimeout(majCompteurMajeurs));

checkboxAllMajeurs.addEventListener('change', () => {
    documentCheckboxesMajeurs().forEach(checkbox => {
        checkbox.checked = checkboxAllMajeurs.checked;
    });
    majCompteurMajeurs();
    updateMajeurs();
});

majCompteurMajeurs();
