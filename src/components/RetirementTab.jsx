import React, { useState, useEffect } from 'react';

// Default themes
const defaultLightTheme = {
  mode: 'light',
  primary: '#4F46E5',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  bgMain: '#F5F6FA',
  bgCard: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  cardShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const defaultDarkTheme = {
  mode: 'dark',
  primary: '#8B5CF6',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  bgMain: '#0c0a1d',
  bgCard: '#1e1b38',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  border: 'rgba(139, 92, 246, 0.2)',
  borderLight: 'rgba(255,255,255,0.1)',
  cardShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

const sampleInvestments = [
  { id: 1, name: 'KENNEDY AI FOCUS IRA', type: 'IRA', owner: 'Kennedy', value: 83, ytd: 476.29, change: 16.5 },
  { id: 2, name: 'KENNEDY CAPITAL STRENGTH IRA', type: 'IRA', owner: 'Kennedy', value: 147, ytd: 349.14, change: 28.1 },
  { id: 3, name: 'RORY ROTH IRA', type: 'IRA', owner: 'Rory', value: 8, ytd: -463.38, change: 5.4 },
  { id: 4, name: 'MICHAEL ROTH IRA', type: 'IRA', owner: 'Michael', value: 27, ytd: -583.82, change: 4.7 },
  { id: 5, name: 'JESSICA ROTH IRA', type: 'IRA', owner: 'Jessica', value: 11, ytd: -246.63, change: 5.8 },
  { id: 6, name: 'Rory VUL', type: 'VUL (Life Insurance)', owner: 'Rory', value: 1, ytd: 0, change: 0.1 },
];

export default function RetirementTab({ theme: propTheme }) {
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [activeView, setActiveView] = useState('investments');
  const [investments, setInvestments] = useState(sampleInvestments);

  const totalPortfolio = investments.reduce((sum, inv) => sum + inv.value, 0);
  const monthlyChange = -3;
  const totalAccounts = investments.length;
  const largestAccount = Math.max(...investments.map(inv => inv.value));

  const iraTotal = investments.filter(inv => inv.type === 'IRA').reduce((sum, inv) => sum + inv.value, 0);
  const vulTotal = investments.filter(inv => inv.type.includes('VUL')).reduce((sum, inv) => sum + inv.value, 0);

  const statCards = [
    { label: 'Total Portfolio', value: formatCurrency(totalPortfolio), color: theme.success, icon: '💰' },
    { label: 'Monthly Change', value: formatCurrency(monthlyChange), color: theme.primary, icon: '📈' },
    { label: 'Accounts', value: totalAccounts, color: theme.info, icon: '🏦' },
    { label: 'Largest', value: formatCurrency(largestAccount), color: theme.warning, icon: '⭐' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '24px' }}>💼</span>
          </div>
        </div>
        <button style={{
          padding: '8px 16px',
          background: 'transparent',
          border: `1px solid ${theme.danger}`,
          borderRadius: '8px',
          color: theme.danger,
          fontSize: '13px',
          cursor: 'pointer'
        }}>
          Clear All
        </button>
      </div>

      {/* View Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'investments', label: '💰 My Investments' },
          { id: 'calculator', label: '🧮' },
          { id: 'settings', label: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            style={{
              padding: '10px 20px',
              background: activeView === tab.id ? theme.primary : theme.bgCard,
              color: activeView === tab.id ? 'white' : theme.textSecondary,
              border: `1px solid ${activeView === tab.id ? theme.primary : theme.border}`,
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            background: card.color,
            borderRadius: '12px',
            padding: '20px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', opacity: 0.9 }}>
              <span>{card.icon}</span>
              <span>{card.label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Portfolio Growth Chart */}
      <div style={{
        background: theme.bgCard,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: `1px solid ${theme.borderLight}`,
        boxShadow: theme.cardShadow
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📈 Portfolio Growth
        </h3>
        <div style={{
          height: '200px',
          background: isDark ? 'rgba(139, 92, 246, 0.1)' : '#F5F6FA',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.textMuted
        }}>
          Portfolio chart will appear here
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Portfolio Allocation */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🥧 Portfolio Allocation
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            {/* Pie Chart Placeholder */}
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="55" fill="none" stroke={theme.primary} strokeWidth="20" strokeDasharray="300 345" transform="rotate(-90 70 70)" />
                <circle cx="70" cy="70" r="55" fill="none" stroke={theme.secondary} strokeWidth="20" strokeDasharray="45 345" strokeDashoffset="-300" transform="rotate(-90 70 70)" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>Total Value</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(totalPortfolio)}</div>
              </div>
            </div>

            {/* Legend */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: theme.primary }} />
                <span style={{ fontSize: '14px', color: theme.textPrimary }}>IRA</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary, marginLeft: 'auto' }}>{formatCurrency(iraTotal)}</span>
                <span style={{ fontSize: '12px', color: theme.textMuted }}>{totalPortfolio > 0 ? Math.round((iraTotal / totalPortfolio) * 100) : 0}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: theme.secondary }} />
                <span style={{ fontSize: '14px', color: theme.textPrimary }}>VUL (Life Insurance)</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary, marginLeft: 'auto' }}>{formatCurrency(vulTotal)}</span>
                <span style={{ fontSize: '12px', color: theme.textMuted }}>{totalPortfolio > 0 ? Math.round((vulTotal / totalPortfolio) * 100) : 0}%</span>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${theme.borderLight}` }}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>This Month</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Contributions</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: theme.success }}>$173</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Market Change</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: theme.success }}>+$3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Investments List */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              💼 My Investments
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '6px 12px', background: theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '6px', fontSize: '12px', color: theme.textSecondary, cursor: 'pointer' }}>
                ↕ Expand All
              </button>
              <button style={{ padding: '6px 12px', background: theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '6px', fontSize: '12px', color: theme.textSecondary, cursor: 'pointer' }}>
                ↕ Collapse All
              </button>
              <button style={{ padding: '6px 12px', background: theme.success, border: 'none', borderRadius: '6px', fontSize: '12px', color: 'white', cursor: 'pointer' }}>
                + Add
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
            {investments.map(inv => (
              <div key={inv.id} style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : theme.bgMain,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: theme.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {inv.owner.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: theme.textPrimary, fontSize: '14px' }}>{inv.name}</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>{inv.type} - {inv.owner}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: inv.ytd >= 0 ? theme.success : theme.danger, fontSize: '16px' }}>
                    {formatCurrency(inv.value)}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>{inv.change}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
