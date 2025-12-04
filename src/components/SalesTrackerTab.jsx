import React, { useState, useEffect, useMemo } from 'react';

// Default themes
const defaultLightTheme = {
  mode: 'light', primary: '#4F46E5', secondary: '#EC4899', success: '#10B981', warning: '#F59E0B', danger: '#EF4444',
  bgMain: '#F5F6FA', bgCard: '#FFFFFF', textPrimary: '#1F2937', textSecondary: '#6B7280', textMuted: '#9CA3AF',
  border: '#E5E7EB', borderLight: '#F3F4F6', cardShadow: '0 1px 3px rgba(0,0,0,0.05)',
};
const defaultDarkTheme = {
  mode: 'dark', primary: '#8B5CF6', secondary: '#EC4899', success: '#10B981', warning: '#F59E0B', danger: '#EF4444',
  bgMain: '#0c0a1d', bgCard: '#1e1b38', textPrimary: '#FFFFFF', textSecondary: '#A0AEC0', textMuted: '#718096',
  border: 'rgba(139, 92, 246, 0.2)', borderLight: 'rgba(255,255,255,0.1)', cardShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

// Mini Sparkline Component
const Sparkline = ({ data, color, width = 80, height = 32 }) => {
  if (!data || data.length < 2) return <div style={{ width, height }} />;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const points = data.map((val, i) => `${(i / (data.length - 1)) * width},${height - ((val - min) / range) * (height - 8) - 4}`).join(' ');
  return <svg width={width} height={height}><polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
};

// Tax calculation constants (2024 IRS rates)
const TAX_RATES = {
  selfEmployment: 0.153,
  federalBrackets: [
    { min: 0, max: 11600, rate: 0.10 }, { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 }, { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 }, { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  stateRates: { 'GA': 0.0575, 'TX': 0, 'FL': 0, 'CA': 0.133, 'NY': 0.109, 'DEFAULT': 0.05 },
  quarterlyDueDates: ['April 15', 'June 15', 'September 15', 'January 15']
};

export default function SalesTrackerTab({ theme: propTheme, userId, userEmail }) {
  const [localDarkMode] = useState(() => { try { return localStorage.getItem('pn_darkMode') === 'true'; } catch { return false; } });
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});
  
  // User-specific storage key
  const storageKey = userId || userEmail ? `pn_sales_${userId || userEmail}` : 'pn_sales_guest';
  const [transactions, setTransactions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState({ transactions: 24, volume: 5000000, commission: 150000 });
  const [userState, setUserState] = useState('GA');
  
  // Load user-specific data
  useEffect(() => {
    try {
      const savedTx = localStorage.getItem(storageKey);
      const savedContacts = localStorage.getItem(`${storageKey}_contacts`);
      const savedExpenses = localStorage.getItem(`${storageKey}_expenses`);
      const savedGoals = localStorage.getItem(`${storageKey}_goals`);
      if (savedTx) setTransactions(JSON.parse(savedTx));
      if (savedContacts) setContacts(JSON.parse(savedContacts));
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    } catch (e) { console.error('Error loading sales data:', e); }
  }, [storageKey]);

  // Save data when it changes
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(transactions)); } catch {} }, [transactions, storageKey]);
  useEffect(() => { try { localStorage.setItem(`${storageKey}_contacts`, JSON.stringify(contacts)); } catch {} }, [contacts, storageKey]);
  useEffect(() => { try { localStorage.setItem(`${storageKey}_expenses`, JSON.stringify(expenses)); } catch {} }, [expenses, storageKey]);

  const toggleSection = (s) => setCollapsedSections(prev => ({ ...prev, [s]: !prev[s] }));

  // Calculate statistics
  const stats = useMemo(() => {
    const yearTx = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);
    const closed = yearTx.filter(t => t.status === 'closed');
    const active = yearTx.filter(t => t.status === 'active');
    const pending = yearTx.filter(t => t.status === 'pending' || t.status === 'under_contract');
    
    const totalVolume = closed.reduce((s, t) => s + (t.price || 0), 0);
    const totalCommission = closed.reduce((s, t) => s + (t.commission || 0), 0);
    const pendingCommission = pending.reduce((s, t) => s + (t.commission || 0), 0);
    const yearExpenses = expenses.filter(e => new Date(e.date).getFullYear() === selectedYear);
    const totalExpenses = yearExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    const netIncome = totalCommission - totalExpenses;
    
    const currentMonth = new Date().getMonth() + 1;
    const avgMonthlyCommission = currentMonth > 0 ? totalCommission / currentMonth : 0;
    const projectedAnnual = avgMonthlyCommission * 12;
    
    const selfEmploymentTax = netIncome * TAX_RATES.selfEmployment * 0.9235;
    const stateRate = TAX_RATES.stateRates[userState] || TAX_RATES.stateRates.DEFAULT;
    const stateTax = netIncome * stateRate;
    
    let federalTax = 0, remaining = netIncome - (selfEmploymentTax / 2);
    for (const bracket of TAX_RATES.federalBrackets) {
      if (remaining <= 0) break;
      const taxable = Math.min(remaining, bracket.max - bracket.min);
      federalTax += taxable * bracket.rate;
      remaining -= taxable;
    }
    
    const totalTax = selfEmploymentTax + stateTax + federalTax;
    const effectiveTaxRate = netIncome > 0 ? totalTax / netIncome : 0;
    
    return {
      closedCount: closed.length, activeCount: active.length, pendingCount: pending.length,
      totalVolume, totalCommission, pendingCommission, totalExpenses, netIncome,
      avgMonthlyCommission, projectedAnnual, avgDealSize: closed.length > 0 ? totalVolume / closed.length : 0,
      selfEmploymentTax, stateTax, federalTax, totalTax, effectiveTaxRate, quarterlyPayment: totalTax / 4,
      leadsCount: contacts.filter(c => c.type === 'lead').length,
      clientsCount: contacts.filter(c => c.type === 'client').length,
    };
  }, [transactions, expenses, contacts, selectedYear, userState]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)' },
    { id: 'pipeline', label: 'Pipeline', icon: '🏠', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
    { id: 'commissions', label: 'Commissions', icon: '💰', gradient: 'linear-gradient(135deg, #10B981, #06B6D4)' },
    { id: 'expenses', label: 'Expenses', icon: '🧾', gradient: 'linear-gradient(135deg, #EF4444, #F97316)' },
    { id: 'contacts', label: 'CRM', icon: '👥', gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' },
    { id: 'taxes', label: 'Tax Center', icon: '📋', gradient: 'linear-gradient(135deg, #6366F1, #A855F7)' },
  ];

  const KPICard = ({ title, value, subtitle, icon, gradient, sparklineData, onClick }) => (
    <div onClick={onClick} onMouseEnter={() => setHoveredCard(title)} onMouseLeave={() => setHoveredCard(null)}
      style={{ background: gradient, borderRadius: '20px', padding: '24px', cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', transform: hoveredCard === title ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hoveredCard === title ? '0 20px 40px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{icon}</div>
        {sparklineData && <Sparkline data={sparklineData} color="rgba(255,255,255,0.8)" />}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '700', color: 'white', letterSpacing: '-1px', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>{title}</div>
      {subtitle && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{subtitle}</div>}
    </div>
  );

  const SectionHeader = ({ title, icon, gradient, badge, collapsed, onToggle }) => (
    <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: collapsed ? '24px' : '16px', cursor: onToggle ? 'pointer' : 'default', userSelect: 'none' }}>
      <div style={{ width: '4px', height: '24px', background: gradient, borderRadius: '2px' }} />
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>{title}</h2>
      {badge && <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>{badge}</span>}
      {onToggle && <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)' }}>🏠</div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.5px' }}>Real Estate Command Center</h1>
              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Track listings, commissions, expenses & taxes</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={{ padding: '10px 16px', background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'; }}
            style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)', transition: 'all 0.2s' }}>
            <span>+</span> Add Transaction
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: theme.bgCard, padding: '6px', borderRadius: '16px', boxShadow: theme.cardShadow, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            onMouseEnter={(e) => { if (activeTab !== tab.id) e.target.style.background = isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6'; }}
            onMouseLeave={(e) => { if (activeTab !== tab.id) e.target.style.background = 'transparent'; }}
            style={{ padding: '12px 20px', background: activeTab === tab.id ? tab.gradient : 'transparent', border: 'none', borderRadius: '12px',
              color: activeTab === tab.id ? 'white' : theme.textSecondary, fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.2)' : 'none' }}>
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <KPICard title="Closed Deals" value={stats.closedCount} subtitle={`${stats.pendingCount} pending`} icon="🏠" gradient="linear-gradient(135deg, #10B981, #059669)" sparklineData={[3,5,4,6,5,7,6,8]} />
            <KPICard title="Total Volume" value={formatCurrency(stats.totalVolume)} subtitle={`Avg ${formatCurrency(stats.avgDealSize)}/deal`} icon="📊" gradient="linear-gradient(135deg, #3B82F6, #1D4ED8)" />
            <KPICard title="Commission Earned" value={formatCurrency(stats.totalCommission)} subtitle={`+${formatCurrency(stats.pendingCommission)} pending`} icon="💰" gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)" />
            <KPICard title="Net Income" value={formatCurrency(stats.netIncome)} subtitle={`After ${formatCurrency(stats.totalExpenses)} expenses`} icon="📈" gradient="linear-gradient(135deg, #EC4899, #DB2777)" />
          </div>

          <SectionHeader title="Goal Progress" icon="🎯" gradient="linear-gradient(180deg, #F59E0B, #D97706)" badge={`${selectedYear}`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {[{ label: 'Transactions', current: stats.closedCount, goal: goals.transactions, color: '#10B981' },
              { label: 'Sales Volume', current: stats.totalVolume, goal: goals.volume, color: '#3B82F6', format: formatCurrency },
              { label: 'Commission', current: stats.totalCommission, goal: goals.commission, color: '#8B5CF6', format: formatCurrency }
            ].map((g, i) => {
              const pct = g.goal > 0 ? Math.min((g.current / g.goal) * 100, 100) : 0;
              const fmt = g.format || (v => v);
              return (
                <div key={i} style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${g.color}, ${g.color}80)` }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>{g.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: g.color }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary, marginBottom: '8px' }}>{fmt(g.current)}</div>
                  <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${g.color}, ${g.color}CC)`, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>Goal: {fmt(g.goal)}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[{ label: 'Active Listings', value: stats.activeCount, icon: '🏷️', color: '#F59E0B' },
              { label: 'Under Contract', value: stats.pendingCount, icon: '📝', color: '#3B82F6' },
              { label: 'Leads', value: stats.leadsCount, icon: '👤', color: '#8B5CF6' },
              { label: 'Clients', value: stats.clientsCount, icon: '⭐', color: '#10B981' }
            ].map((s, i) => (
              <div key={i} style={{ background: theme.bgCard, borderRadius: '12px', padding: '16px', border: `1px solid ${theme.borderLight}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{s.icon}</div>
                <div><div style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary }}>{s.value}</div><div style={{ fontSize: '12px', color: theme.textMuted }}>{s.label}</div></div>
              </div>
            ))}
          </div>

          <SectionHeader title="Tax Overview" icon="📋" gradient="linear-gradient(180deg, #6366F1, #A855F7)" badge={`Est. ${formatPercent(stats.effectiveTaxRate)} effective rate`} />
          <div style={{ background: isDark ? 'rgba(99, 102, 241, 0.1)' : '#EEF2FF', borderRadius: '16px', padding: '24px', border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.2)' : '#C7D2FE'}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              <div><div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '4px' }}>Self-Employment Tax</div><div style={{ fontSize: '20px', fontWeight: '700', color: theme.warning }}>{formatCurrency(stats.selfEmploymentTax)}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>15.3% of net</div></div>
              <div><div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '4px' }}>Federal Income Tax</div><div style={{ fontSize: '20px', fontWeight: '700', color: '#3B82F6' }}>{formatCurrency(stats.federalTax)}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>Marginal brackets</div></div>
              <div><div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '4px' }}>State Tax ({userState})</div><div style={{ fontSize: '20px', fontWeight: '700', color: '#8B5CF6' }}>{formatCurrency(stats.stateTax)}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>{formatPercent(TAX_RATES.stateRates[userState] || 0.05)}</div></div>
              <div><div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '4px' }}>Est. Quarterly Payment</div><div style={{ fontSize: '20px', fontWeight: '700', color: theme.danger }}>{formatCurrency(stats.quarterlyPayment)}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>Due {TAX_RATES.quarterlyDueDates[Math.floor(new Date().getMonth() / 3)]}</div></div>
            </div>
          </div>
        </div>
      )}

      {/* PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {[{ stage: 'Prospecting', count: transactions.filter(t => t.stage === 'prospecting').length, icon: '🔍', color: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)' },
              { stage: 'Listed', count: stats.activeCount, icon: '🏷️', color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
              { stage: 'Under Contract', count: stats.pendingCount, icon: '📝', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
              { stage: 'Closed', count: stats.closedCount, icon: '✅', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #34D399)' }
            ].map((s, i) => (
              <div key={i} onMouseEnter={() => setHoveredCard(s.stage)} onMouseLeave={() => setHoveredCard(null)}
                style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `2px solid ${hoveredCard === s.stage ? s.color : theme.borderLight}`,
                  position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', transform: hoveredCard === s.stage ? 'translateY(-2px)' : 'translateY(0)', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: s.gradient }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{s.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary }}>{s.stage}</div>
                </div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: theme.textPrimary }}>{s.count}</div>
              </div>
            ))}
          </div>

          <SectionHeader title="All Transactions" icon="📋" gradient="linear-gradient(180deg, #3B82F6, #06B6D4)" badge={`${transactions.length} total`} collapsed={collapsedSections.pipeline} onToggle={() => toggleSection('pipeline')} />
          {!collapsedSections.pipeline && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${theme.borderLight}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: isDark ? 'rgba(255,255,255,0.05)' : theme.bgMain }}>
                  {['Status', 'Property', 'Client', 'Type', 'Price', 'Commission', 'Close Date'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr><td colSpan="7" style={{ padding: '60px', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>No transactions yet</div>
                      <div style={{ color: theme.textMuted, marginBottom: '20px' }}>Add your first listing or sale to get started</div>
                      <button style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>+ Add Transaction</button>
                    </td></tr>
                  ) : transactions.map((t, i) => {
                    const sc = { active: { bg: '#FEF3C7', text: '#D97706' }, pending: { bg: '#DBEAFE', text: '#2563EB' }, under_contract: { bg: '#DBEAFE', text: '#2563EB' }, closed: { bg: '#D1FAE5', text: '#059669' }, cancelled: { bg: '#FEE2E2', text: '#DC2626' } }[t.status] || { bg: '#FEF3C7', text: '#D97706' };
                    return (<tr key={i} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                      <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', background: sc.bg, color: sc.text }}>{t.status?.replace('_', ' ').toUpperCase() || 'ACTIVE'}</span></td>
                      <td style={{ padding: '14px 16px', color: theme.textPrimary, fontWeight: '500' }}>{t.address || '-'}</td>
                      <td style={{ padding: '14px 16px', color: theme.textSecondary }}>{t.client || '-'}</td>
                      <td style={{ padding: '14px 16px', color: theme.textSecondary }}>{t.type || 'Buyer'}</td>
                      <td style={{ padding: '14px 16px', color: theme.textPrimary, fontWeight: '600' }}>{formatCurrency(t.price)}</td>
                      <td style={{ padding: '14px 16px', color: theme.success, fontWeight: '600' }}>{formatCurrency(t.commission)}</td>
                      <td style={{ padding: '14px 16px', color: theme.textSecondary }}>{t.closeDate || '-'}</td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* COMMISSIONS TAB */}
      {activeTab === 'commissions' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <KPICard title="Total Earned" value={formatCurrency(stats.totalCommission)} subtitle={`${stats.closedCount} closed deals`} icon="💰" gradient="linear-gradient(135deg, #10B981, #059669)" />
            <KPICard title="Pending" value={formatCurrency(stats.pendingCommission)} subtitle={`${stats.pendingCount} deals in progress`} icon="⏳" gradient="linear-gradient(135deg, #F59E0B, #D97706)" />
            <KPICard title="Projected Annual" value={formatCurrency(stats.projectedAnnual)} subtitle={`${formatCurrency(stats.avgMonthlyCommission)}/month avg`} icon="📈" gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)" />
          </div>

          <SectionHeader title="Commission Breakdown" icon="💵" gradient="linear-gradient(180deg, #10B981, #06B6D4)" />
          <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.borderLight}`, marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>By Deal Type</h4>
                {[{ type: 'Buyer Side', value: transactions.filter(t => t.type === 'buyer' && t.status === 'closed').reduce((s, t) => s + (t.commission || 0), 0), color: '#3B82F6' },
                  { type: 'Seller Side', value: transactions.filter(t => t.type === 'seller' && t.status === 'closed').reduce((s, t) => s + (t.commission || 0), 0), color: '#10B981' },
                  { type: 'Dual Agency', value: transactions.filter(t => t.type === 'dual' && t.status === 'closed').reduce((s, t) => s + (t.commission || 0), 0), color: '#8B5CF6' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? `1px solid ${theme.borderLight}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} /><span style={{ color: theme.textSecondary }}>{item.type}</span></div>
                    <span style={{ fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Commission Stats</h4>
                {[{ label: 'Average Commission', value: stats.closedCount > 0 ? formatCurrency(stats.totalCommission / stats.closedCount) : '$0' },
                  { label: 'Highest Commission', value: formatCurrency(Math.max(...transactions.filter(t => t.status === 'closed').map(t => t.commission || 0), 0)) },
                  { label: 'Average Rate', value: stats.totalVolume > 0 ? `${((stats.totalCommission / stats.totalVolume) * 100).toFixed(2)}%` : '0%' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? `1px solid ${theme.borderLight}` : 'none' }}>
                    <span style={{ color: theme.textSecondary }}>{item.label}</span><span style={{ fontWeight: '600', color: theme.textPrimary }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #EF4444, #F97316)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>+ Add Expense</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <KPICard title="Total Expenses" value={formatCurrency(stats.totalExpenses)} icon="🧾" gradient="linear-gradient(135deg, #EF4444, #DC2626)" />
            <KPICard title="Marketing" value={formatCurrency(expenses.filter(e => e.category === 'marketing').reduce((s, e) => s + (e.amount || 0), 0))} icon="📣" gradient="linear-gradient(135deg, #F59E0B, #D97706)" />
            <KPICard title="MLS & Dues" value={formatCurrency(expenses.filter(e => e.category === 'dues').reduce((s, e) => s + (e.amount || 0), 0))} icon="🏛️" gradient="linear-gradient(135deg, #3B82F6, #2563EB)" />
            <KPICard title="Other" value={formatCurrency(expenses.filter(e => !['marketing', 'dues'].includes(e.category)).reduce((s, e) => s + (e.amount || 0), 0))} icon="📦" gradient="linear-gradient(135deg, #6B7280, #4B5563)" />
          </div>

          <SectionHeader title="Expense Categories" icon="📊" gradient="linear-gradient(180deg, #EF4444, #F97316)" />
          <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.borderLight}` }}>
            {[{ category: 'Marketing & Advertising', icon: '📣', items: ['Social media ads', 'Print materials', 'Photography', 'Virtual tours'] },
              { category: 'MLS & Association Dues', icon: '🏛️', items: ['MLS fees', 'Board dues', 'NAR membership', 'E&O insurance'] },
              { category: 'Technology & Tools', icon: '💻', items: ['CRM software', 'Website hosting', 'Transaction mgmt', 'Showing services'] },
              { category: 'Vehicle & Travel', icon: '🚗', items: ['Mileage', 'Gas', 'Maintenance', 'Client meetings'] }
            ].map((cat, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: i < 3 ? `1px solid ${theme.borderLight}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}><span style={{ fontSize: '20px' }}>{cat.icon}</span><span style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary }}>{cat.category}</span></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '32px' }}>{cat.items.map((item, j) => (<span key={j} style={{ fontSize: '12px', color: theme.textMuted, background: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6', padding: '4px 10px', borderRadius: '6px' }}>{item}</span>))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CRM TAB */}
      {activeTab === 'contacts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>+ Add Contact</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <KPICard title="Total Contacts" value={contacts.length} icon="👥" gradient="linear-gradient(135deg, #3B82F6, #1D4ED8)" />
            <KPICard title="Leads" value={stats.leadsCount} icon="🎯" gradient="linear-gradient(135deg, #F59E0B, #D97706)" />
            <KPICard title="Active Clients" value={contacts.filter(c => c.type === 'client' && c.status === 'active').length} icon="⭐" gradient="linear-gradient(135deg, #10B981, #059669)" />
            <KPICard title="Past Clients" value={contacts.filter(c => c.type === 'client' && c.status === 'past').length} icon="🏆" gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)" />
          </div>

          <SectionHeader title="Contact Pipeline" icon="📊" gradient="linear-gradient(180deg, #3B82F6, #8B5CF6)" badge={`${contacts.length} total`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[{ stage: 'New Leads', color: '#F59E0B', list: contacts.filter(c => c.stage === 'new') },
              { stage: 'Contacted', color: '#3B82F6', list: contacts.filter(c => c.stage === 'contacted') },
              { stage: 'Qualified', color: '#8B5CF6', list: contacts.filter(c => c.stage === 'qualified') },
              { stage: 'Active Client', color: '#10B981', list: contacts.filter(c => c.stage === 'active') }
            ].map((s, i) => (
              <div key={i} style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', minHeight: '200px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: s.color }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, margin: 0 }}>{s.stage}</h4>
                  <span style={{ fontSize: '12px', background: `${s.color}20`, color: s.color, padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>{s.list.length}</span>
                </div>
                {s.list.length === 0 ? (<div style={{ textAlign: 'center', padding: '20px', color: theme.textMuted, fontSize: '13px' }}>No contacts</div>
                ) : s.list.slice(0, 3).map((c, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB', borderRadius: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: s.color, fontWeight: '600' }}>{c.name?.[0] || '?'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name || 'Unknown'}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>{c.source || 'Direct'}</div></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAX CENTER TAB */}
      {activeTab === 'taxes' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <KPICard title="Net Income" value={formatCurrency(stats.netIncome)} subtitle="After expenses" icon="💵" gradient="linear-gradient(135deg, #10B981, #059669)" />
            <KPICard title="Total Tax Est." value={formatCurrency(stats.totalTax)} subtitle={`${formatPercent(stats.effectiveTaxRate)} effective`} icon="📋" gradient="linear-gradient(135deg, #EF4444, #DC2626)" />
            <KPICard title="Quarterly Payment" value={formatCurrency(stats.quarterlyPayment)} subtitle="Recommended" icon="📅" gradient="linear-gradient(135deg, #F59E0B, #D97706)" />
            <KPICard title="Take Home" value={formatCurrency(stats.netIncome - stats.totalTax)} subtitle="After taxes" icon="🏠" gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)" />
          </div>

          <SectionHeader title="Tax Breakdown" icon="📊" gradient="linear-gradient(180deg, #6366F1, #A855F7)" />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.borderLight}` }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px' }}>Estimated Tax Liability</h4>
              {[{ label: 'Self-Employment Tax', sublabel: '15.3% (Social Security + Medicare)', value: stats.selfEmploymentTax, color: '#F59E0B' },
                { label: 'Federal Income Tax', sublabel: 'Based on marginal brackets', value: stats.federalTax, color: '#3B82F6' },
                { label: `State Tax (${userState})`, sublabel: `${formatPercent(TAX_RATES.stateRates[userState] || 0.05)} rate`, value: stats.stateTax, color: '#8B5CF6' }
              ].map((tax, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div><div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{tax.label}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>{tax.sublabel}</div></div>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: tax.color }}>{formatCurrency(tax.value)}</span>
                  </div>
                  <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.totalTax > 0 ? (tax.value / stats.totalTax) * 100 : 0}%`, height: '100%', background: tax.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
              <div style={{ borderTop: `2px solid ${theme.borderLight}`, paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary }}>Total Estimated Tax</span>
                <span style={{ fontSize: '24px', fontWeight: '700', color: theme.danger }}>{formatCurrency(stats.totalTax)}</span>
              </div>
            </div>

            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.borderLight}` }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '20px' }}>Quarterly Payments</h4>
              {TAX_RATES.quarterlyDueDates.map((date, i) => {
                const isPast = i < Math.floor(new Date().getMonth() / 3);
                const isCurrent = i === Math.floor(new Date().getMonth() / 3);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: isCurrent ? (isDark ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7') : (isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB'), borderRadius: '10px', marginBottom: '10px', border: isCurrent ? '1px solid #F59E0B' : `1px solid ${theme.borderLight}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isPast ? '#10B98120' : isCurrent ? '#F59E0B20' : `${theme.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{isPast ? '✓' : isCurrent ? '⏰' : '📅'}</div>
                      <div><div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Q{i + 1} Payment</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Due {date}</div></div>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: isPast ? theme.success : isCurrent ? '#F59E0B' : theme.textPrimary }}>{formatCurrency(stats.quarterlyPayment)}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: '16px', padding: '12px', background: isDark ? 'rgba(99, 102, 241, 0.1)' : '#EEF2FF', borderRadius: '10px', fontSize: '12px', color: '#6366F1' }}>
                💡 <strong>Tip:</strong> Set aside {formatPercent(stats.effectiveTaxRate)} of each commission for taxes
              </div>
            </div>
          </div>

          <SectionHeader title="Common Deductions" icon="💡" gradient="linear-gradient(180deg, #10B981, #06B6D4)" />
          <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.borderLight}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[{ category: 'Home Office', icon: '🏠', items: ['Dedicated space', 'Internet', 'Utilities', 'Furniture'] },
                { category: 'Vehicle', icon: '🚗', items: ['Mileage (67¢/mi)', 'Parking', 'Tolls', 'Lease payments'] },
                { category: 'Marketing', icon: '📣', items: ['Advertising', 'Website', 'Signs/Flyers', 'Client gifts'] },
                { category: 'Professional', icon: '👔', items: ['MLS fees', 'NAR dues', 'E&O insurance', 'Continuing ed'] },
                { category: 'Technology', icon: '💻', items: ['CRM software', 'Phone plan', 'Computer', 'Apps/tools'] },
                { category: 'Other', icon: '📦', items: ['Client meals', 'Staging', 'Photography', 'Transaction fees'] }
              ].map((d, i) => (
                <div key={i} style={{ padding: '16px', background: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><span style={{ fontSize: '20px' }}>{d.icon}</span><span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{d.category}</span></div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{d.items.map((item, j) => (<span key={j} style={{ fontSize: '11px', color: theme.textMuted, background: isDark ? 'rgba(255,255,255,0.08)' : 'white', padding: '4px 8px', borderRadius: '4px', border: `1px solid ${theme.borderLight}` }}>{item}</span>))}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
