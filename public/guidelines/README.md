# Emergency Airway Guidelines - PDF Files

This folder contains the clinical guideline PDF files displayed in the Emergency Airway Portal, organised into `adult/` and `paediatric/` folders.

## Adding PDF Files

1. Place clinical guideline PDF files in the appropriate folder (`adult/` or `paediatric/`)
2. Register the file in [src/data/guidelines.ts](../../src/data/guidelines.ts) with its title, description, and path
3. The service worker will automatically cache the file for offline access
4. Maximum file size: 10MB per PDF
