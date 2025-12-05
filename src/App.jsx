import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import BizBudgetHub from './components/BizBudgetHub';
import RealEstateCommandCenter from './components/RealEstateCommandCenter';
import ProsperNestLandingV4 from './components/ProsperNestLandingV4';
// Default data - baked in from real bank/retirement imports
import { DEFAULT_TRANSACTIONS, DEFAULT_RETIREMENT_DATA } from './data/defaultData';

// ============================================================================
// SITE STATUS INDICATOR COMPONENT - Shows online/offline status
// ============================================================================
function SiteStatusIndicator({ showLabel = true, darkMode = true }) {
  const [status, setStatus] = useState('online'); // Default to online since site loaded
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // Simple and reliable: if we're here, the site works
    // Only track actual browser online/offline events
    const handleOnline = () => setStatus('online');
    const handleOffline = () => setStatus('offline');
    
    // Check initial state
    if (!navigator.onLine) {
      setStatus('offline');
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const statusConfig = {
    online: { color: '#10B981', label: 'Online', dot: '●' },
    offline: { color: '#EF4444', label: 'Offline', dot: '●' },
    degraded: { color: '#F59E0B', label: 'Issues', dot: '●' },
    checking: { color: '#6B7280', label: 'Checking...', dot: '○' }
  };
  
  const config = statusConfig[status];
  const isClickable = status === 'offline' || status === 'degraded';
  
  return (
    <>
      <button
        onClick={() => isClickable && setShowModal(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: showLabel ? '6px' : '0',
          padding: showLabel ? '6px 12px' : '0',
          background: showLabel ? (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
          border: showLabel ? `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}` : 'none',
          borderRadius: '20px',
          cursor: isClickable ? 'pointer' : 'default',
          transition: 'all 0.2s',
          flexShrink: 0
        }}
        title={`Site Status: ${config.label}`}
      >
        <span style={{ 
          color: config.color, 
          fontSize: showLabel ? '10px' : '7px',
          lineHeight: 1,
          flexShrink: 0
        }}>
          {config.dot}
        </span>
        {showLabel && (
          <span style={{ 
            color: config.color, 
            fontSize: '12px', 
            fontWeight: '500' 
          }}>
            {config.label}
          </span>
        )}
      </button>
      
      {/* Site Status Modal */}
      {showModal && (
        <SiteStatusModal status={status} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

// ============================================================================
// SITE STATUS MODAL - Shows when there are connection issues
// ============================================================================
function SiteStatusModal({ status, onClose }) {
  const statusMessages = {
    offline: {
      title: "You're Currently Offline",
      message: "It looks like you've lost your internet connection. Please check your network settings and try again.",
      icon: '📡',
      tips: [
        'Check your WiFi or mobile data connection',
        'Try refreshing the page once you\'re back online',
        'Your data is safely stored and will sync when connected'
      ]
    },
    degraded: {
      title: "Service Temporarily Degraded",
      message: "We're experiencing some technical difficulties. Our team has been notified and is actively working to resolve this issue.",
      icon: '🔧',
      tips: [
        'Some features may be slower than usual',
        'Your data is safe and secure',
        'We expect full service to resume shortly'
      ]
    }
  };
  
  const content = statusMessages[status] || statusMessages.degraded;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 100%)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '480px',
        width: '100%',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
        
        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: status === 'offline' 
            ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
            : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          margin: '0 auto 24px',
          boxShadow: status === 'offline'
            ? '0 8px 32px rgba(239, 68, 68, 0.4)'
            : '0 8px 32px rgba(245, 158, 11, 0.4)'
        }}>
          {content.icon}
        </div>
        
        {/* Title */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'white',
          textAlign: 'center',
          marginBottom: '12px'
        }}>
          {content.title}
        </h2>
        
        {/* Message */}
        <p style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          {content.message}
        </p>
        
        {/* Tips */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            What you can do
          </div>
          {content.tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: i < content.tips.length - 1 ? '10px' : 0 }}>
              <span style={{ color: '#10B981', fontSize: '14px' }}>✓</span>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.4' }}>{tip}</span>
            </div>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              flex: 1,
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Page
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '14px 24px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
        
        {/* Status Badge */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.6)'
          }}>
            <span style={{ color: status === 'offline' ? '#EF4444' : '#F59E0B' }}>●</span>
            Issue being investigated
          </span>
        </div>
      </div>
    </div>
  );
}

// Export SiteStatusIndicator for use in other components
export { SiteStatusIndicator };
// ============================================================================
// PROSPERNEST - DASHSTACK UI DESIGN
// ============================================================================
// Theme colors - Light Mode (Modern Fintech - Rich Purple Sidebar)
const lightTheme = {
  mode: 'light',
  primary: '#6366F1', // Softer indigo
  primaryLight: '#A5B4FC',
  primaryDark: '#4F46E5',
  secondary: '#F472B6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0EA5E9',
  
  // Warm, soft backgrounds
  bgMain: '#F8FAFC', // Soft cool gray
  bgWhite: '#FFFFFF',
  bgCard: '#FFFFFF',
  bgWarm: '#FFFBF5', // Warm cream for accents
  
  textPrimary: '#1E293B', // Slate 800
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8', // Slate 400
  
  border: '#E2E8F0', // Slate 200
  borderLight: '#F1F5F9', // Slate 100
  
  // Rich purple/pink sidebar styling
  sidebarBg: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 40%, #3730A3 70%, #4338CA 100%)',
  sidebarActive: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
  sidebarText: 'rgba(255, 255, 255, 0.7)',
  sidebarActiveText: '#FFFFFF',
  sidebarGlow: 'rgba(236, 72, 153, 0.3)',
  sidebarAccent: '#A78BFA', // Light purple for accents
  sidebarMuted: 'rgba(255, 255, 255, 0.4)',
  
  // Header styling
  headerBg: 'linear-gradient(90deg, #FFFFFF 0%, #FAFBFF 50%, #FFFFFF 100%)',
  headerBorder: 'rgba(99, 102, 241, 0.08)',
  
  inputBg: '#F8FAFC',
  cardShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
  cardShadowHover: '0 4px 16px rgba(99, 102, 241, 0.12), 0 8px 32px rgba(0,0,0,0.06)',
  dropdownBg: '#FFFFFF',
  
  // Accent gradients for cards/elements
  accentGradient1: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', // Purple
  accentGradient2: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)', // Pink (changed from green)
  accentGradient3: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', // Blue
  accentGradient4: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', // Amber
  
  // Section Gradients - Light Mode (warm, subtle, premium)
  gradients: {
    dashboard: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 30%, #FDF4FF 60%, #F8FAFC 100%)',
    sales: 'linear-gradient(135deg, #FFFBEB 0%, #F8FAFC 40%, #ECFDF5 100%)',
    budget: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #F5F3FF 100%)',
    transactions: 'linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 40%, #EFF6FF 100%)',
    bills: 'linear-gradient(135deg, #FFF7ED 0%, #F8FAFC 50%, #FFFBEB 100%)',
    goals: 'linear-gradient(135deg, #F5F3FF 0%, #F8FAFC 40%, #FDF4FF 100%)',
    tasks: 'linear-gradient(135deg, #ECFEFF 0%, #F8FAFC 50%, #EEF2FF 100%)',
    retirement: 'linear-gradient(135deg, #ECFDF5 0%, #F8FAFC 50%, #EFF6FF 100%)',
    reports: 'linear-gradient(135deg, #FFFBEB 0%, #F8FAFC 40%, #F5F3FF 100%)',
    settings: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #F8FAFC 100%)',
    import: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #ECFDF5 100%)'
  }
};

// Theme colors - Dark Mode (Modern Fintech - Rich Navy)
const darkTheme = {
  mode: 'dark',
  primary: '#818CF8', // Lighter indigo for dark mode
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',
  secondary: '#F472B6',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#38BDF8',
  
  // Rich navy backgrounds
  bgMain: '#0F172A', // Slate 900
  bgWhite: '#1E293B', // Slate 800
  bgCard: '#1E293B',
  bgWarm: '#1E293B',
  
  textPrimary: '#F1F5F9', // Slate 100
  textSecondary: '#94A3B8', // Slate 400
  textMuted: '#64748B', // Slate 500
  
  border: 'rgba(148, 163, 184, 0.1)', // Slate with opacity
  borderLight: 'rgba(148, 163, 184, 0.05)',
  
  // Premium sidebar styling - rich gradient
  sidebarBg: 'linear-gradient(180deg, #1E293B 0%, #0F172A 50%, #0F172A 100%)',
  sidebarActive: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
  sidebarText: '#94A3B8',
  sidebarActiveText: '#FFFFFF',
  sidebarGlow: 'rgba(129, 140, 248, 0.2)',
  
  // Header styling
  headerBg: 'linear-gradient(90deg, #1E293B 0%, #1E293B 100%)',
  headerBorder: 'rgba(148, 163, 184, 0.1)',
  
  inputBg: 'rgba(148, 163, 184, 0.05)',
  cardShadow: '0 4px 20px rgba(0,0,0,0.25)',
  cardShadowHover: '0 8px 32px rgba(0,0,0,0.35)',
  dropdownBg: '#1E293B',
  
  // Accent gradients
  accentGradient1: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)',
  accentGradient2: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
  accentGradient3: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)',
  accentGradient4: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
  
  // Section Gradients - Dark Mode (rich, subtle color pops)
  gradients: {
    dashboard: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 30%, #1E293B 70%, #0F172A 100%)',
    sales: 'linear-gradient(135deg, #1C1917 0%, #0F172A 40%, #14532D 100%)',
    budget: 'linear-gradient(135deg, #1E3A5F 0%, #0F172A 50%, #2E1065 100%)',
    transactions: 'linear-gradient(135deg, #14532D 0%, #0F172A 40%, #1E3A5F 100%)',
    bills: 'linear-gradient(135deg, #7C2D12 0%, #0F172A 50%, #1C1917 100%)',
    goals: 'linear-gradient(135deg, #2E1065 0%, #0F172A 40%, #831843 100%)',
    tasks: 'linear-gradient(135deg, #164E63 0%, #0F172A 50%, #1E1B4B 100%)',
    retirement: 'linear-gradient(135deg, #14532D 0%, #0F172A 50%, #1E3A5F 100%)',
    reports: 'linear-gradient(135deg, #1C1917 0%, #0F172A 40%, #2E1065 100%)',
    settings: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #1E293B 100%)',
    import: 'linear-gradient(135deg, #1E3A5F 0%, #0F172A 50%, #14532D 100%)'
  }
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
  Tasks: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
      <line x1="12" y1="2" x2="12" y2="12"/>
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
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  // Hub Icons
  HomeBudgetHub: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  BizBudgetHub: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  REBudgetHub: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Crown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 8L6 19H18L22 8L17 12L12 5L7 12L2 8Z"/>
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
        <stop offset="0%" stopColor="#FFE135" />
        <stop offset="50%" stopColor="#FFEC8B" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
      <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
      </filter>
    </defs>
    {/* Main coin body */}
    <circle cx="32" cy="32" r="28" fill="url(#coinGrad)" filter="url(#coinShadow)"/>
    {/* Inner ring */}
    <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    {/* Dollar sign on forehead */}
    <text x="32" y="18" textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold" fontFamily="Arial">$</text>
    {/* Eyes */}
    <ellipse cx="24" cy="28" rx="3" ry="3.5" fill="#1a1a1a"/>
    <ellipse cx="40" cy="28" rx="3" ry="3.5" fill="#1a1a1a"/>
    {/* Eye shine */}
    <ellipse cx="25" cy="27" rx="1.2" ry="1.2" fill="#FFFFFF"/>
    <ellipse cx="41" cy="27" rx="1.2" ry="1.2" fill="#FFFFFF"/>
    {/* Smile */}
    <path d="M24 40 Q32 46 40 40" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Rosy cheeks */}
    <ellipse cx="17" cy="34" rx="3.5" ry="2.5" fill="#FFCCCB" opacity="0.5"/>
    <ellipse cx="47" cy="34" rx="3.5" ry="2.5" fill="#FFCCCB" opacity="0.5"/>
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

// ============================================================================
// USER ROLES & PERMISSIONS - Industry Standard RBAC
// ============================================================================
const USER_ROLES = {
  OWNER: 'owner',           // You (kennedymichael54@gmail.com) - Full access + sees demo data
  ADMIN: 'admin',           // Admin users - Full access, can manage users
  TESTER: 'tester',         // Tester users - Read-only, watermarked, limited features
  HOMEVESTORS: 'homevestors', // HomeVestors franchise team - Perpetual license, BizBudget access
  FAMILY: 'family',         // Family plan users - Full access to all features
  PRO: 'pro',               // Pro plan users - Most features
  STARTER: 'starter',       // Starter/Free users - Basic features
};

// Special account emails for role assignment
const SPECIAL_ACCOUNTS = {
  'kennedymichael54@gmail.com': USER_ROLES.OWNER,
  'admin@prospernest.app': USER_ROLES.ADMIN,
  'tester@prospernest.app': USER_ROLES.TESTER,
  // HomeVestors Franchise Team - Perpetual Licenses (never expire, never charged)
  'michael.kennedy@homevestors.com': USER_ROLES.HOMEVESTORS,
  'anthony.montgomery@homevestors.com': USER_ROLES.HOMEVESTORS,
  'tucker.pate@homevestors.com': USER_ROLES.HOMEVESTORS,
};

// Users with perpetual licenses (never expire, never charged)
const PERPETUAL_LICENSE_USERS = [
  'kennedymichael54@gmail.com',
  'admin@prospernest.app',
  'tester@prospernest.app',
  'michael.kennedy@homevestors.com',
  'anthony.montgomery@homevestors.com',
  'tucker.pate@homevestors.com',
  'alecias0415@gmail.com', // Alecia Matheson - HomeBudget Hub tester
];

// Users with BizBudget Hub access
const BIZBUDGET_ACCESS_USERS = [
  'kennedymichael54@gmail.com',
  'admin@prospernest.app',
  'tester@prospernest.app',
  'michael.kennedy@homevestors.com',
  'anthony.montgomery@homevestors.com',
  'tucker.pate@homevestors.com',
];

// Feature permissions by role
const ROLE_PERMISSIONS = {
  [USER_ROLES.OWNER]: {
    canViewAllTabs: true,
    canEditData: true,
    canDeleteData: true,
    canExport: true,
    canImport: true,
    canManageUsers: true,
    canViewAdminPanel: true,
    canViewAnalytics: true,
    canAccessRetirement: true,
    canAccessSalesTracker: true,
    canAccessReports: true,
    canAccessBizBudget: true,
    canModifySettings: true,
    showDemoData: true,
    watermark: false,
    perpetualLicense: true,
    maxTransactions: Infinity,
    maxGoals: Infinity,
    maxBills: Infinity,
  },
  [USER_ROLES.ADMIN]: {
    canViewAllTabs: true,
    canEditData: true,
    canDeleteData: true,
    canExport: true,
    canImport: true,
    canManageUsers: true,
    canViewAdminPanel: true,
    canViewAnalytics: true,
    canAccessRetirement: true,
    canAccessSalesTracker: true,
    canAccessReports: true,
    canAccessBizBudget: true,
    canModifySettings: true,
    showDemoData: false,
    watermark: false,
    perpetualLicense: true,
    maxTransactions: Infinity,
    maxGoals: Infinity,
    maxBills: Infinity,
  },
  [USER_ROLES.TESTER]: {
    canViewAllTabs: true,
    canEditData: false,        // Read-only
    canDeleteData: false,      // No delete
    canExport: false,          // No export
    canImport: false,          // No import
    canManageUsers: false,
    canViewAdminPanel: false,
    canViewAnalytics: true,    // Can view but not modify
    canAccessRetirement: true,
    canAccessSalesTracker: true,
    canAccessReports: true,
    canAccessBizBudget: true,
    canModifySettings: false,  // Cannot change settings
    showDemoData: false,
    watermark: true,           // Shows "TEST MODE" watermark
    perpetualLicense: true,
    maxTransactions: 50,       // Limited sample data
    maxGoals: 5,
    maxBills: 10,
  },
  [USER_ROLES.HOMEVESTORS]: {
    canViewAllTabs: true,
    canEditData: true,
    canDeleteData: true,
    canExport: true,
    canImport: true,
    canManageUsers: false,
    canViewAdminPanel: false,
    canViewAnalytics: true,
    canAccessRetirement: true,
    canAccessSalesTracker: true,
    canAccessReports: true,
    canAccessBizBudget: true,  // Full BizBudget Hub access
    canModifySettings: true,
    showDemoData: false,
    watermark: false,
    perpetualLicense: true,    // Never expires, never charged
    maxTransactions: Infinity,
    maxGoals: Infinity,
    maxBills: Infinity,
  },
  [USER_ROLES.FAMILY]: {
    canViewAllTabs: true,
    canEditData: true,
    canDeleteData: true,
    canExport: true,
    canImport: true,
    canManageUsers: false,
    canViewAdminPanel: false,
    canViewAnalytics: true,
    canAccessRetirement: true,
    canAccessSalesTracker: true,
    canAccessReports: true,
    canAccessBizBudget: false, // No BizBudget access
    canModifySettings: true,
    showDemoData: false,
    watermark: false,
    perpetualLicense: false,
    maxTransactions: Infinity,
    maxGoals: Infinity,
    maxBills: Infinity,
  },
  [USER_ROLES.PRO]: {
    canViewAllTabs: true,
    canEditData: true,
    canDeleteData: true,
    canExport: true,
    canImport: true,
    canManageUsers: false,
    canViewAdminPanel: false,
    canViewAnalytics: true,
    canAccessRetirement: true,
    canAccessSalesTracker: false,  // Sales tracker is Family only
    canAccessReports: true,
    canAccessBizBudget: false,     // BizBudget is for authorized users only
    canModifySettings: true,
    showDemoData: false,
    watermark: false,
    perpetualLicense: false,
    maxTransactions: 5000,
    maxGoals: 20,
    maxBills: 50,
  },
  [USER_ROLES.STARTER]: {
    canViewAllTabs: false,
    canEditData: true,
    canDeleteData: true,
    canExport: false,          // No export on free
    canImport: true,
    canManageUsers: false,
    canViewAdminPanel: false,
    canViewAnalytics: false,   // Limited analytics
    canAccessRetirement: false, // Retirement is Pro+
    canAccessSalesTracker: false,
    canAccessReports: false,   // Reports is Pro+
    canAccessBizBudget: false, // BizBudget is for authorized users only
    canModifySettings: true,
    showDemoData: false,
    watermark: false,
    perpetualLicense: false,
    maxTransactions: 500,
    maxGoals: 5,
    maxBills: 10,
  },
};

// Get user role from email
const getUserRole = (email, subscription = null) => {
  if (!email) return USER_ROLES.STARTER;
  
  // Check special accounts first
  const specialRole = SPECIAL_ACCOUNTS[email.toLowerCase()];
  if (specialRole) return specialRole;
  
  // Otherwise, base role on subscription
  if (subscription) {
    const planType = subscription.plan_type?.toLowerCase() || '';
    if (planType.includes('family')) return USER_ROLES.FAMILY;
    if (planType.includes('pro')) return USER_ROLES.PRO;
  }
  
  return USER_ROLES.STARTER;
};

// Get permissions for a role
const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[USER_ROLES.STARTER];
};

// Check if user has specific permission
const hasPermission = (userRole, permission) => {
  const permissions = getRolePermissions(userRole);
  return permissions[permission] || false;
};

// Tester Watermark Component
const TesterWatermark = () => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: '120px',
    fontWeight: '900',
    color: 'rgba(239, 68, 68, 0.08)',
    pointerEvents: 'none',
    zIndex: 9999,
    whiteSpace: 'nowrap',
    userSelect: 'none'
  }}>
    TEST MODE
  </div>
);

