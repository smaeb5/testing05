import { ComplaintSubmission } from '../types';
import bilalImageData from '../assets/images/bilal_ahmad_khan.jpeg';
import aleemImageData from '../assets/images/aleem_ullah.jpeg';
import rizwanImageData from '../assets/images/dr_rizwan_fazal.jpeg';

const OFFICIAL_BASE64_AVATARS: Record<string, string> = {
  'finance-secretary': bilalImageData,
  'appointment-lead': rizwanImageData,
  'additional-general-secretary': aleemImageData,
};

/**
 * Generates an official high-resolution PNG receipt slip using HTML5 Canvas
 * including the Swat State Flag emblem, official circular red stamp, and leadership data.
 */
export function downloadReceiptImage(submission: ComplaintSubmission): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set high resolution for crisp print & digital share (800 x 1080)
  canvas.width = 800;
  canvas.height = 1080;

  // Helper function to draw everything once images are ready
  const flagImg = new Image();
  flagImg.crossOrigin = 'anonymous';

  const avatarImg = new Image();
  avatarImg.crossOrigin = 'anonymous';

  let flagLoaded = false;
  let avatarLoaded = false;

  const renderCanvas = () => {
    // Background - Clean Parchment White with Subtle Border
    ctx.fillStyle = '#FAFAF9'; // stone-50
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer Border (Red / Gold Dual Border)
    ctx.strokeStyle = '#7F1D1D'; // red-900
    ctx.lineWidth = 10;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

    ctx.strokeStyle = '#D97706'; // amber-600
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52);

    // Top Header Banner
    ctx.fillStyle = '#450A0A'; // red-950
    ctx.fillRect(30, 30, canvas.width - 60, 130);

    // Gold accent line under header
    ctx.fillStyle = '#F59E0B'; // amber-500
    ctx.fillRect(30, 160, canvas.width - 60, 4);

    // If Swat Flag image loaded, draw in header top-left
    if (flagLoaded && flagImg.width > 0) {
      ctx.save();
      // draw flag smoothly
      ctx.drawImage(flagImg, 45, 45, 100, 68);
      ctx.restore();
    }

    // Header Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 25px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('SWAT CABINET COMPLAINT WEB', canvas.width / 2 + (flagLoaded ? 35 : 0), 80);

    ctx.fillStyle = '#FDE68A'; // amber-200
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('OFFICIAL GRIEVANCE DISPATCH SLIP (SCCweb)', canvas.width / 2 + (flagLoaded ? 35 : 0), 108);

    ctx.fillStyle = '#D6D3D1'; // stone-300
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SUBMIT • ROUTE • RESOLVE', canvas.width / 2 + (flagLoaded ? 35 : 0), 133);

    // Watermark in Center Background
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2 + 50);
    ctx.rotate(-Math.PI / 6);
    ctx.fillStyle = 'rgba(127, 29, 29, 0.035)';
    ctx.font = 'bold 70px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('SWAT CABINET', 0, 0);
    ctx.restore();

    // Reference Number Box
    ctx.fillStyle = '#F5F5F4'; // stone-100
    ctx.strokeStyle = '#E7E5E4'; // stone-200
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(60, 185, canvas.width - 120, 80, 12);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#78716C'; // stone-500
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('OFFICIAL DISPATCH REFERENCE NUMBER', 85, 212);

    ctx.fillStyle = '#7F1D1D'; // red-900
    ctx.font = 'bold 28px "Courier New", Courier, monospace';
    ctx.fillText(submission.referenceNumber, 85, 246);

    // Date on right of ref box
    ctx.textAlign = 'right';
    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('DATE & TIME RECORDED', canvas.width - 85, 212);

    ctx.fillStyle = '#1C1917';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const dateStr = new Date(submission.submittedAt).toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    ctx.fillText(dateStr, canvas.width - 85, 242);

    // Assigned Official Section
    let currentY = 300;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#7F1D1D';
    ctx.font = 'bold 15px "Playfair Display", Georgia, serif';
    ctx.fillText('ASSIGNED CABINET OFFICIAL', 60, currentY);

    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, currentY + 8);
    ctx.lineTo(canvas.width - 60, currentY + 8);
    ctx.stroke();

    currentY += 28;

    // Draw Official Avatar if available
    const textStartX = avatarLoaded && avatarImg.width > 0 ? 145 : 60;
    if (avatarLoaded && avatarImg.width > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(95, currentY + 28, 32, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, 63, currentY - 4, 64, 64);
      ctx.restore();

      // Border circle
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(95, currentY + 28, 32, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${submission.recipient.title} — ${submission.recipient.officialName}`, textStartX, currentY + 14);

    ctx.fillStyle = '#57534E';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Designation: ${submission.recipient.designation} (${submission.recipient.badge})`, textStartX, currentY + 36);

    ctx.fillText(`Contact: ${submission.recipient.contactNumber}  |  Email: ${submission.recipient.emailAddress}`, textStartX, currentY + 56);

    // Citizen Information
    currentY += 80;
    ctx.fillStyle = '#7F1D1D';
    ctx.font = 'bold 15px "Playfair Display", Georgia, serif';
    ctx.fillText('CITIZEN / APPLICANT DETAILS', 60, currentY);

    ctx.beginPath();
    ctx.moveTo(60, currentY + 8);
    ctx.lineTo(canvas.width - 60, currentY + 8);
    ctx.stroke();

    currentY += 32;
    ctx.fillStyle = '#1C1917';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const citizenName = submission.senderName?.trim() || 'Citizen (Direct Submission)';
    const citizenContact = submission.senderPhone?.trim() || 'Not Provided';
    ctx.fillText(`Submitted By: ${citizenName}   |   Contact: ${citizenContact}`, 60, currentY);

    // Complaint / Report Body Box
    currentY += 40;
    ctx.fillStyle = '#7F1D1D';
    ctx.font = 'bold 15px "Playfair Display", Georgia, serif';
    ctx.fillText('REPORTED ISSUE & GRIEVANCE PARTICULARS', 60, currentY);

    ctx.beginPath();
    ctx.moveTo(60, currentY + 8);
    ctx.lineTo(canvas.width - 60, currentY + 8);
    ctx.stroke();

    currentY += 25;
    const reportBoxY = currentY;
    const reportBoxHeight = 230;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#D6D3D1';
    ctx.beginPath();
    ctx.roundRect(60, reportBoxY, canvas.width - 120, reportBoxHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Multi-line wrap report text
    ctx.fillStyle = '#1C1917';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const maxWidth = canvas.width - 160;
    const words = submission.issueText.split(' ');
    let line = '';
    let lineY = reportBoxY + 30;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 80, lineY);
        line = words[n] + ' ';
        lineY += 22;
        if (lineY > reportBoxY + reportBoxHeight - 25) {
          ctx.fillText(line + '...', 80, lineY);
          line = '';
          break;
        }
      } else {
        line = testLine;
      }
    }
    if (line.trim().length > 0 && lineY <= reportBoxY + reportBoxHeight - 15) {
      ctx.fillText(line, 80, lineY);
    }

    // Official Authenticated Seal Stamp in Bottom Right Corner
    const stampCenterX = canvas.width - 145;
    const stampCenterY = 905;

    ctx.save();
    ctx.translate(stampCenterX, stampCenterY);
    ctx.rotate(-0.06); // slight official desk stamp tilt

    // Outer double ring in official ink red
    ctx.strokeStyle = '#991B1B';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 68, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Stamp ink tint fill
    ctx.fillStyle = 'rgba(153, 27, 27, 0.06)';
    ctx.beginPath();
    ctx.arc(0, 0, 68, 0, Math.PI * 2);
    ctx.fill();

    // Stamp top text
    ctx.fillStyle = '#991B1B';
    ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ SWAT CABINET ★', 0, -38);

    // If Swat Flag image loaded, draw miniature flag inside stamp center
    if (flagLoaded && flagImg.width > 0) {
      ctx.drawImage(flagImg, -28, -24, 56, 38);
    } else {
      ctx.font = 'bold 12px serif';
      ctx.fillText('☪', 0, -4);
    }

    ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('DISPATCH VERIFIED', 0, 26);

    ctx.font = 'bold 8px monospace';
    ctx.fillText(submission.referenceNumber, 0, 42);

    ctx.restore();

    // Security Verification notice
    ctx.textAlign = 'left';
    ctx.fillStyle = '#78716C';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('This is an authenticated computer-generated grievance slip from SCCweb.', 60, 890);
    ctx.fillText('Issued for direct cabinet action, official tracking, and dispute redressal.', 60, 910);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#A8A29E';
    ctx.fillText(`TOKEN HASH: SCC-${submission.referenceNumber}-${new Date(submission.submittedAt).getTime().toString(36).toUpperCase()}`, 60, 930);

    // Footer Disclaimer Strip
    ctx.fillStyle = '#E7E5E4';
    ctx.fillRect(30, canvas.height - 65, canvas.width - 60, 35);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#57534E';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SWAT CABINET COMPLAINT WEB (SCCweb)  •  DIRECT PUBLIC DISPATCH', canvas.width / 2, canvas.height - 43);

    // Trigger download
    try {
      const image = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `SCCweb-Receipt-${submission.referenceNumber}.png`;
      downloadLink.href = image;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Error generating receipt slip image:', err);
    }
  };

  // Preload Swat Flag
  flagImg.onload = () => {
    flagLoaded = true;
    checkAndRender();
  };
  flagImg.onerror = () => {
    flagLoaded = false;
    checkAndRender();
  };
  flagImg.src = '/images/swat_flag_waving.jpg';

  // Preload Official Avatar if available (prefer guaranteed local Base64 to bypass CORS/404)
  const officialAvatarSrc = OFFICIAL_BASE64_AVATARS[submission.recipient.id] || submission.recipient.avatarUrl;
  if (officialAvatarSrc) {
    avatarImg.onload = () => {
      avatarLoaded = true;
      checkAndRender();
    };
    avatarImg.onerror = () => {
      avatarLoaded = false;
      checkAndRender();
    };
    avatarImg.src = officialAvatarSrc;
  } else {
    avatarLoaded = false;
  }

  let rendered = false;
  const checkAndRender = () => {
    if (rendered) return;
    // Render once both have attempted load or timeout
    rendered = true;
    renderCanvas();
  };

  // Safe timeout fallback
  setTimeout(() => {
    if (!rendered) {
      checkAndRender();
    }
  }, 400);
}
