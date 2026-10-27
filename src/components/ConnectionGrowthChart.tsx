import React, { useState, useMemo } from 'react';
import { TrendingUp, Users, ShieldCheck, Zap, Calendar, ArrowUpRight, Award } from 'lucide-react';

interface DataPoint {
  date: string;
  connections: number;
  newMatches: number;
  milestone?: string;
}

type Timeframe = '1M' | '3M' | '6M' | '1Y' | 'ALL';

const TIMEFRAME_DATA: Record<Timeframe, DataPoint[]> = {
  '1M': [
    { date: 'Oct 01', connections: 1140, newMatches: 12 },
    { date: 'Oct 06', connections: 1162, newMatches: 22, milestone: 'zk-SNARK Key Registry v2' },
    { date: 'Oct 12', connections: 1195, newMatches: 33 },
    { date: 'Oct 17', connections: 1228, newMatches: 33 },
    { date: 'Oct 22', connections: 1256, newMatches: 28, milestone: 'Alps Quantum Enclave Meetup' },
    { date: 'Oct 27', connections: 1284, newMatches: 28 },
  ],
  '3M': [
    { date: 'Aug 01', connections: 920, newMatches: 34 },
    { date: 'Aug 15', connections: 968, newMatches: 48 },
    { date: 'Sep 01', connections: 1040, newMatches: 72, milestone: 'Verified Architect Badges' },
    { date: 'Sep 15', connections: 1105, newMatches: 65 },
    { date: 'Oct 01', connections: 1180, newMatches: 75, milestone: 'Post-Quantum Protocol v4' },
    { date: 'Oct 27', connections: 1284, newMatches: 104 },
  ],
  '6M': [
    { date: 'May', connections: 640, newMatches: 82 },
    { date: 'Jun', connections: 730, newMatches: 90, milestone: 'Zero-Knowledge Radar Launch' },
    { date: 'Jul', connections: 840, newMatches: 110 },
    { date: 'Aug', connections: 980, newMatches: 140 },
    { date: 'Sep', connections: 1120, newMatches: 140, milestone: 'Stealth Handshake Protocol' },
    { date: 'Oct', connections: 1284, newMatches: 164 },
  ],
  '1Y': [
    { date: 'Nov 25', connections: 280, newMatches: 45 },
    { date: 'Jan 26', connections: 410, newMatches: 130 },
    { date: 'Mar 26', connections: 530, newMatches: 120, milestone: 'Aura Cryptographic Genesis' },
    { date: 'May 26', connections: 670, newMatches: 140 },
    { date: 'Jul 26', connections: 860, newMatches: 190, milestone: 'Decentralized Identity Engine' },
    { date: 'Sep 26', connections: 1120, newMatches: 260 },
    { date: 'Oct 26', connections: 1284, newMatches: 164 },
  ],
  'ALL': [
    { date: '2024 Q4', connections: 120, newMatches: 120, milestone: 'Private Enclave Alpha' },
    { date: '2025 Q1', connections: 290, newMatches: 170 },
    { date: '2025 Q2', connections: 480, newMatches: 190 },
    { date: '2025 Q3', connections: 710, newMatches: 230, milestone: 'Zero-Knowledge Proof Cert' },
    { date: '2025 Q4', connections: 940, newMatches: 230 },
    { date: '2026 Q1', connections: 1130, newMatches: 190 },
    { date: '2026 Q4', connections: 1284, newMatches: 154, milestone: 'Aura Pro Radar Mainnet' },
  ],
};

interface ConnectionGrowthChartProps {
  lang: 'en' | 'hi';
}

