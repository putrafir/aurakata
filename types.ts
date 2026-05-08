export type Sentiment = 'neutral' | 'happy' | 'angry' | 'doubt' | 'hurry';

export interface Message {
  id: string;
  text: string;
  sender: 'host' | 'guest';
  sentiment?: Sentiment;
  senderName?: string;  // Sangat krusial untuk mode Grup (misal: "Budi")
  senderColor?: string; // Warna unik untuk gelembung chat Guest
  timestamp: number;
}

export interface AppState {
  phase: 'init' | 'guest-lobby'| 'chat';
  role: 'host' | 'guest';
  roomPin: string;
  guestName?: string;
   guestColor?: string;
}

// --- TAMBAHAN BARU: Untuk Backend & Integrasi Gemini API ---

export interface GeminiAnalysisResponse {
  // AI menebak aura dari kalimat yang diucapkan Guest
  sentiment: Sentiment; 
  // AI memberikan 3 prediksi balasan cerdas untuk layar Host
  smartTemplates: string[]; 
}

export interface RoomData {
  createdAt: number;
  hostActive: boolean;
  messages: Record<string, Message>; // Format Firebase Realtime Database
}