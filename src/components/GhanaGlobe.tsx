import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// MDA locations across Ghana with map coordinates (percentage-based for SVG positioning)
const MDA_LOCATIONS = [
  { name: 'Office of the Head of Civil Service', city: 'Accra', x: 72, y: 88, type: 'headquarters' },
  { name: 'Ministry of Finance', city: 'Accra', x: 70, y: 86, type: 'ministry' },
  { name: 'Ministry of Education', city: 'Accra', x: 74, y: 87, type: 'ministry' },
  { name: 'Ministry of Health', city: 'Accra', x: 71, y: 89, type: 'ministry' },
  { name: 'Ghana Revenue Authority', city: 'Accra', x: 73, y: 85, type: 'agency' },
  { name: 'Electoral Commission', city: 'Accra', x: 69, y: 88, type: 'commission' },
  { name: 'Northern Regional Admin', city: 'Tamale', x: 48, y: 28, type: 'regional' },
  { name: 'Ashanti Regional Admin', city: 'Kumasi', x: 42, y: 58, type: 'regional' },
  { name: 'Western Regional Admin', city: 'Sekondi-Takoradi', x: 25, y: 82, type: 'regional' },
  { name: 'Eastern Regional Admin', city: 'Koforidua', x: 62, y: 72, type: 'regional' },
  { name: 'Central Regional Admin', city: 'Cape Coast', x: 50, y: 88, type: 'regional' },
  { name: 'Volta Regional Admin', city: 'Ho', x: 78, y: 65, type: 'regional' },
  { name: 'Upper East Regional Admin', city: 'Bolgatanga', x: 55, y: 8, type: 'regional' },
  { name: 'Upper West Regional Admin', city: 'Wa', x: 28, y: 15, type: 'regional' },
  { name: 'Bono Regional Admin', city: 'Sunyani', x: 32, y: 50, type: 'regional' },
  { name: 'Savannah Regional Admin', city: 'Damongo', x: 38, y: 32, type: 'regional' },
];

// Ghana map SVG path (simplified outline)
const GHANA_PATH = `
  M 55 5
  C 62 3, 70 5, 75 8
  L 80 12
  C 82 15, 83 20, 82 25
  L 85 35
  C 87 42, 88 50, 87 58
  L 88 68
  C 89 75, 88 82, 85 88
  L 80 92
  C 75 95, 68 96, 60 95
  L 50 93
  C 42 94, 35 92, 28 88
  L 22 82
  C 18 78, 15 72, 15 65
  L 12 55
  C 10 48, 12 40, 15 32
  L 18 22
  C 20 15, 25 10, 32 7
  L 42 5
  C 48 4, 52 5, 55 5
  Z
`;

// Regional boundaries (simplified)
const REGIONS = [
  { name: 'Upper West', path: 'M 15 5 L 40 5 L 42 25 L 20 28 Z', color: '#006B3F' },
  { name: 'Upper East', path: 'M 40 5 L 75 8 L 72 25 L 42 25 Z', color: '#007A47' },
  { name: 'Savannah', path: 'M 20 28 L 55 25 L 55 42 L 25 45 Z', color: '#006B3F' },
  { name: 'Northern', path: 'M 55 25 L 75 28 L 72 45 L 55 42 Z', color: '#008550' },
  { name: 'North East', path: 'M 72 25 L 82 30 L 80 42 L 72 45 Z', color: '#006B3F' },
  { name: 'Bono East', path: 'M 25 45 L 45 42 L 45 58 L 28 60 Z', color: '#007A47' },
  { name: 'Bono', path: 'M 45 42 L 60 45 L 58 60 L 45 58 Z', color: '#006B3F' },
  { name: 'Ahafo', path: 'M 28 60 L 45 58 L 42 72 L 25 70 Z', color: '#008550' },
  { name: 'Ashanti', path: 'M 45 58 L 65 55 L 62 75 L 42 72 Z', color: '#007A47' },
  { name: 'Eastern', path: 'M 65 55 L 82 52 L 80 75 L 62 75 Z', color: '#006B3F' },
  { name: 'Oti', path: 'M 80 42 L 88 48 L 86 65 L 80 60 Z', color: '#007A47' },
  { name: 'Volta', path: 'M 80 60 L 88 65 L 88 82 L 78 80 Z', color: '#006B3F' },
  { name: 'Western North', path: 'M 15 65 L 28 60 L 25 78 L 15 75 Z', color: '#008550' },
  { name: 'Western', path: 'M 15 75 L 28 78 L 30 92 L 18 88 Z', color: '#006B3F' },
  { name: 'Central', path: 'M 30 78 L 50 75 L 52 92 L 30 92 Z', color: '#007A47' },
  { name: 'Greater Accra', path: 'M 62 82 L 78 80 L 80 92 L 62 92 Z', color: '#008550' },
];

