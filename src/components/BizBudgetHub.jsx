import React, { useState, useMemo, useEffect } from 'react';

const DEMO_DEALS = [
  { id: 1, property: '2908 Urban Avenue, Columbus, GA 31907', status: 'Closed', purchaseDate: '2025-04-14', soldDate: '2025-08-25', purchasePrice: 69000, listingPrice: 99000, soldPrice: 95000, closingCosts: 0, sellCommission: 5700, buyCommission: 0, interestPaid: 3727, renovationCosts: 0, netProfit: 15172.37, dom: 72, agent: 'Tucker Pate', agentCommission: 2850, ourCommission: 2850, ourCommissionPct: 0.03, michaelTakeHome: 9102.39, anthonyTakeHome: 9102.39 },
  { id: 2, property: '1114 Brooks Road, Columbus, GA 31903', status: 'Closed', purchaseDate: '2025-02-10', soldDate: '2025-05-15', purchasePrice: 13500, listingPrice: 25000, soldPrice: 25000, closingCosts: 0, sellCommission: 1500, buyCommission: 0, interestPaid: 0, renovationCosts: 0, netProfit: 10000, dom: 45, agent: null, agentCommission: 0, ourCommission: 0, ourCommissionPct: 0, michaelTakeHome: 5000, anthonyTakeHome: 5000 },
  { id: 3, property: '2214 Somerset Avenue, Columbus, GA 31903', status: 'Closed', purchaseDate: '2025-01-20', soldDate: '2025-04-10', purchasePrice: 0, listingPrice: 58000, soldPrice: 58000, closingCosts: 0, sellCommission: 3480, buyCommission: 0, interestPaid: 0, renovationCosts: 0, netProfit: 54520, dom: 35, agent: null, agentCommission: 0, ourCommission: 3480, ourCommissionPct: 0.06, michaelTakeHome: 27260, anthonyTakeHome: 27260 },
  { id: 4, property: '4742 Marino Drive, Columbus, GA 31907', status: 'Under Contract', purchaseDate: '2025-11-01', soldDate: null, purchasePrice: 85000, listingPrice: 125000, soldPrice: null, closingCosts: 2500, sellCommission: 0, buyCommission: 0, interestPaid: 0, renovationCosts: 15000, netProfit: null, dom: null, agent: 'Tucker Pate', agentCommission: 0, ourCommission: 0, ourCommissionPct: 0.03, michaelTakeHome: null, anthonyTakeHome: null },
  { id: 5, property: '2936 Walker Road, Columbus, GA 31904', status: 'Listed', purchaseDate: '2025-09-15', soldDate: null, purchasePrice: 72000, listingPrice: 110000, soldPrice: null, closingCosts: 1800, sellCommission: 0, buyCommission: 0, interestPaid: 2160, renovationCosts: 12000, netProfit: null, dom: 45, agent: null, agentCommission: 0, ourCommission: 0, ourCommissionPct: 0.03, michaelTakeHome: null, anthonyTakeHome: null },
];

const formatCurrency = (amount) => amount == null ? '-' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

// Monthly data for forecasts and historical tracking
const MONTHLY_DATA = [
  { month: 'Jan', revenue: 58000, profit: 54520, commissions: 3480, deals: 1 },
  { month: 'Feb', revenue: 0, profit: 0, commissions: 0, deals: 0 },
  { month: 'Mar', revenue: 0, profit: 0, commissions: 0, deals: 0 },
  { month: 'Apr', revenue: 0, profit: 0, commissions: 0, deals: 0 },
  { month: 'May', revenue: 25000, profit: 10000, commissions: 1500, deals: 1 },
  { month: 'Jun', revenue: 0, profit: 0, commissions: 0, deals: 0 },
  { month: 'Jul', revenue: 0, profit: 0, commissions: 0, deals: 0 },
  { month: 'Aug', revenue: 95000, profit: 15172, commissions: 2850, deals: 1 },
  { month: 'Sep', revenue: 0, profit: 0, commissions: 0, deals: 0 },
  { month: 'Oct', revenue: 0, profit: 0, commissions: 0, deals: 0 },
  { month: 'Nov', revenue: 0, profit: 0, commissions: 0, deals: 0 },
  { month: 'Dec', revenue: 0, profit: 0, commissions: 0, deals: 0 },
];

// Budget categories
const BUDGET_CATEGORIES = [
  { category: 'Marketing & Advertising', budgeted: 5000, actual: 3200, icon: '📢' },
  { category: 'Renovations & Repairs', budgeted: 30000, actual: 27000, icon: '🔧' },
  { category: 'Closing Costs', budgeted: 8000, actual: 4300, icon: '📋' },
  { category: 'Interest & Financing', budgeted: 6000, actual: 5887, icon: '💳' },
  { category: 'Professional Services', budgeted: 3000, actual: 1800, icon: '👔' },
  { category: 'Software & Tools', budgeted: 1200, actual: 1100, icon: '💻' },
  { category: 'Vehicle & Travel', budgeted: 4000, actual: 2800, icon: '🚗' },
  { category: 'Office & Supplies', budgeted: 2000, actual: 1500, icon: '📦' },
];

