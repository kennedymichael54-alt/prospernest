import React, { useState } from 'react';

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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatCurrencyDetailed = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Fallback sample data (used if no retirementData prop)
const fallbackData = {
  asOfDate: "2025-11-28",
  summary: {
    totalValue: 277626.46,
    ytdReturn: 22.28,
    oneYearReturn: 21.64,
    threeYearReturn: 17.22,
    fiveYearReturn: 13.22
  },
  accounts: [
    { id: "kennedy-ai-focus", name: "Kennedy AI Focus IRA", type: "advisory", value: 83476.20, ytdReturn: 19.25, owner: "Kennedy" },
    { id: "kennedy-capital-strength", name: "Kennedy Capital Strength IRA", type: "advisory", value: 147346.14, ytdReturn: 18.21, owner: "Kennedy" },
    { id: "michael-roth", name: "Michael Roth IRA", type: "roth", value: 27697.82, ytdReturn: 16.55, owner: "Michael" },
    { id: "jessica-roth", name: "Jessica Roth IRA", type: "roth", value: 11016.40, ytdReturn: 23.95, owner: "Jessica" },
    { id: "rory-roth", name: "Rory Roth IRA", type: "roth", value: 8089.90, ytdReturn: 21.35, owner: "Rory" },
    { id: "michael-vul", name: "Michael VUL", type: "insurance", value: 6753.76, owner: "Michael" },
    { id: "jessica-vul", name: "Jessica VUL", type: "insurance", value: 3355.36, owner: "Jessica" },
    { id: "rory-vul", name: "Rory VUL", type: "insurance", value: 1866.67, owner: "Rory" }
  ],
  monthlyProgress: [
    { month: "November 2025", startingBalance: 290173.00, netContributions: 3056.46, changeInValue: -3627.21, endingBalance: 289602.25 },
    { month: "October 2025", startingBalance: 279248.76, netContributions: 3204.74, changeInValue: 7719.51, endingBalance: 290173.00 },
    { month: "September 2025", startingBalance: 257460.69, netContributions: 3231.45, changeInValue: 18556.64, endingBalance: 279248.76 },
    { month: "August 2025", startingBalance: 248498.68, netContributions: 3056.44, changeInValue: 5905.55, endingBalance: 257460.69 },
    { month: "July 2025", startingBalance: 240480.14, netContributions: 3381.43, changeInValue: 4637.13, endingBalance: 248498.68 },
    { month: "June 2025", startingBalance: 159850.94, netContributions: 72961.77, changeInValue: 7667.44, endingBalance: 240480.14 }
  ]
};

