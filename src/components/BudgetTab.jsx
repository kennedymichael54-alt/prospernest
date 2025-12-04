import React, { useState, useMemo } from 'react';

const BudgetTab = ({ transactions = [], onNavigateToImport, theme, lastImportDate }) => {
  const isDark = theme?.mode === 'dark';
  const [sortBy, setSortBy] = useState('highest');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Collapsible sections state (matching Dashboard pattern)
  const [collapsedSections, setCollapsedSections] = useState({
    spendingBreakdown: false,
    categoryAnalysis: false
  });
  
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  };

  // Calculate spending by category
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => parseFloat(t.amount) < 0);
    const categorySpending = {};
    
    expenses.forEach(t => {
      const cat = t.category || 'Uncategorized';
      if (!categorySpending[cat]) {
        categorySpending[cat] = { spent: 0, transactions: [] };
      }
      categorySpending[cat].spent += Math.abs(parseFloat(t.amount));
      categorySpending[cat].transactions.push(t);
    });

    // Create array with budget estimates
    const categories = Object.entries(categorySpending).map(([name, data]) => ({
      name,
      spent: data.spent,
      budget: data.spent * 1.2, // Estimate budget as 120% of spending
      transactions: data.transactions.length
    }));

    // Sort based on selection
    if (sortBy === 'highest') {
      categories.sort((a, b) => b.spent - a.spent);
    } else if (sortBy === 'lowest') {
      categories.sort((a, b) => a.spent - b.spent);
    } else if (sortBy === 'alphabetical') {
      categories.sort((a, b) => a.name.localeCompare(b.name));
    }

    return categories;
  }, [transactions, sortBy]);

  // Calculate monthly data for stacked bar chart
  const monthlyStackedData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Get top 4 categories for stacked display
    const topCategories = [...categoryData].sort((a, b) => b.spent - a.spent).slice(0, 4);
    const categoryNames = topCategories.map(c => c.name);
    
    // Colors for stacked bars (matching the reference image)
    const stackColors = ['#6366F1', '#8B5CF6', '#06B6D4', '#FCD34D'];
    
    const monthData = months.map((month, idx) => {
      const monthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === idx && d.getFullYear() === currentYear && parseFloat(t.amount) < 0;
      });
      
      const categoryBreakdown = {};
      categoryNames.forEach(cat => {
        categoryBreakdown[cat] = 0;
      });
      categoryBreakdown['Other'] = 0;
      
      monthTransactions.forEach(t => {
        const cat = t.category || 'Uncategorized';
        if (categoryNames.includes(cat)) {
          categoryBreakdown[cat] += Math.abs(parseFloat(t.amount));
        } else {
          categoryBreakdown['Other'] += Math.abs(parseFloat(t.amount));
        }
      });
      
      const total = Object.values(categoryBreakdown).reduce((sum, val) => sum + val, 0);
      
      return {
        month,
        total,
        breakdown: categoryBreakdown,
        budget: total * 1.1 // Estimated budget
      };
    });
    
    return { monthData, categoryNames: [...categoryNames, 'Other'], colors: [...stackColors, '#D1D5DB'] };
  }, [transactions, categoryData]);

  // Total budget and spent
  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudget = categoryData.reduce((sum, cat) => sum + cat.budget, 0);

  // Stacked Bar Chart Component
  const StackedBarChart = ({ data, categories, colors, height = 350 }) => {
    const maxTotal = Math.max(...data.map(d => Math.max(d.total, d.budget)));
    const barWidth = 45;
    const gap = 25;
    const chartWidth = data.length * (barWidth + gap);
    const padding = { top: 20, right: 20, bottom: 50, left: 20 };
    
    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg width={Math.max(chartWidth + padding.left + padding.right, 700)} height={height} style={{ display: 'block' }}>
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={padding.top + (1 - tick) * (height - padding.top - padding.bottom)}
                x2={chartWidth + padding.left}
                y2={padding.top + (1 - tick) * (height - padding.top - padding.bottom)}
                stroke={theme.borderLight}
                strokeDasharray="4,4"
              />
            </g>
          ))}
          
          {/* Bars */}
          {data.map((monthData, monthIdx) => {
            const x = padding.left + monthIdx * (barWidth + gap) + gap / 2;
            let currentY = height - padding.bottom;
            
            return (
              <g key={monthIdx}>
                {/* Stacked segments */}
                {categories.map((cat, catIdx) => {
                  const value = monthData.breakdown[cat] || 0;
                  const segmentHeight = maxTotal > 0 ? (value / maxTotal) * (height - padding.top - padding.bottom) : 0;
                  const y = currentY - segmentHeight;
                  currentY = y;
                  
                  return (
                    <rect
                      key={cat}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={segmentHeight}
                      fill={colors[catIdx]}
                      rx={catIdx === categories.length - 1 ? 6 : 0}
                      ry={catIdx === categories.length - 1 ? 6 : 0}
                    />
                  );
                })}
                
                {/* Budget line marker */}
                <line
                  x1={x - 5}
                  y1={height - padding.bottom - (monthData.budget / maxTotal) * (height - padding.top - padding.bottom)}
                  x2={x + barWidth + 5}
                  y2={height - padding.bottom - (monthData.budget / maxTotal) * (height - padding.top - padding.bottom)}
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="4,2"
                />
                
                {/* Month label */}
                <text
                  x={x + barWidth / 2}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fill={theme.textMuted}
                  fontSize="12"
                >
                  {monthData.month}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
          {categories.map((cat, i) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors[i] }} />
              <span style={{ fontSize: '13px', color: theme.textSecondary }}>{cat}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '2px', background: '#F59E0B', borderTop: '2px dashed #F59E0B' }} />
            <span style={{ fontSize: '13px', color: theme.textSecondary }}>Budget</span>
          </div>
        </div>
      </div>
    );
  };

  // If no transactions, show empty state
  if (transactions.length === 0) {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px', letterSpacing: '-0.5px' }}>Budget</h1>
            <p style={{ fontSize: '14px', color: theme.textMuted }}>Track your spending against budgets</p>
          </div>
          {lastImportDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#10B98115', borderRadius: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>
                Last import: {new Date(lastImportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>
        
        <div style={{ 
          background: theme.bgCard, 
          borderRadius: '16px', 
          padding: '60px 24px', 
          textAlign: 'center',
          boxShadow: theme.cardShadow,
          border: `1px solid ${theme.borderLight}`
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>
            No Budget Data Yet
          </h3>
          <p style={{ color: theme.textMuted, marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Import your transactions to see spending breakdowns and budget comparisons.
          </p>
          <button
            onClick={onNavigateToImport}
            style={{
              background: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Import Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px', letterSpacing: '-0.5px' }}>Budget</h1>
          <p style={{ fontSize: '14px', color: theme.textMuted }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        {lastImportDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#10B98115', borderRadius: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>
              Last import: {new Date(lastImportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Summary Cards with Gradients - 3 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Total Budget Card - Cyan */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #164E63 0%, #0E4A5C 100%)' : 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 188, 212, 0.15)',
          border: `1px solid ${isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>💰</div>
            <span style={{ fontSize: '14px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Total Budget</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064' }}>{formatCurrency(totalBudget)}</div>
        </div>
        
        {/* Total Spent Card - Orange */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, #7C2D12 0%, #6B2A0F 100%)' : 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
          border: `1px solid ${isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>💳</div>
            <span style={{ fontSize: '14px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '600' }}>Total Spent</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C' }}>{formatCurrency(totalSpent)}</div>
        </div>
        
        {/* Remaining Card - Green or Red based on positive/negative */}
        <div style={{
          background: totalBudget - totalSpent >= 0 
            ? (isDark ? 'linear-gradient(135deg, #14532D 0%, #115E2B 100%)' : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)')
            : (isDark ? 'linear-gradient(135deg, #7F1D1D 0%, #6B1A1A 100%)' : 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)'),
          borderRadius: '20px',
          padding: '20px',
          boxShadow: totalBudget - totalSpent >= 0 
            ? '0 4px 20px rgba(76, 175, 80, 0.15)' 
            : '0 4px 20px rgba(239, 68, 68, 0.15)',
          border: `1px solid ${totalBudget - totalSpent >= 0 
            ? (isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)')
            : (isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)')}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: totalBudget - totalSpent >= 0 
                ? (isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)')
                : (isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'),
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
            }}>📊</div>
            <span style={{ fontSize: '14px', color: totalBudget - totalSpent >= 0 
              ? (isDark ? '#86EFAC' : '#2E7D32') 
              : (isDark ? '#FCA5A5' : '#C62828'), fontWeight: '600' }}>Remaining</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: totalBudget - totalSpent >= 0 
            ? (isDark ? '#E8F5E9' : '#1B5E20') 
            : (isDark ? '#FFEBEE' : '#B71C1C') }}>
            {formatCurrency(totalBudget - totalSpent)}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MONTHLY SPENDING BREAKDOWN (Collapsible Section) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('spendingBreakdown')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.spendingBreakdown ? '24px' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #8B5CF6 0%, #06B6D4 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Monthly Spending Breakdown</h2>
        <span style={{ 
          fontSize: '12px', 
          color: theme.textMuted,
          background: theme.bgMain,
          padding: '4px 10px',
          borderRadius: '6px'
        }}>Compare actual vs budget</span>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.spendingBreakdown ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Stacked Bar Chart Card */}
      {!collapsedSections.spendingBreakdown && (
      <div style={{ 
        background: theme.bgCard, 
        borderRadius: '16px', 
        padding: '24px', 
        boxShadow: theme.cardShadow,
        border: `1px solid ${theme.borderLight}`,
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Gradient top accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)'
        }} />
        <StackedBarChart 
          data={monthlyStackedData.monthData} 
          categories={monthlyStackedData.categoryNames}
          colors={monthlyStackedData.colors}
          height={380}
        />
      </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CATEGORY ANALYSIS (Collapsible Section) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('categoryAnalysis')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.categoryAnalysis ? '0' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #EC4899 0%, #F59E0B 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Category Analysis</h2>
        <span style={{ 
          fontSize: '12px', 
          color: theme.textMuted,
          background: theme.bgMain,
          padding: '4px 10px',
          borderRadius: '6px'
        }}>{categoryData.length} categories</span>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.categoryAnalysis ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Categories Grid - 2 Equal Columns */}
      {!collapsedSections.categoryAnalysis && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Categories - Actual vs Budget */}
        <div style={{ 
          background: theme.bgCard, 
          borderRadius: '16px', 
          padding: '20px', 
          boxShadow: theme.cardShadow,
          border: `1px solid ${theme.borderLight}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Gradient top accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>
              Categories - Actual vs Budget
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: theme.bgMain,
                border: `1px solid ${theme.borderLight}`,
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
                color: theme.textPrimary,
                cursor: 'pointer'
              }}
            >
              <option value="highest">Highest Spent</option>
              <option value="lowest">Lowest Spent</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categoryData.slice(0, 6).map((cat, i) => {
              const percentage = Math.min(100, (cat.spent / cat.budget) * 100);
              const isOverBudget = cat.spent > cat.budget;
              
              return (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{cat.name}</span>
                    <span style={{ fontSize: '14px', color: isOverBudget ? '#EF4444' : theme.textSecondary }}>
                      {formatCurrency(cat.spent)} / {formatCurrency(cat.budget)}
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    background: theme.borderLight, 
                    borderRadius: '4px', 
                    overflow: 'hidden' 
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: isOverBudget ? '#EF4444' : percentage > 80 ? '#F59E0B' : '#10B981',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: theme.textMuted }}>{cat.transactions} transactions</span>
                    <span style={{ fontSize: '11px', color: isOverBudget ? '#EF4444' : theme.textMuted }}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution - Pie Chart */}
        <div style={{ 
          background: theme.bgCard, 
          borderRadius: '16px', 
          padding: '20px', 
          boxShadow: theme.cardShadow,
          border: `1px solid ${theme.borderLight}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Gradient top accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>
              Category Distribution
            </h3>
          </div>
          
          {/* Pie chart representation */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {(() => {
                const total = categoryData.reduce((sum, cat) => sum + cat.spent, 0);
                let currentAngle = -90;
                const colors = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#9CA3AF'];
                
                return categoryData.slice(0, 6).map((cat, i) => {
                  const percentage = cat.spent / total;
                  const angle = percentage * 360;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angle;
                  currentAngle = endAngle;
                  
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 100 + 80 * Math.cos(startRad);
                  const y1 = 100 + 80 * Math.sin(startRad);
                  const x2 = 100 + 80 * Math.cos(endRad);
                  const y2 = 100 + 80 * Math.sin(endRad);
                  
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  return (
                    <path
                      key={cat.name}
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={colors[i % colors.length]}
                      stroke={theme.bgCard}
                      strokeWidth="2"
                    />
                  );
                });
              })()}
              <circle cx="100" cy="100" r="50" fill={theme.bgCard} />
              <text x="100" y="95" textAnchor="middle" fill={theme.textPrimary} fontSize="20" fontWeight="700">
                {formatCurrency(totalSpent).replace('$', '')}
              </text>
              <text x="100" y="115" textAnchor="middle" fill={theme.textMuted} fontSize="11">
                Total Spent
              </text>
            </svg>
          </div>
          
          {/* Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {categoryData.slice(0, 6).map((cat, i) => {
              const colors = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
              const percentage = ((cat.spent / totalSpent) * 100).toFixed(1);
              
              return (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: colors[i % colors.length], flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: theme.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.name}
                  </span>
                  <span style={{ fontSize: '12px', color: theme.textMuted, marginLeft: 'auto' }}>{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default BudgetTab;
