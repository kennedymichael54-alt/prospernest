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
import ReportsTab from './components/ReportsTab';
import RetirementTab from './components/RetirementTab';
import SalesTrackerTab from './components/SalesTrackerTab';
import ProsperNestLandingV4 from './components/ProsperNestLandingV4';
// ============================================================================
// PROSPERNEST - DASHSTACK UI DESIGN
// ============================================================================
// Theme colors - Light Mode (DashStack inspired)
const lightTheme = {
  mode: 'light',
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  
  bgMain: '#F5F6FA',
  bgWhite: '#FFFFFF',
  bgCard: '#FFFFFF',
  
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  sidebarBg: '#FFFFFF',
  sidebarActive: '#4F46E5',
  sidebarText: '#6B7280',
  sidebarActiveText: '#FFFFFF',
  
  inputBg: '#FFFFFF',
  cardShadow: '0 1px 3px rgba(0,0,0,0.05)',
  dropdownBg: '#FFFFFF',
};
// Theme colors - Dark Mode (Original purple theme)
const darkTheme = {
  mode: 'dark',
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#6D28D9',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  
  bgMain: '#0c0a1d',
  bgWhite: '#1a1230',
  bgCard: '#1e1b38',
  
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  
  border: 'rgba(139, 92, 246, 0.2)',
  borderLight: 'rgba(255,255,255,0.1)',
  
  sidebarBg: '#1a1230',
  sidebarActive: '#8B5CF6',
  sidebarText: 'rgba(255,255,255,0.6)',
  sidebarActiveText: '#FFFFFF',
  
  inputBg: 'rgba(139, 92, 246, 0.1)',
  cardShadow: '0 4px 20px rgba(0,0,0,0.3)',
  dropdownBg: '#1e1b38',
};
// Default theme (will be controlled by state)
let theme = lightTheme;
// ============================================================================
// SIDEBAR ICONS - Line style matching DashStack
// ============================================================================
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Sales: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  Budget: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  Transactions: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Goals: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Retirement: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  Reports: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Import: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  SignOut: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Filter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
};
// ============================================================================
// PENNY LOGO COMPONENT
// ============================================================================
const PennyLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFEC8B" />
        <stop offset="100%" stopColor="#DAA520" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="28" fill="url(#coinGrad)" stroke="#B8860B" strokeWidth="2"/>
    <circle cx="32" cy="32" r="22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
    <ellipse cx="24" cy="26" rx="3" ry="4" fill="#1a1a1a"/>
    <ellipse cx="40" cy="26" rx="3" ry="4" fill="#1a1a1a"/>
    <ellipse cx="25" cy="25" rx="1" ry="1.5" fill="#FFFFFF"/>
    <ellipse cx="41" cy="25" rx="1" ry="1.5" fill="#FFFFFF"/>
    <path d="M24 38 Q32 44 40 38" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="18" cy="32" rx="3" ry="2" fill="#FFB6C1" opacity="0.6"/>
    <ellipse cx="46" cy="32" rx="3" ry="2" fill="#FFB6C1" opacity="0.6"/>
  </svg>
);

// Language options
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];
// Currency formatter
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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bgMain }}>
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h1 style={{ color: theme.textPrimary }}>Something went wrong</h1>
            <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: theme.primary, border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', marginTop: '16px' }}>
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
// ============================================================================
// SUPABASE INITIALIZATION & DATABASE HELPERS
// ============================================================================
let supabase = null;
let supabaseInitPromise = null;

// Session storage keys
const SESSION_KEY = 'pn_session';
const SESSION_EXPIRY_KEY = 'pn_session_expiry';
const SESSION_BACKUP_KEY = 'pn_session_backup';

// Save session with expiry (7 days) - BULLETPROOF VERSION
const saveSession = (session) => {
  console.log('💾 [Session] saveSession called with:', session ? 'valid session' : 'null');
  
  if (!session) {
    // Clear all session storage
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      localStorage.removeItem(SESSION_BACKUP_KEY);
      console.log('🗑️ [Session] All session data cleared');
    } catch (e) {
      console.error('❌ [Session] Clear error:', e);
    }
    return;
  }
  
  try {
    const sessionStr = JSON.stringify(session);
    const expiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Save to primary location
    localStorage.setItem(SESSION_KEY, sessionStr);
    localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
    
    // Save to backup location
    localStorage.setItem(SESSION_BACKUP_KEY, sessionStr);
    
    // Verify the save worked
    const verify = localStorage.getItem(SESSION_KEY);
    if (verify) {
      console.log('✅ [Session] Saved & verified:', session.user?.email);
      console.log('   Keys saved:', SESSION_KEY, SESSION_EXPIRY_KEY, SESSION_BACKUP_KEY);
    } else {
      console.error('❌ [Session] Save failed - verification failed!');
    }
  } catch (e) {
    console.error('❌ [Session] Save error:', e);
    console.error('   Error details:', e.message);
    // Try alternative storage
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      console.log('⚠️ [Session] Saved to sessionStorage as fallback');
    } catch (e2) {
      console.error('❌ [Session] Even sessionStorage failed:', e2);
    }
  }
};

// Load session (check expiry) - tries multiple locations
const loadSession = () => {
  console.log('🔍 [Session] Loading session...');
  
  // Try primary storage
  try {
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry)) {
      console.log('⏰ [Session] Expired, clearing...');
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      localStorage.removeItem(SESSION_BACKUP_KEY);
      return null;
    }
    
    let stored = localStorage.getItem(SESSION_KEY);
    
    // Try backup if primary is empty
    if (!stored) {
      console.log('🔍 [Session] Primary empty, trying backup...');
      stored = localStorage.getItem(SESSION_BACKUP_KEY);
    }
    
    // Try sessionStorage as last resort
    if (!stored) {
      console.log('🔍 [Session] Backup empty, trying sessionStorage...');
      stored = sessionStorage.getItem(SESSION_KEY);
    }
    
    if (stored) {
      const session = JSON.parse(stored);
      if (session?.user?.email && session?.access_token) {
        console.log('✅ [Session] Loaded:', session.user.email);
        return session;
      } else {
        console.log('⚠️ [Session] Found data but invalid structure');
      }
    }
  } catch (e) {
    console.error('❌ [Session] Load error:', e);
  }
  
  console.log('ℹ️ [Session] No valid session found');
  return null;
};

const initSupabase = () => {
  if (supabase) return Promise.resolve(supabase);
  if (supabaseInitPromise) return supabaseInitPromise;
  
  supabaseInitPromise = (async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      // Clean URL hash from OAuth
      if (window.location.hash === '#' || window.location.hash === '') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      
      supabase = createClient(
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
      
      console.log('✅ [Supabase] Initialized');
      return supabase;
    } catch (e) {
      console.error('❌ [Supabase] Init error:', e);
      supabaseInitPromise = null;
      return null;
    }
  })();
  
  return supabaseInitPromise;
};

// ============================================================================
// DATABASE HELPER FUNCTIONS
// ============================================================================

// Load all user data from Supabase
const loadUserDataFromDB = async (userId) => {
  const sb = await initSupabase();
  if (!sb) return null;
  
  console.log('📥 [DB] Loading user data...');
  
  try {
    const [
      { data: profile },
      { data: transactions },
      { data: bills },
      { data: goals },
      { data: budgets },
      { data: incomeTypes },
      { data: categories },
      { data: settings }
    ] = await Promise.all([
      sb.from('user_profiles').select('*').eq('user_id', userId).single(),
      sb.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      sb.from('bills').select('*').eq('user_id', userId),
      sb.from('goals').select('*').eq('user_id', userId),
      sb.from('budgets').select('*').eq('user_id', userId),
      sb.from('income_types').select('*').eq('user_id', userId),
      sb.from('accounting_categories').select('*').eq('user_id', userId),
      sb.from('user_settings').select('*').eq('user_id', userId).single()
    ]);
    
    console.log('✅ [DB] Loaded:', {
      transactions: transactions?.length || 0,
      bills: bills?.length || 0,
      goals: goals?.length || 0
    });
    
    return {
      profile,
      transactions: transactions || [],
      bills: bills || [],
      goals: goals || [],
      budgets: budgets || [],
      incomeTypes: incomeTypes || [],
      categories: categories || [],
      settings
    };
  } catch (e) {
    console.error('❌ [DB] Load error:', e);
    return null;
  }
};

// Save transactions to Supabase
const saveTransactionsToDB = async (userId, transactions) => {
  const sb = await initSupabase();
  if (!sb || !transactions?.length) return;
  
  console.log('💾 [DB] Saving transactions:', transactions.length);
  
  try {
    // Delete existing and insert new (simple sync strategy)
    await sb.from('transactions').delete().eq('user_id', userId);
    
    const toInsert = transactions.map(t => ({
      user_id: userId,
      date: t.date,
      description: t.description,
      original_description: t.originalDescription,
      category: t.category,
      amount: t.amount,
      status: t.status,
      account_type: t.accountType || 'personal'
    }));
    
    const { error } = await sb.from('transactions').insert(toInsert);
    if (error) throw error;
    console.log('✅ [DB] Transactions saved');
  } catch (e) {
    console.error('❌ [DB] Save transactions error:', e);
  }
};

// Save bills to Supabase
const saveBillsToDB = async (userId, bills) => {
  const sb = await initSupabase();
  if (!sb) return;
  
  console.log('💾 [DB] Saving bills:', bills?.length || 0);
  
  try {
    await sb.from('bills').delete().eq('user_id', userId);
    
    if (bills?.length) {
      const toInsert = bills.map(b => ({
        user_id: userId,
        name: b.name,
        amount: b.amount,
        due_date: b.dueDate,
        category: b.category,
        is_paid: b.isPaid,
        is_recurring: b.isRecurring,
        frequency: b.frequency,
        account_type: b.accountType || 'personal'
      }));
      
      const { error } = await sb.from('bills').insert(toInsert);
      if (error) throw error;
    }
    console.log('✅ [DB] Bills saved');
  } catch (e) {
    console.error('❌ [DB] Save bills error:', e);
  }
};

// Save goals to Supabase
const saveGoalsToDB = async (userId, goals) => {
  const sb = await initSupabase();
  if (!sb) return;
  
  console.log('💾 [DB] Saving goals:', goals?.length || 0);
  
  try {
    await sb.from('goals').delete().eq('user_id', userId);
    
    if (goals?.length) {
      const toInsert = goals.map(g => ({
        user_id: userId,
        name: g.name,
        target_amount: g.targetAmount,
        current_amount: g.currentAmount,
        target_date: g.targetDate,
        category: g.category,
        priority: g.priority,
        status: g.status,
        account_type: g.accountType || 'personal'
      }));
      
      const { error } = await sb.from('goals').insert(toInsert);
      if (error) throw error;
    }
    console.log('✅ [DB] Goals saved');
  } catch (e) {
    console.error('❌ [DB] Save goals error:', e);
  }
};

