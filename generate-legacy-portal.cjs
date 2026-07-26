// Generates the static "legacy portal" for old iPads (iOS 11+). Almost all
// of it is JS-free; the one exception is the Directory page's search box,
// which needs a small vanilla <script> to filter as you type - see
// renderDirectoryPage() below.
//
// Run with `node generate-legacy-portal.cjs` after adding/renaming PDFs in
// public/guidelines/adult or public/guidelines/paediatric, or after editing
// directory-data.csv.
//
// Output: public/legacy-portal/{index,adult,paediatric,laryngectomy-tracheostomy,directory}.html
// Deployed automatically at /RSIChecklist/legacy-portal/ (public/ is copied
// verbatim into dist/ by Vite, no build step needed for these files).

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'public', 'legacy-portal');
const DIRECTORY_CSV = path.join(__dirname, 'directory-data.csv');

// Mirrors src/data/guidelines.ts (title, file, optional group).
// Kept as a plain duplicate here so this script has zero dependency on the
// TypeScript app and can run with plain Node.
const adultGuidelines = [
  { title: 'RSI Checklist', file: 'rsi-checklist.pdf', href: 'rsi-checklist.html', description: 'Interactive step-by-step Rapid Sequence Intubation checklist' },
  { title: 'DAS Guidelines 2025', file: 'DAS25.pdf', description: "Can't Intubate, Can't Oxygenate emergency protocol" },
  { title: 'Front of Neck visual guide', file: 'eFONA image.jpg', description: 'Emergency Front of Neck Access visual guide' },
  { title: 'GA Checklist', file: 'GA Checklist.pdf', description: 'General anaesthesia checklist' },
  { title: 'ALS Algorithm 2025', file: 'Adult ALS algorithm 2025.pdf', description: 'Adult advanced life support algorithm (2025)', group: 'Arrest' },
  { title: 'In Hospital Algorithm 2025', file: 'Adult in hospital algorithm 2025.pdf', description: 'Adult in-hospital resuscitation algorithm (2025)', group: 'Arrest' },
  { title: 'Choking Algorithm 2025', file: 'Adult choking algorithm 2025 .pdf', description: 'Adult choking management algorithm (2025)', group: 'Arrest' },
  { title: 'Bradyarrhythmia 2025', file: 'Adult bradyarrhythmia 2025.pdf', description: 'Management of adult bradyarrhythmias (2025)' },
  { title: 'Tachyarrhythmia 2025', file: 'Adult tachyarrhythmia algorithm 2025.pdf', description: 'Management of adult tachyarrhythmias (2025)' },
  { title: 'Reversible Causes', file: 'Reversable causes of cardiac arrest vs5 Jan 2019 12 0370.pdf', description: 'Reversible causes of cardiac arrest (4Hs and 4Ts)', group: 'Arrest' },
  { title: 'Anaphylaxis 2021', file: 'Anaphylaxis algorithm 2021.pdf', description: 'Anaphylaxis management algorithm (2021)' },
  { title: 'Special Circumstances', file: 'Special circumstances Guidelines (2).pdf', description: 'Guidelines for special circumstances during resuscitation', group: 'Arrest' },
  { title: 'Massive Haemorrhage', file: 'Massive Haemorrhage Guideline.pdf', description: 'Management protocol for massive haemorrhage' },
  { title: 'Critical Care Infusions', file: 'Critical Care Infusions guideline (1).pdf', description: 'Guide to critical care drug infusions' },
  { title: 'Critical Care Transfer', file: 'Critical Care Transfer Team.pdf', description: 'Critical care transfer team guidelines' },
  { title: 'High Flow Nasal Oxygen', file: 'High Flow Nasal Oxygen (HFNO)  in Theatres.pdf', description: 'HFNO use in operating theatres' },
  { title: 'Emergency Equipment', file: 'Emergency Equipment locations.pdf', description: 'Emergency equipment locations reference' }
];

