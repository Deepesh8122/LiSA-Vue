export interface Conversation {
  emoji: string;
  title: string;
  lastUpdated: string;
  isActive?: boolean;
}

export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: string;
}

export interface UserProfile {
  initials: string;
  accountType: string;
  lastUpdated: string;
}
