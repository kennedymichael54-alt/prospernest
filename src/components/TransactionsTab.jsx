import React, { useState, useMemo } from 'react';

// ============================================================================
// TRANSACTIONS TAB - Full transaction list with vendor & category management
// ============================================================================

// Currency formatter helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));
};

// Extract vendor from description
const extractVendor = (description) => {
  if (!description) return 'Unknown';
  
  let vendor = description
    .replace(/^(IN \*|SQ \*|TST\*|PP\*|PAYPAL \*|VENMO\s+)/i, '')
    .replace(/\s+\d{2,}.*$/i, '')
    .replace(/\s+(GA|FL|TX|CA|NY|NC|SC|OH|PA|IL|AZ|CO|WA|OR|NV|TN|VA|MD|MA|NJ|CT|MO|WI|MN|IN|MI|KY|AL|LA|OK|IA|KS|AR|MS|NE|NM|WV|ID|HI|NH|ME|MT|RI|DE|SD|ND|AK|VT|WY|DC)$/i, '')
    .replace(/\s*#\d+.*$/i, '')
    .replace(/\s*-\s*\d+.*$/i, '')
    .trim();
  
  vendor = vendor.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  if (vendor.length > 25) {
    vendor = vendor.substring(0, 25) + '...';
  }
  
  return vendor || 'Unknown';
};

// Default category emoji map
const categoryEmojiMap = {
  'Groceries': '🛒',
  'Food': '🍔',
  'Fast Food': '🍟',
  'Restaurants': '🍽️',
  'Meals': '🍽️',
  'Gas': '⛽',
  'Auto & Transport': '🚗',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Transfer': '💸',
  'Income': '💰',
  'Hobbies': '🎮',
  'Electronics & Software': '💻',
  'Electronics': '💻',
  'Doctor': '🏥',
  'Healthcare': '🏥',
  'Pharmacy': '💊',
  'Financial': '📊',
  'Television': '📺',
  'Subscriptions': '📺',
  'Housing': '🏠',
  'Rent': '🏠',
  'Utilities': '💡',
  'Category Pending': '📦',
  'Uncategorized': '📦',
  'Personal': '👤',
  'Education': '📚',
  'Travel': '✈️',
  'Fitness': '💪',
  'Pets': '🐾',
  'Gifts': '🎁',
  'Insurance': '🛡️',
  'Taxes': '📋',
  'Investments': '📈',
  'Savings': '🏦',
  'Coffee': '☕',
  'Alcohol': '🍺',
  'Clothing': '👕',
  'Beauty': '💄',
  'Home': '🏡',
  'Kids': '👶',
  'Charity': '❤️'
};

// Income type options
const INCOME_TYPES = [
  { value: 'personal', label: '👤 Personal', color: '#8B5CF6' },
  { value: 'sidehustle', label: '💼 Side Hustle', color: '#EC4899' }
];

// Default side hustle categories (auto-detected)
const SIDE_HUSTLE_KEYWORDS = [
  'real estate', 'commission', 'freelance', 'consulting', 'hair stylist', 'salon',
  'uber', 'lyft', 'doordash', 'instacart', 'airbnb', 'etsy', 'ebay', 'amazon seller',
  'photography', 'design', 'tutoring', 'coaching', 'client', 'invoice'
];

// Inline MonthYearSelector Component
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
        <div style={{ display: 'flex', gap: '8px' }}>
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              style={{
                padding: '10px 20px',
                background: selectedYear === year ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: selectedYear === year ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Month</div>
        <button
          onClick={() => setSelectedMonth(null)}
          style={{
            width: '100%',
            padding: '12px',
            background: selectedMonth === null ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>📅</span> Entire Year {selectedYear}
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {months.map(month => (
            <button
              key={month.num}
              onClick={() => setSelectedMonth(month.num)}
              style={{
                padding: '12px',
                background: selectedMonth === month.num ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.05)',
                border: currentMonth === month.num && selectedYear === currentYear ? '2px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
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

// Inline EmptyState Component  
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

export default function TransactionsTab({ 
  transactions = [],
  onNavigateToImport,
  onUpdateTransactionTypes
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [applyToAllVendor, setApplyToAllVendor] = useState(true);
  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('ff_custom_categories');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [vendorCategoryMap, setVendorCategoryMap] = useState(() => {
    try {
      const saved = localStorage.getItem('ff_vendor_categories');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Income type mappings (vendor -> personal/sidehustle)
  const [incomeTypeMap, setIncomeTypeMap] = useState(() => {
    try {
      const saved = localStorage.getItem('ff_income_types');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Custom side hustle name
  const [sideHustleName, setSideHustleName] = useState(() => {
    try {
      return localStorage.getItem('ff_sidehustle_name') || 'Side Hustle';
    } catch { return 'Side Hustle'; }
  });

  const allCategories = useMemo(() => {
    const defaultCats = Object.keys(categoryEmojiMap);
    const uniqueCustom = customCategories.filter(c => !defaultCats.includes(c));
    return [...defaultCats, ...uniqueCustom].sort();
  }, [customCategories]);

  // Auto-detect side hustle based on keywords
  const detectIncomeType = (tx) => {
    const description = (tx.description || tx.Description || '').toLowerCase();
    const category = (tx.category || tx.Category || '').toLowerCase();
    const vendor = (tx.vendor || '').toLowerCase();
    
    const combined = `${description} ${category} ${vendor}`;
    
    if (SIDE_HUSTLE_KEYWORDS.some(keyword => combined.includes(keyword))) {
      return 'sidehustle';
    }
    return 'personal';
  };

  const transactionsWithMappings = useMemo(() => {
    return transactions.map(tx => {
      const vendor = extractVendor(tx.description || tx.Description || '');
      const mappedCategory = vendorCategoryMap[vendor.toLowerCase()];
      const mappedIncomeType = incomeTypeMap[vendor.toLowerCase()];
      const autoIncomeType = detectIncomeType({ ...tx, vendor });
      
      return {
        ...tx,
        vendor,
        displayCategory: mappedCategory || tx.category || tx.Category || 'Uncategorized',
        incomeType: mappedIncomeType || autoIncomeType
      };
    });
  }, [transactions, vendorCategoryMap, incomeTypeMap]);

  const filteredByDate = useMemo(() => {
    return transactionsWithMappings.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      if (selectedMonth === null) {
        return txDate.getFullYear() === selectedYear;
      }
      return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });
  }, [transactionsWithMappings, selectedMonth, selectedYear]);

  const categoriesInView = useMemo(() => {
    const cats = new Set();
    filteredByDate.forEach(tx => cats.add(tx.displayCategory));
    return Array.from(cats).sort();
  }, [filteredByDate]);

  const filteredTransactions = useMemo(() => {
    let result = [...filteredByDate];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx => 
        (tx.description || tx.Description || '').toLowerCase().includes(term) ||
        (tx.displayCategory || '').toLowerCase().includes(term) ||
        (tx.vendor || '').toLowerCase().includes(term)
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter(tx => tx.displayCategory === categoryFilter);
    }

    if (typeFilter === 'expense') {
      result = result.filter(tx => parseFloat(tx.amount || tx.Amount) < 0);
    } else if (typeFilter === 'income') {
      result = result.filter(tx => parseFloat(tx.amount || tx.Amount) > 0);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date || a.Date) - new Date(b.date || b.Date);
      } else if (sortBy === 'amount') {
        comparison = Math.abs(parseFloat(a.amount || a.Amount)) - Math.abs(parseFloat(b.amount || b.Amount));
      } else if (sortBy === 'category') {
        comparison = (a.displayCategory || '').localeCompare(b.displayCategory || '');
      } else if (sortBy === 'vendor') {
        comparison = (a.vendor || '').localeCompare(b.vendor || '');
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [filteredByDate, searchTerm, categoryFilter, typeFilter, sortBy, sortOrder]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) > 0).reduce((sum, tx) => sum + parseFloat(tx.amount || tx.Amount), 0);
    const expenses = filteredTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) < 0).reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
    return { income, expenses, net: income - expenses };
  }, [filteredTransactions]);

  const getCategoryEmoji = (category) => categoryEmojiMap[category] || '📦';

  const handleCategoryChange = (transaction, newCat, applyToAll) => {
    const vendor = transaction.vendor.toLowerCase();
    
    if (applyToAll) {
      const newMapping = { ...vendorCategoryMap, [vendor]: newCat };
      setVendorCategoryMap(newMapping);
      localStorage.setItem('ff_vendor_categories', JSON.stringify(newMapping));
    }
    
    if (!allCategories.includes(newCat)) {
      const updatedCustom = [...customCategories, newCat];
      setCustomCategories(updatedCustom);
      localStorage.setItem('ff_custom_categories', JSON.stringify(updatedCustom));
    }
    
    setShowCategoryModal(false);
    setEditingTransaction(null);
    setNewCategory('');
  };

  const handleIncomeTypeChange = (transaction, newType) => {
    const vendor = transaction.vendor.toLowerCase();
    const newMapping = { ...incomeTypeMap, [vendor]: newType };
    setIncomeTypeMap(newMapping);
    localStorage.setItem('ff_income_types', JSON.stringify(newMapping));
  };

  const openCategoryModal = (transaction) => {
    setEditingTransaction(transaction);
    setNewCategory(transaction.displayCategory);
    setApplyToAllVendor(true);
    setShowCategoryModal(true);
  };

  const getVendorCount = (vendor) => {
    return transactionsWithMappings.filter(tx => tx.vendor.toLowerCase() === vendor.toLowerCase()).length;
  };

  const hasData = transactions.length > 0;

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
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
          message="Import your bank transactions to view your full transaction history."
          actionLabel="📥 Import Data"
          onAction={onNavigateToImport}
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>📋 Transactions</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{filteredTransactions.length.toLocaleString()}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💰 Income</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{formatCurrency(totals.income)}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💸 Expenses</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{formatCurrency(totals.expenses)}</div>
            </div>
            <div style={{ background: totals.net >= 0 ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>📊 Net</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{totals.net >= 0 ? '+' : '-'}{formatCurrency(totals.net)}</div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="🔍 Search transactions, vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', cursor: 'pointer', minWidth: '150px' }}>
              <option value="all" style={{ background: '#1e1b38' }}>All Categories</option>
              {categoriesInView.map(cat => (
                <option key={cat} value={cat} style={{ background: '#1e1b38' }}>{cat}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[{ value: 'all', label: 'All' }, { value: 'expense', label: 'Expenses' }, { value: 'income', label: 'Income' }].map(option => (
                <button key={option.value} onClick={() => setTypeFilter(option.value)} style={{ padding: '10px 16px', background: typeFilter === option.value ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: typeFilter === option.value ? '600' : '400' }}>
                  {option.label}
                </button>
              ))}
            </div>

            <select value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [by, order] = e.target.value.split('-'); setSortBy(by); setSortOrder(order); }} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
              <option value="date-desc" style={{ background: '#1e1b38' }}>Date (Newest)</option>
              <option value="date-asc" style={{ background: '#1e1b38' }}>Date (Oldest)</option>
              <option value="amount-desc" style={{ background: '#1e1b38' }}>Amount (Highest)</option>
              <option value="amount-asc" style={{ background: '#1e1b38' }}>Amount (Lowest)</option>
              <option value="vendor-asc" style={{ background: '#1e1b38' }}>Vendor (A-Z)</option>
              <option value="category-asc" style={{ background: '#1e1b38' }}>Category (A-Z)</option>
            </select>
          </div>

          {/* Side Hustle Name Editor */}
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>💼</span>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Side Hustle Name:</span>
            </div>
            <input
              type="text"
              value={sideHustleName}
              onChange={(e) => {
                setSideHustleName(e.target.value);
                localStorage.setItem('ff_sidehustle_name', e.target.value);
              }}
              placeholder="e.g., Real Estate Agent, Hair Stylist..."
              style={{ 
                flex: 1, 
                minWidth: '200px',
                padding: '10px 16px', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(236, 72, 153, 0.3)', 
                borderRadius: '8px', 
                color: 'white', 
                fontSize: '14px',
                fontWeight: '500'
              }}
            />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              This name will appear in your Dashboard split view
            </span>
          </div>

          {/* Transactions List with Income Type Column */}
          <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 80px 140px 1fr 150px 100px 70px', padding: '16px 20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div>Type</div>
              <div>Date</div>
              <div>Vendor</div>
              <div>Description</div>
              <div>Category</div>
              <div style={{ textAlign: 'right' }}>Amount</div>
              <div style={{ textAlign: 'center' }}>Status</div>
            </div>

            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {filteredTransactions.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No transactions match your filters</div>
              ) : (
                filteredTransactions.slice(0, 1000).map((tx, index) => {
                  const amount = parseFloat(tx.amount || tx.Amount);
                  const isExpense = amount < 0;
                  const date = new Date(tx.date || tx.Date);
                  const status = tx.status || tx.Status || 'Posted';
                  const incomeType = tx.incomeType || 'personal';
                  
                  return (
                    <div key={tx.id || index} style={{ display: 'grid', gridTemplateColumns: '120px 80px 140px 1fr 150px 100px 70px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                      {/* Income Type Selector */}
                      <div>
                        <select 
                          value={incomeType}
                          onChange={(e) => handleIncomeTypeChange(tx, e.target.value)}
                          style={{ 
                            padding: '6px 8px', 
                            background: incomeType === 'personal' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)', 
                            border: `1px solid ${incomeType === 'personal' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)'}`,
                            borderRadius: '6px', 
                            color: 'white', 
                            fontSize: '10px', 
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          <option value="personal" style={{ background: '#1e1b38' }}>👤 Personal</option>
                          <option value="sidehustle" style={{ background: '#1e1b38' }}>💼 {sideHustleName || 'Side Hustle'}</option>
                        </select>
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <div style={{ fontWeight: '600', fontSize: '12px', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.vendor}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(tx.description || tx.Description || '').slice(0, 35)}</div>
                      <div onClick={() => openCategoryModal(tx)} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ fontSize: '12px' }}>{getCategoryEmoji(tx.displayCategory)}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.displayCategory.length > 10 ? tx.displayCategory.slice(0, 10) + '...' : tx.displayCategory}</span>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>✏️</span>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: '600', fontSize: '13px', color: isExpense ? '#EF4444' : '#10B981' }}>{isExpense ? '-' : '+'}{formatCurrency(amount)}</div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ padding: '3px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '500', background: status === 'Posted' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)', color: status === 'Posted' ? '#10B981' : '#FBBF24' }}>{status}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            Showing {Math.min(filteredTransactions.length, 1000).toLocaleString()} of {filteredTransactions.length.toLocaleString()} filtered transactions
            {filteredTransactions.length > 1000 && (
              <span style={{ color: '#F59E0B', marginLeft: '8px' }}>
                (Use filters to narrow results)
              </span>
            )}
          </div>
        </>
      )}

      {/* Category Edit Modal */}
      {showCategoryModal && editingTransaction && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setShowCategoryModal(false)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '32px', width: '450px', maxWidth: '90vw', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>📂 Edit Category</h3>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Vendor</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{editingTransaction.vendor}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Amount</span>
                <span style={{ fontWeight: '600', color: parseFloat(editingTransaction.amount) < 0 ? '#EF4444' : '#10B981' }}>{formatCurrency(editingTransaction.amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Current Category</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{getCategoryEmoji(editingTransaction.displayCategory)}</span>
                  <span style={{ color: 'white' }}>{editingTransaction.displayCategory}</span>
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Select Category</label>
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', cursor: 'pointer', boxSizing: 'border-box' }}>
                {allCategories.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#1e1b38' }}>{getCategoryEmoji(cat)} {cat}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Or Create New Category</label>
              <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g., Coffee, Subscriptions..." style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ background: applyToAllVendor ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.05)', border: applyToAllVendor ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '24px', cursor: 'pointer' }} onClick={() => setApplyToAllVendor(!applyToAllVendor)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: applyToAllVendor ? 'none' : '2px solid rgba(255,255,255,0.3)', background: applyToAllVendor ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  {applyToAllVendor ? '✓' : ''}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'white', fontSize: '14px' }}>Apply to all "{editingTransaction.vendor}" transactions</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>This will update {getVendorCount(editingTransaction.vendor)} transaction{getVendorCount(editingTransaction.vendor) !== 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowCategoryModal(false)} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Cancel</button>
              <button onClick={() => handleCategoryChange(editingTransaction, newCategory, applyToAllVendor)} disabled={!newCategory.trim()} style={{ flex: 1, padding: '14px', background: newCategory.trim() ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '600', cursor: newCategory.trim() ? 'pointer' : 'not-allowed', fontSize: '14px', opacity: newCategory.trim() ? 1 : 0.5 }}>Save Category</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
