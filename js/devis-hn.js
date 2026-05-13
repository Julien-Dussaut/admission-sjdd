function validerFormulaire() {
    const patientNameHn = document.querySelector("#patient-name-hn").value.trim();
    const patientDobHn = document.querySelector("#patient-dob-hn").value.trim();
    const interventionHn = document.querySelector("#surgeon-hn").value.trim();

    if (!patientNameHn || !patientDobHn || !interventionHn) {
        document.querySelector("#generate-email-hn").disabled = true;
    } else {
        document.querySelector("#generate-email-hn").disabled = false;
    }
}


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

formulaireHn.addEventListener('submit', function (e) {
    e.preventDefault();
    const patientNameHn = document.querySelector("#patient-name-hn").value.trim();
    const patientDobHn = document.querySelector("#patient-dob-hn").value.trim();
    const surgeon = document.querySelector("#surgeon-hn").value.trim();
    const surgeonEmailHn = findMailSurgeon(surgeon);
    
    const subjectHn = encodeURIComponent("Demande de devis pour une intervention non couverte par l'assurance maladie");
    let bodyHn = encodeURIComponent("Bonjour docteur,\n\nUne intervention non couverte par l'assurance maladie est programmée pour la/le patient(e) suivant(e) :\n " + patientNameHn + ", né(e) le " + new Date(patientDobHn).toLocaleDateString() + ".\n\nÀ ce jour, le devis n'a pas été ajouté sur Expert Santé.\n\nPourriez-vous, s'il vous plaît, ajouter votre devis sur Expert Santé afin que nous puissions facturer votre patient(e) lors de sa venue ?\n\nMerci d'avance pour votre retour.\n\nCordialement.\n\n");

    let sendEmailHn = document.querySelector('#send-email-hn');
    const mainRecipientHn = surgeonEmailHn.md
    const ccRecipientHn = surgeonEmailHn.sec || "";
    const mailtoLinkHn = `mailto:${mainRecipientHn}?${ccRecipientHn ? `cc=${ccRecipientHn}&` : ""}subject=${subjectHn}&body=${bodyHn}`;

    sendEmailHn.href = mailtoLinkHn;
    sendEmailHn.style.display = "block";
});

const patientNameFieldHn = document.querySelector("#patient-name-hn");
const patientDobFieldHn = document.querySelector("#patient-dob-hn");
const surgeonFieldHn = document.querySelector("#surgeon-hn");

patientNameFieldHn.addEventListener('input', validerFormulaire);
patientDobFieldHn.addEventListener('input', validerFormulaire);
surgeonFieldHn.addEventListener('change', validerFormulaire);

const generateEmailHn = document.querySelector('#generate-email-hn');
const sendEmailHn = document.querySelector('#send-email-hn');

sendEmailHn.addEventListener('click', () => {
    setTimeout(() => {
        formulaireHn.reset();
        sendEmailHn.style.display = "none";
        generateEmailHn.disabled = true;
    }, 5000)

})