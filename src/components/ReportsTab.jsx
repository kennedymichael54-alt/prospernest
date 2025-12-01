import React, { useState, useMemo } from 'react';

// ============================================================================
// REPORTS TAB - Split View with Income, Spending, Cash Flow Reports
// ============================================================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));
};

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#A855F7'];

const SIDE_HUSTLE_KEYWORDS = [
  'real estate', 'commission', 'freelance', 'consulting', 'hair stylist', 'salon',
  'uber', 'lyft', 'doordash', 'instacart', 'airbnb', 'etsy', 'ebay', 'amazon seller',
  'photography', 'design', 'tutoring', 'coaching', 'client', 'invoice', 'gig'
];

const extractVendor = (description) => {
  if (!description) return 'unknown';
  return description.replace(/^(IN \*|SQ \*|TST\*|PP\*|PAYPAL \*|VENMO\s+)/i, '').replace(/\s+\d{2,}.*$/i, '').trim().toLowerCase().slice(0, 25);
};

// Sankey Diagram Component - Full Width
function SankeyDiagram({ incomeBySource, expensesByCategory, totalIncome, color }) {
  const width = 1000;
  const height = 500;
  const nodeWidth = 24;
  const nodePadding = 18;
  
  const incomeItems = Object.entries(incomeBySource).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const expenseItems = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).slice(0, 12);
  
  if (incomeItems.length === 0 && expenseItems.length === 0) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.5)' }}>No data for this period</div>;
  }

  const totalExpenses = expenseItems.reduce((sum, [, val]) => sum + val, 0);
  const leftX = 50;
  const centerX = width / 2 - nodeWidth / 2;
  const rightX = width - 50 - nodeWidth;

  const incomeNodeHeight = Math.max(height - 100, 200);
  const expenseNodeHeight = Math.max(height - 100, 200);

  const incomeNodes = incomeItems.map((item, i) => {
    const h = Math.max((item[1] / totalIncome) * incomeNodeHeight, 20);
    const y = 50 + (i * (incomeNodeHeight + nodePadding * 2)) / incomeItems.length;
    return { name: item[0], value: item[1], x: leftX, y, height: h, color: '#10B981' };
  });

  const expenseNodes = expenseItems.map((item, i) => {
    const h = Math.max((item[1] / totalExpenses) * expenseNodeHeight, 15);
    const y = 50 + (i * (expenseNodeHeight + nodePadding * 2)) / expenseItems.length;
    return { name: item[0], value: item[1], x: rightX, y, height: h, color: COLORS[i % COLORS.length] };
  });

  const centerNode = { x: centerX, y: height / 2 - 80, height: 160, label: 'Total', value: totalIncome };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minHeight: '400px' }}>
      <defs>
        <linearGradient id={`incomeGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
        {expenseNodes.map((node, i) => (
          <linearGradient key={i} id={`expGrad-${i}-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={node.color} stopOpacity="0.8" />
          </linearGradient>
        ))}
      </defs>

      {/* Income flows to center */}
      {incomeNodes.map((node, i) => {
        const startY = node.y + node.height / 2;
        const endY = centerNode.y + (i / incomeNodes.length) * centerNode.height + 10;
        return (
          <path key={`inc-${i}`}
            d={`M ${node.x + nodeWidth} ${startY} C ${centerX - 50} ${startY}, ${centerX - 50} ${endY}, ${centerNode.x} ${endY}`}
            fill="none" stroke={`url(#incomeGrad-${color})`} strokeWidth={Math.max(node.height * 0.6, 3)} opacity="0.7" />
        );
      })}

      {/* Center to expense flows */}
      {expenseNodes.map((node, i) => {
        const startY = centerNode.y + (i / expenseNodes.length) * centerNode.height + 10;
        const endY = node.y + node.height / 2;
        return (
          <path key={`exp-${i}`}
            d={`M ${centerNode.x + nodeWidth} ${startY} C ${centerX + 100} ${startY}, ${rightX - 50} ${endY}, ${node.x} ${endY}`}
            fill="none" stroke={`url(#expGrad-${i}-${color})`} strokeWidth={Math.max(node.height * 0.6, 3)} opacity="0.7" />
        );
      })}

      {/* Income nodes */}
      {incomeNodes.map((node, i) => (
        <g key={`inc-node-${i}`}>
          <rect x={node.x} y={node.y} width={nodeWidth} height={node.height} fill="#10B981" rx="4" />
          <text x={node.x - 8} y={node.y + node.height / 2} textAnchor="end" fill="white" fontSize="11" dominantBaseline="middle">
            {node.name.length > 14 ? node.name.slice(0, 14) + '...' : node.name}
          </text>
          <text x={node.x - 8} y={node.y + node.height / 2 + 14} textAnchor="end" fill="rgba(255,255,255,0.6)" fontSize="9">
            {formatCurrency(node.value)}
          </text>
        </g>
      ))}

      {/* Center node */}
      <rect x={centerNode.x} y={centerNode.y} width={nodeWidth} height={centerNode.height} fill={color} rx="4" />
      <text x={centerNode.x + nodeWidth / 2} y={centerNode.y - 10} textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Income</text>
      <text x={centerNode.x + nodeWidth / 2} y={centerNode.y + centerNode.height + 20} textAnchor="middle" fill={color} fontSize="12" fontWeight="600">
        {formatCurrency(totalIncome)}
      </text>

      {/* Expense nodes */}
      {expenseNodes.map((node, i) => (
        <g key={`exp-node-${i}`}>
          <rect x={node.x} y={node.y} width={nodeWidth} height={node.height} fill={node.color} rx="4" />
          <text x={node.x + nodeWidth + 8} y={node.y + node.height / 2} textAnchor="start" fill="white" fontSize="11" dominantBaseline="middle">
            {node.name.length > 14 ? node.name.slice(0, 14) + '...' : node.name}
          </text>
          <text x={node.x + nodeWidth + 8} y={node.y + node.height / 2 + 14} textAnchor="start" fill="rgba(255,255,255,0.6)" fontSize="9">
            {formatCurrency(node.value)} ({((node.value / totalExpenses) * 100).toFixed(1)}%)
          </text>
        </g>
      ))}
    </svg>
  );
}

