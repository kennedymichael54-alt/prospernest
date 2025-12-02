import React, { useState, useEffect, useRef } from 'react';

// ============================================
// PROSPERNEST LANDING PAGE v4 - FINAL
// All features: Device mockups, animations,
// Signup flow, Tutorials, AI Chat integration
// ============================================

const ProsperNestLandingV4 = ({ onNavigate }) => {
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'signin'
  const [modalBillingCycle, setModalBillingCycle] = useState('annual');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi there! 👋 I'm Penny, your ProsperNest assistant. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [billingCycle, setBillingCycle] = useState('annual');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHubIndex, setActiveHubIndex] = useState(0);
  const idleTimerRef = useRef(null);
  const hubAnimationRef = useRef(null);
  const IDLE_TIMEOUT = 5 * 60 * 1000;

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    receiveUpdates: false,
    agreeToPrivacy: false
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);

  // Apple iOS 26 Color Palette
  const colors = {
    blue: '#007AFF',
    green: '#34C759',
    orange: '#FF9500',
    purple: '#AF52DE',
    red: '#FF3B30',
    yellow: '#FFCC00',
    teal: '#30B0C7',
    gray: '#8E8E93',
    gray2: '#AEAEB2',
    gray3: '#C7C7CC',
    gray4: '#D1D1D6',
    gray5: '#E5E5EA',
    gray6: '#F2F2F7',
    background: '#FFFFFF',
    label: '#000000',
    secondary: '#3C3C43',
  };

  // Hub animation - lights up left to right
  useEffect(() => {
    hubAnimationRef.current = setInterval(() => {
      setActiveHubIndex(prev => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(hubAnimationRef.current);
  }, []);

  // Idle Detection
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
        response = "Our Starter plan is free! Pro is $7.99/mo (or less with annual billing) for couples, and Family is $12.99/mo for up to 5 members. All paid plans include a 14-day free trial!";
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
    window.location.href = 'mailto:support@prospernest.io?subject=Support Request&body=Hi ProsperNest Team,%0D%0A%0D%0A';
  };

  const handleLiveChat = () => {
    setShowAIChat(true);
  };

  const handleAddressChange = (value) => {
    setSignupForm(prev => ({ ...prev, address: value }));
    // Simulate Google Places autocomplete
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

  // Pricing calculation
  const getPricing = (plan) => {
    const prices = {
      starter: { monthly: 0, annual: 0 },
      pro: { monthly: 7.99, annual: Math.round(7.99 * 12 * 0.85 / 12 * 100) / 100 },
      family: { monthly: 12.99, annual: Math.round(12.99 * 12 * 0.85 / 12 * 100) / 100 }
    };
    return prices[plan][billingCycle];
  };

  // Modal pricing calculation (uses modalBillingCycle)
  const getModalPricing = (plan) => {
    const prices = {
      starter: { monthly: 0, annual: 0 },
      pro: { monthly: 7.99, annual: Math.round(7.99 * 12 * 0.85 / 12 * 100) / 100 },
      family: { monthly: 12.99, annual: Math.round(12.99 * 12 * 0.85 / 12 * 100) / 100 }
    };
    return prices[plan][modalBillingCycle];
  };

  // Penny Logo
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

  const Logo = ({ size = 40 }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <PennyLogo size={size} />
      <span style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        fontSize: Math.max(size * 0.45, 14), fontWeight: '600', letterSpacing: '-0.02em', color: colors.label,
      }}>
        ProsperNest
      </span>
    </div>
  );

  // Device Mockups Component - LARGER VERSION
  const DeviceMockups = () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', padding: '30px 0' }}>
      {/* MacBook/Web */}
      <div style={{ position: 'relative' }}>
        <div style={{
          background: '#1a1a1a', borderRadius: '16px 16px 0 0', padding: '10px 16px',
          display: 'flex', gap: '8px', width: '420px'
        }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F57' }}/>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }}/>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28CA41' }}/>
        </div>
        <div style={{
          background: colors.gray6, width: '420px', height: '260px', padding: '16px',
          borderRadius: '0 0 4px 4px', border: '3px solid #1a1a1a', borderTop: 'none'
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
        <div style={{
          background: '#c0c0c0', width: '480px', height: '16px', marginLeft: '-30px',
          borderRadius: '0 0 12px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}/>
        <div style={{ textAlign: 'center', fontSize: '13px', color: colors.gray, marginTop: '12px', fontWeight: '500' }}>Web</div>
      </div>

      {/* iPad */}
      <div style={{ position: 'relative' }}>
        <div style={{
          background: '#1a1a1a', borderRadius: '20px', padding: '16px',
          width: '220px', boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            background: colors.gray6, borderRadius: '12px', height: '290px', padding: '14px', overflow: 'hidden'
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
        <div style={{ textAlign: 'center', fontSize: '13px', color: colors.gray, marginTop: '12px', fontWeight: '500' }}>iPad</div>
      </div>

      {/* iPhone */}
      <div style={{ position: 'relative' }}>
        <div style={{
          background: '#1a1a1a', borderRadius: '32px', padding: '12px',
          width: '140px', boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            background: colors.gray6, borderRadius: '24px', height: '280px', padding: '12px', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <div style={{ width: '50px', height: '6px', background: '#1a1a1a', borderRadius: '3px' }}/>
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
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '13px', color: colors.gray, marginTop: '12px', fontWeight: '500' }}>iPhone</div>
      </div>

      {/* Apple Watch */}
      <div style={{ position: 'relative' }}>
        <div style={{
          background: '#1a1a1a', borderRadius: '16px', padding: '6px',
          width: '80px', boxShadow: '0 12px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            background: '#000', borderRadius: '14px', height: '100px', padding: '10px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
          }}>
            <PennyLogo size={28} />
            <div style={{ color: colors.green, fontSize: '16px', fontWeight: '700', marginTop: '6px' }}>$8.2K</div>
            <div style={{ color: colors.gray, fontSize: '8px' }}>This Month</div>
          </div>
        </div>
        <div style={{
          position: 'absolute', right: '-8px', top: '30px',
          width: '6px', height: '24px', background: '#1a1a1a', borderRadius: '3px'
        }}/>
        <div style={{ textAlign: 'center', fontSize: '13px', color: colors.gray, marginTop: '12px', fontWeight: '500' }}>Watch</div>
      </div>
    </div>
  );

  // Feature Mockups - Dashboard, Bills, Sales Tracker - LARGER
  const FeatureMockups = () => (
    <div className="feature-mockups-wrapper" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {/* Dashboard */}
      <div style={{
        background: '#FFF', borderRadius: '20px', padding: '24px', flex: '1 1 280px', maxWidth: '320px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
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
      <div style={{
        background: '#FFF', borderRadius: '20px', padding: '24px', flex: '1 1 280px', maxWidth: '320px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
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
      <div style={{
        background: '#FFF', borderRadius: '20px', padding: '24px', flex: '1 1 280px', maxWidth: '320px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
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
  const SignupModal = () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10002, padding: '20px'
    }}>
      <div style={{
        background: '#FFF', borderRadius: '24px', width: '100%', maxWidth: '480px',
        maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px', borderBottom: `1px solid ${colors.gray5}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <Logo size={32} />
            <div style={{ fontSize: '13px', color: colors.secondary, marginTop: '4px' }}>
              {authMode === 'signin' ? 'Welcome back!' : selectedPlan ? `Start your ${selectedPlan} plan` : 'Create your account'}
            </div>
          </div>
          <button onClick={() => { setShowSignupModal(false); setSelectedPlan(null); setAuthMode('signup'); }}
            style={{ background: colors.gray6, border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>

        {/* Google Sign In - Always shown at top */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${colors.gray5}` }}>
          <button style={{
            width: '100%', padding: '14px', border: `1px solid ${colors.gray4}`,
            borderRadius: '12px', background: '#FFF', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            fontSize: '15px', fontWeight: '500', transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = colors.gray6}
          onMouseOut={e => e.currentTarget.style.background = '#FFF'}>
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
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Email Address</label>
              <input type="email" placeholder="john@example.com"
                style={{
                  width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                  borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Password</label>
              <input type="password" placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                  borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.secondary, cursor: 'pointer' }}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" style={{ fontSize: '13px', color: colors.blue, textDecoration: 'none' }}>Forgot password?</a>
            </div>

            <button onClick={() => { setShowSignupModal(false); onNavigate && onNavigate('auth'); }}
              style={{
                width: '100%', padding: '16px', background: colors.blue,
                border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '16px',
                fontWeight: '600', cursor: 'pointer'
              }}>
              Sign In
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: colors.secondary }}>
              Don't have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('signup'); }} style={{ color: colors.blue, textDecoration: 'none', fontWeight: '500' }}>
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
                  <input type="text" value={signupForm.firstName}
                    onChange={e => setSignupForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                    style={{
                      width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                      borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Last Name *</label>
                  <input type="text" value={signupForm.lastName}
                    onChange={e => setSignupForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Smith"
                    style={{
                      width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                      borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                    }} />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Email Address *</label>
                <input type="email" value={signupForm.email}
                  onChange={e => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  style={{
                    width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }} />
              </div>

              <div style={{ marginBottom: '12px', position: 'relative' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: colors.secondary, display: 'block', marginBottom: '6px' }}>Address *</label>
                <input type="text" value={signupForm.address}
                  onChange={e => handleAddressChange(e.target.value)}
                  placeholder="Start typing your address..."
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
                    <input type="text" placeholder="Card Number"
                      style={{
                        width: '100%', padding: '12px', border: `1px solid ${colors.gray4}`,
                        borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                      }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" placeholder="MM/YY"
                      style={{
                        padding: '12px', border: `1px solid ${colors.gray4}`,
                        borderRadius: '10px', fontSize: '14px', outline: 'none'
                      }} />
                    <input type="text" placeholder="CVC"
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
                    I agree to the <a href="#" style={{ color: colors.blue }}>Terms of Service</a> and <a href="#" style={{ color: colors.blue }}>Privacy Policy</a> *
                  </span>
                </label>
              </div>

              <button onClick={() => { setShowSignupModal(false); onNavigate && onNavigate('auth'); }}
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

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      color: colors.label,
      overflowX: 'hidden'
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
        html { scroll-behavior: smooth; }
        * { -webkit-tap-highlight-color: transparent; }
        
        /* ========================================
           MOBILE RESPONSIVE - APPLE STYLE
           ======================================== */
        
        @media (max-width: 768px) {
          /* Navigation */
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
          
          /* Layouts - Stack everything */
          .pricing-grid, .hub-grid, .feature-row, .stats-row, .support-cards { 
            flex-direction: column !important; 
            align-items: stretch !important;
            gap: 16px !important;
          }
          
          /* Cards - Full width on mobile */
          .pricing-grid > div, .hub-grid > div, .support-cards > div {
            max-width: 100% !important;
            flex: none !important;
            width: 100% !important;
          }
          
          /* Device mockups - Hide on small screens, show simplified version */
          .device-mockups { 
            display: none !important;
          }
          .mobile-hero-image {
            display: block !important;
          }
          
          /* Section padding */
          section { 
            padding: 60px 24px !important; 
          }
          
          /* Typography scaling */
          h1 { font-size: 38px !important; line-height: 1.1 !important; }
          h2 { font-size: 32px !important; line-height: 1.15 !important; }
          h3 { font-size: 22px !important; }
          
          /* Buttons - Full width and larger */
          .hero-buttons { 
            flex-direction: column !important; 
            width: 100% !important;
          }
          .hero-buttons button {
            width: 100% !important;
            padding: 18px 24px !important;
            font-size: 17px !important;
          }
          
          /* Feature mockups - Stack vertically */
          .feature-mockups-wrapper {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .feature-mockups-wrapper > div {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Tutorial grid */
          .tutorials-grid {
            grid-template-columns: 1fr !important;
          }
          
          /* Stats - 2x2 grid on mobile */
          .stats-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
          
          /* Cookie banner */
          .cookie-banner {
            flex-direction: column !important;
            text-align: center !important;
            padding: 20px !important;
            gap: 16px !important;
          }
          .cookie-banner > div:first-child {
            flex-direction: column !important;
            align-items: center !important;
          }
          .cookie-buttons {
            width: 100% !important;
            flex-direction: column !important;
          }
          .cookie-buttons button {
            width: 100% !important;
          }
        }
        
        @media (max-width: 480px) {
          section { padding: 48px 20px !important; }
          h1 { font-size: 32px !important; }
          h2 { font-size: 26px !important; }
          h3 { font-size: 20px !important; }
          
          /* Stats - Single column on very small */
          .stats-row {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-menu { display: none !important; }
          .mobile-hero-image { display: none !important; }
        }
        
        /* Touch-friendly - iOS HIG 44pt minimum */
        @media (hover: none) and (pointer: coarse) {
          button, a, .clickable { 
            min-height: 44px; 
            min-width: 44px; 
          }
          .apple-button {
            min-height: 50px;
          }
        }
      `}</style>

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
      {showSignupModal && <SignupModal />}

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: isScrolled ? 'rgba(255,255,255,0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'saturate(180%) blur(20px)' : 'none',
        borderBottom: isScrolled ? `0.5px solid ${colors.gray5}` : 'none',
        transition: 'all 0.3s ease', zIndex: 1000
      }}>
        <Logo size={44} />
        
        <div className="desktop-nav" style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {[
            { label: 'Features', id: 'features' },
            { label: 'Pricing', id: 'pricing' },
            { label: 'About', id: 'about' },
            { label: 'Tutorials', id: 'tutorials' },
            { label: 'Support', id: 'support' }
          ].map(item => (
            <a key={item.id} onClick={() => scrollToSection(item.id)}
              style={{ color: colors.secondary, textDecoration: 'none', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}
              onMouseOver={e => e.target.style.color = colors.label}
              onMouseOut={e => e.target.style.color = colors.secondary}>
              {item.label}
            </a>
          ))}
          <button onClick={() => handleSignIn()}
            style={{ padding: '10px 18px', background: 'transparent', border: 'none', fontSize: '16px', color: colors.blue, cursor: 'pointer', fontWeight: '500' }}>Sign In</button>
          <button onClick={() => handleStartTrial()} className="apple-button"
            style={{ padding: '12px 24px', background: colors.blue, border: 'none', borderRadius: '14px', color: '#FFF', fontSize: '16px', fontWeight: '600' }}>Get Started</button>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', padding: '8px' }}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu - Apple Style Full Screen */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', 
          padding: '100px 24px 40px', zIndex: 999,
          display: 'flex', flexDirection: 'column', overflowY: 'auto'
        }}>
          <div style={{ flex: 1 }}>
            {['Features', 'Pricing', 'About', 'Tutorials', 'Support'].map(item => (
              <a key={item} onClick={() => { setMobileMenuOpen(false); scrollToSection(item.toLowerCase()); }}
                style={{ 
                  display: 'block', padding: '20px 0', fontSize: '28px', fontWeight: '600',
                  color: colors.label, textDecoration: 'none', 
                  borderBottom: `1px solid ${colors.gray5}`, cursor: 'pointer'
                }}>
                {item}
              </a>
            ))}
          </div>
          <div style={{ paddingTop: '24px' }}>
            <button onClick={() => { setMobileMenuOpen(false); handleSignIn(); }}
              style={{ 
                width: '100%', marginBottom: '12px', padding: '18px', 
                background: 'transparent', border: `2px solid ${colors.blue}`, 
                borderRadius: '14px', color: colors.blue, fontSize: '18px', fontWeight: '600', cursor: 'pointer'
              }}>
              Sign In
            </button>
            <button onClick={() => { setMobileMenuOpen(false); handleStartTrial(); }} className="apple-button"
              style={{ 
                width: '100%', padding: '18px', 
                background: colors.blue, border: 'none', 
                borderRadius: '14px', color: '#FFF', fontSize: '18px', fontWeight: '600'
              }}>
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 40px 80px', background: `linear-gradient(180deg, ${colors.gray6} 0%, ${colors.background} 100%)`, textAlign: 'center'
      }}>
        <div className="animate-in" style={{ maxWidth: '1100px', width: '100%' }}>
          <div style={{ marginBottom: '28px' }}><PennyLogo size={100} animate /></div>
          <h1 style={{
            fontSize: 'clamp(42px, 8vw, 72px)', fontWeight: '700', lineHeight: 1.1, marginBottom: '24px',
            background: `linear-gradient(135deg, ${colors.label} 0%, ${colors.secondary} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Your money.<br/>Your hustle.<br/>
            <span style={{ background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.purple} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>One nest.</span>
          </h1>
          <p style={{ fontSize: 'clamp(18px, 3vw, 22px)', color: colors.secondary, lineHeight: 1.6, marginBottom: '40px', maxWidth: '650px', margin: '0 auto 40px' }}>
            The finance app for working families with entrepreneurial spirits. Track personal expenses and side hustle income together.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
            <button onClick={() => handleStartTrial()} className="apple-button"
              style={{ padding: '20px 44px', background: colors.blue, border: 'none', borderRadius: '14px', color: '#FFF', fontSize: '18px', fontWeight: '600' }}>
              Start Free Trial
            </button>
            <button onClick={() => scrollToSection('features')} className="apple-button"
              style={{ padding: '20px 44px', background: colors.gray6, border: `1px solid ${colors.gray4}`, borderRadius: '14px', color: colors.label, fontSize: '18px', fontWeight: '500' }}>
              ▶ See Features
            </button>
          </div>
          
          {/* Desktop Device Mockups */}
          <div className="device-mockups">
            <DeviceMockups />
          </div>
          
          {/* Mobile Hero Image - Simplified dashboard preview */}
          <div className="mobile-hero-image" style={{ display: 'none', padding: '20px' }}>
            <div style={{
              background: '#FFF', borderRadius: '24px', padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxWidth: '340px', margin: '0 auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <PennyLogo size={36} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>Dashboard</div>
                  <div style={{ fontSize: '12px', color: colors.gray }}>December 2024</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: colors.green, borderRadius: '12px', padding: '16px', color: '#FFF' }}>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Income</div>
                  <div style={{ fontSize: '22px', fontWeight: '700' }}>$12,450</div>
                </div>
                <div style={{ background: colors.red, borderRadius: '12px', padding: '16px', color: '#FFF' }}>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Expenses</div>
                  <div style={{ fontSize: '22px', fontWeight: '700' }}>$4,230</div>
                </div>
              </div>
              <div style={{ background: colors.blue, borderRadius: '12px', padding: '16px', color: '#FFF' }}>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>Net Cash Flow</div>
                <div style={{ fontSize: '28px', fontWeight: '700' }}>+$8,220</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>66% savings rate 🎯</div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                {['Dashboard', 'Budget', 'Bills', 'Goals'].map((tab, i) => (
                  <div key={tab} style={{
                    flex: 1, padding: '10px 4px', borderRadius: '8px', textAlign: 'center',
                    fontSize: '11px', fontWeight: '500',
                    background: i === 0 ? colors.blue : colors.gray6,
                    color: i === 0 ? '#FFF' : colors.secondary
                  }}>{tab}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section style={{ padding: '60px 40px', background: colors.background, borderTop: `1px solid ${colors.gray5}`, borderBottom: `1px solid ${colors.gray5}` }}>
        <div className="stats-row" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', gap: '40px', flexWrap: 'wrap' }}>
          {[
            { value: '$2.4B+', label: 'Assets Tracked', color: colors.green },
            { value: '12,000+', label: 'Active Families', color: colors.blue },
            { value: '4.9', label: 'App Rating', suffix: '★', color: colors.orange },
            { value: '256-bit', label: 'Encryption', color: colors.purple }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', flex: '1 1 auto' }}>
              <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: '700', color: stat.color }}>{stat.value}{stat.suffix || ''}</div>
              <div style={{ fontSize: '16px', color: colors.secondary, marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hub Cards with Animation */}
      <section style={{ padding: '100px 40px', background: colors.gray6 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: '700', marginBottom: '16px' }}>Three hubs. One mission.</h2>
            <p style={{ fontSize: '19px', color: colors.secondary }}>Household, business, and real estate—all covered.</p>
          </div>
          
          <div className="hub-grid" style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: '🏠', title: 'HomeBudget Hub', desc: 'Master household finances with smart budgeting tools designed for families.', color: colors.green, badge: 'Most Popular', available: true },
              { icon: '💼', title: 'BizBudget Hub', desc: 'Track side hustle and 1099 income with dedicated business tools.', color: colors.blue, badge: 'Coming Soon', available: false },
              { icon: '🏢', title: 'REBudget Hub', desc: 'Manage real estate investments and rental income all in one place.', color: colors.purple, badge: 'Coming Soon', available: false }
            ].map((hub, i) => (
              <div key={i} className={`hover-lift ${activeHubIndex === i ? 'hub-glow' : ''}`} style={{
                background: colors.background, borderRadius: '24px', padding: '36px',
                flex: '1 1 340px', maxWidth: '420px', position: 'relative',
                boxShadow: activeHubIndex === i ? `0 8px 40px ${hub.color}40` : '0 4px 20px rgba(0,0,0,0.06)',
                border: activeHubIndex === i || hub.available ? `2px solid ${hub.color}` : `1px solid ${colors.gray5}`,
                opacity: hub.available ? 1 : 0.85,
                transition: 'all 0.5s ease'
              }}>
                {hub.badge && (
                  <div style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    background: hub.available ? colors.orange : colors.gray,
                    padding: '6px 18px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', color: '#FFF'
                  }}>{hub.badge}</div>
                )}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px', background: `${hub.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '20px'
                }}>{hub.icon}</div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>{hub.title}</h3>
                <p style={{ fontSize: '16px', color: colors.secondary, lineHeight: 1.6 }}>{hub.desc}</p>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button onClick={() => scrollToSection('features')} className="apple-button"
              style={{ padding: '18px 36px', background: colors.green, border: 'none', borderRadius: '14px', color: '#FFF', fontSize: '17px', fontWeight: '500' }}>
              Explore all features
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '100px 40px', background: colors.background }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: '700', marginBottom: '16px' }}>All your accounts in one place</h2>
            <p style={{ fontSize: '19px', color: colors.secondary, maxWidth: '600px', margin: '0 auto' }}>
              Dashboard, Sales Tracker, Budget, Transactions, Bills, Goals, Retirement, Reports—everything unified.
            </p>
          </div>

          <div className="feature-row" style={{ display: 'flex', gap: '60px', alignItems: 'center', marginBottom: '80px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '350px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: `${colors.orange}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '24px' }}>📱</div>
              <h3 style={{ fontSize: '36px', fontWeight: '600', marginBottom: '16px' }}>Personal & Side Hustle</h3>
              <p style={{ fontSize: '18px', color: colors.secondary, lineHeight: 1.7, marginBottom: '28px' }}>
                See your W2 income and 1099 earnings side by side. Track commissions, monitor profit margins, and never miss a bill payment.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Dashboard with real-time overview', 'Sales Tracker for side hustle income', 'Budget planning and monitoring', 'Bill reminders so you never miss a payment'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', fontSize: '16px', color: colors.secondary }}>
                    <span style={{ color: colors.green, fontSize: '18px' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: '350px' }}>
              <FeatureMockups />
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section id="tutorials" style={{ padding: '100px 40px', background: colors.gray6 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📚</div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '700', marginBottom: '16px' }}>Learn & Grow</h2>
            <p style={{ fontSize: '19px', color: colors.secondary }}>Master your finances with our tutorials and guides</p>
          </div>
          
          <div className="tutorials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🚀', title: 'Getting Started', desc: 'Set up your account in 5 minutes', time: '5 min' },
              { icon: '💰', title: 'Budget Basics', desc: 'Create your first budget', time: '10 min' },
              { icon: '📊', title: 'Understanding Reports', desc: 'Make sense of your data', time: '8 min' },
              { icon: '🔥', title: 'FIRE Planning', desc: 'Calculate your retirement date', time: '15 min' },
              { icon: '💼', title: 'Side Hustle Tracking', desc: 'Separate business income', time: '12 min' },
              { icon: '🎯', title: 'Goal Setting', desc: 'Achieve financial milestones', time: '7 min' },
            ].map((tutorial, i) => (
              <div key={i} className="hover-lift" style={{
                background: '#FFF', borderRadius: '20px', padding: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', cursor: 'pointer'
              }}>
                <div style={{ fontSize: '44px', marginBottom: '16px' }}>{tutorial.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>{tutorial.title}</h3>
                <p style={{ fontSize: '15px', color: colors.secondary, marginBottom: '12px' }}>{tutorial.desc}</p>
                <div style={{ fontSize: '14px', color: colors.blue, fontWeight: '500' }}>⏱ {tutorial.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / FIRE Section */}
      <section id="about" style={{ padding: '100px 40px', background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.purple} 100%)`, color: '#FFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>🔥</div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: '700', marginBottom: '20px' }}>Your path to FIRE</h2>
          <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px', lineHeight: 1.7 }}>
            Financial Independence, Retire Early isn't just a dream. See exactly when you'll hit your number, and how your side hustle accelerates the journey.
          </p>
          
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '28px', padding: '44px', backdropFilter: 'blur(10px)', marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
              <div><div style={{ fontSize: '15px', opacity: 0.8, marginBottom: '8px' }}>FIRE Number</div><div style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: '700' }}>$1.2M</div></div>
              <div><div style={{ fontSize: '15px', opacity: 0.8, marginBottom: '8px' }}>Current Progress</div><div style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: '700' }}>$291K</div></div>
              <div><div style={{ fontSize: '15px', opacity: 0.8, marginBottom: '8px' }}>Years to FIRE</div><div style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: '700', color: colors.yellow }}>8.3</div></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', height: '18px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: '24.3%', height: '100%', background: `linear-gradient(90deg, ${colors.yellow}, ${colors.orange})`, borderRadius: '12px' }}/>
            </div>
            <div style={{ fontSize: '17px', opacity: 0.9 }}>24.3% complete • Side hustle adds <strong>$6,250/mo</strong> → saves you <strong>4 years</strong></div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '44px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>Why We Built ProsperNest</h3>
            <p style={{ fontSize: '17px', lineHeight: 1.8, opacity: 0.9, marginBottom: '20px' }}>
              We founded ProsperNest on a simple belief: <strong>life is short</strong>, and you deserve to enjoy it—not spend it stressed about money.
            </p>
            <p style={{ fontSize: '17px', lineHeight: 1.8, opacity: 0.9 }}>
              We built this to help you set <strong>realistic goals</strong>, track <strong>every income stream</strong>, and create a path to retire early so you can focus on <strong>family, travel, experiences, and living life on your terms</strong>.
              Life is tough already. <strong>Let ProsperNest handle the heavy lifting.</strong> 💪
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '100px 40px', background: colors.gray6 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: '700', marginBottom: '16px' }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: '19px', color: colors.secondary, marginBottom: '28px' }}>Start free. Upgrade when you're ready.</p>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: colors.background, padding: '6px', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <button onClick={() => setBillingCycle('monthly')} className="apple-button"
                style={{
                  padding: '14px 28px', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '500',
                  background: billingCycle === 'monthly' ? colors.blue : 'transparent',
                  color: billingCycle === 'monthly' ? '#FFF' : colors.secondary
                }}>Monthly</button>
              <button onClick={() => setBillingCycle('annual')} className="apple-button"
                style={{
                  padding: '14px 28px', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '500',
                  background: billingCycle === 'annual' ? colors.blue : 'transparent',
                  color: billingCycle === 'annual' ? '#FFF' : colors.secondary
                }}>
                Annual <span style={{ background: colors.green, color: '#FFF', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', marginLeft: '8px' }}>15% OFF</span>
              </button>
            </div>
          </div>
          
          <div className="pricing-grid" style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { name: 'Starter', price: 0, desc: 'For getting started', features: ['Personal budgeting', '1 account', 'Basic reports', 'Mobile app'], cta: 'Get Started', highlighted: false, plan: 'starter' },
              { name: 'Pro', price: getPricing('pro'), desc: 'For couples building wealth', features: ['Everything in Starter', '2 accounts (couples)', 'Side hustle tracking', 'FIRE calculator', 'Advanced analytics', 'Priority support'], cta: 'Start Free Trial', highlighted: true, plan: 'pro' },
              { name: 'Family', price: getPricing('family'), desc: 'For the whole household', features: ['Everything in Pro', 'Up to 5 members', 'Shared goals', 'Investment tracking', 'RE portfolio tools'], cta: 'Start Free Trial', highlighted: false, plan: 'family' }
            ].map((plan, i) => (
              <div key={i} className="hover-lift" style={{
                background: plan.highlighted ? colors.blue : colors.background,
                color: plan.highlighted ? '#FFF' : colors.label,
                borderRadius: '24px', padding: '40px', flex: '1 1 320px', maxWidth: '380px',
                boxShadow: plan.highlighted ? `0 25px 50px ${colors.blue}40` : '0 4px 25px rgba(0,0,0,0.08)',
                transform: plan.highlighted ? 'scale(1.04)' : 'none', position: 'relative'
              }}>
                {plan.highlighted && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: colors.orange, padding: '6px 18px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', color: '#FFF' }}>Most Popular</div>
                )}
                <div style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>{plan.name}</div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '52px', fontWeight: '700' }}>{plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)}`}</span>
                  {plan.price > 0 && <span style={{ fontSize: '18px', opacity: 0.8 }}>/mo</span>}
                </div>
                <div style={{ fontSize: '15px', opacity: 0.8, marginBottom: '28px' }}>{plan.desc}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', fontSize: '15px' }}>
                      <span style={{ color: plan.highlighted ? '#FFF' : colors.green, fontSize: '16px' }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleStartTrial(plan.plan)} className="apple-button"
                  style={{
                    width: '100%', padding: '18px', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '600',
                    background: plan.highlighted ? '#FFF' : colors.blue,
                    color: plan.highlighted ? colors.blue : '#FFF'
                  }}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" style={{ padding: '100px 40px', background: colors.background }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>💬</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '700', marginBottom: '20px' }}>We're here to help</h2>
          <p style={{ fontSize: '19px', color: colors.secondary, marginBottom: '44px' }}>Have questions? Our support team is available to help you.</p>
          <div className="support-cards" style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '📧', title: 'Email Support', desc: 'support@prospernest.io', action: handleEmailSupport },
              { icon: '💬', title: 'Live Chat', desc: 'Chat with Penny anytime', action: handleLiveChat },
              { icon: '📚', title: 'Help Center', desc: 'Guides & tutorials', action: () => scrollToSection('tutorials') }
            ].map((item, i) => (
              <div key={i} onClick={item.action} className="hover-lift" style={{
                background: colors.gray6, borderRadius: '20px', padding: '36px', flex: '1 1 260px', maxWidth: '300px', cursor: 'pointer'
              }}>
                <div style={{ fontSize: '44px', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '15px', color: colors.secondary }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 20px', background: colors.label, color: '#FFF', textAlign: 'center' }}>
        <div style={{ maxWidth: '550px', margin: '0 auto' }}>
          <PennyLogo size={70} />
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: '700', marginTop: '20px', marginBottom: '12px' }}>Ready to prosper?</h2>
          <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '28px' }}>Join 12,000+ families on their journey to financial independence.</p>
          <button onClick={() => handleStartTrial()} className="apple-button"
            style={{ padding: '16px 36px', background: colors.blue, border: 'none', borderRadius: '14px', color: '#FFF', fontSize: '16px', fontWeight: '500' }}>
            Start Your Free Trial
          </button>
          <div style={{ marginTop: '16px', fontSize: '13px', opacity: 0.6 }}>No credit card required • 14-day free trial</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 20px', background: '#000', color: colors.gray }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>
          <div>© 2024 ProsperNest. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'Contact'].map((link, i) => (
              <a key={i} href="#" style={{ color: colors.gray, textDecoration: 'none' }}
                onMouseOver={e => e.target.style.color = '#FFF'} onMouseOut={e => e.target.style.color = colors.gray}>{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProsperNestLandingV4;
