import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Clock,
  Zap,
  Activity,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sparkles,
  Database,
  Globe,
  Shield,
  FileText,
  Brain,
  Network,
} from 'lucide-react';

// ===== FLOATING PARTICLES BACKGROUND =====
function FloatingParticles({ count = 20, color = '#FCD116' }: { count?: number; color?: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ===== GLOWING PULSE RING =====
function PulseRing({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border-2"
      style={{ borderColor: color }}
      initial={{ scale: 0.8, opacity: 0.8 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

// ===== ENHANCED CIRCULAR PROGRESS =====
function CircularProgress({
  value,
  maxValue = 100,
  size = 140,
  strokeWidth = 10,
  color = '#FCD116',
  label,
  suffix = '%',
  delay = 0,
  icon: Icon,
}: {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  suffix?: string;
  delay?: number;
  icon?: React.ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const springValue = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(springValue, (v) => Math.round(v));
  const strokeDashoffset = useTransform(
    springValue,
    (v) => circumference - (v / maxValue) * circumference
  );

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        springValue.set(value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, springValue, delay]);

  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    return displayValue.on("change", (v) => setCurrentValue(v));
  }, [displayValue]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center relative group"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: delay * 0.5, duration: 0.5 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Ambient glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl transition-opacity duration-300 group-hover:opacity-80"
          style={{ backgroundColor: color, opacity: 0.15 }}
        />

        {/* Pulse rings */}
        <PulseRing color={color} delay={0} />
        <PulseRing color={color} delay={0.5} />

        {/* Background circle with gradient */}
        <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
          <defs>
            <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
            <filter id={`glow-${label}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />

          {/* Animated progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset, filter: `url(#glow-${label})` }}
          />

          {/* Glowing endpoint */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={`2 ${circumference - 2}`}
            style={{ strokeDashoffset }}
            opacity={0.8}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {Icon && (
            <Icon className="w-5 h-5 mb-1 opacity-60" style={{ color }} />
          )}
          <span className="text-2xl sm:text-3xl font-bold text-white">
            {currentValue}{suffix}
          </span>
        </div>

        {/* Orbiting dot */}
        <motion.div
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            top: '50%',
            left: '50%',
            marginTop: -6,
            marginLeft: -6,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          initial={false}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: -radius + 6,
              left: 0,
            }}
          />
        </motion.div>
      </div>

      <p className="mt-4 text-surface-300 text-sm text-center font-medium">{label}</p>
    </motion.div>
  );
}

// ===== ENHANCED ANIMATED BAR CHART =====
function AnimatedBarChart({
  data,
  delay = 0,
}: {
  data: Array<{ label: string; before: number; after: number; color: string }>;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [animate, setAnimate] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimate(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  const maxValue = Math.max(...data.flatMap(d => [d.before, d.after]));

  return (
    <div ref={ref} className="space-y-5">
      {data.map((item, index) => {
        const savings = item.before - item.after;
        const savingsPercent = ((savings / item.before) * 100).toFixed(0);
        const isHovered = hoveredIndex === index;

        return (
          <motion.div
            key={item.label}
            className="space-y-2 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={animate ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex justify-between items-center">
              <span className="text-surface-300 text-sm font-medium">{item.label}</span>
              <motion.span
                className="text-ghana-green text-sm font-bold flex items-center gap-1"
                animate={{ scale: isHovered ? 1.1 : 1 }}
              >
                <ArrowDown className="w-3 h-3" />
                {savingsPercent}% savings
              </motion.span>
            </div>

            <div className="relative h-10 bg-surface-800/80 rounded-xl overflow-hidden border border-white/5">
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: item.color }}
                animate={{ opacity: isHovered ? 0.1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Before bar (ghost) */}
              <motion.div
                className="absolute inset-y-0 left-0 bg-surface-600/50 rounded-xl"
                initial={{ width: 0 }}
                animate={animate ? { width: `${(item.before / maxValue) * 100}%` } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />

              {/* After bar (main) with gradient */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-xl overflow-hidden"
                initial={{ width: 0 }}
                animate={animate ? { width: `${(item.after / maxValue) * 100}%` } : {}}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(90deg, ${item.color}dd, ${item.color})`,
                    boxShadow: isHovered ? `0 0 20px ${item.color}66` : 'none',
                  }}
                />
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>

              {/* Labels */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <span className="text-white text-sm font-bold relative z-10 drop-shadow-lg">
                  GHS {item.after}M
                </span>
                <span className="text-surface-400 text-xs line-through relative z-10">
                  GHS {item.before}M
                </span>
              </div>

              {/* Particle burst on hover */}
              {isHovered && (
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: (Math.random() - 0.5) * 40,
                        y: (Math.random() - 0.5) * 30,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ===== ENHANCED LIVE ACTIVITY FEED =====
function LiveActivityFeed() {
  const activities = [
    { icon: Users, text: "New user registered from Ministry of Finance", time: "Just now", color: "text-ghana-green", bgColor: "bg-ghana-green/20" },
    { icon: BookOpen, text: "Document uploaded to Knowledge Base", time: "2s ago", color: "text-ghana-gold", bgColor: "bg-ghana-gold/20" },
    { icon: Award, text: "Certificate issued to civil servant", time: "5s ago", color: "text-yellow-400", bgColor: "bg-yellow-400/20" },
    { icon: Brain, text: "Kwame AI answered a policy question", time: "8s ago", color: "text-blue-400", bgColor: "bg-blue-400/20" },
    { icon: Network, text: "Team collaboration started in Ashanti MDA", time: "12s ago", color: "text-purple-400", bgColor: "bg-purple-400/20" },
    { icon: FileText, text: "Training course completed", time: "15s ago", color: "text-ghana-gold", bgColor: "bg-ghana-gold/20" },
    { icon: Shield, text: "Security audit passed", time: "18s ago", color: "text-green-400", bgColor: "bg-green-400/20" },
    { icon: Database, text: "Backup completed successfully", time: "22s ago", color: "text-cyan-400", bgColor: "bg-cyan-400/20" },
  ];

  const [visibleActivities, setVisibleActivities] = useState(activities.slice(0, 4));
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(c => c + 1);
      setVisibleActivities(prev => {
        const newActivity = activities[(counter + 4) % activities.length];
        return [{ ...newActivity, time: "Just now" }, ...prev.slice(0, 3)];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="relative bg-gradient-to-br from-surface-800/80 to-surface-900/80 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-50">
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,107,63,0.3), transparent)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Header */}
      <div className="relative px-4 py-4 border-b border-white/10 flex items-center justify-between bg-surface-900/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-ghana-green" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-ghana-green animate-ping" />
          </div>
          <div>
            <span className="text-white font-semibold text-sm">Live Platform Activity</span>
            <p className="text-surface-400 text-xs">Real-time data stream</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-4 h-4 text-ghana-green" />
        </motion.div>
      </div>

      {/* Activity list */}
      <div className="divide-y divide-white/5">
        <AnimatePresence mode="popLayout">
          {visibleActivities.map((activity, index) => (
            <motion.div
              key={`${activity.text}-${counter}-${index}`}
              initial={{ opacity: 0, x: -50, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 50, height: 0 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
            >
              <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-surface-200 text-sm truncate">{activity.text}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-ghana-green"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-surface-500 text-xs">{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer with live counter */}
      <div className="relative px-4 py-4 border-t border-white/10 bg-gradient-to-r from-ghana-green/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-ghana-green" />
            <span className="text-surface-400 text-sm">Today's activity</span>
          </div>
          <motion.span
            className="text-ghana-gold font-bold text-lg"
            key={counter}
            initial={{ scale: 1.2, color: '#fff' }}
            animate={{ scale: 1, color: '#FCD116' }}
            transition={{ duration: 0.3 }}
          >
            {(12847 + counter * 3).toLocaleString()} events
          </motion.span>
        </div>
      </div>
    </div>
  );
}

// ===== ENHANCED GROWTH CHART =====
function GrowthChart({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [animate, setAnimate] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimate(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  const dataPoints = [
    { month: 'M1', users: 10000, engagement: 20 },
    { month: 'M2', users: 35000, engagement: 35 },
    { month: 'M3', users: 75000, engagement: 50 },
    { month: 'M4', users: 120000, engagement: 62 },
    { month: 'M5', users: 180000, engagement: 71 },
    { month: 'M6', users: 250000, engagement: 78 },
    { month: 'M7', users: 310000, engagement: 82 },
    { month: 'M8', users: 370000, engagement: 85 },
    { month: 'M9', users: 420000, engagement: 87 },
    { month: 'M10', users: 460000, engagement: 89 },
    { month: 'M11', users: 490000, engagement: 91 },
    { month: 'M12', users: 500000, engagement: 92 },
  ];

  const maxUsers = 500000;

  const linePath = `M${dataPoints.map((d, i) =>
    `${(i / (dataPoints.length - 1)) * 100},${100 - (d.users / maxUsers) * 100}`
  ).join(' L')}`;

  const areaPath = `M0,100 L${dataPoints.map((d, i) =>
    `${(i / (dataPoints.length - 1)) * 100},${100 - (d.users / maxUsers) * 100}`
  ).join(' L')} L100,100 Z`;

  return (
    <motion.div
      ref={ref}
      className="relative bg-gradient-to-br from-surface-800/80 to-surface-900/80 rounded-2xl border border-white/10 p-4 sm:p-6 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Background particles */}
      <FloatingParticles count={15} color="#006B3F" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-ghana-green" />
            Projected User Growth
          </h4>
          <p className="text-surface-400 text-sm">First 12 months after launch</p>
        </div>
        <motion.div
          className="flex items-center gap-2 px-4 py-2 bg-ghana-green/20 rounded-full border border-ghana-green/30"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Users className="w-4 h-4 text-ghana-green" />
          <span className="font-bold text-ghana-green">500K+ Target</span>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="relative h-56 sm:h-64">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#006B3F" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#006B3F" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#006B3F" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#006B3F" />
              <stop offset="50%" stopColor="#FCD116" />
              <stop offset="100%" stopColor="#006B3F" />
            </linearGradient>
            <filter id="chartGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.3"
              strokeDasharray="2 2"
            />
          ))}

          {/* Animated area fill */}
          <motion.path
            d={areaPath}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={animate ? { opacity: 1 } : {}}
            transition={{ duration: 1.5 }}
          />

          {/* Main line with glow */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#chartGlow)"
            initial={{ pathLength: 0 }}
            animate={animate ? { pathLength: 1 } : {}}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />

          {/* Second line for extra glow */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#FCD116"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.5}
            initial={{ pathLength: 0 }}
            animate={animate ? { pathLength: 1 } : {}}
            transition={{ duration: 2.5, ease: "easeOut", delay: 0.1 }}
          />
        </svg>

        {/* Interactive data points */}
        <div className="absolute inset-0 flex items-end">
          {dataPoints.map((d, i) => {
            const x = (i / (dataPoints.length - 1)) * 100;
            const y = (d.users / maxUsers) * 100;

            return (
              <motion.div
                key={d.month}
                className="absolute cursor-pointer"
                style={{
                  left: `${x}%`,
                  bottom: `${y}%`,
                  transform: 'translate(-50%, 50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={animate ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <motion.div
                  className="relative"
                  animate={{ scale: hoveredPoint === i ? 1.5 : 1 }}
                >
                  <div
                    className="w-3 h-3 rounded-full bg-ghana-green border-2 border-white"
                    style={{
                      boxShadow: hoveredPoint === i
                        ? '0 0 15px #006B3F, 0 0 30px #006B3F'
                        : '0 0 10px rgba(0,107,63,0.5)',
                    }}
                  />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredPoint === i && (
                      <motion.div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-900/95 border border-ghana-gold/30 rounded-lg whitespace-nowrap z-50"
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      >
                        <p className="text-white font-bold">{(d.users / 1000).toFixed(0)}K Users</p>
                        <p className="text-surface-400 text-xs">Month {i + 1}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-surface-500 -ml-1 py-2">
          <span>500K</span>
          <span>250K</span>
          <span>0</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-3 text-xs text-surface-500">
        <span>Month 1</span>
        <span>Month 6</span>
        <span>Month 12</span>
      </div>

      {/* Milestone badges */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-6 pt-6 border-t border-white/10">
        {[
          { month: 3, users: '75K', label: 'Pilot Complete', color: 'bg-ghana-green/20 text-ghana-green border-ghana-green/30' },
          { month: 6, users: '250K', label: 'Half Target', color: 'bg-ghana-gold/20 text-ghana-gold border-ghana-gold/30' },
          { month: 12, users: '500K', label: 'Full Rollout', color: 'bg-ghana-red/20 text-ghana-red border-ghana-red/30' },
        ].map((milestone, i) => (
          <motion.div
            key={milestone.month}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border ${milestone.color}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={animate ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2 + i * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="font-bold">{milestone.users}</span>
            <span className="text-xs opacity-80">{milestone.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ===== ENHANCED IMPACT METRICS DASHBOARD =====
function ImpactMetricsDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [counters, setCounters] = useState({ documents: 0, hours: 0, queries: 0 });

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setCounters(c => ({
          documents: Math.min(c.documents + Math.floor(Math.random() * 5) + 1, 50000),
          hours: Math.min(c.hours + Math.floor(Math.random() * 10) + 5, 250000),
          queries: Math.min(c.queries + Math.floor(Math.random() * 8) + 2, 100000),
        }));
      }, 50);

      const timeout = setTimeout(() => clearInterval(interval), 2000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isInView]);

  const metrics = [
    {
      icon: BookOpen,
      value: counters.documents.toLocaleString(),
      label: 'Documents Processed',
      color: '#FCD116',
      gradient: 'from-ghana-gold/20 to-ghana-gold/5',
    },
    {
      icon: Clock,
      value: counters.hours.toLocaleString(),
      label: 'Hours Saved',
      color: '#006B3F',
      gradient: 'from-ghana-green/20 to-ghana-green/5',
    },
    {
      icon: Brain,
      value: counters.queries.toLocaleString(),
      label: 'AI Queries Answered',
      color: '#60a5fa',
      gradient: 'from-blue-400/20 to-blue-400/5',
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          className={`relative bg-gradient-to-br ${metric.gradient} rounded-2xl border border-white/10 p-5 text-center overflow-hidden group`}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: i * 0.15, type: 'spring' }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at center, ${metric.color}22 0%, transparent 70%)`,
            }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, j) => (
              <motion.div
                key={j}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: metric.color,
                  left: `${20 + j * 15}%`,
                  top: `${30 + j * 10}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  delay: j * 0.5,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>

          {/* Icon with glow */}
          <motion.div
            className="relative w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${metric.color}20` }}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="absolute inset-0 rounded-xl blur-lg opacity-50"
              style={{ backgroundColor: metric.color }}
            />
            <metric.icon className="w-7 h-7 relative z-10" style={{ color: metric.color }} />
          </motion.div>

          {/* Value with counter animation */}
          <motion.p
            className="text-3xl sm:text-4xl font-bold relative z-10"
            style={{ color: metric.color }}
          >
            {metric.value}
          </motion.p>

          <p className="text-surface-400 text-sm mt-2 relative z-10">{metric.label}</p>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: metric.color }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ===== NETWORK VISUALIZATION =====
function NetworkVisualization() {
  const nodes = useMemo(() => [
    { id: 1, x: 50, y: 30, label: 'OHCS HQ', color: '#FCD116', size: 'lg' },
    { id: 2, x: 20, y: 50, label: 'Ministry', color: '#006B3F', size: 'md' },
    { id: 3, x: 80, y: 50, label: 'Agency', color: '#CE1126', size: 'md' },
    { id: 4, x: 35, y: 75, label: 'Regional', color: '#006B3F', size: 'sm' },
    { id: 5, x: 65, y: 75, label: 'Regional', color: '#006B3F', size: 'sm' },
  ], []);

  const connections = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 1, to: 5 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
  ];

  return (
    <div className="relative h-48 bg-surface-800/30 rounded-xl overflow-hidden">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn, i) => {
          const from = nodes.find(n => n.id === conn.from)!;
          const to = nodes.find(n => n.id === conn.to)!;
          return (
            <motion.line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="rgba(252, 209, 22, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute flex flex-col items-center"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
        >
          <motion.div
            className={`rounded-full flex items-center justify-center ${
              node.size === 'lg' ? 'w-10 h-10' : node.size === 'md' ? 'w-7 h-7' : 'w-5 h-5'
            }`}
            style={{
              backgroundColor: node.color,
              boxShadow: `0 0 20px ${node.color}66`,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            <Globe className={`${node.size === 'lg' ? 'w-5 h-5' : 'w-3 h-3'} text-white`} />
          </motion.div>
          <span className="text-[10px] text-surface-400 mt-1">{node.label}</span>
        </motion.div>
      ))}

      {/* Data packets */}
      {connections.slice(0, 3).map((conn, i) => {
        const from = nodes.find(n => n.id === conn.from)!;
        const to = nodes.find(n => n.id === conn.to)!;
        return (
          <motion.div
            key={`packet-${i}`}
            className="absolute w-2 h-2 rounded-full bg-ghana-gold"
            style={{ boxShadow: '0 0 10px #FCD116' }}
            initial={{ left: `${from.x}%`, top: `${from.y}%` }}
            animate={{
              left: [`${from.x}%`, `${to.x}%`, `${from.x}%`],
              top: [`${from.y}%`, `${to.y}%`, `${from.y}%`],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}

// ===== MAIN EXPORT COMPONENT =====
export default function DataVisualization() {
  const costSavingsData = [
    { label: 'Document Management', before: 45, after: 12, color: '#006B3F' },
    { label: 'Training & Development', before: 38, after: 15, color: '#FCD116' },
    { label: 'Knowledge Transfer', before: 28, after: 8, color: '#CE1126' },
    { label: 'Administrative Overhead', before: 32, after: 10, color: '#006B3F' },
  ];

  return (
    <div className="space-y-12 relative">
      {/* Background ambient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-ghana-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-ghana-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Section 1: Circular Progress Metrics */}
      <div className="relative">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-ghana-gold" />
            Platform Efficiency Gains
          </h3>
          <p className="text-surface-400">Real-time performance metrics</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 sm:gap-10 md:grid-cols-4 justify-items-center">
          <CircularProgress
            value={99}
            label="Faster Document Access"
            color="#006B3F"
            delay={0}
            icon={FileText}
          />
          <CircularProgress
            value={85}
            label="Training Completion Rate"
            color="#FCD116"
            delay={0.2}
            icon={Award}
          />
          <CircularProgress
            value={92}
            label="User Satisfaction"
            color="#006B3F"
            delay={0.4}
            icon={Users}
          />
          <CircularProgress
            value={78}
            label="Cost Reduction"
            color="#CE1126"
            delay={0.6}
            icon={TrendingUp}
          />
        </div>
      </div>

      {/* Section 2: Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cost Savings Chart */}
        <motion.div
          className="bg-gradient-to-br from-surface-800/80 to-surface-900/80 rounded-2xl border border-white/10 p-5 sm:p-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-ghana-green/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-ghana-green" />
            </div>
            <h3 className="text-lg font-bold text-white">Annual Cost Savings</h3>
          </div>
          <p className="text-surface-400 text-sm mb-6">Projected vs. current spending (millions GHS)</p>

          <AnimatedBarChart data={costSavingsData} delay={0.3} />

          <motion.div
            className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            <span className="text-surface-400 text-sm">Total Annual Savings</span>
            <motion.span
              className="text-ghana-green font-bold text-2xl"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, type: 'spring' }}
            >
              GHS 108M+
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-ghana-gold/20 rounded-lg">
              <Activity className="w-5 h-5 text-ghana-gold" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Activity</h3>
          </div>
          <p className="text-surface-400 text-sm mb-4">Simulated platform activity feed</p>
          <LiveActivityFeed />
        </motion.div>
      </div>

      {/* Section 3: Network Visualization */}
      <motion.div
        className="bg-gradient-to-br from-surface-800/60 to-surface-900/60 rounded-2xl border border-white/10 p-5 sm:p-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-ghana-gold/20 rounded-lg">
            <Network className="w-5 h-5 text-ghana-gold" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Connected Network</h3>
            <p className="text-surface-400 text-sm">Real-time data flow visualization</p>
          </div>
        </div>
        <NetworkVisualization />
      </motion.div>

      {/* Section 4: Growth Chart */}
      <GrowthChart delay={0.5} />

      {/* Section 5: Impact Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-blue-400" />
            Projected Annual Impact
          </h3>
          <p className="text-surface-400">Live counter simulation</p>
        </div>
        <ImpactMetricsDashboard />
      </motion.div>
    </div>
  );
}
