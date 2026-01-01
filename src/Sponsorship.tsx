import { useRef, useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';

// Lazy load heavy components for better performance
const GhanaGlobe = lazy(() => import('./components/GhanaGlobe'));
const BrandingPreview = lazy(() => import('./components/BrandingPreview'));
const DataVisualization = lazy(() => import('./components/DataVisualization'));
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

// ===== LOADING SCREEN COMPONENT =====
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-[#0a0908] flex flex-col items-center justify-center"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(252,209,22,0.15) 0%, rgba(0,107,63,0.1) 50%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading star */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-24 h-24 text-ghana-gold loading-star"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <polygon
          points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
          fill="currentColor"
        />
      </motion.svg>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <h2 className="text-2xl font-heading font-bold text-white mb-2">OHCS E-Library</h2>
        <p className="text-surface-400 text-sm">Empowering Ghana's Civil Service</p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="mt-8 w-48 h-1 bg-surface-800 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-red rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

// ===== TYPEWRITER TEXT COMPONENT =====
function TypewriterText({
  texts,
  className = '',
}: {
  texts: string[];
  className?: string;
}) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < text.length) {
            setCurrentText(text.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(text.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts]);

  return (
    <span className={className}>
      {currentText}
      <span className="typewriter-cursor" />
    </span>
  );
}

// ===== CONFETTI COMPONENT =====
function Confetti({ isActive }: { isActive: boolean }) {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; color: string; delay: number; size: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const colors = ['#006B3F', '#FCD116', '#CE1126', '#ffffff'];
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 6,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => setPieces([]), 3500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive && pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            animationDelay: `${piece.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

// ===== MAGNETIC BUTTON WRAPPER =====
function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  target,
  rel,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}) {
  const buttonRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.2;
    const distanceY = (e.clientY - centerY) * 0.2;
    setPosition({ x: distanceX, y: distanceY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
  };

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={`magnetic-btn inline-block ${className}`}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      className={`magnetic-btn ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

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
      glow: 'shadow-slate-300/30',
      icon: 'text-slate-200',
      bg: 'from-slate-800/50 to-slate-900/80',
      accent: '#e2e8f0',
      particle: 'bg-slate-300',
    },
    gold: {
      gradient: 'from-ghana-gold via-yellow-300 to-ghana-gold',
      border: 'border-ghana-gold/50',
      glow: 'shadow-ghana-gold/30',
      icon: 'text-ghana-gold',
      bg: 'from-yellow-900/30 to-amber-900/50',
      accent: '#FCD116',
      particle: 'bg-ghana-gold',
    },
    silver: {
      gradient: 'from-gray-400 via-gray-300 to-gray-400',
      border: 'border-gray-400/50',
      glow: 'shadow-gray-400/30',
      icon: 'text-gray-300',
      bg: 'from-gray-800/50 to-gray-900/80',
      accent: '#9ca3af',
      particle: 'bg-gray-400',
    },
    bronze: {
      gradient: 'from-amber-600 via-orange-400 to-amber-600',
      border: 'border-amber-600/50',
      glow: 'shadow-amber-600/30',
      icon: 'text-amber-500',
      bg: 'from-amber-900/30 to-orange-900/50',
      accent: '#d97706',
      particle: 'bg-amber-500',
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
      className={`relative group ${featured ? 'lg:-mt-8 lg:mb-8 z-10' : ''}`}
    >
      {/* Featured badge with animation */}
      {featured && (
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
        >
          <motion.span
            className="px-5 py-1.5 bg-gradient-to-r from-ghana-gold via-yellow-400 to-ghana-gold text-black text-xs font-bold rounded-full shadow-lg shadow-ghana-gold/30 flex items-center gap-1.5"
            animate={{ boxShadow: ['0 10px 40px rgba(252,209,22,0.3)', '0 10px 60px rgba(252,209,22,0.5)', '0 10px 40px rgba(252,209,22,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-3 h-3" />
            RECOMMENDED
          </motion.span>
        </motion.div>
      )}

      <div className={`relative overflow-hidden rounded-3xl ${config.border} border-2 bg-gradient-to-br ${config.bg} backdrop-blur-xl transition-all duration-500 ${featured ? 'shadow-2xl ' + config.glow : ''} hover:shadow-2xl`}>
        {/* Animated rotating border glow for featured */}
        {featured && (
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${config.accent}40, transparent, ${config.accent}20, transparent)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Inner background */}
        <div className={`absolute inset-[2px] rounded-3xl bg-gradient-to-br ${config.bg}`} />

        {/* Floating particles on hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1.5 h-1.5 rounded-full ${config.particle}`}
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: `${20 + Math.random() * 60}%`,
                    y: `${10 + Math.random() * 80}%`,
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0.5],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 2,
                    delay: i * 0.15,
                    repeat: Infinity,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Animated gradient border effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '200%' } : { x: '-100%' }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className={`p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10`}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            >
              <Icon className={`w-8 h-8 ${config.icon}`} />
            </motion.div>
            <motion.div
              animate={isHovered ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <BlackStar className={`w-8 h-8 ${config.icon}`} animate={false} />
            </motion.div>
          </div>
          <h3 className={`text-2xl font-heading font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {tier}
          </h3>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold text-white">{investment}</span>
          </div>
          {featured && (
            <motion.p
              className="text-xs text-surface-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 }}
            >
              Maximum visibility & exclusive benefits
            </motion.p>
          )}
        </div>

        {/* Benefits with enhanced styling */}
        <div className="relative p-6 space-y-3">
          <AnimatePresence>
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: delay + 0.1 * index }}
                className="flex items-start gap-3 group/item"
              >
                <motion.div
                  className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r ${config.gradient}`}
                  whileHover={{ scale: 1.2 }}
                >
                  <Check className="w-3 h-3 text-black" />
                </motion.div>
                <span className="text-surface-300 text-sm group-hover/item:text-white transition-colors">{benefit}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Enhanced CTA */}
        <div className="relative p-6 pt-0">
          <motion.a
            href="#schedule-meeting"
            className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all duration-300 bg-gradient-to-r ${config.gradient} text-black hover:shadow-lg relative overflow-hidden`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Become a Partner
              <ArrowRight className="w-4 h-4" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.a>
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

// ===== ENHANCED ROI CALCULATOR =====

// Floating particles for ROI Calculator background
function ROIFloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-ghana-gold/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
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

// Animated grid pattern for ROI background
function ROIGridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="roi-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ghana-gold" />
          </pattern>
          <linearGradient id="roi-grid-fade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.5" />
          </linearGradient>
          <mask id="roi-grid-mask">
            <rect width="100%" height="100%" fill="url(#roi-grid-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#roi-grid)" mask="url(#roi-grid-mask)" />
      </svg>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-ghana-gold/0 via-ghana-gold/20 to-ghana-gold/0"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Pulse ring effect for investment amount
function InvestmentPulseRings() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-xl border border-ghana-gold/30"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
          transition={{
            duration: 2,
            delay: i * 0.7,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Enhanced result card with glow and particles
function EnhancedResultCard({
  icon: Icon,
  value,
  label,
  color,
  delay,
  investment,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  color: 'green' | 'gold';
  delay: number;
  investment: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const iconColor = color === 'gold' ? 'text-ghana-gold' : 'text-ghana-green';
  const glowColor = color === 'gold' ? 'shadow-ghana-gold/30' : 'shadow-ghana-green/30';
  const borderColor = color === 'gold' ? 'border-ghana-gold/30' : 'border-ghana-green/30';

  return (
    <motion.div
      key={`result-${investment}-${label}`}
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group bg-gradient-to-br from-white/10 to-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border ${borderColor} backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:${glowColor}`}
    >
      {/* Animated background glow */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color === 'gold' ? 'from-ghana-gold/20 to-transparent' : 'from-ghana-green/20 to-transparent'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6 }}
      />

      {/* Floating mini particles */}
      {isHovered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${color === 'gold' ? 'bg-ghana-gold' : 'bg-ghana-green'}`}
              initial={{
                x: Math.random() * 100,
                y: 80,
                opacity: 0
              }}
              animate={{
                y: -20,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Icon with pulse effect */}
      <div className="relative">
        <motion.div
          animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor} mb-1 sm:mb-2 relative z-10`} />
        </motion.div>
        {isHovered && (
          <motion.div
            className={`absolute -inset-2 rounded-full ${color === 'gold' ? 'bg-ghana-gold/20' : 'bg-ghana-green/20'} blur-md`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Value with counting animation feel */}
      <motion.div
        className="text-lg sm:text-2xl font-bold text-white relative z-10"
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
      >
        {value}
      </motion.div>
      <div className="text-[10px] sm:text-xs text-surface-400 relative z-10">{label}</div>

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-8 h-8 ${color === 'gold' ? 'bg-ghana-gold/10' : 'bg-ghana-green/10'} rounded-bl-full`} />
    </motion.div>
  );
}

// Enhanced tier button with glow effects
function EnhancedTierButton({
  tier,
  isSelected,
  onSelect,
}: {
  tier: { id: string; name: string; min: number; color: string; icon: React.ElementType };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = tier.icon;

  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-ghana-gold bg-ghana-gold/15 shadow-lg shadow-ghana-gold/20'
          : 'border-white/10 hover:border-white/30 bg-white/5'
      }`}
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${tier.color.replace('from-', 'from-').replace('to-', 'to-')}/20`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSelected || isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Rotating border glow for selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl sm:rounded-2xl"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${tier.id === 'gold' ? '#FCD116' : tier.id === 'platinum' ? '#e2e8f0' : tier.id === 'silver' ? '#9ca3af' : '#d97706'}40, transparent)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Inner content background */}
      <div className={`absolute inset-[2px] rounded-xl sm:rounded-2xl ${isSelected ? 'bg-surface-900/90' : 'bg-transparent'}`} />

      {/* Icon */}
      <motion.div
        className="relative z-10 mb-1"
        animate={isSelected ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto bg-gradient-to-r ${tier.color} bg-clip-text`} style={{ color: tier.id === 'gold' ? '#FCD116' : tier.id === 'platinum' ? '#e2e8f0' : tier.id === 'silver' ? '#9ca3af' : '#d97706' }} />
      </motion.div>

      {/* Tier name */}
      <div className={`relative z-10 text-sm sm:text-lg font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
        {tier.name}
      </div>

      {/* Investment amount */}
      <div className="relative z-10 text-surface-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
        GHS {(tier.min / 1000000).toFixed(tier.min >= 1000000 ? 2 : 1)}M+
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          layoutId="roi-tier-indicator"
          className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-ghana-gold to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-ghana-gold/50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
        </motion.div>
      )}

      {/* Sparkle effects on hover */}
      {(isHovered || isSelected) && (
        <>
          <motion.div
            className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="absolute bottom-2 right-2 w-1 h-1 bg-white rounded-full"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
    </motion.button>
  );
}

function ROICalculator() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [investment, setInvestment] = useState(3750000); // Default to Gold tier
  const [selectedTier, setSelectedTier] = useState<string>('gold');
  const [sliderHovered, setSliderHovered] = useState(false);

  const tiers = [
    { id: 'bronze', name: 'Bronze', min: 750000, color: 'from-amber-600 to-orange-400', icon: Medal },
    { id: 'silver', name: 'Silver', min: 1500000, color: 'from-gray-400 to-gray-300', icon: Award },
    { id: 'gold', name: 'Gold', min: 3750000, color: 'from-ghana-gold to-yellow-300', icon: Crown },
    { id: 'platinum', name: 'Platinum', min: 7500000, color: 'from-slate-300 to-white', icon: Gem },
  ];

  // Calculate ROI metrics based on investment
  const calculateROI = (amount: number) => {
    const baseImpressions = 93000; // Civil servants reached
    const certificateLogos = amount >= 3750000 ? 93000 : amount >= 1500000 ? 46000 : 0;
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

  // Calculate slider fill percentage
  const sliderPercent = ((investment - 750000) / (15000000 - 750000)) * 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-surface-800/80 to-surface-900/95 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-ghana-gold/30 backdrop-blur-xl overflow-hidden"
    >
      {/* Background effects */}
      <ROIFloatingParticles />
      <ROIGridPattern />

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-2 left-2 w-8 h-[2px] bg-gradient-to-r from-ghana-gold to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-2 left-2 w-[2px] h-8 bg-gradient-to-b from-ghana-gold to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute bottom-2 right-2 w-8 h-[2px] bg-gradient-to-l from-ghana-gold to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-2 right-2 w-[2px] h-8 bg-gradient-to-t from-ghana-gold to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Header with enhanced styling */}
      <div className="relative z-10 flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <motion.div
          className="relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-ghana-gold/30 to-ghana-gold/10 border border-ghana-gold/30"
          animate={{
            boxShadow: ['0 0 20px rgba(252,209,22,0.2)', '0 0 40px rgba(252,209,22,0.4)', '0 0 20px rgba(252,209,22,0.2)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-ghana-gold" />
          {/* Orbiting dot */}
          <motion.div
            className="absolute w-2 h-2 bg-ghana-gold rounded-full"
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 -20px',
            }}
          />
        </motion.div>
        <div>
          <motion.h3
            className="text-lg sm:text-xl md:text-2xl font-heading font-bold bg-gradient-to-r from-white via-ghana-gold to-white bg-clip-text text-transparent bg-[length:200%_auto]"
            animate={{ backgroundPosition: ['0% center', '200% center'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            Partnership Value Calculator
          </motion.h3>
          <p className="text-surface-400 text-xs sm:text-sm flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-ghana-gold" />
            See your potential return on investment
          </p>
        </div>
      </div>

      {/* Enhanced Tier Selection */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {tiers.map((tier) => (
          <EnhancedTierButton
            key={tier.id}
            tier={tier}
            isSelected={selectedTier === tier.id}
            onSelect={() => handleTierSelect(tier.id, tier.min)}
          />
        ))}
      </div>

      {/* Enhanced Investment Slider */}
      <div className="relative z-10 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
          <span className="text-surface-300 text-sm sm:text-base font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-ghana-green" />
            Your Investment
          </span>
          <motion.div
            className="relative"
            animate={sliderHovered ? { scale: 1.05 } : { scale: 1 }}
          >
            <InvestmentPulseRings />
            <motion.span
              key={investment}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-ghana-gold via-yellow-300 to-ghana-gold bg-clip-text text-transparent px-4 py-2 rounded-xl bg-ghana-gold/10 border border-ghana-gold/20"
            >
              GHS {investment.toLocaleString()}
            </motion.span>
          </motion.div>
        </div>

        {/* Custom styled slider container */}
        <div
          className="relative h-12 flex items-center"
          onMouseEnter={() => setSliderHovered(true)}
          onMouseLeave={() => setSliderHovered(false)}
        >
          {/* Track background with gradient fill */}
          <div className="absolute inset-x-0 h-3 bg-surface-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-ghana-green via-ghana-gold to-yellow-300 rounded-full"
              style={{ width: `${sliderPercent}%` }}
              layoutId="slider-fill"
            />
            {/* Animated shimmer on track */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Tier markers on track */}
          {tiers.map((tier) => {
            const percent = ((tier.min - 750000) / (15000000 - 750000)) * 100;
            return (
              <motion.div
                key={tier.id}
                className={`absolute w-2 h-2 rounded-full transition-all duration-300 ${
                  investment >= tier.min ? 'bg-white shadow-lg' : 'bg-surface-600'
                }`}
                style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
                animate={investment >= tier.min ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            );
          })}

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
            className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          />

          {/* Custom thumb */}
          <motion.div
            className="absolute w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-ghana-gold to-yellow-400 rounded-full shadow-lg shadow-ghana-gold/50 pointer-events-none flex items-center justify-center"
            style={{ left: `${sliderPercent}%`, transform: 'translateX(-50%)' }}
            animate={sliderHovered ? { scale: 1.2 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="w-2 h-2 bg-black/30 rounded-full"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </div>

        <div className="flex justify-between text-xs text-surface-500 mt-3">
          <span className="flex items-center gap-1">
            <Medal className="w-3 h-3 text-amber-500" />
            GHS 750K
          </span>
          <span className="flex items-center gap-1">
            <Gem className="w-3 h-3 text-slate-300" />
            GHS 15M
          </span>
        </div>
      </div>

      {/* Enhanced ROI Results */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <EnhancedResultCard
          icon={Users}
          value={`${roi.impressions.toLocaleString()}+`}
          label="Civil Servants Reached"
          color="green"
          delay={0}
          investment={investment}
        />
        <EnhancedResultCard
          icon={Award}
          value={roi.certificateLogos.toLocaleString()}
          label="Certificate Logo Impressions"
          color="gold"
          delay={0.1}
          investment={investment}
        />
        <EnhancedResultCard
          icon={TrendingUp}
          value={`GHS ${(roi.estimatedMediaValue / 1000000).toFixed(1)}M`}
          label="Estimated Media Value"
          color="green"
          delay={0.2}
          investment={investment}
        />
        <EnhancedResultCard
          icon={Building2}
          value={`${roi.governmentConnections}+`}
          label="MDA Connections"
          color="gold"
          delay={0.3}
          investment={investment}
        />
        <EnhancedResultCard
          icon={Calendar}
          value={roi.brandExposureMonths.toString()}
          label="Months Brand Exposure"
          color="green"
          delay={0.4}
          investment={investment}
        />
        <EnhancedResultCard
          icon={Star}
          value={roi.launchEventRole}
          label="National Launch Role"
          color="gold"
          delay={0.5}
          investment={investment}
        />
      </div>

      {/* Enhanced CTA */}
      <div className="relative z-10 mt-8 sm:mt-10 text-center">
        <motion.p
          className="text-surface-300 text-sm sm:text-base mb-4 sm:mb-5"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          Ready to maximize your impact? Let's discuss your partnership.
        </motion.p>
        <motion.a
          href="#schedule-meeting"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-ghana-gold via-yellow-400 to-ghana-gold bg-[length:200%_auto] text-black font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-ghana-gold/30 overflow-hidden group"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-ghana-gold via-yellow-400 to-ghana-gold bg-[length:200%_auto]"
            animate={{ backgroundPosition: ['0% center', '200% center'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />

          <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
          <span className="relative z-10 text-sm sm:text-base">Schedule a Discussion</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        </motion.a>
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
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] bg-gradient-to-br from-surface-800 to-surface-900 rounded-2xl sm:rounded-3xl border border-ghana-gold/20 shadow-2xl flex flex-col min-h-0"
        >
          {/* Header */}
          <div className="relative p-4 sm:p-6 sm:pb-4 border-b border-white/10 flex-shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ghana-gold/10 rounded-full blur-3xl" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-5 h-5 text-surface-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-ghana-gold/20">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-ghana-gold" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-white">Download Full Proposal</h3>
                <p className="text-surface-400 text-xs sm:text-sm">Get the complete sponsorship details</p>
              </div>
            </div>
          </div>

          {/* Form or Success State */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-surface-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
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
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-sm sm:text-base text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-surface-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
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
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-sm sm:text-base text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-surface-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
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
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-sm sm:text-base text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-surface-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-sm sm:text-base text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-surface-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Interested Partnership Tier
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-sm sm:text-base text-white focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all appearance-none cursor-pointer"
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
                <label className="block text-surface-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Any questions or specific interests..."
                  rows={2}
                  className="w-full px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-sm sm:text-base text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-ghana-gold to-yellow-400 text-black font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-ghana-gold/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
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

  // Loading screen state
  const [isLoading, setIsLoading] = useState(true);

  // Lead Capture Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle PDF download after lead capture
  const handleDownloadProposal = () => {
    // Trigger confetti celebration
    setShowConfetti(true);

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
        'Logo on 93,000+ certificates',
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
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Confetti Celebration */}
      <Confetti isActive={showConfetti} />

      {/* Premium Noise Texture Overlay */}
      <div className="noise-overlay" />

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

          {/* Subtitle with typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-surface-300 max-w-3xl mx-auto mb-10"
          >
            <span>Join us in transforming public service delivery through </span>
            <TypewriterText
              texts={[
                "Africa's most comprehensive AI platform",
                "intelligent knowledge management",
                "digital transformation excellence",
                "the future of governance",
              ]}
              className="text-ghana-gold font-semibold"
            />
          </motion.div>

          {/* CTA buttons with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              href="#sponsor-tiers"
              className="group px-8 py-4 btn-animated-gradient text-black font-bold rounded-xl shadow-lg shadow-ghana-gold/30 hover:shadow-xl hover:shadow-ghana-gold/40 transition-all hover:scale-105"
            >
              <span className="flex items-center gap-2 relative z-10">
                Become a Sponsor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>
            <motion.button
              onClick={() => setIsLeadModalOpen(true)}
              className="group px-8 py-4 bg-gradient-to-r from-surface-800 to-surface-700 text-white font-semibold rounded-xl border border-ghana-gold/30 hover:border-ghana-gold/50 transition-all shadow-lg hover:shadow-ghana-gold/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2 relative z-10">
                <Download className="w-5 h-5 text-ghana-gold" />
                Download Sponsor Deck
              </span>
            </motion.button>
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
              { value: 93000, suffix: '+', label: 'Civil Servants' },
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

      {/* ===== INTERACTIVE GLOBE ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-ghana-gold/20 text-ghana-gold rounded-full text-sm font-medium mb-6">
              NATIONWIDE REACH
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              Connecting{' '}
              <span className="bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-red bg-clip-text text-transparent">
                All of Ghana
              </span>
            </h2>
            <p className="text-xl text-surface-300 max-w-3xl mx-auto">
              One unified platform connecting every Ministry, Department, and Agency across the nation.
              Explore the network of government institutions that will be transformed.
            </p>
          </motion.div>

          {/* 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Suspense fallback={
              <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-ghana-gold/30 border-t-ghana-gold rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-surface-400">Loading 3D Globe...</p>
                </div>
              </div>
            }>
              <GhanaGlobe />
            </Suspense>
          </motion.div>
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

      {/* ===== ANIMATED DATA VISUALIZATION ===== */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-ghana-green/5 via-transparent to-ghana-gold/5">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-ghana-green/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ghana-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-ghana-red/20 text-ghana-red rounded-full text-sm font-medium mb-6">
              LIVE DATA INSIGHTS
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              Impact by the{' '}
              <span className="bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-red bg-clip-text text-transparent">
                Numbers
              </span>
            </h2>
            <p className="text-xl text-surface-300 max-w-3xl mx-auto">
              Watch the projected impact come to life with real-time visualizations
              of efficiency gains, growth projections, and platform activity.
            </p>
          </motion.div>

          {/* Data Visualization Component */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Suspense fallback={
              <div className="w-full h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-ghana-gold/30 border-t-ghana-gold rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-surface-400">Loading Visualizations...</p>
                </div>
              </div>
            }>
              <DataVisualization />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* ===== ENDORSEMENTS & TESTIMONIALS ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-ghana-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-ghana-green/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-ghana-gold/20 text-ghana-gold rounded-full text-sm font-medium mb-6">
              ENDORSEMENTS & SUPPORT
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              Backed by{' '}
              <span className="bg-gradient-to-r from-ghana-gold to-yellow-300 bg-clip-text text-transparent">
                Ghana's Leaders
              </span>
            </h2>
            <p className="text-xl text-surface-300 max-w-3xl mx-auto">
              Join a movement endorsed by government officials and industry leaders
              committed to transforming Ghana's public sector.
            </p>
          </motion.div>

          {/* Main endorsement card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-surface-800/80 to-surface-900/90 border border-ghana-gold/30 overflow-hidden">
              {/* Decorative quote mark */}
              <div className="absolute top-6 left-6 text-ghana-gold/10 text-[120px] font-serif leading-none">"</div>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(252,209,22,0.2), transparent, rgba(0,107,63,0.2), transparent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-[1px] bg-gradient-to-br from-surface-800/95 to-surface-900/98 rounded-3xl" />

              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                {/* Avatar/Logo */}
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-ghana-gold/30 to-ghana-green/20 border-2 border-ghana-gold/40 flex items-center justify-center shadow-xl shadow-ghana-gold/10">
                    <Building2 className="w-12 h-12 md:w-16 md:h-16 text-ghana-gold" />
                  </div>
                </motion.div>

                {/* Quote content */}
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-6">
                    "The OHCS E-Library represents a paradigm shift in how Ghana's civil service accesses knowledge.
                    This initiative will empower over 93,000 public servants with the tools they need to serve our nation better."
                  </blockquote>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div>
                      <p className="text-ghana-gold font-bold text-lg">Office of the Head of Civil Service</p>
                      <p className="text-surface-400">Government of Ghana</p>
                    </div>
                    <motion.div
                      className="hidden md:flex items-center gap-2 px-4 py-2 bg-ghana-green/20 rounded-full"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <BadgeCheck className="w-5 h-5 text-ghana-green" />
                      <span className="text-ghana-green text-sm font-medium">Official Endorsement</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Supporting testimonials grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "A groundbreaking initiative that positions Ghana as a leader in digital governance across Africa.",
                author: "Technology Advisory Board",
                role: "Digital Transformation Unit",
                icon: Globe,
                color: 'green' as const,
              },
              {
                quote: "This platform will revolutionize capacity building and knowledge sharing across all MDAs.",
                author: "Ministry of Education",
                role: "Capacity Building Division",
                icon: GraduationCap,
                color: 'gold' as const,
              },
              {
                quote: "The ROI potential for sponsors is exceptional, with unparalleled access to government stakeholders.",
                author: "Ghana Investment Promotion",
                role: "Partnership Advisory",
                icon: TrendingUp,
                color: 'green' as const,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-surface-800/60 to-surface-900/80 border border-white/10 hover:border-ghana-gold/30 transition-all"
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  testimonial.color === 'green'
                    ? 'bg-ghana-green/20'
                    : 'bg-ghana-gold/20'
                }`}>
                  <testimonial.icon className={`w-6 h-6 ${
                    testimonial.color === 'green'
                      ? 'text-ghana-green'
                      : 'text-ghana-gold'
                  }`} />
                </div>

                {/* Quote */}
                <p className="text-surface-300 text-sm leading-relaxed mb-4">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-white/10">
                  <p className={`font-semibold ${
                    testimonial.color === 'green'
                      ? 'text-ghana-green'
                      : 'text-ghana-gold'
                  }`}>{testimonial.author}</p>
                  <p className="text-surface-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-surface-500 text-sm mb-6">ALIGNED WITH NATIONAL DEVELOPMENT GOALS</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Ghana Beyond Aid', 'Digital Ghana Agenda', 'SDG 4: Education', 'SDG 16: Institutions', 'SDG 17: Partnerships'].map((badge, index) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-surface-400 text-sm hover:border-ghana-gold/30 hover:text-ghana-gold transition-all cursor-default"
                >
                  {badge}
                </motion.span>
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

      {/* ===== VIRTUAL BRANDING PREVIEW ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-ghana-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-ghana-green/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-ghana-green/20 text-ghana-green rounded-full text-sm font-medium mb-6">
              VISUALIZE YOUR IMPACT
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              See Your Brand{' '}
              <span className="bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-red bg-clip-text text-transparent">
                Come to Life
              </span>
            </h2>
            <p className="text-xl text-surface-300 max-w-3xl mx-auto">
              Enter your company details and preview exactly how your brand will appear across
              the OHCS E-Library platform, certificates, and launch events.
            </p>
          </motion.div>

          {/* Branding Preview Component */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Suspense fallback={
              <div className="w-full h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-ghana-gold/30 border-t-ghana-gold rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-surface-400">Loading Preview...</p>
                </div>
              </div>
            }>
              <BrandingPreview />
            </Suspense>
          </motion.div>
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
                description: 'Logo exposure to 93,000+ civil servants across 50+ government entities',
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

      {/* ===== ENHANCED SCHEDULE A MEETING ===== */}
      <section id="schedule-meeting" className="relative py-24 px-6 overflow-hidden">
        {/* Background floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={`schedule-particle-${i}`}
              className="absolute rounded-full bg-ghana-green/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
              }}
              animate={{
                y: [-30, 30, -30],
                x: [-15, 15, -15],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Animated background gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-ghana-green/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ghana-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {/* Enhanced badge */}
            <motion.span
              className="relative inline-block px-6 py-2 bg-gradient-to-r from-ghana-green/30 to-ghana-green/10 text-ghana-green rounded-full text-sm font-medium mb-6 border border-ghana-green/30 overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-ghana-green/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Handshake className="w-4 h-4" />
                </motion.span>
                LET'S CONNECT
              </span>
            </motion.span>

            {/* Enhanced title */}
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
              Schedule a{' '}
              <motion.span
                className="bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-green bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ['0% center', '200% center'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                Partnership Discussion
              </motion.span>
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
            className="relative bg-gradient-to-br from-surface-800/80 to-surface-900/95 rounded-3xl border border-ghana-green/30 overflow-hidden"
          >
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(0,107,63,0.3), transparent, rgba(252,209,22,0.2), transparent)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-[1px] bg-gradient-to-br from-surface-800/95 to-surface-900/98 rounded-3xl" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
              <motion.div
                className="absolute top-3 left-3 w-10 h-[2px] bg-gradient-to-r from-ghana-green to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-3 left-3 w-[2px] h-10 bg-gradient-to-b from-ghana-green to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none">
              <motion.div
                className="absolute bottom-3 right-3 w-10 h-[2px] bg-gradient-to-l from-ghana-gold to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-3 right-3 w-[2px] h-10 bg-gradient-to-t from-ghana-gold to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-0">
              {/* Left side - Info */}
              <div className="p-4 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <motion.div
                    className="relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-ghana-green/30 to-ghana-green/10 border border-ghana-green/30"
                    animate={{
                      boxShadow: ['0 0 20px rgba(0,107,63,0.2)', '0 0 40px rgba(0,107,63,0.4)', '0 0 20px rgba(0,107,63,0.2)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CalendarClock className="w-6 h-6 sm:w-8 sm:h-8 text-ghana-green" />
                    {/* Orbiting dot */}
                    <motion.div
                      className="absolute w-2 h-2 bg-ghana-green rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      style={{ top: '50%', left: '50%', transformOrigin: '0 -20px' }}
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-heading font-bold text-white">Partnership Consultation</h3>
                    <div className="flex items-center gap-2 text-surface-400 text-xs sm:text-sm">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-ghana-green"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      30 minutes • Free consultation
                    </div>
                  </div>
                </div>

                {/* Enhanced benefit list */}
                <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                  {[
                    { text: 'Learn about partnership tiers and benefits', delay: 0 },
                    { text: 'Get a personalized ROI projection', delay: 0.1 },
                    { text: 'See a live platform demonstration', delay: 0.2 },
                    { text: 'Discuss custom partnership arrangements', delay: 0.3 },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: item.delay }}
                      className="group flex items-start gap-3 sm:gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default"
                    >
                      <motion.div
                        className="relative flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-ghana-gold/30 to-ghana-gold/10 flex items-center justify-center"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Check className="w-3.5 h-3.5 text-ghana-gold" />
                        <motion.div
                          className="absolute inset-0 rounded-full border border-ghana-gold/50"
                          initial={{ scale: 1, opacity: 0 }}
                          whileHover={{ scale: 1.5, opacity: [0, 0.5, 0] }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>
                      <span className="text-surface-300 text-sm sm:text-base group-hover:text-white transition-colors">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced founding partner notice */}
                <motion.div
                  className="relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-ghana-gold/30 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-ghana-gold/20 to-ghana-gold/5" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-ghana-gold/10 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />

                  <div className="relative z-10 flex items-start gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-ghana-gold flex-shrink-0" />
                    </motion.div>
                    <p className="text-xs sm:text-sm text-surface-300">
                      <span className="text-ghana-gold font-semibold">Limited founding partner slots available.</span>{' '}
                      Founding partners receive maximum visibility at the national launch event.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Booking Options */}
              <div className="relative p-4 sm:p-8 lg:p-12 flex flex-col justify-center">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="schedule-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="15" cy="15" r="1" fill="currentColor" className="text-white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#schedule-grid)" />
                  </svg>
                </div>

                <div className="relative z-10 text-center mb-6 sm:mb-8">
                  <p className="text-surface-400 text-sm sm:text-base mb-2">Choose your preferred way to connect</p>
                  <motion.div
                    className="flex justify-center gap-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-ghana-green"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </motion.div>
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Enhanced Cal.com Booking Button */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MagneticButton
                      href="https://cal.com/osborn-hodges-fm7fyx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-full py-4 sm:py-5 px-4 sm:px-6 bg-gradient-to-r from-ghana-green to-ghana-green/80 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-ghana-green/30 transition-all flex items-center justify-center gap-2 sm:gap-3 overflow-hidden text-sm sm:text-base"
                    >
                      {/* Animated background shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      {/* Pulse rings on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-white/30"
                        initial={{ scale: 1, opacity: 0 }}
                        whileHover={{ scale: 1.05, opacity: [0, 0.5, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                      <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                      <span className="relative z-10">Book a Meeting Online</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </MagneticButton>
                  </motion.div>

                  {/* Enhanced divider */}
                  <div className="flex items-center gap-4 py-2">
                    <motion.div
                      className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    />
                    <motion.span
                      className="text-surface-500 text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10"
                      whileHover={{ scale: 1.1 }}
                    >
                      or
                    </motion.span>
                    <motion.div
                      className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>

                  {/* Enhanced Email Button */}
                  <motion.a
                    href="mailto:rsimd@ohcs.gov.gh?subject=OHCS E-Library Partnership Meeting Request&body=Hello,%0A%0AI would like to schedule a meeting to discuss partnership opportunities for the OHCS E-Library project.%0A%0APreferred meeting times:%0A-%0A-%0A%0AOrganization:%0AName:%0APhone:%0A%0AThank you."
                    className="group relative w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-white/5 text-white font-semibold rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 sm:gap-3 overflow-hidden text-sm sm:text-base"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:scale-110 transition-transform" />
                    <span className="relative z-10">Email to Schedule</span>
                  </motion.a>

                  {/* Enhanced Phone Button */}
                  <motion.a
                    href="tel:+233505982361"
                    className="group relative w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-white/5 text-white font-semibold rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 sm:gap-3 overflow-hidden text-sm sm:text-base"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.div
                      className="relative z-10"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                    <span className="relative z-10 hidden sm:inline">Call: +233 505 982 361</span>
                    <span className="relative z-10 sm:hidden">+233 505 982 361</span>
                  </motion.a>

                  {/* WhatsApp Button - Popular in Ghana */}
                  <motion.a
                    href="https://wa.me/233505982361?text=Hello%2C%20I%27m%20interested%20in%20the%20OHCS%20E-Library%20sponsorship%20opportunity.%20I%27d%20like%20to%20learn%20more%20about%20partnership%20options."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2 sm:gap-3 overflow-hidden text-sm sm:text-base"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="relative z-10">Chat on WhatsApp</span>
                    <motion.span
                      className="relative z-10 px-2 py-0.5 bg-white/20 rounded-full text-xs"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Instant
                    </motion.span>
                  </motion.a>
                </div>

                {/* Enhanced response time notice */}
                <motion.p
                  className="relative z-10 text-center text-surface-500 text-xs sm:text-sm mt-6 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.span
                    className="inline-block w-2 h-2 rounded-full bg-ghana-green"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Response within 24 hours on business days
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ENHANCED CALL TO ACTION ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={`cta-particle-${i}`}
              className={`absolute rounded-full ${i % 3 === 0 ? 'bg-ghana-gold/30' : 'bg-white/20'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
              }}
              animate={{
                y: [-40, 40, -40],
                x: [-20, 20, -20],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: Math.random() * 12 + 8,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Animated border glow */}
            <motion.div
              className="absolute -inset-[2px] rounded-3xl"
              style={{
                background: 'conic-gradient(from 0deg, #006B3F, #FCD116, #006B3F, #FCD116, #006B3F)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner container */}
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-ghana-green via-ghana-green/90 to-ghana-green/70" />

              {/* Animated mesh pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <defs>
                    <pattern id="cta-mesh" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cta-mesh)" />
                </svg>
              </div>

              {/* Animated shimmer waves */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-ghana-gold/10 to-transparent"
                animate={{ x: ['100%', '-100%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
              />

              {/* Animated golden orbs */}
              <motion.div
                className="absolute top-0 right-0 w-80 h-80 bg-ghana-gold/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                  x: [0, 20, 0],
                  y: [0, -20, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
                <motion.div
                  className="absolute top-4 left-4 w-16 h-[2px] bg-gradient-to-r from-ghana-gold to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-4 left-4 w-[2px] h-16 bg-gradient-to-b from-ghana-gold to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
                <motion.div
                  className="absolute top-4 right-4 w-16 h-[2px] bg-gradient-to-l from-ghana-gold to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute top-4 right-4 w-[2px] h-16 bg-gradient-to-b from-ghana-gold to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                />
              </div>
              <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none">
                <motion.div
                  className="absolute bottom-4 left-4 w-16 h-[2px] bg-gradient-to-r from-ghana-gold to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 w-[2px] h-16 bg-gradient-to-t from-ghana-gold to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
                />
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none">
                <motion.div
                  className="absolute bottom-4 right-4 w-16 h-[2px] bg-gradient-to-l from-ghana-gold to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
                <motion.div
                  className="absolute bottom-4 right-4 w-[2px] h-16 bg-gradient-to-t from-ghana-gold to-transparent"
                  animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.8 }}
                />
              </div>

              <div className="relative z-10 p-6 sm:p-10 md:p-14 text-center">
                {/* Enhanced animated star */}
                <motion.div
                  className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {/* Outer glow rings */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-ghana-gold/30"
                      animate={{
                        scale: [1, 1.5 + i * 0.3, 2 + i * 0.3],
                        opacity: [0.5, 0.2, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.4,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  {/* Star with glow */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="relative">
                      <BlackStar className="w-12 h-12 sm:w-16 sm:h-16 text-ghana-gold drop-shadow-[0_0_15px_rgba(252,209,22,0.5)]" animate={false} />
                      <motion.div
                        className="absolute inset-0 bg-ghana-gold/30 blur-xl rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                  {/* Orbiting dots */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={`orbit-${i}`}
                      className="absolute w-2 h-2 bg-ghana-gold rounded-full shadow-lg shadow-ghana-gold/50"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 4,
                        delay: i * 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      initial={{ rotate: i * 90 }}
                    >
                      <motion.div
                        style={{ transform: 'translateX(35px) translateY(-50%)' }}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced title */}
                <motion.h2
                  className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-white mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Be Part of{' '}
                  <motion.span
                    className="relative inline-block"
                  >
                    <span className="bg-gradient-to-r from-ghana-gold via-yellow-300 to-ghana-gold bg-clip-text text-transparent bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text' }}>
                      History
                    </span>
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ghana-gold to-transparent"
                      animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.span>
                </motion.h2>

                <motion.p
                  className="text-base sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Join us in building Africa's most comprehensive civil service digital platform.
                  Your partnership will empower{' '}
                  <motion.span
                    className="font-bold text-ghana-gold"
                    animate={{ textShadow: ['0 0 10px rgba(252,209,22,0)', '0 0 20px rgba(252,209,22,0.5)', '0 0 10px rgba(252,209,22,0)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    93,000+
                  </motion.span>
                  {' '}public servants and transform governance in Ghana.
                </motion.p>

                {/* Enhanced buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-8 sm:mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Primary CTA */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-ghana-gold via-yellow-300 to-ghana-gold rounded-xl sm:rounded-2xl blur-md opacity-70"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <MagneticButton
                      href="#schedule-meeting"
                      className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-ghana-gold via-yellow-400 to-ghana-gold bg-[length:200%_auto] text-black font-bold rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-3 text-sm sm:text-base overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-ghana-gold via-yellow-400 to-ghana-gold bg-[length:200%_auto]"
                        animate={{ backgroundPosition: ['0% center', '200% center'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                      <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                      <span className="relative z-10">Schedule a Meeting</span>
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </MagneticButton>
                  </motion.div>

                  {/* Secondary CTA */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MagneticButton
                      onClick={() => setIsLeadModalOpen(true)}
                      className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl sm:rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all flex items-center gap-3 text-sm sm:text-base overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <motion.div
                        className="relative z-10"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.div>
                      <span className="relative z-10">Download Full Proposal</span>
                    </MagneticButton>
                  </motion.div>
                </motion.div>

                {/* Enhanced contact info */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.a
                    href="mailto:rsimd@ohcs.gov.gh"
                    className="group flex items-center gap-2 text-white/80 hover:text-white text-sm sm:text-base transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                    <span>rsimd@ohcs.gov.gh</span>
                  </motion.a>

                  <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-ghana-gold" />

                  <motion.span
                    className="group flex items-center gap-2 text-white/80 text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="p-2 rounded-full bg-white/10"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                    <span>OHCS, Ministries, Accra, Ghana</span>
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ENHANCED FOOTER ===== */}
      <footer className="relative py-16 sm:py-20 px-6 overflow-hidden">
        {/* Animated top border */}
        <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-ghana-gold to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`footer-particle-${i}`}
              className={`absolute rounded-full ${i % 2 === 0 ? 'bg-ghana-gold/20' : 'bg-ghana-green/20'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Gradient orbs */}
          <motion.div
            className="absolute -bottom-20 left-1/4 w-64 h-64 bg-ghana-green/10 rounded-full blur-3xl"
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 right-1/4 w-64 h-64 bg-ghana-gold/10 rounded-full blur-3xl"
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main footer content */}
          <div className="text-center mb-10">
            {/* Logo with effects */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <BlackStar className="w-10 h-10 sm:w-12 sm:h-12 text-ghana-gold drop-shadow-[0_0_10px_rgba(252,209,22,0.5)]" animate={false} />
                <motion.div
                  className="absolute inset-0 bg-ghana-gold/20 blur-xl rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.span
                className="text-2xl sm:text-3xl font-heading font-bold bg-gradient-to-r from-white via-ghana-gold to-white bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ['0% center', '200% center'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                OHCS E-Library
              </motion.span>
            </motion.div>

            {/* Tagline with typing effect look */}
            <motion.p
              className="text-surface-300 text-base sm:text-lg mb-8 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                className="inline-block w-2 h-2 rounded-full bg-ghana-green"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Empowering Ghana's Civil Service for the Digital Age
            </motion.p>

            {/* Links with enhanced styling */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href="https://ohcs-elibrary.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-ghana-gold/50 transition-all flex items-center gap-2 overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-ghana-gold/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <ExternalLink className="w-4 h-4 text-ghana-gold relative z-10" />
                <span className="text-surface-300 group-hover:text-white transition-colors relative z-10">Platform Demo</span>
              </motion.a>

              <motion.a
                href="https://ohcs.gov.gh/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-ghana-green/50 transition-all flex items-center gap-2 overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-ghana-green/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="relative z-10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="w-4 h-4 text-ghana-green" />
                </motion.div>
                <span className="text-surface-300 group-hover:text-white transition-colors relative z-10">OHCS Website</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Decorative divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <motion.div
                className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="relative flex justify-center">
              <motion.div
                className="px-4 bg-surface-900"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-ghana-gold' : 'bg-ghana-green'}`}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Copyright section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-surface-500 text-sm">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-ghana-green to-ghana-gold flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <span className="text-[8px] font-bold text-black">©</span>
                </motion.div>
                <span>{Math.max(2026, new Date().getFullYear())}</span>
              </div>
              <span className="hidden sm:inline text-ghana-gold">•</span>
              <span>Office of the Head of Civil Service, Ghana</span>
            </div>
            <motion.p
              className="mt-3 text-surface-600 text-xs flex items-center justify-center gap-2"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-ghana-gold" />
              Building the future of public service
              <Sparkles className="w-3 h-3 text-ghana-gold" />
            </motion.p>
          </motion.div>
        </div>

        {/* Corner accents */}
        <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none">
          <motion.div
            className="absolute bottom-4 left-4 w-12 h-[2px] bg-gradient-to-r from-ghana-green to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-4 left-4 w-[2px] h-12 bg-gradient-to-t from-ghana-green to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
          <motion.div
            className="absolute bottom-4 right-4 w-12 h-[2px] bg-gradient-to-l from-ghana-gold to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-4 right-4 w-[2px] h-12 bg-gradient-to-t from-ghana-gold to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </footer>

        {/* Lead Capture Modal */}
        <LeadCaptureModal
          isOpen={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
          onSuccess={handleDownloadProposal}
        />
      </div>
    </>
  );
}
