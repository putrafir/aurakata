export type Sentiment = 'neutral' | 'happy' | 'angry' | 'doubt' | 'hurry';

export interface Message {
  id: string;
  text: string;
  sender: 'host' | 'guest';
  sentiment?: Sentiment;
  senderName?: string;
  senderColor?: string;
  timestamp: number;
}

export interface AppState {
  phase: 'init' | 'chat';
  role: 'host' | 'guest';
  roomPin: string;
  guestName?: string;
}