// Save user profile to Supabase
const saveProfileToDB = async (userId, profile) => {
  const sb = await initSupabase();
  if (!sb) return;
  
  console.log('💾 [DB] Saving profile...');
  
  try {
    const { error } = await sb.from('user_profiles').upsert({
      user_id: userId,
      first_name: profile.firstName,
      last_name: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      date_of_birth: profile.dateOfBirth,
      gender: profile.gender,
      photo_url: profile.photoUrl,
      sidehustle_name: profile.sidehustleName
    }, { onConflict: 'user_id' });
    
    if (error) throw error;
    console.log('✅ [DB] Profile saved');
  } catch (e) {
    console.error('❌ [DB] Save profile error:', e);
  }
};

// Convert DB transaction to app format
const dbToAppTransaction = (t) => ({
  id: t.id,
  date: t.date,
  description: t.description,
  originalDescription: t.original_description,
  category: t.category,
  amount: parseFloat(t.amount),
  status: t.status,
  accountType: t.account_type
});

// Convert DB bill to app format
const dbToAppBill = (b) => ({
  id: b.id,
  name: b.name,
  amount: parseFloat(b.amount),
  dueDate: b.due_date,
  category: b.category,
  isPaid: b.is_paid,
  isRecurring: b.is_recurring,
  frequency: b.frequency,
  accountType: b.account_type
});

