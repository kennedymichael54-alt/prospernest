import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================
// CONFIGURATION - Replace with your values
// ============================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// LOGO COMPONENT - Family Tree (Purple/White)
// ============================================
const HomeBuddyLogo = ({ size = 40, onClick, className = '' }) => {
  const handleClick = () => {
    // Haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    if (onClick) onClick();
  };

  return (
    <div 
      onClick={handleClick}
      className={`logo-container ${className}`}
      style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : 'img'}
      aria-label="HomeBuddy - Return to Home"
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Purple circle background */}
        <circle cx="50" cy="50" r="48" fill="url(#purpleGradient)" />
        
        {/* Tree trunk */}
        <path 
          d="M50 85 L50 55" 
          stroke="white" 
          strokeWidth="4" 
          strokeLinecap="round"
        />
        
        {/* Tree branches */}
        <path 
          d="M50 55 L35 42 M50 55 L65 42 M50 48 L40 38 M50 48 L60 38" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
        
        {/* Tree crown / leaves (abstract family representation) */}
        <circle cx="35" cy="35" r="10" fill="white" opacity="0.95" />
        <circle cx="65" cy="35" r="10" fill="white" opacity="0.95" />
        <circle cx="50" cy="25" r="12" fill="white" opacity="0.95" />
        <circle cx="42" cy="42" r="8" fill="white" opacity="0.9" />
        <circle cx="58" cy="42" r="8" fill="white" opacity="0.9" />
        
        {/* Family figures (simplified) */}
        <circle cx="35" cy="33" r="4" fill="#7C3AED" /> {/* Left person head */}
        <circle cx="65" cy="33" r="4" fill="#7C3AED" /> {/* Right person head */}
        <circle cx="50" cy="23" r="4.5" fill="#7C3AED" /> {/* Center/top person head */}
        
        {/* Small hearts connecting family */}
        <path 
          d="M48 35 C48 33 50 32 50 34 C50 32 52 33 52 35 L50 38 Z" 
          fill="#EC4899" 
          opacity="0.8"
        />
        
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ============================================
// MINI LOGO (For navigation/header)
// ============================================
const MiniLogo = ({ onClick }) => (
  <div className="mini-logo-wrapper" onClick={onClick}>
    <HomeBuddyLogo size={36} onClick={onClick} className="mini-logo" />
    <span className="logo-text">HomeBuddy</span>
  </div>
);

