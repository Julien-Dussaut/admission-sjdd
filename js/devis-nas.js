function validerFormulaire() {
    const patientName = document.querySelector("#patient-name").value.trim();
    const patientDob = document.querySelector("#patient-dob").value.trim();
    const intervention = document.querySelector("#intervention-description").value.trim();

    if (!patientName || !patientDob || !intervention) {
        document.querySelector("#generate-email").disabled = true;
    } else {
        document.querySelector("#generate-email").disabled = false;
    }
}

const formulaire = document.querySelector('#devis-nas');

formulaire.addEventListener('submit', function (e) {
    e.preventDefault();
    const patientName = document.querySelector("#patient-name").value.trim();
    const patientDob = document.querySelector("#patient-dob").value.trim();
    const intervention = document.querySelector("#intervention-description").value.trim();

    const subject = encodeURIComponent("Demande de devis pour un patient non assuré social");
    let body = encodeURIComponent("Bonjour,\n\nPourriez-vous, s'il vous plaît, me fournir un devis pour le patient suivant :\n " + patientName + ", né(e) le " + new Date(patientDob).toLocaleDateString() + ".\n\nPour cette intervention :\n" + intervention + "\n\nMerci d'avance pour votre retour.\n\nCordialement.\n\n");

    let sendEmail = document.querySelector('#send-email');
    sendEmail.href = `mailto:pmsifactu@clinique-stjeandedieu.com?cc=s.azzabi@clinique-stjeandedieu.com&subject=${subject}&body=${body}`;
    sendEmail.style.display = "block";
});

const patientNameField = document.querySelector("#patient-name");
const patientDobField = document.querySelector("#patient-dob");
const interventionField = document.querySelector("#intervention-description");

patientNameField.addEventListener('input', validerFormulaire);
patientDobField.addEventListener('input', validerFormulaire);
interventionField.addEventListener('input', validerFormulaire);

<<<<<<< HEAD
=======
const generateEmail = document.querySelector('#generate-email');
>>>>>>> feature/devis-hn
const sendEmail = document.querySelector('#send-email');

sendEmail.addEventListener('click', () => {
    setTimeout(() => {
        formulaire.reset();
        sendEmail.style.display = "none";
<<<<<<< HEAD
=======
        generateEmail.disabled = true;
>>>>>>> feature/devis-hn
    }, 5000)

})