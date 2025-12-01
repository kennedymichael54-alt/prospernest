import React, { useState, useMemo } from 'react';

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

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Top Balances Bar - Date Selector | Personal Banks | Side Hustle Banks | Investments */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 2px 1fr 2px 1fr 2px 1fr', 
        gap: '0',
        background: 'rgba(30, 27, 56, 0.8)', 
        backdropFilter: 'blur(20px)', 
        borderRadius: '20px', 
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        {/* Date Selector Section */}
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📅</span> Period Selection
          </div>
          {/* Year Buttons */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {[selectedYear - 1, selectedYear, selectedYear + 1].map(year => (
              <button key={year} onClick={() => setSelectedYear(year)}
                style={{ padding: '6px 12px', background: selectedYear === year ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.08)', 
                  border: 'none', borderRadius: '6px', color: 'white', fontSize: '11px', fontWeight: selectedYear === year ? '600' : '400', cursor: 'pointer' }}>
                {year}
              </button>
            ))}
          </div>
          {/* Month Buttons */}
          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
            <button onClick={() => setSelectedMonth(null)}
              style={{ padding: '5px 8px', background: selectedMonth === null ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
              All
            </button>
            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => (
              <button key={i} onClick={() => setSelectedMonth(i)}
                style={{ padding: '5px 7px', background: selectedMonth === i ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', 
                  border: new Date().getMonth() === i && selectedYear === new Date().getFullYear() ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '5px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
                {m}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '6px', textAlign: 'center' }}>
            <span style={{ color: '#EC4899', fontWeight: '600', fontSize: '11px' }}>
              {selectedMonth !== null ? `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][selectedMonth]} ${selectedYear}` : `${selectedYear}`}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4))' }} />

        {/* Personal Bank Balances */}
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🏦</span> Personal Banking
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Show derived or sample bank accounts */}
            {[
              { name: 'USAA Checking', balance: personalStats.income - personalStats.expenses, color: '#10B981' },
              { name: 'Navy Federal', balance: 0, color: '#3B82F6' },
              { name: 'Synovus', balance: 0, color: '#8B5CF6' }
            ].slice(0, 3).map((bank, i) => (
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
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Period Net</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>{formatCurrency(personalStats.income - personalStats.expenses)}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4))' }} />

        {/* Side Hustle Bank Balances */}
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💼</span> {sideHustleName} Banking
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { name: 'Business Checking', balance: sideHustleStats.income - sideHustleStats.expenses, color: '#EC4899' },
              { name: 'Business Savings', balance: 0, color: '#F59E0B' }
            ].slice(0, 2).map((bank, i) => (
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
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Period Net</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#EC4899' }}>{formatCurrency(sideHustleStats.income - sideHustleStats.expenses)}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4))' }} />

        {/* Investment Balances */}
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📈</span> Investments
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {investments.length > 0 ? (
              Object.entries(investmentsByInstitution).slice(0, 3).map(([inst, data], i) => (
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
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#8B5CF6' }}>{formatCurrency(totalInvestments)}</div>
          </div>
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
                title={`💼 ${sideHustleName || 'Side Hustle'}`}
                icon="💼"
                color="#EC4899"
                income={sideHustleStats.income}
                expenses={sideHustleStats.expenses}
                transactions={sideHustleTransactions}
                recentTransactions={sideHustleTransactions}
                categoryBreakdown={sideHustleStats.categoryBreakdown}
              />
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
