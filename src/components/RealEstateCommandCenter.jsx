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

// Brokerage fee structure
const BROKERAGE_FEES = {
  royaltyPercent: 0.04,
  brokeragePercent: 0.18,
  techMarketingFee: 155
};

// Market average DOM for comparison
const MARKET_AVG_DOM = 45;

// Demo listings with expected close dates, agent type, and referral info
const DEMO_LISTINGS = [
  { id: 1, address: '2908 Urban Avenue', city: 'Columbus', state: 'GA', zip: '31907', price: 325000, status: 'active', dom: 12, beds: 4, baths: 2.5, sqft: 2400, type: 'buyer', gci: 9750, stage: 'showing', expectedCloseDate: '2025-12-20', agentType: 'personal', referralPercent: 0 },
  { id: 2, address: '1114 Brooks Road', city: 'Columbus', state: 'GA', zip: '31903', price: 189000, status: 'pending', dom: 28, beds: 3, baths: 2, sqft: 1650, type: 'seller', gci: 5670, stage: 'under-contract', expectedCloseDate: '2025-12-15', agentType: 'referral', referralPercent: 25 },
  { id: 3, address: '4742 Marino Drive', city: 'Columbus', state: 'GA', zip: '31907', price: 275000, status: 'active', dom: 5, beds: 3, baths: 2, sqft: 1890, type: 'buyer', gci: 8250, stage: 'offer', expectedCloseDate: '2026-01-15', agentType: 'personal', referralPercent: 0 },
  { id: 4, address: '2214 Somerset Avenue', city: 'Columbus', state: 'GA', zip: '31903', price: 425000, status: 'closed', dom: 45, beds: 5, baths: 3, sqft: 3200, type: 'seller', gci: 12750, stage: 'closed', closedDate: '2025-03-15', agentType: 'personal', referralPercent: 0 },
  { id: 5, address: '936 Walker Road', city: 'Columbus', state: 'GA', zip: '31904', price: 210000, status: 'active', dom: 18, beds: 3, baths: 2, sqft: 1720, type: 'seller', gci: 6300, stage: 'showing', expectedCloseDate: '2025-12-28', agentType: 'referral', referralPercent: 30 }
];

const DEMO_EXPENSES = [
  { id: 1, date: '2025-03-01', category: 'Marketing', description: 'Facebook Ads - March', amount: 500, deductible: true },
  { id: 2, date: '2025-03-05', category: 'Vehicle', description: 'Gas & Maintenance', amount: 320, deductible: true },
  { id: 3, date: '2025-03-10', category: 'Software', description: 'CRM Subscription', amount: 99, deductible: true },
  { id: 4, date: '2025-03-12', category: 'Client Gift', description: 'Closing Gift - Somerset Ave', amount: 150, deductible: true },
  { id: 5, date: '2025-03-15', category: 'Education', description: 'CE Course - Ethics', amount: 75, deductible: true }
];

