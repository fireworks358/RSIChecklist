import type { Guideline, GuidelineCategory } from './types';

export const adultGuidelines: Guideline[] = [
  {
    id: 'adult-rsi-checklist',
    title: 'RSI Checklist',
    category: 'adult',
    pdfPath: '/guidelines/adult/rsi-checklist.pdf',
    description: 'Rapid Sequence Intubation checklist for adult patients',
    order: 1
  },
  {
    id: 'adult-difficult-airway',
    title: 'Difficult Airway Algorithm',
    category: 'adult',
    pdfPath: '/guidelines/adult/difficult-airway-algorithm.pdf',
    description: 'Management algorithm for difficult adult airways',
    order: 2
  },
  {
    id: 'adult-cico-algorithm',
    title: 'CICO Algorithm',
    category: 'adult',
    pdfPath: '/guidelines/adult/cico-algorithm.pdf',
    description: 'Can\'t Intubate, Can\'t Oxygenate emergency protocol',
    order: 3
  },
  {
    id: 'adult-failed-intubation',
    title: 'Failed Intubation Drill',
    category: 'adult',
    pdfPath: '/guidelines/adult/failed-intubation-drill.pdf',
    description: 'Step-by-step protocol for failed intubation scenarios',
    order: 4
  },
  {
    id: 'adult-als-algorithm',
    title: 'ALS Algorithm 2025',
    category: 'adult',
    pdfPath: '/guidelines/adult/Adult ALS algorithm 2025.pdf',
    description: 'Adult advanced life support algorithm (2025)',
    order: 5,
    subcategory: 'Arrest'
  },
  {
    id: 'adult-bradyarrhythmia',
    title: 'Bradyarrhythmia 2025',
    category: 'adult',
    pdfPath: '/guidelines/adult/Adult bradyarrhythmia 2025.pdf',
    description: 'Management of adult bradyarrhythmias (2025)',
    order: 6
  },
  {
    id: 'adult-tachyarrhythmia',
    title: 'Tachyarrhythmia 2025',
    category: 'adult',
    pdfPath: '/guidelines/adult/Adult tachyarrhythmia algorithm 2025.pdf',
    description: 'Management of adult tachyarrhythmias (2025)',
    order: 7
  },
  {
    id: 'adult-choking',
    title: 'Choking Algorithm 2025',
    category: 'adult',
    pdfPath: '/guidelines/adult/Adult choking algorithm 2025 .pdf',
    description: 'Adult choking management algorithm (2025)',
    order: 8,
    subcategory: 'Arrest'
  },
  {
    id: 'adult-in-hospital',
    title: 'In Hospital Algorithm 2025',
    category: 'adult',
    pdfPath: '/guidelines/adult/Adult in hospital algorithm 2025.pdf',
    description: 'Adult in-hospital resuscitation algorithm (2025)',
    order: 9,
    subcategory: 'Arrest'
  },
  {
    id: 'adult-anaphylaxis',
    title: 'Anaphylaxis 2021',
    category: 'adult',
    pdfPath: '/guidelines/adult/Anaphylaxis algorithm 2021.pdf',
    description: 'Anaphylaxis management algorithm (2021)',
    order: 10
  },
  {
    id: 'adult-reversible-causes',
    title: 'Reversible Causes',
    category: 'adult',
    pdfPath: '/guidelines/adult/Reversable causes of cardiac arrest vs5 Jan 2019 12 0370.pdf',
    description: 'Reversible causes of cardiac arrest (4Hs and 4Ts)',
    order: 11,
    subcategory: 'Arrest'
  },
  {
    id: 'adult-special-circumstances',
    title: 'Special Circumstances',
    category: 'adult',
    pdfPath: '/guidelines/adult/Special circumstances Guidelines (2).pdf',
    description: 'Guidelines for special circumstances during resuscitation',
    order: 12,
    subcategory: 'Arrest'
  },
  {
    id: 'adult-massive-haemorrhage',
    title: 'Massive Haemorrhage',
    category: 'adult',
    pdfPath: '/guidelines/adult/Massive Haemorrhage Guideline.pdf',
    description: 'Management protocol for massive haemorrhage',
    order: 13
  },
  {
    id: 'adult-critical-care-infusions',
    title: 'Critical Care Infusions',
    category: 'adult',
    pdfPath: '/guidelines/adult/Critical Care Infusions guideline (1).pdf',
    description: 'Guide to critical care drug infusions',
    order: 14
  },
  {
    id: 'adult-transfer-team',
    title: 'Critical Care Transfer',
    category: 'adult',
    pdfPath: '/guidelines/adult/Critical Care Transfer Team.pdf',
    description: 'Critical care transfer team guidelines',
    order: 15
  },
  {
    id: 'adult-hfno',
    title: 'High Flow Nasal Oxygen',
    category: 'adult',
    pdfPath: '/guidelines/adult/High Flow Nasal Oxygen (HFNO)  in Theatres.pdf',
    description: 'HFNO use in operating theatres',
    order: 16
  },
  {
    id: 'adult-ga-checklist',
    title: 'GA Checklist',
    category: 'adult',
    pdfPath: '/guidelines/adult/GA Checklist.pdf',
    description: 'General anaesthesia checklist',
    order: 17
  },
  {
    id: 'adult-equipment-locations',
    title: 'Emergency Equipment',
    category: 'adult',
    pdfPath: '/guidelines/adult/Emergency Equipment locations.pdf',
    description: 'Emergency equipment locations reference',
    order: 18
  }
];

