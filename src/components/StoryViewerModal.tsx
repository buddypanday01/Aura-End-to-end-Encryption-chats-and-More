import React, { useState, useEffect } from 'react';
import { Story } from '../types';
import { X, ChevronLeft, ChevronRight, Shield, Flame, Heart, ThumbsUp, EyeOff } from 'lucide-react';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'hi';
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  lang,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string }[]>([]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentIndex, stories.length, onClose]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const addReaction = (emoji: string) => {
    const newId = Date.now();
    setReactions((prev) => [...prev, { id: newId, emoji }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newId));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
      {/* Container - constrained like vertical story viewport */}
      <div className="relative w-full max-w-md h-[92vh] max-h-[820px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-800">
        
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Story Header */}
        <div className="absolute top-7 left-3 right-3 z-30 flex items-center justify-between text-white drop-shadow">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.avatar}
              alt={currentStory.author}
              className="w-8 h-8 rounded-full border border-cyan-400 object-cover"
            />
            <div>
              <div className="text-xs font-bold leading-none">{currentStory.author}</div>
              <div className="text-[10px] text-slate-300 mt-0.5">{currentStory.timestamp}</div>
            </div>
            {currentStory.isSnapPeek && (
              <span className="text-[9px] font-mono bg-amber-500/80 text-black px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                <EyeOff className="w-2.5 h-2.5" />
                PEEK ONCE
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Media */}
        <div
          className="relative flex-1 bg-black flex items-center justify-center cursor-pointer select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.caption}
            className="w-full h-full object-cover"
          />

          {/* Navigation Tap Zones */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-16 bottom-20 w-1/4 z-20 flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-16 bottom-20 w-1/4 z-20 flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          {/* Floating Reaction Emojis */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40 overflow-hidden">
            {reactions.map((r) => (
              <div
                key={r.id}
                className="text-5xl animate-bounce"
                style={{
                  animationDuration: '1.2s',
                  transform: 'scale(1.5)',
                }}
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Scrim Overlay & Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
            <p className="text-sm text-white font-medium mb-3">
              {currentStory.caption}
            </p>

            {/* Encrypted Reaction Drawer */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 text-xs text-white/80 border border-white/20 flex items-center justify-between">
                <span>{lang === 'en' ? 'Encrypted reply...' : 'गुप्त उत्तर भेजें...'}</span>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <button
                onClick={() => addReaction('❤️')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-rose-400 transition-transform active:scale-90"
              >
                <Heart className="w-4 h-4 fill-rose-400" />
              </button>
              <button
                onClick={() => addReaction('🔥')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-400 transition-transform active:scale-90"
              >
                <Flame className="w-4 h-4 fill-amber-400" />
              </button>
              <button
                onClick={() => addReaction('🛡️')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-cyan-400 transition-transform active:scale-90"
              >
                <Shield className="w-4 h-4" />
              </button>
              <button
                onClick={() => addReaction('👏')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-emerald-400 transition-transform active:scale-90"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
