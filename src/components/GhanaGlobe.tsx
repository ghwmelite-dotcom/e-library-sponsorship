import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';

// MDA locations across Ghana with map coordinates
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

// Accurate Ghana map path with more detail
const GHANA_MAIN_PATH = `
  M 55 2
  C 58 1.5, 62 2, 68 4
  L 75 7
  C 80 9, 84 12, 86 16
  L 88 22
  C 90 28, 91 35, 90 42
  L 89 52
  C 88 60, 87 68, 86 75
  L 85 82
  C 84 86, 82 90, 78 93
  L 70 96
  C 64 97, 58 97, 52 96
  L 42 94
  C 35 93, 28 90, 22 85
  L 17 78
  C 13 73, 10 66, 10 58
  L 11 48
  C 12 40, 14 32, 18 24
  L 23 16
  C 27 10, 33 6, 40 4
  L 48 2.5
  C 51 2, 53 2, 55 2
  Z
`;

// Regional boundaries for layered effect
const REGIONS = [
  { name: 'Upper West', center: { x: 28, y: 15 }, color: '#006B3F' },
  { name: 'Upper East', center: { x: 58, y: 10 }, color: '#007A47' },
  { name: 'Savannah', center: { x: 38, y: 32 }, color: '#008550' },
  { name: 'Northern', center: { x: 55, y: 28 }, color: '#006B3F' },
  { name: 'Bono', center: { x: 32, y: 50 }, color: '#007A47' },
  { name: 'Ashanti', center: { x: 45, y: 60 }, color: '#008550' },
  { name: 'Eastern', center: { x: 65, y: 68 }, color: '#006B3F' },
  { name: 'Volta', center: { x: 80, y: 62 }, color: '#007A47' },
  { name: 'Western', center: { x: 22, y: 78 }, color: '#008550' },
  { name: 'Central', center: { x: 48, y: 85 }, color: '#006B3F' },
  { name: 'Greater Accra', center: { x: 72, y: 88 }, color: '#007A47' },
];

// Holographic scan line component
function HolographicScanLines() {
  return (
    <g opacity="0.15">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.line
          key={i}
          x1="0"
          y1={i * 2}
          x2="100"
          y2={i * 2}
          stroke="#00ffff"
          strokeWidth="0.15"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            x1: [-5, 0, -5],
            x2: [105, 100, 105]
          }}
          transition={{
            duration: 3,
            delay: i * 0.03,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </g>
  );
}

// Aurora effect overlay
function AuroraEffect() {
  return (
    <g>
      <defs>
        <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
          <motion.stop
            offset="0%"
            animate={{ stopColor: ['#00ff88', '#00ffff', '#ff00ff', '#00ff88'] }}
            transition={{ duration: 8, repeat: Infinity }}
            stopOpacity="0.3"
          />
          <motion.stop
            offset="50%"
            animate={{ stopColor: ['#00ffff', '#ff00ff', '#00ff88', '#00ffff'] }}
            transition={{ duration: 8, repeat: Infinity }}
            stopOpacity="0.2"
          />
          <motion.stop
            offset="100%"
            animate={{ stopColor: ['#ff00ff', '#00ff88', '#00ffff', '#ff00ff'] }}
            transition={{ duration: 8, repeat: Infinity }}
            stopOpacity="0.1"
          />
        </linearGradient>
      </defs>
      <motion.path
        d={GHANA_MAIN_PATH}
        fill="url(#aurora1)"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </g>
  );
}

// 3D Layered map effect
function LayeredMapEffect() {
  const layers = [0, 1, 2, 3, 4];

  return (
    <g>
      {layers.map((layer) => (
        <motion.path
          key={layer}
          d={GHANA_MAIN_PATH}
          fill="none"
          stroke={layer === 0 ? '#FCD116' : `rgba(0, 255, 200, ${0.1 + layer * 0.05})`}
          strokeWidth={layer === 0 ? 1.5 : 0.5}
          transform={`translate(${layer * -0.5}, ${layer * -0.8})`}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{
            opacity: layer === 0 ? 1 : 0.3 - layer * 0.05,
            pathLength: 1
          }}
          transition={{
            duration: 2,
            delay: layer * 0.1,
            pathLength: { duration: 2.5, delay: layer * 0.1 }
          }}
        />
      ))}
    </g>
  );
}

