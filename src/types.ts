export interface RecipientCommittee {
  id: string;
  category: string;
  title: string;
  officialName: string;
  designation: string;
  contactNumber: string; // e.g. "0341-5534677"
  whatsappNumber: string; // international digits for wa.me, e.g. "923415534677"
  emailAddress: string;  // e.g. "engbilalahmadkhan035@gmail.com"
  badge: string;
  avatarUrl?: string;
}

export interface MediaAttachment {
  type: 'image' | 'video';
  url: string; // base64 or blob URL for preview and slip display
  fileName: string;
  fileSize: number;
}

export interface ComplaintSubmission {
  referenceNumber: string;
  submittedAt: string;
  issueText: string;
  senderName?: string;
  senderPhone?: string;
  recipient: RecipientCommittee;
  attachment?: MediaAttachment;
}
