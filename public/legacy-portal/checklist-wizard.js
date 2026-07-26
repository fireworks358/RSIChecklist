// Shared engine for the legacy portal's step-by-step safety checklists.
// Plain vanilla JS, no build step - targets iOS 11 Safari as well as modern browsers.
// Nothing here is persisted (no localStorage, no network) - state lives only in memory
// for the current run and is discarded on restart or page reload.
//
// A page using this engine provides its own items/labels via ChecklistWizard.run(config),
// where config is:
//   {
//     phaseLabels: { before: 'Full label', timeout: '...', signout: '...' },
//     items: [ { phase: 'before'|'timeout'|'signout', section: 'optional subheading', text: 'Question?' }, ... ]
//   }
// and expects the fixed set of element IDs/classes used in rsi-checklist.html to be present
// on the page (startScreen, beginBtn, wizard, phaseBanner, questionSubsection, questionText,
// answerButtons, wizardBackBtn, progressFill, progressLabel, phase-tab buttons with
// data-jump="before|timeout|signout", summaryScreen, summaryBanner, summaryBody, restartBtn,
// restartFinalBtn).
window.ChecklistWizard = (function () {
  'use strict';

  function run(config) {
    var PHASE_KEYS = ['before', 'timeout', 'signout'];
    var ITEMS = config.items;
    var PHASE_LABELS = config.phaseLabels;

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
    var wizardBackBtn = document.getElementById('wizardBackBtn');

    function firstIndexOfPhase(phase) {
      for (var i = 0; i < ITEMS.length; i++) {
        if (ITEMS[i].phase === phase) return i;
      }
      return 0;
    }

    function renderStep() {
      var item = ITEMS[current];

      progressFill.style.width = Math.round((current / ITEMS.length) * 100) + '%';
      progressLabel.textContent = 'Item ' + (current + 1) + ' of ' + ITEMS.length;

      phaseBanner.textContent = PHASE_LABELS[item.phase];
      phaseBanner.className = 'phase-banner phase-banner-' + item.phase;

      questionSubsection.textContent = item.section || '';
      questionSubsection.style.display = item.section ? 'block' : 'none';

      questionText.textContent = item.text;

      var tabs = wizard.querySelectorAll('.phase-tab');
      for (var t = 0; t < tabs.length; t++) {
        var isActive = tabs[t].getAttribute('data-jump') === item.phase;
        tabs[t].className = tabs[t].className.replace(' active', '');
        if (isActive) tabs[t].className += ' active';
      }

      var yesBtn = answerButtons.querySelector('.ans-yes');
      var noBtn = answerButtons.querySelector('.ans-no');
      yesBtn.className = 'ans-btn ans-yes' + (answers[current] === 'yes' ? ' selected' : '');
      noBtn.className = 'ans-btn ans-no' + (answers[current] === 'no' ? ' selected' : '');

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
        if (answers[i] === 'no') noCount++;
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
      for (var j = 0; j < ITEMS.length; j++) {
        byPhase[ITEMS[j].phase].push({ item: ITEMS[j], answer: answers[j] });
      }

      PHASE_KEYS.forEach(function (phaseKey) {
        if (byPhase[phaseKey].length === 0) return;

        var heading = document.createElement('h2');
        heading.className = 'summary-group-heading';
        heading.textContent = PHASE_LABELS[phaseKey];
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
  }

  return { run: run };
})();
