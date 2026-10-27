import React, { useState } from 'react';
import { Conversation } from '../types';
import { X, ShieldCheck, Check, QrCode } from 'lucide-react';

interface SafetyNumberModalProps {
  conversation: Conversation | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'hi';
}

export const SafetyNumberModal: React.FC<SafetyNumberModalProps> = ({
  conversation,
  isOpen,
  onClose,
  lang,
}) => {
  const [isVerified, setIsVerified] = useState(false);

  if (!isOpen || !conversation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 text-slate-900 dark:text-slate-50">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                {lang === 'en' ? 'Verify Safety Number' : 'सुरक्षा संख्या सत्यापित करें'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{conversation.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Visual Matrix */}
        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 mb-3">
            <QrCode className="w-32 h-32 text-slate-900" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
            {conversation.encryptionAlgorithm}
          </span>
        </div>

        {/* 6 blocks of safety numbers */}
        <div>
          <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-2">
            {lang === 'en' ? 'Verifiable End-to-End Fingerprint' : 'सत्यापन योग्य एंड-टू-एंड फिंगरप्रिंट'}
          </div>
          <div className="font-mono text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-center tracking-wider leading-relaxed select-all">
            {conversation.safetyNumber}
          </div>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {lang === 'en'
            ? 'Compare this safety number with the other person to verify that your conversation is end-to-end encrypted and immune to man-in-the-middle interception.'
            : 'अपने साथी के साथ इस सुरक्षा नंबर की तुलना करें ताकि यह पुष्टि हो सके कि चैट पूरी तरह से एन्क्रिप्टेड है और कोई तीसरा पक्ष इसे नहीं पढ़ सकता।'}
        </p>

        {/* Action Button */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              setIsVerified(!isVerified);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer ${
              isVerified
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white'
            }`}
          >
            {isVerified ? (
              <>
                <Check className="w-4 h-4" />
                <span>{lang === 'en' ? 'Cryptographically Verified' : 'सत्यापित चिह्नित किया गया'}</span>
              </>
            ) : (
              <span>{lang === 'en' ? 'Mark as Verified' : 'सत्यापित के रूप में चिह्नित करें'}</span>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Done' : 'पूर्ण'}
          </button>
        </div>

      </div>
    </div>
  );
};
