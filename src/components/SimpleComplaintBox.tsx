import React, { useState, useEffect } from 'react';
import { RecipientCommittee, ComplaintSubmission, MediaAttachment } from '../types';
import { SwatFlagLogo } from './SwatFlagLogo';
import { HeadsetLogo } from './HeadsetLogo';
import { OfficialAvatar } from './OfficialAvatar';
import { VoiceAndMediaUploader } from './VoiceAndMediaUploader';
import { downloadReceiptImage } from '../utils/receiptGenerator';
import { downloadReceiptPDF } from '../utils/pdfGenerator';
import { useLanguage } from '../context/LanguageContext';
import {
  Send,
  MessageSquare,
  Mail,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Phone,
  Printer,
  Download,
  FileDown,
  ChevronDown,
  User,
  ShieldCheck,
  ExternalLink,
  Video,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SimpleComplaintBoxProps {
  committees: RecipientCommittee[];
  onSubmitComplaint: (
    issueText: string,
    recipient: RecipientCommittee,
    senderName?: string,
    senderPhone?: string,
    attachment?: MediaAttachment
  ) => ComplaintSubmission;
  activeSubmission: ComplaintSubmission | null;
  onReset: () => void;
  onOpenDeveloper: () => void;
  defaultSelectedCommitteeId?: string;
}

export const SimpleComplaintBox: React.FC<SimpleComplaintBoxProps> = ({
  committees,
  onSubmitComplaint,
  activeSubmission,
  onReset,
  onOpenDeveloper,
  defaultSelectedCommitteeId,
}) => {
  const { t } = useLanguage();
  const [issueText, setIssueText] = useState('');
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>(
    defaultSelectedCommitteeId || committees[0]?.id || 'finance-secretary'
  );
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [attachment, setAttachment] = useState<MediaAttachment | null>(null);

  // Sync selected committee when defaultSelectedCommitteeId changes
  useEffect(() => {
    if (defaultSelectedCommitteeId) {
      setSelectedCommitteeId(defaultSelectedCommitteeId);
    }
  }, [defaultSelectedCommitteeId]);

  const selectedCommittee =
    committees.find((c) => c.id === selectedCommitteeId) || committees[0];

  const handleAppendVoiceText = (textToAppend: string) => {
    setIssueText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${textToAppend}` : textToAppend;
    });
    if (error) setError('');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) {
      setError(t.validationError);
      return;
    }
    setError('');
    onSubmitComplaint(
      issueText.trim(),
      selectedCommittee,
      senderName,
      senderPhone,
      attachment || undefined
    );
  };

  const getWhatsAppUrl = (submission: ComplaintSubmission) => {
    const text = `*SWAT CABINET COMPLAINT (SCCweb)*\n*Reference:* ${submission.referenceNumber}\n*Recipient:* ${submission.recipient.title} (${submission.recipient.officialName})\n\n*Issue / Report:*\n${submission.issueText}\n\n${submission.senderName ? `*From:* ${submission.senderName} (${submission.senderPhone || 'N/A'})\n` : ''}*Date:* ${new Date(submission.submittedAt).toLocaleString()}\n\n_Official grievance slip generated on SCCweb._`;
    return `https://wa.me/${submission.recipient.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const getEmailUrl = (submission: ComplaintSubmission) => {
    const subject = `[SCCweb Grievance] ${submission.referenceNumber}: ${submission.recipient.title}`;
    const body = `SWAT CABINET COMPLAINT WEB (SCCweb)\nOfficial Reference Number: ${submission.referenceNumber}\nAssigned Official: ${submission.recipient.title} - ${submission.recipient.officialName} (${submission.recipient.designation})\n\nReport Details:\n${submission.issueText}\n\nSender Name: ${submission.senderName || 'Direct Citizen'}\nContact: ${submission.senderPhone || 'Not Provided'}\nDate & Time: ${new Date(submission.submittedAt).toLocaleString()}`;
    return `mailto:${encodeURIComponent(submission.recipient.emailAddress)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSlip = (submission: ComplaintSubmission) => {
    setDownloadingImg(true);
    setTimeout(() => {
      downloadReceiptImage(submission);
      setDownloadingImg(false);
    }, 200);
  };

  const handleDownloadPDF = async (submission: ComplaintSubmission) => {
    setDownloadingPdf(true);
    try {
      await downloadReceiptPDF(submission);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    try {
      // In sandboxed iframes, window.print() might require focus
      window.focus();
      window.print();
    } catch (e) {
      console.warn('Direct print failed, attempting popup print:', e);
      // Fallback popup print if iframe security blocks top print
      const printSlipElement = document.getElementById('official-print-slip');
      if (printSlipElement) {
        const printWindow = window.open('', '_blank', 'width=800,height=900');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>SCCweb Official Grievance Receipt - ${activeSubmission?.referenceNumber || ''}</title>
                <link rel="stylesheet" href="/src/index.css" />
                <style>
                  body { font-family: sans-serif; background: #fff; margin: 20px; color: #000; }
                  .print-only { display: block !important; }
                  @page { margin: 1cm; size: auto; }
                </style>
              </head>
              <body>
                ${printSlipElement.outerHTML}
                <script>
                  window.onload = function() {
                    window.focus();
                    window.print();
                    setTimeout(() => window.close(), 1000);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    }
  };


  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {!activeSubmission ? (
          /* ==================================================================== */
          /* ULTRA-SIMPLE COMPLAINT INPUT & SEND                                 */
          /* ==================================================================== */
          <motion.div
            key="complaint-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden transition-colors"
          >
            {/* Top Red Header Strip with Swat Logo */}
            <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 p-5 text-white border-b-2 border-amber-500 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <SwatFlagLogo size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                      SCCweb
                    </span>
                    <span className="text-xs text-stone-300 hidden sm:inline">
                      Direct Grievance Dispatch
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white font-heading tracking-wide">
                    SWAT CABINET COMPLAINT WEB
                  </h2>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-950/80 border border-amber-400/40 text-amber-300">
                  <HeadsetLogo size={24} />
                </div>
              </div>
            </div>

            {/* The Main Form */}
            <form onSubmit={handleSend} className="p-6 space-y-6">
              {/* 1. Kya Issue / Report Hai */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="issue-text"
                    className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2"
                  >
                    <span className="w-6 h-6 rounded-full bg-red-900 text-amber-300 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span>{t.step1Title}</span>
                    <span className="text-red-600 font-bold">*</span>
                  </label>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {t.step1Subtitle}
                  </span>
                </div>

                <textarea
                  id="issue-text"
                  rows={4}
                  value={issueText}
                  onChange={(e) => {
                    setIssueText(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={t.step1Placeholder}
                  className={`w-full p-4 rounded-xl border text-stone-900 dark:text-stone-100 text-base focus:outline-none focus:ring-2 transition-all resize-y ${
                    error
                      ? 'border-red-500 bg-red-50/20 dark:bg-red-950/20 focus:ring-red-400'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/60 focus:border-red-800 focus:ring-red-800/20 focus:bg-white dark:focus:bg-stone-800'
                  }`}
                />
                {error && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </p>
                )}

                {/* Voice typing, photo & video clip / reel uploader */}
                <VoiceAndMediaUploader
                  onAppendText={handleAppendVoiceText}
                  attachment={attachment}
                  onSetAttachment={setAttachment}
                />
              </div>

              {/* 2. Direct Contact with SWAT CABINET Officials */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-900 text-amber-300 text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span>{t.step2Title}</span>
                    <span className="text-red-600 font-bold">*</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {committees.slice(0, 3).map((comm) => {
                    const isSelected = selectedCommitteeId === comm.id;
                    return (
                      <motion.div
                        key={comm.id}
                        id={`select-${comm.id}`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedCommitteeId(comm.id)}
                        className={`cursor-pointer rounded-xl p-3 border-2 transition-all text-left flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-b from-red-50 via-white to-amber-50/40 dark:from-red-950/40 dark:via-stone-900 dark:to-stone-900 border-red-800 dark:border-red-600 shadow-md ring-2 ring-red-800/20'
                            : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm'
                        }`}
                      >
                        <div>
                          {/* Official Header with Photo and Selection indicator */}
                          <div className="flex items-start gap-2.5 mb-2.5">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/90 shadow-md bg-stone-200 dark:bg-stone-800 flex-shrink-0">
                              <OfficialAvatar officialId={comm.id} name={comm.officialName} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-red-900 dark:text-red-300 bg-red-100 dark:bg-red-950/80 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800 truncate">
                                  {comm.badge}
                                </span>
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isSelected
                                      ? 'bg-red-900 dark:bg-red-700 text-white'
                                      : 'border border-stone-300 dark:border-stone-600'
                                  }`}
                                >
                                  {isSelected && (
                                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                                  )}
                                </div>
                              </div>
                              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight">
                                {comm.title}
                              </h4>
                            </div>
                          </div>

                          <div className="text-xs text-stone-900 dark:text-stone-100 font-bold leading-snug">
                            {comm.officialName}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5">
                            {comm.designation}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Optional: Citizen Name & Contact */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                  className="text-xs text-stone-600 dark:text-stone-400 hover:text-red-900 dark:hover:text-amber-300 font-medium flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showOptionalDetails ? 'rotate-180 text-red-800 dark:text-amber-400' : ''
                    }`}
                  />
                  <span>
                    {showOptionalDetails
                      ? 'Hide Optional Contact Details'
                      : `+ ${t.optionalDetails}`}
                  </span>
                </button>

                {showOptionalDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2"
                  >
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase mb-1">
                        {t.senderNameLabel}
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder={t.senderNamePlaceholder}
                        className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-red-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase mb-1">
                        {t.senderPhoneLabel}
                      </label>
                      <input
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder={t.senderPhonePlaceholder}
                        className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-red-800"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons: Big "Send Complaint" + Direct WhatsApp/Email */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  id="send-complaint-btn"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-red-900 via-red-800 to-red-950 hover:from-red-800 hover:to-red-900 text-white font-extrabold text-base tracking-wide shadow-xl shadow-red-950/30 hover:shadow-2xl hover:ring-2 hover:ring-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500/50 group"
                >
                  <Send className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
                  <span>{t.submitButton}</span>
                </motion.button>

                <div className="flex items-center justify-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span>Routing directly to:</span>
                  <strong className="text-red-900 dark:text-amber-300 font-semibold">
                    {selectedCommittee.title} ({selectedCommittee.officialName})
                  </strong>
                </div>
              </div>
            </form>
          </motion.div>
        ) : (
          /* ==================================================================== */
          /* COMPLAINT SUBMITTED SUCCESSFULLY SLIP WITH PRINT & RECEIPT          */
          /* ==================================================================== */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1], // polished cubic-bezier easeOut
            }}
            className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border-2 border-red-900/30 dark:border-stone-800 overflow-hidden"
          >
            {/* Top Back Navigation within Success Card - PROMINENT */}
            <div className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 px-4 py-3 flex justify-start">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition-all cursor-pointer shadow-sm border border-stone-300 dark:border-stone-600"
              >
                <span className="text-sm leading-none">←</span>
                <span>Back to Portal Home</span>
              </button>
            </div>

            {/* Red & Gold Victory Banner */}
            <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white p-6 text-center border-b-2 border-amber-500 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-2 shadow-lg"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-300" />
              </motion.div>

              <h2 className="text-2xl font-black font-heading text-white tracking-wide">
                Complaint Submitted Successfully
              </h2>

              <p className="mt-1 text-sm text-amber-200 font-medium">
                Your complaint has been logged and routed to {activeSubmission.recipient.officialName}.
              </p>

              {/* Big Reference Number badge */}
              <div className="mt-4 inline-flex items-center gap-3 bg-red-900/90 border-2 border-amber-400 rounded-xl px-5 py-3 shadow-lg">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-300 block font-bold">
                    Official Reference Number
                  </span>
                  <span
                    id="ref-number-display"
                    className="text-2xl sm:text-3xl font-mono font-black text-amber-300"
                  >
                    {activeSubmission.referenceNumber}
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => copyRef(activeSubmission.referenceNumber)}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-red-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Content Details & Action Controls */}
            <div className="p-6 space-y-6">
              {/* Receipt Quick Action Tools (Print Slip & Download PNG) */}
              <div className="bg-gradient-to-r from-amber-500/10 to-red-900/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500 text-red-950 rounded-lg shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Official Grievance Receipt Slip
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      Print or save authenticated proof for your records.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => handleDownloadPDF(activeSubmission)}
                    disabled={downloadingPdf}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg border border-amber-500/60 ring-1 ring-amber-400/30 group"
                  >
                    <motion.span
                      animate={
                        downloadingPdf
                          ? { rotate: 360 }
                          : {
                              y: [0, -3, 0],
                              scale: [1, 1.15, 1],
                            }
                      }
                      transition={
                        downloadingPdf
                          ? { repeat: Infinity, duration: 1, ease: 'linear' }
                          : {
                              repeat: Infinity,
                              repeatDelay: 2.2,
                              duration: 0.8,
                              ease: 'easeInOut',
                            }
                      }
                      className="inline-flex items-center justify-center"
                    >
                      <FileDown className="w-4 h-4 text-amber-300 drop-shadow-sm group-hover:text-amber-200" />
                    </motion.span>
                    <span className="tracking-wide">
                      {downloadingPdf ? 'Building PDF...' : t.downloadPdf}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm border border-stone-700"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.printSlip}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleDownloadSlip(activeSubmission)}
                    disabled={downloadingImg}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm border border-stone-300 dark:border-stone-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingImg ? 'Generating...' : t.savePng}</span>
                  </motion.button>
                </div>
              </div>

              {/* Recipient Summary with Photo */}
              <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0 bg-stone-200 dark:bg-stone-800">
                    <OfficialAvatar officialId={activeSubmission.recipient.id} name={activeSubmission.recipient.officialName} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-900 dark:text-amber-400 uppercase tracking-wider block">
                      {t.dispatchedTo}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {activeSubmission.recipient.title} &bull; {activeSubmission.recipient.officialName}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {activeSubmission.recipient.designation} ({activeSubmission.recipient.badge})
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-300 dark:border-emerald-700 flex-shrink-0">
                  {t.statusDispatched}
                </span>
              </div>

              {/* Direct Message Transmission Buttons (WhatsApp / Email) */}
              <div className="p-4 bg-amber-50/70 dark:bg-stone-800/80 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-300 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Send direct message to official:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp Direct Send */}
                  <motion.a
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    href={getWhatsAppUrl(activeSubmission)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.directWhatsApp}</span>
                  </motion.a>

                  {/* Email Direct Send */}
                  <motion.a
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    href={getEmailUrl(activeSubmission)}
                    onClick={(e) => {
                      // Fallback: if mailto protocol doesn't launch default client within 1.5s, trigger web Gmail compose
                      const gmailFallback = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(activeSubmission.recipient.emailAddress)}&su=${encodeURIComponent(`[SCCweb Grievance] ${activeSubmission.referenceNumber}: ${activeSubmission.recipient.title}`)}&body=${encodeURIComponent(`SWAT CABINET COMPLAINT WEB (SCCweb)\nOfficial Reference Number: ${activeSubmission.referenceNumber}\nAssigned Official: ${activeSubmission.recipient.title} - ${activeSubmission.recipient.officialName} (${activeSubmission.recipient.designation})\n\nReport Details:\n${activeSubmission.issueText}\n\nSender Name: ${activeSubmission.senderName || 'Direct Citizen'}\nContact: ${activeSubmission.senderPhone || 'Not Provided'}\nDate & Time: ${new Date(activeSubmission.submittedAt).toLocaleString()}`)}`;
                      setTimeout(() => {
                        if (document.hasFocus()) {
                          window.open(gmailFallback, '_blank');
                        }
                      }, 1200);
                    }}
                    className="px-4 py-3 bg-stone-900 dark:bg-stone-700 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>{t.directEmail}</span>
                  </motion.a>
                </div>
              </div>

              {/* The Logged Report Text */}
              <div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 rounded-xl p-4">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                  Report Particulars:
                </span>
                <p className="text-sm text-stone-800 dark:text-stone-200 italic whitespace-pre-wrap">
                  &ldquo;{activeSubmission.issueText}&rdquo;
                </p>
                {activeSubmission.senderName && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                    From: <strong>{activeSubmission.senderName}</strong> ({activeSubmission.senderPhone || 'No contact provided'})
                  </p>
                )}

                {/* Attached File/Clip in Success Card */}
                {activeSubmission.attachment && (
                  <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 flex items-center gap-3">
                    {activeSubmission.attachment.type === 'image' ? (
                      <img
                        src={activeSubmission.attachment.url}
                        alt="Submitted Evidence"
                        className="w-14 h-14 object-cover rounded-lg border border-amber-500 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-red-900 text-amber-300 flex items-center justify-center border border-amber-500 shadow-sm">
                        <Video className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">
                        Verified Media Attachment ({activeSubmission.attachment.type === 'image' ? 'Photo' : 'Video Reel'})
                      </span>
                      <span className="text-xs font-medium text-stone-800 dark:text-stone-200 block">
                        {activeSubmission.attachment.fileName}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {(activeSubmission.attachment.fileSize / (1024 * 1024)).toFixed(2)} MB &bull; Included with receipt
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Reset / Submit Another */}
              <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={onReset}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.newComplaint}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onOpenDeveloper}
                  className="text-xs text-red-900 dark:text-amber-400 font-bold underline hover:text-red-700 cursor-pointer"
                >
                  Developer Page &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