const paediatricGuidelines = [
  { title: 'Intubation Checklist', file: 'intubation-checklist-2024.pdf', href: 'paediatric-intubation-checklist.html', description: 'Interactive step-by-step SORT paediatric intubation checklist (2024)' },
  { title: 'Anaesthesia for Emergencies', file: 'anaesthesia-for-emergencies.pdf', description: 'Guidelines for emergency anaesthesia procedures' },
  { title: 'Cardiac Arrest (ALS)', file: 'cardiac-arrest-als.pdf', description: 'Advanced life support protocol for paediatric cardiac arrest', group: 'Arrest' },
  { title: 'ROSC Management', file: 'rosc-management.pdf', description: 'Management protocol following return of spontaneous circulation', group: 'Arrest' },
  { title: 'PALS Algorithm 2025', file: 'Paediatric advanced life support algorithm 2025.pdf', description: 'Paediatric advanced life support algorithm (2025)', group: 'Arrest' },
  { title: 'Newborn Life Support 2025', file: 'Newborn life support algorithm 2025.pdf', description: 'Newborn life support algorithm (2025)', group: 'Arrest' },
  { title: 'Advanced Newborn Resus', file: 'Advanced resuscitation of the newborn infant algorithm 2025_0.pdf', description: 'Advanced resuscitation of the newborn infant (2025)', group: 'Arrest' },
  { title: 'Anaphylaxis', file: 'anaphylaxis.pdf', description: 'Emergency management of anaphylaxis in children' },
  { title: 'Arrhythmias', file: 'arrhythmias.pdf', description: 'Recognition and management of paediatric arrhythmias' },
  { title: 'Sepsis (QRG)', file: 'sepsis-qrg.pdf', description: 'Quick reference guide for paediatric sepsis management' },
  { title: 'Seizures', file: 'seizures.pdf', description: 'Management of paediatric seizures and status epilepticus' },
  { title: 'Bronchiolitis', file: 'bronchiolitis.pdf', description: 'Management guideline for bronchiolitis' },
  { title: 'Upper Airway Obstruction', file: 'upper-airway-obstruction.pdf', description: 'Protocol for managing upper airway obstruction' },
  { title: 'Ventilation Initiation', file: 'ventilation-initiation.pdf', description: 'Guide for initiating mechanical ventilation during stabilisation' },
  { title: 'Ventilated Child Checklist', file: 'caring-for-ventilated-child-checklist.pdf', description: 'Checklist for caring for ventilated children while awaiting SORT' },
  { title: 'Extubation Checklist', file: 'extubation-checklist.pdf', description: 'Safety checklist for paediatric extubation' },
  { title: 'Trauma Reference', file: 'trauma-reference-document.pdf', description: 'Comprehensive trauma management reference document' },
  { title: 'Haemorrhage (QRG)', file: 'haemorrhage-qrg.pdf', description: 'Quick reference guide for managing paediatric haemorrhage' },
  { title: 'Drowning', file: 'drowning.pdf', description: 'Management protocol for drowning incidents' },
  { title: 'Hypothermia', file: 'hypothermia.pdf', description: 'Management of paediatric hypothermia' },
  { title: 'Neonatal Collapse', file: 'neonatal-collapse.pdf', description: 'Emergency management of neonatal collapse' },
  { title: 'IO Insertion Guide', file: 'io-insertion-guide.pdf', description: 'Step-by-step guide for intraosseous (IO) access insertion' },
  { title: 'Drug Infusion Guide', file: 'drug-infusion-guide.pdf', description: 'Reference guide for drug infusions during SORT transfers' },
  { title: 'Infusion Calculations', file: 'infusion-calculations.pdf', description: 'Quick reference for calculating infusion rates' },
  { title: 'Time Critical Transfer Checklist', file: 'time-critical-transfer-checklist.pdf', description: 'Checklist for time-critical paediatric transfers' },
  { title: 'PICU Handover Checklist', file: 'picu-handover-checklist.pdf', description: 'Structured handover checklist for PICU patients' },
  { title: 'PDCH', file: 'PDCH.pdf', description: 'PDCH guideline for paediatric patients' }
];

// PDFs live in public/guidelines/adult but get their own top-level section.
const trachyGuidelines = [
  { title: 'Emergency Laryngectomy Management', file: 'Emergency_Laryngectomy.pdf', description: 'Emergency management of the patient with a laryngectomy' },
  { title: 'Emergency Tracheostomy Management', file: 'Emergency_Tracheostomy.pdf', description: 'Emergency management of the patient with a tracheostomy' }
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function encodeHref(file) {
  return file.split('/').map(encodeURIComponent).join('/');
}

// --- Directory (phone/bleep numbers) -------------------------------------
// Data lives in directory-data.csv so non-developers can add/edit/re-nest
// entries without touching HTML/JS. See that file's header comment for the
// column format.

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0 && !line.trim().startsWith('#'));

  const rows = lines.map((line) => {
    const fields = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cur += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    fields.push(cur);
    return fields;
  });

  const header = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((fields) => {
    const row = {};
    header.forEach((h, i) => {
      row[h] = (fields[i] || '').trim();
    });
    return row;
  });
}

function buildDirectoryTree(rows) {
  const root = { name: '', children: new Map() };
  rows.forEach((row) => {
    const segments = (row.path || '').split('>').map((s) => s.trim()).filter(Boolean);
    if (segments.length === 0) return;
    let node = root;
    segments.forEach((seg, idx) => {
      if (!node.children.has(seg)) {
        node.children.set(seg, { name: seg, children: new Map() });
      }
      node = node.children.get(seg);
      if (idx === segments.length - 1) {
        node.number = row.number || '';
        node.notes = row.notes || '';
        node.type = (row.type || 'phone').toLowerCase() === 'bleep' ? 'bleep' : 'phone';
      }
    });
  });
  return root;
}

