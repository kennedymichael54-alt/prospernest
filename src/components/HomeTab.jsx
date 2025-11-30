import React, { useState, useMemo } from 'react';
import MonthYearSelector from './MonthYearSelector';
import EmptyState from './EmptyState';

// ============================================================================
// HOME TAB - With Month/Year Selector and Dynamic Data
// ============================================================================

// Currency formatter helper - consistent $1,000.00 format
const formatCurrency = (amount, hideValue = false) => {
  if (hideValue) return '••••••';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export default function HomeTab({ 
  transactions = [], 
  bills = [],
  goals = [],
  onNavigateToImport 
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [netWorthHidden, setNetWorthHidden] = useState(false);
  
  // Sort states for Recent Activity and Categories
  const [recentSort, setRecentSort] = useState('high'); // 'high' or 'low'
  const [categorySort, setCategorySort] = useState('high'); // 'high' or 'low'

  // Filter transactions by selected month/year
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      if (selectedMonth === null) {
        // Entire year
        return txDate.getFullYear() === selectedYear;
      }
      return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate totals from filtered transactions
  const income = useMemo(() => {
    return filteredTransactions
      .filter(tx => {
        const amount = parseFloat(tx.amount || tx.Amount);
        return amount > 0;
      })
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
  }, [filteredTransactions]);

  const expenses = useMemo(() => {
    return filteredTransactions
      .filter(tx => {
        const amount = parseFloat(tx.amount || tx.Amount);
        return amount < 0;
      })
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount || tx.Amount)), 0);
  }, [filteredTransactions]);

  const netCashFlow = income - expenses;

  // Group expenses by category (with dynamic sort)
  const categoryBreakdown = useMemo(() => {
    const categories = {};
    filteredTransactions
      .filter(tx => parseFloat(tx.amount || tx.Amount) < 0)
      .forEach(tx => {
        const cat = tx.category || tx.Category || 'Uncategorized';
        if (!categories[cat]) {
          categories[cat] = 0;
        }
        categories[cat] += Math.abs(parseFloat(tx.amount || tx.Amount));
      });
    const sorted = Object.entries(categories)
      .map(([name, amount]) => ({ name, amount }));
    
    if (categorySort === 'high') {
      sorted.sort((a, b) => b.amount - a.amount);
    } else {
      sorted.sort((a, b) => a.amount - b.amount);
    }
    return sorted;
  }, [filteredTransactions, categorySort]);

  // Recent transactions (last 5, with dynamic sort)
  const recentTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    if (recentSort === 'high') {
      sorted.sort((a, b) => Math.abs(parseFloat(b.amount || b.Amount)) - Math.abs(parseFloat(a.amount || a.Amount)));
    } else {
      sorted.sort((a, b) => Math.abs(parseFloat(a.amount || a.Amount)) - Math.abs(parseFloat(b.amount || b.Amount)));
    }
    return sorted.slice(0, 5);
  }, [filteredTransactions, recentSort]);

  const hasData = transactions.length > 0;
  const hasFilteredData = filteredTransactions.length > 0;

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
      'Television': '📺'
    };
    return emojiMap[category] || '📦';
  };

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
        /* No data at all - show import prompt */
        <EmptyState
          icon="📂"
          title="No transactions imported"
          message="Import your bank transactions to see your financial dashboard come to life!"
          actionLabel="📥 Import Data"
          onAction={onNavigateToImport}
        />
      ) : !hasFilteredData ? (
        /* Has data but none for selected period */
        <EmptyState
          icon="📅"
          title="No data for this period"
          message={`No transactions found for ${selectedMonth !== null ? new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' }) + ' ' : ''}${selectedYear}. Try selecting a different month or year.`}
        />
      ) : (
        /* Has data - show dashboard */
        <>
          {/* TOP SECTION - Hero Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
            {/* Income Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, #10B981, #059669)', 
              borderRadius: '20px', 
              padding: '24px', 
              position: 'relative', 
              overflow: 'hidden' 
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>💰 Income</div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{formatCurrency(income, netWorthHidden)}</div>
            </div>

            {/* Expenses Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, #EF4444, #DC2626)', 
              borderRadius: '20px', 
              padding: '24px', 
              position: 'relative', 
              overflow: 'hidden' 
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>💸 Expenses</div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{formatCurrency(expenses, netWorthHidden)}</div>
            </div>

            {/* Net Cash Flow Card */}
            <div style={{ 
              background: netCashFlow >= 0 
                ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
                : 'linear-gradient(135deg, #F59E0B, #D97706)', 
              borderRadius: '20px', 
              padding: '24px', 
              position: 'relative', 
              overflow: 'hidden' 
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                📊 Net Cash Flow
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>
                {netWorthHidden ? '••••••' : (netCashFlow >= 0 ? '+' : '-') + formatCurrency(Math.abs(netCashFlow))}
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION - Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            {/* Recent Activity */}
            <div style={{ 
              background: 'rgba(30, 27, 56, 0.8)', 
              backdropFilter: 'blur(20px)', 
              borderRadius: '20px', 
              padding: '24px', 
              border: '1px solid rgba(255,255,255,0.1)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '20px' }}>💳</span>
                <span style={{ fontWeight: '600' }}>Recent Activity</span>
                
                {/* Sort Buttons */}
                <div style={{ display: 'flex', gap: '4px', marginLeft: '12px' }}>
                  <button
                    onClick={() => setRecentSort('high')}
                    style={{
                      padding: '4px 8px',
                      background: recentSort === 'high' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Sort High to Low"
                  >
                    ↓ High
                  </button>
                  <button
                    onClick={() => setRecentSort('low')}
                    style={{
                      padding: '4px 8px',
                      background: recentSort === 'low' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Sort Low to High"
                  >
                    ↑ Low
                  </button>
                </div>
                
                <span style={{ 
                  marginLeft: 'auto', 
                  fontSize: '12px', 
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {filteredTransactions.length} transactions
                </span>
              </div>
              {recentTransactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.5)' }}>
                  No transactions for this period
                </div>
              ) : (
                recentTransactions.map((tx, i) => {
                  const amount = parseFloat(tx.amount || tx.Amount);
                  const category = tx.category || tx.Category || 'Uncategorized';
                  const description = tx.description || tx.Description || 'Unknown';
                  
                  return (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '12px', 
                      background: 'rgba(255,255,255,0.05)', 
                      borderRadius: '12px', 
                      marginBottom: '8px' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{getCategoryEmoji(category)}</span>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '14px' }}>
                            {description.length > 25 ? description.slice(0, 25) + '...' : description}
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{category}</div>
                        </div>
                      </div>
                      <span style={{ 
                        fontWeight: '600', 
                        color: amount >= 0 ? '#10B981' : 'white' 
                      }}>
                        {amount >= 0 ? '+' : '-'}{formatCurrency(Math.abs(amount))}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Spending by Category */}
            <div style={{ 
              background: 'rgba(30, 27, 56, 0.8)', 
              backdropFilter: 'blur(20px)', 
              borderRadius: '20px', 
              padding: '24px', 
              border: '1px solid rgba(255,255,255,0.1)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                <span style={{ fontWeight: '600' }}>Top Spending Categories</span>
                
                {/* Sort Buttons */}
                <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                  <button
                    onClick={() => setCategorySort('high')}
                    style={{
                      padding: '4px 8px',
                      background: categorySort === 'high' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Sort High to Low"
                  >
                    ↓ High
                  </button>
                  <button
                    onClick={() => setCategorySort('low')}
                    style={{
                      padding: '4px 8px',
                      background: categorySort === 'low' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Sort Low to High"
                  >
                    ↑ Low
                  </button>
                </div>
              </div>
              {categoryBreakdown.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.5)' }}>
                  No expense data for this period
                </div>
              ) : (
                categoryBreakdown.slice(0, 6).map((cat, i) => {
                  const percentage = expenses > 0 ? (cat.amount / expenses) * 100 : 0;
                  const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];
                  
                  return (
                    <div key={cat.name} style={{ marginBottom: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '6px',
                        fontSize: '14px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getCategoryEmoji(cat.name)} {cat.name}
                        </span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(cat.amount)}</span>
                      </div>
                      <div style={{ 
                        height: '8px', 
                        background: 'rgba(255,255,255,0.1)', 
                        borderRadius: '4px', 
                        overflow: 'hidden' 
                      }}>
                        <div style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          background: colors[i % colors.length],
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* Quick Stats */}
            <div style={{ 
              background: 'rgba(30, 27, 56, 0.8)', 
              backdropFilter: 'blur(20px)', 
              borderRadius: '20px', 
              padding: '24px', 
              border: '1px solid rgba(255,255,255,0.1)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <span style={{ fontWeight: '600' }}>Quick Stats</span>
                <span style={{ 
                  marginLeft: 'auto', 
                  fontSize: '11px', 
                  color: '#EC4899',
                  background: 'rgba(236, 72, 153, 0.15)',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {selectedMonth !== null 
                    ? new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'short' }) + ' ' + selectedYear
                    : selectedYear
                  }
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '10px' 
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Transactions</span>
                  <span style={{ fontWeight: '600' }}>{filteredTransactions.length.toLocaleString()}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '10px' 
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Avg. Transaction</span>
                  <span style={{ fontWeight: '600' }}>
                    {formatCurrency(expenses / (filteredTransactions.filter(t => parseFloat(t.amount || t.Amount) < 0).length || 1))}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '10px' 
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Categories</span>
                  <span style={{ fontWeight: '600' }}>{categoryBreakdown.length}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px', 
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))', 
                  borderRadius: '10px',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>📊 Total All-Time</span>
                  <span style={{ fontWeight: '600', color: '#EC4899' }}>{transactions.length.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Savings Rate */}
            <div style={{ 
              background: 'rgba(30, 27, 56, 0.8)', 
              backdropFilter: 'blur(20px)', 
              borderRadius: '20px', 
              padding: '24px', 
              border: '1px solid rgba(255,255,255,0.1)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '20px' }}>💎</span>
                <span style={{ fontWeight: '600' }}>Savings Rate</span>
              </div>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: '700', 
                  background: income > 0 && netCashFlow > 0 
                    ? 'linear-gradient(135deg, #10B981, #14B8A6)' 
                    : 'linear-gradient(135deg, #EF4444, #F59E0B)',
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}>
                  {income > 0 ? ((netCashFlow / income) * 100).toFixed(1) : '0.0'}%
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px', fontSize: '14px' }}>
                  {netCashFlow >= 0 ? 'You\'re saving money! 🎉' : 'Spending more than earning ⚠️'}
                </div>
              </div>
            </div>

            {/* Goals Preview */}
            <div style={{ 
              background: 'rgba(30, 27, 56, 0.8)', 
              backdropFilter: 'blur(20px)', 
              borderRadius: '20px', 
              padding: '24px', 
              border: '1px solid rgba(255,255,255,0.1)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '20px' }}>🎯</span>
                <span style={{ fontWeight: '600' }}>Goals</span>
              </div>
              {goals.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '30px 20px', 
                  color: 'rgba(255,255,255,0.5)' 
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
                  <div style={{ fontSize: '14px' }}>No goals set yet</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Add goals in the Goals tab</div>
                </div>
              ) : (
                goals.slice(0, 3).map((goal, i) => (
                  <div key={i} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                      <span>{goal.emoji} {goal.name}</span>
                      <span style={{ color: '#8B5CF6' }}>{((goal.current / goal.target) * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min((goal.current / goal.target) * 100, 100)}%`, 
                        height: '100%', 
                        background: goal.color || '#8B5CF6',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                ))
              )}
            </div>
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