// Floating particle component
function FloatingParticle({ delay, duration, startX, startY }: { delay: number; duration: number; startX: number; startY: number }) {
  return (
    <motion.circle
      cx={startX}
      cy={startY}
      r={Math.random() * 1.5 + 0.5}
      fill={Math.random() > 0.5 ? '#FCD116' : '#006B3F'}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        cx: [startX, startX + (Math.random() - 0.5) * 20],
        cy: [startY, startY - Math.random() * 30],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

// Connection line with animated particle
function ConnectionLine({
  from,
  to,
  delay
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay: number;
}) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 10; // Curve upward

  const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

  return (
    <g>
      {/* Base line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#connectionGradient)"
        strokeWidth="0.5"
        strokeDasharray="2,2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 1.5, delay }}
      />

      {/* Animated particle along path */}
      <motion.circle
        r="1.5"
        fill="#FCD116"
        filter="url(#glow)"
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        transition={{
          duration: 2,
          delay: delay + 0.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ offsetPath: `path("${pathD}")` }}
      />
    </g>
  );
}

// MDA Point component with pulse effect
function MDAPoint({
  mda,
  isHovered,
  isHeadquarters,
  onHover,
  index,
}: {
  mda: typeof MDA_LOCATIONS[0];
  isHovered: boolean;
  isHeadquarters: boolean;
  onHover: (mda: typeof MDA_LOCATIONS[0] | null) => void;
  index: number;
}) {
  const color = useMemo(() => {
    switch (mda.type) {
      case 'headquarters': return '#FCD116';
      case 'ministry': return '#006B3F';
      case 'agency': return '#CE1126';
      case 'commission': return '#FCD116';
      case 'regional': return '#006B3F';
      default: return '#ffffff';
    }
  }, [mda.type]);

  const size = isHeadquarters ? 4 : 2.5;

  return (
    <g
      onMouseEnter={() => onHover(mda)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer pulse rings */}
      {isHeadquarters && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={mda.x}
              cy={mda.y}
              r={size}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: [1, 3, 4], opacity: [0.6, 0.2, 0] }}
              transition={{
                duration: 2.5,
                delay: i * 0.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Hover pulse ring */}
      {isHovered && !isHeadquarters && (
        <motion.circle
          cx={mda.x}
          cy={mda.y}
          r={size}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      {/* Glow effect */}
      <motion.circle
        cx={mda.x}
        cy={mda.y}
        r={isHovered ? size * 2.5 : size * 1.8}
        fill={color}
        opacity={isHovered ? 0.4 : 0.2}
        filter="url(#blur)"
        animate={{
          r: isHovered ? [size * 2.5, size * 3, size * 2.5] : [size * 1.8, size * 2.2, size * 1.8],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main point */}
      <motion.circle
        cx={mda.x}
        cy={mda.y}
        r={isHovered ? size * 1.5 : size}
        fill={color}
        filter={isHeadquarters ? "url(#glow)" : undefined}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05, type: "spring" }}
      />

      {/* Inner bright core */}
      <motion.circle
        cx={mda.x}
        cy={mda.y}
        r={size * 0.4}
        fill="#ffffff"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05 + 0.1, type: "spring" }}
      />

      {/* Label on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            <rect
              x={mda.x - 25}
              y={mda.y - 22}
              width="50"
              height="16"
              rx="3"
              fill="rgba(13, 17, 23, 0.95)"
              stroke={color}
              strokeWidth="0.5"
            />
            <text
              x={mda.x}
              y={mda.y - 12}
              textAnchor="middle"
              fill="white"
              fontSize="3.5"
              fontWeight="bold"
            >
              {mda.city}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}

// Data flow animation overlay
function DataFlowOverlay() {
  const headquarters = MDA_LOCATIONS.find(m => m.type === 'headquarters')!;
  const regionalOffices = MDA_LOCATIONS.filter(m => m.type === 'regional');

  return (
    <g>
      {regionalOffices.map((mda, i) => (
        <ConnectionLine
          key={i}
          from={{ x: headquarters.x, y: headquarters.y }}
          to={{ x: mda.x, y: mda.y }}
          delay={i * 0.2}
        />
      ))}
    </g>
  );
}

// Animated grid background
function AnimatedGrid() {
  return (
    <g opacity="0.1">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.line
          key={`h-${i}`}
          x1="0"
          y1={i * 10}
          x2="100"
          y2={i * 10}
          stroke="#FCD116"
          strokeWidth="0.2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
        />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.line
          key={`v-${i}`}
          x1={i * 10}
          y1="0"
          x2={i * 10}
          y2="100"
          stroke="#006B3F"
          strokeWidth="0.2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, delay: i * 0.1 + 0.5, repeat: Infinity }}
        />
      ))}
    </g>
  );
}

// Radar sweep effect
function RadarSweep() {
  const headquarters = MDA_LOCATIONS.find(m => m.type === 'headquarters')!;

  return (
    <motion.g
      style={{ transformOrigin: `${headquarters.x}% ${headquarters.y}%` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FCD116" stopOpacity="0" />
          <stop offset="100%" stopColor="#FCD116" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d={`M ${headquarters.x} ${headquarters.y} L ${headquarters.x + 40} ${headquarters.y - 5} A 40 40 0 0 1 ${headquarters.x + 35} ${headquarters.y + 20} Z`}
        fill="url(#radarGradient)"
      />
    </motion.g>
  );
}

// Main Ghana Map Component
export default function GhanaGlobe() {
  const [hoveredMDA, setHoveredMDA] = useState<typeof MDA_LOCATIONS[0] | null>(null);
  const [activeConnections, setActiveConnections] = useState(0);
  const [dataPackets, setDataPackets] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnections(prev => (prev + Math.floor(Math.random() * 8) + 1) % 100);
      setDataPackets(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const headquarters = MDA_LOCATIONS.find(m => m.type === 'headquarters')!;

  // Generate floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
    }));
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[650px] lg:h-[700px]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-900 to-surface-800" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-ghana-green/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-ghana-gold/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Stats overlay - left */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-ghana-gold/30 shadow-xl shadow-black/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-ghana-green"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-surface-400 text-[10px] sm:text-xs uppercase tracking-wider">Live Network</span>
          </div>
          <div className="text-ghana-gold font-bold text-2xl sm:text-4xl">{MDA_LOCATIONS.length}</div>
          <div className="text-surface-300 text-xs sm:text-sm">MDAs Connected</div>
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-surface-400 text-[10px] sm:text-xs">Active Links</span>
              <span className="text-ghana-green text-xs sm:text-sm font-medium">{activeConnections}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-surface-400 text-[10px] sm:text-xs">Data Packets</span>
              <span className="text-ghana-gold text-xs sm:text-sm font-medium">{dataPackets.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Legend - bottom left */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 shadow-xl shadow-black/50"
        >
          <div className="text-surface-400 text-[10px] sm:text-xs uppercase tracking-wider mb-2">Node Types</div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-ghana-gold"
                animate={{ boxShadow: ['0 0 5px #FCD116', '0 0 15px #FCD116', '0 0 5px #FCD116'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-surface-300 text-[10px] sm:text-xs">Headquarters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-ghana-green shadow-lg shadow-ghana-green/50" />
              <span className="text-surface-300 text-[10px] sm:text-xs">Regional Offices</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-ghana-red shadow-lg shadow-ghana-red/50" />
              <span className="text-surface-300 text-[10px] sm:text-xs">Agencies</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instruction - top right */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface-900/80 backdrop-blur-md rounded-lg sm:rounded-xl px-3 py-2 border border-white/10 flex items-center gap-2"
        >
          <span className="text-surface-300 text-[10px] sm:text-xs">Hover to explore</span>
          <motion.div
            className="w-5 h-5 rounded-full border border-ghana-gold/50 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-3 h-3 text-ghana-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2z" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Main SVG Map */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full max-w-[500px] max-h-[600px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#006B3F" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#007A47" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#006B3F" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD116" />
              <stop offset="50%" stopColor="#006B3F" />
              <stop offset="100%" stopColor="#FCD116" />
            </linearGradient>

            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FCD116" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#006B3F" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FCD116" stopOpacity="0.8" />
            </linearGradient>

            <radialGradient id="hqGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCD116" stopOpacity="1" />
              <stop offset="100%" stopColor="#FCD116" stopOpacity="0" />
            </radialGradient>

            {/* Filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>

            <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Animated grid background */}
          <AnimatedGrid />

          {/* Radar sweep effect */}
          <RadarSweep />

          {/* Ghana map outline - shadow layer */}
          <motion.path
            d={GHANA_PATH}
            fill="rgba(0,0,0,0.3)"
            transform="translate(1, 2)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Ghana map main fill with gradient */}
          <motion.path
            d={GHANA_PATH}
            fill="url(#mapGradient)"
            filter="url(#mapShadow)"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Animated border glow */}
          <motion.path
            d={GHANA_PATH}
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="1"
            strokeDasharray="5,3"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -100 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Secondary border */}
          <motion.path
            d={GHANA_PATH}
            fill="none"
            stroke="#FCD116"
            strokeWidth="0.5"
            opacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          {/* Inner pattern overlay */}
          <motion.path
            d={GHANA_PATH}
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.2"
            opacity="0.1"
            strokeDasharray="1,5"
          />

          {/* Floating particles */}
          {particles.map((p) => (
            <FloatingParticle key={p.id} {...p} />
          ))}

          {/* Data flow connections */}
          <DataFlowOverlay />

          {/* MDA Points */}
          {MDA_LOCATIONS.map((mda, i) => (
            <MDAPoint
              key={i}
              mda={mda}
              index={i}
              isHovered={hoveredMDA?.name === mda.name}
              isHeadquarters={mda.type === 'headquarters'}
              onHover={setHoveredMDA}
            />
          ))}

          {/* Headquarters beacon effect */}
          <motion.circle
            cx={headquarters.x}
            cy={headquarters.y}
            r="8"
            fill="url(#hqGlow)"
            opacity="0.3"
            animate={{
              r: [8, 12, 8],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Map label */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <text
              x="50"
              y="50"
              textAnchor="middle"
              fill="#FCD116"
              fontSize="5"
              fontWeight="bold"
              opacity="0.15"
            >
              GHANA
            </text>
          </motion.g>
        </motion.svg>
      </div>

      {/* Hovered MDA info panel */}
      <AnimatePresence>
        {hoveredMDA && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10"
          >
            <div className="bg-surface-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-ghana-gold/40 shadow-2xl shadow-ghana-gold/10 max-w-[220px] sm:max-w-xs">
              <div className="flex items-start gap-3">
                <motion.div
                  className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    hoveredMDA.type === 'headquarters' ? 'bg-ghana-gold' :
                    hoveredMDA.type === 'regional' ? 'bg-ghana-green' : 'bg-ghana-red'
                  }`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    boxShadow: hoveredMDA.type === 'headquarters'
                      ? '0 0 10px #FCD116'
                      : hoveredMDA.type === 'regional'
                      ? '0 0 10px #006B3F'
                      : '0 0 10px #CE1126'
                  }}
                />
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base leading-tight">{hoveredMDA.name}</h4>
                  <p className="text-ghana-gold text-xs sm:text-sm mt-1">{hoveredMDA.city}, Ghana</p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                    <span className="text-surface-400 text-[10px] sm:text-xs capitalize">{hoveredMDA.type.replace('_', ' ')}</span>
                    <motion.span
                      className="text-ghana-green text-[10px] sm:text-xs flex items-center gap-1"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-ghana-green" />
                      Online
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
        <motion.div
          className="absolute top-4 left-4 w-12 h-[2px] bg-gradient-to-r from-ghana-gold to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-4 left-4 w-[2px] h-12 bg-gradient-to-b from-ghana-gold to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none">
        <motion.div
          className="absolute bottom-4 right-4 w-12 h-[2px] bg-gradient-to-l from-ghana-gold to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-4 right-4 w-[2px] h-12 bg-gradient-to-t from-ghana-gold to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
    </div>
  );
}
