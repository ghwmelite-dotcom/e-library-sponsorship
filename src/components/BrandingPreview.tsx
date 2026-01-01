import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Building2,
  Award,
  Monitor,
  Smartphone,
  PartyPopper,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Star,
  Check,
  Zap,
  Crown,
  Eye,
  Users,
  Tv,
  Globe,
} from 'lucide-react';

type PreviewType = 'certificate' | 'dashboard' | 'launch' | 'mobile';

interface PreviewTab {
  id: PreviewType;
  label: string;
  icon: typeof Award;
  description: string;
}

const PREVIEW_TABS: PreviewTab[] = [
  { id: 'certificate', label: 'Certificate', icon: Award, description: '500K+ certificates' },
  { id: 'dashboard', label: 'Dashboard', icon: Monitor, description: 'Every login' },
  { id: 'launch', label: 'Launch Event', icon: PartyPopper, description: 'VIP visibility' },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone, description: 'App splash' },
];

// ===== FLOATING PARTICLES =====
function FloatingParticles({ count = 15, colors = ['#FCD116', '#006B3F'] }: { count?: number; colors?: string[] }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [count, colors]);

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
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
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

// ===== SHIMMER EFFECT =====
function ShimmerEffect() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(252,209,22,0.1), transparent)',
      }}
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
    />
  );
}

// ===== GLOWING BORDER =====
function GlowingBorder({ color = '#FCD116' }: { color?: string }) {
  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-20 blur-sm pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </>
  );
}

