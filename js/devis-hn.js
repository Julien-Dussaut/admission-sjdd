function validerFormulaire() {
    const patientName = document.querySelector("#patient-name").value.trim();
    const patientDob = document.querySelector("#patient-dob").value.trim();
    const intervention = document.querySelector("#surgeon").value.trim();

    if (!patientName || !patientDob || !intervention) {
        document.querySelector("#generate-email").disabled = true;
    } else {
        document.querySelector("#generate-email").disabled = false;
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

const formulaire = document.querySelector('#devis-hn');

formulaire.addEventListener('submit', function (e) {
    e.preventDefault();
    const patientName = document.querySelector("#patient-name").value.trim();
    const patientDob = document.querySelector("#patient-dob").value.trim();
    const surgeon = document.querySelector("#surgeon").value.trim();
    const surgeonEmail = findMailSurgeon(surgeon);
    
    const subject = encodeURIComponent("Demande de devis pour une intervention non couverte par l'assurance maladie");
    let body = encodeURIComponent("Bonjour docteur,\n\nUne intervention non couverte par l'assurance maladie est programmée pour la/le patient(e) suivant(e) :\n " + patientName + ", né(e) le " + new Date(patientDob).toLocaleDateString() + ".\n\nÀ ce jour, le devis n'a pas été ajouté sur Expert Santé.\n\nPourriez-vous, s'il vous plaît, ajouter votre devis sur Expert Santé afin que nous puissions facturer votre patient(e) lors de sa venue ?\n\nMerci d'avance pour votre retour.\n\nCordialement.\n\n");

    let sendEmail = document.querySelector('#send-email');
    const mainRecipient = surgeonEmail.md
    const ccRecipient = surgeonEmail.sec || "";
    const mailtoLink = `mailto:${mainRecipient}?${ccRecipient ? `cc=${ccRecipient}&` : ""}subject=${subject}&body=${body}`;

    sendEmail.href = mailtoLink;
    sendEmail.style.display = "block";
});

const patientNameField = document.querySelector("#patient-name");
const patientDobField = document.querySelector("#patient-dob");
const surgeonField = document.querySelector("#surgeon");

patientNameField.addEventListener('input', validerFormulaire);
patientDobField.addEventListener('input', validerFormulaire);
surgeonField.addEventListener('change', validerFormulaire);

const generateEmail = document.querySelector('#generate-email');
const sendEmail = document.querySelector('#send-email');

sendEmail.addEventListener('click', () => {
    setTimeout(() => {
        formulaire.reset();
        sendEmail.style.display = "none";
        generateEmail.disabled = true;
    }, 5000)

})