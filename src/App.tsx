/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, PersonaType, Post, Story, Conversation, Message, SnapItem, ProConnection } from './types';
import { Header } from './components/Header';
import { FeedView } from './components/FeedView';
import { PulseView } from './components/PulseView';
import { VaultChatView } from './components/VaultChatView';
import { SnapsView } from './components/SnapsView';
import { NetworkView } from './components/NetworkView';
import { PrivacyShieldModal } from './components/PrivacyShieldModal';
import { CreatePostModal } from './components/CreatePostModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { SafetyNumberModal } from './components/SafetyNumberModal';
import {
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_PULSES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_SNAPS,
  INITIAL_PRO_CONNECTIONS,
} from './data/mockData';
import { Sparkles, MessageSquare, Flame, Briefcase, Zap } from 'lucide-react';
import { generateSessionKey, encryptText } from './utils/crypto';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('social');
  const [lang, setLang] = useState<'en' | 'hi'>('hi');

  // Datasets
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories] = useState<Story[]>(INITIAL_STORIES);
  const [pulses, setPulses] = useState<Post[]>(INITIAL_PULSES);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [snaps, setSnaps] = useState<SnapItem[]>(INITIAL_SNAPS);
  const [proConnections, setProConnections] = useState<ProConnection[]>(INITIAL_PRO_CONNECTIONS);

  // Active sub-states
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [safetyConv, setSafetyConv] = useState<Conversation | null>(null);

  // Modals
  const [isPrivacyShieldOpen, setIsPrivacyShieldOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Unread chat count
  const unreadChatCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Dark mode state with persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('aura_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('aura_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('aura_theme', 'light');
    }
  }, [darkMode]);

  // Feed Actions - Instant optimistic update
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.userLiked;
          return {
            ...p,
            userLiked: isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isBookmarked = !p.userBookmarked;
          return {
            ...p,
            userBookmarked: isBookmarked,
            bookmarks: isBookmarked ? p.bookmarks + 1 : Math.max(0, p.bookmarks - 1),
          };
        }
        return p;
      })
    );
  };

  const handleRepostPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isReposted = !p.userReposted;
          return {
            ...p,
            userReposted: isReposted,
            reposts: isReposted ? p.reposts + 1 : Math.max(0, p.reposts - 1),
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: 'c-' + Date.now(),
            author: currentPersona === 'ghost' ? 'Anonymous 0x' : 'Elena Vance',
            avatar: currentPersona === 'ghost'
              ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            timestamp: 'Just now',
            content: text,
            isEncrypted: true,
          };
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  // Pulse Actions
  const handleAddPulse = (newPulse: Post) => {
    setPulses([newPulse, ...pulses]);
  };

  const handleLikePulse = (pulseId: string) => {
    setPulses((prev) =>
      prev.map((p) => {
        if (p.id === pulseId) {
          const isLiked = !p.userLiked;
          return {
            ...p,
            userLiked: isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handleBookmarkPulse = (pulseId: string) => {
    setPulses((prev) =>
      prev.map((p) => {
        if (p.id === pulseId) {
          return { ...p, userBookmarked: !p.userBookmarked };
        }
        return p;
      })
    );
  };

  const handleRepostPulse = (pulseId: string) => {
    setPulses((prev) =>
      prev.map((p) => {
        if (p.id === pulseId) {
          const isReposted = !p.userReposted;
          return {
            ...p,
            userReposted: isReposted,
            reposts: isReposted ? p.reposts + 1 : Math.max(0, p.reposts - 1),
          };
        }
        return p;
      })
    );
  };

  const handleVotePoll = (pulseId: string, optionIndex: number) => {
    setPulses((prev) =>
      prev.map((p) => {
        if (p.id === pulseId && p.poll && p.poll.userVotedIndex === undefined) {
          const updatedOptions = p.poll.options.map((opt, i) =>
            i === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...p,
            poll: {
              ...p.poll,
              options: updatedOptions,
              totalVotes: p.poll.totalVotes + 1,
              userVotedIndex: optionIndex,
            },
          };
        }
        return p;
      })
    );
  };

  // Chat Actions with Super Quick Response Simulator
  const handleSendMessage = async (convId: string, text: string, isDisappearing: boolean) => {
    // 1. Optimistically encrypt and add user's message immediately (Zero Lag)
    const key = await generateSessionKey();
    const enc = await encryptText(text, key);

    const newMsg: Message = {
      id: 'm-' + Date.now(),
      conversationId: convId,
      senderId: 'me',
      senderName: currentPersona === 'ghost' ? '0xGhost' : 'You',
      senderAvatar: currentPersona === 'ghost'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plaintext: text,
      ciphertext: enc.ciphertext,
      iv: enc.iv,
      timestamp: 'Just now',
      isMine: true,
      status: 'read',
      isDisappearing: isDisappearing,
      ephemeralSeconds: isDisappearing ? 10 : undefined,
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: text,
              timestamp: 'Just now',
              unreadCount: 0,
            }
          : c
      )
    );

    // 2. Quick Response Simulator (450ms) for ultra-fast, snappy interaction!
    const partner = conversations.find(c => c.id === convId);
    if (partner && !partner.isChannel) {
      setTimeout(async () => {
        const replyResponses = [
          'Encrypted packet received & verified via AES-256 enclave.',
          'Got it! Safety fingerprint confirmed matching.',
          'Clear! Signal ratchet stepped forward securely.',
          'Acknowledged. Disappearing timer active on this thread.',
        ];
        const randomReply = replyResponses[Math.floor(Math.random() * replyResponses.length)];
        const replyEnc = await encryptText(randomReply, key);

        const replyMsg: Message = {
          id: 'reply-' + Date.now(),
          conversationId: convId,
          senderId: partner.id,
          senderName: partner.name,
          senderAvatar: partner.avatar,
          plaintext: randomReply,
          ciphertext: replyEnc.ciphertext,
          iv: replyEnc.iv,
          timestamp: 'Just now',
          isMine: false,
          status: 'read',
          isDisappearing: isDisappearing,
          ephemeralSeconds: isDisappearing ? 10 : undefined,
        };

        setMessages((prev) => ({
          ...prev,
          [convId]: [...(prev[convId] || []), replyMsg],
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  lastMessage: randomReply,
                  timestamp: 'Just now',
                }
              : c
          )
        );
      }, 450);
    }
  };

  // Snaps Actions
  const handleBurnSnap = (snapId: string) => {
    setSnaps((prev) =>
      prev.map((s) => (s.id === snapId ? { ...s, isBurned: true, hasPeeked: true } : s))
    );
  };

  const handleSendNewSnap = (caption: string, mediaUrl: string) => {
    const newSnap: SnapItem = {
      id: 'snap-' + Date.now(),
      sender: currentPersona === 'ghost' ? 'Ghost Enclave' : 'Elena Vance',
      avatar: currentPersona === 'ghost'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      mediaUrl,
      caption,
      peekTimer: 10,
      hasPeeked: false,
      isBurned: false,
    };
    setSnaps([newSnap, ...snaps]);
  };

  // Pro Network Actions
  const handleToggleConnect = (id: string) => {
    setProConnections((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: c.status === 'connect' ? 'pending' : c.status === 'pending' ? 'connected' : 'connected',
          };
        }
        return c;
      })
    );
  };

  const handleAddPost = (post: Post) => {
    if (post.poll) {
      setPulses([post, ...pulses]);
      setActiveTab('pulse');
    } else if (post.ephemeralSeconds) {
      handleSendNewSnap(post.content, post.mediaUrl || '/src/assets/images/snap_ephemeral_sunset_1792765407413.jpg');
      setActiveTab('snaps');
    } else {
      setPosts([post, ...posts]);
      setActiveTab('feed');
    }
  };

  const handleSelectSearchResult = (
    type: 'connection' | 'post' | 'pulse' | 'conversation',
    id: string
  ) => {
    if (type === 'conversation') {
      setActiveConvId(id);
      setActiveTab('chat');
    } else if (type === 'connection') {
      setActiveTab('network');
    } else if (type === 'post') {
      setActiveTab('feed');
    } else if (type === 'pulse') {
      setActiveTab('pulse');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-50' : 'bg-slate-50 text-slate-900'} flex flex-col pb-20 md:pb-6 transition-colors duration-200`}>
      
      {/* Top Header with Global Search and Theme Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        lang={lang}
        setLang={setLang}
        onOpenPrivacyShield={() => setIsPrivacyShieldOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        unreadChatCount={unreadChatCount}
        posts={posts}
        pulses={pulses}
        conversations={conversations}
        proConnections={proConnections}
        onSelectSearchResult={handleSelectSearchResult}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'feed' && (
          <FeedView
            posts={posts}
            stories={stories}
            onOpenStory={(idx) => setActiveStoryIndex(idx)}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onLikePost={handleLikePost}
            onBookmarkPost={handleBookmarkPost}
            onRepostPost={handleRepostPost}
            onAddComment={handleAddComment}
            lang={lang}
          />
        )}

        {activeTab === 'pulse' && (
          <PulseView
            pulses={pulses}
            onAddPulse={handleAddPulse}
            onLikePulse={handleLikePulse}
            onBookmarkPulse={handleBookmarkPulse}
            onRepostPulse={handleRepostPulse}
            onVotePoll={handleVotePoll}
            currentPersona={currentPersona}
            lang={lang}
          />
        )}

        {activeTab === 'chat' && (
          <VaultChatView
            conversations={conversations}
            messages={messages}
            activeConvId={activeConvId}
            setActiveConvId={setActiveConvId}
            onSendMessage={handleSendMessage}
            onOpenSafetyNumber={(c) => setSafetyConv(c)}
            lang={lang}
          />
        )}

        {activeTab === 'snaps' && (
          <SnapsView
            snaps={snaps}
            onBurnSnap={handleBurnSnap}
            onSendNewSnap={handleSendNewSnap}
            lang={lang}
          />
        )}

        {activeTab === 'network' && (
          <NetworkView
            connections={proConnections}
            onToggleConnect={handleToggleConnect}
            lang={lang}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Nav Bar with Dark Theme */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 items-center h-16 shadow-lg">
        <button
          onClick={() => setActiveTab('feed')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'feed' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('pulse')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'pulse' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Pulse</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
            activeTab === 'chat' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {unreadChatCount > 0 && (
            <span className="absolute top-2 right-5 w-2 h-2 rounded-full bg-indigo-600" />
          )}
          <span className="text-[10px] mt-0.5">Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('snaps')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'snaps' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Snaps</span>
        </button>

        <button
          onClick={() => setActiveTab('network')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'network' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Pro</span>
        </button>
      </nav>

      {/* Modals */}
      <PrivacyShieldModal
        isOpen={isPrivacyShieldOpen}
        onClose={() => setIsPrivacyShieldOpen(false)}
        lang={lang}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onAddPost={handleAddPost}
        currentPersona={currentPersona}
        lang={lang}
      />

      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          isOpen={activeStoryIndex !== null}
          onClose={() => setActiveStoryIndex(null)}
          lang={lang}
        />
      )}

      <SafetyNumberModal
        conversation={safetyConv}
        isOpen={safetyConv !== null}
        onClose={() => setSafetyConv(null)}
        lang={lang}
      />

    </div>
  );
}