// Glowing energy wave emanating from headquarters
function EnergyWave({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={5}
          fill="none"
          stroke="url(#energyGradient)"
          strokeWidth="0.5"
          initial={{ r: 5, opacity: 0.8 }}
          animate={{
            r: [5, 40, 60],
            opacity: [0.8, 0.2, 0],
            strokeWidth: [1, 0.3, 0.1]
          }}
          transition={{
            duration: 4,
            delay: i * 1,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </g>
  );
}

// Data stream particle along connection path
function DataStreamParticle({
  path,
  delay,
  color,
  reverse = false
}: {
  path: string;
  delay: number;
  color: string;
  reverse?: boolean;
}) {
  return (
    <g>
      {/* Trail effect */}
      <motion.circle
        r="2"
        fill={color}
        filter="url(#particleGlow)"
        initial={{ offsetDistance: reverse ? '100%' : '0%' }}
        animate={{ offsetDistance: reverse ? '0%' : '100%' }}
        transition={{
          duration: 3,
          delay,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ offsetPath: `path("${path}")` }}
      />
      {/* Core particle */}
      <motion.circle
        r="1"
        fill="#ffffff"
        initial={{ offsetDistance: reverse ? '100%' : '0%' }}
        animate={{ offsetDistance: reverse ? '0%' : '100%' }}
        transition={{
          duration: 3,
          delay,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ offsetPath: `path("${path}")` }}
      />
    </g>
  );
}

// Advanced connection with data flow
function AdvancedConnection({
  from,
  to,
  delay,
  isActive
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay: number;
  isActive: boolean;
}) {
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - 15;
  const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

  return (
    <g>
      {/* Glow path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#connectionGlow)"
        strokeWidth="3"
        filter="url(#blur)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: isActive ? 0.6 : 0.2
        }}
        transition={{ duration: 1.5, delay }}
      />

      {/* Main line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="0.8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay }}
      />

      {/* Dashed overlay */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="#FCD116"
        strokeWidth="0.3"
        strokeDasharray="2,4"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -30 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Data particles */}
      <DataStreamParticle path={pathD} delay={delay} color="#00ffcc" />
      <DataStreamParticle path={pathD} delay={delay + 1.5} color="#FCD116" reverse />
    </g>
  );
}

// Pulsing node with holographic effect
function HolographicNode({
  mda,
  isHovered,
  isHeadquarters,
  onHover,
  index,
  isConnected
}: {
  mda: typeof MDA_LOCATIONS[0];
  isHovered: boolean;
  isHeadquarters: boolean;
  onHover: (mda: typeof MDA_LOCATIONS[0] | null) => void;
  index: number;
  isConnected: boolean;
}) {
  const baseSize = isHeadquarters ? 5 : 2.5;
  const color = useMemo(() => {
    switch (mda.type) {
      case 'headquarters': return '#FCD116';
      case 'ministry': return '#00ff88';
      case 'agency': return '#ff6b6b';
      case 'commission': return '#00ffff';
      case 'regional': return '#00ff88';
      default: return '#ffffff';
    }
  }, [mda.type]);

  return (
    <g
      onMouseEnter={() => onHover(mda)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer rotating ring for headquarters */}
      {isHeadquarters && (
        <>
          <motion.circle
            cx={mda.x}
            cy={mda.y}
            r={baseSize + 8}
            fill="none"
            stroke="url(#rotatingRing)"
            strokeWidth="0.5"
            strokeDasharray="3,3"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${mda.x}px ${mda.y}px` }}
          />
          <motion.circle
            cx={mda.x}
            cy={mda.y}
            r={baseSize + 5}
            fill="none"
            stroke={color}
            strokeWidth="0.3"
            strokeDasharray="1,2"
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${mda.x}px ${mda.y}px` }}
          />
        </>
      )}

      {/* Pulse rings */}
      {(isHeadquarters || isHovered) && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={mda.x}
              cy={mda.y}
              r={baseSize}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{
                scale: [1, isHeadquarters ? 4 : 2.5],
                opacity: [0.8, 0]
              }}
              transition={{
                duration: isHeadquarters ? 3 : 2,
                delay: i * (isHeadquarters ? 1 : 0.5),
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      {/* Hexagon background for hovered state */}
      {isHovered && (
        <motion.polygon
          points={`
            ${mda.x},${mda.y - 6}
            ${mda.x + 5.2},${mda.y - 3}
            ${mda.x + 5.2},${mda.y + 3}
            ${mda.x},${mda.y + 6}
            ${mda.x - 5.2},${mda.y + 3}
            ${mda.x - 5.2},${mda.y - 3}
          `}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        />
      )}

      {/* Ambient glow */}
      <motion.circle
        cx={mda.x}
        cy={mda.y}
        r={isHovered ? baseSize * 4 : baseSize * 2.5}
        fill={color}
        opacity={isHovered ? 0.4 : 0.15}
        filter="url(#blur)"
        animate={{
          r: isHovered
            ? [baseSize * 4, baseSize * 4.5, baseSize * 4]
            : [baseSize * 2.5, baseSize * 3, baseSize * 2.5],
          opacity: isHovered ? [0.4, 0.5, 0.4] : [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Main node */}
      <motion.circle
        cx={mda.x}
        cy={mda.y}
        r={isHovered ? baseSize * 1.5 : baseSize}
        fill={color}
        filter={isHeadquarters ? "url(#nodeGlow)" : undefined}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05 + 0.5, type: "spring", stiffness: 200 }}
      />

      {/* Inner core */}
      <motion.circle
        cx={mda.x}
        cy={mda.y}
        r={baseSize * 0.4}
        fill="#ffffff"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          scale: { duration: 2, repeat: Infinity },
          delay: index * 0.05 + 0.6
        }}
      />

      {/* Connection indicator */}
      {isConnected && !isHeadquarters && (
        <motion.circle
          cx={mda.x}
          cy={mda.y}
          r={baseSize + 2}
          fill="none"
          stroke="#00ffcc"
          strokeWidth="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Label */}
      <AnimatePresence>
        {isHovered && (
          <motion.g
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {/* Background panel */}
            <motion.rect
              x={mda.x - 28}
              y={mda.y - 28}
              width="56"
              height="20"
              rx="3"
              fill="rgba(0, 10, 20, 0.95)"
              stroke={color}
              strokeWidth="0.5"
              filter="url(#labelGlow)"
            />
            {/* Accent line */}
            <rect
              x={mda.x - 28}
              y={mda.y - 28}
              width="56"
              height="2"
              rx="1"
              fill={color}
            />
            <text
              x={mda.x}
              y={mda.y - 15}
              textAnchor="middle"
              fill="white"
              fontSize="4"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {mda.city}
            </text>
            {/* Status indicator */}
            <circle cx={mda.x - 22} cy={mda.y - 15} r="1.5" fill="#00ff88" />
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}

// Animated contour lines
function ContourLines() {
  const contours = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      scale: 0.85 + i * 0.02,
      opacity: 0.1 - i * 0.01,
    }))
  , []);

  return (
    <g>
      {contours.map(({ id, scale, opacity }) => (
        <motion.path
          key={id}
          d={GHANA_MAIN_PATH}
          fill="none"
          stroke="#00ffcc"
          strokeWidth="0.3"
          opacity={opacity}
          transform={`scale(${scale})`}
          style={{ transformOrigin: '50px 50px' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: id * 0.2 }}
        />
      ))}
    </g>
  );
}

// Floating data particles in the atmosphere
function AtmosphericParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      size: Math.random() * 1.5 + 0.3,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
      color: ['#FCD116', '#00ff88', '#00ffff', '#ff6b6b'][Math.floor(Math.random() * 4)]
    }))
  , []);

  return (
    <g>
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={p.startX}
          cy={p.startY}
          r={p.size}
          fill={p.color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            cx: [p.startX, p.startX + (Math.random() - 0.5) * 15],
            cy: [p.startY, p.startY - Math.random() * 25],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </g>
  );
}

