import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ComplaintSubmission } from '../types';

/**
 * Converts the official printed receipt element into a high-quality, professional PDF document
 * using html2canvas and jsPDF entirely client-side.
 */
export async function downloadReceiptPDF(submission: ComplaintSubmission): Promise<void> {
  const receiptElement = document.getElementById('official-print-slip');
  if (!receiptElement) {
    throw new Error('Receipt template element not found in DOM.');
  }

  // Clone element into an off-screen container with full visibility and exact styling
  const clone = receiptElement.cloneNode(true) as HTMLElement;
  clone.id = 'receipt-pdf-rendering-clone';
  clone.classList.remove('print-only');
  clone.style.display = 'block';
  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '-9999px';
  clone.style.width = '794px'; // standard A4 pixel width at 96 DPI
  clone.style.backgroundColor = '#FFFFFF';
  clone.style.color = '#000000';
  clone.style.zIndex = '-9999';

  document.body.appendChild(clone);

  try {
    // Wait slightly to ensure any webfonts or image assets render
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Capture element with high scale for crisp vector-like text and emblem sharpness
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Create A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Scale canvas image proportionally to fit page with margins
    const margin = 10; // 10mm margin
    const usableWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    // Check if height exceeds page, otherwise center vertically
    const yPosition = imgHeight < pageHeight - margin * 2 ? margin + (pageHeight - margin * 2 - imgHeight) / 6 : margin;

    pdf.addImage(imgData, 'JPEG', margin, yPosition, usableWidth, imgHeight);

    // Save with official reference number
    pdf.save(`SCCweb-Official-Receipt-${submission.referenceNumber}.pdf`);
  } finally {
    // Clean up temporary DOM clone
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}
