import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// THEME CONFIGURATION
// ============================================================================
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
  dropdownBg: '#2d2a4a',
};

// ============================================================================
// PENNY LOGO COMPONENT
// ============================================================================
const PennyLogo = ({ size = 48 }) => (
  <div style={{ display: 'inline-flex' }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFEC8B" />
          <stop offset="100%" stopColor="#DAA520" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill="url(#coinGradient)" stroke="#E5A800" strokeWidth="3"/>
      <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
      <ellipse cx="24" cy="28" rx="4" ry="5" fill="#1a1a1a"/>
      <ellipse cx="40" cy="28" rx="4" ry="5" fill="#1a1a1a"/>
      <ellipse cx="25" cy="27" rx="1.5" ry="2" fill="#FFFFFF"/>
      <ellipse cx="41" cy="27" rx="1.5" ry="2" fill="#FFFFFF"/>
      <path d="M24 38 Q32 44 40 38" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="18" cy="32" rx="3" ry="2" fill="#FFB6C1" opacity="0.6"/>
      <ellipse cx="46" cy="32" rx="3" ry="2" fill="#FFB6C1" opacity="0.6"/>
    </svg>
  </div>
);

// ============================================================================
// ICONS
// ============================================================================
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  SignOut: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

// ============================================================================
// MAIN APP COMPONENT  
// ============================================================================
function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pn_darkMode');
      return saved === 'true';
    }
    return false;
  });
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('pn_darkMode', String(newMode));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bgMain, 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.border}`,
        position: 'fixed',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PennyLogo size={36} />
            <span style={{ fontWeight: '700', fontSize: '18px', color: theme.textPrimary }}>
              Prosper<span style={{ color: theme.primary }}>Nest</span>
            </span>
            <span style={{ 
              background: '#007AFF', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              fontSize: '9px', 
              fontWeight: '600', 
              color: 'white' 
            }}>Beta</span>
          </div>
        </div>
        
        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: theme.sidebarActive,
            color: 'white',
            marginBottom: '4px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            <Icons.Dashboard />
            <span>Dashboard</span>
          </div>
          
          <div style={{ 
            padding: '16px 16px 8px', 
            color: theme.textMuted, 
            fontSize: '11px', 
            fontWeight: '600', 
            textTransform: 'uppercase' 
          }}>
            Settings
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: theme.sidebarText,
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            <Icons.Settings />
            <span>Settings</span>
          </div>
        </nav>
        
        {/* Logout */}
        <div style={{ padding: '16px', borderTop: `1px solid ${theme.borderLight}` }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: theme.danger,
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            <Icons.SignOut />
            <span>Logout</span>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main style={{ marginLeft: '240px', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{
          height: '70px',
          background: theme.bgWhite,
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }}>
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Search"
              style={{
                width: '320px',
                height: '42px',
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Theme Toggle */}
            <div
              onClick={toggleTheme}
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
                width: '40px',
                height: '22px',
                background: isDarkMode ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : '#E5E7EB',
                borderRadius: '11px',
                position: 'relative'
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: isDarkMode ? '20px' : '2px',
                  transition: 'left 0.3s ease'
                }} />
              </div>
            </div>
            
            {/* Notifications */}
            <button style={{
              width: '42px',
              height: '42px',
              background: theme.bgMain,
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              color: theme.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icons.Bell />
            </button>
            
            {/* Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px'
              }}>U</div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: theme.textPrimary }}>User</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>Admin</div>
              </div>
              <Icons.ChevronDown />
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary, marginBottom: '24px' }}>
            Dashboard
          </h1>
          
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
            {[
              { label: 'Total Income', value: '$0.00', icon: '💰', color: '#E0E7FF' },
              { label: 'Total Expenses', value: '$0.00', icon: '💳', color: '#FEF3C7' },
              { label: 'Net Cash Flow', value: '$0.00', icon: '📈', color: '#D1FAE5' },
              { label: 'Transactions', value: '0', icon: '📊', color: '#FCE7F3' },
            ].map((card, i) => (
              <div key={i} style={{
                background: theme.bgCard,
                borderRadius: '16px',
                padding: '24px',
                boxShadow: theme.cardShadow,
                border: `1px solid ${theme.borderLight}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>{card.label}</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{card.value}</div>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: theme.cardShadow,
            border: `1px solid ${theme.borderLight}`
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>
              No Data Yet
            </h3>
            <p style={{ color: theme.textMuted, marginBottom: '20px' }}>
              Import your bank transactions to get started
            </p>
            <button style={{
              padding: '12px 24px',
              background: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Import Transactions
            </button>
          </div>
        </div>
      </main>
      
      {/* Penny AI Chat Button */}
      <button style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #007AFF, #5856D6)',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0, 122, 255, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <PennyLogo size={40} />
      </button>
    </div>
  );
}

export default App;
