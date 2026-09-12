import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportDocumentToPdf(
  elementId: string,
  fileName: string = 'Tally_ERP9_Practical_Record_Book.pdf',
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const container = document.getElementById(elementId);
  if (!container) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  const pages = container.querySelectorAll<HTMLElement>('.a4-page-container');
  if (pages.length === 0) {
    throw new Error('No pages found in container');
  }

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const total = pages.length;

  for (let i = 0; i < total; i++) {
    const pageEl = pages[i];
    if (onProgress) {
      onProgress(i + 1, total);
    }

    // Capture each A4 page at 2x scale for crisp text and screenshot clarity
    const canvas = await html2canvas(pageEl, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  pdf.save(fileName);
}

export const downloadDocumentPdf = exportDocumentToPdf;

export function printDocument(): void {
  window.print();
}
