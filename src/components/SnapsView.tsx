import React, { useState, useEffect } from 'react';
import { SnapItem } from '../types';
import { Eye, Flame, ShieldAlert, Sparkles, X, Camera, Lock, CheckCircle2 } from 'lucide-react';

interface SnapsViewProps {
  snaps: SnapItem[];
  onBurnSnap: (snapId: string) => void;
  onSendNewSnap: (caption: string, mediaUrl: string) => void;
  lang: 'en' | 'hi';
}

export const SnapsView: React.FC<SnapsViewProps> = ({
  snaps,
  onBurnSnap,
  onSendNewSnap,
  lang,
}) => {
  const [activePeekSnap, setActivePeekSnap] = useState<SnapItem | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [screenshotAlert, setScreenshotAlert] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [privacyBlurActive, setPrivacyBlurActive] = useState(false);
  const [newSnapCaption, setNewSnapCaption] = useState('');

  // Countdown timer for active peek snap
  useEffect(() => {
    if (!activePeekSnap) return;

    setRemainingSeconds(activePeekSnap.peekTimer || 10);
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onBurnSnap(activePeekSnap.id);
          setActivePeekSnap(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activePeekSnap]);

  // Anti-screenshot detector simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        triggerScreenshotAlarm();
      }
    };
    window.addEventListener('keyup', handleKeyDown);
    return () => window.removeEventListener('keyup', handleKeyDown);
  }, []);

  const triggerScreenshotAlarm = () => {
    setScreenshotAlert(true);
    setTimeout(() => setScreenshotAlert(false), 3000);
  };

  const handleStartPeek = (snap: SnapItem) => {
    if (snap.isBurned) return;
    setActivePeekSnap(snap);
  };

  const handleClosePeek = () => {
    if (activePeekSnap) {
      onBurnSnap(activePeekSnap.id);
      setActivePeekSnap(null);
    }
  };

  const handleCaptureSnap = () => {
    onSendNewSnap(
      newSnapCaption || 'Ephemeral memory with zero trace',
      '/src/assets/images/snap_ephemeral_sunset_1792765407413.jpg'
    );
    setShowCameraModal(false);
    setNewSnapCaption('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Screenshot Warning Alert Banner */}
      {screenshotAlert && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center justify-between text-rose-900 shadow-md animate-bounce">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <div className="text-xs font-bold">
                {lang === 'en' ? 'Screenshot Attempt Blocked!' : 'स्क्रीनशॉट सुरक्षा सक्रिय!'}
              </div>
              <div className="text-[11px] text-rose-700">
                {lang === 'en'
                  ? 'Aura anti-leak shield deflected screen recording and notified the snap sender.'
                  : 'ऑरा एंटी-लीक शील्ड ने स्क्रीनशॉट को रोक दिया और प्रेषक को सूचित कर दिया।'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setScreenshotAlert(false)}
            className="text-xs px-2.5 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Bar in Clean White / Dark */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <span>{lang === 'en' ? 'Ephemeral Snaps Vault' : 'गायब होने वाले स्नैप्स'}</span>
            <span className="text-xs font-mono text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 font-bold">
              DISAPPEARING MEDIA
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            {lang === 'en'
              ? 'Self-destructs upon view. Immune to device backups and server indexing.'
              : 'देखने के तुरंत बाद नष्ट। सर्वर या बैकअप में कोई निशान नहीं रहता।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Test Screenshot Alarm button */}
          <button
            onClick={triggerScreenshotAlarm}
            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Test Anti-Screenshot Alarm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="hidden sm:inline">Test Screenshot Shield</span>
          </button>

          {/* New Snap Button */}
          <button
            onClick={() => setShowCameraModal(true)}
            className="px-3.5 py-1.5 bg-amber-500 text-white font-bold text-xs rounded-lg hover:bg-amber-600 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'New Snap' : 'नया स्नैप'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Snaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {snaps.map((snap) => (
          <div
            key={snap.id}
            className={`relative rounded-2xl border overflow-hidden p-4 flex flex-col justify-between min-h-[260px] transition-all ${
              snap.isBurned
                ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md'
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={snap.avatar}
                  alt={snap.sender}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{snap.sender}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{snap.timestamp}</div>
                </div>
              </div>

              {snap.isBurned ? (
                <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-700 flex items-center gap-1 font-bold">
                  <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                  BURNED
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700 flex items-center gap-1 font-bold">
                  <Eye className="w-3 h-3" />
                  {snap.peekTimer}s PEEK
                </span>
              )}
            </div>

            {/* Center Area: Blurred Thumbnail or Burned Ashes */}
            <div className="my-4 relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-950 flex items-center justify-center">
              {snap.isBurned ? (
                <div className="text-center p-4 space-y-1 text-slate-400 bg-slate-100 dark:bg-slate-800 w-full h-full flex flex-col items-center justify-center">
                  <Flame className="w-8 h-8 text-rose-400 mx-auto" />
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Memory Disintegrated</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Zero fragments remain in local cache</div>
                </div>
              ) : (
                <>
                  <img
                    src={snap.mediaUrl}
                    alt="Encrypted snap"
                    className="w-full h-full object-cover filter blur-xl scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
                    <Lock className="w-6 h-6 text-amber-300 mb-1" />
                    <span className="text-xs font-bold text-white">Tap to Peek ({snap.peekTimer}s)</span>
                    <span className="text-[10px] text-slate-200 mt-0.5">Burns permanently upon view</span>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Button */}
            {!snap.isBurned ? (
              <button
                onClick={() => handleStartPeek(snap)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Open Ephemeral Snap' : 'स्नैप देखें (एक बार)'}</span>
              </button>
            ) : (
              <div className="text-center text-[11px] font-mono text-slate-400 dark:text-slate-500 font-medium">
                Destroyed at recipient request
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Peek Fullscreen View with Countdown Ring */}
      {activePeekSnap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="relative w-full max-w-sm h-[85vh] max-h-[700px] bg-slate-950 rounded-2xl overflow-hidden border border-amber-400/40 flex flex-col shadow-2xl">
            
            {/* Top Bar with Countdown Ring */}
            <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <img
                  src={activePeekSnap.avatar}
                  alt={activePeekSnap.sender}
                  className="w-8 h-8 rounded-full object-cover border border-amber-400"
                />
                <span className="text-xs font-bold">{activePeekSnap.sender}</span>
              </div>

              {/* Countdown badge */}
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                {remainingSeconds}s
              </div>

              <button
                onClick={handleClosePeek}
                className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Image */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePeekSnap.mediaUrl}
                alt="Peek visual"
                className="w-full h-full object-cover"
              />

              {/* Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/70 backdrop-blur-md rounded-xl text-white text-xs border border-white/10">
                <p className="font-medium">{activePeekSnap.caption}</p>
                <div className="text-[10px] text-amber-300 font-mono mt-1 flex items-center gap-1 font-bold">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Will disintegrate when timer hits zero</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Snap Camera Simulator Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-slate-900 dark:text-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" />
                <span>{lang === 'en' ? 'Compose Disappearing Snap' : 'नया स्नैप बनाएं'}</span>
              </h3>
              <button
                onClick={() => setShowCameraModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewfinder simulation */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <img
                src="/src/assets/images/snap_ephemeral_sunset_1792765407413.jpg"
                alt="Viewfinder"
                className={`w-full h-full object-cover transition-all ${
                  privacyBlurActive ? 'filter blur-md' : ''
                }`}
              />

              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-mono text-emerald-300 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>EXIF Wiped</span>
              </div>
            </div>

            {/* Privacy Filters Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Privacy Face & Background Blur</span>
              </span>
              <button
                type="button"
                onClick={() => setPrivacyBlurActive(!privacyBlurActive)}
                className={`px-2.5 py-1 rounded font-bold text-[11px] transition-colors cursor-pointer ${
                  privacyBlurActive
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {privacyBlurActive ? 'Enabled' : 'Off'}
              </button>
            </div>

            {/* Caption */}
            <input
              type="text"
              placeholder="Caption (e.g. Sunset horizon peek)..."
              value={newSnapCaption}
              onChange={(e) => setNewSnapCaption(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
            />

            <button
              onClick={handleCaptureSnap}
              className="w-full py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-all shadow-xs cursor-pointer"
            >
              {lang === 'en' ? 'Broadcast 10s Disappearing Snap' : '10 सेकंड का स्नैप भेजें'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
