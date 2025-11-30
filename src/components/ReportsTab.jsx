import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// REPORTS TAB - Cash Flow (Sankey), Spending (Pie), Income (Bar) Reports
// ============================================================================

// Currency formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));
};

// Color palette for charts
const COLORS = [
  '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', 
  '#EF4444', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
  '#06B6D4', '#A855F7', '#22C55E', '#FBBF24', '#2563EB'
];

// Category emoji map
const categoryEmojiMap = {
  'Groceries': '🛒', 'Food': '🍔', 'Fast Food': '🍟', 'Restaurants': '🍽️',
  'Gas': '⛽', 'Auto & Transport': '🚗', 'Shopping': '🛍️', 'Entertainment': '🎬',
  'Transfer': '💸', 'Income': '💰', 'Hobbies': '🎮', 'Electronics & Software': '💻',
  'Doctor': '🏥', 'Healthcare': '🏥', 'Pharmacy': '💊', 'Financial': '📊',
  'Television': '📺', 'Subscriptions': '📺', 'Housing': '🏠', 'Rent': '🏠',
  'Utilities': '💡', 'Personal': '👤', 'Education': '📚', 'Travel': '✈️',
  'Fitness': '💪', 'Pets': '🐾', 'Gifts': '🎁', 'Insurance': '🛡️',
  'Taxes': '📋', 'Investments': '📈', 'Savings': '🏦', 'Paychecks': '💵',
  'Business Income': '💼', 'Interest': '🏦'
};

// Empty State Component
function EmptyState({ icon, title, message, actionLabel, onAction }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '60px 40px', 
      textAlign: 'center', 
      background: 'rgba(30, 27, 56, 0.5)', 
      borderRadius: '20px', 
      border: '1px dashed rgba(255,255,255,0.2)' 
    }}>
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

// ============================================================================
// SANKEY DIAGRAM COMPONENT - Cash Flow Visualization
// ============================================================================