// Read-Only Banner for Testers
const ReadOnlyBanner = ({ theme }) => (
  <div style={{
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '30px',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}>
    <span>👁️</span>
    <span>TEST MODE - Read-Only Access</span>
  </div>
);

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
  
  console.log('📥 [DB] Loading user data for:', userId);
  
  try {
    // Load profile separately to handle potential errors better
    let profile = null;
    try {
      const { data: profileData, error: profileError } = await sb
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profileError) {
        console.log('ℹ️ [DB] No profile found or error:', profileError.message);
      } else {
        profile = profileData;
        console.log('✅ [DB] Profile loaded:', profile?.first_name, profile?.last_name);
      }
    } catch (e) {
      console.log('ℹ️ [DB] Profile query error:', e.message);
    }

    // Load settings separately
    let settings = null;
    try {
      const { data: settingsData, error: settingsError } = await sb
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!settingsError) {
        settings = settingsData;
      }
    } catch (e) {
      console.log('ℹ️ [DB] Settings query error:', e.message);
    }

    // Load other data in parallel
    const [
      { data: transactions },
      { data: bills },
      { data: goals },
      { data: tasks },
      { data: budgets },
      { data: incomeTypes },
      { data: categories }
    ] = await Promise.all([
      sb.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      sb.from('bills').select('*').eq('user_id', userId),
      sb.from('goals').select('*').eq('user_id', userId),
      sb.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      sb.from('budgets').select('*').eq('user_id', userId),
      sb.from('income_types').select('*').eq('user_id', userId),
      sb.from('accounting_categories').select('*').eq('user_id', userId)
    ]);
    
    console.log('✅ [DB] Loaded:', {
      profile: profile ? 'yes' : 'no',
      transactions: transactions?.length || 0,
      bills: bills?.length || 0,
      goals: goals?.length || 0,
      tasks: tasks?.length || 0
    });
    
    return {
      profile,
      transactions: transactions || [],
      bills: bills || [],
      goals: goals || [],
      tasks: tasks || [],
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

// Save tasks to Supabase
const saveTasksToDB = async (userId, tasks) => {
  const sb = await initSupabase();
  if (!sb) return;
  
  console.log('💾 [DB] Saving tasks:', tasks?.length || 0);
  
  try {
    await sb.from('tasks').delete().eq('user_id', userId);
    
    if (tasks?.length) {
      const toInsert = tasks.map(t => ({
        user_id: userId,
        title: t.title,
        description: t.description || '',
        due_date: t.dueDate || null,
        priority: t.priority || 'medium',
        category: t.category || 'Personal',
        status: t.status || 'todo',
        created_at: t.createdAt || new Date().toISOString()
      }));
      
      const { error } = await sb.from('tasks').insert(toInsert);
      if (error) throw error;
    }
    console.log('✅ [DB] Tasks saved');
  } catch (e) {
    console.error('❌ [DB] Save tasks error:', e);
  }
};

// Save user preferences to Supabase
const savePreferencesToDB = async (userId, preferences) => {
  const sb = await initSupabase();
  if (!sb) return;
  
  console.log('💾 [DB] Saving preferences...');
  
  try {
    const { error } = await sb.from('user_settings').upsert({
      user_id: userId,
      theme: preferences.theme || 'light',
      language: preferences.language || 'en',
      avatar: preferences.avatar || '👨‍💼',
      last_import_date: preferences.lastImportDate || null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    if (error) throw error;
    console.log('✅ [DB] Preferences saved');
  } catch (e) {
    console.error('❌ [DB] Save preferences error:', e);
  }
};

// Convert DB task to app format
const dbToAppTask = (t) => ({
  id: t.id,
  title: t.title,
  description: t.description,
  dueDate: t.due_date,
  priority: t.priority,
  category: t.category,
  status: t.status,
  createdAt: t.created_at
});

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

// Save user profile to Supabase - WITH PROTECTION AGAINST EMPTY OVERWRITES
const saveProfileToDB = async (userId, profile, forceUpdate = false) => {
  const sb = await initSupabase();
  if (!sb) return;
  
  // PROTECTION: Check if incoming profile is essentially empty
  const isProfileEmpty = !profile.firstName && !profile.lastName && !profile.phone && !profile.dateOfBirth && !profile.gender;
  
  if (isProfileEmpty && !forceUpdate) {
    console.log('⚠️ [DB] Skipping save - profile is empty, checking if DB has existing data...');
    
    // Check if there's existing data in DB that would be overwritten
    try {
      const { data: existingProfile } = await sb
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('user_id', userId)
        .single();
      
      if (existingProfile && (existingProfile.first_name || existingProfile.last_name)) {
        console.log('🛡️ [DB] PROTECTED: Existing profile found, NOT overwriting with empty data');
        console.log('   Existing:', existingProfile.first_name, existingProfile.last_name);
        return; // DO NOT overwrite existing data with empty profile
      }
    } catch (e) {
      // No existing profile, safe to create new one
      console.log('ℹ️ [DB] No existing profile, proceeding with save');
    }
  }
  
  console.log('💾 [DB] Saving profile...', profile);
  
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
      sidehustle_name: profile.sidehustleName,
      side_hustle: profile.sideHustle,
      account_labels: profile.accountLabels ? JSON.stringify(profile.accountLabels) : null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    if (error) throw error;
    console.log('✅ [DB] Profile saved successfully');
  } catch (e) {
    console.error('❌ [DB] Save profile error:', e);
  }
};

// Convert DB profile to app format
const dbToAppProfile = (p) => {
  let accountLabels = { personal: 'Personal', sidehustle: 'Side Hustle' };
  try {
    if (p?.account_labels) {
      accountLabels = typeof p.account_labels === 'string' ? JSON.parse(p.account_labels) : p.account_labels;
    } else {
      // Check localStorage as fallback
      const savedLabels = localStorage.getItem('pn_accountLabels');
      if (savedLabels) {
        accountLabels = JSON.parse(savedLabels);
      }
    }
  } catch (e) {
    console.log('Failed to parse account_labels:', e);
  }
  return {
    firstName: p?.first_name || '',
    lastName: p?.last_name || '',
    email: p?.email || '',
    phone: p?.phone || '',
    dateOfBirth: p?.date_of_birth || '',
    gender: p?.gender || '',
    photoUrl: p?.photo_url || '',
    sidehustleName: p?.sidehustle_name || '',
    sideHustle: p?.side_hustle || '',
    accountLabels
  };
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

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

// Load user subscription from Supabase
const loadSubscriptionFromDB = async (userId) => {
  const sb = await initSupabase();
  if (!sb) return null;
  
  console.log('📥 [Subscription] Loading subscription for:', userId);
  
  try {
    const { data, error } = await sb
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If no subscription found, create one with trial
      if (error.code === 'PGRST116') {
        console.log('📝 [Subscription] No subscription found, creating trial...');
        return await createTrialSubscription(userId);
      }
      console.error('❌ [Subscription] Load error:', error);
      return null;
    }
    
    console.log('✅ [Subscription] Loaded:', data.plan_type, data.subscription_status);
    return data;
  } catch (e) {
    console.error('❌ [Subscription] Load error:', e);
    return null;
  }
};

// Create trial subscription for new user
const createTrialSubscription = async (userId) => {
  const sb = await initSupabase();
  if (!sb) return null;
  
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14-day trial
  
  const subscription = {
    user_id: userId,
    plan_type: 'free_trial',
    subscription_status: 'trialing',
    trial_started_at: new Date().toISOString(),
    trial_ends_at: trialEndsAt.toISOString()
  };
  
  try {
    const { data, error } = await sb
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();
    
    if (error) throw error;
    console.log('✅ [Subscription] Trial created, ends:', trialEndsAt);
    return data;
  } catch (e) {
    console.error('❌ [Subscription] Create trial error:', e);
    return subscription; // Return the object anyway for UI
  }
};

// Check if user has valid access
const checkSubscriptionAccess = (subscription, userEmail = null) => {
  // Check for perpetual license users first - they always have full access
  if (userEmail && PERPETUAL_LICENSE_USERS.includes(userEmail.toLowerCase())) {
    return { hasAccess: true, reason: 'perpetual', perpetualLicense: true };
  }
  
  if (!subscription) return { hasAccess: false, reason: 'no_subscription' };
  
  const now = new Date();
  
  // Check if in valid trial period
  if (subscription.subscription_status === 'trialing') {
    const trialEnds = new Date(subscription.trial_ends_at);
    if (now < trialEnds) {
      const daysLeft = Math.ceil((trialEnds - now) / (1000 * 60 * 60 * 24));
      return { hasAccess: true, reason: 'trial', daysLeft, trialEnds };
    } else {
      return { hasAccess: false, reason: 'trial_expired', trialEnds };
    }
  }
  
  // Check if has active paid subscription
  if (subscription.subscription_status === 'active') {
    if (!subscription.subscription_ends_at || new Date(subscription.subscription_ends_at) > now) {
      return { hasAccess: true, reason: 'paid', planType: subscription.plan_type };
    }
  }
  
  return { hasAccess: false, reason: subscription.subscription_status };
};

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
  const [transactions, setTransactions] = useState([]); // Start empty - load user-specific data only
  const [bills, setBills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subscription, setSubscription] = useState(null); // Track subscription for role calculation
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    photoUrl: '',
    sidehustleName: '',
    sideHustle: ''
  });
  const [userPreferences, setUserPreferences] = useState(() => {
    // Initialize from localStorage for immediate access
    try {
      const savedAvatar = localStorage.getItem('pn_userAvatar');
      const savedTheme = localStorage.getItem('pn_darkMode');
      return {
        theme: savedTheme === 'true' ? 'dark' : 'light',
        language: 'en',
        avatar: savedAvatar || '👨‍💼'
      };
    } catch {
      return { theme: 'light', language: 'en', avatar: '👨‍💼' };
    }
  });
  const [lastImportDate, setLastImportDate] = useState(() => {
    try {
      return localStorage.getItem('pn_lastImportDate') || null; // New users have no import date
    } catch { return null; }
  });
  
  // Compute user role based on email and subscription
  const userRole = useMemo(() => {
    return getUserRole(user?.email, subscription);
  }, [user?.email, subscription]);
  
  // Get permissions for current user
  const permissions = useMemo(() => {
    return getRolePermissions(userRole);
  }, [userRole]);

  // Load user data - tries DB first, falls back to localStorage
  // ENHANCED: Better error handling, retry logic, and data recovery
  const loadUserData = async (userId, userEmail) => {
    console.log('📥 [Data] Loading user data for:', userId);
    
    // FIRST: Load from localStorage immediately as backup (fastest)
    let localProfile = null;
    let localHasRealData = false;
    try {
      const savedProfile = localStorage.getItem(`pn_profile_${userId}`);
      if (savedProfile) {
        localProfile = JSON.parse(savedProfile);
        localHasRealData = !!(localProfile.firstName || localProfile.lastName || localProfile.phone || localProfile.sideHustle);
        console.log('📦 [Data] Found localStorage profile:', localProfile.firstName, localProfile.lastName, '| hasRealData:', localHasRealData);
      }
    } catch (e) {
      console.log('ℹ️ [Data] No localStorage profile');
    }
    
    // If we have valid local data, set it immediately for fast UI
    if (localProfile && localHasRealData) {
      console.log('⚡ [Data] Setting profile from localStorage first (fast path)');
      setProfile({
        ...localProfile,
        email: localProfile.email || userEmail || ''
      });
    }
    
    // Try loading from database with retry logic
    let dbData = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!dbData && retryCount < maxRetries) {
      dbData = await loadUserDataFromDB(userId);
      if (!dbData) {
        retryCount++;
        console.log(`⚠️ [Data] DB load attempt ${retryCount}/${maxRetries} failed, retrying...`);
        await new Promise(r => setTimeout(r, 500 * retryCount)); // Exponential backoff
      }
    }
    
    if (dbData) {
      console.log('✅ [Data] Loaded from database');
      
      // Load profile - with smart merging
      if (dbData.profile) {
        const loadedProfile = dbToAppProfile(dbData.profile);
        
        // Use user email if profile email is empty
        if (!loadedProfile.email && userEmail) {
          loadedProfile.email = userEmail;
        }
        
        // Check if DB profile has actual meaningful data
        const dbHasRealData = !!(loadedProfile.firstName || loadedProfile.lastName || loadedProfile.phone || loadedProfile.dateOfBirth || loadedProfile.sideHustle);
        
        console.log('🔍 [Data] DB profile check - hasRealData:', dbHasRealData, '| firstName:', loadedProfile.firstName, '| lastName:', loadedProfile.lastName);
        
        if (dbHasRealData) {
          // DB has real data - use it
          setProfile(loadedProfile);
          localStorage.setItem(`pn_profile_${userId}`, JSON.stringify(loadedProfile));
          console.log('✅ [Data] Profile loaded from DB:', loadedProfile.firstName, loadedProfile.lastName);
        } else if (localHasRealData && localProfile) {
          // DB profile is empty but localStorage has data - keep localStorage data
          // This handles the case where DB was corrupted/overwritten with empty data
          console.log('🛡️ [Data] DB profile empty, KEEPING localStorage data:', localProfile.firstName, localProfile.lastName);
          setProfile({
            ...localProfile,
            email: loadedProfile.email || userEmail || localProfile.email
          });
          
          // REPAIR: Push localStorage data back to DB to fix the corruption
          console.log('🔧 [Data] Repairing DB with localStorage data...');
          await saveProfileToDB(userId, localProfile, true);
        } else {
          // Both are empty - just set email
          console.log('ℹ️ [Data] Both DB and localStorage profiles empty, setting email only');
          setProfile(prev => ({ 
            ...prev, 
            email: loadedProfile.email || userEmail || prev.email 
          }));
        }
      } else if (localHasRealData && localProfile) {
        // No profile in DB but localStorage has data - use localStorage and push to DB
        console.log('🔧 [Data] No DB profile, using localStorage and syncing to DB...');
        setProfile({
          ...localProfile,
          email: userEmail || localProfile.email
        });
        await saveProfileToDB(userId, localProfile, true);
      } else {
        // No profile anywhere - just set email from auth
        console.log('ℹ️ [Data] No profile in DB or localStorage, setting email from auth');
        setProfile(prev => ({ 
          ...prev, 
          email: userEmail || prev.email 
        }));
      }
      
      // Load transactions, bills, goals
      if (dbData.transactions?.length) {
        setTransactions(dbData.transactions.map(dbToAppTransaction));
      }
      if (dbData.bills?.length) {
        setBills(dbData.bills.map(dbToAppBill));
      }
      if (dbData.goals?.length) {
        setGoals(dbData.goals.map(dbToAppGoal));
      }
      
      // Load tasks
      if (dbData.tasks?.length) {
        setTasks(dbData.tasks.map(dbToAppTask));
      }
      
      // Load user preferences/settings
      if (dbData.settings) {
        // Get saved avatar from localStorage (user's last explicit choice)
        const savedLocalAvatar = localStorage.getItem('pn_userAvatar');
        const dbAvatar = dbData.settings.avatar;
        
        // Prefer localStorage avatar if DB has default or no value
        // This preserves user's choice even if DB sync failed
        const finalAvatar = (savedLocalAvatar && savedLocalAvatar !== '👨‍💼') 
          ? savedLocalAvatar 
          : (dbAvatar || savedLocalAvatar || '👨‍💼');
        
        const prefs = {
          theme: dbData.settings.theme || 'light',
          language: dbData.settings.language || 'en',
          avatar: finalAvatar
        };
        setUserPreferences(prefs);
        
        // Also update localStorage for immediate access
        localStorage.setItem('pn_darkMode', prefs.theme === 'dark' ? 'true' : 'false');
        localStorage.setItem('pn_userAvatar', prefs.avatar);
        if (dbData.settings.last_import_date) {
          setLastImportDate(dbData.settings.last_import_date);
          localStorage.setItem('pn_lastImportDate', dbData.settings.last_import_date);
        }
      }
      
      // If DB had any data, we're done
      if (dbData.profile || dbData.transactions?.length || dbData.bills?.length || dbData.goals?.length || dbData.tasks?.length) {
        return;
      }
    }
    
    // Fallback to localStorage for all other data (transactions, bills, etc.)
    console.log('ℹ️ [Data] Loading remaining data from localStorage...');
    try {
      const savedTransactions = localStorage.getItem(`pn_transactions_${userId}`);
      const savedBills = localStorage.getItem(`pn_bills_${userId}`);
      const savedGoals = localStorage.getItem(`pn_goals_${userId}`);
      const savedTasks = localStorage.getItem('pn_tasks');
      const savedImportDate = localStorage.getItem(`pn_lastImport_${userId}`);
      
      // Use saved data if available - DO NOT use default data for other users (privacy protection)
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else if (userEmail === 'kennedymichael54@gmail.com' && DEFAULT_TRANSACTIONS?.length) {
        // Only load default/demo data for the original owner account
        console.log('📊 [Data] Owner account - using baked-in default transactions:', DEFAULT_TRANSACTIONS.length);
        setTransactions(DEFAULT_TRANSACTIONS);
      } else {
        // New users start with empty data
        console.log('📊 [Data] New user - starting with empty transactions');
        setTransactions([]);
      }
      if (savedBills) setBills(JSON.parse(savedBills));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedImportDate) setLastImportDate(new Date(savedImportDate));
      
      console.log('✅ [Data] Loaded remaining data from localStorage');
    } catch (e) {
      console.error('❌ [Data] localStorage load error:', e);
      // For errors, only use default data for owner account - others get empty data
      if (userEmail === 'kennedymichael54@gmail.com' && DEFAULT_TRANSACTIONS?.length) {
        console.log('📊 [Data] Error recovery (owner) - using default transactions');
        setTransactions(DEFAULT_TRANSACTIONS);
      } else {
        console.log('📊 [Data] Error recovery - starting fresh with empty data');
        setTransactions([]);
      }
    }
  };

  // Save profile with sync to database
  // forceUpdate=true when user explicitly clicks Save in Manage Account
  const handleUpdateProfile = async (newProfile, forceUpdate = true) => {
    console.log('💾 [Profile] handleUpdateProfile called:', newProfile);
    
    // VALIDATION: Check if the new profile has any meaningful data
    const hasNewData = !!(newProfile.firstName || newProfile.lastName || newProfile.phone || newProfile.dateOfBirth || newProfile.gender || newProfile.sideHustle || newProfile.sidehustleName);
    
    // Check if current profile has data
    const currentHasData = !!(profile.firstName || profile.lastName || profile.phone || profile.sideHustle);
    
    // PROTECTION: Don't overwrite existing data with empty data unless user explicitly provided empty values
    if (!hasNewData && currentHasData && forceUpdate) {
      console.log('⚠️ [Profile] Warning: Attempting to save empty profile over existing data');
      console.log('   Current:', profile.firstName, profile.lastName);
      console.log('   New:', newProfile.firstName, newProfile.lastName);
      
      // If user is trying to save empty data, but we have existing data, 
      // merge with existing data to prevent accidental data loss
      const mergedProfile = {
        firstName: newProfile.firstName || profile.firstName,
        lastName: newProfile.lastName || profile.lastName,
        email: newProfile.email || profile.email,
        phone: newProfile.phone || profile.phone,
        dateOfBirth: newProfile.dateOfBirth || profile.dateOfBirth,
        gender: newProfile.gender || profile.gender,
        photoUrl: newProfile.photoUrl || profile.photoUrl,
        sidehustleName: newProfile.sidehustleName || profile.sidehustleName,
        sideHustle: newProfile.sideHustle || profile.sideHustle
      };
      
      console.log('🛡️ [Profile] Merged profile to preserve data:', mergedProfile.firstName, mergedProfile.lastName);
      newProfile = mergedProfile;
    }
    
    setProfile(newProfile);
    
    // Save to localStorage
    if (user?.id) {
      localStorage.setItem(`pn_profile_${user.id}`, JSON.stringify(newProfile));
    }
    
    // Sync to database (forceUpdate=true means user explicitly saved)
    if (user?.id) {
      await saveProfileToDB(user.id, newProfile, forceUpdate);
    }
  };

  // Save tasks with sync to database
  const handleUpdateTasks = async (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('pn_tasks', JSON.stringify(newTasks));
    
    // Sync to database if user is logged in
    if (user?.id) {
      await saveTasksToDB(user.id, newTasks);
    }
  };

  // Save preferences with sync to database
  const handleUpdatePreferences = async (newPrefs) => {
    setUserPreferences(prev => ({ ...prev, ...newPrefs }));
    
    // Update localStorage
    if (newPrefs.theme !== undefined) {
      localStorage.setItem('pn_darkMode', newPrefs.theme === 'dark' ? 'true' : 'false');
    }
    if (newPrefs.avatar !== undefined) {
      localStorage.setItem('pn_userAvatar', newPrefs.avatar);
    }
    
    // Sync to database if user is logged in
    if (user?.id) {
      await savePreferencesToDB(user.id, {
        ...userPreferences,
        ...newPrefs,
        lastImportDate
      });
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
        await loadUserData(activeSession.user.id, activeSession.user.email);
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
          await loadUserData(session.user.id, session.user.email);
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
    <>
      {/* Tester Mode Watermark & Banner */}
      {userRole === USER_ROLES.TESTER && <TesterWatermark />}
      {userRole === USER_ROLES.TESTER && <ReadOnlyBanner theme={lightTheme} />}
      
      <Dashboard 
        user={user} 
        setView={setView} 
        transactions={transactions}
        bills={bills}
        goals={goals}
        tasks={tasks}
        profile={profile}
        userPreferences={userPreferences}
        lastImportDate={lastImportDate}
        onSetLastImportDate={setLastImportDate}
        onImportTransactions={handleImportTransactions}
        onUpdateBills={handleUpdateBills}
        onUpdateGoals={handleUpdateGoals}
        onUpdateTasks={handleUpdateTasks}
        onUpdateProfile={handleUpdateProfile}
        onUpdatePreferences={handleUpdatePreferences}
        parseCSV={parseCSV}
        userRole={userRole}
        permissions={permissions}
      />
    </>
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
            {/* Online Status Indicator */}
            <SiteStatusIndicator showLabel={true} darkMode={true} />
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

          <form onSubmit={handleAuth} autoComplete="on">
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                name="email"
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
                autoComplete={isLogin ? "current-password" : "new-password"}
                name="password"
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
// THEME TOGGLE COMPONENT - Sun/Toggle/Moon Style
// ============================================================================
function ThemeToggle({ isDark, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Sun icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#9CA3AF' : '#F59E0B'} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      
      {/* Toggle switch */}
      <button
        onClick={onToggle}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: isDark ? '#6366F1' : '#E5E7EB',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s ease',
          padding: 0
        }}
      >
        <div style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: '3px',
          left: isDark ? '23px' : '3px',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }} />
      </button>
      
      {/* Moon icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#6366F1' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </div>
  );
}

// ============================================================================
// LAST IMPORT INDICATOR - Reusable component for all tabs
// ============================================================================
function LastImportIndicator({ lastImportDate }) {
  if (!lastImportDate) return null;
  
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px', 
      padding: '4px 10px', 
      background: '#10B98115', 
      borderRadius: '8px',
      marginLeft: '12px'
    }}>
      <div style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        background: '#10B981' 
      }} />
      <span style={{ 
        fontSize: '12px', 
        color: '#10B981', 
        fontWeight: '500' 
      }}>
        Last import: {new Date(lastImportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    </div>
  );
}

// ============================================================================
// CHANGE PASSWORD MODAL
// ============================================================================
function ChangePasswordModal({ theme, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '#E5E7EB' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      longLength: password.length >= 12
    };
    
    if (checks.length) score++;
    if (checks.lowercase) score++;
    if (checks.uppercase) score++;
    if (checks.numbers) score++;
    if (checks.special) score++;
    if (checks.longLength) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#EF4444', checks };
    if (score <= 3) return { score: 2, label: 'Fair', color: '#F59E0B', checks };
    if (score <= 4) return { score: 3, label: 'Good', color: '#3B82F6', checks };
    return { score: 4, label: 'Strong', color: '#10B981', checks };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async () => {
    setError('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordStrength.score < 2) {
      setError('Please choose a stronger password');
      return;
    }

    setLoading(true);
    
    try {
      const sb = await initSupabase();
      if (!sb) throw new Error('Connection error');
      
      const { error: updateError } = await sb.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 2000 
    }}>
      <div style={{ 
        background: theme.bgCard, 
        borderRadius: '20px', 
        padding: '32px', 
        width: '440px', 
        maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔒</span> Change Password
          </h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.textMuted }}
          >
            ×
          </button>
        </div>
        
        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>
              Password Updated!
            </h3>
            <p style={{ color: theme.textMuted, fontSize: '14px' }}>
              Your password has been changed successfully.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ 
                padding: '12px 16px', 
                background: '#FEE2E2', 
                borderRadius: '10px', 
                marginBottom: '20px',
                color: '#DC2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
                Current Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={{ 
                    width: '100%', 
                    padding: '12px 40px 12px 16px', 
                    background: theme.inputBg, 
                    border: `1px solid ${theme.border}`, 
                    borderRadius: '10px', 
                    color: theme.textPrimary, 
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }} 
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme.textMuted,
                    fontSize: '18px'
                  }}
                >
                  {showCurrentPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  style={{ 
                    width: '100%', 
                    padding: '12px 40px 12px 16px', 
                    background: theme.inputBg, 
                    border: `1px solid ${theme.border}`, 
                    borderRadius: '10px', 
                    color: theme.textPrimary, 
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }} 
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme.textMuted,
                    fontSize: '18px'
                  }}
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          background: level <= passwordStrength.score ? passwordStrength.color : '#E5E7EB',
                          transition: 'background 0.3s'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                    <span style={{ fontSize: '12px', color: theme.textMuted }}>
                      {passwordStrength.score < 3 ? 'Add uppercase, numbers, or symbols' : 'Great password!'}
                    </span>
                  </div>
                  
                  {/* Password requirements checklist */}
                  <div style={{ marginTop: '12px', padding: '12px', background: theme.bgMain, borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '8px' }}>Password must have:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {[
                        { check: newPassword.length >= 8, label: '8+ characters' },
                        { check: /[A-Z]/.test(newPassword), label: 'Uppercase letter' },
                        { check: /[a-z]/.test(newPassword), label: 'Lowercase letter' },
                        { check: /[0-9]/.test(newPassword), label: 'Number' },
                        { check: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), label: 'Special character' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <span style={{ color: item.check ? '#10B981' : '#9CA3AF' }}>
                            {item.check ? '✓' : '○'}
                          </span>
                          <span style={{ color: item.check ? theme.textPrimary : theme.textMuted }}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
                Confirm New Password
              </label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  background: theme.inputBg, 
                  border: `1px solid ${confirmPassword && confirmPassword !== newPassword ? '#EF4444' : theme.border}`, 
                  borderRadius: '10px', 
                  color: theme.textPrimary, 
                  fontSize: '15px',
                  boxSizing: 'border-box'
                }} 
              />
              {confirmPassword && confirmPassword !== newPassword && (
                <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px' }}>
                  Passwords do not match
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={onClose}
                style={{ 
                  flex: 1, 
                  padding: '14px', 
                  background: 'transparent', 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '10px', 
                  color: theme.textSecondary, 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  cursor: 'pointer' 
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                style={{ 
                  flex: 1, 
                  padding: '14px', 
                  background: theme.primary, 
                  border: 'none', 
                  borderRadius: '10px', 
                  color: 'white', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
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
  tasks,
  profile,
  userPreferences,
  lastImportDate,
  onSetLastImportDate,
  onImportTransactions,
  onUpdateBills,
  onUpdateGoals,
  onUpdateTasks,
  onUpdateProfile,
  onUpdatePreferences,
  parseCSV,
  userRole = USER_ROLES.STARTER,
  permissions = ROLE_PERMISSIONS[USER_ROLES.STARTER]
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');
  const [tabRestored, setTabRestored] = useState(false); // Track if we've restored the tab
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsDismissed, setNotificationsDismissed] = useState(() => {
    // Initialize from localStorage
    try {
      return localStorage.getItem('pn_notificationsDismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Initialize from userPreferences if available
    const langCode = userPreferences?.language || 'en';
    return languages.find(l => l.code === langCode) || languages[0];
  });
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showPennyChat, setShowPennyChat] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const [showManageAccountModal, setShowManageAccountModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false); // VIP welcome modal
  
  // Subscription & Hub State
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [expandedHubs, setExpandedHubs] = useState({ homebudget: true }); // HomeBudget expanded by default
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Sidebar collapse state
  const [trialBannerCollapsed, setTrialBannerCollapsed] = useState(false); // Trial banner collapse
  
  // Custom account type labels (rename Personal/Side Hustle)
  const [accountLabels, setAccountLabels] = useState(() => {
    try {
      const saved = localStorage.getItem('pn_accountLabels');
      return saved ? JSON.parse(saved) : { personal: 'Personal', sidehustle: 'Side Hustle' };
    } catch {
      return { personal: 'Personal', sidehustle: 'Side Hustle' };
    }
  });
  const [editingAccountLabel, setEditingAccountLabel] = useState(null);
  
  // Update account labels and persist to Supabase
  const updateAccountLabel = async (type, newLabel) => {
    const updated = { ...accountLabels, [type]: newLabel };
    setAccountLabels(updated);
    // Also save to localStorage as fallback
    localStorage.setItem('pn_accountLabels', JSON.stringify(updated));
    setEditingAccountLabel(null);
    
    // Save to Supabase via profile update
    if (user?.id && profile) {
      try {
        const newProfile = { ...profile, accountLabels: updated };
        await saveProfileToDB(user.id, newProfile, true);
        console.log('✅ Account labels synced to database');
      } catch (e) {
        console.error('Failed to sync account labels:', e);
      }
    }
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is outside all dropdown areas
      const isOutsideDropdowns = !e.target.closest('.dropdown-container');
      if (isOutsideDropdowns) {
        setShowProfileMenu(false);
        setShowNotifications(false);
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Load subscription on mount
  useEffect(() => {
    const loadSubscription = async () => {
      if (user?.id) {
        setSubscriptionLoading(true);
        const sub = await loadSubscriptionFromDB(user.id);
        setSubscription(sub);
        setSubscriptionLoading(false);
        
        // Check if trial expired and show upgrade modal (not for perpetual license users)
        if (sub && !PERPETUAL_LICENSE_USERS.includes(user?.email?.toLowerCase())) {
          const access = checkSubscriptionAccess(sub, user?.email);
          if (!access.hasAccess && access.reason === 'trial_expired') {
            setShowUpgradeModal(true);
          }
        }
      }
    };
    loadSubscription();
  }, [user?.id]);
  
  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (user?.id && activeTab) {
      localStorage.setItem(`pn_activeTab_${user.id}`, activeTab);
      console.log('💾 [Tab] Saved active tab:', activeTab);
    }
  }, [activeTab, user?.id]);
  
  // Restore tab based on subscription tier after subscription loads
  useEffect(() => {
    if (!subscriptionLoading && subscription && user?.id && !tabRestored) {
      const savedTab = localStorage.getItem(`pn_activeTab_${user.id}`);
      
      // Check subscription tier
      const planType = subscription.plan_type?.toLowerCase() || '';
      const subscriptionStatus = subscription.subscription_status?.toLowerCase() || '';
      
      // Users who get tab persistence (PAID users only):
      // 1. Paid users with active subscription (Family, Pro, Bundle)
      // 2. Perpetual license users (Owner, Admin, Tester, HomeVestors team)
      // 
      // Users who DON'T get tab persistence:
      // - Free tier users
      // - Trial users (haven't paid yet - encourages exploration)
      // - Expired trial users
      const isPaidUser = (planType.includes('family') || planType.includes('pro') || planType.includes('bundle')) 
                         && subscriptionStatus === 'active';
      const isPerpetualUser = PERPETUAL_LICENSE_USERS.includes(user?.email?.toLowerCase());
      
      // Restore tab only for paid or perpetual users
      if ((isPaidUser || isPerpetualUser) && savedTab && savedTab !== 'home') {
        console.log('🔄 [Tab] Restoring tab for paid/perpetual user:', savedTab);
        setActiveTab(savedTab);
        
        // Also expand the correct hub based on the saved tab
        if (savedTab.startsWith('bizbudget-')) {
          setExpandedHubs(prev => ({ ...prev, bizbudget: true }));
        } else if (savedTab.startsWith('rebudget-')) {
          setExpandedHubs(prev => ({ ...prev, rebudget: true }));
        } else {
          setExpandedHubs(prev => ({ ...prev, homebudget: true }));
        }
      } else {
        console.log('🏠 [Tab] Free/trial user - starting at HomeBudget Dashboard');
      }
      
      setTabRestored(true);
    }
  }, [subscriptionLoading, subscription, user?.id, user?.email, tabRestored]);
  
  // Sync accountLabels from profile when it loads
  useEffect(() => {
    if (profile?.accountLabels) {
      // Check if profile has non-default labels
      const profileHasCustomLabels = profile.accountLabels.personal !== 'Personal' || 
                                      profile.accountLabels.sidehustle !== 'Side Hustle';
      
      // Get current localStorage labels
      const savedLabels = localStorage.getItem('pn_accountLabels');
      const localLabels = savedLabels ? JSON.parse(savedLabels) : null;
      const localHasCustomLabels = localLabels && 
        (localLabels.personal !== 'Personal' || localLabels.sidehustle !== 'Side Hustle');
      
      // Prefer localStorage if it has custom labels and profile doesn't
      if (localHasCustomLabels && !profileHasCustomLabels) {
        console.log('🛡️ Preserving localStorage account labels:', localLabels);
        setAccountLabels(localLabels);
        // Push localStorage labels to database to fix sync
        if (user?.id) {
          const newProfile = { ...profile, accountLabels: localLabels };
          saveProfileToDB(user.id, newProfile, true);
        }
      } else if (profileHasCustomLabels) {
        setAccountLabels(profile.accountLabels);
        localStorage.setItem('pn_accountLabels', JSON.stringify(profile.accountLabels));
        console.log('📥 Account labels synced from database:', profile.accountLabels);
      }
    }
  }, [profile?.accountLabels]);
  
  // Get subscription access status
  const subscriptionAccess = subscription ? checkSubscriptionAccess(subscription, user?.email) : 
    (PERPETUAL_LICENSE_USERS.includes(user?.email?.toLowerCase()) 
      ? { hasAccess: true, reason: 'perpetual', perpetualLicense: true }
      : { hasAccess: false, reason: 'loading' });
  
  // Show welcome modal for VIP/perpetual users on first visit of session
  useEffect(() => {
    const isPerpetualUser = PERPETUAL_LICENSE_USERS.includes(user?.email?.toLowerCase());
    const isVIPRole = userRole === USER_ROLES.OWNER || userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.TESTER;
    
    if ((isPerpetualUser || isVIPRole) && user?.email) {
      // Check if we've shown the welcome this session
      const sessionKey = `pn_welcome_shown_${user.id}`;
      const hasShownThisSession = sessionStorage.getItem(sessionKey);
      
      if (!hasShownThisSession) {
        // Small delay so the dashboard loads first
        const timer = setTimeout(() => {
          setShowWelcomeModal(true);
          sessionStorage.setItem(sessionKey, 'true');
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [user?.email, user?.id, userRole]);
  
  // Toggle hub expansion
  const toggleHub = (hubId) => {
    setExpandedHubs(prev => ({
      ...prev,
      [hubId]: !prev[hubId]
    }));
  };
  
  // Local state for editing profile (initialized from props when modal opens)
  const [editProfile, setEditProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    photoUrl: '',
    sidehustleName: ''
  });
  
  // Update editProfile when modal opens or profile props change
  useEffect(() => {
    if (showManageAccountModal && profile) {
      setEditProfile({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || '',
        photoUrl: profile.photoUrl || '',
        sidehustleName: profile.sidehustleName || '',
        sideHustle: profile.sideHustle || ''
      });
    }
  }, [showManageAccountModal, profile, user?.email]);
  
  // Memoji avatar selection
  const memojiAvatars = [
    '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧑‍💼', '👨', '👩', '🧑',
    '👴', '👵', '🧓', '👨‍🦳', '👩‍🦳', '👨‍🦰', '👩‍🦰', '👱‍♂️',
    '👱‍♀️', '👨‍🦱', '👩‍🦱', '🧔', '🧔‍♀️', '👲', '🧕', '👳‍♂️',
    '👳‍♀️', '🤵', '🤵‍♀️', '👸', '🤴', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️'
  ];
  
  // Avatar from props (synced across devices)
  const userAvatar = userPreferences?.avatar || '👨‍💼';
  const setUserAvatar = (newAvatar) => {
    onUpdatePreferences({ avatar: newAvatar });
  };
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
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

  // Theme state - synced across devices via userPreferences
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // First check userPreferences (from DB), then fallback to localStorage
    if (userPreferences?.theme) {
      return userPreferences.theme === 'dark';
    }
    try {
      const saved = localStorage.getItem('pn_darkMode');
      return saved === 'true';
    } catch { return false; }
  });

  // Get current theme based on mode
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Save theme preference - syncs to database
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('pn_darkMode', newMode.toString());
    // Sync to database
    onUpdatePreferences({ theme: newMode ? 'dark' : 'light' });
  };

  // Profile comes from props (synced across devices)
  // Use default values if profile is undefined
  const currentProfile = profile || {
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    photoUrl: '',
    sidehustleName: ''
  };

  // Save profile - syncs to database
  const saveProfile = (newProfile) => {
    onUpdateProfile(newProfile);
  };

  const handleSignOut = async () => {
    console.log('🚪 [Auth] Signing out...');
    
    // Close any open menus first
    setShowProfileMenu(false);
    
    try {
      // Clear our session backup
      saveSession(null);
      
      // Clear ALL storage keys related to session
      const keysToRemove = [
        'pn_sb_auth',
        'sb-auth-token', 
        'pn_supabase_session',
        SESSION_KEY,
        SESSION_EXPIRY_KEY,
        SESSION_BACKUP_KEY
      ];
      keysToRemove.forEach(key => {
        try { localStorage.removeItem(key); } catch(e) {}
      });
      
      const sb = await initSupabase();
      if (sb) {
        await sb.auth.signOut();
        console.log('✅ [Auth] Signed out successfully');
      }
      
      // Force state reset and navigation to landing
      setUser(null);
      setView('landing');
      setTransactions([]);
      setBills([]);
      setGoals([]);
      setTasks([]);
      setProfile({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        photoUrl: '',
        sidehustleName: '',
        sideHustle: ''
      });
      
      console.log('✅ [Auth] State cleared, navigating to landing');
    } catch (err) {
      console.error('❌ [Auth] Sign out error:', err);
      // Force navigation even on error
      setUser(null);
      setView('landing');
    }
  };

  const displayName = currentProfile.firstName || user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  const getInitials = () => {
    if (currentProfile.firstName && currentProfile.lastName) {
      return `${currentProfile.firstName[0]}${currentProfile.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  // Navigation items
  // Hub-based navigation structure
  const hubs = [
    {
      id: 'homebudget',
      label: 'HomeBudget Hub',
      subtitle: 'Personal & Family Finance',
      icon: Icons.HomeBudgetHub,
      color: '#EC4899', // Pink/Fuchsia - matches sidebar
      status: 'active', // 'active', 'coming_soon', 'locked'
      items: [
        { id: 'home', label: 'Dashboard', icon: Icons.Dashboard },
        { id: 'sales', label: 'Sales Tracker', icon: Icons.Sales },
        { id: 'budget', label: 'Budget', icon: Icons.Budget },
        { id: 'transactions', label: 'Transactions', icon: Icons.Transactions },
        { id: 'bills', label: 'Bills', icon: Icons.Calendar },
        { id: 'goals', label: 'Goals', icon: Icons.Goals },
        { id: 'tasks', label: 'Tasks', icon: Icons.Tasks },
        { id: 'retirement', label: 'Retirement', icon: Icons.Retirement },
        { id: 'reports', label: 'Reports', icon: Icons.Reports },
      ]
    },
    {
      id: 'bizbudget',
      label: 'BizBudget Hub',
      subtitle: 'Business Command Center',
      icon: Icons.BizBudgetHub,
      color: '#A78BFA', // Light Purple
      status: BIZBUDGET_ACCESS_USERS.includes(user?.email?.toLowerCase()) ? 'active' : 'coming_soon',
      requiresBizBudgetAccess: true,
      items: BIZBUDGET_ACCESS_USERS.includes(user?.email?.toLowerCase()) ? [
        { id: 'bizbudget-dashboard', label: 'Dashboard', icon: Icons.Dashboard },
        { id: 'bizbudget-pipeline', label: 'Deal Pipeline', icon: Icons.HomeBudgetHub },
        { id: 'bizbudget-forecast', label: 'Revenue Forecast', icon: Icons.Reports },
        { id: 'bizbudget-tax', label: 'Tax Planning', icon: Icons.Budget },
        { id: 'bizbudget-history', label: 'Deal History', icon: Icons.Calendar },
        { id: 'bizbudget-statements', label: 'Financial Statements', icon: Icons.Reports },
        { id: 'bizbudget-budget', label: 'Budget vs Actuals', icon: Icons.Budget },
      ] : []
    },
    {
      id: 'rebudget',
      label: 'REBudget Hub',
      subtitle: 'Real Estate Toolkit',
      icon: Icons.REBudgetHub,
      color: '#818CF8', // Indigo
      status: 'coming_soon',
      items: []
    }
  ];

  const bottomNavItems = [
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
    { id: 'import', label: 'Import', icon: Icons.Import },
  ];

  // Get gradient for current tab
  const getGradientForTab = (tab) => {
    const gradientMap = {
      'home': theme.gradients?.dashboard,
      'sales': theme.gradients?.sales,
      'budget': theme.gradients?.budget,
      'transactions': theme.gradients?.transactions,
      'bills': theme.gradients?.bills,
      'goals': theme.gradients?.goals,
      'tasks': theme.gradients?.tasks,
      'retirement': theme.gradients?.retirement,
      'reports': theme.gradients?.reports,
      'bizbudget': theme.gradients?.bizbudget || theme.gradients?.dashboard,
      'settings': theme.gradients?.settings,
      'import': theme.gradients?.import
    };
    return gradientMap[tab] || theme.gradients?.dashboard || theme.bgMain;
  };

  // Gradient wrapper component for content sections
  const GradientSection = ({ children, tab }) => (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      background: getGradientForTab(tab),
      padding: '24px',
      borderRadius: '0',
      transition: 'background 0.4s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative gradient orbs for visual interest */}
      {theme.mode === 'light' && (
        <>
          <div style={{
            position: 'absolute',
            top: '5%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }} />
        </>
      )}
      {theme.mode === 'dark' && (
        <>
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '10%',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '40%',
            width: '220px',
            height: '220px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }} />
        </>
      )}
      {/* Content with z-index to appear above decorative elements */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <GradientSection tab="home"><DashboardHome transactions={transactions} goals={goals} bills={bills} tasks={tasks || []} theme={theme} lastImportDate={lastImportDate} accountLabels={accountLabels} editingAccountLabel={editingAccountLabel} setEditingAccountLabel={setEditingAccountLabel} updateAccountLabel={updateAccountLabel} /></GradientSection>;
      case 'sales':
        // Conditional rendering: Real Estate users get specialized Command Center
        if (profile.sideHustle === 'real-estate') {
          return <GradientSection tab="sales"><RealEstateCommandCenter theme={theme} lastImportDate={lastImportDate} userId={user?.id} userEmail={user?.email} profile={profile} onUpdateProfile={saveProfileToDB} /></GradientSection>;
        }
        return <GradientSection tab="sales"><SalesTrackerTab theme={theme} lastImportDate={lastImportDate} userId={user?.id} userEmail={user?.email} sideHustle={profile.sideHustle} profile={profile} /></GradientSection>;
      case 'budget':
        return <GradientSection tab="budget"><BudgetTab transactions={transactions} onNavigateToImport={() => setActiveTab('import')} theme={theme} lastImportDate={lastImportDate} /></GradientSection>;
      case 'transactions':
        return <GradientSection tab="transactions"><TransactionsTabDS transactions={transactions} onNavigateToImport={() => setActiveTab('import')} theme={theme} lastImportDate={lastImportDate} accountLabels={accountLabels} /></GradientSection>;
      case 'bills':
        return <GradientSection tab="bills"><BillsCalendarView theme={theme} lastImportDate={lastImportDate} /></GradientSection>;
      case 'goals':
        return <GradientSection tab="goals"><GoalsTimelineWithCelebration goals={goals} onUpdateGoals={onUpdateGoals} theme={theme} lastImportDate={lastImportDate} /></GradientSection>;
      case 'tasks':
        return <GradientSection tab="tasks"><TasksTab tasks={tasks || []} onUpdateTasks={onUpdateTasks} theme={theme} lastImportDate={lastImportDate} /></GradientSection>;
      case 'retirement':
        // Only pass default retirement data to the owner account - others see empty state
        const retirementData = user?.email === 'kennedymichael54@gmail.com' ? DEFAULT_RETIREMENT_DATA : null;
        return <GradientSection tab="retirement"><RetirementTab theme={theme} lastImportDate={lastImportDate} retirementData={retirementData} /></GradientSection>;
      case 'reports':
        return <GradientSection tab="reports"><ReportsTab transactions={transactions} onNavigateToImport={() => setActiveTab('import')} theme={theme} lastImportDate={lastImportDate} /></GradientSection>;
      // BizBudget Hub tabs - accessible only to authorized users
      case 'bizbudget-dashboard':
      case 'bizbudget-pipeline':
      case 'bizbudget-forecast':
      case 'bizbudget-tax':
      case 'bizbudget-history':
      case 'bizbudget-statements':
      case 'bizbudget-budget':
        if (!BIZBUDGET_ACCESS_USERS.includes(user?.email?.toLowerCase())) {
          return <GradientSection tab="home"><DashboardHome transactions={transactions} goals={goals} bills={bills} tasks={tasks || []} theme={theme} lastImportDate={lastImportDate} accountLabels={accountLabels} editingAccountLabel={editingAccountLabel} setEditingAccountLabel={setEditingAccountLabel} updateAccountLabel={updateAccountLabel} /></GradientSection>;
        }
        return <GradientSection tab="bizbudget"><BizBudgetHub theme={theme} lastImportDate={lastImportDate} userEmail={user?.email} initialTab={activeTab.replace('bizbudget-', '')} profile={profile} onUpdateProfile={saveProfileToDB} /></GradientSection>;
      case 'settings':
        return <GradientSection tab="settings"><SettingsTabDS 
          theme={theme} 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme}
          selectedLanguage={selectedLanguage}
          onLanguageChange={(lang) => {
            setSelectedLanguage(lang);
            localStorage.setItem('pn_language', JSON.stringify(lang));
            // Sync to database
            onUpdatePreferences({ language: lang.code });
          }}
          userAvatar={userAvatar}
          onAvatarChange={(avatar) => {
            setUserAvatar(avatar);
            localStorage.setItem('pn_userAvatar', avatar); // Immediate persistence
          }}
          memojiAvatars={memojiAvatars}
          languages={languages}
          lastImportDate={lastImportDate}
        /></GradientSection>;
      case 'import':
        return <GradientSection tab="import"><ImportTabDS 
          onImport={(data) => {
            onImportTransactions(data);
            const now = new Date().toISOString();
            onSetLastImportDate && onSetLastImportDate(now);
            localStorage.setItem('pn_lastImportDate', now);
            // Sync import date to database
            onUpdatePreferences({ lastImportDate: now });
          }} 
          parseCSV={parseCSV} 
          transactionCount={transactions.length} 
          theme={theme}
          activeTab={activeTab}
          previousTab={previousTab}
          userEmail={user?.email}
          hasBizBudgetAccess={BIZBUDGET_ACCESS_USERS.includes(user?.email?.toLowerCase())}
        /></GradientSection>;
      default:
        return <GradientSection tab="home"><DashboardHome transactions={transactions} goals={goals} bills={bills} tasks={tasks || []} theme={theme} lastImportDate={lastImportDate} accountLabels={accountLabels} editingAccountLabel={editingAccountLabel} setEditingAccountLabel={setEditingAccountLabel} updateAccountLabel={updateAccountLabel} /></GradientSection>;
    }
  };

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Global Responsive Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @media (max-width: 1024px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .dashboard-main {
            margin-left: 0 !important;
          }
          .dashboard-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99;
          }
        }
        @media (max-width: 768px) {
          .stat-grid-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .chart-grid-2-1 {
            grid-template-columns: 1fr !important;
          }
          .chart-grid-1-1 {
            grid-template-columns: 1fr !important;
          }
          .task-stat-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .spending-grid {
            grid-template-columns: 1fr !important;
          }
          .filter-tabs {
            flex-wrap: wrap;
          }
          .filter-tabs button {
            flex: 1 1 45%;
          }
        }
        @media (max-width: 480px) {
          .stat-grid-4 {
            grid-template-columns: 1fr !important;
          }
          .task-stat-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-header-content {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .account-toggle {
            width: 100%;
            overflow-x: auto;
          }
          .filter-tabs button {
            flex: 1 1 100%;
          }
        }
        
        /* iPhone Pro / Pro Max optimizations */
        @media (max-width: 430px) {
          .content-area {
            padding: 16px !important;
          }
          .card-padding {
            padding: 16px !important;
          }
          .header-bar {
            padding: 0 16px !important;
          }
        }
        
        /* iPad optimizations */
        @media (min-width: 768px) and (max-width: 1024px) {
          .stat-grid-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .dashboard-sidebar {
            width: 200px !important;
          }
          .dashboard-main {
            margin-left: 200px !important;
          }
        }
        
        /* Smooth animations */
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Better scrolling on iOS */
        .scroll-container {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
      
      <div style={{ display: 'flex', minHeight: '100vh', background: theme.bgMain, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="dashboard-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{ display: 'none' }}
        />
      )}

      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="mobile-menu-btn"
        style={{
          display: 'none',
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 200,
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.textPrimary} strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <style>{`
        @media (max-width: 1024px) {
          .mobile-menu-btn { display: flex !important; }
          .dashboard-overlay { display: block !important; }
        }
        
        /* Hub Card Hover Effects */
        .hub-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15) !important;
        }
        
        /* Sub-item hover effects */
        .hub-card ~ div > div:hover {
          background: rgba(99, 102, 241, 0.04);
        }
        
        /* Smooth sidebar scroll */
        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        /* Sidebar transition */
        .dashboard-sidebar {
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Collapse button hover */
        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.05);
        }
      `}</style>

      {/* Sidebar - Rich Purple Gradient (Light Mode) / Dark (Dark Mode) */}
      <aside 
        className={`dashboard-sidebar ${mobileMenuOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={{
        width: sidebarCollapsed ? '80px' : '260px',
        background: theme.sidebarBg,
        borderRight: theme.mode === 'light' ? 'none' : `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
        boxShadow: theme.mode === 'light' 
          ? '4px 0 32px rgba(30, 27, 75, 0.3)' 
          : '4px 0 24px rgba(0, 0, 0, 0.3)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Logo Area with Collapse Button */}
        <div style={{ 
          padding: sidebarCollapsed ? '16px 12px' : '20px 20px', 
          borderBottom: `1px solid ${theme.mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : theme.borderLight}`, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          minHeight: sidebarCollapsed ? '70px' : '80px'
        }}>
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              cursor: 'pointer',
              overflow: 'hidden',
              flex: sidebarCollapsed ? 'none' : 1,
              minWidth: 0,
              marginRight: sidebarCollapsed ? '0' : '12px'
            }}
          >
            <div style={{
              width: sidebarCollapsed ? '44px' : '42px',
              height: sidebarCollapsed ? '44px' : '42px',
              minWidth: sidebarCollapsed ? '44px' : '42px',
              flexShrink: 0,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(236, 72, 153, 0.4)'
            }}>
              <PennyLogo size={sidebarCollapsed ? 30 : 28} />
            </div>
            {!sidebarCollapsed && (
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <span style={{ 
                  fontWeight: '700', 
                  fontSize: '18px', 
                  color: '#FFFFFF', 
                  letterSpacing: '-0.3px' 
                }}>
                  Prosper<span style={{ 
                    color: '#F472B6'
                  }}>Nest</span>
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '2px',
                  flexWrap: 'nowrap'
                }}>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)', 
                    padding: '1px 5px', 
                    borderRadius: '4px', 
                    fontSize: '8px', 
                    fontWeight: '700', 
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    flexShrink: 0
                  }}>Beta</span>
                  {/* Role Badge for Admin/Tester */}
                  {userRole === USER_ROLES.ADMIN && (
                    <span style={{ 
                      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', 
                      padding: '1px 5px', 
                      borderRadius: '4px', 
                      fontSize: '8px', 
                      fontWeight: '700', 
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      flexShrink: 0
                    }}>Admin</span>
                  )}
                  {userRole === USER_ROLES.TESTER && (
                    <span style={{ 
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)', 
                      padding: '1px 5px', 
                      borderRadius: '4px', 
                      fontSize: '8px', 
                      fontWeight: '700', 
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      flexShrink: 0
                    }}>Tester</span>
                  )}
                  {userRole === USER_ROLES.OWNER && (
                    <span style={{ 
                      background: 'linear-gradient(135deg, #10B981, #059669)', 
                      padding: '1px 5px', 
                      borderRadius: '4px', 
                      fontSize: '8px', 
                      fontWeight: '700', 
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      flexShrink: 0
                    }}>Owner</span>
                  )}
                  <SiteStatusIndicator showLabel={false} darkMode={true} />
                </div>
              </div>
            )}
          </div>
          
          {/* Collapse Toggle Button */}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="collapse-btn"
              style={{
                width: '32px',
                height: '32px',
                minWidth: '32px',
                flexShrink: 0,
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.2s ease'
              }}
              title="Collapse sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"/>
                <polyline points="18 17 13 12 18 7"/>
              </svg>
            </button>
          )}
        </div>
        
        {/* Expand Button (when collapsed) */}
        {sidebarCollapsed && (
          <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="collapse-btn"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.2s ease'
              }}
              title="Expand sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"/>
                <polyline points="6 17 11 12 6 7"/>
              </svg>
            </button>
          </div>
        )}

        {/* Navigation - Hub Based */}
        <nav className="sidebar-nav" style={{ 
          flex: 1, 
          padding: sidebarCollapsed ? '12px 8px' : '20px 14px', 
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {/* Trial/Subscription Status Banner - Collapsible */}
          {subscriptionAccess.hasAccess && subscriptionAccess.reason === 'trial' && !sidebarCollapsed && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
              borderRadius: '14px',
              padding: trialBannerCollapsed ? '10px 14px' : '14px',
              marginBottom: '20px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              transition: 'all 0.3s ease'
            }}>
              {/* Decorative shine effect */}
              {!trialBannerCollapsed && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  borderRadius: '50%',
                  transform: 'translate(30%, -30%)'
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: trialBannerCollapsed ? '0' : '10px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(251, 191, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '14px' }}>⏱️</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#FBBF24' }}>
                    Trial: {(userRole === USER_ROLES.OWNER || userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.TESTER) ? 14 : subscriptionAccess.daysLeft} days left
                  </span>
                </div>
                <button
                  onClick={() => setTrialBannerCollapsed(!trialBannerCollapsed)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#FBBF24',
                    fontSize: '10px',
                    transition: 'all 0.2s ease'
                  }}
                  title={trialBannerCollapsed ? 'Expand' : 'Collapse'}
                >
                  {trialBannerCollapsed ? '▼' : '▲'}
                </button>
              </div>
              {!trialBannerCollapsed && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  🚀 Upgrade Now
                </button>
              )}
            </div>
          )}
          
          {/* Collapsed Trial Indicator */}
          {subscriptionAccess.hasAccess && subscriptionAccess.reason === 'trial' && sidebarCollapsed && (
            <div 
              onClick={() => setShowUpgradeModal(true)}
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px'
              }}
              title={`Trial: ${(userRole === USER_ROLES.OWNER || userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.TESTER) ? 14 : subscriptionAccess.daysLeft} days left`}
            >
              ⏱️
            </div>
          )}

          {!sidebarCollapsed && (
            <div style={{ 
              padding: '0 8px 12px', 
              color: 'rgba(255, 255, 255, 0.5)', 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🎯</span> Your Hubs
            </div>
          )}

          {/* Hubs Navigation - Modern Cards */}
          {hubs.map(hub => {
            const isExpanded = expandedHubs[hub.id];
            const isActive = hub.items.some(item => item.id === activeTab);
            const isLocked = hub.status === 'coming_soon' || (!subscriptionAccess.hasAccess && hub.status === 'active');
            const isComingSoon = hub.status === 'coming_soon';

            // Hub-specific gradient backgrounds - adapted for dark sidebar in light mode
            const isDarkSidebar = theme.mode === 'light'; // Light mode has dark sidebar now
            const hubGradients = {
              homebudget: {
                active: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                hover: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(244, 114, 182, 0.15) 100%)',
                glow: 'rgba(236, 72, 153, 0.4)',
                lightBg: isDarkSidebar ? 'rgba(236, 72, 153, 0.15)' : (theme.mode === 'dark' ? 'rgba(236, 72, 153, 0.15)' : '#FDF2F8')
              },
              bizbudget: {
                active: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                hover: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
                glow: 'rgba(167, 139, 250, 0.4)',
                lightBg: isDarkSidebar ? 'rgba(167, 139, 250, 0.15)' : (theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF')
              },
              rebudget: {
                active: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                hover: 'linear-gradient(135deg, rgba(129, 140, 248, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)',
                glow: 'rgba(129, 140, 248, 0.4)',
                lightBg: isDarkSidebar ? 'rgba(129, 140, 248, 0.15)' : (theme.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF')
              }
            };

            const gradients = hubGradients[hub.id] || hubGradients.homebudget;

            // Collapsed view - just show icon
            if (sidebarCollapsed) {
              return (
                <div key={hub.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  <div
                    onClick={() => {
                      if (isComingSoon) return;
                      if (isLocked && !subscriptionAccess.hasAccess) {
                        setShowUpgradeModal(true);
                        return;
                      }
                      // If clicking an active hub's icon, just navigate to first item
                      if (hub.items.length > 0) {
                        setActiveTab(hub.items[0].id);
                      }
                    }}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: isActive ? gradients.active : 'rgba(255, 255, 255, 0.08)',
                      border: isActive ? `2px solid ${hub.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: isComingSoon ? 'not-allowed' : 'pointer',
                      opacity: isComingSoon ? 0.4 : 1,
                      boxShadow: isActive ? `0 4px 16px ${gradients.glow}` : 'none',
                      transition: 'all 0.2s ease'
                    }}
                    title={hub.label}
                  >
                    <hub.icon />
                  </div>
                </div>
              );
            }

            return (
              <div key={hub.id} style={{ marginBottom: '12px' }}>
                {/* Hub Header Card */}
                <div
                  onClick={() => {
                    if (isComingSoon) return;
                    if (isLocked && !subscriptionAccess.hasAccess) {
                      setShowUpgradeModal(true);
                      return;
                    }
                    toggleHub(hub.id);
                  }}
                  className="hub-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '16px',
                    cursor: isComingSoon ? 'not-allowed' : 'pointer',
                    background: isActive 
                      ? gradients.lightBg
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isActive 
                      ? `2px solid ${hub.color}` 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isComingSoon ? 0.5 : 1,
                    boxShadow: isActive 
                      ? `0 4px 20px ${gradients.glow}` 
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: gradients.active,
                      borderRadius: '16px 16px 0 0'
                    }} />
                  )}

                  {/* Hub Icon - Vibrant Style */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: isActive || !isComingSoon ? gradients.active : 'linear-gradient(135deg, #6B7280, #4B5563)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: isActive 
                      ? `0 6px 20px ${gradients.glow}` 
                      : '0 4px 12px rgba(0,0,0,0.25)',
                    flexShrink: 0,
                    transition: 'all 0.3s ease'
                  }}>
                    <hub.icon />
                  </div>
                  
                  {/* Hub Label */}
                  <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', marginRight: '8px' }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '700', 
                      color: isActive ? hub.color : 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '2px',
                      flexWrap: 'nowrap'
                    }}>
                      {hub.label}
                      {isComingSoon && (
                        <span style={{
                          background: 'linear-gradient(135deg, #6B7280, #4B5563)',
                          color: 'white',
                          fontSize: '9px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          letterSpacing: '0.5px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>
                          SOON
                        </span>
                      )}
                      {isLocked && !isComingSoon && (
                        <div style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                          <Icons.Lock />
                        </div>
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'rgba(255, 255, 255, 0.5)', 
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {hub.subtitle}
                    </div>
                  </div>
                  
                  {/* Expand/Collapse Chevron */}
                  {!isComingSoon && hub.items.length > 0 && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isExpanded ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'all 0.3s ease',
                      color: isExpanded ? hub.color : 'rgba(255, 255, 255, 0.5)',
                      flexShrink: 0
                    }}>
                      <Icons.ChevronRight />
                    </div>
                  )}
                </div>

                {/* Hub Sub-items - Modern List */}
                {isExpanded && !isComingSoon && !isLocked && hub.items.length > 0 && (
                  <div style={{ 
                    marginTop: '8px',
                    marginLeft: '8px',
                    padding: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    {hub.items.map((item, index) => (
                      <div
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          color: activeTab === item.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                          background: activeTab === item.id 
                            ? gradients.active
                            : 'transparent',
                          transition: 'all 0.2s ease',
                          marginBottom: index < hub.items.length - 1 ? '4px' : 0,
                          fontSize: '13px',
                          fontWeight: activeTab === item.id ? '600' : '500',
                          boxShadow: activeTab === item.id 
                            ? `0 4px 12px ${gradients.glow}` 
                            : 'none'
                        }}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: activeTab === item.id 
                            ? 'rgba(255,255,255,0.2)' 
                            : 'rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}>
                          <item.icon />
                        </div>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {!sidebarCollapsed && (
            <div style={{ 
              padding: '20px 8px 12px', 
              color: 'rgba(255, 255, 255, 0.5)', 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚙️</span> Settings
            </div>
          )}

          {bottomNavItems.map(item => (
            sidebarCollapsed ? (
              <div key={item.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <div
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: activeTab === item.id ? theme.sidebarActive : 'rgba(255, 255, 255, 0.05)',
                    border: activeTab === item.id ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeTab === item.id ? 'white' : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    boxShadow: activeTab === item.id ? '0 4px 12px rgba(236, 72, 153, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  title={item.label}
                >
                  <item.icon />
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: activeTab === item.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  background: activeTab === item.id 
                    ? theme.sidebarActive 
                    : 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.2s ease',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: activeTab === item.id ? '600' : '500',
                  border: activeTab === item.id 
                    ? 'none' 
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: activeTab === item.id ? '0 4px 12px rgba(236, 72, 153, 0.3)' : 'none'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: activeTab === item.id 
                    ? 'rgba(255,255,255,0.2)' 
                    : 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <item.icon />
                </div>
                <span>{item.label}</span>
              </div>
            )
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={{ 
        flex: 1, 
        marginLeft: sidebarCollapsed ? '80px' : '260px', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Top Header - Premium Styling */}
        <header className="header-bar" style={{
          height: '72px',
          background: theme.headerBg || theme.bgWhite,
          borderBottom: `1px solid ${theme.headerBorder || theme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(12px)',
          boxShadow: theme.mode === 'light' 
            ? '0 1px 3px rgba(99, 102, 241, 0.04)' 
            : '0 1px 3px rgba(0, 0, 0, 0.2)'
        }}>
          {/* Search Bar - Premium Style */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
            <div className="dropdown-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                position: 'absolute', 
                left: '16px', 
                color: theme.textMuted, 
                zIndex: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search transactions, goals, bills..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery) setShowSearchResults(true);
                  setShowNotifications(false); // Close notifications
                  setShowProfileMenu(false); // Close profile menu
                }}
                style={{
                  width: '340px',
                  height: '46px',
                  background: theme.mode === 'light' 
                    ? 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)'
                    : theme.inputBg,
                  border: `1px solid ${theme.mode === 'light' ? 'rgba(99, 102, 241, 0.1)' : theme.borderLight}`,
                  borderRadius: '14px',
                  padding: '0 16px 0 48px',
                  fontSize: '14px',
                  outline: 'none',
                  color: theme.textPrimary,
                  boxShadow: theme.mode === 'light' 
                    ? 'inset 0 1px 2px rgba(0,0,0,0.02), 0 1px 2px rgba(99, 102, 241, 0.04)'
                    : 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    background: theme.mode === 'light' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme.textMuted,
                    padding: '6px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
              
              {/* Search Results Dropdown */}
              {searchQuery && showSearchResults && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '420px',
                  maxHeight: '450px',
                  overflowY: 'auto',
                  background: theme.dropdownBg,
                  borderRadius: '16px',
                  boxShadow: theme.mode === 'light' 
                    ? '0 10px 40px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(0,0,0,0.06)'
                    : '0 10px 40px rgba(0,0,0,0.4)',
                  border: `1px solid ${theme.mode === 'light' ? 'rgba(99, 102, 241, 0.1)' : theme.border}`,
                  zIndex: 200
                }}>
                  {(() => {
                    const query = searchQuery.toLowerCase();
                    
                    // Search transactions
                    const matchedTransactions = transactions.filter(t => 
                      t.description?.toLowerCase().includes(query) ||
                      t.category?.toLowerCase().includes(query) ||
                      t.amount?.toString().includes(query)
                    ).slice(0, 5);
                    
                    // Search goals
                    const matchedGoals = goals.filter(g => 
                      g.name?.toLowerCase().includes(query)
                    ).slice(0, 3);
                    
                    // Search bills
                    const matchedBills = bills.filter(b => 
                      b.name?.toLowerCase().includes(query) ||
                      b.category?.toLowerCase().includes(query)
                    ).slice(0, 3);
                    
                    // Search tasks
                    const matchedTasks = (tasks || []).filter(t => 
                      t.title?.toLowerCase().includes(query) ||
                      t.description?.toLowerCase().includes(query)
                    ).slice(0, 3);
                    
                    // Navigation items
                    const navMatches = [
                      { id: 'home', label: 'Dashboard', icon: '📊', keywords: ['dashboard', 'home', 'overview'] },
                      { id: 'sales', label: 'Sales Tracker', icon: '📈', keywords: ['sales', 'revenue', 'income tracking'] },
                      { id: 'budget', label: 'Budget', icon: '💰', keywords: ['budget', 'spending', 'allocation'] },
                      { id: 'transactions', label: 'Transactions', icon: '💳', keywords: ['transactions', 'payments', 'history'] },
                      { id: 'bills', label: 'Bills', icon: '📄', keywords: ['bills', 'utilities', 'payments due'] },
                      { id: 'goals', label: 'Goals', icon: '🎯', keywords: ['goals', 'savings', 'targets'] },
                      { id: 'tasks', label: 'Tasks', icon: '✅', keywords: ['tasks', 'todo', 'to-do'] },
                      { id: 'retirement', label: 'Retirement', icon: '🏖️', keywords: ['retirement', '401k', 'pension'] },
                      { id: 'reports', label: 'Reports', icon: '📋', keywords: ['reports', 'analytics', 'summary'] },
                      { id: 'settings', label: 'Settings', icon: '⚙️', keywords: ['settings', 'preferences', 'account'] },
                      { id: 'import', label: 'Import Data', icon: '📥', keywords: ['import', 'upload', 'csv'] }
                    ].filter(nav => 
                      nav.label.toLowerCase().includes(query) ||
                      nav.keywords.some(k => k.includes(query))
                    );
                    
                    const hasResults = matchedTransactions.length || matchedGoals.length || matchedBills.length || matchedTasks.length || navMatches.length;
                    
                    if (!hasResults) {
                      return (
                        <div style={{ padding: '32px', textAlign: 'center', color: theme.textMuted }}>
                          <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🔍</span>
                          No results found for "{searchQuery}"
                        </div>
                      );
                    }
                    
                    return (
                      <>
                        {/* Navigation Results */}
                        {navMatches.length > 0 && (
                          <div>
                            <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', background: theme.bgMain }}>
                              Pages
                            </div>
                            {navMatches.map((nav, i) => (
                              <div
                                key={nav.id}
                                onClick={() => { setActiveTab(nav.id); setSearchQuery(''); setShowSearchResults(false); }}
                                style={{
                                  padding: '12px 16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  cursor: 'pointer',
                                  borderBottom: `1px solid ${theme.borderLight}`,
                                  transition: 'background 0.15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = theme.bgMain}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <span style={{ fontSize: '20px' }}>{nav.icon}</span>
                                <div>
                                  <div style={{ fontWeight: '500', color: theme.textPrimary }}>{nav.label}</div>
                                  <div style={{ fontSize: '12px', color: theme.textMuted }}>Navigate to {nav.label}</div>
                                </div>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2" style={{ marginLeft: 'auto' }}>
                                  <polyline points="9 18 15 12 9 6"/>
                                </svg>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Transaction Results */}
                        {matchedTransactions.length > 0 && (
                          <div>
                            <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', background: theme.bgMain }}>
                              Transactions ({matchedTransactions.length})
                            </div>
                            {matchedTransactions.map((txn, i) => (
                              <div
                                key={i}
                                onClick={() => { setActiveTab('transactions'); setSearchQuery(''); setShowSearchResults(false); }}
                                style={{
                                  padding: '12px 16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  cursor: 'pointer',
                                  borderBottom: `1px solid ${theme.borderLight}`
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = theme.bgMain}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: parseFloat(txn.amount) >= 0 ? '#10B98115' : '#EF444415', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                                  {parseFloat(txn.amount) >= 0 ? '💰' : '💳'}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: '500', color: theme.textPrimary }}>{txn.description}</div>
                                  <div style={{ fontSize: '12px', color: theme.textMuted }}>{txn.category} • {new Date(txn.date).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontWeight: '600', color: parseFloat(txn.amount) >= 0 ? '#10B981' : '#EF4444' }}>
                                  {parseFloat(txn.amount) >= 0 ? '+' : ''}{formatCurrency(txn.amount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Goals Results */}
                        {matchedGoals.length > 0 && (
                          <div>
                            <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', background: theme.bgMain }}>
                              Goals ({matchedGoals.length})
                            </div>
                            {matchedGoals.map((goal, i) => (
                              <div
                                key={i}
                                onClick={() => { setActiveTab('goals'); setSearchQuery(''); setShowSearchResults(false); }}
                                style={{
                                  padding: '12px 16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  cursor: 'pointer',
                                  borderBottom: `1px solid ${theme.borderLight}`
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = theme.bgMain}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#6366F115', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                                  {goal.icon || '🎯'}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: '500', color: theme.textPrimary }}>{goal.name}</div>
                                  <div style={{ fontSize: '12px', color: theme.textMuted }}>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Bills Results */}
                        {matchedBills.length > 0 && (
                          <div>
                            <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', background: theme.bgMain }}>
                              Bills ({matchedBills.length})
                            </div>
                            {matchedBills.map((bill, i) => (
                              <div
                                key={i}
                                onClick={() => { setActiveTab('bills'); setSearchQuery(''); setShowSearchResults(false); }}
                                style={{
                                  padding: '12px 16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  cursor: 'pointer',
                                  borderBottom: `1px solid ${theme.borderLight}`
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = theme.bgMain}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F59E0B15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                                  {bill.icon || '📄'}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: '500', color: theme.textPrimary }}>{bill.name}</div>
                                  <div style={{ fontSize: '12px', color: theme.textMuted }}>Due {new Date(bill.dueDate).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontWeight: '600', color: theme.textPrimary }}>
                                  {formatCurrency(bill.amount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Tasks Results */}
                        {matchedTasks.length > 0 && (
                          <div>
                            <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', background: theme.bgMain }}>
                              Tasks ({matchedTasks.length})
                            </div>
                            {matchedTasks.map((task, i) => (
                              <div
                                key={i}
                                onClick={() => { setActiveTab('tasks'); setSearchQuery(''); setShowSearchResults(false); }}
                                style={{
                                  padding: '12px 16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  cursor: 'pointer',
                                  borderBottom: `1px solid ${theme.borderLight}`
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = theme.bgMain}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#10B98115', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                                  ✅
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: '500', color: theme.textPrimary }}>{task.title}</div>
                                  <div style={{ fontSize: '12px', color: theme.textMuted }}>{task.status}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Clean and Simple */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            
            {/* Theme Toggle */}
            <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />

            {/* Notifications - Shows Activity Count */}
            <div className="dropdown-container" style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false); // Close profile menu when opening notifications
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '8px'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {(() => {
                  // Calculate unread activity count (not dismissed)
                  const unreadCount = notificationsDismissed ? 0 : (tasks.filter(t => t.status !== 'completed').length + goals.length + bills.length);
                  return unreadCount > 0 ? (
                    <span style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: '#6366F1',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      minWidth: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: unreadCount > 9 ? '0 4px' : 0
                    }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  ) : null;
                })()}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '340px',
                  background: theme.dropdownBg,
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  border: `1px solid ${theme.border}`,
                  zIndex: 100
                }}>
                  <div style={{ padding: '16px', borderBottom: `1px solid ${theme.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: '600', color: theme.textPrimary }}>Activity</span>
                      <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '400', marginLeft: '8px' }}>
                        {tasks.filter(t => t.status !== 'completed').length + goals.length + bills.length} items
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setNotificationsDismissed(true);
                        localStorage.setItem('pn_notificationsDismissed', 'true');
                      }}
                      style={{
                        background: notificationsDismissed ? '#E5E7EB' : '#6366F115',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: '500',
                        color: notificationsDismissed ? theme.textMuted : '#6366F1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {notificationsDismissed ? '✓ Read' : 'Mark all read'}
                    </button>
                  </div>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {/* Pending Tasks */}
                    {tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task, i) => (
                      <div key={`task-${i}`} style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start', borderBottom: `1px solid ${theme.borderLight}`, opacity: notificationsDismissed ? 0.6 : 1 }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: task.status === 'in-progress' ? '#F59E0B15' : '#6366F115', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          {task.status === 'in-progress' ? '🔄' : '📋'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: theme.textPrimary }}>{task.title}</div>
                          <div style={{ fontSize: '12px', color: theme.textMuted }}>
                            {task.status === 'in-progress' ? 'In Progress' : 'To Do'} • Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                          </div>
                        </div>
                        <span style={{ 
                          fontSize: '10px', 
                          padding: '2px 8px', 
                          borderRadius: '10px',
                          background: task.status === 'in-progress' ? '#FEF3C7' : '#E0E7FF',
                          color: task.status === 'in-progress' ? '#D97706' : '#6366F1',
                          fontWeight: '500'
                        }}>
                          {task.status === 'in-progress' ? 'In Progress' : 'To-do'}
                        </span>
                      </div>
                    ))}
                    {/* Goals */}
                    {goals.slice(0, 2).map((goal, i) => (
                      <div key={`goal-${i}`} style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start', borderBottom: `1px solid ${theme.borderLight}`, opacity: notificationsDismissed ? 0.6 : 1 }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#10B98115', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          {goal.icon || '🎯'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: theme.textPrimary }}>{goal.name}</div>
                          <div style={{ fontSize: '12px', color: theme.textMuted }}>
                            Goal • {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Upcoming Bills */}
                    {bills.slice(0, 2).map((bill, i) => (
                      <div key={`bill-${i}`} style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start', borderBottom: `1px solid ${theme.borderLight}`, opacity: notificationsDismissed ? 0.6 : 1 }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EF444415', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          {bill.icon || '📄'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: theme.textPrimary }}>{bill.name}</div>
                          <div style={{ fontSize: '12px', color: theme.textMuted }}>
                            Bill • Due {new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && goals.length === 0 && bills.length === 0 && (
                      <div style={{ padding: '24px', textAlign: 'center', color: theme.textMuted }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>✨</span>
                        No pending activities
                      </div>
                    )}
                  </div>
                  <div 
                    onClick={() => { setActiveTab('tasks'); setShowNotifications(false); }}
                    style={{ padding: '12px 16px', textAlign: 'center', color: theme.primary, fontSize: '14px', fontWeight: '500', cursor: 'pointer', borderTop: `1px solid ${theme.borderLight}` }}
                  >
                    View all tasks
                  </div>
                </div>
              )}
            </div>

            {/* Profile Section - Name + Online + Avatar + Settings (Image 6) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Name and Online status */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{displayName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontSize: '12px', color: '#10B981' }}>Online</span>
                </div>
              </div>
              
              {/* Avatar */}
              <div className="dropdown-container" style={{ position: 'relative' }}>
                <div
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false); // Close notifications when opening profile menu
                  }}
                  style={{ 
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#F3E8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    cursor: 'pointer',
                    border: '2px solid #E9D5FF'
                  }}
                >
                  {userAvatar || '👨‍💼'}
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
                    onClick={() => { setShowChangePasswordModal(true); setShowProfileMenu(false); }}
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
                      color: '#EF4444',
                      borderTop: `1px solid ${theme.borderLight}`
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Logout</span>
                  </div>
                </div>
              )}
              </div>
              
              {/* Settings Gear Icon (Image 6) */}
              <button
                onClick={() => {
                  if (activeTab === 'settings') {
                    // Go back to previous tab
                    setActiveTab(previousTab);
                  } else {
                    // Save current tab and go to settings
                    setPreviousTab(activeTab);
                    setActiveTab('settings');
                  }
                }}
                style={{
                  background: activeTab === 'settings' ? `${theme.primary}15` : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'settings' ? theme.primary : theme.textMuted} strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
              
              {/* Logout Button */}
              <button
                onClick={handleSignOut}
                title="Logout"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area scroll-container" style={{ flex: 1, overflowY: 'auto' }}>
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

      {/* VIP Welcome Modal - For Perpetual License & Admin Users */}
      {showWelcomeModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.8)', 
          backdropFilter: 'blur(12px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 2500,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ 
            background: 'linear-gradient(165deg, #1E3A5F 0%, #0D2137 50%, #1E1B4B 100%)',
            borderRadius: '32px', 
            padding: '0', 
            textAlign: 'center', 
            maxWidth: '520px',
            width: '90%',
            boxShadow: '0 30px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            overflow: 'hidden',
            animation: 'slideUp 0.4s ease'
          }}>
            {/* Header with gradient accent */}
            <div style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%)',
              padding: '24px 40px 20px',
              position: 'relative'
            }}>
              <div style={{
                fontFamily: "'Georgia', serif",
                fontSize: '32px',
                fontWeight: '700',
                color: '#1E3A5F',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                ProsperNest
              </div>
            </div>
            
            {/* Penny Avatar with Trophy */}
            <div style={{
              marginTop: '-30px',
              position: 'relative',
              zIndex: 10
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4), 0 0 0 4px rgba(255,255,255,0.2)',
                position: 'relative'
              }}>
                {/* Penny emoji */}
                <span style={{ fontSize: '70px' }}>🏆</span>
              </div>
            </div>
            
            {/* Content */}
            <div style={{ padding: '24px 40px 40px' }}>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: '800', 
                color: '#F59E0B',
                marginBottom: '8px',
                letterSpacing: '1px'
              }}>
                WELCOME TO THE TEAM
              </h2>
              
              <div style={{
                width: '60px',
                height: '3px',
                background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                margin: '16px auto 24px',
                borderRadius: '2px'
              }} />
              
              <p style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '16px', 
                lineHeight: 1.7, 
                marginBottom: '16px'
              }}>
                Hi <strong style={{ color: '#FBBF24' }}>{profile?.firstName || user?.email?.split('@')[0] || 'Friend'}</strong>! 🎉
              </p>
              
              <p style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '15px', 
                lineHeight: 1.7, 
                marginBottom: '16px'
              }}>
                Penny and the entire ProsperNest team are <strong style={{ color: '#F59E0B' }}>thrilled</strong> to have you as a valued member of our community.
              </p>
              
              <p style={{ 
                color: 'rgba(255,255,255,0.75)', 
                fontSize: '14px', 
                lineHeight: 1.7, 
                marginBottom: '24px'
              }}>
                Your trust means everything to us. We're committed to helping you build the financial future you deserve. Together, we'll make your money work smarter! 💪
              </p>
              
              {/* Penny's signature */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '28px',
                padding: '16px 24px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EC4899, #F472B6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                }}>
                  😊
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: '#F472B6', fontSize: '14px', fontWeight: '600' }}>With gratitude,</div>
                  <div style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>Penny & Team ProsperNest</div>
                </div>
              </div>
              
              {/* CTA Button */}
              <button 
                onClick={() => setShowWelcomeModal(false)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(245, 158, 11, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.4)';
                }}
                style={{ 
                  padding: '16px 48px', 
                  background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                  border: 'none', 
                  borderRadius: '14px', 
                  color: '#1E3A5F',
                  fontSize: '16px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.5px'
                }}
              >
                Let's Get Started! →
              </button>
              
              {/* Footer note */}
              <div style={{ 
                marginTop: '20px', 
                fontSize: '12px', 
                color: 'rgba(255,255,255,0.5)' 
              }}>
                Questions? We're always here to help! 💬
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ 
            background: theme.bgCard, 
            borderRadius: '24px', 
            padding: '40px', 
            textAlign: 'center', 
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
            border: `1px solid ${theme.border}`
          }}>
            {/* Crown Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)'
            }}>
              <Icons.Crown />
              <span style={{ fontSize: '40px' }}>👑</span>
            </div>

            <h2 style={{ 
              fontSize: '26px', 
              fontWeight: '700', 
              color: theme.textPrimary, 
              marginBottom: '12px' 
            }}>
              {subscriptionAccess.reason === 'trial_expired' ? 'Your Trial Has Ended' : 'Upgrade to Pro'}
            </h2>
            
            <p style={{ 
              color: theme.textSecondary, 
              fontSize: '15px', 
              lineHeight: 1.6, 
              marginBottom: '32px',
              maxWidth: '360px',
              margin: '0 auto 32px'
            }}>
              {subscriptionAccess.reason === 'trial_expired' 
                ? "Your 14-day free trial has ended. Upgrade now to continue managing your finances with ProsperNest."
                : "Unlock the full power of ProsperNest to manage your finances, track goals, and build wealth."
              }
            </p>

            {/* Pricing Cards */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              {/* Starter Plan */}
              <div style={{
                flex: 1,
                padding: '20px',
                borderRadius: '16px',
                border: `2px solid ${theme.border}`,
                background: theme.bgMain,
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted, marginBottom: '4px' }}>STARTER</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '12px' }}>
                  $9<span style={{ fontSize: '14px', fontWeight: '500', color: theme.textMuted }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: theme.textSecondary }}>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> HomeBudget Hub
                  </li>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Unlimited transactions
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Reports & Analytics
                  </li>
                </ul>
              </div>

              {/* Family Plan */}
              <div style={{
                flex: 1,
                padding: '20px',
                borderRadius: '16px',
                border: `2px solid #10B981`,
                background: '#10B98108',
                textAlign: 'left',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#10B981',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 12px',
                  borderRadius: '12px'
                }}>
                  POPULAR
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#10B981', marginBottom: '4px' }}>FAMILY</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '12px' }}>
                  $14<span style={{ fontSize: '14px', fontWeight: '500', color: theme.textMuted }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: theme.textSecondary }}>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Everything in Starter
                  </li>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Up to 5 family members
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Priority support
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {subscriptionAccess.reason !== 'trial_expired' && (
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  style={{ 
                    flex: 1, 
                    padding: '14px 24px', 
                    background: 'transparent', 
                    border: `1px solid ${theme.border}`, 
                    borderRadius: '12px', 
                    color: theme.textSecondary, 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    cursor: 'pointer' 
                  }}
                >
                  Maybe Later
                </button>
              )}
              <button 
                onClick={() => {
                  // TODO: Integrate with Stripe checkout
                  alert('Payment integration coming soon! For now, please contact support@prospernest.io');
                }}
                style={{ 
                  flex: 2, 
                  padding: '14px 24px', 
                  background: 'linear-gradient(135deg, #10B981, #059669)', 
                  border: 'none', 
                  borderRadius: '12px', 
                  color: 'white', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                }}
              >
                Upgrade Now
              </button>
            </div>

            {/* Fine Print */}
            <p style={{ 
              fontSize: '11px', 
              color: theme.textMuted, 
              marginTop: '16px' 
            }}>
              Cancel anytime. No hidden fees.
            </p>
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
            
            {/* Profile Photo - Memoji Selection */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: '#F3E8FF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 12px', 
                fontSize: '40px',
                border: '3px solid #E9D5FF'
              }}>
                {userAvatar || '📷'}
              </div>
              <button 
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                style={{ background: 'none', border: 'none', color: theme.primary, fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
              >
                {showAvatarPicker ? 'Close' : 'Change Avatar'}
              </button>
              
              {/* Avatar Picker */}
              {showAvatarPicker && (
                <div style={{ marginTop: '16px', padding: '16px', background: theme.bgMain, borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '12px' }}>Choose a Memoji</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    {memojiAvatars.map((emoji, i) => (
                      <button
                        key={i}
                        onClick={() => { 
                          setUserAvatar(emoji);
                          localStorage.setItem('pn_userAvatar', emoji); // Immediate persistence
                        }}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          border: userAvatar === emoji ? `2px solid ${theme.primary}` : `1px solid ${theme.borderLight}`,
                          background: userAvatar === emoji ? `${theme.primary}15` : theme.bgCard,
                          fontSize: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: '12px' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 16px', 
                      background: theme.bgCard, 
                      border: `1px dashed ${theme.border}`, 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      color: theme.textSecondary,
                      fontSize: '13px'
                    }}>
                      <span>📁</span> Upload Custom Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUserAvatar(reader.result);
                              localStorage.setItem('pn_userAvatar', reader.result); // Immediate persistence
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>First Name</label>
                <input 
                  type="text" 
                  value={editProfile.firstName}
                  onChange={(e) => setEditProfile({...editProfile, firstName: e.target.value})}
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                  name="firstName"
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Last Name</label>
                <input 
                  type="text" 
                  value={editProfile.lastName}
                  onChange={(e) => setEditProfile({...editProfile, lastName: e.target.value})}
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                  name="lastName"
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Your email</label>
                <input 
                  type="email" 
                  value={editProfile.email || user?.email || ''}
                  onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                  placeholder="Enter your email"
                  autoComplete="email"
                  name="email"
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={editProfile.phone}
                  onChange={(e) => setEditProfile({...editProfile, phone: e.target.value})}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  name="phone"
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Date of Birth</label>
                <input 
                  type="date" 
                  value={editProfile.dateOfBirth}
                  onChange={(e) => setEditProfile({...editProfile, dateOfBirth: e.target.value})}
                  autoComplete="bday"
                  name="dateOfBirth"
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Gender</label>
                <select 
                  value={editProfile.gender}
                  onChange={(e) => setEditProfile({...editProfile, gender: e.target.value})}
                  autoComplete="sex"
                  name="gender"
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
            
            {/* Side Hustle / Profession Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>
                Side Hustle / Profession
              </label>
              <select 
                value={editProfile.sideHustle || ''}
                onChange={(e) => setEditProfile({...editProfile, sideHustle: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: theme.inputBg, 
                  border: editProfile.sideHustle === 'real-estate' ? '2px solid #10B981' : `1px solid ${theme.border}`, 
                  borderRadius: '8px', 
                  color: theme.textPrimary, 
                  fontSize: '14px', 
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select your profession...</option>
                <option value="real-estate">🏠 Real Estate Agent ⭐</option>
                <option value="photographer">📸 Photographer</option>
                <option value="hair-stylist">💇 Hair Stylist</option>
                <option value="makeup-artist">💄 Makeup Artist</option>
                <option value="fitness-trainer">💪 Fitness Trainer</option>
                <option value="freelance-creative">🎨 Freelance Creative</option>
                <option value="content-creator">📱 Content Creator</option>
                <option value="music-dj">🎵 Musician / DJ</option>
                <option value="consultant">💼 Consultant</option>
                <option value="event-planner">🎉 Event Planner</option>
                <option value="ecommerce">🛒 E-commerce Seller</option>
                <option value="handyman">🔧 Handyman / Contractor</option>
                <option value="pet-services">🐕 Pet Services</option>
                <option value="notary">📋 Notary / Mobile Services</option>
                <option value="general-sales">💰 General Sales</option>
                <option value="other">✨ Other</option>
              </select>
              {editProfile.sideHustle === 'real-estate' && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '10px 14px', 
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))', 
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>🏠</span>
                  <span style={{ fontSize: '13px', color: '#10B981', fontWeight: '600' }}>
                    Real Estate Command Center unlocked!
                  </span>
                </div>
              )}
              {editProfile.sideHustle && editProfile.sideHustle !== 'real-estate' && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '10px 14px', 
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))', 
                  borderRadius: '8px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>📊</span>
                  <span style={{ fontSize: '13px', color: theme.primary, fontWeight: '600' }}>
                    Sales Professional dashboard ready!
                  </span>
                </div>
              )}
            </div>
            
            {/* Save Button */}
            <button 
              onClick={() => { saveProfile(editProfile); setShowManageAccountModal(false); setShowAvatarPicker(false); }}
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

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal 
          theme={theme} 
          onClose={() => setShowChangePasswordModal(false)} 
        />
      )}
    </div>
    </>
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

function DashboardHome({ transactions, goals, bills = [], tasks = [], theme, lastImportDate, accountLabels, editingAccountLabel, setEditingAccountLabel, updateAccountLabel }) {
  const [timeRange, setTimeRange] = useState('month');
  const [activeAccount, setActiveAccount] = useState('all');
  const [txnSearchQuery, setTxnSearchQuery] = useState('');
  const [txnStatusFilter, setTxnStatusFilter] = useState('');
  
  // Edit mode state for dashboard customization (feature preview)
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Bulk selection for transactions
  const [selectedTxns, setSelectedTxns] = useState([]);
  
  // Collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    quickActions: false,
    financialOverview: false,
    spendingAnalysis: false,
    transactions: false,
    healthScore: false,
    spendingCategory: false,
    cashFlow: false,
    recurring: false,
    netWorth: false,
    milestones: false
  });
  
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedTxns.length === 0) return;
    if (window.confirm(`Delete ${selectedTxns.length} transaction(s)?`)) {
      console.log('Deleting transactions:', selectedTxns);
      // TODO: Implement actual delete via Supabase
      setSelectedTxns([]);
    }
  };

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

  // Calculate monthly trends - Full Year (Jan-Dec)
  const monthlyData = [];
  const currentYear = new Date().getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 12; i++) {
    const monthStr = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
    const monthTxns = activeTransactions.filter(t => t.date?.startsWith(monthStr));
    const income = monthTxns.filter(t => parseFloat(t.amount) > 0).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = monthTxns.filter(t => parseFloat(t.amount) < 0).reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    monthlyData.push({ month: monthNames[i], income, expenses });
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

  const recentTransactions = [...activeTransactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Use actual user data only - no sample/demo data for privacy
  const upcomingBills = bills.slice(0, 4);

  const displayGoals = goals.slice(0, 3);

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

  // Budget Bar Chart - Budgeted vs. Actual Expenses (Image 8)
  const BudgetBarChart = ({ data, budgets, theme, height = 240 }) => {
    const padding = { top: 20, right: 20, bottom: 50, left: 60 };
    const chartWidth = 500;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = 24;
    const groupWidth = barWidth * 2 + 8;
    
    // Calculate monthly budget (total monthly budget from budgets array)
    const monthlyBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
    
    // Use only the last 6 months of data
    const recentData = data.slice(-6);
    const maxVal = Math.max(...recentData.map(d => Math.max(d.expenses, monthlyBudget)), 1);
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Bars */}
        {recentData.map((d, i) => {
          const x = padding.left + 30 + i * ((chartWidth - padding.left - padding.right - 60) / (recentData.length - 1 || 1)) - groupWidth / 2;
          const actualHeight = Math.max(0, (d.expenses / maxVal) * chartHeight);
          const budgetHeight = Math.max(0, (monthlyBudget / maxVal) * chartHeight);
          
          return (
            <g key={i}>
              {/* Actual bar (darker) */}
              <rect
                x={x}
                y={padding.top + chartHeight - actualHeight}
                width={barWidth}
                height={actualHeight || 1}
                fill="#6366F1"
                rx="4"
              />
              {/* Budget bar (lighter) */}
              <rect
                x={x + barWidth + 4}
                y={padding.top + chartHeight - budgetHeight}
                width={barWidth}
                height={budgetHeight || 1}
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
    <div style={{ width: '100%' }}>
      {/* Header with Account Toggle */}
      <div className="dashboard-header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px', letterSpacing: '-0.5px' }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Edit Layout Button */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              border: isEditMode ? 'none' : `1px solid ${theme.borderLight}`,
              borderRadius: '10px',
              background: isEditMode ? theme.primary : theme.bgCard,
              color: isEditMode ? 'white' : theme.textSecondary,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: theme.cardShadow,
              transition: 'all 0.2s'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            {isEditMode ? 'Done' : 'Edit Layout'}
          </button>
          
          <div className="account-toggle" style={{ display: 'flex', gap: '8px', background: theme.bgCard, padding: '4px', borderRadius: '12px', boxShadow: theme.cardShadow }}>
            {[{ id: 'all', label: 'All Accounts', icon: '📊' }, { id: 'personal', label: accountLabels?.personal || 'Personal', icon: '👤' }, { id: 'sidehustle', label: accountLabels?.sidehustle || 'Side Hustle', icon: '💼' }].map(acc => (
              <div key={acc.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button onClick={() => setActiveAccount(acc.id)} style={{
                  padding: '10px 16px', border: 'none', borderRadius: '10px',
                  background: activeAccount === acc.id ? theme.primary : 'transparent',
                  color: activeAccount === acc.id ? 'white' : theme.textSecondary,
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}>
                  <span>{acc.icon}</span>
                  {editingAccountLabel === acc.id ? (
                    <input
                      type="text"
                      defaultValue={acc.label}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => updateAccountLabel(acc.id, e.target.value || acc.label)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') updateAccountLabel(acc.id, e.target.value || acc.label);
                        if (e.key === 'Escape') setEditingAccountLabel(null);
                      }}
                      style={{
                        background: 'transparent', border: 'none', borderBottom: '1px solid currentColor',
                        color: 'inherit', fontSize: '13px', fontWeight: '600', width: '80px', outline: 'none'
                      }}
                    />
                  ) : acc.label}
                </button>
                {acc.id !== 'all' && activeAccount === acc.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingAccountLabel(acc.id); }}
                    style={{
                      background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px',
                      padding: '2px 6px', fontSize: '10px', cursor: 'pointer', color: 'white', marginLeft: '4px'
                    }}
                    title="Edit label"
                  >✏️</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Edit Mode Instructions */}
      {isEditMode && (
        <div style={{
          background: `${theme.primary}15`,
          border: `1px solid ${theme.primary}30`,
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: theme.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: '600', color: theme.textPrimary, marginBottom: '2px' }}>Customize Your Dashboard</div>
            <div style={{ fontSize: '13px', color: theme.textSecondary }}>
              Drag and drop sections to rearrange them. Your layout will be saved automatically.
            </div>
          </div>
        </div>
      )}

      {/* Top Stats Row - Soft Gradient Cards */}
      <div className="stat-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {/* Income Card - Cyan Gradient */}
        <div style={{ 
          background: theme.mode === 'dark' ? 'linear-gradient(135deg, #164E63 0%, #0E4A5C 100%)' : 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)', 
          borderRadius: '20px', 
          padding: '20px', 
          boxShadow: '0 4px 20px rgba(0, 188, 212, 0.15)',
          border: `1px solid ${theme.mode === 'dark' ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: theme.mode === 'dark' ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>💰</div>
            <span style={{ fontSize: '14px', color: theme.mode === 'dark' ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Income</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: theme.mode === 'dark' ? '#E0F7FA' : '#006064', marginBottom: '8px' }}>
            {formatCurrency(activeTotals.income)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: theme.mode === 'dark' ? '#67E8F9' : '#00695C' }}>vs last month</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                ↗ 25%
              </span>
            </div>
            <Sparkline data={monthlyData.map(m => m.income)} color="#00BCD4" width={70} height={40} />
          </div>
        </div>

        {/* Expenses Card - Orange/Coral Gradient */}
        <div style={{ 
          background: theme.mode === 'dark' ? 'linear-gradient(135deg, #7C2D12 0%, #6B2A0F 100%)' : 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)', 
          borderRadius: '20px', 
          padding: '20px', 
          boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
          border: `1px solid ${theme.mode === 'dark' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: theme.mode === 'dark' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>🔥</div>
            <span style={{ fontSize: '14px', color: theme.mode === 'dark' ? '#FDBA74' : '#E65100', fontWeight: '600' }}>Expenses</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: theme.mode === 'dark' ? '#FFF3E0' : '#BF360C', marginBottom: '8px' }}>
            {formatCurrency(activeTotals.expenses)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: theme.mode === 'dark' ? '#FDBA74' : '#E65100' }}>vs last month</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
                ↗ 5%
              </span>
            </div>
            <Sparkline data={monthlyData.map(m => m.expenses)} color="#FF9800" width={70} height={40} />
          </div>
        </div>

        {/* Savings Card - Green Gradient */}
        <div style={{ 
          background: theme.mode === 'dark' ? 'linear-gradient(135deg, #14532D 0%, #115E2B 100%)' : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', 
          borderRadius: '20px', 
          padding: '20px', 
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)',
          border: `1px solid ${theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>🏦</div>
            <span style={{ fontSize: '14px', color: theme.mode === 'dark' ? '#86EFAC' : '#2E7D32', fontWeight: '600' }}>Savings</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: theme.mode === 'dark' ? '#E8F5E9' : '#1B5E20', marginBottom: '8px' }}>
            {formatCurrency(Math.max(0, activeTotals.net))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: theme.mode === 'dark' ? '#86EFAC' : '#2E7D32' }}>vs last month</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: activeTotals.net >= 0 ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
                {activeTotals.net >= 0 ? '↗' : '↘'} 15%
              </span>
            </div>
            <Sparkline data={monthlyData.map(m => m.income - m.expenses)} color="#4CAF50" width={70} height={40} />
          </div>
        </div>

        {/* Transactions Card - Purple Gradient */}
        <div style={{ 
          background: theme.mode === 'dark' ? 'linear-gradient(135deg, #4A1D6B 0%, #3D1A5A 100%)' : 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', 
          borderRadius: '20px', 
          padding: '20px', 
          boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
          border: `1px solid ${theme.mode === 'dark' ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: theme.mode === 'dark' ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>📊</div>
            <span style={{ fontSize: '14px', color: theme.mode === 'dark' ? '#D8B4FE' : '#7B1FA2', fontWeight: '600' }}>Transactions</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: theme.mode === 'dark' ? '#F3E5F5' : '#4A148C', marginBottom: '8px' }}>
            {activeTransactions.length.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: theme.mode === 'dark' ? '#D8B4FE' : '#7B1FA2' }}>vs last month</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                ↗ 10%
              </span>
            </div>
            <Sparkline data={[30, 45, 35, 50, 40, 55, 60]} color="#9C27B0" width={70} height={40} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* QUICK ACTIONS - Bills & Goals (Collapsible) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('quickActions')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.quickActions ? '24px' : '16px',
          paddingTop: '8px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #EC4899 0%, #8B5CF6 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Quick Actions</h2>
        <span style={{ 
          fontSize: '12px', 
          color: theme.textMuted,
          background: theme.bgMain,
          padding: '4px 10px',
          borderRadius: '6px'
        }}>Items needing attention</span>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.quickActions ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Bills, Tasks & Goals Row - Priority Section (3 columns) */}
      {!collapsedSections.quickActions && (
      <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Upcoming Bills */}
        <div style={{ 
          background: theme.bgCard, 
          borderRadius: '16px', 
          padding: '20px', 
          boxShadow: theme.cardShadow, 
          border: `1px solid ${theme.borderLight}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle gradient accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #EF4444 0%, #F97316 100%)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Upcoming Bills</h3>
            <span style={{ padding: '3px 8px', background: '#FEE2E2', color: '#DC2626', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>{upcomingBills.length} due</span>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {upcomingBills.slice(0, 3).map((bill, i) => {
              const dueDate = new Date(bill.dueDate);
              const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: theme.bgMain, border: daysUntil <= 3 ? '1px solid #FCA5A5' : `1px solid ${theme.borderLight}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{bill.icon || '📄'}</div>
                    <div><div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>{bill.name}</div><div style={{ fontSize: '11px', color: daysUntil <= 3 ? '#DC2626' : theme.textMuted }}>{daysUntil <= 0 ? 'Due today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}</div></div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: theme.textPrimary }}>${bill.amount.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Upcoming Tasks */}
        <div style={{ 
          background: theme.bgCard, 
          borderRadius: '16px', 
          padding: '20px', 
          boxShadow: theme.cardShadow, 
          border: `1px solid ${theme.borderLight}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle gradient accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Upcoming Tasks</h3>
            <span style={{ padding: '3px 8px', background: '#FEF3C7', color: '#D97706', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>{tasks.filter(t => t.status !== 'completed').length} pending</span>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {tasks.filter(t => t.status !== 'completed').slice(0, 3).length > 0 ? (
              tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: theme.bgMain, border: `1px solid ${theme.borderLight}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      background: task.status === 'in-progress' ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '14px' 
                    }}>{task.status === 'in-progress' ? '🔄' : '📋'}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>{task.title.slice(0, 20)}{task.title.length > 20 ? '...' : ''}</div>
                      <div style={{ fontSize: '11px', color: theme.textMuted }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
                      </div>
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '3px 8px', 
                    borderRadius: '6px',
                    background: task.status === 'in-progress' ? '#FEF3C7' : '#E0E7FF',
                    color: task.status === 'in-progress' ? '#D97706' : '#6366F1',
                    fontWeight: '600'
                  }}>
                    {task.status === 'in-progress' ? 'Active' : 'To Do'}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                background: theme.bgMain, 
                borderRadius: '10px',
                border: `1px dashed ${theme.borderLight}`
              }}>
                <span style={{ fontSize: '20px', display: 'block', marginBottom: '6px' }}>✨</span>
                <span style={{ fontSize: '12px', color: theme.textMuted }}>No pending tasks</span>
              </div>
            )}
          </div>
        </div>

        {/* Savings Goals */}
        <div style={{ 
          background: theme.bgCard, 
          borderRadius: '16px', 
          padding: '20px', 
          boxShadow: theme.cardShadow, 
          border: `1px solid ${theme.borderLight}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle gradient accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Savings Goals</h3>
            <button style={{ background: 'none', border: 'none', color: theme.primary, fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>View All →</button>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {displayGoals.slice(0, 3).map((goal, i) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={i} style={{ padding: '10px 12px', background: theme.bgMain, borderRadius: '10px', border: `1px solid ${theme.borderLight}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${goal.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{goal.icon}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>{goal.name}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</div></div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: goal.color }}>{progress.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: '6px', background: theme.borderLight, borderRadius: '3px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${goal.color} 0%, ${goal.color}CC 100%)`, borderRadius: '3px', transition: 'width 0.5s ease' }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🌟 FINANCIAL HEALTH SCORE - Premium Section */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(() => {
        // Calculate comprehensive health metrics
        const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
        const totalSpent = budgets.reduce((sum, b) => sum + (categorySpending[b.category] || 0), 0);
        
        const savingsRateCalc = activeTotals.income > 0 
          ? Math.max(0, ((activeTotals.income - activeTotals.expenses) / activeTotals.income) * 100) 
          : 0;
        
        const budgetAdherenceCalc = totalBudget > 0 
          ? Math.max(0, Math.min(100, (1 - Math.max(0, totalSpent - totalBudget) / totalBudget) * 100))
          : 100;
        
        const monthlyExpensesAvg = activeTotals.expenses / 6 || 1;
        const emergencySavings = goals.find(g => g.name?.toLowerCase().includes('emergency'))?.currentAmount || 
                                 goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0) * 0.3;
        const emergencyMonthsCovered = emergencySavings / monthlyExpensesAvg;
        
        const debtPaymentsCalc = activeTransactions.filter(t => 
          t.category?.toLowerCase().includes('loan') || 
          t.category?.toLowerCase().includes('debt') ||
          t.category?.toLowerCase().includes('credit') ||
          t.category?.toLowerCase().includes('mortgage')
        ).reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);
        const debtToIncomeRatio = activeTotals.income > 0 ? (debtPaymentsCalc / activeTotals.income) * 100 : 0;
        
        const paidBillsCount = bills.filter(b => b.status === 'paid').length;
        const billsOnTimeRate = bills.length > 0 ? (paidBillsCount / bills.length) * 100 : 100;
        
        const avgGoalProgress = goals.length > 0 
          ? (goals.reduce((sum, g) => sum + ((g.currentAmount || 0) / (g.targetAmount || 1)), 0) / goals.length) * 100 
          : 0;
        
        const overallHealthScore = Math.round(Math.min(100, Math.max(0,
          savingsRateCalc * 0.25 +
          budgetAdherenceCalc * 0.25 +
          Math.min(emergencyMonthsCovered * 8, 20) +
          (100 - Math.min(debtToIncomeRatio, 100)) * 0.15 +
          billsOnTimeRate * 0.10 +
          avgGoalProgress * 0.05
        )));
        
        const getScoreColor = (score) => {
          if (score >= 80) return '#10B981';
          if (score >= 60) return '#06B6D4';
          if (score >= 40) return '#F59E0B';
          return '#EF4444';
        };
        
        const getScoreLabel = (score) => {
          if (score >= 80) return { label: 'Excellent', emoji: '🌟' };
          if (score >= 60) return { label: 'Good', emoji: '💪' };
          if (score >= 40) return { label: 'Fair', emoji: '📈' };
          return { label: 'Needs Work', emoji: '🎯' };
        };
        
        const scoreColor = getScoreColor(overallHealthScore);
        const scoreLabel = getScoreLabel(overallHealthScore);
        
        return (
          <div style={{ marginBottom: '24px' }}>
            <div 
              onClick={() => toggleSection('healthScore')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: collapsedSections.healthScore ? '0px' : '16px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ 
                width: '4px', 
                height: '24px', 
                background: 'linear-gradient(180deg, #10B981, #06B6D4)', 
                borderRadius: '2px' 
              }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>
                Financial Health Score
              </h2>
              <span style={{ 
                background: `${scoreColor}20`,
                color: scoreColor,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {scoreLabel.emoji} {scoreLabel.label}
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: theme.textMuted,
                marginLeft: 'auto',
                transition: 'transform 0.2s',
                transform: collapsedSections.healthScore ? 'rotate(-90deg)' : 'rotate(0deg)'
              }}>▼</span>
            </div>
            
            {!collapsedSections.healthScore && (
              <div style={{
                background: theme.bgCard,
                borderRadius: '20px',
                padding: '28px',
                boxShadow: theme.cardShadow,
                border: `1px solid ${theme.borderLight}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Premium gradient accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #10B981, #06B6D4, #8B5CF6, #EC4899)'
                }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'center' }}>
                  {/* Left: Animated Score Gauge */}
                  <div style={{ textAlign: 'center' }}>
                    <svg width="220" height="140" viewBox="0 0 220 140">
                      <defs>
                        <linearGradient id="healthScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#EF4444" />
                          <stop offset="25%" stopColor="#F59E0B" />
                          <stop offset="50%" stopColor="#06B6D4" />
                          <stop offset="75%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Background arc */}
                      <path
                        d="M 20 120 A 90 90 0 0 1 200 120"
                        fill="none"
                        stroke={theme.borderLight}
                        strokeWidth="14"
                        strokeLinecap="round"
                      />
                      
                      {/* Progress arc */}
                      <path
                        d="M 20 120 A 90 90 0 0 1 200 120"
                        fill="none"
                        stroke="url(#healthScoreGradient)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={`${(overallHealthScore / 100) * 283} 283`}
                        filter="url(#glow)"
                        style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                      />
                      
                      {/* Score display */}
                      <text x="110" y="95" textAnchor="middle" fontSize="48" fontWeight="800" fill={scoreColor}>
                        {overallHealthScore}
                      </text>
                      <text x="110" y="118" textAnchor="middle" fontSize="13" fill={theme.textMuted} fontWeight="500">
                        out of 100
                      </text>
                    </svg>
                    
                    <div style={{ 
                      marginTop: '12px',
                      padding: '10px 20px',
                      background: `${scoreColor}10`,
                      borderRadius: '12px',
                      display: 'inline-block'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: scoreColor }}>
                        {scoreLabel.emoji} {scoreLabel.label} Financial Health
                      </span>
                    </div>
                  </div>
                  
                  {/* Right: Metrics Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {/* Savings Rate */}
                    <div style={{
                      background: theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)',
                      borderRadius: '16px',
                      padding: '18px',
                      border: `1px solid ${theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '18px' }}>💰</span>
                        <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '500' }}>Savings Rate</span>
                      </div>
                      <div style={{ 
                        fontSize: '26px', 
                        fontWeight: '700', 
                        color: savingsRateCalc >= 20 ? '#10B981' : savingsRateCalc >= 10 ? '#F59E0B' : '#EF4444',
                        marginBottom: '6px'
                      }}>
                        {savingsRateCalc.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textMuted }}>
                        of income saved
                        <span style={{ 
                          marginLeft: '6px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: savingsRateCalc >= 20 ? '#10B98115' : savingsRateCalc >= 10 ? '#F59E0B15' : '#EF444415',
                          color: savingsRateCalc >= 20 ? '#10B981' : savingsRateCalc >= 10 ? '#F59E0B' : '#EF4444',
                          fontSize: '9px',
                          fontWeight: '600'
                        }}>
                          {savingsRateCalc >= 20 ? '✓ Great' : savingsRateCalc >= 10 ? '⚠ OK' : '! Low'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Budget Adherence */}
                    <div style={{
                      background: theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.04)',
                      borderRadius: '16px',
                      padding: '18px',
                      border: `1px solid ${theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '18px' }}>📊</span>
                        <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '500' }}>Budget Adherence</span>
                      </div>
                      <div style={{ 
                        fontSize: '26px', 
                        fontWeight: '700', 
                        color: budgetAdherenceCalc >= 90 ? '#10B981' : budgetAdherenceCalc >= 70 ? '#F59E0B' : '#EF4444',
                        marginBottom: '6px'
                      }}>
                        {budgetAdherenceCalc.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textMuted }}>
                        within budget
                        <span style={{ 
                          marginLeft: '6px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: budgetAdherenceCalc >= 90 ? '#10B98115' : budgetAdherenceCalc >= 70 ? '#F59E0B15' : '#EF444415',
                          color: budgetAdherenceCalc >= 90 ? '#10B981' : budgetAdherenceCalc >= 70 ? '#F59E0B' : '#EF4444',
                          fontSize: '9px',
                          fontWeight: '600'
                        }}>
                          {budgetAdherenceCalc >= 90 ? '✓ On Track' : budgetAdherenceCalc >= 70 ? '⚠ Watch' : '! Over'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Emergency Fund */}
                    <div style={{
                      background: theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.04)',
                      borderRadius: '16px',
                      padding: '18px',
                      border: `1px solid ${theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '18px' }}>🛡️</span>
                        <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '500' }}>Emergency Fund</span>
                      </div>
                      <div style={{ 
                        fontSize: '26px', 
                        fontWeight: '700', 
                        color: emergencyMonthsCovered >= 3 ? '#10B981' : emergencyMonthsCovered >= 1 ? '#F59E0B' : '#EF4444',
                        marginBottom: '6px'
                      }}>
                        {emergencyMonthsCovered.toFixed(1)}mo
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textMuted }}>
                        expenses covered
                        <span style={{ 
                          marginLeft: '6px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: emergencyMonthsCovered >= 3 ? '#10B98115' : emergencyMonthsCovered >= 1 ? '#F59E0B15' : '#EF444415',
                          color: emergencyMonthsCovered >= 3 ? '#10B981' : emergencyMonthsCovered >= 1 ? '#F59E0B' : '#EF4444',
                          fontSize: '9px',
                          fontWeight: '600'
                        }}>
                          {emergencyMonthsCovered >= 3 ? '✓ Safe' : emergencyMonthsCovered >= 1 ? '⚠ Build' : '! Priority'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Debt-to-Income */}
                    <div style={{
                      background: theme.mode === 'dark' ? 'rgba(236, 72, 153, 0.08)' : 'rgba(236, 72, 153, 0.04)',
                      borderRadius: '16px',
                      padding: '18px',
                      border: `1px solid ${theme.mode === 'dark' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '18px' }}>📉</span>
                        <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '500' }}>Debt-to-Income</span>
                      </div>
                      <div style={{ 
                        fontSize: '26px', 
                        fontWeight: '700', 
                        color: debtToIncomeRatio <= 30 ? '#10B981' : debtToIncomeRatio <= 40 ? '#F59E0B' : '#EF4444',
                        marginBottom: '6px'
                      }}>
                        {debtToIncomeRatio.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textMuted }}>
                        of income to debt
                        <span style={{ 
                          marginLeft: '6px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: debtToIncomeRatio <= 30 ? '#10B98115' : debtToIncomeRatio <= 40 ? '#F59E0B15' : '#EF444415',
                          color: debtToIncomeRatio <= 30 ? '#10B981' : debtToIncomeRatio <= 40 ? '#F59E0B' : '#EF4444',
                          fontSize: '9px',
                          fontWeight: '600'
                        }}>
                          {debtToIncomeRatio <= 30 ? '✓ Healthy' : debtToIncomeRatio <= 40 ? '⚠ Caution' : '! High'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Bills On Time */}
                    <div style={{
                      background: theme.mode === 'dark' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.04)',
                      borderRadius: '16px',
                      padding: '18px',
                      border: `1px solid ${theme.mode === 'dark' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.15)'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '18px' }}>📅</span>
                        <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '500' }}>Bills On Time</span>
                      </div>
                      <div style={{ 
                        fontSize: '26px', 
                        fontWeight: '700', 
                        color: billsOnTimeRate >= 95 ? '#10B981' : billsOnTimeRate >= 80 ? '#F59E0B' : '#EF4444',
                        marginBottom: '6px'
                      }}>
                        {billsOnTimeRate.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textMuted }}>
                        paid on schedule
                        <span style={{ 
                          marginLeft: '6px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: billsOnTimeRate >= 95 ? '#10B98115' : billsOnTimeRate >= 80 ? '#F59E0B15' : '#EF444415',
                          color: billsOnTimeRate >= 95 ? '#10B981' : billsOnTimeRate >= 80 ? '#F59E0B' : '#EF4444',
                          fontSize: '9px',
                          fontWeight: '600'
                        }}>
                          {billsOnTimeRate >= 95 ? '✓ Perfect' : billsOnTimeRate >= 80 ? '⚠ Good' : '! Late'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Goal Progress */}
                    <div style={{
                      background: theme.mode === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.04)',
                      borderRadius: '16px',
                      padding: '18px',
                      border: `1px solid ${theme.mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '18px' }}>🎯</span>
                        <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '500' }}>Goal Progress</span>
                      </div>
                      <div style={{ 
                        fontSize: '26px', 
                        fontWeight: '700', 
                        color: '#8B5CF6',
                        marginBottom: '6px'
                      }}>
                        {avgGoalProgress.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '11px', color: theme.textMuted }}>
                        avg completion
                        <span style={{ 
                          marginLeft: '6px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#8B5CF615',
                          color: '#8B5CF6',
                          fontSize: '9px',
                          fontWeight: '600'
                        }}>
                          {goals.length} goals
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Smart Recommendations */}
                <div style={{ 
                  marginTop: '24px', 
                  padding: '18px 22px', 
                  background: `linear-gradient(135deg, ${theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.06)'}, ${theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.04)'})`,
                  borderRadius: '14px',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '18px' }}>💡</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#8B5CF6' }}>Smart Recommendations</span>
                  </div>
                  <div style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: '1.6' }}>
                    {savingsRateCalc < 20 && <span style={{ display: 'block', marginBottom: '6px' }}>• Boost your savings rate to 20% for stronger financial security. Consider automating transfers to savings.</span>}
                    {emergencyMonthsCovered < 3 && <span style={{ display: 'block', marginBottom: '6px' }}>• Build your emergency fund to cover 3-6 months of expenses. Even small regular contributions help!</span>}
                    {budgetAdherenceCalc < 90 && <span style={{ display: 'block', marginBottom: '6px' }}>• Review your budget categories to stay on track. Look for areas where you can cut back.</span>}
                    {debtToIncomeRatio > 30 && <span style={{ display: 'block', marginBottom: '6px' }}>• Focus on reducing debt. Consider the avalanche or snowball method for faster payoff.</span>}
                    {savingsRateCalc >= 20 && budgetAdherenceCalc >= 90 && emergencyMonthsCovered >= 3 && debtToIncomeRatio <= 30 && (
                      <span style={{ display: 'block' }}>🎉 Excellent work! You're on track with your financial goals. Consider investing surplus savings for long-term growth.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📊 SPENDING BY CATEGORY - Premium Horizontal Bar Chart */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(() => {
        const getCategoryIcon = (name) => {
          const icons = {
            'Fast Food': '🍔', 'Restaurants': '🍽️', 'Groceries': '🛒', 'Gas': '⛽',
            'Shopping': '🛍️', 'Entertainment': '🎬', 'Utilities': '💡', 'Transfer': '↔️',
            'Hobbies': '🎮', 'Doctor': '🏥', 'Pharmacy': '💊', 'Auto & Transport': '🚗',
            'Electronics & Software': '💻', 'Television': '📺', 'Financial': '🏦',
            'Category Pending': '❓', 'Other': '📦'
          };
          return icons[name] || '📦';
        };
        
        const getCatColor = (name, idx) => {
          const colors = {
            'Fast Food': '#8B5CF6', 'Restaurants': '#EC4899', 'Groceries': '#10B981',
            'Gas': '#F59E0B', 'Shopping': '#3B82F6', 'Entertainment': '#06B6D4',
            'Utilities': '#0891B2', 'Transfer': '#6366F1', 'Hobbies': '#F97316',
            'Doctor': '#EF4444', 'Category Pending': '#64748B'
          };
          return colors[name] || ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#06B6D4'][idx % 6];
        };
        
        const spendingData = sortedCategories.map(([name, spent], idx) => {
          const budget = budgets.find(b => b.category === name)?.budget || spent * 1.3;
          const pct = (spent / budget) * 100;
          return { name, spent, budget, percent: pct, color: getCatColor(name, idx), icon: getCategoryIcon(name) };
        });
        
        const totalSpending = spendingData.reduce((s, c) => s + c.spent, 0);
        const totalBudgetSpend = spendingData.reduce((s, c) => s + c.budget, 0);
        
        return (
          <div style={{ marginBottom: '24px' }}>
            <div 
              onClick={() => toggleSection('spendingCategory')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: collapsedSections.spendingCategory ? '0px' : '16px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ 
                width: '4px', 
                height: '24px', 
                background: 'linear-gradient(180deg, #EC4899, #8B5CF6)', 
                borderRadius: '2px' 
              }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>
                Spending by Category
              </h2>
              <span style={{ 
                background: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: theme.textMuted,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {spendingData.length} categories
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: theme.textMuted,
                marginLeft: 'auto',
                transition: 'transform 0.2s',
                transform: collapsedSections.spendingCategory ? 'rotate(-90deg)' : 'rotate(0deg)'
              }}>▼</span>
            </div>
            
            {!collapsedSections.spendingCategory && (
              <div style={{
                background: theme.bgCard,
                borderRadius: '20px',
                padding: '28px',
                boxShadow: theme.cardShadow,
                border: `1px solid ${theme.borderLight}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6, #06B6D4)'
                }} />
                
                {/* Header with totals */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '6px' }}>Total Spending This Period</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: '32px', fontWeight: '700', color: theme.textPrimary }}>
                        {formatCurrency(totalSpending)}
                      </span>
                      <span style={{ fontSize: '15px', color: theme.textMuted }}>
                        / {formatCurrency(totalBudgetSpend)} budgeted
                      </span>
                    </div>
                  </div>
                  <div style={{
                    padding: '8px 16px',
                    background: totalSpending <= totalBudgetSpend ? '#10B98115' : '#EF444415',
                    borderRadius: '10px',
                    border: `1px solid ${totalSpending <= totalBudgetSpend ? '#10B98130' : '#EF444430'}`
                  }}>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: totalSpending <= totalBudgetSpend ? '#10B981' : '#EF4444' 
                    }}>
                      {totalSpending <= totalBudgetSpend ? '✓ Under Budget' : '⚠ Over Budget'}
                    </span>
                  </div>
                </div>
                
                {/* Category Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {spendingData.map((cat, i) => (
                    <div key={cat.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: `${cat.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            border: `1px solid ${cat.color}25`
                          }}>
                            {cat.icon}
                          </div>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary }}>
                              {cat.name}
                            </div>
                            <div style={{ fontSize: '12px', color: theme.textMuted }}>
                              {Math.round(cat.spent / totalSpending * 100)}% of total • {formatCurrency(cat.budget)} budget
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '17px', fontWeight: '700', color: theme.textPrimary }}>
                            {formatCurrency(cat.spent)}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            fontWeight: '600',
                            color: cat.percent > 100 ? '#EF4444' : cat.percent > 80 ? '#F59E0B' : '#10B981'
                          }}>
                            {cat.percent.toFixed(0)}% used
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div style={{ position: 'relative', height: '10px' }}>
                        <div style={{
                          height: '100%',
                          background: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                          borderRadius: '5px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${Math.min(cat.percent, 100)}%`,
                            height: '100%',
                            background: cat.percent > 100 
                              ? 'linear-gradient(90deg, #EF4444, #F87171)'
                              : cat.percent > 80
                              ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                              : `linear-gradient(90deg, ${cat.color}, ${cat.color}BB)`,
                            borderRadius: '5px',
                            transition: 'width 0.6s ease-out',
                            boxShadow: cat.percent > 80 ? `0 0 10px ${cat.percent > 100 ? '#EF444450' : '#F59E0B50'}` : 'none'
                          }} />
                        </div>
                        {/* Budget line marker */}
                        <div style={{
                          position: 'absolute',
                          left: '100%',
                          top: '-2px',
                          bottom: '-2px',
                          width: '2px',
                          background: theme.textMuted,
                          borderRadius: '1px',
                          opacity: 0.5
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📈 CASH FLOW FORECAST - 30-Day Projection */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(() => {
        const today = new Date();
        const forecastDays = 30;
        const dailyAvgIncome = activeTotals.income / 30;
        const dailyAvgExpenses = activeTotals.expenses / 30;
        let runningBal = activeTotals.income - activeTotals.expenses;
        
        const forecastData = [];
        let minBal = runningBal, maxBal = runningBal;
        
        for (let i = 0; i <= forecastDays; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() + i);
          const isPayday = d.getDate() === 1 || d.getDate() === 15;
          const dayIncome = isPayday ? dailyAvgIncome * 14 : 0;
          const dayExpenses = i === 0 ? 0 : dailyAvgExpenses * (0.7 + Math.random() * 0.6);
          
          // Check for bills due
          const dueBills = bills.filter(b => {
            const bd = new Date(b.dueDate || b.date);
            return bd.toDateString() === d.toDateString() && b.status !== 'paid';
          });
          const billsAmount = dueBills.reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);
          
          runningBal += dayIncome - dayExpenses - billsAmount;
          if (runningBal < minBal) minBal = runningBal;
          if (runningBal > maxBal) maxBal = runningBal;
          
          forecastData.push({ day: i, date: d, balance: runningBal, income: dayIncome, expenses: dayExpenses + billsAmount, isPayday, bills: dueBills });
        }
        
        const startBalance = activeTotals.income - activeTotals.expenses;
        const endBalance = forecastData[forecastData.length - 1]?.balance || startBalance;
        const netChange = endBalance - startBalance;
        
        // Chart dimensions
        const cWidth = 700, cHeight = 180, pad = { t: 20, r: 20, b: 30, l: 60 };
        const chartW = cWidth - pad.l - pad.r;
        const chartH = cHeight - pad.t - pad.b;
        const yMin = Math.min(0, minBal * 1.1);
        const yMax = maxBal * 1.15;
        const yRange = yMax - yMin;
        
        const getY = (v) => pad.t + (1 - (v - yMin) / yRange) * chartH;
        const getX = (day) => pad.l + (day / forecastDays) * chartW;
        
        const pathD = forecastData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.day)} ${getY(d.balance)}`).join(' ');
        const areaD = `${pathD} L ${getX(forecastDays)} ${getY(yMin)} L ${getX(0)} ${getY(yMin)} Z`;
        
        return (
          <div style={{ marginBottom: '24px' }}>
            <div 
              onClick={() => toggleSection('cashFlow')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: collapsedSections.cashFlow ? '0px' : '16px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ 
                width: '4px', 
                height: '24px', 
                background: 'linear-gradient(180deg, #3B82F6, #06B6D4)', 
                borderRadius: '2px' 
              }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>
                Cash Flow Forecast
              </h2>
              <span style={{ 
                background: netChange >= 0 ? '#10B98120' : '#EF444420',
                color: netChange >= 0 ? '#10B981' : '#EF4444',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {netChange >= 0 ? '↗' : '↘'} {formatCurrency(Math.abs(netChange))} projected
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: theme.textMuted,
                marginLeft: 'auto',
                transition: 'transform 0.2s',
                transform: collapsedSections.cashFlow ? 'rotate(-90deg)' : 'rotate(0deg)'
              }}>▼</span>
            </div>
            
            {!collapsedSections.cashFlow && (
              <div style={{
                background: theme.bgCard,
                borderRadius: '20px',
                padding: '28px',
                boxShadow: theme.cardShadow,
                border: `1px solid ${theme.borderLight}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #3B82F6, #06B6D4, #10B981)'
                }} />
                
                {/* Balance Summary */}
                <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>Current Balance</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>
                      {formatCurrency(startBalance)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: theme.textMuted, fontSize: '24px' }}>→</div>
                  <div>
                    <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>Projected in 30 Days</div>
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: '700', 
                      color: endBalance >= startBalance ? '#10B981' : '#EF4444'
                    }}>
                      {formatCurrency(endBalance)}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                    <div style={{
                      padding: '12px 18px',
                      background: theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '600', marginBottom: '4px' }}>LOWEST</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(minBal)}</div>
                    </div>
                    <div style={{
                      padding: '12px 18px',
                      background: theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '10px', color: '#3B82F6', fontWeight: '600', marginBottom: '4px' }}>HIGHEST</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(maxBal)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Chart */}
                <div style={{ marginBottom: '20px' }}>
                  <svg width="100%" height={cHeight} viewBox={`0 0 ${cWidth} ${cHeight}`} preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="cashFlowFill" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    
                    {/* Zero line */}
                    {yMin < 0 && (
                      <line x1={pad.l} y1={getY(0)} x2={cWidth - pad.r} y2={getY(0)} stroke="#EF4444" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                    )}
                    
                    {/* Grid */}
                    {[0.25, 0.5, 0.75, 1].map((r, i) => {
                      const val = yMin + yRange * r;
                      return (
                        <g key={i}>
                          <line x1={pad.l} y1={getY(val)} x2={cWidth - pad.r} y2={getY(val)} stroke={theme.borderLight} strokeWidth="1" opacity="0.3" />
                          <text x={pad.l - 8} y={getY(val)} fill={theme.textMuted} fontSize="10" textAnchor="end" dominantBaseline="middle">
                            ${Math.round(val / 1000)}k
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Area */}
                    <path d={areaD} fill="url(#cashFlowFill)" />
                    
                    {/* Line */}
                    <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Paydays */}
                    {forecastData.filter(d => d.isPayday && d.day > 0).map((d, i) => (
                      <g key={i}>
                        <circle cx={getX(d.day)} cy={getY(d.balance)} r="7" fill="#10B981" stroke="white" strokeWidth="2" />
                        <text x={getX(d.day)} y={getY(d.balance) - 14} fill="#10B981" fontSize="12" textAnchor="middle">💰</text>
                      </g>
                    ))}
                    
                    {/* End point */}
                    <circle cx={getX(forecastDays)} cy={getY(endBalance)} r="8" fill={endBalance >= startBalance ? '#10B981' : '#EF4444'} stroke="white" strokeWidth="3" />
                    
                    {/* Day labels */}
                    {[0, 7, 14, 21, 30].map((day, i) => (
                      <text key={i} x={getX(day)} y={cHeight - 8} fill={theme.textMuted} fontSize="10" textAnchor="middle">
                        {day === 0 ? 'Today' : `Day ${day}`}
                      </text>
                    ))}
                  </svg>
                </div>
                
                {/* Legend */}
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '3px', background: '#3B82F6', borderRadius: '2px' }} />
                    <span style={{ fontSize: '12px', color: theme.textMuted }}>Projected Balance</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', background: '#10B981', borderRadius: '50%' }} />
                    <span style={{ fontSize: '12px', color: theme.textMuted }}>Paydays</span>
                  </div>
                  {yMin < 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '2px', background: '#EF4444', borderRadius: '1px' }} />
                      <span style={{ fontSize: '12px', color: theme.textMuted }}>Zero Line</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🔄 RECURRING TRANSACTIONS - Subscriptions & Bills Tracker */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(() => {
        const getRecIcon = (desc) => {
          const d = desc.toLowerCase();
          if (d.includes('netflix')) return '🎬';
          if (d.includes('spotify') || d.includes('apple music')) return '🎵';
          if (d.includes('amazon')) return '📦';
          if (d.includes('disney')) return '🏰';
          if (d.includes('hbo') || d.includes('max')) return '📺';
          if (d.includes('apple')) return '🍎';
          if (d.includes('google') || d.includes('youtube')) return '🔍';
          if (d.includes('hulu')) return '📺';
          if (d.includes('electric') || d.includes('power') || d.includes('energy')) return '⚡';
          if (d.includes('water')) return '💧';
          if (d.includes('gas') && !d.includes('gasoline')) return '🔥';
          if (d.includes('internet') || d.includes('wifi') || d.includes('comcast') || d.includes('att')) return '📶';
          if (d.includes('phone') || d.includes('mobile') || d.includes('verizon') || d.includes('t-mobile')) return '📱';
          if (d.includes('insurance')) return '🛡️';
          if (d.includes('rent') || d.includes('mortgage') || d.includes('lease')) return '🏠';
          if (d.includes('gym') || d.includes('fitness')) return '💪';
          if (d.includes('adobe') || d.includes('microsoft') || d.includes('office')) return '💻';
          return '🔄';
        };
        
        // Detect recurring by grouping similar descriptions
        const descGroups = {};
        activeTransactions.forEach(t => {
          const normalizedDesc = (t.description || 'unknown').toLowerCase().replace(/[0-9#*]/g, '').trim();
          if (!descGroups[normalizedDesc]) descGroups[normalizedDesc] = [];
          descGroups[normalizedDesc].push(t);
        });
        
        const recurringItems = Object.entries(descGroups)
          .filter(([_, txns]) => txns.length >= 2)
          .map(([desc, txns]) => {
            const avgAmt = txns.reduce((s, t) => s + Math.abs(parseFloat(t.amount) || 0), 0) / txns.length;
            const origDesc = txns[0]?.description || desc;
            const isSub = desc.includes('netflix') || desc.includes('spotify') || desc.includes('hulu') ||
                         desc.includes('disney') || desc.includes('hbo') || desc.includes('apple') ||
                         desc.includes('amazon prime') || desc.includes('youtube') || desc.includes('adobe') ||
                         desc.includes('microsoft') || desc.includes('gym') || desc.includes('fitness');
            return { desc: origDesc, count: txns.length, avgAmount: avgAmt, category: txns[0]?.category || 'Other', isSub, icon: getRecIcon(desc) };
          })
          .sort((a, b) => b.avgAmount - a.avgAmount);
        
        const subscriptions = recurringItems.filter(r => r.isSub).slice(0, 6);
        const fixedBills = recurringItems.filter(r => !r.isSub && r.avgAmount >= 30).slice(0, 6);
        const subTotal = subscriptions.reduce((s, r) => s + r.avgAmount, 0);
        const billsTotal = fixedBills.reduce((s, r) => s + r.avgAmount, 0);
        
        return (
          <div style={{ marginBottom: '24px' }}>
            <div 
              onClick={() => toggleSection('recurring')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: collapsedSections.recurring ? '0px' : '16px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ 
                width: '4px', 
                height: '24px', 
                background: 'linear-gradient(180deg, #F59E0B, #EF4444)', 
                borderRadius: '2px' 
              }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>
                Recurring Transactions
              </h2>
              <span style={{ 
                background: '#F59E0B20',
                color: '#F59E0B',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {formatCurrency(subTotal + billsTotal)}/mo estimated
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: theme.textMuted,
                marginLeft: 'auto',
                transition: 'transform 0.2s',
                transform: collapsedSections.recurring ? 'rotate(-90deg)' : 'rotate(0deg)'
              }}>▼</span>
            </div>
            
            {!collapsedSections.recurring && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Subscriptions */}
                <div style={{
                  background: theme.bgCard,
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: theme.cardShadow,
                  border: `1px solid ${theme.borderLight}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #8B5CF6, #EC4899)'
                  }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>Subscriptions</div>
                      <div style={{ fontSize: '12px', color: theme.textMuted }}>{subscriptions.length} active services</div>
                    </div>
                    <div style={{ 
                      fontSize: '22px', 
                      fontWeight: '700', 
                      color: '#8B5CF6',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '4px'
                    }}>
                      {formatCurrency(subTotal)}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: theme.textMuted }}>/mo</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {subscriptions.length > 0 ? subscriptions.map((sub, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        background: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '12px',
                        border: `1px solid ${theme.borderLight}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{sub.icon}</span>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>
                              {sub.desc.slice(0, 22)}{sub.desc.length > 22 ? '...' : ''}
                            </div>
                            <div style={{ fontSize: '11px', color: theme.textMuted }}>{sub.count}x detected</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#8B5CF6' }}>
                          {formatCurrency(sub.avgAmount)}
                        </div>
                      </div>
                    )) : (
                      <div style={{ textAlign: 'center', padding: '30px', color: theme.textMuted }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📭</span>
                        <span style={{ fontSize: '13px' }}>No subscriptions detected yet</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Fixed Bills */}
                <div style={{
                  background: theme.bgCard,
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: theme.cardShadow,
                  border: `1px solid ${theme.borderLight}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #F59E0B, #EF4444)'
                  }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>Fixed Bills</div>
                      <div style={{ fontSize: '12px', color: theme.textMuted }}>{fixedBills.length} recurring payments</div>
                    </div>
                    <div style={{ 
                      fontSize: '22px', 
                      fontWeight: '700', 
                      color: '#F59E0B',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '4px'
                    }}>
                      {formatCurrency(billsTotal)}
                      <span style={{ fontSize: '12px', fontWeight: '500', color: theme.textMuted }}>/mo</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {fixedBills.length > 0 ? fixedBills.map((bill, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        background: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '12px',
                        border: `1px solid ${theme.borderLight}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{bill.icon}</span>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>
                              {bill.desc.slice(0, 22)}{bill.desc.length > 22 ? '...' : ''}
                            </div>
                            <div style={{ fontSize: '11px', color: theme.textMuted }}>{bill.category}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#F59E0B' }}>
                          {formatCurrency(bill.avgAmount)}
                        </div>
                      </div>
                    )) : (
                      <div style={{ textAlign: 'center', padding: '30px', color: theme.textMuted }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📭</span>
                        <span style={{ fontSize: '13px' }}>No recurring bills detected yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FINANCIAL OVERVIEW (Collapsible) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('financialOverview')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.financialOverview ? '24px' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #3B82F6 0%, #06B6D4 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Financial Overview</h2>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.financialOverview ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Chart Row - 3 Columns: Income vs Expenses | Income Forecast | Health Gauge */}
      {!collapsedSections.financialOverview && (
      <div className="chart-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Income vs. Expenses Line Chart */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Income vs. Expenses</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06B6D4' }} />
                <span style={{ fontSize: '11px', color: theme.textMuted }}>Income</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B5CF6' }} />
                <span style={{ fontSize: '11px', color: theme.textMuted }}>Expenses</span>
              </div>
            </div>
          </div>
          <LineChart data={monthlyData} height={280} />
        </div>

        {/* Income Forecast with Sales Commissions - NEW */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Income Forecast</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: '11px', color: theme.textMuted }}>Actual</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                <span style={{ fontSize: '11px', color: theme.textMuted }}>Forecast</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B5CF6' }} />
                <span style={{ fontSize: '11px', color: theme.textMuted }}>Expenses</span>
              </div>
            </div>
          </div>
          {/* 3-Line Chart for Income Forecast */}
          <div style={{ height: '280px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="40" y1={40 + i * 50} x2="390" y2={40 + i * 50} stroke={theme.borderLight} strokeWidth="1" strokeDasharray="4,4" />
              ))}
              
              {/* Actual Income Line (green) */}
              <path
                d={`M 40 ${200 - monthlyData[0]?.income / 500} ${monthlyData.map((d, i) => `L ${40 + i * 30} ${200 - Math.min(d.income / 500, 160)}`).join(' ')}`}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
              />
              
              {/* Forecasted Income Line (amber/dashed) - includes projected sales commissions */}
              <path
                d={`M 40 ${200 - monthlyData[0]?.income / 500} ${monthlyData.map((d, i) => {
                  const forecastBoost = i >= 9 ? 5000 + Math.random() * 3000 : 0; // Add forecast for future months
                  return `L ${40 + i * 30} ${200 - Math.min((d.income + forecastBoost) / 500, 160)}`;
                }).join(' ')}`}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="6,4"
              />
              
              {/* Expenses Line (purple) */}
              <path
                d={`M 40 ${200 - monthlyData[0]?.expenses / 500} ${monthlyData.map((d, i) => `L ${40 + i * 30} ${200 - Math.min(d.expenses / 500, 160)}`).join(' ')}`}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              
              {/* Month labels */}
              {monthlyData.map((d, i) => (
                <text key={i} x={40 + i * 30} y="270" fill={theme.textMuted} fontSize="10" textAnchor="middle">{d.month}</text>
              ))}
            </svg>
            
            {/* Forecast callout */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#F59E0B15',
              border: '1px solid #F59E0B40',
              borderRadius: '8px',
              padding: '8px 12px'
            }}>
              <div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: '600' }}>PROJECTED</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>+$8,250</div>
              <div style={{ fontSize: '10px', color: theme.textMuted }}>from commissions</div>
            </div>
          </div>
        </div>

        {/* Financial Health Gauge */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Financial Health</h3>
            <button style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', fontSize: '18px' }}>⋮</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flex: 1, alignItems: 'center' }}>
            <ProgressGauge score={healthScore} size={220} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 5px', marginTop: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', justifyContent: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }} />
                <span style={{ fontSize: '11px', color: theme.textMuted }}>Healthy</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: theme.textPrimary }}>{healthScore >= 50 ? healthScore : 100 - healthScore}%</div>
              <div style={{ fontSize: '11px', color: theme.textMuted }}>Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', justifyContent: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06B6D4' }} />
                <span style={{ fontSize: '11px', color: theme.textMuted }}>Savings Rate</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: theme.textPrimary }}>{savingsRate.toFixed(0)}%</div>
              <div style={{ fontSize: '11px', color: theme.textMuted }}>of income</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SPENDING ANALYSIS (Collapsible) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('spendingAnalysis')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.spendingAnalysis ? '24px' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Spending Analysis</h2>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.spendingAnalysis ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Spending Analysis Row - 3 Columns */}
      {!collapsedSections.spendingAnalysis && (
      <div className="chart-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Budgeted vs. Actual Expenses - Bar Chart */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0, lineHeight: '1.4', maxWidth: '50%' }}>
              Track budgeted vs actual expenses to understand trends.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1' }} />
                <span style={{ fontSize: '10px', color: theme.textMuted }}>Actual</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C7D2FE' }} />
                <span style={{ fontSize: '10px', color: theme.textMuted }}>Budget</span>
              </div>
            </div>
          </div>
          <BudgetBarChart data={monthlyData} budgets={budgets} theme={theme} height={280} />
        </div>

        {/* Expense Forecast - NEW 3-Line Chart */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Expense Forecast</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
                <span style={{ fontSize: '10px', color: theme.textMuted }}>Actual</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EC4899' }} />
                <span style={{ fontSize: '10px', color: theme.textMuted }}>Forecast</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: '10px', color: theme.textMuted }}>Budget</span>
              </div>
            </div>
          </div>
          {/* 3-Line Chart for Expense Forecast */}
          <div style={{ height: '280px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="40" y1={40 + i * 50} x2="390" y2={40 + i * 50} stroke={theme.borderLight} strokeWidth="1" strokeDasharray="4,4" />
              ))}
              
              {/* Budget Line (green - target) */}
              <path
                d={`M 40 120 ${monthlyData.map((d, i) => `L ${40 + i * 30} 120`).join(' ')}`}
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="8,4"
              />
              
              {/* Actual Expenses Line (red) */}
              <path
                d={`M 40 ${200 - monthlyData[0]?.expenses / 500} ${monthlyData.map((d, i) => `L ${40 + i * 30} ${200 - Math.min(d.expenses / 500, 160)}`).join(' ')}`}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
              />
              
              {/* Forecasted Expenses Line (pink/dashed) - projected from sales tracker */}
              <path
                d={`M 40 ${200 - monthlyData[0]?.expenses / 500} ${monthlyData.map((d, i) => {
                  const forecastExpenses = i >= 9 ? 2000 + Math.random() * 1500 : 0; // Add forecast for future months
                  return `L ${40 + i * 30} ${200 - Math.min((d.expenses + forecastExpenses) / 500, 160)}`;
                }).join(' ')}`}
                fill="none"
                stroke="#EC4899"
                strokeWidth="2"
                strokeDasharray="6,4"
              />
              
              {/* Month labels */}
              {monthlyData.map((d, i) => (
                <text key={i} x={40 + i * 30} y="270" fill={theme.textMuted} fontSize="10" textAnchor="middle">{d.month}</text>
              ))}
            </svg>
            
            {/* Forecast callout */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#EC489915',
              border: '1px solid #EC489940',
              borderRadius: '8px',
              padding: '8px 12px'
            }}>
              <div style={{ fontSize: '10px', color: '#EC4899', fontWeight: '600' }}>PROJECTED</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>+$3,500</div>
              <div style={{ fontSize: '10px', color: theme.textMuted }}>upcoming expenses</div>
            </div>
          </div>
        </div>

        {/* Spending Breakdown - Simplified for 3-column */}
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Spending</h3>
            <button style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', fontSize: '18px' }}>⋮</button>
          </div>
          <div className="spending-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Left side - List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {spendingCards.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '3px', height: '32px', borderRadius: '2px', background: item.color }} />
                  <div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>{item.category}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>
                      {formatCurrency(item.spent)} <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: '400' }}>/{formatCurrency(item.budget)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Right side - Overlapping Pebble Shapes */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px'
            }}>
              {/* Overlapping pebble cluster - Smaller for 3-column */}
              <div style={{ position: 'relative', width: '200px', height: '180px' }}>
                {(() => {
                  const sortedByPercent = [...spendingCards].sort((a, b) => b.percent - a.percent);
                  const pebbleColors = ['#6366F1', '#6B7280', '#3B82F6', '#D1D5DB'];
                  const positions = [
                    { left: 10, top: 40, size: 90, zIndex: 4 },
                    { left: 90, top: 5, size: 75, zIndex: 3 },
                    { left: 110, top: 70, size: 70, zIndex: 2 },
                    { left: 50, top: 100, size: 60, zIndex: 1 }
                  ];
                  
                  return sortedByPercent.map((item, i) => {
                    const pos = positions[i] || positions[0];
                    const color = pebbleColors[i] || pebbleColors[0];
                    
                    return (
                      <div 
                        key={i}
                        style={{
                          position: 'absolute',
                          left: `${pos.left}px`,
                          top: `${pos.top}px`,
                          zIndex: pos.zIndex,
                          width: `${pos.size}px`,
                          height: `${pos.size}px`
                        }}
                      >
                        <svg width={pos.size} height={pos.size} viewBox="0 0 100 100">
                          <defs>
                            <linearGradient id={`pebbleGrad3${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={color} />
                              <stop offset="100%" stopColor={color} stopOpacity="0.85" />
                            </linearGradient>
                          </defs>
                          <path 
                            d="M50 5 C70 5, 90 20, 92 45 C94 70, 75 92, 50 92 C25 92, 8 70, 10 45 C12 20, 30 5, 50 5 Z"
                            fill={`url(#pebbleGrad3${i})`}
                            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
                          />
                          <text x="50" y="55" textAnchor="middle" fill="white" fontSize={pos.size > 80 ? "18" : "14"} fontWeight="700">
                            {Math.round(item.percent)}%
                          </text>
                        </svg>
                      </div>
                    );
                  });
                })()}
              </div>
              
              {/* Legend - 2x2 grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '4px 12px',
                marginTop: '8px',
                width: '100%'
              }}>
                {(() => {
                  const sortedByPercent = [...spendingCards].sort((a, b) => b.percent - a.percent);
                  const pebbleColors = ['#6366F1', '#6B7280', '#3B82F6', '#D1D5DB'];
                  return sortedByPercent.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: pebbleColors[i], flexShrink: 0 }} />
                      <span style={{ color: theme.textSecondary, fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60px' }}>{item.category}</span>
                      <span style={{ color: theme.textMuted, fontSize: '11px', marginLeft: 'auto' }}>{Math.round(item.percent)}%</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LATEST TRANSACTIONS (Collapsible) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('transactions')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.transactions ? '24px' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #6366F1 0%, #8B5CF6 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Latest Transactions</h2>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.transactions ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Latest Transactions Table */}
      {!collapsedSections.transactions && (
      <div style={{ 
        background: theme.bgCard, 
        borderRadius: '16px', 
        padding: '24px', 
        boxShadow: theme.cardShadow, 
        border: `1px solid ${theme.borderLight}`, 
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle gradient accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>Filter & Search</h3>
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
        
        {/* Bulk Actions Bar */}
        {selectedTxns.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px',
            background: '#FEE2E215', borderRadius: '10px', marginBottom: '16px', border: '1px solid #FEE2E2'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{selectedTxns.length} selected</span>
            <button onClick={handleBulkDelete} style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
              background: '#EF4444', border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer'
            }}>🗑️ Delete Selected</button>
            <button onClick={() => setSelectedTxns([])} style={{
              padding: '8px 16px', background: 'transparent', border: `1px solid ${theme.border}`,
              borderRadius: '8px', color: theme.textSecondary, fontSize: '13px', cursor: 'pointer'
            }}>Cancel</button>
          </div>
        )}
        
        {/* Table */}
        {recentTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: theme.textMuted }}>No transactions yet</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: theme.textMuted, width: '40px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedTxns.length === recentTransactions.length && recentTransactions.length > 0}
                      onChange={(e) => setSelectedTxns(e.target.checked ? recentTransactions.map((_, i) => i) : [])}
                      style={{ cursor: 'pointer' }} 
                    />
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
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Account</th>
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
                    'Refunded': { bg: '#FEE2E2', color: '#DC2626', dot: '#EF4444' },
                    'Posted': { bg: '#D1FAE5', color: '#059669', dot: '#10B981' }
                  };
                  const statusStyle = statusColors[status] || statusColors['Paid'];
                  const isSideHustle = t.accountType === 'sidehustle';
                  const acctStyle = isSideHustle 
                    ? { bg: '#FEE2E2', color: '#DC2626', icon: '💼', label: accountLabels?.sidehustle || 'Side Hustle' }
                    : { bg: '#DBEAFE', color: '#2563EB', icon: '👤', label: accountLabels?.personal || 'Personal' };
                  
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                      <td style={{ padding: '16px 8px' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedTxns.includes(i)}
                          onChange={(e) => setSelectedTxns(e.target.checked ? [...selectedTxns, i] : selectedTxns.filter(x => x !== i))}
                          style={{ cursor: 'pointer' }} 
                        />
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
                      <td style={{ padding: '16px 8px' }}>
                        <select
                          value={t.accountType || 'personal'}
                          onChange={(e) => {
                            // Update transaction account type
                            console.log('Update transaction', t.id, 'to', e.target.value);
                            // TODO: Implement actual update via Supabase
                          }}
                          style={{ 
                            appearance: 'none',
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            padding: '4px 24px 4px 12px', 
                            borderRadius: '20px', 
                            background: `${acctStyle.bg} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 8px center`,
                            color: acctStyle.color, 
                            fontSize: '12px', 
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="personal">👤 {accountLabels?.personal || 'Personal'}</option>
                          <option value="sidehustle">💼 {accountLabels?.sidehustle || 'Side Hustle'}</option>
                        </select>
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
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💰 NET WORTH TRACKER - Wealth Building */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(() => {
        // Calculate net worth metrics
        const savingsFromGoals = goals.reduce((sum, g) => sum + (parseFloat(g.currentAmount) || 0), 0);
        const estimatedAssets = (activeTotals.income * 2.5) + savingsFromGoals;
        const estimatedLiabilities = activeTotals.expenses * 0.25;
        const netWorthValue = estimatedAssets - estimatedLiabilities;
        const monthlyChange = activeTotals.income - activeTotals.expenses;
        
        // Trend data (simulated - 6 months)
        const trendData = [
          { month: 'Jul', value: netWorthValue * 0.82 },
          { month: 'Aug', value: netWorthValue * 0.86 },
          { month: 'Sep', value: netWorthValue * 0.90 },
          { month: 'Oct', value: netWorthValue * 0.94 },
          { month: 'Nov', value: netWorthValue * 0.97 },
          { month: 'Dec', value: netWorthValue }
        ];
        
        const minVal = Math.min(...trendData.map(d => d.value)) * 0.95;
        const maxVal = Math.max(...trendData.map(d => d.value)) * 1.05;
        
        return (
          <div style={{ marginBottom: '24px' }}>
            <div 
              onClick={() => toggleSection('netWorth')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: collapsedSections.netWorth ? '0px' : '16px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ 
                width: '4px', 
                height: '24px', 
                background: 'linear-gradient(180deg, #10B981, #3B82F6)', 
                borderRadius: '2px' 
              }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>
                Net Worth
              </h2>
              <span style={{ 
                background: monthlyChange >= 0 ? '#10B98120' : '#EF444420',
                color: monthlyChange >= 0 ? '#10B981' : '#EF4444',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {monthlyChange >= 0 ? '+' : ''}{formatCurrency(monthlyChange)} this month
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: theme.textMuted,
                marginLeft: 'auto',
                transition: 'transform 0.2s',
                transform: collapsedSections.netWorth ? 'rotate(-90deg)' : 'rotate(0deg)'
              }}>▼</span>
            </div>
            
            {!collapsedSections.netWorth && (
              <div style={{
                background: theme.bgCard,
                borderRadius: '20px',
                padding: '28px',
                boxShadow: theme.cardShadow,
                border: `1px solid ${theme.borderLight}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6)'
                }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
                  {/* Left: Net Worth Display */}
                  <div>
                    <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Total Net Worth</div>
                    <div style={{ 
                      fontSize: '40px', 
                      fontWeight: '800', 
                      color: netWorthValue >= 0 ? '#10B981' : '#EF4444',
                      marginBottom: '28px',
                      letterSpacing: '-1px'
                    }}>
                      {formatCurrency(netWorthValue)}
                    </div>
                    
                    {/* Assets & Liabilities */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{
                        background: theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '22px' }}>📈</span>
                            <span style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '500' }}>Total Assets</span>
                          </div>
                          <span style={{ fontSize: '20px', fontWeight: '700', color: '#10B981' }}>
                            {formatCurrency(estimatedAssets)}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{
                        background: theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '22px' }}>📉</span>
                            <span style={{ fontSize: '14px', color: theme.textSecondary, fontWeight: '500' }}>Total Liabilities</span>
                          </div>
                          <span style={{ fontSize: '20px', fontWeight: '700', color: '#EF4444' }}>
                            {formatCurrency(estimatedLiabilities)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Trend Chart */}
                  <div>
                    <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '16px' }}>6 Month Trend</div>
                    <svg width="100%" height="180" viewBox="0 0 350 180" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id="netWorthAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid */}
                      {[0, 1, 2, 3].map(i => (
                        <line key={i} x1="30" y1={30 + i * 35} x2="340" y2={30 + i * 35} stroke={theme.borderLight} strokeWidth="1" opacity="0.4" />
                      ))}
                      
                      {/* Area */}
                      <path
                        d={`M 30 ${150 - ((trendData[0].value - minVal) / (maxVal - minVal)) * 120} 
                            ${trendData.map((d, i) => `L ${30 + i * 62} ${150 - ((d.value - minVal) / (maxVal - minVal)) * 120}`).join(' ')} 
                            L 340 150 L 30 150 Z`}
                        fill="url(#netWorthAreaGrad)"
                      />
                      
                      {/* Line */}
                      <path
                        d={`M 30 ${150 - ((trendData[0].value - minVal) / (maxVal - minVal)) * 120} 
                            ${trendData.map((d, i) => `L ${30 + i * 62} ${150 - ((d.value - minVal) / (maxVal - minVal)) * 120}`).join(' ')}`}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      
                      {/* Points and labels */}
                      {trendData.map((d, i) => (
                        <g key={i}>
                          <circle
                            cx={30 + i * 62}
                            cy={150 - ((d.value - minVal) / (maxVal - minVal)) * 120}
                            r="5"
                            fill="#10B981"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <text x={30 + i * 62} y="170" fill={theme.textMuted} fontSize="11" textAnchor="middle">
                            {d.month}
                          </text>
                        </g>
                      ))}
                    </svg>
                    
                    {/* Growth indicator */}
                    <div style={{
                      marginTop: '16px',
                      padding: '14px 18px',
                      background: theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>🚀</span>
                        <span style={{ fontSize: '13px', color: theme.textSecondary }}>6-Month Growth</span>
                      </div>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>
                        +{((trendData[5].value - trendData[0].value) / trendData[0].value * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🏆 FINANCIAL MILESTONES & ACHIEVEMENTS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(() => {
        const savingsRateAch = activeTotals.income > 0 
          ? ((activeTotals.income - activeTotals.expenses) / activeTotals.income) * 100 
          : 0;
        
        const completedGoalsCount = goals.filter(g => (g.currentAmount / g.targetAmount) >= 1).length;
        
        const achievements = [
          { 
            icon: '💰', 
            title: 'Super Saver', 
            desc: 'Saving 20%+ of income', 
            color: '#10B981', 
            earned: savingsRateAch >= 20 
          },
          { 
            icon: '💵', 
            title: 'Steady Saver', 
            desc: 'Saving 10%+ of income', 
            color: '#06B6D4', 
            earned: savingsRateAch >= 10 
          },
          { 
            icon: '📊', 
            title: 'Data Master', 
            desc: '100+ transactions', 
            color: '#8B5CF6', 
            earned: activeTransactions.length >= 100 
          },
          { 
            icon: '🎯', 
            title: 'Goal Crusher', 
            desc: 'Completed a goal', 
            color: '#EC4899', 
            earned: completedGoalsCount >= 1 
          },
          { 
            icon: '✅', 
            title: 'Under Budget', 
            desc: 'Spend less than earn', 
            color: '#10B981', 
            earned: activeTotals.expenses < activeTotals.income 
          },
          { 
            icon: '🔥', 
            title: 'Consistency King', 
            desc: 'Track for 30+ days', 
            color: '#F59E0B', 
            earned: activeTransactions.length >= 30 
          },
          { 
            icon: '🛡️', 
            title: 'Safety Net', 
            desc: 'Emergency fund started', 
            color: '#3B82F6', 
            earned: goals.some(g => g.name?.toLowerCase().includes('emergency') && g.currentAmount > 0) 
          },
          { 
            icon: '📈', 
            title: 'Wealth Builder', 
            desc: 'Positive net worth', 
            color: '#10B981', 
            earned: (activeTotals.income - activeTotals.expenses) > 0 
          }
        ];
        
        const earnedCount = achievements.filter(a => a.earned).length;
        
        // Simulated streaks
        const budgetStreak = Math.floor(Math.random() * 20) + 5;
        const savingsStreak = Math.floor(Math.random() * 12) + 2;
        
        return (
          <div style={{ marginBottom: '24px' }}>
            <div 
              onClick={() => toggleSection('milestones')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: collapsedSections.milestones ? '0px' : '16px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ 
                width: '4px', 
                height: '24px', 
                background: 'linear-gradient(180deg, #F59E0B, #EC4899)', 
                borderRadius: '2px' 
              }} />
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>
                Achievements & Streaks
              </h2>
              <span style={{ 
                background: '#F59E0B20',
                color: '#F59E0B',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                🔥 {budgetStreak} day streak
              </span>
              <span style={{ 
                background: '#8B5CF620',
                color: '#8B5CF6',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                🏆 {earnedCount}/{achievements.length} earned
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: theme.textMuted,
                marginLeft: 'auto',
                transition: 'transform 0.2s',
                transform: collapsedSections.milestones ? 'rotate(-90deg)' : 'rotate(0deg)'
              }}>▼</span>
            </div>
            
            {!collapsedSections.milestones && (
              <div style={{
                background: theme.bgCard,
                borderRadius: '20px',
                padding: '28px',
                boxShadow: theme.cardShadow,
                border: `1px solid ${theme.borderLight}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #F59E0B, #EC4899, #8B5CF6)'
                }} />
                
                {/* Streaks Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${theme.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.08)'}, ${theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'})`,
                    borderRadius: '18px',
                    padding: '24px',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <div style={{ fontSize: '48px' }}>🔥</div>
                    <div>
                      <div style={{ fontSize: '36px', fontWeight: '800', color: '#F59E0B', lineHeight: 1 }}>{budgetStreak}</div>
                      <div style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '4px' }}>Days under budget</div>
                    </div>
                  </div>
                  
                  <div style={{
                    background: `linear-gradient(135deg, ${theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)'}, ${theme.mode === 'dark' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.05)'})`,
                    borderRadius: '18px',
                    padding: '24px',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <div style={{ fontSize: '48px' }}>💪</div>
                    <div>
                      <div style={{ fontSize: '36px', fontWeight: '800', color: '#10B981', lineHeight: 1 }}>{savingsStreak}</div>
                      <div style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '4px' }}>Months hitting savings goal</div>
                    </div>
                  </div>
                </div>
                
                {/* Achievements Grid */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, marginBottom: '16px' }}>
                    Achievements ({earnedCount}/{achievements.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                    {achievements.map((ach, i) => (
                      <div key={i} style={{
                        background: ach.earned 
                          ? `${ach.color}12`
                          : theme.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '16px',
                        padding: '20px 16px',
                        border: `1px solid ${ach.earned ? `${ach.color}30` : theme.borderLight}`,
                        textAlign: 'center',
                        opacity: ach.earned ? 1 : 0.5,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {ach.earned && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: ach.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: 'white'
                          }}>✓</div>
                        )}
                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>{ach.earned ? ach.icon : '🔒'}</div>
                        <div style={{ 
                          fontSize: '13px', 
                          fontWeight: '600', 
                          color: ach.earned ? ach.color : theme.textMuted,
                          marginBottom: '4px'
                        }}>
                          {ach.title}
                        </div>
                        <div style={{ fontSize: '11px', color: theme.textMuted }}>
                          {ach.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

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
// TASKS TAB - Task Management (Image 6 inspired)
// ============================================================================
function TasksTab({ tasks, onUpdateTasks, theme, lastImportDate }) {
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium', category: 'Personal' });
  const [editingTask, setEditingTask] = useState(null);

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const filteredTasks = filter === 'all' ? tasks : 
    filter === 'todo' ? todoTasks :
    filter === 'in-progress' ? inProgressTasks : completedTasks;

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task = {
      id: Date.now(),
      ...newTask,
      status: 'todo',
      createdAt: new Date().toISOString()
    };
    onUpdateTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', category: 'Personal' });
    setShowAddModal(false);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    onUpdateTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (taskId) => {
    onUpdateTasks(tasks.filter(t => t.id !== taskId));
  };

  const priorityColors = {
    high: { bg: '#FEE2E2', color: '#DC2626', label: 'High' },
    medium: { bg: '#FEF3C7', color: '#D97706', label: 'Medium' },
    low: { bg: '#D1FAE5', color: '#059669', label: 'Low' }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px' }}>Tasks</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <LastImportIndicator lastImportDate={lastImportDate} />
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Add Task
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stat-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📋</div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{tasks.length}</div>
              <div style={{ fontSize: '13px', color: theme.textMuted }}>Total Tasks</div>
            </div>
          </div>
        </div>
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📝</div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#D97706' }}>{todoTasks.length}</div>
              <div style={{ fontSize: '13px', color: theme.textMuted }}>To Do</div>
            </div>
          </div>
        </div>
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🔄</div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563EB' }}>{inProgressTasks.length}</div>
              <div style={{ fontSize: '13px', color: theme.textMuted }}>In Progress</div>
            </div>
          </div>
        </div>
        <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>✅</div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>{completedTasks.length}</div>
              <div style={{ fontSize: '13px', color: theme.textMuted }}>Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Overall Progress</span>
          <span style={{ fontSize: '14px', fontWeight: '700', color: theme.primary }}>{completionRate}%</span>
        </div>
        <div style={{ height: '10px', background: theme.borderLight, borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${completionRate}%`,
            background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            borderRadius: '5px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All', count: tasks.length },
          { id: 'todo', label: 'To Do', count: todoTasks.length },
          { id: 'in-progress', label: 'In Progress', count: inProgressTasks.length },
          { id: 'completed', label: 'Completed', count: completedTasks.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: filter === tab.id ? theme.primary : theme.bgCard,
              color: filter === tab.id ? 'white' : theme.textPrimary,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: filter === tab.id ? 'none' : theme.cardShadow
            }}
          >
            {tab.label}
            <span style={{ 
              padding: '2px 8px', 
              borderRadius: '10px', 
              background: filter === tab.id ? 'rgba(255,255,255,0.2)' : theme.bgMain,
              fontSize: '12px'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}` }}>
        {filteredTasks.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: theme.bgMain,
                  borderRadius: '12px',
                  border: `1px solid ${theme.borderLight}`,
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <input 
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => updateTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: theme.primary }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: '500', 
                      color: task.status === 'completed' ? theme.textMuted : theme.textPrimary,
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      marginBottom: '4px'
                    }}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '6px' }}>{task.description}</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: theme.textMuted }}>
                        📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                      </span>
                      <span style={{ fontSize: '12px', color: theme.textMuted }}>📁 {task.category}</span>
                      <span style={{ 
                        fontSize: '10px', 
                        padding: '2px 8px', 
                        borderRadius: '6px',
                        background: priorityColors[task.priority]?.bg,
                        color: priorityColors[task.priority]?.color,
                        fontWeight: '600'
                      }}>
                        {priorityColors[task.priority]?.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${theme.borderLight}`,
                      background: theme.bgCard,
                      color: theme.textPrimary,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#FEE2E2',
                      color: '#DC2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>
              {filter === 'all' ? 'No tasks yet' : `No ${filter.replace('-', ' ')} tasks`}
            </h3>
            <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '20px' }}>
              {filter === 'all' ? 'Create your first task to get started!' : 'Tasks with this status will appear here'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: '12px 24px',
                  background: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Create Task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: theme.bgCard, borderRadius: '20px', padding: '32px', width: '480px', maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary }}>Add New Task</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.textMuted }}>×</button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Task Name *</label>
              <input 
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task name"
                style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Description</label>
              <textarea 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Add description (optional)"
                rows={3}
                style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Due Date</label>
                <input 
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Priority</label>
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Category</label>
              <select 
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                style={{ width: '100%', padding: '12px', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Finance">Finance</option>
                <option value="Health">Health</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ flex: 1, padding: '14px', background: theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={addTask}
                style={{ flex: 1, padding: '14px', background: theme.primary, border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ============================================================================
// TRANSACTIONS TAB - DASHSTACK TABLE STYLE with Dashboard Consistency
// ============================================================================
function TransactionsTabDS({ transactions, onNavigateToImport, theme, lastImportDate, accountLabels }) {
  const isDark = theme?.mode === 'dark';
  const [filter, setFilter] = useState({ date: '', type: '', status: '' });
  const [selectedTxns, setSelectedTxns] = useState([]);
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    transactionList: false
  });
  
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  // Calculate stats
  const totalTransactions = transactions.length;
  const incomeTransactions = transactions.filter(t => parseFloat(t.amount) > 0);
  const expenseTransactions = transactions.filter(t => parseFloat(t.amount) < 0);
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpenses = Math.abs(expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0));
  
  const handleBulkDelete = () => {
    if (selectedTxns.length === 0) return;
    if (window.confirm(`Delete ${selectedTxns.length} transaction(s)?`)) {
      console.log('Deleting transactions:', selectedTxns);
      // TODO: Implement actual delete via Supabase
      setSelectedTxns([]);
    }
  };

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
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px', letterSpacing: '-0.5px' }}>Transactions</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <LastImportIndicator lastImportDate={lastImportDate} />
        </div>
      </div>

      {/* Stats Cards - Gradient style matching Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Total Transactions Card - Cyan */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #164E63 0%, #0E4A5C 100%)' : 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 188, 212, 0.15)',
          border: `1px solid ${isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>📋</div>
            <span style={{ fontSize: '14px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Total</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064' }}>{totalTransactions.toLocaleString()}</div>
        </div>

        {/* Income Card - Green */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #14532D 0%, #115E2B 100%)' : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)',
          border: `1px solid ${isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>💰</div>
            <span style={{ fontSize: '14px', color: isDark ? '#86EFAC' : '#2E7D32', fontWeight: '600' }}>Income</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E8F5E9' : '#1B5E20' }}>{formatCurrency(totalIncome)}</div>
        </div>

        {/* Expenses Card - Orange */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #7C2D12 0%, #6B2A0F 100%)' : 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
          border: `1px solid ${isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>💸</div>
            <span style={{ fontSize: '14px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '600' }}>Expenses</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C' }}>{formatCurrency(totalExpenses)}</div>
        </div>

        {/* Net Card - Purple */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #4A1D6B 0%, #3D1A5A 100%)' : 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
          border: `1px solid ${isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>📊</div>
            <span style={{ fontSize: '14px', color: isDark ? '#D8B4FE' : '#7B1FA2', fontWeight: '600' }}>Net</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: totalIncome - totalExpenses >= 0 ? (isDark ? '#86EFAC' : '#1B5E20') : (isDark ? '#FCA5A5' : '#DC2626') }}>
            {totalIncome - totalExpenses >= 0 ? '+' : ''}{formatCurrency(totalIncome - totalExpenses)}
          </div>
        </div>
      </div>

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

      {/* Bulk Actions Bar */}
      {selectedTxns.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px',
          background: '#FEE2E215', borderRadius: '10px', marginBottom: '16px', border: '1px solid #FEE2E2'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{selectedTxns.length} selected</span>
          <button onClick={handleBulkDelete} style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
            background: '#EF4444', border: 'none', borderRadius: '8px', color: 'white',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer'
          }}>🗑️ Delete Selected</button>
          <button onClick={() => setSelectedTxns([])} style={{
            padding: '8px 16px', background: 'transparent', border: `1px solid ${theme.border}`,
            borderRadius: '8px', color: theme.textSecondary, fontSize: '13px', cursor: 'pointer'
          }}>Cancel</button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TRANSACTION LIST (Collapsible Section) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('transactionList')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.transactionList ? '0' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #8B5CF6 0%, #06B6D4 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Transaction History</h2>
        <span style={{ 
          fontSize: '12px', 
          color: theme.textMuted,
          background: theme.bgMain,
          padding: '4px 10px',
          borderRadius: '6px'
        }}>{transactions.length} records</span>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.transactionList ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>
      
      {/* Table */}
      {!collapsedSections.transactionList && (
      <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', boxShadow: theme.cardShadow, border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
        {/* Gradient top accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)'
        }} />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: theme.bgMain }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedTxns.length === Math.min(10, transactions.length) && transactions.length > 0}
                  onChange={(e) => setSelectedTxns(e.target.checked ? transactions.slice(0, 10).map((_, i) => i) : [])}
                  style={{ cursor: 'pointer' }} 
                />
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Description</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Amount</th>
              <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase' }}>Account</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '80px 20px', textAlign: 'center', color: theme.textMuted }}>
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
              transactions.slice(0, 10).map((t, i) => {
                const isSideHustle = t.accountType === 'sidehustle';
                const acctStyle = isSideHustle 
                  ? { bg: '#FEE2E2', color: '#DC2626', icon: '💼', label: accountLabels?.sidehustle || 'Side Hustle' }
                  : { bg: '#DBEAFE', color: '#2563EB', icon: '👤', label: accountLabels?.personal || 'Personal' };
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                    <td style={{ padding: '16px 20px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedTxns.includes(i)}
                        onChange={(e) => setSelectedTxns(e.target.checked ? [...selectedTxns, i] : selectedTxns.filter(x => x !== i))}
                        style={{ cursor: 'pointer' }} 
                      />
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textPrimary }}>{t.date}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textPrimary }}>{t.description.slice(0, 40)}...</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textSecondary }}>{t.category}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: parseFloat(t.amount) > 0 ? theme.success : theme.danger, textAlign: 'right' }}>
                      {parseFloat(t.amount) > 0 ? '+' : ''}{formatCurrency(t.amount)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      {getStatusBadge(t.status)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <select
                        value={t.accountType || 'personal'}
                        onChange={(e) => {
                          console.log('Update transaction', t.id, 'to', e.target.value);
                          // TODO: Implement actual update via Supabase
                        }}
                        style={{ 
                          appearance: 'none',
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          padding: '4px 24px 4px 12px', 
                          borderRadius: '20px', 
                          background: `${acctStyle.bg} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 8px center`,
                          color: acctStyle.color, 
                          fontSize: '12px', 
                          fontWeight: '500',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="personal">👤 {accountLabels?.personal || 'Personal'}</option>
                        <option value="sidehustle">💼 {accountLabels?.sidehustle || 'Side Hustle'}</option>
                      </select>
                    </td>
                  </tr>
                );
              })
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
      )}
    </div>
  );
}
// ============================================================================
// IMPORT TAB - DASHSTACK STYLE
// ============================================================================
function ImportTabDS({ onImport, parseCSV, transactionCount, theme, activeTab, previousTab, userEmail, hasBizBudgetAccess }) {
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const fileInputRef = useRef(null);
  
  // Determine which hub the user came from or is primarily using
  const isFromBizBudget = previousTab?.startsWith('bizbudget-') || activeTab?.startsWith('bizbudget-');
  const [activeHub, setActiveHub] = useState(isFromBizBudget ? 'bizbudget' : 'homebudget');

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

  // Hub configurations with their import categories
  const hubConfigs = {
    homebudget: {
      name: 'HomeBudget Hub',
      icon: '🏠',
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      description: 'Personal & Family Finance',
      categories: [
        {
          id: 'personal-banking',
          title: 'Personal Banking',
          icon: '🏦',
          description: 'Import your personal bank accounts',
          color: '#3B82F6',
          fileTypes: [
            { id: 'checking', icon: '💳', title: 'Checking Account', desc: 'Daily transactions, direct deposits', formats: ['CSV', 'XLSX', 'OFX', 'QFX'] },
            { id: 'savings', icon: '🏦', title: 'Savings Account', desc: 'Savings and money market', formats: ['CSV', 'XLSX', 'OFX'] },
            { id: 'credit', icon: '💳', title: 'Credit Cards', desc: 'Credit card statements', formats: ['CSV', 'XLSX', 'OFX', 'QFX'] },
          ]
        },
        {
          id: 'retirement',
          title: 'Retirement & Investments',
          icon: '📈',
          description: 'Track your retirement accounts',
          color: '#10B981',
          fileTypes: [
            { id: '401k', icon: '🏛️', title: '401(k) / 403(b)', desc: 'Employer retirement plans', formats: ['CSV', 'XLSX'] },
            { id: 'ira', icon: '📊', title: 'IRA Accounts', desc: 'Traditional, Roth, SEP IRA', formats: ['CSV', 'XLSX'] },
            { id: 'brokerage', icon: '📈', title: 'Brokerage', desc: 'Stocks, ETFs, mutual funds', formats: ['CSV', 'XLSX'], comingSoon: true },
          ]
        },
        {
          id: 'sales-tracker',
          title: 'Sales & Commissions',
          icon: '💼',
          description: 'Track sales income and commissions',
          color: '#8B5CF6',
          fileTypes: [
            { id: 'commissions', icon: '💰', title: 'Commission Statements', desc: 'Sales commissions, bonuses', formats: ['CSV', 'XLSX'] },
            { id: 'invoices', icon: '📄', title: 'Invoice History', desc: 'Client invoices and payments', formats: ['CSV', 'XLSX'] },
            { id: 'deals', icon: '🤝', title: 'Closed Deals', desc: 'Completed sales transactions', formats: ['CSV', 'XLSX'] },
          ]
        }
      ]
    },
    bizbudget: {
      name: 'BizBudget Hub',
      icon: '💼',
      color: '#A78BFA',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      description: 'Business Command Center',
      categories: [
        {
          id: 'business-banking',
          title: 'Business Banking',
          icon: '🏛️',
          description: 'Import your business accounts',
          color: '#6366F1',
          fileTypes: [
            { id: 'business-checking', icon: '🏦', title: 'Business Checking', desc: 'Operating account transactions', formats: ['CSV', 'XLSX', 'OFX', 'QFX'] },
            { id: 'business-savings', icon: '💰', title: 'Business Savings', desc: 'Reserve and tax savings', formats: ['CSV', 'XLSX', 'OFX'] },
            { id: 'business-credit', icon: '💳', title: 'Business Credit Cards', desc: 'Business credit statements', formats: ['CSV', 'XLSX', 'OFX'] },
          ]
        },
        {
          id: 'deal-pipeline',
          title: 'Deal Pipeline',
          icon: '🏠',
          description: 'Import property and deal data',
          color: '#F59E0B',
          fileTypes: [
            { id: 'properties', icon: '🏘️', title: 'Property Data', desc: 'Addresses, purchase prices, values', formats: ['CSV', 'XLSX'] },
            { id: 'deals-active', icon: '📋', title: 'Active Deals', desc: 'Under contract, listed properties', formats: ['CSV', 'XLSX'] },
            { id: 'deals-closed', icon: '✅', title: 'Closed Deals', desc: 'Completed transactions', formats: ['CSV', 'XLSX'] },
          ]
        },
        {
          id: 'contractors',
          title: 'Contractors & Expenses',
          icon: '👷',
          description: '1099 contractors and business expenses',
          color: '#EF4444',
          fileTypes: [
            { id: '1099', icon: '📝', title: '1099 Contractors', desc: 'Contractor payments for tax reporting', formats: ['CSV', 'XLSX'] },
            { id: 'renovations', icon: '🔨', title: 'Renovation Costs', desc: 'Property improvement expenses', formats: ['CSV', 'XLSX'] },
            { id: 'business-expenses', icon: '🧾', title: 'Business Expenses', desc: 'Operating costs, supplies', formats: ['CSV', 'XLSX'] },
          ]
        }
      ]
    }
  };

  const currentHubConfig = hubConfigs[activeHub];

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

  const businessBanks = [
    { name: 'Novo', logo: '🟣' },
    { name: 'Mercury', logo: '⚫' },
    { name: 'Relay', logo: '🔵' },
    { name: 'Bluevine', logo: '🔵' },
    { name: 'Chase Business', logo: '🔵' },
    { name: 'Bank of America Business', logo: '🔴' }
  ];

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Header with Hub Selector */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: currentHubConfig.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: `0 8px 24px ${currentHubConfig.color}40`
          }}>
            {currentHubConfig.icon}
          </div>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: theme.textPrimary, 
              marginBottom: '4px',
              letterSpacing: '-0.5px'
            }}>
              Import Your Data
            </h1>
            <p style={{ fontSize: '15px', color: theme.textSecondary }}>
              {currentHubConfig.description} • Upload files to track your progress
            </p>
          </div>
        </div>

        {/* Hub Switcher - Only show if user has access to BizBudget */}
        {hasBizBudgetAccess && (
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            padding: '6px',
            background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
            borderRadius: '14px',
            width: 'fit-content'
          }}>
            {Object.entries(hubConfigs).map(([hubId, config]) => (
              <button
                key={hubId}
                onClick={() => { setActiveHub(hubId); setSelectedCategory(null); setSelectedFileType(null); }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                style={{
                  padding: '12px 24px',
                  background: activeHub === hubId ? config.gradient : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  color: activeHub === hubId ? 'white' : theme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: activeHub === hubId ? `0 4px 12px ${config.color}40` : 'none'
                }}
              >
                <span style={{ fontSize: '18px' }}>{config.icon}</span>
                {config.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats Banner */}
      <div style={{ 
        background: currentHubConfig.gradient,
        borderRadius: '20px', 
        padding: '28px 32px', 
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: `0 10px 40px ${currentHubConfig.color}30`
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

      {/* Category Selection */}
      {!selectedCategory && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            What would you like to import?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {currentHubConfig.categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: theme.bgCard,
                  border: `2px solid ${hoveredCard === category.id ? category.color : theme.borderLight}`,
                  borderRadius: '20px',
                  padding: '28px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === category.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCard === category.id 
                    ? `0 12px 32px ${category.color}25` 
                    : theme.cardShadow,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Gradient accent bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${category.color}, ${category.color}80)`,
                  opacity: hoveredCard === category.id ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }} />
                
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px',
                  background: `${category.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '16px',
                  transition: 'transform 0.3s ease',
                  transform: hoveredCard === category.id ? 'scale(1.1)' : 'scale(1)'
                }}>
                  {category.icon}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '6px' }}>
                  {category.title}
                </div>
                <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '16px', lineHeight: '1.5' }}>
                  {category.description}
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: category.color,
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  <span>{category.fileTypes.length} import types</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Type Selection - After category is selected */}
      {selectedCategory && !selectedFileType && (
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            onMouseEnter={(e) => e.target.style.background = theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#F3F4F6'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: theme.textSecondary,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'background 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to categories
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '24px',
            padding: '20px 24px',
            background: `${selectedCategory.color}10`,
            borderRadius: '16px',
            border: `1px solid ${selectedCategory.color}30`
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px',
              background: `${selectedCategory.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              {selectedCategory.icon}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary, marginBottom: '2px' }}>
                {selectedCategory.title}
              </h2>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>{selectedCategory.description}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {selectedCategory.fileTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => !type.comingSoon && setSelectedFileType(type)}
                onMouseEnter={() => !type.comingSoon && setHoveredCard(type.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: theme.bgCard,
                  border: `2px solid ${hoveredCard === type.id ? selectedCategory.color : theme.borderLight}`,
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: type.comingSoon ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: type.comingSoon ? 0.6 : 1,
                  transform: hoveredCard === type.id ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: hoveredCard === type.id ? `0 8px 24px ${selectedCategory.color}20` : 'none',
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
                  background: `${selectedCategory.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '14px'
                }}>
                  {type.icon}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '4px' }}>
                  {type.title}
                </div>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '12px', lineHeight: '1.4' }}>
                  {type.desc}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
      )}

      {/* Upload Area - After file type is selected */}
      {selectedFileType && (
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setSelectedFileType(null)}
            onMouseEnter={(e) => e.target.style.background = theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#F3F4F6'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: theme.textSecondary,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'background 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to {selectedCategory.title}
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '24px',
            padding: '20px 24px',
            background: `${selectedCategory.color}10`,
            borderRadius: '16px',
            border: `1px solid ${selectedCategory.color}30`
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px',
              background: `${selectedCategory.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              {selectedFileType.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary, marginBottom: '2px' }}>
                Import {selectedFileType.title}
              </h2>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>{selectedFileType.desc}</p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {selectedFileType.formats.map((format) => (
                <span key={format} style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: selectedCategory.color,
                  background: `${selectedCategory.color}15`,
                  padding: '6px 12px',
                  borderRadius: '8px'
                }}>
                  {format}
                </span>
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: dragOver 
                ? `${selectedCategory.color}10` 
                : theme.bgCard,
              border: `2px dashed ${dragOver ? selectedCategory.color : theme.border}`,
              borderRadius: '24px',
              padding: '64px 40px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: dragOver ? `0 0 0 4px ${selectedCategory.color}20` : theme.cardShadow
            }}
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".csv,.xlsx,.xls,.ofx,.qfx" 
              onChange={(e) => handleFile(e.target.files[0])} 
              style={{ display: 'none' }} 
            />

            {importing ? (
              <div>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%',
                  background: `${selectedCategory.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  animation: 'pulse 1.5s infinite'
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
                  background: `${selectedCategory.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  transition: 'transform 0.2s ease'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={selectedCategory.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div style={{ fontSize: '22px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>
                  Drop your {selectedFileType.title.toLowerCase()} file here
                </div>
                <div style={{ color: theme.textMuted, marginBottom: '24px', fontSize: '15px' }}>
                  or click to browse from your computer
                </div>
                <button 
                  onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 8px 24px ${selectedCategory.color}50`; }}
                  onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 14px ${selectedCategory.color}40`; }}
                  style={{ 
                    padding: '14px 36px', 
                    background: selectedCategory.color, 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    boxShadow: `0 4px 14px ${selectedCategory.color}40`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Choose File
                </button>
                <div style={{ marginTop: '20px', fontSize: '13px', color: theme.textMuted }}>
                  Supports {selectedFileType.formats.join(', ')} formats • Max 10MB
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
          <button
            onClick={() => setImportResult(null)}
            style={{
              padding: '8px 16px',
              background: importResult.success ? '#D1FAE5' : '#FEE2E2',
              border: 'none',
              borderRadius: '8px',
              color: importResult.success ? '#047857' : '#DC2626',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
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
          {activeHub === 'bizbudget' ? 'Works with business banks' : 'Works with all major banks'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {(activeHub === 'bizbudget' ? businessBanks : supportedBanks).map((bank, i) => (
            <div 
              key={i} 
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                color: theme.textPrimary,
                fontWeight: '500',
                transition: 'all 0.2s ease',
                cursor: 'default'
              }}
            >
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
function SettingsTabDS({ theme, isDarkMode, onToggleTheme, selectedLanguage, onLanguageChange, userAvatar, onAvatarChange, memojiAvatars, languages, lastImportDate }) {
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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px' }}>Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <LastImportIndicator lastImportDate={lastImportDate} />
        </div>
      </div>

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
