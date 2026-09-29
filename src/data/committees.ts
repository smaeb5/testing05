import { RecipientCommittee } from '../types';

export const DEFAULT_COMMITTEES: RecipientCommittee[] = [
  {
    id: 'appointment-lead',
    category: 'appointment',
    title: 'Appointment Committee',
    officialName: 'Dr. Rizwan Fazal',
    designation: 'Appointment Committee Lead',
    contactNumber: '0345-9523555',
    whatsappNumber: '923459523555',
    emailAddress: 'rizfaz167@gmail.com',
    badge: 'Appointment',
    avatarUrl: '/images/dr_rizwan_fazal.jpeg',
  },
  {
    id: 'president-district-swat',
    category: 'presidency',
    title: 'President District Swat',
    officialName: 'Najam Hashmi',
    designation: 'President (District Swat)',
    contactNumber: '0349-5960518',
    whatsappNumber: '923495960518',
    emailAddress: 'najamhashmi562@gmail.com',
    badge: 'Presidency',
    avatarUrl: '/images/najam_hashmi.jpg',
  },
  {
    id: 'vice-president',
    category: 'presidency',
    title: 'Vice President',
    officialName: 'Hassan Bacha',
    designation: 'Vice President',
    contactNumber: '0340-9742933',
    whatsappNumber: '923409742933',
    emailAddress: 'Hassanbacha578@gmail.com',
    badge: 'Presidency',
    avatarUrl: '/images/hassan_bacha.png',
  },
  {
    id: 'finance-secretary',
    category: 'finance',
    title: 'Finance Secretary',
    officialName: 'Engr. Bilal Ahmad Khan',
    designation: 'Finance Secretary',
    contactNumber: '0341-5534677',
    whatsappNumber: '923415534677',
    emailAddress: 'engbilalahmadkhan035@gmail.com',
    badge: 'Finance',
    avatarUrl: '/images/bilal_ahmad_khan.jpeg',
  },
  {
    id: 'additional-general-secretary',
    category: 'general',
    title: 'General Secretariat',
    officialName: 'Aleem Ullah',
    designation: 'Additional General Secretary',
    contactNumber: '0319-0151874',
    whatsappNumber: '923190151874',
    emailAddress: 'aleemsagar75@gmail.com',
    badge: 'Secretariat',
    avatarUrl: '/images/aleem_ullah.jpeg',
  },
  {
    id: 'dist-senior-vice-president',
    category: 'presidency',
    title: 'Dist Senior Vice President',
    officialName: 'Kiramat Ali',
    designation: 'Dist Senior Vice President',
    contactNumber: '+92 348 9591509',
    whatsappNumber: '923489591509',
    emailAddress: 'kiramata0331@gmail.com',
    badge: 'Presidency',
    avatarUrl: '/images/kiramat_ali.jpg',
  },
  {
    id: 'dist-general-secretary',
    category: 'secretariat',
    title: 'Dist General Secretary',
    officialName: 'Sohail Ahmad',
    designation: 'Dist General Secretary',
    contactNumber: '0342-9220473',
    whatsappNumber: '923429220473',
    emailAddress: 'Sohailahmadk19@gmail.com',
    badge: 'Secretariat',
    avatarUrl: '/images/sohail_ahmad.png',
  },
  {
    id: 'dist-labor-secretary',
    category: 'labor',
    title: 'Dist Labor Secretary',
    officialName: 'Muhammad Zakria',
    designation: 'Dist Labor Secretary',
    contactNumber: '+92 347 5148279',
    whatsappNumber: '923475148279',
    emailAddress: 'zakriakhan15602@gmail.com',
    badge: 'Labor',
    avatarUrl: '/images/muhammad_zakria.jpg',
  },
  {
    id: 'dist-legal-secretary',
    category: 'legal',
    title: 'Dist Legal Secretary',
    officialName: 'Muhammad Zeeshan',
    designation: 'Dist Legal Secretary',
    contactNumber: '+92 346 3052650',
    whatsappNumber: '923463052650',
    emailAddress: 'zeeshan@gmail.com',
    badge: 'Legal',
    avatarUrl: '/images/muhammad_zeeshan.jpg',
  },
];

const STORAGE_KEY = 'sccweb_committees_v13';

export function getCommittees(): RecipientCommittee[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return DEFAULT_COMMITTEES;
}

export function saveCommittees(committees: RecipientCommittee[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(committees));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export function resetCommittees(): RecipientCommittee[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('LocalStorage reset error:', e);
  }
  return DEFAULT_COMMITTEES;
}