function telHref(rawNumber) {
  return (rawNumber || '').replace(/[^\d+]/g, '');
}

function renderDirectoryNumber(rawNumber, type) {
  const digits = telHref(rawNumber);
  const label = type === 'bleep' ? 'Bleep' : 'Ext';
  if (!digits) {
    return `<span class="dir-number dir-number-tbc">${escapeHtml(label)} ${escapeHtml(rawNumber || 'TBC')}</span>`;
  }
  return `<a class="dir-number dir-number-${type}" href="tel:${digits}">${escapeHtml(label)} ${escapeHtml(rawNumber)}</a>`;
}

function renderDirectoryLeaf(node, ancestors) {
  const path = ancestors.concat([node.name]);
  const searchStr = escapeHtml(`${path.join(' ')} ${node.type || ''} ${node.number || ''}`.toLowerCase());
  return `<div class="dir-row" data-search="${searchStr}">
  <span class="dir-name">${escapeHtml(node.name)}</span>
  ${renderDirectoryNumber(node.number, node.type)}
  ${node.notes ? `<span class="dir-notes">${escapeHtml(node.notes)}</span>` : ''}
</div>\n`;
}

function renderDirectoryNode(node, ancestors) {
  const hasChildren = node.children.size > 0;
  if (!hasChildren) {
    return renderDirectoryLeaf(node, ancestors);
  }
  const path = ancestors.concat([node.name]);
  let inner = '';
  if (node.number) {
    inner += renderDirectoryLeaf({ name: 'General', number: node.number, notes: node.notes, type: node.type, children: new Map() }, path);
  }
  node.children.forEach((child) => {
    inner += renderDirectoryNode(child, path);
  });
  return `<details class="dir-group">
<summary>${escapeHtml(node.name)}</summary>
<div class="dir-children">
${inner}</div>
</details>\n`;
}

const DIRECTORY_SEARCH_SCRIPT = `<script>
(function () {
  var input = document.getElementById('dir-search');
  var rows = document.querySelectorAll('.dir-row');
  var groups = document.querySelectorAll('details.dir-group');
  var noResults = document.getElementById('dir-no-results');
  if (!input) return;

  input.addEventListener('input', function () {
    var query = input.value.trim().toLowerCase();
    var anyVisible = false;

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var match = query === '' || (row.getAttribute('data-search') || '').indexOf(query) !== -1;
      row.style.display = match ? '' : 'none';
      if (match) anyVisible = true;
    }

    for (var j = 0; j < groups.length; j++) {
      var group = groups[j];
      var groupRows = group.querySelectorAll('.dir-row');
      var hasVisible = false;
      for (var k = 0; k < groupRows.length; k++) {
        if (groupRows[k].style.display !== 'none') {
          hasVisible = true;
          break;
        }
      }
      group.style.display = hasVisible ? '' : 'none';
      if (query === '') {
        group.removeAttribute('open');
      } else if (hasVisible) {
        group.setAttribute('open', 'open');
      }
    }

    if (noResults) noResults.hidden = anyVisible || query === '';
  });
})();
</script>`;

function renderDirectoryPage() {
  const csvText = fs.readFileSync(DIRECTORY_CSV, 'utf8');
  const rows = parseCsv(csvText);
  const root = buildDirectoryTree(rows);

  let switchboardNumber = '';
  root.children.forEach((node, name) => {
    if (name.toLowerCase() === 'switchboard') {
      switchboardNumber = node.number || '';
      root.children.delete(name);
    }
  });

  let listHtml = '';
  root.children.forEach((node) => {
    listHtml += renderDirectoryNode(node, []);
  });

  const switchboardDigits = telHref(switchboardNumber);
  const switchboardBanner = switchboardDigits
    ? `<a class="switchboard-banner" href="tel:${switchboardDigits}">
  <img class="switchboard-qr" src="directory-qr.svg" alt="QR code that calls the hospital switchboard" width="120" height="120">
  <span class="switchboard-label">Switchboard</span>
  <span class="switchboard-sub">Scan or tap to call ${escapeHtml(switchboardNumber)}</span>
</a>`
    : `<div class="switchboard-banner switchboard-banner-tbc">
  <img class="switchboard-qr" src="directory-qr.svg" alt="QR code that calls the hospital switchboard" width="120" height="120">
  <span class="switchboard-label">Switchboard</span>
  <span class="switchboard-sub">Number not yet set - see directory-data.csv</span>
</div>`;

  const body = `${switchboardBanner}
<input type="text" id="dir-search" class="dir-search" placeholder="Search names, departments, bleeps&hellip;" autocapitalize="none" autocorrect="off" autocomplete="off">
<div id="dir-list">
${listHtml}</div>
<p id="dir-no-results" class="dir-no-results" hidden>No matches.</p>
${DIRECTORY_SEARCH_SCRIPT}`;

  return { body, switchboardNumber };
}

