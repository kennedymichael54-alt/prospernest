import React, { useState, useEffect, useRef } from 'react';

// Component Imports
import MonthYearSelector from './components/MonthYearSelector';
import EmptyState from './components/EmptyState';
import HomeTab from './components/HomeTab';
import BudgetTab from './components/BudgetTab';
import BillsCalendarView from './components/BillsCalendarView';
import GoalsTimelineWithCelebration from './components/GoalsTimelineWithCelebration';
import ProductShowcase from './components/FamilyFinance-ProductGraphics';
import TransactionsTab from './components/TransactionsTab';

// ============================================================================
// FAMILY FINANCE - COMPREHENSIVE APP WITH REAL DATA SUPPORT
// ============================================================================

// Currency formatter helper - consistent $1,000.00 format
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));
};

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c0a1d', color: 'white' }}>
          <div style={{ textAlign: 'center' }}>
            <h1>Something went wrong</h1>
            <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', marginTop: '16px' }}>
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Supabase initialization
let supabase = null;
const initSupabase = async () => {
  if (supabase) return supabase;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    return supabase;
  } catch (e) {
    console.error('Supabase init error:', e);
    return null;
  }
};

// ============================================================================
// CSV PARSER UTILITY
// ============================================================================

const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const transactions = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV with quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length >= 5) {
      const transaction = {
        id: i,
        date: values[0],
        description: values[1]?.replace(/"/g, '') || '',
        originalDescription: values[2]?.replace(/"/g, '') || '',
        category: values[3]?.replace(/"/g, '') || 'Uncategorized',
        amount: parseFloat(values[4]) || 0,
        status: values[5]?.replace(/"/g, '') || 'Posted'
      };
      transactions.push(transaction);
    }
  }
  
  return transactions;
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Real data state - starts empty
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [lastImportDate, setLastImportDate] = useState(null);

  useEffect(() => {
    const init = async () => {
      const sb = await initSupabase();
      if (sb) {
        const { data: { session } } = await sb.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setView('dashboard');
          // Load saved data from localStorage
          loadSavedData(session.user.id);
        }
        sb.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            setUser(session.user);
            setView('dashboard');
            loadSavedData(session.user.id);
          } else {
            setUser(null);
            setView('landing');
          }
        });
      }
      setLoading(false);
    };
    init();
  }, []);

  // Load saved data from localStorage (per user)
  const loadSavedData = (userId) => {
    try {
      const savedTransactions = localStorage.getItem(`ff_transactions_${userId}`);
      const savedBills = localStorage.getItem(`ff_bills_${userId}`);
      const savedGoals = localStorage.getItem(`ff_goals_${userId}`);
      const savedImportDate = localStorage.getItem(`ff_lastImport_${userId}`);
      
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedBills) setBills(JSON.parse(savedBills));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedImportDate) setLastImportDate(new Date(savedImportDate));
    } catch (e) {
      console.error('Error loading saved data:', e);
    }
  };

  // Save data to localStorage (per user)
  const saveData = (userId, key, data) => {
    try {
      localStorage.setItem(`ff_${key}_${userId}`, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data:', e);
    }
  };

  // Handle CSV import
  const handleImportTransactions = (newTransactions) => {
    const userId = user?.id;
    if (!userId) return;
    
    setTransactions(newTransactions);
    setLastImportDate(new Date());
    saveData(userId, 'transactions', newTransactions);
    localStorage.setItem(`ff_lastImport_${userId}`, new Date().toISOString());
  };

  // Handle bills update
  const handleUpdateBills = (newBills) => {
    const userId = user?.id;
    if (!userId) return;
    
    setBills(newBills);
    saveData(userId, 'bills', newBills);
  };

  // Handle goals update
  const handleUpdateGoals = (newGoals) => {
    const userId = user?.id;
    if (!userId) return;
    
    setGoals(newGoals);
    saveData(userId, 'goals', newGoals);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c0a1d' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>FF</span>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.95); } }`}</style>
      </div>
    );
  }

  if (view === 'auth') return <AuthPage setView={setView} />;
  if (view === 'dashboard') return (
    <Dashboard 
      user={user} 
      setView={setView} 
      transactions={transactions}
      bills={bills}
      goals={goals}
      lastImportDate={lastImportDate}
      onImportTransactions={handleImportTransactions}
      onUpdateBills={handleUpdateBills}
      onUpdateGoals={handleUpdateGoals}
      parseCSV={parseCSV}
    />
  );
  return <LandingPage setView={setView} />;
}