function SankeyDiagram({ incomeByCategory, expensesByCategory, totalIncome, totalExpenses }) {
  const svgWidth = 900;
  const svgHeight = 500;
  const nodeWidth = 20;
  const nodePadding = 15;
  
  // Build nodes and links
  const incomeNodes = Object.entries(incomeByCategory)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);
  
  const expenseNodes = Object.entries(expensesByCategory)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 expense categories
  
  // Calculate positions
  const leftX = 50;
  const centerX = svgWidth / 2 - nodeWidth / 2;
  const rightX = svgWidth - 50 - nodeWidth;
  
  // Income nodes (left side)
  const incomeNodeHeight = incomeNodes.length > 0 
    ? (svgHeight - (incomeNodes.length - 1) * nodePadding) / incomeNodes.length 
    : 0;
  
  // Expense nodes (right side)  
  const expenseNodeHeight = expenseNodes.length > 0
    ? (svgHeight - (expenseNodes.length - 1) * nodePadding) / expenseNodes.length
    : 0;
  
  // Center node (Total Income)
  const centerNodeHeight = svgHeight * 0.6;
  const centerNodeY = (svgHeight - centerNodeHeight) / 2;

  // Generate curved path
  const generatePath = (x1, y1, h1, x2, y2, h2, flowHeight) => {
    const startY = y1 + (h1 - flowHeight) / 2 + flowHeight / 2;
    const endY = y2 + (h2 - flowHeight) / 2 + flowHeight / 2;
    const midX = (x1 + x2) / 2;
    
    return `M ${x1} ${startY - flowHeight/2} 
            C ${midX} ${startY - flowHeight/2}, ${midX} ${endY - flowHeight/2}, ${x2} ${endY - flowHeight/2}
            L ${x2} ${endY + flowHeight/2}
            C ${midX} ${endY + flowHeight/2}, ${midX} ${startY + flowHeight/2}, ${x1} ${startY + flowHeight/2}
            Z`;
  };

  return (
    <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ maxHeight: '500px' }}>
      <defs>
        <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.6"/>
        </linearGradient>
      </defs>

      {/* Income Flows (Left to Center) */}
      {incomeNodes.map(([category, amount], i) => {
        const y = i * (incomeNodeHeight + nodePadding);
        const flowHeight = Math.max(4, (amount / totalIncome) * centerNodeHeight * 0.9);
        const nodeH = incomeNodeHeight;
        
        return (
          <g key={`income-${category}`}>
            {/* Flow path */}
            <path
              d={generatePath(leftX + nodeWidth, y, nodeH, centerX, centerNodeY, centerNodeHeight, flowHeight)}
              fill="url(#incomeGradient)"
            />
            {/* Node rect */}
            <rect
              x={leftX}
              y={y}
              width={nodeWidth}
              height={nodeH}
              fill="#10B981"
              rx="4"
            />
            {/* Label */}
            <text x={leftX - 10} y={y + nodeH / 2} textAnchor="end" fill="white" fontSize="11" dominantBaseline="middle">
              {categoryEmojiMap[category] || '💵'} {category}
            </text>
            <text x={leftX - 10} y={y + nodeH / 2 + 14} textAnchor="end" fill="rgba(255,255,255,0.6)" fontSize="10" dominantBaseline="middle">
              {formatCurrency(amount)} ({((amount / totalIncome) * 100).toFixed(1)}%)
            </text>
          </g>
        );
      })}

      {/* Center Node (Total Income) */}
      <rect
        x={centerX}
        y={centerNodeY}
        width={nodeWidth}
        height={centerNodeHeight}
        fill="linear-gradient(180deg, #10B981, #14B8A6)"
        rx="6"
      />
      <text x={centerX + nodeWidth / 2} y={centerNodeY - 20} textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
        Income
      </text>
      <text x={centerX + nodeWidth / 2} y={centerNodeY - 5} textAnchor="middle" fill="#10B981" fontSize="12">
        {formatCurrency(totalIncome)}
      </text>

      {/* Expense Flows (Center to Right) */}
      {expenseNodes.map(([category, amount], i) => {
        const y = i * (expenseNodeHeight + nodePadding);
        const flowHeight = Math.max(4, (amount / totalExpenses) * centerNodeHeight * 0.9);
        const nodeH = expenseNodeHeight;
        
        return (
          <g key={`expense-${category}`}>
            {/* Flow path */}
            <path
              d={generatePath(centerX + nodeWidth, centerNodeY, centerNodeHeight, rightX, y, nodeH, flowHeight)}
              fill={`url(#expenseGradient)`}
              opacity="0.7"
            />
            {/* Node rect */}
            <rect
              x={rightX}
              y={y}
              width={nodeWidth}
              height={nodeH}
              fill={COLORS[i % COLORS.length]}
              rx="4"
            />
            {/* Label */}
            <text x={rightX + nodeWidth + 10} y={y + nodeH / 2} textAnchor="start" fill="white" fontSize="11" dominantBaseline="middle">
              {categoryEmojiMap[category] || '📦'} {category}
            </text>
            <text x={rightX + nodeWidth + 10} y={y + nodeH / 2 + 14} textAnchor="start" fill="rgba(255,255,255,0.6)" fontSize="10" dominantBaseline="middle">
              {formatCurrency(amount)} ({((amount / totalExpenses) * 100).toFixed(1)}%)
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// DONUT CHART COMPONENT - Spending Visualization
// ============================================================================

function DonutChart({ data, total, title }) {
  const size = 220;
  const strokeWidth = 35;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let accumulatedOffset = 0;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Data segments */}
          {data.map((item, i) => {
            const percentage = item.amount / total;
            const dashLength = percentage * circumference;
            const dashOffset = -accumulatedOffset;
            accumulatedOffset += dashLength;
            
            return (
              <circle
                key={item.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            );
          })}
        </svg>
        {/* Center text */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>{formatCurrency(total)}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Total</div>
        </div>
      </div>
      
      {/* Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '400px' }}>
        {data.slice(0, 10).map((item, i) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '3px', 
              background: COLORS[i % COLORS.length],
              flexShrink: 0
            }} />
            <div style={{ fontSize: '12px', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {categoryEmojiMap[item.name] || '📦'} {item.name}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginLeft: 'auto' }}>
              {((item.amount / total) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BAR CHART COMPONENT - Income Over Time
// ============================================================================

function BarChart({ data, title }) {
  const maxValue = Math.max(...data.map(d => d.total), 1);
  const barHeight = 300;
  
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: barHeight, padding: '20px 0' }}>
        {data.map((item, i) => (
          <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {/* Stacked bars */}
            <div style={{ 
              width: '100%', 
              maxWidth: '60px',
              height: `${(item.total / maxValue) * (barHeight - 40)}px`,
              background: 'linear-gradient(180deg, #10B981, #14B8A6)',
              borderRadius: '6px 6px 0 0',
              position: 'relative',
              minHeight: item.total > 0 ? '20px' : '0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              overflow: 'hidden'
            }}>
              {item.breakdown && item.breakdown.map((cat, j) => (
                <div 
                  key={cat.name}
                  style={{
                    height: `${(cat.amount / item.total) * 100}%`,
                    background: COLORS[j % COLORS.length],
                    minHeight: cat.amount > 0 ? '4px' : '0'
                  }}
                  title={`${cat.name}: ${formatCurrency(cat.amount)}`}
                />
              ))}
            </div>
            {/* Value label */}
            <div style={{ fontSize: '11px', color: 'white', fontWeight: '600', textAlign: 'center' }}>
              {formatCurrency(item.total)}
            </div>
            {/* Month label */}
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{item.label}</div>
          </div>
        ))}
      </div>
      
      {/* Legend for income categories */}
      {data[0]?.breakdown && (
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          {[...new Set(data.flatMap(d => d.breakdown?.map(b => b.name) || []))].slice(0, 5).map((name, i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: COLORS[i % COLORS.length] }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>{categoryEmojiMap[name] || '💵'} {name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// REPORT CARD COMPONENT
// ============================================================================

function ReportCard({ report, index, onMoveUp, onMoveDown, isFirst, isLast, onPin, isPinned, children }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div style={{ 
      background: 'rgba(30, 27, 56, 0.8)', 
      backdropFilter: 'blur(20px)', 
      borderRadius: '20px', 
      border: isPinned ? '2px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden',
      marginBottom: '24px'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px 24px', 
        borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.1)' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Drag handle / Pin indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button 
            onClick={onMoveUp} 
            disabled={isFirst}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: isFirst ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', 
              cursor: isFirst ? 'default' : 'pointer',
              fontSize: '12px',
              padding: '2px'
            }}
          >
            ▲
          </button>
          <button 
            onClick={onMoveDown}
            disabled={isLast}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: isLast ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', 
              cursor: isLast ? 'default' : 'pointer',
              fontSize: '12px',
              padding: '2px'
            }}
          >
            ▼
          </button>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{report.icon}</span>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: 'white' }}>{report.title}</h3>
            {isPinned && <span style={{ fontSize: '14px' }}>📌</span>}
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>{report.description}</p>
        </div>
        
        <button
          onClick={onPin}
          style={{
            padding: '8px 12px',
            background: isPinned ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {isPinned ? '📌 Pinned' : '📍 Pin'}
        </button>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      
      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN REPORTS TAB COMPONENT
// ============================================================================

export default function ReportsTab({ transactions = [], onNavigateToImport }) {
  // Report order state - load from localStorage
  const [reportOrder, setReportOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('ff_report_order');
      return saved ? JSON.parse(saved) : ['cashflow', 'spending', 'income'];
    } catch { return ['cashflow', 'spending', 'income']; }
  });
  
  const [pinnedReports, setPinnedReports] = useState(() => {
    try {
      const saved = localStorage.getItem('ff_pinned_reports');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [dateRange, setDateRange] = useState('all'); // 'all', '30', '90', '365', 'ytd'
  const [activeReportTab, setActiveReportTab] = useState('all'); // 'all', 'cashflow', 'spending', 'income'

  // Save order to localStorage
  useEffect(() => {
    localStorage.setItem('ff_report_order', JSON.stringify(reportOrder));
  }, [reportOrder]);
  
  useEffect(() => {
    localStorage.setItem('ff_pinned_reports', JSON.stringify(pinnedReports));
  }, [pinnedReports]);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    if (dateRange === 'all') return transactions;
    
    const now = new Date();
    let startDate;
    
    if (dateRange === 'ytd') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
    }
    
    return transactions.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      return txDate >= startDate;
    });
  }, [transactions, dateRange]);

  // Calculate totals
  const { totalIncome, totalExpenses, savingsRate, incomeByCategory, expensesByCategory } = useMemo(() => {
    const income = {};
    const expenses = {};
    let totalInc = 0;
    let totalExp = 0;
    
    filteredTransactions.forEach(tx => {
      const amount = parseFloat(tx.amount || tx.Amount);
      const category = tx.category || tx.Category || 'Uncategorized';
      
      if (amount > 0) {
        totalInc += amount;
        income[category] = (income[category] || 0) + amount;
      } else {
        totalExp += Math.abs(amount);
        expenses[category] = (expenses[category] || 0) + Math.abs(amount);
      }
    });
    
    return {
      totalIncome: totalInc,
      totalExpenses: totalExp,
      savingsRate: totalInc > 0 ? ((totalInc - totalExp) / totalInc) * 100 : 0,
      incomeByCategory: income,
      expensesByCategory: expenses
    };
  }, [filteredTransactions]);

  // Spending data for donut chart
  const spendingData = useMemo(() => {
    return Object.entries(expensesByCategory)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expensesByCategory]);

  // Income by month for bar chart
  const incomeByMonth = useMemo(() => {
    const monthlyData = {};
    
    filteredTransactions
      .filter(tx => parseFloat(tx.amount || tx.Amount) > 0)
      .forEach(tx => {
        const date = new Date(tx.date || tx.Date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const category = tx.category || tx.Category || 'Income';
        const amount = parseFloat(tx.amount || tx.Amount);
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { total: 0, breakdown: {} };
        }
        monthlyData[monthKey].total += amount;
        monthlyData[monthKey].breakdown[category] = (monthlyData[monthKey].breakdown[category] || 0) + amount;
      });
    
    return Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12) // Last 12 months
      .map(([key, data]) => {
        const [year, month] = key.split('-');
        return {
          label: `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year.slice(2)}`,
          total: data.total,
          breakdown: Object.entries(data.breakdown)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
        };
      });
  }, [filteredTransactions]);

  // Report definitions
  const reports = {
    cashflow: {
      id: 'cashflow',
      title: 'Cash Flow',
      icon: '💸',
      description: 'Visualize how money flows from income sources to expense categories'
    },
    spending: {
      id: 'spending',
      title: 'Spending',
      icon: '🛍️',
      description: 'See where your money goes with a breakdown by category'
    },
    income: {
      id: 'income',
      title: 'Income',
      icon: '💰',
      description: 'Track your earnings over time by source'
    }
  };

  // Move report handlers
  const moveReport = (reportId, direction) => {
    const currentIndex = reportOrder.indexOf(reportId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= reportOrder.length) return;
    
    const newOrder = [...reportOrder];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    setReportOrder(newOrder);
  };

  const togglePin = (reportId) => {
    if (pinnedReports.includes(reportId)) {
      setPinnedReports(pinnedReports.filter(id => id !== reportId));
    } else {
      setPinnedReports([...pinnedReports, reportId]);
      // Move pinned report to top
      const newOrder = [reportId, ...reportOrder.filter(id => id !== reportId)];
      setReportOrder(newOrder);
    }
  };

  // Sort reports: pinned first, then by order
  const sortedReportIds = useMemo(() => {
    const pinned = reportOrder.filter(id => pinnedReports.includes(id));
    const unpinned = reportOrder.filter(id => !pinnedReports.includes(id));
    return [...pinned, ...unpinned];
  }, [reportOrder, pinnedReports]);

  const hasData = transactions.length > 0;

  if (!hasData) {
    return (
      <div style={{ animation: 'slideIn 0.3s ease' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>📊</span> Reports
        </h2>
        <EmptyState
          icon="📊"
          title="No data for reports"
          message="Import your transactions to generate comprehensive financial reports."
          actionLabel="📥 Import Data"
          onAction={onNavigateToImport}
        />
      </div>
    );
  }

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
          <span>📊</span> Reports
        </h2>
        
        {/* Date Range Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { value: '30', label: 'Last 30 Days' },
            { value: '90', label: 'Last 90 Days' },
            { value: '365', label: 'Last Year' },
            { value: 'ytd', label: 'Year to Date' },
            { value: 'all', label: 'All Time' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value)}
              style={{
                padding: '8px 16px',
                background: dateRange === option.value ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(139, 92, 246, 0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: dateRange === option.value ? '600' : '400'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💰 Total Income</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{formatCurrency(totalIncome)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💸 Total Expenses</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{formatCurrency(totalExpenses)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>📊 Net Income</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{formatCurrency(totalIncome - totalExpenses)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💎 Savings Rate</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>{savingsRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Report Type Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        background: 'rgba(30, 27, 56, 0.5)',
        padding: '8px',
        borderRadius: '12px',
        width: 'fit-content'
      }}>
        {[
          { value: 'all', label: 'All Reports' },
          { value: 'cashflow', label: '💸 Cash Flow' },
          { value: 'spending', label: '🛍️ Spending' },
          { value: 'income', label: '💰 Income' }
        ].map(option => (
          <button
            key={option.value}
            onClick={() => setActiveReportTab(option.value)}
            style={{
              padding: '10px 20px',
              background: activeReportTab === option.value ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: activeReportTab === option.value ? '600' : '400'
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Reports */}
      {sortedReportIds
        .filter(id => activeReportTab === 'all' || activeReportTab === id)
        .map((reportId, index, arr) => {
          const report = reports[reportId];
          
          return (
            <ReportCard
              key={reportId}
              report={report}
              index={index}
              onMoveUp={() => moveReport(reportId, 'up')}
              onMoveDown={() => moveReport(reportId, 'down')}
              isFirst={index === 0}
              isLast={index === arr.length - 1}
              onPin={() => togglePin(reportId)}
              isPinned={pinnedReports.includes(reportId)}
            >
              {reportId === 'cashflow' && (
                <div>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '12px', 
                    padding: '24px',
                    overflowX: 'auto'
                  }}>
                    {Object.keys(incomeByCategory).length > 0 && Object.keys(expensesByCategory).length > 0 ? (
                      <SankeyDiagram
                        incomeByCategory={incomeByCategory}
                        expensesByCategory={expensesByCategory}
                        totalIncome={totalIncome}
                        totalExpenses={totalExpenses}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                        Need both income and expense data to show cash flow
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {reportId === 'spending' && (
                <div>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '12px', 
                    padding: '24px'
                  }}>
                    {spendingData.length > 0 ? (
                      <>
                        <DonutChart data={spendingData} total={totalExpenses} title="Spending by Category" />
                        
                        {/* Detailed breakdown table */}
                        <div style={{ marginTop: '32px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>
                            Detailed Breakdown
                          </h4>
                          <div style={{ display: 'grid', gap: '8px' }}>
                            {spendingData.map((item, i) => (
                              <div key={item.name} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px'
                              }}>
                                <div style={{ 
                                  width: '8px', 
                                  height: '8px', 
                                  borderRadius: '2px', 
                                  background: COLORS[i % COLORS.length] 
                                }} />
                                <span style={{ fontSize: '13px', color: 'white' }}>
                                  {categoryEmojiMap[item.name] || '📦'} {item.name}
                                </span>
                                <div style={{ 
                                  flex: 1, 
                                  height: '6px', 
                                  background: 'rgba(255,255,255,0.1)', 
                                  borderRadius: '3px',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{ 
                                    width: `${(item.amount / totalExpenses) * 100}%`, 
                                    height: '100%', 
                                    background: COLORS[i % COLORS.length],
                                    borderRadius: '3px'
                                  }} />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: 'white', minWidth: '100px', textAlign: 'right' }}>
                                  {formatCurrency(item.amount)}
                                </span>
                                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', minWidth: '50px', textAlign: 'right' }}>
                                  {((item.amount / totalExpenses) * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                        No expense data available
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {reportId === 'income' && (
                <div>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '12px', 
                    padding: '24px'
                  }}>
                    {incomeByMonth.length > 0 ? (
                      <>
                        <BarChart data={incomeByMonth} title="Income by Month" />
                        
                        {/* Income Summary */}
                        <div style={{ marginTop: '32px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>
                            Income by Source
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                            {Object.entries(incomeByCategory)
                              .sort((a, b) => b[1] - a[1])
                              .map(([name, amount], i) => (
                                <div key={name} style={{ 
                                  padding: '16px',
                                  background: 'rgba(255,255,255,0.05)',
                                  borderRadius: '12px',
                                  borderLeft: `4px solid ${COLORS[i % COLORS.length]}`
                                }}>
                                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                                    {categoryEmojiMap[name] || '💵'} {name}
                                  </div>
                                  <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                                    {formatCurrency(amount)}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>
                                    {((amount / totalIncome) * 100).toFixed(1)}% of total
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        
                        {/* Summary stats */}
                        <div style={{ 
                          marginTop: '24px', 
                          padding: '16px', 
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1))',
                          borderRadius: '12px',
                          display: 'flex',
                          gap: '32px',
                          flexWrap: 'wrap'
                        }}>
                          <div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Total Transactions</div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>
                              {filteredTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) > 0).length}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Average Income</div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#10B981' }}>
                              {formatCurrency(totalIncome / Math.max(incomeByMonth.length, 1))}/mo
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Largest Transaction</div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#10B981' }}>
                              {formatCurrency(Math.max(...filteredTransactions.filter(tx => parseFloat(tx.amount || tx.Amount) > 0).map(tx => parseFloat(tx.amount || tx.Amount)), 0))}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                        No income data available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ReportCard>
          );
        })
      }

      {/* Tip */}
      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        background: 'rgba(139, 92, 246, 0.1)', 
        borderRadius: '12px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>💡</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Pro Tip</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            Use the arrow buttons to reorder reports, or pin your favorites to keep them at the top. Your preferences are saved automatically.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
