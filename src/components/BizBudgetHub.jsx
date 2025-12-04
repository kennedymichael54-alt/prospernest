import React, { useState, useMemo } from 'react';

// ============================================================================
// BIZBUDGET HUB - HomeVestors Franchise Business Management
// ============================================================================
// Access: Owner, Admin, Tester, and HomeVestors team members
// Features: Deal Pipeline, Revenue Forecast, Tax Planning, Deal History, 
//           Financial Statements, Budget vs Actuals
// ============================================================================

// Sample demo data for HomeVestors deals
const DEMO_DEALS = [
  {
    id: 1,
    property: '2908 Urban Avenue, Columbus, GA 31907',
    status: 'Closed',
    purchaseDate: '2025-04-14',
    soldDate: '2025-08-25',
    purchasePrice: 69000,
    listingPrice: 99000,
    soldPrice: 95000,
    closingCosts: 0,
    buyCommission: 0,
    sellCommission: 5700,
    homevestorsFee: 0,
    recordingFees: 29.75,
    pestWork: 550,
    propertyTaxes: 820.88,
    interestRate: 0.125,
    interestPaid: 3727,
    renovationCosts: 0,
    netProfit: 15172.37,
    dom: 72,
    agent: 'Tucker Pate',
    agentCommissionPct: 0.03,
    agentCommission: 2850,
    ourCommissionPct: 0.03,
    ourCommission: 2850,
    royaltyFeePct: 0.04,
    kmTeamSplitPct: 0.82,
    michaelTakeHome: 9102.39,
    anthonyTakeHome: 9102.39,
  },
  {
    id: 2,
    property: '1114 Brooks Road, Columbus, GA 31903',
    status: 'Closed',
    purchaseDate: '2025-02-10',
    soldDate: '2025-05-15',
    purchasePrice: 13500,
    listingPrice: 25000,
    soldPrice: 25000,
    closingCosts: 0,
    buyCommission: 0,
    sellCommission: 1500,
    homevestorsFee: 0,
    recordingFees: 0,
    pestWork: 0,
    propertyTaxes: 0,
    interestRate: 0,
    interestPaid: 0,
    renovationCosts: 0,
    netProfit: 10000,
    dom: 45,
    agent: null,
    agentCommissionPct: 0,
    agentCommission: 0,
    ourCommissionPct: 0,
    ourCommission: 0,
    royaltyFeePct: 0.04,
    kmTeamSplitPct: 0.82,
    michaelTakeHome: 5000,
    anthonyTakeHome: 5000,
  },
  {
    id: 3,
    property: '2214 Somerset Avenue, Columbus, GA 31903',
    status: 'Closed',
    purchaseDate: '2025-01-20',
    soldDate: '2025-04-10',
    purchasePrice: 0,
    listingPrice: 58000,
    soldPrice: 58000,
    closingCosts: 0,
    buyCommission: 0,
    sellCommission: 3480,
    homevestorsFee: 0,
    recordingFees: 0,
    pestWork: 0,
    propertyTaxes: 0,
    interestRate: 0,
    interestPaid: 0,
    renovationCosts: 0,
    netProfit: 54520,
    dom: 35,
    agent: null,
    agentCommissionPct: 0,
    agentCommission: 0,
    ourCommissionPct: 0.06,
    ourCommission: 3480,
    royaltyFeePct: 0.04,
    kmTeamSplitPct: 0.82,
    michaelTakeHome: 27260,
    anthonyTakeHome: 27260,
  },
  {
    id: 4,
    property: '4742 Marino Drive, Columbus, GA 31907',
    status: 'Under Contract',
    purchaseDate: '2025-11-01',
    soldDate: null,
    purchasePrice: 85000,
    listingPrice: 125000,
    soldPrice: null,
    closingCosts: 2500,
    buyCommission: 0,
    sellCommission: 0,
    homevestorsFee: 500,
    recordingFees: 50,
    pestWork: 800,
    propertyTaxes: 1200,
    interestRate: 0.12,
    interestPaid: 0,
    renovationCosts: 15000,
    netProfit: null,
    dom: null,
    agent: 'Tucker Pate',
    agentCommissionPct: 0.03,
    agentCommission: 0,
    ourCommissionPct: 0.03,
    ourCommission: 0,
    royaltyFeePct: 0.04,
    kmTeamSplitPct: 0.82,
    michaelTakeHome: null,
    anthonyTakeHome: null,
  },
  {
    id: 5,
    property: '2936 Walker Road, Columbus, GA 31904',
    status: 'Listed',
    purchaseDate: '2025-09-15',
    soldDate: null,
    purchasePrice: 72000,
    listingPrice: 110000,
    soldPrice: null,
    closingCosts: 1800,
    buyCommission: 0,
    sellCommission: 0,
    homevestorsFee: 500,
    recordingFees: 45,
    pestWork: 600,
    propertyTaxes: 950,
    interestRate: 0.12,
    interestPaid: 2160,
    renovationCosts: 12000,
    netProfit: null,
    dom: 45,
    agent: null,
    agentCommissionPct: 0,
    agentCommission: 0,
    ourCommissionPct: 0.03,
    ourCommission: 0,
    royaltyFeePct: 0.04,
    kmTeamSplitPct: 0.82,
    michaelTakeHome: null,
    anthonyTakeHome: null,
  },
];

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatPercent = (value) => {
  if (value === null || value === undefined) return '-';
  return `${(value * 100).toFixed(1)}%`;
};

