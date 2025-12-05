import React, { useState, useMemo } from 'react';
import { CollapsibleSection, StatCard, ContentCard, EmptyState } from './CollapsibleComponents';

const STORAGE_KEY_PREFIX = 'pn_command_';

const formatCurrency = (amount) => {
  if (amount == null) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const PIPELINE_STAGES = [
  { id: 'lead', label: 'Lead', color: '#6B7280', icon: '🎯' },
  { id: 'consultation', label: 'Consultation', color: '#3B82F6', icon: '📞' },
  { id: 'showing', label: 'Showing', color: '#8B5CF6', icon: '🏠' },
  { id: 'offer', label: 'Offer', color: '#F59E0B', icon: '📝' },
  { id: 'under-contract', label: 'Under Contract', color: '#EC4899', icon: '✍️' },
  { id: 'closed', label: 'Closed', color: '#10B981', icon: '🎉' }
];

const TAX_DEDUCTIONS = [
  { icon: '🚗', name: 'Vehicle/Mileage', description: '67¢ per mile for 2024', rate: '67¢/mile' },
  { icon: '🏠', name: 'Home Office', description: 'Dedicated workspace deduction', rate: '$5/sq ft' },
  { icon: '📢', name: 'Marketing & Advertising', description: 'Ads, signs, flyers, websites', rate: '100%' },
  { icon: '💻', name: 'Software & Tools', description: 'CRM, MLS, transaction software', rate: '100%' },
  { icon: '📱', name: 'Phone & Internet', description: 'Business use percentage', rate: 'Business %' },
  { icon: '📚', name: 'Education & Licensing', description: 'CE courses, license renewals', rate: '100%' },
  { icon: '🎁', name: 'Client Gifts', description: 'Closing gifts, appreciation', rate: '$25/person' },
  { icon: '👔', name: 'Professional Dues', description: 'NAR, state/local associations', rate: '100%' }
];

const DEMO_LISTINGS = [
  { id: 1, address: '2908 Urban Avenue', city: 'Columbus', state: 'GA', zip: '31907', price: 325000, status: 'active', dom: 12, beds: 4, baths: 2.5, sqft: 2400, type: 'buyer', gci: 9750, stage: 'showing' },
  { id: 2, address: '1114 Brooks Road', city: 'Columbus', state: 'GA', zip: '31903', price: 189000, status: 'pending', dom: 28, beds: 3, baths: 2, sqft: 1650, type: 'seller', gci: 5670, stage: 'under-contract' },
  { id: 3, address: '4742 Marino Drive', city: 'Columbus', state: 'GA', zip: '31907', price: 275000, status: 'active', dom: 5, beds: 3, baths: 2, sqft: 1890, type: 'buyer', gci: 8250, stage: 'offer' },
  { id: 4, address: '2214 Somerset Avenue', city: 'Columbus', state: 'GA', zip: '31903', price: 425000, status: 'closed', dom: 45, beds: 5, baths: 3, sqft: 3200, type: 'seller', gci: 12750, stage: 'closed', closedDate: '2025-03-15' },
  { id: 5, address: '936 Walker Road', city: 'Columbus', state: 'GA', zip: '31904', price: 210000, status: 'active', dom: 18, beds: 3, baths: 2, sqft: 1720, type: 'seller', gci: 6300, stage: 'showing' }
];

const DEMO_EXPENSES = [
  { id: 1, date: '2025-03-01', category: 'Marketing', description: 'Facebook Ads - March', amount: 500, deductible: true },
  { id: 2, date: '2025-03-05', category: 'Vehicle', description: 'Gas & Maintenance', amount: 320, deductible: true },
  { id: 3, date: '2025-03-10', category: 'Software', description: 'CRM Subscription', amount: 99, deductible: true },
  { id: 4, date: '2025-03-12', category: 'Client Gift', description: 'Closing Gift - Somerset Ave', amount: 150, deductible: true },
  { id: 5, date: '2025-03-15', category: 'Education', description: 'CE Course - Ethics', amount: 75, deductible: true }
];

export default function RealEstateCommandCenter({ user, isDarkMode, theme: propTheme }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [listings, setListings] = useState(DEMO_LISTINGS);
  const [expenses, setExpenses] = useState(DEMO_EXPENSES);
  const [showAddListing, setShowAddListing] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const theme = propTheme || {
    textPrimary: isDarkMode ? '#F9FAFB' : '#111827',
    textSecondary: isDarkMode ? '#D1D5DB' : '#4B5563',
    textMuted: isDarkMode ? '#9CA3AF' : '#6B7280',
    bgMain: isDarkMode ? '#111827' : '#F9FAFB',
    bgCard: isDarkMode ? '#1F2937' : '#FFFFFF',
    borderLight: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    primary: '#8B5CF6',
    secondary: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  };

  const stats = useMemo(() => {
    const active = listings.filter(l => l.status === 'active');
    const pending = listings.filter(l => l.status === 'pending');
    const closed = listings.filter(l => l.status === 'closed');
    const totalGCI = closed.reduce((sum, l) => sum + (l.gci || 0), 0);
    const pipelineGCI = [...active, ...pending].reduce((sum, l) => sum + (l.gci || 0), 0);
    const avgDOM = active.length > 0 ? Math.round(active.reduce((sum, l) => sum + l.dom, 0) / active.length) : 0;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const deductibleExpenses = expenses.filter(e => e.deductible).reduce((sum, e) => sum + e.amount, 0);
    const buyerDeals = listings.filter(l => l.type === 'buyer').length;
    const sellerDeals = listings.filter(l => l.type === 'seller').length;
    
    return {
      activeCount: active.length,
      pendingCount: pending.length,
      closedCount: closed.length,
      totalGCI,
      pipelineGCI,
      avgDOM,
      totalExpenses,
      deductibleExpenses,
      buyerDeals,
      sellerDeals,
      avgPrice: listings.length > 0 ? listings.reduce((sum, l) => sum + l.price, 0) / listings.length : 0,
      listToSaleRatio: closed.length > 0 ? 0.97 : 0 // Demo value
    };
  }, [listings, expenses]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pipeline', label: 'Pipeline', icon: '🎯' },
    { id: 'commissions', label: 'Commissions', icon: '💰' },
    { id: 'expenses', label: 'Expenses', icon: '📝' },
    { id: 'crm', label: 'CRM', icon: '👥' },
    { id: 'tax', label: 'Tax Center', icon: '🏦' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: '#DBEAFE', color: '#2563EB', text: 'Active' };
      case 'pending': return { bg: '#FEF3C7', color: '#D97706', text: 'Pending' };
      case 'closed': return { bg: '#D1FAE5', color: '#059669', text: 'Closed' };
      default: return { bg: '#F3F4F6', color: '#6B7280', text: status };
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px' }}>🏡</span>
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, margin: 0, letterSpacing: '-0.5px' }}>Real Estate Command Center</h1>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Track listings, commissions, and grow your business</p>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: `1px solid ${theme.borderLight}`, paddingBottom: '16px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
              borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #10B981, #06B6D4)' : theme.bgCard,
              color: activeTab === tab.id ? 'white' : theme.textPrimary,
              fontSize: '14px', fontWeight: '500',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Active Listings" value={stats.activeCount} subtitle={`${stats.pendingCount} pending`} icon="🏠" colorScheme="cyan" isDarkMode={isDarkMode} />
        <StatCard title="YTD GCI" value={formatCurrency(stats.totalGCI)} subtitle={`Pipeline: ${formatCurrency(stats.pipelineGCI)}`} icon="💰" colorScheme="green" isDarkMode={isDarkMode} />
        <StatCard title="Avg DOM" value={`${stats.avgDOM} days`} subtitle={`${stats.closedCount} closed YTD`} icon="📅" colorScheme="purple" isDarkMode={isDarkMode} />
        <StatCard title="Expenses YTD" value={formatCurrency(stats.totalExpenses)} subtitle={`${formatCurrency(stats.deductibleExpenses)} deductible`} icon="📝" colorScheme="orange" isDarkMode={isDarkMode} />
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div>
          <CollapsibleSection title="Performance Overview" icon="📈" gradient="linear-gradient(180deg, #10B981, #06B6D4)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <ContentCard gradient="linear-gradient(90deg, #10B981, #34D399)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Buyer Deals</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{stats.buyerDeals}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>Active transactions</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #A78BFA)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Seller Deals</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{stats.sellerDeals}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>Active listings</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #F59E0B, #FBBF24)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Avg Sale Price</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(stats.avgPrice)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>Across all listings</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #3B82F6, #60A5FA)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>List-to-Sale Ratio</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{(stats.listToSaleRatio * 100).toFixed(1)}%</div>
                <div style={{ fontSize: '12px', color: theme.success }}>Above market avg</div>
              </ContentCard>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Pipeline at a Glance" icon="🎯" badge={`${listings.filter(l => l.status !== 'closed').length} active`} gradient="linear-gradient(180deg, #8B5CF6, #EC4899)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {PIPELINE_STAGES.map(stage => {
                const count = listings.filter(l => l.stage === stage.id).length;
                const value = listings.filter(l => l.stage === stage.id).reduce((sum, l) => sum + l.gci, 0);
                return (
                  <div key={stage.id} style={{ minWidth: '140px', padding: '16px', background: theme.bgCard, borderRadius: '12px', border: `1px solid ${theme.borderLight}`, borderTop: `3px solid ${stage.color}` }}>
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>{stage.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary, marginBottom: '4px' }}>{stage.label}</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: stage.color }}>{count}</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>{formatCurrency(value)} GCI</div>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Recent Activity" icon="🔔" gradient="linear-gradient(180deg, #F59E0B, #EF4444)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <ContentCard gradient="linear-gradient(90deg, #F59E0B, #EF4444)" isDarkMode={isDarkMode}>
              {listings.slice(0, 4).map((listing, i) => {
                const statusStyle = getStatusColor(listing.status);
                return (
                  <div key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 3 ? `1px solid ${theme.borderLight}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${statusStyle.color}20, ${statusStyle.color}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏠</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{listing.address}</div>
                        <div style={{ fontSize: '12px', color: theme.textMuted }}>{listing.city}, {listing.state} · {listing.beds}bd/{listing.baths}ba</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(listing.price)}</div>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', background: statusStyle.bg, color: statusStyle.color }}>{statusStyle.text}</span>
                    </div>
                  </div>
                );
              })}
            </ContentCard>
          </CollapsibleSection>
        </div>
      )}

      {/* PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={() => setShowAddListing(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #10B981, #06B6D4)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>+ Add Listing</button>
          </div>

          <CollapsibleSection title="Active Listings" icon="🏠" badge={`${stats.activeCount} active`} gradient="linear-gradient(180deg, #3B82F6, #06B6D4)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <ContentCard gradient="linear-gradient(90deg, #3B82F6, #06B6D4)" isDarkMode={isDarkMode} noPadding={true}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: theme.bgMain }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase' }}>Property</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Type</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Price</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>DOM</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Est. GCI</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.filter(l => l.status !== 'closed').map(listing => {
                    const statusStyle = getStatusColor(listing.status);
                    return (
                      <tr key={listing.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{listing.address}</div>
                          <div style={{ fontSize: '12px', color: theme.textMuted }}>{listing.city}, {listing.state} {listing.zip}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', background: statusStyle.bg, color: statusStyle.color }}>{statusStyle.text}</span></td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: theme.textSecondary, textTransform: 'capitalize' }}>{listing.type}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{formatCurrency(listing.price)}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', color: listing.dom > 30 ? theme.warning : theme.textSecondary }}>{listing.dom}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.success }}>{formatCurrency(listing.gci)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ContentCard>
          </CollapsibleSection>

          <CollapsibleSection title="Closed Transactions" icon="✅" badge={`${stats.closedCount} YTD`} gradient="linear-gradient(180deg, #10B981, #34D399)" isDarkMode={isDarkMode} defaultExpanded={false}>
            <ContentCard gradient="linear-gradient(90deg, #10B981, #34D399)" isDarkMode={isDarkMode}>
              {listings.filter(l => l.status === 'closed').length > 0 ? (
                listings.filter(l => l.status === 'closed').map(listing => (
                  <div key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: theme.bgMain, borderRadius: '10px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{listing.address}</div>
                      <div style={{ fontSize: '12px', color: theme.textMuted }}>Closed {listing.closedDate} · {listing.dom} DOM</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: theme.success }}>{formatCurrency(listing.gci)}</div>
                      <div style={{ fontSize: '11px', color: theme.textMuted }}>GCI Earned</div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon="🎉" title="No closed deals yet" description="Your closed transactions will appear here" isDarkMode={isDarkMode} />
              )}
            </ContentCard>
          </CollapsibleSection>
        </div>
      )}

      {/* COMMISSIONS TAB */}
      {activeTab === 'commissions' && (
        <div>
          <CollapsibleSection title="GCI Summary" icon="💰" gradient="linear-gradient(180deg, #10B981, #06B6D4)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <ContentCard gradient="linear-gradient(90deg, #10B981, #34D399)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>YTD GCI Earned</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(stats.totalGCI)}</div>
                <div style={{ fontSize: '12px', color: theme.success, marginTop: '4px' }}>↑ {stats.closedCount} transactions</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #F59E0B, #FBBF24)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Pipeline GCI</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(stats.pipelineGCI)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>{stats.activeCount + stats.pendingCount} pending deals</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #A78BFA)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Projected Annual</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency((stats.totalGCI / Math.max(new Date().getMonth(), 1)) * 12)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>Based on current pace</div>
              </ContentCard>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Commission Breakdown" icon="📊" gradient="linear-gradient(180deg, #8B5CF6, #EC4899)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #EC4899)" isDarkMode={isDarkMode}>
              {listings.filter(l => l.gci > 0).map((listing, i) => (
                <div key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < listings.length - 1 ? `1px solid ${theme.borderLight}` : 'none' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{listing.address}</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>{listing.type === 'buyer' ? 'Buyer Side' : 'Listing Side'} · {formatCurrency(listing.price)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: listing.status === 'closed' ? theme.success : theme.primary }}>{formatCurrency(listing.gci)}</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>{listing.status === 'closed' ? 'Earned' : 'Pending'}</div>
                  </div>
                </div>
              ))}
            </ContentCard>
          </CollapsibleSection>
        </div>
      )}

      {/* EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={() => setShowAddExpense(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>+ Add Expense</button>
          </div>

          <CollapsibleSection title="Expense Summary" icon="📊" gradient="linear-gradient(180deg, #F59E0B, #EF4444)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <StatCard title="Total Expenses" value={formatCurrency(stats.totalExpenses)} icon="💸" colorScheme="orange" isDarkMode={isDarkMode} />
              <StatCard title="Deductible" value={formatCurrency(stats.deductibleExpenses)} icon="✅" colorScheme="green" isDarkMode={isDarkMode} />
              <StatCard title="Tax Savings" value={formatCurrency(stats.deductibleExpenses * 0.32)} subtitle="Est. at 32%" icon="💰" colorScheme="purple" isDarkMode={isDarkMode} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Recent Expenses" icon="📝" badge={`${expenses.length} entries`} gradient="linear-gradient(180deg, #8B5CF6, #3B82F6)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #3B82F6)" isDarkMode={isDarkMode} noPadding={true}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: theme.bgMain }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Date</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Category</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Description</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Amount</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Deductible</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(expense => (
                    <tr key={expense.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: theme.textSecondary }}>{expense.date}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: theme.textPrimary }}>{expense.category}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: theme.textSecondary }}>{expense.description}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.danger }}>{formatCurrency(expense.amount)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>{expense.deductible ? <span style={{ color: theme.success }}>✓</span> : <span style={{ color: theme.textMuted }}>-</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ContentCard>
          </CollapsibleSection>
        </div>
      )}

      {/* CRM TAB */}
      {activeTab === 'crm' && (
        <div>
          <CollapsibleSection title="Client Overview" icon="👥" gradient="linear-gradient(180deg, #06B6D4, #3B82F6)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <StatCard title="Total Clients" value="24" icon="👥" colorScheme="cyan" isDarkMode={isDarkMode} />
              <StatCard title="Active Buyers" value="8" icon="🏠" colorScheme="blue" isDarkMode={isDarkMode} />
              <StatCard title="Active Sellers" value="5" icon="📋" colorScheme="purple" isDarkMode={isDarkMode} />
              <StatCard title="Past Clients" value="11" icon="⭐" colorScheme="green" isDarkMode={isDarkMode} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Recent Contacts" icon="📞" gradient="linear-gradient(180deg, #8B5CF6, #EC4899)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #EC4899)" isDarkMode={isDarkMode}>
              <EmptyState icon="👥" title="CRM Coming Soon" description="Track your clients, follow-ups, and referrals all in one place." isDarkMode={isDarkMode} />
            </ContentCard>
          </CollapsibleSection>
        </div>
      )}

      {/* TAX CENTER TAB */}
      {activeTab === 'tax' && (
        <div>
          <CollapsibleSection title="Tax Overview" icon="🏦" gradient="linear-gradient(180deg, #10B981, #06B6D4)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <ContentCard gradient="linear-gradient(90deg, #10B981, #34D399)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Gross Income YTD</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(stats.totalGCI)}</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #EF4444, #F87171)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Est. Tax Liability</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.danger }}>{formatCurrency(stats.totalGCI * 0.32)}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Self-employment + income</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #A78BFA)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Deductions</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.success }}>-{formatCurrency(stats.deductibleExpenses)}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Reduces taxable income</div>
              </ContentCard>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Deductible Expenses" icon="📝" badge="Track your write-offs" gradient="linear-gradient(180deg, #F59E0B, #EF4444)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <ContentCard gradient="linear-gradient(90deg, #F59E0B, #EF4444)" isDarkMode={isDarkMode}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {TAX_DEDUCTIONS.map((d, i) => (
                  <div key={i} style={{ padding: '16px', background: theme.bgMain, borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{d.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary, marginBottom: '4px' }}>{d.name}</div>
                    <div style={{ fontSize: '11px', color: theme.success }}>{d.rate}</div>
                  </div>
                ))}
              </div>
            </ContentCard>
          </CollapsibleSection>

          <CollapsibleSection title="Quarterly Estimates" icon="📅" gradient="linear-gradient(180deg, #3B82F6, #8B5CF6)" isDarkMode={isDarkMode} defaultExpanded={false}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { q: 'Q1', due: 'Apr 15', status: 'paid' },
                { q: 'Q2', due: 'Jun 16', status: 'paid' },
                { q: 'Q3', due: 'Sep 15', status: 'due' },
                { q: 'Q4', due: 'Jan 15', status: 'upcoming' }
              ].map((qt, i) => (
                <ContentCard key={i} gradient={qt.status === 'paid' ? 'linear-gradient(90deg, #10B981, #34D399)' : qt.status === 'due' ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : 'linear-gradient(90deg, #6B7280, #9CA3AF)'} isDarkMode={isDarkMode}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{qt.q} 2025</span>
                    <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600', background: qt.status === 'paid' ? '#D1FAE5' : qt.status === 'due' ? '#FEF3C7' : '#F3F4F6', color: qt.status === 'paid' ? '#059669' : qt.status === 'due' ? '#D97706' : '#6B7280' }}>{qt.status === 'paid' ? '✓ Paid' : qt.status === 'due' ? '⚠ Due' : 'Upcoming'}</span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(stats.totalGCI * 0.08)}</div>
                  <div style={{ fontSize: '11px', color: theme.textMuted }}>Due: {qt.due}</div>
                </ContentCard>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      )}
    </div>
  );
}
