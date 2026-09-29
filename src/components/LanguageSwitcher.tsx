import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SupportedLanguage } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LanguageSwitcherProps {
  dropUp?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ dropUp = false }) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.96 }}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Select Language (Pashto / Urdu / English)"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-amber-500/50 dark:hover:border-amber-400/50 transition-all text-xs font-semibold cursor-pointer shadow-sm"
      >
        <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <span className="font-bold tracking-wide text-amber-700 dark:text-amber-300">
          {currentLanguage.nativeName}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-stone-500 dark:text-stone-400 transition-transform duration-200 ${
            isOpen ? (dropUp ? 'rotate-0 text-amber-600 dark:text-amber-300' : 'rotate-180 text-amber-600 dark:text-amber-300') : (dropUp ? 'rotate-180' : '')
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 ${
              dropUp ? 'bottom-full mb-2' : 'top-full mt-1.5'
            } w-44 rounded-xl bg-stone-900 border border-stone-700/80 shadow-2xl overflow-hidden z-50 p-1`}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border-b border-stone-800 flex items-center justify-between">
              <span>Select Language</span>
              <span className="font-normal text-stone-400">ژبه / زبان</span>
            </div>

            <div className="py-1 space-y-0.5">
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-red-900/90 text-amber-300 font-bold'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-bold">{lang.nativeName}</span>
                      <span className="text-[11px] text-stone-400 font-sans">
                        ({lang.name})
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