// ============================================================================
// LANDING PAGE
// ============================================================================

function LandingPage({ setView }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#0c0a1d', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', position: 'relative', overflow: 'hidden' }}>
      {/* Background Image */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
      
      {/* Purple Glows */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.4)', borderRadius: '50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: '300px', height: '300px', background: 'rgba(236, 72, 153, 0.3)', borderRadius: '50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', top: '40%', left: '5%', width: '250px', height: '250px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', filter: 'blur(50px)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>FF</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: '600' }}>Family Finance</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Features</a>
            <a href="#pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px' }}>Pricing</a>
            <button onClick={() => setView('auth')} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '15px' }}>
              Sign In
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '20px', marginBottom: '24px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#10B981', fontSize: '14px' }}>Trusted by 10,000+ families</span>
            </div>
            
            <h1 style={{ fontSize: '56px', fontWeight: '700', lineHeight: 1.1, marginBottom: '24px' }}>
              Your Family's{' '}
              <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Financial Command Center
              </span>
            </h1>
            
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '500px' }}>
              Three powerful hubs. One simple app. Take control of your home budget, track investments, and analyze real estate—all in one place.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
              <button onClick={() => setView('auth')} style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Start Free Trial <span>→</span>
              </button>
              <button style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7 }}>
                <span>▶</span> Coming Soon
              </button>
            </div>

            <div style={{ display: 'flex', gap: '40px' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>$2.4B+</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Assets Tracked</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>4.9<span style={{ color: '#FBBF24' }}>★</span></div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>App Store</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>256-bit</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Encryption</div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '340px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Dashboard</span>
            </div>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Net Worth</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '28px', fontWeight: '700' }}>$847,320</span>
                <span style={{ color: '#10B981', fontSize: '14px' }}>+12.4%</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['🏠', '📈', '💳', '🎯'].map((emoji, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', textAlign: 'center', fontSize: '24px' }}>
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="features">
          <ProductShowcase />
        </section>

        {/* Pricing Section */}
        <PricingSection setView={setView} />

        {/* Footer */}
        <footer style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>© 2024 Family Finance. All rights reserved.</p>
        </footer>
      </div>

      {/* AI Chatbot */}
      <AIChatbot open={chatOpen} setOpen={setChatOpen} />

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 1024px) {
          section { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          nav { display: none !important; }
          h1 { font-size: 36px !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// PRICING SECTION
// ============================================================================

function PricingSection({ setView }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How does the 14-day free trial work?', a: 'Start using Family Finance immediately with full access to all features. No credit card required for the first 14 days. Cancel anytime before the trial ends and you won\'t be charged.' },
    { q: 'Can I share with my family?', a: 'Yes! Family sharing is included in your subscription. You can invite up to 5 family members to view and manage your shared finances together.' },
    { q: 'Is my financial data secure?', a: 'Absolutely. We use 256-bit encryption (the same as banks), and we never sell your data. Your information is protected with bank-level security measures.' },
    { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. If you cancel, you\'ll continue to have access until the end of your billing period.' },
    { q: 'What banks do you support?', a: 'We support over 10,000 financial institutions in the US, Canada, and UK including all major banks, credit unions, and investment accounts through our secure Plaid integration.' }
  ];

  return (
    <section id="pricing" style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>Simple, Transparent Pricing</h2>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)' }}>Start free, upgrade when you're ready</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Pricing Card */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '32px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            <span style={{ color: !isAnnual ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Monthly</span>
            <div 
              onClick={() => setIsAnnual(!isAnnual)}
              style={{ width: '50px', height: '28px', background: isAnnual ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.2)', borderRadius: '14px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease' }}
            >
              <div style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: isAnnual ? '25px' : '3px', transition: 'all 0.3s ease' }} />
            </div>
            <span style={{ color: isAnnual ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Annual</span>
            {isAnnual && <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>Save 17%</span>}
          </div>

          {/* Price */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'white' }}>
              ${isAnnual ? '8.29' : '9.99'}<span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>/mo</span>
            </div>
            {isAnnual && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Billed $99/year</div>}
          </div>

          {/* Products */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <span>🏠 HomeBudget Hub</span>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '4px 12px', borderRadius: '6px', fontSize: '13px' }}>Included</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>💼 BizBudget Hub</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>+$4.99/mo</span>
                <span style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Soon</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', color: 'white' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>🏢 REBudget Hub</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>+$6.99/mo</span>
                <span style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Soon</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '24px' }}>
            {['All 3 Hubs when available', 'Unlimited bank connections', 'Family sharing (5 members)', 'Real-time sync', 'Advanced analytics', 'Priority support', 'Data export'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <span style={{ color: '#8B5CF6' }}>✓</span> {f}
              </div>
            ))}
          </div>

          <button onClick={() => setView('auth')} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}>
            Start 14-Day Free Trial
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            Alternate products: Monarch ($14.99), YNAB ($14.99), Quicken ($5.99)
          </p>
        </div>

        {/* FAQ */}
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'white' }}>Frequently Asked Questions</h3>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '15px' }}
              >
                {faq.q}
                <span style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease', fontSize: '20px' }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 0 16px', color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// AI CHATBOT (Landing Page)
