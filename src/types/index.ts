export type PersonaType = 'social' | 'pro' | 'ghost';

export type TabType = 'feed' | 'pulse' | 'chat' | 'snaps' | 'network';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  isEncrypted?: boolean;
}

export interface Post {
  id: string;
  author: string;
  username: string;
  avatar: string;
  persona: PersonaType;
  timestamp: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  userLiked: boolean;
  bookmarks: number;
  userBookmarked: boolean;
  reposts: number;
  userReposted?: boolean;
  comments: Comment[];
  tags: string[];
  encryptionType: 'AES-256-GCM' | 'Zero-Knowledge' | 'Public';
  ciphertext?: string;
  iv?: string;
  verifiedKeyHash?: string;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    userVotedIndex?: number;
  };
  proDetails?: {
    role: string;
    company: string;
    credentialId?: string;
    verifiedSkills: string[];
  };
  ephemeralSeconds?: number;
}

export interface Story {
  id: string;
  author: string;
  avatar: string;
  mediaUrl: string;
  caption: string;
  timestamp: string;
  hasViewed: boolean;
  isSnapPeek?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  plaintext: string;
  ciphertext: string;
  iv: string;
  timestamp: string;
  isMine: boolean;
  status: 'sent' | 'delivered' | 'read';
  isDisappearing?: boolean;
  ephemeralSeconds?: number;
  isAudio?: boolean;
  audioDuration?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isSecret: boolean;
  isChannel?: boolean;
  memberCount?: number;
  disappearingTimer: number; // in seconds, 0 = off
  safetyNumber: string;
  encryptionAlgorithm: string;
}

export interface SnapItem {
  id: string;
  sender: string;
  avatar: string;
  timestamp: string;
  mediaUrl: string;
  caption: string;
  peekTimer: number; // seconds to view (e.g. 10)
  hasPeeked: boolean;
  isBurned: boolean;
}

export interface ProConnection {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatar: string;
  mutualEncryptedMatches: number;
  verifiedSkills: string[];
  isStealth: boolean;
  status: 'connect' | 'pending' | 'connected';
}
