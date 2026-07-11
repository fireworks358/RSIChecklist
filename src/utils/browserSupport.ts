// Feature detection for capabilities react-pdf/pdfjs-dist need at runtime
// (module Web Workers) that syntax transpilation can't provide. Browsers
// lacking this (Safari < 15, e.g. iOS 11-14 iPads) should fall back to
// opening PDFs natively instead of using the in-app viewer.
export function supportsModuleWorkers(): boolean {
  let supported = false;
  try {
    const options = {
      get type() {
        supported = true;
        return 'module';
      },
    } as WorkerOptions;
    new Worker('data:text/javascript,', options).terminate();
  } catch {
    supported = false;
  }
  return supported;
}
