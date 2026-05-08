// src/hooks/useRoom.ts
import { useState, useEffect } from 'react';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { Message } from '../types';

// PERUBAHAN: Tambahkan parameter `role`
export function useRoom(roomPin: string | null, role: 'host' | 'guest' | null = null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRoomActive, setIsRoomActive] = useState<boolean | null>(null); 

  useEffect(() => {
    if (!roomPin) {
      setMessages([]);
      setIsRoomActive(null); // Kembalikan ke null saat kosong
      return;
    }

    const roomRef = ref(db, `rooms/${roomPin}`);
    const messagesRef = ref(db, `rooms/${roomPin}/messages`);

    // PERBAIKAN KRUSIAL:
    // Jika yang memanggil hook ini adalah Host, buat node 'status: active' 
    // agar Firebase mengakui ruangan ini ADA (tidak dihapus karena kosong).
    if (role === 'host') {
      set(ref(db, `rooms/${roomPin}/status`), 'active');
    }
    
    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setIsRoomActive(true);
      } else {
        setIsRoomActive(false); 
      }
    });

    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        
        messageList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });

    return () => {
      unsubscribeRoom();
      unsubscribeMessages();
    };
  }, [roomPin, role]);

  const sendMessage = async (messageData: Omit<Message, 'id'>) => {
    if (!roomPin) return;
    const messagesRef = ref(db, `rooms/${roomPin}/messages`);
    await push(messagesRef, messageData);
  };

  const destroyRoom = async () => {
    if (!roomPin) return;
    const roomRef = ref(db, `rooms/${roomPin}`);
    await remove(roomRef);
    setMessages([]);
    setIsRoomActive(false);
  };

  return { messages, sendMessage, destroyRoom, isRoomActive };
}