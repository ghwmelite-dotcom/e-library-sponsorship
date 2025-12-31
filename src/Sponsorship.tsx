import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';
import {
  Brain,
  BookOpen,
  GraduationCap,
  Heart,
  FlaskConical,
  Users,
  Trophy,
  Newspaper,
  Calendar,
  Shield,
  Building2,
  TrendingUp,
  Award,
  Handshake,
  Globe,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Download,
  Mail,
  Phone,
  MapPin,
  Star,
  Check,
  Play,
  ExternalLink,
  Zap,
  Target,
  Crown,
  Gem,
  Medal,
  BadgeCheck,
  Calculator,
  CalendarClock,
  X,
  User,
  Building,
  FileText,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

// Animated counter component
function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const updateValue = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.floor(value * easeOutQuart));

        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };

      requestAnimationFrame(updateValue);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// Floating platform mockup component
function FloatingMockup({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: [0, 1, 1],
        y: [50, 0, -10, 0],
      }}
      transition={{
        delay,
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 3,
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-ghana-gold/20 to-ghana-green/20 rounded-2xl blur-xl" />
        <div className="relative bg-gradient-to-br from-surface-800/90 to-surface-900/90 backdrop-blur-xl rounded-2xl border border-ghana-gold/20 p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-ghana-red" />
            <div className="w-3 h-3 rounded-full bg-ghana-gold" />
            <div className="w-3 h-3 rounded-full bg-ghana-green" />
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-ghana-gold/30 rounded w-3/4" />
            <div className="h-2 bg-white/20 rounded w-full" />
            <div className="h-2 bg-white/20 rounded w-5/6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Black Star component
function BlackStar({ className = '', animate = true }: { className?: string; animate?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
      animate={animate ? {
        rotate: 360,
        scale: 1,
        opacity: 1,
      } : {}}
      transition={{
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        scale: { duration: 1 },
        opacity: { duration: 1 },
      }}
    >
      <polygon
        points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
        fill="currentColor"
      />
    </motion.svg>
  );
}

// Feature card component
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  delay = 0
}: {
  icon: typeof Brain;
  title: string;
  description: string;
  color: 'green' | 'gold' | 'red';
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const colorClasses = {
    green: 'from-ghana-green/20 to-ghana-green/5 border-ghana-green/30 hover:border-ghana-green/60',
    gold: 'from-ghana-gold/20 to-ghana-gold/5 border-ghana-gold/30 hover:border-ghana-gold/60',
    red: 'from-ghana-red/20 to-ghana-red/5 border-ghana-red/30 hover:border-ghana-red/60',
  };

  const iconColors = {
    green: 'text-ghana-green',
    gold: 'text-ghana-gold',
    red: 'text-ghana-red',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className={`group relative bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl rounded-2xl border p-6 transition-all duration-500 hover:shadow-xl hover:shadow-${color === 'green' ? 'ghana-green' : color === 'gold' ? 'ghana-gold' : 'ghana-red'}/10 hover:-translate-y-1`}
    >
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color === 'green' ? 'from-ghana-green/20 to-ghana-green/10' : color === 'gold' ? 'from-ghana-gold/20 to-ghana-gold/10' : 'from-ghana-red/20 to-ghana-red/10'} mb-4`}>
        <Icon className={`w-6 h-6 ${iconColors[color]}`} />
      </div>
      <h3 className="text-lg font-heading font-semibold text-white mb-2">{title}</h3>
      <p className="text-surface-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Sponsor tier card component
function SponsorTierCard({
  tier,
  investment,
  benefits,
  icon: Icon,
  color,
  featured = false,
  delay = 0,
}: {
  tier: string;
  investment: string;
  benefits: string[];
  icon: typeof Crown;
  color: 'platinum' | 'gold' | 'silver' | 'bronze';
  featured?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  const colorConfig = {
    platinum: {
      gradient: 'from-slate-300 via-white to-slate-300',
      border: 'border-slate-300/50',
      glow: 'shadow-slate-300/20',
      icon: 'text-slate-200',
      bg: 'from-slate-800/50 to-slate-900/80',
    },
    gold: {
      gradient: 'from-ghana-gold via-yellow-300 to-ghana-gold',
      border: 'border-ghana-gold/50',
      glow: 'shadow-ghana-gold/20',
      icon: 'text-ghana-gold',
      bg: 'from-yellow-900/30 to-amber-900/50',
    },
    silver: {
      gradient: 'from-gray-400 via-gray-300 to-gray-400',
      border: 'border-gray-400/50',
      glow: 'shadow-gray-400/20',
      icon: 'text-gray-300',
      bg: 'from-gray-800/50 to-gray-900/80',
    },
    bronze: {
      gradient: 'from-amber-600 via-orange-400 to-amber-600',
      border: 'border-amber-600/50',
      glow: 'shadow-amber-600/20',
      icon: 'text-amber-500',
      bg: 'from-amber-900/30 to-orange-900/50',
    },
  };

  const config = colorConfig[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.6, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group ${featured ? 'lg:-mt-8 lg:mb-8' : ''}`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-1 bg-gradient-to-r from-ghana-gold to-yellow-400 text-black text-xs font-bold rounded-full shadow-lg">
            RECOMMENDED
          </span>
        </div>
      )}

      <div className={`relative overflow-hidden rounded-3xl ${config.border} border-2 bg-gradient-to-br ${config.bg} backdrop-blur-xl transition-all duration-500 ${featured ? 'shadow-2xl ' + config.glow : ''} hover:shadow-2xl hover:${config.glow}`}>
        {/* Animated gradient border effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Icon className={`w-10 h-10 ${config.icon}`} />
            <motion.div
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1 }}
            >
              <BlackStar className={`w-8 h-8 ${config.icon}`} animate={false} />
            </motion.div>
          </div>
          <h3 className={`text-2xl font-heading font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {tier}
          </h3>
          <p className="text-3xl font-bold text-white mt-2">{investment}</p>
        </div>

        {/* Benefits */}
        <div className="p-6 space-y-3">
          <AnimatePresence>
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: delay + 0.1 * index }}
                className="flex items-start gap-3"
              >
                <Check className={`w-5 h-5 ${config.icon} flex-shrink-0 mt-0.5`} />
                <span className="text-surface-300 text-sm">{benefit}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="p-6 pt-0">
          <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r ${config.gradient} text-black hover:shadow-lg hover:${config.glow} hover:scale-[1.02]`}>
            Become a Partner
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Timeline phase component
function TimelinePhase({
  phase,
  title,
  months,
  description,
  milestones,
  isLeft,
  delay = 0,
}: {
  phase: number;
  title: string;
  months: string;
  description: string;
  milestones: string[];
  isLeft: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className={`relative flex items-center ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col gap-8`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'lg:text-right' : 'lg:text-left'} text-center`}>
        <div className="inline-block px-3 py-1 bg-ghana-gold/20 rounded-full mb-3">
          <span className="text-ghana-gold text-sm font-medium">{months}</span>
        </div>
        <h3 className="text-xl font-heading font-bold text-white mb-2">Phase {phase}: {title}</h3>
        <p className="text-surface-300 mb-4">{description}</p>
        <ul className={`space-y-2 ${isLeft ? 'lg:text-right' : 'lg:text-left'}`}>
          {milestones.map((milestone, index) => (
            <li key={index} className="text-surface-300 text-sm flex items-center gap-2 justify-center lg:justify-start">
              {!isLeft && <Sparkles className="w-4 h-4 text-ghana-gold" />}
              {milestone}
              {isLeft && <Sparkles className="w-4 h-4 text-ghana-gold lg:order-first" />}
            </li>
          ))}
        </ul>
      </div>

      {/* Center node */}
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-ghana-green to-ghana-green/70 flex items-center justify-center shadow-lg shadow-ghana-green/30"
        >
          <span className="text-2xl font-bold text-white">{phase}</span>
        </motion.div>
      </div>

      {/* Empty space for alignment */}
      <div className="flex-1 hidden lg:block" />
    </motion.div>
  );
}

