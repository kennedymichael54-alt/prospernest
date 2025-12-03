import React, { useState, useEffect, useRef } from 'react';

// ============================================
// PROSPERNEST LANDING PAGE v4 - FIXED
// All features: Device mockups, animations,
// Signup flow, Tutorials, AI Chat integration
// 
// FIXES APPLIED:
// 1. Mobile: Reduced content size, fixed overflow
// 2. Web: Logo click scrolls to top (fixed)
// 3. Web: "Most Popular" badge no longer cut off
// 4. iPad/iPhone: Nav shows only Penny icon
// 5. Terms & Privacy modals added (clickable)
// 6. REAL Supabase authentication added
// ============================================

// Supabase client for landing page auth
let landingSupabase = null;
const initLandingSupabase = async () => {
  if (landingSupabase) return landingSupabase;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    landingSupabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storage: window.localStorage,
          storageKey: 'sb-auth-token'
        }
      }
    );
    console.log('✅ [Landing] Supabase initialized');
    return landingSupabase;
  } catch (e) {
    console.error('❌ [Landing] Supabase init error:', e);
    return null;
  }
};

// Session storage helper for landing page
const saveLandingSession = (session) => {
  console.log('💾 [Landing] Saving session...');
  try {
    if (session) {
      const sessionStr = JSON.stringify(session);
      localStorage.setItem('pn_session', sessionStr);
      localStorage.setItem('pn_session_expiry', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
      localStorage.setItem('pn_session_backup', sessionStr);
      console.log('✅ [Landing] Session saved:', session.user?.email);
      
      // Verify
      const check = localStorage.getItem('pn_session');
      console.log('✅ [Landing] Session verified:', !!check);
    }
  } catch (e) {
    console.error('❌ [Landing] Session save error:', e);
  }
};

const ProsperNestLandingV4 = ({ onNavigate }) => {
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [authMode, setAuthMode] = useState('signup');
  const [modalBillingCycle, setModalBillingCycle] = useState('annual');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi there! 👋 I'm Penny, your ProsperNest assistant. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [billingCycle, setBillingCycle] = useState('annual');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHubIndex, setActiveHubIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const idleTimerRef = useRef(null);
  const hubAnimationRef = useRef(null);
  const IDLE_TIMEOUT = 5 * 60 * 1000;

  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    receiveUpdates: false,
    agreeToPrivacy: false
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    motivations: [],
    startWith: [],
    invitedMembers: ['', '', '', '', ''],
    pennyEnabled: true
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_EMAIL = 'admin@prospernest.app';
  const ADMIN_PASSWORD = 'ProsperAdmin2025!';
  
  // Load saved email from localStorage on init
  const [signinEmail, setSigninEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pn_remember_email');
      return saved || '';
    }
    return '';
  });
  const [signinPassword, setSigninPassword] = useState('');
  const [signinError, setSigninError] = useState('');
  const [signinLoading, setSigninLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pn_remember_me') === 'true';
    }
    return false;
  });

  // Reload saved email whenever the signin modal opens
  useEffect(() => {
    if (showSignupModal && authMode === 'signin') {
      const savedEmail = localStorage.getItem('pn_remember_email');
      const shouldRemember = localStorage.getItem('pn_remember_me') === 'true';
      if (savedEmail && shouldRemember) {
        setSigninEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, [showSignupModal, authMode]);

  // REAL Supabase sign in handler
  const handleRealSignIn = async () => {
    console.log('🔐 [Landing] Sign in attempt for:', signinEmail);
    setSigninError('');
    setSigninLoading(true);
    
    // Save remember me preference
    if (rememberMe && signinEmail) {
      localStorage.setItem('pn_remember_email', signinEmail);
      localStorage.setItem('pn_remember_me', 'true');
    } else {
      localStorage.removeItem('pn_remember_email');
      localStorage.setItem('pn_remember_me', 'false');
    }
    
    // Admin bypass for testing
    if (signinEmail === ADMIN_EMAIL && signinPassword === ADMIN_PASSWORD) {
      console.log('🔐 [Landing] Admin bypass');
      setIsAdmin(true);
      setShowSignupModal(false);
      setSelectedPlan('family');
      setShowOnboarding(true);
      setOnboardingStep(0);
      if (!rememberMe) setSigninEmail('');
      setSigninPassword('');
      setSigninLoading(false);
      return;
    }
    
    // Validate inputs
    if (!signinEmail || !signinPassword) {
      setSigninError('Please enter your email and password');
      setSigninLoading(false);
      return;
    }
    
    try {
      const sb = await initLandingSupabase();
      if (!sb) {
        setSigninError('Connection error. Please try again.');
        setSigninLoading(false);
        return;
      }
      
      console.log('🔐 [Landing] Calling signInWithPassword...');
      const { data, error } = await sb.auth.signInWithPassword({
        email: signinEmail,
        password: signinPassword
      });
      
      console.log('🔐 [Landing] Response:', { 
        hasData: !!data, 
        hasSession: !!data?.session, 
        hasUser: !!data?.user,
        error: error?.message 
      });
      
      if (error) {
        setSigninError(error.message);
        setSigninLoading(false);
        return;
      }
      
      // CRITICAL: Save session
      if (data?.session) {
        console.log('💾 [Landing] Saving session...');
        saveLandingSession(data.session);
        
        // Verify save
        const verify = localStorage.getItem('pn_session');
        console.log('✅ [Landing] Session verified:', !!verify);
        console.log('🔑 [Landing] Keys after save:', 
          Object.keys(localStorage).filter(k => k.includes('pn_session'))
        );
      } else {
        console.error('❌ [Landing] No session in response!');
      }
      
      // Close modal and navigate
      setShowSignupModal(false);
      if (!rememberMe) setSigninEmail('');
      setSigninPassword('');
      
      console.log('✅ [Landing] Sign in complete, navigating to dashboard...');
      
      // Small delay to ensure session is saved before navigation
      setTimeout(() => {
        onNavigate && onNavigate('dashboard');
      }, 100);
      
    } catch (err) {
      console.error('❌ [Landing] Sign in error:', err);
      setSigninError(err.message || 'Sign in failed');
    }
    
    setSigninLoading(false);
  };

  // Google sign in handler
  const handleGoogleSignIn = async () => {
    console.log('🔐 [Landing] Google sign in...');
    setSigninError('');
    setSigninLoading(true);
    
    try {
      const sb = await initLandingSupabase();
      if (!sb) {
        setSigninError('Connection error. Please try again.');
        setSigninLoading(false);
        return;
      }
      
      const { error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) {
        setSigninError(error.message);
        setSigninLoading(false);
      }
      // Note: OAuth will redirect, so no need to handle success here
    } catch (err) {
      console.error('❌ [Landing] Google sign in error:', err);
      setSigninError(err.message || 'Google sign in failed');
      setSigninLoading(false);
    }
  };

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pn_dark_mode');
      return saved === 'true';
    }
    return false;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('pn_dark_mode', newValue.toString());
      return newValue;
    });
  };

  const colors = isDarkMode ? {
    // Dark mode colors
    blue: '#3B82F6',
    green: '#10B981',
    orange: '#F59E0B',
    purple: '#8B5CF6',
    red: '#EF4444',
    yellow: '#FBBF24',
    teal: '#14B8A6',
    pink: '#EC4899',
    gray: '#9CA3AF',
    gray2: '#6B7280',
    gray3: '#4B5563',
    gray4: '#374151',
    gray5: '#1F2937',
    gray6: '#111827',
    background: '#0F172A',
    label: '#F9FAFB',
    secondary: '#D1D5DB',
    cardBg: '#1E293B',
    navBg: 'rgba(15, 23, 42, 0.95)',
    borderLight: 'rgba(255, 255, 255, 0.1)'
  } : {
    // Light mode colors
    blue: '#007AFF',
    green: '#34C759',
    orange: '#FF9500',
    purple: '#AF52DE',
    red: '#FF3B30',
    yellow: '#FFCC00',
    teal: '#30B0C7',
    pink: '#EC4899',
    gray: '#8E8E93',
    gray2: '#AEAEB2',
    gray3: '#C7C7CC',
    gray4: '#D1D1D6',
    gray5: '#E5E5EA',
    gray6: '#F2F2F7',
    background: '#FFFFFF',
    label: '#000000',
    secondary: '#3C3C43',
    cardBg: '#FFFFFF',
    navBg: 'rgba(255, 255, 255, 0.95)',
    borderLight: 'rgba(0, 0, 0, 0.06)'
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024 && windowWidth > 768;
  const isTabletOrMobile = windowWidth <= 1024;

  useEffect(() => {
    hubAnimationRef.current = setInterval(() => {
      setActiveHubIndex(prev => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(hubAnimationRef.current);
  }, []);

  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setShowIdlePrompt(false);
      idleTimerRef.current = setTimeout(() => setShowIdlePrompt(true), IDLE_TIMEOUT);
    };
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(e => document.addEventListener(e, resetIdleTimer, true));
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach(e => document.removeEventListener(e, resetIdleTimer, true));
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('pn_cookieConsent');
    if (consent) setShowCookieConsent(false);
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem('pn_cookieConsent', 'accepted');
    setShowCookieConsent(false);
  };

  const handleCookieDecline = () => {
    localStorage.setItem('pn_cookieConsent', 'declined');
    setShowCookieConsent(false);
  };

  const handleIdleResponse = (needsHelp) => {
    setShowIdlePrompt(false);
    if (needsHelp) setShowAIChat(true);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    const userQuestion = chatInput.toLowerCase();
    setChatInput('');
    
    setTimeout(() => {
      let response = "Great question! I'd be happy to help with that.";
      if (userQuestion.includes('price') || userQuestion.includes('cost')) {
        response = "Our Starter plan is free! Pro is $6.79/mo (or less with annual billing) for couples, and Family is $11.04/mo for up to 5 members. All paid plans include a 14-day free trial!";
      } else if (userQuestion.includes('fire') || userQuestion.includes('retire')) {
        response = "FIRE stands for Financial Independence, Retire Early. ProsperNest helps you calculate your FIRE number and track progress. Your side hustle income can accelerate your journey by years!";
      } else if (userQuestion.includes('side hustle') || userQuestion.includes('business')) {
        response = "ProsperNest is perfect for tracking side hustle income! Our BizBudget Hub (coming soon) will let you separate business from personal finances, track deductions, and generate Schedule C reports.";
      } else if (userQuestion.includes('trial') || userQuestion.includes('free')) {
        response = "Yes! You can start with our free Starter plan, or try Pro/Family with a 14-day free trial. No credit card required to start exploring!";
      }
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleStartTrial = (plan = null) => {
    setSelectedPlan(plan);
    setAuthMode('signup');
    setShowSignupModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowSignupModal(true);
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@prospernest.app?subject=Support Request&body=Hi ProsperNest Team,%0D%0A%0D%0A';
  };

  const handleLiveChat = () => {
    setShowAIChat(true);
  };

  const handleAddressChange = (value) => {
    setSignupForm(prev => ({ ...prev, address: value }));
    if (value.length > 3) {
      const mockSuggestions = [
        `${value}, Atlanta, GA 30301`,
        `${value}, New York, NY 10001`,
        `${value}, Los Angeles, CA 90001`,
        `${value}, Chicago, IL 60601`,
      ];
      setAddressSuggestions(mockSuggestions);
    } else {
      setAddressSuggestions([]);
    }
  };

  const selectAddress = (address) => {
    setSignupForm(prev => ({ ...prev, address }));
    setAddressSuggestions([]);
  };

  const getPricing = (plan) => {
    const prices = {
      starter: { monthly: 0, annual: 0 },
      pro: { monthly: 9.99, annual: Math.round(9.99 * 0.85 * 100) / 100 },
      family: { monthly: 14.99, annual: Math.round(14.99 * 0.85 * 100) / 100 }
    };
    return prices[plan][billingCycle];
  };

  const getModalPricing = (plan) => {
    const prices = {
      starter: { monthly: 0, annual: 0 },
      pro: { monthly: 9.99, annual: Math.round(9.99 * 0.85 * 100) / 100 },
      family: { monthly: 14.99, annual: Math.round(14.99 * 0.85 * 100) / 100 }
    };
    return prices[plan][modalBillingCycle];
  };

  const PennyLogo = ({ size = 48, animate = false }) => (
    <div style={{ display: 'inline-flex', animation: animate ? 'bounce 2s ease-in-out infinite' : 'none' }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="58" rx="18" ry="4" fill="rgba(0,0,0,0.1)"/>
        <circle cx="32" cy="32" r="26" fill="url(#coinGradient)" stroke="#E5A800" strokeWidth="3"/>
        <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
        <ellipse cx="24" cy="28" rx="4" ry="5" fill="#1a1a1a"/>
        <ellipse cx="40" cy="28" rx="4" ry="5" fill="#1a1a1a"/>
        <circle cx="25.5" cy="26" r="1.5" fill="#FFF"/>
        <circle cx="41.5" cy="26" r="1.5" fill="#FFF"/>
        <ellipse cx="18" cy="36" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.6"/>
        <ellipse cx="46" cy="36" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.6"/>
        <path d="M24 40 Q32 48 40 40" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <text x="32" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#DAA520">$</text>
        <defs>
          <linearGradient id="coinGradient" x1="10" y1="10" x2="54" y2="54">
            <stop offset="0%" stopColor="#FFE066"/><stop offset="50%" stopColor="#FFD700"/><stop offset="100%" stopColor="#FFC107"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  const Logo = ({ size = 40, showBeta = true, showText = true }) => (
    <div 
      onClick={scrollToTop}
      onTouchEnd={(e) => { e.preventDefault(); scrollToTop(); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') scrollToTop(); }}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        cursor: 'pointer', 
        userSelect: 'none', 
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {/* Logo icon with pink gradient background - matches app */}
      <div style={{
        width: size,
        height: size,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(236, 72, 153, 0.35)',
        flexShrink: 0
      }}>
        <PennyLogo size={size * 0.7} />
      </div>
      {showText && (
        <span style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          fontSize: Math.max(size * 0.45, 16), 
          fontWeight: '700', 
          letterSpacing: '-0.02em', 
          color: colors.label,
        }}>
          Prosper<span style={{ color: '#EC4899' }}>Nest</span>
        </span>
      )}
      {showBeta && showText && (
        <span style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #EC4899, #DB2777)' 
            : 'linear-gradient(135deg, #F59E0B, #D97706)',
          color: '#FFF',
          fontSize: size > 40 ? '10px' : '8px',
          fontWeight: '700',
          padding: size > 40 ? '4px 10px' : '3px 6px',
          borderRadius: '6px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          flexShrink: 0
        }}>Beta</span>
      )}
    </div>
  );

  // Terms of Service Modal
  const TermsModal = () => (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10005, padding: '20px'
    }}>
      <div style={{
        background: '#FFF', borderRadius: '20px', width: '100%', maxWidth: '700px',
        maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${colors.gray5}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.label, margin: 0 }}>Terms of Service</h2>
          <button onClick={() => setShowTermsModal(false)}
            style={{ background: colors.gray6, border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto', fontSize: '14px', lineHeight: 1.7, color: colors.secondary }}>
          <p style={{ marginBottom: '16px' }}><strong>Last Updated:</strong> December 2, 2024</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>1. Acceptance of Terms</h3>
          <p style={{ marginBottom: '16px' }}>By accessing or using ProsperNest ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>2. Description of Service</h3>
          <p style={{ marginBottom: '16px' }}>ProsperNest provides personal finance management tools including budget tracking, expense categorization, financial goal setting, and reporting features. We provide read-only access to your connected financial accounts through secure third-party providers.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>3. User Accounts</h3>
          <p style={{ marginBottom: '16px' }}>You must be at least 18 years old to use this Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>4. Financial Data</h3>
          <p style={{ marginBottom: '16px' }}>ProsperNest only has read-only access to your financial accounts. We cannot initiate transactions or transfers on your behalf. We use bank-level 256-bit encryption to protect your data.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>5. Not Financial Advice</h3>
          <p style={{ marginBottom: '16px' }}>ProsperNest is a tool for organizing your finances. We do not provide financial, investment, tax, or legal advice. Consult with qualified professionals for financial guidance.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>6. Subscription and Billing</h3>
          <p style={{ marginBottom: '16px' }}>Paid plans are billed monthly or annually. You may cancel at any time and continue to have access until the end of your billing period. Refunds are provided on a case-by-case basis.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>7. Limitation of Liability</h3>
          <p style={{ marginBottom: '16px' }}>ProsperNest is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>8. Termination</h3>
          <p style={{ marginBottom: '16px' }}>We reserve the right to suspend or terminate your account for violations of these terms. You may delete your account at any time through your account settings.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>9. Contact</h3>
          <p style={{ marginBottom: '16px' }}>For questions about these Terms, contact us at legal@prospernest.io</p>
        </div>
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.gray5}` }}>
          <button onClick={() => setShowTermsModal(false)}
            style={{ width: '100%', padding: '14px', background: colors.blue, color: '#FFF', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Privacy Policy Modal
  const PrivacyModal = () => (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10005, padding: '20px'
    }}>
      <div style={{
        background: '#FFF', borderRadius: '20px', width: '100%', maxWidth: '700px',
        maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${colors.gray5}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.label, margin: 0 }}>Privacy Policy</h2>
          <button onClick={() => setShowPrivacyModal(false)}
            style={{ background: colors.gray6, border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto', fontSize: '14px', lineHeight: 1.7, color: colors.secondary }}>
          <p style={{ marginBottom: '16px' }}><strong>Last Updated:</strong> December 2, 2024</p>
          
          <div style={{ background: `${colors.green}10`, border: `1px solid ${colors.green}30`, borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ fontWeight: '600', color: colors.green, marginBottom: '10px', fontSize: '15px' }}>🔒 Quick Privacy Facts:</p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: colors.green }}>
              <li style={{ marginBottom: '6px' }}>We NEVER sell your data</li>
              <li style={{ marginBottom: '6px' }}>We have read-only access to your accounts</li>
              <li style={{ marginBottom: '6px' }}>We never see your bank login credentials</li>
              <li>256-bit encryption protects all your data</li>
            </ul>
          </div>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>1. Information We Collect</h3>
          <p style={{ marginBottom: '16px' }}>We collect information you provide directly (name, email, password) and financial data from connected accounts (transactions, balances, account information). We also collect usage data to improve our Service.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>2. How We Use Your Information</h3>
          <p style={{ marginBottom: '16px' }}>We use your information to provide and improve our Service, send you important notifications, personalize your experience, and ensure the security of your account. We never sell your personal or financial information to third parties.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>3. Data Security</h3>
          <p style={{ marginBottom: '16px' }}>We use industry-standard security measures including 256-bit SSL/TLS encryption for data in transit, AES-256 encryption for data at rest, and two-factor authentication options. Our infrastructure is hosted on SOC 2 Type II certified providers.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>4. Third-Party Services</h3>
          <p style={{ marginBottom: '16px' }}>We use trusted third-party services (like Plaid) to securely connect to your financial institutions. These providers never share your login credentials with us—we only receive read-only access to your transaction data.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>5. Data Retention</h3>
          <p style={{ marginBottom: '16px' }}>We retain your data for as long as your account is active. You can request deletion of your data at any time by contacting us or through your account settings.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>6. Your Rights</h3>
          <p style={{ marginBottom: '16px' }}>You have the right to access, correct, or delete your personal data at any time. You can also export your data or request a copy of all information we have about you.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>7. Children's Privacy</h3>
          <p style={{ marginBottom: '16px' }}>Our Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children.</p>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.label, marginTop: '20px', marginBottom: '12px' }}>8. Contact Us</h3>
          <p style={{ marginBottom: '16px' }}>For privacy-related questions or requests, contact us at privacy@prospernest.io</p>
        </div>
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${colors.gray5}` }}>
          <button onClick={() => setShowPrivacyModal(false)}
            style={{ width: '100%', padding: '14px', background: colors.blue, color: '#FFF', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Device Mockups Component
  const DeviceMockups = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', padding: '30px 0' }}>
        {/* MacBook Pro 2024 - Thin bezels, notch design, silver aluminum */}
        <div className="hover-lift" style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          {/* Screen bezel - very thin like M3 MacBook */}
          <div style={{
            background: '#1d1d1f', 
            borderRadius: '12px 12px 0 0', 
            padding: '6px 6px 0 6px',
            width: '420px',
            position: 'relative'
          }}>
            {/* Notch with camera */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '18px',
              background: '#1d1d1f',
              borderRadius: '0 0 10px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2a2a2c' }} />
            </div>
            {/* Screen */}
            <div style={{
              background: colors.gray6, 
              width: '408px', 
              height: '256px', 
              padding: '20px 16px 16px 16px',
              borderRadius: '4px 4px 0 0',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: '12px', height: '100%' }}>
                <div style={{ width: '90px', background: '#1e1b38', borderRadius: '8px', padding: '12px' }}>
                  {['Dashboard', 'Sales', 'Budget', 'Bills', 'Goals', 'Reports'].map((item, i) => (
                    <div key={item} style={{
                      padding: '6px 8px', borderRadius: '6px', marginBottom: '4px', fontSize: '10px',
                      color: i === 0 ? '#FFF' : 'rgba(255,255,255,0.5)',
                      background: i === 0 ? '#8B5CF6' : 'transparent'
                    }}>{item}</div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
                    {[
                      { l: 'Income', v: '$12.4K', c: colors.green },
                      { l: 'Expenses', v: '$4.2K', c: colors.red },
                    ].map((s, i) => (
                      <div key={i} style={{ background: '#FFF', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ fontSize: '10px', color: colors.gray }}>{s.l}</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: s.c }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div style={{ background: '#FFF', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '600', marginBottom: '8px' }}>👤 Personal</div>
                      <div style={{ background: colors.green, borderRadius: '6px', padding: '8px', color: '#FFF', fontSize: '12px' }}>
                        <div style={{ opacity: 0.9 }}>Income</div>
                        <div style={{ fontWeight: '700' }}>$6,200</div>
                      </div>
                    </div>
                    <div style={{ background: '#FFF', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '600', marginBottom: '8px' }}>💼 Side Hustle</div>
                      <div style={{ background: colors.purple, borderRadius: '6px', padding: '8px', color: '#FFF', fontSize: '12px' }}>
                        <div style={{ opacity: 0.9 }}>Revenue</div>
                        <div style={{ fontWeight: '700' }}>$6,250</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom chin - very thin */}
          <div style={{
            background: '#1d1d1f', 
            width: '420px', 
            height: '10px',
            borderRadius: '0 0 4px 4px'
          }}/>
          {/* Hinge */}
          <div style={{
            background: 'linear-gradient(180deg, #e3e3e3 0%, #c9c9c9 50%, #a8a8a8 100%)', 
            width: '420px', 
            height: '8px',
            borderRadius: '0 0 2px 2px'
          }}/>
          {/* Base/Keyboard - silver aluminum */}
          <div style={{
            background: 'linear-gradient(180deg, #e8e8e8 0%, #d4d4d4 100%)', 
            width: '480px', 
            height: '10px', 
            marginLeft: '-30px',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            position: 'relative'
          }}>
            {/* Notch cutout in base */}
            <div style={{
              position: 'absolute',
              top: '-2px',
              left: '50%',
              transform: 'translateX(-50)',
              width: '120px',
              height: '4px',
              background: 'linear-gradient(180deg, #c9c9c9 0%, #d4d4d4 100%)',
              borderRadius: '0 0 4px 4px'
            }} />
          </div>
        </div>

        {/* iPad Pro 2024 - Ultra thin bezels, no home button */}
        <div className="hover-lift" style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{
            background: '#1d1d1f', 
            borderRadius: '18px', 
            padding: '8px',
            width: '210px', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            {/* Front camera */}
            <div style={{
              position: 'absolute',
              top: '14px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#2a2a2c',
              zIndex: 5
            }} />
            <div style={{
              background: colors.gray6, 
              borderRadius: '12px', 
              height: '290px', 
              padding: '16px 14px 14px 14px', 
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: colors.gray, marginBottom: '12px' }}>
                <span>9:41</span><span>📶 🔋</span>
              </div>
              <div style={{ background: colors.green, borderRadius: '10px', padding: '14px', color: '#FFF', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Net Worth</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>$245,830</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#FFF', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ fontSize: '9px', color: colors.gray }}>Income</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.green }}>$12.4K</div>
                </div>
                <div style={{ background: '#FFF', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ fontSize: '9px', color: colors.gray }}>Side Hustle</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.purple }}>$6.2K</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* iPhone 16/17 Pro - Squared titanium edges, thin bezels */}
        <div className="hover-lift" style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{
            background: 'linear-gradient(145deg, #3a3a3c 0%, #1d1d1f 100%)', 
            borderRadius: '20px', 
            padding: '6px',
            width: '140px', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            position: 'relative'
          }}>
            {/* Side buttons - left */}
            <div style={{
              position: 'absolute',
              left: '-2px',
              top: '70px',
              width: '3px',
              height: '24px',
              background: '#4a4a4c',
              borderRadius: '2px 0 0 2px'
            }} />
            <div style={{
              position: 'absolute',
              left: '-2px',
              top: '105px',
              width: '3px',
              height: '45px',
              background: '#4a4a4c',
              borderRadius: '2px 0 0 2px'
            }} />
            {/* Side button - right (power) */}
            <div style={{
              position: 'absolute',
              right: '-2px',
              top: '90px',
              width: '3px',
              height: '36px',
              background: '#4a4a4c',
              borderRadius: '0 2px 2px 0'
            }} />
            
            <div style={{
              background: colors.gray6, 
              borderRadius: '16px', 
              height: '284px', 
              padding: '10px', 
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Dynamic Island */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '8px',
                position: 'relative',
                zIndex: 5
              }}>
                <div style={{ 
                  width: '60px', 
                  height: '18px', 
                  background: '#1d1d1f', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 6px'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2a2a2c' }} />
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1a472a' }} />
                </div>
              </div>
              <div style={{ background: colors.blue, borderRadius: '10px', padding: '14px', color: '#FFF', marginBottom: '10px' }}>
                <div style={{ fontSize: '9px', opacity: 0.8 }}>Balance</div>
                <div style={{ fontSize: '20px', fontWeight: '700' }}>$8,220</div>
              </div>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                <div style={{ fontSize: '9px', color: colors.gray }}>Goals</div>
                <div style={{ background: colors.gray5, borderRadius: '4px', height: '8px', marginTop: '6px' }}>
                  <div style={{ width: '65%', height: '100%', background: colors.green, borderRadius: '4px' }}/>
                </div>
              </div>
              <div style={{ background: '#FFF', borderRadius: '8px', padding: '10px' }}>
                <div style={{ fontSize: '9px', color: colors.gray }}>This Month</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: colors.green }}>+$3,120</div>
              </div>
              
              {/* Home indicator */}
              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '36%',
                height: '4px',
                background: '#1d1d1f',
                borderRadius: '2px'
              }} />
            </div>
          </div>
        </div>

        {/* Apple Watch Series 10 - Larger display, thinner case */}
        <div className="hover-lift" style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          {/* Watch band - top */}
          <div style={{
            width: '46px',
            height: '40px',
            background: 'linear-gradient(180deg, #2d2d2d 0%, #1d1d1f 100%)',
            borderRadius: '6px 6px 0 0',
            margin: '0 auto'
          }} />
          {/* Watch case */}
          <div style={{
            background: 'linear-gradient(145deg, #2a2a2c 0%, #1d1d1f 100%)', 
            borderRadius: '20px', 
            padding: '4px',
            width: '80px', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.35)',
            position: 'relative'
          }}>
            {/* Digital Crown */}
            <div style={{
              position: 'absolute',
              right: '-4px',
              top: '22px',
              width: '6px',
              height: '16px',
              background: 'linear-gradient(180deg, #4a4a4c 0%, #2a2a2c 100%)',
              borderRadius: '3px'
            }}/>
            {/* Side button */}
            <div style={{
              position: 'absolute',
              right: '-4px',
              top: '46px',
              width: '6px',
              height: '12px',
              background: 'linear-gradient(180deg, #3a3a3c 0%, #2a2a2c 100%)',
              borderRadius: '3px'
            }}/>
            
            <div style={{
              background: '#000', 
              borderRadius: '18px', 
              height: '96px', 
              padding: '10px',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center'
            }}>
              <PennyLogo size={26} />
              <div style={{ color: colors.green, fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>$8.2K</div>
              <div style={{ color: colors.gray, fontSize: '8px' }}>This Month</div>
            </div>
          </div>
          {/* Watch band - bottom */}
          <div style={{
            width: '46px',
            height: '40px',
            background: 'linear-gradient(180deg, #1d1d1f 0%, #2d2d2d 100%)',
            borderRadius: '0 0 6px 6px',
            margin: '0 auto'
          }} />
        </div>
      </div>
      
      {/* iOS and Android badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.secondary, fontSize: '14px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
          </svg>
          <span style={{ fontWeight: '500' }}>iOS</span>
        </div>
        <div style={{ width: '1px', height: '20px', background: colors.gray4 }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.secondary, fontSize: '14px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.523 2.3a1 1 0 011.154.8l.572 3.428 3.428.572a1 1 0 010 1.976l-3.428.572-.572 3.428a1 1 0 01-1.976 0l-.572-3.428-3.428-.572a1 1 0 010-1.976l3.428-.572.572-3.428a1 1 0 01.822-.8zM6 4a4 4 0 014 4v8a4 4 0 01-4 4 4 4 0 01-4-4V8a4 4 0 014-4zm12 7a3 3 0 110 6 3 3 0 010-6z"/>
          </svg>
          <span style={{ fontWeight: '500' }}>Android</span>
        </div>
        <div style={{ 
          background: colors.green, 
          color: '#FFF', 
          padding: '6px 14px', 
          borderRadius: '20px', 
          fontSize: '12px', 
          fontWeight: '600',
          marginLeft: '8px'
        }}>
          Coming Soon
        </div>
      </div>
    </div>
  );

  // Feature Mockups
  const FeatureMockups = () => (
    <div className="feature-mockups-wrapper" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {/* Dashboard */}
      <div className="hover-lift" style={{
        background: '#FFF', borderRadius: '20px', padding: '24px', flex: '1 1 280px', maxWidth: '320px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}>
        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📊</span> Dashboard
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { l: 'Personal', v: '$6,200', c: colors.green },
            { l: 'Side Hustle', v: '$6,250', c: colors.purple },
          ].map((s, i) => (
            <div key={i} style={{ background: s.c, borderRadius: '12px', padding: '16px', color: '#FFF' }}>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>{s.l}</div>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bills */}
      <div className="hover-lift" style={{
        background: '#FFF', borderRadius: '20px', padding: '24px', flex: '1 1 280px', maxWidth: '320px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}>
        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📅</span> Bill Reminders
        </div>
        {[
          { name: 'Rent', date: 'Dec 1', amount: '$1,500', status: 'paid' },
          { name: 'Electric', date: 'Dec 15', amount: '$120', status: 'upcoming' },
          { name: 'Internet', date: 'Dec 20', amount: '$80', status: 'upcoming' },
        ].map((bill, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0', borderBottom: i < 2 ? `1px solid ${colors.gray5}` : 'none'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{bill.name}</div>
              <div style={{ fontSize: '12px', color: colors.gray }}>{bill.date}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>{bill.amount}</div>
              <div style={{
                fontSize: '11px', padding: '4px 10px', borderRadius: '8px',
                background: bill.status === 'paid' ? `${colors.green}20` : `${colors.orange}20`,
                color: bill.status === 'paid' ? colors.green : colors.orange,
                fontWeight: '500'
              }}>{bill.status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Tracker */}
      <div className="hover-lift" style={{
        background: '#FFF', borderRadius: '20px', padding: '24px', flex: '1 1 280px', maxWidth: '320px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}>
        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>💼</span> Sales Tracker
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          {[
            { l: 'Deals', v: '12', c: colors.blue },
            { l: 'Commission', v: '$4,800', c: colors.green },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: s.c, borderRadius: '12px', padding: '14px', color: '#FFF' }}>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>{s.l}</div>
              <div style={{ fontSize: '18px', fontWeight: '700' }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: colors.gray, marginBottom: '10px', fontWeight: '500' }}>Recent Sales</div>
        {['Smith Property - $2,400', 'Johnson Deal - $1,800', 'Williams Contract - $3,200'].map((sale, i) => (
          <div key={i} style={{ fontSize: '13px', padding: '10px 0', borderBottom: `1px solid ${colors.gray5}` }}>{sale}</div>
        ))}
      </div>
    </div>
  );

  // Signup Modal Component
  const signupModalJSX = (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10002, padding: '20px'
    }}>
      <div style={{
        background: colors.cardBg, borderRadius: '24px', width: '100%', maxWidth: '480px',
        maxHeight: '90vh', overflow: 'auto', 
        boxShadow: isDarkMode ? '0 25px 80px rgba(0,0,0,0.5)' : '0 25px 80px rgba(0,0,0,0.3)',
        border: `1px solid ${colors.borderLight}`
      }}>
        {/* Header */}
        <div style={{
          padding: '24px', borderBottom: `1px solid ${colors.borderLight}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <Logo size={32} />
            <div style={{ fontSize: '13px', color: colors.secondary, marginTop: '4px' }}>
              {authMode === 'signin' ? 'Welcome back!' : selectedPlan ? `Start your ${selectedPlan} plan` : 'Create your account'}
            </div>
          </div>
          <button onClick={() => { setShowSignupModal(false); setSelectedPlan(null); setAuthMode('signup'); }}
            style={{ background: colors.gray5, border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: colors.label }}>✕</button>
        </div>

        {/* Google Sign In */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${colors.borderLight}` }}>
          <button 
            onClick={handleGoogleSignIn}
            disabled={signinLoading}
            style={{
              width: '100%', padding: '14px', border: `1px solid ${colors.borderLight}`,
              borderRadius: '12px', background: colors.cardBg, cursor: signinLoading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              fontSize: '15px', fontWeight: '500', transition: 'all 0.2s',
              opacity: signinLoading ? 0.7 : 1, color: colors.label
            }}
            onMouseOver={e => !signinLoading && (e.currentTarget.style.background = colors.gray5)}
            onMouseOut={e => e.currentTarget.style.background = colors.cardBg}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: colors.gray4 }}/>
            <span style={{ fontSize: '13px', color: colors.gray }}>or</span>
            <div style={{ flex: 1, height: '1px', background: colors.gray4 }}/>
          </div>
        </div>

        {/* Sign In Mode */}
        {authMode === 'signin' && (
          <div style={{ padding: '20px' }}>
            {signinError && (
              <div style={{
                background: `${colors.red}15`, border: `1px solid ${colors.red}30`,
                borderRadius: '10px', padding: '12px', marginBottom: '16px',
                fontSize: '13px', color: colors.red
              }}>
                {signinError}
              </div>
            )}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Email Address</label>
              <input 
                type="text"
                name="signin-email-field"
                placeholder="john@example.com"
                value={signinEmail}
                onChange={e => { setSigninEmail(e.target.value); setSigninError(''); }}
                autoComplete="off"
                style={{
                  width: '100%', padding: '12px', border: `1px solid ${colors.borderLight}`,
                  borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  background: colors.cardBg, color: colors.label
                }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Password</label>
              <input 
                type="password"
                name="signin-password-field"
                placeholder="••••••••"
                value={signinPassword}
                onChange={e => { setSigninPassword(e.target.value); setSigninError(''); }}
                autoComplete="new-password"
                style={{
                  width: '100%', padding: '12px', border: `1px solid ${colors.borderLight}`,
                  borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  background: colors.cardBg, color: colors.label
                }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.secondary, cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => {
                    setRememberMe(e.target.checked);
                    localStorage.setItem('pn_remember_me', e.target.checked.toString());
                    if (!e.target.checked) {
                      localStorage.removeItem('pn_remember_email');
                    }
                  }}
                /> Remember me
              </label>
              <a href="#" style={{ fontSize: '13px', color: '#EC4899', textDecoration: 'none' }}>Forgot password?</a>
            </div>

            <button onClick={handleRealSignIn}
              disabled={signinLoading}
              style={{
                width: '100%', padding: '16px', 
                background: signinLoading ? colors.secondary : 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '16px',
                fontWeight: '600', cursor: signinLoading ? 'wait' : 'pointer',
                opacity: signinLoading ? 0.7 : 1
              }}>
              {signinLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: colors.secondary }}>
              Don't have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('signup'); }} style={{ color: '#EC4899', textDecoration: 'none', fontWeight: '500' }}>
                Sign up for free
              </a>
            </div>
          </div>
        )}

        {/* Sign Up Mode */}
        {authMode === 'signup' && (
          <>
            {/* Billing Toggle */}
            <div style={{ padding: '16px 20px', background: colors.gray6, display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: colors.background, padding: '4px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <button onClick={() => setModalBillingCycle('monthly')}
                  style={{
                    padding: '8px 16px', border: 'none', borderRadius: '14px', fontSize: '13px', fontWeight: '500',
                    background: modalBillingCycle === 'monthly' ? colors.blue : 'transparent',
                    color: modalBillingCycle === 'monthly' ? '#FFF' : colors.secondary, cursor: 'pointer', transition: 'all 0.2s'
                  }}>Monthly</button>
                <button onClick={() => setModalBillingCycle('annual')}
                  style={{
                    padding: '8px 16px', border: 'none', borderRadius: '14px', fontSize: '13px', fontWeight: '500',
                    background: modalBillingCycle === 'annual' ? colors.blue : 'transparent',
                    color: modalBillingCycle === 'annual' ? '#FFF' : colors.secondary, cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                  Annual <span style={{ background: colors.green, color: '#FFF', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', marginLeft: '4px' }}>15% OFF</span>
                </button>
              </div>
            </div>

            {/* Plan Selection */}
            {!selectedPlan && (
              <div style={{ padding: '20px', borderBottom: `1px solid ${colors.gray5}` }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Choose your plan</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'starter', name: 'Starter', price: getModalPricing('starter'), desc: '1 account' },
                    { id: 'pro', name: 'Pro', price: getModalPricing('pro'), desc: '2 accounts', popular: true },
                    { id: 'family', name: 'Family', price: getModalPricing('family'), desc: '5 members' },
                  ].map(plan => (
                    <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                      style={{
                        flex: 1, minWidth: '120px', padding: '16px', border: `2px solid ${plan.popular ? colors.blue : colors.gray5}`,
                        borderRadius: '12px', background: plan.popular ? `${colors.blue}08` : '#FFF', cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.2s', position: 'relative'
                      }}
                      onMouseOver={e => e.currentTarget.style.borderColor = colors.blue}
                      onMouseOut={e => e.currentTarget.style.borderColor = plan.popular ? colors.blue : colors.gray5}>
                      {plan.popular && (
                        <div style={{ position: 'absolute', top: '-8px', right: '10px', background: colors.orange, padding: '2px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: '600', color: '#FFF' }}>POPULAR</div>
                      )}
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{plan.name}</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: colors.blue }}>
                        {plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)}`}
                        {plan.price > 0 && <span style={{ fontSize: '12px', fontWeight: '400', color: colors.gray }}>/mo</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: colors.gray }}>{plan.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Plan Summary */}
            {selectedPlan && (
              <div style={{ padding: '12px 20px', background: `${colors.blue}08`, borderBottom: `1px solid ${colors.gray5}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', color: colors.secondary }}>Selected Plan</div>
                  <div style={{ fontWeight: '600' }}>{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} - {getModalPricing(selectedPlan) === 0 ? 'Free' : `$${getModalPricing(selectedPlan).toFixed(2)}/mo`}</div>
                </div>
                <button onClick={() => setSelectedPlan(null)} style={{ fontSize: '13px', color: colors.blue, background: 'none', border: 'none', cursor: 'pointer' }}>Change</button>
              </div>
            )}

            {/* Signup Form */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>First Name *</label>
                  <input 
                    type="text"
                    name="signup-firstname"
                    value={signupForm.firstName}
                    onChange={e => setSignupForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                    autoComplete="off"
                    style={{
                      width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                      borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Last Name *</label>
                  <input 
                    type="text"
                    name="signup-lastname"
                    value={signupForm.lastName}
                    onChange={e => setSignupForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Smith"
                    autoComplete="off"
                    style={{
                      width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                      borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }} />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Email Address *</label>
                <input 
                  type="text"
                  name="signup-email"
                  value={signupForm.email}
                  onChange={e => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  autoComplete="off"
                  style={{
                    width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }} />
              </div>

              <div style={{ marginBottom: '12px', position: 'relative' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Address *</label>
                <input 
                  type="text"
                  name="signup-address"
                  value={signupForm.address}
                  onChange={e => handleAddressChange(e.target.value)}
                  placeholder="Start typing your address..."
                  autoComplete="off"
                  style={{
                    width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }} />
                {addressSuggestions.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFF',
                    border: `1px solid ${colors.gray4}`, borderRadius: '10px', marginTop: '4px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden'
                  }}>
                    {addressSuggestions.map((addr, i) => (
                      <div key={i} onClick={() => selectAddress(addr)}
                        style={{
                          padding: '10px 12px', cursor: 'pointer', fontSize: '13px',
                          borderBottom: i < addressSuggestions.length - 1 ? `1px solid ${colors.gray5}` : 'none'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = colors.gray6}
                        onMouseOut={e => e.currentTarget.style.background = '#FFF'}>
                        📍 {addr}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CC Info for paid plans */}
              {selectedPlan && selectedPlan !== 'starter' && (
                <div style={{
                  background: colors.gray6, borderRadius: '12px', padding: '16px', marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>Payment Information</div>
                  <div style={{ marginBottom: '10px' }}>
                    <input 
                      type="text"
                      name="card-number"
                      placeholder="Card Number"
                      autoComplete="off"
                      style={{
                        width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                        borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                      }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input 
                      type="text"
                      name="card-expiry"
                      placeholder="MM/YY"
                      autoComplete="off"
                      style={{
                        padding: '12px', border: `1px solid ${colors.gray4}`,
                        borderRadius: '10px', fontSize: '14px', outline: 'none'
                      }} />
                    <input 
                      type="text"
                      name="card-cvc"
                      placeholder="CVC"
                      autoComplete="off"
                      style={{
                        padding: '12px', border: `1px solid ${colors.gray4}`,
                        borderRadius: '10px', fontSize: '14px', outline: 'none'
                      }} />
                  </div>
                  <div style={{ fontSize: '11px', color: colors.gray, marginTop: '8px' }}>
                    🔒 Your card won't be charged during the 14-day free trial
                  </div>
                </div>
              )}

              {/* Checkboxes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={signupForm.receiveUpdates}
                    onChange={e => setSignupForm(prev => ({ ...prev, receiveUpdates: e.target.checked }))}
                    style={{ marginTop: '2px' }} />
                  <span style={{ fontSize: '13px', color: colors.secondary }}>
                    Send me product updates, tips, and financial insights
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={signupForm.agreeToPrivacy}
                    onChange={e => setSignupForm(prev => ({ ...prev, agreeToPrivacy: e.target.checked }))}
                    style={{ marginTop: '2px' }} />
                  <span style={{ fontSize: '13px', color: colors.secondary }}>
                    I agree to the <button type="button" onClick={() => setShowTermsModal(true)} style={{ color: colors.blue, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', padding: 0 }}>Terms of Service</button> and <button type="button" onClick={() => setShowPrivacyModal(true)} style={{ color: colors.blue, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', padding: 0 }}>Privacy Policy</button> *
                  </span>
                </label>
              </div>

              <button onClick={() => { 
                  setShowSignupModal(false); 
                  setShowOnboarding(true);
                  setOnboardingStep(0);
                }}
                disabled={!signupForm.agreeToPrivacy || !selectedPlan}
                style={{
                  width: '100%', padding: '16px', background: (signupForm.agreeToPrivacy && selectedPlan) ? colors.blue : colors.gray4,
                  border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '16px',
                  fontWeight: '600', cursor: (signupForm.agreeToPrivacy && selectedPlan) ? 'pointer' : 'not-allowed'
                }}>
                {selectedPlan === 'starter' ? 'Create Free Account' : 'Start 14-Day Free Trial'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: colors.secondary }}>
                Already have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('signin'); }} style={{ color: colors.blue, textDecoration: 'none', fontWeight: '500' }}>
                  Sign in
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Onboarding Modal
  const OnboardingModal = () => {
    const planName = selectedPlan?.charAt(0).toUpperCase() + selectedPlan?.slice(1);
    const isPro = selectedPlan === 'pro';
    const isFamily = selectedPlan === 'family';
    const maxMembers = isFamily ? 5 : isPro ? 2 : 1;
    
    const motivations = [
      { id: 'debt', label: 'Pay off debt', icon: '💳' },
      { id: 'save', label: 'Build savings', icon: '🏦' },
      { id: 'retire', label: 'Retire early (FIRE)', icon: '🔥' },
      { id: 'sidehustle', label: 'Track side hustle', icon: '💼' },
      { id: 'family', label: 'Manage family finances', icon: '👨‍👩‍👧‍👦' },
      { id: 'invest', label: 'Start investing', icon: '📈' }
    ];
    
    const features = [
      { id: 'budget', label: 'Set up my budget', icon: '📊', desc: 'Create spending categories' },
      { id: 'goals', label: 'Add financial goals', icon: '🎯', desc: 'Save for what matters' },
      { id: 'bills', label: 'Track my bills', icon: '📅', desc: 'Never miss a payment' },
      { id: 'import', label: 'Import my data', icon: '📥', desc: 'Connect accounts or upload' }
    ];

    const handleFinishOnboarding = () => {
      setShowOnboarding(false);
      onNavigate && onNavigate('dashboard');
    };

    const handleSkip = () => {
      setShowOnboarding(false);
      onNavigate && onNavigate('dashboard');
    };

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10003, padding: '20px'
      }}>
        <div style={{
          background: '#FFF', borderRadius: '28px', width: '100%', maxWidth: '520px',
          maxHeight: '90vh', overflow: 'auto', boxShadow: '0 30px 100px rgba(0,0,0,0.4)'
        }}>
          {/* Progress Bar */}
          <div style={{ padding: '20px 24px 0', display: 'flex', gap: '6px' }}>
            {[0, 1, 2, ...(isPro || isFamily ? [3] : []), ...(isPro || isFamily ? [4] : [])].map((step, i) => (
              <div key={i} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: i <= onboardingStep ? colors.blue : colors.gray5,
                transition: 'background 0.3s'
              }} />
            ))}
          </div>

          {/* Step 0: Welcome */}
          {onboardingStep === 0 && (
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ marginBottom: '24px' }}>
                <PennyLogo size={80} animate />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '12px' }}>
                Welcome to ProsperNest! 🎉
              </h2>
              <p style={{ fontSize: '16px', color: colors.secondary, lineHeight: 1.6, marginBottom: '24px' }}>
                Hi {signupForm.firstName || 'there'}! I'm <strong>Penny</strong>, your quirky financial sidekick.
              </p>
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                fontSize: '14px', color: colors.secondary, cursor: 'pointer', marginBottom: '24px'
              }}>
                <input type="checkbox" checked={onboardingData.pennyEnabled}
                  onChange={e => setOnboardingData(prev => ({ ...prev, pennyEnabled: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: colors.blue }} />
                Enable Penny as my AI assistant
              </label>
              <button onClick={() => setOnboardingStep(1)}
                style={{
                  width: '100%', padding: '16px', background: colors.blue,
                  border: 'none', borderRadius: '14px', color: '#FFF', fontSize: '16px',
                  fontWeight: '600', cursor: 'pointer', marginBottom: '12px'
                }}>
                Let's Get Started! 🚀
              </button>
              <button onClick={handleSkip}
                style={{ background: 'none', border: 'none', color: colors.gray, fontSize: '14px', cursor: 'pointer' }}>
                Skip for now
              </button>
            </div>
          )}

          {/* Step 1: Motivation */}
          {onboardingStep === 1 && (
            <div style={{ padding: '32px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>What brings you here?</h2>
                <p style={{ fontSize: '14px', color: colors.secondary }}>Select all that apply</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {motivations.map(m => {
                  const isSelected = onboardingData.motivations.includes(m.id);
                  return (
                    <button key={m.id}
                      onClick={() => {
                        const current = onboardingData.motivations;
                        const updated = isSelected ? current.filter(x => x !== m.id) : [...current, m.id];
                        setOnboardingData(prev => ({ ...prev, motivations: updated }));
                      }}
                      style={{
                        padding: '16px', border: `2px solid ${isSelected ? colors.blue : colors.gray5}`,
                        borderRadius: '14px', background: isSelected ? `${colors.blue}08` : '#FFF',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', position: 'relative'
                      }}>
                      {isSelected && (
                        <div style={{
                          position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderRadius: '50%',
                          background: colors.blue, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                        }}>✓</div>
                      )}
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{m.icon}</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{m.label}</div>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setOnboardingStep(0)}
                  style={{ flex: 1, padding: '14px', background: colors.gray6, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>Back</button>
                <button onClick={() => setOnboardingStep(2)}
                  disabled={onboardingData.motivations.length === 0}
                  style={{
                    flex: 2, padding: '14px', background: onboardingData.motivations.length > 0 ? colors.blue : colors.gray4,
                    border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '15px', fontWeight: '600',
                    cursor: onboardingData.motivations.length > 0 ? 'pointer' : 'not-allowed'
                  }}>Continue</button>
              </div>
            </div>
          )}

          {/* Step 2: What to start with */}
          {onboardingStep === 2 && (
            <div style={{ padding: '32px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Where would you like to start?</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {features.map(f => (
                  <button key={f.id}
                    onClick={() => {
                      const current = onboardingData.startWith;
                      const updated = current.includes(f.id) ? current.filter(x => x !== f.id) : [...current, f.id];
                      setOnboardingData(prev => ({ ...prev, startWith: updated }));
                    }}
                    style={{
                      padding: '16px', border: `2px solid ${onboardingData.startWith.includes(f.id) ? colors.blue : colors.gray5}`,
                      borderRadius: '14px', background: onboardingData.startWith.includes(f.id) ? `${colors.blue}08` : '#FFF',
                      cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px'
                    }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${colors.blue}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600' }}>{f.label}</div>
                      <div style={{ fontSize: '13px', color: colors.gray }}>{f.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setOnboardingStep(1)}
                  style={{ flex: 1, padding: '14px', background: colors.gray6, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>Back</button>
                <button onClick={() => setOnboardingStep(isPro || isFamily ? 3 : 4)}
                  style={{ flex: 2, padding: '14px', background: colors.blue, border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Invite Members */}
          {onboardingStep === 3 && (isPro || isFamily) && (
            <div style={{ padding: '32px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{isFamily ? '👨‍👩‍👧‍👦' : '💑'}</div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>{isFamily ? 'Invite Your Family' : 'Invite Your Partner'}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {Array.from({ length: maxMembers - 1 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: colors.gray6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: colors.gray }}>{i + 2}</div>
                    <input type="email" placeholder={`${isFamily ? 'Family member' : 'Partner'} email`}
                      value={onboardingData.invitedMembers[i]}
                      onChange={e => {
                        const updated = [...onboardingData.invitedMembers];
                        updated[i] = e.target.value;
                        setOnboardingData(prev => ({ ...prev, invitedMembers: updated }));
                      }}
                      style={{ flex: 1, padding: '12px 14px', border: `1px solid ${colors.gray4}`, borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setOnboardingStep(2)}
                  style={{ flex: 1, padding: '14px', background: colors.gray6, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>Back</button>
                <button onClick={() => setOnboardingStep(4)}
                  style={{ flex: 2, padding: '14px', background: colors.blue, border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  {onboardingData.invitedMembers.some(m => m) ? 'Send Invites & Continue' : 'Skip & Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Finish */}
          {onboardingStep === 4 && (
            <div style={{ padding: '32px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Your Hubs Are Ready!</h2>
              </div>
              <div style={{ padding: '16px', border: `2px solid ${colors.green}`, borderRadius: '14px', background: `${colors.green}08`, marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: colors.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏠</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>HomeBudget Hub</div>
                    <div style={{ fontSize: '12px', color: colors.gray }}>Personal & family finances</div>
                  </div>
                  <div style={{ background: colors.green, color: '#FFF', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>ACTIVE</div>
                </div>
              </div>
              <button onClick={handleFinishOnboarding}
                style={{
                  width: '100%', padding: '16px', background: colors.green,
                  border: 'none', borderRadius: '14px', color: '#FFF', fontSize: '16px',
                  fontWeight: '600', cursor: 'pointer'
                }}>
                Go to My Dashboard 🎉
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      color: colors.label,
      overflowX: 'hidden',
      width: '100%',
      maxWidth: '100vw'
    }}>
      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(52, 199, 89, 0.3); } 50% { box-shadow: 0 0 40px rgba(52, 199, 89, 0.6); } }
        .animate-in { animation: fadeIn 0.6s ease-out forwards; }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
        .apple-button { transition: all 0.2s ease; cursor: pointer; }
        .apple-button:hover { transform: scale(1.02); filter: brightness(1.05); }
        .apple-button:active { transform: scale(0.98); }
        .hub-glow { animation: glow 2s ease-in-out infinite; }
        h1, h2, h3 { letter-spacing: -0.025em; }
        html { scroll-behavior: smooth; overflow-x: hidden; }
        body { overflow-x: hidden; max-width: 100vw; }
        *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        section[id] { scroll-margin-top: 100px; }
        @media (max-width: 768px) {
          html, body { overflow-x: hidden !important; width: 100% !important; max-width: 100vw !important; }
          section[id] { scroll-margin-top: 80px; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: none !important; }
          nav { padding: 10px 16px !important; }
          section { padding: 40px 16px !important; overflow: hidden !important; width: 100% !important; max-width: 100vw !important; }
          section > div { max-width: 100% !important; padding: 0 !important; }
          h1, h2, h3, p, li, span, div { word-wrap: break-word !important; overflow-wrap: break-word !important; max-width: 100% !important; }
          h1 { font-size: clamp(24px, 7vw, 32px) !important; line-height: 1.15 !important; }
          h2 { font-size: clamp(20px, 6vw, 28px) !important; line-height: 1.2 !important; }
          h3 { font-size: clamp(16px, 5vw, 22px) !important; line-height: 1.25 !important; }
          p { font-size: clamp(13px, 4vw, 16px) !important; line-height: 1.5 !important; }
          .pricing-grid, .hub-grid, .feature-row, .support-cards, .stats-row { flex-direction: column !important; align-items: stretch !important; gap: 16px !important; width: 100% !important; }
          .feature-row > div { min-width: unset !important; width: 100% !important; flex: none !important; }
          .feature-mockups-wrapper { display: none !important; }
          .pricing-grid { padding: 20px 0 0 0 !important; gap: 20px !important; overflow: visible !important; }
          .pricing-grid > div, .pricing-card { max-width: 100% !important; width: 100% !important; flex: none !important; margin: 0 !important; transform: none !important; border-radius: 16px !important; padding: 24px !important; min-width: unset !important; overflow: visible !important; }
          .stats-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 16px !important; width: 100% !important; }
          .stats-row > div { text-align: center !important; }
          .hub-grid > div, .hub-card { max-width: 100% !important; width: 100% !important; flex: none !important; min-width: unset !important; padding: 20px !important; }
          .support-cards > div { max-width: 100% !important; width: 100% !important; }
          .device-mockups { display: none !important; }
          .mobile-hero-image { display: block !important; }
          .hero-buttons { flex-direction: column !important; width: 100% !important; padding: 0 !important; }
          .hero-buttons button { width: 100% !important; padding: 14px 20px !important; font-size: 15px !important; }
          .hero-logo svg { width: 56px !important; height: 56px !important; }
          .tutorials-grid { grid-template-columns: 1fr !important; }
          .cookie-banner { flex-direction: column !important; text-align: center !important; padding: 16px !important; gap: 12px !important; }
          .cookie-banner > div:first-child { flex-direction: column !important; align-items: center !important; }
          .cookie-buttons { width: 100% !important; flex-direction: column !important; }
          .cookie-buttons button { width: 100% !important; }
          .glow-effect { display: none !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: none !important; }
          nav { padding: 12px 24px !important; }
          .pricing-grid { overflow: visible !important; padding-top: 20px !important; }
          .pricing-card { overflow: visible !important; }
        }
        @media (max-width: 480px) {
          section { padding: 32px 12px !important; }
          h1 { font-size: clamp(22px, 6vw, 28px) !important; }
          h2 { font-size: clamp(18px, 5vw, 24px) !important; }
          h3 { font-size: clamp(15px, 4vw, 20px) !important; }
          nav { padding: 8px 12px !important; }
        }
        @media (min-width: 1025px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-menu { display: none !important; }
          .mobile-hero-image { display: none !important; }
        }
        @media (hover: none) and (pointer: coarse) {
          button, a, .clickable { min-height: 44px; }
        }
      `}</style>

      {/* Terms Modal */}
      {showTermsModal && <TermsModal />}
      
      {/* Privacy Modal */}
      {showPrivacyModal && <PrivacyModal />}

      {/* Cookie Consent */}
      {showCookieConsent && (
        <div className="cookie-banner" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${colors.gray5}`, padding: '24px 40px', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
            <span style={{ fontSize: '36px' }}>🍪</span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '17px', marginBottom: '4px' }}>We value your privacy</div>
              <div style={{ fontSize: '14px', color: colors.secondary, lineHeight: 1.4 }}>We use cookies to enhance your browsing experience and analyze our traffic.</div>
            </div>
          </div>
          <div className="cookie-buttons" style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
            <button onClick={handleCookieDecline} className="apple-button"
              style={{ padding: '14px 28px', background: colors.gray6, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', color: colors.label }}>Decline</button>
            <button onClick={handleCookieAccept} className="apple-button"
              style={{ padding: '14px 28px', background: colors.blue, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', color: '#FFF' }}>Accept All</button>
          </div>
        </div>
      )}

      {/* Idle Prompt */}
      {showIdlePrompt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, padding: '20px'
        }}>
          <div style={{
            background: colors.background, borderRadius: '20px', padding: '32px',
            maxWidth: '360px', width: '100%', textAlign: 'center'
          }}>
            <PennyLogo size={70} animate />
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginTop: '16px', marginBottom: '10px' }}>Still there? 👋</h3>
            <p style={{ fontSize: '14px', color: colors.secondary, marginBottom: '20px' }}>Need help exploring ProsperNest?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => handleIdleResponse(false)} className="apple-button"
                style={{ padding: '12px 20px', background: colors.gray6, border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '500' }}>I'm good</button>
              <button onClick={() => handleIdleResponse(true)} className="apple-button"
                style={{ padding: '12px 20px', background: colors.blue, border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '500', color: '#FFF' }}>Chat with Penny</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      {showAIChat && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', width: '340px', maxWidth: 'calc(100vw - 40px)',
          height: '450px', maxHeight: 'calc(100vh - 100px)', background: colors.background,
          borderRadius: '20px', boxShadow: '0 10px 50px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 9999, border: `1px solid ${colors.gray5}`
        }}>
          <div style={{ padding: '14px 18px', background: colors.blue, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PennyLogo size={32} />
              <div><div style={{ fontWeight: '600', fontSize: '14px' }}>Penny</div><div style={{ fontSize: '11px', opacity: 0.9 }}>Your Assistant</div></div>
            </div>
            <button onClick={() => setShowAIChat(false)}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#FFF', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? colors.blue : colors.gray6,
                  color: msg.role === 'user' ? '#FFF' : colors.label, fontSize: '13px', lineHeight: 1.5
                }}>{msg.content}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px', borderTop: `1px solid ${colors.gray5}`, display: 'flex', gap: '10px' }}>
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask Penny anything..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: '14px', border: `1px solid ${colors.gray4}`, fontSize: '13px', outline: 'none' }} />
            <button onClick={handleSendMessage} className="apple-button"
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: colors.blue, border: 'none', color: '#FFF', fontSize: '16px' }}>↑</button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!showAIChat && (
        <button onClick={() => setShowAIChat(true)} className="apple-button"
          style={{ position: 'fixed', bottom: '20px', right: '20px', width: '56px', height: '56px', borderRadius: '50%', background: colors.blue, border: 'none', boxShadow: `0 4px 20px ${colors.blue}66`, zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PennyLogo size={36} />
        </button>
      )}

      {/* Signup Modal */}
      {showSignupModal && signupModalJSX}
      {showOnboarding && <OnboardingModal />}

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, 
        padding: isTabletOrMobile ? '12px 20px' : '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: isScrolled ? colors.navBg : 'transparent',
        backdropFilter: isScrolled ? 'saturate(180%) blur(20px)' : 'none',
        borderBottom: isScrolled ? `0.5px solid ${colors.borderLight}` : 'none',
        transition: 'all 0.3s ease', zIndex: 1000
      }}>
        <Logo size={isTabletOrMobile ? 40 : 44} showBeta={!isTabletOrMobile} showText={!isTabletOrMobile} />
        
        {!isTabletOrMobile && (
          <div className="desktop-nav" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            {[
              { label: 'Home', id: 'home' },
              { label: 'Products', id: 'products' },
              { label: 'Features', id: 'features' },
              { label: 'Tutorials', id: 'tutorials' },
              { label: 'About', id: 'about' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'Support', id: 'support' }
            ].map(item => (
              <a key={item.id} onClick={() => item.id === 'home' ? scrollToTop() : scrollToSection(item.id)}
                style={{ color: colors.secondary, textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = colors.label}
                onMouseOut={e => e.target.style.color = colors.secondary}>
                {item.label}
              </a>
            ))}
            
            {/* Dark Mode Toggle - App Style */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : colors.gray6,
              padding: '6px 10px',
              borderRadius: '20px'
            }}>
              <span style={{ fontSize: '16px', opacity: isDarkMode ? 0.5 : 1 }}>☀️</span>
              <button 
                onClick={toggleDarkMode}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isDarkMode ? '#EC4899' : '#E5E5EA',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.3s ease',
                  padding: 0
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFF',
                  position: 'absolute',
                  top: '2px',
                  left: isDarkMode ? '22px' : '2px',
                  transition: 'left 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </button>
              <span style={{ fontSize: '16px', opacity: isDarkMode ? 1 : 0.5 }}>🌙</span>
            </div>
            
            <button onClick={() => handleSignIn()}
              style={{ padding: '10px 18px', background: 'transparent', border: 'none', fontSize: '14px', color: colors.blue, cursor: 'pointer', fontWeight: '600' }}>Sign In</button>
            <button onClick={() => handleStartTrial()} className="apple-button"
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)' }}>Get Started</button>
          </div>
        )}
        
        {/* Mobile: Dark mode toggle + menu */}
        {isTabletOrMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', opacity: isDarkMode ? 0.5 : 1 }}>☀️</span>
            <button 
              onClick={toggleDarkMode}
              style={{
                width: '40px',
                height: '22px',
                borderRadius: '11px',
                border: 'none',
                background: isDarkMode ? '#EC4899' : '#E5E5EA',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.3s ease',
                padding: 0
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#FFF',
                position: 'absolute',
                top: '2px',
                left: isDarkMode ? '20px' : '2px',
                transition: 'left 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </button>
            <span style={{ fontSize: '14px', opacity: isDarkMode ? 1 : 0.5 }}>🌙</span>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '80px 16px 40px' : '100px 24px 60px', 
        background: isDarkMode 
          ? `linear-gradient(180deg, ${colors.gray6} 0%, ${colors.background} 100%)`
          : `linear-gradient(180deg, ${colors.gray6} 0%, ${colors.background} 100%)`, 
        textAlign: 'center'
      }}>
        <div className="animate-in" style={{ maxWidth: '1100px', width: '100%' }}>
          <div className="hero-logo" style={{ marginBottom: isMobile ? '24px' : '32px' }}>
            <PennyLogo size={isMobile ? 64 : 80} animate />
          </div>
          <h1 style={{
            fontSize: isMobile ? 'clamp(26px, 8vw, 36px)' : 'clamp(32px, 7vw, 72px)', 
            fontWeight: '700', lineHeight: 1.1, marginBottom: isMobile ? '16px' : '20px',
            color: colors.label
          }}>
            Your money.<br/>Your hustle.<br/>
            <span style={{ 
              display: 'inline-block',
              background: isDarkMode 
                ? 'linear-gradient(135deg, #EC4899 0%, #A78BFA 100%)' 
                : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}>One nest.</span>
          </h1>
          <p style={{ 
            fontSize: isMobile ? 'clamp(13px, 4vw, 16px)' : 'clamp(14px, 3vw, 22px)', 
            color: colors.secondary, lineHeight: 1.6, 
            maxWidth: '650px', margin: '0 auto', marginBottom: isMobile ? '24px' : '32px',
            padding: isMobile ? '0 4px' : '0 8px' 
          }}>
            The all-in-one platform to budget, grow your side hustle, and build real wealth. From your first dollar saved to financial freedom—we're with you every step.
          </p>
          
          {/* Entrepreneur Tagline */}
          <div style={{ 
            marginBottom: isMobile ? '36px' : '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: isMobile ? '40px' : '70px',
              height: '3px',
              background: colors.label,
              borderRadius: '2px',
              opacity: 0.3
            }} />
            <span style={{
              fontSize: isMobile ? 'clamp(16px, 5vw, 20px)' : 'clamp(20px, 3vw, 28px)',
              fontWeight: '700',
              color: colors.label,
              letterSpacing: '0.5px'
            }}>
              Made by Entrepreneurs, for Entrepreneurs
            </span>
            <div style={{
              width: isMobile ? '40px' : '70px',
              height: '3px',
              background: colors.label,
              borderRadius: '2px',
              opacity: 0.3
            }} />
          </div>
          
          <div className="hero-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: isMobile ? '32px' : '40px', flexWrap: 'wrap', padding: '0 8px' }}>
            <button onClick={() => handleStartTrial()} className="apple-button"
              style={{ padding: isMobile ? '14px 28px' : '16px 36px', background: colors.blue, border: 'none', borderRadius: '12px', color: '#FFF', fontSize: isMobile ? '15px' : '16px', fontWeight: '600', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '280px' : 'none' }}>
              Start Free Trial
            </button>
            <button onClick={() => scrollToSection('features')} className="apple-button"
              style={{ padding: isMobile ? '14px 28px' : '16px 36px', background: colors.cardBg, border: `1px solid ${colors.borderLight}`, borderRadius: '12px', color: colors.label, fontSize: isMobile ? '15px' : '16px', fontWeight: '500', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '280px' : 'none' }}>
              ▶ See Features
            </button>
          </div>
          
          <div className="device-mockups" style={{ display: isMobile ? 'none' : 'block' }}>
            <DeviceMockups />
          </div>
          
          <div className="mobile-hero-image" style={{ display: isMobile ? 'block' : 'none', padding: '0 4px' }}>
            <div style={{
              background: colors.cardBg, 
              borderRadius: '16px', 
              padding: '16px',
              boxShadow: isDarkMode ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(0,0,0,0.12)', 
              maxWidth: '280px', 
              margin: '0 auto',
              border: `1px solid ${colors.borderLight}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <PennyLogo size={28} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.label }}>Dashboard</div>
                  <div style={{ fontSize: '10px', color: colors.secondary }}>December 2024</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div style={{ background: '#10B981', borderRadius: '8px', padding: '10px', color: '#FFF' }}>
                  <div style={{ fontSize: '9px', opacity: 0.9 }}>Income</div>
                  <div style={{ fontSize: '16px', fontWeight: '700' }}>$12,450</div>
                </div>
                <div style={{ background: '#F59E0B', borderRadius: '8px', padding: '10px', color: '#FFF' }}>
                  <div style={{ fontSize: '9px', opacity: 0.9 }}>Expenses</div>
                  <div style={{ fontSize: '16px', fontWeight: '700' }}>$4,230</div>
                </div>
              </div>
              <div style={{ background: '#3B82F6', borderRadius: '8px', padding: '12px', color: '#FFF' }}>
                <div style={{ fontSize: '9px', opacity: 0.9 }}>Net Cash Flow</div>
                <div style={{ fontSize: '20px', fontWeight: '700' }}>+$8,220</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section style={{ padding: isMobile ? '40px 16px' : '60px 40px', background: colors.background, borderTop: `1px solid ${colors.gray5}`, borderBottom: `1px solid ${colors.gray5}` }}>
        <div className="stats-row" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', gap: isMobile ? '20px' : '40px', flexWrap: 'wrap' }}>
          {[
            { value: '$2.4B+', label: 'Assets Tracked', color: colors.green },
            { value: '12,000+', label: 'Active Families', color: colors.blue },
            { value: '4.9', label: 'App Rating', suffix: '★', color: colors.orange },
            { value: '256-bit', label: 'Encryption', color: colors.purple }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', flex: '1 1 auto' }}>
              <div style={{ fontSize: isMobile ? 'clamp(24px, 8vw, 36px)' : 'clamp(36px, 5vw, 48px)', fontWeight: '700', color: stat.color }}>{stat.value}{stat.suffix || ''}</div>
              <div style={{ fontSize: isMobile ? '12px' : '16px', color: colors.secondary, marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hub Cards - Flagship Products */}
      <section id="products" style={{ 
        padding: isMobile ? '60px 16px' : '100px 40px', 
        background: `linear-gradient(180deg, ${colors.gray6} 0%, ${colors.background} 50%, ${colors.gray6} 100%)`,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '-5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #7C3AED 100%)',
              padding: '6px 16px',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#FFF', letterSpacing: '1px', textTransform: 'uppercase' }}>
                🚀 Our Products
              </span>
            </div>
            <h2 style={{ 
              fontSize: isMobile ? 'clamp(26px, 8vw, 36px)' : 'clamp(32px, 6vw, 56px)', 
              fontWeight: '800', 
              marginBottom: '16px',
              color: colors.label
            }}>
              Three Hubs. One Mission.
            </h2>
            <p style={{ 
              fontSize: isMobile ? 'clamp(14px, 4vw, 16px)' : 'clamp(16px, 2.5vw, 20px)', 
              color: colors.secondary,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Whether you're managing a household, running a side hustle, or building a real estate empire—we've got you covered.
            </p>
          </div>
          
          <div className="hub-grid" style={{ display: 'flex', gap: isMobile ? '20px' : '28px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            {[
              { 
                icon: '🏠',
                title: 'HomeBudget Hub', 
                subtitle: 'Family Finance + Side Hustle',
                desc: 'Your path to financial freedom starts here. Budget smarter, build your side hustle, and break free from the 9-5. FIRE isn\'t a dream—it\'s a plan.',
                features: ['Family Budgeting', 'Side Hustle Sales Tracker', 'Bill Planning', 'Tax Estimation'],
                gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                lightGradient: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.08) 100%)',
                color: '#EC4899',
                badge: 'Most Popular',
                badgeColor: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                available: true 
              },
              { 
                icon: '💼',
                title: 'BizBudget Hub', 
                subtitle: 'Small Business Command Center',
                desc: 'You made the leap—now scale it. Plan revenue, track 1099s, estimate self-employment taxes, and hit your ROI targets with real-time KPIs.',
                features: ['Revenue & Expense Planning', '1099 Contractor Management', 'Self-Employment Tax Tools', 'Business KPI Dashboard'],
                gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                lightGradient: 'linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(139,92,246,0.08) 100%)',
                color: '#A78BFA',
                badge: 'Coming Soon',
                badgeColor: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                available: false 
              },
              { 
                icon: '🏢',
                title: 'REBudget Hub', 
                subtitle: 'Real Estate Investor Toolkit',
                desc: 'Build wealth that works while you sleep. Analyze deals in seconds, track cash flow, and keep your books CPA-ready—all from one dashboard.',
                features: ['Deal Analyzer (Cap Rate/ROI)', 'Property Cash Flow Tracking', 'Expense & Fee Logging', 'Portfolio Performance'],
                gradient: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                lightGradient: 'linear-gradient(135deg, rgba(129,140,248,0.15) 0%, rgba(99,102,241,0.08) 100%)',
                color: '#818CF8',
                badge: 'Coming Soon',
                badgeColor: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                available: false 
              }
            ].map((hub, i) => (
              <div key={i} className="hover-lift hub-card" style={{
                background: colors.cardBg,
                borderRadius: '24px',
                padding: isMobile ? '24px' : '32px',
                flex: '1 1 300px',
                maxWidth: isMobile ? '100%' : '380px',
                position: 'relative',
                width: '100%',
                boxShadow: hub.available 
                  ? (isDarkMode ? `0 20px 60px rgba(0,0,0,0.4)` : `0 20px 60px ${hub.color}25, 0 8px 24px rgba(0,0,0,0.08)`)
                  : (isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)'),
                border: hub.available ? `2px solid ${hub.color}40` : `1px solid ${colors.borderLight}`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'visible'
              }}>
                {/* Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: hub.badgeColor,
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#FFF',
                  whiteSpace: 'nowrap',
                  zIndex: 5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  letterSpacing: '0.5px'
                }}>
                  {hub.badge}
                </div>
                
                {/* Icon Container */}
                <div style={{
                  width: isMobile ? '70px' : '80px',
                  height: isMobile ? '70px' : '80px',
                  borderRadius: '20px',
                  background: hub.lightGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  position: 'relative',
                  boxShadow: `0 8px 24px ${hub.color}20`
                }}>
                  {/* Gradient ring */}
                  <div style={{
                    position: 'absolute',
                    inset: '-3px',
                    borderRadius: '23px',
                    background: hub.gradient,
                    opacity: 0.3,
                    zIndex: 0
                  }} />
                  <span style={{ 
                    fontSize: isMobile ? '32px' : '38px',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}>
                    {hub.icon}
                  </span>
                </div>
                
                {/* Content */}
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: hub.color,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px'
                }}>
                  {hub.subtitle}
                </div>
                <h3 style={{ 
                  fontSize: isMobile ? 'clamp(20px, 6vw, 24px)' : 'clamp(22px, 3vw, 28px)', 
                  fontWeight: '700', 
                  marginBottom: '12px',
                  color: colors.label
                }}>
                  {hub.title}
                </h3>
                <p style={{ 
                  fontSize: isMobile ? '14px' : '15px', 
                  color: colors.secondary, 
                  lineHeight: 1.6,
                  marginBottom: '20px'
                }}>
                  {hub.desc}
                </p>
                
                {/* Features List */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '10px',
                  marginBottom: hub.available ? '20px' : '0'
                }}>
                  {hub.features.map((feature, fi) => (
                    <div key={fi} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontSize: '13px',
                      color: colors.secondary
                    }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: hub.lightGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={hub.color} strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span style={{ fontWeight: '500' }}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button for available hub */}
                {hub.available && (
                  <button 
                    onClick={() => handleStartTrial()}
                    style={{
                      width: '100%',
                      padding: '14px 24px',
                      background: hub.gradient,
                      border: 'none',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: `0 8px 20px ${hub.color}30`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started Free
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div style={{ textAlign: 'center', marginTop: isMobile ? '40px' : '60px' }}>
            <p style={{ 
              fontSize: isMobile ? '14px' : '16px', 
              color: colors.secondary, 
              marginBottom: '20px' 
            }}>
              Start with HomeBudget Hub free. Scale up as your empire grows.
            </p>
            <button onClick={() => scrollToSection('features')} className="apple-button"
              style={{ 
                padding: isMobile ? '14px 28px' : '16px 36px', 
                background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', 
                border: 'none', 
                borderRadius: '14px', 
                color: '#FFF', 
                fontSize: '16px', 
                fontWeight: '600',
                boxShadow: '0 8px 24px rgba(236,72,153,0.3)'
              }}>
              Explore All Features →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ 
        padding: isMobile ? '50px 16px' : '100px 40px', 
        background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.gray6} 50%, ${colors.background} 100%)`,
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '70px' }}>
            <h2 style={{ fontSize: isMobile ? 'clamp(22px, 7vw, 32px)' : 'clamp(24px, 5vw, 52px)', fontWeight: '700', marginBottom: '16px', color: colors.label }}>
              Everything you need to build wealth
            </h2>
            <p style={{ fontSize: isMobile ? 'clamp(13px, 4vw, 16px)' : 'clamp(14px, 3vw, 19px)', color: colors.secondary, maxWidth: '650px', margin: '0 auto', padding: '0 8px' }}>
              Three powerful hubs. One financial command center. From budgeting your first paycheck to analyzing your tenth rental property.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* HOMEBUDGET HUB SECTION */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div style={{ marginBottom: isMobile ? '60px' : '100px' }}>
            {/* Hub Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              marginBottom: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)'
              }}>🏠</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#EC4899', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Family Finance + Side Hustle
                </div>
                <h3 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: colors.label }}>
                  HomeBudget Hub
                </h3>
              </div>
              <div style={{
                marginLeft: 'auto',
                background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                color: '#FFF', padding: '8px 16px', borderRadius: '20px',
                fontSize: '12px', fontWeight: '700'
              }}>
                AVAILABLE NOW
              </div>
            </div>
            <p style={{ 
              fontSize: isMobile ? '15px' : '18px', 
              color: colors.secondary, 
              marginBottom: '32px', 
              maxWidth: '700px',
              lineHeight: 1.6
            }}>
              Your path to financial freedom starts here. Budget smarter, build your side hustle, and break free from the 9-5. FIRE isn't a dream—it's a plan.
            </p>

            {/* HomeBudget Mockup Cards Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              
              {/* Financial Overview Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: isDarkMode ? '0 15px 40px rgba(0,0,0,0.3)' : '0 15px 40px rgba(0,0,0,0.08)', 
                border: `1px solid ${isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EC489915', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📊</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Financial Overview</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '14px', padding: '16px', color: '#FFF' }}>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Monthly Income</div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>$8,450</div>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', borderRadius: '14px', padding: '16px', color: '#FFF' }}>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Expenses</div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>$5,200</div>
                  </div>
                </div>
                <div style={{ background: colors.gray6, borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.secondary }}>Net Savings</span>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#10B981' }}>+$3,250</span>
                  </div>
                  <div style={{ background: '#E5E7EB', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', borderRadius: '8px' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: colors.gray, marginTop: '6px' }}>62% savings rate this month 🔥</div>
                </div>
              </div>

              {/* Budget Tracker Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: isDarkMode ? '0 15px 40px rgba(0,0,0,0.3)' : '0 15px 40px rgba(0,0,0,0.08)',
                border: `1px solid ${isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EC489915', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💰</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Budget Tracker</span>
                </div>
                {[
                  { cat: 'Housing', spent: 1800, budget: 2000, color: '#3B82F6' },
                  { cat: 'Groceries', spent: 420, budget: 500, color: '#10B981' },
                  { cat: 'Entertainment', spent: 180, budget: 150, color: '#EF4444' },
                  { cat: 'Transportation', spent: 280, budget: 400, color: '#8B5CF6' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: colors.label }}>{item.cat}</span>
                      <span style={{ fontSize: '13px', color: item.spent > item.budget ? '#EF4444' : colors.secondary }}>
                        ${item.spent} / ${item.budget}
                      </span>
                    </div>
                    <div style={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '6px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min((item.spent / item.budget) * 100, 100)}%`, 
                        height: '100%', 
                        background: item.spent > item.budget ? '#EF4444' : item.color,
                        borderRadius: '6px' 
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Savings Goals Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: isDarkMode ? '0 15px 40px rgba(0,0,0,0.3)' : '0 15px 40px rgba(0,0,0,0.08)',
                border: `1px solid ${isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EC489915', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎯</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Savings Goals</span>
                </div>
                {[
                  { goal: 'Emergency Fund', current: 8500, target: 15000, icon: '🛡️' },
                  { goal: 'Vacation Fund', current: 2200, target: 5000, icon: '✈️' },
                  { goal: 'New Car', current: 12000, target: 25000, icon: '🚗' },
                ].map((item, i) => (
                  <div key={i} style={{ 
                    background: colors.gray6, borderRadius: '14px', padding: '14px', 
                    marginBottom: i < 2 ? '12px' : 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: colors.label }}>{item.goal}</div>
                        <div style={{ fontSize: '11px', color: colors.secondary }}>${item.current.toLocaleString()} of ${item.target.toLocaleString()}</div>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#EC4899' }}>
                        {Math.round((item.current / item.target) * 100)}%
                      </span>
                    </div>
                    <div style={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '6px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${(item.current / item.target) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #EC4899, #F472B6)', borderRadius: '6px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Reminders Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: isDarkMode ? '0 15px 40px rgba(0,0,0,0.3)' : '0 15px 40px rgba(0,0,0,0.08)',
                border: `1px solid ${isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EC489915', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📅</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Upcoming Bills</span>
                  <span style={{ marginLeft: 'auto', background: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>3 due soon</span>
                </div>
                {[
                  { name: 'Rent', date: 'Dec 1', amount: 1500, status: 'paid' },
                  { name: 'Car Insurance', date: 'Dec 10', amount: 185, status: 'upcoming' },
                  { name: 'Electric', date: 'Dec 15', amount: 120, status: 'upcoming' },
                  { name: 'Internet', date: 'Dec 20', amount: 80, status: 'upcoming' },
                ].map((bill, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: i < 3 ? `1px solid ${colors.borderLight}` : 'none'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: colors.label }}>{bill.name}</div>
                      <div style={{ fontSize: '12px', color: colors.secondary }}>{bill.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.label }}>${bill.amount}</div>
                      <div style={{
                        fontSize: '10px', padding: '4px 10px', borderRadius: '8px',
                        background: bill.status === 'paid' ? '#D1FAE5' : '#FEF3C7',
                        color: bill.status === 'paid' ? '#059669' : '#D97706',
                        fontWeight: '600', textTransform: 'uppercase'
                      }}>{bill.status}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Side Hustle Sales Tracker Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: isDarkMode ? '0 15px 40px rgba(0,0,0,0.3)' : '0 15px 40px rgba(0,0,0,0.08)',
                border: `1px solid ${isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EC489915', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💼</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Side Hustle Tracker</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', borderRadius: '14px', padding: '14px', color: '#FFF' }}>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>This Month</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>$6,250</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>↑ 23% vs last month</div>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '14px', padding: '14px', color: '#FFF' }}>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>Active Deals</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>8</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>$18,400 pipeline</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: colors.secondary, marginBottom: '10px', fontWeight: '600' }}>Recent Sales</div>
                {[
                  { client: 'Smith Property', amount: 2400, status: 'Closed' },
                  { client: 'Johnson Deal', amount: 1800, status: 'Closed' },
                  { client: 'Williams Contract', amount: 3200, status: 'Pending' },
                ].map((sale, i) => (
                  <div key={i} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0', borderBottom: i < 2 ? `1px solid ${colors.borderLight}` : 'none'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: colors.label }}>{sale.client}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: colors.label }}>${sale.amount.toLocaleString()}</span>
                      <span style={{ 
                        fontSize: '10px', padding: '3px 8px', borderRadius: '6px',
                        background: sale.status === 'Closed' ? '#D1FAE5' : '#DBEAFE',
                        color: sale.status === 'Closed' ? '#059669' : '#2563EB',
                        fontWeight: '600'
                      }}>{sale.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tax Estimator Card - NEW */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: isDarkMode ? '0 15px 40px rgba(0,0,0,0.3)' : '0 15px 40px rgba(0,0,0,0.08)',
                border: `1px solid ${isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EC489915', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📋</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Tax Estimator</span>
                </div>
                <div style={{ background: isDarkMode ? 'rgba(251, 191, 36, 0.15)' : '#FEF3C7', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#D97706', fontWeight: '600' }}>Estimated Tax</div>
                      <div style={{ fontSize: '11px', color: colors.secondary }}>Based on YTD income</div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#D97706' }}>$4,850</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: colors.gray6, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: colors.secondary }}>Federal</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: colors.label }}>$3,200</div>
                  </div>
                  <div style={{ background: colors.gray6, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: colors.secondary }}>State</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: colors.label }}>$1,650</div>
                  </div>
                </div>
                <div style={{ marginTop: '14px', fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💡</span> Set aside $405/mo to stay on track
                </div>
              </div>

              {/* Net Worth Tracker Card - NEW */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: isDarkMode ? '0 15px 40px rgba(0,0,0,0.3)' : '0 15px 40px rgba(0,0,0,0.08)',
                border: `1px solid ${isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EC489915', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📈</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Net Worth</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#10B981', fontWeight: '600' }}>↑ 12% this year</span>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '14px', padding: '20px', color: '#FFF', textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Net Worth</div>
                  <div style={{ fontSize: '32px', fontWeight: '700' }}>$245,830</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: colors.gray6, borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: colors.secondary }}>Assets</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#10B981' }}>$312,400</div>
                  </div>
                  <div style={{ background: colors.gray6, borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: colors.secondary }}>Liabilities</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#EF4444' }}>$66,570</div>
                  </div>
                </div>
              </div>

              {/* FIRE Retirement Card */}
              <div className="hover-lift" style={{
                background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', 
                borderRadius: '24px', padding: '28px',
                boxShadow: '0 15px 40px rgba(30, 27, 75, 0.3)',
                color: '#FFF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔥</div>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>FIRE Calculator</span>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Years to Financial Freedom</div>
                  <div style={{ fontSize: '48px', fontWeight: '700', color: '#FBBF24' }}>8.3</div>
                  <div style={{ fontSize: '13px', opacity: 0.8 }}>at current savings rate</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>FIRE Number</div>
                    <div style={{ fontSize: '18px', fontWeight: '700' }}>$1.2M</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>Current</div>
                    <div style={{ fontSize: '18px', fontWeight: '700' }}>$291K</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: '24.3%', height: '100%', background: 'linear-gradient(90deg, #FBBF24, #F59E0B)', borderRadius: '8px' }} />
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '8px', textAlign: 'center' }}>
                  Side hustle adds $6,250/mo → saves you <strong style={{ color: '#34D399' }}>4 years</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* BIZBUDGET HUB SECTION */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div style={{ marginBottom: isMobile ? '60px' : '100px' }}>
            {/* Hub Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              marginBottom: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', boxShadow: '0 8px 24px rgba(167, 139, 250, 0.3)'
              }}>💼</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Small Business Command Center
                </div>
                <h3 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: colors.label }}>
                  BizBudget Hub
                </h3>
              </div>
              <div style={{
                marginLeft: 'auto',
                background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                color: '#FFF', padding: '8px 16px', borderRadius: '20px',
                fontSize: '12px', fontWeight: '700'
              }}>
                COMING SOON
              </div>
            </div>
            <p style={{ 
              fontSize: isMobile ? '15px' : '18px', 
              color: colors.secondary, 
              marginBottom: '32px', 
              maxWidth: '700px',
              lineHeight: 1.6
            }}>
              You made the leap—now scale it. Revenue planning, contractor management, self-employment taxes, and real-time KPIs built for full-time entrepreneurs.
            </p>

            {/* BizBudget Mockup Cards Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              opacity: 0.85
            }}>
              
              {/* Business Dashboard Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.08)', 
                border: '1px solid rgba(167, 139, 250, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#A78BFA15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📈</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Business Dashboard</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ background: '#10B98115', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: colors.gray }}>Revenue</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>$47.2K</div>
                  </div>
                  <div style={{ background: '#EF444415', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: colors.gray }}>Expenses</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#EF4444' }}>$18.9K</div>
                  </div>
                  <div style={{ background: '#8B5CF615', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: colors.gray }}>Profit</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#8B5CF6' }}>$28.3K</div>
                  </div>
                </div>
                <div style={{ background: colors.gray6, borderRadius: '12px', padding: '14px' }}>
                  <div style={{ fontSize: '12px', color: colors.gray, marginBottom: '8px' }}>Monthly Trend</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '50px' }}>
                    {[35, 42, 38, 55, 48, 62, 58].map((h, i) => (
                      <div key={i} style={{ 
                        flex: 1, height: `${h}px`, 
                        background: i === 6 ? 'linear-gradient(180deg, #A78BFA, #8B5CF6)' : '#E5E7EB',
                        borderRadius: '4px'
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 1099 Contractor Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(167, 139, 250, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#A78BFA15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👥</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>1099 Contractors</span>
                  <span style={{ marginLeft: 'auto', background: '#A78BFA15', color: '#8B5CF6', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>4 Active</span>
                </div>
                {[
                  { name: 'Sarah Chen', role: 'Designer', ytd: 12400, status: 'Active' },
                  { name: 'Mike Johnson', role: 'Developer', ytd: 28500, status: 'Active' },
                  { name: 'Lisa Park', role: 'Marketing', ytd: 8200, status: 'Active' },
                ].map((contractor, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: i < 2 ? `1px solid ${colors.gray5}` : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#A78BFA30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#8B5CF6' }}>
                        {contractor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500' }}>{contractor.name}</div>
                        <div style={{ fontSize: '11px', color: colors.gray }}>{contractor.role}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>${contractor.ytd.toLocaleString()}</div>
                      <div style={{ fontSize: '10px', color: colors.gray }}>YTD Paid</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Self-Employment Tax Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(167, 139, 250, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#A78BFA15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🧮</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Tax Estimator</span>
                </div>
                <div style={{ background: '#FEF3C7', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#92400E', marginBottom: '4px' }}>Q4 Estimated Payment Due</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#D97706' }}>$4,850</div>
                  <div style={{ fontSize: '11px', color: '#92400E' }}>Due Jan 15, 2025</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: colors.gray6, borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '10px', color: colors.gray }}>SE Tax (15.3%)</div>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>$7,240</div>
                  </div>
                  <div style={{ background: colors.gray6, borderRadius: '10px', padding: '12px' }}>
                    <div style={{ fontSize: '10px', color: colors.gray }}>Income Tax</div>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>$12,160</div>
                  </div>
                </div>
                <div style={{ marginTop: '14px', padding: '12px', background: '#D1FAE5', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>💡 Tax Tip</div>
                  <div style={{ fontSize: '12px', color: '#065F46' }}>Max out your SEP-IRA to save $8,200 in taxes</div>
                </div>
              </div>

              {/* Business KPIs Card */}
              <div className="hover-lift" style={{
                background: 'linear-gradient(135deg, #312E81 0%, #4C1D95 100%)', 
                borderRadius: '24px', padding: '28px',
                boxShadow: '0 15px 40px rgba(49, 46, 129, 0.3)',
                color: '#FFF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📊</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Business KPIs</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Profit Margin', value: '60%', trend: '↑ 8%', good: true },
                    { label: 'MRR', value: '$12.4K', trend: '↑ 15%', good: true },
                    { label: 'CAC', value: '$42', trend: '↓ 12%', good: true },
                    { label: 'Churn Rate', value: '2.1%', trend: '↓ 0.5%', good: true },
                  ].map((kpi, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>{kpi.label}</div>
                      <div style={{ fontSize: '20px', fontWeight: '700' }}>{kpi.value}</div>
                      <div style={{ fontSize: '11px', color: kpi.good ? '#34D399' : '#F87171' }}>{kpi.trend}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* REBUDGET HUB SECTION */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div>
            {/* Hub Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              marginBottom: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', boxShadow: '0 8px 24px rgba(129, 140, 248, 0.3)'
              }}>🏢</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#818CF8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Real Estate Investor Toolkit
                </div>
                <h3 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: colors.label }}>
                  REBudget Hub
                </h3>
              </div>
              <div style={{
                marginLeft: 'auto',
                background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                color: '#FFF', padding: '8px 16px', borderRadius: '20px',
                fontSize: '12px', fontWeight: '700'
              }}>
                COMING SOON
              </div>
            </div>
            <p style={{ 
              fontSize: isMobile ? '15px' : '18px', 
              color: colors.secondary, 
              marginBottom: '32px', 
              maxWidth: '700px',
              lineHeight: 1.6
            }}>
              Build wealth that works while you sleep. Analyze deals in seconds, track cash flow, and keep your books CPA-ready—all from one dashboard.
            </p>

            {/* REBudget Mockup Cards Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              opacity: 0.85
            }}>
              
              {/* Deal Analyzer Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.08)', 
                border: '1px solid rgba(129, 140, 248, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#818CF815', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔍</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Deal Analyzer</span>
                </div>
                <div style={{ background: colors.gray6, borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>123 Oak Street, Atlanta GA</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div><span style={{ color: colors.gray }}>Purchase:</span> $285,000</div>
                    <div><span style={{ color: colors.gray }}>Rent:</span> $2,200/mo</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div style={{ background: '#10B98115', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: colors.gray }}>Cap Rate</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>7.2%</div>
                  </div>
                  <div style={{ background: '#3B82F615', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: colors.gray }}>Cash-on-Cash</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#3B82F6' }}>12.4%</div>
                  </div>
                  <div style={{ background: '#8B5CF615', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: colors.gray }}>ROI</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#8B5CF6' }}>18.6%</div>
                  </div>
                </div>
                <div style={{ marginTop: '16px', padding: '12px', background: '#D1FAE5', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>✅</span>
                  <div style={{ fontSize: '13px', color: '#065F46', fontWeight: '600' }}>This deal meets your criteria!</div>
                </div>
              </div>

              {/* Property Cash Flow Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(129, 140, 248, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#818CF815', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💵</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Property Cash Flow</span>
                </div>
                {[
                  { property: '123 Oak St', rent: 2200, expenses: 850, cashflow: 1350 },
                  { property: '456 Pine Ave', rent: 1800, expenses: 720, cashflow: 1080 },
                  { property: '789 Maple Dr', rent: 2400, expenses: 980, cashflow: 1420 },
                ].map((prop, i) => (
                  <div key={i} style={{
                    background: colors.gray6, borderRadius: '12px', padding: '14px',
                    marginBottom: i < 2 ? '10px' : 0
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>{prop.property}</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>+${prop.cashflow}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: colors.gray }}>
                      <span>Rent: ${prop.rent}</span>
                      <span>Expenses: ${prop.expenses}</span>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '16px', padding: '14px', background: 'linear-gradient(135deg, #818CF815 0%, #6366F115 100%)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: colors.gray }}>Total Monthly Cash Flow</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#6366F1' }}>$3,850</div>
                </div>
              </div>

              {/* Portfolio Overview Card */}
              <div className="hover-lift" style={{
                background: colors.cardBg, borderRadius: '24px', padding: '28px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(129, 140, 248, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#818CF815', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏘️</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>Portfolio Overview</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)', borderRadius: '14px', padding: '16px', color: '#FFF' }}>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>Total Value</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>$1.2M</div>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '14px', padding: '16px', color: '#FFF' }}>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>Total Equity</div>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>$485K</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div style={{ background: colors.gray6, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#6366F1' }}>3</div>
                    <div style={{ fontSize: '10px', color: colors.gray }}>Properties</div>
                  </div>
                  <div style={{ background: colors.gray6, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981' }}>96%</div>
                    <div style={{ fontSize: '10px', color: colors.gray }}>Occupancy</div>
                  </div>
                  <div style={{ background: colors.gray6, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#F59E0B' }}>6.8%</div>
                    <div style={{ fontSize: '10px', color: colors.gray }}>Avg Cap Rate</div>
                  </div>
                </div>
              </div>

              {/* Expense Tracking Card */}
              <div className="hover-lift" style={{
                background: 'linear-gradient(135deg, #1E3A5F 0%, #1E293B 100%)', 
                borderRadius: '24px', padding: '28px',
                boxShadow: '0 15px 40px rgba(30, 58, 95, 0.3)',
                color: '#FFF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📋</div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.label }}>CPA-Ready Reports</span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>2024 Tax Summary</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '10px', opacity: 0.8 }}>Rental Income</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>$76,800</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '10px', opacity: 0.8 }}>Deductible Expenses</div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>$32,400</div>
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '10px' }}>Expense Categories</div>
                  {[
                    { cat: 'Mortgage Interest', amount: 14200 },
                    { cat: 'Property Management', amount: 7200 },
                    { cat: 'Repairs & Maintenance', amount: 5800 },
                    { cat: 'Insurance', amount: 3600 },
                  ].map((exp, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                      <span style={{ opacity: 0.9 }}>{exp.cat}</span>
                      <span style={{ fontWeight: '600' }}>${exp.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: '100%', marginTop: '16px', padding: '12px',
                  background: 'rgba(255,255,255,0.2)', border: 'none',
                  borderRadius: '10px', color: '#FFF', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer'
                }}>
                  📥 Export for CPA
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section id="tutorials" style={{ 
        padding: isMobile ? '50px 16px' : '100px 40px', 
        background: `linear-gradient(180deg, ${colors.gray6} 0%, ${colors.background} 50%, ${colors.gray6} 100%)`,
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '60px' }}>
            <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: '20px' }}>📚</div>
            <h2 style={{ fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(32px, 5vw, 48px)', fontWeight: '700', marginBottom: '16px', color: colors.label }}>Learn & Grow</h2>
            <p style={{ fontSize: isMobile ? '15px' : '19px', color: colors.secondary }}>Master your finances with our tutorials and guides</p>
          </div>
          
          <div className="tutorials-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🚀', title: 'Getting Started', desc: 'Set up your account in 5 minutes', time: '5 min' },
              { icon: '💰', title: 'Budget Basics', desc: 'Create your first budget', time: '10 min' },
              { icon: '📊', title: 'Understanding Reports', desc: 'Make sense of your data', time: '8 min' },
              { icon: '🔥', title: 'FIRE Planning', desc: 'Calculate your retirement date', time: '15 min' },
              { icon: '💼', title: 'Side Hustle Tracking', desc: 'Separate business income', time: '12 min' },
              { icon: '🎯', title: 'Goal Setting', desc: 'Achieve financial milestones', time: '7 min' },
            ].map((tutorial, i) => (
              <div key={i} className="hover-lift" style={{
                background: colors.cardBg, 
                borderRadius: '20px', 
                padding: isMobile ? '24px' : '32px',
                boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.06)', 
                cursor: 'pointer',
                border: `1px solid ${colors.borderLight}`
              }}>
                <div style={{ fontSize: isMobile ? '36px' : '44px', marginBottom: '16px' }}>{tutorial.icon}</div>
                <h3 style={{ fontSize: isMobile ? '17px' : '20px', fontWeight: '600', marginBottom: '8px', color: colors.label }}>{tutorial.title}</h3>
                <p style={{ fontSize: isMobile ? '13px' : '15px', color: colors.secondary, marginBottom: '12px' }}>{tutorial.desc}</p>
                <div style={{ fontSize: '14px', color: '#EC4899', fontWeight: '500' }}>⏱ {tutorial.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / FIRE Section */}
      <section id="about" style={{ padding: isMobile ? '50px 16px' : '100px 40px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.purple} 100%)`, color: '#FFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? '60px' : '80px', marginBottom: '24px' }}>🔥</div>
          <h2 style={{ fontSize: isMobile ? 'clamp(28px, 8vw, 40px)' : 'clamp(36px, 5vw, 52px)', fontWeight: '700', marginBottom: '20px' }}>Your path to FIRE</h2>
          <p style={{ fontSize: isMobile ? '16px' : '20px', opacity: 0.9, marginBottom: '50px', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.7, padding: '0 8px' }}>
            Financial Independence, Retire Early isn't just a dream. See exactly when you'll hit your number.
          </p>
          
          <div className="hover-lift" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: isMobile ? '20px' : '28px', padding: isMobile ? '24px 16px' : '44px', backdropFilter: 'blur(10px)', marginBottom: isMobile ? '32px' : '50px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: isMobile ? '20px' : '32px', marginBottom: '32px' }}>
              <div><div style={{ fontSize: '15px', opacity: 0.8, marginBottom: '8px' }}>FIRE Number</div><div style={{ fontSize: isMobile ? 'clamp(28px, 10vw, 40px)' : 'clamp(36px, 5vw, 52px)', fontWeight: '700' }}>$1.2M</div></div>
              <div><div style={{ fontSize: '15px', opacity: 0.8, marginBottom: '8px' }}>Current Progress</div><div style={{ fontSize: isMobile ? 'clamp(28px, 10vw, 40px)' : 'clamp(36px, 5vw, 52px)', fontWeight: '700' }}>$291K</div></div>
              <div><div style={{ fontSize: '15px', opacity: 0.8, marginBottom: '8px' }}>Years to FIRE</div><div style={{ fontSize: isMobile ? 'clamp(28px, 10vw, 40px)' : 'clamp(36px, 5vw, 52px)', fontWeight: '700', color: colors.yellow }}>8.3</div></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', height: '18px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: '24.3%', height: '100%', background: `linear-gradient(90deg, ${colors.yellow}, ${colors.orange})`, borderRadius: '12px' }}/>
            </div>
            <div style={{ fontSize: isMobile ? '14px' : '17px', opacity: 0.9 }}>24.3% complete • Side hustle adds <strong>$6,250/mo</strong> → saves you <strong>4 years</strong></div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: isMobile ? '50px 16px' : '100px 40px', background: colors.gray6, overflow: 'visible' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', overflow: 'visible' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '50px' }}>
            <h2 style={{ fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(28px, 5vw, 52px)', fontWeight: '700', marginBottom: '16px', color: colors.label }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: isMobile ? 'clamp(14px, 4vw, 16px)' : 'clamp(15px, 3vw, 19px)', color: colors.secondary, marginBottom: '28px' }}>
              Start free. Scale as your empire grows. Mix & match hubs.
            </p>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: colors.cardBg, padding: '4px', borderRadius: '12px', boxShadow: isDarkMode ? '0 4px 15px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.08)' }}>
              <button onClick={() => setBillingCycle('monthly')} className="apple-button"
                style={{
                  padding: '12px 20px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '500',
                  background: billingCycle === 'monthly' ? '#EC4899' : 'transparent',
                  color: billingCycle === 'monthly' ? '#FFF' : colors.secondary
                }}>Monthly</button>
              <button onClick={() => setBillingCycle('annual')} className="apple-button"
                style={{
                  padding: '12px 20px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '500',
                  background: billingCycle === 'annual' ? '#EC4899' : 'transparent',
                  color: billingCycle === 'annual' ? '#FFF' : colors.secondary
                }}>
                Annual <span style={{ background: colors.green, color: '#FFF', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', marginLeft: '6px' }}>15% OFF</span>
              </button>
            </div>
          </div>
          
          {/* HomeBudget Hub Section */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', justifyContent: 'center' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
              }}>🏠</div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: colors.label }}>HomeBudget Hub</h3>
              <span style={{ background: '#D1FAE5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>AVAILABLE NOW</span>
            </div>
            
            <div className="pricing-grid" style={{ 
              display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', width: '100%',
              overflow: 'visible', paddingTop: '20px'
            }}>
              {/* Starter - Free */}
              <div className="hover-lift pricing-card" style={{
                background: colors.cardBg,
                color: colors.label,
                borderRadius: '20px', 
                padding: isMobile ? '20px' : '24px', 
                flex: '1 1 260px', 
                maxWidth: isMobile ? '100%' : '300px',
                boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                position: 'relative',
                border: `1px solid ${colors.borderLight}`,
                borderTop: '4px solid #EC4899'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#EC4899', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>STARTER</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: colors.label }}>Get Your Feet Wet</div>
                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '700', color: colors.label }}>Free</span>
                  <span style={{ background: '#FEF3C7', color: '#D97706', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '600' }}>14-day trial</span>
                </div>
                <div style={{ fontSize: '13px', color: colors.secondary, marginBottom: '18px' }}>Perfect for exploring your finances</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0' }}>
                  {[
                    '1 User',
                    'Dashboard overview',
                    'Basic budget tracking',
                    'Limited transactions (50/mo)',
                    'Bill reminders (3 bills)',
                    'Mobile app access'
                  ].map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', color: colors.secondary }}>
                      <span style={{ color: '#EC4899', fontSize: '13px', flexShrink: 0 }}>✓</span><span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleStartTrial('starter')} className="apple-button"
                  style={{
                    width: '100%', padding: '16px', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600',
                    background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                    color: '#FFF'
                  }}>Start Free Trial</button>
              </div>

              {/* Pro - Full Access */}
              <div className="hover-lift pricing-card" style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                color: '#FFF',
                borderRadius: '20px', 
                padding: isMobile ? '20px' : '24px', 
                flex: '1 1 260px', 
                maxWidth: isMobile ? '100%' : '300px',
                boxShadow: '0 20px 40px rgba(236, 72, 153, 0.35)',
                transform: !isMobile ? 'scale(1.02)' : 'none', 
                position: 'relative',
                overflow: 'visible'
              }}>
                <div style={{ 
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', 
                  background: '#FBBF24', padding: '5px 14px', borderRadius: '10px', 
                  fontSize: '11px', fontWeight: '700', color: '#1a1a1a', whiteSpace: 'nowrap', zIndex: 10,
                  boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)'
                }}>⭐ Most Popular</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: '6px' }}>PRO</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>Full Power Mode</div>
                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '700' }}>${billingCycle === 'annual' ? '8.49' : '9.99'}</span>
                  <span style={{ fontSize: '14px', opacity: 0.9 }}>/mo</span>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '18px' }}>For couples crushing their goals</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0' }}>
                  {[
                    '2 Users (perfect for couples)',
                    'Unlimited transactions',
                    'Full budget & expense tracking',
                    'Side hustle sales tracker',
                    'Unlimited bill reminders',
                    'Savings goals & progress',
                    'FIRE retirement calculator',
                    'Advanced reports & analytics',
                    'Priority support'
                  ].map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
                      <span style={{ color: '#FFF', fontSize: '13px', flexShrink: 0 }}>✓</span><span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleStartTrial('pro')} className="apple-button"
                  style={{
                    width: '100%', padding: '14px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                    background: '#FFF',
                    color: '#DB2777'
                  }}>Start 14-Day Free Trial</button>
              </div>

              {/* Family */}
              <div className="hover-lift pricing-card" style={{
                background: colors.cardBg,
                color: colors.label,
                borderRadius: '20px', 
                padding: isMobile ? '20px' : '24px', 
                flex: '1 1 260px', 
                maxWidth: isMobile ? '100%' : '300px',
                boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                position: 'relative',
                border: `1px solid ${colors.borderLight}`,
                borderTop: '4px solid #EC4899'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#EC4899', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>FAMILY</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: colors.label }}>Whole Household</div>
                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '700', color: colors.label }}>${billingCycle === 'annual' ? '12.74' : '14.99'}</span>
                  <span style={{ fontSize: '14px', color: colors.secondary }}>/mo</span>
                </div>
                <div style={{ fontSize: '13px', color: colors.secondary, marginBottom: '18px' }}>For families building together</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0' }}>
                  {[
                    'Up to 5 family members',
                    'Everything in Pro',
                    'Shared family goals',
                    'Kids\' allowance tracking',
                    'Family spending reports',
                    'Multi-account views'
                  ].map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', color: colors.secondary }}>
                      <span style={{ color: '#EC4899', fontSize: '13px', flexShrink: 0 }}>✓</span><span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleStartTrial('family')} className="apple-button"
                  style={{
                    width: '100%', padding: '14px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                    background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                    color: '#FFF'
                  }}>Start 14-Day Free Trial</button>
              </div>
            </div>
          </div>

          {/* Coming Soon Hubs */}
          <div style={{ marginTop: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: colors.label, marginBottom: '8px' }}>Expand Your Empire</h3>
              <p style={{ fontSize: '15px', color: colors.secondary }}>Add more hubs as your business grows. Bundle & save.</p>
            </div>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* BizBudget Hub */}
              <div className="hover-lift" style={{
                background: colors.cardBg,
                borderRadius: '24px',
                padding: '28px',
                flex: '1 1 300px',
                maxWidth: '400px',
                border: `1px solid ${colors.borderLight}`,
                borderTop: '4px solid #A78BFA',
                position: 'relative',
                opacity: 0.9
              }}>
                <div style={{
                  position: 'absolute', top: '-12px', right: '20px',
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                  color: '#FFF', padding: '5px 14px', borderRadius: '12px',
                  fontSize: '11px', fontWeight: '700'
                }}>COMING SOON</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                  }}>💼</div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: colors.label }}>BizBudget Hub</div>
                    <div style={{ fontSize: '13px', color: colors.secondary }}>Small Business Command Center</div>
                  </div>
                </div>
                
                <p style={{ fontSize: '14px', color: colors.secondary, marginBottom: '20px', lineHeight: 1.6 }}>
                  You made the leap—now scale it. Revenue planning, 1099 contractor management, self-employment taxes, and KPIs built for full-time entrepreneurs.
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {['Revenue Planning', '1099 Management', 'Tax Estimator', 'Business KPIs'].map((f, i) => (
                    <span key={i} style={{
                      background: '#A78BFA20', color: '#8B5CF6',
                      padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '500'
                    }}>{f}</span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: isDarkMode ? 'rgba(167, 139, 250, 0.1)' : '#F5F3FF', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#8B5CF6' }}>${billingCycle === 'annual' ? '8.49' : '9.99'}<span style={{ fontSize: '14px', fontWeight: '500' }}>/mo</span></div>
                    <div style={{ fontSize: '12px', color: colors.secondary }}>or bundle with HomeBudget</div>
                  </div>
                  <button style={{
                    padding: '10px 20px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                    color: '#FFF', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                  }}>Join Waitlist</button>
                </div>
              </div>

              {/* REBudget Hub */}
              <div className="hover-lift" style={{
                background: colors.cardBg,
                borderRadius: '24px',
                padding: '28px',
                flex: '1 1 300px',
                maxWidth: '400px',
                border: `1px solid ${colors.borderLight}`,
                borderTop: '4px solid #818CF8',
                position: 'relative',
                opacity: 0.9
              }}>
                <div style={{
                  position: 'absolute', top: '-12px', right: '20px',
                  background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                  color: '#FFF', padding: '5px 14px', borderRadius: '12px',
                  fontSize: '11px', fontWeight: '700'
                }}>COMING SOON</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                  }}>🏢</div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: colors.label }}>REBudget Hub</div>
                    <div style={{ fontSize: '13px', color: colors.secondary }}>Real Estate Investor Toolkit</div>
                  </div>
                </div>
                
                <p style={{ fontSize: '14px', color: colors.secondary, marginBottom: '20px', lineHeight: 1.6 }}>
                  Build wealth that works while you sleep. Analyze deals in seconds, track cash flow, and keep your books CPA-ready—all from one dashboard.
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {['Deal Analyzer', 'Cash Flow Tracking', 'Portfolio Metrics', 'CPA Reports'].map((f, i) => (
                    <span key={i} style={{
                      background: '#818CF820', color: '#6366F1',
                      padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '500'
                    }}>{f}</span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: isDarkMode ? 'rgba(129, 140, 248, 0.1)' : '#EEF2FF', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#6366F1' }}>${billingCycle === 'annual' ? '8.49' : '9.99'}<span style={{ fontSize: '14px', fontWeight: '500' }}>/mo</span></div>
                    <div style={{ fontSize: '12px', color: colors.secondary }}>or bundle with HomeBudget</div>
                  </div>
                  <button style={{
                    padding: '10px 20px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                    color: '#FFF', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                  }}>Join Waitlist</button>
                </div>
              </div>
            </div>

            {/* Bundle Section - Premium Visual */}
            <div style={{ 
              marginTop: '60px', 
              textAlign: 'center',
              padding: isMobile ? '40px 24px' : '60px 48px',
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(49, 46, 129, 0.6) 30%, rgba(67, 56, 202, 0.4) 60%, rgba(236, 72, 153, 0.3) 100%)'
                : 'linear-gradient(135deg, #1E1B4B 0%, #312E81 30%, #4338CA 60%, #7C3AED 100%)',
              borderRadius: '32px',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
              boxShadow: isDarkMode 
                ? '0 25px 60px rgba(0, 0, 0, 0.5)'
                : '0 25px 60px rgba(30, 27, 75, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  background: 'rgba(255,255,255,0.15)', 
                  padding: '12px 24px', 
                  borderRadius: '50px',
                  marginBottom: '24px'
                }}>
                  <span style={{ fontSize: '32px' }}>🎁</span>
                  <span style={{ color: '#FFF', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Limited Time Offer</span>
                </div>
                
                <h3 style={{ 
                  fontSize: isMobile ? '32px' : '44px', 
                  fontWeight: '800', 
                  color: '#FFF', 
                  marginBottom: '16px',
                  lineHeight: 1.2
                }}>
                  Bundle & Save Up to <span style={{ color: '#34D399' }}>30%</span>
                </h3>
                
                <p style={{ 
                  fontSize: isMobile ? '16px' : '18px', 
                  color: 'rgba(255,255,255,0.85)', 
                  maxWidth: '600px', 
                  margin: '0 auto 40px',
                  lineHeight: 1.6
                }}>
                  Combine HomeBudget + BizBudget + REBudget for the ultimate financial command center. 
                  <strong style={{ color: '#FFF' }}> Perfect for the entrepreneur building their empire.</strong>
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  gap: isMobile ? '16px' : '32px', 
                  justifyContent: 'center', 
                  flexWrap: 'wrap',
                  marginBottom: '32px'
                }}>
                  {/* 2-Hub Bundle */}
                  <div className="hover-lift" style={{ 
                    background: 'rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(10px)',
                    padding: isMobile ? '24px 28px' : '32px 40px', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    minWidth: isMobile ? '160px' : '200px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'rgba(255,255,255,0.7)', 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px',
                      marginBottom: '8px'
                    }}>2-Hub Bundle</div>
                    <div style={{ 
                      fontSize: isMobile ? '36px' : '48px', 
                      fontWeight: '800', 
                      color: '#FFF',
                      lineHeight: 1
                    }}>
                      $16.99
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>/month</div>
                    <div style={{ 
                      display: 'inline-block',
                      background: 'rgba(16, 185, 129, 0.2)', 
                      color: '#34D399', 
                      padding: '6px 14px', 
                      borderRadius: '20px', 
                      fontSize: '13px', 
                      fontWeight: '700'
                    }}>Save 15%</div>
                  </div>
                  
                  {/* All 3 Hubs - Featured */}
                  <div className="hover-lift" style={{ 
                    background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', 
                    padding: isMobile ? '24px 28px' : '32px 40px', 
                    borderRadius: '20px',
                    minWidth: isMobile ? '180px' : '220px',
                    position: 'relative',
                    cursor: 'pointer',
                    boxShadow: '0 20px 40px rgba(236, 72, 153, 0.4)',
                    transform: !isMobile ? 'scale(1.05)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#FBBF24',
                      color: '#1a1a1a',
                      padding: '5px 14px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '700',
                      whiteSpace: 'nowrap'
                    }}>🔥 BEST VALUE</div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'rgba(255,255,255,0.9)', 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px',
                      marginBottom: '8px',
                      marginTop: '8px'
                    }}>All 3 Hubs</div>
                    <div style={{ 
                      fontSize: isMobile ? '40px' : '56px', 
                      fontWeight: '800', 
                      color: '#FFF',
                      lineHeight: 1
                    }}>
                      $20.99
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginBottom: '12px' }}>/month</div>
                    <div style={{ 
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.25)', 
                      color: '#FFF', 
                      padding: '6px 14px', 
                      borderRadius: '20px', 
                      fontSize: '13px', 
                      fontWeight: '700'
                    }}>Save 30% 🎉</div>
                  </div>
                </div>
                
                {/* What's included */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: isMobile ? '12px' : '24px',
                  flexWrap: 'wrap'
                }}>
                  {[
                    { icon: '🏠', name: 'HomeBudget', color: '#EC4899' },
                    { icon: '💼', name: 'BizBudget', color: '#A78BFA' },
                    { icon: '🏢', name: 'REBudget', color: '#818CF8' }
                  ].map((hub, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '10px 18px',
                      borderRadius: '30px'
                    }}>
                      <span style={{ fontSize: '20px' }}>{hub.icon}</span>
                      <span style={{ color: '#FFF', fontSize: '14px', fontWeight: '600' }}>{hub.name}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleStartTrial('bundle')}
                  style={{
                    marginTop: '32px',
                    padding: '18px 48px',
                    background: '#FFF',
                    border: 'none',
                    borderRadius: '14px',
                    color: '#1E1B4B',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get the Bundle Deal →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" style={{ padding: isMobile ? '50px 16px' : '100px 40px', background: colors.background }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: '24px' }}>💬</div>
          <h2 style={{ fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(32px, 5vw, 48px)', fontWeight: '700', marginBottom: '20px', color: colors.label }}>We're here to help</h2>
          <p style={{ fontSize: isMobile ? '15px' : '19px', color: colors.secondary, marginBottom: '44px' }}>Have questions? Our support team is available to help you.</p>
          <div className="support-cards" style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '📧', title: 'Email Support', desc: 'support@prospernest.app', action: handleEmailSupport },
              { icon: '💬', title: 'Live Chat', desc: 'Chat with Penny anytime', action: handleLiveChat },
              { icon: '📚', title: 'Help Center', desc: 'Guides & tutorials', action: () => scrollToSection('tutorials') }
            ].map((item, i) => (
              <div key={i} onClick={item.action} className="hover-lift" style={{
                background: colors.cardBg, 
                borderRadius: '20px', 
                padding: isMobile ? '28px 20px' : '36px', 
                flex: '1 1 260px', 
                maxWidth: isMobile ? '100%' : '300px', 
                cursor: 'pointer',
                border: `1px solid ${colors.borderLight}`,
                boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: isMobile ? '36px' : '44px', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ fontWeight: '600', fontSize: isMobile ? '16px' : '18px', marginBottom: '8px', color: colors.label }}>{item.title}</div>
                <div style={{ fontSize: isMobile ? '13px' : '15px', color: colors.secondary }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ 
        padding: isMobile ? '60px 16px' : '80px 20px', 
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', 
        color: '#FFF', 
        textAlign: 'center' 
      }}>
        <div style={{ maxWidth: '550px', margin: '0 auto' }}>
          <PennyLogo size={isMobile ? 60 : 70} />
          <h2 style={{ fontSize: isMobile ? 'clamp(24px, 7vw, 32px)' : 'clamp(28px, 5vw, 36px)', fontWeight: '700', marginTop: '20px', marginBottom: '12px' }}>Ready to prosper?</h2>
          <p style={{ fontSize: isMobile ? '14px' : '16px', opacity: 0.8, marginBottom: '28px' }}>Join 12,000+ families on their journey to financial independence.</p>
          <button onClick={() => handleStartTrial()} className="apple-button"
            style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', border: 'none', borderRadius: '14px', color: '#FFF', fontSize: '16px', fontWeight: '600', width: isMobile ? '100%' : 'auto', maxWidth: '280px', boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)' }}>
            Start Your Free Trial
          </button>
          <div style={{ marginTop: '16px', fontSize: '13px', opacity: 0.6 }}>No credit card required • 14-day free trial</div>
        </div>
      </section>

      {/* Footer - FIXED: Clickable Terms & Privacy links */}
      <footer style={{ padding: '32px 20px', background: '#000', color: colors.gray }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>
          <div>© 2024 ProsperNest. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button 
              onClick={() => setShowPrivacyModal(true)}
              style={{ background: 'none', border: 'none', color: colors.gray, cursor: 'pointer', fontSize: '13px', padding: 0 }}
              onMouseOver={e => e.target.style.color = '#FFF'} 
              onMouseOut={e => e.target.style.color = colors.gray}
            >
              Privacy
            </button>
            <button 
              onClick={() => setShowTermsModal(true)}
              style={{ background: 'none', border: 'none', color: colors.gray, cursor: 'pointer', fontSize: '13px', padding: 0 }}
              onMouseOver={e => e.target.style.color = '#FFF'} 
              onMouseOut={e => e.target.style.color = colors.gray}
            >
              Terms
            </button>
            <a href="mailto:support@prospernest.app" style={{ color: colors.gray, textDecoration: 'none' }}
              onMouseOver={e => e.target.style.color = '#FFF'} 
              onMouseOut={e => e.target.style.color = colors.gray}
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProsperNestLandingV4;
