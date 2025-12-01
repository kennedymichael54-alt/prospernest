import React, { useState, useMemo } from 'react';

// ============================================================================
// TRANSACTIONS TAB - Split View: Personal vs Side Hustle Transactions
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

const DEFAULT_CATEGORIES = [
  'Groceries', 'Food', 'Fast Food', 'Restaurants', 'Gas', 'Auto & Transport',
  'Shopping', 'Entertainment', 'Transfer', 'Income', 'Hobbies', 'Electronics & Software',
  'Doctor', 'Pharmacy', 'Financial', 'Television', 'Housing', 'Utilities', 'Education',
  'Travel', 'Fitness', 'Pets', 'Gifts', 'Coffee', 'Home Improvement', 'Paycheck'
];

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

// Transaction List Panel Component
function TransactionPanel({ title, icon, color, transactions, searchTerm, setSearchTerm, typeFilter, setTypeFilter, sortBy, sortOrder, setSortBy, setSortOrder, onIncomeTypeChange, onCategoryChange, getCategoryEmoji, sideHustleName, isPersonal }) {
  const [editingTx, setEditingTx] = useState(null);
  const [newCategory, setNewCategory] = useState('');

  const totals = useMemo(() => {
    const income = transactions.filter(tx => parseFloat(tx.amount || tx.Amount) > 0).reduce((sum, tx) => sum + parseFloat(tx.amount || tx.Amount), 0);
    const expenses = transactions.filter(tx => parseFloat(tx.amount || tx.Amount) < 0).reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
    return { income, expenses, net: income - expenses };
  }, [transactions]);

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '16px',
        padding: '14px 20px',
        background: `linear-gradient(135deg, ${color}25, ${color}10)`,
        borderRadius: '14px',
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
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '120px', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'white', fontSize: '13px' }}
        />
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'expense', 'income'].map(type => (
            <button key={type} onClick={() => setTypeFilter(type)}
              style={{ padding: '8px 12px', background: typeFilter === type ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '11px', cursor: 'pointer' }}>
              {type === 'all' ? 'All' : type === 'expense' ? 'Expenses' : 'Income'}
            </button>
          ))}
        </div>
        <select value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [by, order] = e.target.value.split('-'); setSortBy(by); setSortOrder(order); }}
          style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '11px', cursor: 'pointer' }}>
          <option value="date-desc" style={{ background: '#1e1b38' }}>Date ↓</option>
          <option value="date-asc" style={{ background: '#1e1b38' }}>Date ↑</option>
          <option value="amount-desc" style={{ background: '#1e1b38' }}>Amount ↓</option>
          <option value="amount-asc" style={{ background: '#1e1b38' }}>Amount ↑</option>
        </select>
      </div>

      {/* Transaction List */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px 70px 1fr 120px 80px 60px', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
          <div>Type</div>
          <div>Date</div>
          <div>Description</div>
          <div>Category</div>
          <div style={{ textAlign: 'right' }}>Amount</div>
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
                <div key={tx.id || index} style={{ display: 'grid', gridTemplateColumns: '90px 70px 1fr 120px 80px 60px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                  <div>
                    <select value={incomeType} onChange={(e) => onIncomeTypeChange(tx, e.target.value)}
                      style={{ padding: '4px 6px', background: incomeType === 'personal' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)', border: `1px solid ${incomeType === 'personal' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)'}`, borderRadius: '6px', color: 'white', fontSize: '9px', cursor: 'pointer', width: '100%' }}>
                      <option value="personal" style={{ background: '#1e1b38' }}>👤 Personal</option>
                      <option value="sidehustle" style={{ background: '#1e1b38' }}>💼 {sideHustleName}</option>
                    </select>
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: '500', fontSize: '12px' }}>{tx.vendor}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{(tx.description || '').slice(0, 30)}</div>
                  </div>
                  <div onClick={() => { setEditingTx(tx); setNewCategory(tx.displayCategory); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px' }}>
                    <span>{getCategoryEmoji(tx.displayCategory)}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.displayCategory.length > 10 ? tx.displayCategory.slice(0, 10) + '...' : tx.displayCategory}</span>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: '600', fontSize: '12px', color: isExpense ? '#EF4444' : '#10B981' }}>{isExpense ? '-' : '+'}{formatCurrency(amount)}</div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', background: status === 'Posted' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)', color: status === 'Posted' ? '#10B981' : '#FBBF24' }}>{status}</span>
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
    </div>
  );
}

export default function TransactionsTab({ transactions = [] }) {
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
  const [sideHustleName, setSideHustleName] = useState(() => {
    try { return localStorage.getItem('ff_sidehustle_name') || 'Side Hustle'; } catch { return 'Side Hustle'; }
  });

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
      const displayCategory = vendorCategoryMap[vendor.toLowerCase()] || tx.category || tx.Category || 'Category Pending';
      const incomeType = incomeTypeMap[vendor.toLowerCase()] || (isSideHustle(tx) ? 'sidehustle' : 'personal');
      return { ...tx, vendor, displayCategory, incomeType };
    });
  }, [transactions, vendorCategoryMap, incomeTypeMap]);

  const filteredByDate = useMemo(() => {
    return transactionsWithMappings.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      if (selectedMonth === null) return txDate.getFullYear() === selectedYear;
      return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });
  }, [transactionsWithMappings, selectedMonth, selectedYear]);

  const { personalTransactions, sideHustleTransactions } = useMemo(() => {
    const personal = filteredByDate.filter(tx => tx.incomeType !== 'sidehustle');
    const sideHustle = filteredByDate.filter(tx => tx.incomeType === 'sidehustle');
    return { personalTransactions: personal, sideHustleTransactions: sideHustle };
  }, [filteredByDate]);

  const filterAndSort = (txList, search, typeFilter, sortBy, sortOrder) => {
    let result = [...txList];
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(tx => 
        tx.vendor.toLowerCase().includes(term) || 
        (tx.description || '').toLowerCase().includes(term) ||
        tx.displayCategory.toLowerCase().includes(term)
      );
    }
    if (typeFilter === 'expense') result = result.filter(tx => parseFloat(tx.amount || tx.Amount) < 0);
    if (typeFilter === 'income') result = result.filter(tx => parseFloat(tx.amount || tx.Amount) > 0);
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') comparison = new Date(b.date || b.Date) - new Date(a.date || a.Date);
      else if (sortBy === 'amount') comparison = Math.abs(parseFloat(b.amount || b.Amount)) - Math.abs(parseFloat(a.amount || a.Amount));
      return sortOrder === 'desc' ? comparison : -comparison;
    });
    return result;
  };

  const filteredPersonal = useMemo(() => filterAndSort(personalTransactions, personalSearch, personalTypeFilter, personalSortBy, personalSortOrder), [personalTransactions, personalSearch, personalTypeFilter, personalSortBy, personalSortOrder]);
  const filteredSideHustle = useMemo(() => filterAndSort(sideHustleTransactions, sideHustleSearch, sideHustleTypeFilter, sideHustleSortBy, sideHustleSortOrder), [sideHustleTransactions, sideHustleSearch, sideHustleTypeFilter, sideHustleSortBy, sideHustleSortOrder]);

  const handleIncomeTypeChange = (tx, newType) => {
    const vendor = tx.vendor.toLowerCase();
    const newMapping = { ...incomeTypeMap, [vendor]: newType };
    setIncomeTypeMap(newMapping);
    localStorage.setItem('ff_income_types', JSON.stringify(newMapping));
  };

  const handleCategoryChange = (tx, newCat) => {
    const vendor = tx.vendor.toLowerCase();
    const newMapping = { ...vendorCategoryMap, [vendor]: newCat };
    setVendorCategoryMap(newMapping);
    localStorage.setItem('ff_vendor_categories', JSON.stringify(newMapping));
  };

  const hasSideHustleData = sideHustleTransactions.length > 0;

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <MonthYearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      {/* Side Hustle Name Editor */}
      <div style={{ background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', border: '1px solid rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '18px' }}>💼</span>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Side Hustle Name:</span>
        <input type="text" value={sideHustleName} onChange={(e) => { setSideHustleName(e.target.value); localStorage.setItem('ff_sidehustle_name', e.target.value); }}
          placeholder="e.g., Real Estate Agent..."
          style={{ flex: 1, minWidth: '150px', padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '8px', color: 'white', fontSize: '13px' }} />
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>This appears in Dashboard & all tabs</span>
      </div>

      {/* Split View - Always show both panels centered */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Personal Transactions */}
        <div style={{ paddingRight: '20px' }}>
          <TransactionPanel
            title="👤 Personal"
            icon="🏠"
            color="#8B5CF6"
            transactions={filteredPersonal}
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
            getCategoryEmoji={getCategoryEmoji}
            sideHustleName={sideHustleName}
            isPersonal={true}
          />
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />

        {/* Side Hustle Transactions */}
        <div style={{ paddingLeft: '20px' }}>
          <TransactionPanel
            title={`💼 ${sideHustleName}`}
            icon="💼"
            color="#EC4899"
            transactions={filteredSideHustle}
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
            getCategoryEmoji={getCategoryEmoji}
            sideHustleName={sideHustleName}
            isPersonal={false}
          />
        </div>
      </div>

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
