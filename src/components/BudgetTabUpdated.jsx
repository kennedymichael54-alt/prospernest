import React, { useState, useMemo } from 'react';
import MonthYearSelector from './MonthYearSelector';
import EmptyState from './EmptyState';

// ============================================================================
// BUDGET TAB - With Month/Year Selector and Dynamic Data
// ============================================================================

// Currency formatter helper - consistent $1,000.00 format
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export default function BudgetTab({ 
  transactions = [],
  onNavigateToImport 
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [budgets, setBudgets] = useState({});
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', budget: '', emoji: '📦' });

  // Filter transactions by selected month/year
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      if (selectedMonth === null) {
        return txDate.getFullYear() === selectedYear;
      }
      return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate income (positive amounts)
  const income = useMemo(() => {
    return filteredTransactions
      .filter(tx => parseFloat(tx.amount || tx.Amount) > 0)
      .reduce((sum, tx) => sum + parseFloat(tx.amount || tx.Amount), 0);
  }, [filteredTransactions]);

  // Calculate expenses (negative amounts) 
  const expenses = useMemo(() => {
    return filteredTransactions
      .filter(tx => parseFloat(tx.amount || tx.Amount) < 0)
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
  }, [filteredTransactions]);

  const surplus = income - expenses;

  // Group spending by category
  const categorySpending = useMemo(() => {
    const categories = {};
    filteredTransactions
      .filter(tx => parseFloat(tx.amount || tx.Amount) < 0)
      .forEach(tx => {
        const cat = tx.category || tx.Category || 'Uncategorized';
        if (!categories[cat]) {
          categories[cat] = { spent: 0, transactions: [] };
        }
        categories[cat].spent += Math.abs(parseFloat(tx.amount || tx.Amount));
        categories[cat].transactions.push(tx);
      });
    
    return Object.entries(categories)
      .map(([name, data]) => ({
        name,
        spent: data.spent,
        budget: budgets[name] || 0,
        transactionCount: data.transactions.length
      }))
      .sort((a, b) => b.spent - a.spent);
  }, [filteredTransactions, budgets]);

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
      'Salary': '💵'
    };
    return emojiMap[category] || '📦';
  };

  // Set budget for a category
  const setBudgetForCategory = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      [category]: parseFloat(amount) || 0
    }));
  };

  // Delete a category budget
  const deleteCategoryBudget = (category) => {
    setBudgets(prev => {
      const newBudgets = { ...prev };
      delete newBudgets[category];
      return newBudgets;
    });
  };

  const hasData = transactions.length > 0;
  const hasFilteredData = filteredTransactions.length > 0;

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
          message="Import your bank transactions to track your budget and spending by category."
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
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
            {/* Income */}
            <div style={{ 
              background: 'linear-gradient(135deg, #10B981, #059669)', 
              borderRadius: '20px', 
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💰 Income</div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{formatCurrency(income)}</div>
            </div>

            {/* Expenses */}
            <div style={{ 
              background: 'linear-gradient(135deg, #EF4444, #DC2626)', 
              borderRadius: '20px', 
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💸 Expenses</div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{formatCurrency(expenses)}</div>
            </div>

            {/* Surplus */}
            <div style={{ 
              background: surplus >= 0 
                ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' 
                : 'linear-gradient(135deg, #F59E0B, #EF4444)', 
              borderRadius: '20px', 
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>✨ Surplus</div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>
                {surplus >= 0 ? '+' : ''}{formatCurrency(surplus)}
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div style={{ 
            background: 'rgba(30, 27, 56, 0.8)', 
            backdropFilter: 'blur(20px)', 
            borderRadius: '20px', 
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '24px' 
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Categories</h3>
              <button
                onClick={() => setShowAddCategory(true)}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                + Add Category
              </button>
            </div>

            {categorySpending.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                No spending categories found for this period
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {categorySpending.map((cat, i) => {
                  const hasBudget = cat.budget > 0;
                  const percentage = hasBudget ? (cat.spent / cat.budget) * 100 : 0;
                  const isOverBudget = percentage > 100;
                  
                  return (
                    <div 
                      key={cat.name}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '20px',
                        border: isOverBudget ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{getCategoryEmoji(cat.name)}</span>
                          <div>
                            <div style={{ fontWeight: '600' }}>{cat.name}</div>
                            <div style={{ 
                              fontSize: '13px', 
                              color: isOverBudget ? '#EF4444' : 'rgba(255,255,255,0.5)' 
                            }}>
                              {formatCurrency(cat.spent)} {hasBudget ? `/ ${formatCurrency(cat.budget)}` : ''}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {!hasBudget ? (
                            <input
                              type="number"
                              placeholder="Set budget"
                              onBlur={(e) => setBudgetForCategory(cat.name, e.target.value)}
                              style={{
                                width: '100px',
                                padding: '8px 12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '13px'
                              }}
                            />
                          ) : (
                            <button
                              onClick={() => deleteCategoryBudget(cat.name)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#EF4444',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div style={{ 
                        height: '8px', 
                        background: 'rgba(255,255,255,0.1)', 
                        borderRadius: '4px', 
                        overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          width: hasBudget ? `${Math.min(percentage, 100)}%` : '100%', 
                          height: '100%', 
                          background: !hasBudget 
                            ? 'linear-gradient(90deg, #8B5CF6, #EC4899)'
                            : isOverBudget 
                              ? 'linear-gradient(90deg, #EF4444, #F97316)' 
                              : percentage > 80 
                                ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                                : 'linear-gradient(90deg, #10B981, #14B8A6)',
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