// Demo CRM clients
const DEMO_CLIENTS = [
  { id: 1, name: 'John & Sarah Mitchell', email: 'mitchell@email.com', phone: '(706) 555-0101', type: 'buyer', status: 'active', lastContact: '2025-12-01' },
  { id: 2, name: 'Robert Williams', email: 'rwilliams@email.com', phone: '(706) 555-0102', type: 'seller', status: 'active', lastContact: '2025-12-03' },
  { id: 3, name: 'Maria Garcia', email: 'mgarcia@email.com', phone: '(706) 555-0103', type: 'buyer', status: 'active', lastContact: '2025-11-28' },
  { id: 4, name: 'David Thompson', email: 'dthompson@email.com', phone: '(706) 555-0104', type: 'seller', status: 'active', lastContact: '2025-12-02' },
  { id: 5, name: 'Jennifer Brown', email: 'jbrown@email.com', phone: '(706) 555-0105', type: 'buyer', status: 'active', lastContact: '2025-11-25' },
  { id: 6, name: 'Michael Davis', email: 'mdavis@email.com', phone: '(706) 555-0106', type: 'seller', status: 'active', lastContact: '2025-12-04' },
  { id: 7, name: 'Lisa Anderson', email: 'landerson@email.com', phone: '(706) 555-0107', type: 'buyer', status: 'active', lastContact: '2025-11-30' },
  { id: 8, name: 'James Wilson', email: 'jwilson@email.com', phone: '(706) 555-0108', type: 'buyer', status: 'active', lastContact: '2025-11-22' },
  { id: 9, name: 'Susan Martinez', email: 'smartinez@email.com', phone: '(706) 555-0109', type: 'seller', status: 'active', lastContact: '2025-12-01' },
  { id: 10, name: 'Christopher Lee', email: 'clee@email.com', phone: '(706) 555-0110', type: 'buyer', status: 'past', lastContact: '2025-09-15', closedDate: '2025-09-20' },
  { id: 11, name: 'Amanda Taylor', email: 'ataylor@email.com', phone: '(706) 555-0111', type: 'seller', status: 'past', lastContact: '2025-08-10', closedDate: '2025-08-25' },
  { id: 12, name: 'Daniel Harris', email: 'dharris@email.com', phone: '(706) 555-0112', type: 'buyer', status: 'past', lastContact: '2025-07-20', closedDate: '2025-08-01' },
  { id: 13, name: 'Michelle Clark', email: 'mclark@email.com', phone: '(706) 555-0113', type: 'seller', status: 'past', lastContact: '2025-06-15', closedDate: '2025-07-10' },
  { id: 14, name: 'Kevin Robinson', email: 'krobinson@email.com', phone: '(706) 555-0114', type: 'buyer', status: 'past', lastContact: '2025-05-20', closedDate: '2025-06-05' },
  { id: 15, name: 'Elizabeth White', email: 'ewhite@email.com', phone: '(706) 555-0115', type: 'seller', status: 'past', lastContact: '2025-04-10', closedDate: '2025-05-01' },
  { id: 16, name: 'Steven Hall', email: 'shall@email.com', phone: '(706) 555-0116', type: 'buyer', status: 'past', lastContact: '2025-03-15', closedDate: '2025-04-01' },
  { id: 17, name: 'Nancy Allen', email: 'nallen@email.com', phone: '(706) 555-0117', type: 'seller', status: 'past', lastContact: '2025-02-20', closedDate: '2025-03-10' },
  { id: 18, name: 'Mark Young', email: 'myoung@email.com', phone: '(706) 555-0118', type: 'buyer', status: 'past', lastContact: '2025-01-10', closedDate: '2025-02-01' },
  { id: 19, name: 'Patricia King', email: 'pking@email.com', phone: '(706) 555-0119', type: 'seller', status: 'past', lastContact: '2024-12-15', closedDate: '2025-01-05' },
  { id: 20, name: 'George Scott', email: 'gscott@email.com', phone: '(706) 555-0120', type: 'buyer', status: 'active', lastContact: '2025-12-04' },
  { id: 21, name: 'Barbara Green', email: 'bgreen@email.com', phone: '(706) 555-0121', type: 'seller', status: 'active', lastContact: '2025-12-03' },
  { id: 22, name: 'Richard Baker', email: 'rbaker@email.com', phone: '(706) 555-0122', type: 'buyer', status: 'past', lastContact: '2024-11-10', closedDate: '2024-12-01' },
  { id: 23, name: 'Sandra Adams', email: 'sadams@email.com', phone: '(706) 555-0123', type: 'seller', status: 'past', lastContact: '2024-10-15', closedDate: '2024-11-05' },
  { id: 24, name: 'Paul Nelson', email: 'pnelson@email.com', phone: '(706) 555-0124', type: 'buyer', status: 'active', lastContact: '2025-12-02' }
];

