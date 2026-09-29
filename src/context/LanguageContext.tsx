import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'ur' | 'ps';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', direction: 'rtl' },
];

export interface Translations {
  // Brand & Header
  appTitle: string;
  appShortName: string;
  tagline: string;
  portalTab: string;
  leadershipTab: string;
  developerTab: string;
  switchTheme: string;
  lightMode: string;
  darkMode: string;
  selectLanguage: string;

  // Hero section
  directGrievanceDispatch: string;
  heroSubTitle: string;
  heroDescription: string;
  submitRouteResolve: string;

  // Complaint Form
  step1Title: string;
  step1Subtitle: string;
  step1Placeholder: string;
  step2Title: string;
  step2Subtitle: string;
  optionalDetails: string;
  senderNameLabel: string;
  senderNamePlaceholder: string;
  senderPhoneLabel: string;
  senderPhonePlaceholder: string;
  submitButton: string;
  validationError: string;

  // Officials
  financeWing: string;
  appointmentWing: string;
  secretariatWing: string;

  // Slip & Actions
  verifiedDispatch: string;
  officialReceiptSlip: string;
  refNumber: string;
  dispatchedTo: string;
  directWhatsApp: string;
  directEmail: string;
  downloadPdf: string;
  printSlip: string;
  savePng: string;
  newComplaint: string;

  // Recent Activity Panel
  recentActivityTitle: string;
  recentActivityBadge: string;
  liveFeed: string;
  privacyNotice: string;
  refreshBtn: string;
  assignedOfficial: string;
  submittedBy: string;
  statusDispatched: string;
  statusReview: string;
  statusProgress: string;

  // Regional Affairs
  regionalAffairsTitle: string;
  livePress: string;
  readAtSource: string;
  directLinks: string;

  // Leadership & Developer
  cabinetBoard: string;
  cabinetLeadership: string;
  viewProfiles: string;
  contactNumber: string;
  officialNumber: string;
  footerRights: string;
}

