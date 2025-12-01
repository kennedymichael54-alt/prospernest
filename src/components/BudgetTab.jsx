import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// BUDGET TAB - Budget vs Actual Comparison View
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

// Compact Month/Year Selector matching dashboard style
function MonthYearSelector({ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
          {months.map((month, i) => (
            <button key={i} onClick={() => setSelectedMonth(i)}
              style={{ padding: '8px 10px', background: selectedMonth === i ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)', border: currentMonth === i && selectedYear === currentYear ? '2px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '11px', cursor: 'pointer' }}>
              {month}
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

// Budget Health Score Component
function BudgetHealthScore({ score, label, color }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color }}>{score.toFixed(0)}%</div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{label}</div>
      </div>
    </div>
  );
}

// Budget Panel Component with Actual vs Budget comparison
function BudgetPanel({ title, icon, color, transactions, budgets, setBudgets }) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', budget: '' });
  const [sortBy, setSortBy] = useState('spent-desc');

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
    let result = Object.entries(categories).map(([name, data]) => ({
      name,
      spent: data.spent,
      budget: budgets[name] || 0,
      transactionCount: data.transactions.length,
      variance: (budgets[name] || 0) - data.spent
    }));
    
    // Sort based on sortBy
    switch(sortBy) {
      case 'spent-asc': result.sort((a, b) => a.spent - b.spent); break;
      case 'spent-desc': result.sort((a, b) => b.spent - a.spent); break;
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'variance-desc': result.sort((a, b) => a.variance - b.variance); break;
      case 'variance-asc': result.sort((a, b) => b.variance - a.variance); break;
      default: result.sort((a, b) => b.spent - a.spent);
    }
    return result;
  }, [transactions, budgets, sortBy]);

  const totalBudgeted = Object.values(budgets).reduce((sum, b) => sum + (parseFloat(b) || 0), 0);
  const totalSpent = expenses;
  const budgetHealth = totalBudgeted > 0 ? Math.max(0, Math.min(100, ((totalBudgeted - totalSpent) / totalBudgeted + 1) * 50)) : 50;
  const categoriesOnTrack = categorySpending.filter(c => c.budget > 0 && c.spent <= c.budget).length;
  const categoriesOverBudget = categorySpending.filter(c => c.budget > 0 && c.spent > c.budget).length;

  const getCategoryEmoji = (cat) => categoryEmojiMap[cat] || '📦';

  const handleSetBudget = (category, amount) => {
    const newBudgets = { ...budgets, [category]: parseFloat(amount) || 0 };
    setBudgets(newBudgets);
  };

  const addCategory = () => {
    if (!newCategory.name || !newCategory.budget) return;
    handleSetBudget(newCategory.name, newCategory.budget);
    setNewCategory({ name: '', budget: '' });
    setShowAddCategory(false);
  };

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px', padding: '14px 20px', background: `linear-gradient(135deg, ${color}25, ${color}10)`, borderRadius: '14px', border: `1px solid ${color}40`, position: 'relative' }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{title}</h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0 0' }}>{transactions.length} transactions</p>
        </div>
        <button onClick={() => setShowAddCategory(true)} style={{ position: 'absolute', right: '20px', padding: '8px 14px', background: `linear-gradient(135deg, ${color}, ${color}CC)`, border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
          + Add Category
        </button>
      </div>

      {/* Budget Health Overview */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>📊 Budget Health Overview</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center' }}>
          {/* Left - Actual vs Budget */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Actual vs Budget</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: totalSpent <= totalBudgeted ? '#10B981' : '#EF4444' }}>
                {totalBudgeted > 0 ? ((totalSpent / totalBudgeted) * 100).toFixed(0) : 0}% used
              </span>
            </div>
            <div style={{ height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: `${Math.min((totalSpent / (totalBudgeted || 1)) * 100, 100)}%`,
                background: totalSpent <= totalBudgeted ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #EF4444, #DC2626)',
                borderRadius: '10px', transition: 'width 0.5s ease'
              }} />
              {totalBudgeted > 0 && (
                <div style={{ position: 'absolute', top: 0, left: `${Math.min((totalBudgeted / (Math.max(totalSpent, totalBudgeted) || 1)) * 100, 100)}%`, height: '100%', width: '2px', background: '#F59E0B' }} />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
              <span>Spent: {formatCurrency(totalSpent)}</span>
              <span>Budget: {formatCurrency(totalBudgeted)}</span>
            </div>
          </div>

          {/* Center - Health Score */}
          <BudgetHealthScore score={budgetHealth} label="Health" color={budgetHealth >= 70 ? '#10B981' : budgetHealth >= 40 ? '#F59E0B' : '#EF4444'} />

          {/* Right - Category Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10B981' }}>{categoriesOnTrack}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>On Track</div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444' }}>{categoriesOverBudget}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Over Budget</div>
            </div>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#8B5CF6' }}>{categorySpending.length}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Categories</div>
            </div>
            <div style={{ background: surplus >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: surplus >= 0 ? '#10B981' : '#EF4444' }}>{surplus >= 0 ? '+' : ''}{formatCurrency(surplus)}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Net</div>
            </div>
          </div>
        </div>
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

      {/* Categories List with Budget Comparison */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Categories - Actual vs Budget</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '11px', cursor: 'pointer' }}>
              <option value="spent-desc" style={{ background: '#1e1b38' }}>Highest Spent</option>
              <option value="spent-asc" style={{ background: '#1e1b38' }}>Lowest Spent</option>
              <option value="name-asc" style={{ background: '#1e1b38' }}>A-Z Name</option>
              <option value="name-desc" style={{ background: '#1e1b38' }}>Z-A Name</option>
              <option value="variance-desc" style={{ background: '#1e1b38' }}>Most Over Budget</option>
              <option value="variance-asc" style={{ background: '#1e1b38' }}>Most Under Budget</option>
            </select>
          </div>
        </div>
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {categorySpending.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No spending data</div>
          ) : (
            categorySpending.map(cat => {
              const percentSpent = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
              const isOverBudget = cat.budget > 0 && cat.spent > cat.budget;
              const remaining = cat.budget - cat.spent;
              return (
                <div key={cat.name} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{getCategoryEmoji(cat.name)}</span>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '13px' }}>{cat.name}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{cat.transactionCount} transactions</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Actual</div>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: isOverBudget ? '#EF4444' : 'white' }}>{formatCurrency(cat.spent)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Budget</div>
                        <input type="number" placeholder="Set..." value={cat.budget || ''} onChange={(e) => handleSetBudget(cat.name, e.target.value)}
                          style={{ width: '80px', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '12px', textAlign: 'right' }} />
                      </div>
                      {cat.budget > 0 && (
                        <div style={{ textAlign: 'right', minWidth: '70px' }}>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{remaining >= 0 ? 'Remaining' : 'Over'}</div>
                          <div style={{ fontWeight: '600', fontSize: '13px', color: remaining >= 0 ? '#10B981' : '#EF4444' }}>
                            {remaining >= 0 ? '' : '-'}{formatCurrency(Math.abs(remaining))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {cat.budget > 0 && (
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(percentSpent, 100)}%`, height: '100%', background: isOverBudget ? 'linear-gradient(90deg, #EF4444, #DC2626)' : 'linear-gradient(90deg, #10B981, #059669)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddCategory(false)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', borderRadius: '20px', padding: '24px', width: '360px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>+ Add Budget Category</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Category Name</label>
              <input type="text" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="e.g., Groceries"
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Monthly Budget ($)</label>
              <input type="number" value={newCategory.budget} onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })} placeholder="500"
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
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

export default function BudgetTab({ transactions = [] }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [personalBudgets, setPersonalBudgets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_personal_budgets') || '{}'); } catch { return {}; }
  });
  const [sideHustleBudgets, setSideHustleBudgets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_sidehustle_budgets') || '{}'); } catch { return {}; }
  });
  const [incomeTypeMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_income_types') || '{}'); } catch { return {}; }
  });
  const sideHustleName = localStorage.getItem('ff_sidehustle_name') || 'Side Hustle';

  useEffect(() => {
    localStorage.setItem('ff_personal_budgets', JSON.stringify(personalBudgets));
  }, [personalBudgets]);

  useEffect(() => {
    localStorage.setItem('ff_sidehustle_budgets', JSON.stringify(sideHustleBudgets));
  }, [sideHustleBudgets]);

  const isSideHustle = (tx) => {
    const vendor = extractVendor(tx.description || tx.Description || '');
    if (incomeTypeMap[vendor] === 'sidehustle') return true;
    if (incomeTypeMap[vendor] === 'personal') return false;
    const combined = `${tx.description || ''} ${tx.category || ''} ${vendor}`.toLowerCase();
    return SIDE_HUSTLE_KEYWORDS.some(keyword => combined.includes(keyword));
  };

  const filteredByDate = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      if (selectedMonth === null) return txDate.getFullYear() === selectedYear;
      return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const { personalTransactions, sideHustleTransactions } = useMemo(() => {
    const personal = filteredByDate.filter(tx => !isSideHustle(tx));
    const sideHustle = filteredByDate.filter(tx => isSideHustle(tx));
    return { personalTransactions: personal, sideHustleTransactions: sideHustle };
  }, [filteredByDate]);

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <MonthYearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      {/* Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0' }}>
        <div style={{ paddingRight: '20px' }}>
          <BudgetPanel
            title="👤 Personal Budget"
            icon="🏠"
            color="#8B5CF6"
            transactions={personalTransactions}
            budgets={personalBudgets}
            setBudgets={setPersonalBudgets}
          />
        </div>

        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />

        <div style={{ paddingLeft: '20px' }}>
          <BudgetPanel
            title={`👤 ${sideHustleName} Budget`}
            icon="👤"
            color="#EC4899"
            transactions={sideHustleTransactions}
            budgets={sideHustleBudgets}
            setBudgets={setSideHustleBudgets}
          />
        </div>
      </div>

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
