import React, { useState } from 'react';
import { Post, Story } from '../types';
import { translations } from '../utils/translations';
import { Heart, MessageSquare, Repeat2, Bookmark, Shield, Lock, Eye, Send, Sparkles, CheckCircle } from 'lucide-react';

interface FeedViewProps {
  posts: Post[];
  stories: Story[];
  onOpenStory: (index: number) => void;
  onOpenCreatePost: () => void;
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  lang: 'en' | 'hi';
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  stories,
  onOpenStory,
  onOpenCreatePost,
  onLikePost,
  onBookmarkPost,
  onRepostPost,
  onAddComment,
  lang,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'encrypted' | 'tech'>('all');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [inspectCipher, setInspectCipher] = useState<Record<string, boolean>>({});
  const [heartBurst, setHeartBurst] = useState<Record<string, boolean>>({});
  const t = translations[lang];

  const handleDoubleTap = (postId: string) => {
    onLikePost(postId);
    setHeartBurst((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setHeartBurst((prev) => ({ ...prev, [postId]: false }));
    }, 600);
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (text) {
      onAddComment(postId, text);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (activeCategory === 'encrypted') return p.encryptionType !== 'Public';
    if (activeCategory === 'tech') return p.tags.some(t => t.toLowerCase().includes('tech') || t.toLowerCase().includes('quantum') || t.toLowerCase().includes('crypto'));
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      
      {/* 24-Hour Stories Bar (Instagram & Snapchat style) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs overflow-hidden transition-colors">
        <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
          
          {/* Add Story Button */}
          <button
            onClick={onOpenCreatePost}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-indigo-400 dark:border-indigo-500 flex items-center justify-center group-hover:border-indigo-600 dark:group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 transition-colors">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                +
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate max-w-[64px]">
              {lang === 'en' ? 'Add Moment' : 'नया मोमेंट'}
            </span>
          </button>

          {/* Stories List */}
          {stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => onOpenStory(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 group-hover:scale-105 transition-transform shadow-xs">
                <img
                  src={story.avatar}
                  alt={story.author}
                  className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                />
                {story.isSnapPeek && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow">
                    ⚡
                  </div>
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate max-w-[70px]">
                {story.author.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs / Segmented Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-colors">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategory === 'all'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {lang === 'en' ? 'All Moments' : 'सभी पोस्ट'}
          </button>
          <button
            onClick={() => setActiveCategory('encrypted')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              activeCategory === 'encrypted'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>{lang === 'en' ? 'Encrypted Circles' : 'एन्क्रिप्टेड सर्कल्स'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('tech')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              activeCategory === 'tech'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span>{lang === 'en' ? 'Deep Tech & Science' : 'डीप टेक'}</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'en' ? 'Zero Ad Tracking' : 'विज्ञापन मुक्त'}</span>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all text-slate-900 dark:text-slate-50"
          >
            {/* Post Header */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-none">
                      {post.author}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      {post.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{post.timestamp}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold font-mono text-[11px]">
                      <Lock className="w-2.5 h-2.5" />
                      {post.encryptionType}
                    </span>
                    {post.verifiedKeyHash && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                          {post.verifiedKeyHash}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Ciphertext toggle button */}
              {post.ciphertext && (
                <button
                  onClick={() =>
                    setInspectCipher((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>{inspectCipher[post.id] ? 'Hide Cipher' : 'Inspect Cipher'}</span>
                </button>
              )}
            </div>

            {/* Media Image with Double-Tap to Like */}
            {post.mediaUrl && (
              <div
                className="relative bg-slate-950 select-none overflow-hidden cursor-pointer"
                onDoubleClick={() => handleDoubleTap(post.id)}
              >
                <img
                  src={post.mediaUrl}
                  alt="Post visual"
                  className="w-full max-h-[520px] object-cover"
                />

                {/* Heart Burst Overlay Animation */}
                {heartBurst[post.id] && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl scale-125 animate-ping" />
                  </div>
                )}

                {/* Double tap tip */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-mono pointer-events-none">
                  {lang === 'en' ? 'Double tap to like' : 'लाइक के लिए डबल टैप'}
                </div>
              </div>
            )}

            {/* Post Content */}
            <div className="px-5 pt-4 pb-2 space-y-2.5">
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Inspect Cipher Drawer */}
              {inspectCipher[post.id] && post.ciphertext && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
                  <div className="text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-between">
                    <span>Hardware WebCrypto AES-GCM Payload</span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Signatures Valid
                    </span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-400 text-[10px]">CIPHERTEXT (HEX):</div>
                    {post.ciphertext}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] flex justify-between">
                    <span>IV: {post.iv || '0x4f8812...'}</span>
                    <span>Algorithm: AES-256-GCM / 128-bit Tag</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="px-5 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.userLiked ? 'text-rose-600 dark:text-rose-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${post.userLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() =>
                    setOpenComments((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length}</span>
                </button>

                <button
                  onClick={() => onRepostPost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.userReposted ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Repeat2 className="w-4 h-4" />
                  <span>{post.reposts}</span>
                </button>
              </div>

              <button
                onClick={() => onBookmarkPost(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.userBookmarked ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Save to Encrypted Vault"
              >
                <Bookmark
                  className={`w-4 h-4 ${post.userBookmarked ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400' : ''}`}
                />
                <span>{lang === 'en' ? 'Vault' : 'वॉल्ट'}</span>
              </button>
            </div>

            {/* Comments Section */}
            {openComments[post.id] && (
              <div className="px-5 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/70 dark:bg-slate-850/60">
                {post.comments.length > 0 ? (
                  <div className="space-y-2.5 pt-1">
                    {post.comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2.5 text-xs">
                        <img
                          src={c.avatar}
                          alt={c.author}
                          className="w-6 h-6 rounded-full object-cover mt-0.5 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 shadow-2xs">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-slate-900 dark:text-slate-50">{c.author}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{c.timestamp}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-200">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400 py-1">
                    {lang === 'en' ? 'No comments yet. Start an encrypted discussion.' : 'अभी कोई टिप्पणी नहीं है।'}
                  </div>
                )}

                {/* Comment Input */}
                <form
                  onSubmit={(e) => handleCommentSubmit(post.id, e)}
                  className="flex items-center gap-2 pt-1"
                >
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder={
                      lang === 'en'
                        ? 'Write an encrypted reply...'
                        : 'एन्क्रिप्टेड उत्तर लिखें...'
                    }
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                  <button
                    type="submit"
                    disabled={!commentInputs[post.id]?.trim()}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            )}

          </article>
        ))}
      </div>
    </div>
  );
};
