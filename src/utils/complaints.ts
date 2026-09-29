import { ComplaintSubmission, RecipientCommittee, MediaAttachment } from '../types';

const COMPLAINTS_KEY = 'sccweb_submissions_v2';
const COUNTER_KEY = 'sccweb_counter_v2';

export function generateRefNumber(): string {
  const year = new Date().getFullYear();
  let count = 125;
  try {
    const saved = localStorage.getItem(COUNTER_KEY);
    if (saved) {
      count = parseInt(saved, 10) + 1;
    }
    localStorage.setItem(COUNTER_KEY, count.toString());
  } catch (e) {
    count = Math.floor(100 + Math.random() * 900);
  }
  const padded = String(count).padStart(5, '0');
  return `SCC-${year}-${padded}`;
}

export function saveComplaintRecord(
  issueText: string,
  recipient: RecipientCommittee,
  senderName?: string,
  senderPhone?: string,
  attachment?: MediaAttachment
): ComplaintSubmission {
  const record: ComplaintSubmission = {
    referenceNumber: generateRefNumber(),
    submittedAt: new Date().toISOString(),
    issueText,
    senderName: senderName?.trim() || undefined,
    senderPhone: senderPhone?.trim() || undefined,
    recipient,
    attachment,
  };

  try {
    const prev = localStorage.getItem(COMPLAINTS_KEY);
    const list: ComplaintSubmission[] = prev ? JSON.parse(prev) : [];
    list.unshift(record);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(list.slice(0, 30)));
  } catch (e) {
    console.warn('Complaint storage error:', e);
  }

  return record;
}

export function getSubmittedComplaints(): ComplaintSubmission[] {
  try {
    const prev = localStorage.getItem(COMPLAINTS_KEY);
    return prev ? JSON.parse(prev) : [];
  } catch (e) {
    return [];
  }
}