export default function BizBudgetHub({ theme, lastImportDate, userEmail, initialTab = 'pipeline' }) {
  const isDark = theme?.mode === 'dark';
  
  // Active tab state - use initialTab from URL if provided
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    pendingDeals: false,
    closedDeals: false,
    commissionForecast: false,
    franchiseRevenue: false,
    realtorTax: false,
    franchiseTax: false,
    dealHistory: false,
    pnl: false,
    balanceSheet: false,
    cashFlow: false,
    budgetComparison: false,
  });
  
  const [deals, setDeals] = useState(DEMO_DEALS);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  // Calculate stats
  const stats = useMemo(() => {
    const closedDeals = deals.filter(d => d.status === 'Closed');
    const pendingDeals = deals.filter(d => d.status !== 'Closed');
    const totalRevenue = closedDeals.reduce((sum, d) => sum + (d.soldPrice || 0), 0);
    const totalProfit = closedDeals.reduce((sum, d) => sum + (d.netProfit || 0), 0);
    const totalCommissions = closedDeals.reduce((sum, d) => sum + (d.ourCommission || 0), 0);
    const avgDOM = closedDeals.length > 0 
      ? closedDeals.reduce((sum, d) => sum + (d.dom || 0), 0) / closedDeals.length 
      : 0;
    const michaelTotal = closedDeals.reduce((sum, d) => sum + (d.michaelTakeHome || 0), 0);
    const anthonyTotal = closedDeals.reduce((sum, d) => sum + (d.anthonyTakeHome || 0), 0);
    
    // Pipeline value (potential profit from pending deals)
    const pipelineValue = pendingDeals.reduce((sum, d) => {
      const potentialSale = d.listingPrice || 0;
      const costs = (d.purchasePrice || 0) + (d.closingCosts || 0) + (d.renovationCosts || 0);
      return sum + Math.max(0, potentialSale - costs);
    }, 0);
    
    return {
      closedCount: closedDeals.length,
      pendingCount: pendingDeals.length,
      totalRevenue,
      totalProfit,
      totalCommissions,
      avgDOM: Math.round(avgDOM),
      michaelTotal,
      anthonyTotal,
      pipelineValue,
    };
  }, [deals]);
  
  // Tab configuration
  const tabs = [
    { id: 'pipeline', label: 'Deal Pipeline', icon: '🏠' },
    { id: 'forecast', label: 'Revenue Forecast', icon: '📊' },
    { id: 'tax', label: 'Tax Planning', icon: '💰' },
    { id: 'history', label: 'Deal History', icon: '📅' },
    { id: 'statements', label: 'Financial Statements', icon: '📈' },
    { id: 'budget', label: 'Budget vs Actuals', icon: '⚖️' },
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Closed': return { bg: '#D1FAE5', color: '#059669', text: 'Closed' };
      case 'Under Contract': return { bg: '#FEF3C7', color: '#D97706', text: 'Under Contract' };
      case 'Listed': return { bg: '#DBEAFE', color: '#2563EB', text: 'Listed' };
      case 'Purchased': return { bg: '#F3E5F5', color: '#7B1FA2', text: 'Purchased' };
      default: return { bg: '#F3F4F6', color: '#6B7280', text: status };
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, #8B5CF6, #EC4899)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '24px' }}>🏢</span>
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.5px' }}>
              BizBudget Hub
            </h1>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
              KM GA LLC - HomeVestors Franchise Management
            </p>
          </div>
        </div>
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

      {/* Stat Cards - Gradient style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Active Deals Card - Cyan */}
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
            }}>🏠</div>
            <span style={{ fontSize: '14px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Active Deals</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064' }}>{stats.pendingCount}</div>
          <div style={{ fontSize: '12px', color: isDark ? '#67E8F9' : '#00838F', marginTop: '4px' }}>
            Pipeline: {formatCurrency(stats.pipelineValue)}
          </div>
        </div>

        {/* Total Profit Card - Green */}
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
            <span style={{ fontSize: '14px', color: isDark ? '#86EFAC' : '#2E7D32', fontWeight: '600' }}>Total Profit</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E8F5E9' : '#1B5E20' }}>{formatCurrency(stats.totalProfit)}</div>
          <div style={{ fontSize: '12px', color: isDark ? '#86EFAC' : '#2E7D32', marginTop: '4px' }}>
            {stats.closedCount} closed deals YTD
          </div>
        </div>

        {/* Commissions Card - Purple */}
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
            }}>🤝</div>
            <span style={{ fontSize: '14px', color: isDark ? '#D8B4FE' : '#7B1FA2', fontWeight: '600' }}>Commissions</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#F3E5F5' : '#4A148C' }}>{formatCurrency(stats.totalCommissions)}</div>
          <div style={{ fontSize: '12px', color: isDark ? '#D8B4FE' : '#7B1FA2', marginTop: '4px' }}>
            Avg DOM: {stats.avgDOM} days
          </div>
        </div>

        {/* Partner Splits Card - Orange */}
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
            }}>👥</div>
            <span style={{ fontSize: '14px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '600' }}>Partner Splits</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C' }}>
            <div>M: {formatCurrency(stats.michaelTotal)}</div>
            <div style={{ marginTop: '2px' }}>A: {formatCurrency(stats.anthonyTotal)}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px', 
        flexWrap: 'wrap',
        background: theme.bgCard,
        padding: '8px',
        borderRadius: '12px',
        border: `1px solid ${theme.borderLight}`
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab.id ? theme.primary : 'transparent',
              color: activeTab === tab.id ? 'white' : theme.textSecondary,
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}

      {/* DEAL PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div>
          {/* Add Deal Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              onClick={() => setShowAddDealModal(true)}
              style={{
                padding: '10px 20px',
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              + Add New Deal
            </button>
          </div>

          {/* Pending Deals Section */}
          <div 
            onClick={() => toggleSection('pendingDeals')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.pendingDeals ? '24px' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #F59E0B 0%, #EF4444 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Pending Transactions
            </h2>
            <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>
              {deals.filter(d => d.status !== 'Closed').length} deals
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.pendingDeals ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.pendingDeals && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: theme.bgMain }}>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Property</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Status</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Purchase</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>List Price</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Renovation</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Est. Profit</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>DOM</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.filter(d => d.status !== 'Closed').map(deal => {
                    const statusStyle = getStatusColor(deal.status);
                    const estProfit = (deal.listingPrice || 0) - (deal.purchasePrice || 0) - (deal.closingCosts || 0) - (deal.renovationCosts || 0) - (deal.interestPaid || 0);
                    return (
                      <tr key={deal.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                        <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{deal.property}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '20px', background: statusStyle.bg, color: statusStyle.color, fontSize: '12px', fontWeight: '500' }}>
                            {statusStyle.text}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.purchasePrice)}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.listingPrice)}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.danger }}>{formatCurrency(deal.renovationCosts)}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: estProfit >= 0 ? theme.success : theme.danger }}>
                          {formatCurrency(estProfit)}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center', fontSize: '14px', color: theme.textMuted }}>{deal.dom || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Closed Deals Section */}
          <div 
            onClick={() => toggleSection('closedDeals')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.closedDeals ? '0' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #10B981 0%, #06B6D4 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Closed Deals
            </h2>
            <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>
              {deals.filter(d => d.status === 'Closed').length} deals
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.closedDeals ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.closedDeals && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: theme.bgMain }}>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Property</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Sold Date</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Purchase</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Sold</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Net Profit</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Michael</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Anthony</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.filter(d => d.status === 'Closed').map(deal => (
                    <tr key={deal.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{deal.property}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textSecondary }}>{deal.soldDate}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.purchasePrice)}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: theme.textPrimary }}>{formatCurrency(deal.soldPrice)}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.success }}>{formatCurrency(deal.netProfit)}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: theme.primary }}>{formatCurrency(deal.michaelTakeHome)}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: theme.secondary }}>{formatCurrency(deal.anthonyTakeHome)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* REVENUE FORECAST TAB */}
      {activeTab === 'forecast' && (
        <div>
          {/* Commission Forecast Section */}
          <div 
            onClick={() => toggleSection('commissionForecast')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.commissionForecast ? '24px' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Realtor Commission Forecast
            </h2>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.commissionForecast ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.commissionForecast && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>YTD Commissions Earned</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(stats.totalCommissions)}</div>
                </div>
                <div style={{ background: isDark ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>Pending Commissions</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>
                    {formatCurrency(deals.filter(d => d.status !== 'Closed').reduce((sum, d) => sum + ((d.listingPrice || 0) * (d.ourCommissionPct || 0.03)), 0))}
                  </div>
                </div>
                <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>Projected Annual</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: theme.success }}>
                    {formatCurrency((stats.totalCommissions / new Date().getMonth() || 1) * 12)}
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '12px' }}>Commission by Agent</h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, background: theme.bgMain, borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '13px', color: theme.textMuted }}>Tucker Pate</div>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: theme.textPrimary, marginTop: '4px' }}>
                    {formatCurrency(deals.filter(d => d.agent === 'Tucker Pate').reduce((sum, d) => sum + (d.agentCommission || 0), 0))}
                  </div>
                </div>
                <div style={{ flex: 1, background: theme.bgMain, borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '13px', color: theme.textMuted }}>KM Team Commission</div>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: theme.primary, marginTop: '4px' }}>
                    {formatCurrency(deals.reduce((sum, d) => sum + (d.ourCommission || 0) - (d.agentCommission || 0), 0))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Franchise Revenue Forecast Section */}
          <div 
            onClick={() => toggleSection('franchiseRevenue')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.franchiseRevenue ? '0' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #F59E0B 0%, #10B981 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Franchise Revenue Forecast
            </h2>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.franchiseRevenue ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.franchiseRevenue && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B 0%, #10B981 100%)' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>YTD Flip Revenue</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(stats.totalRevenue)}</div>
                </div>
                <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>YTD Net Profit</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.success }}>{formatCurrency(stats.totalProfit)}</div>
                </div>
                <div style={{ background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>Projected Annual Revenue</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.primary }}>
                    {formatCurrency((stats.totalRevenue / Math.max(new Date().getMonth(), 1)) * 12)}
                  </div>
                </div>
                <div style={{ background: isDark ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>Projected Annual Profit</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.secondary }}>
                    {formatCurrency((stats.totalProfit / Math.max(new Date().getMonth(), 1)) * 12)}
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
          {/* Realtor Tax Section */}
          <div 
            onClick={() => toggleSection('realtorTax')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.realtorTax ? '24px' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #3B82F6 0%, #8B5CF6 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Realtor Tax Breakdown
            </h2>
            <span style={{ fontSize: '12px', color: '#3B82F6', background: `${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`, padding: '4px 10px', borderRadius: '6px', fontWeight: '500' }}>
              For Novo Banking
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.realtorTax ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.realtorTax && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Commission Income Tax Reserves</h4>
                  <div style={{ background: theme.bgMain, borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: theme.textMuted }}>Total Commission Income</span>
                      <span style={{ fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(stats.totalCommissions)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: theme.textMuted }}>Federal Tax (25%)</span>
                      <span style={{ fontWeight: '600', color: theme.danger }}>{formatCurrency(stats.totalCommissions * 0.25)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: theme.textMuted }}>State Tax (5.75% GA)</span>
                      <span style={{ fontWeight: '600', color: theme.danger }}>{formatCurrency(stats.totalCommissions * 0.0575)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: theme.textMuted }}>Self-Employment (15.3%)</span>
                      <span style={{ fontWeight: '600', color: theme.danger }}>{formatCurrency(stats.totalCommissions * 0.153)}</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '12px', marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: theme.textPrimary }}>Total Tax Reserve (46%)</span>
                        <span style={{ fontWeight: '700', color: theme.warning }}>{formatCurrency(stats.totalCommissions * 0.46)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', padding: '12px', background: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <div style={{ fontSize: '12px', color: theme.warning, fontWeight: '600' }}>💡 Novo Auto-Transfer Recommendation</div>
                    <div style={{ fontSize: '13px', color: theme.textSecondary, marginTop: '4px' }}>
                      Set up 46% automatic transfer to tax savings on each commission deposit
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Quarterly Estimated Payments</h4>
                  <div style={{ background: theme.bgMain, borderRadius: '12px', padding: '16px' }}>
                    {['Q1 (Apr 15)', 'Q2 (Jun 15)', 'Q3 (Sep 15)', 'Q4 (Jan 15)'].map((quarter, i) => {
                      const quarterlyAmount = (stats.totalCommissions * 0.46) / 4;
                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 3 ? '12px' : '0', paddingBottom: i < 3 ? '12px' : '0', borderBottom: i < 3 ? `1px solid ${theme.borderLight}` : 'none' }}>
                          <span style={{ color: theme.textMuted }}>{quarter}</span>
                          <span style={{ fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(quarterlyAmount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Franchise Tax Section */}
          <div 
            onClick={() => toggleSection('franchiseTax')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.franchiseTax ? '0' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #10B981 0%, #06B6D4 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Franchise (Flip) Tax Breakdown
            </h2>
            <span style={{ fontSize: '12px', color: '#10B981', background: `${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'}`, padding: '4px 10px', borderRadius: '6px', fontWeight: '500' }}>
              KM GA LLC
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.franchiseTax ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.franchiseTax && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Flip Profit Tax Reserves</h4>
                  <div style={{ background: theme.bgMain, borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: theme.textMuted }}>Total Flip Profit</span>
                      <span style={{ fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(stats.totalProfit)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: theme.textMuted }}>HomeVestors Royalty (4%)</span>
                      <span style={{ fontWeight: '600', color: theme.danger }}>{formatCurrency(stats.totalProfit * 0.04)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: theme.textMuted }}>Federal Tax (21% Corp)</span>
                      <span style={{ fontWeight: '600', color: theme.danger }}>{formatCurrency(stats.totalProfit * 0.21)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: theme.textMuted }}>GA State Tax (5.75%)</span>
                      <span style={{ fontWeight: '600', color: theme.danger }}>{formatCurrency(stats.totalProfit * 0.0575)}</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '12px', marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: theme.textPrimary }}>Total Reserve (31%)</span>
                        <span style={{ fontWeight: '700', color: theme.warning }}>{formatCurrency(stats.totalProfit * 0.31)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textSecondary, marginBottom: '16px' }}>Per-Deal Tax Set-Aside</h4>
                  <div style={{ background: theme.bgMain, borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '16px' }}>
                      For each deal that closes, automatically transfer these percentages to tax savings:
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1, background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: theme.success }}>31%</div>
                        <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>of Net Profit</div>
                      </div>
                      <div style={{ flex: 1, background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: theme.primary }}>4%</div>
                        <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>Royalty Reserve</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEAL HISTORY TAB */}
      {activeTab === 'history' && (
        <div>
          <div 
            onClick={() => toggleSection('dealHistory')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.dealHistory ? '0' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #EC4899 0%, #F59E0B 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Transaction History & Anniversaries
            </h2>
            <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>
              {deals.length} total deals
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.dealHistory ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.dealHistory && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${theme.borderLight}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 100%)' }} />
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: theme.bgMain }}>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Property</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Purchase Date</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Sold Date</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Hold Time</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Anniversary</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map(deal => {
                    const purchaseDate = deal.purchaseDate ? new Date(deal.purchaseDate) : null;
                    const soldDate = deal.soldDate ? new Date(deal.soldDate) : null;
                    const holdDays = purchaseDate && soldDate ? Math.round((soldDate - purchaseDate) / (1000 * 60 * 60 * 24)) : null;
                    
                    // Check for upcoming anniversary (within 30 days)
                    let anniversaryStatus = null;
                    if (purchaseDate) {
                      const nextAnniversary = new Date(purchaseDate);
                      nextAnniversary.setFullYear(new Date().getFullYear());
                      if (nextAnniversary < new Date()) {
                        nextAnniversary.setFullYear(new Date().getFullYear() + 1);
                      }
                      const daysUntil = Math.round((nextAnniversary - new Date()) / (1000 * 60 * 60 * 24));
                      if (daysUntil <= 30 && daysUntil >= 0) {
                        anniversaryStatus = { date: nextAnniversary, daysUntil };
                      }
                    }
                    
                    return (
                      <tr key={deal.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                        <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{deal.property}</td>
                        <td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textSecondary }}>{deal.purchaseDate || '-'}</td>
                        <td style={{ padding: '16px 20px', fontSize: '14px', color: theme.textSecondary }}>{deal.soldDate || '-'}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'center', fontSize: '14px', color: theme.textMuted }}>
                          {holdDays !== null ? `${holdDays} days` : '-'}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          {anniversaryStatus ? (
                            <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#FEF3C7', color: '#D97706', fontSize: '12px', fontWeight: '500' }}>
                              🎂 {anniversaryStatus.daysUntil === 0 ? 'Today!' : `In ${anniversaryStatus.daysUntil} days`}
                            </span>
                          ) : (
                            <span style={{ color: theme.textMuted }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: deal.netProfit ? theme.success : theme.textMuted }}>
                          {formatCurrency(deal.netProfit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* FINANCIAL STATEMENTS TAB */}
      {activeTab === 'statements' && (
        <div>
          {/* P&L Section */}
          <div 
            onClick={() => toggleSection('pnl')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.pnl ? '24px' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #10B981 0%, #3B82F6 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Profit & Loss Statement
            </h2>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.pnl ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.pnl && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', marginBottom: '32px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)' }} />
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {/* Revenue */}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.success, marginBottom: '12px' }}>REVENUE</h4>
                  <div style={{ background: theme.bgMain, borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: theme.textMuted }}>Property Sales</span>
                      <span style={{ fontWeight: '500', color: theme.textPrimary }}>{formatCurrency(stats.totalRevenue)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: theme.textMuted }}>Commission Income</span>
                      <span style={{ fontWeight: '500', color: theme.textPrimary }}>{formatCurrency(stats.totalCommissions)}</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600', color: theme.textPrimary }}>Total Revenue</span>
                      <span style={{ fontWeight: '700', color: theme.success }}>{formatCurrency(stats.totalRevenue + stats.totalCommissions)}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.danger, marginBottom: '12px' }}>EXPENSES</h4>
                  <div style={{ background: theme.bgMain, borderRadius: '10px', padding: '16px' }}>
                    {(() => {
                      const closedDeals = deals.filter(d => d.status === 'Closed');
                      const totalPurchases = closedDeals.reduce((sum, d) => sum + (d.purchasePrice || 0), 0);
                      const totalRenovations = closedDeals.reduce((sum, d) => sum + (d.renovationCosts || 0), 0);
                      const totalClosingCosts = closedDeals.reduce((sum, d) => sum + (d.closingCosts || 0), 0);
                      const totalCommissionsPaid = closedDeals.reduce((sum, d) => sum + (d.sellCommission || 0) + (d.buyCommission || 0), 0);
                      const totalInterest = closedDeals.reduce((sum, d) => sum + (d.interestPaid || 0), 0);
                      const totalExpenses = totalPurchases + totalRenovations + totalClosingCosts + totalCommissionsPaid + totalInterest;
                      
                      return (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: theme.textMuted }}>Property Purchases</span>
                            <span style={{ fontWeight: '500', color: theme.textPrimary }}>{formatCurrency(totalPurchases)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: theme.textMuted }}>Renovations</span>
                            <span style={{ fontWeight: '500', color: theme.textPrimary }}>{formatCurrency(totalRenovations)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: theme.textMuted }}>Closing Costs</span>
                            <span style={{ fontWeight: '500', color: theme.textPrimary }}>{formatCurrency(totalClosingCosts)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: theme.textMuted }}>Commissions Paid</span>
                            <span style={{ fontWeight: '500', color: theme.textPrimary }}>{formatCurrency(totalCommissionsPaid)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: theme.textMuted }}>Interest Expense</span>
                            <span style={{ fontWeight: '500', color: theme.textPrimary }}>{formatCurrency(totalInterest)}</span>
                          </div>
                          <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: '600', color: theme.textPrimary }}>Total Expenses</span>
                            <span style={{ fontWeight: '700', color: theme.danger }}>{formatCurrency(totalExpenses)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Net Income */}
                <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', padding: '20px', border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary }}>NET INCOME</span>
                    <span style={{ fontSize: '28px', fontWeight: '700', color: theme.success }}>{formatCurrency(stats.totalProfit)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cash Flow Section */}
          <div 
            onClick={() => toggleSection('cashFlow')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.cashFlow ? '0' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Cash Flow Statement
            </h2>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.cashFlow ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.cashFlow && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ background: theme.bgMain, borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Cash Inflows</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.success }}>{formatCurrency(stats.totalRevenue)}</div>
                  <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>From property sales</div>
                </div>
                <div style={{ background: theme.bgMain, borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Cash Outflows</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.danger }}>
                    {formatCurrency(stats.totalRevenue - stats.totalProfit)}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>Operating expenses</div>
                </div>
                <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', padding: '20px', border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}` }}>
                  <div style={{ fontSize: '13px', color: theme.success, marginBottom: '8px' }}>Net Cash Flow</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: theme.success }}>{formatCurrency(stats.totalProfit)}</div>
                  <div style={{ fontSize: '12px', color: theme.success, marginTop: '4px' }}>Available for distribution</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BUDGET VS ACTUALS TAB */}
      {activeTab === 'budget' && (
        <div>
          <div 
            onClick={() => toggleSection('budgetComparison')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              marginBottom: collapsedSections.budgetComparison ? '0' : '16px',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{ width: '4px', height: '24px', background: 'linear-gradient(180deg, #F59E0B 0%, #EF4444 100%)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Budget vs Actuals
            </h2>
            <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>
              YTD {new Date().getFullYear()}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: theme.textMuted, transition: 'transform 0.2s', transform: collapsedSections.budgetComparison ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
          </div>

          {!collapsedSections.budgetComparison && (
            <div style={{ background: theme.bgCard, borderRadius: '16px', padding: '24px', border: `1px solid ${theme.borderLight}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' }} />
              
              {(() => {
                // Sample budget targets
                const budgets = {
                  deals: { target: 12, actual: stats.closedCount, label: 'Deals Closed' },
                  revenue: { target: 500000, actual: stats.totalRevenue, label: 'Total Revenue' },
                  profit: { target: 150000, actual: stats.totalProfit, label: 'Net Profit' },
                  commissions: { target: 50000, actual: stats.totalCommissions, label: 'Commission Income' },
                };
                
                return (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {Object.entries(budgets).map(([key, { target, actual, label }]) => {
                      const percentage = target > 0 ? (actual / target) * 100 : 0;
                      const isAhead = actual >= target * (new Date().getMonth() / 12);
                      const isCurrency = key !== 'deals';
                      
                      return (
                        <div key={key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '14px', color: theme.textMuted }}>
                                Target: {isCurrency ? formatCurrency(target) : target}
                              </span>
                              <span style={{ fontSize: '14px', fontWeight: '600', color: isAhead ? theme.success : theme.warning }}>
                                Actual: {isCurrency ? formatCurrency(actual) : actual}
                              </span>
                              <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '6px', 
                                fontSize: '12px', 
                                fontWeight: '600',
                                background: isAhead ? '#D1FAE5' : '#FEF3C7',
                                color: isAhead ? '#059669' : '#D97706'
                              }}>
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <div style={{ height: '8px', background: theme.borderLight, borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${Math.min(percentage, 100)}%`,
                              background: isAhead 
                                ? 'linear-gradient(90deg, #10B981, #06B6D4)' 
                                : 'linear-gradient(90deg, #F59E0B, #EF4444)',
                              borderRadius: '4px',
                              transition: 'width 0.5s ease'
                            }} />
                          </div>
                          {/* Progress marker for expected at this point in year */}
                          <div style={{ position: 'relative', height: '20px' }}>
                            <div style={{
                              position: 'absolute',
                              left: `${(new Date().getMonth() / 12) * 100}%`,
                              transform: 'translateX(-50%)',
                              fontSize: '10px',
                              color: theme.textMuted
                            }}>
                              ▲ Expected
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
