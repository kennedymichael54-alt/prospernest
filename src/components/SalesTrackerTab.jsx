import React, { useState, useEffect, useRef } from 'react';

// Default themes for standalone usage
const defaultLightTheme = {
  mode: 'light',
  primary: '#4F46E5',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
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

export default function SalesTrackerTab({ theme: propTheme }) {
  // Use provided theme or detect from localStorage
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [activeView, setActiveView] = useState('tracker');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sales, setSales] = useState([]);
  const [goals, setGoals] = useState({ transactions: 0, volume: 0 });

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedSales = localStorage.getItem('pn_sales');
      const savedGoals = localStorage.getItem('pn_sales_goals');
      if (savedSales) setSales(JSON.parse(savedSales));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    } catch (e) {
      console.error('Error loading sales data:', e);
    }
  }, []);

  const totalTransactions = sales.length;
  const totalVolume = sales.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalCommission = sales.reduce((sum, s) => sum + (s.commission || 0), 0);
  const avgCommission = sales.length > 0 ? totalCommission / sales.length : 0;

  const statCards = [
    { label: 'Transactions', value: totalTransactions, icon: '📊', color: isDark ? '#8B5CF6' : '#4F46E5' },
    { label: 'Volume', value: formatCurrency(totalVolume), icon: '💰', color: isDark ? '#EC4899' : '#10B981' },
    { label: 'Commission', value: formatCurrency(totalCommission), icon: '💵', color: isDark ? '#10B981' : '#F59E0B' },
    { label: 'Avg Commission', value: formatCurrency(avgCommission), icon: '📈', color: isDark ? '#F59E0B' : '#3B82F6' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px' }}>🏠</span>
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Sales Tracker</h1>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Track your real estate transactions</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              padding: '10px 16px',
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.textPrimary,
              fontSize: '14px'
            }}
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button style={{
            padding: '10px 20px',
            background: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            + Add
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['tracker', 'analytics'].map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            style={{
              padding: '10px 20px',
              background: activeView === view ? theme.primary : theme.bgCard,
              color: activeView === view ? 'white' : theme.textSecondary,
              border: `1px solid ${activeView === view ? theme.primary : theme.border}`,
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {view === 'tracker' ? '🎯 Tracker' : '📊 Analytics'}
          </button>
        ))}
      </div>

      {/* Stat Cards with Gradients */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Transactions Card - Cyan */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #164E63 0%, #0E4A5C 100%)' : 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 188, 212, 0.15)',
          border: `1px solid ${isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>📊</span>
            <span style={{ fontSize: '13px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '500' }}>Transactions</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064' }}>{totalTransactions}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: isDark ? '#67E8F9' : '#00838F' }}>vs goal</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981' }}>↗ {goals.transactions > 0 ? Math.round((totalTransactions / goals.transactions) * 100) : 0}%</span>
          </div>
        </div>

        {/* Volume Card - Orange */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #7C2D12 0%, #6B2A0F 100%)' : 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
          border: `1px solid ${isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>💰</span>
            <span style={{ fontSize: '13px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '500' }}>Volume</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C' }}>{formatCurrency(totalVolume)}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: isDark ? '#FDBA74' : '#E65100' }}>vs goal</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981' }}>↗ {goals.volume > 0 ? Math.round((totalVolume / goals.volume) * 100) : 0}%</span>
          </div>
        </div>

        {/* Commission Card - Green */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #14532D 0%, #115E2B 100%)' : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)',
          border: `1px solid ${isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>💵</span>
            <span style={{ fontSize: '13px', color: isDark ? '#86EFAC' : '#2E7D32', fontWeight: '500' }}>Commission</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E8F5E9' : '#1B5E20' }}>{formatCurrency(totalCommission)}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: isDark ? '#86EFAC' : '#2E7D32' }}>earned</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981' }}>↗ 100%</span>
          </div>
        </div>

        {/* Avg Commission Card - Purple */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #4A1D6B 0%, #3D1A5A 100%)' : 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
          border: `1px solid ${isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>📈</span>
            <span style={{ fontSize: '13px', color: isDark ? '#D8B4FE' : '#7B1FA2', fontWeight: '500' }}>Avg Commission</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#F3E5F5' : '#4A148C' }}>{formatCurrency(avgCommission)}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: isDark ? '#D8B4FE' : '#7B1FA2' }}>per deal</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981' }}>↗ avg</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Commission Pipeline */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Commission Pipeline
          </h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMuted }}>
            {sales.length === 0 ? 'No data to display' : 'Commission chart will appear here'}
          </div>
        </div>

        {/* Goals */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              🎯 Goals
            </h3>
            <span style={{ fontSize: '12px', color: theme.textMuted }}>{selectedYear}</span>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '4px' }}>Transactions</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${goals.transactions > 0 ? (totalTransactions / goals.transactions) * 100 : 0}%`, height: '100%', background: theme.primary, borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '14px', color: theme.textPrimary, fontWeight: '600' }}>{totalTransactions}/{goals.transactions || 0}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '4px' }}>Volume Goal</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${goals.volume > 0 ? (totalVolume / goals.volume) * 100 : 0}%`, height: '100%', background: theme.secondary, borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 Status
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isDark ? 'rgba(139, 92, 246, 0.2)' : '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '700',
              color: theme.primary
            }}>
              {totalTransactions}
            </div>
            <div style={{ fontSize: '13px' }}>
              {[
                { label: 'Active', color: theme.success },
                { label: 'Under', color: theme.warning },
                { label: 'Closed', color: theme.primary },
                { label: 'Cancelled', color: theme.danger }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  <span style={{ color: theme.textSecondary }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{
        background: theme.bgCard,
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${theme.borderLight}`,
        boxShadow: theme.cardShadow
      }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>All Transactions</span>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: isDark ? 'rgba(255,255,255,0.05)' : theme.bgMain }}>
              {['#', 'Status', 'Date', 'Client', 'Address', 'Source', 'Type', 'Price', 'Comm.', 'Side', 'Fee', 'Apps'].map(header => (
                <th key={header} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</div>
                  <div style={{ color: theme.textMuted }}>No transactions</div>
                </td>
              </tr>
            ) : (
              sales.map((sale, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                  <td style={{ padding: '12px 16px', color: theme.textPrimary }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: theme.success, color: 'white' }}>Active</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.date}</td>
                  <td style={{ padding: '12px 16px', color: theme.textPrimary }}>{sale.client}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.address}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.source}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.type}</td>
                  <td style={{ padding: '12px 16px', color: theme.textPrimary, fontWeight: '600' }}>{formatCurrency(sale.price)}</td>
                  <td style={{ padding: '12px 16px', color: theme.success, fontWeight: '600' }}>{formatCurrency(sale.commission)}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.side}</td>
                  <td style={{ padding: '12px 16px', color: theme.textSecondary }}>{sale.fee}%</td>
                  <td style={{ padding: '12px 16px' }}>-</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
