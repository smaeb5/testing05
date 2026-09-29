export interface NewsAffairItem {
  id: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  snippet: string;
  publishedAt: string;
  category: 'Swat Local' | 'KP Regional' | 'National' | 'Provincial RTI';
  badgeColor: string;
}

export const RECENT_AFFAIRS_FEEDS: NewsAffairItem[] = [
  {
    id: 'swatnews-1',
    sourceName: 'Swat News',
    sourceUrl: 'https://swatnews.com/',
    title: 'Swat Valley Civic Infrastructure & Road Rehabilitation Review',
    snippet: 'District administration reviews ongoing infrastructure, municipal drainage projects, and civic service delivery across Swat, Mingora, and adjoining tehsils.',
    publishedAt: 'Today • Recent update',
    category: 'Swat Local',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
  },
  {
    id: 'kprti-1',
    sourceName: 'Daily Aaj Peshawar / KP RTI',
    sourceUrl: 'https://www.kprti.gov.pk/daily-aaj-peshawar/',
    title: 'Khyber Pakhtunkhwa Right to Information & Public Grievance Compliance',
    snippet: 'KP RTI Commission highlights public departments adherence to citizen transparency, grievance redressal, and timely response protocols for citizens.',
    publishedAt: 'Today • Press Edition',
    category: 'Provincial RTI',
    badgeColor: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800',
  },
  {
    id: 'khyber-1',
    sourceName: 'Khyber News TV',
    sourceUrl: 'https://khybernews.tv/',
    title: 'Malakand Division Public Health & Civic Facilities Inspection',
    snippet: 'Special committees inspect regional medical facilities, water filtration plants, and community basic health units in Swat and Malakand division.',
    publishedAt: 'Recent Bulletin',
    category: 'KP Regional',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
  },
  {
    id: 'ary-1',
    sourceName: 'ARY News TV',
    sourceUrl: 'https://arynews.tv/',
    title: 'National Citizen Facilitation & Provincial Relief Initiatives',
    snippet: 'Federal and provincial authorities outline upgraded relief facilitation networks, digital complaint tracking, and citizen emergency desks.',
    publishedAt: 'Live Wire',
    category: 'National',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
  },
];
