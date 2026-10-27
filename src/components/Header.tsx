import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TabType, PersonaType, Post, Conversation, ProConnection } from '../types';
import { translations } from '../utils/translations';
import {
  Shield,
  Lock,
  Plus,
  Sparkles,
  Briefcase,
  EyeOff,
  Globe,
  Search,
  X,
  MessageSquare,
  FileText,
  User,
  ChevronRight,
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react';

export type SearchCategory = 'all' | 'connections' | 'posts' | 'conversations';

export interface SearchResultItem {
  id: string;
  type: 'connection' | 'post' | 'pulse' | 'conversation';
  title: string;
  subtitle: string;
  meta?: string;
  avatar?: string;
  mediaUrl?: string;
  badge?: string;
  tags?: string[];
}

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentPersona: PersonaType;
  setCurrentPersona: (persona: PersonaType) => void;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  onOpenPrivacyShield: () => void;
  onOpenCreatePost: () => void;
  unreadChatCount: number;
  posts: Post[];
  pulses: Post[];
  conversations: Conversation[];
  proConnections: ProConnection[];
  onSelectSearchResult: (type: 'connection' | 'post' | 'pulse' | 'conversation', id: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentPersona,
  setCurrentPersona,
  lang,
  setLang,
  onOpenPrivacyShield,
  onOpenCreatePost,
  unreadChatCount,
  posts,
  pulses,
  conversations,
  proConnections,
  onSelectSearchResult,
  darkMode,
  onToggleDarkMode,
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('all');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K or / to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
        setMobileSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const personaConfig: Record<PersonaType, { label: string; icon: React.ReactNode; color: string }> = {
    social: {
      label: t.personaSocial,
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
      color: 'border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60',
    },
    pro: {
      label: t.personaPro,
      icon: <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      color: 'border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60',
    },
    ghost: {
      label: t.personaGhost,
      icon: <EyeOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      color: 'border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60',
    },
  };

  // Filtered Global Search Results across Connections, Posts, Pulses, and Conversations
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // 1. Search Pro Connections
    proConnections.forEach((conn) => {
      const matchName = conn.name.toLowerCase().includes(q);
      const matchTitle = conn.title.toLowerCase().includes(q);
      const matchOrg = conn.organization.toLowerCase().includes(q);
      const matchSkill = conn.verifiedSkills.some((s) => s.toLowerCase().includes(q));

      if (matchName || matchTitle || matchOrg || matchSkill) {
        results.push({
          id: conn.id,
          type: 'connection',
          title: conn.name,
          subtitle: `${conn.title} · ${conn.organization}`,
          meta: conn.isStealth ? 'Stealth Match' : 'Verified Pro',
          avatar: conn.avatar,
          badge: 'Connection',
          tags: conn.verifiedSkills,
        });
      }
    });

    // 2. Search Feed Posts
    posts.forEach((post) => {
      const matchAuthor = post.author.toLowerCase().includes(q) || post.username.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTags = post.tags.some((tag) => tag.toLowerCase().includes(q) || `#${tag.toLowerCase()}`.includes(q));

      if (matchAuthor || matchContent || matchTags) {
        results.push({
          id: post.id,
          type: 'post',
          title: post.author,
          subtitle: post.content.length > 80 ? post.content.slice(0, 80) + '...' : post.content,
          meta: post.timestamp,
          avatar: post.avatar,
          mediaUrl: post.mediaUrl,
          badge: post.encryptionType === 'Zero-Knowledge' ? 'ZK Post' : 'Feed Post',
          tags: post.tags,
        });
      }
    });

    // 3. Search Pulse Debates
    pulses.forEach((pulse) => {
      const matchAuthor = pulse.author.toLowerCase().includes(q) || pulse.username.toLowerCase().includes(q);
      const matchContent = pulse.content.toLowerCase().includes(q);
      const matchTags = pulse.tags.some((tag) => tag.toLowerCase().includes(q) || `#${tag.toLowerCase()}`.includes(q));
      const matchPoll = pulse.poll?.question.toLowerCase().includes(q);

      if (matchAuthor || matchContent || matchTags || matchPoll) {
        results.push({
          id: pulse.id,
          type: 'pulse',
          title: pulse.author,
          subtitle: pulse.content.length > 80 ? pulse.content.slice(0, 80) + '...' : pulse.content,
          meta: pulse.poll ? 'Live ZK Poll' : pulse.timestamp,
          avatar: pulse.avatar,
          badge: 'Pulse Debate',
          tags: pulse.tags,
        });
      }
    });

    // 4. Search Conversations & Channels
    conversations.forEach((conv) => {
      const matchName = conv.name.toLowerCase().includes(q);
      const matchLastMsg = conv.lastMessage.toLowerCase().includes(q);
      const matchAlgo = conv.encryptionAlgorithm.toLowerCase().includes(q);

      if (matchName || matchLastMsg || matchAlgo) {
        results.push({
          id: conv.id,
          type: 'conversation',
          title: conv.name,
          subtitle: conv.lastMessage,
          meta: conv.isChannel ? `${conv.memberCount?.toLocaleString()} subscribers` : conv.timestamp,
          avatar: conv.avatar,
          badge: conv.isChannel ? 'Channel' : 'Vault Chat',
        });
      }
    });

    return results;
  }, [searchQuery, proConnections, posts, pulses, conversations]);

  // Filtered by selected Category Tab
  const categoryFilteredResults = useMemo(() => {
    if (searchCategory === 'all') return searchResults;
    if (searchCategory === 'connections') return searchResults.filter((r) => r.type === 'connection');
    if (searchCategory === 'posts') return searchResults.filter((r) => r.type === 'post' || r.type === 'pulse');
    if (searchCategory === 'conversations') return searchResults.filter((r) => r.type === 'conversation');
    return searchResults;
  }, [searchResults, searchCategory]);

  const counts = useMemo(() => {
    const connCount = searchResults.filter((r) => r.type === 'connection').length;
    const postCount = searchResults.filter((r) => r.type === 'post' || r.type === 'pulse').length;
    const convCount = searchResults.filter((r) => r.type === 'conversation').length;
    return {
      all: searchResults.length,
      connections: connCount,
      posts: postCount,
      conversations: convCount,
    };
  }, [searchResults]);

  const handleSelectResult = (item: SearchResultItem) => {
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
    onSelectSearchResult(item.type, item.id);
  };

  const handleSuggestionClick = (keyword: string) => {
    setSearchQuery(keyword);
    searchInputRef.current?.focus();
  };

  const SUGGESTIONS = [
    { label: 'Elena Vance', category: 'connection' },
    { label: '#ZeroKnowledgeProofs', category: 'tag' },
    { label: 'Dr. Kabir Rao', category: 'connection' },
    { label: 'Aura Privacy Dispatch', category: 'conversation' },
    { label: '#PostQuantumCrypto', category: 'tag' },
    { label: 'Tokyo Twilight', category: 'post' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-6">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap">
              AURA
            </span>
          </button>
        </div>

        {/* Global Search Bar (Center / Desktop & Tablet) */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl pl-9.5 pr-20 py-2 text-xs text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all shadow-2xs font-normal"
            />
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              ) : (
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          {/* Search Dropdown Results Palette */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] flex flex-col text-slate-900 dark:text-slate-50">
              
              {/* Category Segmented Tabs */}
              {searchQuery.trim() && (
                <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-3 shrink-0">
                  <button
                    onClick={() => setSearchCategory('all')}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-colors text-center ${
                      searchCategory === 'all'
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.searchAll} ({counts.all})
                  </button>
                  <button
                    onClick={() => setSearchCategory('connections')}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-colors text-center ${
                      searchCategory === 'connections'
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.searchConnections} ({counts.connections})
                  </button>
                  <button
                    onClick={() => setSearchCategory('posts')}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-colors text-center ${
                      searchCategory === 'posts'
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.searchPosts} ({counts.posts})
                  </button>
                  <button
                    onClick={() => setSearchCategory('conversations')}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-colors text-center ${
                      searchCategory === 'conversations'
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.searchConversations} ({counts.conversations})
                  </button>
                </div>
              )}

              {/* Body: Results or Suggestions */}
              <div className="overflow-y-auto space-y-1 flex-1 pr-0.5">
                {searchQuery.trim() === '' ? (
                  /* Empty state: Suggested Searches */
                  <div className="p-2 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>{t.recentSearches}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTIONS.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleSuggestionClick(item.label)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-200 transition-colors flex items-center gap-1.5"
                        >
                          <Search className="w-3 h-3 text-slate-400" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : categoryFilteredResults.length > 0 ? (
                  categoryFilteredResults.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelectResult(item)}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left flex items-start gap-3 group border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700"
                    >
                      {/* Avatar / Icon Thumbnail */}
                      <div className="relative shrink-0 mt-0.5">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.title}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            {item.type === 'conversation' ? (
                              <MessageSquare className="w-4 h-4" />
                            ) : item.type === 'connection' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                        )}
                        {item.type === 'conversation' && (
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                        )}
                      </div>

                      {/* Content details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 leading-relaxed">
                          {item.subtitle}
                        </p>
                        {item.meta && (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 flex items-center gap-1">
                            <span>{item.meta}</span>
                          </div>
                        )}
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 mt-2.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))
                ) : (
                  /* No Results */
                  <div className="p-6 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{t.noResultsFound}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Try searching by name, role, hashtag (#Quantum, #Tokyo), or channel.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer info strip */}
              <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                <span>E2EE Index · Client-Side Search</span>
                <span>ESC to close</span>
              </div>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          <button
            onClick={() => setActiveTab('feed')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'feed'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50'
            }`}
          >
            {t.feed}
            {activeTab === 'feed' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('pulse')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'pulse'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50'
            }`}
          >
            {t.pulse}
            {activeTab === 'pulse' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50'
            }`}
          >
            <span>{t.chat}</span>
            {unreadChatCount > 0 && (
              <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                {unreadChatCount}
              </span>
            )}
            {activeTab === 'chat' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('snaps')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'snaps'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50'
            }`}
          >
            {t.snaps}
            {activeTab === 'snaps' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'network'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50'
            }`}
          >
            {t.network}
            {activeTab === 'network' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions (Theme Toggle, Language, Privacy Citadel, Persona, New Post) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Mobile Search Trigger Icon */}
          <button
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              if (!mobileSearchOpen) {
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }
            }}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Search network"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User-Selectable Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            title={darkMode ? (lang === 'en' ? 'Switch to Light Mode' : 'लाइट मोड चालू करें') : (lang === 'en' ? 'Switch to Dark Mode' : 'डार्क मोड चालू करें')}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Toggle Language (English / हिंदी)"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Privacy Shield Trigger */}
          <button
            onClick={onOpenPrivacyShield}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-colors shadow-xs"
            title="Open Cryptographic Privacy Citadel"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">E2EE 256-Bit</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shadow-xs ${personaConfig[currentPersona].color}`}
            >
              {personaConfig[currentPersona].icon}
              <span className="hidden sm:inline">{personaConfig[currentPersona].label}</span>
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-900 dark:text-slate-50">
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Persona Enclave
                </div>
                
                <button
                  onClick={() => {
                    setCurrentPersona('social');
                    setShowPersonaMenu(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                    currentPersona === 'social' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-50">{t.personaSocial}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.personaSocialDesc}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCurrentPersona('pro');
                    setShowPersonaMenu(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                    currentPersona === 'pro' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-50">{t.personaPro}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.personaProDesc}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCurrentPersona('ghost');
                    setShowPersonaMenu(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                    currentPersona === 'ghost' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-50">{t.personaGhost}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.personaGhostDesc}</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA: Create Post */}
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.newPost}</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expansion Strip */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              autoFocus
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Search Results */}
          {searchQuery.trim() && (
            <div className="mt-2 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-lg">
              {categoryFilteredResults.length > 0 ? (
                categoryFilteredResults.map((item) => (
                  <button
                    key={`m-${item.type}-${item.id}`}
                    onClick={() => handleSelectResult(item)}
                    className="w-full py-2 px-1 text-left flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-slate-900 dark:text-slate-50">
                      {item.title.slice(0, 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-50 truncate">{item.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {item.badge}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-3 text-center text-xs text-slate-500">{t.noResultsFound}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Tab Bar Header strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 bg-white dark:bg-slate-900 overflow-x-auto">
        <button
          onClick={() => setActiveTab('feed')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
            activeTab === 'feed'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.feed}
        </button>
        <button
          onClick={() => setActiveTab('pulse')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
            activeTab === 'pulse'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.pulse}
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap flex items-center gap-1 transition-colors ${
            activeTab === 'chat'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>{t.chat}</span>
          {unreadChatCount > 0 && (
            <span className="text-[9px] bg-indigo-600 text-white px-1 rounded-full font-bold">
              {unreadChatCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('snaps')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
            activeTab === 'snaps'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.snaps}
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`text-xs px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
            activeTab === 'network'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.network}
        </button>
      </div>
    </header>
  );
};
