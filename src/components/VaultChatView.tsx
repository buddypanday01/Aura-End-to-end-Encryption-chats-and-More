import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from '../types';
import { Shield, Lock, Send, Key, Mic, Play, Pause, Flame, Eye, CheckCheck } from 'lucide-react';
import { generateSessionKey } from '../utils/crypto';

interface VaultChatViewProps {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConvId: string;
  setActiveConvId: (id: string) => void;
  onSendMessage: (convId: string, text: string, isDisappearing: boolean) => void;
  onOpenSafetyNumber: (conv: Conversation) => void;
  lang: 'en' | 'hi';
}

export const VaultChatView: React.FC<VaultChatViewProps> = ({
  conversations,
  messages,
  activeConvId,
  setActiveConvId,
  onSendMessage,
  onOpenSafetyNumber,
  lang,
}) => {
  const [inputText, setInputText] = useState('');
  const [isDisappearingActive, setIsDisappearingActive] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showCiphertextModal, setShowCiphertextModal] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateSessionKey().catch(console.error);
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessageList = messages[activeConversation.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessageList.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(activeConversation.id, inputText.trim(), isDisappearingActive);
    setInputText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 h-[calc(100vh-5.5rem)]">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl h-full flex overflow-hidden shadow-sm">
        
        {/* Left Sidebar: Conversations List */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-950/60">
          
          {/* Top header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  {lang === 'en' ? 'Vault Encrypted Chats' : 'वॉल्ट एन्क्रिप्टेड संदेश'}
                </h3>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-mono">SIGNAL PROTOCOL RATCHET</span>
              </div>
            </div>
          </div>

          {/* List of Conversations */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConversation.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-l-2 border-indigo-600 dark:border-indigo-400' : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    {conv.isSecret && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{conv.name}</h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{conv.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-350 truncate leading-relaxed">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      {conv.isChannel ? (
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                          {conv.memberCount?.toLocaleString()} subscribers
                        </span>
                      ) : (
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          E2EE 256
                        </span>
                      )}

                      {conv.disappearingTimer > 0 && (
                        <span className="font-mono text-amber-700 dark:text-amber-400 font-medium flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" />
                          {conv.disappearingTimer}s burn
                        </span>
                      )}
                    </div>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-indigo-600 text-white rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Security Info */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span>ZERO SERVER LOGS</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">ENCLAVE: ACTIVE</span>
          </div>
        </div>

        {/* Right Chat Area */}
        <div className="hidden sm:flex flex-1 flex-col bg-white dark:bg-slate-900">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.avatar}
                alt={activeConversation.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <span>{activeConversation.name}</span>
                  {activeConversation.isSecret && (
                    <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-700 font-bold">
                      SECRET VAULT
                    </span>
                  )}
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{activeConversation.encryptionAlgorithm}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Hardware Verified</span>
                </div>
              </div>
            </div>

            {/* Action Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenSafetyNumber(activeConversation)}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer"
                title="Verify Signal-style safety numbers"
              >
                <Key className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden md:inline">{lang === 'en' ? 'Safety Number' : 'सुरक्षा नंबर'}</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40 dark:bg-slate-950/50">
            
            {/* Encryption handshake banner */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto space-y-1 shadow-2xs">
              <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>{lang === 'en' ? 'End-to-End Encrypted Session' : 'एंड-टू-एंड एन्क्रिप्टेड सत्र'}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {lang === 'en'
                  ? 'Messages and calls are secured with AES-256-GCM. No one outside of this chat, not even Aura, can read or listen to them.'
                  : 'संदेश और कॉल AES-256-GCM से सुरक्षित हैं। कोई तीसरा पक्ष इन्हें नहीं पढ़ सकता।'}
              </p>
            </div>

            {/* Messages */}
            {activeMessageList.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl p-3 shadow-xs relative group ${
                    msg.isMine
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 rounded-bl-xs'
                  }`}
                >
                  {/* Sender Name if not mine */}
                  {!msg.isMine && (
                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">
                      {msg.senderName}
                    </div>
                  )}

                  {/* Disappearing Flame Banner */}
                  {msg.isDisappearing && (
                    <div className={`text-[10px] font-mono px-1.5 py-0.5 rounded mb-1.5 flex items-center gap-1 font-bold ${
                      msg.isMine ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    }`}>
                      <Flame className="w-3 h-3 text-amber-500 animate-pulse" />
                      <span>{msg.ephemeralSeconds || 10}s Burn-After-Reading</span>
                    </div>
                  )}

                  {/* Plaintext Content */}
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">
                    {msg.plaintext}
                  </p>

                  {/* Meta Bar */}
                  <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-mono ${
                    msg.isMine ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-400'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {msg.isMine && (
                      <CheckCheck className="w-3 h-3 text-indigo-200" />
                    )}
                  </div>

                  {/* Hover Inspect Cipher Button */}
                  <button
                    onClick={() => setShowCiphertextModal(msg)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-md hover:scale-110 cursor-pointer"
                    title="Inspect WebCrypto Ciphertext"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {/* Interactive Voice Note Card */}
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 space-y-2 shadow-xs">
                <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                  <span>Encrypted Voice Note</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">AES-256 AUDIO STREAM</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95 shadow-xs cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  {/* Waveform bars */}
                  <div className="flex items-center gap-1 h-6 flex-1">
                    {[40, 70, 95, 30, 80, 60, 100, 45, 85, 55, 35, 90, 75, 50, 65, 40].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-200 ${
                          isPlayingAudio ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        style={{ height: `${isPlayingAudio ? Math.max(20, (h * Math.random()) | 0) : h}%` }}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">0:14</span>
                </div>
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              
              {/* Ephemeral Flame Toggle */}
              <button
                type="button"
                onClick={() => setIsDisappearingActive(!isDisappearingActive)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDisappearingActive
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title="Toggle 10-second self-destructing message"
              >
                <Flame className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isDisappearingActive
                    ? 'Type a 10-second burn message...'
                    : lang === 'en'
                    ? 'Write encrypted message (AES-256 WebCrypto)...'
                    : 'एन्क्रिप्टेड संदेश लिखें...'
                }
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />

              <button
                type="button"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                title="Simulate Voice Note"
                onClick={() => onSendMessage(activeConversation.id, '🎙️ [Encrypted Voice Recording - 12s]', false)}
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Send' : 'भेजें'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Ciphertext Inspector Dialog */}
      {showCiphertextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-slate-900 dark:text-slate-50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Message Cryptographic Signature</span>
              </h4>
              <button
                onClick={() => setShowCiphertextModal(null)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 dark:text-slate-500">PLAIN TEXT:</div>
                <div className="text-slate-800 dark:text-slate-200">{showCiphertextModal.plaintext}</div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 dark:text-slate-500">CIPHERTEXT (HEX):</div>
                <div className="text-indigo-700 dark:text-indigo-400 font-bold break-all">{showCiphertextModal.ciphertext}</div>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
                <span>IV: {showCiphertextModal.iv}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">STATUS: AES-GCM 256</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
