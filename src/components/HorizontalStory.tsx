import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Lightbulb,
  Users,
  Rocket,
  Trophy,
  Globe,
  Heart,
  Star,
  ArrowRight,
  Building2,
  GraduationCap,
  Brain,
  Sparkles,
  Target,
  Flag,
} from 'lucide-react';

interface StorySlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Lightbulb;
  color: 'green' | 'gold' | 'red';
  stat?: { value: string; label: string };
  visual: 'challenge' | 'vision' | 'solution' | 'impact' | 'future';
}

const STORY_SLIDES: StorySlide[] = [
  {
    id: 1,
    title: "The Challenge",
    subtitle: "500,000 civil servants. 50+ MDAs. One fragmented system.",
    description: "Ghana's public sector struggles with information silos, outdated training methods, and knowledge loss when experienced officers retire. Critical policies are scattered across departments, and collaboration remains a challenge.",
    icon: Building2,
    color: 'red',
    stat: { value: "40%", label: "Knowledge lost to retirement annually" },
    visual: 'challenge',
  },
  {
    id: 2,
    title: "The Vision",
    subtitle: "Africa's most advanced civil service platform",
    description: "Imagine a unified digital ecosystem where every civil servant has instant access to policies, training, AI-powered assistance, and collaborative tools. A platform that transforms how government works.",
    icon: Lightbulb,
    color: 'gold',
    stat: { value: "1", label: "Platform to unite them all" },
    visual: 'vision',
  },
  {
    id: 3,
    title: "The Solution",
    subtitle: "OHCS E-Library: 9 integrated modules",
    description: "Kwame AI Assistant, Document Library, Learning Management, Ayo Wellness Hub, Research Lab, Collaboration Suite, Gamification, News Aggregation, and Events Calendar—all in one platform.",
    icon: Brain,
    color: 'green',
    stat: { value: "9", label: "Powerful integrated modules" },
    visual: 'solution',
  },
  {
    id: 4,
    title: "The Impact",
    subtitle: "GHS 108M+ in annual savings",
    description: "Dramatic efficiency gains across document retrieval, policy development, training delivery, and knowledge transfer. Civil servants empowered with instant answers and continuous learning.",
    icon: Trophy,
    color: 'gold',
    stat: { value: "99%", label: "Faster document access" },
    visual: 'impact',
  },
  {
    id: 5,
    title: "The Future",
    subtitle: "Your legacy in Ghana's digital transformation",
    description: "As a founding sponsor, your brand becomes synonymous with progress. Your logo on 500,000+ certificates, platform-wide visibility, and a lasting impact on governance in Africa.",
    icon: Flag,
    color: 'green',
    stat: { value: "500K+", label: "Lives you'll impact" },
    visual: 'future',
  },
];