// Glitch effect overlay
function GlitchEffect() {
  return (
    <motion.g
      animate={{
        x: [0, -1, 1, 0],
        opacity: [1, 0.8, 1, 0.9, 1],
      }}
      transition={{
        duration: 0.1,
        repeat: Infinity,
        repeatDelay: 5,
      }}
    >
      <motion.path
        d={GHANA_MAIN_PATH}
        fill="none"
        stroke="#ff0066"
        strokeWidth="0.5"
        opacity="0"
        animate={{
          opacity: [0, 0.5, 0],
          x: [-2, 2, -2],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: 4,
        }}
      />
      <motion.path
        d={GHANA_MAIN_PATH}
        fill="none"
        stroke="#00ffff"
        strokeWidth="0.5"
        opacity="0"
        animate={{
          opacity: [0, 0.5, 0],
          x: [2, -2, 2],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: 4,
          delay: 0.05,
        }}
      />
    </motion.g>
  );
}

// Futuristic corner brackets
function CornerBrackets() {
  return (
    <g>
      {/* Top left */}
      <motion.path
        d="M 8 20 L 8 8 L 20 8"
        fill="none"
        stroke="#FCD116"
        strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <circle cx="8" cy="8" r="1" fill="#FCD116" />

      {/* Top right */}
      <motion.path
        d="M 80 8 L 92 8 L 92 20"
        fill="none"
        stroke="#FCD116"
        strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <circle cx="92" cy="8" r="1" fill="#FCD116" />

      {/* Bottom left */}
      <motion.path
        d="M 8 80 L 8 92 L 20 92"
        fill="none"
        stroke="#FCD116"
        strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      />
      <circle cx="8" cy="92" r="1" fill="#FCD116" />

      {/* Bottom right */}
      <motion.path
        d="M 92 80 L 92 92 L 80 92"
        fill="none"
        stroke="#FCD116"
        strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
      <circle cx="92" cy="92" r="1" fill="#FCD116" />
    </g>
  );
}

