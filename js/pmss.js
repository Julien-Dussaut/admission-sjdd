document.addEventListener('DOMContentLoaded', () => {
  // --- Paramètres communs (à mettre à jour chaque année) ---
  const PMSS = 4005;                                         // PMSS de l'année (€)
  const CONFORT = 210;                                       // CP confort (€)
  const SUITE = 300;                                         // CP suite (€)
  const POURCENTAGES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7];

  // --- Fonctions partagées ---
  const formatPct = (n) => n.toLocaleString('fr-FR');

  const formatEuro = (centimes) =>
    (centimes / 100).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    });

  const copyIcon = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>';
  const checkIcon = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>';

  const createCopyButton = (value) => {
    const copyButton = document.createElement('button');
    const copyLabel = `Copier le montant ${value}`;
    let resetTimer;

    copyButton.type = 'button';
    copyButton.className = 'pmss-copy-button';
    copyButton.setAttribute('aria-label', copyLabel);
    copyButton.title = copyLabel;
    copyButton.innerHTML = copyIcon;
    copyButton.addEventListener('click', async () => {
      window.clearTimeout(resetTimer);

      try {
        await navigator.clipboard.writeText(value);
        copyButton.innerHTML = checkIcon;
        copyButton.classList.add('is-copied');
        copyButton.setAttribute('aria-label', 'Montant copié');
        copyButton.title = 'Montant copié';
      } catch {
        copyButton.setAttribute('aria-label', 'Copie impossible');
        copyButton.title = 'Copie impossible';
      }

      resetTimer = window.setTimeout(() => {
        copyButton.innerHTML = copyIcon;
        copyButton.classList.remove('is-copied');
        copyButton.setAttribute('aria-label', copyLabel);
        copyButton.title = copyLabel;
      }, 2000);
    });

    return copyButton;
  };

  // Calculs en centimes pour éviter les erreurs d'arrondi
  const calcul = (pct) => {
    const mutuelle = Math.round((PMSS * 100 * pct) / 100);
    return {
      mutuelle,
      confort: Math.max(0, CONFORT * 100 - mutuelle),
      suite: Math.max(0, SUITE * 100 - mutuelle),
    };
  };

  // --- 1. Tableau ---
  const table = document.querySelector('#pmss table');
  if (table) {
    const tbody = table.tBodies[0] || table.createTBody();
    tbody.innerHTML = '';

    POURCENTAGES.forEach((pct) => {
      const { mutuelle, confort, suite } = calcul(pct);
      const tr = tbody.insertRow();

      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = formatPct(pct);
      tr.appendChild(th);

      [mutuelle, confort, suite].forEach((montant, index) => {
        const cell = tr.insertCell();
        const valeur = formatEuro(montant);

        if (index !== 0) {
          cell.textContent = valeur;
          return;
        }

        const amount = document.createElement('span');
        amount.textContent = valeur;
        cell.appendChild(amount);

        cell.appendChild(createCopyButton(valeur));
      });
    });
  }

  // --- 2. Calculateur ---
  const input = document.getElementById('pmss-pourcentage');
  if (input) {
    const outMutuelle = document.getElementById('pmss-mutuelle');
    const outConfort = document.getElementById('pmss-confort');
    const outSuite = document.getElementById('pmss-suite');

    input.addEventListener('input', () => {
      const pct = input.valueAsNumber;

      if (Number.isNaN(pct) || pct < 0) {
        outMutuelle.value = outConfort.value = outSuite.value = '—';
        outMutuelle.parentElement.querySelector('.pmss-copy-button')?.remove();
        return;
      }

      const { mutuelle, confort, suite } = calcul(pct);
      outMutuelle.value = formatEuro(mutuelle) + ' €';
      outConfort.value = formatEuro(confort) + ' €';
      outSuite.value = formatEuro(suite) + ' €';
      outMutuelle.parentElement.querySelector('.pmss-copy-button')?.remove();
      outMutuelle.parentElement.appendChild(createCopyButton(outMutuelle.value));
    });
  }
});