export const ConnectionGrowthChart: React.FC<ConnectionGrowthChartProps> = ({ lang }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('3M');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = TIMEFRAME_DATA[timeframe];

  // Min and Max values for SVG scaling
  const minConnections = useMemo(() => Math.min(...data.map((d) => d.connections)), [data]);
  const maxConnections = useMemo(() => Math.max(...data.map((d) => d.connections)), [data]);
  
  // Chart dimensions
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Normalized coordinate points
  const points = useMemo(() => {
    const rangeY = maxConnections - minConnections || 1;
    const availableWidth = width - paddingX * 2;
    const availableHeight = height - paddingY * 2;

    return data.map((d, index) => {
      const x = paddingX + (index / (data.length - 1)) * availableWidth;
      const normalizedY = (d.connections - minConnections) / rangeY;
      const y = height - paddingY - normalizedY * availableHeight;
      return { x, y, data: d, index };
    });
  }, [data, minConnections, maxConnections]);

  // Construct SVG Path (Smooth cubic bezier curve)
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((path, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = arr[i - 1];
      const controlX = (prev.x + point.x) / 2;
      return `${path} C ${controlX},${prev.y} ${controlX},${point.y} ${point.x},${point.y}`;
    }, '');
  }, [points]);

  // Construct Area Fill Path (closed at the bottom)
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    return `${linePath} L ${last.x},${height - paddingY} L ${first.x},${height - paddingY} Z`;
  }, [linePath, points]);

  // Active or hovered point
  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  // Calculation of percentage growth in timeframe
  const firstVal = data[0].connections;
  const lastVal = data[data.length - 1].connections;
  const growthPercent = (((lastVal - firstVal) / firstVal) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      
      {/* Top Header & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
              {lang === 'en' ? 'Professional Connection Growth' : 'प्रोफेशनल नेटवर्क विकास चार्ट'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            {lang === 'en'
              ? 'Verifiable peer-to-peer cryptographic handshakes over time'
              : 'समय के साथ एंड-टू-एंड एन्क्रिप्टेड संपर्कों की वृद्धि'}
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          {(['1M', '3M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setHoveredIndex(null);
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors font-mono cursor-pointer ${
                timeframe === tf
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Users className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>{lang === 'en' ? 'Verified Connections' : 'सत्यापित संपर्क'}</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50 font-mono tabular-nums mt-0.5">
            {lastVal.toLocaleString()}
          </div>
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{growthPercent}% ({timeframe})</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? 'Mutual Handshakes' : 'आपसी सहमति'}</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50 font-mono tabular-nums mt-0.5">
            94.8%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'en' ? '0% spam requests' : '0% स्पैम इनमेल्स'}
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>{lang === 'en' ? 'Growth Velocity' : 'विकास दर'}</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50 font-mono tabular-nums mt-0.5">
            +{activePoint ? activePoint.data.newMatches : 28}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            {lang === 'en' ? 'new handshakes/period' : 'नए संबंध/अवधि'}
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Award className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span>{lang === 'en' ? 'Trust Fingerprint' : 'क्रिप्टो ट्रस्ट'}</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-50 font-mono tabular-nums mt-0.5">
            99.9%
          </div>
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono">
            ENCLAVE SIGNED
          </div>
        </div>
      </div>

      {/* Interactive Line Chart Canvas */}
      <div className="relative pt-2">
        
        {/* Floating Active Point Tooltip */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-150 ease-out -translate-x-1/2"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${Math.max(0, (activePoint.y / height) * 100 - 35)}%`,
            }}
          >
            <div className="bg-slate-900 text-white rounded-xl px-3 py-2 shadow-xl border border-slate-700 text-xs min-w-[140px] text-center">
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 font-mono mb-0.5">
                <span>{activePoint.data.date}</span>
                <span className="text-emerald-400 font-bold">+{activePoint.data.newMatches}</span>
              </div>
              <div className="text-sm font-extrabold font-mono text-cyan-300 tabular-nums">
                {activePoint.data.connections.toLocaleString()} Connections
              </div>
              {activePoint.data.milestone && (
                <div className="text-[9px] text-amber-300 font-medium pt-1 border-t border-slate-800 mt-1 flex items-center justify-center gap-1">
                  <span>★</span>
                  <span>{activePoint.data.milestone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SVG Viewport */}
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-48 sm:h-56 select-none overflow-visible"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              {/* Gradient for area fill */}
              <linearGradient id="connectionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4f46e5" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const yPos = height - paddingY - ratio * (height - paddingY * 2);
              const labelVal = Math.round(minConnections + ratio * (maxConnections - minConnections));
              return (
                <g key={ratio}>
                  <line
                    x1={paddingX}
                    y1={yPos}
                    x2={width - paddingX}
                    y2={yPos}
                    className="stroke-slate-200 dark:stroke-slate-700"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={yPos + 3}
                    textAnchor="end"
                    className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono tabular-nums font-semibold"
                  >
                    {labelVal}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#connectionGradient)" />

            {/* Main Smooth Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lineGlow)"
            />

            {/* Vertical crosshair line for hovered item */}
            {hoveredIndex !== null && (
              <line
                x1={points[hoveredIndex].x}
                y1={paddingY}
                x2={points[hoveredIndex].x}
                y2={height - paddingY}
                stroke="#818cf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            )}

            {/* Interactive Points and Hitboxes */}
            {points.map((pt, i) => {
              const isHovered = hoveredIndex === i;
              const hasMilestone = !!pt.data.milestone;

              return (
                <g key={i}>
                  {/* Invisible broad hitbox for seamless hovering on touch & mouse */}
                  <rect
                    x={pt.x - 20}
                    y={0}
                    width={40}
                    height={height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onTouchStart={() => setHoveredIndex(i)}
                  />

                  {/* Milestone beacon star indicator */}
                  {hasMilestone && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 8 : 6}
                      fill="#f59e0b"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Point Outer Ring */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : hasMilestone ? 5 : 4}
                    fill={hasMilestone ? '#f59e0b' : '#ffffff'}
                    stroke={hasMilestone ? '#d97706' : '#6366f1'}
                    strokeWidth={isHovered ? 2.5 : 2}
                    className="transition-all duration-150"
                  />

                  {/* Point Inner Center */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 3 : 2}
                    fill={hasMilestone ? '#ffffff' : '#6366f1'}
                  />

                  {/* Bottom X-axis Date Label */}
                  <text
                    x={pt.x}
                    y={height - 10}
                    textAnchor="middle"
                    className={`text-[10px] font-mono tabular-nums transition-colors ${
                      isHovered ? 'fill-indigo-600 dark:fill-indigo-400 font-bold' : 'fill-slate-400 dark:fill-slate-500 font-medium'
                    }`}
                  >
                    {pt.data.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Milestone Callout Box */}
      {activePoint && activePoint.data.milestone && (
        <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">★</span>
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200">
                {lang === 'en' ? 'Cryptographic Milestone Achieved:' : 'क्रिप्टोग्राफिक मील का पत्थर:'}
              </span>{' '}
              <span className="text-amber-800 dark:text-amber-300">{activePoint.data.milestone}</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400 font-bold shrink-0">
            {activePoint.data.date}
          </span>
        </div>
      )}

      {/* Explanatory footer */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{lang === 'en' ? 'Real-Time Enclave Telemetry' : 'रीयल-टाइम एन्क्लेव टेलीमेट्री'}</span>
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          {lang === 'en' ? 'Hover/Tap points to inspect milestones' : 'पॉइंट्स पर टैप या होवर करके विस्तार देखें'}
        </span>
      </div>
    </div>
  );
};
