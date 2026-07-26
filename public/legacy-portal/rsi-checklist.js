// Item data for the ITU Intubation (RSI) safety checklist.
// See checklist-wizard.js for the engine that runs this.
ChecklistWizard.run({
  phaseLabels: {
    before: 'Before the Procedure',
    timeout: 'Time Out',
    signout: 'Sign Out'
  },
  items: [
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

    { phase: 'signout', text: 'Endotracheal position confirmed (EtCO2 trace)?' },
    { phase: 'signout', text: 'Tube depth checked (B/L air entry)?' },
    { phase: 'signout', text: 'ETT secured and cuff pressure checked?' },
    { phase: 'signout', text: 'Nasal O2 removed?' },
    { phase: 'signout', text: 'Appropriate ventilator settings confirmed?' },
    { phase: 'signout', text: 'Analgesia and sedation started?' },
    { phase: 'signout', text: 'ICP optimisation required? D/W neurosurgeon?' },
    { phase: 'signout', text: 'Chest X-Ray required?' },
    { phase: 'signout', text: 'Hand over to nursing staff?' }
  ]
});
