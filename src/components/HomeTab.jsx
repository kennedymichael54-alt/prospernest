import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// HOME TAB - Split Dashboard: Personal vs Side Hustle View (Full Width)
// ============================================================================

// Currency formatter helper
const formatCurrency = (amount, hideValue = false) => {
  if (hideValue) return '••••••';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Get today's date formatted
const getTodayFormatted = () => {
  return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

// Get last import date
const getLastImportDate = () => {
  try {
    const saved = localStorage.getItem('ff_last_import');
    if (saved) return new Date(saved).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    return 'Never';
  } catch { return 'Never'; }
};

// Side hustle detection keywords
const SIDE_HUSTLE_KEYWORDS = [
  'real estate', 'commission', 'freelance', 'consulting', 'hair stylist', 'salon',
  'uber', 'lyft', 'doordash', 'instacart', 'airbnb', 'etsy', 'ebay', 'amazon seller',
  'photography', 'design', 'tutoring', 'coaching', 'client', 'invoice', 'gig'
];

// Category emoji map
const categoryEmojiMap = {
  'Groceries': '🛒', 'Food': '🍔', 'Fast Food': '🍟', 'Restaurants': '🍽️',
  'Gas': '⛽', 'Auto & Transport': '🚗', 'Shopping': '🛍️', 'Entertainment': '🎬',
  'Transfer': '💸', 'Income': '💰', 'Hobbies': '🎮', 'Electronics & Software': '💻',
  'Doctor': '🏥', 'Pharmacy': '💊', 'Financial': '📊', 'Television': '📺',
  'Housing': '🏠', 'Utilities': '💡', 'Category Pending': '📦', 'Personal': '👤',
  'Education': '📚', 'Travel': '✈️', 'Fitness': '💪', 'Pets': '🐾'
};

// Inline MonthYearSelector - Compact centered version
function MonthYearSelector({ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  const months = [
    { num: 0, short: 'Jan' }, { num: 1, short: 'Feb' }, { num: 2, short: 'Mar' }, { num: 3, short: 'Apr' },
    { num: 4, short: 'May' }, { num: 5, short: 'Jun' }, { num: 6, short: 'Jul' }, { num: 7, short: 'Aug' },
    { num: 8, short: 'Sep' }, { num: 9, short: 'Oct' }, { num: 10, short: 'Nov' }, { num: 11, short: 'Dec' }
  ];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '700px', margin: '0 auto 20px auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Year Selection */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {years.map(year => (
            <button key={year} onClick={() => setSelectedYear(year)}
              style={{ padding: '8px 16px', background: selectedYear === year ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: selectedYear === year ? '600' : '400', cursor: 'pointer' }}>
              {year}
            </button>
          ))}
        </div>
        
        {/* Divider */}
        <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.2)' }} />
        
        {/* Month Selection */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setSelectedMonth(null)}
            style={{ padding: '8px 12px', background: selectedMonth === null ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>
            📅 All
          </button>
          {months.map(month => (
            <button key={month.num} onClick={() => setSelectedMonth(month.num)}
              style={{ padding: '8px 10px', background: selectedMonth === month.num ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', border: currentMonth === month.num && selectedYear === currentYear ? '2px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>
              {month.short}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(139, 92, 246, 0.15)', borderRadius: '8px', padding: '10px', textAlign: 'center', marginTop: '12px' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>📊 Viewing: </span>
        <span style={{ color: '#EC4899', fontWeight: '600', fontSize: '13px' }}>
          {selectedMonth !== null ? `${monthNames[selectedMonth]} ${selectedYear}` : `All of ${selectedYear}`}
        </span>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ icon, title, message, actionLabel, onAction }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center', background: 'rgba(30, 27, 56, 0.5)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.2)' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.8 }}>{icon}</div>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>{title}</h3>
      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '300px', lineHeight: 1.5, marginBottom: actionLabel ? '24px' : '0' }}>{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Cash Flow Projection Component
function CashFlowProjection({ personalBanks, sideHustleBanks, investments }) {
  // Load sales transactions for commission projections
  const salesTransactions = useMemo(() => {
    try {
      const saved = localStorage.getItem('ff_sales_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  }, []);

  // Calculate totals
  const totalCash = useMemo(() => {
    const personalTotal = personalBanks.reduce((sum, b) => sum + (b.balance || 0), 0);
    const businessTotal = sideHustleBanks.reduce((sum, b) => sum + (b.balance || 0), 0);
    return personalTotal + businessTotal;
  }, [personalBanks, sideHustleBanks]);

  const totalInvestments = useMemo(() => {
    return investments.reduce((sum, inv) => sum + parseFloat(inv.value || 0), 0);
  }, [investments]);

  // Calculate projected commissions based on closing dates
  const projectedIncome = useMemo(() => {
    const today = new Date();
    const day15 = new Date(today); day15.setDate(today.getDate() + 15);
    const day30 = new Date(today); day30.setDate(today.getDate() + 30);
    const day60 = new Date(today); day60.setDate(today.getDate() + 60);

    let income15 = 0, income30 = 0, income60 = 0;

    salesTransactions.forEach(tx => {
      if (tx.status === 'Under Contract' || tx.status === 'Active') {
        const closeDate = new Date(tx.closingDate);
        const commission = (parseFloat(tx.salesPrice) || 0) * (parseFloat(tx.commissionRate) || 3) / 100;
        const netCommission = commission - (parseFloat(tx.brokerageCommission) || 0);
        
        if (closeDate <= day15 && closeDate >= today) income15 += netCommission;
        if (closeDate <= day30 && closeDate >= today) income30 += netCommission;
        if (closeDate <= day60 && closeDate >= today) income60 += netCommission;
      }
    });

    return { day15: income15, day30: income30, day60: income60 };
  }, [salesTransactions]);

  // Format currency compactly
  const formatCompact = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const formatFull = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
  };

  return (
    <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.08))' }}>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>💰</span> Cash Flow Projection
        <span style={{ fontSize: '9px', background: 'linear-gradient(135deg, #10B981, #3B82F6)', padding: '2px 6px', borderRadius: '4px', color: 'white' }}>SMART</span>
      </div>

      {/* Current Cash Balance - Hero */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))', 
        borderRadius: '14px', 
        padding: '16px', 
        marginBottom: '12px',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative glow */}
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💵 Total Current Cash</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#10B981', letterSpacing: '-1px' }}>
            {formatFull(totalCash)}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
            All bank accounts combined
          </div>
        </div>
      </div>

      {/* Projected Cash Flow Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: '15 Day', amount: totalCash + projectedIncome.day15, incoming: projectedIncome.day15, color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' },
          { label: '30 Day', amount: totalCash + projectedIncome.day30, incoming: projectedIncome.day30, color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)' },
          { label: '60 Day', amount: totalCash + projectedIncome.day60, incoming: projectedIncome.day60, color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)' }
        ].map((proj, i) => (
          <div key={i} style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '12px', 
            textAlign: 'center',
            position: 'relative',
            border: `1px solid ${proj.color}33`,
            boxShadow: `0 0 20px ${proj.glow}, inset 0 0 20px ${proj.glow}`
          }}>
            {/* Ring effect */}
            <div style={{ 
              position: 'absolute', 
              inset: '2px', 
              borderRadius: '10px', 
              border: `2px solid ${proj.color}`,
              opacity: 0.3,
              pointerEvents: 'none'
            }} />
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontWeight: '600' }}>{proj.label} Forecast</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: proj.color, marginBottom: '2px' }}>
              {formatCompact(proj.amount)}
            </div>
            {proj.incoming > 0 && (
              <div style={{ fontSize: '9px', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                <span>▲</span> +{formatCompact(proj.incoming)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Investment Portfolio Value */}
      <div style={{ 
        background: 'rgba(139, 92, 246, 0.1)', 
        borderRadius: '10px', 
        padding: '12px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>📈 Portfolio Value</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#8B5CF6' }}>{formatFull(totalInvestments)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>💎 Net Worth</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#EC4899' }}>{formatFull(totalCash + totalInvestments)}</div>
        </div>
      </div>

      {/* Pending Commissions Count */}
      {salesTransactions.filter(tx => tx.status === 'Under Contract').length > 0 && (
        <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.3)', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#FBBF24' }}>
            📋 {salesTransactions.filter(tx => tx.status === 'Under Contract').length} deals under contract
          </span>
        </div>
      )}
    </div>
  );
}

// Full Width Dashboard Panel Component
function DashboardPanel({ title, icon, color, income, expenses, transactions, recentTransactions, categoryBreakdown }) {
  const [recentSort, setRecentSort] = useState('high');
  const [categorySort, setCategorySort] = useState('high');
  
  const netCashFlow = income - expenses;
  
  const sortedRecent = useMemo(() => {
    const sorted = [...recentTransactions];
    if (recentSort === 'high') {
      sorted.sort((a, b) => Math.abs(parseFloat(b.amount || b.Amount)) - Math.abs(parseFloat(a.amount || a.Amount)));
    } else {
      sorted.sort((a, b) => Math.abs(parseFloat(a.amount || a.Amount)) - Math.abs(parseFloat(b.amount || b.Amount)));
    }
    return sorted.slice(0, 6);
  }, [recentTransactions, recentSort]);

  const sortedCategories = useMemo(() => {
    const sorted = [...categoryBreakdown];
    if (categorySort === 'high') {
      sorted.sort((a, b) => b.amount - a.amount);
    } else {
      sorted.sort((a, b) => a.amount - b.amount);
    }
    return sorted.slice(0, 6);
  }, [categoryBreakdown, categorySort]);

  const getCategoryEmoji = (category) => categoryEmojiMap[category] || '📦';
  const maxCategoryAmount = sortedCategories.length > 0 ? Math.max(...sortedCategories.map(c => c.amount)) : 1;

  return (
    <div>
      {/* Header - Centered */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '14px', 
        marginBottom: '20px',
        padding: '16px 24px',
        background: `linear-gradient(135deg, ${color}25, ${color}10)`,
        borderRadius: '14px',
        border: `1px solid ${color}40`
      }}>
        <span style={{ fontSize: '32px' }}>{icon}</span>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'white' }}>{title}</h3>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>
            {transactions.length} transactions this period
          </p>
        </div>
      </div>

      {/* Stats Cards - Income, Expenses, Net */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💰</span> Income
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{formatCurrency(income)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💸</span> Expenses
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{formatCurrency(expenses)}</div>
        </div>
        <div style={{ background: netCashFlow >= 0 ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📊</span> Net Cash Flow
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}</div>
        </div>
      </div>

      {/* Recent Activity and Top Categories Side by Side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Recent Activity */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '18px' }}>💳</span>
            <span style={{ fontWeight: '600', fontSize: '15px' }}>Recent Activity</span>
            <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
              <button onClick={() => setRecentSort('high')}
                style={{ padding: '4px 8px', background: recentSort === 'high' ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
                ↓ High
              </button>
              <button onClick={() => setRecentSort('low')}
                style={{ padding: '4px 8px', background: recentSort === 'low' ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
                ↑ Low
              </button>
            </div>
          </div>
          {sortedRecent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>No transactions</div>
          ) : (
            sortedRecent.map((tx, i) => {
              const amount = parseFloat(tx.amount || tx.Amount);
              const category = tx.category || tx.Category || 'Uncategorized';
              const description = tx.description || tx.Description || 'Unknown';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '18px' }}>{getCategoryEmoji(category)}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: '500', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{description.length > 22 ? description.slice(0, 22) + '...' : description}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{category}</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: amount >= 0 ? '#10B981' : 'white', flexShrink: 0 }}>
                    {amount >= 0 ? '+' : '-'}{formatCurrency(Math.abs(amount))}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Top Categories */}
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '18px' }}>📊</span>
            <span style={{ fontWeight: '600', fontSize: '15px' }}>Top Spending Categories</span>
            <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
              <button onClick={() => setCategorySort('high')}
                style={{ padding: '4px 8px', background: categorySort === 'high' ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
                ↓ High
              </button>
              <button onClick={() => setCategorySort('low')}
                style={{ padding: '4px 8px', background: categorySort === 'low' ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
                ↑ Low
              </button>
            </div>
          </div>
          {sortedCategories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>No expense data</div>
          ) : (
            sortedCategories.map((cat, i) => {
              const percentage = maxCategoryAmount > 0 ? (cat.amount / maxCategoryAmount) * 100 : 0;
              return (
                <div key={cat.name} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span>{getCategoryEmoji(cat.name)} {cat.name.length > 16 ? cat.name.slice(0, 16) + '...' : cat.name}</span>
                    <span style={{ fontWeight: '600' }}>{formatCurrency(cat.amount)}</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomeTab({ transactions = [], bills = [], goals = [], onNavigateToImport }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // Load investment data from localStorage
  const investments = useMemo(() => {
    try {
      const saved = localStorage.getItem('ff_investments');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  }, []);

  // Load bank accounts from localStorage (or derive from transactions)
  const bankAccounts = useMemo(() => {
    try {
      const saved = localStorage.getItem('ff_bank_accounts');
      if (saved) return JSON.parse(saved);
      
      // Derive unique accounts from transactions if not explicitly saved
      const accounts = {};
      transactions.forEach(tx => {
        const account = tx.account || tx.Account || tx.accountName || 'Primary Account';
        if (!accounts[account]) {
          accounts[account] = { name: account, balance: 0, type: 'checking' };
        }
      });
      return Object.values(accounts);
    } catch { return []; }
  }, [transactions]);

  // Calculate total investment value
  const totalInvestments = useMemo(() => {
    return investments.reduce((sum, inv) => sum + parseFloat(inv.value || 0), 0);
  }, [investments]);

  // Group investments by institution
  const investmentsByInstitution = useMemo(() => {
    const grouped = {};
    investments.forEach(inv => {
      const inst = inv.institution || 'Other';
      if (!grouped[inst]) grouped[inst] = { total: 0, accounts: [] };
      grouped[inst].total += parseFloat(inv.value || 0);
      grouped[inst].accounts.push(inv);
    });
    return grouped;
  }, [investments]);

  // Get income type mappings from localStorage
  const incomeTypeMap = useMemo(() => {
    try {
      const saved = localStorage.getItem('ff_income_types');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  }, []);

  // Get side hustle name
  const sideHustleName = useMemo(() => {
    try {
      return localStorage.getItem('ff_sidehustle_name') || 'Side Hustle';
    } catch { return 'Side Hustle'; }
  }, []);

  // Extract vendor from description
  const extractVendor = (description) => {
    if (!description) return 'unknown';
    return description
      .replace(/^(IN \*|SQ \*|TST\*|PP\*|PAYPAL \*|VENMO\s+)/i, '')
      .replace(/\s+\d{2,}.*$/i, '')
      .trim()
      .toLowerCase()
      .slice(0, 25);
  };

  // Detect if transaction is side hustle
  const isSideHustle = (tx) => {
    const vendor = extractVendor(tx.description || tx.Description || '');
    
    // Check explicit mapping first
    if (incomeTypeMap[vendor] === 'sidehustle') return true;
    if (incomeTypeMap[vendor] === 'personal') return false;
    
    // Auto-detect based on keywords
    const description = (tx.description || tx.Description || '').toLowerCase();
    const category = (tx.category || tx.Category || '').toLowerCase();
    const combined = `${description} ${category} ${vendor}`;
    
    return SIDE_HUSTLE_KEYWORDS.some(keyword => combined.includes(keyword));
  };

  // Filter by date
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      if (selectedMonth === null) {
        return txDate.getFullYear() === selectedYear;
      }
      return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Split transactions by type
  const { personalTransactions, sideHustleTransactions } = useMemo(() => {
    const personal = [];
    const sideHustle = [];
    
    filteredTransactions.forEach(tx => {
      if (isSideHustle(tx)) {
        sideHustle.push(tx);
      } else {
        personal.push(tx);
      }
    });
    
    return { personalTransactions: personal, sideHustleTransactions: sideHustle };
  }, [filteredTransactions, incomeTypeMap]);

  // Calculate stats for personal
  const personalStats = useMemo(() => {
    const income = personalTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) > 0).reduce((sum, tx) => sum + parseFloat(tx.amount || tx.Amount), 0);
    const expenses = personalTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) < 0).reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
    
    const categories = {};
    personalTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) < 0).forEach(tx => {
      const cat = tx.category || tx.Category || 'Uncategorized';
      categories[cat] = (categories[cat] || 0) + Math.abs(parseFloat(tx.amount || tx.Amount));
    });
    
    return {
      income,
      expenses,
      categoryBreakdown: Object.entries(categories).map(([name, amount]) => ({ name, amount }))
    };
  }, [personalTransactions]);

  // Calculate stats for side hustle
  const sideHustleStats = useMemo(() => {
    const income = sideHustleTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) > 0).reduce((sum, tx) => sum + parseFloat(tx.amount || tx.Amount), 0);
    const expenses = sideHustleTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) < 0).reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
    
    const categories = {};
    sideHustleTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) < 0).forEach(tx => {
      const cat = tx.category || tx.Category || 'Uncategorized';
      categories[cat] = (categories[cat] || 0) + Math.abs(parseFloat(tx.amount || tx.Amount));
    });
    
    return {
      income,
      expenses,
      categoryBreakdown: Object.entries(categories).map(([name, amount]) => ({ name, amount }))
    };
  }, [sideHustleTransactions]);

  const hasData = transactions.length > 0;
  const hasFilteredData = filteredTransactions.length > 0;
  const hasSideHustleData = sideHustleTransactions.length > 0;

  // Selected bank accounts for display
  const [selectedPersonalBanks, setSelectedPersonalBanks] = useState(['all']);
  const [selectedSideHustleBanks, setSelectedSideHustleBanks] = useState(['all']);
  const [selectedInvestmentInstitutions, setSelectedInvestmentInstitutions] = useState(['all']);
  const [showBankSelector, setShowBankSelector] = useState(null); // 'personal', 'sidehustle', 'investments', or null

  // Sample bank accounts - in real app would come from imports
  const personalBanksList = [
    { id: 'usaa', name: 'USAA Checking', balance: personalStats.income - personalStats.expenses, color: '#10B981' },
    { id: 'navy', name: 'Navy Federal', balance: 2450.00, color: '#3B82F6' },
    { id: 'synovus', name: 'Synovus', balance: 1200.00, color: '#8B5CF6' }
  ];

  const sideHustleBanksList = [
    { id: 'business', name: 'Business Checking', balance: sideHustleStats.income - sideHustleStats.expenses, color: '#EC4899' },
    { id: 'savings', name: 'Business Savings', balance: 5000.00, color: '#F59E0B' }
  ];

  // Filter displayed banks based on selection
  const displayedPersonalBanks = selectedPersonalBanks.includes('all') ? personalBanksList : personalBanksList.filter(b => selectedPersonalBanks.includes(b.id));
  const displayedSideHustleBanks = selectedSideHustleBanks.includes('all') ? sideHustleBanksList : sideHustleBanksList.filter(b => selectedSideHustleBanks.includes(b.id));
  const displayedInvestments = selectedInvestmentInstitutions.includes('all') ? Object.entries(investmentsByInstitution) : Object.entries(investmentsByInstitution).filter(([inst]) => selectedInvestmentInstitutions.includes(inst));

  // Toggle bank selection
  const toggleBankSelection = (type, id) => {
    if (type === 'personal') {
      if (id === 'all') {
        setSelectedPersonalBanks(['all']);
      } else {
        const newSelection = selectedPersonalBanks.filter(b => b !== 'all');
        if (newSelection.includes(id)) {
          const filtered = newSelection.filter(b => b !== id);
          setSelectedPersonalBanks(filtered.length === 0 ? ['all'] : filtered);
        } else {
          setSelectedPersonalBanks([...newSelection, id]);
        }
      }
    } else if (type === 'sidehustle') {
      if (id === 'all') {
        setSelectedSideHustleBanks(['all']);
      } else {
        const newSelection = selectedSideHustleBanks.filter(b => b !== 'all');
        if (newSelection.includes(id)) {
          const filtered = newSelection.filter(b => b !== id);
          setSelectedSideHustleBanks(filtered.length === 0 ? ['all'] : filtered);
        } else {
          setSelectedSideHustleBanks([...newSelection, id]);
        }
      }
    } else if (type === 'investments') {
      if (id === 'all') {
        setSelectedInvestmentInstitutions(['all']);
      } else {
        const newSelection = selectedInvestmentInstitutions.filter(b => b !== 'all');
        if (newSelection.includes(id)) {
          const filtered = newSelection.filter(b => b !== id);
          setSelectedInvestmentInstitutions(filtered.length === 0 ? ['all'] : filtered);
        } else {
          setSelectedInvestmentInstitutions([...newSelection, id]);
        }
      }
    }
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* DATA DASHBOARD HEADER - Live/Current Data */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))',
        borderRadius: '16px',
        padding: '16px 24px',
        marginBottom: '20px',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px'
          }}>📊</div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'white' }}>Data Dashboard</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Real-time account balances as of {getTodayFormatted()}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Last Import</div>
          <div style={{ fontSize: '13px', color: '#10B981', fontWeight: '600' }}>{getLastImportDate()}</div>
        </div>
      </div>

      {/* Top Balances Bar - Cash Flow Projection | Personal Banks | Side Hustle Banks | Investments */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.4fr 2px 1fr 2px 1fr 2px 1fr', 
        gap: '0',
        background: 'rgba(30, 27, 56, 0.8)', 
        backdropFilter: 'blur(20px)', 
        borderRadius: '20px', 
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        {/* Cash Flow Projection Section */}
        <CashFlowProjection 
          personalBanks={displayedPersonalBanks}
          sideHustleBanks={displayedSideHustleBanks}
          investments={investments}
        />

        {/* Divider */}
        <div style={{ background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.6), rgba(59, 130, 246, 0.6))' }} />

        {/* Personal Bank Balances */}
        <div style={{ padding: '20px', position: 'relative', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.03))' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🏦</span> Personal Banking
              <span style={{ fontSize: '9px', background: 'rgba(16, 185, 129, 0.3)', padding: '2px 6px', borderRadius: '4px', color: '#10B981' }}>LIVE</span>
            </div>
            <button onClick={() => setShowBankSelector(showBankSelector === 'personal' ? null : 'personal')}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
              ⚙️ Select
            </button>
          </div>
          
          {/* Bank Selector Dropdown */}
          {showBankSelector === 'personal' && (
            <div style={{ position: 'absolute', top: '50px', right: '20px', background: 'rgba(30, 27, 56, 0.98)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px', zIndex: 100, minWidth: '180px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Select Accounts</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', fontSize: '12px' }}>
                <input type="checkbox" checked={selectedPersonalBanks.includes('all')} onChange={() => toggleBankSelection('personal', 'all')} />
                Show All
              </label>
              {personalBanksList.map(bank => (
                <label key={bank.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', fontSize: '12px' }}>
                  <input type="checkbox" checked={selectedPersonalBanks.includes('all') || selectedPersonalBanks.includes(bank.id)} onChange={() => toggleBankSelection('personal', bank.id)} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bank.color }} />
                  {bank.name}
                </label>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedPersonalBanks.map((bank, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bank.color }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{bank.name}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: bank.balance >= 0 ? '#10B981' : '#EF4444' }}>
                  {formatCurrency(bank.balance)}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '10px', padding: '10px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Total Balance</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>{formatCurrency(displayedPersonalBanks.reduce((sum, b) => sum + b.balance, 0))}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4))' }} />

        {/* Side Hustle Bank Balances */}
        <div style={{ padding: '20px', position: 'relative', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(236, 72, 153, 0.03))' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>👤</span> {sideHustleName} Banking
              <span style={{ fontSize: '9px', background: 'rgba(236, 72, 153, 0.3)', padding: '2px 6px', borderRadius: '4px', color: '#EC4899' }}>LIVE</span>
            </div>
            <button onClick={() => setShowBankSelector(showBankSelector === 'sidehustle' ? null : 'sidehustle')}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
              ⚙️ Select
            </button>
          </div>
          
          {/* Bank Selector Dropdown */}
          {showBankSelector === 'sidehustle' && (
            <div style={{ position: 'absolute', top: '50px', right: '20px', background: 'rgba(30, 27, 56, 0.98)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px', zIndex: 100, minWidth: '180px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Select Accounts</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', fontSize: '12px' }}>
                <input type="checkbox" checked={selectedSideHustleBanks.includes('all')} onChange={() => toggleBankSelection('sidehustle', 'all')} />
                Show All
              </label>
              {sideHustleBanksList.map(bank => (
                <label key={bank.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', fontSize: '12px' }}>
                  <input type="checkbox" checked={selectedSideHustleBanks.includes('all') || selectedSideHustleBanks.includes(bank.id)} onChange={() => toggleBankSelection('sidehustle', bank.id)} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bank.color }} />
                  {bank.name}
                </label>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedSideHustleBanks.map((bank, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bank.color }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{bank.name}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: bank.balance >= 0 ? '#10B981' : '#EF4444' }}>
                  {formatCurrency(bank.balance)}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '10px', padding: '10px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05))', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Total Balance</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#EC4899' }}>{formatCurrency(displayedSideHustleBanks.reduce((sum, b) => sum + b.balance, 0))}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4))' }} />

        {/* Investment Balances */}
        <div style={{ padding: '20px', position: 'relative', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.03))' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📈</span> Investments
              <span style={{ fontSize: '9px', background: 'rgba(139, 92, 246, 0.3)', padding: '2px 6px', borderRadius: '4px', color: '#8B5CF6' }}>LIVE</span>
            </div>
            {investments.length > 0 && (
              <button onClick={() => setShowBankSelector(showBankSelector === 'investments' ? null : 'investments')}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
                ⚙️ Select
              </button>
            )}
          </div>
          
          {/* Investment Selector Dropdown */}
          {showBankSelector === 'investments' && investments.length > 0 && (
            <div style={{ position: 'absolute', top: '50px', right: '20px', background: 'rgba(30, 27, 56, 0.98)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px', zIndex: 100, minWidth: '180px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Select Institutions</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', fontSize: '12px' }}>
                <input type="checkbox" checked={selectedInvestmentInstitutions.includes('all')} onChange={() => toggleBankSelection('investments', 'all')} />
                Show All
              </label>
              {Object.keys(investmentsByInstitution).map((inst, i) => (
                <label key={inst} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', fontSize: '12px' }}>
                  <input type="checkbox" checked={selectedInvestmentInstitutions.includes('all') || selectedInvestmentInstitutions.includes(inst)} onChange={() => toggleBankSelection('investments', inst)} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ['#8B5CF6', '#3B82F6', '#10B981'][i % 3] }} />
                  {inst}
                </label>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {investments.length > 0 ? (
              displayedInvestments.slice(0, 3).map(([inst, data], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ['#8B5CF6', '#3B82F6', '#10B981'][i % 3] }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{inst}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#10B981' }}>
                    {formatCurrency(data.total)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                No investments imported
              </div>
            )}
          </div>
          <div style={{ marginTop: '10px', padding: '10px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Total Portfolio</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#8B5CF6' }}>{formatCurrency(displayedInvestments.reduce((sum, [_, data]) => sum + data.total, 0))}</div>
          </div>
        </div>
      </div>

      {/* CUSTOM DATA DASHBOARD HEADER - Period-Filtered Data */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))',
        borderRadius: '16px',
        padding: '16px 24px',
        marginBottom: '16px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px'
          }}>📈</div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'white' }}>Custom Data Dashboard</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Filtered by Period Selection: <span style={{ color: '#EC4899', fontWeight: '600' }}>
                {selectedMonth !== null ? `${fullMonthNames[selectedMonth]} ${selectedYear}` : `All of ${selectedYear}`}
              </span>
            </p>
          </div>
        </div>
        <div style={{ 
          padding: '8px 16px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '8px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.8)'
        }}>
          {filteredTransactions.length} transactions
        </div>
      </div>

      {/* Period Selector - Now under Custom Dashboard Header */}
      <div style={{ 
        background: 'rgba(30, 27, 56, 0.8)', 
        backdropFilter: 'blur(20px)', 
        borderRadius: '16px', 
        padding: '16px 24px', 
        marginBottom: '20px', 
        border: '1px solid rgba(139, 92, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Year Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>📅</span>
          {[selectedYear - 1, selectedYear, selectedYear + 1].map(year => (
            <button key={year} onClick={() => setSelectedYear(year)}
              style={{ 
                padding: '8px 14px', 
                background: selectedYear === year ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', 
                border: selectedYear === year ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: selectedYear === year ? '700' : '500', 
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: selectedYear === year ? '0 2px 10px rgba(139, 92, 246, 0.3)' : 'none'
              }}>
              {year}
            </button>
          ))}
        </div>
        
        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.2)' }} />
        
        {/* Month Selection */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setSelectedMonth(null)}
            style={{ 
              padding: '8px 12px', 
              background: selectedMonth === null ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', 
              border: 'none', borderRadius: '8px', color: 'white', fontSize: '11px', fontWeight: '600',
              cursor: 'pointer',
              boxShadow: selectedMonth === null ? '0 2px 10px rgba(139, 92, 246, 0.3)' : 'none'
            }}>
            📆 All
          </button>
          {monthNames.map((m, i) => {
            const isCurrentMonth = new Date().getMonth() === i && selectedYear === new Date().getFullYear();
            const isSelected = selectedMonth === i;
            return (
              <button key={i} onClick={() => setSelectedMonth(i)}
                style={{ 
                  padding: '8px 10px', 
                  background: isSelected ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 
                             isCurrentMonth ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)', 
                  border: isCurrentMonth && !isSelected ? '1px solid rgba(139, 92, 246, 0.5)' : 'none',
                  borderRadius: '8px', color: 'white', fontSize: '11px', fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none'
                }}>
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {!hasData ? (
        <EmptyState
          icon="📂"
          title="No transactions imported"
          message="Import your bank transactions to see your financial dashboard come to life!"
          actionLabel="📥 Import Data"
          onAction={onNavigateToImport}
        />
      ) : (
        <>
          {/* Combined Summary - Full Width Bar */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))', 
            borderRadius: '16px', 
            padding: '24px 48px', 
            marginBottom: '24px',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>📊 Combined Total Income</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#10B981' }}>
                  {formatCurrency(personalStats.income + sideHustleStats.income)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>💸 Combined Total Expenses</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#EF4444' }}>
                  {formatCurrency(personalStats.expenses + sideHustleStats.expenses)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>💎 Combined Net</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: (personalStats.income + sideHustleStats.income - personalStats.expenses - sideHustleStats.expenses) >= 0 ? '#8B5CF6' : '#F59E0B' }}>
                  {(personalStats.income + sideHustleStats.income - personalStats.expenses - sideHustleStats.expenses) >= 0 ? '+' : ''}
                  {formatCurrency(personalStats.income + sideHustleStats.income - personalStats.expenses - sideHustleStats.expenses)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>📋 Total Transactions</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>
                  {filteredTransactions.length.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Split Dashboard View - Full Width with Centered Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0' }}>
            {/* Personal Panel - Left Side */}
            <div style={{ paddingRight: '24px' }}>
              <DashboardPanel
                title="👤 Personal"
                icon="🏠"
                color="#8B5CF6"
                income={personalStats.income}
                expenses={personalStats.expenses}
                transactions={personalTransactions}
                recentTransactions={personalTransactions}
                categoryBreakdown={personalStats.categoryBreakdown}
              />
            </div>

            {/* Center Divider */}
            <div style={{ 
              background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))',
              borderRadius: '2px'
            }} />

            {/* Side Hustle Panel - Right Side */}
            <div style={{ paddingLeft: '24px' }}>
              <DashboardPanel
                title={`👤 ${sideHustleName || 'Side Hustle'}`}
                icon="👤"
                color="#EC4899"
                income={sideHustleStats.income}
                expenses={sideHustleStats.expenses}
                transactions={sideHustleTransactions}
                recentTransactions={sideHustleTransactions}
                categoryBreakdown={sideHustleStats.categoryBreakdown}
              />
            </div>
          </div>

          {/* Financial Health Reports Section */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📊 Financial Health Reports
              <span style={{ fontSize: '12px', fontWeight: '400', color: 'rgba(255,255,255,0.5)' }}>
                for {selectedMonth !== null ? `${fullMonthNames[selectedMonth]} ${selectedYear}` : `${selectedYear}`}
              </span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0' }}>
              {/* Personal Financial Health */}
              <div style={{ paddingRight: '24px' }}>
                <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '24px' }}>🏠</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Personal Financial Health</h4>
                  </div>

                  {/* Key Metrics Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    {/* Savings Rate */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>💰 Savings Rate</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: personalStats.income > 0 && ((personalStats.income - personalStats.expenses) / personalStats.income * 100) >= 20 ? '#10B981' : '#F59E0B' }}>
                        {personalStats.income > 0 ? ((personalStats.income - personalStats.expenses) / personalStats.income * 100).toFixed(1) : 0}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Target: 20%+</div>
                    </div>
                    {/* Expense Ratio */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>📊 Expense Ratio</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: personalStats.income > 0 && (personalStats.expenses / personalStats.income * 100) <= 80 ? '#10B981' : '#EF4444' }}>
                        {personalStats.income > 0 ? (personalStats.expenses / personalStats.income * 100).toFixed(1) : 0}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Target: &lt;80%</div>
                    </div>
                    {/* Average Daily Spend */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>📅 Avg Daily Spend</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                        {formatCurrency(personalStats.expenses / (selectedMonth !== null ? 30 : 365))}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>per day</div>
                    </div>
                    {/* Transactions */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>🧾 Transactions</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                        {personalTransactions.length}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>this period</div>
                    </div>
                  </div>

                  {/* Income vs Expenses Progress */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Income vs Expenses</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: (personalStats.income - personalStats.expenses) >= 0 ? '#10B981' : '#EF4444' }}>
                        {(personalStats.income - personalStats.expenses) >= 0 ? '+' : ''}{formatCurrency(personalStats.income - personalStats.expenses)}
                      </span>
                    </div>
                    <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${Math.min((personalStats.income / (personalStats.income + personalStats.expenses || 1)) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)' }} />
                      <div style={{ width: `${Math.min((personalStats.expenses / (personalStats.income + personalStats.expenses || 1)) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #EF4444, #DC2626)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                      <span>💰 Income: {formatCurrency(personalStats.income)}</span>
                      <span>💸 Expenses: {formatCurrency(personalStats.expenses)}</span>
                    </div>
                  </div>

                  {/* Top 3 Categories */}
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>Top Spending Areas</div>
                    {personalStats.categoryBreakdown.sort((a, b) => b.amount - a.amount).slice(0, 3).map((cat, i) => (
                      <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <span style={{ fontSize: '12px' }}>{categoryEmojiMap[cat.name] || '📦'} {cat.name}</span>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>{formatCurrency(cat.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Divider */}
              <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />

              {/* Side Hustle Financial Health */}
              <div style={{ paddingLeft: '24px' }}>
                <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '24px' }}>👤</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{sideHustleName} Financial Health</h4>
                  </div>

                  {/* Key Metrics Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    {/* Profit Margin */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>📈 Profit Margin</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: sideHustleStats.income > 0 && ((sideHustleStats.income - sideHustleStats.expenses) / sideHustleStats.income * 100) >= 20 ? '#10B981' : '#F59E0B' }}>
                        {sideHustleStats.income > 0 ? ((sideHustleStats.income - sideHustleStats.expenses) / sideHustleStats.income * 100).toFixed(1) : 0}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Target: 20%+</div>
                    </div>
                    {/* Operating Expense */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>💼 Operating Expense</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: sideHustleStats.income > 0 && (sideHustleStats.expenses / sideHustleStats.income * 100) <= 80 ? '#10B981' : '#EF4444' }}>
                        {sideHustleStats.income > 0 ? (sideHustleStats.expenses / sideHustleStats.income * 100).toFixed(1) : 0}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>of revenue</div>
                    </div>
                    {/* Net Profit */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>💵 Net Profit</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: (sideHustleStats.income - sideHustleStats.expenses) >= 0 ? '#10B981' : '#EF4444' }}>
                        {formatCurrency(sideHustleStats.income - sideHustleStats.expenses)}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>this period</div>
                    </div>
                    {/* Transactions */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>🧾 Transactions</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                        {sideHustleTransactions.length}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>this period</div>
                    </div>
                  </div>

                  {/* Revenue vs Expenses Progress */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Revenue vs Expenses</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: (sideHustleStats.income - sideHustleStats.expenses) >= 0 ? '#10B981' : '#EF4444' }}>
                        {(sideHustleStats.income - sideHustleStats.expenses) >= 0 ? '+' : ''}{formatCurrency(sideHustleStats.income - sideHustleStats.expenses)}
                      </span>
                    </div>
                    <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${Math.min((sideHustleStats.income / (sideHustleStats.income + sideHustleStats.expenses || 1)) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)' }} />
                      <div style={{ width: `${Math.min((sideHustleStats.expenses / (sideHustleStats.income + sideHustleStats.expenses || 1)) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #EF4444, #DC2626)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                      <span>💰 Revenue: {formatCurrency(sideHustleStats.income)}</span>
                      <span>💸 Expenses: {formatCurrency(sideHustleStats.expenses)}</span>
                    </div>
                  </div>

                  {/* Top 3 Expense Categories */}
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>Top Business Expenses</div>
                    {sideHustleStats.categoryBreakdown.sort((a, b) => b.amount - a.amount).slice(0, 3).map((cat, i) => (
                      <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <span style={{ fontSize: '12px' }}>{categoryEmojiMap[cat.name] || '📦'} {cat.name}</span>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>{formatCurrency(cat.amount)}</span>
                      </div>
                    ))}
                    {sideHustleStats.categoryBreakdown.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>No expense data</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bills & Goals Quick Overview */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📋 Bills & Goals Overview
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0' }}>
              {/* Personal Bills & Goals */}
              <div style={{ paddingRight: '24px' }}>
                <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '24px' }}>🏠</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Personal Overview</h4>
                  </div>

                  {/* Bills Summary */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>📅 Bills Status</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      <div style={{ background: 'rgba(239, 68, 68, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#EF4444' }}>2</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Overdue</div>
                      </div>
                      <div style={{ background: 'rgba(251, 191, 36, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#FBBF24' }}>5</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Due Soon</div>
                      </div>
                      <div style={{ background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981' }}>8</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Paid</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Next Due:</span>
                        <span style={{ color: '#FBBF24' }}>Electric Bill - Dec 5</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Amount:</span>
                        <span style={{ fontWeight: '600' }}>$142.50</span>
                      </div>
                    </div>
                  </div>

                  {/* Goals Progress */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>🎯 Goals Progress</div>
                    {goals && goals.length > 0 ? goals.slice(0, 3).map((goal, i) => {
                      const progress = goal.target > 0 ? (goal.saved / goal.target * 100) : 0;
                      return (
                        <div key={goal.id || i} style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                            <span>{goal.emoji || '🎯'} {goal.name}</span>
                            <span style={{ color: '#8B5CF6' }}>{progress.toFixed(0)}%</span>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(progress, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', borderRadius: '3px' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                            <span>{formatCurrency(goal.saved || 0)}</span>
                            <span>{formatCurrency(goal.target || 0)}</span>
                          </div>
                        </div>
                      );
                    }) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                        {[{ name: 'Emergency Fund', progress: 65, saved: 6500, target: 10000 }, { name: 'Vacation', progress: 42, saved: 840, target: 2000 }, { name: 'New Car', progress: 15, saved: 3000, target: 20000 }].map((goal, i) => (
                          <div key={i} style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                              <span>🎯 {goal.name}</span>
                              <span style={{ color: '#8B5CF6' }}>{goal.progress}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${goal.progress}%`, height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', borderRadius: '3px' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Divider */}
              <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />

              {/* Side Hustle Bills & Goals */}
              <div style={{ paddingLeft: '24px' }}>
                <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '24px' }}>👤</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{sideHustleName} Overview</h4>
                  </div>

                  {/* Business Bills Summary */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>📅 Business Bills</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      <div style={{ background: 'rgba(239, 68, 68, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#EF4444' }}>0</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Overdue</div>
                      </div>
                      <div style={{ background: 'rgba(251, 191, 36, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#FBBF24' }}>2</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Due Soon</div>
                      </div>
                      <div style={{ background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981' }}>4</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Paid</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Next Due:</span>
                        <span style={{ color: '#FBBF24' }}>MLS Dues - Dec 15</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Amount:</span>
                        <span style={{ fontWeight: '600' }}>$89.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Business Goals */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>🎯 Business Goals</div>
                    {[{ name: 'Q4 Revenue', progress: 78, saved: 15600, target: 20000 }, { name: 'Marketing Budget', progress: 45, saved: 900, target: 2000 }, { name: 'Equipment Fund', progress: 25, saved: 500, target: 2000 }].map((goal, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                          <span>🎯 {goal.name}</span>
                          <span style={{ color: '#EC4899' }}>{goal.progress}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${goal.progress}%`, height: '100%', background: 'linear-gradient(90deg, #EC4899, #8B5CF6)', borderRadius: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
