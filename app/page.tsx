"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HostDashboard } from './components/HostDashboard';
import { GuestInterface } from './components/GuestInterface';
import { QRModal } from './components/QRModal';
import { GuestLobby } from './components/GuestLobby';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { ProfileView } from './components/ProfileView';

import { Message, Sentiment, AppState } from '../types';
import { Settings, Users } from 'lucide-react';
import { useRoom } from '@/hooks/useRoom';

// FIREBASE IMPORTS
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { ref, get, set } from 'firebase/database'; // <-- PERBAIKAN 1: Import ini wajib ada

export default function Home() {
  const [state, setState] = React.useState<AppState>({
    phase: 'init',
    role: 'host',
    roomPin: '',
  });

  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

  const { messages, sendMessage, destroyRoom, isRoomActive } = useRoom(state.phase === 'chat' ? state.roomPin : null, state.role);

  // Modal States
  const [isQRModalOpen, setIsQRModalOpen] = React.useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);
  const [joinPinInput, setJoinPinInput] = React.useState('');

  // AI & Custom Templates States
  const [smartTemplates, setSmartTemplates] = React.useState<string[]>([]);
  const [customTemplates, setCustomTemplates] = React.useState<string[]>([]);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = React.useState(false);
  const [newTemplateText, setNewTemplateText] = React.useState('');
  const [fullQRUrl, setFullQRUrl] = React.useState(''); // <-- TAMBAHKAN INI

  // 1. LOGIKA INISIASI TUNGGAL (URL, Session, & Template Awal)
  React.useEffect(() => {
    const savedTemplates = localStorage.getItem('aurakata_templates');
    if (savedTemplates) {
      setCustomTemplates(JSON.parse(savedTemplates));
    } else {
      setCustomTemplates(["Berapa harganya?", "Bisa bicara lebih lambat?"]);
    }

    const savedRole = sessionStorage.getItem('aura_role');
    const savedPin = sessionStorage.getItem('aura_room');
    const savedName = sessionStorage.getItem('aura_name');
    const savedColor = sessionStorage.getItem('aura_color');

    if (savedRole && savedPin) {
      if (savedRole === 'host') {
        setState({ phase: 'chat', role: 'host', roomPin: savedPin });
      } else {
        if (savedName && savedColor) {
          setState({
            phase: 'chat',
            role: 'guest',
            roomPin: savedPin,
            guestName: savedName,
            guestColor: savedColor
          });
        } else {
          setState({ phase: 'guest-lobby', role: 'guest', roomPin: savedPin });
        }
      }
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');
    if (roomFromUrl) {
      setState({ phase: 'guest-lobby', role: 'guest', roomPin: roomFromUrl });
    }
  }, []);

  // 2. LOGIKA PANTAU STATUS LOGIN & AMBIL TEMPLATE FIREBASE
  React.useEffect(() => {
    // TAMBAHKAN BARIS PENJAGA INI:
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userRef = ref(db, `users/${user.uid}/templates`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setCustomTemplates(snapshot.val());
        } else {
          set(userRef, customTemplates);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. LOGIKA AUTO-EXIT
  React.useEffect(() => {
    if (state.phase === 'chat' && state.role === 'guest' && isRoomActive === false) {
      alert("Sesi telah diakhiri oleh Host.");
      handleExit();
    }
  }, [isRoomActive, state.phase, state.role]);

  // LOGIKA AMAN UNTUK GENERATE URL QR CODE (Mencegah Hydration Error)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && state.roomPin) {
      setFullQRUrl(`${window.location.origin}?room=${state.roomPin}`);
    }
  }, [state.roomPin]);

  // 4. FUNGSI NAVIGASI & SESI
  const handleCreateRoom = () => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem('aura_role', 'host');
    sessionStorage.setItem('aura_room', newPin);
    setState({ phase: 'chat', role: 'host', roomPin: newPin });
    setIsQRModalOpen(true);
  };

  const handleJoinWithPin = () => {
    if (joinPinInput.trim().length >= 4) {
      setIsJoinModalOpen(false);
      setState({ phase: 'guest-lobby', role: 'guest', roomPin: joinPinInput.trim() });
      setJoinPinInput('');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error("Error login:", error);
      alert("Gagal login dengan Google.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error logout:", error);
    }
  };

  const handleJoinSuccess = (name: string, color: string) => {
    sessionStorage.setItem('aura_role', 'guest');
    sessionStorage.setItem('aura_name', name);
    sessionStorage.setItem('aura_color', color);
    sessionStorage.setItem('aura_room', state.roomPin);

    setState(prev => ({
      ...prev,
      phase: 'chat',
      guestName: name,
      guestColor: color
    }));
  };

  const handleExit = () => {
    if (state.role === 'host') destroyRoom();
    sessionStorage.removeItem('aura_role');
    sessionStorage.removeItem('aura_room');
    sessionStorage.removeItem('aura_name');
    sessionStorage.removeItem('aura_color');
    setState({ phase: 'init', role: 'host', roomPin: '' });
    window.history.pushState({}, '', '/');
  };

  // 5. LOGIKA PENGIRIMAN PESAN
  const handleGuestMessage = (text: string, sentiment: Sentiment) => {
    sendMessage({
      text,
      sender: 'guest',
      sentiment: sentiment,
      senderName: state.guestName || 'Tamu',
      senderColor: state.guestColor,
      timestamp: Date.now(),
    });
    // generateSmartTemplates() akan dipanggil di sini nantinya
  };

  const handleHostReply = (text: string, sentiment: Sentiment) => {
    sendMessage({
      text,
      sender: 'host',
      sentiment,
      timestamp: Date.now(),
    });
  };

  // 6. LOGIKA TEMPLATE AI & CUSTOM (SINKRONISASI FIREBASE)
  const generateSmartTemplates = async (chatHistory: Message[]) => {
    if (chatHistory.length === 0) return;
    try {
      console.log("Meminta Gemini menganalisis konteks percakapan...");
      setTimeout(() => {
        setSmartTemplates(["Ya, setuju!", "Saya kurang paham", "Bisa diulang?"]);
      }, 1000);
    } catch (error) {
      console.error("Gagal mendapatkan rekomendasi AI", error);
    }
  };

  // PERBAIKAN 3: Fungsi simpan & hapus ini bisa mendeteksi apakah user sedang login atau tidak
  const saveNewCustomTemplate = () => {
    if (!newTemplateText.trim()) return;
    const updated = [...customTemplates, newTemplateText];
    setCustomTemplates(updated);
    setNewTemplateText('');

    if (currentUser) {
      set(ref(db, `users/${currentUser.uid}/templates`), updated);
    } else {
      localStorage.setItem('aurakata_templates', JSON.stringify(updated));
    }
  };

  const deleteCustomTemplate = (idx: number) => {
    const updated = customTemplates.filter((_, i) => i !== idx);
    setCustomTemplates(updated);
    if (currentUser) {
      set(ref(db, `users/${currentUser.uid}/templates`), updated);
    } else {
      localStorage.setItem('aurakata_templates', JSON.stringify(updated));
    }
  };

  // const fullQRUrl = typeof window !== 'undefined' ? `${window.location.origin}?room=${state.roomPin}` : '';

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-200 overflow-x-hidden">
      <AnimatePresence mode="wait">

        {/* FASE 1: LANDING PAGE */}
        {state.phase === 'init' && (
          <LandingPage
            key="lobby"
            onCreateRoom={handleCreateRoom}
            onOpenJoinModal={() => setIsJoinModalOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onLogoutClick={handleLogout}
            currentUser={currentUser}
            onProfileClick={() => setState(prev => ({ ...prev, phase: 'profile' }))}
          />
        )}

        {/* FASE PROFIL */}
        {state.phase === 'profile' && currentUser && (
          <ProfileView
            user={currentUser}
            templates={customTemplates}
            onAddTemplate={(text) => {
              const updated = [...customTemplates, text];
              setCustomTemplates(updated);
              set(ref(db, `users/${currentUser.uid}/templates`), updated);
            }}
            onDeleteTemplate={(idx) => {
              deleteCustomTemplate(idx);
            }}
            onLogout={() => {
              handleLogout();
              setState({ ...state, phase: 'init' });
            }}
            onBack={() => setState({ ...state, phase: 'init' })}
          />
        )}

        {/* FASE 2: LOBBY TAMU */}
        {state.phase === 'guest-lobby' && (
          <GuestLobby
            key="guest-lobby"
            roomPin={state.roomPin}
            onJoin={handleJoinSuccess}
          />
        )}

        {/* FASE 3: RUANG OBROLAN UTAMA */}
        {state.phase === 'chat' && (
          <motion.div
            key="chat-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[100dvh]"
          >
            {state.role === 'host' ? (
              <div className="relative h-full">
                <button
                  onClick={() => setIsTemplateManagerOpen(true)}
                  className="absolute top-4 left-4 z-50 bg-white p-3 rounded-full shadow-lg border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <Settings size={20} />
                </button>

                <HostDashboard
                  messages={messages}
                  onReply={handleHostReply}
                  openQR={() => setIsQRModalOpen(true)}
                  smartTemplates={smartTemplates}
                  customTemplates={customTemplates}
                />
              </div>
            ) : (
              <GuestInterface
                messages={messages}
                onSendMessage={handleGuestMessage}
                currentGuestName={state.guestName}
              />
            )}

            <div className="fixed top-4 right-4 z-50">
              <button
                onClick={handleExit}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all"
              >
                {state.role === 'host' ? 'Akhiri Sesi' : 'Keluar'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL COMPONENTS */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        pin={state.roomPin}
        fullUrl={fullQRUrl}
      />

      <AnimatePresence>
        {isTemplateManagerOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Kelola Template</h2>
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTemplateText}
                  onChange={(e) => setNewTemplateText(e.target.value)}
                  placeholder="Ketik kalimat sering dipakai..."
                  className="flex-1 px-4 py-3 bg-slate-100 rounded-xl border-2 border-slate-200 focus:border-sky-500 outline-none"
                />
                <button
                  onClick={saveNewCustomTemplate} // Menggunakan fungsi tersentralisasi
                  className="bg-sky-500 text-white font-bold px-4 rounded-xl border-b-4 border-sky-700 active:border-b-0 active:translate-y-1"
                >
                  Simpan
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {customTemplates.map((tpl, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-slate-600 font-medium">{tpl}</span>
                    <button
                      onClick={() => deleteCustomTemplate(idx)} // Menggunakan fungsi tersentralisasi
                      className="text-red-500 text-sm font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsTemplateManagerOpen(false)}
                className="w-full mt-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isJoinModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-sky-500" size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2 text-slate-800 font-heading">Masukkan PIN</h2>
              <p className="text-slate-500 mb-6 font-medium text-sm">Tanya Host untuk 4 digit PIN ruangan.</p>

              <input
                type="text"
                maxLength={4}
                value={joinPinInput}
                onChange={(e) => setJoinPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinWithPin()}
                placeholder="0000"
                className="w-full text-center text-4xl tracking-[1em] px-4 py-4 bg-slate-100 rounded-2xl border-4 border-slate-200 focus:border-sky-500 outline-none font-black text-slate-700 mb-6 font-heading"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setIsJoinModalOpen(false)}
                  className="flex-1 py-4 bg-slate-200 text-slate-500 font-bold rounded-2xl border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleJoinWithPin}
                  disabled={joinPinInput.length < 4}
                  className={`flex-1 py-4 font-bold rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all ${joinPinInput.length === 4
                    ? 'bg-sky-500 text-white border-sky-700'
                    : 'bg-slate-200 text-slate-400 border-slate-300'
                    }`}
                >
                  Lanjut
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginGoogle={handleGoogleLogin}
      />
    </div>
  );
}