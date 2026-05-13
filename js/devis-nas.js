function validerFormulaire() {
    const patientNameNas = document.querySelector("#patient-name-nas").value.trim();
    const patientDobNas = document.querySelector("#patient-dob-nas").value.trim();
    const interventionNas = document.querySelector("#intervention-description-nas").value.trim();

    if (!patientNameNas || !patientDobNas || !interventionNas) {
        document.querySelector("#generate-email-nas").disabled = true;
    } else {
        document.querySelector("#generate-email-nas").disabled = false;
    }
}

const formulaireNas = document.querySelector('#devis-nas-form');

formulaireNas.addEventListener('submit', function (e) {
    e.preventDefault();
    const patientNameNas = document.querySelector("#patient-name-nas").value.trim();
    const patientDobNas = document.querySelector("#patient-dob-nas").value.trim();
    const interventionNas = document.querySelector("#intervention-description-nas").value.trim();

    const subjectNas = encodeURIComponent("Demande de devis pour un patient non assuré social");
    let bodyNas = encodeURIComponent("Bonjour,\n\nPourriez-vous, s'il vous plaît, me fournir un devis pour le patient suivant :\n " + patientNameNas + ", né(e) le " + new Date(patientDobNas).toLocaleDateString() + ".\n\nPour cette intervention :\n" + interventionNas + "\n\nMerci d'avance pour votre retour.\n\nCordialement.\n\n");

    let sendEmailNas = document.querySelector('#send-email-nas');
    sendEmailNas.href = `mailto:pmsifactu@clinique-stjeandedieu.com?cc=s.azzabi@clinique-stjeandedieu.com&subject=${subjectNas}&body=${bodyNas}`;
    sendEmailNas.style.display = "block";
});

const patientNameFieldNas = document.querySelector("#patient-name-nas");
const patientDobFieldNas = document.querySelector("#patient-dob-nas");
const interventionFieldNas = document.querySelector("#intervention-description-nas");

patientNameFieldNas.addEventListener('input', validerFormulaire);
patientDobFieldNas.addEventListener('input', validerFormulaire);
interventionFieldNas.addEventListener('input', validerFormulaire);

const sendEmailNas = document.querySelector('#send-email-nas');

sendEmailNas.addEventListener('click', () => {
    setTimeout(() => {
        formulaire.reset();
        sendEmailNas.style.display = "none";
    }, 5000)

})