import React from 'react';
import { ComplaintSubmission } from '../types';
import { SwatFlagLogo } from './SwatFlagLogo';
import { OfficialAvatar } from './OfficialAvatar';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface OfficialPrintReceiptProps {
  submission: ComplaintSubmission;
}

export const OfficialPrintReceipt: React.FC<OfficialPrintReceiptProps> = ({ submission }) => {
  return (
    <div id="official-print-slip" className="print-only p-8 max-w-3xl mx-auto bg-white text-black font-sans">
      {/* Outer Border */}
      <div className="border-4 border-red-900 p-6 relative">
        <div className="border border-amber-600 p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-red-900 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <SwatFlagLogo size="md" />
              <div>
                <h1 className="text-xl font-bold font-heading text-red-950 uppercase tracking-wider">
                  SWAT CABINET COMPLAINT WEB
                </h1>
                <p className="text-xs font-semibold text-stone-700 tracking-widest">
                  OFFICIAL GRIEVANCE DISPATCH SLIP &bull; SCCweb
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-red-100 border border-red-800 text-red-900 font-bold text-xs uppercase rounded">
                Verified Dispatch
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Submit &bull; Route &bull; Resolve</p>
            </div>
          </div>

          {/* Reference Banner */}
          <div className="bg-stone-100 border border-stone-300 rounded p-4 mb-6 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-600 block">
                Official Reference Number
              </span>
              <span className="text-2xl font-mono font-bold text-red-900">
                {submission.referenceNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-600 block">
                Timestamp
              </span>
              <span className="text-sm font-semibold text-stone-800">
                {new Date(submission.submittedAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Routing / Recipient Official */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-900 border-b border-stone-300 pb-1 mb-2">
              Assigned Cabinet Official
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-600 flex-shrink-0">
                <OfficialAvatar
                  officialId={submission.recipient.id}
                  name={submission.recipient.officialName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs flex-1">
                <div>
                  <p className="text-stone-500">Official Name &amp; Title:</p>
                  <p className="font-bold text-stone-900 text-sm">
                    {submission.recipient.title} &mdash; {submission.recipient.officialName}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Designation &amp; Wing:</p>
                  <p className="font-semibold text-stone-800">
                    {submission.recipient.designation} ({submission.recipient.badge})
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Official Contact:</p>
                  <p className="font-mono text-stone-800">{submission.recipient.contactNumber}</p>
                </div>
                <div>
                  <p className="text-stone-500">Official Email:</p>
                  <p className="font-mono text-stone-800">{submission.recipient.emailAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Details */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-900 border-b border-stone-300 pb-1 mb-2">
              Applicant Particulars
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-stone-500">Applicant Name:</p>
                <p className="font-semibold text-stone-800">
                  {submission.senderName?.trim() || 'Direct Citizen (Anonymous)'}
                </p>
              </div>
              <div>
                <p className="text-stone-500">Phone Number:</p>
                <p className="font-mono text-stone-800">
                  {submission.senderPhone?.trim() || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Issue Particulars */}
          <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-900 border-b border-stone-300 pb-1 mb-2">
              Reported Issue / Grievance Statement
            </h2>

            {/* Short preview on page 1 — max ~300 chars */}
            {submission.issueText.length <= 400 ? (
              <div className="bg-stone-50 border border-stone-200 p-4 rounded text-sm text-stone-900 whitespace-pre-wrap leading-relaxed">
                {submission.issueText}
              </div>
            ) : (
              <>
                <div className="bg-stone-50 border border-stone-200 p-4 rounded text-sm text-stone-900 whitespace-pre-wrap leading-relaxed">
                  {submission.issueText.slice(0, 400)}...
                </div>
                <p className="text-[10px] italic text-stone-500 mt-1">
                  ↓ Full grievance text continued below / on next page
                </p>
                {/* Full text block — will naturally flow to page 2 if needed */}
                <div
                  className="bg-stone-50 border border-stone-200 p-4 rounded text-sm text-stone-900 whitespace-pre-wrap leading-relaxed mt-4"
                  style={{ pageBreakBefore: 'auto', pageBreakInside: 'auto' }}
                >
                  <span className="text-[10px] font-bold uppercase text-red-900 block mb-1">
                    Full Statement (continued):
                  </span>
                  {submission.issueText}
                </div>
              </>
            )}

            {/* Attached Evidence (Image / Video Preview) */}
            {submission.attachment && (
              <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded" style={{ pageBreakInside: 'avoid' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                  Attached Evidence ({submission.attachment.type === 'image' ? 'Photograph' : 'Video / Clip'} &bull; {submission.attachment.fileName})
                </span>
                {submission.attachment.type === 'image' ? (
                  <img
                    src={submission.attachment.url}
                    alt="Complaint Evidence"
                    className="max-h-48 w-auto rounded border border-stone-300 object-contain"
                  />
                ) : (
                  <div className="p-2 bg-stone-100 border border-stone-300 rounded text-xs text-stone-700 font-medium">
                    🎬 Video Evidence Recorded: {submission.attachment.fileName} ({(submission.attachment.fileSize / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t-2 border-dashed border-stone-300 grid grid-cols-2 gap-8 items-end text-xs">
            <div>
              <p className="text-[10px] text-stone-500 leading-relaxed">
                This document is a certified grievance dispatch token issued by SCCweb for prompt attention by the Swat Cabinet Committee.
              </p>
              <div className="mt-4 pt-2 border-t border-stone-300">
                <span className="text-[10px] font-mono text-stone-500 block">Digital Verification Hash:</span>
                <span className="font-mono text-[11px] font-bold text-stone-800">
                  SCC-{submission.referenceNumber}-{Date.now().toString(36).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Official Circular Swat Cabinet Stamp */}
            <div className="flex justify-end">
              <div className="relative w-36 h-36 rounded-full border-4 border-red-900 flex flex-col items-center justify-center p-2 text-center text-red-900 transform -rotate-3 bg-red-50/40 shadow-inner">
                {/* Inner double border */}
                <div className="w-full h-full rounded-full border-2 border-dashed border-red-800 flex flex-col items-center justify-center p-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-red-950">
                    ★ SWAT CABINET ★
                  </span>
                  {/* Miniature Swat State Flag emblem inside stamp */}
                  <img
                    src="/images/swat_flag_waving.jpg"
                    alt="Swat Flag Seal"
                    referrerPolicy="no-referrer"
                    className="h-7 w-auto object-contain my-0.5 filter contrast-125 flag-white-outline"
                  />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-red-900">
                    DISPATCH VERIFIED
                  </span>
                  <span className="text-[7px] font-mono text-stone-700">
                    {submission.referenceNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