// Convert DB goal to app format
const dbToAppGoal = (g) => ({
  id: g.id,
  name: g.name,
  targetAmount: parseFloat(g.target_amount),
  currentAmount: parseFloat(g.current_amount),
  targetDate: g.target_date,
  category: g.category,
  priority: g.priority,
  status: g.status,
  accountType: g.account_type
});
// CSV Parser
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const transactions = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

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
      transactions.push({
        id: i,
        date: values[0],
        description: values[1]?.replace(/"/g, '') || '',
        originalDescription: values[2]?.replace(/"/g, '') || '',
        category: values[3]?.replace(/"/g, '') || 'Uncategorized',
        amount: parseFloat(values[4]) || 0,
        status: values[5]?.replace(/"/g, '') || 'Posted'
      });
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
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [lastImportDate, setLastImportDate] = useState(() => {
    try {
      return localStorage.getItem('pn_lastImportDate') || null;
    } catch { return null; }
  });

  // Load user data - tries DB first, falls back to localStorage
  const loadUserData = async (userId) => {
    console.log('📥 [Data] Loading user data for:', userId);
    
    // Try loading from database first
    const dbData = await loadUserDataFromDB(userId);
    
    if (dbData && (dbData.transactions?.length || dbData.bills?.length || dbData.goals?.length)) {
      console.log('✅ [Data] Loaded from database');
      setTransactions(dbData.transactions.map(dbToAppTransaction));
      setBills(dbData.bills.map(dbToAppBill));
      setGoals(dbData.goals.map(dbToAppGoal));
      return;
    }
    
    // Fallback to localStorage
    console.log('ℹ️ [Data] No DB data, trying localStorage...');
    try {
      const savedTransactions = localStorage.getItem(`pn_transactions_${userId}`);
      const savedBills = localStorage.getItem(`pn_bills_${userId}`);
      const savedGoals = localStorage.getItem(`pn_goals_${userId}`);
      const savedImportDate = localStorage.getItem(`pn_lastImport_${userId}`);

      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedBills) setBills(JSON.parse(savedBills));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedImportDate) setLastImportDate(new Date(savedImportDate));
      
      console.log('✅ [Data] Loaded from localStorage');
    } catch (e) {
      console.error('❌ [Data] localStorage load error:', e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let subscription = null;
    
    const init = async () => {
      console.log('🚀 [Auth] Starting initialization...');
      
      // TEST: Verify localStorage is working
      try {
        localStorage.setItem('pn_test', 'working');
        const test = localStorage.getItem('pn_test');
        console.log('🧪 [Test] localStorage test:', test === 'working' ? '✅ WORKING' : '❌ FAILED');
        localStorage.removeItem('pn_test');
      } catch (e) {
        console.error('❌ [Test] localStorage NOT WORKING:', e);
      }
      
      // Show all existing pn_ and sb keys
      const allKeys = Object.keys(localStorage);
      const sessionKeys = allKeys.filter(k => k.includes('pn_') || k.includes('sb'));
      console.log('🔑 [Debug] All localStorage keys:', allKeys.length, 'total');
      console.log('🔑 [Debug] Session-related keys:', sessionKeys);
      sessionKeys.forEach(k => {
        const v = localStorage.getItem(k);
        console.log(`   ${k}: ${v?.substring(0, 50)}${v?.length > 50 ? '...' : ''}`);
      });
      
      const sb = await initSupabase();
      
      if (!sb) {
        console.error('❌ [Auth] Supabase failed to initialize');
        if (isMounted) setLoading(false);
        return;
      }
      
      // STEP 1: Try to get session from Supabase
      let activeSession = null;
      
      try {
        const { data: { session }, error } = await sb.auth.getSession();
        
        if (error) {
          console.error('❌ [Auth] getSession error:', error);
        } else if (session?.user) {
          console.log('✅ [Auth] Found Supabase session:', session.user.email);
          activeSession = session;
          saveSession(session); // Update our backup
        }
      } catch (e) {
        console.error('❌ [Auth] getSession exception:', e);
      }
      
      // STEP 2: If no Supabase session, try our backup
      if (!activeSession) {
        console.log('🔍 [Auth] Checking backup session...');
        const backup = loadSession();
        
        if (backup?.access_token && backup?.refresh_token) {
          console.log('🔄 [Auth] Attempting to restore from backup...');
          try {
            const { data, error } = await sb.auth.setSession({
              access_token: backup.access_token,
              refresh_token: backup.refresh_token
            });
            
            if (error) {
              console.error('❌ [Auth] Restore failed:', error.message);
              saveSession(null); // Clear invalid backup
            } else if (data?.session?.user) {
              console.log('✅ [Auth] Restored from backup:', data.session.user.email);
              activeSession = data.session;
              saveSession(data.session); // Update with fresh tokens
            }
          } catch (e) {
            console.error('❌ [Auth] Restore exception:', e);
            saveSession(null);
          }
        } else {
          console.log('ℹ️ [Auth] No backup session found');
        }
      }
      
      // STEP 3: If we have a session, set up the user
      if (activeSession?.user && isMounted) {
        setUser(activeSession.user);
        setView('dashboard');
        await loadUserData(activeSession.user.id);
      }
      
      // STEP 4: Set up auth state listener
      const { data: { subscription: sub } } = sb.auth.onAuthStateChange(async (event, session) => {
        console.log('🔔 [Auth] Event:', event, '| User:', session?.user?.email || 'none', '| Has Session:', !!session);
        
        if (!isMounted) return;
        
        // Handle all sign-in related events
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
          console.log('💾 [Auth] Saving session from event:', event);
          saveSession(session);
          setUser(session.user);
          setView('dashboard');
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 [Auth] Signed out - clearing session');
          saveSession(null);
          setUser(null);
          setView('landing');
          setTransactions([]);
          setBills([]);
          setGoals([]);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 [Auth] Token refreshed, updating backup');
          saveSession(session);
        }
      });
      subscription = sub;
      
      if (isMounted) {
        setLoading(false);
      }
    };
    
    init();
    
    // Cleanup
    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Save data to localStorage and sync to DB
  const saveData = async (userId, key, data) => {
    try {
      localStorage.setItem(`pn_${key}_${userId}`, JSON.stringify(data));
      
      // Also sync to database
      if (key === 'transactions') {
        saveTransactionsToDB(userId, data);
      } else if (key === 'bills') {
        saveBillsToDB(userId, data);
      } else if (key === 'goals') {
        saveGoalsToDB(userId, data);
      }
    } catch (e) {
      console.error('Error saving data:', e);
    }
  };

  const handleImportTransactions = (newTransactions) => {
    const userId = user?.id;
    if (!userId) return;
    setTransactions(newTransactions);
    setLastImportDate(new Date());
    saveData(userId, 'transactions', newTransactions);
    localStorage.setItem(`pn_lastImport_${userId}`, new Date().toISOString());
  };

  const handleUpdateBills = (newBills) => {
    const userId = user?.id;
    if (!userId) return;
    setBills(newBills);
    saveData(userId, 'bills', newBills);
  };

  const handleUpdateGoals = (newGoals) => {
    const userId = user?.id;
    if (!userId) return;
    setGoals(newGoals);
    saveData(userId, 'goals', newGoals);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bgMain }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ animation: 'pulse 2s infinite' }}>
            <PennyLogo size={64} />
          </div>
          <p style={{ marginTop: '16px', color: theme.textSecondary }}>Loading ProsperNest...</p>
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
      onSetLastImportDate={setLastImportDate}
      onImportTransactions={handleImportTransactions}
      onUpdateBills={handleUpdateBills}
      onUpdateGoals={handleUpdateGoals}
      parseCSV={parseCSV}
    />
  );
  return <ProsperNestLandingV4 onNavigate={setView} />;
}
// ============================================================================
// LANDING PAGE - PROSPERNEST
// ============================================================================
function LandingPage({ setView }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.3)', borderRadius: '50%', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: '300px', height: '300px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
              PN
            </div>
            <span style={{ fontSize: '22px', fontWeight: '700' }}>
              Prosper<span style={{ color: '#A78BFA' }}>Nest</span>
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Features</a>
            <a href="#pricing" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Pricing</a>
            <a href="#about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>About</a>
            <button onClick={() => setView('auth')} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: '500', backdropFilter: 'blur(10px)' }}>
              Sign In
            </button>
            <button onClick={() => setView('auth')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
              Get Started
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '20px', marginBottom: '24px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ color: '#10B981', fontSize: '14px', fontWeight: '500' }}>Trusted by 10,000+ families</span>
          </div>

          <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px', maxWidth: '900px', margin: '0 auto 24px' }}>
            Your Financial Future,{' '}
            <span style={{ background: 'linear-gradient(135deg, #A78BFA, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Simplified
            </span>
          </h1>

          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Track your personal finances and side hustle income in one beautiful dashboard. Make smarter decisions with real-time insights.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px' }}>
            <button onClick={() => setView('auth')} style={{ padding: '16px 40px', background: 'white', border: 'none', borderRadius: '12px', color: '#1e1b4b', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Start Free Trial <span>→</span>
            </button>
            <button style={{ padding: '16px 40px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '500', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '60px', justifyContent: 'center' }}>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>$2.4B+</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Assets Tracked</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>4.9<span style={{ color: '#FBBF24' }}>★</span></div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>App Store Rating</div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>256-bit</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Bank-Level Security</div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {[
                { icon: '📊', title: 'Smart Dashboard', desc: 'Real-time overview of all your finances' },
                { icon: '💼', title: 'Side Hustle Tracking', desc: 'Separate tracking for your business income' },
                { icon: '🎯', title: 'Goal Setting', desc: 'Set and track your financial goals' },
                { icon: '📈', title: 'Analytics', desc: 'Deep insights into spending patterns' },
                { icon: '🔔', title: 'Bill Reminders', desc: 'Never miss a payment again' },
                { icon: '🔒', title: 'Bank Security', desc: '256-bit encryption keeps you safe' },
              ].map((feature, i) => (
                <div key={i} style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{feature.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', marginTop: '60px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>© 2024 ProsperNest. All rights reserved. www.prospernest.io</p>
        </footer>
      </div>
    </div>
  );
}
// ============================================================================
// AUTH PAGE - DASHSTACK STYLE
// ============================================================================
function AuthPage({ setView }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
        // Sign in
        console.log('🔐 [Login] Attempting sign in for:', email);
        const { data, error } = await sb.auth.signInWithPassword({ 
          email, 
          password
        });
        
        console.log('🔐 [Login] Response:', { 
          hasData: !!data, 
          hasSession: !!data?.session,
          hasUser: !!data?.user,
          error: error?.message 
        });
        
        if (error) throw error;
        
        // CRITICAL: Save session immediately
        if (data?.session) {
          console.log('💾 [Login] Saving session NOW...');
          console.log('💾 [Login] Session object keys:', Object.keys(data.session));
          saveSession(data.session);
          
          // Double-check it saved
          const check = localStorage.getItem('pn_session');
          console.log('✅ [Login] Session save verified:', !!check);
          
          // Show all pn_ keys after save
          const keysAfterSave = Object.keys(localStorage).filter(k => k.includes('pn_'));
          console.log('🔑 [Login] Keys after save:', keysAfterSave);
        } else {
          console.error('❌ [Login] NO SESSION IN RESPONSE!');
          console.error('   data:', JSON.stringify(data, null, 2));
        }
        
        // Remember email preference
        if (rememberMe) {
          localStorage.setItem('pn_remember_email', email);
          localStorage.setItem('pn_remember_me', 'true');
        } else {
          localStorage.removeItem('pn_remember_email');
          localStorage.removeItem('pn_remember_me');
        }
        
        console.log('✅ [Login] Complete:', data?.user?.email);
      } else {
        const { data, error } = await sb.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        
        // For signup, also save session if returned
        if (data?.session) {
          saveSession(data.session);
        }
        
        // Show success message for signup
        if (data?.user && !data?.session) {
          setError('Check your email to confirm your account!');
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('❌ [Auth] Error:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    const sb = await initSupabase();
    if (sb) {
      const { error } = await sb.auth.signInWithOAuth({ 
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } else {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('pn_remember_email');
    const shouldRemember = localStorage.getItem('pn_remember_me') === 'true';
    
    if (rememberedEmail && shouldRemember) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Left side - Branding */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '20%', width: '300px', height: '300px', background: 'rgba(139, 92, 246, 0.3)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '30%', left: '10%', width: '200px', height: '200px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
            <PennyLogo size={56} />
            <span style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>
              Prosper<span style={{ color: '#A78BFA' }}>Nest</span>
            </span>
            <span style={{ 
              background: '#F97316', 
              padding: '4px 10px', 
              borderRadius: '6px', 
              fontSize: '11px', 
              fontWeight: '600', 
              color: 'white',
              textTransform: 'uppercase'
            }}>Beta</span>
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
            Take Control of Your Financial Future
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Track personal finances and side hustle income in one beautiful dashboard.
          </p>

          <div style={{ marginTop: '40px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>10K+</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Active Users</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>4.9★</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Rating</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>$2.4B</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Tracked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div style={{ flex: 1, background: '#F5F6FA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Mobile header with matching branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <PennyLogo size={36} />
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937' }}>
              Prosper<span style={{ color: '#4F46E5' }}>Nest</span>
            </span>
            <span style={{ 
              background: '#F97316', 
              padding: '2px 8px', 
              borderRadius: '4px', 
              fontSize: '10px', 
              fontWeight: '600', 
              color: 'white',
              textTransform: 'uppercase'
            }}>Beta</span>
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>
              {isLogin ? 'Welcome back!' : 'Create account'}
            </h2>
            <p style={{ color: '#6B7280' }}>
              {isLogin ? 'Sign in to continue to ProsperNest' : 'Get started with your free account'}
            </p>
          </div>

          <button onClick={handleGoogleSignIn} style={{ width: '100%', padding: '14px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', marginBottom: '24px', fontSize: '15px', fontWeight: '500', color: '#1F2937' }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            <span style={{ color: '#9CA3AF', fontSize: '14px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', color: '#1F2937' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', color: '#1F2937' }}
              />
            </div>
            
            {isLogin && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#4F46E5' }}
                  />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Remember me</span>
                </label>
                <button type="button" style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
                  Forgot password?
                </button>
              </div>
            )}
            
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#4F46E5', border: 'none', borderRadius: '10px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#6B7280', fontSize: '14px' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              {isLogin ? 'Sign up for free' : 'Sign in'}
            </button>
          </p>

          {/* Terms & Privacy Links */}
          <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
              By signing in, you agree to our
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button 
                type="button"
                onClick={() => setShowTerms(true)}
                style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '13px', fontWeight: '500', textDecoration: 'underline' }}
              >
                Terms of Service
              </button>
              <span style={{ color: '#D1D5DB' }}>•</span>
              <button 
                type="button"
                onClick={() => setShowPrivacy(true)}
                style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '13px', fontWeight: '500', textDecoration: 'underline' }}
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', margin: 0 }}>Terms of Service</h2>
              <button onClick={() => setShowTerms(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6B7280' }}>×</button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', fontSize: '14px', lineHeight: 1.7, color: '#4B5563' }}>
              <p style={{ marginBottom: '16px' }}><strong>Last Updated:</strong> December 2, 2024</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>1. Acceptance of Terms</h3>
              <p style={{ marginBottom: '16px' }}>By accessing or using ProsperNest ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>2. Description of Service</h3>
              <p style={{ marginBottom: '16px' }}>ProsperNest provides personal finance management tools including budget tracking, expense categorization, financial goal setting, and reporting features. We provide read-only access to your connected financial accounts through secure third-party providers.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>3. User Accounts</h3>
              <p style={{ marginBottom: '16px' }}>You must be at least 18 years old to use this Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>4. Financial Data</h3>
              <p style={{ marginBottom: '16px' }}>ProsperNest only has read-only access to your financial accounts. We cannot initiate transactions or transfers on your behalf. We use bank-level 256-bit encryption to protect your data.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>5. Not Financial Advice</h3>
              <p style={{ marginBottom: '16px' }}>ProsperNest is a tool for organizing your finances. We do not provide financial, investment, tax, or legal advice. Consult with qualified professionals for financial guidance.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>6. Limitation of Liability</h3>
              <p style={{ marginBottom: '16px' }}>ProsperNest is provided "as is" without warranties. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>7. Contact</h3>
              <p style={{ marginBottom: '16px' }}>For questions about these Terms, contact us at legal@prospernest.io</p>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => setShowTerms(false)} style={{ width: '100%', padding: '12px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', margin: 0 }}>Privacy Policy</h2>
              <button onClick={() => setShowPrivacy(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6B7280' }}>×</button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', fontSize: '14px', lineHeight: 1.7, color: '#4B5563' }}>
              <p style={{ marginBottom: '16px' }}><strong>Last Updated:</strong> December 2, 2024</p>
              
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <p style={{ fontWeight: '600', color: '#166534', marginBottom: '8px' }}>🔒 Quick Privacy Facts:</p>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#166534' }}>
                  <li>We NEVER sell your data</li>
                  <li>We have read-only access to your accounts</li>
                  <li>We never see your bank login credentials</li>
                  <li>256-bit encryption protects all your data</li>
                </ul>
              </div>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>1. Information We Collect</h3>
              <p style={{ marginBottom: '16px' }}>We collect information you provide (name, email, password) and financial data from connected accounts (transactions, balances, account info). We also collect usage data to improve our Service.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>2. How We Use Your Information</h3>
              <p style={{ marginBottom: '16px' }}>We use your information to provide and improve our Service, send important notifications, and ensure security. We never sell your personal or financial information to third parties.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>3. Data Security</h3>
              <p style={{ marginBottom: '16px' }}>We use industry-standard security measures including 256-bit SSL/TLS encryption, AES-256 encryption at rest, and two-factor authentication options.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>4. Third-Party Services</h3>
              <p style={{ marginBottom: '16px' }}>We use trusted third-party services (like Plaid) to securely connect to your financial institutions. These providers never share your login credentials with us.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>5. Your Rights</h3>
              <p style={{ marginBottom: '16px' }}>You can access, correct, or delete your data at any time. Contact us at privacy@prospernest.io for any privacy-related requests.</p>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginTop: '20px', marginBottom: '12px' }}>6. Contact</h3>
              <p style={{ marginBottom: '16px' }}>For privacy questions, contact us at privacy@prospernest.io</p>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => setShowPrivacy(false)} style={{ width: '100%', padding: '12px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ============================================================================
// THEME TOGGLE COMPONENT
// ============================================================================
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '42px',
        height: '42px',
        background: isDark 
          ? 'linear-gradient(135deg, #312e81 0%, #4c1d95 100%)' 
          : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: `1px solid ${isDark ? '#4c1d95' : '#fcd34d'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      <span style={{ 
        fontSize: '20px',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
      }}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
// ============================================================================
// DASHBOARD - DASHSTACK STYLE (Light Theme)
// ============================================================================
function Dashboard({ 
  user, 
  setView, 
  transactions, 
  bills, 
  goals, 
  lastImportDate,
  onSetLastImportDate,
  onImportTransactions,
  onUpdateBills,
  onUpdateGoals,
  parseCSV
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showPennyChat, setShowPennyChat] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const [showManageAccountModal, setShowManageAccountModal] = useState(false);
  
  // Memoji avatar selection
  const memojiAvatars = [
    '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧑‍💼', '👨', '👩', '🧑',
    '👴', '👵', '🧓', '👨‍🦳', '👩‍🦳', '👨‍🦰', '👩‍🦰', '👱‍♂️',
    '👱‍♀️', '👨‍🦱', '👩‍🦱', '🧔', '🧔‍♀️', '👲', '🧕', '👳‍♂️',
    '👳‍♀️', '🤵', '🤵‍♀️', '👸', '🤴', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️'
  ];
  const [userAvatar, setUserAvatar] = useState(() => {
    try {
      return localStorage.getItem('pn_userAvatar') || '👨‍💼';
    } catch { return '👨‍💼'; }
  });
  
  const [chatMessages, setChatMessages] = useState([
    { from: 'penny', text: "Hi! I'm Penny, your financial assistant! 🪙 How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const idleTimerRef = useRef(null);

  // Idle timeout - 15 minutes
  useEffect(() => {
    const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
    
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setShowIdleModal(true);
      }, IDLE_TIMEOUT);
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();
    
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
    };
  }, []);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        from: 'penny', 
        text: "Thanks for your message! I'm still learning, but I'm here to help with budgeting tips, goal tracking, and navigating ProsperNest! 💰" 
      }]);
    }, 1000);
  };

  // Theme state - persist in localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('pn_darkMode');
      return saved === 'true';
    } catch { return false; }
  });

  // Get current theme based on mode
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Save theme preference
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('pn_darkMode', newMode.toString());
  };

  // Profile state with expanded fields
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(`pn_profile_${user?.id}`);
      return saved ? JSON.parse(saved) : { 
        firstName: '', 
        lastName: '', 
        email: user?.email || '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        photoUrl: ''
      };
    } catch { 
      return { 
        firstName: '', 
        lastName: '', 
        email: user?.email || '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        photoUrl: ''
      }; 
    }
  });

  // Save profile to localStorage
  const saveProfile = (newProfile) => {
    setProfile(newProfile);
    if (user?.id) {
      localStorage.setItem(`pn_profile_${user.id}`, JSON.stringify(newProfile));
    }
  };

  const handleSignOut = async () => {
    console.log('🚪 [Auth] Signing out...');
    try {
      // Clear our session backup
      saveSession(null);
      
      // Clear any old storage keys
      localStorage.removeItem('pn_sb_auth');
      localStorage.removeItem('sb-auth-token');
      localStorage.removeItem('pn_supabase_session');
      
      const sb = await initSupabase();
      if (sb) {
        await sb.auth.signOut();
        console.log('✅ [Auth] Signed out successfully');
      }
    } catch (err) {
      console.error('❌ [Auth] Sign out error:', err);
    }
  };

  const displayName = profile.firstName || user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  const getInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'sales', label: 'Sales Tracker', icon: Icons.Sales },
    { id: 'budget', label: 'Budget', icon: Icons.Budget },
    { id: 'transactions', label: 'Transactions', icon: Icons.Transactions },
    { id: 'bills', label: 'Bills', icon: Icons.Calendar },
    { id: 'goals', label: 'Goals', icon: Icons.Goals },
    { id: 'retirement', label: 'Retirement', icon: Icons.Retirement },
    { id: 'reports', label: 'Reports', icon: Icons.Reports },
  ];

  const bottomNavItems = [
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
    { id: 'import', label: 'Import', icon: Icons.Import },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome transactions={transactions} goals={goals} bills={bills} theme={theme} lastImportDate={lastImportDate} />;
      case 'sales':
        return <SalesTrackerTab theme={theme} />;
      case 'budget':
        return <BudgetTab transactions={transactions} onNavigateToImport={() => setActiveTab('import')} theme={theme} />;
      case 'transactions':
        return <TransactionsTabDS transactions={transactions} onNavigateToImport={() => setActiveTab('import')} theme={theme} />;
      case 'bills':
        return <BillsCalendarView theme={theme} />;
      case 'goals':
        return <GoalsTimelineWithCelebration goals={goals} onUpdateGoals={onUpdateGoals} theme={theme} />;
      case 'retirement':
        return <RetirementTab theme={theme} />;
      case 'reports':
        return <ReportsTab transactions={transactions} onNavigateToImport={() => setActiveTab('import')} theme={theme} />;
      case 'settings':
        return <SettingsTabDS 
          theme={theme} 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme}
          selectedLanguage={selectedLanguage}
          onLanguageChange={(lang) => {
            setSelectedLanguage(lang);
            localStorage.setItem('pn_language', JSON.stringify(lang));
          }}
          userAvatar={userAvatar}
          onAvatarChange={(avatar) => {
            setUserAvatar(avatar);
            localStorage.setItem('pn_userAvatar', avatar);
          }}
          memojiAvatars={memojiAvatars}
          languages={languages}
        />;
      case 'import':
        return <ImportTabDS 
          onImport={(data) => {
            onImportTransactions(data);
            const now = new Date().toISOString();
            onSetLastImportDate && onSetLastImportDate(now);
            localStorage.setItem('pn_lastImportDate', now);
          }} 
          parseCSV={parseCSV} 
          transactionCount={transactions.length} 
          theme={theme} 
        />;
      default:
        return <DashboardHome transactions={transactions} goals={goals} bills={bills} theme={theme} lastImportDate={lastImportDate} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme.bgMain, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.borderLight}`, cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PennyLogo size={36} />
            <span style={{ fontWeight: '700', fontSize: '18px', color: theme.textPrimary }}>
              Prosper<span style={{ color: theme.primary }}>Nest</span>
            </span>
            <span style={{ 
              background: '#F97316', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              fontSize: '9px', 
              fontWeight: '600', 
              color: 'white',
              textTransform: 'uppercase'
            }}>Beta</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                color: activeTab === item.id ? 'white' : theme.sidebarText,
                background: activeTab === item.id ? theme.sidebarActive : 'transparent',
                transition: 'all 0.2s ease',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: activeTab === item.id ? '600' : '500'
              }}
            >
              <item.icon />
              <span>{item.label}</span>
            </div>
          ))}

          <div style={{ padding: '16px 16px 8px', color: theme.textMuted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Settings
          </div>

          {bottomNavItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                color: activeTab === item.id ? 'white' : theme.sidebarText,
                background: activeTab === item.id ? theme.sidebarActive : 'transparent',
                transition: 'all 0.2s ease',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: activeTab === item.id ? '600' : '500'
              }}
            >
              <item.icon />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '16px', borderTop: `1px solid ${theme.borderLight}` }}>
          <div
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              color: theme.danger,
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Icons.SignOut />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          height: '70px',
          background: theme.bgWhite,
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          {/* Search and Welcome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: '14px', color: theme.textMuted }}>
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '200px',
                  height: '40px',
                  background: theme.bgMain,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '10px',
                  padding: '0 16px 0 44px',
                  fontSize: '14px',
                  outline: 'none',
                  color: theme.textPrimary
                }}
              />
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: theme.textSecondary, 
              fontWeight: '500',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Welcome back, <span style={{ color: theme.primary, fontWeight: '600' }}>{displayName}</span>! 👋
            </div>
          </div>

          {/* Right side - Clean and Simple */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            
            {/* Theme Toggle */}
            <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: '42px',
                  height: '42px',
                  background: theme.bgCard,
                  border: `1px solid ${theme.borderLight}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <span style={{ fontSize: '18px' }}>🔔</span>
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#EF4444',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '700',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  6
                </span>
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '320px',
                  background: theme.dropdownBg,
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  border: `1px solid ${theme.border}`,
                  zIndex: 100
                }}>
                  <div style={{ padding: '16px', borderBottom: `1px solid ${theme.borderLight}`, fontWeight: '600', color: theme.textPrimary }}>
                    Notification
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {[
                      { icon: '⚙️', title: 'Settings', desc: 'Update Dashboard', color: '#3B82F6' },
                      { icon: '📅', title: 'Event Update', desc: 'An event date update again', color: '#10B981' },
                      { icon: '👤', title: 'Profile', desc: 'Update your profile', color: '#F59E0B' },
                      { icon: '⚠️', title: 'Application Error', desc: 'Check Your running application', color: '#EF4444' },
                    ].map((item, i) => (
                      <div key={i} style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start', borderBottom: `1px solid ${theme.borderLight}` }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          {item.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: theme.textPrimary }}>{item.title}</div>
                          <div style={{ fontSize: '12px', color: theme.textMuted }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '12px 16px', textAlign: 'center', color: theme.primary, fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                    See all notification
                  </div>
                </div>
              )}
            </div>

            {/* Profile with Memoji Avatar */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  padding: '4px 8px 4px 4px',
                  background: theme.bgCard,
                  borderRadius: '25px',
                  border: `1px solid ${theme.borderLight}`
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  border: `2px solid ${theme.primary}30`
                }}>
                  {userAvatar || '👨‍💼'}
                </div>
              </div>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: theme.dropdownBg,
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  border: `1px solid ${theme.border}`,
                  minWidth: '180px',
                  zIndex: 100
                }}>
                  <div
                    onClick={() => { setShowManageAccountModal(true); setShowProfileMenu(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: theme.textPrimary,
                      borderBottom: `1px solid ${theme.borderLight}`
                    }}
                  >
                    <span>👤</span>
                    <span>Manage Account</span>
                  </div>
                  <div
                    onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: theme.textPrimary,
                      borderBottom: `1px solid ${theme.borderLight}`
                    }}
                  >
                    <span>🔑</span>
                    <span>Change Password</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: theme.textPrimary,
                      borderBottom: `1px solid ${theme.borderLight}`
                    }}
                  >
                    <span>📋</span>
                    <span>Activity Log</span>
                  </div>
                  <div
                    onClick={handleSignOut}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: theme.danger,
                      borderTop: `1px solid ${theme.borderLight}`
                    }}
                  >
                    <span>🚪</span>
                    <span>Log out</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {renderContent()}
        </div>
      </main>

      {/* Penny AI Chat Widget */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        {showPennyChat && (
          <div style={{
            position: 'absolute',
            bottom: '70px',
            right: 0,
            width: '340px',
            height: '440px',
            background: theme.bgCard,
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            border: `1px solid ${theme.border}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, #F97316, #EA580C)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <PennyLogo size={32} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>Penny</div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>Your AI Assistant</div>
              </div>
              <button onClick={() => setShowPennyChat(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ 
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.from === 'user' ? theme.primary : theme.bgMain,
                  color: msg.from === 'user' ? 'white' : theme.textPrimary,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  fontSize: '13px',
                  lineHeight: 1.4
                }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px', borderTop: `1px solid ${theme.border}`, display: 'flex', gap: '8px' }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask Penny anything..."
                style={{ flex: 1, padding: '10px 14px', background: theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '20px', fontSize: '13px', outline: 'none', color: theme.textPrimary }}
              />
              <button onClick={handleSendChat} style={{ width: '36px', height: '36px', background: theme.primary, border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ➤
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowPennyChat(!showPennyChat)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <PennyLogo size={36} />
        </button>
      </div>

      {/* Idle Timeout Modal */}
      {showIdleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: theme.bgCard, borderRadius: '20px', padding: '32px', textAlign: 'center', maxWidth: '360px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <PennyLogo size={64} />
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: theme.textPrimary, margin: '16px 0 8px' }}>Still there? 👋</h2>
            <p style={{ color: theme.textMuted, fontSize: '14px', marginBottom: '24px' }}>Need help exploring ProsperNest?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowIdleModal(false)}
                style={{ flex: 1, padding: '12px 20px', background: theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                I'm good
              </button>
              <button 
                onClick={() => { setShowIdleModal(false); setShowPennyChat(true); }}
                style={{ flex: 1, padding: '12px 20px', background: 'linear-gradient(135deg, #F97316, #EA580C)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Chat with Penny
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Account Modal */}
      {showManageAccountModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: theme.bgCard, borderRadius: '20px', padding: '32px', width: '560px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary }}>Manage Account</h2>
              <button onClick={() => setShowManageAccountModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.textMuted }}>×</button>
            </div>
            
            {/* Profile Photo */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: theme.bgMain, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '32px', color: theme.textMuted }}>
                📷
              </div>
              <button style={{ background: 'none', border: 'none', color: theme.primary, fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Upload Photo</button>
            </div>
            
            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>First Name</label>
                <input 
                  type="text" 
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  placeholder="Enter your first name"
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Last Name</label>
                <input 
                  type="text" 
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  placeholder="Enter your last name"
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Your email</label>
                <input 
                  type="email" 
                  value={profile.email || user?.email || ''}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="Enter your email"
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Enter your phone number"
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Date of Birth</label>
                <input 
                  type="date" 
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Gender</label>
                <select 
                  value={profile.gender}
                  onChange={(e) => setProfile({...profile, gender: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            {/* Save Button */}
            <button 
              onClick={() => { saveProfile(profile); setShowManageAccountModal(false); }}
              style={{ width: '100%', padding: '14px', background: theme.primary, color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}
            >
              Save Changes
            </button>
            
            {/* Membership Section */}
            <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: '20px', marginTop: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '12px' }}>Membership</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: theme.bgMain, borderRadius: '10px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '600', color: theme.textPrimary }}>Current Plan: <span style={{ color: theme.primary }}>Starter (Free)</span></div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>Basic features included</div>
                </div>
                <button style={{ padding: '8px 16px', background: theme.success, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  Upgrade
                </button>
              </div>
              <button style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px solid ${theme.danger}`, color: theme.danger, borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Cancel Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ============================================================================
// DASHBOARD HOME - DASHSTACK STYLE
// ============================================================================
// ============================================================================
// DASHBOARD HOME - COMPREHENSIVE FINANCIAL INSIGHTS
// Inspired by Apple.com design + Modern Finance Dashboards
// Features: Personal/Side Hustle split, Charts, Budget, Goals, Bills, Free to Spend
// ============================================================================

function DashboardHome({ transactions, goals, bills = [], theme, lastImportDate }) {
  const [timeRange, setTimeRange] = useState('month');
  const [activeAccount, setActiveAccount] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [txnSearchQuery, setTxnSearchQuery] = useState('');
  const [txnStatusFilter, setTxnStatusFilter] = useState('');

  // Filter transactions by account type
  const personalTransactions = transactions.filter(t => t.accountType !== 'sidehustle');
  const sideHustleTransactions = transactions.filter(t => t.accountType === 'sidehustle');
  const activeTransactions = activeAccount === 'all' ? transactions : 
    activeAccount === 'personal' ? personalTransactions : sideHustleTransactions;

  // Calculate totals
  const calcTotals = (txns) => {
    const income = txns.filter(t => parseFloat(t.amount) > 0).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = txns.filter(t => parseFloat(t.amount) < 0).reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    return { income, expenses, net: income - expenses };
  };

  const allTotals = calcTotals(transactions);
  const personalTotals = calcTotals(personalTransactions);
  const sideHustleTotals = calcTotals(sideHustleTransactions);
  const activeTotals = calcTotals(activeTransactions);

  // Calculate spending by category
  const categorySpending = {};
  const categoryColors = {
    'Fast Food': '#8B5CF6', 'Restaurants': '#06B6D4', 'Groceries': '#10B981', 'Gas': '#F59E0B',
    'Shopping': '#EC4899', 'Entertainment': '#3B82F6', 'Electronics & Software': '#6366F1',
    'Transfer': '#94A3B8', 'Hobbies': '#F97316', 'Auto & Transport': '#0EA5E9',
    'Financial': '#8B5CF6', 'Doctor': '#EF4444', 'Pharmacy': '#14B8A6', 'Television': '#E11D48',
    'Utilities': '#0891B2', 'Category Pending': '#64748B', 'Other': '#475569'
  };

  activeTransactions.filter(t => parseFloat(t.amount) < 0).forEach(t => {
    const cat = t.category || 'Other';
    if (!categorySpending[cat]) categorySpending[cat] = 0;
    categorySpending[cat] += Math.abs(parseFloat(t.amount));
  });

  const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const totalCategorySpending = sortedCategories.reduce((sum, [_, val]) => sum + val, 0);

  // Calculate monthly trends
  const monthlyData = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = monthDate.toISOString().slice(0, 7);
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
    const monthTxns = activeTransactions.filter(t => t.date?.startsWith(monthStr));
    const income = monthTxns.filter(t => parseFloat(t.amount) > 0).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = monthTxns.filter(t => parseFloat(t.amount) < 0).reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    monthlyData.push({ month: monthName, income, expenses });
  }

  // Budget calculations
  const budgets = [
    { category: 'Fast Food', budget: 300, color: '#8B5CF6' },
    { category: 'Groceries', budget: 400, color: '#10B981' },
    { category: 'Shopping', budget: 500, color: '#EC4899' },
    { category: 'Gas', budget: 200, color: '#F59E0B' },
    { category: 'Entertainment', budget: 150, color: '#3B82F6' }
  ].map(b => ({
    ...b, spent: categorySpending[b.category] || 0,
    percent: Math.min(100, ((categorySpending[b.category] || 0) / b.budget) * 100)
  }));

  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpentOnBudgeted = budgets.reduce((sum, b) => sum + b.spent, 0);
  const freeToSpend = Math.max(0, (activeTotals.income / 6 || activeTotals.income) - totalSpentOnBudgeted);

  // Financial Health Score
  const savingsRate = activeTotals.income > 0 ? ((activeTotals.net) / activeTotals.income) * 100 : 0;
  const budgetAdherence = totalBudget > 0 ? Math.max(0, 100 - ((totalSpentOnBudgeted - totalBudget) / totalBudget) * 100) : 100;
  const healthScore = Math.round(Math.min(100, Math.max(0, (savingsRate * 0.5 + budgetAdherence * 0.5))));
  const healthyTasks = Math.round((healthScore / 100) * 50000);
  const progressTasks = 50000 - healthyTasks;

  const recentTransactions = [...activeTransactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const upcomingBills = bills.length > 0 ? bills.slice(0, 4) : [
    { name: 'Netflix', amount: 17.99, dueDate: '2025-12-05', icon: '🎬' },
    { name: 'Claude AI', amount: 20.00, dueDate: '2025-12-15', icon: '🤖' },
    { name: 'Apple Music', amount: 10.99, dueDate: '2025-12-20', icon: '🎵' },
    { name: 'Electric Bill', amount: 125.00, dueDate: '2025-12-28', icon: '⚡' }
  ];

  const displayGoals = goals.length > 0 ? goals.slice(0, 3) : [
    { name: 'Emergency Fund', targetAmount: 10000, currentAmount: 3500, icon: '🛡️', color: '#10B981' },
    { name: 'Vacation', targetAmount: 3000, currentAmount: 1200, icon: '✈️', color: '#3B82F6' },
    { name: 'New Car', targetAmount: 15000, currentAmount: 2800, icon: '🚗', color: '#8B5CF6' }
  ];

  // Sparkline Chart Component (like OrbitNest)
  const Sparkline = ({ data, color, height = 45, width = 80, trend = 'up' }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    
    // Create smooth wave-like pattern
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return { x, y };
    });
    
    // Create smooth curve path
    const pathD = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = points[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 3;
      const cp2x = prev.x + 2 * (point.x - prev.x) / 3;
      return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${point.y}, ${point.x} ${point.y}`;
    }, '');
    
    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  };

  // Modern Line Chart with smooth curves (like Image 2)
  const LineChart = ({ data, height = 260 }) => {
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = 600;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expenses)), 1);
    const scaleY = (val) => padding.top + chartHeight - (val / maxVal) * chartHeight;
    const scaleX = (i) => padding.left + (i / (data.length - 1)) * (chartWidth - padding.left - padding.right);

    const createSmoothPath = (key) => {
      const points = data.map((d, i) => ({ x: scaleX(i), y: scaleY(d[key]) }));
      return points.reduce((acc, point, i) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        const prev = points[i - 1];
        const cp1x = prev.x + (point.x - prev.x) / 2;
        const cp2x = prev.x + (point.x - prev.x) / 2;
        return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${point.y}, ${point.x} ${point.y}`;
      }, '');
    };

    const yTicks = [0, 25, 50, 75, maxVal > 0 ? maxVal : 100];
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="incomeAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="expenseAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        
        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <text x={padding.left - 10} y={scaleY(tick)} textAnchor="end" fill={theme.textMuted} fontSize="11" dominantBaseline="middle">
              {tick > 0 ? (tick / 1000).toFixed(0) + 'k' : '0'}
            </text>
            <line x1={padding.left} y1={scaleY(tick)} x2={chartWidth - padding.right} y2={scaleY(tick)}
              stroke={theme.borderLight} strokeWidth="1" opacity="0.5" />
          </g>
        ))}
        
        {/* Area fills */}
        <path d={`${createSmoothPath('income')} L ${scaleX(data.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`} fill="url(#incomeAreaGrad)" />
        <path d={`${createSmoothPath('expenses')} L ${scaleX(data.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`} fill="url(#expenseAreaGrad)" />
        
        {/* Lines */}
        <path d={createSmoothPath('expenses')} fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        <path d={createSmoothPath('income')} fill="none" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
        
        {/* Data points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={scaleX(i)} cy={scaleY(d.income)} r="5" fill="#06B6D4" stroke="white" strokeWidth="2" />
            <circle cx={scaleX(i)} cy={scaleY(d.expenses)} r="5" fill="#8B5CF6" stroke="white" strokeWidth="2" />
            <text x={scaleX(i)} y={height - 20} textAnchor="middle" fill={theme.textMuted} fontSize="12" fontWeight="500">{d.month}</text>
          </g>
        ))}
      </svg>
    );
  };

  // Progress Semicircle Gauge (like Image 3)
  const ProgressGauge = ({ score, size = 200 }) => {
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2 - 10;
    const circumference = Math.PI * radius;
    const progress = (score / 100) * circumference;
    
    return (
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        
        {/* Background arc */}
        <path
          d={`M ${strokeWidth + 10} ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size - strokeWidth - 10} ${size * 0.55}`}
          fill="none"
          stroke={theme.borderLight}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth + 10} ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size - strokeWidth - 10} ${size * 0.55}`}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        
        {/* Center icon */}
        <circle cx={size / 2} cy={size * 0.38} r="20" fill={theme.bgCard} stroke={theme.borderLight} strokeWidth="2" />
        <text x={size / 2} y={size * 0.42} textAnchor="middle" fontSize="16" fill={theme.textMuted}>📍</text>
      </svg>
    );
  };

  // Bar Chart for Budget (like Image 4)
  const BarChart = ({ data, height = 240 }) => {
    const padding = { top: 20, right: 20, bottom: 50, left: 60 };
    const chartWidth = 500;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = 24;
    const groupWidth = barWidth * 2 + 8;
    const maxVal = Math.max(...data.map(d => Math.max(d.income, d.expenses)), 1);
    
    const yTicks = [200, 400, 600, 800, 1000].filter(t => t <= maxVal * 1.2 / 1000);
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Y-axis labels and grid */}
        {yTicks.map((tick, i) => {
          const y = padding.top + chartHeight - (tick * 1000 / maxVal) * chartHeight;
          return (
            <g key={i}>
              <text x={padding.left - 10} y={y} textAnchor="end" fill={theme.textMuted} fontSize="11" dominantBaseline="middle">
                {tick}k
              </text>
              <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y}
                stroke={theme.borderLight} strokeWidth="1" opacity="0.3" />
            </g>
          );
        })}
        
        {/* Bars */}
        {data.map((d, i) => {
          const x = padding.left + 20 + i * ((chartWidth - padding.left - padding.right - 40) / (data.length - 1)) - groupWidth / 2;
          const incomeHeight = (d.income / maxVal) * chartHeight;
          const expenseHeight = (d.expenses / maxVal) * chartHeight;
          
          return (
            <g key={i}>
              {/* Income bar (darker) */}
              <rect
                x={x}
                y={padding.top + chartHeight - incomeHeight}
                width={barWidth}
                height={incomeHeight}
                fill="#6366F1"
                rx="4"
              />
              {/* Expense bar (lighter) */}
              <rect
                x={x + barWidth + 4}
                y={padding.top + chartHeight - expenseHeight}
                width={barWidth}
                height={expenseHeight}
                fill="#C7D2FE"
                rx="4"
              />
              {/* Month label */}
              <text x={x + groupWidth / 2} y={height - 20} textAnchor="middle" fill={theme.textMuted} fontSize="12">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Spending Category Cards (like Image 5)
  const spendingCards = sortedCategories.slice(0, 4).map(([cat, val]) => {
    const budget = budgets.find(b => b.category === cat)?.budget || val * 1.5;
    const percent = Math.min(100, (val / budget) * 100);
    const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#06B6D4'];
    const bgColors = ['#7C3AED', '#059669', '#D97706', '#0891B2'];
    const idx = sortedCategories.findIndex(([c]) => c === cat);
    return { category: cat, spent: val, budget, percent, color: colors[idx % 4], bgColor: bgColors[idx % 4] };
  });

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Header with Account Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px', letterSpacing: '-0.5px' }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            {lastImportDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#10B98115', borderRadius: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>
                  Last import: {new Date(lastImportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', background: theme.bgCard, padding: '4px', borderRadius: '12px', boxShadow: theme.cardShadow }}>
          {[{ id: 'all', label: 'All Accounts', icon: '📊' }, { id: 'personal', label: 'Personal', icon: '👤' }, { id: 'sidehustle', label: 'Side Hustle', icon: '💼' }].map(acc => (
            <button key={acc.id} onClick={() => setActiveAccount(acc.id)} style={{
              padding: '10px 16px', border: 'none', borderRadius: '10px',
              background: activeAccount === acc.id ? theme.primary : 'transparent',
              color: activeAccount === acc.id ? 'white' : theme.textSecondary,
              fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
            }}><span>{acc.icon}</span>{acc.label}</button>
          ))}
        </div>
      </div>

      {/* Top Stats Row - OrbitNest Style (Image 1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {/* Revenue/Income Card */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>💰</span>
            <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '500' }}>Revenue</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px' }}>{formatCurrency(activeTotals.income)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: theme.textMuted }}>From last month</span>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '10px' }}>↗</span> 25%
                </span>
              </div>
            </div>
            <Sparkline data={monthlyData.map(m => m.income)} color="#10B981" width={70} height={40} />
          </div>
        </div>

        {/* Costs/Expenses Card */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>💳</span>
            <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '500' }}>Costs</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px' }}>{formatCurrency(activeTotals.expenses)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: theme.textMuted }}>From last month</span>
                <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '10px' }}>↘</span> 5%
                </span>
              </div>
            </div>
            <Sparkline data={monthlyData.map(m => m.expenses)} color="#EF4444" width={70} height={40} />
          </div>
        </div>

        {/* Profits/Net Card */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '500' }}>Profits</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px' }}>{formatCurrency(Math.abs(activeTotals.net))}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: theme.textMuted }}>From last month</span>
                <span style={{ fontSize: '12px', color: activeTotals.net >= 0 ? '#10B981' : '#EF4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '10px' }}>{activeTotals.net >= 0 ? '↗' : '↘'}</span> 15%
                </span>
              </div>
            </div>
            <Sparkline data={monthlyData.map(m => m.income - m.expenses)} color={activeTotals.net >= 0 ? '#10B981' : '#EF4444'} width={70} height={40} />
          </div>
        </div>

        {/* Shipments/Transactions Card */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>📦</span>
            <span style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '500' }}>Transactions</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px' }}>{transactions.length.toLocaleString()}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: theme.textMuted }}>From last month</span>
                <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '10px' }}>↘</span> 10%
                </span>
              </div>
            </div>
            {/* Mini bar chart for transactions */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '40px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={i} style={{
                  width: '8px',
                  height: `${15 + Math.random() * 25}px`,
                  background: i === 3 ? '#6366F1' : '#E0E7FF',
                  borderRadius: '2px'
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Row - Line Chart + Health Gauge */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Yearly Order Rate / Income vs Expenses (Image 2) */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Yearly Order Rate</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06B6D4' }} />
                <span style={{ fontSize: '13px', color: theme.textMuted }}>Week</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }} />
                <span style={{ fontSize: '13px', color: theme.textMuted }}>Month</span>
              </div>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  border: `1px solid ${theme.borderLight}`, 
                  background: theme.bgMain,
                  fontSize: '13px',
                  color: theme.textPrimary,
                  cursor: 'pointer'
                }}
              >
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
          </div>
          <LineChart data={monthlyData} height={260} />
        </div>

        {/* Financial Health / Progress Gauge (Image 3) */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Progress</h3>
            <button style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', fontSize: '18px' }}>⋮</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <ProgressGauge score={healthScore} size={200} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B82F6' }} />
                <span style={{ fontSize: '12px', color: theme.textMuted }}>Completed</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{healthyTasks.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: theme.textMuted }}>Total tasks</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06B6D4' }} />
                <span style={{ fontSize: '12px', color: theme.textMuted }}>In Progress</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{progressTasks.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: theme.textMuted }}>Total tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Spending & Budget Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Budget Progress - Bar Chart (Image 4) */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ flex: 1, paddingRight: '20px' }}>
              <p style={{ fontSize: '13px', color: theme.textMuted, margin: '0 0 12px', lineHeight: '1.5' }}>
                Track your income vs expenses over the past 6 months to understand your financial trends.
              </p>
            </div>
            <button style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', background: theme.bgMain, border: `1px solid ${theme.borderLight}`,
              borderRadius: '8px', fontSize: '13px', color: theme.textPrimary, cursor: 'pointer', fontWeight: '500'
            }}>
              Download Report <span>📥</span>
            </button>
          </div>
          <BarChart data={monthlyData} height={220} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366F1' }} />
              <span style={{ fontSize: '13px', color: theme.textMuted }}>Income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#C7D2FE' }} />
              <span style={{ fontSize: '13px', color: theme.textMuted }}>Expenses</span>
            </div>
          </div>
        </div>

        {/* Spending Breakdown (Image 5) */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Spending</h3>
            <button style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', fontSize: '18px' }}>⋮</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Left side - List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {spendingCards.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '4px', height: '40px', borderRadius: '2px', background: item.color }} />
                  <div>
                    <div style={{ fontSize: '13px', color: theme.textMuted }}>{item.category}</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>
                      {formatCurrency(item.spent)} <span style={{ fontSize: '13px', color: theme.textMuted, fontWeight: '400' }}>/{formatCurrency(item.budget)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Right side - Colored cards with circular progress */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {spendingCards.map((item, i) => (
                <div key={i} style={{ 
                  background: item.bgColor, 
                  borderRadius: '12px', 
                  padding: '16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '100px'
                }}>
                  {/* Circular progress */}
                  <svg width="50" height="50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                    <circle 
                      cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="4"
                      strokeDasharray={`${item.percent * 1.26} 126`}
                      strokeLinecap="round"
                      transform="rotate(-90 25 25)"
                    />
                    <text x="25" y="29" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">{Math.round(item.percent)}%</text>
                  </svg>
                  <div style={{ fontSize: '11px', color: 'white', marginTop: '8px', textAlign: 'center', opacity: 0.9 }}>
                    {item.category.length > 12 ? item.category.slice(0, 12) + '...' : item.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Transactions Table (Image 6) */}
      <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}`, marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Latest Transactions</h3>
          <button style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', fontSize: '18px' }}>⋮</button>
        </div>
        
        {/* Filter Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Search User</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }}>🔍</span>
              <input 
                type="text" 
                placeholder="Enter name"
                value={txnSearchQuery}
                onChange={(e) => setTxnSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px 10px 36px', 
                  border: `1px solid ${theme.borderLight}`, 
                  borderRadius: '8px', 
                  fontSize: '13px',
                  background: theme.bgMain,
                  color: theme.textPrimary,
                  boxSizing: 'border-box'
                }} 
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Date</label>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 12px', border: `1px solid ${theme.borderLight}`, borderRadius: '8px', background: theme.bgMain
            }}>
              <span>📅</span>
              <span style={{ fontSize: '13px', color: theme.textMuted }}>DD/MM/YYY</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Category</label>
            <select style={{ 
              width: '100%', padding: '10px 12px', border: `1px solid ${theme.borderLight}`, borderRadius: '8px', 
              fontSize: '13px', background: theme.bgMain, color: theme.textMuted, cursor: 'pointer', boxSizing: 'border-box'
            }}>
              <option>Select</option>
              {Object.keys(categorySpending).map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Status</label>
            <select 
              value={txnStatusFilter}
              onChange={(e) => setTxnStatusFilter(e.target.value)}
              style={{ 
                width: '100%', padding: '10px 12px', border: `1px solid ${theme.borderLight}`, borderRadius: '8px', 
                fontSize: '13px', background: theme.bgMain, color: theme.textMuted, cursor: 'pointer', boxSizing: 'border-box'
              }}
            >
              <option value="">Select</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
        
        {/* Table */}
        {recentTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: theme.textMuted }}>No transactions yet</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: theme.textMuted, width: '40px' }}>
                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>
                    Order ID <span style={{ opacity: 0.5 }}>⇅</span>
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>
                    Description <span style={{ opacity: 0.5 }}>⇅</span>
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Date</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>
                    Amount <span style={{ opacity: 0.5 }}>⇅</span>
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px', fontWeight: '500', color: theme.textMuted, width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t, i) => {
                  const isIncome = parseFloat(t.amount) > 0;
                  const status = isIncome ? 'Paid' : (t.status || (i % 3 === 0 ? 'Pending' : i % 5 === 0 ? 'Refunded' : 'Paid'));
                  const statusColors = {
                    'Paid': { bg: '#D1FAE5', color: '#059669', dot: '#10B981' },
                    'Pending': { bg: '#FEF3C7', color: '#D97706', dot: '#F59E0B' },
                    'Refunded': { bg: '#FEE2E2', color: '#DC2626', dot: '#EF4444' }
                  };
                  const statusStyle = statusColors[status] || statusColors['Paid'];
                  
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                      <td style={{ padding: '16px 8px' }}>
                        <input type="checkbox" style={{ cursor: 'pointer' }} />
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ color: theme.primary, fontWeight: '500', fontSize: '14px' }}>#{(2948592 + i).toString()}</span>
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', color: theme.textPrimary }}>
                        {t.description.slice(0, 30)}{t.description.length > 30 ? '...' : ''}
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', color: theme.textMuted }}>{t.date}</td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>
                        {formatCurrency(Math.abs(parseFloat(t.amount)))}
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '4px 12px', borderRadius: '20px', 
                          background: statusStyle.bg, color: statusStyle.color, 
                          fontSize: '12px', fontWeight: '500'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.dot }} />
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                        <button style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', fontSize: '16px' }}>ⓘ</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <span style={{ fontSize: '13px', color: theme.textMuted }}>Showing {recentTransactions.length} of {transactions.length} data</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button style={{ padding: '8px 12px', border: `1px solid ${theme.borderLight}`, borderRadius: '6px', background: theme.bgMain, color: theme.textMuted, fontSize: '13px', cursor: 'pointer' }}>Previous</button>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <button key={n} style={{ 
                    width: '32px', height: '32px', border: n === 1 ? 'none' : `1px solid ${theme.borderLight}`, 
                    borderRadius: '6px', background: n === 1 ? theme.primary : theme.bgMain, 
                    color: n === 1 ? 'white' : theme.textMuted, fontSize: '13px', cursor: 'pointer', fontWeight: n === 1 ? '600' : '400'
                  }}>{n}</button>
                ))}
                <button style={{ padding: '8px 12px', border: `1px solid ${theme.borderLight}`, borderRadius: '6px', background: theme.bgMain, color: theme.textMuted, fontSize: '13px', cursor: 'pointer' }}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bills & Goals Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Upcoming Bills</h3>
            <span style={{ padding: '4px 10px', background: '#FEE2E2', color: '#DC2626', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{upcomingBills.length} due soon</span>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {upcomingBills.map((bill, i) => {
              const dueDate = new Date(bill.dueDate);
              const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '12px', background: theme.bgMain, border: daysUntil <= 3 ? '1px solid #FCA5A5' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{bill.icon || '📄'}</div>
                    <div><div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{bill.name}</div><div style={{ fontSize: '12px', color: daysUntil <= 3 ? '#DC2626' : theme.textMuted }}>{daysUntil <= 0 ? 'Due today!' : daysUntil === 1 ? 'Due tomorrow' : `Due in ${daysUntil} days`}</div></div>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: theme.textPrimary }}>${bill.amount.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Savings Goals</h3>
            <button style={{ background: 'none', border: 'none', color: theme.primary, fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>View All →</button>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {displayGoals.map((goal, i) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={i} style={{ padding: '12px', background: theme.bgMain, borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${goal.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{goal.icon}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{goal.name}</div><div style={{ fontSize: '12px', color: theme.textMuted }}>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</div></div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: goal.color }}>{progress.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: '6px', background: theme.borderLight, borderRadius: '3px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${progress}%`, background: goal.color, borderRadius: '3px' }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {transactions.length === 0 && (
        <div style={{ marginTop: '24px', background: theme.bgCard, borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '25px', background: `linear-gradient(135deg, ${theme.primary}15, ${theme.primary}25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '48px' }}>📊</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', color: theme.textPrimary, marginBottom: '12px' }}>Ready to Take Control?</h3>
          <p style={{ color: theme.textMuted, marginBottom: '8px', maxWidth: '400px', margin: '0 auto 20px', lineHeight: '1.6', fontSize: '15px' }}>Import your bank statements to unlock powerful insights, track your spending, and reach your financial goals.</p>
          <p style={{ color: theme.textSecondary, fontSize: '14px' }}>Go to <span style={{ color: theme.primary, fontWeight: '600' }}>Import</span> in the sidebar to upload your files.</p>
        </div>
      )}
    </div>
  );
}
// ============================================================================
// TRANSACTIONS TAB - DASHSTACK TABLE STYLE
// ============================================================================
function TransactionsTabDS({ transactions, onNavigateToImport, theme }) {
  const [filter, setFilter] = useState({ date: '', type: '', status: '' });

  const getStatusBadge = (status) => {
    const styles = {
      'Posted': { bg: '#D1FAE5', color: '#059669', text: 'Completed' },
      'Pending': { bg: '#DBEAFE', color: '#2563EB', text: 'Processing' },
      'Failed': { bg: '#FEE2E2', color: '#DC2626', text: 'Rejected' },
    };
    const style = styles[status] || styles['Posted'];
    return (
      <span style={{ padding: '6px 12px', borderRadius: '20px', background: style.bg, color: style.color, fontSize: '12px', fontWeight: '500' }}>
        {style.text}
      </span>
    );
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary, marginBottom: '24px' }}>Transactions</h1>

      {/* Filter Bar */}
      <div style={{ background: theme.bgCard, borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary }}>
          <Icons.Filter />
          <span style={{ fontWeight: '500' }}>Filter By</span>
        </div>

        <select style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.inputBg, fontSize: '14px', color: theme.textPrimary, cursor: 'pointer' }}>
          <option>Date</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>

        <select style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.inputBg, fontSize: '14px', color: theme.textPrimary, cursor: 'pointer' }}>
          <option>Type</option>
          <option>Income</option>
          <option>Expense</option>
        </select>

        <select style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.inputBg, fontSize: '14px', color: theme.textPrimary, cursor: 'pointer' }}>
          <option>Category</option>
          <option>Food</option>
          <option>Shopping</option>
          <option>Transport</option>
        </select>

        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.danger, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginLeft: 'auto' }}>
          <Icons.Refresh />
          Reset Filter
        </button>
      </div>

      {/* Table */}
      <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: theme.bgMain }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Description</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Amount</th>
              <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '80px 20px', textAlign: 'center', color: theme.textMuted }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '16px', 
                    background: `linear-gradient(135deg, ${theme.primary}10, ${theme.primary}20)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', fontSize: '28px'
                  }}>
                    📋
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: theme.textPrimary, marginBottom: '8px' }}>No transactions yet</div>
                  <div style={{ fontSize: '14px', color: theme.textMuted }}>
                    Visit the <span style={{ color: theme.primary, fontWeight: '500' }}>Import</span> tab to upload your bank statements
                  </div>
                </td>
              </tr>
            ) : (
              transactions.slice(0, 10).map((t, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textPrimary }}>{t.date}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textPrimary }}>{t.description.slice(0, 40)}...</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textSecondary }}>{t.category}</td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: parseFloat(t.amount) > 0 ? theme.success : theme.danger, textAlign: 'right' }}>
                    {parseFloat(t.amount) > 0 ? '+' : ''}{formatCurrency(t.amount)}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    {getStatusBadge(t.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {transactions.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: theme.textMuted }}>Showing 1-{Math.min(10, transactions.length)} of {transactions.length}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ width: '36px', height: '36px', border: `1px solid ${theme.border}`, borderRadius: '8px', background: theme.bgCard, color: theme.textPrimary, cursor: 'pointer' }}>‹</button>
              <button style={{ width: '36px', height: '36px', border: `1px solid ${theme.border}`, borderRadius: '8px', background: theme.bgCard, color: theme.textPrimary, cursor: 'pointer' }}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ============================================================================