export const paediatricGuidelines: Guideline[] = [
  {
    id: 'paed-rsi-checklist',
    title: 'RSI Checklist',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/rsi-checklist.pdf',
    description: 'Rapid Sequence Intubation checklist for paediatric patients',
    order: 1
  },
  {
    id: 'paed-difficult-airway',
    title: 'Difficult Airway Algorithm',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/difficult-airway-algorithm.pdf',
    description: 'Management algorithm for difficult paediatric airways',
    order: 2
  },
  {
    id: 'paed-cico-algorithm',
    title: 'CICO Algorithm',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/cico-algorithm.pdf',
    description: 'Can\'t Intubate, Can\'t Oxygenate emergency protocol',
    order: 3
  },
  {
    id: 'paed-failed-intubation',
    title: 'Failed Intubation Drill',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/failed-intubation-drill.pdf',
    description: 'Step-by-step protocol for failed intubation scenarios',
    order: 4
  },
  {
    id: 'paed-intubation-checklist',
    title: 'Intubation Checklist',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/intubation-checklist-2024.pdf',
    description: 'SORT intubation checklist for paediatric patients (2024)',
    order: 5
  },
  {
    id: 'paed-anaesthesia-emergencies',
    title: 'Anaesthesia for Emergencies',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/anaesthesia-for-emergencies.pdf',
    description: 'Guidelines for emergency anaesthesia procedures',
    order: 6
  },
  {
    id: 'paed-cardiac-arrest-als',
    title: 'Cardiac Arrest (ALS)',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/cardiac-arrest-als.pdf',
    description: 'Advanced life support protocol for paediatric cardiac arrest',
    order: 7,
    subcategory: 'Arrest'
  },
  {
    id: 'paed-rosc-management',
    title: 'ROSC Management',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/rosc-management.pdf',
    description: 'Management protocol following return of spontaneous circulation',
    order: 8,
    subcategory: 'Arrest'
  },
  {
    id: 'paed-anaphylaxis',
    title: 'Anaphylaxis',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/anaphylaxis.pdf',
    description: 'Emergency management of anaphylaxis in children',
    order: 9
  },
  {
    id: 'paed-arrhythmias',
    title: 'Arrhythmias',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/arrhythmias.pdf',
    description: 'Recognition and management of paediatric arrhythmias',
    order: 10
  },
  {
    id: 'paed-sepsis-qrg',
    title: 'Sepsis (QRG)',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/sepsis-qrg.pdf',
    description: 'Quick reference guide for paediatric sepsis management',
    order: 11
  },
  {
    id: 'paed-seizures',
    title: 'Seizures',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/seizures.pdf',
    description: 'Management of paediatric seizures and status epilepticus',
    order: 12
  },
  {
    id: 'paed-bronchiolitis',
    title: 'Bronchiolitis',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/bronchiolitis.pdf',
    description: 'Management guideline for bronchiolitis',
    order: 13
  },
  {
    id: 'paed-upper-airway-obstruction',
    title: 'Upper Airway Obstruction',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/upper-airway-obstruction.pdf',
    description: 'Protocol for managing upper airway obstruction',
    order: 14
  },
  {
    id: 'paed-ventilation-initiation',
    title: 'Ventilation Initiation',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/ventilation-initiation.pdf',
    description: 'Guide for initiating mechanical ventilation during stabilisation',
    order: 15
  },
  {
    id: 'paed-caring-ventilated-child',
    title: 'Ventilated Child Checklist',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/caring-for-ventilated-child-checklist.pdf',
    description: 'Checklist for caring for ventilated children while awaiting SORT',
    order: 16
  },
  {
    id: 'paed-extubation-checklist',
    title: 'Extubation Checklist',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/extubation-checklist.pdf',
    description: 'Safety checklist for paediatric extubation',
    order: 17
  },
  {
    id: 'paed-trauma-reference',
    title: 'Trauma Reference',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/trauma-reference-document.pdf',
    description: 'Comprehensive trauma management reference document',
    order: 18
  },
  {
    id: 'paed-haemorrhage-qrg',
    title: 'Haemorrhage (QRG)',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/haemorrhage-qrg.pdf',
    description: 'Quick reference guide for managing paediatric haemorrhage',
    order: 19
  },
  {
    id: 'paed-drowning',
    title: 'Drowning',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/drowning.pdf',
    description: 'Management protocol for drowning incidents',
    order: 20
  },
  {
    id: 'paed-hypothermia',
    title: 'Hypothermia',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/hypothermia.pdf',
    description: 'Management of paediatric hypothermia',
    order: 21
  },
  {
    id: 'paed-neonatal-collapse',
    title: 'Neonatal Collapse',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/neonatal-collapse.pdf',
    description: 'Emergency management of neonatal collapse',
    order: 22
  },
  {
    id: 'paed-io-insertion-guide',
    title: 'IO Insertion Guide',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/io-insertion-guide.pdf',
    description: 'Step-by-step guide for intraosseous (IO) access insertion',
    order: 23
  },
  {
    id: 'paed-drug-infusion-guide',
    title: 'Drug Infusion Guide',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/drug-infusion-guide.pdf',
    description: 'Reference guide for drug infusions during SORT transfers',
    order: 24
  },
  {
    id: 'paed-infusion-calculations',
    title: 'Infusion Calculations',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/infusion-calculations.pdf',
    description: 'Quick reference for calculating infusion rates',
    order: 25
  },
  {
    id: 'paed-time-critical-transfer',
    title: 'Time Critical Transfer Checklist',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/time-critical-transfer-checklist.pdf',
    description: 'Checklist for time-critical paediatric transfers',
    order: 26
  },
  {
    id: 'paed-picu-handover',
    title: 'PICU Handover Checklist',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/picu-handover-checklist.pdf',
    description: 'Structured handover checklist for PICU patients',
    order: 27
  },
  {
    id: 'paed-als-algorithm',
    title: 'PALS Algorithm 2025',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/Paediatric advanced life support algorithm 2025.pdf',
    description: 'Paediatric advanced life support algorithm (2025)',
    order: 28,
    subcategory: 'Arrest'
  },
  {
    id: 'paed-newborn-life-support',
    title: 'Newborn Life Support 2025',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/Newborn life support algorithm 2025.pdf',
    description: 'Newborn life support algorithm (2025)',
    order: 29,
    subcategory: 'Arrest'
  },
  {
    id: 'paed-advanced-newborn-resus',
    title: 'Advanced Newborn Resus',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/Advanced resuscitation of the newborn infant algorithm 2025_0.pdf',
    description: 'Advanced resuscitation of the newborn infant (2025)',
    order: 30,
    subcategory: 'Arrest'
  },
  {
    id: 'paed-pdch',
    title: 'PDCH',
    category: 'paediatric',
    pdfPath: '/guidelines/paediatric/PDCH.pdf',
    description: 'PDCH guideline for paediatric patients',
    order: 31
  }
];

export const categories: GuidelineCategory[] = [
  {
    id: 'adult',
    title: 'Adult Guidelines',
    guidelines: adultGuidelines
  },
  {
    id: 'paediatric',
    title: 'Paediatric Guidelines',
    guidelines: paediatricGuidelines
  }
];

export const getAllGuidelines = (): Guideline[] => [
  ...adultGuidelines,
  ...paediatricGuidelines
];

export const getGuidelinesByCategory = (category: 'adult' | 'paediatric'): Guideline[] => {
  return category === 'adult' ? adultGuidelines : paediatricGuidelines;
};

export const getGuidelineById = (id: string): Guideline | undefined => {
  return getAllGuidelines().find(g => g.id === id);
};
