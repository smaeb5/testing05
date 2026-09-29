import React from 'react';
import { RecipientCommittee } from '../types';
import { ArrowRight, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { OfficialAvatar } from './OfficialAvatar';

interface LeadershipDirectoryProps {
  committees: RecipientCommittee[];
  onSelectOfficialForComplaint: (officialId: string) => void;
}

export const LeadershipDirectory: React.FC<LeadershipDirectoryProps> = ({
  committees,
  onSelectOfficialForComplaint,
}) => {
  return (
    <div className="space-y-6">
      {/* Leadership Header Banner */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-stone-900 dark:text-white font-heading tracking-wide">
          SWAT CABINET LEADERSHIP
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Cabinet members responsible for public issues and complaints.
        </p>
      </div>

      {/* Official Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {committees.map((official, idx) => (
          <motion.div
            key={official.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.25 }}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-md overflow-hidden flex flex-col justify-between"
          >
            {/* Top Wing Badge */}
            <div className="bg-stone-900 dark:bg-stone-950 px-4 py-2.5 text-white flex items-center justify-between border-b border-amber-500/30">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                {official.badge}
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                Officials {idx + 1}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col items-center text-center space-y-3">
              {/* Official Photo */}
              <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-amber-500 shadow-xl bg-stone-100 dark:bg-stone-800">
                <OfficialAvatar officialId={official.id} name={official.officialName} />
              </div>

              {/* Names & Designations */}
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white font-heading">
                  {official.officialName}
                </h3>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                  {official.title}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {official.designation}
                </p>
              </div>
            </div>

            {/* Quick Send Button */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => onSelectOfficialForComplaint(official.id)}
                className="w-full py-2.5 px-3 bg-red-900 hover:bg-red-800 active:scale-[0.99] text-amber-300 text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Send Issue to {official.officialName.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