// ===== INTERACTIVE ROI CALCULATOR =====
function ROICalculator() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [investment, setInvestment] = useState(3750000); // Default to Gold tier
  const [selectedTier, setSelectedTier] = useState<string>('gold');

  const tiers = [
    { id: 'bronze', name: 'Bronze', min: 750000, color: 'from-amber-600 to-orange-400' },
    { id: 'silver', name: 'Silver', min: 1500000, color: 'from-gray-400 to-gray-300' },
    { id: 'gold', name: 'Gold', min: 3750000, color: 'from-ghana-gold to-yellow-300' },
    { id: 'platinum', name: 'Platinum', min: 7500000, color: 'from-slate-300 to-white' },
  ];

  // Calculate ROI metrics based on investment
  const calculateROI = (amount: number) => {
    const baseImpressions = 500000; // Civil servants reached
    const certificateLogos = amount >= 3750000 ? 500000 : amount >= 1500000 ? 250000 : 0;
    const brandExposureMonths = 60; // 5 years
    const estimatedMediaValue = amount * 2.5; // 2.5x media value multiplier
    const governmentConnections = amount >= 7500000 ? 50 : amount >= 3750000 ? 30 : amount >= 1500000 ? 15 : 5;
    const launchEventRole = amount >= 7500000 ? 'Co-Host' : amount >= 3750000 ? 'VIP Speaker' : amount >= 1500000 ? 'VIP Guest' : 'Guest';

    return {
      impressions: baseImpressions,
      certificateLogos,
      brandExposureMonths,
      estimatedMediaValue,
      governmentConnections,
      launchEventRole,
    };
  };

  const roi = calculateROI(investment);

  const handleTierSelect = (tierId: string, minAmount: number) => {
    setSelectedTier(tierId);
    setInvestment(minAmount);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-surface-800/70 to-surface-900/90 rounded-3xl p-8 border border-ghana-gold/20 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-ghana-gold/20">
          <Calculator className="w-6 h-6 text-ghana-gold" />
        </div>
        <div>
          <h3 className="text-2xl font-heading font-bold text-white">Partnership Value Calculator</h3>
          <p className="text-surface-400 text-sm">See your potential return on investment</p>
        </div>
      </div>

      {/* Tier Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => handleTierSelect(tier.id, tier.min)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedTier === tier.id
                ? 'border-ghana-gold bg-ghana-gold/10 scale-105'
                : 'border-white/10 hover:border-white/30 bg-white/5'
            }`}
          >
            <div className={`text-lg font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
              {tier.name}
            </div>
            <div className="text-surface-400 text-sm mt-1">
              GHS {(tier.min / 1000000).toFixed(tier.min >= 1000000 ? 2 : 1)}M+
            </div>
            {selectedTier === tier.id && (
              <motion.div
                layoutId="tier-indicator"
                className="absolute -top-1 -right-1 w-4 h-4 bg-ghana-gold rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-black" />
              </motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Investment Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-surface-300 text-sm font-medium">Your Investment</span>
          <span className="text-2xl font-bold text-ghana-gold">
            GHS {investment.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={750000}
          max={15000000}
          step={250000}
          value={investment}
          onChange={(e) => {
            const val = Number(e.target.value);
            setInvestment(val);
            // Auto-select tier based on slider
            if (val >= 7500000) setSelectedTier('platinum');
            else if (val >= 3750000) setSelectedTier('gold');
            else if (val >= 1500000) setSelectedTier('silver');
            else setSelectedTier('bronze');
          }}
          className="w-full h-2 bg-surface-700 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-ghana-gold [&::-webkit-slider-thumb]:to-yellow-300
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-ghana-gold/30 [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <div className="flex justify-between text-xs text-surface-500 mt-2">
          <span>GHS 750K</span>
          <span>GHS 15M</span>
        </div>
      </div>

      {/* ROI Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <motion.div
          key={`impressions-${investment}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <Users className="w-5 h-5 text-ghana-green mb-2" />
          <div className="text-2xl font-bold text-white">{roi.impressions.toLocaleString()}+</div>
          <div className="text-xs text-surface-400">Civil Servants Reached</div>
        </motion.div>

        <motion.div
          key={`certificates-${investment}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <Award className="w-5 h-5 text-ghana-gold mb-2" />
          <div className="text-2xl font-bold text-white">{roi.certificateLogos.toLocaleString()}</div>
          <div className="text-xs text-surface-400">Certificate Logo Impressions</div>
        </motion.div>

        <motion.div
          key={`media-${investment}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <TrendingUp className="w-5 h-5 text-ghana-green mb-2" />
          <div className="text-2xl font-bold text-white">GHS {(roi.estimatedMediaValue / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-surface-400">Estimated Media Value</div>
        </motion.div>

        <motion.div
          key={`connections-${investment}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <Building2 className="w-5 h-5 text-ghana-gold mb-2" />
          <div className="text-2xl font-bold text-white">{roi.governmentConnections}+</div>
          <div className="text-xs text-surface-400">MDA Connections</div>
        </motion.div>

        <motion.div
          key={`exposure-${investment}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <Calendar className="w-5 h-5 text-ghana-green mb-2" />
          <div className="text-2xl font-bold text-white">{roi.brandExposureMonths}</div>
          <div className="text-xs text-surface-400">Months Brand Exposure</div>
        </motion.div>

        <motion.div
          key={`event-${investment}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <Star className="w-5 h-5 text-ghana-gold mb-2" />
          <div className="text-2xl font-bold text-white">{roi.launchEventRole}</div>
          <div className="text-xs text-surface-400">National Launch Role</div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-surface-300 text-sm mb-4">
          Ready to maximize your impact? Let's discuss your partnership.
        </p>
        <a
          href="#schedule-meeting"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ghana-gold to-yellow-400 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-ghana-gold/30 transition-all hover:scale-105"
        >
          <CalendarClock className="w-5 h-5" />
          Schedule a Discussion
        </a>
      </div>
    </motion.div>
  );
}

// ===== LEAD CAPTURE MODAL =====
function LeadCaptureModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    tier: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call (in production, this would send to your backend)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, you'd send this data to your CRM/email service
    console.log('Lead captured:', formData);

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Trigger download after short delay
    setTimeout(() => {
      onSuccess();
      // Reset form for next time
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', company: '', phone: '', tier: '', message: '' });
        onClose();
      }, 500);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg bg-gradient-to-br from-surface-800 to-surface-900 rounded-3xl border border-ghana-gold/20 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ghana-gold/10 rounded-full blur-3xl" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-surface-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-ghana-gold/20">
                <FileText className="w-6 h-6 text-ghana-gold" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white">Download Full Proposal</h3>
                <p className="text-surface-400 text-sm">Get the complete sponsorship details</p>
              </div>
            </div>
          </div>

          {/* Form or Success State */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-surface-300 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-surface-300 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-surface-300 text-sm font-medium mb-2">
                    Company/Organization *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-surface-300 text-sm font-medium mb-2">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-surface-300 text-sm font-medium mb-2">
                  Interested Partnership Tier
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-surface-800">Select a tier...</option>
                  <option value="platinum" className="bg-surface-800">Platinum (GHS 7.5M+)</option>
                  <option value="gold" className="bg-surface-800">Gold (GHS 3.75M+)</option>
                  <option value="silver" className="bg-surface-800">Silver (GHS 1.5M+)</option>
                  <option value="bronze" className="bg-surface-800">Bronze (GHS 750K+)</option>
                  <option value="exploring" className="bg-surface-800">Still exploring options</option>
                </select>
              </div>

              <div>
                <label className="block text-surface-300 text-sm font-medium mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Any questions or specific interests..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-ghana-gold to-yellow-400 text-black font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-ghana-gold/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Proposal
                  </>
                )}
              </button>

              <p className="text-center text-surface-500 text-xs">
                By submitting, you agree to receive information about the OHCS E-Library sponsorship opportunity.
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-ghana-green/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-ghana-green" />
              </motion.div>
              <h3 className="text-2xl font-heading font-bold text-white mb-2">Thank You!</h3>
              <p className="text-surface-300 mb-4">
                Your download will begin shortly. We'll be in touch soon to discuss partnership opportunities.
              </p>
              <div className="flex items-center justify-center gap-2 text-ghana-gold">
                <Download className="w-5 h-5 animate-bounce" />
                <span className="font-medium">Starting download...</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main Sponsorship Page Component
