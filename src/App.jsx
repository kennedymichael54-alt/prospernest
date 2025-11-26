import React, { useState, useEffect, useRef } from 'react';
// ADD THESE IMPORTS HERE:
import GoalsWithPercentage from './components/GoalsWithPercentage';
import BudgetTab from './components/BudgetTab';
import BillsCalendarView from './components/BillsCalendarView';
import GoalsTimelineWithCelebration from './components/GoalsTimelineWithCelebration';
import DataUploadSystem from './components/DataUploadSystem';

// ============================================================================
// FAMILY FINANCE - COMPREHENSIVE APP WITH FULL DASHBOARD FUNCTIONALITY
// ============================================================================

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
// SAMPLE DATA - Ready for real data connection
// ============================================================================

const generateSampleData = () => {
  const today = new Date();
  
  return {
    // Net Worth Data
    netWorth: {
      total: 285420,
      change: 12.4,
      lastMonth: 254100,
      hidden: false,
      breakdown: {
        assets: 342500,
        liabilities: 57080
      }
    },
    
    // Cash Flow Data
    cashFlow: {
      income: 8500,
      expenses: 5554,
      net: 2946,
      breakdown: {
        salary: 7200,
        investments: 850,
        other: 450
      }
    },
    
    // Budget Data
    budget: {
      spent: 4247,
      total: 5500,
      percentage: 77.2,
      status: 'good', // good, warning, danger
      categories: [
        { name: 'Housing', emoji: '🏠', spent: 1850, budget: 1900, color: '#8B5CF6' },
        { name: 'Food', emoji: '🍔', spent: 620, budget: 600, color: '#EC4899' },
        { name: 'Transport', emoji: '🚗', spent: 380, budget: 400, color: '#10B981' },
        { name: 'Shopping', emoji: '🛍️', spent: 445, budget: 400, color: '#F59E0B' },
        { name: 'Entertainment', emoji: '🎬', spent: 180, budget: 250, color: '#6366F1' },
        { name: 'Utilities', emoji: '💡', spent: 220, budget: 250, color: '#14B8A6' },
        { name: 'Health', emoji: '🏥', spent: 150, budget: 200, color: '#EF4444' },
        { name: 'Other', emoji: '📦', spent: 402, budget: 500, color: '#94A3B8' }
      ]
    },
    
    // Bills Data
    bills: [
      { id: 1, name: 'Rent', amount: 1850, dueDate: new Date(today.getFullYear(), today.getMonth(), 1), status: 'paid', emoji: '🏠' },
      { id: 2, name: 'Electric', amount: 145, dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), status: 'overdue', emoji: '⚡' },
      { id: 3, name: 'Internet', amount: 79, dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), status: 'upcoming', emoji: '📶' },
      { id: 4, name: 'Car Insurance', amount: 156, dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), status: 'upcoming', emoji: '🚗' },
      { id: 5, name: 'Netflix', amount: 15.99, dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8), status: 'upcoming', emoji: '📺' },
      { id: 6, name: 'Phone', amount: 85, dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12), status: 'upcoming', emoji: '📱' }
    ],
    
    // Recent Transactions
    transactions: [
      { id: 1, name: 'Grocery Store', amount: -127.43, date: today, category: 'Food', emoji: '🛒' },
      { id: 2, name: 'Salary Deposit', amount: 4250, date: new Date(today.getTime() - 86400000), category: 'Income', emoji: '💰' },
      { id: 3, name: 'Netflix', amount: -15.99, date: new Date(today.getTime() - 86400000 * 2), category: 'Entertainment', emoji: '📺' },
      { id: 4, name: 'Gas Station', amount: -45.20, date: new Date(today.getTime() - 86400000 * 3), category: 'Transport', emoji: '⛽' },
      { id: 5, name: 'Amazon', amount: -89.99, date: new Date(today.getTime() - 86400000 * 4), category: 'Shopping', emoji: '📦' },
      { id: 6, name: 'Coffee Shop', amount: -6.50, date: new Date(today.getTime() - 86400000 * 4), category: 'Food', emoji: '☕' },
      { id: 7, name: 'Uber', amount: -24.00, date: new Date(today.getTime() - 86400000 * 5), category: 'Transport', emoji: '🚕' },
      { id: 8, name: 'Freelance Payment', amount: 850, date: new Date(today.getTime() - 86400000 * 6), category: 'Income', emoji: '💻' }
    ],
    
    // Goals
    goals: [
      { id: 1, name: 'Emergency Fund', emoji: '🛡️', current: 12500, target: 15000, color: '#10B981' },
      { id: 2, name: 'Vacation', emoji: '✈️', current: 2800, target: 5000, color: '#8B5CF6' },
      { id: 3, name: 'New Car', emoji: '🚗', current: 8500, target: 25000, color: '#EC4899' },
      { id: 4, name: 'Home Down Payment', emoji: '🏠', current: 45000, target: 80000, color: '#F59E0B' }
    ],
    
    // Retirement
    retirement: {
      total: 125840,
      goal: 1000000,
      monthlyContribution: 1500,
      projectedAge: 62,
      accounts: [
        { name: '401(k)', balance: 89500, emoji: '📈' },
        { name: 'Roth IRA', balance: 36340, emoji: '💎' }
      ]
    },
    
    // Savings Rate
    savingsRate: {
      current: 34.7,
      target: 40,
      fireTimeline: '18 years'
    },
    
    // AI Insights
    insights: [
      { id: 1, type: 'tip', emoji: '💡', message: 'Your savings rate is 34.7% - aim for 40% to reach FIRE in 15 years!' },
      { id: 2, type: 'warning', emoji: '⚠️', message: 'Food spending is 3% over budget this month' },
      { id: 3, type: 'success', emoji: '🎉', message: 'You\'ve saved $2,946 this month - great job!' },
      { id: 4, type: 'alert', emoji: '😤', message: 'Electric bill is 2 days overdue!' }
    ]
  };
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(generateSampleData());

  useEffect(() => {
    const init = async () => {
      const sb = await initSupabase();
      if (sb) {
        const { data: { session } } = await sb.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setView('dashboard');
        }
        sb.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            setUser(session.user);
            setView('dashboard');
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
  if (view === 'dashboard') return <Dashboard user={user} setView={setView} data={data} setData={setData} />;
  return <LandingPage setView={setView} />;
}

// ============================================================================
// LANDING PAGE
// ============================================================================

function LandingPage({ setView }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState('home');

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
        <section id="features" style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px' }}>Everything Your Family Needs</h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)' }}>Purpose-built tools for modern family finances</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* HomeBudget Hub - Most Popular */}
            <div 
              onClick={() => setSelectedHub('home')}
              style={{ 
                position: 'relative', 
                background: selectedHub === 'home' ? 'rgba(30, 27, 56, 0.9)' : 'rgba(30, 27, 56, 0.8)', 
                backdropFilter: 'blur(20px)', 
                borderRadius: '24px', 
                padding: '32px', 
                border: selectedHub === 'home' ? '2px solid rgba(139, 92, 246, 0.6)' : '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: selectedHub === 'home' ? '0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 30px rgba(139, 92, 246, 0.1)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '6px 16px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                Most Popular
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #10B981, #14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px' }}>
                🏠
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>HomeBudget Hub</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
                Track spending, manage bills, and build budgets that actually work for your family.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Automatic transaction categorization', 'Bill reminders & payment tracking', 'Family spending insights', 'Goal setting & progress tracking'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    <span style={{ color: '#10B981' }}>✓</span> {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* BusinessBudget Hub - Coming Soon */}
            <div 
              onClick={() => setSelectedHub('business')}
              style={{ 
                position: 'relative', 
                background: selectedHub === 'business' ? 'rgba(30, 27, 56, 0.7)' : 'rgba(30, 27, 56, 0.5)', 
                backdropFilter: 'blur(20px)', 
                borderRadius: '24px', 
                padding: '32px', 
                border: selectedHub === 'business' ? '2px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: selectedHub === 'business' ? '0 0 20px rgba(139, 92, 246, 0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '6px 16px', background: 'rgba(251, 191, 36, 0.2)', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#FBBF24' }}>
                Coming Soon
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px' }}>
                💼
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>BusinessBudget Hub</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
                Powerful tools for freelancers and small business owners to manage cash flow.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Cash flow forecasting', 'Expense management', 'Team access controls', 'Financial reports'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    <span style={{ color: '#10B981' }}>✓</span> {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* REAnalyzer Hub - Coming Soon */}
            <div 
              onClick={() => setSelectedHub('real-estate')}
              style={{ 
                position: 'relative', 
                background: selectedHub === 'real-estate' ? 'rgba(30, 27, 56, 0.7)' : 'rgba(30, 27, 56, 0.5)', 
                backdropFilter: 'blur(20px)', 
                borderRadius: '24px', 
                padding: '32px', 
                border: selectedHub === 'real-estate' ? '2px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: selectedHub === 'real-estate' ? '0 0 20px rgba(139, 92, 246, 0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '6px 16px', background: 'rgba(251, 191, 36, 0.2)', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#FBBF24' }}>
                Coming Soon
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #F97316, #FBBF24)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px' }}>
                🏢
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>REAnalyzer Hub</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
                Analyze real estate investments with professional-grade tools and insights.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Property analysis tools', 'Rental income tracking', 'Market comparisons', 'Equity growth tracking'].map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    <span style={{ color: '#10B981' }}>✓</span> {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
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
        <h2 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px' }}>Simple, Transparent Pricing</h2>
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
            <div style={{ fontSize: '48px', fontWeight: '700' }}>
              ${isAnnual ? '8.29' : '9.99'}<span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>/mo</span>
            </div>
            {isAnnual && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Billed $99/year</div>}
          </div>

          {/* Products */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span>🏠 HomeBudget Hub</span>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '4px 12px', borderRadius: '6px', fontSize: '13px' }}>Included</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>💼 BusinessBudget Hub</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>+$4.99/mo</span>
                <span style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Soon</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>🏢 REAnalyzer Hub</span>
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
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Frequently Asked Questions</h3>
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
// AI CHATBOT
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
    
    // Simple response logic
    let response = 'I\'d be happy to help with that! Feel free to ask me about pricing, features, or how to get started.';
    const lower = input.toLowerCase();
    
    if (lower.includes('price') || lower.includes('cost')) {
      response = '💰 Our pricing starts at $8.29/mo (billed annually) or $9.99/mo monthly. The HomeBudget Hub is included, with BusinessBudget (+$4.99) and REAnalyzer (+$6.99) coming soon as add-ons!';
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
      {/* Chat Button */}
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

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '24px', width: '340px',
          background: 'rgba(30, 27, 56, 0.95)', backdropFilter: 'blur(20px)',
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden', zIndex: 1000, boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <span style={{ fontWeight: '600', color: 'white' }}>AI Assistant</span>
          </div>

          {/* Messages */}
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

          {/* Input */}
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
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '20%', right: '30%', width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.3)', borderRadius: '50%', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '300px', height: '300px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px', padding: '20px' }}>
        {/* Back to Landing */}
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

          {/* Google Sign In */}
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
// DASHBOARD - FULL FEATURED
// ============================================================================

function Dashboard({ user, setView, data, setData }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [netWorthHidden, setNetWorthHidden] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
const [lastImportDate] = useState(new Date()); 

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
  
  {/* Right Side: Last Import + Today's Date + Sign Out */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    {/* Last Import Timestamp */}
    <div style={{ 
      fontSize: '13px', 
      color: 'rgba(255,255,255,0.6)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      <span style={{ fontSize: '16px' }}>📥</span>
      <span>Last import: {lastImportDate.toLocaleDateString()} at {lastImportDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>

    {/* Today's Date */}
    <div style={{ 
      fontSize: '13px', 
      color: 'rgba(255,255,255,0.6)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '8px'
    }}>
      <span style={{ fontSize: '16px' }}>📅</span>
      <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
    </div>

    {/* Sign Out Button */}
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
{ id: 'settings', label: '⚙️ Settings'  }


      
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
        {activeTab === 'home' && <HomeTab data={data} netWorthHidden={netWorthHidden} setNetWorthHidden={setNetWorthHidden} />}
{activeTab === 'budget' && <BudgetTab />}
{activeTab === 'bills' && <BillsCalendarView />}
{activeTab === 'goals' && <GoalsTimelineWithCelebration />}
{activeTab === 'import' && <DataUploadSystem onImportComplete={(transactions) => {
  console.log('Imported:', transactions);
  alert(`Successfully imported ${transactions.length} transactions!`);
}} />}
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
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 6px 30px rgba(139, 92, 246, 0.6)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
  }}
>
  🤖
</button>

      {/* AI Assistant Modal */}
{showAIChat && <AIAssistantModal onClose={() => setShowAIChat(false)} data={data} />}

      <style>{`
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  
  /* NEW ANIMATIONS FOR ENHANCED FEATURES */
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes confetti {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes bounce-in {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-shimmer { animation: shimmer 2s infinite; }
  .animate-confetti { animation: confetti linear forwards; }
  .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
  .animate-spin-slow { animation: spin-slow 2s linear infinite; }
`}</style>
    </div>
  );
}

// ============================================================================
// HOME TAB
// ============================================================================

function HomeTab({ data, netWorthHidden, setNetWorthHidden }) {
  const formatCurrency = (val) => netWorthHidden ? '••••••' : `$${val.toLocaleString()}`;
  
  const getBudgetColor = (pct) => {
    if (pct < 70) return '#10B981';
    if (pct < 90) return '#FBBF24';
    return '#EF4444';
  };

  const getBudgetStatus = (pct) => {
    if (pct < 70) return { emoji: '✨', text: 'On track!' };
    if (pct < 90) return { emoji: '⚠️', text: 'Watch spending' };
    return { emoji: '😤', text: 'Slow down!' };
  };

  const status = getBudgetStatus(data.budget.percentage);

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>

      
      {/* TOP SECTION - Hero Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>

        
        {/* Net Worth Card */}
        <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>💰 Net Worth</span>
            <button onClick={() => setNetWorthHidden(!netWorthHidden)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: 'white', fontSize: '12px' }}>
              {netWorthHidden ? '👁️' : '🙈'}
            </button>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>{formatCurrency(data.netWorth.total)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: 'rgba(16, 185, 129, 0.3)', color: '#10B981', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
              ↑ {data.netWorth.change}%
            </span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>vs last month</span>
          </div>
        </div>

        {/* Cash Flow Card */}
        <div style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>📊 Monthly Cash Flow</div>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px', color: data.cashFlow.net >= 0 ? '#10B981' : '#EF4444' }}>
            {data.cashFlow.net >= 0 ? '+' : ''}{formatCurrency(data.cashFlow.net)}
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <span><span style={{ color: '#10B981' }}>●</span> In: {formatCurrency(data.cashFlow.income)}</span>
            <span><span style={{ color: '#EF4444' }}>●</span> Out: {formatCurrency(data.cashFlow.expenses)}</span>
          </div>
        </div>

        {/* Budget Ring Card */}
        <div style={{ background: 'linear-gradient(135deg, #EC4899, #F472B6)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>🎯 Budget Ring</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Circular Progress */}
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <circle 
                  cx="18" cy="18" r="15.9" fill="none" 
                  stroke={getBudgetColor(data.budget.percentage)}
                  strokeWidth="3"
                  strokeDasharray={`${data.budget.percentage}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700' }}>
                {Math.round(data.budget.percentage)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>{status.emoji} {status.text}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>${data.budget.spent.toLocaleString()} of ${data.budget.total.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION - Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Upcoming Bills */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>📅</span>
            <span style={{ fontWeight: '600' }}>Upcoming Bills</span>
          </div>
          {data.bills.filter(b => b.status !== 'paid').slice(0, 4).map(bill => {
            const isOverdue = bill.status === 'overdue';
            const daysUntil = Math.ceil((bill.dueDate - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <div key={bill.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '8px', border: isOverdue ? '1px solid rgba(239, 68, 68, 0.3)' : 'none', animation: isOverdue ? 'pulse 2s infinite' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{bill.emoji}</span>
                  <div>
                    <div style={{ fontWeight: '500' }}>{bill.name}</div>
                    <div style={{ fontSize: '12px', color: isOverdue ? '#EF4444' : 'rgba(255,255,255,0.5)' }}>
                      {isOverdue ? '😤 Overdue!' : `${daysUntil} days`}
                    </div>
                  </div>
                </div>
                <span style={{ fontWeight: '600' }}>${bill.amount}</span>
              </div>
            );
          })}
          <div style={{ textAlign: 'center', padding: '8px', color: '#8B5CF6', fontSize: '14px', cursor: 'pointer' }}>
            Due this week: ${data.bills.filter(b => b.status === 'upcoming').slice(0, 3).reduce((a, b) => a + b.amount, 0).toFixed(2)}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>💳</span>
            <span style={{ fontWeight: '600' }}>Recent Activity</span>
          </div>
          {data.transactions.slice(0, 5).map(tx => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{tx.emoji}</span>
                <div>
                  <div style={{ fontWeight: '500' }}>{tx.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{tx.category}</div>
                </div>
              </div>
              <span style={{ fontWeight: '600', color: tx.amount >= 0 ? '#10B981' : 'white' }}>
                {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>✨</span>
            <span style={{ fontWeight: '600' }}>AI Insights</span>
          </div>
          {data.insights.map(insight => (
            <div key={insight.id} style={{ padding: '12px', background: insight.type === 'warning' ? 'rgba(251, 191, 36, 0.1)' : insight.type === 'alert' ? 'rgba(239, 68, 68, 0.1)' : insight.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', marginBottom: '8px', fontSize: '14px', lineHeight: 1.5 }}>
              <span style={{ marginRight: '8px' }}>{insight.emoji}</span>
              {insight.message}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION - Snapshots */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        
        {/* Retirement */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <span style={{ fontWeight: '600' }}>Retirement</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>${data.retirement.total.toLocaleString()}</div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
              <span>Progress to ${(data.retirement.goal / 1000).toFixed(0)}K</span>
              <span>{((data.retirement.total / data.retirement.goal) * 100).toFixed(1)}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(data.retirement.total / data.retirement.goal) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #F97316, #FBBF24)', borderRadius: '4px' }} />
            </div>
          </div>
          {data.retirement.accounts.map((acc, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}>
              <span>{acc.emoji} {acc.name}</span>
              <span style={{ fontWeight: '600' }}>${acc.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Goals */}
<div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
    <span style={{ fontSize: '20px' }}>🎯</span>
    <span style={{ fontWeight: '600' }}>Goals</span>
  </div>
  <GoalsWithPercentage goals={data.goals} />
</div>

        
        {/* Savings Rate */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>💎</span>
            <span style={{ fontWeight: '600' }}>Savings Rate</span>
          </div>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {data.savingsRate.current}%
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
              Target: {data.savingsRate.target}%
            </div>
          </div>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>🔥 FIRE Timeline</div>
            <div style={{ fontSize: '24px', fontWeight: '600', marginTop: '4px' }}>{data.savingsRate.fireTimeline}</div>
          </div>
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
// ADD MODAL
// ============================================================================

function AddModal({ onClose, data, setData }) {
  const [type, setType] = useState('transaction');
  const [form, setForm] = useState({ name: '', amount: '', category: 'Food', emoji: '🛒' });

  const categories = [
    { name: 'Food', emoji: '🍔' },
    { name: 'Transport', emoji: '🚗' },
    { name: 'Shopping', emoji: '🛍️' },
    { name: 'Entertainment', emoji: '🎬' },
    { name: 'Housing', emoji: '🏠' },
    { name: 'Utilities', emoji: '💡' },
    { name: 'Health', emoji: '🏥' },
    { name: 'Income', emoji: '💰' }
  ];

  const handleAdd = () => {
    if (!form.name || !form.amount) return;
    
    const amount = parseFloat(form.amount);
    const isIncome = form.category === 'Income';
    
    setData(prev => ({
      ...prev,
      transactions: [
        { id: Date.now(), name: form.name, amount: isIncome ? amount : -amount, date: new Date(), category: form.category, emoji: form.emoji },
        ...prev.transactions
      ]
    }));
    
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }} onClick={onClose}>
      <div style={{ background: 'rgba(30, 27, 56, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '32px', width: '400px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: 'white' }}>➕ Add Transaction</h3>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Description</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Grocery Store" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Amount</label>
          <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {categories.map(cat => (
              <button key={cat.name} onClick={() => setForm({ ...form, category: cat.name, emoji: cat.emoji })} style={{ padding: '12px 8px', background: form.category === cat.name ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '15px' }}>Cancel</button>
          <button onClick={handleAdd} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// AI ASSISTANT MODAL
// ============================================================================

function AIAssistantModal({ onClose, data }) {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hi! 👋 I'm your Family Finance AI assistant. I can help you:\n\n• Analyze your spending patterns\n• Suggest budget optimizations\n• Answer questions about your finances\n• Provide insights on your goals\n• Help track bills and payments\n\nWhat would you like to know?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      let response = "I'd be happy to help with that! ";
      const lower = userMessage.toLowerCase();

      // Context-aware responses based on user's data
      if (lower.includes('budget') || lower.includes('spending')) {
        const totalSpent = data.budget.spent;
        const totalBudget = data.budget.total;
        const pct = ((totalSpent / totalBudget) * 100).toFixed(1);
        response = `Based on your current data:\n\n💰 You've spent $${totalSpent.toLocaleString()} of your $${totalBudget.toLocaleString()} budget (${pct}%).\n\n`;
        
        // Find over-budget categories
        const overBudget = data.budget.categories.filter(c => c.spent > c.budget);
        if (overBudget.length > 0) {
          response += `⚠️ You're over budget in ${overBudget.length} ${overBudget.length === 1 ? 'category' : 'categories'}:\n`;
          overBudget.forEach(c => {
            response += `• ${c.emoji} ${c.name}: $${c.spent} / $${c.budget} (+$${(c.spent - c.budget).toFixed(0)})\n`;
          });
          response += '\n💡 Tip: Consider reducing spending in these areas next month.';
        } else {
          response += '✨ Great job! All categories are within budget.';
        }
      } else if (lower.includes('bill') || lower.includes('payment')) {
        const overdue = data.bills.filter(b => b.status === 'overdue');
        const upcoming = data.bills.filter(b => b.status === 'upcoming');
        
        response = `📅 Bill Status:\n\n`;
        if (overdue.length > 0) {
          response += `😤 ${overdue.length} overdue ${overdue.length === 1 ? 'bill' : 'bills'}:\n`;
          overdue.forEach(b => response += `• ${b.emoji} ${b.name}: $${b.amount}\n`);
          response += '\n';
        }
        response += `📌 ${upcoming.length} upcoming ${upcoming.length === 1 ? 'bill' : 'bills'} (total: $${upcoming.reduce((sum, b) => sum + b.amount, 0).toFixed(2)})\n\n`;
        response += overdue.length > 0 ? '⚡ Priority: Pay overdue bills first!' : '✅ You\'re all caught up!';
      } else if (lower.includes('goal') || lower.includes('saving')) {
        const goals = data.goals;
        const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
        const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
        const overallPct = ((totalSaved / totalTarget) * 100).toFixed(1);
        
        response = `🎯 Goals Progress:\n\n`;
        response += `Overall: $${totalSaved.toLocaleString()} / $${totalTarget.toLocaleString()} (${overallPct}%)\n\n`;
        goals.forEach(g => {
          const pct = ((g.current / g.target) * 100).toFixed(0);
          const status = pct >= 100 ? '✅' : pct >= 75 ? '🟢' : pct >= 50 ? '🟡' : '🔴';
          response += `${status} ${g.emoji} ${g.name}: ${pct}%\n`;
        });
        
        const nextGoal = goals.filter(g => (g.current / g.target) < 1).sort((a, b) => (b.current / b.target) - (a.current / a.target))[0];
        if (nextGoal) {
          const remaining = nextGoal.target - nextGoal.current;
          response += `\n💡 Focus: You're closest to completing ${nextGoal.emoji} ${nextGoal.name} (only $${remaining.toLocaleString()} to go!)`;
        }
      } else if (lower.includes('insight') || lower.includes('tip')) {
        response = `💡 Smart Insights:\n\n`;
        response += `📊 Your savings rate is ${data.savingsRate.current}% (target: ${data.savingsRate.target}%)\n`;
        response += `🔥 At this rate, you'll reach FIRE in ${data.savingsRate.fireTimeline}\n\n`;
        response += `✨ Quick wins:\n`;
        response += `• Increase savings by ${data.savingsRate.target - data.savingsRate.current}% to hit your target\n`;
        response += `• This month's surplus: $${data.cashFlow.net.toLocaleString()}\n`;
        response += `• Consider allocating to your closest goal: ${data.goals[0].emoji} ${data.goals[0].name}`;
      } else if (lower.includes('net worth') || lower.includes('wealth')) {
        response = `💰 Net Worth Analysis:\n\n`;
        response += `Current: $${data.netWorth.total.toLocaleString()}\n`;
        response += `Change: +${data.netWorth.change}% (vs last month)\n\n`;
        response += `📈 Breakdown:\n`;
        response += `• Assets: $${data.netWorth.breakdown.assets.toLocaleString()}\n`;
        response += `• Liabilities: -$${data.netWorth.breakdown.liabilities.toLocaleString()}\n\n`;
        response += `🎯 You're building wealth! Keep it up!`;
      } else {
        response += "I can help you with:\n\n";
        response += "• Budget analysis ('How's my budget?')\n";
        response += "• Bill tracking ('What bills are due?')\n";
        response += "• Goal progress ('How are my goals?')\n";
        response += "• Smart insights ('Give me tips')\n";
        response += "• Net worth tracking ('What's my net worth?')\n\n";
        response += "What would you like to explore?";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,0.8)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 1001,
        backdropFilter: 'blur(8px)'
      }} 
      onClick={onClose}
    >
      <div 
        style={{ 
          background: 'rgba(30, 27, 56, 0.98)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '24px', 
          width: '90%', 
          maxWidth: '600px',
          maxHeight: '80vh',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '20px 24px', 
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🤖</span>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>
                AI Financial Assistant
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Powered by your data
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              color: 'white', 
              fontSize: '20px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px'
        }}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              style={{ 
                display: 'flex', 
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'slideIn 0.3s ease'
              }}
            >
              <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: msg.role === 'user' 
                  ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' 
                  : 'rgba(255,255,255,0.08)',
                color: 'white',
                fontSize: '14px',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '14px'
              }}>
                <span style={{ animation: 'pulse 1.5s infinite' }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about your finances..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
            />
            <button 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{ 
                padding: '12px 24px', 
                background: loading || !input.trim() 
                  ? 'rgba(139, 92, 246, 0.3)'
                  : 'linear-gradient(135deg, #8B5CF6, #EC4899)', 
                border: 'none', 
                borderRadius: '12px', 
                color: 'white', 
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              Send →
            </button>
          </div>
          <p style={{ 
            fontSize: '11px', 
            color: 'rgba(255,255,255,0.4)', 
            margin: '8px 0 0 0',
            textAlign: 'center'
          }}>
            💡 Try: "How's my budget?" or "What bills are due?"
          </p>
        </div>
      </div>
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
