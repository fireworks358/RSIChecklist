// Step-by-step runner for the ITU Intubation (RSI) safety checklist.
// Plain vanilla JS, no build step - targets iOS 11 Safari as well as modern browsers.
// Nothing here is persisted (no localStorage, no network) - state lives only in memory
// for the current run and is discarded on restart or page reload.
(function () {
  'use strict';

  var PHASES = {
    before: { label: 'Before the Procedure', shortLabel: 'Before', cssKey: 'before' },
    timeout: { label: 'Time Out', shortLabel: 'Time Out', cssKey: 'timeout' },
    signout: { label: 'Sign Out', shortLabel: 'Sign Out', cssKey: 'signout' }
  };

  var ITEMS = [
    { phase: 'before', section: 'Preparation', text: 'Have all members of the team introduced themselves?' },
    { phase: 'before', section: 'Preparation', text: 'Is patient position optimised?' },
    { phase: 'before', section: 'Preparation', text: 'Are spinal precautions required?' },
    { phase: 'before', section: 'Preparation', text: 'Pre-oxygenate: 100% FiO2 for 3 mins' },
    { phase: 'before', section: 'Preparation', text: 'Are nasal cannulae for apnoeic ventilation needed?' },
    { phase: 'before', section: 'Preparation', text: "Is Water's circuit available and ready?" },
    { phase: 'before', section: 'Preparation', text: 'Is cricoid pressure considered and NGT aspirated?' },
    { phase: 'before', section: 'Preparation', text: 'Post intubation sedation ready?' },

    { phase: 'before', section: 'Equipment and Drugs', text: 'Is monitoring attached? (ECG, SpO2, BP on regular cycling, EtCO2)' },
    { phase: 'before', section: 'Equipment and Drugs', text: 'Is suction ready?' },
    { phase: 'before', section: 'Equipment and Drugs', text: 'Is adequate venous access in place?' },
    { phase: 'before', section: 'Equipment and Drugs', text: 'Are working laryngoscope/s and bougie ready?' },
    { phase: 'before', section: 'Equipment and Drugs', text: 'Are endotracheal tube/s ready?' },
    { phase: 'before', section: 'Equipment and Drugs', text: 'Are oropharyngeal airways and iGels available?' },
    { phase: 'before', section: 'Equipment and Drugs', text: 'Is difficult airway trolley likely to be needed?' },
    { phase: 'before', section: 'Equipment and Drugs', text: 'Are drugs and vasopressors ready?' },
    { phase: 'before', section: 'Equipment and Drugs', text: 'Any drug allergies known?' },

    { phase: 'before', section: 'Team', text: 'Is senior help needed?' },
    { phase: 'before', section: 'Team', text: 'Is role allocation clear? (Intubator, drugs, assistant, cricoid, MILS)' },
    { phase: 'before', section: 'Team', text: 'Is difficult airway anticipated?' },

    { phase: 'timeout', text: 'Were difficult airway plans discussed?' },
    { phase: 'timeout', text: 'Is senior help needed?' },
    { phase: 'timeout', text: 'Is role allocation clear? (intubator, drugs, assistant, cricoid, MILS)' },
    { phase: 'timeout', text: 'Is difficult airway anticipated?' },
    { phase: 'timeout', text: 'Any concerns about the procedure?' },
    { phase: 'timeout', text: 'If you had any concerns about the procedure, how were these mitigated?', type: 'text' },

    { phase: 'signout', text: 'Endotracheal position confirmed (EtCO2 trace)?' },
    { phase: 'signout', text: 'Tube depth checked (B/L air entry)?' },
    { phase: 'signout', text: 'ETT secured and cuff pressure checked?' },
    { phase: 'signout', text: 'Nasal O2 removed?' },
    { phase: 'signout', text: 'Appropriate ventilator settings confirmed?' },
    { phase: 'signout', text: 'Analgesia and sedation started?' },
    { phase: 'signout', text: 'ICP optimisation required? D/W neurosurgeon?' },
    { phase: 'signout', text: 'Chest X-Ray required?' },
    { phase: 'signout', text: 'Hand over to nursing staff?' }
  ];

  var answers = new Array(ITEMS.length);
  var current = 0;

  var startScreen = document.getElementById('startScreen');
  var wizard = document.getElementById('wizard');
  var summaryScreen = document.getElementById('summaryScreen');
  var restartBtn = document.getElementById('restartBtn');

  var progressFill = document.getElementById('progressFill');
  var progressLabel = document.getElementById('progressLabel');
  var phaseBanner = document.getElementById('phaseBanner');
  var questionSubsection = document.getElementById('questionSubsection');
  var questionText = document.getElementById('questionText');
  var answerButtons = document.getElementById('answerButtons');
  var answerTextWrap = document.getElementById('answerTextWrap');
  var textInput = document.getElementById('textInput');
  var wizardBackBtn = document.getElementById('wizardBackBtn');

  function firstIndexOfPhase(phase) {
    for (var i = 0; i < ITEMS.length; i++) {
      if (ITEMS[i].phase === phase) return i;
    }
    return 0;
  }

  function renderStep() {
    var item = ITEMS[current];
    var phase = PHASES[item.phase];

    progressFill.style.width = Math.round((current / ITEMS.length) * 100) + '%';
    progressLabel.textContent = 'Item ' + (current + 1) + ' of ' + ITEMS.length;

    phaseBanner.textContent = phase.label;
    phaseBanner.className = 'phase-banner phase-banner-' + phase.cssKey;

    questionSubsection.textContent = item.section || '';
    questionSubsection.style.display = item.section ? 'block' : 'none';

    questionText.textContent = item.text;

    var tabs = wizard.querySelectorAll('.phase-tab');
    for (var t = 0; t < tabs.length; t++) {
      var isActive = tabs[t].getAttribute('data-jump') === item.phase;
      tabs[t].className = tabs[t].className.replace(' active', '');
      if (isActive) tabs[t].className += ' active';
    }

    if (item.type === 'text') {
      answerButtons.hidden = true;
      answerTextWrap.hidden = false;
      textInput.value = typeof answers[current] === 'string' ? answers[current] : '';
      textInput.focus();
    } else {
      answerButtons.hidden = false;
      answerTextWrap.hidden = true;
      var yesBtn = answerButtons.querySelector('.ans-yes');
      var noBtn = answerButtons.querySelector('.ans-no');
      yesBtn.className = 'ans-btn ans-yes' + (answers[current] === 'yes' ? ' selected' : '');
      noBtn.className = 'ans-btn ans-no' + (answers[current] === 'no' ? ' selected' : '');
    }

    wizardBackBtn.disabled = current === 0;
  }

  function advance() {
    if (current < ITEMS.length - 1) {
      current += 1;
      renderStep();
    } else {
      showSummary();
    }
  }

  function goBack() {
    if (current > 0) {
      current -= 1;
      renderStep();
    }
  }

  function jumpToPhase(phase) {
    current = firstIndexOfPhase(phase);
    renderStep();
  }

  function showSummary() {
    wizard.hidden = true;
    summaryScreen.hidden = false;

    var noCount = 0;
    for (var i = 0; i < ITEMS.length; i++) {
      if (ITEMS[i].type !== 'text' && answers[i] === 'no') noCount++;
    }

    var banner = document.getElementById('summaryBanner');
    if (noCount > 0) {
      banner.className = 'summary-banner summary-banner-warn';
      banner.textContent = noCount + ' item' + (noCount === 1 ? '' : 's') + ' marked NO — review before proceeding';
    } else {
      banner.className = 'summary-banner summary-banner-ok';
      banner.textContent = 'All checks confirmed Yes';
    }

    var body = document.getElementById('summaryBody');
    body.innerHTML = '';

    var byPhase = { before: [], timeout: [], signout: [] };
    var concerns = '';
    for (var j = 0; j < ITEMS.length; j++) {
      if (ITEMS[j].type === 'text') {
        concerns = typeof answers[j] === 'string' ? answers[j] : '';
        continue;
      }
      byPhase[ITEMS[j].phase].push({ item: ITEMS[j], answer: answers[j] });
    }

    ['before', 'timeout', 'signout'].forEach(function (phaseKey) {
      var heading = document.createElement('h2');
      heading.className = 'summary-group-heading';
      heading.textContent = PHASES[phaseKey].label;
      body.appendChild(heading);

      var list = document.createElement('ul');
      list.className = 'summary-list';

      byPhase[phaseKey].forEach(function (entry) {
        var li = document.createElement('li');
        li.className = 'summary-item' + (entry.answer === 'no' ? ' summary-item-flag' : '');

        var span = document.createElement('span');
        span.className = 'summary-item-text';
        span.textContent = entry.item.text;
        li.appendChild(span);

        var badge = document.createElement('span');
        if (entry.answer === 'yes') {
          badge.className = 'summary-badge summary-badge-yes';
          badge.textContent = 'YES';
        } else if (entry.answer === 'no') {
          badge.className = 'summary-badge summary-badge-no';
          badge.textContent = 'NO';
        } else {
          badge.className = 'summary-badge summary-badge-skipped';
          badge.textContent = 'SKIPPED';
        }
        li.appendChild(badge);

        list.appendChild(li);
      });

      body.appendChild(list);
    });

    var concernsHeading = document.createElement('h2');
    concernsHeading.className = 'summary-group-heading';
    concernsHeading.textContent = 'Concerns / Mitigation';
    body.appendChild(concernsHeading);

    var concernsBox = document.createElement('p');
    concernsBox.className = 'summary-concerns';
    concernsBox.textContent = concerns || 'No concerns noted.';
    body.appendChild(concernsBox);
  }

  function reset() {
    answers = new Array(ITEMS.length);
    current = 0;
    startScreen.hidden = false;
    wizard.hidden = true;
    summaryScreen.hidden = true;
    restartBtn.hidden = true;
  }

  document.getElementById('beginBtn').addEventListener('click', function () {
    startScreen.hidden = true;
    wizard.hidden = false;
    restartBtn.hidden = false;
    current = 0;
    renderStep();
  });

  answerButtons.addEventListener('click', function (e) {
    var target = e.target;
    if (!target || !target.getAttribute) return;
    var ans = target.getAttribute('data-ans');
    if (!ans) return;
    answers[current] = ans;
    advance();
  });

  document.getElementById('continueBtn').addEventListener('click', function () {
    answers[current] = textInput.value.trim();
    advance();
  });

  wizardBackBtn.addEventListener('click', goBack);

  var jumpButtons = document.querySelectorAll('[data-jump]');
  for (var k = 0; k < jumpButtons.length; k++) {
    jumpButtons[k].addEventListener('click', function (e) {
      jumpToPhase(e.currentTarget.getAttribute('data-jump'));
    });
  }

  function confirmRestart() {
    if (window.confirm('Start a new checklist? Current answers will be cleared.')) {
      reset();
    }
  }

  restartBtn.addEventListener('click', confirmRestart);
  document.getElementById('restartFinalBtn').addEventListener('click', reset);
})();
