import React, { useState, useMemo } from 'react';

// ============================================================================
// BUDGET TAB - Split Personal/Side Hustle View
// ============================================================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const categoryEmojiMap = {
  'Groceries': '🛒', 'Food': '🍔', 'Fast Food': '🍟', 'Restaurants': '🍽️', 'Gas': '⛽',
  'Auto & Transport': '🚗', 'Shopping': '🛍️', 'Entertainment': '🎬', 'Transfer': '💸',
  'Income': '💰', 'Hobbies': '🎮', 'Electronics & Software': '💻', 'Doctor': '🏥',
  'Pharmacy': '💊', 'Financial': '📊', 'Television': '📺', 'Housing': '🏠',
  'Utilities': '💡', 'Category Pending': '📦', 'Personal': '👤', 'Education': '📚',
  'Travel': '✈️', 'Fitness': '💪', 'Pets': '🐾', 'Uncategorized': '📦'
};

const SIDE_HUSTLE_KEYWORDS = [
  'real estate', 'commission', 'freelance', 'consulting', 'hair stylist', 'salon',
  'uber', 'lyft', 'doordash', 'instacart', 'airbnb', 'etsy', 'ebay', 'amazon seller',
  'photography', 'design', 'tutoring', 'coaching', 'client', 'invoice', 'gig'
];

const extractVendor = (description) => {
  if (!description) return 'unknown';
  return description.replace(/^(IN \*|SQ \*|TST\*|PP\*|PAYPAL \*|VENMO\s+)/i, '').replace(/\s+\d{2,}.*$/i, '').trim().toLowerCase().slice(0, 25);
};