export default function BizBudgetHub({ theme, lastImportDate, userEmail, initialTab = 'dashboard', profile, onUpdateProfile }) {
  const isDark = theme?.mode === 'dark';
  const activeTab = initialTab;
  const [businessName, setBusinessName] = useState(() => profile?.bizbudgetBusinessName || 'KM GA LLC - HomeVestors Franchise Management');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempBusinessName, setTempBusinessName] = useState(businessName);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [deals] = useState(DEMO_DEALS);
  
  useEffect(() => { if (profile?.bizbudgetBusinessName) setBusinessName(profile.bizbudgetBusinessName); }, [profile?.bizbudgetBusinessName]);
  
  const saveBusinessName = async () => {
    if (tempBusinessName.trim()) {
      setBusinessName(tempBusinessName.trim());
      setIsEditingName(false);
      if (onUpdateProfile) await onUpdateProfile({ ...profile, bizbudgetBusinessName: tempBusinessName.trim() });
    }
  };
  
  const toggleSection = (s) => setCollapsedSections(prev => ({ ...prev, [s]: !prev[s] }));
  
  const stats = useMemo(() => {
    const closed = deals.filter(d => d.status === 'Closed');
    const pending = deals.filter(d => d.status !== 'Closed');
    const totalRevenue = closed.reduce((s, d) => s + (d.soldPrice || 0), 0);
    const totalProfit = closed.reduce((s, d) => s + (d.netProfit || 0), 0);
    const totalCommissions = closed.reduce((s, d) => s + (d.ourCommission || 0), 0);
    const avgDOM = closed.length > 0 ? closed.reduce((s, d) => s + (d.dom || 0), 0) / closed.length : 0;
    const michaelTotal = closed.reduce((s, d) => s + (d.michaelTakeHome || 0), 0);
    const anthonyTotal = closed.reduce((s, d) => s + (d.anthonyTakeHome || 0), 0);
    const pipelineValue = pending.reduce((s, d) => s + Math.max(0, (d.listingPrice || 0) - (d.purchasePrice || 0) - (d.closingCosts || 0) - (d.renovationCosts || 0)), 0);
    const months = Math.max(new Date().getMonth(), 1);
    return { closedCount: closed.length, pendingCount: pending.length, totalRevenue, totalProfit, totalCommissions, avgDOM: Math.round(avgDOM), michaelTotal, anthonyTotal, pipelineValue, commissionTaxReserve: totalCommissions * 0.46, profitTaxReserve: totalProfit * 0.31, projectedAnnualProfit: (totalProfit / months) * 12, projectedAnnualRevenue: (totalRevenue / months) * 12 };
  }, [deals]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Closed': return { bg: '#D1FAE5', color: '#059669', text: 'Closed' };
      case 'Under Contract': return { bg: '#FEF3C7', color: '#D97706', text: 'Under Contract' };
      case 'Listed': return { bg: '#DBEAFE', color: '#2563EB', text: 'Listed' };
      default: return { bg: '#F3F4F6', color: '#6B7280', text: status };
    }
  };

  const MiniSparkline = ({ data, color, height = 40 }) => {
    const max = Math.max(...data), min = Math.min(...data), range = max - min || 1, width = 120;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 8)}`).join(' ');
    return <svg width={width} height={height}><polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  };

  // Collapsible Section Header Component
  const SectionHeader = ({ title, badge, badgeColor, gradient, sectionKey, icon }) => (
    <div 
      onClick={() => toggleSection(sectionKey)} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: collapsedSections[sectionKey] ? '24px' : '16px', 
        cursor: 'pointer', 
        userSelect: 'none' 
      }}
    >
      <div style={{ width: '4px', height: '24px', background: gradient, borderRadius: '2px' }} />
      {icon && <span style={{ fontSize: '20px' }}>{icon}</span>}
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>{title}</h2>
      {badge && (
        <span style={{ 
          fontSize: '12px', 
          color: badgeColor || theme.textMuted, 
          background: badgeColor ? `${badgeColor}15` : theme.bgMain, 
          padding: '4px 10px', 
          borderRadius: '6px',
          fontWeight: '500'
        }}>
          {badge}
        </span>
      )}
      <span style={{ 
        marginLeft: 'auto', 
        fontSize: '12px', 
        color: theme.textMuted, 
        transform: collapsedSections[sectionKey] ? 'rotate(-90deg)' : 'rotate(0deg)', 
        transition: 'transform 0.2s' 
      }}>▼</span>
    </div>
  );

  // KPI Card Component
  const KPICard = ({ title, value, subtitle, gradient, trend, trendUp }) => (
    <div style={{ 
      background: theme.bgCard, 
      borderRadius: '16px', 
      padding: '20px', 
      border: `1px solid ${theme.borderLight}`, 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: gradient }} />
      <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{value}</div>
        {trend && (
          <span style={{ 
            fontSize: '12px', 
            color: trendUp ? '#10B981' : '#EF4444', 
            fontWeight: '500' 
          }}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      {subtitle && <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>{subtitle}</div>}
    </div>
  );

  return (
    <div>
      {/* Header with Editable Business Name */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '24px' }}>🏢</span></div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.5px' }}>BizBudget Hub</h1>
            {isEditingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input type="text" value={tempBusinessName} onChange={(e) => setTempBusinessName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saveBusinessName(); if (e.key === 'Escape') { setTempBusinessName(businessName); setIsEditingName(false); } }} autoFocus style={{ fontSize: '14px', color: theme.textSecondary, background: theme.bgCard, border: `1px solid ${theme.primary}`, borderRadius: '6px', padding: '4px 10px', outline: 'none', width: '300px' }} />
                <button onClick={saveBusinessName} style={{ padding: '4px 12px', background: theme.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Save</button>
                <button onClick={() => { setTempBusinessName(businessName); setIsEditingName(false); }} style={{ padding: '4px 12px', background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.borderLight}`, borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
              </div>
            ) : (
              <p onClick={() => { setTempBusinessName(businessName); setIsEditingName(true); }} style={{ fontSize: '14px', color: theme.textMuted, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>{businessName}<span style={{ fontSize: '12px', opacity: 0.5 }}>✏️</span></p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          {lastImportDate && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#10B98115', borderRadius: '8px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /><span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>Last import: {new Date(lastImportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: isDark ? 'linear-gradient(135deg, #164E63, #0E4A5C)' : 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0, 188, 212, 0.15)', border: `1px solid ${isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏠</div><span style={{ fontSize: '14px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Active Deals</span></div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064' }}>{stats.pendingCount}</div>
          <div style={{ fontSize: '12px', color: isDark ? '#67E8F9' : '#00838F', marginTop: '4px' }}>Pipeline: {formatCurrency(stats.pipelineValue)}</div>
        </div>
        <div style={{ background: isDark ? 'linear-gradient(135deg, #14532D, #115E2B)' : 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)', border: `1px solid ${isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💰</div><span style={{ fontSize: '14px', color: isDark ? '#86EFAC' : '#2E7D32', fontWeight: '600' }}>Total Profit</span></div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E8F5E9' : '#1B5E20' }}>{formatCurrency(stats.totalProfit)}</div>
          <div style={{ fontSize: '12px', color: isDark ? '#86EFAC' : '#2E7D32', marginTop: '4px' }}>{stats.closedCount} closed deals YTD</div>
        </div>
        <div style={{ background: isDark ? 'linear-gradient(135deg, #4A1D6B, #3D1A5A)' : 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)', border: `1px solid ${isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤝</div><span style={{ fontSize: '14px', color: isDark ? '#D8B4FE' : '#7B1FA2', fontWeight: '600' }}>Commissions</span></div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#F3E5F5' : '#4A148C' }}>{formatCurrency(stats.totalCommissions)}</div>
          <div style={{ fontSize: '12px', color: isDark ? '#D8B4FE' : '#7B1FA2', marginTop: '4px' }}>Avg DOM: {stats.avgDOM} days</div>
        </div>
        <div style={{ background: isDark ? 'linear-gradient(135deg, #7C2D12, #6B2A0F)' : 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)', border: `1px solid ${isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👥</div><span style={{ fontSize: '14px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '600' }}>Partner Splits</span></div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C' }}><div>M: {formatCurrency(stats.michaelTotal)}</div><div style={{ marginTop: '2px' }}>A: {formatCurrency(stats.anthonyTotal)}</div></div>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div>
          <SectionHeader 
            title="Key Performance Indicators" 
            gradient="linear-gradient(180deg, #8B5CF6, #EC4899)" 
            sectionKey="kpiOverview"
          />
          {!collapsedSections.kpiOverview && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <KPICard title="Projected Annual Revenue" value={formatCurrency(stats.projectedAnnualRevenue)} subtitle={`Based on ${stats.closedCount} deals · ${new Date().getMonth() + 1} months`} gradient="linear-gradient(90deg, #8B5CF6, #06B6D4)" trend="12%" trendUp={true} />
              <KPICard title="Projected Annual Profit" value={formatCurrency(stats.projectedAnnualProfit)} subtitle={`${((stats.totalProfit / stats.totalRevenue) * 100 || 0).toFixed(1)}% margin`} gradient="linear-gradient(90deg, #10B981, #06B6D4)" trend="8%" trendUp={true} />
              <KPICard title="Pipeline Value" value={formatCurrency(stats.pipelineValue)} subtitle={`${stats.pendingCount} active properties`} gradient="linear-gradient(90deg, #F59E0B, #EF4444)" />
              <KPICard title="Deal Velocity" value={(stats.closedCount / Math.max(new Date().getMonth(), 1)).toFixed(1)} subtitle={`Deals per month · Avg ${stats.avgDOM} DOM`} gradient="linear-gradient(90deg, #EC4899, #8B5CF6)" />
            </div>
          )}

          <SectionHeader 
            title="Pipeline Overview" 
            badge={`${stats.pendingCount} active · ${stats.closedCount} closed`}
            gradient="linear-gradient(180deg, #F59E0B, #EF4444)" 
            sectionKey="dealsPipeline"
          />
          {!collapsedSections.dealsPipeline && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Active Deals</h4>
                {deals.filter(d => d.status !== 'Closed').map(deal => (
                  <div key={deal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                    <div><div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>{deal.property.split(',')[0]}</div><span style={{ padding: '2px 8px', borderRadius: '12px', background: getStatusColor(deal.status).bg, color: getStatusColor(deal.status).color, fontSize: '10px', fontWeight: '500' }}>{deal.status}</span></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(deal.listingPrice)}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>List Price</div></div>
                  </div>
                ))}
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Recent Closed</h4>
                {deals.filter(d => d.status === 'Closed').map(deal => (
                  <div key={deal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                    <div><div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>{deal.property.split(',')[0]}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>{deal.soldDate}</div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '13px', fontWeight: '600', color: theme.success }}>{formatCurrency(deal.netProfit)}</div><div style={{ fontSize: '11px', color: theme.textMuted }}>Net Profit</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SectionHeader 
            title="Tax Reserve Summary" 
            badge="For Novo Banking"
            badgeColor="#3B82F6"
            gradient="linear-gradient(180deg, #3B82F6, #8B5CF6)" 
            sectionKey="taxReserves"
          />
          {!collapsedSections.taxReserves && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <KPICard title="Commission Tax (46%)" value={formatCurrency(stats.commissionTaxReserve)} subtitle={`From ${formatCurrency(stats.totalCommissions)} earned`} gradient="linear-gradient(90deg, #8B5CF6, #A78BFA)" />
              <KPICard title="Profit Tax (31%)" value={formatCurrency(stats.profitTaxReserve)} subtitle={`From ${formatCurrency(stats.totalProfit)} profit`} gradient="linear-gradient(90deg, #10B981, #34D399)" />
              <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '13px', color: theme.warning, marginBottom: '8px', fontWeight: '600' }}>💡 Novo Auto-Transfer</div>
                <div style={{ fontSize: '13px', color: theme.textSecondary }}>Set up automatic transfers: <strong>46%</strong> of commissions and <strong>31%</strong> of profits to tax savings account.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEAL PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button style={{ padding: '10px 20px', background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>+ Add New Deal</button>
          </div>
          
          <SectionHeader 
            title="Pending Transactions" 
            badge={`${deals.filter(d => d.status !== 'Closed').length} deals`}
            gradient="linear-gradient(180deg, #F59E0B, #EF4444)" 
            sectionKey="pendingDeals"
          />
          {!collapsedSections.pendingDeals && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: theme.bgMain }}><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Property</th><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Status</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Purchase</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>List Price</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Renovation</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Est. Profit</th><th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>DOM</th></tr></thead>
                <tbody>{deals.filter(d => d.status !== 'Closed').map(deal => {
                  const statusStyle = getStatusColor(deal.status);
                  const estProfit = (deal.listingPrice || 0) - (deal.purchasePrice || 0) - (deal.closingCosts || 0) - (deal.renovationCosts || 0) - (deal.interestPaid || 0);
                  return (<tr key={deal.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}><td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{deal.property}</td><td style={{ padding: '16px 20px' }}><span style={{ padding: '4px 12px', borderRadius: '20px', background: statusStyle.bg, color: statusStyle.color, fontSize: '12px', fontWeight: '500' }}>{statusStyle.text}</span></td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.purchasePrice)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.listingPrice)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.danger }}>{formatCurrency(deal.renovationCosts)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: estProfit >= 0 ? theme.success : theme.danger }}>{formatCurrency(estProfit)}</td><td style={{ padding: '16px 20px', textAlign: 'center', fontSize: '14px', color: theme.textMuted }}>{deal.dom || '-'}</td></tr>);
                })}</tbody>
              </table>
            </div>
          )}
          
          <SectionHeader 
            title="Closed Deals" 
            badge={`${deals.filter(d => d.status === 'Closed').length} deals`}
            gradient="linear-gradient(180deg, #10B981, #06B6D4)" 
            sectionKey="closedDeals"
          />
          {!collapsedSections.closedDeals && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: theme.bgMain }}><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Property</th><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Sold Date</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Purchase</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Sold</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Net Profit</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Michael</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Anthony</th></tr></thead>
                <tbody>{deals.filter(d => d.status === 'Closed').map(deal => (<tr key={deal.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}><td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{deal.property}</td><td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textSecondary }}>{deal.soldDate}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.purchasePrice)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.soldPrice)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.success }}>{formatCurrency(deal.netProfit)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: theme.primary }}>{formatCurrency(deal.michaelTakeHome)}</td><td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: theme.secondary }}>{formatCurrency(deal.anthonyTakeHome)}</td></tr>))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* REVENUE FORECAST TAB */}
      {activeTab === 'forecast' && (
        <div>
          <SectionHeader 
            title="Revenue Projections" 
            icon="📊"
            badge="Based on current pipeline"
            gradient="linear-gradient(180deg, #8B5CF6, #06B6D4)" 
            sectionKey="revenueProjections"
          />
          {!collapsedSections.revenueProjections && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <KPICard title="Q4 2025 Forecast" value={formatCurrency(stats.pipelineValue)} subtitle="From active pipeline" gradient="linear-gradient(90deg, #8B5CF6, #06B6D4)" />
              <KPICard title="Full Year Projection" value={formatCurrency(stats.projectedAnnualRevenue)} subtitle={`At current ${(stats.closedCount / Math.max(new Date().getMonth(), 1)).toFixed(1)} deals/mo`} gradient="linear-gradient(90deg, #10B981, #34D399)" trend="18%" trendUp={true} />
              <KPICard title="Avg Deal Size" value={formatCurrency(stats.totalRevenue / Math.max(stats.closedCount, 1))} subtitle={`${stats.closedCount} deals closed YTD`} gradient="linear-gradient(90deg, #F59E0B, #EF4444)" />
              <KPICard title="Profit Margin" value={`${((stats.totalProfit / stats.totalRevenue) * 100 || 0).toFixed(1)}%`} subtitle="On closed deals" gradient="linear-gradient(90deg, #EC4899, #8B5CF6)" trend="3%" trendUp={true} />
            </div>
          )}

          <SectionHeader 
            title="Monthly Breakdown" 
            icon="📅"
            gradient="linear-gradient(180deg, #10B981, #06B6D4)" 
            sectionKey="monthlyBreakdown"
          />
          {!collapsedSections.monthlyBreakdown && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: theme.bgMain }}><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Month</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Revenue</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Profit</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Commissions</th><th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Deals</th></tr></thead>
                <tbody>{MONTHLY_DATA.map((m, i) => (
                  <tr key={m.month} style={{ borderBottom: `1px solid ${theme.borderLight}`, opacity: i > new Date().getMonth() ? 0.5 : 1 }}>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{m.month} 2025</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: m.revenue > 0 ? theme.success : theme.textMuted }}>{formatCurrency(m.revenue)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: m.profit > 0 ? theme.success : theme.textMuted }}>{formatCurrency(m.profit)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.primary }}>{formatCurrency(m.commissions)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', fontSize: '14px', color: theme.textPrimary }}>{m.deals}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          <SectionHeader 
            title="Pipeline Potential" 
            icon="🎯"
            badge={`${stats.pendingCount} active deals`}
            gradient="linear-gradient(180deg, #F59E0B, #EF4444)" 
            sectionKey="pipelinePotential"
          />
          {!collapsedSections.pipelinePotential && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Expected Closings</h4>
                {deals.filter(d => d.status !== 'Closed').map(deal => {
                  const estProfit = (deal.listingPrice || 0) - (deal.purchasePrice || 0) - (deal.closingCosts || 0) - (deal.renovationCosts || 0);
                  return (
                    <div key={deal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>{deal.property.split(',')[0]}</div>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', background: getStatusColor(deal.status).bg, color: getStatusColor(deal.status).color, fontSize: '10px', fontWeight: '500' }}>{deal.status}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: theme.success }}>{formatCurrency(estProfit)}</div>
                        <div style={{ fontSize: '11px', color: theme.textMuted }}>Est. Profit</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Quarterly Goals</h4>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: theme.textMuted }}>Q4 Revenue Goal</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(stats.pipelineValue)} / $250,000</span>
                  </div>
                  <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((stats.pipelineValue / 250000) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', borderRadius: '4px' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: theme.textMuted }}>Q4 Deal Count Goal</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>{stats.pendingCount} / 5 deals</span>
                  </div>
                  <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((stats.pendingCount / 5) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #06B6D4)', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAX PLANNING TAB */}
      {activeTab === 'tax' && (
        <div>
          <SectionHeader 
            title="Tax Reserve Summary" 
            icon="💰"
            badge="Novo Banking Integration"
            badgeColor="#3B82F6"
            gradient="linear-gradient(180deg, #3B82F6, #8B5CF6)" 
            sectionKey="taxSummary"
          />
          {!collapsedSections.taxSummary && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <KPICard title="Total Tax Reserve" value={formatCurrency(stats.commissionTaxReserve + stats.profitTaxReserve)} subtitle="Combined reserves needed" gradient="linear-gradient(90deg, #EF4444, #F59E0B)" />
              <KPICard title="Commission Tax (46%)" value={formatCurrency(stats.commissionTaxReserve)} subtitle={`From ${formatCurrency(stats.totalCommissions)}`} gradient="linear-gradient(90deg, #8B5CF6, #A78BFA)" />
              <KPICard title="Profit Tax (31%)" value={formatCurrency(stats.profitTaxReserve)} subtitle={`From ${formatCurrency(stats.totalProfit)}`} gradient="linear-gradient(90deg, #10B981, #34D399)" />
              <KPICard title="Est. Quarterly Payment" value={formatCurrency((stats.commissionTaxReserve + stats.profitTaxReserve) / 4)} subtitle="Due quarterly" gradient="linear-gradient(90deg, #06B6D4, #3B82F6)" />
            </div>
          )}

          <SectionHeader 
            title="Quarterly Estimates" 
            icon="📆"
            gradient="linear-gradient(180deg, #F59E0B, #EF4444)" 
            sectionKey="quarterlyEstimates"
          />
          {!collapsedSections.quarterlyEstimates && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => {
                  const isPast = i < Math.floor(new Date().getMonth() / 3);
                  const isCurrent = i === Math.floor(new Date().getMonth() / 3);
                  const quarterAmount = (stats.commissionTaxReserve + stats.profitTaxReserve) / 4;
                  return (
                    <div key={q} style={{ 
                      padding: '20px', 
                      borderRadius: '12px', 
                      background: isCurrent ? (isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)') : 'transparent',
                      border: `1px solid ${isCurrent ? theme.primary : theme.borderLight}`,
                      opacity: isPast ? 0.5 : 1
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>{q} 2025</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: isCurrent ? theme.primary : theme.textPrimary }}>{formatCurrency(quarterAmount)}</div>
                      <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>
                        {isPast ? '✅ Paid' : isCurrent ? '⏰ Due Now' : `Due ${['Apr 15', 'Jun 15', 'Sep 15', 'Jan 15'][i]}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <SectionHeader 
            title="Tax Breakdown by Deal" 
            icon="🧾"
            badge={`${stats.closedCount} deals`}
            gradient="linear-gradient(180deg, #10B981, #06B6D4)" 
            sectionKey="taxByDeal"
          />
          {!collapsedSections.taxByDeal && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: theme.bgMain }}><th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Property</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Net Profit</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Commission</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Profit Tax (31%)</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Comm Tax (46%)</th><th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Total Reserve</th></tr></thead>
                <tbody>{deals.filter(d => d.status === 'Closed').map(deal => (
                  <tr key={deal.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{deal.property.split(',')[0]}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.success }}>{formatCurrency(deal.netProfit)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.primary }}>{formatCurrency(deal.ourCommission)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.warning }}>{formatCurrency((deal.netProfit || 0) * 0.31)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.warning }}>{formatCurrency((deal.ourCommission || 0) * 0.46)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.danger }}>{formatCurrency((deal.netProfit || 0) * 0.31 + (deal.ourCommission || 0) * 0.46)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          <SectionHeader 
            title="Novo Auto-Transfer Setup" 
            icon="🏦"
            badge="Recommended"
            badgeColor="#10B981"
            gradient="linear-gradient(180deg, #8B5CF6, #EC4899)" 
            sectionKey="novoSetup"
          />
          {!collapsedSections.novoSetup && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: theme.primary, marginBottom: '12px' }}>💼 Commission Auto-Transfer</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: theme.textPrimary, marginBottom: '8px' }}>46%</div>
                <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '16px' }}>Transfer this percentage of every commission payment to your tax reserve account automatically.</div>
                <button style={{ padding: '10px 20px', background: theme.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Configure in Novo</button>
              </div>
              <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: theme.success, marginBottom: '12px' }}>💰 Profit Auto-Transfer</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: theme.textPrimary, marginBottom: '8px' }}>31%</div>
                <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '16px' }}>Transfer this percentage of every profit disbursement to your tax reserve account automatically.</div>
                <button style={{ padding: '10px 20px', background: theme.success, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Configure in Novo</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEAL HISTORY TAB */}
      {activeTab === 'history' && (
        <div>
          <SectionHeader 
            title="Transaction Timeline" 
            icon="📅"
            badge={`${deals.length} total deals`}
            gradient="linear-gradient(180deg, #8B5CF6, #EC4899)" 
            sectionKey="timeline"
          />
          {!collapsedSections.timeline && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }} />
              {deals.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)).map((deal, idx) => (
                <div key={deal.id} style={{ display: 'flex', gap: '16px', padding: '20px 0', borderBottom: idx < deals.length - 1 ? `1px solid ${theme.borderLight}` : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: deal.status === 'Closed' ? 'linear-gradient(135deg, #10B981, #06B6D4)' : 'linear-gradient(135deg, #F59E0B, #EF4444)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      {deal.status === 'Closed' ? '✓' : idx + 1}
                    </div>
                    {idx < deals.length - 1 && <div style={{ width: '2px', flex: 1, background: theme.borderLight, marginTop: '8px' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary }}>{deal.property}</div>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', background: getStatusColor(deal.status).bg, color: getStatusColor(deal.status).color, fontSize: '11px', fontWeight: '500' }}>{deal.status}</span>
                      </div>
                      {deal.netProfit && <div style={{ fontSize: '16px', fontWeight: '700', color: theme.success }}>{formatCurrency(deal.netProfit)}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: theme.textMuted }}>
                      <span>📅 Purchased: {deal.purchaseDate}</span>
                      {deal.soldDate && <span>✅ Sold: {deal.soldDate}</span>}
                      {deal.dom && <span>⏱️ DOM: {deal.dom} days</span>}
                      {deal.agent && <span>👤 Agent: {deal.agent}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <SectionHeader 
            title="Anniversary Reminders" 
            icon="🎂"
            badge="Client follow-ups"
            gradient="linear-gradient(180deg, #EC4899, #F59E0B)" 
            sectionKey="anniversaries"
          />
          {!collapsedSections.anniversaries && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {deals.filter(d => d.status === 'Closed').map(deal => {
                const soldDate = new Date(deal.soldDate);
                const anniversary = new Date(soldDate);
                anniversary.setFullYear(anniversary.getFullYear() + 1);
                const daysUntil = Math.ceil((anniversary - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={deal.id} style={{ 
                    background: theme.bgCard, 
                    borderRadius: '16px', 
                    padding: '20px', 
                    border: `1px solid ${daysUntil <= 30 ? 'rgba(236, 72, 153, 0.3)' : theme.borderLight}`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {daysUntil <= 30 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #EC4899, #F59E0B)' }} />}
                    <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>{deal.property.split(',')[0]}</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, marginBottom: '4px' }}>
                      {anniversary.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '12px', color: daysUntil <= 30 ? '#EC4899' : theme.textMuted }}>
                      {daysUntil <= 0 ? '🎉 Anniversary passed!' : daysUntil <= 30 ? `⚡ ${daysUntil} days away` : `${daysUntil} days until anniversary`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <SectionHeader 
            title="Performance Trends" 
            icon="📈"
            gradient="linear-gradient(180deg, #10B981, #06B6D4)" 
            sectionKey="trends"
          />
          {!collapsedSections.trends && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '12px' }}>Avg Deal Size</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(stats.totalRevenue / Math.max(stats.closedCount, 1))}</div>
                  <MiniSparkline data={[45000, 58000, 72000, 59000, 85000]} color="#10B981" />
                </div>
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '12px' }}>Avg DOM</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{stats.avgDOM} days</div>
                  <MiniSparkline data={[85, 72, 65, 52, 45]} color="#8B5CF6" />
                </div>
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '12px' }}>Profit Margin</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{((stats.totalProfit / stats.totalRevenue) * 100 || 0).toFixed(1)}%</div>
                  <MiniSparkline data={[35, 42, 38, 45, 44]} color="#F59E0B" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FINANCIAL STATEMENTS TAB */}
      {activeTab === 'statements' && (
        <div>
          <SectionHeader 
            title="Profit & Loss Statement" 
            icon="📈"
            badge="YTD Summary"
            gradient="linear-gradient(180deg, #10B981, #06B6D4)" 
            sectionKey="pnl"
          />
          {!collapsedSections.pnl && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
              
              {/* Revenue Section */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                  <span style={{ fontSize: '14px', color: theme.textPrimary }}>Property Sales</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{formatCurrency(stats.totalRevenue)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                  <span style={{ fontSize: '14px', color: theme.textPrimary }}>Commission Income</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{formatCurrency(stats.totalCommissions)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', margin: '0 -24px', padding: '12px 24px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: theme.success }}>Total Revenue</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: theme.success }}>{formatCurrency(stats.totalRevenue + stats.totalCommissions)}</span>
                </div>
              </div>

              {/* Expenses Section */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cost of Goods Sold</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                  <span style={{ fontSize: '14px', color: theme.textPrimary }}>Property Acquisitions</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>({formatCurrency(deals.filter(d => d.status === 'Closed').reduce((s, d) => s + (d.purchasePrice || 0), 0))})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                  <span style={{ fontSize: '14px', color: theme.textPrimary }}>Renovation Costs</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>({formatCurrency(deals.reduce((s, d) => s + (d.renovationCosts || 0), 0))})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                  <span style={{ fontSize: '14px', color: theme.textPrimary }}>Interest Paid</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>({formatCurrency(deals.reduce((s, d) => s + (d.interestPaid || 0), 0))})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.borderLight}` }}>
                  <span style={{ fontSize: '14px', color: theme.textPrimary }}>Agent Commissions</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>({formatCurrency(deals.reduce((s, d) => s + (d.agentCommission || 0), 0))})</span>
                </div>
              </div>

              {/* Net Profit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', margin: '0 -24px', borderRadius: '0 0 16px 16px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: theme.primary }}>Net Profit</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: theme.primary }}>{formatCurrency(stats.totalProfit)}</span>
              </div>
            </div>
          )}

          <SectionHeader 
            title="Cash Flow Analysis" 
            icon="💵"
            gradient="linear-gradient(180deg, #8B5CF6, #EC4899)" 
            sectionKey="cashflow"
          />
          {!collapsedSections.cashflow && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Cash Inflows</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.success }}>{formatCurrency(stats.totalRevenue)}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>From property sales</div>
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Cash Outflows</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.danger }}>{formatCurrency(stats.totalRevenue - stats.totalProfit)}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>Acquisitions + expenses</div>
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)' }} />
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Net Cash Flow</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.primary }}>{formatCurrency(stats.totalProfit)}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>Available for distribution</div>
              </div>
            </div>
          )}

          <SectionHeader 
            title="Partner Distribution" 
            icon="👥"
            badge="50/50 Split"
            gradient="linear-gradient(180deg, #F59E0B, #EF4444)" 
            sectionKey="distribution"
          />
          {!collapsedSections.distribution && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: theme.primary, marginBottom: '12px' }}>Michael Kennedy</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: theme.textPrimary, marginBottom: '8px' }}>{formatCurrency(stats.michaelTotal)}</div>
                <div style={{ fontSize: '13px', color: theme.textMuted }}>50% of {formatCurrency(stats.totalProfit)} net profit</div>
              </div>
              <div style={{ background: isDark ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#EC4899', marginBottom: '12px' }}>Anthony Partner</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: theme.textPrimary, marginBottom: '8px' }}>{formatCurrency(stats.anthonyTotal)}</div>
                <div style={{ fontSize: '13px', color: theme.textMuted }}>50% of {formatCurrency(stats.totalProfit)} net profit</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BUDGET VS ACTUALS TAB */}
      {activeTab === 'budget' && (
        <div>
          <SectionHeader 
            title="Budget Overview" 
            icon="⚖️"
            badge="2025 Fiscal Year"
            gradient="linear-gradient(180deg, #8B5CF6, #06B6D4)" 
            sectionKey="budgetOverview"
          />
          {!collapsedSections.budgetOverview && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <KPICard 
                title="Total Budget" 
                value={formatCurrency(BUDGET_CATEGORIES.reduce((s, c) => s + c.budgeted, 0))} 
                subtitle="Annual allocation" 
                gradient="linear-gradient(90deg, #8B5CF6, #06B6D4)" 
              />
              <KPICard 
                title="Spent YTD" 
                value={formatCurrency(BUDGET_CATEGORIES.reduce((s, c) => s + c.actual, 0))} 
                subtitle={`${((BUDGET_CATEGORIES.reduce((s, c) => s + c.actual, 0) / BUDGET_CATEGORIES.reduce((s, c) => s + c.budgeted, 0)) * 100).toFixed(0)}% of budget`}
                gradient="linear-gradient(90deg, #F59E0B, #EF4444)" 
              />
              <KPICard 
                title="Remaining" 
                value={formatCurrency(BUDGET_CATEGORIES.reduce((s, c) => s + c.budgeted, 0) - BUDGET_CATEGORIES.reduce((s, c) => s + c.actual, 0))} 
                subtitle="Available to spend" 
                gradient="linear-gradient(90deg, #10B981, #34D399)" 
                trend="12%" 
                trendUp={true}
              />
              <KPICard 
                title="Variance" 
                value={`+${formatCurrency(BUDGET_CATEGORIES.reduce((s, c) => s + c.budgeted, 0) - BUDGET_CATEGORIES.reduce((s, c) => s + c.actual, 0))}`} 
                subtitle="Under budget" 
                gradient="linear-gradient(90deg, #EC4899, #8B5CF6)" 
              />
            </div>
          )}

          <SectionHeader 
            title="Category Breakdown" 
            icon="📊"
            gradient="linear-gradient(180deg, #10B981, #06B6D4)" 
            sectionKey="categoryBreakdown"
          />
          {!collapsedSections.categoryBreakdown && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
              {BUDGET_CATEGORIES.map((cat, idx) => {
                const percentage = (cat.actual / cat.budgeted) * 100;
                const isOverBudget = percentage > 100;
                return (
                  <div key={cat.category} style={{ padding: '16px 0', borderBottom: idx < BUDGET_CATEGORIES.length - 1 ? `1px solid ${theme.borderLight}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{cat.category}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: theme.textMuted }}>{formatCurrency(cat.actual)} / {formatCurrency(cat.budgeted)}</span>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: isOverBudget ? '#EF4444' : percentage > 80 ? '#F59E0B' : '#10B981',
                          background: isOverBudget ? 'rgba(239, 68, 68, 0.1)' : percentage > 80 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min(percentage, 100)}%`, 
                        height: '100%', 
                        background: isOverBudget ? 'linear-gradient(90deg, #EF4444, #F59E0B)' : percentage > 80 ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : 'linear-gradient(90deg, #10B981, #34D399)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <SectionHeader 
            title="Spending Trends" 
            icon="📈"
            gradient="linear-gradient(180deg, #F59E0B, #EF4444)" 
            sectionKey="spendingTrends"
          />
          {!collapsedSections.spendingTrends && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Monthly Spending</h4>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => {
                  const spent = [8500, 5200, 12000, 6800, 4300, 6800][idx];
                  const budget = 9916;
                  return (
                    <div key={month} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                      <span style={{ fontSize: '13px', color: theme.textMuted, width: '40px' }}>{month}</span>
                      <div style={{ flex: 1, height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${(spent / budget) * 100}%`, height: '100%', background: spent > budget ? '#EF4444' : '#10B981', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: theme.textPrimary, width: '60px', textAlign: 'right' }}>{formatCurrency(spent)}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Top Expense Categories</h4>
                {BUDGET_CATEGORIES.sort((a, b) => b.actual - a.actual).slice(0, 5).map((cat, idx) => (
                  <div key={cat.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < 4 ? `1px solid ${theme.borderLight}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                      <span style={{ fontSize: '13px', color: theme.textPrimary }}>{cat.category}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(cat.actual)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
