import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
let supabase = null;
const initSupabase = async () => {
  if (supabase) return supabase;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not configured');
    return null;
  }
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabase;
  } catch (e) {
    console.error('Failed to initialize Supabase:', e);
    return null;
  }
};

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext) || { user: null, loading: true };

// ============================================
// ERROR BOUNDARY
// ============================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">FF</div>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-white/60 mb-6">We're sorry for the inconvenience.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
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
// LANDING PAGE - Apple-Style Design
// ============================================
function LandingPage({ onNavigateToAuth }) {
  const [activeProduct, setActiveProduct] = useState(0);
  const videoRef = useRef(null);

  const products = [
    {
      id: 'homebudget',
      name: 'HomeBudget Hub',
      tagline: 'Control your family\'s financial future',
      description: 'Smart budgeting, expense tracking, and financial planning designed for modern families. Build wealth together.',
      status: 'available',
      icon: '🏠',
      gradient: 'from-purple-600 to-pink-600',
      features: ['Family collaboration', 'Smart budgeting', 'Goal tracking', 'Bill reminders']
    },
    {
      id: 'businessbudget',
      name: 'BusinessBudget Hub',
      tagline: 'Your SMB command center',
      description: 'Powerful budgeting and cash flow tools for small and medium businesses. Track expenses, forecast growth, make smarter decisions.',
      status: 'coming-soon',
      icon: '💼',
      gradient: 'from-blue-600 to-cyan-500',
      features: ['Cash flow forecasting', 'Expense management', 'Team access', 'Financial reports']
    },
    {
      id: 'reanalyzer',
      name: 'REAnalyzer Hub',
      tagline: 'Smarter real estate investing',
      description: 'Analyze deals, track investments, and maximize returns. Built for agents and investors who demand precision.',
      status: 'coming-soon',
      icon: '🏢',
      gradient: 'from-emerald-600 to-teal-500',
      features: ['Deal analysis', 'ROI calculator', 'Portfolio tracking', 'Market insights']
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex flex-col">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.4)' }}
            poster="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-happy-family-having-a-picnic-in-nature-4765-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-20 w-full py-4 px-6 lg:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg lg:text-xl font-bold shadow-lg shadow-purple-500/30">
                FF
              </div>
              <div className="hidden sm:block">
                <span className="text-lg lg:text-xl font-semibold tracking-tight">Family Finance</span>
              </div>
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              <button
                onClick={() => onNavigateToAuth('login')}
                className="px-4 lg:px-5 py-2 lg:py-2.5 text-sm lg:text-base text-white/90 hover:text-white transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigateToAuth('signup')}
                className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6 border border-white/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-white/80">Join 10,000+ families building wealth</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-4xl">
            <span className="block text-white">Build wealth.</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Together.
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-white/60 mb-10 max-w-2xl leading-relaxed">
            The modern financial command center for families who want to thrive. 
            Track spending, grow savings, and achieve your dreams—all in one beautiful app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={() => onNavigateToAuth('signup')}
              className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transition-all shadow-2xl shadow-white/20"
            >
              Start 7-Day Free Trial
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all">
              Watch Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Bank-level security
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              7-day free trial
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              We never sell your data
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 pb-8 flex justify-center">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 lg:py-32 px-6 bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Our Products</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              A complete suite of financial tools for every aspect of your life
            </p>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`relative group rounded-3xl p-8 border transition-all duration-500 ${
                  index === activeProduct
                    ? 'bg-gradient-to-br ' + product.gradient + ' border-white/20 scale-105 shadow-2xl'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {product.status === 'coming-soon' && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                    Coming Soon
                  </div>
                )}

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${
                  index === activeProduct ? 'bg-white/20' : 'bg-gradient-to-br ' + product.gradient
                }`}>
                  {product.icon}
                </div>

                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className={`text-sm mb-4 ${index === activeProduct ? 'text-white/80' : 'text-purple-400'}`}>
                  {product.tagline}
                </p>
                <p className={`mb-6 ${index === activeProduct ? 'text-white/70' : 'text-white/50'}`}>
                  {product.description}
                </p>

                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2 text-sm ${index === activeProduct ? 'text-white/80' : 'text-white/50'}`}>
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {product.status === 'available' && (
                  <button
                    onClick={() => onNavigateToAuth('signup')}
                    className="mt-8 w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all"
                  >
                    Get Started Free
                  </button>
                )}

                {product.status === 'coming-soon' && (
                  <button className="mt-8 w-full py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20">
                    Join Waitlist
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Product Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveProduct(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeProduct ? 'w-8 bg-white' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Why families choose us</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Built by families, for families. We understand what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔒', title: 'Bank-Level Security', desc: '256-bit encryption protects your data. We never sell your information.' },
              { icon: '👨‍👩‍👧‍👦', title: 'Family Collaboration', desc: 'Unlimited family members. Everyone stays on the same page.' },
              { icon: '📊', title: 'Smart Insights', desc: 'AI-powered insights help you make better financial decisions.' },
              { icon: '🎯', title: 'Goal Tracking', desc: 'Set and track goals together. Celebrate wins as a family.' },
              { icon: '🏦', title: 'All Accounts', desc: 'Connect all your accounts in one place. See your complete picture.' },
              { icon: '📱', title: 'Beautiful Apps', desc: 'Native iOS, Android, and web apps. Your finances, anywhere.' },
              { icon: '🔔', title: 'Smart Alerts', desc: 'Never miss a bill. Get notified before due dates.' },
              { icon: '💬', title: '24/7 Support', desc: 'Real humans ready to help whenever you need it.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-32 px-6 bg-gradient-to-b from-black to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-white/50 text-lg mb-12">
            Less than two cups of coffee per month. Cancel anytime.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="text-sm text-white/50 mb-2">Monthly</div>
              <div className="text-4xl font-bold mb-4">$9.99<span className="text-lg text-white/50 font-normal">/mo</span></div>
              <ul className="space-y-3 text-left mb-8">
                {['Unlimited accounts', 'Family collaboration', 'All features included', 'Cancel anytime'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/70">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigateToAuth('signup')}
                className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Start Free Trial
              </button>
            </div>

            {/* Annual - Best Value */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 border border-white/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 rounded-full text-xs font-bold">
                SAVE 40%
              </div>
              <div className="text-sm text-white/80 mb-2">Annual</div>
              <div className="text-4xl font-bold mb-1">$5.99<span className="text-lg text-white/70 font-normal">/mo</span></div>
              <div className="text-sm text-white/60 mb-4">Billed $71.88 annually</div>
              <ul className="space-y-3 text-left mb-8">
                {['Everything in Monthly', '2 months free', 'Priority support', 'Early access to new features'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigateToAuth('signup')}
                className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          <p className="text-white/40 text-sm mt-8">
            7-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">
                FF
              </div>
              <span className="text-lg font-semibold">Family Finance</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
            </div>
            <div className="text-sm text-white/30">
              © 2024 Family Finance. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// AUTH PAGE - Sign In / Sign Up
// ============================================
function AuthPage({ mode = 'login', onAuth, onBack }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  const handleEmailAuth = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const client = await initSupabase();
      
      if (!client) {
        setError('Authentication service unavailable. Please try again later.');
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { data, error: authError } = await client.auth.signInWithPassword({
          email,
          password,
        });
        
        if (authError) throw authError;
        onAuth(data.user);
      } else {
        const { data, error: authError } = await client.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        
        if (authError) throw authError;
        
        if (data.user && !data.session) {
          setMessage('Check your email to confirm your account!');
        } else {
          onAuth(data.user);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      const client = await initSupabase();
      
      if (!client) {
        setError('Authentication service unavailable. Please try again later.');
        setLoading(false);
        return;
      }

      const { error: authError } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (authError) throw authError;
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold shadow-lg">
              FF
            </div>
            <span className="text-lg font-semibold hidden sm:block">Family Finance</span>
          </button>
        </div>
      </header>

      {/* Auth Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome back' : 'Start your free trial'}
            </h1>
            <p className="text-white/50">
              {isLogin ? 'Sign in to your account' : '7 days free, then $5.99/month (billed annually)'}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-200 text-sm">
                {message}
              </div>
            )}

            {/* Google Sign-in */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-white/30 text-sm">or continue with email</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="John Smith"
                  />
                </div>
              )}

              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
                className="text-white/50 hover:text-white transition-colors text-sm"
              >
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="text-purple-400 font-medium">{isLogin ? 'Sign up' : 'Sign in'}</span>
              </button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-white/30 text-xs mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-white/50 hover:text-white">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-white/50 hover:text-white">Privacy Policy</a>
          </p>
        </div>
      </main>
    </div>
  );
}

// ============================================
// MAIN DASHBOARD APP
// ============================================
function DashboardApp({ user, onSignOut }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    // Load from localStorage for now (will be Supabase later)
    const savedData = localStorage.getItem(`ff_data_${user.id}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setTransactions(data.transactions || []);
      setBills(data.bills || []);
      setAccounts(data.accounts || []);
    } else {
      // Initialize with demo data for new users
      const demoTransactions = [
        { id: 1, name: 'Grocery Store', amount: -127.43, date: '2024-11-26', category: 'Food', icon: '🛒' },
        { id: 2, name: 'Salary Deposit', amount: 4250.00, date: '2024-11-25', category: 'Income', icon: '💼' },
        { id: 3, name: 'Netflix', amount: -15.99, date: '2024-11-22', category: 'Entertainment', icon: '📺' },
        { id: 4, name: 'Gas Station', amount: -52.30, date: '2024-11-21', category: 'Transportation', icon: '⛽' },
        { id: 5, name: 'Freelance Pay', amount: 800.00, date: '2024-11-20', category: 'Income', icon: '💻' },
      ];
      const demoBills = [
        { id: 1, name: 'Mortgage', amount: 2100, dueDate: '2024-12-01', icon: '🏠' },
        { id: 2, name: 'Electric', amount: 145, dueDate: '2024-12-03', icon: '⚡' },
        { id: 3, name: 'Internet', amount: 79, dueDate: '2024-12-05', icon: '📶' },
      ];
      const demoAccounts = [
        { id: 1, name: 'Checking', balance: 8500, type: 'bank', icon: '💳' },
        { id: 2, name: 'Savings', balance: 16000, type: 'bank', icon: '🏦' },
        { id: 3, name: 'Investment', balance: 118920, type: 'investment', icon: '📈' },
        { id: 4, name: '401(k)', balance: 98000, type: 'retirement', icon: '🎯' },
        { id: 5, name: 'Roth IRA', balance: 44000, type: 'retirement', icon: '🏖️' },
      ];
      
      setTransactions(demoTransactions);
      setBills(demoBills);
      setAccounts(demoAccounts);
      
      // Save to localStorage
      localStorage.setItem(`ff_data_${user.id}`, JSON.stringify({
        transactions: demoTransactions,
        bills: demoBills,
        accounts: demoAccounts
      }));
    }
  };

  const saveUserData = (newTransactions, newBills, newAccounts) => {
    localStorage.setItem(`ff_data_${user.id}`, JSON.stringify({
      transactions: newTransactions || transactions,
      bills: newBills || bills,
      accounts: newAccounts || accounts
    }));
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';
  };

  const netWorth = accounts.reduce((sum, a) => sum + a.balance, 0);
  const monthlyIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1) : 0;

  return (
    <AuthContext.Provider value={{ user, signOut: onSignOut }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"></div>
        </div>

        {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}

        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24 lg:pb-8">
          {/* Fixed Header */}
          <header className="sticky top-0 z-30 pt-4 pb-4 bg-gradient-to-b from-slate-950 via-slate-950/95 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/30">
                  FF
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Family Finance</h1>
                  <p className="text-purple-300/70 text-sm">Welcome back, {getUserName()}!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowChatbot(true)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <span className="text-xl">🤖</span>
                </button>
                <button onClick={onSignOut} className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <span className="text-xl">🚪</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <nav className="mt-4 flex gap-1.5 p-1.5 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
                { id: 'networth', label: 'Net Worth', icon: '📈' },
                { id: 'reports', label: 'Reports', icon: '📊' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'text-purple-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </header>

          {/* Tab Content */}
          <main className="mt-6">
            {activeTab === 'dashboard' && (
              <Dashboard
                transactions={transactions}
                bills={bills}
                accounts={accounts}
                netWorth={netWorth}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                savingsRate={savingsRate}
              />
            )}
            {activeTab === 'networth' && <NetWorth accounts={accounts} netWorth={netWorth} />}
            {activeTab === 'reports' && <Reports transactions={transactions} monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} />}
            {activeTab === 'settings' && <Settings user={user} setTransactions={(t) => { setTransactions(t); saveUserData(t, null, null); }} onSignOut={onSignOut} />}
          </main>
        </div>

        {/* FAB */}
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="fixed right-4 bottom-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/40 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        >
          {showQuickActions ? '✕' : '+'}
        </button>

        {showQuickActions && (
          <div className="fixed right-4 bottom-28 z-50 flex flex-col gap-3 items-end">
            {[
              { icon: '💰', label: 'Income', color: 'from-emerald-500 to-emerald-600' },
              { icon: '🛒', label: 'Expense', color: 'from-rose-500 to-rose-600' },
            ].map((a) => (
              <button key={a.label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${a.color} shadow-lg hover:scale-105 transition-transform`}>
                <span>{a.icon}</span>
                <span className="font-semibold text-sm">{a.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

// ============================================
// DASHBOARD COMPONENT
// ============================================
function Dashboard({ transactions, bills, accounts, netWorth, monthlyIncome, monthlyExpenses, savingsRate }) {
  const budgetUsed = Math.round((monthlyExpenses / 7600) * 100);
  const fireProgress = ((netWorth / 1250000) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-600/90 to-purple-700/90 rounded-3xl p-6 border border-purple-400/20">
          <div className="flex justify-between mb-4">
            <span className="text-purple-200 text-sm font-medium">Net Worth</span>
            <span className="text-2xl">💎</span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-white">${netWorth.toLocaleString()}</div>
          <div className="text-emerald-300 text-sm mt-2">↑ 12.4% this year</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600/80 to-indigo-700/80 rounded-3xl p-6 border border-indigo-400/20">
          <div className="flex justify-between mb-4">
            <span className="text-indigo-200 text-sm font-medium">Cash Flow</span>
            <span className="text-2xl">💵</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-200/70">Income</span>
              <span className="text-emerald-300 font-medium">+${monthlyIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-200/70">Expenses</span>
              <span className="text-rose-300 font-medium">-${monthlyExpenses.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">+${(monthlyIncome - monthlyExpenses).toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-fuchsia-600/80 to-pink-600/80 rounded-3xl p-6 border border-pink-400/20">
          <div className="flex justify-between mb-4">
            <span className="text-pink-200 text-sm font-medium">Budget</span>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-white">{budgetUsed}%</div>
          <div className="text-pink-200/70 text-sm mt-1">of $7,600 monthly</div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-600/40 to-purple-600/40 rounded-3xl p-5 border border-violet-400/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🤖</span>
          <h3 className="font-semibold">AI Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm">
            <span className="mr-2">💡</span>
            Savings rate of {savingsRate}% is excellent!
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
            <span className="mr-2">⚠️</span>
            {bills.length} bills coming up this month
          </div>
        </div>
      </div>

      {/* Bills & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>📋</span>Upcoming Bills
          </h3>
          <div className="space-y-3">
            {bills.slice(0, 4).map((b) => (
              <div key={b.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-purple-300/70">{b.dueDate}</p>
                  </div>
                </div>
                <span className="font-semibold">${b.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>💳</span>Recent Transactions
          </h3>
          <div className="space-y-3">
            {transactions.slice(0, 4).map((t) => (
              <div key={t.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-purple-300/70">{t.category}</p>
                  </div>
                </div>
                <span className={t.amount > 0 ? 'text-emerald-400 font-semibold' : 'font-semibold'}>
                  {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/70 to-teal-600/70 rounded-2xl p-4 border border-emerald-400/20">
          <div className="text-emerald-200 text-xs mb-1">Savings</div>
          <div className="text-2xl font-bold">{savingsRate}%</div>
        </div>
        <div className="bg-gradient-to-br from-orange-600/70 to-amber-600/70 rounded-2xl p-4 border border-orange-400/20">
          <div className="text-orange-200 text-xs mb-1">FIRE</div>
          <div className="text-2xl font-bold">{fireProgress}%</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-600/70 to-blue-600/70 rounded-2xl p-4 border border-cyan-400/20">
          <div className="text-cyan-200 text-xs mb-1">Retire</div>
          <div className="text-2xl font-bold">$142K</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NET WORTH
// ============================================
function NetWorth({ accounts, netWorth }) {
  const assets = accounts.filter(a => a.balance > 0);
  const totalAssets = assets.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600/90 to-purple-700/90 rounded-3xl p-6 border border-purple-400/20">
        <div className="flex justify-between mb-2">
          <span className="text-purple-200">Total Net Worth</span>
          <span>💎</span>
        </div>
        <div className="text-4xl lg:text-5xl font-bold">${netWorth.toLocaleString()}</div>
      </div>

      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">📈 Assets (${totalAssets.toLocaleString()})</h3>
        <div className="space-y-3">
          {assets.map((a) => (
            <div key={a.id} className="flex justify-between items-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-emerald-300/70 capitalize">{a.type}</p>
                </div>
              </div>
              <span className="text-xl font-bold text-emerald-400">${a.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// REPORTS
// ============================================
function Reports({ transactions, monthlyIncome, monthlyExpenses }) {
  const expenses = transactions.filter(t => t.amount < 0);
  const byCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/80 to-emerald-700/80 rounded-2xl p-5 border border-emerald-400/20">
          <div className="text-emerald-200 text-sm mb-1">Income</div>
          <div className="text-2xl lg:text-3xl font-bold">${monthlyIncome.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-rose-600/80 to-rose-700/80 rounded-2xl p-5 border border-rose-400/20">
          <div className="text-rose-200 text-sm mb-1">Expenses</div>
          <div className="text-2xl lg:text-3xl font-bold">${monthlyExpenses.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">📊 By Category</h3>
        <div className="space-y-4">
          {Object.entries(byCategory).map(([cat, amt]) => (
            <div key={cat}>
              <div className="flex justify-between mb-1 text-sm">
                <span>{cat}</span>
                <span>${amt.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${(amt / monthlyExpenses) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SETTINGS
// ============================================
function Settings({ user, setTransactions, onSignOut }) {
  const [status, setStatus] = useState('');
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('Processing...');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      const newTx = [];

      for (let i = 1; i < lines.length; i++) {
        const [date, name, amount, category] = lines[i].split(',');
        if (date && name && amount) {
          newTx.push({
            id: Date.now() + i,
            date: date.trim(),
            name: name.trim(),
            amount: parseFloat(amount),
            category: category?.trim() || 'Other',
            icon: '📝'
          });
        }
      }

      setTransactions(prev => [...newTx, ...prev]);
      setStatus(`✅ Imported ${newTx.length} transactions!`);
    } catch (err) {
      setStatus('❌ Error: ' + err.message);
    }

    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">👤 Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
            {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-xl font-bold">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-purple-300/70">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Import */}
      <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-3xl p-6 border border-purple-400/30">
        <h3 className="text-xl font-bold mb-2">📤 Import Transactions</h3>
        <p className="text-purple-200/70 text-sm mb-4">Upload CSV files from your bank</p>
        
        <input ref={fileRef} type="file" accept=".csv" onChange={handleUpload} className="hidden" />
        
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-4 rounded-xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition-all"
        >
          📄 Upload CSV File
        </button>

        {status && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${
            status.includes('✅') ? 'bg-emerald-500/20 text-emerald-200' :
            status.includes('❌') ? 'bg-red-500/20 text-red-200' :
            'bg-amber-500/20 text-amber-200'
          }`}>
            {status}
          </div>
        )}

        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-purple-200 font-medium mb-2">CSV Format:</p>
          <code className="text-xs text-purple-300/70">
            date,description,amount,category<br/>
            2024-11-26,Grocery,-127.43,Food
          </code>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={onSignOut}
        className="w-full py-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-semibold hover:bg-red-500/30 transition-all"
      >
        Sign Out
      </button>
    </div>
  );
}

// ============================================
// CHATBOT
// ============================================
function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 👋 I'm your AI finance assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { role: 'user', content: input }]);

    const q = input.toLowerCase();
    let r = "I can help with importing CSV files, budgeting tips, or navigating the app!";

    if (q.includes('import') || q.includes('csv')) {
      r = "📤 Go to Settings → Upload CSV File. Format: date,description,amount,category";
    } else if (q.includes('budget')) {
      r = "📊 Your budget shows on Dashboard. Track spending by category in Reports.";
    } else if (q.includes('net worth')) {
      r = "💎 Check the Net Worth tab to see all your assets and track growth over time.";
    }

    setTimeout(() => setMessages(p => [...p, { role: 'assistant', content: r }]), 500);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-slate-900/98 border-r border-purple-500/20 flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">🤖</div>
            <span className="font-bold">AI Assistant</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-white/10 border border-white/5'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && send()}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
          />
          <button
            onClick={send}
            className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP CONTROLLER
// ============================================
function FamilyFinanceApp() {
  const [view, setView] = useState('landing'); // 'landing', 'auth', 'dashboard'
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const client = await initSupabase();
      
      if (client) {
        const { data: { session } } = await client.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setView('dashboard');
        }

        // Listen for auth changes
        client.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            setUser(session.user);
            setView('dashboard');
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setView('landing');
          }
        });
      }
    } catch (e) {
      console.error('Auth check error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToAuth = (mode) => {
    setAuthMode(mode);
    setView('auth');
  };

  const handleAuth = (authUser) => {
    setUser(authUser);
    setView('dashboard');
  };

  const handleSignOut = async () => {
    try {
      const client = await initSupabase();
      if (client) {
        await client.auth.signOut();
      }
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setUser(null);
    setView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4 animate-pulse">
            FF
          </div>
          <p className="text-white/50">Loading...</p>
        </div>
      </div>
    );
  }

  if (view === 'dashboard' && user) {
    return <DashboardApp user={user} onSignOut={handleSignOut} />;
  }

  if (view === 'auth') {
    return (
      <AuthPage
        mode={authMode}
        onAuth={handleAuth}
        onBack={() => setView('landing')}
      />
    );
  }

  return <LandingPage onNavigateToAuth={handleNavigateToAuth} />;
}

// ============================================
// CSS ANIMATIONS (inject into head)
// ============================================
const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-20px) scale(1.1); opacity: 0.6; }
}
.animate-float { animation: float 4s ease-in-out infinite; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ============================================
// EXPORT
// ============================================
export default function App() {
  return (
    <ErrorBoundary>
      <FamilyFinanceApp />
    </ErrorBoundary>
  );
}