const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    appTitle: 'SWAT CABINET COMPLAINT WEB',
    appShortName: 'SCCweb',
    tagline: 'Submit • Route • Resolve',
    portalTab: 'Complaint',
    leadershipTab: 'Leadership',
    developerTab: 'Developer',
    switchTheme: 'Toggle Theme',
    lightMode: 'Switch to Light Mode',
    darkMode: 'Switch to Dark Mode',
    selectLanguage: 'Language',

    directGrievanceDispatch: 'Send Complaint to Officials',
    heroSubTitle: 'SWAT CABINET COMPLAINT WEB',
    heroDescription: 'Send your complaint directly to Finance Secretary, Appointment Committee, or General Secretariat.',
    submitRouteResolve: 'Submit • Route • Resolve',

    step1Title: 'What is your issue / report?',
    step1Subtitle: 'Write or paste clearly',
    step1Placeholder: 'Enter your issue or complaint here... (water issue, road repair, hospital staff absence, etc.)',
    step2Title: 'Select Cabinet Official',
    step2Subtitle: 'Choose recipient official',
    optionalDetails: 'Your Details (Optional)',
    senderNameLabel: 'Your Name (Optional)',
    senderNamePlaceholder: 'e.g. Mohsin',
    senderPhoneLabel: 'Phone / WhatsApp (Optional)',
    senderPhonePlaceholder: 'e.g. 0300-1234567',
    submitButton: 'Send Complaint to Official',
    validationError: 'Please write your issue before sending.',

    financeWing: 'Finance Wing',
    appointmentWing: 'Appointment Wing',
    secretariatWing: 'Secretariat Wing',

    verifiedDispatch: 'Complaint Sent Successfully',
    officialReceiptSlip: 'OFFICIAL RECEIPT SLIP',
    refNumber: 'Reference Number',
    dispatchedTo: 'Sent to Official',
    directWhatsApp: 'Send WhatsApp',
    directEmail: 'Send Email',
    downloadPdf: 'Download PDF',
    printSlip: 'Print Receipt',
    savePng: 'Save Image',
    newComplaint: 'Send New Complaint',

    recentActivityTitle: 'Recent Activity • Last 3 Submissions',
    recentActivityBadge: 'Portal Transparency',
    liveFeed: 'Live Feed',
    privacyNotice: 'Anonymized for Citizen Privacy',
    refreshBtn: 'Refresh',
    assignedOfficial: 'Assigned Official',
    submittedBy: 'By',
    statusDispatched: 'Received & Dispatched',
    statusReview: 'Under Official Review',
    statusProgress: 'Resolution In Progress',

    regionalAffairsTitle: 'Recent Affairs & Regional Media Dispatch',
    livePress: 'Live Press & Affairs',
    readAtSource: 'Read at Source',
    directLinks: 'Direct Regional News Outlets',

    cabinetBoard: 'Cabinet Board',
    cabinetLeadership: 'SWAT CABINET LEADERSHIP',
    viewProfiles: 'View Profiles →',
    contactNumber: 'Phone',
    officialNumber: 'Official',
    footerRights: 'Official Grievance Transmission Service • Swat Cabinet',
  },

  ur: {
    appTitle: 'سوات کابینہ شکایات پورٹل',
    appShortName: 'SCCweb',
    tagline: 'شکایت درج کریں • رہنمائی • حل',
    portalTab: 'شکایات',
    leadershipTab: 'کابینہ قیادت',
    developerTab: 'ڈویلپر',
    switchTheme: 'تھیم تبدیل کریں',
    lightMode: 'لائٹ موڈ',
    darkMode: 'ڈارک موڈ',
    selectLanguage: 'زبان منتخب کریں',

    directGrievanceDispatch: 'براہِ راست عوامی شکایات ترسیل',
    heroSubTitle: 'سوات کابینہ شکایات ویب پورٹل',
    heroDescription: 'فنانس سیکرٹری، اپائنٹمنٹ کمیٹی، اور جنرل سیکرٹریٹ تک براہ راست اپنی شکایات اور مسائل پہنچائیں۔',
    submitRouteResolve: 'درج کریں • رہنمائی • فوری حل',

    step1Title: 'مسئلہ یا رپورٹ کیا ہے؟',
    step1Subtitle: 'واضح الفاظ میں تحریر کریں',
    step1Placeholder: 'اپنا مسئلہ یا شکایت یہاں لکھیں یا چسپاں کریں... (مثلاً پانی کی بندش، ہسپتال عملے کی غیرحاضری، ناجائز تجاوزات، سڑک کی مرمت وغیرہ)',
    step2Title: 'سوات کابینہ کے نامزد عہدیداران سے براہ راست رابطہ',
    step2Subtitle: 'متعلقہ عہدیدار کا انتخاب کریں',
    optionalDetails: 'شہری کی تفصیلات (اختیاری)',
    senderNameLabel: 'آپ کا نام (اختیاری)',
    senderNamePlaceholder: 'مثلاً: محمد خان',
    senderPhoneLabel: 'فون نمبر / واٹس ایپ (اختیاری)',
    senderPhonePlaceholder: 'مثلاً: 0300-1234567',
    submitButton: 'عہدیدار کو شکایت ارسال کریں',
    validationError: 'برائے مہربانی بھیجنے سے پہلے اپنی شکایت یا مسئلہ درج کریں۔',

    financeWing: 'فنانس ونگ',
    appointmentWing: 'اپائنٹمنٹ ونگ',
    secretariatWing: 'سیکرٹریٹ ونگ',

    verifiedDispatch: 'شکایت کی تصدیق شدہ ترسیل',
    officialReceiptSlip: 'سرکاری شکایت ڈسپیچ رسید',
    refNumber: 'سرکاری ریفرنس نمبر',
    dispatchedTo: 'نامزد عہدیدار',
    directWhatsApp: 'براہ راست واٹس ایپ',
    directEmail: 'براہ راست ای میل',
    downloadPdf: 'پی ڈی ایف ڈاؤن لوڈ',
    printSlip: 'رسید پرنٹ کریں',
    savePng: 'تصویر محفوظ کریں',
    newComplaint: 'نئی شکایت درج کریں',

    recentActivityTitle: 'حالیہ سرگرمیاں • آخری 3 شکایات',
    recentActivityBadge: 'پورٹل شفافیت',
    liveFeed: 'لائیو فیڈ',
    privacyNotice: 'شہریوں کی پرائیویسی کیلیے نام پوشیدہ',
    refreshBtn: 'تازہ کریں',
    assignedOfficial: 'متعلقہ عہدیدار',
    submittedBy: 'ارسال کنندہ',
    statusDispatched: 'موصول و ارسال شدہ',
    statusReview: 'سرکاری جائزے کے تحت',
    statusProgress: 'کارروائی جاری ہے',

    regionalAffairsTitle: 'علاقائی امور اور اخباری نشریات',
    livePress: 'علاقائی میڈیا اور پریس',
    readAtSource: 'مکمل خبر پڑھیں',
    directLinks: 'براہ راست علاقائی نیوز ویب سائٹس',

    cabinetBoard: 'کابینہ بورڈ',
    cabinetLeadership: 'سوات کابینہ کی قیادت',
    viewProfiles: 'پروفائلز دیکھیں ←',
    contactNumber: 'رابطہ نمبر',
    officialNumber: 'عہدیدار',
    footerRights: 'عوامی شکایات کی براہ راست سرکاری ترسیل • سوات کابینہ',
  },

  ps: {
    appTitle: 'د سوات کابینې د شکایتونو ویب پورټل',
    appShortName: 'SCCweb',
    tagline: 'ثبتول • استول • حل',
    portalTab: 'شکایت',
    leadershipTab: 'مشرتابه',
    developerTab: 'ډویلپر',
    switchTheme: 'بڼه بدله کړئ',
    lightMode: 'روښانه حالت',
    darkMode: 'تیاره حالت',
    selectLanguage: 'ژبه وټاکئ',

    directGrievanceDispatch: 'مستقیم د ولسي شکایتونو استول',
    heroSubTitle: 'د سوات کابینې د شکایتونو ویب پورټل',
    heroDescription: 'خپل شکایتونه او ستونزې مستقیماً د مالیې سکرتر، د ګمارنې کمېټې، او عمومي دارالانشا ته ورسوئ.',
    submitRouteResolve: 'ثبتول • استول • چټک حل',

    step1Title: 'څه ستونزه یا راپور لرئ؟',
    step1Subtitle: 'په روښانه ټکو ولیکئ',
    step1Placeholder: 'خپله ستونزه یا غوښتنه دلته ولیکئ... (لکه د اوبو ستونزه، د روغتون د کارکوونکو غیرحاضري، د سړک خرابوالی، غیرقانوني قبضه او نور)',
    step2Title: 'د سوات کابینې له مسؤلینو سره مستقیمه اړیکه',
    step2Subtitle: 'مسؤل چارواکی وټاکئ',
    optionalDetails: 'د شکایت کونکي مالومات (اختیاري)',
    senderNameLabel: 'ستاسو نوم (اختیاري)',
    senderNamePlaceholder: 'مثلاً: خان لالا',
    senderPhoneLabel: 'د تلیفون شمیره / واټس اپ (اختیاري)',
    senderPhonePlaceholder: 'مثلاً: 0300-1234567',
    submitButton: 'مسؤل چارواکي ته شکایت واستوئ',
    validationError: 'مهرباني وکړئ د لېږلو دمخه خپله ستونزه ولیکئ.',

    financeWing: 'د مالیې څانګه',
    appointmentWing: 'د ګمارنې څانګه',
    secretariatWing: 'دارالانشا څانګه',

    verifiedDispatch: 'تصدیق شوی استول شوی شکایت',
    officialReceiptSlip: 'د شکایت رسمي رسید',
    refNumber: 'رسمي شمیره (ریفرنس نمبر)',
    dispatchedTo: 'مسؤل چارواکی',
    directWhatsApp: 'مستقیم واټس اپ',
    directEmail: 'مستقیم بریښنالیک',
    downloadPdf: 'پی ډي ایف ډاونلوډ',
    printSlip: 'رسید چاپ کړئ',
    savePng: 'انځور خوندي کړئ',
    newComplaint: 'بل نوی شکایت ثبت کړئ',

    recentActivityTitle: 'وروستي فعالیتونه • وروستي ۳ ثبت شوي شکایتونه',
    recentActivityBadge: 'روڼتیا او روښانتیا',
    liveFeed: 'تازه خبرونه',
    privacyNotice: 'د ولس د محرمیت ساتلو په موخه',
    refreshBtn: 'تازه کول',
    assignedOfficial: 'ټاکل شوی مسؤل',
    submittedBy: 'لېږونکی',
    statusDispatched: 'ترلاسه او واستول شو',
    statusReview: 'تر رسمي څېړنې لاندې',
    statusProgress: 'د حل چارې روانې دي',

    regionalAffairsTitle: 'سیمه ییزې چارې او د رسنیو خبرونه',
    livePress: 'ژوندۍ رسنۍ او مطبوعات',
    readAtSource: 'بشپړ خبر ولولئ',
    directLinks: 'مستقیمې سیمه ییزې خبري رسنۍ',

    cabinetBoard: 'د کابینې بورډ',
    cabinetLeadership: 'د سوات کابینې مشرتابه',
    viewProfiles: 'پېژندنه وګورئ ←',
    contactNumber: 'د اړیکې شمیره',
    officialNumber: 'مسؤل',
    footerRights: 'د ولسي شکایتونو مستقیم دولتي خدمت • سوات کابینه',
  },
};

const LANGUAGE_STORAGE_KEY = 'sccweb_language_v1';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  direction: 'ltr' | 'rtl';
  t: Translations;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'ur' || saved === 'ps') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save language preference:', e);
    }
  };

  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const direction = currentLangInfo.direction;

  useEffect(() => {
    // Update HTML dir and lang attributes
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl-active');
    } else {
      document.documentElement.classList.remove('rtl-active');
    }
  }, [language, direction]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    direction,
    t: TRANSLATIONS[language] || TRANSLATIONS.en,
    languages: SUPPORTED_LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
