import React, { useState } from 'react';
import { Post, PersonaType } from '../types';
import { Heart, Repeat2, Bookmark, MessageSquare, BarChart2, TrendingUp, CheckCircle, Send, Lock } from 'lucide-react';
import { generateSessionKey, encryptText } from '../utils/crypto';

interface PulseViewProps {
  pulses: Post[];
  onAddPulse: (pulse: Post) => void;
  onLikePulse: (pulseId: string) => void;
  onBookmarkPulse: (pulseId: string) => void;
  onRepostPulse: (pulseId: string) => void;
  onVotePoll: (pulseId: string, optionIndex: number) => void;
  currentPersona: PersonaType;
  lang: 'en' | 'hi';
}

const TRENDING_TOPICS = [
  { tag: 'ZeroKnowledgeProofs', postsCount: '48.2k' },
  { tag: 'PostQuantumCrypto', postsCount: '31.9k' },
  { tag: 'DataSovereignty', postsCount: '19.4k' },
  { tag: 'AuraCitadel', postsCount: '14.1k' },
  { tag: 'AntiSurveillance', postsCount: '11.8k' },
];

export const PulseView: React.FC<PulseViewProps> = ({
  pulses,
  onAddPulse,
  onLikePulse,
  onBookmarkPulse,
  onRepostPulse,
  onVotePoll,
  currentPersona,
  lang,
}) => {
  const [pulseText, setPulseText] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isPosting, setIsPosting] = useState(false);

  const handlePostPulse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pulseText.trim()) return;

    setIsPosting(true);
    try {
      const key = await generateSessionKey();
      const enc = await encryptText(pulseText.trim(), key);

      const newPulse: Post = {
        id: 'pulse-' + Date.now(),
        author: currentPersona === 'ghost' ? 'Ghost Enclave' : 'Elena Vance',
        username: currentPersona === 'ghost' ? '@0xCipher' : '@elenavance',
        avatar: currentPersona === 'ghost'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        persona: currentPersona,
        timestamp: 'Just now',
        content: pulseText.trim(),
        likes: 0,
        userLiked: false,
        bookmarks: 0,
        userBookmarked: false,
        reposts: 0,
        comments: [],
        tags: ['AuraPulse', 'FreeDebate'],
        encryptionType: 'AES-256-GCM',
        ciphertext: enc.ciphertext,
        iv: enc.iv,
        verifiedKeyHash: '0x' + Math.random().toString(16).substring(2, 6).toUpperCase() + '...7F12',
      };

      onAddPulse(newPulse);
      setPulseText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const filteredPulses = pulses.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase());
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Main Stream (2 Columns on Desktop) */}
      <div className="lg:col-span-2 space-y-5">
        
        {/* Quick Compose Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
          <form onSubmit={handlePostPulse} className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={
                  currentPersona === 'ghost'
                    ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 mt-1"
              />
              <div className="flex-1">
                <textarea
                  rows={3}
                  value={pulseText}
                  onChange={(e) => setPulseText(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? "What's happening? (Free from algorithmic manipulation, E2EE signed)"
                      : 'क्या विचार है? (एल्गोरिदम से मुक्त, E2EE द्वारा हस्ताक्षरित)'
                  }
                  maxLength={280}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-850 resize-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>AES-256 E2EE</span>
                <span aria-hidden="true">·</span>
                <span className={pulseText.length > 250 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}>
                  {280 - pulseText.length} left
                </span>
              </div>

              <button
                type="submit"
                disabled={isPosting || !pulseText.trim()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>{isPosting ? 'Signing...' : lang === 'en' ? 'Pulse' : 'पल्स भेजें'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Pulses Feed List in Cards */}
        <div className="space-y-4">
          {filteredPulses.map((pulse) => (
            <article
              key={pulse.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5 hover:shadow-md transition-all text-slate-900 dark:text-slate-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={pulse.avatar}
                    alt={pulse.author}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-50">{pulse.author}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{pulse.username}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{pulse.timestamp}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-semibold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        {pulse.encryptionType}
                      </span>
                    </div>
                  </div>
                </div>

                {pulse.verifiedKeyHash && (
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {pulse.verifiedKeyHash}
                  </span>
                )}
              </div>

              {/* Text content */}
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {pulse.content}
              </p>

              {/* Poll Module if Present */}
              {pulse.poll && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5 mb-1">
                    <BarChart2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{pulse.poll.question}</span>
                  </div>

                  <div className="space-y-2">
                    {pulse.poll.options.map((option, optIdx) => {
                      const hasVoted = pulse.poll?.userVotedIndex !== undefined;
                      const isThisVoted = pulse.poll?.userVotedIndex === optIdx;
                      const percentage =
                        pulse.poll && pulse.poll.totalVotes > 0
                          ? Math.round((option.votes / pulse.poll.totalVotes) * 100)
                          : 0;

                      return (
                        <button
                          key={option.text}
                          type="button"
                          disabled={hasVoted}
                          onClick={() => onVotePoll(pulse.id, optIdx)}
                          className={`relative w-full text-left p-2.5 rounded-lg border text-xs font-medium overflow-hidden transition-all ${
                            isThisVoted
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 font-bold'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900'
                          }`}
                        >
                          {/* Percentage progress bar */}
                          {hasVoted && (
                            <div
                              className="absolute inset-y-0 left-0 bg-indigo-100/70 dark:bg-indigo-950/80 transition-all duration-300 ease-out z-0"
                              style={{ width: `${percentage}%` }}
                            />
                          )}

                          <div className="relative z-10 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              {isThisVoted && <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                              <span>{option.text}</span>
                            </span>
                            {hasVoted && (
                              <span className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 font-bold">
                                {percentage}% ({option.votes})
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                    <span>
                      {pulse.poll.totalVotes} {lang === 'en' ? 'zero-knowledge votes' : 'गुप्त वोट'}
                    </span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">ZK-BALLOT VERIFIED</span>
                  </div>
                </div>
              )}

              {/* Tags */}
              {pulse.tags && pulse.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {pulse.tags.map((t) => (
                    <span
                      key={t}
                      onClick={() => setActiveFilter(t === activeFilter ? 'all' : t)}
                      className={`text-xs font-mono font-medium cursor-pointer transition-colors ${
                        activeFilter === t
                          ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 rounded'
                          : 'text-indigo-600 dark:text-indigo-400 hover:underline'
                      }`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions Strip */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => onLikePulse(pulse.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      pulse.userLiked ? 'text-rose-600 dark:text-rose-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${pulse.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{pulse.likes}</span>
                  </button>

                  <button
                    onClick={() => onRepostPulse(pulse.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      pulse.userReposted ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Repeat2 className="w-4 h-4" />
                    <span>{pulse.reposts}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                    <MessageSquare className="w-4 h-4" />
                    <span>{pulse.comments.length}</span>
                  </div>
                </div>

                <button
                  onClick={() => onBookmarkPulse(pulse.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    pulse.userBookmarked ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${pulse.userBookmarked ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400' : ''}`} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Right Column: Trending Hashtags & Topic Radar */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-50 mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{lang === 'en' ? 'Verifiable Trend Cloud' : 'ट्रेंडिंग वाद-विवाद'}</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {TRENDING_TOPICS.map((topic) => (
              <button
                key={topic.tag}
                onClick={() => setActiveFilter(activeFilter === topic.tag ? 'all' : topic.tag)}
                className="w-full py-2.5 text-left flex items-center justify-between group"
              >
                <div>
                  <div className={`text-xs font-mono font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
                    activeFilter === topic.tag ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    #{topic.tag}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{topic.postsCount} pulses</div>
                </div>
                {activeFilter === topic.tag && (
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded font-bold">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="w-full mt-3 py-1.5 text-center text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors font-medium"
            >
              {lang === 'en' ? 'Clear Trend Filter' : 'फ़िल्टर हटाएं'}
            </button>
          )}
        </div>

        {/* Privacy Note */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-300 space-y-2 shadow-xs transition-colors">
          <div className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? 'Pure Chronological Flow' : 'शुद्ध कालानुक्रमिक पल्स'}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {lang === 'en'
              ? 'Unlike X or Meta, Aura never downranks opinions or amplifies rage. Every pulse arrives ordered by cryptographic timestamp.'
              : 'X या फेसबुक के विपरीत, ऑरा किसी भी विचार को एल्गोरिदम द्वारा दबाता या भड़काता नहीं है।'}
          </p>
        </div>
      </div>

    </div>
  );
};
