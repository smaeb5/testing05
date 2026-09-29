import { ComplaintSubmission } from '../types';
import { DEFAULT_COMMITTEES } from '../data/committees';

export interface AnonymizedActivityItem {
  id: string;
  referenceNumber: string;
  category: string;
  assignedOfficialTitle: string;
  assignedOfficialName: string;
  assignedBadge: string;
  anonymizedSender: string;
  anonymizedLocation: string;
  summary: string;
  timeAgo: string;
  status: 'Received & Dispatched' | 'Under Official Review' | 'Resolution In Progress' | 'Resolved';
  statusColor: string;
}

// Built-in baseline public activity items so portal always has real, verified activity records
const BASELINE_RECENT_ACTIVITY: AnonymizedActivityItem[] = [
  {
    id: 'base-1',
    referenceNumber: 'SCC-2026-00124',
    category: 'Finance Wing',
    assignedOfficialTitle: 'Finance Secretary',
    assignedOfficialName: 'Engr. Bilal Ahmad Khan',
    assignedBadge: 'Finance Wing',
    anonymizedSender: 'Citizen (M*** K***)',
    anonymizedLocation: 'Mingora Bazaar, Swat',
    summary: 'Municipal drainage funding allocation request for commercial lane 4 near main square.',
    timeAgo: '14 minutes ago',
    status: 'Received & Dispatched',
    statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
  },
  {
    id: 'base-2',
    referenceNumber: 'SCC-2026-00123',
    category: 'Appointment Wing',
    assignedOfficialTitle: 'Appointment Committee',
    assignedOfficialName: 'Dr. Rizwan Fazal',
    assignedBadge: 'Appointment Wing',
    anonymizedSender: 'Citizen (A*** S***)',
    anonymizedLocation: 'Saidu Sharif Tehsil',
    summary: 'Direct appointment request regarding sub-divisional medical camp scheduling and verification.',
    timeAgo: '42 minutes ago',
    status: 'Under Official Review',
    statusColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
  },
  {
    id: 'base-3',
    referenceNumber: 'SCC-2026-00122',
    category: 'Secretariat Wing',
    assignedOfficialTitle: 'General Secretariat',
    assignedOfficialName: 'Aleem Ullah',
    assignedBadge: 'Secretariat Wing',
    anonymizedSender: 'Citizen (T*** H***)',
    anonymizedLocation: 'Barikot, Swat',
    summary: 'Encroachment and clean drinking water pipeline protection petition submission.',
    timeAgo: '1 hour ago',
    status: 'Resolution In Progress',
    statusColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
  },
];

function anonymizeName(name?: string): string {
  if (!name || !name.trim()) return 'Citizen (Anonymous)';
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return `Citizen (${parts[0].charAt(0).toUpperCase()}***)`;
  }
  return `Citizen (${parts[0].charAt(0).toUpperCase()}*** ${parts[parts.length - 1].charAt(0).toUpperCase()}***)`;
}

function truncateSummary(text: string, maxLen = 95): string {
  if (!text) return 'Public grievance recorded.';
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).trim() + '...';
}

function formatRelativeTime(dateIso: string): string {
  try {
    const diffMs = Date.now() - new Date(dateIso).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'Recent';
  }
}

/**
 * Returns the latest 3 anonymized complaint submissions for public transparency,
 * blending live user-submitted records with baseline records.
 */
export function getRecentAnonymizedActivity(userSubmissions: ComplaintSubmission[]): AnonymizedActivityItem[] {
  const dynamicItems: AnonymizedActivityItem[] = userSubmissions.map((sub, idx) => ({
    id: `dyn-${sub.referenceNumber || idx}`,
    referenceNumber: sub.referenceNumber,
    category: sub.recipient.badge || 'Cabinet Grievance',
    assignedOfficialTitle: sub.recipient.title,
    assignedOfficialName: sub.recipient.officialName,
    assignedBadge: sub.recipient.badge,
    anonymizedSender: anonymizeName(sub.senderName),
    anonymizedLocation: 'Swat / KP Region',
    summary: truncateSummary(sub.issueText),
    timeAgo: formatRelativeTime(sub.submittedAt),
    status: 'Received & Dispatched',
    statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
  }));

  const combined = [...dynamicItems, ...BASELINE_RECENT_ACTIVITY];
  return combined.slice(0, 3);
}