// ============================================================================

function AIChatbot({ open, setOpen }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m your Family Finance assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    
    let response = 'I\'d be happy to help with that! Feel free to ask me about pricing, features, or how to get started.';
    const lower = input.toLowerCase();
    
    if (lower.includes('price') || lower.includes('cost')) {
      response = '💰 Our pricing starts at $8.29/mo (billed annually) or $9.99/mo monthly. The HomeBudget Hub is included, with BizBudget (+$4.99) and REBudget (+$6.99) coming soon as add-ons!';
    } else if (lower.includes('trial') || lower.includes('free')) {
      response = '🎉 Yes! We offer a 14-day free trial with full access to all features. No credit card required to start!';
    } else if (lower.includes('family') || lower.includes('share')) {
      response = '👨‍👩‍👧‍👦 Family sharing is included! You can invite up to 5 family members to collaborate on your finances together.';
    } else if (lower.includes('secure') || lower.includes('safe') || lower.includes('security')) {
      response = '🔒 Your data is protected with 256-bit encryption (same as banks). We never sell your data and use bank-level security measures.';
    } else if (lower.includes('bank') || lower.includes('connect')) {
      response = '🏦 We support over 10,000 financial institutions through secure Plaid integration, including all major US banks, credit unions, and investment accounts.';
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
    
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px',
          borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)', zIndex: 1000
        }}
      >
        {open ? '×' : '💬'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '24px', width: '340px',
          background: 'rgba(30, 27, 56, 0.95)', backdropFilter: 'blur(20px)',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden', zIndex: 1000, boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <span style={{ fontWeight: '600', color: 'white' }}>AI Assistant</span>
          </div>

          <div style={{ height: '280px', overflowY: 'auto', padding: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: '12px', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: '16px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)',
                  color: 'white', fontSize: '14px', lineHeight: 1.5
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none'
              }}
            />
            <button onClick={sendMessage} style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// AUTH PAGE
// ============================================================================

function AuthPage({ setView }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const sb = await initSupabase();
    if (!sb) {
      setError('Connection error. Please try again.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const sb = await initSupabase();
    if (sb) {
      await sb.auth.signInWithOAuth({ 
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0c0a1d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ position: 'absolute', top: '20%', right: '30%', width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.3)', borderRadius: '50%', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '300px', height: '300px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px', padding: '20px' }}>
        <button onClick={() => setView('landing')} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>FF</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '600' }}>Family Finance</span>
        </button>

        <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
            {isLogin ? 'Welcome back' : 'Get started'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '32px' }}>
            {isLogin ? 'Sign in to your account' : 'Create your free account'}
          </p>

          <button onClick={handleGoogleSignIn} style={{ width: '100%', padding: '14px', background: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', marginBottom: '24px', fontSize: '15px', fontWeight: '500' }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#EF4444', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '15px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '15px', marginBottom: '24px', outline: 'none', boxSizing: 'border-box' }}
            />
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#8B5CF6', cursor: 'pointer', fontSize: '14px' }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DASHBOARD
// ============================================================================

function Dashboard({ 
  user, 
  setView, 
  transactions, 
  bills, 
  goals, 
  lastImportDate,
  onImportTransactions,
  onUpdateBills,
  onUpdateGoals,
  parseCSV
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [showAIChat, setShowAIChat] = useState(false);

  const handleSignOut = async () => {
    const sb = await initSupabase();
    if (sb) await sb.auth.signOut();
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div style={{ minHeight: '100vh', background: '#0c0a1d', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <header style={{ 
        background: 'rgba(30, 27, 56, 0.8)', 
        backdropFilter: 'blur(20px)', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        padding: '16px 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setView('landing')} style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>FF</span>
          </button>
          <div>
            <div style={{ fontWeight: '600', fontSize: '18px' }}>Family Finance</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Welcome back, {userName}!</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {lastImportDate && (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '16px' }}>📥</span>
              <span>Last import: {lastImportDate.toLocaleDateString()} at {lastImportDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}

          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <span style={{ fontSize: '16px' }}>📅</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <button onClick={handleSignOut} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '14px' }}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ background: 'rgba(30, 27, 56, 0.5)', padding: '8px 24px', display: 'flex', gap: '8px' }}>
        {[
          { id: 'home', label: '🏠 Home' },
          { id: 'budget', label: '💰 Budget' },
          { id: 'bills', label: '📅 Bills' },
          { id: 'goals', label: '🎯 Goals' },
          { id: 'import', label: '📂 Import' },
          { id: 'transactions', label: '📋 Transactions' },
          { id: 'settings', label: '⚙️ Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '400'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {activeTab === 'home' && (
          <HomeTab 
            transactions={transactions}
            goals={goals}
            onNavigateToImport={() => setActiveTab('import')}
          />
        )}
        {activeTab === 'budget' && (
          <BudgetTab 
            transactions={transactions}
            onNavigateToImport={() => setActiveTab('import')}
          />
        )}
        {activeTab === 'bills' && <BillsCalendarView />}
        {activeTab === 'goals' && (
          <GoalsTab 
            goals={goals}
            onUpdateGoals={onUpdateGoals}
          />
        )}
        {activeTab === 'import' && (
          <ImportTab 
            onImport={onImportTransactions}
            parseCSV={parseCSV}
            transactionCount={transactions.length}
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionsTab 
            transactions={transactions}
            onNavigateToImport={() => setActiveTab('import')}
          />
        )}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* AI Assistant Button */}
      <button
        onClick={() => setShowAIChat(true)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          border: 'none', cursor: 'pointer', fontSize: '28px', color: 'white',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        🤖
      </button>

      {showAIChat && <AIAssistantModal onClose={() => setShowAIChat(false)} transactions={transactions} />}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ============================================================================
// GOALS TAB
// ============================================================================

function GoalsTab({ goals, onUpdateGoals }) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '', emoji: '🎯', color: '#8B5CF6' });

  const emojiOptions = ['🎯', '🏠', '🚗', '✈️', '💰', '🛡️', '📚', '💎', '🎓', '👶', '💍', '🏖️'];
  const colorOptions = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    
    const goal = {
      id: Date.now(),
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current) || 0,
      emoji: newGoal.emoji,
      color: newGoal.color
    };
    
    onUpdateGoals([...goals, goal]);
    setNewGoal({ name: '', target: '', current: '', emoji: '🎯', color: '#8B5CF6' });
    setShowAddGoal(false);
  };

  const updateGoalProgress = (goalId, newCurrent) => {
    onUpdateGoals(goals.map(g => 
      g.id === goalId ? { ...g, current: parseFloat(newCurrent) || 0 } : g
    ));
  };

  const deleteGoal = (goalId) => {
    onUpdateGoals(goals.filter(g => g.id !== goalId));
  };

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600' }}>🎯 Financial Goals</h2>
        <button
          onClick={() => setShowAddGoal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          + Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No goals set yet"
          message="Create your first financial goal to start tracking your progress!"
          actionLabel="+ Create Goal"
          onAction={() => setShowAddGoal(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {goals.map(goal => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            const remaining = goal.target - goal.current;
            
            return (
              <div
                key={goal.id}
                style={{
                  background: 'rgba(30, 27, 56, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{goal.emoji}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '18px' }}>{goal.name}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    padding: '6px 12px', 
                    background: `${goal.color}20`, 
                    borderRadius: '8px',
                    color: goal.color,
                    fontWeight: '600'
                  }}>
                    {percentage.toFixed(0)}%
                  </div>
                </div>

                <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ 
                    width: `${percentage}%`, 
                    height: '100%', 
                    background: goal.color,
                    borderRadius: '6px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                    {formatCurrency(remaining)} to go
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      placeholder="Update"
                      onBlur={(e) => updateGoalProgress(goal.id, e.target.value)}
                      style={{
                        width: '80px',
                        padding: '6px 10px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '12px'
                      }}
                    />
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#EF4444',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddGoal(false)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '32px', width: '400px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>🎯 Create New Goal</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Emoji</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {emojiOptions.map(emoji => (
                  <button key={emoji} onClick={() => setNewGoal({ ...newGoal, emoji })} style={{ width: '40px', height: '40px', borderRadius: '10px', border: newGoal.emoji === emoji ? '2px solid #8B5CF6' : 'none', background: newGoal.emoji === emoji ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.1)', fontSize: '20px', cursor: 'pointer' }}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Color</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {colorOptions.map(color => (
                  <button key={color} onClick={() => setNewGoal({ ...newGoal, color })} style={{ width: '32px', height: '32px', borderRadius: '8px', border: newGoal.color === color ? '3px solid white' : 'none', background: color, cursor: 'pointer' }} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Goal Name</label>
              <input value={newGoal.name} onChange={e => setNewGoal({ ...newGoal, name: e.target.value })} placeholder="e.g., Emergency Fund" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Target Amount ($)</label>
              <input type="number" value={newGoal.target} onChange={e => setNewGoal({ ...newGoal, target: e.target.value })} placeholder="10000" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Current Progress ($)</label>
              <input type="number" value={newGoal.current} onChange={e => setNewGoal({ ...newGoal, current: e.target.value })} placeholder="0" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowAddGoal(false)} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={addGoal} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Create Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// IMPORT TAB
// ============================================================================

function ImportTab({ onImport, parseCSV, transactionCount }) {
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    
    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const transactions = parseCSV(text);
      
      if (transactions.length > 0) {
        onImport(transactions);
        setImportResult({ success: true, count: transactions.length });
      } else {
        setImportResult({ success: false, error: 'No valid transactions found in file' });
      }
    } catch (error) {
      setImportResult({ success: false, error: error.message });
    }
    
    setImporting(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>📂 Import Data</h2>

      {/* Current Status */}
      <div style={{ 
        background: 'rgba(30, 27, 56, 0.8)', 
        borderRadius: '16px', 
        padding: '20px', 
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Current Data</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>
            {transactionCount.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(255,255,255,0.6)' }}>transactions</span>
          </div>
        </div>
        {transactionCount > 0 && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '8px 16px', borderRadius: '8px', fontSize: '14px' }}>
            ✓ Data loaded
          </div>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: dragOver ? 'rgba(139, 92, 246, 0.2)' : 'rgba(30, 27, 56, 0.5)',
          border: `2px dashed ${dragOver ? '#8B5CF6' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: '20px',
          padding: '60px 40px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginBottom: '24px'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {importing ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Importing...</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Drop your CSV file here
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
              or click to browse
            </div>
            <div style={{ 
              display: 'inline-block',
              padding: '10px 24px', 
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', 
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Select File
            </div>
          </>
        )}
      </div>

      {/* Import Result */}
      {importResult && (
        <div style={{
          background: importResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${importResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px'
        }}>
          {importResult.success ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10B981' }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <div>
                <div style={{ fontWeight: '600' }}>Import Successful!</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>{importResult.count.toLocaleString()} transactions imported</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444' }}>
              <span style={{ fontSize: '24px' }}>❌</span>
              <div>
                <div style={{ fontWeight: '600' }}>Import Failed</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>{importResult.error}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Supported Format */}
      <div style={{ 
        background: 'rgba(30, 27, 56, 0.8)', 
        borderRadius: '16px', 
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>📋 Supported CSV Format</h3>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '12px' }}>Your CSV should have these columns:</p>
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '8px', 
            padding: '12px 16px',
            fontFamily: 'monospace',
            fontSize: '13px',
            overflowX: 'auto'
          }}>
            Date, Description, Original Description, Category, Amount, Status
          </div>
          <p style={{ marginTop: '12px', color: 'rgba(255,255,255,0.5)' }}>
            Tip: Most banks allow you to export transactions as CSV. Look for "Export" or "Download" in your bank's transaction history.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SETTINGS TAB
// ============================================================================

function SettingsTab() {
  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>⚙️ Settings</h2>
      
      <div style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
        {[
          { icon: '🔗', title: 'Connected Accounts', desc: 'Manage your bank connections' },
          { icon: '👨‍👩‍👧‍👦', title: 'Family Members', desc: 'Invite family to collaborate' },
          { icon: '🔔', title: 'Notifications', desc: 'Bill reminders & alerts' },
          { icon: '🎨', title: 'Appearance', desc: 'Theme & display options' },
          { icon: '🔒', title: 'Security', desc: 'Password & 2FA settings' },
          { icon: '📤', title: 'Export Data', desc: 'Download your financial data' }
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '24px' }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: '600' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{item.desc}</div>
              </div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// AI ASSISTANT MODAL
// ============================================================================

function AIAssistantModal({ onClose, transactions }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 👋 I'm your Family Finance AI assistant. I can help you analyze your spending, find insights, and answer questions about your finances. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    setTimeout(() => {
      let response = "I'd be happy to help with that! ";
      const lower = userMessage.toLowerCase();

      if (transactions.length === 0) {
        response = "📂 I don't see any transaction data yet. Please import your bank CSV file first, then I can help you analyze your spending patterns, track expenses, and provide personalized insights!";
      } else if (lower.includes('spending') || lower.includes('spent')) {
        const totalSpent = transactions.filter(t => parseFloat(t.amount) < 0).reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
        response = `💸 Based on your imported data, you've spent a total of ${formatCurrency(totalSpent)} across ${transactions.filter(t => parseFloat(t.amount) < 0).length} transactions.`;
      } else if (lower.includes('income') || lower.includes('earned')) {
        const totalIncome = transactions.filter(t => parseFloat(t.amount) > 0).reduce((sum, t) => sum + parseFloat(t.amount), 0);
        response = `💰 Your total income from imported transactions is ${formatCurrency(totalIncome)}.`;
      } else if (lower.includes('categor')) {
        const categories = {};
        transactions.filter(t => parseFloat(t.amount) < 0).forEach(t => {
          const cat = t.category || 'Uncategorized';
          categories[cat] = (categories[cat] || 0) + Math.abs(parseFloat(t.amount));
        });
        const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5);
        response = `📊 Your top spending categories:\n\n${sorted.map(([cat, amount], i) => `${i + 1}. ${cat}: ${formatCurrency(amount)}`).join('\n')}`;
      } else {
        response = `Based on your ${transactions.length} imported transactions, I can help you:\n\n• Analyze spending patterns\n• Track income vs expenses\n• View category breakdowns\n• Find savings opportunities\n\nWhat would you like to explore?`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div style={{ background: 'rgba(30, 27, 56, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '24px', width: '90%', maxWidth: '600px', maxHeight: '80vh', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🤖</span>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>AI Financial Assistant</h3>
              <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>Powered by your data</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: '16px', background: msg.role === 'user' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.08)', color: 'white', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '12px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your finances..."
            style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' }}
          />
          <button onClick={sendMessage} disabled={loading} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE COMPONENT (inline for this file)
// ============================================================================

function EmptyState({ icon = '📊', title = 'No data yet', message = 'Import your transactions to get started', actionLabel = null, onAction = null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center', background: 'rgba(30, 27, 56, 0.5)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.2)' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.8 }}>{icon}</div>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '300px', lineHeight: 1.5, marginBottom: actionLabel ? '24px' : '0' }}>{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