// Visual illustration for each slide
function SlideVisual({ type, color }: { type: string; color: 'green' | 'gold' | 'red' }) {
  const colorClasses = {
    green: { bg: 'bg-ghana-green', text: 'text-ghana-green', border: 'border-ghana-green' },
    gold: { bg: 'bg-ghana-gold', text: 'text-ghana-gold', border: 'border-ghana-gold' },
    red: { bg: 'bg-ghana-red', text: 'text-ghana-red', border: 'border-ghana-red' },
  };

  const colors = colorClasses[color];

  if (type === 'challenge') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Scattered documents */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-20 bg-surface-700 rounded-lg border border-white/10"
            style={{
              left: `${20 + (i % 3) * 25}%`,
              top: `${20 + Math.floor(i / 3) * 35}%`,
              rotate: `${-15 + i * 8}deg`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="p-2 space-y-1">
              <div className="h-1 bg-white/20 rounded w-full" />
              <div className="h-1 bg-white/20 rounded w-3/4" />
              <div className="h-1 bg-white/20 rounded w-1/2" />
            </div>
          </motion.div>
        ))}
        {/* Broken connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
          <line x1="30%" y1="30%" x2="50%" y2="50%" stroke="#CE1126" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="70%" y1="30%" x2="50%" y2="50%" stroke="#CE1126" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="30%" y1="70%" x2="50%" y2="50%" stroke="#CE1126" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>
    );
  }

  if (type === 'vision') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", duration: 1 }}
        >
          {/* Central glowing orb */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ghana-gold to-yellow-300 flex items-center justify-center shadow-2xl shadow-ghana-gold/50">
            <Lightbulb className="w-16 h-16 text-black" />
          </div>
          {/* Radiating circles */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-ghana-gold/30"
              style={{
                scale: 1 + i * 0.5,
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 - i * 0.2 }}
              transition={{ delay: i * 0.2 }}
            />
          ))}
        </motion.div>
        {/* Floating sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + (i * 10)}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          >
            <Sparkles className="w-6 h-6 text-ghana-gold" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'solution') {
    const modules = [
      { icon: Brain, label: 'AI' },
      { icon: GraduationCap, label: 'LMS' },
      { icon: Heart, label: 'Wellness' },
      { icon: Users, label: 'Collab' },
      { icon: Globe, label: 'News' },
    ];

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Central hub */}
        <motion.div
          className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-ghana-green to-ghana-green/80 flex items-center justify-center shadow-2xl"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
        >
          <Star className="w-12 h-12 text-ghana-gold" />
        </motion.div>

        {/* Orbiting modules */}
        {modules.map((module, i) => {
          const angle = (i / modules.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 100;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute w-14 h-14 rounded-xl bg-surface-800 border border-white/20 flex items-center justify-center"
              style={{
                left: `calc(50% + ${x}px - 28px)`,
                top: `calc(50% + ${y}px - 28px)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <module.icon className="w-6 h-6 text-ghana-gold" />
            </motion.div>
          );
        })}

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {modules.map((_, i) => {
            const angle = (i / modules.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.line
                key={i}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${x}px)`}
                y2={`calc(50% + ${y}px)`}
                stroke="#006B3F"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  if (type === 'impact') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Rising chart bars */}
        <div className="flex items-end gap-4 h-48">
          {[40, 65, 85, 100].map((height, i) => (
            <motion.div
              key={i}
              className="w-12 rounded-t-lg bg-gradient-to-t from-ghana-gold to-yellow-300"
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </div>

        {/* Trophy overlay */}
        <motion.div
          className="absolute"
          initial={{ scale: 0, y: 50 }}
          whileInView={{ scale: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          <Trophy className="w-20 h-20 text-ghana-gold drop-shadow-2xl" />
        </motion.div>
      </div>
    );
  }

  if (type === 'future') {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Ghana flag gradient background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(135deg, #CE1126 0%, #FCD116 50%, #006B3F 100%)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
        />

        {/* Central flag/star */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ghana-green via-ghana-gold to-ghana-red p-1">
            <div className="w-full h-full rounded-full bg-surface-900 flex items-center justify-center">
              <Star className="w-16 h-16 text-ghana-gold" />
            </div>
          </div>
        </motion.div>

        {/* Floating people icons */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 120 + (i % 2) * 30;

          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px - 12px)`,
                top: `calc(50% + ${Math.sin(angle) * radius}px - 12px)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <Users className="w-6 h-6 text-white/60" />
            </motion.div>
          );
        })}
      </div>
    );
  }

  return null;
}

// Individual story slide component
function StorySlideComponent({ slide, index }: { slide: StorySlide; index: number }) {
  const colorClasses = {
    green: {
      badge: 'bg-ghana-green/20 text-ghana-green',
      stat: 'text-ghana-green',
      glow: 'shadow-ghana-green/20',
    },
    gold: {
      badge: 'bg-ghana-gold/20 text-ghana-gold',
      stat: 'text-ghana-gold',
      glow: 'shadow-ghana-gold/20',
    },
    red: {
      badge: 'bg-ghana-red/20 text-ghana-red',
      stat: 'text-ghana-red',
      glow: 'shadow-ghana-red/20',
    },
  };

  const colors = colorClasses[slide.color];

  return (
    <div className="flex-shrink-0 w-screen h-full flex items-center justify-center px-6 md:px-12">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
          <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${colors.badge}`}>
              <slide.icon className="w-4 h-4" />
              Chapter {slide.id} of 5
            </span>

            {/* Title */}
            <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              {slide.title}
            </h3>

            {/* Subtitle */}
            <p className={`text-xl md:text-2xl font-semibold mb-6 ${colors.stat}`}>
              {slide.subtitle}
            </p>

            {/* Description */}
            <p className="text-surface-300 text-lg leading-relaxed mb-8">
              {slide.description}
            </p>

            {/* Stat */}
            {slide.stat && (
              <div className={`inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-surface-800/50 border border-white/10 ${colors.glow} shadow-lg`}>
                <span className={`text-4xl font-bold ${colors.stat}`}>{slide.stat.value}</span>
                <span className="text-surface-300">{slide.stat.label}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Visual */}
        <div className={`relative h-80 lg:h-96 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
          <SlideVisual type={slide.visual} color={slide.color} />
        </div>
      </div>
    </div>
  );
}

// Main horizontal story component
export default function HorizontalStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(STORY_SLIDES.length - 1) * 100}%`]);

  return (
    <section ref={containerRef} className="relative" style={{ height: `${STORY_SLIDES.length * 100}vh` }}>
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-surface-900 via-[#0a0908] to-surface-900">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-ghana-green/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-ghana-gold/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-8 px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4"
          >
            THE JOURNEY
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-heading font-bold text-white"
          >
            From Challenge to{' '}
            <span className="bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-red bg-clip-text text-transparent">
              Transformation
            </span>
          </motion.h2>
        </div>

        {/* Horizontal scrolling content */}
        <motion.div
          className="flex h-full pt-24"
          style={{ x }}
        >
          {STORY_SLIDES.map((slide, index) => (
            <StorySlideComponent key={slide.id} slide={slide} index={index} />
          ))}
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3">
            {STORY_SLIDES.map((slide, index) => (
              <motion.div
                key={slide.id}
                className="relative"
              >
                <motion.div
                  className="w-3 h-3 rounded-full bg-white/30"
                  style={{
                    scale: useTransform(
                      scrollYProgress,
                      [
                        index / STORY_SLIDES.length - 0.05,
                        index / STORY_SLIDES.length,
                        (index + 1) / STORY_SLIDES.length,
                      ],
                      [1, 1.5, 1]
                    ),
                    backgroundColor: useTransform(
                      scrollYProgress,
                      [
                        index / STORY_SLIDES.length - 0.05,
                        index / STORY_SLIDES.length,
                        (index + 1) / STORY_SLIDES.length - 0.05,
                      ],
                      ['rgba(255,255,255,0.3)', '#FCD116', 'rgba(255,255,255,0.3)']
                    ),
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-red rounded-full"
              style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
            />
          </div>

          {/* Scroll hint */}
          <motion.p
            className="text-surface-400 text-sm text-center mt-4 flex items-center justify-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>Scroll to explore</span>
            <ArrowRight className="w-4 h-4" />
          </motion.p>
        </div>

        {/* Chapter indicator */}
        <motion.div
          className="absolute top-1/2 right-8 -translate-y-1/2 z-20 hidden lg:block"
        >
          <div className="flex flex-col gap-4">
            {STORY_SLIDES.map((slide, index) => (
              <motion.div
                key={slide.id}
                className="flex items-center gap-3"
                style={{
                  opacity: useTransform(
                    scrollYProgress,
                    [
                      index / STORY_SLIDES.length - 0.1,
                      index / STORY_SLIDES.length,
                      (index + 1) / STORY_SLIDES.length - 0.1,
                    ],
                    [0.3, 1, 0.3]
                  ),
                }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-surface-800 border border-white/20 flex items-center justify-center"
                  style={{
                    borderColor: useTransform(
                      scrollYProgress,
                      [
                        index / STORY_SLIDES.length - 0.05,
                        index / STORY_SLIDES.length,
                        (index + 1) / STORY_SLIDES.length - 0.05,
                      ],
                      ['rgba(255,255,255,0.2)', '#FCD116', 'rgba(255,255,255,0.2)']
                    ),
                  }}
                >
                  <slide.icon className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-white text-sm font-medium">{slide.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
