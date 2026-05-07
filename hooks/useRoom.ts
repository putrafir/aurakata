// src/hooks/useRoom.ts
import { useState, useEffect } from 'react';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { Message } from '../types';

export function useRoom(roomPin: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRoomActive, setIsRoomActive] = useState(false);

  useEffect(() => {
    if (!roomPin) {
      setMessages([]);
      setIsRoomActive(false);
      return;
    }

    // Referensi ke spesifik room di database
    const roomRef = ref(db, `rooms/${roomPin}`);
    const messagesRef = ref(db, `rooms/${roomPin}/messages`);

    // Tandai bahwa room ini aktif
    set(ref(db, `rooms/${roomPin}/status`), 'active');
    setIsRoomActive(true);

    // Listener Real-time: Setiap ada data baru, langsung update state
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Konversi Object dari Firebase menjadi Array of Messages
        const messageList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key, // Menggunakan Firebase Push ID sebagai Key
        }));
        
        // Urutkan berdasarkan timestamp
        messageList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });

    // Cleanup listener saat komponen di-unmount atau room berubah
    return () => unsubscribe();
  }, [roomPin]);

  // Fungsi untuk mengirim pesan
  const sendMessage = async (messageData: Omit<Message, 'id'>) => {
    if (!roomPin) return;
    const messagesRef = ref(db, `rooms/${roomPin}/messages`);
    await push(messagesRef, messageData);
  };

  // Fungsi untuk menghancurkan room demi privasi
  const destroyRoom = async () => {
    if (!roomPin) return;
    const roomRef = ref(db, `rooms/${roomPin}`);
    await remove(roomRef); // Menghapus SEMUA isi obrolan dari database
    setMessages([]);
    setIsRoomActive(false);
  };

  return {
    messages,
    sendMessage,
    destroyRoom,
    isRoomActive
  };
}