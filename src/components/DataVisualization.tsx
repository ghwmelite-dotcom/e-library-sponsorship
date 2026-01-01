import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
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
} from 'lucide-react';

// ===== ANIMATED CIRCULAR PROGRESS =====
function CircularProgress({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
  color = '#FCD116',
  label,
  suffix = '%',
  delay = 0,
}: {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / maxValue) * 100;

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
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            className="drop-shadow-[0_0_10px_rgba(252,209,22,0.5)]"
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {currentValue}{suffix}
          </span>
        </div>
      </div>
      <p className="mt-3 text-surface-300 text-sm text-center">{label}</p>
    </div>
  );
}

// ===== ANIMATED BAR CHART =====
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

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimate(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  const maxValue = Math.max(...data.flatMap(d => [d.before, d.after]));

  return (
    <div ref={ref} className="space-y-4">
      {data.map((item, index) => {
        const savings = item.before - item.after;
        const savingsPercent = ((savings / item.before) * 100).toFixed(0);

        return (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-surface-300 text-sm">{item.label}</span>
              <span className="text-ghana-green text-sm font-semibold flex items-center gap-1">
                <ArrowDown className="w-3 h-3" />
                {savingsPercent}% savings
              </span>
            </div>

            <div className="relative h-8 bg-surface-800 rounded-lg overflow-hidden">
              {/* Before bar (faded) */}
              <motion.div
                className="absolute inset-y-0 left-0 bg-surface-600 rounded-lg"
                initial={{ width: 0 }}
                animate={animate ? { width: `${(item.before / maxValue) * 100}%` } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />

              {/* After bar (colored) */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-lg"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={animate ? { width: `${(item.after / maxValue) * 100}%` } : {}}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              />

              {/* Labels */}
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-white text-xs font-medium relative z-10">
                  GHS {item.after.toLocaleString()}M
                </span>
                <span className="text-surface-400 text-xs line-through relative z-10">
                  GHS {item.before.toLocaleString()}M
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== LIVE ACTIVITY FEED =====
function LiveActivityFeed() {
  const activities = [
    { icon: Users, text: "New user registered from Ministry of Finance", time: "Just now", color: "text-ghana-green" },
    { icon: BookOpen, text: "Document uploaded to Knowledge Base", time: "2s ago", color: "text-ghana-gold" },
    { icon: Award, text: "Certificate issued to civil servant", time: "5s ago", color: "text-yellow-400" },
    { icon: Zap, text: "Kwame AI answered a policy question", time: "8s ago", color: "text-blue-400" },
    { icon: Users, text: "Team collaboration started in Ashanti MDA", time: "12s ago", color: "text-ghana-green" },
    { icon: BookOpen, text: "Training course completed", time: "15s ago", color: "text-ghana-gold" },
    { icon: Award, text: "New badge earned by user", time: "18s ago", color: "text-purple-400" },
    { icon: Zap, text: "Research query processed", time: "22s ago", color: "text-blue-400" },
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
    <div className="bg-surface-800/50 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-ghana-green animate-pulse" />
          <span className="text-white font-medium text-sm">Live Platform Activity</span>
        </div>
        <RefreshCw className="w-4 h-4 text-surface-400 animate-spin" style={{ animationDuration: '3s' }} />
      </div>

      {/* Activity list */}
      <div className="divide-y divide-white/5">
        {visibleActivities.map((activity, index) => (
          <motion.div
            key={`${activity.text}-${index}-${counter}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-3 flex items-center gap-3"
          >
            <activity.icon className={`w-4 h-4 ${activity.color} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-surface-200 text-sm truncate">{activity.text}</p>
            </div>
            <span className="text-surface-500 text-xs flex-shrink-0">{activity.time}</span>
          </motion.div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="px-4 py-3 border-t border-white/10 bg-surface-900/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-surface-400">Today's activity</span>
          <span className="text-ghana-gold font-semibold">
            {(12847 + counter * 3).toLocaleString()} events
          </span>
        </div>
      </div>
    </div>
  );
}

// ===== ANIMATED GROWTH CHART =====
function GrowthChart({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimate(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  // Growth data points (months 1-12)
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
  const chartHeight = 200;
  const chartWidth = 100; // percentage

  // Create SVG path for the area chart
  const createPath = (data: typeof dataPoints, key: 'users' | 'engagement', maxVal: number) => {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d[key] / maxVal) * 100;
      return `${x},${y}`;
    });
    return `M0,100 L${points.join(' L')} L100,100 Z`;
  };

  const usersPath = createPath(dataPoints, 'users', maxUsers);

  return (
    <div ref={ref} className="bg-surface-800/50 rounded-xl border border-white/10 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="text-white font-semibold text-sm sm:text-base">Projected User Growth</h4>
          <p className="text-surface-400 text-xs sm:text-sm">First 12 months after launch</p>
        </div>
        <div className="flex items-center gap-2 text-ghana-green">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-bold text-sm sm:text-base">500K+</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}

          {/* Area fill */}
          <motion.path
            d={usersPath}
            fill="url(#gradient)"
            initial={{ opacity: 0 }}
            animate={animate ? { opacity: 0.3 } : {}}
            transition={{ duration: 1 }}
          />

          {/* Line */}
          <motion.path
            d={`M${dataPoints.map((d, i) =>
              `${(i / (dataPoints.length - 1)) * 100},${100 - (d.users / maxUsers) * 100}`
            ).join(' L')}`}
            fill="none"
            stroke="#006B3F"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={animate ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#006B3F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#006B3F" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Data point markers */}
        <div className="absolute inset-0 flex justify-between items-end pb-2 pointer-events-none">
          {dataPoints.filter((_, i) => i % 3 === 0 || i === dataPoints.length - 1).map((d, i) => (
            <motion.div
              key={d.month}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={animate ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.2 }}
            >
              <div className="w-3 h-3 rounded-full bg-ghana-green border-2 border-white shadow-lg" />
            </motion.div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-surface-500 -ml-2">
          <span>500K</span>
          <span>250K</span>
          <span>0</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-surface-500">
        <span>Month 1</span>
        <span>Month 6</span>
        <span>Month 12</span>
      </div>

      {/* Milestone markers */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-white/10">
        {[
          { month: 3, users: '75K', label: 'Pilot Complete' },
          { month: 6, users: '250K', label: 'Half Target' },
          { month: 12, users: '500K', label: 'Full Rollout' },
        ].map((milestone, i) => (
          <motion.div
            key={milestone.month}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={animate ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.5 + i * 0.2 }}
          >
            <p className="text-ghana-gold font-bold">{milestone.users}</p>
            <p className="text-surface-400 text-xs">{milestone.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ===== IMPACT METRICS DASHBOARD =====
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
      }, 100);

      const timeout = setTimeout(() => clearInterval(interval), 3000);
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
      color: 'text-ghana-gold',
      bgColor: 'bg-ghana-gold/20',
    },
    {
      icon: Clock,
      value: counters.hours.toLocaleString(),
      label: 'Hours Saved',
      color: 'text-ghana-green',
      bgColor: 'bg-ghana-green/20',
    },
    {
      icon: Zap,
      value: counters.queries.toLocaleString(),
      label: 'AI Queries Answered',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          className="bg-surface-800/50 rounded-xl border border-white/10 p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.1 }}
        >
          <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
            <metric.icon className={`w-6 h-6 ${metric.color}`} />
          </div>
          <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
          <p className="text-surface-400 text-xs mt-1">{metric.label}</p>
        </motion.div>
      ))}
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
    <div className="space-y-12">
      {/* Section 1: Circular Progress Metrics */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6 text-center">Platform Efficiency Gains</h3>
        <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4 justify-items-center">
          <CircularProgress
            value={99}
            label="Faster Document Access"
            color="#006B3F"
            delay={0}
          />
          <CircularProgress
            value={85}
            label="Training Completion Rate"
            color="#FCD116"
            delay={0.2}
          />
          <CircularProgress
            value={92}
            label="User Satisfaction"
            color="#006B3F"
            delay={0.4}
          />
          <CircularProgress
            value={78}
            label="Cost Reduction"
            color="#CE1126"
            delay={0.6}
          />
        </div>
      </div>

      {/* Section 2: Two-column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cost Savings Chart */}
        <div className="bg-surface-800/50 rounded-xl border border-white/10 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Annual Cost Savings</h3>
          <p className="text-surface-400 text-xs sm:text-sm mb-4 sm:mb-6">Projected vs. current spending (in millions GHS)</p>
          <AnimatedBarChart data={costSavingsData} delay={0.3} />
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-surface-400 text-sm">Total Annual Savings</span>
            <span className="text-ghana-green font-bold text-xl">GHS 108M+</span>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Real-Time Activity</h3>
          <p className="text-surface-400 text-xs sm:text-sm mb-4 sm:mb-6">Simulated platform activity feed</p>
          <LiveActivityFeed />
        </div>
      </div>

      {/* Section 3: Growth Chart */}
      <GrowthChart delay={0.5} />

      {/* Section 4: Impact Metrics */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6 text-center">Projected Annual Impact</h3>
        <ImpactMetricsDashboard />
      </div>
    </div>
  );
}