export default function RetirementTab({ theme: propTheme, retirementData }) {
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [activeView, setActiveView] = useState('overview');
  const [selectedOwner, setSelectedOwner] = useState('all');

  // Use passed data or fallback
  const data = retirementData || fallbackData;
  const { summary, accounts, monthlyProgress } = data;

  // Filter accounts by owner
  const filteredAccounts = selectedOwner === 'all' 
    ? accounts 
    : accounts.filter(a => a.owner === selectedOwner);

  // Calculate totals
  const totalPortfolio = accounts.reduce((sum, acc) => sum + acc.value, 0);
  const filteredTotal = filteredAccounts.reduce((sum, acc) => sum + acc.value, 0);
  
  // Calculate by type
  const advisoryTotal = accounts.filter(a => a.type === 'advisory').reduce((sum, a) => sum + a.value, 0);
  const rothTotal = accounts.filter(a => a.type === 'roth').reduce((sum, a) => sum + a.value, 0);
  const insuranceTotal = accounts.filter(a => a.type === 'insurance').reduce((sum, a) => sum + a.value, 0);

  // Calculate by owner
  const ownerTotals = {};
  accounts.forEach(a => {
    if (!ownerTotals[a.owner]) ownerTotals[a.owner] = 0;
    ownerTotals[a.owner] += a.value;
  });

  // Get current month progress
  const currentMonth = monthlyProgress[0] || {};

  // Unique owners
  const owners = [...new Set(accounts.map(a => a.owner))];

  // Owner colors
  const ownerColors = {
    'Kennedy': '#8B5CF6',
    'Michael': '#3B82F6',
    'Jessica': '#EC4899',
    'Rory': '#10B981'
  };

  // Type colors
  const typeColors = {
    'advisory': '#8B5CF6',
    'roth': '#3B82F6',
    'insurance': '#F59E0B'
  };

  const typeLabels = {
    'advisory': 'Advisory IRA',
    'roth': 'Roth IRA',
    'insurance': 'VUL Insurance'
  };

  // Stat cards
  const statCards = [
    { 
      label: 'Total Portfolio', 
      value: formatCurrency(totalPortfolio), 
      subValue: `+${summary.ytdReturn}% YTD`,
      color: theme.success, 
      icon: '💰' 
    },
    { 
      label: 'Monthly Change', 
      value: formatCurrency(currentMonth.changeInValue || 0), 
      subValue: currentMonth.month || '',
      color: (currentMonth.changeInValue || 0) >= 0 ? theme.success : theme.danger, 
      icon: (currentMonth.changeInValue || 0) >= 0 ? '📈' : '📉' 
    },
    { 
      label: 'Contributions', 
      value: formatCurrency(currentMonth.netContributions || 0), 
      subValue: 'This Month',
      color: theme.info, 
      icon: '💵' 
    },
    { 
      label: 'Accounts', 
      value: accounts.length, 
      subValue: `${owners.length} family members`,
      color: theme.primary, 
      icon: '🏦' 
    },
  ];

  // Portfolio growth chart data points
  const chartData = [...monthlyProgress].reverse();

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '24px' }}>🏖️</span>
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Retirement</h1>
            <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
              As of {data.asOfDate} • Ameriprise Financial
            </p>
          </div>
        </div>
        
        {/* Owner Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedOwner('all')}
            style={{
              padding: '8px 16px',
              background: selectedOwner === 'all' ? theme.primary : 'transparent',
              border: `1px solid ${selectedOwner === 'all' ? theme.primary : theme.border}`,
              borderRadius: '8px',
              color: selectedOwner === 'all' ? 'white' : theme.textSecondary,
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            All Members
          </button>
          {owners.map(owner => (
            <button
              key={owner}
              onClick={() => setSelectedOwner(owner)}
              style={{
                padding: '8px 16px',
                background: selectedOwner === owner ? ownerColors[owner] : 'transparent',
                border: `1px solid ${selectedOwner === owner ? ownerColors[owner] : theme.border}`,
                borderRadius: '8px',
                color: selectedOwner === owner ? 'white' : theme.textSecondary,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {owner}
            </button>
          ))}
        </div>
      </div>

      {/* View Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'accounts', label: '💼 Accounts' },
          { id: 'progress', label: '📈 Monthly Progress' },
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
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: card.color
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>{card.icon}</span>
              <span style={{ fontSize: '13px', color: theme.textMuted, fontWeight: '500' }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: card.color, fontWeight: '500', marginTop: '4px' }}>{card.subValue}</div>
          </div>
        ))}
      </div>

      {activeView === 'overview' && (
        <>
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
              <span style={{ fontSize: '12px', color: theme.success, fontWeight: '500', marginLeft: 'auto' }}>
                +{summary.ytdReturn}% YTD
              </span>
            </h3>
            
            <div style={{ height: '220px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 220" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line 
                    key={i}
                    x1="50" y1={40 + i * 40} 
                    x2="580" y2={40 + i * 40} 
                    stroke={theme.borderLight} 
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                ))}
                
                {/* Y-axis labels */}
                <text x="45" y="45" fill={theme.textMuted} fontSize="10" textAnchor="end">$300K</text>
                <text x="45" y="85" fill={theme.textMuted} fontSize="10" textAnchor="end">$250K</text>
                <text x="45" y="125" fill={theme.textMuted} fontSize="10" textAnchor="end">$200K</text>
                <text x="45" y="165" fill={theme.textMuted} fontSize="10" textAnchor="end">$150K</text>
                <text x="45" y="205" fill={theme.textMuted} fontSize="10" textAnchor="end">$100K</text>
                
                {/* Area fill */}
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.primary} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={theme.primary} stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                
                {/* Area path */}
                <path
                  d={`M 80 ${200 - ((chartData[0]?.endingBalance || 160000) - 100000) / 1250} 
                      ${chartData.map((d, i) => {
                        const x = 80 + i * 100;
                        const y = 200 - ((d.endingBalance - 100000) / 1250);
                        return `L ${x} ${y}`;
                      }).join(' ')} 
                      L ${80 + (chartData.length - 1) * 100} 200 L 80 200 Z`}
                  fill="url(#areaGradient)"
                />
                
                {/* Line path */}
                <path
                  d={`M 80 ${200 - ((chartData[0]?.endingBalance || 160000) - 100000) / 1250} 
                      ${chartData.map((d, i) => {
                        const x = 80 + i * 100;
                        const y = 200 - ((d.endingBalance - 100000) / 1250);
                        return `L ${x} ${y}`;
                      }).join(' ')}`}
                  fill="none"
                  stroke={theme.primary}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {chartData.map((d, i) => {
                  const x = 80 + i * 100;
                  const y = 200 - ((d.endingBalance - 100000) / 1250);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill={theme.bgCard} stroke={theme.primary} strokeWidth="3" />
                      <text x={x} y="218" fill={theme.textMuted} fontSize="10" textAnchor="middle">
                        {d.month.split(' ')[0].substring(0, 3)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Bottom Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {/* Portfolio Allocation by Type */}
            <div style={{
              background: theme.bgCard,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${theme.borderLight}`,
              boxShadow: theme.cardShadow
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🥧 Allocation by Type
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                {/* Pie Chart */}
                <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    {/* Advisory slice */}
                    <circle 
                      cx="80" cy="80" r="60" 
                      fill="none" 
                      stroke={typeColors.advisory}
                      strokeWidth="24" 
                      strokeDasharray={`${(advisoryTotal / totalPortfolio) * 377} 377`}
                      transform="rotate(-90 80 80)" 
                    />
                    {/* Roth slice */}
                    <circle 
                      cx="80" cy="80" r="60" 
                      fill="none" 
                      stroke={typeColors.roth}
                      strokeWidth="24" 
                      strokeDasharray={`${(rothTotal / totalPortfolio) * 377} 377`}
                      strokeDashoffset={`-${(advisoryTotal / totalPortfolio) * 377}`}
                      transform="rotate(-90 80 80)" 
                    />
                    {/* Insurance slice */}
                    <circle 
                      cx="80" cy="80" r="60" 
                      fill="none" 
                      stroke={typeColors.insurance}
                      strokeWidth="24" 
                      strokeDasharray={`${(insuranceTotal / totalPortfolio) * 377} 377`}
                      strokeDashoffset={`-${((advisoryTotal + rothTotal) / totalPortfolio) * 377}`}
                      transform="rotate(-90 80 80)" 
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>Total</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(totalPortfolio)}</div>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  {[
                    { type: 'advisory', total: advisoryTotal },
                    { type: 'roth', total: rothTotal },
                    { type: 'insurance', total: insuranceTotal }
                  ].map(({ type, total }) => (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: typeColors[type] }} />
                      <span style={{ fontSize: '13px', color: theme.textPrimary, flex: 1 }}>{typeLabels[type]}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(total)}</span>
                      <span style={{ fontSize: '12px', color: theme.textMuted, width: '40px', textAlign: 'right' }}>
                        {Math.round((total / totalPortfolio) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Allocation by Owner */}
            <div style={{
              background: theme.bgCard,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${theme.borderLight}`,
              boxShadow: theme.cardShadow
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                👨‍👩‍👧‍👦 Allocation by Family Member
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(ownerTotals).sort((a, b) => b[1] - a[1]).map(([owner, total]) => (
                  <div key={owner}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: ownerColors[owner],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {owner.charAt(0)}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{owner}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(total)}</span>
                        <span style={{ fontSize: '12px', color: theme.textMuted, marginLeft: '8px' }}>
                          {Math.round((total / totalPortfolio) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div style={{
                      height: '8px',
                      background: isDark ? 'rgba(255,255,255,0.1)' : theme.bgMain,
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(total / totalPortfolio) * 100}%`,
                        background: ownerColors[owner],
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'accounts' && (
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              💼 Investment Accounts
              <span style={{ 
                fontSize: '12px', 
                color: theme.textMuted, 
                fontWeight: '400',
                background: isDark ? 'rgba(255,255,255,0.1)' : theme.bgMain,
                padding: '4px 10px',
                borderRadius: '12px'
              }}>
                {filteredAccounts.length} accounts • {formatCurrency(filteredTotal)}
              </span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAccounts.map(acc => (
              <div key={acc.id} style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : theme.bgMain,
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `1px solid ${theme.borderLight}`,
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: ownerColors[acc.owner],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {acc.owner.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: theme.textPrimary, fontSize: '15px', marginBottom: '4px' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textMuted, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        background: typeColors[acc.type] + '20',
                        color: typeColors[acc.type],
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {typeLabels[acc.type]}
                      </span>
                      <span>{acc.owner}</span>
                      {acc.accountNumber && <span>{acc.accountNumber}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: theme.textPrimary, fontSize: '20px', marginBottom: '4px' }}>
                    {formatCurrencyDetailed(acc.value)}
                  </div>
                  {acc.ytdReturn !== undefined && acc.ytdReturn !== null && (
                    <div style={{ 
                      fontSize: '13px', 
                      color: acc.ytdReturn >= 0 ? theme.success : theme.danger,
                      fontWeight: '500'
                    }}>
                      {acc.ytdReturn >= 0 ? '+' : ''}{acc.ytdReturn}% YTD
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'progress' && (
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Monthly Progress
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted, borderBottom: `1px solid ${theme.border}` }}>Month</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted, borderBottom: `1px solid ${theme.border}` }}>Starting</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted, borderBottom: `1px solid ${theme.border}` }}>Contributions</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted, borderBottom: `1px solid ${theme.border}` }}>Market Change</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted, borderBottom: `1px solid ${theme.border}` }}>Ending</th>
                </tr>
              </thead>
              <tbody>
                {monthlyProgress.map((m, i) => (
                  <tr key={i} style={{ background: i === 0 ? (isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(99, 102, 241, 0.05)') : 'transparent' }}>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: i === 0 ? '600' : '400', color: theme.textPrimary, borderBottom: `1px solid ${theme.borderLight}` }}>
                      {m.month}
                      {i === 0 && <span style={{ marginLeft: '8px', fontSize: '10px', background: theme.primary, color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Current</span>}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: theme.textSecondary, borderBottom: `1px solid ${theme.borderLight}` }}>
                      {formatCurrency(m.startingBalance)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: theme.info, fontWeight: '500', borderBottom: `1px solid ${theme.borderLight}` }}>
                      +{formatCurrency(m.netContributions)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: m.changeInValue >= 0 ? theme.success : theme.danger, borderBottom: `1px solid ${theme.borderLight}` }}>
                      {m.changeInValue >= 0 ? '+' : ''}{formatCurrency(m.changeInValue)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.textPrimary, borderBottom: `1px solid ${theme.borderLight}` }}>
                      {formatCurrency(m.endingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: isDark ? 'rgba(255,255,255,0.05)' : theme.bgMain }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>
                    6-Month Total
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: theme.textSecondary }}>
                    {formatCurrency(monthlyProgress[monthlyProgress.length - 1]?.startingBalance || 0)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: theme.info, fontWeight: '600' }}>
                    +{formatCurrency(monthlyProgress.reduce((sum, m) => sum + m.netContributions, 0))}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.success }}>
                    +{formatCurrency(monthlyProgress.reduce((sum, m) => sum + m.changeInValue, 0))}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: theme.textPrimary }}>
                    {formatCurrency(monthlyProgress[0]?.endingBalance || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Performance Summary Footer */}
      <div style={{
        marginTop: '24px',
        background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'linear-gradient(135deg, #EEF2FF 0%, #FDF4FF 100%)',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : '#E0E7FF'}`,
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🎯</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Investment Rate of Return</div>
            <div style={{ fontSize: '12px', color: theme.textMuted }}>Based on IRR methodology</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '4px' }}>YTD</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: theme.success }}>+{summary.ytdReturn}%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '4px' }}>1-Year</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: theme.success }}>+{summary.oneYearReturn}%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '4px' }}>3-Year</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: theme.success }}>+{summary.threeYearReturn}%</div>
          </div>
          {summary.fiveYearReturn && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '4px' }}>5-Year</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: theme.success }}>+{summary.fiveYearReturn}%</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
