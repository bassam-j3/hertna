export type PostType = 'loan' | 'gift' | 'urgent';

export interface Post {
  id: string;
  type: PostType;
  title: string;
  description: string;
  category: string;
  maxDays?: number;
  image?: string;
  ownerName: string;
  ownerId: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerPhone?: string;
  distanceKm: number;
  distanceLabel: string; // e.g., "يبعد 600 متر" or "يبعد 1.2 كم"
  locationName: string; // e.g., "حي الروضة"
  status: 'available' | 'lent' | 'reserved';
  dateAdded: string;
  urgentNotice?: string;
  likesCount?: number;
  coords?: { lat: number; lng: number; xPercent?: number; yPercent?: number };
  lat?: number;
  lng?: number;
  isAnonymous?: boolean;
}

export interface SwapItem {
  id: string;
  title: string;
  image: string;
  borrowerName: string;
  borrowerLocation: string;
  startDate: string;
  dueDate: string;
  daysRemaining: string;
  daysRemainingNum: number;
  status: 'active' | 'pending' | 'completed';
  actionType: 'confirm_receipt' | 'message' | 'waiting_confirmation';
  borrowerId?: string;
  lenderId?: string;
  neighborPhone?: string;
}

export interface Rating {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  itemName: string;
  targetUserId?: string;
  category?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'request' | 'approval' | 'urgent' | 'message';
}

export type ActiveTab = 'home' | 'search' | 'add' | 'swaps' | 'profile';

export interface CommunityInitiative {
  id: string;
  title: string;
  description: string;
  category?: string;
  categoryLabel?: string;
  date: string;
  time?: string;
  location?: string;
  location_lat: number;
  location_lng: number;
  maxParticipants?: number;
  organizerName: string;
  organizerAvatar?: string;
  participantsCount: number;
  joinedUserNames?: string[];
  isUserJoined?: boolean;
  image?: string;
  tags?: string[];
  status?: 'upcoming' | 'active' | 'completed';
}

export interface ItemAlert {
  id: string;
  keyword: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
}
