const DOCS_MINEURS = {
    'cni-patient': "Passeport ou carte d'identité de l'enfant",
    'cni-pere': "Passeport ou carte d'identité du père",
    'cni-mere': "Passeport ou carte d'identité de la mère",
    'lf-naissance': "Acte de naissance ou livret de famille complet (page de l'enfant et des parents)",
    'pap': "Personne à prévenir et de confiance",
    'vitale': "Carte vitale ou attestation de droit",
    'tt-donnees': "Accord pour le traitement des données personnelles",
    'mutuelle': "Carte de mutuelle"
};

// Documents à faire signer par les deux parents : on peut préciser quelle signature manque
const DOCS_A_SIGNER = {
    'adm-mineur': { label: "Fiche d'admission des mineurs", participe: 'signée' },
    'ca': { label: "Consentement à l'anesthésie", participe: 'signé' },
    'cc': { label: "Consentement à la chirurgie", participe: 'signé' }
};

const formulaire = document.querySelector('#mineur-form');
const checkboxAll = document.getElementById('checkAll');
const emailField = document.querySelector('#mail');
const filesNumberField = document.querySelector('#files-number-mineurs');
const countLabel = document.getElementById('mineurs-count');
const parent2Field = document.getElementById('parent2-field');
const parent2Input = document.getElementById('mail2');
const addParent2Button = document.getElementById('add-parent2');
const removeParent2Button = document.getElementById('remove-parent2');

function documentText(checkbox) {
    const signable = DOCS_A_SIGNER[checkbox.id];
    if (!signable) {
        return DOCS_MINEURS[checkbox.id];
    }

    const missing = formulaire.querySelector(`input[name="sig-${checkbox.id}"]:checked`).value;
    const base = `${signable.label} ${signable.participe}`;
    if (missing === 'pere') {
        return `${base} par le père (signature de la mère déjà présente)`;
    }
    if (missing === 'mere') {
        return `${base} par la mère (signature du père déjà présente)`;
    }
    return `${base} par les deux parents`;
}

function parent2IsOpen() {
    return !parent2Field.hidden;
}

function recipients() {
    const emails = [emailField.value.trim()];
    if (parent2IsOpen()) {
        emails.push(parent2Input.value.trim());
    }
    return emails.filter(Boolean);
}

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
    body += Mail.groupedList(missing.map(checkbox => ({
        group: checkbox.closest('.doc-group').dataset.group,
        text: documentText(checkbox)
    })));

    body += "\n ⚠️ À noter : Tout dossier incomplet à J 2 entraînera le report de l’intervention.\n";
    body += "\nSi vous rencontrez la moindre difficulté, notre équipe d'accueil reste disponible pour vous accompagner, directement à la clinique ou par mail à l'adresse : admissionsambu@clinique-stjeandedieu.com .\n";
    body += "Nous vous remercions de votre diligence et demeurons à votre disposition pour toute question.\n\n";
    body += "Cordialement,\n\n";

    return {
        to: recipients().join(',') || '[email du parent]',
        cc: '',
        subject,
        body
    };
}

function mineursValide() {
    const secondParentValid = !parent2IsOpen()
        || (parent2Input.value.trim() !== '' && parent2Input.checkValidity());
    return emailField.value.trim() !== ''
        && emailField.checkValidity()
        && secondParentValid
        && missingDocuments().length > 0;
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

function setParent2(open) {
    parent2Field.hidden = !open;
    addParent2Button.hidden = open;
    addParent2Button.setAttribute('aria-expanded', String(open));
    if (!open) {
        parent2Input.value = '';
    }
    updateMineurs();
}

addParent2Button.addEventListener('click', () => {
    setParent2(true);
    parent2Input.focus();
});

removeParent2Button.addEventListener('click', () => {
    setParent2(false);
    emailField.focus();
});

formulaire.addEventListener('change', majCompteur);
formulaire.addEventListener('reset', () => setTimeout(() => {
    majCompteur();
    setParent2(false);
}));

checkboxAll.addEventListener('change', () => {
    documentCheckboxes().forEach(checkbox => {
        checkbox.checked = checkboxAll.checked;
    });
    majCompteur();
    updateMineurs();
});

majCompteur();