// Compact Month/Year Selector
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
    <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {years.map(year => (
            <button key={year} onClick={() => setSelectedYear(year)}
              style={{ padding: '8px 14px', background: selectedYear === year ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: selectedYear === year ? '600' : '400', cursor: 'pointer' }}>
              {year}
            </button>
          ))}
        </div>
        <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setSelectedMonth(null)}
            style={{ padding: '8px 10px', background: selectedMonth === null ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '11px', cursor: 'pointer' }}>
            📅 All
          </button>
          {months.map(month => (
            <button key={month.num} onClick={() => setSelectedMonth(month.num)}
              style={{ padding: '8px 10px', background: selectedMonth === month.num ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', border: currentMonth === month.num && selectedYear === currentYear ? '2px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '11px', cursor: 'pointer' }}>
              {month.short}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(139, 92, 246, 0.15)', borderRadius: '8px', padding: '8px', textAlign: 'center', marginTop: '10px' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>📊 Viewing: </span>
        <span style={{ color: '#EC4899', fontWeight: '600', fontSize: '12px' }}>
          {selectedMonth !== null ? `${monthNames[selectedMonth]} ${selectedYear}` : `All of ${selectedYear}`}
        </span>
      </div>
    </div>
  );
}

// Budget Panel Component
function BudgetPanel({ title, icon, color, transactions, budgets, setBudgets }) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', budget: '', emoji: '📦' });

  const income = useMemo(() => {
    return transactions.filter(tx => parseFloat(tx.amount || tx.Amount) > 0).reduce((sum, tx) => sum + parseFloat(tx.amount || tx.Amount), 0);
  }, [transactions]);

  const expenses = useMemo(() => {
    return transactions.filter(tx => parseFloat(tx.amount || tx.Amount) < 0).reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
  }, [transactions]);

  const surplus = income - expenses;

  const categorySpending = useMemo(() => {
    const categories = {};
    transactions.filter(tx => parseFloat(tx.amount || tx.Amount) < 0).forEach(tx => {
      const cat = tx.category || tx.Category || 'Uncategorized';
      if (!categories[cat]) categories[cat] = { spent: 0, transactions: [] };
      categories[cat].spent += Math.abs(parseFloat(tx.amount || tx.Amount));
      categories[cat].transactions.push(tx);
    });
    return Object.entries(categories).map(([name, data]) => ({
      name,
      spent: data.spent,
      budget: budgets[name] || 0,
      transactionCount: data.transactions.length
    })).sort((a, b) => b.spent - a.spent);
  }, [transactions, budgets]);

  const getCategoryEmoji = (cat) => categoryEmojiMap[cat] || '📦';

  const handleSetBudget = (category, amount) => {
    const newBudgets = { ...budgets, [category]: parseFloat(amount) || 0 };
    setBudgets(newBudgets);
  };

  const addCategory = () => {
    if (!newCategory.name || !newCategory.budget) return;
    handleSetBudget(newCategory.name, newCategory.budget);
    setNewCategory({ name: '', budget: '', emoji: '📦' });
    setShowAddCategory(false);
  };

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '14px 20px', background: `linear-gradient(135deg, ${color}25, ${color}10)`, borderRadius: '14px', border: `1px solid ${color}40` }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{title}</h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0 0' }}>{transactions.length} transactions</p>
        </div>
        <button onClick={() => setShowAddCategory(true)} style={{ marginLeft: 'auto', padding: '8px 14px', background: `linear-gradient(135deg, ${color}, ${color}CC)`, border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
          + Add Category
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💰 Income</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(income)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💸 Expenses</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(expenses)}</div>
        </div>
        <div style={{ background: surplus >= 0 ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>✨ {surplus >= 0 ? 'Surplus' : 'Deficit'}</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{surplus >= 0 ? '+' : ''}{formatCurrency(surplus)}</div>
        </div>
      </div>

      {/* Categories List */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', fontWeight: '600' }}>Categories</div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {categorySpending.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No spending data</div>
          ) : (
            categorySpending.map(cat => {
              const percentSpent = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
              const isOverBudget = cat.budget > 0 && cat.spent > cat.budget;
              return (
                <div key={cat.name} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{getCategoryEmoji(cat.name)}</span>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '13px' }}>{cat.name}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{cat.transactionCount} transactions</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: isOverBudget ? '#EF4444' : 'white' }}>{formatCurrency(cat.spent)}</div>
                      {cat.budget > 0 && (
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>of {formatCurrency(cat.budget)}</div>
                      )}
                    </div>
                  </div>
                  {cat.budget > 0 && (
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(percentSpent, 100)}%`, height: '100%', background: isOverBudget ? '#EF4444' : color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <input type="number" placeholder="Set budget" value={cat.budget || ''} onChange={(e) => handleSetBudget(cat.name, e.target.value)}
                      style={{ flex: 1, padding: '6px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', fontSize: '11px' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddCategory(false)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', borderRadius: '20px', padding: '28px', width: '360px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>➕ Add Budget Category</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Category Name</label>
              <input value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="e.g., Dining Out"
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Monthly Budget ($)</label>
              <input type="number" value={newCategory.budget} onChange={e => setNewCategory({ ...newCategory, budget: e.target.value })} placeholder="500"
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowAddCategory(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={addCategory} style={{ flex: 1, padding: '12px', background: `linear-gradient(135deg, ${color}, ${color}CC)`, border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BudgetTab({ transactions = [], onNavigateToImport }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [personalBudgets, setPersonalBudgets] = useState({});
  const [sideHustleBudgets, setSideHustleBudgets] = useState({});

  const incomeTypeMap = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('ff_income_types') || '{}'); } catch { return {}; }
  }, []);

  const sideHustleName = useMemo(() => {
    try { return localStorage.getItem('ff_sidehustle_name') || 'Side Hustle'; } catch { return 'Side Hustle'; }
  }, []);

  const isSideHustle = (tx) => {
    const vendor = extractVendor(tx.description || tx.Description || '');
    if (incomeTypeMap[vendor] === 'sidehustle') return true;
    if (incomeTypeMap[vendor] === 'personal') return false;
    const combined = `${tx.description || ''} ${tx.category || ''} ${vendor}`.toLowerCase();
    return SIDE_HUSTLE_KEYWORDS.some(keyword => combined.includes(keyword));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      if (selectedMonth === null) return txDate.getFullYear() === selectedYear;
      return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const { personalTransactions, sideHustleTransactions } = useMemo(() => {
    const personal = filteredTransactions.filter(tx => !isSideHustle(tx));
    const sideHustle = filteredTransactions.filter(tx => isSideHustle(tx));
    return { personalTransactions: personal, sideHustleTransactions: sideHustle };
  }, [filteredTransactions, incomeTypeMap]);

  const hasSideHustleData = sideHustleTransactions.length > 0;
  const hasData = transactions.length > 0;

  if (!hasData) {
    return (
      <div style={{ animation: 'slideIn 0.3s ease' }}>
        <MonthYearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center', background: 'rgba(30, 27, 56, 0.5)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📂</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No transactions imported</h3>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Import your transactions to start budgeting!</p>
          <button onClick={onNavigateToImport} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>📥 Import Data</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <MonthYearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      {/* Split View - Always show both panels centered */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ paddingRight: '20px' }}>
          <BudgetPanel title="👤 Personal Budget" icon="🏠" color="#8B5CF6" transactions={personalTransactions} budgets={personalBudgets} setBudgets={setPersonalBudgets} />
        </div>

        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />
        
        <div style={{ paddingLeft: '20px' }}>
          <BudgetPanel title={`💼 ${sideHustleName} Budget`} icon="💼" color="#EC4899" transactions={sideHustleTransactions} budgets={sideHustleBudgets} setBudgets={setSideHustleBudgets} />
        </div>
      </div>

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
