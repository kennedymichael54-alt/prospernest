import React, { useState, useMemo } from 'react';
import MonthYearSelector from './MonthYearSelector';
import EmptyState from './EmptyState';

// ============================================================================
// TRANSACTIONS TAB - Full transaction list with filtering
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

export default function TransactionsTab({ 
  transactions = [],
  onNavigateToImport 
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'expense', 'income'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'category'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Filter transactions by selected month/year
  const filteredByDate = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      if (selectedMonth === null) {
        return txDate.getFullYear() === selectedYear;
      }
      return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    filteredByDate.forEach(tx => {
      const cat = tx.category || tx.Category || 'Uncategorized';
      cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [filteredByDate]);

  // Apply all filters
  const filteredTransactions = useMemo(() => {
    let result = [...filteredByDate];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx => 
        (tx.description || tx.Description || '').toLowerCase().includes(term) ||
        (tx.category || tx.Category || '').toLowerCase().includes(term)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(tx => 
        (tx.category || tx.Category || 'Uncategorized') === categoryFilter
      );
    }

    // Type filter
    if (typeFilter === 'expense') {
      result = result.filter(tx => parseFloat(tx.amount || tx.Amount) < 0);
    } else if (typeFilter === 'income') {
      result = result.filter(tx => parseFloat(tx.amount || tx.Amount) > 0);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.date || a.Date) - new Date(b.date || b.Date);
      } else if (sortBy === 'amount') {
        comparison = Math.abs(parseFloat(a.amount || a.Amount)) - Math.abs(parseFloat(b.amount || b.Amount));
      } else if (sortBy === 'category') {
        comparison = (a.category || a.Category || '').localeCompare(b.category || b.Category || '');
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [filteredByDate, searchTerm, categoryFilter, typeFilter, sortBy, sortOrder]);

  // Calculate totals
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(tx => parseFloat(tx.amount || tx.Amount) > 0)
      .reduce((sum, tx) => sum + parseFloat(tx.amount || tx.Amount), 0);
    
    const expenses = filteredTransactions
      .filter(tx => parseFloat(tx.amount || tx.Amount) < 0)
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
    
    return { income, expenses, net: income - expenses };
  }, [filteredTransactions]);

  // Get emoji for category
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Groceries': '🛒',
      'Food': '🍔',
      'Fast Food': '🍟',
      'Restaurants': '🍽️',
      'Gas': '⛽',
      'Auto & Transport': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Transfer': '💸',
      'Income': '💰',
      'Hobbies': '🎮',
      'Electronics & Software': '💻',
      'Doctor': '🏥',
      'Pharmacy': '💊',
      'Financial': '📊',
      'Television': '📺',
      'Housing': '🏠',
      'Utilities': '💡',
      'Category Pending': '📦'
    };
    return emojiMap[category] || '📦';
  };

  const hasData = transactions.length > 0;

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Month/Year Selector */}
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
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{filteredTransactions.length.toLocaleString()}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💰 Income</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{formatCurrency(totals.income)}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💸 Expenses</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{formatCurrency(totals.expenses)}</div>
            </div>
            <div style={{ background: totals.net >= 0 ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>📊 Net</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{totals.net >= 0 ? '+' : '-'}{formatCurrency(totals.net)}</div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ 
            background: 'rgba(30, 27, 56, 0.8)', 
            borderRadius: '16px', 
            padding: '20px', 
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="🔍 Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="all" style={{ background: '#1e1b38' }}>All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} style={{ background: '#1e1b38' }}>{cat}</option>
              ))}
            </select>

            {/* Type Filter */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { value: 'all', label: 'All' },
                { value: 'expense', label: 'Expenses' },
                { value: 'income', label: 'Income' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setTypeFilter(option.value)}
                  style={{
                    padding: '10px 16px',
                    background: typeFilter === option.value 
                      ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' 
                      : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: typeFilter === option.value ? '600' : '400'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by);
                setSortOrder(order);
              }}
              style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="date-desc" style={{ background: '#1e1b38' }}>Date (Newest)</option>
              <option value="date-asc" style={{ background: '#1e1b38' }}>Date (Oldest)</option>
              <option value="amount-desc" style={{ background: '#1e1b38' }}>Amount (Highest)</option>
              <option value="amount-asc" style={{ background: '#1e1b38' }}>Amount (Lowest)</option>
              <option value="category-asc" style={{ background: '#1e1b38' }}>Category (A-Z)</option>
            </select>
          </div>

          {/* Transactions List */}
          <div style={{ 
            background: 'rgba(30, 27, 56, 0.8)', 
            borderRadius: '20px', 
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '120px 1fr 180px 120px 100px',
              padding: '16px 24px',
              background: 'rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              fontSize: '12px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Date</div>
              <div>Description</div>
              <div>Category</div>
              <div style={{ textAlign: 'right' }}>Amount</div>
              <div style={{ textAlign: 'center' }}>Status</div>
            </div>

            {/* Transaction Rows */}
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {filteredTransactions.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  No transactions match your filters
                </div>
              ) : (
                filteredTransactions.map((tx, index) => {
                  const amount = parseFloat(tx.amount || tx.Amount);
                  const isExpense = amount < 0;
                  const category = tx.category || tx.Category || 'Uncategorized';
                  const date = new Date(tx.date || tx.Date);
                  const status = tx.status || tx.Status || 'Posted';
                  
                  return (
                    <div 
                      key={tx.id || index}
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '120px 1fr 180px 120px 100px',
                        padding: '16px 24px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        alignItems: 'center',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Date */}
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>

                      {/* Description */}
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '2px' }}>
                          {(tx.description || tx.Description || 'Unknown').slice(0, 40)}
                          {(tx.description || tx.Description || '').length > 40 ? '...' : ''}
                        </div>
                      </div>

                      {/* Category */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{getCategoryEmoji(category)}</span>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                          {category.slice(0, 20)}{category.length > 20 ? '...' : ''}
                        </span>
                      </div>

                      {/* Amount */}
                      <div style={{ 
                        textAlign: 'right', 
                        fontWeight: '600',
                        fontSize: '14px',
                        color: isExpense ? '#EF4444' : '#10B981'
                      }}>
                        {isExpense ? '-' : '+'}{formatCurrency(amount)}
                      </div>

                      {/* Status */}
                      <div style={{ textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '500',
                          background: status === 'Posted' 
                            ? 'rgba(16, 185, 129, 0.2)' 
                            : 'rgba(251, 191, 36, 0.2)',
                          color: status === 'Posted' ? '#10B981' : '#FBBF24'
                        }}>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Results count */}
          <div style={{ 
            marginTop: '16px', 
            textAlign: 'center', 
            fontSize: '13px', 
            color: 'rgba(255,255,255,0.5)' 
          }}>
            Showing {filteredTransactions.length.toLocaleString()} of {filteredByDate.length.toLocaleString()} transactions
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        select option {
          background: #1e1b38;
        }
      `}</style>
    </div>
  );
}
