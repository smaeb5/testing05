import React, { useState } from 'react';
import { NewsAffairItem, RECENT_AFFAIRS_FEEDS } from '../data/newsAffairs';
import {
  Newspaper,
  ExternalLink,
  Radio,
  Clock,
  Sparkles,
  Globe2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';

export const RegionalAffairsNewsFeed: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Swat Local', 'Provincial RTI', 'KP Regional', 'National'];

  const filteredFeeds =
    activeCategory === 'All'
      ? RECENT_AFFAIRS_FEEDS
      : RECENT_AFFAIRS_FEEDS.filter((f) => f.category === activeCategory);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-colors">
      {/* Feed Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-red-950 to-stone-900 text-white border-b-2 border-amber-500/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center flex-shrink-0">
            <Newspaper className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                Live Press &amp; Affairs
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
                <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                Regional &bull; Swat &bull; KP RTI &bull; National
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white font-heading tracking-wide">
              Recent Affairs &amp; Regional Media Dispatch
            </h3>
          </div>
        </div>

        <div className="text-[11px] text-stone-300 flex items-center gap-1.5 self-end sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span>Direct Links to Verified Media Outlets</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 sm:px-5 py-3 bg-stone-50/70 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                isSelected
                  ? 'bg-red-900 text-white shadow-sm ring-1 ring-amber-400'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4 Official News Source Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredFeeds.map((feed, idx) => (
          <motion.div
            key={feed.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="p-4 rounded-xl bg-stone-50/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/70 hover:border-amber-400 dark:hover:border-red-800 transition-all flex flex-col justify-between group shadow-sm hover:shadow"
          >
            <div className="space-y-2">
              {/* Header row: Source name and external link */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Globe2 className="w-3.5 h-3.5 text-red-800 dark:text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-extrabold text-stone-900 dark:text-white uppercase tracking-wider truncate">
                    {feed.sourceName}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${feed.badgeColor} flex-shrink-0`}
                >
                  {feed.category}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-900 dark:group-hover:text-amber-400 transition-colors leading-snug">
                {feed.title}
              </h4>

              {/* Snippet */}
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                {feed.snippet}
              </p>
            </div>

            {/* Bottom Row: Source URL button and time */}
            <div className="pt-3 mt-2 border-t border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-stone-400" />
                {feed.publishedAt}
              </span>

              <a
                href={feed.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-red-900 dark:text-amber-400 hover:text-red-700 dark:hover:text-amber-300 group-hover:translate-x-0.5 transition-all text-xs"
              >
                <span>Read at {feed.sourceName.split('/')[0].trim()}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Direct Source Web Links Toolbar */}
      <div className="px-4 py-3 bg-stone-100/70 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-stone-500 dark:text-stone-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Direct Regional News Outlets:</span>
        </span>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <a
            href="https://swatnews.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold border border-stone-200 dark:border-stone-700 hover:border-amber-400 transition-all flex items-center gap-1 text-[11px]"
          >
            <span>swatnews.com</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>

          <a
            href="https://www.kprti.gov.pk/daily-aaj-peshawar/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold border border-stone-200 dark:border-stone-700 hover:border-amber-400 transition-all flex items-center gap-1 text-[11px]"
          >
            <span>KP RTI (Daily Aaj)</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>

          <a
            href="https://arynews.tv/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold border border-stone-200 dark:border-stone-700 hover:border-amber-400 transition-all flex items-center gap-1 text-[11px]"
          >
            <span>arynews.tv</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>

          <a
            href="https://khybernews.tv/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold border border-stone-200 dark:border-stone-700 hover:border-amber-400 transition-all flex items-center gap-1 text-[11px]"
          >
            <span>khybernews.tv</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
