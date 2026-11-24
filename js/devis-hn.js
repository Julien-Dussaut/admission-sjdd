function findMailSurgeon(surgeon) {
    const surgeonEmailMap = {
        "racy": {
            md: "emmanuelracy@gmail.com",
            sec: "secretariat.racy@gmail.com"
        },
        "davido": {
            md: "cabinet.chirurgieorale@gmail.com",
            sec: "secretariat.cabchirurgieorale@gmail.com"
        },
        "de-verbizier": {
            md: "charlottedeverbizier@hotmail.com",
            sec: "secretariat.cabchirurgieorale@gmail.com"
        },
        "boutin": {
            md: "n.boutin@sapoimplant.net",
            sec: "cabinetfondary@gmail.com"
        },
        "samama": {
            md: "mickaelsamama@yahoo.com",
            sec: "assist.nathalie9@gmail.com"
        },
        "fitoussi": {
            md: "alfred.fitoussi@gmail.com",
            sec: "centredusein75005@gmail.com"
        },
        "barry-de-longchamps": {
            md: "dr.fbdl@orange.fr"
        },
        "lemazurier": {
            md: "dr.lemasurier@gmail.com"
        },
        "guilhard": {
            md: "dr.guihard@gmail.com"
        },
        "sarfati": {
            md: "contact@docteursarfati.com"
        }
    }

    return surgeonEmailMap[surgeon] || null;
}

const formulaireHn = document.querySelector('#devis-hn-form');
const patientNameFieldHn = document.querySelector('#patient-name-hn');
const patientDobFieldHn = document.querySelector('#patient-dob-hn');
const surgeonFieldHn = document.querySelector('#surgeon-hn');

function buildHn() {
    const patientName = patientNameFieldHn.value.trim() || '[nom du patient]';
    const surgeonEmail = findMailSurgeon(surgeonFieldHn.value.trim());

    return {
        to: surgeonEmail ? surgeonEmail.md : '[choisir un chirurgien]',
        cc: surgeonEmail ? (surgeonEmail.sec || '') : '',
        subject: "Demande de devis pour une intervention non couverte par l'assurance maladie",
        body: "Bonjour docteur,\n\nUne intervention non couverte par l'assurance maladie est programmée pour la/le patient(e) suivant(e) :\n "
            + patientName + ", né(e) le " + Mail.formatDate(patientDobFieldHn.value.trim())
            + ".\n\nÀ ce jour, le devis n'a pas été ajouté sur Expert Santé.\n\nPourriez-vous, s'il vous plaît, ajouter votre devis sur Expert Santé afin que nous puissions facturer votre patient(e) lors de sa venue ?\n\nMerci d'avance pour votre retour.\n\nCordialement.\n\n"
    };
}

function hnValide() {
    return Boolean(patientNameFieldHn.value.trim() && patientDobFieldHn.value.trim() && findMailSurgeon(surgeonFieldHn.value.trim()));
}

Mail.bind({
    prefix: 'hn',
    form: formulaireHn,
    build: buildHn,
    isValid: hnValide
});
