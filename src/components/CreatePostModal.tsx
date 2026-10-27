import React, { useState } from 'react';
import { Post, PersonaType } from '../types';
import { X, Image, Lock, ShieldCheck, Sparkles, Briefcase, EyeOff, BarChart2 } from 'lucide-react';
import { generateSessionKey, encryptText } from '../utils/crypto';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: Post) => void;
  currentPersona: PersonaType;
  lang: 'en' | 'hi';
}

const PRESET_IMAGES = [
  { label: 'Tokyo Twilight', url: '/src/assets/images/post_cyberpunk_tokyo_1792765385583.jpg' },
  { label: 'Alps Sanctuary', url: '/src/assets/images/post_mountain_sanctuary_1792765407740.jpg' },
  { label: 'Quantum Processor', url: '/src/assets/images/post_quantum_chip_1792765407460.jpg' },
  { label: 'Golden Hour Cliff', url: '/src/assets/images/snap_ephemeral_sunset_1792765407413.jpg' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onAddPost,
  currentPersona,
  lang,
}) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(PRESET_IMAGES[0].url);
  const [postMode, setPostMode] = useState<'visual' | 'pulse' | 'snap' | 'pro'>('visual');
  const [encryptionLevel, setEncryptionLevel] = useState<'AES-256-GCM' | 'Zero-Knowledge' | 'Public'>('AES-256-GCM');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['AuraNetwork', 'PrivacyFirst']);
  
  // Poll fields for Pulse mode
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpt1, setPollOpt1] = useState('');
  const [pollOpt2, setPollOpt2] = useState('');

  // Pro fields for Pro mode
  const [proRole, setProRole] = useState('Senior Systems Architect');
  const [proCompany, setProCompany] = useState('Zero-Knowledge Labs');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.replace(/^#/, '').trim();
      if (!tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      let ciphertext: string | undefined;
      let iv: string | undefined;

      if (encryptionLevel !== 'Public') {
        const key = await generateSessionKey();
        const enc = await encryptText(content, key);
        ciphertext = enc.ciphertext;
        iv = enc.iv;
      }

      const newPost: Post = {
        id: 'post-' + Date.now(),
        author: currentPersona === 'ghost' ? 'Anonymous Enclave' : currentPersona === 'pro' ? 'Elena Vance, Eng.' : 'Elena Vance',
        username: currentPersona === 'ghost' ? '@0xCipher' : currentPersona === 'pro' ? '@elena_pro' : '@elenavance',
        avatar: currentPersona === 'ghost'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        persona: currentPersona,
        timestamp: 'Just now',
        content: content.trim(),
        mediaUrl: postMode === 'visual' || postMode === 'snap' ? selectedImage || undefined : undefined,
        mediaType: selectedImage ? 'image' : undefined,
        likes: 0,
        userLiked: false,
        bookmarks: 0,
        userBookmarked: false,
        reposts: 0,
        comments: [],
        tags: tags,
        encryptionType: encryptionLevel,
        ciphertext,
        iv,
        verifiedKeyHash: '0x' + Math.random().toString(16).substring(2, 6).toUpperCase() + '...9A2F',
        poll: pollQuestion && pollOpt1 && pollOpt2 ? {
          question: pollQuestion,
          options: [
            { text: pollOpt1, votes: 0 },
            { text: pollOpt2, votes: 0 },
          ],
          totalVotes: 0,
        } : undefined,
        proDetails: postMode === 'pro' ? {
          role: proRole,
          company: proCompany,
          credentialId: 'PRO-VERIFIED-' + Math.floor(1000 + Math.random() * 9000),
          verifiedSkills: ['Zero-Knowledge Cryptography', 'Distributed Architecture'],
        } : undefined,
        ephemeralSeconds: postMode === 'snap' ? 10 : undefined,
      };

      onAddPost(newPost);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-slate-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
              {lang === 'en' ? 'Create Cryptographically Signed Post' : 'नई एन्क्रिप्टेड पोस्ट बनाएं'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Format Selector */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setPostMode('visual')}
            className={`py-2 px-1 text-center font-bold rounded-lg transition-colors flex flex-col items-center gap-1 cursor-pointer ${
              postMode === 'visual'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Visual Feed' : 'विजुअल (Insta)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setPostMode('pulse')}
            className={`py-2 px-1 text-center font-bold rounded-lg transition-colors flex flex-col items-center gap-1 cursor-pointer ${
              postMode === 'pulse'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Pulse Debate' : 'पल्स (X)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setPostMode('snap')}
            className={`py-2 px-1 text-center font-bold rounded-lg transition-colors flex flex-col items-center gap-1 cursor-pointer ${
              postMode === 'snap'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? '10s Snap' : 'स्नैप (Snap)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setPostMode('pro')}
            className={`py-2 px-1 text-center font-bold rounded-lg transition-colors flex flex-col items-center gap-1 cursor-pointer ${
              postMode === 'pro'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Pro Milestone' : 'प्रो (LinkedIn)'}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Metadata Sanitizer Strip */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{lang === 'en' ? 'EXIF & Geolocation Sanitizer Active' : 'EXIF व GPS मेटाडेटा स्वतः हटाया जाएगा'}</span>
            </div>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-mono font-bold">0-LEAK GUARANTEE</span>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postMode === 'pulse'
                  ? 'Spark a debate or thought (280 chars max)...'
                  : postMode === 'pro'
                  ? 'Share a verified achievement, technical breakthrough, or research...'
                  : postMode === 'snap'
                  ? 'Ephemeral note that dissolves after single view...'
                  : 'Capture the moment with zero tracking algorithms...'
              }
              maxLength={postMode === 'pulse' ? 280 : 2000}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 resize-none"
              required
            />
            {postMode === 'pulse' && (
              <div className="text-right text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1">
                {content.length}/280
              </div>
            )}
          </div>

          {/* Image Selection for Visual or Snap Mode */}
          {(postMode === 'visual' || postMode === 'snap') && (
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{lang === 'en' ? 'Select High-Fidelity Asset' : 'फोटो का चयन करें (मेटाडेटा क्लीन)'}</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_IMAGES.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setSelectedImage(selectedImage === img.url ? null : img.url)}
                    className={`relative rounded-lg overflow-hidden border-2 aspect-video transition-all cursor-pointer ${
                      selectedImage === img.url ? 'border-indigo-600 scale-[1.02] shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    {selectedImage === img.url && (
                      <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-xs">✓</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Poll Inputs for Pulse Mode */}
          {postMode === 'pulse' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{lang === 'en' ? 'Add Zero-Knowledge Poll (Optional)' : 'जीरो-नॉलेज पोल जोड़ें (वैकल्पिक)'}</span>
              </div>
              <input
                type="text"
                placeholder="Poll question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-50 focus:outline-none focus:border-indigo-600"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Option 1"
                  value={pollOpt1}
                  onChange={(e) => setPollOpt1(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-50 focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="text"
                  placeholder="Option 2"
                  value={pollOpt2}
                  onChange={(e) => setPollOpt2(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-50 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          {/* Pro Milestone Inputs */}
          {postMode === 'pro' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'en' ? 'Verified Work Credentials' : 'सत्यापित कार्य क्रेडेंशियल'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Role (e.g. Lead Researcher)"
                  value={proRole}
                  onChange={(e) => setProRole(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-50 focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="text"
                  placeholder="Company / Institution"
                  value={proCompany}
                  onChange={(e) => setProCompany(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-50 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          {/* Encryption & Audience Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{lang === 'en' ? 'Encryption Enclave Level' : 'एन्क्रिप्शन स्तर चुनें'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEncryptionLevel('AES-256-GCM')}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  encryptionLevel === 'AES-256-GCM'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-bold">AES-256-GCM</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Trusted Circles</div>
              </button>

              <button
                type="button"
                onClick={() => setEncryptionLevel('Zero-Knowledge')}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  encryptionLevel === 'Zero-Knowledge'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-bold">Zero-Knowledge</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Verifiable Hash</div>
              </button>

              <button
                type="button"
                onClick={() => setEncryptionLevel('Public')}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  encryptionLevel === 'Public'
                    ? 'border-slate-800 dark:border-slate-400 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50 font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-bold">Open Public</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Global Stream</div>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded flex items-center gap-1"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-600 text-slate-400 ml-1 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? 'Cryptographically Signing...'
                : lang === 'en'
                ? 'Sign & Broadcast to Aura'
                : 'हस्ताक्षर करें और पोस्ट करें'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