// Get available months/years from listings
const getAvailableFilters = (listings) => {
  const months = new Set();
  const years = new Set();
  
  listings.forEach(l => {
    const date = l.closedDate || l.expectedCloseDate;
    if (date) {
      const d = new Date(date);
      months.add(d.getMonth());
      years.add(d.getFullYear());
    }
  });
  
  return {
    months: Array.from(months).sort((a, b) => a - b),
    years: Array.from(years).sort((a, b) => a - b)
  };
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Client List Component
const ClientList = ({ clients, theme, emptyMessage }) => {
  if (clients.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: theme.textMuted }}>
        {emptyMessage || 'No clients found'}
      </div>
    );
  }
  
  return (
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {clients.map((client, i) => (
        <div 
          key={client.id} 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 16px', 
            borderBottom: i < clients.length - 1 ? `1px solid ${theme.borderLight}` : 'none',
            background: i % 2 === 0 ? 'transparent' : theme.bgMain + '40'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: client.type === 'buyer' ? 'linear-gradient(135deg, #3B82F6, #60A5FA)' : 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{client.name}</div>
              <div style={{ fontSize: '12px', color: theme.textMuted }}>{client.email}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: theme.textSecondary }}>{client.phone}</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>
              {client.closedDate ? `Closed ${client.closedDate}` : `Last contact: ${client.lastContact}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function RealEstateCommandCenter({ user, isDarkMode: isDarkModeProp, theme: propTheme, lastImportDate, userId, userEmail, profile, onUpdateProfile }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [listings, setListings] = useState(DEMO_LISTINGS);
  const [expenses, setExpenses] = useState(DEMO_EXPENSES);
  const [clients] = useState(DEMO_CLIENTS);
  const [showAddListing, setShowAddListing] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  // Filter state for dashboard and commissions
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  const isDarkMode = isDarkModeProp ?? (propTheme?.mode === 'dark');

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

  const filterOptions = useMemo(() => getAvailableFilters(listings), [listings]);
  
  const filteredListings = useMemo(() => {
    if (filterMonth === 'all' && filterYear === 'all') return listings;
    
    return listings.filter(l => {
      const date = l.closedDate || l.expectedCloseDate;
      if (!date) return true;
      const d = new Date(date);
      const monthMatch = filterMonth === 'all' || d.getMonth() === parseInt(filterMonth);
      const yearMatch = filterYear === 'all' || d.getFullYear() === parseInt(filterYear);
      return monthMatch && yearMatch;
    });
  }, [listings, filterMonth, filterYear]);

  const projectedCommissions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const getProjectedGCI = (daysAhead) => {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + daysAhead);
      
      return listings
        .filter(l => l.status !== 'closed' && l.expectedCloseDate)
        .filter(l => {
          const closeDate = new Date(l.expectedCloseDate);
          closeDate.setHours(0, 0, 0, 0);
          return closeDate >= today && closeDate <= targetDate;
        })
        .reduce((sum, l) => sum + (l.gci || 0), 0);
    };
    
    return {
      days15: getProjectedGCI(15),
      days30: getProjectedGCI(30),
      days60: getProjectedGCI(60),
      days90: getProjectedGCI(90)
    };
  }, [listings]);

  // CRM stats
  const crmStats = useMemo(() => {
    const activeBuyers = clients.filter(c => c.type === 'buyer' && c.status === 'active');
    const activeSellers = clients.filter(c => c.type === 'seller' && c.status === 'active');
    const pastClients = clients.filter(c => c.status === 'past');
    
    return {
      total: clients.length,
      activeBuyers,
      activeSellers,
      pastClients
    };
  }, [clients]);

  const stats = useMemo(() => {
    const active = filteredListings.filter(l => l.status === 'active');
    const pending = filteredListings.filter(l => l.status === 'pending');
    const closed = filteredListings.filter(l => l.status === 'closed');
    const totalGCI = closed.reduce((sum, l) => sum + (l.gci || 0), 0);
    const pipelineGCI = [...active, ...pending].reduce((sum, l) => sum + (l.gci || 0), 0);
    const avgDOM = active.length > 0 ? Math.round(active.reduce((sum, l) => sum + l.dom, 0) / active.length) : 0;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const deductibleExpenses = expenses.filter(e => e.deductible).reduce((sum, e) => sum + e.amount, 0);
    const buyerDeals = filteredListings.filter(l => l.type === 'buyer').length;
    const sellerDeals = filteredListings.filter(l => l.type === 'seller').length;
    
    const transactionCount = closed.length;
    const royaltyFee = totalGCI * BROKERAGE_FEES.royaltyPercent;
    const brokerageFee = totalGCI * BROKERAGE_FEES.brokeragePercent;
    const techFees = transactionCount * BROKERAGE_FEES.techMarketingFee;
    const takeHomeCommission = totalGCI - royaltyFee - brokerageFee - techFees;
    
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
      avgPrice: filteredListings.length > 0 ? filteredListings.reduce((sum, l) => sum + l.price, 0) / filteredListings.length : 0,
      listToSaleRatio: closed.length > 0 ? 0.97 : 0,
      royaltyFee,
      brokerageFee,
      techFees,
      takeHomeCommission,
      transactionCount
    };
  }, [filteredListings, expenses]);

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

  // Filter component for reuse
  const FilterBar = () => (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
      <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary }}>Filter by:</span>
      <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: `1px solid ${theme.borderLight}`,
          background: theme.bgCard,
          color: theme.textPrimary,
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        <option value="all">All Months</option>
        {filterOptions.months.map(m => (
          <option key={m} value={m}>{MONTH_NAMES[m]}</option>
        ))}
      </select>
      <select
        value={filterYear}
        onChange={(e) => setFilterYear(e.target.value)}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: `1px solid ${theme.borderLight}`,
          background: theme.bgCard,
          color: theme.textPrimary,
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        <option value="all">All Years</option>
        {filterOptions.years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      {(filterMonth !== 'all' || filterYear !== 'all') && (
        <button
          onClick={() => { setFilterMonth('all'); setFilterYear('all'); }}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            background: theme.danger + '20',
            color: theme.danger,
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );

  // YTD Overview Stat Cards - reusable component
  const YTDOverviewCards = () => (
    <>
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📈</span> YTD Overview
        </h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Active Listings" value={stats.activeCount} subtitle={`${stats.pendingCount} pending`} icon="🏠" colorScheme="cyan" isDarkMode={isDarkMode} />
        <StatCard title="YTD GCI" value={formatCurrency(stats.totalGCI)} subtitle={`Pipeline: ${formatCurrency(stats.pipelineGCI)}`} icon="💰" colorScheme="green" isDarkMode={isDarkMode} />
        <StatCard 
          title="Avg DOM" 
          value={`${stats.avgDOM} days`} 
          subtitle={`Market avg: ${MARKET_AVG_DOM} days`} 
          icon="📅" 
          colorScheme="purple" 
          isDarkMode={isDarkMode} 
        />
        <StatCard title="Expenses YTD" value={formatCurrency(stats.totalExpenses)} subtitle={`${formatCurrency(stats.deductibleExpenses)} deductible`} icon="📝" colorScheme="orange" isDarkMode={isDarkMode} />
      </div>
    </>
  );

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

      {/* YTD Overview Stat Cards - All tabs */}
      <YTDOverviewCards />

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div>
          <FilterBar />

          <CollapsibleSection title="Projected Commission" icon="📈" gradient="linear-gradient(180deg, #F59E0B, #EF4444)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <ContentCard gradient="linear-gradient(90deg, #10B981, #34D399)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Next 15 Days</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(projectedCommissions.days15)}</div>
                <div style={{ fontSize: '12px', color: theme.success }}>Expected closings</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #3B82F6, #60A5FA)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Next 30 Days</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(projectedCommissions.days30)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>Expected closings</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #A78BFA)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Next 60 Days</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(projectedCommissions.days60)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>Expected closings</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #EC4899, #F472B6)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Next 90 Days</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(projectedCommissions.days90)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>Expected closings</div>
              </ContentCard>
            </div>
          </CollapsibleSection>

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

          <CollapsibleSection title="Pipeline at a Glance" icon="🎯" badge={`${filteredListings.filter(l => l.status !== 'closed').length} active`} gradient="linear-gradient(180deg, #8B5CF6, #EC4899)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {PIPELINE_STAGES.map(stage => {
                const count = filteredListings.filter(l => l.stage === stage.id).length;
                const value = filteredListings.filter(l => l.stage === stage.id).reduce((sum, l) => sum + l.gci, 0);
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
            <ContentCard gradient="linear-gradient(90deg, #F59E0B, #EF4444)" isDarkMode={isDarkMode} noPadding={true}>
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
                  {filteredListings.slice(0, 5).map(listing => {
                    const statusStyle = getStatusColor(listing.status);
                    return (
                      <tr key={listing.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg, ${statusStyle.color}20, ${statusStyle.color}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏠</div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{listing.address}</div>
                              <div style={{ fontSize: '12px', color: theme.textMuted }}>{listing.city}, {listing.state} {listing.zip}</div>
                            </div>
                          </div>
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
        </div>
      )}

      {/* PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div>
          <FilterBar />
          
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
          <FilterBar />

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

          <CollapsibleSection title="Brokerage Summary" icon="🏢" gradient="linear-gradient(180deg, #3B82F6, #8B5CF6)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <ContentCard gradient="linear-gradient(90deg, #EF4444, #F87171)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Royalty Fee (4%)</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.danger }}>{formatCurrency(stats.royaltyFee)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>After: {formatCurrency(stats.totalGCI - stats.royaltyFee)}</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #F59E0B, #FBBF24)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Brokerage Fee (18%)</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.warning }}>{formatCurrency(stats.brokerageFee)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>After: {formatCurrency(stats.totalGCI - stats.brokerageFee)}</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #A78BFA)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Tech/Marketing Fee</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.primary }}>{formatCurrency(stats.techFees)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>${BROKERAGE_FEES.techMarketingFee} × {stats.transactionCount} txns</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #10B981, #34D399)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>Take Home Commission</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.success }}>{formatCurrency(stats.takeHomeCommission)}</div>
                <div style={{ fontSize: '12px', color: theme.success, marginTop: '4px' }}>After all fees</div>
              </ContentCard>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Projected GCI Summary" icon="📊" gradient="linear-gradient(180deg, #EC4899, #F472B6)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <ContentCard gradient="linear-gradient(90deg, #10B981, #34D399)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>15 Days Projected</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(projectedCommissions.days15)}</div>
                <div style={{ fontSize: '12px', color: theme.success, marginTop: '4px' }}>Expected closings</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #3B82F6, #60A5FA)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>30 Days Projected</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(projectedCommissions.days30)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>Expected closings</div>
              </ContentCard>
              <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #A78BFA)" isDarkMode={isDarkMode}>
                <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '8px' }}>60 Days Projected</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary }}>{formatCurrency(projectedCommissions.days60)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>Expected closings</div>
              </ContentCard>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Commission Breakdown" icon="📊" gradient="linear-gradient(180deg, #8B5CF6, #EC4899)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #EC4899)" isDarkMode={isDarkMode} noPadding={true}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: theme.bgMain }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase' }}>Property</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Side</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Agent</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Referral %</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Gross GCI</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Net GCI</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: theme.textMuted }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.filter(l => l.gci > 0).map(listing => {
                    const referralAmount = listing.gci * (listing.referralPercent / 100);
                    const netGCI = listing.gci - referralAmount;
                    return (
                      <tr key={listing.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>{listing.address}</div>
                          <div style={{ fontSize: '12px', color: theme.textMuted }}>{formatCurrency(listing.price)}</div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: theme.textSecondary }}>
                          {listing.type === 'buyer' ? 'Buyer Side' : 'Listing Side'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', background: listing.agentType === 'personal' ? '#D1FAE5' : '#FEF3C7', color: listing.agentType === 'personal' ? '#059669' : '#D97706' }}>
                            {listing.agentType === 'personal' ? 'Personal' : 'Referral'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', color: listing.referralPercent > 0 ? theme.warning : theme.textMuted }}>
                          {listing.referralPercent > 0 ? `${listing.referralPercent}%` : '-'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>
                          {formatCurrency(listing.gci)}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: theme.success }}>
                          {formatCurrency(netGCI)}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', background: listing.status === 'closed' ? '#D1FAE5' : '#E0E7FF', color: listing.status === 'closed' ? '#059669' : '#4F46E5' }}>
                            {listing.status === 'closed' ? 'Earned' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ContentCard>
          </CollapsibleSection>
        </div>
      )}

      {/* EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <div>
          <FilterBar />
          
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
          <FilterBar />
          
          <CollapsibleSection title="Client Overview" icon="👥" gradient="linear-gradient(180deg, #06B6D4, #3B82F6)" isDarkMode={isDarkMode} defaultExpanded={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <StatCard title="Total Clients" value={crmStats.total} icon="👥" colorScheme="cyan" isDarkMode={isDarkMode} />
              <StatCard title="Active Buyers" value={crmStats.activeBuyers.length} icon="🏠" colorScheme="blue" isDarkMode={isDarkMode} />
              <StatCard title="Active Sellers" value={crmStats.activeSellers.length} icon="📋" colorScheme="purple" isDarkMode={isDarkMode} />
              <StatCard title="Past Clients" value={crmStats.pastClients.length} icon="⭐" colorScheme="green" isDarkMode={isDarkMode} />
            </div>
          </CollapsibleSection>

          {/* Client Lists */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <CollapsibleSection title="All Clients" icon="👥" badge={`${crmStats.total} total`} gradient="linear-gradient(180deg, #06B6D4, #3B82F6)" isDarkMode={isDarkMode} defaultExpanded={true}>
              <ContentCard gradient="linear-gradient(90deg, #06B6D4, #3B82F6)" isDarkMode={isDarkMode} noPadding={true}>
                <ClientList clients={clients} theme={theme} emptyMessage="No clients yet" />
              </ContentCard>
            </CollapsibleSection>

            <CollapsibleSection title="Active Buyers" icon="🏠" badge={`${crmStats.activeBuyers.length} buyers`} gradient="linear-gradient(180deg, #3B82F6, #60A5FA)" isDarkMode={isDarkMode} defaultExpanded={true}>
              <ContentCard gradient="linear-gradient(90deg, #3B82F6, #60A5FA)" isDarkMode={isDarkMode} noPadding={true}>
                <ClientList clients={crmStats.activeBuyers} theme={theme} emptyMessage="No active buyers" />
              </ContentCard>
            </CollapsibleSection>

            <CollapsibleSection title="Active Sellers" icon="📋" badge={`${crmStats.activeSellers.length} sellers`} gradient="linear-gradient(180deg, #8B5CF6, #A78BFA)" isDarkMode={isDarkMode} defaultExpanded={true}>
              <ContentCard gradient="linear-gradient(90deg, #8B5CF6, #A78BFA)" isDarkMode={isDarkMode} noPadding={true}>
                <ClientList clients={crmStats.activeSellers} theme={theme} emptyMessage="No active sellers" />
              </ContentCard>
            </CollapsibleSection>

            <CollapsibleSection title="Past Clients" icon="⭐" badge={`${crmStats.pastClients.length} past`} gradient="linear-gradient(180deg, #10B981, #34D399)" isDarkMode={isDarkMode} defaultExpanded={true}>
              <ContentCard gradient="linear-gradient(90deg, #10B981, #34D399)" isDarkMode={isDarkMode} noPadding={true}>
                <ClientList clients={crmStats.pastClients} theme={theme} emptyMessage="No past clients" />
              </ContentCard>
            </CollapsibleSection>
          </div>
        </div>
      )}

      {/* TAX CENTER TAB */}
      {activeTab === 'tax' && (
        <div>
          <FilterBar />
          
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

          <CollapsibleSection title="Quarterly Estimates" icon="📅" gradient="linear-gradient(180deg, #3B82F6, #8B5CF6)" isDarkMode={isDarkMode} defaultExpanded={true}>
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
