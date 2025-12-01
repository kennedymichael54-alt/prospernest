import React, { useState, useMemo } from 'react';

// ============================================================================
// HOME TAB - Split Dashboard: Personal vs Side Hustle View
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

// Inline MonthYearSelector
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
    <div style={{ background: 'rgba(30, 27, 56, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Year</div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {years.map(year => (
            <button key={year} onClick={() => setSelectedYear(year)}
              style={{ padding: '10px 20px', background: selectedYear === year ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: selectedYear === year ? '600' : '400', cursor: 'pointer' }}>
              {year}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Month</div>
        <button onClick={() => setSelectedMonth(null)}
          style={{ width: '100%', padding: '12px', background: selectedMonth === null ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '14px', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>📅</span> Entire Year {selectedYear}
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {months.map(month => (
            <button key={month.num} onClick={() => setSelectedMonth(month.num)}
              style={{ padding: '12px', background: selectedMonth === month.num ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', border: currentMonth === month.num && selectedYear === currentYear ? '2px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
              {month.short}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(139, 92, 246, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>📊 Viewing: </span>
        <span style={{ color: '#EC4899', fontWeight: '600', fontSize: '14px' }}>
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

// Dashboard Panel Component
function DashboardPanel({ title, icon, color, income, expenses, transactions, recentTransactions, categoryBreakdown, isPersonal }) {
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
    return sorted.slice(0, 5);
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

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '20px',
        padding: '16px 20px',
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        borderRadius: '12px',
        border: `1px solid ${color}40`
      }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'white' }}>{title}</h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0 0' }}>
            {transactions.length} transactions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💰 Income</div>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(income)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💸 Expenses</div>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(expenses)}</div>
        </div>
        <div style={{ background: netCashFlow >= 0 ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>📊 Net</div>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>{netCashFlow >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netCashFlow))}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '16px' }}>💳</span>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>Recent Activity</span>
          <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
            <button onClick={() => setRecentSort('high')}
              style={{ padding: '3px 6px', background: recentSort === 'high' ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
              ↓ High
            </button>
            <button onClick={() => setRecentSort('low')}
              style={{ padding: '3px 6px', background: recentSort === 'low' ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
              ↑ Low
            </button>
          </div>
        </div>
        {sortedRecent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>No transactions</div>
        ) : (
          sortedRecent.map((tx, i) => {
            const amount = parseFloat(tx.amount || tx.Amount);
            const category = tx.category || tx.Category || 'Uncategorized';
            const description = tx.description || tx.Description || 'Unknown';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>{getCategoryEmoji(category)}</span>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '13px' }}>{description.length > 20 ? description.slice(0, 20) + '...' : description}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{category}</div>
                  </div>
                </div>
                <span style={{ fontWeight: '600', fontSize: '13px', color: amount >= 0 ? '#10B981' : 'white' }}>
                  {amount >= 0 ? '+' : '-'}{formatCurrency(Math.abs(amount))}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Category Breakdown */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '16px' }}>📊</span>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>Top Categories</span>
          <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
            <button onClick={() => setCategorySort('high')}
              style={{ padding: '3px 6px', background: categorySort === 'high' ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
              ↓ High
            </button>
            <button onClick={() => setCategorySort('low')}
              style={{ padding: '3px 6px', background: categorySort === 'low' ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', fontSize: '10px', cursor: 'pointer' }}>
              ↑ Low
            </button>
          </div>
        </div>
        {sortedCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>No expense data</div>
        ) : (
          sortedCategories.map((cat, i) => {
            const percentage = expenses > 0 ? (cat.amount / expenses) * 100 : 0;
            return (
              <div key={cat.name} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <span>{getCategoryEmoji(cat.name)} {cat.name}</span>
                  <span style={{ fontWeight: '600' }}>{formatCurrency(cat.amount)}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function HomeTab({ transactions = [], bills = [], goals = [], onNavigateToImport }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

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
      {/* Month/Year Selector - Centered */}
      <MonthYearSelector
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      {!hasData ? (
        <EmptyState
          icon="📂"
          title="No transactions imported"
          message="Import your bank transactions to see your financial dashboard come to life!"
          actionLabel="📥 Import Data"
          onAction={onNavigateToImport}
        />
      ) : !hasFilteredData ? (
        <EmptyState
          icon="📅"
          title="No data for this period"
          message={`No transactions found for ${selectedMonth !== null ? new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' }) + ' ' : ''}${selectedYear}.`}
        />
      ) : (
        <>
          {/* Combined Summary */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))', 
            borderRadius: '16px', 
            padding: '20px', 
            marginBottom: '24px',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>📊 Combined Total Income</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#10B981' }}>
                  {formatCurrency(personalStats.income + sideHustleStats.income)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>💸 Combined Total Expenses</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#EF4444' }}>
                  {formatCurrency(personalStats.expenses + sideHustleStats.expenses)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>💎 Combined Net</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: (personalStats.income + sideHustleStats.income - personalStats.expenses - sideHustleStats.expenses) >= 0 ? '#8B5CF6' : '#F59E0B' }}>
                  {(personalStats.income + sideHustleStats.income - personalStats.expenses - sideHustleStats.expenses) >= 0 ? '+' : '-'}
                  {formatCurrency(Math.abs(personalStats.income + sideHustleStats.income - personalStats.expenses - sideHustleStats.expenses))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>📋 Total Transactions</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>
                  {filteredTransactions.length.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Split Dashboard View */}
          <div style={{ display: 'grid', gridTemplateColumns: hasSideHustleData ? '1fr 1fr' : '1fr', gap: '24px' }}>
            {/* Personal Panel */}
            <DashboardPanel
              title="👤 Personal"
              icon="🏠"
              color="#8B5CF6"
              income={personalStats.income}
              expenses={personalStats.expenses}
              transactions={personalTransactions}
              recentTransactions={personalTransactions}
              categoryBreakdown={personalStats.categoryBreakdown}
              isPersonal={true}
            />

            {/* Side Hustle Panel - Only show if there's data */}
            {hasSideHustleData && (
              <DashboardPanel
                title={`💼 ${sideHustleName}`}
                icon="💼"
                color="#EC4899"
                income={sideHustleStats.income}
                expenses={sideHustleStats.expenses}
                transactions={sideHustleTransactions}
                recentTransactions={sideHustleTransactions}
                categoryBreakdown={sideHustleStats.categoryBreakdown}
                isPersonal={false}
              />
            )}
          </div>

          {/* Tip for users without side hustle */}
          {!hasSideHustleData && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              background: 'rgba(236, 72, 153, 0.1)', 
              borderRadius: '12px',
              border: '1px solid rgba(236, 72, 153, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>💼</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Have a Side Hustle?</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  Go to the Transactions tab and mark income sources as "Side Hustle" to see a split view of your Personal vs Side Hustle finances!
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