// Donut Chart Component
function DonutChart({ data, color }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>No data</div>;

  const size = 200;
  const strokeWidth = 40;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {data.slice(0, 8).map((item, i) => {
          const percentage = item.value / total;
          const strokeDasharray = `${percentage * circumference} ${circumference}`;
          const strokeDashoffset = -currentOffset * circumference;
          currentOffset += percentage;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
          );
        })}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="18" fontWeight="700" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
          {formatCurrency(total)}
        </text>
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {data.slice(0, 8).map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[i % COLORS.length] }} />
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.name.length > 12 ? item.name.slice(0, 12) + '...' : item.name}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 'auto' }}>{((item.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bar Chart Component
function BarChart({ data, color }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  if (data.length === 0) return <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>No data</div>;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '20px 0' }}>
      {data.map((item, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>{formatCurrency(item.value)}</div>
          <div style={{ width: '100%', maxWidth: '50px', height: `${(item.value / maxValue) * 150}px`, background: `linear-gradient(180deg, ${color}, ${color}88)`, borderRadius: '6px 6px 0 0', minHeight: '4px' }} />
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// Report Panel Component
function ReportPanel({ title, icon, color, transactions, dateRange }) {
  const [expandedReport, setExpandedReport] = useState('income');

  const { incomeBySource, expensesByCategory, totalIncome, totalExpenses, monthlyData } = useMemo(() => {
    const incomeBySource = {};
    const expensesByCategory = {};
    let totalIncome = 0;
    let totalExpenses = 0;
    const monthlyIncome = {};

    transactions.forEach(tx => {
      const amount = parseFloat(tx.amount || tx.Amount);
      const category = tx.category || tx.Category || 'Uncategorized';
      const date = new Date(tx.date || tx.Date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (amount > 0) {
        totalIncome += amount;
        incomeBySource[category] = (incomeBySource[category] || 0) + amount;
        monthlyIncome[monthKey] = (monthlyIncome[monthKey] || 0) + amount;
      } else {
        totalExpenses += Math.abs(amount);
        expensesByCategory[category] = (expensesByCategory[category] || 0) + Math.abs(amount);
      }
    });

    const sortedMonths = Object.keys(monthlyIncome).sort().slice(-12);
    const monthlyData = sortedMonths.map(key => ({
      label: new Date(key + '-01').toLocaleDateString('en-US', { month: 'short' }),
      value: monthlyIncome[key] || 0
    }));

    return { incomeBySource, expensesByCategory, totalIncome, totalExpenses, monthlyData };
  }, [transactions]);

  const spendingData = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '14px 20px',
        background: `linear-gradient(135deg, ${color}25, ${color}10)`, borderRadius: '14px', border: `1px solid ${color}40`
      }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{title}</h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0 0' }}>{transactions.length} transactions • {dateRange}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>💰 Income</div>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(totalIncome)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>💸 Expenses</div>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>{formatCurrency(totalExpenses)}</div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>📊 Net</div>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>{totalIncome >= totalExpenses ? '+' : ''}{formatCurrency(totalIncome - totalExpenses)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>💎 Savings Rate</div>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>{totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%</div>
        </div>
      </div>

      {/* Report Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['income', 'spending', 'cashflow'].map(report => (
          <button key={report} onClick={() => setExpandedReport(report)}
            style={{ padding: '10px 16px', background: expandedReport === report ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '12px', fontWeight: expandedReport === report ? '600' : '400', cursor: 'pointer' }}>
            {report === 'income' ? '💰 Income' : report === 'spending' ? '🛍️ Spending' : '💹 Cash Flow'}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
        {expandedReport === 'income' && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>📊 Monthly Income Trend</h4>
            <BarChart data={monthlyData} color={color} />
            <div style={{ marginTop: '16px' }}>
              <h5 style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Income Sources</h5>
              {Object.entries(incomeBySource).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value], i) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '13px' }}>{name}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#10B981' }}>{formatCurrency(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {expandedReport === 'spending' && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>🍩 Spending Breakdown</h4>
            <DonutChart data={spendingData} color={color} />
            <div style={{ marginTop: '16px' }}>
              {spendingData.slice(0, 6).map((item, i) => (
                <div key={item.name} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px' }}>{item.name}</span>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>{formatCurrency(item.value)}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                    <div style={{ width: `${(item.value / totalExpenses) * 100}%`, height: '100%', background: COLORS[i % COLORS.length], borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expandedReport === 'cashflow' && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>💹 Cash Flow Visualization</h4>
            <SankeyDiagram incomeBySource={incomeBySource} expensesByCategory={expensesByCategory} totalIncome={totalIncome} color={color} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportsTab({ transactions = [] }) {
  const [dateRange, setDateRange] = useState('all');

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
    const now = new Date();
    return transactions.filter(tx => {
      const txDate = new Date(tx.date || tx.Date);
      switch (dateRange) {
        case '30': return (now - txDate) / (1000 * 60 * 60 * 24) <= 30;
        case '90': return (now - txDate) / (1000 * 60 * 60 * 24) <= 90;
        case 'year': return txDate.getFullYear() === now.getFullYear() - 1;
        case 'ytd': return txDate.getFullYear() === now.getFullYear();
        default: return true;
      }
    });
  }, [transactions, dateRange]);

  const { personalTransactions, sideHustleTransactions } = useMemo(() => {
    const personal = filteredTransactions.filter(tx => !isSideHustle(tx));
    const sideHustle = filteredTransactions.filter(tx => isSideHustle(tx));
    return { personalTransactions: personal, sideHustleTransactions: sideHustle };
  }, [filteredTransactions, incomeTypeMap]);

  const hasSideHustleData = sideHustleTransactions.length > 0;
  const dateRangeLabel = { '30': 'Last 30 Days', '90': 'Last 90 Days', 'year': 'Last Year', 'ytd': 'Year to Date', 'all': 'All Time' }[dateRange];

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>📊 Reports</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[['30', 'Last 30 Days'], ['90', 'Last 90 Days'], ['year', 'Last Year'], ['ytd', 'Year to Date'], ['all', 'All Time']].map(([value, label]) => (
            <button key={value} onClick={() => setDateRange(value)}
              style={{ padding: '8px 14px', background: dateRange === value ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Split View - Always show both panels centered */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Personal Reports */}
        <div style={{ paddingRight: '20px' }}>
          <ReportPanel title="👤 Personal" icon="🏠" color="#8B5CF6" transactions={personalTransactions} dateRange={dateRangeLabel} />
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />

        {/* Side Hustle Reports */}
        <div style={{ paddingLeft: '20px' }}>
          <ReportPanel title={`💼 ${sideHustleName}`} icon="💼" color="#EC4899" transactions={sideHustleTransactions} dateRange={dateRangeLabel} />
        </div>
      </div>

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
