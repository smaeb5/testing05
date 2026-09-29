import React, { useState } from 'react';
import { SwatFlagLogo } from './SwatFlagLogo';
import { useLanguage } from '../context/LanguageContext';
import { Send, Users, Code2, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderNavProps {
  currentTab: 'portal' | 'leadership' | 'developer';
  onTabChange: (tab: 'portal' | 'leadership' | 'developer') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onTabChange,
  darkMode,
  onToggleDarkMode,
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'portal' | 'leadership' | 'developer') => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print bg-stone-900 dark:bg-stone-950 border-b border-stone-800 sticky top-0 z-40 shadow-lg transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand & Emblem */}
        <div
          onClick={() => handleNavClick('portal')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0"
          role="button"
          tabIndex={0}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
            <SwatFlagLogo size="sm" />
          </motion.div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-white font-extrabold text-[11px] sm:text-sm md:text-base font-heading tracking-wide group-hover:text-amber-400 transition-colors leading-tight">
                {t.appTitle}
              </span>
              <span className="bg-red-800 text-amber-300 text-[9px] sm:text-[10px] font-mono font-bold px-1 sm:px-1.5 py-0.5 rounded border border-amber-400/30 flex-shrink-0">
                {t.appShortName}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium whitespace-nowrap">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Section: Desktop Navigation & Dark Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dark Mode Switcher */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggleDarkMode}
            title={darkMode ? t.lightMode : t.darkMode}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors cursor-pointer flex-shrink-0"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-300" />}
          </motion.button>

          {/* Desktop Nav Tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-stone-800/90 p-1 rounded-xl border border-stone-700">
            <button
              onClick={() => handleNavClick('portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'portal'
                  ? 'bg-red-900 text-amber-300 shadow-md border border-amber-500/40'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.portalTab}</span>
            </button>

            <button
              onClick={() => handleNavClick('leadership')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'leadership'
                  ? 'bg-red-900 text-amber-300 shadow-md border border-amber-500/40'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.leadershipTab}</span>
            </button>

            <button
              onClick={() => handleNavClick('developer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'developer'
                  ? 'bg-red-900 text-amber-300 shadow-md border border-amber-500/40'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.developerTab}</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-amber-400" /> : <Menu className="w-4 h-4 text-stone-300" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-t border-stone-800 bg-stone-900/98 px-4 py-3 space-y-1.5 shadow-xl"
          >
            <button
              onClick={() => handleNavClick('portal')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                currentTab === 'portal'
                  ? 'bg-red-900 text-amber-300 border border-amber-500/40'
                  : 'text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>{t.portalTab}</span>
            </button>

            <button
              onClick={() => handleNavClick('leadership')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                currentTab === 'leadership'
                  ? 'bg-red-900 text-amber-300 border border-amber-500/40'
                  : 'text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>{t.leadershipTab}</span>
            </button>

            <button
              onClick={() => handleNavClick('developer')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                currentTab === 'developer'
                  ? 'bg-red-900 text-amber-300 border border-amber-500/40'
                  : 'text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>{t.developerTab}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
