import { NextResponse } from 'next/server';
import { Sentiment } from '@/types';

// Kamus kata kunci emosi bahasa Indonesia untuk deteksi cepat & akurat
const EMOTION_KEYWORDS: Record<Sentiment, string[]> = {
  happy: [
    'senang', 'makasih', 'terima kasih', 'bagus', 'keren', 'mantap', 'hebat',
    'suka', 'alhamdulillah', 'hore', 'wah', 'luar biasa', 'siap', 'senang sekali',
    'asyik', 'mantul', 'seru', 'selamat', 'hai', 'halo', 'terimakasih', 'sip', 'jos'
  ],
  angry: [
    'marah', 'kesal', 'benci', 'jelek', 'buruk', 'sialan', 'brengsek', 'bodoh',
    'gila', 'parah', 'tidak mau', 'gak mau', 'jangan', 'kapok', 'kecewa',
    'rusak', 'bohong', 'curang', 'payah', 'anjir', 'ngeselin', 'ribet'
  ],
  hurry: [
    'cepat', 'cepet', 'buru-buru', 'buru', 'buru2', 'cepetan', 'segera', 'sekarang',
    'buruan', 'telat', 'terlambat', 'gas', 'urgent', 'darurat', 'lekas', 'kejar'
  ],
  doubt: [
    'ragu', 'bingung', 'mungkin', 'kayaknya', 'sepertinya', 'masa sih', 'masa',
    'kurang yakin', 'gak yakin', 'kurang tau', 'kurang tahu', 'apa iya', 'entah',
    'tidak tahu', 'gak tau', 'nggak tau', 'belum pasti', 'gimana ya'
  ],
  neutral: []
};

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ sentiment: 'neutral' as Sentiment });
    }

    const lower = text.toLowerCase();

    // Cek kecocokan kata kunci berdasarkan prioritas emosi
    for (const sentiment of ['angry', 'happy', 'hurry', 'doubt'] as Sentiment[]) {
      const keywords = EMOTION_KEYWORDS[sentiment];
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          return NextResponse.json({ sentiment });
        }
      }
    }

    // Default neutral jika tidak ada emosi spesifik yang terdeteksi
    return NextResponse.json({ sentiment: 'neutral' as Sentiment });
  } catch (error) {
    console.error("API Analyze Error:", error);
    return NextResponse.json({ sentiment: 'neutral' as Sentiment }, { status: 200 });
  }
}
