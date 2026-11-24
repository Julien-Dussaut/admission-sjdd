// Outils partagés par les pages de relance et de devis :
// aperçu de l'email en direct, lien mailto et copie du texte.
const Mail = (() => {
    const PLACEHOLDER_DATE = '[date de la journée]';

    function datePrepa() {
        const stored = localStorage.getItem('datePreparation');
        if (!stored) {
            return PLACEHOLDER_DATE;
        }
        const date = new Date(stored);
        if (Number.isNaN(date.getTime())) {
            return PLACEHOLDER_DATE;
        }
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    function formatDate(value) {
        if (!value) {
            return '[date de naissance]';
        }
        return new Date(value).toLocaleDateString('fr-FR');
    }

    function mailto({ to, cc, subject, body }) {
        const params = [];
        if (cc) {
            params.push(`cc=${cc}`);
        }
        params.push(`subject=${encodeURIComponent(subject)}`);
        params.push(`body=${encodeURIComponent(body)}`);
        return `mailto:${to}?${params.join('&')}`;
    }

    // Liste à puces regroupée par catégorie : [{ group, text }] -> texte brut
    function groupedList(items) {
        const groups = [];
        items.forEach(({ group, text }) => {
            let entry = groups.find(candidate => candidate.title === group);
            if (!entry) {
                entry = { title: group, lines: [] };
                groups.push(entry);
            }
            entry.lines.push(`• ${text}`);
        });
        return groups
            .map(entry => `${entry.title} :\n${entry.lines.join('\n')}\n`)
            .join('\n');
    }

    // prefix : mineurs, majeurs, nas, hn (identifiants des éléments d'aperçu)
    // build() renvoie { to, cc, subject, body } ; isValid() dit si on peut envoyer
    function bind({ prefix, form, build, isValid }) {
        const send = document.getElementById(`send-email-${prefix}`);
        const copy = document.getElementById(`copy-email-${prefix}`);
        const to = document.getElementById(`${prefix}-mail-to`);
        const cc = document.getElementById(`${prefix}-mail-cc`);
        const ccRow = document.getElementById(`${prefix}-mail-cc-row`);
        const subject = document.getElementById(`${prefix}-mail-subject`);
        const body = document.getElementById(`${prefix}-mail-body`);
        const hint = document.getElementById(`${prefix}-mail-hint`);
        const copyLabel = copy.querySelector('span');
        let resetTimer;
        let current = null;

        function update() {
            current = build();
            const valid = isValid();

            to.textContent = current.to.split(',').join(', ');
            cc.textContent = current.cc || '';
            ccRow.hidden = !current.cc;
            subject.textContent = current.subject;
            body.textContent = current.body;
            hint.hidden = valid;

            send.setAttribute('aria-disabled', String(!valid));
            copy.setAttribute('aria-disabled', String(!valid));
            if (valid) {
                send.href = mailto(current);
                send.tabIndex = 0;
            } else {
                send.removeAttribute('href');
                send.tabIndex = -1;
            }
        }

        form.addEventListener('input', update);
        form.addEventListener('change', update);
        form.addEventListener('submit', event => event.preventDefault());

        send.addEventListener('click', event => {
            if (send.getAttribute('aria-disabled') === 'true') {
                event.preventDefault();
                return;
            }
            // Comme avant : le formulaire est vidé quelques secondes après l'envoi
            setTimeout(() => {
                form.reset();
                update();
            }, 5000);
        });

        let copyTimer;
        copy.addEventListener('click', async () => {
            if (copy.getAttribute('aria-disabled') === 'true') {
                return;
            }
            window.clearTimeout(copyTimer);
            try {
                await navigator.clipboard.writeText(current.body);
                copyLabel.textContent = 'Texte copié';
            } catch {
                copyLabel.textContent = 'Copie impossible';
            }
            copyTimer = window.setTimeout(() => {
                copyLabel.textContent = 'Copier le texte';
            }, 2000);
        });

        update();
        return update;
    }

    return { datePrepa, formatDate, mailto, groupedList, bind };
})();
