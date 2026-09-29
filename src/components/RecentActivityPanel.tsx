import React, { useState } from 'react';
import { AnonymizedActivityItem } from '../utils/activityTracker';
import { useLanguage } from '../context/LanguageContext';
import {
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  UserCheck,
  RefreshCw,
  Eye,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';

interface RecentActivityPanelProps {
  activities: AnonymizedActivityItem[];
  onSelectOfficialByName?: (officialName: string) => void;
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({
  activities,
  onSelectOfficialByName,
}) => {
  const { t } = useLanguage();
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 1800);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-colors">
      {/* Panel Top Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950 via-stone-900 to-red-950 text-white border-b-2 border-amber-500/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                {t.recentActivityBadge}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                {t.liveFeed}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white font-heading tracking-wide">
              {t.recentActivityTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-300 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
            title="Refresh feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline text-[11px]">{t.refreshBtn}</span>
          </button>
          <span className="text-[11px] text-stone-400 hidden md:inline">
            {t.privacyNotice}
          </span>
        </div>
      </div>

      {/* 3 Activity Cards List */}
      <div className="p-4 sm:p-5 divide-y divide-stone-100 dark:divide-stone-800/80">
        {activities.slice(0, 3).map((item, idx) => {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.08 }}
              className={`py-3.5 ${idx === 0 ? 'pt-0' : ''} ${idx === activities.length - 1 ? 'pb-0' : ''}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Left: Metadata & Summary */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-900 dark:text-amber-400 bg-red-50 dark:bg-red-950/80 px-2 py-0.5 rounded border border-red-200 dark:border-red-900 inline-flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {item.referenceNumber}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyRef(item.referenceNumber)}
                      className="text-[10px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-0.5 rounded"
                      title="Copy Reference"
                    >
                      {copiedRef === item.referenceNumber ? (
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                      {item.assignedBadge}
                    </span>

                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {item.timeAgo}
                    </span>
                  </div>

                  {/* Summary Text */}
                  <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 line-clamp-2 leading-relaxed">
                    &ldquo;{item.summary}&rdquo;
                  </p>

                  {/* Assigned Official & Citizen info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 pt-0.5">
                    <span className="inline-flex items-center gap-1 text-stone-700 dark:text-stone-300">
                      <Building2 className="w-3.5 h-3.5 text-red-800 dark:text-amber-400" />
                      <span className="font-semibold">{item.assignedOfficialTitle}:</span>{' '}
                      <button
                        type="button"
                        onClick={() => onSelectOfficialByName?.(item.assignedOfficialName)}
                        className="text-red-900 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                      >
                        {item.assignedOfficialName}
                      </button>
                    </span>

                    <span className="inline-flex items-center gap-1 text-stone-500 dark:text-stone-400">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{t.submittedBy}: {item.anonymizedSender}</span>
                    </span>
                  </div>
                </div>

                {/* Right: Status Badge */}
                <div className="sm:self-start flex-shrink-0 pt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${item.statusColor}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {item.status.toLowerCase().includes('dispatched')
                        ? t.statusDispatched
                        : item.status.toLowerCase().includes('review')
                        ? t.statusReview
                        : item.status.toLowerCase().includes('progress')
                        ? t.statusProgress
                        : item.status}
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Verified Public Transparency &bull; Submissions instantly sync to cabinet records
        </span>
        <span className="font-semibold text-red-900 dark:text-amber-400">
          Showing 3 of 3 Latest Verified Reports
        </span>
      </div>
    </div>
  );
};