export default function Sponsorship() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Smooth scroll indicator
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Lead Capture Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Handle PDF download after lead capture
  const handleDownloadProposal = () => {
    // Create and trigger download
    const link = document.createElement('a');
    link.href = '/SPONSORSHIP_PROPOSAL.md';
    link.download = 'OHCS_E-Library_Sponsorship_Proposal.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Features data
  const features = [
    { icon: Brain, title: 'Kwame AI Assistant', description: 'Intelligent Q&A powered by document knowledge base with citations', color: 'green' as const },
    { icon: BookOpen, title: 'Document Library', description: 'Centralized repository with AI-powered search and analysis', color: 'gold' as const },
    { icon: GraduationCap, title: 'Learning Management', description: 'Complete LMS with courses, certifications, and learning paths', color: 'green' as const },
    { icon: Heart, title: 'Ayo Wellness Hub', description: 'AI counselor for mental health support and mood tracking', color: 'red' as const },
    { icon: FlaskConical, title: 'Research Lab', description: 'AI-assisted policy research with collaboration tools', color: 'gold' as const },
    { icon: Users, title: 'Collaboration Suite', description: 'Forums, real-time chat, groups, and social networking', color: 'green' as const },
    { icon: Trophy, title: 'Gamification', description: 'XP, badges, leaderboards driving engagement and recognition', color: 'gold' as const },
    { icon: Newspaper, title: 'News Aggregation', description: 'Curated Ghana news with AI summaries and text-to-speech', color: 'red' as const },
    { icon: Calendar, title: 'Events & Calendar', description: 'Event management with Ghana holidays pre-loaded', color: 'green' as const },
  ];

  // Sponsor tiers data
  const sponsorTiers = [
    {
      tier: 'Platinum',
      investment: 'GHS 7.5M+',
      icon: Crown,
      color: 'platinum' as const,
      featured: true,
      benefits: [
        'Platform branding on login & dashboard',
        '"Powered By" attribution across platform',
        'Advisory Board seat',
        'Co-host national launch event',
        'Logo on 500,000+ certificates',
        'Dedicated sponsor dashboard',
        'Priority feature requests',
      ],
    },
    {
      tier: 'Gold',
      investment: 'GHS 3.75M+',
      icon: Gem,
      color: 'gold' as const,
      benefits: [
        'Footer branding & sponsors page',
        'Steering Committee membership',
        'VIP launch event access',
        'Logo on certificates',
        'Quarterly impact reports',
        'Newsletter features',
      ],
    },
    {
      tier: 'Silver',
      investment: 'GHS 1.5M+',
      icon: Medal,
      color: 'silver' as const,
      benefits: [
        'Sponsors page listing',
        'VIP launch invitation',
        'Press release mention',
        'Annual report recognition',
        'Quarterly reviews access',
      ],
    },
    {
      tier: 'Bronze',
      investment: 'GHS 750K+',
      icon: BadgeCheck,
      color: 'bronze' as const,
      benefits: [
        'Sponsors page logo',
        'Launch event invitation',
        'Annual report mention',
        'Certificate of partnership',
      ],
    },
  ];

  // Timeline phases
  const phases = [
    {
      phase: 1,
      title: 'Foundation',
      months: 'Months 1-2',
      description: 'Infrastructure setup and pilot preparation',
      milestones: ['Production infrastructure live', 'Admin team trained', '10,000+ documents migrated'],
    },
    {
      phase: 2,
      title: 'Pilot Launch',
      months: 'Months 3-4',
      description: 'Initial MDAs go live with intensive support',
      milestones: ['3 pilot MDAs operational', 'User feedback integration', 'Feature refinements'],
    },
    {
      phase: 3,
      title: 'Expansion',
      months: 'Months 5-8',
      description: 'Systematic rollout to additional MDAs',
      milestones: ['20 MDAs onboarded', 'Train-the-trainer programs', 'Content library growth'],
    },
    {
      phase: 4,
      title: 'Full Rollout',
      months: 'Months 9-12',
      description: 'National deployment and sustainability',
      milestones: ['All 50+ MDAs live', 'National launch campaign', 'Self-sustaining operations'],
    },
  ];

  return (
    <div ref={containerRef} className="relative bg-[#0a0908] text-white overflow-hidden">
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-ghana-green/10 rounded-full blur-3xl"
          style={{ y: parallaxY }}
        />
        <motion.div
          className="absolute top-1/2 -right-32 w-96 h-96 bg-ghana-gold/10 rounded-full blur-3xl"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-ghana-red/10 rounded-full blur-3xl"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
        />
      </div>

      {/* ===== HERO SECTION ===== */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-6 py-20"
      >
        {/* Ghana flag gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ghana-green/5 to-transparent" />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(252,209,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(252,209,22,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        {/* Floating mockups */}
        <FloatingMockup delay={0.5} className="top-20 left-[10%] hidden lg:block" />
        <FloatingMockup delay={1} className="top-40 right-[10%] hidden lg:block" />
        <FloatingMockup delay={1.5} className="bottom-32 left-[15%] hidden lg:block" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Black Star */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="mb-8"
          >
            <BlackStar className="w-20 h-20 mx-auto text-ghana-gold" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-surface-200 to-white bg-clip-text text-transparent">
              Empowering Ghana's
            </span>
            <br />
            <span className="bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-red bg-clip-text text-transparent">
              Civil Service
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-surface-200 to-white bg-clip-text text-transparent">
              for the Digital Age
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-surface-300 max-w-3xl mx-auto mb-10"
          >
            Join us in transforming public service delivery through Africa's most comprehensive
            AI-powered knowledge platform
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#sponsor-tiers"
              className="group px-8 py-4 bg-gradient-to-r from-ghana-gold to-yellow-400 text-black font-bold rounded-xl shadow-lg shadow-ghana-gold/30 hover:shadow-xl hover:shadow-ghana-gold/40 transition-all hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Become a Sponsor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="https://ohcs-elibrary.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                View Platform Demo
              </span>
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-surface-500"
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== STATISTICS BAR ===== */}
      <section className="relative py-16 border-y border-white/10 bg-gradient-to-r from-ghana-green/10 via-transparent to-ghana-green/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: 500000, suffix: '+', label: 'Civil Servants' },
              { value: 50, suffix: '+', label: 'MDAs Connected' },
              { value: 108, prefix: 'GHS ', suffix: 'M+', label: 'Annual Savings' },
              { value: 99, suffix: '%', label: 'Faster Access' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-ghana-gold to-yellow-300 bg-clip-text text-transparent">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-surface-300 mt-2 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== THE OPPORTUNITY ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-ghana-red/20 text-ghana-red rounded-full text-sm font-medium mb-6">
              THE OPPORTUNITY
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              A Historic Moment for{' '}
              <span className="bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-red bg-clip-text text-transparent">
                Digital Transformation
              </span>
            </h2>
            <p className="text-xl text-surface-300 max-w-3xl mx-auto">
              Ghana's civil service faces critical challenges in knowledge management, professional development,
              and cross-departmental collaboration. The OHCS E-Library is the solution.
            </p>
          </motion.div>

          {/* Challenge cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Building2,
                title: 'Information Silos',
                description: 'Critical documents scattered across 50+ MDAs with no unified access',
                stat: '2-5 days',
                statLabel: 'Average document retrieval time',
              },
              {
                icon: TrendingUp,
                title: 'Knowledge Loss',
                description: 'Institutional knowledge leaves when experienced officers retire',
                stat: '30%',
                statLabel: 'Policy duplication rate',
              },
              {
                icon: Shield,
                title: 'Wellness Gap',
                description: 'No structured mental health support for civil servants',
                stat: '0',
                statLabel: 'Current wellness programs',
              },
            ].map((challenge, index) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group bg-gradient-to-br from-surface-800/50 to-surface-900/80 rounded-2xl p-6 border border-white/10 hover:border-ghana-red/30 transition-all"
              >
                <challenge.icon className="w-10 h-10 text-ghana-red mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-surface-300 mb-4">{challenge.description}</p>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-2xl font-bold text-ghana-red">{challenge.stat}</div>
                  <div className="text-sm text-surface-400">{challenge.statLabel}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== THE SOLUTION ===== */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-ghana-green/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-ghana-green/20 text-ghana-green rounded-full text-sm font-medium mb-6">
              THE SOLUTION
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              A Complete{' '}
              <span className="bg-gradient-to-r from-ghana-green to-ghana-gold bg-clip-text text-transparent">
                Digital Ecosystem
              </span>
            </h2>
            <p className="text-xl text-surface-300 max-w-3xl mx-auto">
              Nine integrated modules working together to transform how civil servants
              access information, learn, collaborate, and thrive.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMPACT METRICS ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-ghana-gold/20 text-ghana-gold rounded-full text-sm font-medium mb-6">
              PROJECTED IMPACT
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              Transformative{' '}
              <span className="bg-gradient-to-r from-ghana-gold to-yellow-300 bg-clip-text text-transparent">
                Return on Investment
              </span>
            </h2>
          </motion.div>

          {/* Impact metrics cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { value: 108.5, prefix: 'GHS ', suffix: 'M+', label: 'Annual Efficiency Savings', icon: TrendingUp, color: 'green' },
              { value: 415, prefix: 'GHS ', suffix: 'M', label: '5-Year Net Benefit', icon: Award, color: 'gold' },
              { value: 90, suffix: '%', label: 'Training Cost Reduction', icon: GraduationCap, color: 'green' },
              { value: 6, suffix: '', label: 'UN SDGs Aligned', icon: Globe, color: 'gold' },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative group p-6 rounded-2xl bg-gradient-to-br ${
                  metric.color === 'green'
                    ? 'from-ghana-green/20 to-ghana-green/5 border-ghana-green/30'
                    : 'from-ghana-gold/20 to-ghana-gold/5 border-ghana-gold/30'
                } border backdrop-blur-xl text-center`}
              >
                <metric.icon className={`w-8 h-8 mx-auto mb-4 ${metric.color === 'green' ? 'text-ghana-green' : 'text-ghana-gold'}`} />
                <div className={`text-3xl md:text-4xl font-bold ${metric.color === 'green' ? 'text-ghana-green' : 'text-ghana-gold'}`}>
                  <AnimatedCounter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
                </div>
                <div className="text-surface-300 mt-2 font-medium">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Cost savings breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-surface-800/50 to-surface-900/80 rounded-3xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-heading font-bold mb-8 text-center text-white">
              Government Efficiency Gains
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { area: 'Document Retrieval', current: 'GHS 31M', after: 'GHS 3.1M', savings: 'GHS 27.9M' },
                { area: 'Policy Development', current: 'GHS 7.75M', after: 'GHS 1.55M', savings: 'GHS 6.2M' },
                { area: 'Training Delivery', current: 'GHS 77.5M', after: 'GHS 15.5M', savings: 'GHS 62M' },
                { area: 'Knowledge Transfer', current: 'GHS 15.5M', after: 'GHS 3.1M', savings: 'GHS 12.4M' },
              ].map((item, index) => (
                <div key={item.area} className="text-center">
                  <div className="text-surface-300 text-sm mb-2 font-medium">{item.area}</div>
                  <div className="flex items-center justify-center gap-2 text-sm mb-1">
                    <span className="text-ghana-red line-through">{item.current}</span>
                    <ArrowRight className="w-4 h-4 text-surface-500" />
                    <span className="text-ghana-green">{item.after}</span>
                  </div>
                  <div className="text-xl font-bold text-ghana-gold">{item.savings}</div>
                  <div className="text-xs text-surface-400">Annual Savings</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ROI CALCULATOR ===== */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-ghana-green/5 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-ghana-gold/20 text-ghana-gold rounded-full text-sm font-medium mb-6">
              CALCULATE YOUR IMPACT
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              See Your{' '}
              <span className="bg-gradient-to-r from-ghana-gold to-yellow-300 bg-clip-text text-transparent">
                Partnership Value
              </span>
            </h2>
            <p className="text-xl text-surface-300 max-w-2xl mx-auto">
              Use our interactive calculator to explore the benefits and exposure your organization will receive.
            </p>
          </motion.div>

          <ROICalculator />
        </div>
      </section>

      {/* ===== SPONSOR TIERS ===== */}
      <section id="sponsor-tiers" className="relative py-24 px-6 bg-gradient-to-b from-transparent via-ghana-gold/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-ghana-gold/20 text-ghana-gold rounded-full text-sm font-medium mb-6">
              PARTNERSHIP OPPORTUNITIES
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-ghana-gold to-yellow-300 bg-clip-text text-transparent">
                Partnership Level
              </span>
            </h2>
            <p className="text-xl text-surface-300 max-w-3xl mx-auto">
              Join an exclusive group of partners transforming Ghana's public sector.
              Every tier offers meaningful impact and recognition.
            </p>
          </motion.div>

          {/* Sponsor tier cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {sponsorTiers.map((tier, index) => (
              <SponsorTierCard
                key={tier.tier}
                {...tier}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SPONSOR BENEFITS ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-ghana-green/20 text-ghana-green rounded-full text-sm font-medium mb-6">
              WHY SPONSOR
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              Strategic{' '}
              <span className="bg-gradient-to-r from-ghana-green to-ghana-gold bg-clip-text text-transparent">
                Partner Benefits
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Star,
                title: 'Brand Visibility',
                description: 'Logo exposure to 500,000+ civil servants across 50+ government entities',
                highlights: ['Platform branding', 'Certificate logos', 'Launch event recognition'],
              },
              {
                icon: Handshake,
                title: 'Strategic Access',
                description: 'Direct relationships with government leadership and decision-makers',
                highlights: ['Advisory Board seat', 'MDA introductions', 'Policy influence'],
              },
              {
                icon: TrendingUp,
                title: 'Business Development',
                description: 'Insights into government digital transformation needs and opportunities',
                highlights: ['Market intelligence', 'Procurement insight', 'Reference projects'],
              },
              {
                icon: Globe,
                title: 'CSR & ESG Impact',
                description: 'Demonstrable social impact aligned with UN Sustainable Development Goals',
                highlights: ['6 SDGs aligned', 'Impact metrics', 'ESG reporting'],
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-gradient-to-br from-surface-800/50 to-surface-900/80 border border-white/10 hover:border-ghana-green/30 transition-all"
              >
                <div className="inline-flex p-3 rounded-xl bg-ghana-green/20 mb-4">
                  <benefit.icon className="w-6 h-6 text-ghana-green" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-surface-300 text-sm mb-4">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm text-surface-300">
                      <Check className="w-4 h-4 text-ghana-gold" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMPLEMENTATION TIMELINE ===== */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-surface-900/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-ghana-gold/20 text-ghana-gold rounded-full text-sm font-medium mb-6">
              IMPLEMENTATION ROADMAP
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              12-Month{' '}
              <span className="bg-gradient-to-r from-ghana-gold to-yellow-300 bg-clip-text text-transparent">
                Journey to Impact
              </span>
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-ghana-green via-ghana-gold to-ghana-red hidden lg:block" />

            <div className="space-y-12">
              {phases.map((phase, index) => (
                <TimelinePhase
                  key={phase.phase}
                  {...phase}
                  isLeft={index % 2 === 0}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SCHEDULE A MEETING ===== */}
      <section id="schedule-meeting" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-ghana-green/20 text-ghana-green rounded-full text-sm font-medium mb-6">
              LET'S CONNECT
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              Schedule a{' '}
              <span className="bg-gradient-to-r from-ghana-green to-ghana-gold bg-clip-text text-transparent">
                Partnership Discussion
              </span>
            </h2>
            <p className="text-xl text-surface-300 max-w-2xl mx-auto">
              Book a 30-minute call with our team to explore how your organization can be part of this historic initiative.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-surface-800/70 to-surface-900/90 rounded-3xl border border-ghana-green/20 overflow-hidden"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left side - Info */}
              <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-ghana-green/20">
                    <CalendarClock className="w-6 h-6 text-ghana-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-white">Partnership Consultation</h3>
                    <p className="text-surface-400 text-sm">30 minutes</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-ghana-gold flex-shrink-0 mt-0.5" />
                    <span className="text-surface-300">Learn about partnership tiers and benefits</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-ghana-gold flex-shrink-0 mt-0.5" />
                    <span className="text-surface-300">Get a personalized ROI projection</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-ghana-gold flex-shrink-0 mt-0.5" />
                    <span className="text-surface-300">See a live platform demonstration</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-ghana-gold flex-shrink-0 mt-0.5" />
                    <span className="text-surface-300">Discuss custom partnership arrangements</span>
                  </div>
                </div>

                <div className="p-4 bg-ghana-gold/10 rounded-xl border border-ghana-gold/20">
                  <p className="text-sm text-surface-300">
                    <span className="text-ghana-gold font-semibold">Limited founding partner slots available.</span>{' '}
                    Founding partners receive maximum visibility at the national launch event.
                  </p>
                </div>
              </div>

              {/* Right side - Booking Options */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="text-center mb-8">
                  <p className="text-surface-400 text-sm mb-6">Choose your preferred way to connect</p>
                </div>

                <div className="space-y-4">
                  {/* Cal.com Booking Button */}
                  <a
                    href="https://cal.com/osborn-hodges-fm7fyx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full py-4 px-6 bg-gradient-to-r from-ghana-green to-ghana-green/80 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-ghana-green/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <CalendarClock className="w-5 h-5" />
                    Book a Meeting Online
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-surface-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <a
                    href="mailto:rsimd@ohcs.gov.gh?subject=OHCS E-Library Partnership Meeting Request&body=Hello,%0A%0AI would like to schedule a meeting to discuss partnership opportunities for the OHCS E-Library project.%0A%0APreferred meeting times:%0A-%0A-%0A%0AOrganization:%0AName:%0APhone:%0A%0AThank you."
                    className="group w-full py-4 px-6 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                  >
                    <Mail className="w-5 h-5" />
                    Email to Schedule
                  </a>

                  <a
                    href="tel:+233505982361"
                    className="group w-full py-4 px-6 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                  >
                    <Phone className="w-5 h-5" />
                    Call: +233 505 982 361
                  </a>
                </div>

                <p className="text-center text-surface-500 text-xs mt-6">
                  Response within 24 hours on business days
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-ghana-green via-ghana-green/80 to-ghana-green/60" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

            {/* Golden accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-ghana-gold/20 rounded-full blur-3xl" />

            <div className="relative z-10 p-8 md:p-12 text-center">
              <BlackStar className="w-16 h-16 mx-auto text-ghana-gold mb-6" animate={false} />

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Be Part of History
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join us in building Africa's most comprehensive civil service digital platform.
                Your partnership will empower 500,000+ public servants and transform governance in Ghana.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <a
                  href="#schedule-meeting"
                  className="group px-8 py-4 bg-ghana-gold text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                >
                  <CalendarClock className="w-5 h-5" />
                  Schedule a Meeting
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Full Proposal
                </button>
              </div>

              {/* Contact info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70 text-sm">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  rsimd@ohcs.gov.gh
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  OHCS, Ministries, Accra, Ghana
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BlackStar className="w-8 h-8 text-ghana-gold" animate={false} />
            <span className="text-xl font-heading font-bold text-white">OHCS E-Library</span>
          </div>
          <p className="text-surface-400 mb-6">
            Empowering Ghana's Civil Service for the Digital Age
          </p>
          <div className="flex items-center justify-center gap-6">
            <a href="https://ohcs-elibrary.pages.dev" target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-ghana-gold transition-colors flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Platform Demo
            </a>
            <a href="https://ohcs.gov.gh/" target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-ghana-gold transition-colors flex items-center gap-2">
              <Globe className="w-4 h-4" />
              OHCS Website
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-surface-400 text-sm">
            <p>&copy; {Math.max(2026, new Date().getFullYear())} Office of the Head of Civil Service, Ghana. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={handleDownloadProposal}
      />
    </div>
  );
}
