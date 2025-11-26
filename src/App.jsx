import React, { useState, useEffect, useRef } from 'react';

// ============================================
// CONFIGURATION
// ============================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
const initSupabase = async () => {
  if (supabase) return supabase;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabase;
  } catch (e) {
    return null;
  }
};

// ============================================
// ERROR BOUNDARY
// ============================================
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0c0a1d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>Something went wrong</h2>
            <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '12px 24px', background: '#8B5CF6', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================
// AI CHATBOT COMPONENT
// ============================================
function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm the Family Finance AI assistant. Ask me anything about our products, pricing, or features!" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const q = input.toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    let response = "Great question! Our team is here to help. Start your free trial to explore all features.";

    if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
      response = "💰 **Pricing:**\n\n• HomeBudget Hub: $9.99/mo (or $99/year - save 17%)\n• BusinessBudget Hub: +$4.99/mo add-on\n• REAnalyzer Hub: +$6.99/mo add-on\n\nAll plans include a 14-day free trial!";
    } else if (q.includes('free') || q.includes('trial')) {
      response = "🎉 Yes! We offer a 14-day free trial with full access. No credit card required to start.";
    } else if (q.includes('family') || q.includes('share')) {
      response = "👨‍👩‍👧‍👦 Family sharing is included! Add up to 5 family members at no extra cost.";
    } else if (q.includes('security') || q.includes('safe')) {
      response = "🔒 We use 256-bit bank-level encryption. We never sell your data.";
    } else if (q.includes('bank') || q.includes('connect')) {
      response = "🏦 We support unlimited bank connections with real-time sync from 10,000+ institutions.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 100, right: 24, zIndex: 1000,
      width: 340, maxWidth: 'calc(100vw - 48px)',
      background: 'rgba(15, 12, 41, 0.98)', backdropFilter: 'blur(20px)',
      borderRadius: 20, border: '1px solid rgba(139, 92, 246, 0.3)',
      boxShadow: '0 25px 50px rgba(139, 92, 246, 0.3)',
      overflow: 'hidden'
    }}>
      <div style={{ padding: 16, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontWeight: 600, color: 'white' }}>AI Assistant</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
      </div>
      <div style={{ height: 280, overflowY: 'auto', padding: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            <div style={{
              maxWidth: '85%', padding: 12, borderRadius: 16,
              background: m.role === 'user' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)',
              color: 'white', fontSize: 14, whiteSpace: 'pre-wrap'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          style={{
            flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
            color: 'white', fontSize: 14, outline: 'none'
          }}
        />
        <button onClick={handleSend} style={{
          padding: '10px 16px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          border: 'none', borderRadius: 10, color: 'white', fontWeight: 500, cursor: 'pointer'
        }}>
          Send
        </button>
      </div>
    </div>
  );
}

// ============================================
// LANDING PAGE - HOMEBUDDY LAYOUT WITH FAMILY FINANCE BRANDING
// ============================================
function LandingPage({ onNavigateToAuth }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    { q: "How does the 14-day free trial work?", a: "Start using Family Finance immediately with full access. No credit card required. Cancel anytime before the trial ends." },
    { q: "Can I share with my family?", a: "Yes! All plans include sharing with up to 5 family members at no extra cost." },
    { q: "Is my financial data secure?", a: "Absolutely. We use 256-bit bank-level encryption and never sell your data." },
    { q: "Can I cancel anytime?", a: "Yes, cancel anytime with no questions asked. Annual subscribers get a prorated refund." },
    { q: "What banks do you support?", a: "We support 10,000+ financial institutions including all major banks, credit unions, and investment accounts." },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0c0a1d', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Background Image - Family at Beach */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.15
      }} />
      
      {/* Purple Gradient Overlays */}
      <div style={{ position: 'absolute', top: '20%', right: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: '30%', right: '30%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: '50%', left: '10%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 1 }} />

      {/* Navigation */}
      <nav style={{ position: 'relative', zIndex: 10, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>FF</div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Family Finance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>Features</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>Pricing</a>
          <button onClick={() => onNavigateToAuth('login')} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50, color: 'white', fontSize: 14, cursor: 'pointer' }}>
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', padding: '80px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        {/* Left Content */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 50, marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#10B981', fontSize: 14 }}>Trusted by 10,000+ families</span>
          </div>

          <h1 style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
            Your Family's{' '}
            <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Financial Command Center
            </span>
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', marginBottom: 32, lineHeight: 1.6 }}>
            Three powerful hubs. One simple app. Take control of your home budget, track investments, and analyze real estate—all in one place.
          </p>

          <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
            <button onClick={() => onNavigateToAuth('signup')} style={{
              padding: '16px 32px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              border: 'none', borderRadius: 50, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(139, 92, 246, 0.4)'
            }}>
              Start Free Trial →
            </button>
            <button style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              ▶ Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>$2.4B+</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Assets Tracked</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>4.9<span style={{ color: '#FBBF24' }}>★</span></div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>App Store</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>256-bit</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Encryption</div>
            </div>
          </div>
        </div>

        {/* Right - Dashboard Preview */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)',
            borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)',
            padding: 24, width: 340, boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8B5CF6' }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Dashboard</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Net Worth</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>$847,320</div>
              <div style={{ fontSize: 14, color: '#86EFAC', marginTop: 4 }}>+12.4%</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {['🏠', '📈', '💳', '🎯'].map((icon, i) => (
                <div key={i} style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="features" style={{ position: 'relative', zIndex: 10, padding: '100px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 50, fontSize: 14, color: '#A78BFA', marginBottom: 16 }}>
            THREE POWERFUL HUBS
          </div>
          <h2 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>Everything Your Family Needs</h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>Purpose-built tools for modern family finances</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {/* HomeBudget Hub - Most Popular */}
          <div style={{ position: 'relative', background: 'rgba(30, 27, 56, 0.8)', borderRadius: 24, padding: 32, border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '6px 16px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: 50, fontSize: 12, fontWeight: 600 }}>
              Most Popular
            </div>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #10B981, #14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>🏠</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>HomeBudget Hub</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Track spending, manage bills, and build budgets that actually work for your family.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Automatic transaction categorization', 'Bill reminders & payment tracking', 'Family spending insights', 'Goal setting & progress tracking'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#10B981' }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>

          {/* BusinessBudget Hub - Coming Soon */}
          <div style={{ position: 'relative', background: 'rgba(30, 27, 56, 0.5)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '6px 16px', background: 'rgba(251, 191, 36, 0.2)', border: '1px solid rgba(251, 191, 36, 0.4)', borderRadius: 50, fontSize: 12, fontWeight: 600, color: '#FBBF24' }}>
              Coming Soon
            </div>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>💼</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>BusinessBudget Hub</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Powerful tools for small and medium business financial management.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Cash flow forecasting', 'Expense management', 'Team access controls', 'Financial reports & invoicing'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#10B981' }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>

          {/* REAnalyzer Hub - Coming Soon */}
          <div style={{ position: 'relative', background: 'rgba(30, 27, 56, 0.5)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '6px 16px', background: 'rgba(251, 191, 36, 0.2)', border: '1px solid rgba(251, 191, 36, 0.4)', borderRadius: 50, fontSize: 12, fontWeight: 600, color: '#FBBF24' }}>
              Coming Soon
            </div>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #F97316, #EAB308)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>🏢</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>REAnalyzer Hub</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Analyze properties, calculate returns, and build your real estate portfolio.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Property analysis calculator', 'Rental income tracking', 'Market comparisons', 'Equity growth monitoring'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#10B981' }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & FAQ Section */}
      <section id="pricing" style={{ position: 'relative', zIndex: 10, padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 50, fontSize: 14, color: '#A78BFA', marginBottom: 16 }}>
            Simple Pricing
          </div>
          <h2 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>One Price. All Features.</h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>No hidden fees, no upsells, no complexity</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {/* Pricing Card */}
          <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: 24, padding: 32, border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            {/* Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
              <span style={{ fontSize: 14, color: !isAnnual ? 'white' : 'rgba(255,255,255,0.5)' }}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                style={{ width: 56, height: 28, borderRadius: 14, background: isAnnual ? '#8B5CF6' : 'rgba(255,255,255,0.2)', border: 'none', position: 'relative', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', top: 4, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: isAnnual ? 32 : 4 }} />
              </button>
              <span style={{ fontSize: 14, color: isAnnual ? 'white' : 'rgba(255,255,255,0.5)' }}>
                Annual <span style={{ color: '#10B981' }}>(save 17%)</span>
              </span>
            </div>

            {/* Price */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 56, fontWeight: 700 }}>
                <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>$</span>
                {isAnnual ? '8' : '9'}
                <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>.{isAnnual ? '29' : '99'}/mo</span>
              </div>
              {isAnnual && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>or $99/year (save 17%)</p>}
            </div>

            {/* Products */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(139, 92, 246, 0.2)', borderRadius: 12, border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 20 }}>🏠</span><span style={{ fontWeight: 500 }}>HomeBudget Hub</span></div>
                <span style={{ color: '#10B981', fontSize: 14 }}>Included</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 20 }}>💼</span><span style={{ fontWeight: 500 }}>BusinessBudget Hub</span><span style={{ fontSize: 10, color: '#FBBF24', marginLeft: 4 }}>Coming Soon</span></div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>+$4.99/mo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 20 }}>🏢</span><span style={{ fontWeight: 500 }}>REAnalyzer Hub</span><span style={{ fontSize: 10, color: '#FBBF24', marginLeft: 4 }}>Coming Soon</span></div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>+$6.99/mo</span>
              </div>
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {['All 3 Hubs included', 'Unlimited bank connections', 'Family sharing (up to 5 members)', 'Real-time transaction sync', 'Advanced analytics & reports', 'Priority support', 'Data export anytime'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#A78BFA' }}>✓</span> {f}
                </div>
              ))}
            </div>

            <button onClick={() => onNavigateToAuth('signup')} style={{
              width: '100%', padding: '16px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer'
            }}>
              Start 14-Day Free Trial
            </button>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 12 }}>No credit card required</p>

            {/* Alternatives */}
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Alternate products:</span> Monarch ($14.99), YNAB ($14.99), Quicken ($5.99)
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Frequently Asked Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    style={{ width: '100%', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}
                  >
                    {faq.q}
                    <span style={{ transition: 'transform 0.2s', transform: expandedFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {expandedFaq === i && (
                    <div style={{ padding: '0 20px 20px', color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, padding: '40px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>FF</div>
            <span style={{ fontWeight: 600 }}>Family Finance</span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Support</a>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>© 2024 Family Finance</div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      
      {/* Chatbot Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          border: 'none', boxShadow: '0 10px 40px rgba(139, 92, 246, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, cursor: 'pointer', transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {chatOpen ? '×' : '💬'}
      </button>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 1024px) {
          section > div[style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; }
          section > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          nav { padding: 16px 20px !important; }
          nav > div:last-child > a { display: none; }
          section { padding: 40px 20px !important; }
          h1 { font-size: 36px !important; }
          h2 { font-size: 32px !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// AUTH PAGE
// ============================================
function AuthPage({ mode = 'login', onAuth, onBack }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setIsLogin(mode === 'login'); }, [mode]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');

    try {
      const client = await initSupabase();
      if (!client) { setError('Service unavailable'); setLoading(false); return; }

      if (isLogin) {
        const { data, error: authError } = await client.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        onAuth(data.user);
      } else {
        const { data, error: authError } = await client.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (authError) throw authError;
        if (data.user) onAuth(data.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const client = await initSupabase();
      if (client) await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    } catch (err) { setError(err.message); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0c0a1d', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: '20%', right: '30%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      
      <header style={{ padding: 24, position: 'relative', zIndex: 10 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>FF</div>
          <span style={{ fontSize: 18, fontWeight: 600 }}>Family Finance</span>
        </button>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{isLogin ? 'Welcome back' : 'Start your free trial'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 32 }}>{isLogin ? 'Sign in to continue' : '14 days free, then $9.99/month'}</p>

          <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)' }}>
            {error && <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, color: '#FCA5A5', fontSize: 14, marginBottom: 20 }}>{error}</div>}

            <button onClick={handleGoogle} style={{ width: '100%', padding: 14, background: 'white', border: 'none', borderRadius: 12, color: '#333', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 15, marginBottom: 12, outline: 'none', boxSizing: 'border-box' }} />
              )}
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 15, marginBottom: 12, outline: 'none', boxSizing: 'border-box' }} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6} style={{ width: '100%', padding: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', fontSize: 15, marginBottom: 20, outline: 'none', boxSizing: 'border-box' }} />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 24 }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', fontSize: 14 }}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// DASHBOARD
// ============================================
function Dashboard({ user, onSignOut, onGoHome }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0a1d 0%, #1a1040 50%, #0c0a1d 100%)', color: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={onGoHome} style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: 'white', cursor: 'pointer' }}>FF</button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Family Finance</h1>
              <p style={{ color: 'rgba(167, 139, 250, 0.8)', fontSize: 14, margin: 0 }}>Welcome back, {userName}!</p>
            </div>
          </div>
          <button onClick={onSignOut} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: 'white', cursor: 'pointer' }}>Sign Out</button>
        </header>

        <nav style={{ display: 'flex', gap: 8, padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 16, marginBottom: 32 }}>
          {[{ id: 'dashboard', label: '🏠 Home' }, { id: 'networth', label: '📈 Net Worth' }, { id: 'reports', label: '📊 Reports' }, { id: 'settings', label: '⚙️ Settings' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: 'none', background: activeTab === tab.id ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'transparent', color: 'white', fontWeight: 500, cursor: 'pointer' }}>
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
          <div style={{ gridColumn: 'span 1', background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Net Worth</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>$285,420</div>
            <div style={{ color: '#86EFAC', fontSize: 14, marginTop: 4 }}>↑ 12.4%</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Monthly Cash Flow</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#86EFAC' }}>+$2,946</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #EC4899, #DB2777)', borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Savings Rate</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>58.3%</div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, marginTop: 0 }}>📊 Recent Transactions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🛒', name: 'Grocery Store', amount: -127.43, date: 'Today' },
              { icon: '💼', name: 'Salary Deposit', amount: 4250, date: 'Nov 25' },
              { icon: '📺', name: 'Netflix', amount: -15.99, date: 'Nov 24' },
              { icon: '⛽', name: 'Gas Station', amount: -45.20, date: 'Nov 23' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{t.date}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 600, color: t.amount > 0 ? '#86EFAC' : 'white' }}>
                  {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
function App() {
  const [view, setView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const client = await initSupabase();
        if (client) {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) { setUser(session.user); setView('dashboard'); }
          client.auth.onAuthStateChange((event, session) => {
            if (session?.user) { setUser(session.user); setView('dashboard'); }
            else if (event === 'SIGNED_OUT') { setUser(null); setView('landing'); }
          });
        }
      } catch (e) {}
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    const client = await initSupabase();
    if (client) await client.auth.signOut();
    setUser(null);
    setView('landing');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0c0a1d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: 'white' }}>FF</div>
      </div>
    );
  }

  if (view === 'dashboard' && user) {
    return <Dashboard user={user} onSignOut={handleSignOut} onGoHome={() => setView('landing')} />;
  }

  if (view === 'auth') {
    return <AuthPage mode={authMode} onAuth={u => { setUser(u); setView('dashboard'); }} onBack={() => setView('landing')} />;
  }

  return <LandingPage onNavigateToAuth={mode => { setAuthMode(mode); setView('auth'); }} />;
}

export default function Main() {
  return <ErrorBoundary><App /></ErrorBoundary>;
}