// ===== ENHANCED CERTIFICATE PREVIEW =====
function CertificatePreview({ companyName, logoUrl }: { companyName: string; logoUrl: string | null }) {
  return (
    <motion.div
      className="relative"
      initial={{ rotateY: -10 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.6 }}
      style={{ perspective: 1000 }}
    >
      {/* Certificate shadow */}
      <div className="absolute inset-4 bg-ghana-gold/20 blur-2xl rounded-lg" />

      {/* Main certificate */}
      <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-xl p-5 sm:p-8 shadow-2xl border-4 sm:border-8 border-double border-ghana-gold/40 max-w-md mx-auto overflow-hidden">
        {/* Animated shimmer */}
        <ShimmerEffect />

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Decorative corners with animation */}
        {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((position, i) => (
          <motion.div
            key={i}
            className={`absolute ${position} w-10 h-10 sm:w-14 sm:h-14`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
          >
            <div className={`absolute inset-0 ${i < 2 ? 'border-t-4' : 'border-b-4'} ${i % 2 === 0 ? 'border-l-4' : 'border-r-4'} border-ghana-gold/60`} />
          </motion.div>
        ))}

        {/* Header */}
        <motion.div
          className="text-center mb-5 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-ghana-gold to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
            </motion.div>
          </div>
          <h3 className="text-lg sm:text-2xl font-serif font-bold text-gray-800 tracking-wide">REPUBLIC OF GHANA</h3>
          <p className="text-sm text-gray-600">Office of the Head of Civil Service</p>
        </motion.div>

        {/* Certificate Title */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-ghana-green mb-2 drop-shadow-sm">
            Certificate of Completion
          </h2>
          <motion.div
            className="w-24 sm:w-40 h-1 bg-gradient-to-r from-transparent via-ghana-gold to-transparent mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6 }}
          />
        </motion.div>

        {/* Recipient */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 text-sm mb-2">This is to certify that</p>
          <motion.p
            className="text-xl sm:text-2xl font-serif font-bold text-gray-800 border-b-2 border-ghana-gold/40 pb-2 px-4 inline-block"
            whileHover={{ scale: 1.02 }}
          >
            John Kwame Mensah
          </motion.p>
          <p className="text-gray-600 text-sm mt-4">has successfully completed</p>
          <p className="text-lg sm:text-xl font-semibold text-ghana-green mt-2">
            Advanced Public Administration
          </p>
        </motion.div>

        {/* Sponsor Branding - HIGHLIGHTED */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="relative bg-gradient-to-r from-white/90 via-ghana-gold/10 to-white/90 rounded-xl p-4 mb-5 border-2 border-ghana-gold/30 shadow-lg overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-ghana-gold/0 via-ghana-gold/20 to-ghana-gold/0 animate-pulse" />

          <motion.p
            className="text-xs text-gray-600 text-center mb-2 relative z-10 flex items-center justify-center gap-1"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-3 h-3 text-ghana-gold" />
            Proudly Sponsored by
            <Crown className="w-3 h-3 text-ghana-gold" />
          </motion.p>
          <div className="flex items-center justify-center gap-3 relative z-10">
            {logoUrl ? (
              <motion.img
                src={logoUrl}
                alt={companyName}
                className="h-12 object-contain drop-shadow-lg"
                whileHover={{ scale: 1.1 }}
              />
            ) : (
              <motion.div
                className="px-6 py-3 bg-gradient-to-r from-ghana-green via-ghana-green/90 to-ghana-green rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white font-bold text-lg">{companyName || 'Your Company'}</span>
              </motion.div>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 relative z-10">
            <div className="w-8 h-px bg-ghana-gold/50" />
            <span className="text-xs text-ghana-gold font-semibold">PLATINUM PARTNER</span>
            <div className="w-8 h-px bg-ghana-gold/50" />
          </div>
        </motion.div>

        {/* Signature */}
        <div className="flex justify-between items-end gap-4 relative z-10">
          <div className="text-center flex-1">
            <div className="w-full max-w-[100px] h-px bg-gray-400 mb-1 mx-auto" />
            <p className="text-xs text-gray-600">Date</p>
          </div>
          <motion.div
            className="w-12 h-12 bg-ghana-red/10 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Award className="w-6 h-6 text-ghana-red" />
          </motion.div>
          <div className="text-center flex-1">
            <div className="w-full max-w-[100px] h-px bg-gray-400 mb-1 mx-auto" />
            <p className="text-xs text-gray-600">Head of Civil Service</p>
          </div>
        </div>

        {/* Certificate ID */}
        <p className="text-xs text-gray-400 text-center mt-5 relative z-10">Certificate ID: OHCS-2025-00001</p>
      </div>
    </motion.div>
  );
}

// ===== ENHANCED DASHBOARD PREVIEW =====
function DashboardPreview({ companyName, logoUrl }: { companyName: string; logoUrl: string | null }) {
  const [activeUsers] = useState(Math.floor(Math.random() * 500) + 1200);

  return (
    <motion.div
      className="relative max-w-lg mx-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Glow behind dashboard */}
      <div className="absolute inset-0 bg-ghana-green/20 blur-3xl rounded-full" />

      <div className="relative bg-surface-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        {/* Browser chrome */}
        <div className="bg-gradient-to-r from-surface-800 to-surface-800/90 px-4 py-3 flex items-center gap-3 border-b border-white/10">
          <div className="flex gap-1.5">
            <motion.div
              className="w-3 h-3 rounded-full bg-red-500"
              whileHover={{ scale: 1.2 }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-yellow-500"
              whileHover={{ scale: 1.2 }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-green-500"
              whileHover={{ scale: 1.2 }}
            />
          </div>
          <div className="flex-1 bg-surface-700 rounded-lg px-3 py-1.5 text-xs text-surface-400 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ghana-green/50" />
            <span>elibrary.ohcs.gov.gh</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-ghana-green">
            <motion.div
              className="w-2 h-2 rounded-full bg-ghana-green"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span>{activeUsers.toLocaleString()} online</span>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-ghana-green via-ghana-green/95 to-ghana-green/90 p-4 relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
              animate={{ x: [0, 20], y: [0, 20] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Star className="w-7 h-7 text-ghana-gold drop-shadow-lg" />
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-lg">OHCS E-Library</h3>
                <p className="text-white/70 text-xs">Knowledge Management Platform</p>
              </div>
            </div>

            {/* Sponsor Branding - "Powered By" */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-right bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20"
            >
              <p className="text-white/60 text-xs mb-1">Powered by</p>
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="h-5 object-contain ml-auto" />
              ) : (
                <span className="text-white font-semibold text-sm">{companyName || 'Your Company'}</span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 space-y-4 bg-gradient-to-b from-surface-900 to-surface-800">
          {/* Welcome Banner */}
          <motion.div
            className="bg-gradient-to-r from-ghana-gold/20 via-ghana-gold/10 to-transparent rounded-xl p-4 border border-ghana-gold/30 relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ShimmerEffect />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-ghana-gold/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-ghana-gold" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Welcome back, Kwame!</h4>
                <p className="text-surface-400 text-sm">Continue your learning journey</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Courses', value: '12', icon: Globe, color: 'text-blue-400' },
              { label: 'Certificates', value: '5', icon: Award, color: 'text-ghana-gold' },
              { label: 'XP Points', value: '2,450', icon: Zap, color: 'text-ghana-green' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-surface-800/80 rounded-xl p-3 text-center border border-white/5 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(252,209,22,0.3)' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                <p className="text-ghana-gold font-bold text-xl">{stat.value}</p>
                <p className="text-surface-400 text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Footer with Sponsor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-4 border-t border-white/10 flex items-center justify-center gap-2"
          >
            <span className="text-surface-500 text-xs">Platform sponsored by</span>
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-4 object-contain" />
            ) : (
              <span className="text-ghana-gold text-xs font-semibold">{companyName || 'Your Company'}</span>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== ENHANCED LAUNCH EVENT PREVIEW =====
function LaunchEventPreview({ companyName, logoUrl }: { companyName: string; logoUrl: string | null }) {
  return (
    <motion.div
      className="relative max-w-lg mx-auto"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="relative bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Animated Stage Lights */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 left-1/4 w-40 h-80 bg-ghana-gold/30 blur-3xl"
            animate={{ x: [-20, 20, -20], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -top-20 right-1/4 w-40 h-80 bg-ghana-green/30 blur-3xl"
            animate={{ x: [20, -20, 20], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 bg-white/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Floating particles */}
        <FloatingParticles count={20} />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* Event Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-block mb-4 relative"
            >
              <div className="absolute inset-0 bg-ghana-gold/30 blur-xl rounded-full" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-ghana-gold to-yellow-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.h2
              className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              National Launch Event
            </motion.h2>
            <motion.p
              className="text-ghana-gold font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              OHCS E-Library Platform
            </motion.p>
          </div>

          {/* Stage Banner with Sponsor */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative bg-gradient-to-r from-surface-800/80 via-surface-800 to-surface-800/80 rounded-2xl p-6 border border-ghana-gold/30 mb-6 overflow-hidden"
          >
            <GlowingBorder color="#FCD116" />
            <ShimmerEffect />

            <div className="text-center relative z-10">
              <p className="text-surface-400 text-sm mb-5">Proudly co-hosted by</p>

              <div className="flex items-center justify-center gap-6 sm:gap-10">
                {/* OHCS Logo */}
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-ghana-green/30 to-ghana-green/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-ghana-green/30">
                    <Star className="w-8 h-8 sm:w-10 sm:h-10 text-ghana-gold" />
                  </div>
                  <p className="text-white text-sm font-medium">OHCS</p>
                </motion.div>

                <motion.div
                  className="text-ghana-gold text-3xl font-light"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  ×
                </motion.div>

                {/* Sponsor Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                >
                  {logoUrl ? (
                    <div className="mb-2">
                      <img src={logoUrl} alt={companyName} className="h-16 sm:h-20 object-contain mx-auto" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-ghana-gold to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-ghana-gold/30">
                      <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                    </div>
                  )}
                  <p className="text-white text-sm font-medium">{companyName || 'Your Company'}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4 text-center mb-6">
            {[
              { icon: Users, value: '500+', label: 'VIP Attendees', color: 'text-ghana-gold' },
              { icon: Tv, value: 'Live', label: 'National TV Coverage', color: 'text-ghana-green' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-surface-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.03, borderColor: 'rgba(252,209,22,0.3)' }}
              >
                <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
                <p className={`${item.color} font-bold text-lg`}>{item.value}</p>
                <p className="text-surface-400 text-xs">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Platinum Sponsor Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="text-center"
          >
            <motion.span
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-ghana-gold/30 via-yellow-400/20 to-ghana-gold/30 rounded-full border border-ghana-gold/40"
              whileHover={{ scale: 1.05 }}
              animate={{ boxShadow: ['0 0 20px rgba(252,209,22,0.2)', '0 0 30px rgba(252,209,22,0.4)', '0 0 20px rgba(252,209,22,0.2)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-5 h-5 text-ghana-gold" />
              <span className="text-ghana-gold font-semibold">Platinum Sponsor</span>
            </motion.span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== ENHANCED MOBILE APP PREVIEW =====
function MobileAppPreview({ companyName, logoUrl }: { companyName: string; logoUrl: string | null }) {
  return (
    <div className="flex justify-center">
      <motion.div
        className="relative"
        initial={{ y: 30, opacity: 0, rotateX: 10 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ type: 'spring' }}
        style={{ perspective: 1000 }}
      >
        {/* Phone glow */}
        <div className="absolute inset-0 bg-ghana-green/30 blur-3xl rounded-full scale-75" />

        {/* Phone Frame */}
        <div className="relative w-64 sm:w-72 h-[520px] sm:h-[560px] bg-gradient-to-b from-surface-700 to-surface-900 rounded-[3rem] border-4 border-surface-600 shadow-2xl overflow-hidden">
          {/* Side buttons */}
          <div className="absolute -left-1 top-24 w-1 h-12 bg-surface-600 rounded-l-lg" />
          <div className="absolute -right-1 top-20 w-1 h-8 bg-surface-600 rounded-r-lg" />
          <div className="absolute -right-1 top-32 w-1 h-12 bg-surface-600 rounded-r-lg" />

          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-surface-900 rounded-b-3xl z-20 flex items-center justify-center">
            <div className="w-16 h-4 bg-surface-800 rounded-full" />
          </div>

          {/* Screen Content */}
          <div className="absolute inset-2 bg-gradient-to-b from-ghana-green via-ghana-green/95 to-ghana-green/90 rounded-[2.5rem] overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 30%, rgba(252,209,22,0.2) 0%, transparent 50%)',
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            <FloatingParticles count={10} colors={['#FCD116', '#ffffff']} />

            {/* Status Bar */}
            <div className="flex justify-between items-center px-8 pt-10 pb-2 text-white text-xs relative z-10">
              <span className="font-medium">9:41</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-1 bg-white rounded-full" style={{ height: 4 + i * 2 }} />
                  ))}
                </div>
                <div className="w-6 h-3 bg-white rounded-sm ml-1 relative">
                  <div className="absolute right-0.5 top-0.5 bottom-0.5 w-3 bg-ghana-green rounded-sm" />
                </div>
              </div>
            </div>

            {/* Splash Content */}
            <div className="flex flex-col items-center justify-center h-full -mt-16 relative z-10">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mb-8 relative"
              >
                <motion.div
                  className="absolute inset-0 bg-ghana-gold/40 blur-2xl rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Star className="w-16 h-16 text-ghana-gold drop-shadow-lg" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <h3 className="text-white text-2xl font-bold mb-1 drop-shadow-lg">OHCS E-Library</h3>
                <p className="text-white/80 text-sm">Knowledge at your fingertips</p>
              </motion.div>

              {/* Sponsor Branding */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-24 left-0 right-0 text-center"
              >
                <div className="inline-flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                  <p className="text-white/60 text-xs mb-2">Powered by</p>
                  {logoUrl ? (
                    <motion.img
                      src={logoUrl}
                      alt={companyName}
                      className="h-7 object-contain"
                      whileHover={{ scale: 1.1 }}
                    />
                  ) : (
                    <span className="text-white font-bold">{companyName || 'Your Company'}</span>
                  )}
                </div>
              </motion.div>

              {/* Loading Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 left-0 right-0"
              >
                <div className="w-40 h-1.5 bg-white/20 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-ghana-gold via-white to-ghana-gold rounded-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-surface-500 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}

// ===== MAIN BRANDING PREVIEW COMPONENT =====
export default function BrandingPreview() {
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<PreviewType>('certificate');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentIndex = PREVIEW_TABS.findIndex(t => t.id === activePreview);
  const goToPrev = () => {
    const newIndex = currentIndex === 0 ? PREVIEW_TABS.length - 1 : currentIndex - 1;
    setActivePreview(PREVIEW_TABS[newIndex].id);
  };
  const goToNext = () => {
    const newIndex = currentIndex === PREVIEW_TABS.length - 1 ? 0 : currentIndex + 1;
    setActivePreview(PREVIEW_TABS[newIndex].id);
  };

  return (
    <div className="relative">
      {/* Background ambient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ghana-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ghana-green/5 rounded-full blur-3xl" />
      </div>

      {/* Input Section */}
      <motion.div
        className="relative bg-gradient-to-br from-surface-800/80 to-surface-900/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 mb-8 max-w-xl mx-auto overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlowingBorder color="#006B3F" />

        <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2 relative z-10">
          <div className="p-2 bg-ghana-gold/20 rounded-lg">
            <Building2 className="w-5 h-5 text-ghana-gold" />
          </div>
          Enter Your Company Details
        </h3>

        <div className="space-y-5 relative z-10">
          {/* Company Name Input */}
          <div>
            <label className="block text-surface-300 text-sm mb-2 font-medium">Company Name</label>
            <div className="relative">
              <input
                type="text"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  setIsTyping(true);
                  setTimeout(() => setIsTyping(false), 1000);
                }}
                placeholder="Enter your company name"
                className="w-full px-4 py-3.5 bg-surface-900/70 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-2 focus:ring-ghana-gold/20 transition-all"
              />
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-ghana-gold" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-surface-300 text-sm mb-2 font-medium">Company Logo (Optional)</label>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-3.5 bg-surface-900/70 border border-dashed border-white/20 rounded-xl text-surface-400 hover:border-ghana-gold/50 hover:text-white transition-all flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Upload className="w-5 h-5 group-hover:text-ghana-gold transition-colors" />
                {logoUrl ? 'Change Logo' : 'Upload Logo'}
              </motion.button>
              {logoUrl && (
                <motion.button
                  onClick={clearLogo}
                  className="px-4 py-3.5 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
            <AnimatePresence>
              {logoUrl && (
                <motion.div
                  className="mt-3 p-4 bg-surface-900/70 rounded-xl border border-white/10"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <img src={logoUrl} alt="Preview" className="h-14 object-contain" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick tip */}
        <motion.div
          className="mt-5 p-4 bg-gradient-to-r from-ghana-gold/15 to-ghana-gold/5 rounded-xl border border-ghana-gold/25 relative z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ShimmerEffect />
          <p className="text-ghana-gold text-sm flex items-start gap-2 relative z-10">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Eye className="w-5 h-5 mt-0.5 flex-shrink-0" />
            </motion.div>
            <span>See your brand featured across the platform! Your logo will appear on <strong>93,000+</strong> certificates.</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Preview Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 px-2">
        {PREVIEW_TABS.map((tab, i) => (
          <motion.button
            key={tab.id}
            onClick={() => setActivePreview(tab.id)}
            className={`relative px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm overflow-hidden ${
              activePreview === tab.id
                ? 'bg-gradient-to-r from-ghana-gold to-yellow-500 text-black shadow-lg shadow-ghana-gold/30'
                : 'bg-surface-800/80 text-surface-300 hover:bg-surface-700 border border-white/10'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {activePreview === tab.id && <ShimmerEffect />}
            <tab.icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Preview Display */}
      <div className="relative">
        {/* Navigation Arrows */}
        <motion.button
          onClick={goToPrev}
          className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-surface-800/90 backdrop-blur-sm rounded-full text-white hover:bg-surface-700 transition-all border border-white/10 shadow-lg hidden md:flex items-center justify-center"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={goToNext}
          className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-surface-800/90 backdrop-blur-sm rounded-full text-white hover:bg-surface-700 transition-all border border-white/10 shadow-lg hidden md:flex items-center justify-center"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Preview Content */}
        <div className="px-2 sm:px-4 md:px-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePreview}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.4, type: 'spring' }}
            >
              {activePreview === 'certificate' && (
                <CertificatePreview companyName={companyName} logoUrl={logoUrl} />
              )}
              {activePreview === 'dashboard' && (
                <DashboardPreview companyName={companyName} logoUrl={logoUrl} />
              )}
              {activePreview === 'launch' && (
                <LaunchEventPreview companyName={companyName} logoUrl={logoUrl} />
              )}
              {activePreview === 'mobile' && (
                <MobileAppPreview companyName={companyName} logoUrl={logoUrl} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Preview Description */}
        <motion.div
          key={activePreview + '-desc'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-10 relative z-10"
        >
          {activePreview === 'certificate' && (
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-ghana-gold" />
                Certificate Branding
              </h4>
              <p className="text-surface-400 text-sm max-w-md mx-auto">
                Your logo on <span className="text-ghana-gold font-semibold">93,000+</span> certificates issued to civil servants completing courses and training programs.
              </p>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-ghana-gold/10 rounded-full border border-ghana-gold/20"
                whileHover={{ scale: 1.05 }}
              >
                <Check className="w-4 h-4 text-ghana-gold" />
                <span className="text-ghana-gold text-sm font-medium">Platinum & Gold Tiers</span>
              </motion.div>
            </div>
          )}
          {activePreview === 'dashboard' && (
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Monitor className="w-5 h-5 text-ghana-green" />
                Dashboard Branding
              </h4>
              <p className="text-surface-400 text-sm max-w-md mx-auto">
                "Powered By" attribution visible to <span className="text-ghana-green font-semibold">every user</span> on login and throughout their platform experience.
              </p>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-ghana-green/10 rounded-full border border-ghana-green/20"
                whileHover={{ scale: 1.05 }}
              >
                <Crown className="w-4 h-4 text-ghana-green" />
                <span className="text-ghana-green text-sm font-medium">Platinum Tier Exclusive</span>
              </motion.div>
            </div>
          )}
          {activePreview === 'launch' && (
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <PartyPopper className="w-5 h-5 text-ghana-gold" />
                Launch Event Co-Hosting
              </h4>
              <p className="text-surface-400 text-sm max-w-md mx-auto">
                Co-host the national launch event with <span className="text-ghana-gold font-semibold">500+ VIPs</span> and live TV coverage across Ghana.
              </p>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-ghana-gold/10 rounded-full border border-ghana-gold/20"
                whileHover={{ scale: 1.05 }}
              >
                <Crown className="w-4 h-4 text-ghana-gold" />
                <span className="text-ghana-gold text-sm font-medium">Platinum Tier Exclusive</span>
              </motion.div>
            </div>
          )}
          {activePreview === 'mobile' && (
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5 text-ghana-green" />
                Mobile App Splash Screen
              </h4>
              <p className="text-surface-400 text-sm max-w-md mx-auto">
                Your brand featured on the mobile app splash screen, seen <span className="text-ghana-green font-semibold">every time</span> a user opens the app.
              </p>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-ghana-green/10 rounded-full border border-ghana-green/20"
                whileHover={{ scale: 1.05 }}
              >
                <Check className="w-4 h-4 text-ghana-green" />
                <span className="text-ghana-green text-sm font-medium">Platinum & Gold Tiers</span>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
