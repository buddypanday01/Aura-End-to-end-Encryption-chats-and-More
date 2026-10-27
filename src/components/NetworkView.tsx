import React, { useState } from 'react';
import { ProConnection } from '../types';
import { Briefcase, ShieldCheck, Check, UserPlus, Award, Lock, ExternalLink, Sparkles } from 'lucide-react';
import { ConnectionGrowthChart } from './ConnectionGrowthChart';

interface NetworkViewProps {
  connections: ProConnection[];
  onToggleConnect: (id: string) => void;
  lang: 'en' | 'hi';
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  connections,
  onToggleConnect,
  lang,
}) => {
  const [stealthRadarActive, setStealthRadarActive] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Professional Header & Stealth Mode Banner */}
      <div className="bg-gradient-to-r from-white via-indigo-50/40 to-blue-50/50 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/40 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
                {lang === 'en' ? 'Aura Pro Radar & Stealth Network' : 'प्रो रडार और स्टील्थ नेटवर्क'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              {lang === 'en'
                ? 'Zero spam inMails, zero public recruiter surveillance. Connect through zero-knowledge skill verification and mutual encrypted handshakes.'
                : 'लिंक्डइन जैसा नेटवर्क लेकिन बिना स्पैम और प्राइवेसी खतरे के। केवल सत्यापित कौशल और आपसी सहमति से जुड़ें।'}
            </p>
          </div>

          {/* Stealth Radar Toggle */}
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-2xs">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Stealth Radar</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {stealthRadarActive ? 'Identity masked until mutual match' : 'Public Profile'}
              </div>
            </div>
            <button
              onClick={() => setStealthRadarActive(!stealthRadarActive)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                stealthRadarActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  stealthRadarActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Your Verified Credentials Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Elena"
              className="w-12 h-12 rounded-xl object-cover border border-indigo-300 dark:border-indigo-700 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">Elena Vance</h3>
                <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-700 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  VERIFIED ARCHITECT
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Founding Lead · Distributed Systems & Zero-Knowledge Architecture
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right font-mono text-[11px] text-slate-400 dark:text-slate-500">
            <div>CREDENTIAL: 0x9A4E...F182</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-bold">ALL 5 SIGNATURES MATCHED</div>
          </div>
        </div>

        {/* Cryptographic Skills Matrix */}
        <div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'en' ? 'Cryptographically Verified Skills' : 'सत्यापित कौशल प्रमाण'}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { skill: 'Zero-Knowledge Proofs (zk-SNARKs)', endorsements: 42 },
              { skill: 'Post-Quantum AES-GCM & Kyber', endorsements: 38 },
              { skill: 'WebCrypto Hardware Enclaves', endorsements: 64 },
              { skill: 'Distributed Consensus & Rust', endorsements: 29 },
            ].map((item) => (
              <div
                key={item.skill}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold">{item.skill}</span>
                <span className="font-mono text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded">
                  +{item.endorsements}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Professional Connection Growth Visualization */}
      <ConnectionGrowthChart lang={lang} />

      {/* Recommended Collaborators & Stealth Matches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{lang === 'en' ? 'Verified Stealth Connections' : 'सत्यापित संपर्क'}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {connections.length} {lang === 'en' ? 'matches on radar' : 'मैच उपलब्ध'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {connections.map((conn) => {
            const isConnected = conn.status === 'connected';
            const isPending = conn.status === 'pending';

            return (
              <div
                key={conn.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <img
                      src={conn.avatar}
                      alt={conn.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                    />
                    {conn.isStealth ? (
                      <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-700 font-bold">
                        STEALTH
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700 font-bold">
                        VERIFIED
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1">
                    {conn.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {conn.title} · {conn.organization}
                  </p>

                  <div className="mt-3 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">VERIFIED SKILLS:</div>
                    <div className="flex flex-wrap gap-1">
                      {conn.verifiedSkills.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 truncate max-w-[160px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-2">
                    {conn.mutualEncryptedMatches} mutual cipher handshakes
                  </div>

                  <button
                    onClick={() => onToggleConnect(conn.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer ${
                      isConnected
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        : isPending
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Connected</span>
                      </>
                    ) : isPending ? (
                      <span>Handshake Pending...</span>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Stealth Handshake</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proof of Work Showcase */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{lang === 'en' ? 'Cryptographic Proof-of-Work Repositories' : 'प्रमाणित कार्य रिपॉजिटरी'}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">IMMUTABLE GIT COMMIT HASHES</span>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">libaura-enclave-crypto</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Zero-knowledge threshold signatures and oblivious transfer library in WebAssembly.
              </div>
            </div>
            <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 cursor-pointer">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">q-lattice-error-mitigation</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Noise reduction simulator for post-quantum key encapsulation mechanisms.
              </div>
            </div>
            <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 cursor-pointer">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
