import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// TRANSACTIONS TAB - Split View with Goals and Accounting Categories
// ============================================================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));
};

const extractVendor = (description) => {
  if (!description) return 'Unknown';
  let vendor = description
    .replace(/^(IN \*|SQ \*|TST\*|PP\*|PAYPAL \*|VENMO\s+)/i, '')
    .replace(/\s+\d{2,}.*$/i, '')
    .replace(/\s+(GA|FL|TX|CA|NY|NC|SC|OH|PA|IL|AZ|CO|WA|OR|NV|TN|VA|MD|MA|NJ|CT|MO|WI|MN|IN|MI|KY|AL|LA|OK|IA|KS|AR|MS|NE|NM|WV|ID|HI|NH|ME|MT|RI|DE|SD|ND|AK|VT|WY|DC)$/i, '')
    .replace(/\s*#\d+.*$/i, '')
    .replace(/\s*-\s*\d+.*$/i, '')
    .trim();
  vendor = vendor.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  return vendor.length > 25 ? vendor.substring(0, 25) + '...' : vendor || 'Unknown';
};

const categoryEmojiMap = {
  'Groceries': '🛒', 'Food': '🍔', 'Fast Food': '🍟', 'Restaurants': '🍽️', 'Gas': '⛽',
  'Auto & Transport': '🚗', 'Shopping': '🛍️', 'Entertainment': '🎬', 'Transfer': '💸',
  'Income': '💰', 'Hobbies': '🎮', 'Electronics & Software': '💻', 'Doctor': '🏥',
  'Pharmacy': '💊', 'Financial': '📊', 'Television': '📺', 'Housing': '🏠',
  'Utilities': '💡', 'Category Pending': '📦', 'Personal': '👤', 'Education': '📚',
  'Travel': '✈️', 'Fitness': '💪', 'Pets': '🐾', 'Gifts': '🎁', 'Coffee': '☕',
  'Home Improvement': '🔨', 'Paycheck': '💵', 'Reimbursement': '💱', 'Cash': '💵'
};

const SIDE_HUSTLE_KEYWORDS = [
  'real estate', 'commission', 'freelance', 'consulting', 'hair stylist', 'salon',
  'uber', 'lyft', 'doordash', 'instacart', 'airbnb', 'etsy', 'ebay', 'amazon seller',
  'photography', 'design', 'tutoring', 'coaching', 'client', 'invoice', 'gig'
];

// Accounting Categories for Real Estate / Business
const ACCOUNTING_CATEGORIES = [
  // Assets
  { group: 'Assets', items: ['Land', 'Land Improvements', 'Building', 'Building Improvements', 'Vehicles', 'Tenant Improvement', 'Telephone Equipment', 'Account Receivables', 'Cash'] },
  // Liabilities
  { group: 'Liabilities', items: ['Mortgage', 'Loans', 'Lines of Credit', 'Payroll Liability', 'Credit Card', 'Security Deposits'] },
  // Equity
  { group: 'Equity', items: ['Initial Equity', 'Capital Contribution', 'Equity Draw', 'Capital Stock'] },
  // Expenses
  { group: 'Expenses', items: ['Advertising', 'Cleaning Fees', 'Travel', 'Maintenance', 'Commissions', 'Insurance', 'Legal / Professional Fees', 'Management Fees', 'Mortgage Interest (Paid)', 'Repairs', 'Office Supplies', 'Taxes', 'Utilities', 'Depreciation Expense', 'Miscellaneous', 'Meals & Entertainment', 'Personal', 'Maintenance Materials', 'Flip Repairs and Maintenance', 'Administrative', 'Bank Fees', 'Closing Fees', 'Furnishings', 'Utility Payments (Pass Through)'] },
  // Income
  { group: 'Income', items: ['Parking Fees', 'Rent', 'Interest Income', 'Flip Income', 'Miscellaneous Income', 'Rental Revenue', 'Real Estate Commissions'] }
];

// Flatten for easy lookup
const ALL_ACCOUNTING_CATEGORIES = ACCOUNTING_CATEGORIES.flatMap(g => g.items);

// Compact Month/Year Selector
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

// Transaction List Panel Component
function TransactionPanel({ title, icon, color, transactions, searchTerm, setSearchTerm, typeFilter, setTypeFilter, sortBy, sortOrder, setSortBy, setSortOrder, onIncomeTypeChange, onCategoryChange, onAccountingCategoryChange, onGoalAssign, getCategoryEmoji, sideHustleName, isPersonal, goals }) {
  const [editingTx, setEditingTx] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(null);
  const [goalAmount, setGoalAmount] = useState('');

  const totals = useMemo(() => {
    const income = transactions.filter(tx => parseFloat(tx.amount || tx.Amount) > 0).reduce((sum, tx) => sum + parseFloat(tx.amount || tx.Amount), 0);
    const expenses = transactions.filter(tx => parseFloat(tx.amount || tx.Amount) < 0).reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
    return { income, expenses, net: income - expenses };
  }, [transactions]);

  const handleGoalSave = (tx) => {
    const amount = parseFloat(goalAmount);
    if (amount > 0 && showGoalModal) {
      onGoalAssign(tx, showGoalModal, amount);
      setShowGoalModal(null);
      setGoalAmount('');
    }
  };

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', 
        marginBottom: '16px', padding: '14px 20px',
        background: `linear-gradient(135deg, ${color}25, ${color}10)`,
        borderRadius: '14px', border: `1px solid ${color}40`
      }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{title}</h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0 0' }}>{transactions.length} transactions</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>📋 Transactions</div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{transactions.length}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '10px', padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>💰 Income</div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{formatCurrency(totals.income)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius: '10px', padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>💸 Expenses</div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{formatCurrency(totals.expenses)}</div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, borderRadius: '10px', padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>📊 Net</div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{totals.net >= 0 ? '+' : ''}{formatCurrency(totals.net)}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '120px', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'white', fontSize: '13px' }} />
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'expense', 'income'].map(type => (
            <button key={type} onClick={() => setTypeFilter(type)}
              style={{ padding: '8px 12px', background: typeFilter === type ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '11px', cursor: 'pointer' }}>
              {type === 'all' ? 'All' : type === 'expense' ? 'Expenses' : 'Income'}
            </button>
          ))}
        </div>
        <select value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [by, order] = e.target.value.split('-'); setSortBy(by); setSortOrder(order); }}
          style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '11px' }}>
          <option value="date-desc" style={{ background: '#1e1b38' }}>Date ↓</option>
          <option value="date-asc" style={{ background: '#1e1b38' }}>Date ↑</option>
          <option value="amount-desc" style={{ background: '#1e1b38' }}>Amount ↓</option>
          <option value="amount-asc" style={{ background: '#1e1b38' }}>Amount ↑</option>
        </select>
      </div>

      {/* Transaction List */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 55px 1fr 100px 100px 70px 60px 50px', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
          <div>Type</div>
          <div>Date</div>
          <div>Description</div>
          <div>Category</div>
          <div>Accounting</div>
          <div style={{ textAlign: 'right' }}>Amount</div>
          <div style={{ textAlign: 'center' }}>Goal</div>
          <div style={{ textAlign: 'center' }}>Status</div>
        </div>
        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {transactions.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>No transactions</div>
          ) : (
            transactions.slice(0, 500).map((tx, index) => {
              const amount = parseFloat(tx.amount || tx.Amount);
              const isExpense = amount < 0;
              const date = new Date(tx.date || tx.Date);
              const status = tx.status || tx.Status || 'Posted';
              const incomeType = tx.incomeType || 'personal';

              return (
                <div key={tx.id || index} style={{ display: 'grid', gridTemplateColumns: '80px 55px 1fr 100px 100px 70px 60px 50px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                  <div>
                    <select value={incomeType} onChange={(e) => onIncomeTypeChange(tx, e.target.value)}
                      style={{ padding: '4px 4px', background: incomeType === 'personal' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)', border: `1px solid ${incomeType === 'personal' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)'}`, borderRadius: '6px', color: 'white', fontSize: '8px', cursor: 'pointer', width: '100%' }}>
                      <option value="personal" style={{ background: '#1e1b38' }}>👤 Personal</option>
                      <option value="sidehustle" style={{ background: '#1e1b38' }}>👤 {sideHustleName}</option>
                    </select>
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: '500', fontSize: '11px' }}>{tx.vendor}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{(tx.description || '').slice(0, 25)}</div>
                  </div>
                  <div onClick={() => setEditingTx(tx)}
                    style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer', padding: '3px 6px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '9px' }}>
                    <span>{getCategoryEmoji(tx.displayCategory)}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.displayCategory.length > 8 ? tx.displayCategory.slice(0, 8) + '..' : tx.displayCategory}</span>
                  </div>
                  <div>
                    <select value={tx.accountingCategory || ''} onChange={(e) => onAccountingCategoryChange(tx, e.target.value)}
                      style={{ padding: '3px 4px', background: tx.accountingCategory ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', color: 'white', fontSize: '8px', width: '100%' }}>
                      <option value="" style={{ background: '#1e1b38' }}>Select...</option>
                      {ACCOUNTING_CATEGORIES.map(group => (
                        <optgroup key={group.group} label={group.group} style={{ background: '#1e1b38' }}>
                          {group.items.map(item => (
                            <option key={item} value={item} style={{ background: '#1e1b38' }}>{item}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: '600', fontSize: '11px', color: isExpense ? '#EF4444' : '#10B981' }}>{isExpense ? '-' : '+'}{formatCurrency(amount)}</div>
                  <div style={{ textAlign: 'center' }}>
                    {amount > 0 ? (
                      tx.goalAssignment ? (
                        <div style={{ fontSize: '8px', padding: '2px 4px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '4px', color: '#10B981' }}>
                          🎯 ${tx.goalAssignment.amount}
                        </div>
                      ) : (
                        <button onClick={() => { setShowGoalModal(tx); setGoalAmount(Math.abs(amount).toFixed(2)); }}
                          style={{ padding: '2px 6px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', color: '#8B5CF6', fontSize: '8px', cursor: 'pointer' }}>
                          + Goal
                        </button>
                      )
                    ) : (
                      <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>—</span>
                    )}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ padding: '2px 4px', borderRadius: '4px', fontSize: '8px', background: status === 'Posted' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)', color: status === 'Posted' ? '#10B981' : '#FBBF24' }}>{status.slice(0, 4)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
        Showing {Math.min(transactions.length, 500)} of {transactions.length} transactions
      </div>

      {/* Goal Assignment Modal */}
      {showGoalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowGoalModal(null)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', borderRadius: '20px', padding: '24px', width: '360px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>🎯 Assign to Goal</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
              Assign income from <strong>{showGoalModal.vendor}</strong> toward a goal
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Select Goal</label>
              <select style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '13px' }}>
                <option value="" style={{ background: '#1e1b38' }}>Choose a goal...</option>
                {goals.map(goal => (
                  <option key={goal.id} value={goal.id} style={{ background: '#1e1b38' }}>{goal.emoji} {goal.name}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Amount to Apply (positive only)</label>
              <input type="number" min="0" step="0.01" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Max: {formatCurrency(Math.abs(parseFloat(showGoalModal.amount || 0)))}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowGoalModal(null)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleGoalSave(showGoalModal)} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransactionsTab({ transactions = [], goals = [] }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [personalSearch, setPersonalSearch] = useState('');
  const [sideHustleSearch, setSideHustleSearch] = useState('');
  const [personalTypeFilter, setPersonalTypeFilter] = useState('all');
  const [sideHustleTypeFilter, setSideHustleTypeFilter] = useState('all');
  const [personalSortBy, setPersonalSortBy] = useState('date');
  const [personalSortOrder, setPersonalSortOrder] = useState('desc');
  const [sideHustleSortBy, setSideHustleSortBy] = useState('date');
  const [sideHustleSortOrder, setSideHustleSortOrder] = useState('desc');

  const [vendorCategoryMap, setVendorCategoryMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_vendor_categories') || '{}'); } catch { return {}; }
  });
  const [incomeTypeMap, setIncomeTypeMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_income_types') || '{}'); } catch { return {}; }
  });
  const [accountingCategoryMap, setAccountingCategoryMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_accounting_categories') || '{}'); } catch { return {}; }
  });
  const [goalAssignments, setGoalAssignments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_goal_assignments') || '{}'); } catch { return {}; }
  });
  const [sideHustleName, setSideHustleName] = useState(() => {
    try { return localStorage.getItem('ff_sidehustle_name') || 'Side Hustle'; } catch { return 'Side Hustle'; }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ff_accounting_categories', JSON.stringify(accountingCategoryMap));
  }, [accountingCategoryMap]);

  useEffect(() => {
    localStorage.setItem('ff_goal_assignments', JSON.stringify(goalAssignments));
  }, [goalAssignments]);

  const getCategoryEmoji = (category) => categoryEmojiMap[category] || '📦';

  const isSideHustle = (tx) => {
    const vendor = extractVendor(tx.description || tx.Description || '').toLowerCase();
    if (incomeTypeMap[vendor] === 'sidehustle') return true;
    if (incomeTypeMap[vendor] === 'personal') return false;
    const combined = `${tx.description || ''} ${tx.category || ''} ${vendor}`.toLowerCase();
    return SIDE_HUSTLE_KEYWORDS.some(keyword => combined.includes(keyword));
  };

  const transactionsWithMappings = useMemo(() => {
    return transactions.map(tx => {
      const vendor = extractVendor(tx.description || tx.Description);
      const vendorKey = vendor.toLowerCase();
      const displayCategory = vendorCategoryMap[vendorKey] || tx.category || tx.Category || 'Category Pending';
      const incomeType = incomeTypeMap[vendorKey] || (isSideHustle(tx) ? 'sidehustle' : 'personal');
      const accountingCategory = accountingCategoryMap[vendorKey] || '';
      const goalAssignment = goalAssignments[tx.id || vendor + tx.date];
      return { ...tx, vendor, displayCategory, incomeType, accountingCategory, goalAssignment };
    });
  }, [transactions, vendorCategoryMap, incomeTypeMap, accountingCategoryMap, goalAssignments]);

  const filteredByDate = useMemo(() => {
    return transactionsWithMappings.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      if (selectedMonth === null) return txDate.getFullYear() === selectedYear;
      return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });
  }, [transactionsWithMappings, selectedMonth, selectedYear]);

  const { personalTransactions, sideHustleTransactions } = useMemo(() => {
    const personal = filteredByDate.filter(tx => tx.incomeType === 'personal');
    const sideHustle = filteredByDate.filter(tx => tx.incomeType === 'sidehustle');
    return { personalTransactions: personal, sideHustleTransactions: sideHustle };
  }, [filteredByDate]);

  const filterAndSort = (txList, search, typeFilter, sortBy, sortOrder) => {
    let filtered = txList;
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(tx => tx.vendor.toLowerCase().includes(term) || tx.displayCategory.toLowerCase().includes(term) || (tx.description || '').toLowerCase().includes(term));
    }
    if (typeFilter === 'expense') filtered = filtered.filter(tx => parseFloat(tx.amount || tx.Amount) < 0);
    if (typeFilter === 'income') filtered = filtered.filter(tx => parseFloat(tx.amount || tx.Amount) > 0);
    filtered.sort((a, b) => {
      const aVal = sortBy === 'date' ? new Date(a.date || a.Date).getTime() : Math.abs(parseFloat(a.amount || a.Amount));
      const bVal = sortBy === 'date' ? new Date(b.date || b.Date).getTime() : Math.abs(parseFloat(b.amount || b.Amount));
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return filtered;
  };

  const handleIncomeTypeChange = (tx, newType) => {
    const vendorKey = tx.vendor.toLowerCase();
    setIncomeTypeMap(prev => { const updated = { ...prev, [vendorKey]: newType }; localStorage.setItem('ff_income_types', JSON.stringify(updated)); return updated; });
  };

  const handleCategoryChange = (tx, newCategory) => {
    const vendorKey = tx.vendor.toLowerCase();
    setVendorCategoryMap(prev => { const updated = { ...prev, [vendorKey]: newCategory }; localStorage.setItem('ff_vendor_categories', JSON.stringify(updated)); return updated; });
  };

  const handleAccountingCategoryChange = (tx, newCategory) => {
    const vendorKey = tx.vendor.toLowerCase();
    setAccountingCategoryMap(prev => ({ ...prev, [vendorKey]: newCategory }));
  };

  const handleGoalAssign = (tx, goalId, amount) => {
    const key = tx.id || tx.vendor + tx.date;
    setGoalAssignments(prev => ({ ...prev, [key]: { goalId, amount } }));
  };

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Side Hustle Name Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px 16px', background: 'rgba(30, 27, 56, 0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Side Hustle Name:</span>
        <input type="text" value={sideHustleName} onChange={(e) => { setSideHustleName(e.target.value); localStorage.setItem('ff_sidehustle_name', e.target.value); }}
          style={{ flex: 1, maxWidth: '200px', padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '13px' }} />
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>This appears in Dashboard & all tabs</span>
      </div>

      <MonthYearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      {/* Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0' }}>
        <div style={{ paddingRight: '16px' }}>
          <TransactionPanel
            title="👤 Personal"
            icon="🏠"
            color="#8B5CF6"
            transactions={filterAndSort(personalTransactions, personalSearch, personalTypeFilter, personalSortBy, personalSortOrder)}
            searchTerm={personalSearch}
            setSearchTerm={setPersonalSearch}
            typeFilter={personalTypeFilter}
            setTypeFilter={setPersonalTypeFilter}
            sortBy={personalSortBy}
            sortOrder={personalSortOrder}
            setSortBy={setPersonalSortBy}
            setSortOrder={setPersonalSortOrder}
            onIncomeTypeChange={handleIncomeTypeChange}
            onCategoryChange={handleCategoryChange}
            onAccountingCategoryChange={handleAccountingCategoryChange}
            onGoalAssign={handleGoalAssign}
            getCategoryEmoji={getCategoryEmoji}
            sideHustleName={sideHustleName}
            isPersonal={true}
            goals={goals}
          />
        </div>

        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />

        <div style={{ paddingLeft: '16px' }}>
          <TransactionPanel
            title={`👤 ${sideHustleName}`}
            icon="👤"
            color="#EC4899"
            transactions={filterAndSort(sideHustleTransactions, sideHustleSearch, sideHustleTypeFilter, sideHustleSortBy, sideHustleSortOrder)}
            searchTerm={sideHustleSearch}
            setSearchTerm={setSideHustleSearch}
            typeFilter={sideHustleTypeFilter}
            setTypeFilter={setSideHustleTypeFilter}
            sortBy={sideHustleSortBy}
            sortOrder={sideHustleSortOrder}
            setSortBy={setSideHustleSortBy}
            setSortOrder={setSideHustleSortOrder}
            onIncomeTypeChange={handleIncomeTypeChange}
            onCategoryChange={handleCategoryChange}
            onAccountingCategoryChange={handleAccountingCategoryChange}
            onGoalAssign={handleGoalAssign}
            getCategoryEmoji={getCategoryEmoji}
            sideHustleName={sideHustleName}
            isPersonal={false}
            goals={goals}
          />
        </div>
      </div>

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
