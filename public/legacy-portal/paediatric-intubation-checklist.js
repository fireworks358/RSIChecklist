// Item data for the SORT Paediatric Intubation Checklist.
// See checklist-wizard.js for the engine that runs this.
ChecklistWizard.run({
  phaseLabels: {
    before: 'Preparation',
    timeout: 'Time Out',
    signout: 'Post-Intubation Checklist'
  },
  items: [
    { phase: 'before', section: 'Planning and Team', text: 'Are SORT aware?' },
    { phase: 'before', section: 'Planning and Team', text: 'Have members of the team introduced themselves?' },
    { phase: 'before', section: 'Planning and Team', text: 'Is the indication for intubation clear?' },
    { phase: 'before', section: 'Planning and Team', text: 'Are spinal precautions required?' },
    { phase: 'before', section: 'Planning and Team', text: 'Is any airway difficulty anticipated? (If so, is ENT presence needed? See MAST guideline)' },
    { phase: 'before', section: 'Planning and Team', text: 'Is the patient haemodynamically optimised for intubation?' },

    { phase: 'before', section: 'Patient and Monitoring', text: 'Is IV access in place? (ideally 2 working sites)' },
    { phase: 'before', section: 'Patient and Monitoring', text: 'Has 3-minute pre-oxygenation with 100% O2 been given?' },
    { phase: 'before', section: 'Patient and Monitoring', text: 'Is an NG tube inserted and aspirated continuously when bag-mask ventilating? (especially in neonates)' },
    { phase: 'before', section: 'Patient and Monitoring', text: 'Is EtCO2 attached to the bagging circuit and working?' },
    { phase: 'before', section: 'Patient and Monitoring', text: 'Is patient position optimised? (consider shoulder roll)' },
    { phase: 'before', section: 'Patient and Monitoring', text: 'Is SpO2 "beeps" on?' },
    { phase: 'before', section: 'Patient and Monitoring', text: 'Is BP on automatic 1-minute cycles?' },

    { phase: 'before', section: 'Equipment', text: "Is the correct size facemask and Ayre's T-piece (<20kg) or Water's circuit (>20kg) ready?" },
    { phase: 'before', section: 'Equipment', text: 'Is a Guedel airway ready?' },
    { phase: 'before', section: 'Equipment', text: 'Are Yankauer suction and soft suction catheters ready? (twice the internal diameter of the ETT)' },
    { phase: 'before', section: 'Equipment', text: '1 video laryngoscope (gold-standard) plus 1 other ready? (bulbs/battery checked, 2 blade sizes)' },
    { phase: 'before', section: 'Equipment', text: 'Is the correct size bougie and stylet available? (ETT loaded with stylet for neonates and infants)' },
    { phase: 'before', section: 'Equipment', text: 'Is the correct sized ETT plus one size up/down ready?' },
    { phase: 'before', section: 'Equipment', text: 'Has the ETT cuff been checked?' },
    { phase: 'before', section: 'Equipment', text: 'Is a 2-5ml syringe ready for inflating the cuff?' },
    { phase: 'before', section: 'Equipment', text: "Are Magill's forceps ready?" },
    { phase: 'before', section: 'Equipment', text: 'Is a stethoscope ready?' },
    { phase: 'before', section: 'Equipment', text: 'Is ETT tape ready?' },
    { phase: 'before', section: 'Equipment', text: 'Is the ventilator ready with appropriate settings?' },

    { phase: 'before', section: 'Drugs', text: 'Are any drug allergies known?' },
    { phase: 'before', section: 'Drugs', text: 'Is Ketamine ready?' },
    { phase: 'before', section: 'Drugs', text: 'Is Rocuronium ready?' },
    { phase: 'before', section: 'Drugs', text: 'Is diluted adrenaline ready?' },
    { phase: 'before', section: 'Drugs', text: "Is an IV fluid bolus ready? (5-20ml/kg Hartmann's or Plasmalyte)" },
    { phase: 'before', section: 'Drugs', text: 'Are Morphine + Midazolam or Propofol infusions ready for ongoing sedation?' },

    { phase: 'timeout', text: 'Are roles assigned? (Team leader, Intubator, Airway Assistant, Drug-giver, Pulse-checker, C-spine immobilisation if required)' },
    { phase: 'timeout', text: 'Any concerns about the procedure?' },
    { phase: 'timeout', text: 'Is senior/extra help needed?' },
    { phase: 'timeout', text: 'Is difficult airway anticipated?' },
    { phase: 'timeout', text: 'Has the airway plan been discussed?' },

    { phase: 'signout', text: 'Sustained EtCO2 capnography waveform x7 confirmed?' },
    { phase: 'signout', text: 'Tube depth checked? (bilateral air entry)' },
    { phase: 'signout', text: 'Is the ETT taped and secured?' },
    { phase: 'signout', text: 'Are appropriate ventilator settings confirmed?' },
    { phase: 'signout', text: 'Has sedation been started?' },
    { phase: 'signout', text: 'Has FiO2 been weaned to target appropriate SpO2? (>92% respiratory, 75-85% cyanotic congenital heart disease, >94% neuroprotection)' },
    { phase: 'signout', text: 'Is a CXR required?' }
  ]
});