// HUD style data readout
function HUDReadout({ x, y, label, value, color }: { x: number; y: number; label: string; value: string; color: string }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <rect x={x} y={y} width="18" height="8" fill="rgba(0,0,0,0.5)" stroke={color} strokeWidth="0.3" rx="1" />
      <text x={x + 9} y={y + 3} textAnchor="middle" fill={color} fontSize="2" fontFamily="monospace" opacity="0.7">
        {label}
      </text>
      <text x={x + 9} y={y + 6.5} textAnchor="middle" fill="white" fontSize="2.5" fontFamily="monospace" fontWeight="bold">
        {value}
      </text>
    </motion.g>
  );
}

// Main Component
export default function GhanaGlobe() {
  const [hoveredMDA, setHoveredMDA] = useState<typeof MDA_LOCATIONS[0] | null>(null);
  const [activeConnections, setActiveConnections] = useState(47);
  const [dataFlow, setDataFlow] = useState(12847);
  const [systemStatus, setSystemStatus] = useState('OPTIMAL');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnections(prev => Math.min(99, Math.max(30, prev + Math.floor(Math.random() * 10) - 4)));
      setDataFlow(prev => prev + Math.floor(Math.random() * 100) + 50);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const headquarters = useMemo(() =>
    MDA_LOCATIONS.find(m => m.type === 'headquarters')!
  , []);

  const regionalOffices = useMemo(() =>
    MDA_LOCATIONS.filter(m => m.type === 'regional')
  , []);

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] md:h-[650px] lg:h-[700px]">
      {/* Deep space background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a192f] via-[#020c1b] to-black" />

        {/* Animated gradient meshes - responsive sizes */}
        <motion.div
          className="absolute top-0 left-1/4 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[450px] lg:h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[250px] sm:w-[400px] lg:w-[500px] h-[250px] sm:h-[400px] lg:h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(252,209,22,0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.08) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Star field effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main stats panel - top left */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/20 to-transparent rounded-xl sm:rounded-2xl blur-xl" />
          <div className="relative bg-[#0a192f]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-5 border border-[#00ff88]/30 shadow-2xl shadow-[#00ff88]/10">
            {/* Header with animated indicator */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <motion.div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00ff88]"
                animate={{
                  boxShadow: ['0 0 5px #00ff88', '0 0 20px #00ff88', '0 0 5px #00ff88'],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[#00ff88] text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-mono">
                NETWORK ACTIVE
              </span>
            </div>

            {/* Main stat */}
            <motion.div
              className="text-white font-bold text-2xl sm:text-4xl md:text-5xl font-mono"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {MDA_LOCATIONS.length}
            </motion.div>
            <div className="text-[#64ffda] text-[10px] sm:text-xs md:text-sm font-mono mt-0.5 sm:mt-1">MDAs Connected</div>

            {/* Secondary stats - hidden on very small screens */}
            <div className="hidden sm:block mt-3 md:mt-4 pt-3 md:pt-4 border-t border-[#64ffda]/20 space-y-1.5 md:space-y-2">
              <div className="flex justify-between items-center gap-4">
                <span className="text-[#8892b0] text-[10px] md:text-xs font-mono">ACTIVE LINKS</span>
                <motion.span
                  className="text-[#00ff88] text-[10px] md:text-sm font-mono font-bold"
                  key={activeConnections}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {activeConnections}
                </motion.span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-[#8892b0] text-[10px] md:text-xs font-mono">DATA FLOW</span>
                <motion.span
                  className="text-[#FCD116] text-[10px] md:text-sm font-mono font-bold"
                  key={dataFlow}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {dataFlow.toLocaleString()} KB/s
                </motion.span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-[#8892b0] text-[10px] md:text-xs font-mono">STATUS</span>
                <span className="text-[#00ff88] text-[10px] md:text-sm font-mono font-bold flex items-center gap-1">
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ●
                  </motion.span>
                  {systemStatus}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Node type legend - bottom left - hidden on very small screens */}
      <div className="hidden sm:block absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0a192f]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 border border-[#64ffda]/20 shadow-xl"
        >
          <div className="text-[#64ffda] text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.1em] sm:tracking-[0.15em] font-mono mb-2 sm:mb-3">
            Node Classification
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {[
              { color: '#FCD116', label: 'Headquarters', glow: true },
              { color: '#00ff88', label: 'Regional Admin' },
              { color: '#ff6b6b', label: 'Agencies' },
              { color: '#00ffff', label: 'Commission' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 sm:gap-2">
                <motion.div
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: item.glow ? `0 0 10px ${item.color}` : 'none'
                  }}
                  animate={item.glow ? {
                    boxShadow: [`0 0 5px ${item.color}`, `0 0 15px ${item.color}`, `0 0 5px ${item.color}`]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[#ccd6f6] text-[9px] sm:text-[10px] md:text-xs font-mono">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Interactive hint - top right - hidden on mobile, shown as tap on small screens */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20"
      >
        <div className="bg-[#0a192f]/80 backdrop-blur-xl rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-[#FCD116]/30 flex items-center gap-2 sm:gap-3">
          <span className="text-[#ccd6f6] text-[8px] sm:text-[10px] md:text-xs font-mono hidden xs:inline">
            <span className="hidden md:inline">HOVER TO EXPLORE</span>
            <span className="md:hidden">TAP TO EXPLORE</span>
          </span>
          <motion.div
            className="relative w-5 h-5 sm:w-6 sm:h-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="absolute inset-0 border border-[#FCD116]/50 rounded-full" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FCD116]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main SVG visualization */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-10">
        <motion.svg
          viewBox="0 0 100 112"
          className="w-full h-full max-w-[320px] sm:max-w-[450px] md:max-w-[550px] max-h-[380px] sm:max-h-[500px] md:max-h-[650px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <defs>
            {/* Advanced gradients */}
            <linearGradient id="mapFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#006B3F" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#008550" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#007A47" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#006B3F" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FCD116" stopOpacity="1" />
              <stop offset="50%" stopColor="#00ff88" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FCD116" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="connectionGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#00ff88" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffcc" />
              <stop offset="50%" stopColor="#FCD116" />
              <stop offset="100%" stopColor="#00ffcc" />
            </linearGradient>

            <linearGradient id="rotatingRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD116" />
              <stop offset="25%" stopColor="transparent" />
              <stop offset="50%" stopColor="#FCD116" />
              <stop offset="75%" stopColor="transparent" />
              <stop offset="100%" stopColor="#FCD116" />
            </linearGradient>

            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCD116" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FCD116" stopOpacity="0" />
            </radialGradient>

            {/* Filters */}
            <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>

            <filter id="labelGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00ffcc" floodOpacity="0.5" />
            </filter>

            <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background layers */}
          <HolographicScanLines />

          {/* Corner brackets */}
          <CornerBrackets />

          {/* Contour lines */}
          <ContourLines />

          {/* Map shadow */}
          <motion.path
            d={GHANA_MAIN_PATH}
            fill="rgba(0,0,0,0.4)"
            transform="translate(2, 3)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Main map fill */}
          <motion.path
            d={GHANA_MAIN_PATH}
            fill="url(#mapFill)"
            filter="url(#mapShadow)"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Aurora overlay */}
          <AuroraEffect />

          {/* Glitch effect */}
          <GlitchEffect />

          {/* Layered 3D border effect */}
          <LayeredMapEffect />

          {/* Atmospheric particles */}
          <AtmosphericParticles />

          {/* Energy waves from headquarters */}
          <EnergyWave cx={headquarters.x} cy={headquarters.y} />

          {/* Network connections */}
          {regionalOffices.map((mda, i) => (
            <AdvancedConnection
              key={i}
              from={{ x: headquarters.x, y: headquarters.y }}
              to={{ x: mda.x, y: mda.y }}
              delay={i * 0.15}
              isActive={hoveredMDA?.name === mda.name}
            />
          ))}

          {/* MDA Nodes */}
          {MDA_LOCATIONS.map((mda, i) => (
            <HolographicNode
              key={i}
              mda={mda}
              index={i}
              isHovered={hoveredMDA?.name === mda.name}
              isHeadquarters={mda.type === 'headquarters'}
              onHover={setHoveredMDA}
              isConnected={mda.type === 'regional'}
            />
          ))}

          {/* Central headquarters glow */}
          <motion.circle
            cx={headquarters.x}
            cy={headquarters.y}
            r="15"
            fill="url(#centerGlow)"
            animate={{
              r: [15, 20, 15],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* HUD mini readouts on map */}
          <HUDReadout x="5" y="5" label="LAT" value="7.9465" color="#00ffcc" />
          <HUDReadout x="77" y="5" label="LON" value="-1.0232" color="#00ffcc" />

          {/* Map title */}
          <motion.text
            x="50"
            y="107"
            textAnchor="middle"
            fill="#FCD116"
            fontSize="3.5"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.3em"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            GHANA DIGITAL NETWORK
          </motion.text>
        </motion.svg>
      </div>

      {/* Hovered MDA detail panel - responsive positioning */}
      <AnimatePresence>
        {hoveredMDA && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-2 left-2 right-2 sm:left-auto sm:bottom-4 sm:right-4 z-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FCD116]/20 to-[#00ff88]/20 rounded-xl sm:rounded-2xl blur-xl" />
              <div className="relative bg-[#0a192f]/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-[#FCD116]/40 shadow-2xl shadow-[#FCD116]/10 sm:max-w-[260px]">
                {/* Status header */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <motion.div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                      style={{ backgroundColor: hoveredMDA.type === 'headquarters' ? '#FCD116' : '#00ff88' }}
                      animate={{
                        boxShadow: [
                          `0 0 5px ${hoveredMDA.type === 'headquarters' ? '#FCD116' : '#00ff88'}`,
                          `0 0 15px ${hoveredMDA.type === 'headquarters' ? '#FCD116' : '#00ff88'}`,
                          `0 0 5px ${hoveredMDA.type === 'headquarters' ? '#FCD116' : '#00ff88'}`
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-[#00ff88] text-[8px] sm:text-[10px] font-mono uppercase tracking-wider">ONLINE</span>
                  </div>
                  <span className="text-[#64ffda] text-[8px] sm:text-[10px] font-mono opacity-70">
                    NODE #{MDA_LOCATIONS.indexOf(hoveredMDA) + 1}
                  </span>
                </div>

                {/* Main info */}
                <h4 className="text-white font-bold text-xs sm:text-sm md:text-base leading-tight mb-0.5 sm:mb-1 font-mono">
                  {hoveredMDA.name}
                </h4>
                <p className="text-[#FCD116] text-[10px] sm:text-xs md:text-sm font-mono">
                  {hoveredMDA.city}, Ghana
                </p>

                {/* Details grid - simplified on mobile */}
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-[#64ffda]/20 grid grid-cols-4 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <span className="text-[#8892b0] text-[8px] sm:text-[10px] font-mono block">TYPE</span>
                    <span className="text-[#ccd6f6] text-[10px] sm:text-xs font-mono capitalize">{hoveredMDA.type}</span>
                  </div>
                  <div>
                    <span className="text-[#8892b0] text-[8px] sm:text-[10px] font-mono block">LATENCY</span>
                    <span className="text-[#00ff88] text-[10px] sm:text-xs font-mono">{Math.floor(Math.random() * 20) + 5}ms</span>
                  </div>
                  <div>
                    <span className="text-[#8892b0] text-[8px] sm:text-[10px] font-mono block">UPTIME</span>
                    <span className="text-[#ccd6f6] text-[10px] sm:text-xs font-mono">99.{Math.floor(Math.random() * 9) + 1}%</span>
                  </div>
                  <div>
                    <span className="text-[#8892b0] text-[8px] sm:text-[10px] font-mono block">PACKETS</span>
                    <span className="text-[#FCD116] text-[10px] sm:text-xs font-mono">{(Math.floor(Math.random() * 500) + 100).toLocaleString()}</span>
                  </div>
                </div>

                {/* Connection status bar - hidden on very small screens */}
                <div className="hidden sm:block mt-3 md:mt-4 pt-2 md:pt-3 border-t border-[#64ffda]/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#8892b0] text-[9px] md:text-[10px] font-mono">CONNECTION STRENGTH</span>
                    <span className="text-[#00ff88] text-[9px] md:text-[10px] font-mono">EXCELLENT</span>
                  </div>
                  <div className="h-1 md:h-1.5 bg-[#1a365d] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00ff88] to-[#FCD116] rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative animated lines at edges */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl">
        {/* Top edge */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FCD116] to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Bottom edge */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff88] to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />
        {/* Left edge */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-[#00ffcc] to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.75 }}
        />
        {/* Right edge */}
        <motion.div
          className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-[#FCD116] to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2.25 }}
        />

        {/* Corner glow effects - responsive sizes */}
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#FCD116]/20 to-transparent" />
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-bl from-[#00ff88]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#00ffcc]/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tl from-[#FCD116]/20 to-transparent" />
      </div>
    </div>
  );
}
