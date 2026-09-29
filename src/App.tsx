import React, { useState, useEffect } from 'react';
import { RecipientCommittee, ComplaintSubmission, MediaAttachment } from './types';
import { getCommittees } from './data/committees';
import { saveComplaintRecord, getSubmittedComplaints } from './utils/complaints';
import { HeaderNav } from './components/HeaderNav';
import { SimpleComplaintBox } from './components/SimpleComplaintBox';
import { RegionalAffairsNewsFeed } from './components/RegionalAffairsNewsFeed';
import { LeadershipDirectory } from './components/LeadershipDirectory';
import { DeveloperPage } from './components/DeveloperPage';
import { SwatFlagLogo } from './components/SwatFlagLogo';
import { OfficialAvatar } from './components/OfficialAvatar';
import { OfficialPrintReceipt } from './components/OfficialPrintReceipt';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useLanguage } from './context/LanguageContext';
import { Sparkles } from 'lucide-react';

export function App() {
  const { t, direction } = useLanguage();
  const [currentTab, setCurrentTab] = useState<'portal' | 'leadership' | 'developer'>('portal');
  const [committees, setCommittees] = useState<RecipientCommittee[]>(() => getCommittees());
  const [activeSubmission, setActiveSubmission] = useState<ComplaintSubmission | null>(null);
  const [submittedComplaints, setSubmittedComplaints] = useState<ComplaintSubmission[]>(() => getSubmittedComplaints());
  const [preselectedOfficialId, setPreselectedOfficialId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sccweb_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('sccweb_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('sccweb_theme', 'light');
      }
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleSubmitComplaint = (
    issueText: string,
    recipient: RecipientCommittee,
    senderName?: string,
    senderPhone?: string,
    attachment?: MediaAttachment
  ): ComplaintSubmission => {
    const submission = saveComplaintRecord(issueText, recipient, senderName, senderPhone, attachment);
    setActiveSubmission(submission);
    setSubmittedComplaints((prev) => [submission, ...prev]);
    return submission;
  };

  const handleReset = () => {
    setActiveSubmission(null);
    setPreselectedOfficialId(null);
  };

  const handleSelectOfficialFromDirectory = (officialId: string) => {
    setPreselectedOfficialId(officialId);
    setCurrentTab('portal');
    setTimeout(() => {
      const el = document.getElementById('complaint-form-area');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div
      dir={direction}
      className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200"
    >
      {/* Hidden Print Container */}
      {activeSubmission && (
        <OfficialPrintReceipt submission={activeSubmission} />
      )}

      {/* Top Navigation with Complaint, Leadership, and Developer */}
      <HeaderNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Container */}
      <main className="no-print flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'portal' ? (
          <div className="space-y-6">
            {/* Quick Hero Slogan with Official Waving Swat Flag & Smart Language Switcher */}
            <div className="text-center space-y-3 mb-6">
              <div className="flex items-center justify-center">
                <SwatFlagLogo size="lg" />
              </div>

              {/* Smart Language Switcher Bar placed cleanly above the title */}
              <div className="flex items-center justify-center gap-2">
                <LanguageSwitcher dropUp={false} />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{t.submitRouteResolve}</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-heading tracking-wide">
                {t.heroSubTitle}
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                {t.heroDescription}
              </p>
            </div>

            {/* Simple Complaint Submission & Routing */}
            <SimpleComplaintBox
              committees={committees}
              onSubmitComplaint={handleSubmitComplaint}
              activeSubmission={activeSubmission}
              onReset={handleReset}
              onOpenDeveloper={() => setCurrentTab('developer')}
              defaultSelectedCommitteeId={preselectedOfficialId || undefined}
            />

            {/* Regional Affairs & News Feeds - Swat News, KP RTI / Daily Aaj, ARY News, Khyber News */}
            <RegionalAffairsNewsFeed />

            {/* SWAT CABINET Officials Showcase */}
            {!activeSubmission && (
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-red-900 dark:text-amber-400 block">
                      {t.cabinetBoard}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white font-heading">
                      {t.cabinetLeadership}
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentTab('leadership')}
                    className="text-xs font-bold text-red-900 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    {t.viewProfiles}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {committees.map((comm) => (
                    <div
                      key={`dir-${comm.id}`}
                      onClick={() => handleSelectOfficialFromDirectory(comm.id)}
                      className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:border-amber-400 dark:hover:border-red-800 transition-colors flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow flex-shrink-0 bg-stone-100 dark:bg-stone-800">
                        <OfficialAvatar officialId={comm.id} name={comm.officialName} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-red-900 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-1 py-0.2 rounded border border-red-200 dark:border-red-900 inline-block mb-0.5">
                          {comm.badge}
                        </span>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {comm.officialName}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {comm.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : currentTab === 'leadership' ? (
          <div className="space-y-4">
            {/* Back to Portal */}
            <button
              onClick={() => setCurrentTab('portal')}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-red-900 dark:hover:text-amber-400 transition-colors cursor-pointer group"
            >
              <span className="text-base leading-none group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
              <span>Back to Portal</span>
            </button>
            <LeadershipDirectory
              committees={committees}
              onSelectOfficialForComplaint={handleSelectOfficialFromDirectory}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Back to Portal */}
            <button
              onClick={() => setCurrentTab('portal')}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-red-900 dark:hover:text-amber-400 transition-colors cursor-pointer group"
            >
              <span className="text-base leading-none group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
              <span>Back to Portal</span>
            </button>
            <DeveloperPage
              onBackToPortal={() => setCurrentTab('portal')}
            />
          </div>
        )}
      </main>

      {/* Minimal Clean Footer with Secondary Language Switcher */}
      <footer className="no-print bg-stone-900 dark:bg-stone-950 border-t border-stone-800 text-stone-400 py-6 mt-12 text-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SwatFlagLogo size="sm" />
            <div>
              <span className="text-white font-bold block font-heading">
                SWAT CABINET COMPLAINT WEB (SCCweb)
              </span>
              <span className="text-stone-400 text-[11px]">
                Direct Public Issue Redressal Portal &bull; Systems Developer: Sayed Mohsin Ali
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <button
              onClick={() => setCurrentTab('portal')}
              className={`hover:text-amber-300 transition-colors cursor-pointer ${
                currentTab === 'portal' ? 'text-amber-300 font-bold' : ''
              }`}
            >
              {t.portalTab}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setCurrentTab('leadership')}
              className={`hover:text-amber-300 transition-colors cursor-pointer ${
                currentTab === 'leadership' ? 'text-amber-300 font-bold' : ''
              }`}
            >
              {t.leadershipTab}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setCurrentTab('developer')}
              className={`hover:text-amber-300 transition-colors cursor-pointer ${
                currentTab === 'developer' ? 'text-amber-300 font-bold' : ''
              }`}
            >
              {t.developerTab}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
