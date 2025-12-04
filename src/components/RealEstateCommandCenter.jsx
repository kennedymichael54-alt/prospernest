import React, { useState, useEffect, useMemo } from 'react';

// ============================================================================
// REAL ESTATE COMMAND CENTER
// Specialized dashboard for Realtors / Real Estate Agents
// Industry-specific KPIs, GCI tracking, deal pipeline, and more
// ============================================================================

// Import CollapsibleSection for consistency
// import { CollapsibleSection } from './CollapsibleComponents';

// Inline CollapsibleSection for standalone use
const CollapsibleSection = ({ 
  title, 
  icon = null,
  badge = null,
  badgeColor = '#6366f1',
  defaultExpanded = true, 
  children, 
  isDarkMode = false,
  headerRight = null,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  return (
    <div style={{
      backgroundColor: isDarkMode ? '#16213e' : '#ffffff',
      borderRadius: '16px',
      marginBottom: '20px',
      boxShadow: isDarkMode 
        ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
        : '0 2px 8px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
    }}>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          cursor: 'pointer',
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
          borderBottom: isExpanded 
            ? `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` 
            : 'none',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: isDarkMode ? '#ffffff' : '#1e293b', 
            margin: 0 
          }}>{title}</h3>
          {badge && (
            <span style={{
              padding: '3px 10px',
              backgroundColor: `${badgeColor}20`,
              color: badgeColor,
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
            }}>{badge}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {headerRight}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.3s ease',
          }}>
            <span style={{ fontSize: '14px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>▼</span>
          </div>
        </div>
      </div>
      <div style={{
        maxHeight: isExpanded ? '5000px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s ease, opacity 0.3s ease',
      }}>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const RealEstateCommandCenter = ({ user, isDarkMode = false }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data state
  const [transactions, setTransactions] = useState([]);
  const [listings, setListings] = useState([]);
  const [clients, setClients] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Storage key
  const getStorageKey = (key) => `pn_realestate_${user?.id || user?.email || 'default'}_${key}`;
  
  // Load data
  useEffect(() => {
    const savedTransactions = localStorage.getItem(getStorageKey('transactions'));
    const savedListings = localStorage.getItem(getStorageKey('listings'));
    const savedClients = localStorage.getItem(getStorageKey('clients'));
    const savedExpenses = localStorage.getItem(getStorageKey('expenses'));
    
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedListings) setListings(JSON.parse(savedListings));
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, [user]);
  
  // Save data
  useEffect(() => {
    localStorage.setItem(getStorageKey('transactions'), JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    localStorage.setItem(getStorageKey('listings'), JSON.stringify(listings));
  }, [listings]);
  
  useEffect(() => {
    localStorage.setItem(getStorageKey('clients'), JSON.stringify(clients));
  }, [clients]);
  
  useEffect(() => {
    localStorage.setItem(getStorageKey('expenses'), JSON.stringify(expenses));
  }, [expenses]);

  // Calculate Real Estate KPIs
  const kpis = useMemo(() => {
    const closedTransactions = transactions.filter(t => t.status === 'Closed');
    const totalGCI = closedTransactions.reduce((sum, t) => sum + (parseFloat(t.commission) || 0), 0);
    const totalVolume = closedTransactions.reduce((sum, t) => sum + (parseFloat(t.salePrice) || 0), 0);
    const avgCommission = closedTransactions.length > 0 ? totalGCI / closedTransactions.length : 0;
    const avgSalePrice = closedTransactions.length > 0 ? totalVolume / closedTransactions.length : 0;
    
    const activeListings = listings.filter(l => l.status === 'Active').length;
    const pendingTransactions = transactions.filter(t => t.status === 'Under Contract').length;
    
    const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const netIncome = totalGCI - totalExpenses;
    
    // Calculate days on market
    const avgDOM = closedTransactions.length > 0 
      ? closedTransactions.reduce((sum, t) => sum + (parseInt(t.daysOnMarket) || 0), 0) / closedTransactions.length 
      : 0;
    
    // List to Sale ratio
    const listToSaleRatio = closedTransactions.length > 0 
      ? (closedTransactions.reduce((sum, t) => sum + ((parseFloat(t.salePrice) / parseFloat(t.listPrice)) || 0), 0) / closedTransactions.length) * 100
      : 0;
    
    return {
      totalGCI,
      totalVolume,
      avgCommission,
      avgSalePrice,
      activeListings,
      pendingTransactions,
      closedDeals: closedTransactions.length,
      totalExpenses,
      netIncome,
      avgDOM,
      listToSaleRatio,
      totalTransactions: transactions.length,
    };
  }, [transactions, listings, expenses]);

  // Tax estimates
  const taxEstimates = useMemo(() => {
    const selfEmploymentTax = kpis.netIncome * 0.153;
    const federalTax = kpis.netIncome * 0.22;
    const stateTax = kpis.netIncome * 0.05;
    const totalTax = selfEmploymentTax + federalTax + stateTax;
    const quarterlyPayment = totalTax / 4;
    
    return { selfEmploymentTax, federalTax, stateTax, totalTax, quarterlyPayment };
  }, [kpis]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Colors
  const bgColor = isDarkMode ? '#1a1a2e' : '#f8fafc';
  const cardBg = isDarkMode ? '#16213e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#1e293b';
  const mutedColor = isDarkMode ? '#94a3b8' : '#64748b';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  // Tabs
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'listings', label: 'Listings', icon: '🏠' },
    { id: 'transactions', label: 'Transactions', icon: '📋' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'expenses', label: 'Expenses', icon: '💳' },
    { id: 'tax', label: 'Tax Center', icon: '🏛️' },
  ];

  // KPI Card Component
  const KPICard = ({ title, value, subtitle, gradient, icon }) => (
    <div style={{
      background: gradient,
      borderRadius: '16px',
      padding: '20px',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <span style={{
        position: 'absolute',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '48px',
        opacity: 0.2,
      }}>{icon}</span>
      <div style={{
        fontSize: '12px',
        fontWeight: '500',
        opacity: 0.9,
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: '700' }}>{value}</div>
      {subtitle && (
        <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '4px' }}>{subtitle}</div>
      )}
    </div>
  );

  // Dashboard Tab
  const renderDashboard = () => (
    <>
      {/* Main KPIs */}
      <CollapsibleSection title="Key Performance Indicators" icon="📈" isDarkMode={isDarkMode}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <KPICard
            title="Gross Commission Income"
            value={formatCurrency(kpis.totalGCI)}
            subtitle="YTD"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            icon="💰"
          />
          <KPICard
            title="Sales Volume"
            value={formatCurrency(kpis.totalVolume)}
            subtitle={`${kpis.closedDeals} closed deals`}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            icon="📊"
          />
          <KPICard
            title="Active Listings"
            value={kpis.activeListings}
            subtitle="Currently on market"
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            icon="🏠"
          />
          <KPICard
            title="Pending"
            value={kpis.pendingTransactions}
            subtitle="Under contract"
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            icon="📝"
          />
        </div>
      </CollapsibleSection>

      {/* Performance Metrics */}
      <CollapsibleSection title="Performance Metrics" icon="🎯" isDarkMode={isDarkMode}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#22c55e' }}>
              {formatCurrency(kpis.avgCommission)}
            </div>
            <div style={{ fontSize: '13px', color: mutedColor, marginTop: '4px' }}>Avg Commission</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1' }}>
              {formatCurrency(kpis.avgSalePrice)}
            </div>
            <div style={{ fontSize: '13px', color: mutedColor, marginTop: '4px' }}>Avg Sale Price</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>
              {Math.round(kpis.avgDOM)} days
            </div>
            <div style={{ fontSize: '13px', color: mutedColor, marginTop: '4px' }}>Avg Days on Market</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: '12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#ec4899' }}>
              {kpis.listToSaleRatio.toFixed(1)}%
            </div>
            <div style={{ fontSize: '13px', color: mutedColor, marginTop: '4px' }}>List-to-Sale Ratio</div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Pipeline Overview */}
      <CollapsibleSection 
        title="Pipeline Overview" 
        icon="🎯" 
        badge={`${kpis.totalTransactions} total`}
        isDarkMode={isDarkMode}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {['Prospecting', 'Listed', 'Under Contract', 'Closed'].map((stage, idx) => {
            const count = transactions.filter(t => t.status === stage).length;
            const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];
            return (
              <div key={stage} style={{
                padding: '16px',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: '12px',
                textAlign: 'center',
                borderTop: `3px solid ${colors[idx]}`,
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: colors[idx] }}>{count}</div>
                <div style={{ fontSize: '12px', color: mutedColor }}>{stage}</div>
              </div>
            );
          })}
        </div>
        
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: mutedColor }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏡</div>
            <p>No transactions yet</p>
            <p style={{ fontSize: '13px' }}>Add your first transaction from the Transactions tab</p>
          </div>
        ) : (
          <div>
            {transactions.slice(0, 5).map((t, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                borderRadius: '10px',
                marginBottom: '8px',
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: textColor }}>{t.address}</div>
                  <div style={{ fontSize: '13px', color: mutedColor }}>{t.clientName} • {t.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: '#22c55e' }}>{formatCurrency(t.salePrice)}</div>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: t.status === 'Closed' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                    color: t.status === 'Closed' ? '#22c55e' : '#3b82f6',
                  }}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CollapsibleSection>

      {/* Financial Summary */}
      <CollapsibleSection title="Financial Summary" icon="💵" isDarkMode={isDarkMode}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            borderLeft: '4px solid #22c55e',
          }}>
            <div style={{ fontSize: '13px', color: mutedColor, marginBottom: '4px' }}>Total GCI</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>{formatCurrency(kpis.totalGCI)}</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            borderLeft: '4px solid #ef4444',
          }}>
            <div style={{ fontSize: '13px', color: mutedColor, marginBottom: '4px' }}>Total Expenses</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{formatCurrency(kpis.totalExpenses)}</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            borderLeft: '4px solid #6366f1',
          }}>
            <div style={{ fontSize: '13px', color: mutedColor, marginBottom: '4px' }}>Net Income</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#6366f1' }}>{formatCurrency(kpis.netIncome)}</div>
          </div>
        </div>
      </CollapsibleSection>
    </>
  );

  // Listings Tab
  const renderListings = () => (
    <>
      <CollapsibleSection 
        title="Active Listings" 
        icon="🏠" 
        badge={`${listings.filter(l => l.status === 'Active').length} active`}
        isDarkMode={isDarkMode}
        headerRight={
          <button
            onClick={(e) => { e.stopPropagation(); setModalType('listing'); setShowAddModal(true); }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            + Add Listing
          </button>
        }
      >
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: mutedColor }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏘️</div>
            <p>No listings yet</p>
            <p style={{ fontSize: '13px' }}>Add your first listing to track your inventory</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {listings.map((listing, idx) => (
              <div key={idx} style={{
                padding: '16px',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: textColor }}>{listing.address}</div>
                  <div style={{ fontSize: '13px', color: mutedColor, marginTop: '4px' }}>
                    {listing.beds} bed • {listing.baths} bath • {listing.sqft} sqft
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: '#22c55e' }}>{formatCurrency(listing.price)}</div>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: listing.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                    color: listing.status === 'Active' ? '#22c55e' : '#f59e0b',
                  }}>{listing.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Listing Statistics" icon="📊" defaultExpanded={false} isDarkMode={isDarkMode}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>
              {listings.filter(l => l.status === 'Active').length}
            </div>
            <div style={{ fontSize: '13px', color: mutedColor }}>Active</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b' }}>
              {listings.filter(l => l.status === 'Pending').length}
            </div>
            <div style={{ fontSize: '13px', color: mutedColor }}>Pending</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#6366f1' }}>
              {listings.filter(l => l.status === 'Sold').length}
            </div>
            <div style={{ fontSize: '13px', color: mutedColor }}>Sold</div>
          </div>
        </div>
      </CollapsibleSection>
    </>
  );

  // Transactions Tab
  const renderTransactions = () => (
    <CollapsibleSection 
      title="All Transactions" 
      icon="📋" 
      badge={`${transactions.length} total`}
      isDarkMode={isDarkMode}
      headerRight={
        <button
          onClick={(e) => { e.stopPropagation(); setModalType('transaction'); setShowAddModal(true); }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          + Add Transaction
        </button>
      }
    >
      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: mutedColor }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p>No transactions yet</p>
          <p style={{ fontSize: '13px' }}>Start tracking your deals</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Address', 'Client', 'Type', 'Price', 'Commission', 'Status'].map(header => (
                <th key={header} style={{
                  textAlign: 'left',
                  padding: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: mutedColor,
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${borderColor}`,
                }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={idx}>
                <td style={{ padding: '14px 12px', color: textColor, fontWeight: '500' }}>{t.address}</td>
                <td style={{ padding: '14px 12px', color: mutedColor }}>{t.clientName}</td>
                <td style={{ padding: '14px 12px', color: mutedColor }}>{t.type}</td>
                <td style={{ padding: '14px 12px', color: '#22c55e', fontWeight: '600' }}>{formatCurrency(t.salePrice)}</td>
                <td style={{ padding: '14px 12px', color: '#6366f1', fontWeight: '600' }}>{formatCurrency(t.commission)}</td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: t.status === 'Closed' ? 'rgba(34,197,94,0.1)' : 
                                    t.status === 'Under Contract' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                    color: t.status === 'Closed' ? '#22c55e' : 
                          t.status === 'Under Contract' ? '#3b82f6' : '#f59e0b',
                  }}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CollapsibleSection>
  );

  // Clients Tab
  const renderClients = () => (
    <CollapsibleSection 
      title="Client Database" 
      icon="👥" 
      badge={`${clients.length} clients`}
      isDarkMode={isDarkMode}
      headerRight={
        <button
          onClick={(e) => { e.stopPropagation(); setModalType('client'); setShowAddModal(true); }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          + Add Client
        </button>
      }
    >
      {clients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: mutedColor }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <p>No clients yet</p>
          <p style={{ fontSize: '13px' }}>Start building your client database</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {clients.map((client, idx) => (
            <div key={idx} style={{
              padding: '16px',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '600',
                }}>
                  {client.name?.charAt(0) || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: textColor }}>{client.name}</div>
                  <div style={{ fontSize: '13px', color: mutedColor }}>{client.email} • {client.phone}</div>
                </div>
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: 'rgba(99,102,241,0.1)',
                color: '#6366f1',
              }}>{client.type || 'Lead'}</span>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );

  // Expenses Tab
  const renderExpenses = () => (
    <CollapsibleSection 
      title="Business Expenses" 
      icon="💳" 
      isDarkMode={isDarkMode}
      headerRight={
        <button
          onClick={(e) => { e.stopPropagation(); setModalType('expense'); setShowAddModal(true); }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          + Add Expense
        </button>
      }
    >
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '12px',
        marginBottom: '20px',
        borderLeft: '4px solid #ef4444',
      }}>
        <div style={{ fontSize: '13px', color: mutedColor, marginBottom: '4px' }}>Total Expenses YTD</div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>{formatCurrency(kpis.totalExpenses)}</div>
      </div>
      
      {expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: mutedColor }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
          <p>No expenses recorded</p>
          <p style={{ fontSize: '13px' }}>Track your business expenses for tax deductions</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Description', 'Category', 'Amount', 'Date'].map(header => (
                <th key={header} style={{
                  textAlign: 'left',
                  padding: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: mutedColor,
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${borderColor}`,
                }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, idx) => (
              <tr key={idx}>
                <td style={{ padding: '14px 12px', color: textColor }}>{e.description}</td>
                <td style={{ padding: '14px 12px', color: mutedColor }}>{e.category}</td>
                <td style={{ padding: '14px 12px', color: '#ef4444', fontWeight: '600' }}>-{formatCurrency(e.amount)}</td>
                <td style={{ padding: '14px 12px', color: mutedColor }}>{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CollapsibleSection>
  );

  // Tax Center Tab
  const renderTaxCenter = () => (
    <>
      <CollapsibleSection title="Quarterly Tax Estimate" icon="📅" isDarkMode={isDarkMode}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: '#fff',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Estimated Quarterly Payment</div>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>{formatCurrency(taxEstimates.quarterlyPayment)}</div>
              <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '8px' }}>
                Based on {formatCurrency(kpis.netIncome)} net income
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>2025 Due Dates</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Q1: April 15 • Q2: June 16</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Q3: Sept 15 • Q4: Jan 15, 2026</div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Tax Breakdown" icon="📊" isDarkMode={isDarkMode}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: mutedColor, marginBottom: '4px' }}>Self-Employment Tax</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: textColor }}>{formatCurrency(taxEstimates.selfEmploymentTax)}</div>
            <div style={{ fontSize: '11px', color: mutedColor }}>15.3% of net income</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: mutedColor, marginBottom: '4px' }}>Federal Tax (Est.)</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: textColor }}>{formatCurrency(taxEstimates.federalTax)}</div>
            <div style={{ fontSize: '11px', color: mutedColor }}>~22% bracket</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: mutedColor, marginBottom: '4px' }}>State Tax (Est.)</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: textColor }}>{formatCurrency(taxEstimates.stateTax)}</div>
            <div style={{ fontSize: '11px', color: mutedColor }}>~5% average</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'rgba(99,102,241,0.1)', borderRadius: '12px', border: '2px solid #6366f1' }}>
            <div style={{ fontSize: '12px', color: '#6366f1', marginBottom: '4px' }}>Total Annual Tax</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#6366f1' }}>{formatCurrency(taxEstimates.totalTax)}</div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Real Estate Tax Deductions" icon="💡" defaultExpanded={false} isDarkMode={isDarkMode}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {[
            { name: 'Vehicle/Mileage', rate: '67¢/mile', desc: 'Showings, open houses, client meetings' },
            { name: 'Home Office', rate: '$5/sq ft', desc: 'Dedicated workspace deduction' },
            { name: 'Marketing & Ads', rate: '100%', desc: 'Signs, flyers, online advertising' },
            { name: 'MLS & Board Dues', rate: '100%', desc: 'MLS access, NAR, local board fees' },
            { name: 'Continuing Ed', rate: '100%', desc: 'License renewal, CE courses' },
            { name: 'Technology', rate: '100%', desc: 'CRM, e-sign, virtual tour software' },
            { name: 'Client Gifts', rate: '$25/person', desc: 'Closing gifts, holiday gifts' },
            { name: 'Professional Services', rate: '100%', desc: 'Accountant, attorney, coach fees' },
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '14px',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: '500', color: textColor }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: mutedColor }}>{item.desc}</div>
              </div>
              <span style={{
                padding: '4px 10px',
                backgroundColor: 'rgba(34,197,94,0.1)',
                color: '#22c55e',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
              }}>{item.rate}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </>
  );

  return (
    <div style={{
      padding: '24px',
      backgroundColor: bgColor,
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '4px',
        }}>
          <span style={{ fontSize: '28px' }}>⚡</span>
          <span style={{ fontSize: '28px', fontWeight: '700', color: textColor }}>Command Center</span>
          <span style={{
            padding: '4px 12px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            🏠 Real Estate Pro
          </span>
        </div>
        <p style={{ fontSize: '14px', color: mutedColor }}>
          Track your listings, transactions, GCI, and grow your real estate business
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        backgroundColor: cardBg,
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: activeTab === tab.id ? '#6366f1' : 'transparent',
              color: activeTab === tab.id ? '#fff' : mutedColor,
              transition: 'all 0.2s ease',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'listings' && renderListings()}
      {activeTab === 'transactions' && renderTransactions()}
      {activeTab === 'clients' && renderClients()}
      {activeTab === 'expenses' && renderExpenses()}
      {activeTab === 'tax' && renderTaxCenter()}
    </div>
  );
};

export default RealEstateCommandCenter;
