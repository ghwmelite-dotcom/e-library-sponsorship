import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';

type PreviewType = 'certificate' | 'dashboard' | 'launch' | 'mobile';

interface PreviewTab {
  id: PreviewType;
  label: string;
  icon: typeof Award;
}

const PREVIEW_TABS: PreviewTab[] = [
  { id: 'certificate', label: 'Certificate', icon: Award },
  { id: 'dashboard', label: 'Dashboard', icon: Monitor },
  { id: 'launch', label: 'Launch Event', icon: PartyPopper },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
];

// Certificate Preview Component
function CertificatePreview({ companyName, logoUrl }: { companyName: string; logoUrl: string | null }) {
  return (
    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 sm:p-8 shadow-2xl border-4 sm:border-8 border-double border-ghana-gold/30 max-w-md mx-auto">
      {/* Decorative corners - hidden on very small screens */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-l-2 sm:border-l-4 border-t-2 sm:border-t-4 border-ghana-gold/50 hidden xs:block" />
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 border-r-2 sm:border-r-4 border-t-2 sm:border-t-4 border-ghana-gold/50 hidden xs:block" />
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-l-2 sm:border-l-4 border-b-2 sm:border-b-4 border-ghana-gold/50 hidden xs:block" />
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 border-r-2 sm:border-r-4 border-b-2 sm:border-b-4 border-ghana-gold/50 hidden xs:block" />

      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-4 mb-4">
          {/* Ghana Coat of Arms placeholder */}
          <div className="w-16 h-16 bg-ghana-gold/20 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-ghana-gold" />
          </div>
        </div>
        <h3 className="text-lg sm:text-2xl font-serif font-bold text-gray-800">REPUBLIC OF GHANA</h3>
        <p className="text-sm text-gray-600">Office of the Head of Civil Service</p>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-3xl font-serif font-bold text-ghana-green mb-2">Certificate of Completion</h2>
        <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-ghana-gold to-transparent mx-auto" />
      </div>

      {/* Recipient */}
      <div className="text-center mb-4 sm:mb-6">
        <p className="text-gray-600 text-sm sm:text-base mb-2">This is to certify that</p>
        <p className="text-lg sm:text-2xl font-serif font-bold text-gray-800 border-b-2 border-ghana-gold/30 pb-2 px-2 sm:px-4 inline-block">
          John Kwame Mensah
        </p>
        <p className="text-gray-600 text-sm sm:text-base mt-3 sm:mt-4">has successfully completed</p>
        <p className="text-base sm:text-xl font-semibold text-ghana-green mt-2">
          Advanced Public Administration
        </p>
      </div>

      {/* Sponsor Branding - THE KEY FEATURE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-ghana-gold/20"
      >
        <p className="text-xs text-gray-500 text-center mb-2">Sponsored by</p>
        <div className="flex items-center justify-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={companyName} className="h-10 object-contain" />
          ) : (
            <div className="px-4 py-2 bg-gradient-to-r from-ghana-green to-ghana-green/80 rounded-lg">
              <span className="text-white font-bold text-lg">{companyName || 'Your Company'}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">Platinum Partner</p>
      </motion.div>

      {/* Signature */}
      <div className="flex justify-between items-end gap-2 sm:gap-4">
        <div className="text-center flex-1">
          <div className="w-full max-w-[100px] sm:max-w-[128px] h-px bg-gray-400 mb-1 mx-auto" />
          <p className="text-[10px] sm:text-xs text-gray-600">Date</p>
        </div>
        <div className="text-center flex-1">
          <div className="w-full max-w-[100px] sm:max-w-[128px] h-px bg-gray-400 mb-1 mx-auto" />
          <p className="text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">Head of Civil Service</p>
        </div>
      </div>

      {/* Certificate ID */}
      <p className="text-xs text-gray-400 text-center mt-6">Certificate ID: OHCS-2025-00001</p>
    </div>
  );
}

// Dashboard Preview Component
function DashboardPreview({ companyName, logoUrl }: { companyName: string; logoUrl: string | null }) {
  return (
    <div className="bg-surface-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 max-w-lg mx-auto">
      {/* Browser chrome */}
      <div className="bg-surface-800 px-4 py-3 flex items-center gap-2 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 bg-surface-700 rounded-md px-3 py-1 text-xs text-surface-400 ml-4">
          elibrary.ohcs.gov.gh
        </div>
      </div>

      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-ghana-green to-ghana-green/90 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-ghana-gold" />
            </div>
            <div>
              <h3 className="text-white font-bold">OHCS E-Library</h3>
              <p className="text-white/70 text-xs">Knowledge Management Platform</p>
            </div>
          </div>

          {/* Sponsor Branding - "Powered By" */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-right"
          >
            <p className="text-white/50 text-xs mb-1">Powered by</p>
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-6 object-contain ml-auto" />
            ) : (
              <span className="text-white font-semibold text-sm">{companyName || 'Your Company'}</span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-4 space-y-4">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-ghana-gold/20 to-transparent rounded-lg p-4 border border-ghana-gold/30">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-ghana-gold" />
            <div>
              <h4 className="text-white font-semibold">Welcome back, Kwame!</h4>
              <p className="text-surface-400 text-sm">Continue your learning journey</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Courses', value: '12' },
            { label: 'Certificates', value: '5' },
            { label: 'XP Points', value: '2,450' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-800 rounded-lg p-3 text-center">
              <p className="text-ghana-gold font-bold text-xl">{stat.value}</p>
              <p className="text-surface-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Footer with Sponsor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
  );
}

// Launch Event Preview Component
function LaunchEventPreview({ companyName, logoUrl }: { companyName: string; logoUrl: string | null }) {
  return (
    <div className="relative bg-gradient-to-br from-surface-900 via-ghana-green/20 to-surface-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 max-w-lg mx-auto">
      {/* Stage Lights Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-64 bg-ghana-gold/20 blur-3xl" />
        <div className="absolute top-0 right-1/4 w-32 h-64 bg-ghana-green/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Event Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-ghana-gold mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">
            National Launch Event
          </h2>
          <p className="text-ghana-gold">OHCS E-Library Platform</p>
        </div>

        {/* Stage Banner with Sponsor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-surface-800 via-surface-800/90 to-surface-800 rounded-xl p-6 border border-ghana-gold/30 mb-8"
        >
          <div className="text-center">
            <p className="text-surface-400 text-sm mb-4">Proudly co-hosted by</p>

            <div className="flex items-center justify-center gap-8">
              {/* OHCS Logo */}
              <div className="text-center">
                <div className="w-16 h-16 bg-ghana-green/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-8 h-8 text-ghana-gold" />
                </div>
                <p className="text-white text-sm font-medium">OHCS</p>
              </div>

              <div className="text-ghana-gold text-2xl">×</div>

              {/* Sponsor Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                {logoUrl ? (
                  <div className="mb-2">
                    <img src={logoUrl} alt={companyName} className="h-16 object-contain mx-auto" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-ghana-gold to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Building2 className="w-8 h-8 text-black" />
                  </div>
                )}
                <p className="text-white text-sm font-medium">{companyName || 'Your Company'}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Event Details */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-surface-800/50 rounded-lg p-3">
            <p className="text-ghana-gold font-bold">500+</p>
            <p className="text-surface-400 text-xs">VIP Attendees</p>
          </div>
          <div className="bg-surface-800/50 rounded-lg p-3">
            <p className="text-ghana-gold font-bold">Live</p>
            <p className="text-surface-400 text-xs">National TV Coverage</p>
          </div>
        </div>

        {/* Platinum Sponsor Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ghana-gold/20 to-yellow-400/20 rounded-full border border-ghana-gold/30">
            <Award className="w-4 h-4 text-ghana-gold" />
            <span className="text-ghana-gold text-sm font-medium">Platinum Sponsor</span>
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// Mobile App Preview Component
function MobileAppPreview({ companyName, logoUrl }: { companyName: string; logoUrl: string | null }) {
  return (
    <div className="flex justify-center">
      {/* Phone Frame */}
      <div className="relative w-64 h-[500px] bg-surface-900 rounded-[3rem] border-4 border-surface-700 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-surface-900 rounded-b-2xl z-20" />

        {/* Screen Content */}
        <div className="absolute inset-2 bg-gradient-to-b from-ghana-green to-ghana-green/90 rounded-[2.5rem] overflow-hidden">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-6 pt-8 pb-2 text-white text-xs">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-white rounded-sm" />
            </div>
          </div>

          {/* Splash Content */}
          <div className="flex flex-col items-center justify-center h-full -mt-12">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <Star className="w-14 h-14 text-ghana-gold" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h3 className="text-white text-2xl font-bold mb-1">OHCS E-Library</h3>
              <p className="text-white/70 text-sm">Knowledge at your fingertips</p>
            </motion.div>

            {/* Sponsor Branding */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-20 left-0 right-0 text-center"
            >
              <p className="text-white/50 text-xs mb-2">Powered by</p>
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="h-6 object-contain mx-auto" />
              ) : (
                <span className="text-white font-semibold">{companyName || 'Your Company'}</span>
              )}
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-10 left-0 right-0"
            >
              <div className="w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-ghana-gold rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-surface-600 rounded-full" />
      </div>
    </div>
  );
}

// Main BrandingPreview Component
export default function BrandingPreview() {
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<PreviewType>('certificate');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      {/* Input Section */}
      <div className="bg-surface-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 mb-6 sm:mb-8 max-w-xl mx-auto">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-ghana-gold" />
          Enter Your Company Details
        </h3>

        <div className="space-y-4">
          {/* Company Name Input */}
          <div>
            <label className="block text-surface-300 text-sm mb-2">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className="w-full px-4 py-3 bg-surface-900/50 border border-white/10 rounded-xl text-white placeholder-surface-500 focus:border-ghana-gold/50 focus:outline-none focus:ring-1 focus:ring-ghana-gold/50 transition-all"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-surface-300 text-sm mb-2">Company Logo (Optional)</label>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-3 bg-surface-900/50 border border-dashed border-white/20 rounded-xl text-surface-400 hover:border-ghana-gold/50 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {logoUrl ? 'Change Logo' : 'Upload Logo'}
              </button>
              {logoUrl && (
                <button
                  onClick={clearLogo}
                  className="px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {logoUrl && (
              <div className="mt-3 p-3 bg-surface-900/50 rounded-lg">
                <img src={logoUrl} alt="Preview" className="h-12 object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Quick tip */}
        <div className="mt-4 p-3 bg-ghana-gold/10 rounded-lg border border-ghana-gold/20">
          <p className="text-ghana-gold text-sm flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>See your brand featured across the platform! Your logo will appear on 500,000+ certificates.</span>
          </p>
        </div>
      </div>

      {/* Preview Tabs */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 px-2">
        {PREVIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePreview(tab.id)}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
              activePreview === tab.id
                ? 'bg-ghana-gold text-black'
                : 'bg-surface-800 text-surface-300 hover:bg-surface-700'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Preview Display */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-surface-800/80 backdrop-blur-sm rounded-full text-white hover:bg-surface-700 transition-all hidden md:block"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-surface-800/80 backdrop-blur-sm rounded-full text-white hover:bg-surface-700 transition-all hidden md:block"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Preview Content */}
        <div className="px-2 sm:px-4 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePreview}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          {activePreview === 'certificate' && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Certificate Branding</h4>
              <p className="text-surface-400 text-sm max-w-md mx-auto">
                Your logo on 500,000+ certificates issued to civil servants completing courses and training programs.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="flex items-center gap-1 text-ghana-gold text-sm">
                  <Check className="w-4 h-4" /> Platinum & Gold Tiers
                </span>
              </div>
            </div>
          )}
          {activePreview === 'dashboard' && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Dashboard Branding</h4>
              <p className="text-surface-400 text-sm max-w-md mx-auto">
                "Powered By" attribution visible to every user on login and throughout their platform experience.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="flex items-center gap-1 text-ghana-gold text-sm">
                  <Check className="w-4 h-4" /> Platinum Tier Exclusive
                </span>
              </div>
            </div>
          )}
          {activePreview === 'launch' && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Launch Event Co-Hosting</h4>
              <p className="text-surface-400 text-sm max-w-md mx-auto">
                Co-host the national launch event with 500+ VIPs and live TV coverage across Ghana.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="flex items-center gap-1 text-ghana-gold text-sm">
                  <Check className="w-4 h-4" /> Platinum Tier Exclusive
                </span>
              </div>
            </div>
          )}
          {activePreview === 'mobile' && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Mobile App Splash Screen</h4>
              <p className="text-surface-400 text-sm max-w-md mx-auto">
                Your brand featured on the mobile app splash screen, seen every time a user opens the app.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="flex items-center gap-1 text-ghana-gold text-sm">
                  <Check className="w-4 h-4" /> Platinum & Gold Tiers
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
