const formulaireNas = document.querySelector('#devis-nas-form');
const patientNameFieldNas = document.querySelector('#patient-name-nas');
const patientDobFieldNas = document.querySelector('#patient-dob-nas');
const interventionFieldNas = document.querySelector('#intervention-description-nas');

function buildNas() {
    const patientName = patientNameFieldNas.value.trim() || '[nom du patient]';
    const intervention = interventionFieldNas.value.trim() || "[description de l'intervention]";

    return {
        to: 'pmsifactu@clinique-stjeandedieu.com',
        cc: 's.azzabi@clinique-stjeandedieu.com',
        subject: "Demande de devis pour un patient non assuré social",
        body: "Bonjour,\n\nPourriez-vous, s'il vous plaît, me fournir un devis pour le patient suivant :\n "
            + patientName + ", né(e) le " + Mail.formatDate(patientDobFieldNas.value.trim())
            + ".\n\nPour cette intervention :\n" + intervention
            + "\n\nMerci d'avance pour votre retour.\n\nCordialement.\n\n"
    };
}

function nasValide() {
    return Boolean(patientNameFieldNas.value.trim() && patientDobFieldNas.value.trim() && interventionFieldNas.value.trim());
}

Mail.bind({
    prefix: 'nas',
    form: formulaireNas,
    build: buildNas,
    isValid: nasValide
});