function page(title, bodyHtml, backLink, mainClass) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
<meta name="theme-color" content="#005EB8">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Airway Legacy">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="../icons/icon-192.png">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topbar">
${backLink ? `<a class="back" href="${backLink}">&larr; Back</a>` : ''}
<h1>${escapeHtml(title)}</h1>
</header>
<main${mainClass ? ` class="${mainClass}"` : ''}>
${bodyHtml}
</main>
<footer>
<p>Emergency Airway Portal &mdash; offline directory for hospital tablets</p>
</footer>
</body>
</html>
`;
}

function renderList(guidelines, category) {
  const groups = new Map();
  guidelines.forEach((g) => {
    const key = g.group || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(g);
  });

  let html = '';
  groups.forEach((items, groupName) => {
    if (groupName) {
      html += `<h2 class="group-heading">${escapeHtml(groupName)}</h2>\n`;
    }
    html += '<ul class="doc-list">\n';
    items.forEach((g) => {
      const href = g.href || `../guidelines/${category}/${encodeHref(g.file)}`;
      html += `<li><a class="doc-link" href="${href}">
  <span class="doc-title">${escapeHtml(g.title)}</span>
  <span class="doc-desc">${escapeHtml(g.description)}</span>
</a></li>\n`;
    });
    html += '</ul>\n';
  });
  return html;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

fs.writeFileSync(
  path.join(OUT_DIR, 'index.html'),
  page(
    'Emergency Airway Portal',
    `<div class="landing-grid">
  <a class="landing-tile tile-adult" href="adult.html">
    <span class="tile-title">Adult</span>
    <span class="tile-sub">Guidelines &amp; algorithms</span>
  </a>
  <a class="landing-tile tile-paed" href="paediatric.html">
    <span class="tile-title">Paediatric</span>
    <span class="tile-sub">Guidelines &amp; algorithms</span>
  </a>
</div>
<div class="landing-grid">
  <a class="landing-tile tile-trachy" href="laryngectomy-tracheostomy.html">
    <span class="tile-title">Laryngectomy/<wbr>Tracheostomy</span>
    <span class="tile-sub">Emergency management</span>
  </a>
  <a class="landing-tile tile-orphan" href="https://www.orphananesthesia.eu/rare-diseases/published-guidelines.html" target="_blank" rel="noopener noreferrer">
    <span class="tile-title">Orphan Anaesthesia</span>
    <span class="tile-sub">Rare disease guidelines</span>
  </a>
</div>
<div class="landing-grid">
  <a class="landing-tile tile-directory" href="directory.html">
    <span class="tile-title">Directory</span>
    <span class="tile-sub">Phone &amp; bleep numbers</span>
  </a>
  <div class="landing-tile tile-feedback tile-qr">
    <img class="tile-qr-code" src="feedback-qr.svg" alt="QR code linking to the feedback form" width="110" height="110">
    <span class="tile-title tile-title-sm">Feedback</span>
    <span class="tile-sub">Scan to open the form</span>
  </div>
  <a class="landing-tile tile-checklist" href="https://odpcoordinator.netlify.app/airway-trolley.html">
    <span class="tile-title">Weekly Checklist</span>
    <span class="tile-sub"></span>
  </a>
</div>`,
    null,
    'landing-main'
  )
);

fs.writeFileSync(
  path.join(OUT_DIR, 'adult.html'),
  page('Adult Guidelines', renderList(adultGuidelines, 'adult'), 'index.html')
);

fs.writeFileSync(
  path.join(OUT_DIR, 'paediatric.html'),
  page('Paediatric Guidelines', renderList(paediatricGuidelines, 'paediatric'), 'index.html')
);

fs.writeFileSync(
  path.join(OUT_DIR, 'laryngectomy-tracheostomy.html'),
  page('Laryngectomy/Tracheostomy', renderList(trachyGuidelines, 'adult'), 'index.html')
);

const { body: directoryBody, switchboardNumber } = renderDirectoryPage();
fs.writeFileSync(
  path.join(OUT_DIR, 'directory.html'),
  page('Directory', directoryBody, 'index.html')
);

console.log(`Generated ${adultGuidelines.length} adult, ${paediatricGuidelines.length} paediatric and ${trachyGuidelines.length} laryngectomy/tracheostomy entries into ${OUT_DIR}`);
if (!telHref(switchboardNumber)) {
  console.log('Directory: Switchboard number is not set yet - edit directory-data.csv, then re-run this script and `python3 generate-directory-qr.py`.');
} else {
  console.log(`Directory: Switchboard is ${switchboardNumber}. If this changed, also run: python3 generate-directory-qr.py`);
}