// IMPORT TAB - DASHSTACK STYLE
// ============================================================================
function ImportTabDS({ onImport, parseCSV, transactionCount, theme }) {
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState('transactions');
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
        setImportResult({ success: true, count: transactions.length, fileName: file.name });
      } else {
        setImportResult({ success: false, error: 'No valid transactions found in file' });
      }
    } catch (error) {
      setImportResult({ success: false, error: error.message });
    }
    setImporting(false);
  };

  const fileTypes = [
    { 
      id: 'transactions', 
      icon: '🏦', 
      title: 'Bank Transactions', 
      desc: 'Import checking, savings, or credit card statements',
      formats: ['CSV', 'XLSX', 'XLS'],
      color: '#007AFF'
    },
    { 
      id: 'retirement', 
      icon: '📈', 
      title: 'Retirement Accounts', 
      desc: 'Import 401(k), IRA, or brokerage statements',
      formats: ['CSV', 'XLSX', 'XLS'],
      color: '#34C759'
    },
    { 
      id: 'investments', 
      icon: '💼', 
      title: 'Investment Portfolio', 
      desc: 'Import stocks, bonds, or mutual fund data',
      formats: ['CSV', 'XLSX'],
      color: '#AF52DE',
      comingSoon: true
    }
  ];

  const supportedBanks = [
    { name: 'Chase', logo: '🔵' },
    { name: 'Bank of America', logo: '🔴' },
    { name: 'Wells Fargo', logo: '🟡' },
    { name: 'Citi', logo: '🔵' },
    { name: 'Capital One', logo: '🔴' },
    { name: 'US Bank', logo: '🟣' },
    { name: 'PNC', logo: '🟠' },
    { name: 'TD Bank', logo: '🟢' }
  ];

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          marginBottom: '8px',
          letterSpacing: '-0.5px'
        }}>
          Import Your Data
        </h1>
        <p style={{ fontSize: '17px', color: theme.textSecondary, lineHeight: '1.5' }}>
          Upload your financial statements to unlock powerful insights and track your progress.
        </p>
      </div>

      {/* Stats Banner */}
      <div style={{ 
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.mode === 'dark' ? '#6D28D9' : '#818CF8'})`,
        borderRadius: '20px', 
        padding: '28px 32px', 
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 40px rgba(79, 70, 229, 0.3)'
      }}>
        <div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px', fontWeight: '500' }}>
            Currently Tracking
          </div>
          <div style={{ fontSize: '42px', fontWeight: '700', color: 'white', letterSpacing: '-1px' }}>
            {transactionCount.toLocaleString()}
            <span style={{ fontSize: '18px', fontWeight: '400', marginLeft: '8px', opacity: 0.8 }}>transactions</span>
          </div>
        </div>
        {transactionCount > 0 && (
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            backdropFilter: 'blur(10px)',
            padding: '12px 20px', 
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>✓</span>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>Data Synced</span>
          </div>
        )}
      </div>

      {/* File Type Selection */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          What would you like to import?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {fileTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => !type.comingSoon && setSelectedFileType(type.id)}
              style={{
                background: selectedFileType === type.id 
                  ? (theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : '#EEF2FF')
                  : theme.bgCard,
                border: `2px solid ${selectedFileType === type.id ? theme.primary : theme.borderLight}`,
                borderRadius: '16px',
                padding: '24px',
                cursor: type.comingSoon ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: type.comingSoon ? 0.5 : 1,
                position: 'relative'
              }}
            >
              {type.comingSoon && (
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: theme.textMuted,
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  Coming Soon
                </span>
              )}
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px',
                background: `${type.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px'
              }}>
                {type.icon}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '4px' }}>
                {type.title}
              </div>
              <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '12px', lineHeight: '1.4' }}>
                {type.desc}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {type.formats.map((format) => (
                  <span key={format} style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: theme.textSecondary,
                    background: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {format}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: dragOver 
            ? (theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : '#EEF2FF') 
            : theme.bgCard,
          border: `2px dashed ${dragOver ? theme.primary : theme.border}`,
          borderRadius: '24px',
          padding: '64px 40px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '32px',
          transition: 'all 0.3s ease',
          boxShadow: dragOver ? `0 0 0 4px ${theme.primary}20` : theme.cardShadow
        }}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".csv,.xlsx,.xls" 
          onChange={(e) => handleFile(e.target.files[0])} 
          style={{ display: 'none' }} 
        />

        {importing ? (
          <div>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.primary}20, ${theme.primary}40)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <div style={{ fontSize: '36px' }}>⏳</div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>
              Processing your file...
            </div>
            <div style={{ color: theme.textMuted }}>This may take a moment</div>
          </div>
        ) : (
          <div>
            <div style={{ 
              width: '88px', 
              height: '88px', 
              borderRadius: '22px',
              background: `linear-gradient(135deg, ${theme.primary}10, ${theme.primary}25)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              transition: 'transform 0.2s ease'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>
              Drop your file here
            </div>
            <div style={{ color: theme.textMuted, marginBottom: '24px', fontSize: '15px' }}>
              or click to browse from your computer
            </div>
            <button style={{ 
              padding: '14px 36px', 
              background: theme.primary, 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${theme.primary}40`,
              transition: 'all 0.2s ease'
            }}>
              Choose File
            </button>
            <div style={{ marginTop: '20px', fontSize: '13px', color: theme.textMuted }}>
              Supports CSV, XLSX, and XLS formats • Max 10MB
            </div>
          </div>
        )}
      </div>

      {/* Import Result */}
      {importResult && (
        <div style={{
          background: importResult.success 
            ? (theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5')
            : (theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2'),
          border: `1px solid ${importResult.success ? '#A7F3D0' : '#FECACA'}`,
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%',
            background: importResult.success ? '#D1FAE5' : '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0
          }}>
            {importResult.success ? '✓' : '✕'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontWeight: '600', 
              fontSize: '16px',
              color: importResult.success ? '#059669' : '#DC2626',
              marginBottom: '2px'
            }}>
              {importResult.success ? 'Import Successful!' : 'Import Failed'}
            </div>
            <div style={{ fontSize: '14px', color: importResult.success ? '#047857' : '#B91C1C' }}>
              {importResult.success 
                ? `${importResult.count.toLocaleString()} transactions imported from ${importResult.fileName}`
                : importResult.error}
            </div>
          </div>
        </div>
      )}

      {/* Supported Banks */}
      <div style={{ 
        background: theme.bgCard, 
        borderRadius: '20px', 
        padding: '28px 32px',
        boxShadow: theme.cardShadow,
        border: `1px solid ${theme.borderLight}`
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textSecondary, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Works with all major banks
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {supportedBanks.map((bank, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              color: theme.textPrimary,
              fontWeight: '500'
            }}>
              <span>{bank.logo}</span>
              {bank.name}
            </div>
          ))}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            color: theme.textMuted,
            fontWeight: '500'
          }}>
            + Many more
          </div>
        </div>
      </div>
    </div>
  );
}
// ============================================================================
// SETTINGS TAB - DASHSTACK STYLE
// ============================================================================
function SettingsTabDS({ theme, isDarkMode, onToggleTheme, selectedLanguage, onLanguageChange, userAvatar, onAvatarChange, memojiAvatars, languages }) {
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [notifications, setNotifications] = useState({
    billReminders: true,
    goalProgress: true,
    budgetAlerts: true,
    weeklySummary: false
  });

  const settingsItems = [
    { icon: '🔗', title: 'Connected Accounts', desc: 'Manage your bank connections', comingSoon: true },
    { icon: '👨‍👩‍👧‍👦', title: 'Family Members', desc: 'Invite family to collaborate', comingSoon: true },
    { icon: '🔔', title: 'Notifications', desc: 'Bill reminders & alerts', action: () => setShowNotificationsModal(true) },
    { icon: '🎨', title: 'Appearance', desc: 'Theme & display options', isAppearance: true },
    { icon: '🌐', title: 'Language', desc: `Currently: ${selectedLanguage?.name || 'English'}`, action: () => setShowLanguageModal(true) },
    { icon: '😀', title: 'Profile Avatar', desc: 'Choose your avatar', action: () => setShowAvatarModal(true), isAvatar: true },
    { icon: '🔒', title: 'Security', desc: 'Password & 2FA settings', action: () => setShowPasswordModal(true) },
    { icon: '📤', title: 'Export Data', desc: 'Download your financial data', comingSoon: true }
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary, marginBottom: '24px' }}>Settings</h1>

      <div style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
        {settingsItems.map((item, i) => (
          <div 
            key={i} 
            onClick={item.action}
            style={{
              background: theme.bgCard,
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: item.comingSoon ? 'default' : 'pointer',
              boxShadow: theme.cardShadow,
              border: `1px solid ${theme.borderLight}`,
              opacity: item.comingSoon ? 0.7 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: theme.bgMain, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {item.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '600', color: theme.textPrimary }}>{item.title}</span>
                  {item.comingSoon && (
                    <span style={{ background: theme.warning, color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600' }}>
                      Coming Soon
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: theme.textMuted }}>{item.desc}</div>
              </div>
            </div>
            {item.isAppearance ? (
              <div 
                onClick={(e) => { e.stopPropagation(); onToggleTheme && onToggleTheme(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : '#F5F6FA',
                  border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : '#E5E7EB'}`,
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                <span>{isDarkMode ? '🌙' : '☀️'}</span>
                <div style={{
                  width: '36px',
                  height: '20px',
                  background: isDarkMode ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : '#E5E7EB',
                  borderRadius: '10px',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: isDarkMode ? '18px' : '2px',
                    transition: 'left 0.3s ease'
                  }} />
                </div>
              </div>
            ) : item.isAvatar ? (
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: `${theme.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                border: `2px solid ${theme.primary}40`
              }}>
                {userAvatar || '👨‍💼'}
              </div>
            ) : (
              <span style={{ color: theme.textMuted }}>›</span>
            )}
          </div>
        ))}
      </div>

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', width: '400px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px' }}>🔔 Notification Settings</h3>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                <span style={{ color: theme.textPrimary, fontSize: '14px' }}>
                  {key === 'billReminders' && 'Bill Reminders'}
                  {key === 'goalProgress' && 'Goal Progress Updates'}
                  {key === 'budgetAlerts' && 'Budget Alerts'}
                  {key === 'weeklySummary' && 'Weekly Summary Email'}
                </span>
                <div 
                  onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                  style={{
                    width: '44px',
                    height: '24px',
                    background: value ? theme.success : theme.border,
                    borderRadius: '12px',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: value ? '22px' : '2px',
                    transition: 'left 0.2s ease'
                  }} />
                </div>
              </div>
            ))}
            <button 
              onClick={() => setShowNotificationsModal(false)}
              style={{ width: '100%', padding: '12px', background: theme.primary, color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', width: '400px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px' }}>🔒 Change Password</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Current Password</label>
              <input type="password" style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>New Password</label>
              <input type="password" style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Confirm New Password</label>
              <input type="password" style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowPasswordModal(false)}
                style={{ flex: 1, padding: '12px', background: theme.bgMain, color: theme.textPrimary, border: `1px solid ${theme.border}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowPasswordModal(false)}
                style={{ flex: 1, padding: '12px', background: theme.primary, color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', width: '400px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px' }}>🌐 Select Language</h3>
            <div style={{ display: 'grid', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {(languages || []).map(lang => (
                <div
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange && onLanguageChange(lang);
                    setShowLanguageModal(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    background: selectedLanguage?.code === lang.code ? `${theme.primary}15` : theme.bgMain,
                    border: selectedLanguage?.code === lang.code ? `2px solid ${theme.primary}` : `1px solid ${theme.borderLight}`,
                    borderRadius: '10px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{lang.flag}</span>
                  <span style={{ fontSize: '15px', fontWeight: '500', color: theme.textPrimary }}>{lang.name}</span>
                  {selectedLanguage?.code === lang.code && (
                    <span style={{ marginLeft: 'auto', color: theme.primary }}>✓</span>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowLanguageModal(false)}
              style={{ width: '100%', padding: '12px', background: theme.bgMain, color: theme.textPrimary, border: `1px solid ${theme.border}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', width: '500px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px' }}>😀 Choose Your Avatar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', maxHeight: '300px', overflowY: 'auto', padding: '8px' }}>
              {(memojiAvatars || []).map((emoji, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onAvatarChange && onAvatarChange(emoji);
                    setShowAvatarModal(false);
                  }}
                  style={{
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    cursor: 'pointer',
                    background: userAvatar === emoji ? `${theme.primary}20` : theme.bgMain,
                    border: userAvatar === emoji ? `2px solid ${theme.primary}` : `1px solid ${theme.borderLight}`,
                    borderRadius: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowAvatarModal(false)}
              style={{ width: '100%', padding: '12px', background: theme.bgMain, color: theme.textPrimary, border: `1px solid ${theme.border}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}
            >
              Close
            </button>
          </div>
        </div>
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
