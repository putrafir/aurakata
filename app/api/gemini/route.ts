import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Ambil 5 pesan terakhir agar AI fokus pada konteks yang paling baru
    const chatContext = messages
      .slice(-5)
      .map((m: any) => `${m.sender === 'host' ? 'Saya (Tuli)' : 'Tamu (Dengar)'}: ${m.text}`)
      .join('\n');

    // 2. Prompt Engineering Khusus untuk Teman Tuli
    const prompt = `
    Anda adalah asisten AI yang membantu Teman Tuli membalas pesan dalam aplikasi obrolan langsung.
    Berikut adalah riwayat obrolan terakhir:
    ${chatContext}

    Tugas Anda:
    Berikan 3 rekomendasi kalimat balasan yang BISA DIKETIK OLEH SAYA (Tuli) untuk membalas Tamu.
    Syarat mutlak:
    - Balasan harus sangat singkat, alami, dan sehari-hari (maksimal 3-6 kata per kalimat).
    - Jangan berikan balasan yang berupa pertanyaan kecuali sangat diperlukan.
    - Berikan HANYA dalam format array JSON string murni. Jangan tambahkan teks apa pun selain JSON.

    Contoh format wajib:
    ["Oke, paham", "Terima kasih", "Tunggu sebentar"]
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite',generationConfig: {
        maxOutputTokens: 50, // PAKSA AI MENJAWAB PENDEK! (Sangat mempercepat latensi)
        temperature: 0.7,    // Sedikit kreativitas agar bahasanya luwes
        responseMimeType: "application/json" // PAKSA FORMAT JSON (Hanya berlaku di Gemini terbaru)
      } });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 3. Bersihkan Markdown (kalau-kalau AI iseng menambahkan ```json)
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // Parse ke dalam bentuk Array
    const templates = JSON.parse(cleanText);

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Jika gagal (kuota habis/error), beri balasan darurat yang aman
    return NextResponse.json(
      { templates: ["Ya, benar", "Bisa diulang?", "Saya kurang paham"] }, 
      { status: 500 }
    );
  }
}