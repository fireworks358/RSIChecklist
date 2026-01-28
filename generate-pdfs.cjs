const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const pdfs = {
  'adult': [
    { filename: 'rsi-checklist.pdf', title: 'RSI Checklist', subtitle: 'Adult Patients' },
    { filename: 'difficult-airway-algorithm.pdf', title: 'Difficult Airway Algorithm', subtitle: 'Adult Patients' },
    { filename: 'cico-algorithm.pdf', title: 'CICO Algorithm', subtitle: 'Adult Patients' },
    { filename: 'failed-intubation-drill.pdf', title: 'Failed Intubation Drill', subtitle: 'Adult Patients' }
  ],
  'paediatric': [
    { filename: 'rsi-checklist.pdf', title: 'RSI Checklist', subtitle: 'Paediatric Patients' },
    { filename: 'difficult-airway-algorithm.pdf', title: 'Difficult Airway Algorithm', subtitle: 'Paediatric Patients' },
    { filename: 'cico-algorithm.pdf', title: 'CICO Algorithm', subtitle: 'Paediatric Patients' },
    { filename: 'failed-intubation-drill.pdf', title: 'Failed Intubation Drill', subtitle: 'Paediatric Patients' }
  ]
};

function createPDF(category, pdfInfo) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filePath = path.join(__dirname, 'public', 'guidelines', category, pdfInfo.filename);

  doc.pipe(fs.createWriteStream(filePath));

  // NHS Blue color
  const nhsBlue = '#005EB8';

  // Header with NHS branding
  doc.rect(0, 0, 595, 80).fill(nhsBlue);

  doc.fillColor('white')
     .fontSize(28)
     .font('Helvetica-Bold')
     .text('NHS Emergency Airway Portal', 50, 25);

  // Title
  doc.fillColor('black')
     .fontSize(32)
     .font('Helvetica-Bold')
     .text(pdfInfo.title, 50, 120, { align: 'center' });

  // Subtitle
  doc.fontSize(20)
     .font('Helvetica')
     .text(pdfInfo.subtitle, 50, 170, { align: 'center' });

  // Placeholder notice
  doc.rect(50, 240, 495, 200).stroke();

  doc.fontSize(16)
     .font('Helvetica-Bold')
     .fillColor(nhsBlue)
     .text('PLACEHOLDER DOCUMENT', 50, 270, { align: 'center' });

  doc.fontSize(12)
     .font('Helvetica')
     .fillColor('black')
     .text('This is a placeholder PDF file.', 70, 310)
     .text('Replace this file with the actual clinical guideline.', 70, 330)
     .text('', 70, 350)
     .text('File location:', 70, 370)
     .font('Helvetica-Bold')
     .text(`/public/guidelines/${category}/${pdfInfo.filename}`, 70, 390);

  // Footer
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('grey')
     .text('For emergency use by healthcare professionals only', 50, 750, { align: 'center' })
     .text('© ' + new Date().getFullYear() + ' NHS', 50, 765, { align: 'center' });

  doc.end();

  console.log(`Created: ${category}/${pdfInfo.filename}`);
}

// Generate all PDFs
Object.entries(pdfs).forEach(([category, pdfList]) => {
  pdfList.forEach(pdfInfo => {
    createPDF(category, pdfInfo);
  });
});

console.log('All placeholder PDFs generated successfully!');