// ============================================
// NAVIGATION HEADER (Appears on all app pages)
// ============================================
const AppHeader = ({ onHomeClick, currentPage, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="header-left">
        <MiniLogo onClick={onHomeClick} />
      </div>
      
      <nav className="header-nav">
        <span className="current-page">{currentPage}</span>
      </nav>
      
      <div className="header-right">
        {user && (
          <div className="user-menu">
            <button 
              className="user-avatar"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="User menu"
            >
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-email">{user.email}</div>
                <button onClick={onLogout} className="dropdown-item">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

// ============================================
// LANDING PAGE
// ============================================
const LandingPage = ({ onGetStarted, onLogin }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <nav className="landing-nav">
          <MiniLogo />
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <button onClick={onLogin} className="nav-login">Log In</button>
          </div>
        </nav>

        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Trusted by 10,000+ families
          </div>
          
          <h1>Your Family's Financial Command Center</h1>
          
          <p className="hero-subtitle">
            Three powerful hubs. One simple app. Take control of your home budget, 
            track investments, and analyze real estate—all in one place.
          </p>
          
          <div className="hero-cta">
            <button onClick={onGetStarted} className="btn-primary">
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
              Watch Demo
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">$2.4B+</span>
              <span className="stat-label">Assets Tracked</span>
            </div>
            <div className="stat">
              <span className="stat-value">4.9★</span>
              <span className="stat-label">App Store</span>
            </div>
            <div className="stat">
              <span className="stat-value">256-bit</span>
              <span className="stat-label">Encryption</span>
            </div>
          </div>
        </div>

        <div className={`hero-visual ${isVisible ? 'visible' : ''}`}>
          <div className="app-preview">
            <div className="preview-screen">
              <div className="preview-header">
                <HomeBuddyLogo size={24} />
                <span>Dashboard</span>
              </div>
              <div className="preview-content">
                <div className="preview-card">
                  <span className="card-label">Net Worth</span>
                  <span className="card-value">$847,320</span>
                  <span className="card-change positive">+12.4%</span>
                </div>
                <div className="preview-chart">
                  <div className="chart-bar" style={{height: '60%'}}></div>
                  <div className="chart-bar" style={{height: '75%'}}></div>
                  <div className="chart-bar" style={{height: '45%'}}></div>
                  <div className="chart-bar" style={{height: '90%'}}></div>
                  <div className="chart-bar" style={{height: '70%'}}></div>
                  <div className="chart-bar active" style={{height: '85%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-tag">Three Powerful Hubs</span>
          <h2>Everything Your Family Needs</h2>
          <p>Purpose-built tools for modern family finances</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon home-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <h3>HomeBudget Hub</h3>
            <p>Track spending, manage bills, and build budgets that actually work for your family.</p>
            <ul className="feature-list">
              <li>Automatic transaction categorization</li>
              <li>Bill reminders & payment tracking</li>
              <li>Family spending insights</li>
              <li>Goal setting & progress tracking</li>
            </ul>
          </div>

          <div className="feature-card featured">
            <div className="featured-badge">Most Popular</div>
            <div className="feature-icon invest-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
                <polyline points="16,7 22,7 22,13"/>
              </svg>
            </div>
            <h3>Investment Hub</h3>
            <p>Monitor portfolios, track performance, and make smarter investment decisions.</p>
            <ul className="feature-list">
              <li>Real-time portfolio tracking</li>
              <li>Performance analytics</li>
              <li>Dividend tracking</li>
              <li>Tax-loss harvesting alerts</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon re-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h3>REAnalyzer Hub</h3>
            <p>Analyze properties, calculate returns, and build your real estate portfolio.</p>
            <ul className="feature-list">
              <li>Property analysis calculator</li>
              <li>Rental income tracking</li>
              <li>Market comparisons</li>
              <li>Equity growth monitoring</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <h4>Bank-Level Security</h4>
            <p>256-bit encryption, SOC 2 certified</p>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <h4>Privacy First</h4>
            <p>Your data is never sold. Ever.</p>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <h4>Real-Time Sync</h4>
            <p>13,000+ bank connections</p>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <h4>Family Sharing</h4>
            <p>Collaborate with your household</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <span className="section-tag">Simple Pricing</span>
          <h2>One Price. All Features.</h2>
          <p>No hidden fees, no upsells, no complexity</p>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">9</span>
              <span className="period">.99/mo</span>
            </div>
            <div className="price-annual">or $99/year (save 17%)</div>
          </div>
          
          <ul className="pricing-features">
            <li><span className="check">✓</span> All 3 Hubs included</li>
            <li><span className="check">✓</span> Unlimited bank connections</li>
            <li><span className="check">✓</span> Family sharing (up to 5 members)</li>
            <li><span className="check">✓</span> Real-time transaction sync</li>
            <li><span className="check">✓</span> Advanced analytics & reports</li>
            <li><span className="check">✓</span> Priority support</li>
            <li><span className="check">✓</span> Data export anytime</li>
          </ul>

          <button onClick={onGetStarted} className="btn-primary full-width">
            Start 14-Day Free Trial
          </button>
          <p className="pricing-note">No credit card required</p>
        </div>

        <div className="comparison-note">
          <p><strong>vs Monarch Money:</strong> Save $5/month while getting 3 specialized hubs instead of 1 generic tool</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <HomeBuddyLogo size={32} />
            <span>HomeBuddy</span>
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#security">Security</a>
            <a href="#support">Support</a>
          </div>
          <div className="footer-copy">
            © 2025 HomeBuddy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// ============================================
// AUTH PAGE (Login / Sign Up)
// ============================================
const AuthPage = ({ onSuccess, onBack, initialMode = 'signup' }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) onSuccess(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button onClick={onBack} className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        <div className="auth-header">
          <HomeBuddyLogo size={56} />
          <h1>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{mode === 'signup' ? 'Start your 14-day free trial' : 'Sign in to your account'}</p>
        </div>

        <button onClick={handleGoogleAuth} className="google-btn" disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleEmailAuth} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Loading...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'signup' ? (
            <p>Already have an account? <button onClick={() => setMode('login')}>Sign in</button></p>
          ) : (
            <p>Don't have an account? <button onClick={() => setMode('signup')}>Sign up</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD
// ============================================
const Dashboard = ({ user, onNavigate, onLogout, onHomeClick }) => {
  const [activeHub, setActiveHub] = useState('home');
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Checking', balance: 12450.00, type: 'bank' },
    { id: 2, name: 'Savings', balance: 35200.00, type: 'bank' },
    { id: 3, name: '401(k)', balance: 128500.00, type: 'investment' },
    { id: 4, name: 'Brokerage', balance: 45300.00, type: 'investment' },
  ]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="dashboard">
      <AppHeader 
        onHomeClick={onHomeClick}
        currentPage={activeHub === 'home' ? 'Dashboard' : `${activeHub} Hub`}
        user={user}
        onLogout={onLogout}
      />

      <div className="dashboard-content">
        {/* Hub Navigation */}
        <nav className="hub-nav">
          <button 
            className={`hub-tab ${activeHub === 'home' ? 'active' : ''}`}
            onClick={() => setActiveHub('home')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Overview
          </button>
          <button 
            className={`hub-tab ${activeHub === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveHub('budget')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            </svg>
            HomeBudget
          </button>
          <button 
            className={`hub-tab ${activeHub === 'invest' ? 'active' : ''}`}
            onClick={() => setActiveHub('invest')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
            </svg>
            Investments
          </button>
          <button 
            className={`hub-tab ${activeHub === 'reanalyzer' ? 'active' : ''}`}
            onClick={() => setActiveHub('reanalyzer')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
            </svg>
            REAnalyzer
          </button>
        </nav>

        {/* Main Content */}
        <main className="dashboard-main">
          {activeHub === 'home' && (
            <>
              <div className="welcome-card">
                <h1>Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
                <p>Here's your financial snapshot</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card primary">
                  <span className="stat-label">Total Net Worth</span>
                  <span className="stat-value">{formatCurrency(totalBalance)}</span>
                  <span className="stat-change positive">+5.2% this month</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Monthly Spending</span>
                  <span className="stat-value">{formatCurrency(4250)}</span>
                  <span className="stat-change">Budget: $5,000</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Investments</span>
                  <span className="stat-value">{formatCurrency(173800)}</span>
                  <span className="stat-change positive">+12.4% YTD</span>
                </div>
              </div>

              <div className="accounts-section">
                <h2>Linked Accounts</h2>
                <div className="accounts-list">
                  {accounts.map(account => (
                    <div key={account.id} className="account-item">
                      <div className="account-info">
                        <span className="account-name">{account.name}</span>
                        <span className="account-type">{account.type}</span>
                      </div>
                      <span className="account-balance">{formatCurrency(account.balance)}</span>
                    </div>
                  ))}
                </div>
                <button className="add-account-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                  Link New Account
                </button>
              </div>
            </>
          )}

          {activeHub === 'budget' && (
            <div className="hub-content">
              <h1>HomeBudget Hub</h1>
              <p className="hub-description">Track spending, manage bills, and build budgets that work for your family.</p>
              
              <div className="budget-overview">
                <div className="budget-ring">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8"/>
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="none" 
                      stroke="url(#budgetGradient)" 
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="62.8"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6"/>
                        <stop offset="100%" stopColor="#EC4899"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="budget-center">
                    <span className="budget-spent">$4,250</span>
                    <span className="budget-total">of $5,000</span>
                  </div>
                </div>
              </div>

              <div className="category-list">
                <h3>Spending by Category</h3>
                <div className="category-item">
                  <span className="category-name">🏠 Housing</span>
                  <span className="category-amount">$1,800</span>
                </div>
                <div className="category-item">
                  <span className="category-name">🍕 Food & Dining</span>
                  <span className="category-amount">$650</span>
                </div>
                <div className="category-item">
                  <span className="category-name">🚗 Transportation</span>
                  <span className="category-amount">$420</span>
                </div>
                <div className="category-item">
                  <span className="category-name">🛍️ Shopping</span>
                  <span className="category-amount">$380</span>
                </div>
              </div>
            </div>
          )}

          {activeHub === 'invest' && (
            <div className="hub-content">
              <h1>Investment Hub</h1>
              <p className="hub-description">Monitor portfolios, track performance, and make smarter investment decisions.</p>
              
              <div className="portfolio-summary">
                <div className="portfolio-value">
                  <span className="label">Portfolio Value</span>
                  <span className="value">{formatCurrency(173800)}</span>
                  <span className="change positive">+$19,256 (+12.4%) YTD</span>
                </div>
              </div>

              <div className="holdings-list">
                <h3>Top Holdings</h3>
                <div className="holding-item">
                  <div className="holding-info">
                    <span className="ticker">VTI</span>
                    <span className="name">Vanguard Total Stock Market</span>
                  </div>
                  <div className="holding-value">
                    <span className="amount">$65,200</span>
                    <span className="change positive">+15.2%</span>
                  </div>
                </div>
                <div className="holding-item">
                  <div className="holding-info">
                    <span className="ticker">VXUS</span>
                    <span className="name">Vanguard Total International</span>
                  </div>
                  <div className="holding-value">
                    <span className="amount">$42,100</span>
                    <span className="change positive">+8.7%</span>
                  </div>
                </div>
                <div className="holding-item">
                  <div className="holding-info">
                    <span className="ticker">BND</span>
                    <span className="name">Vanguard Total Bond Market</span>
                  </div>
                  <div className="holding-value">
                    <span className="amount">$28,500</span>
                    <span className="change negative">-2.1%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeHub === 'reanalyzer' && (
            <div className="hub-content">
              <h1>REAnalyzer Hub</h1>
              <p className="hub-description">Analyze properties, calculate returns, and build your real estate portfolio.</p>
              
              <div className="property-list">
                <div className="property-card">
                  <div className="property-header">
                    <h3>123 Main Street</h3>
                    <span className="property-type">Single Family</span>
                  </div>
                  <div className="property-stats">
                    <div className="prop-stat">
                      <span className="label">Purchase Price</span>
                      <span className="value">$385,000</span>
                    </div>
                    <div className="prop-stat">
                      <span className="label">Current Value</span>
                      <span className="value">$425,000</span>
                    </div>
                    <div className="prop-stat">
                      <span className="label">Monthly Cash Flow</span>
                      <span className="value positive">+$450</span>
                    </div>
                    <div className="prop-stat">
                      <span className="label">Cap Rate</span>
                      <span className="value">6.2%</span>
                    </div>
                  </div>
                </div>

                <button className="add-property-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                  Analyze New Property
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setPage('dashboard');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setPage('dashboard');
      } else {
        setUser(null);
        setPage('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage('landing');
  };

  const handleHomeClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    if (user) {
      setPage('dashboard');
    } else {
      setPage('landing');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <HomeBuddyLogo size={64} />
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      {page === 'landing' && (
        <LandingPage 
          onGetStarted={() => setPage('auth')}
          onLogin={() => setPage('auth-login')}
        />
      )}
      {page === 'auth' && (
        <AuthPage 
          onSuccess={(user) => {
            setUser(user);
            setPage('dashboard');
          }}
          onBack={() => setPage('landing')}
          initialMode="signup"
        />
      )}
      {page === 'auth-login' && (
        <AuthPage 
          onSuccess={(user) => {
            setUser(user);
            setPage('dashboard');
          }}
          onBack={() => setPage('landing')}
          initialMode="login"
        />
      )}
      {page === 'dashboard' && (
        <Dashboard 
          user={user}
          onLogout={handleLogout}
          onHomeClick={handleHomeClick}
        />
      )}
    </div>
  );
}
