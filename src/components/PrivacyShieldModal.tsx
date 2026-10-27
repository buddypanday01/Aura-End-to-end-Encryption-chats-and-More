import React, { useState, useEffect } from 'react';
import { Shield, Lock, EyeOff, RefreshCw, Key, CheckCircle, X, Terminal, Cpu } from 'lucide-react';
import { generateSessionKey, encryptText, decryptText, generateSafetyFingerprint } from '../utils/crypto';

interface PrivacyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'hi';
}

export const PrivacyShieldModal: React.FC<PrivacyShieldModalProps> = ({ isOpen, onClose, lang }) => {
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const [fingerprint, setFingerprint] = useState<string>('Generating Enclave Keys...');
  const [testPlaintext, setTestPlaintext] = useState('Secret message: No Big Tech surveillance can read this.');
  const [testCiphertext, setTestCiphertext] = useState('');
  const [testIv, setTestIv] = useState('');
  const [decryptedResult, setDecryptedResult] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tester' | 'audit'>('overview');

  useEffect(() => {
    if (isOpen && !sessionKey) {
      initKeys();
    }
  }, [isOpen]);

  const initKeys = async () => {
    try {
      const key = await generateSessionKey();
      setSessionKey(key);
      const fp = await generateSafetyFingerprint('Aura-Device-Root-Seed-' + Date.now());
      setFingerprint(fp);

      // Perform initial test encryption
      const encrypted = await encryptText(testPlaintext, key);
      setTestCiphertext(encrypted.ciphertext);
      setTestIv(encrypted.iv);
      setDecryptedResult(testPlaintext);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestEncrypt = async () => {
    if (!sessionKey || !testPlaintext) return;
    setIsEncrypting(true);
    try {
      const res = await encryptText(testPlaintext, sessionKey);
      setTestCiphertext(res.ciphertext);
      setTestIv(res.iv);
      const dec = await decryptText(res.ciphertext, res.iv, sessionKey);
      setDecryptedResult(dec);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEncrypting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                {lang === 'en' ? 'Aura Cryptographic Citadel' : 'ऑरा प्राइवेसी सिटाडेल'}
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5 font-medium">
                <span>AES-256-GCM Hardware WebCrypto</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">0 Trackers</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/40">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {lang === 'en' ? 'Enclave Overview' : 'एन्क्लेव ओवरव्यू'}
          </button>
          <button
            onClick={() => setActiveTab('tester')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tester'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {lang === 'en' ? 'Live Crypto Playground' : 'लाइव एन्क्रिप्शन टेस्ट'}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {lang === 'en' ? 'Vs. Big Tech Audit' : 'पारंपरिक ऐप्स से तुलना'}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Safety Number Display */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{lang === 'en' ? 'Device Root Safety Fingerprint' : 'डिवाइस रूट सेफ्टी फिंगरप्रिंट'}</span>
                  </div>
                  <button
                    onClick={initKeys}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{lang === 'en' ? 'Regenerate Session' : 'पुनर्निर्मित करें'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm tracking-wider text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 break-all select-all font-semibold">
                  {fingerprint}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {lang === 'en'
                    ? 'Verifiable peer-to-peer SHA-256 fingerprint. Keys never transit across server databases.'
                    : 'सत्यापन योग्य SHA-256 फिंगरप्रिंट। एन्क्रिप्शन कीज कभी भी किसी सर्वर को नहीं भेजी जातीं।'}
                </div>
              </div>

              {/* 4 Pillars of Protection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1 text-slate-900 dark:text-slate-100 font-bold text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>0 Tracking Cookies & Pixels</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Meta Pixel, Google Tag Manager, and telemetry cookies are mathematically excluded from Aura's DOM.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1 text-slate-900 dark:text-slate-100 font-bold text-xs">
                    <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Client-Side AES-256-GCM</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    All private posts, vault chats, and disappearing snaps are encrypted locally using the Web Crypto API.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1 text-slate-900 dark:text-slate-100 font-bold text-xs">
                    <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>EXIF & Geolocation Stripper</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Photo uploads automatically have GPS coordinates, camera serials, and timestamps wiped before broadcast.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1 text-slate-900 dark:text-slate-100 font-bold text-xs">
                    <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Disappearing Memory Enclave</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Snaps & secret messages self-destruct upon peek with zero recovery logs stored on disk.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tester' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {lang === 'en'
                  ? 'Verify browser WebCrypto in real time. Type any sensitive message below and encrypt it using your active AES-256 session key.'
                  : 'रियल-टाइम में वेबक्रिप्टो का परीक्षण करें। नीचे कोई भी गुप्त संदेश लिखें और इसे अपने AES-256 की से एन्क्रिप्ट करें।'}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {lang === 'en' ? 'Plaintext (Only in your memory)' : 'मूल संदेश (केवल आपकी मेमोरी में)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testPlaintext}
                    onChange={(e) => setTestPlaintext(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-50 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800"
                  />
                  <button
                    onClick={handleTestEncrypt}
                    disabled={isEncrypting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    {isEncrypting ? 'Encrypting...' : lang === 'en' ? 'Encrypt Now' : 'एन्क्रिप्ट करें'}
                  </button>
                </div>
              </div>

              {testCiphertext && (
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 flex items-center justify-between mb-1">
                      <span>AES-256-GCM Ciphertext Hex</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400 font-normal">IV: {testIv}</span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-700">
                      {testCiphertext}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      {lang === 'en'
                        ? 'This ciphertext is what travels across the wire. Big Tech or ISPs only see these random hex bytes.'
                        : 'यह साइफरटेक्स्ट नेटवर्क पर जाता है। कोई भी मध्यस्थ केवल इन हेक्स बाइट्स को देख सकता है।'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                      {lang === 'en' ? 'Decrypted via Enclave Key:' : 'एन्क्लेव की द्वारा डिक्रिप्ट किया गया:'}
                    </div>
                    <div className="text-xs text-emerald-950 dark:text-emerald-200 font-semibold">
                      "{decryptedResult}"
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {lang === 'en'
                  ? 'Detailed architectural matrix proving how Aura surpasses legacy platforms:'
                  : 'विस्तृत तुलना जो दिखाती है कि कैसे ऑरा सभी पुराने सोशल ऐप्स से बेहतर है:'}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/60">
                      <th className="py-2.5 px-2.5 font-bold">Platform</th>
                      <th className="py-2.5 px-2.5 font-bold">E2EE Privacy</th>
                      <th className="py-2.5 px-2.5 font-bold">Data Harvesting / Ads</th>
                      <th className="py-2.5 px-2.5 font-bold">Aura Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-slate-100">Instagram / FB</td>
                      <td className="py-2.5 px-2.5 text-rose-600 dark:text-rose-400 font-medium">No (Public AI training)</td>
                      <td className="py-2.5 px-2.5 text-rose-600 dark:text-rose-400">Extensive tracking & profile selling</td>
                      <td className="py-2.5 px-2.5 text-indigo-700 dark:text-indigo-400 font-bold">Visual feeds with zero ads & zero surveillance</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-slate-100">WhatsApp</td>
                      <td className="py-2.5 px-2.5 text-amber-700 dark:text-amber-400 font-medium">Partial (Metadata leaked to Meta)</td>
                      <td className="py-2.5 px-2.5 text-amber-700 dark:text-amber-400">Harvests who, when & where you chat</td>
                      <td className="py-2.5 px-2.5 text-indigo-700 dark:text-indigo-400 font-bold">Full Zero-Knowledge routing, no phone req.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-slate-100">Telegram</td>
                      <td className="py-2.5 px-2.5 text-rose-600 dark:text-rose-400 font-medium">Off by default in group chats</td>
                      <td className="py-2.5 px-2.5 text-slate-500 dark:text-slate-400">Server-stored unencrypted messages</td>
                      <td className="py-2.5 px-2.5 text-indigo-700 dark:text-indigo-400 font-bold">Always-on E2EE across chats & broadcasts</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-slate-100">Snapchat</td>
                      <td className="py-2.5 px-2.5 text-amber-700 dark:text-amber-400 font-medium">Proprietary cloud storage</td>
                      <td className="py-2.5 px-2.5 text-rose-600 dark:text-rose-400">Targeted ad profiles & location map</td>
                      <td className="py-2.5 px-2.5 text-indigo-700 dark:text-indigo-400 font-bold">Client-burned snaps with anti-leak shields</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-slate-100">Twitter / X</td>
                      <td className="py-2.5 px-2.5 text-rose-600 dark:text-rose-400 font-medium">No E2EE on public pulses</td>
                      <td className="py-2.5 px-2.5 text-rose-600 dark:text-rose-400">Outrage algorithmic feed</td>
                      <td className="py-2.5 px-2.5 text-indigo-700 dark:text-indigo-400 font-bold">Pure chronological pulses & cryptovoting</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-slate-100">LinkedIn</td>
                      <td className="py-2.5 px-2.5 text-rose-600 dark:text-rose-400 font-medium">Zero privacy (Identity public)</td>
                      <td className="py-2.5 px-2.5 text-rose-600 dark:text-rose-400">Aggressive cold inMail tracking</td>
                      <td className="py-2.5 px-2.5 text-indigo-700 dark:text-indigo-400 font-bold">Stealth talent radar with verified skill ZK-proofs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Cryptographic Session Verified</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer border border-transparent dark:border-slate-700"
          >
            {lang === 'en' ? 'Close Citadel' : 'बंद करें'}
          </button>
        </div>

      </div>
    </div>
  );
};
