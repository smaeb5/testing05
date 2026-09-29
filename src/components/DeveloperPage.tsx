import React, { useState } from 'react';
import { Mail, MessageSquare, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

interface DeveloperPageProps {
  onBackToPortal: () => void;
}

export const DeveloperPage: React.FC<DeveloperPageProps> = ({ onBackToPortal }) => {
  const [imgError, setImgError] = useState(false);
  const developerImage = 'https://github.com/gforg5/Nano-Lens/blob/main/1769069098374.png?raw=true';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-2xl mx-auto space-y-5"
    >

      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-stone-200 dark:border-stone-800 text-center sm:text-left">
          {/* Photo */}
          <motion.div
            initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5, 
              boxShadow: "0 20px 25px -5px rgba(217, 119, 6, 0.4), 0 8px 10px -6px rgba(217, 119, 6, 0.4)" 
            }}
            whileTap={{ scale: 0.95, rotate: -2 }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-lg bg-stone-900 flex-shrink-0 cursor-pointer relative z-10"
          >
            {!imgError ? (
              <img
                src={developerImage}
                alt="Sayed Mohsin Ali"
                className="w-full h-full object-cover object-top"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-amber-300">
                <span className="font-bold text-xl">SMA</span>
                <span className="text-[10px] text-stone-400 font-mono">Dev</span>
              </div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-heading">
                Sayed Mohsin Ali
              </h2>
              <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-300 dark:border-amber-800">
                Systems Developer
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
              Designed and built the SCCweb portal for direct, simple citizen communication with SWAT Cabinet officials.
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] font-mono bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                React &bull; Vite &bull; Tailwind CSS
              </span>
            </div>
          </div>
        </div>

        {/* Direct Contact Links */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="mailto:sayedmohsinali05@gmail.com"
            className="p-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-stone-300 dark:border-stone-700"
          >
            <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="truncate">sayedmohsinali05@gmail.com</span>
          </a>

          <a
            href="https://wa.me/923415534677"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span>Developer WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};
