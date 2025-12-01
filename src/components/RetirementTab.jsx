import React, { useState, useMemo, useEffect } from 'react';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

const ACCOUNT_COLORS = {
  'IRA': '#8B5CF6',
  'Roth IRA': '#A855F7',
  'VUL (Life Insurance)': '#EC4899',
  '401(k)': '#3B82F6',
  'Brokerage': '#10B981',
  'Advisory': '#F59E0B',
  'Cash': '#6B7280',
  'Other': '#6366F1'
};

const OWNER_COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

// Tooltip Component
function Tooltip({ children, content, position = 'top' }) {
  const [show, setShow] = useState(false);
  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: 'absolute', ...positionStyles[position], background: 'rgba(0,0,0,0.9)', color: 'white',
          padding: '8px 12px', borderRadius: '8px', fontSize: '12px', whiteSpace: 'nowrap', zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {content}
        </div>
      )}
    </div>
  );
}

// Interactive Growth Chart with Tooltips
function GrowthChart({ data, height = 250 }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) return null;

  const values = data.map(d => d.value);
  const maxValue = Math.max(...values) * 1.1;
  const minValue = Math.min(...values) * 0.9;
  const range = maxValue - minValue || 1;

  const width = 100;
  const chartHeight = 70;
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * width,
    y: chartHeight - ((d.value - minValue) / range) * chartHeight,
    ...d
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <svg viewBox={`0 0 ${width} ${chartHeight + 10}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#chartGradient)" />
        <path d={pathD} fill="none" stroke="url(#lineGradient)" strokeWidth="0.5" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hoveredPoint === i ? 1.5 : 0.8}
            fill={hoveredPoint === i ? '#EC4899' : '#8B5CF6'}
            style={{ cursor: 'pointer', transition: 'r 0.2s' }}
            onMouseEnter={(e) => { setHoveredPoint(i); setTooltipPos({ x: e.clientX, y: e.clientY }); }}
            onMouseLeave={() => setHoveredPoint(null)} />
        ))}
      </svg>
      {hoveredPoint !== null && (
        <div style={{
          position: 'fixed', left: tooltipPos.x + 10, top: tooltipPos.y - 60,
          background: 'rgba(15, 12, 41, 0.95)', border: '1px solid rgba(139, 92, 246, 0.5)',
          borderRadius: '12px', padding: '12px 16px', zIndex: 1000, minWidth: '150px'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{points[hoveredPoint].month}</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>{formatCurrency(points[hoveredPoint].value)}</div>
          {points[hoveredPoint].change !== undefined && (
            <div style={{ fontSize: '12px', color: points[hoveredPoint].change >= 0 ? '#10B981' : '#EF4444', marginTop: '4px' }}>
              {points[hoveredPoint].change >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(points[hoveredPoint].change))}
            </div>
          )}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-20px', padding: '0 4px' }}>
        {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{d.month?.split(' ')[0]}</span>
        ))}
      </div>
    </div>
  );
}

// Modern Donut Chart with Animation
function ModernDonutChart({ data, size = 220 }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const radius = 42;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
        {data.map((segment, i) => {
          const percentage = segment.value / total;
          const strokeDasharray = `${percentage * circumference} ${circumference}`;
          const strokeDashoffset = -currentOffset;
          currentOffset += percentage * circumference;
          const color = ACCOUNT_COLORS[segment.type] || OWNER_COLORS[i % OWNER_COLORS.length];
          const isHovered = hoveredSegment === i;

          return (
            <circle key={i} cx="50" cy="50" r={radius} fill="none"
              stroke={color} strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.3s, opacity 0.3s', opacity: hoveredSegment !== null && !isHovered ? 0.5 : 1 }}
              onMouseEnter={() => setHoveredSegment(i)} onMouseLeave={() => setHoveredSegment(null)} />
          );
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {hoveredSegment !== null ? (
          <>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{data[hoveredSegment].name || data[hoveredSegment].type}</div>
            <div style={{ fontSize: '22px', fontWeight: '700' }}>{formatCurrency(data[hoveredSegment].value)}</div>
            <div style={{ fontSize: '12px', color: ACCOUNT_COLORS[data[hoveredSegment].type] || OWNER_COLORS[hoveredSegment % OWNER_COLORS.length] }}>
              {((data[hoveredSegment].value / total) * 100).toFixed(1)}%
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Total Value</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(total)}</div>
          </>
        )}
      </div>
    </div>
  );
}

// Collapsible Investment Card
function InvestmentCard({ investment, isExpanded, onToggle, totalPortfolio, progressData }) {
  const color = ACCOUNT_COLORS[investment.type] || '#8B5CF6';
  const percentage = totalPortfolio > 0 ? ((investment.value / totalPortfolio) * 100).toFixed(1) : 0;
  
  const accountProgress = progressData?.filter(p => 
    p.account && investment.name && p.account.toLowerCase().includes(investment.name.toLowerCase().split(' ')[0])
  ) || [];

  return (
    <div style={{
      background: isExpanded ? `linear-gradient(135deg, ${color}15, ${color}05)` : 'rgba(255,255,255,0.03)',
      borderRadius: '14px', marginBottom: '10px',
      border: `1px solid ${isExpanded ? color + '50' : 'rgba(255,255,255,0.08)'}`,
      overflow: 'hidden', transition: 'all 0.3s ease'
    }}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', cursor: 'pointer' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: `linear-gradient(135deg, ${color}30, ${color}15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}40`
        }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: color }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {investment.name}
            {investment.ytdReturn && (
              <span style={{
                fontSize: '11px', padding: '2px 6px', borderRadius: '4px',
                background: investment.ytdReturn.includes('-') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
                color: investment.ytdReturn.includes('-') ? '#EF4444' : '#10B981'
              }}>YTD: {investment.ytdReturn}</span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{investment.type} • {investment.owner || 'Account Holder'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#10B981' }}>{formatCurrency(investment.value)}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{percentage}%</div>
        </div>
        <div style={{
          width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'
        }}>
          <span style={{ fontSize: '12px' }}>▼</span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '16px' }}>
            {[
              { label: 'YTD', value: investment.ytdReturn || 'N/A' },
              { label: '1-Year', value: investment.oneYear || 'N/A' },
              { label: '3-Year', value: investment.threeYear || 'N/A' },
              { label: '5-Year', value: investment.fiveYear || 'N/A' }
            ].map((metric, i) => (
              <Tooltip key={i} content={`${metric.label} Return`}>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{metric.label}</div>
                  <div style={{
                    fontSize: '14px', fontWeight: '700',
                    color: metric.value === 'N/A' ? 'rgba(255,255,255,0.3)' : metric.value?.includes('-') ? '#EF4444' : '#10B981'
                  }}>{metric.value}</div>
                </div>
              </Tooltip>
            ))}
          </div>

          {accountProgress.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h5 style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>Recent Activity</h5>
              {accountProgress.slice(0, 3).map((p, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '8px 12px',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderRadius: '6px'
                }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{p.month}</span>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>+{formatCurrency(p.contributions || 0)}</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: (p.change || 0) >= 0 ? '#10B981' : '#EF4444' }}>
                      {(p.change || 0) >= 0 ? '+' : ''}{formatCurrency(p.change || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Retirement Calculator
function RetirementCalculator({ color }) {
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('67');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');

  const results = useMemo(() => {
    const age = parseInt(currentAge) || 0;
    const retire = parseInt(retirementAge) || 67;
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const returnRate = (parseFloat(annualReturn) || 7) / 100;
    const yearsToRetire = Math.max(retire - age, 0);
    const monthsToRetire = yearsToRetire * 12;
    const monthlyRate = returnRate / 12;

    let futureValue = savings;
    if (monthlyRate > 0 && monthsToRetire > 0) {
      futureValue = savings * Math.pow(1 + monthlyRate, monthsToRetire) +
        monthly * ((Math.pow(1 + monthlyRate, monthsToRetire) - 1) / monthlyRate);
    } else {
      futureValue = savings + (monthly * monthsToRetire);
    }

    return {
      years: yearsToRetire, futureValue, initialBalance: savings,
      totalContributions: monthly * monthsToRetire,
      totalGrowth: futureValue - savings - (monthly * monthsToRetire),
      initialPercent: futureValue > 0 ? (savings / futureValue * 100).toFixed(0) : 0,
      contributionsPercent: futureValue > 0 ? ((monthly * monthsToRetire) / futureValue * 100).toFixed(0) : 0,
      growthPercent: futureValue > 0 ? ((futureValue - savings - monthly * monthsToRetire) / futureValue * 100).toFixed(0) : 0
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Enter Your Information</h3>
        {[
          { label: 'Current Age', value: currentAge, setter: setCurrentAge, placeholder: '30' },
          { label: 'Retirement Age', value: retirementAge, setter: setRetirementAge, placeholder: '67', hint: 'Full benefits at 67 if born 1960+' },
          { label: 'Current Investments ($)', value: currentSavings, setter: setCurrentSavings, placeholder: '50000' },
          { label: 'Monthly Contribution ($)', value: monthlyContribution, setter: setMonthlyContribution, placeholder: '500', hint: 'Recommend 15% of income' },
          { label: 'Expected Return (%)', value: annualReturn, setter: setAnnualReturn, placeholder: '7', hint: 'S&P 500 averages 10-12%' }
        ].map((field, i) => (
          <div key={i} style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>{field.label}</label>
            <input type="number" value={field.value} onChange={(e) => field.setter(e.target.value)} placeholder={field.placeholder}
              style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '16px', boxSizing: 'border-box' }} />
            {field.hint && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>{field.hint}</p>}
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>Your Results</h3>
        <div style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, borderRadius: '16px', padding: '24px', marginBottom: '24px', border: `1px solid ${color}30` }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>In {results.years} years</div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#10B981' }}>{formatCurrency(results.futureValue)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Initial', value: results.initialBalance, percent: results.initialPercent, color: '#8B5CF6' },
            { label: 'Contributions', value: results.totalContributions, percent: results.contributionsPercent, color: '#3B82F6' },
            { label: 'Growth', value: results.totalGrowth, percent: results.growthPercent, color: '#10B981' }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '14px', background: `${item.color}15`, borderRadius: '12px', border: `1px solid ${item.color}30` }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: item.color }}>{formatCurrency(item.value)}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{item.percent}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function RetirementTab() {
  const [activeView, setActiveView] = useState('investments');
  const [investments, setInvestments] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [newInvestment, setNewInvestment] = useState({ name: '', type: 'IRA', value: '', institution: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [accountBreakdown, setAccountBreakdown] = useState([]);
  const [expandedInvestments, setExpandedInvestments] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ff_investments');
      if (saved) setInvestments(JSON.parse(saved));
      const savedProgress = localStorage.getItem('ff_investment_progress');
      if (savedProgress) setProgressData(JSON.parse(savedProgress));
    } catch (e) { console.error('Error loading:', e); }
  }, []);

  useEffect(() => {
    if (investments.length > 0) localStorage.setItem('ff_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    if (progressData.length > 0) localStorage.setItem('ff_investment_progress', JSON.stringify(progressData));
  }, [progressData]);

  const totalInvestments = investments.reduce((sum, inv) => sum + parseFloat(inv.value || 0), 0);

  const investmentsByType = useMemo(() => {
    const grouped = {};
    investments.forEach(inv => {
      const type = inv.type || 'Other';
      if (!grouped[type]) grouped[type] = 0;
      grouped[type] += parseFloat(inv.value || 0);
    });
    return Object.entries(grouped).map(([type, value]) => ({ type, value, name: type })).sort((a, b) => b.value - a.value);
  }, [investments]);

  const growthChartData = useMemo(() => {
    const monthlyTotals = {};
    progressData.forEach(p => {
      if (p.month && !p.account) {
        monthlyTotals[p.month] = { month: p.month, value: p.endingBalance || 0, change: p.changeInBalance || 0 };
      }
    });
    return Object.values(monthlyTotals).reverse();
  }, [progressData]);

  const performanceSummary = useMemo(() => {
    if (progressData.length === 0) return null;
    const latestMonth = progressData.find(p => !p.account);
    if (!latestMonth) return null;
    return {
      currentValue: latestMonth.endingBalance || totalInvestments,
      monthChange: latestMonth.changeInBalance || 0,
      monthContributions: latestMonth.netContributions || 0,
      monthGrowth: latestMonth.changeInValue || 0
    };
  }, [progressData, totalInvestments]);

  const parseAmeripriseCSV = (text) => {
    const lines = text.split('\n');
    const accounts = [];
    const progress = [];
    let currentSection = '';
    let currentMonth = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line === ',') continue;

      if (line.includes('"Advisory Accounts"') && !line.includes('Inception')) { currentSection = 'Advisory'; continue; }
      if (line.includes('"Brokerage and Cash Accounts"') && !line.includes('Inception')) { currentSection = 'Brokerage'; continue; }
      if (line.includes('"Insurance and Annuity Accounts"') && !line.includes('Value')) { currentSection = 'Insurance'; continue; }
      if (line.includes('"Progress"')) { currentSection = 'Progress'; continue; }
      if (line.includes('"Inactive Accounts"')) { currentSection = 'Inactive'; continue; }

      if (currentSection === 'Inactive' || line.includes('Investment Timeframe') || line.includes('Inception Date') ||
          line.includes('"Total "') || line.includes('"Accounts"') || line.includes('Investment Rate of Return')) continue;

      const parts = line.split(',').map(p => p.replace(/"/g, '').trim());

      if (currentSection === 'Advisory' || currentSection === 'Brokerage') {
        const name = parts[0], value = parts[3], ytd = parts[4], oneYr = parts[5], threeYr = parts[6], fiveYr = parts[7];
        if (name && value && !name.includes('Accounts')) {
          const ownerName = name.split(' ')[0];
          accounts.push({
            id: Date.now() + accounts.length, name: name.split('(')[0].trim(), fullName: name,
            type: name.toLowerCase().includes('ira') ? 'IRA' : name.toLowerCase().includes('vul') ? 'VUL (Life Insurance)' : 'Brokerage',
            owner: ownerName.charAt(0).toUpperCase() + ownerName.slice(1).toLowerCase(),
            value: parseFloat(value.replace(/[$,]/g, '')) || 0,
            ytdReturn: ytd || '', oneYear: oneYr || '', threeYear: threeYr || '', fiveYear: fiveYr || '',
            section: currentSection, institution: 'Ameriprise', dateAdded: new Date().toISOString()
          });
        }
      } else if (currentSection === 'Insurance') {
        const name = parts[0], value = parts[1];
        if (name && value && !name.includes('Accounts')) {
          const ownerName = name.split(' ')[0];
          accounts.push({
            id: Date.now() + accounts.length, name: name.split('(')[0].trim(), fullName: name,
            type: 'VUL (Life Insurance)', owner: ownerName.charAt(0).toUpperCase() + ownerName.slice(1).toLowerCase(),
            value: parseFloat(value.replace(/[$,]/g, '')) || 0, section: 'Insurance', institution: 'Ameriprise', dateAdded: new Date().toISOString()
          });
        }
      } else if (currentSection === 'Progress') {
        if (parts[0] && parts[0].match(/^(January|February|March|April|May|June|July|August|September|October|November|December)/)) {
          currentMonth = parts[0];
          progress.push({
            month: parts[0], account: null, startingBalance: parseFloat(parts[1]?.replace(/[$,]/g, '')) || 0,
            netContributions: parseFloat(parts[2]?.replace(/[$,]/g, '')) || 0, changeInValue: parseFloat(parts[3]?.replace(/[$,]/g, '')) || 0,
            endingBalance: parseFloat(parts[4]?.replace(/[$,]/g, '')) || 0, changeInBalance: parseFloat(parts[5]?.replace(/[$,]/g, '')) || 0
          });
        } else if (parts[0] && currentMonth && !parts[0].includes('Progress') && !parts[0].includes('Starting')) {
          progress.push({
            month: currentMonth, account: parts[0], startingBalance: parseFloat(parts[1]?.replace(/[$,]/g, '')) || 0,
            contributions: parseFloat(parts[2]?.replace(/[$,]/g, '')) || 0, change: parseFloat(parts[3]?.replace(/[$,]/g, '')) || 0,
            endingBalance: parseFloat(parts[4]?.replace(/[$,]/g, '')) || 0, netChange: parseFloat(parts[5]?.replace(/[$,]/g, '')) || 0
          });
        }
      }
    }
    return { accounts, progress };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file.name);
    setImportStatus('processing');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const { accounts, progress } = parseAmeripriseCSV(event.target.result);
        if (accounts.length > 0) {
          setAccountBreakdown(accounts);
          setProgressData(progress);
          setImportStatus('ready');
        } else {
          setImportStatus('error');
        }
      } catch (error) {
        console.error('Parse error:', error);
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  const importAccounts = () => {
    setInvestments(prev => [...prev, ...accountBreakdown]);
    setImportStatus('success');
    setActiveView('investments');
  };

  const clearImport = () => { setUploadedFile(null); setImportStatus(null); setAccountBreakdown([]); };
  const toggleInvestment = (id) => setExpandedInvestments(prev => ({ ...prev, [id]: !prev[id] }));
  const addInvestment = () => {
    if (!newInvestment.name || !newInvestment.value) return;
    setInvestments([...investments, { ...newInvestment, id: Date.now(), value: parseFloat(newInvestment.value), dateAdded: new Date().toISOString() }]);
    setNewInvestment({ name: '', type: 'IRA', value: '', institution: '' });
    setShowAddInvestment(false);
  };
  const deleteInvestment = (id) => setInvestments(investments.filter(inv => inv.id !== id));
  const clearAllInvestments = () => { setInvestments([]); setProgressData([]); localStorage.removeItem('ff_investments'); localStorage.removeItem('ff_investment_progress'); };

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>🏖️ Retirement Planning</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>Track investments and plan your future</p>
        </div>
        {investments.length > 0 && (
          <button onClick={clearAllInvestments} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#EF4444', fontSize: '12px', cursor: 'pointer' }}>
            Clear All
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[{ id: 'investments', label: '📊 My Investments' }, { id: 'calculator', label: '🧮 Calculator' }, { id: 'upload', label: '📄 Import' }].map(view => (
          <button key={view.id} onClick={() => setActiveView(view.id)}
            style={{ padding: '12px 20px', background: activeView === view.id ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: activeView === view.id ? '600' : '400', cursor: 'pointer' }}>
            {view.label}
          </button>
        ))}
      </div>

      {activeView === 'calculator' && <RetirementCalculator color="#8B5CF6" />}

      {activeView === 'investments' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <Tooltip content="Total value of all accounts"><div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '16px', padding: '20px', cursor: 'help' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>💰 Total Portfolio</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{formatCurrency(performanceSummary?.currentValue || totalInvestments)}</div>
            </div></Tooltip>
            <Tooltip content="Monthly change"><div style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', borderRadius: '16px', padding: '20px', cursor: 'help' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>📈 Monthly Change</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{performanceSummary ? (performanceSummary.monthChange >= 0 ? '+' : '') + formatCurrency(performanceSummary.monthChange) : 'N/A'}</div>
            </div></Tooltip>
            <Tooltip content="Number of accounts"><div style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', borderRadius: '16px', padding: '20px', cursor: 'help' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>🏦 Accounts</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{investments.length}</div>
            </div></Tooltip>
            <Tooltip content="Largest holding"><div style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '16px', padding: '20px', cursor: 'help' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>🏆 Largest</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{investments.length > 0 ? formatCurrency(Math.max(...investments.map(i => i.value))) : '$0'}</div>
            </div></Tooltip>
          </div>

          {investments.length > 0 ? (
            <>
              {growthChartData.length > 1 && (
                <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>📈 Portfolio Growth</h3>
                  <GrowthChart data={growthChartData} height={200} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1.2fr', gap: '0' }}>
                <div style={{ paddingRight: '24px' }}>
                  <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>🥧 Portfolio Allocation</h3>
                    <ModernDonutChart data={investmentsByType} size={200} />
                    <div style={{ marginTop: '24px' }}>
                      {investmentsByType.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: ACCOUNT_COLORS[item.type] || OWNER_COLORS[i] }} />
                            <span style={{ fontSize: '13px' }}>{item.type}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600' }}>{formatCurrency(item.value)}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>{((item.value / totalInvestments) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {performanceSummary && (
                      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>This Month</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Contributions</div><div style={{ fontSize: '14px', fontWeight: '600', color: '#3B82F6' }}>{formatCurrency(performanceSummary.monthContributions)}</div></div>
                          <div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Market Change</div><div style={{ fontSize: '14px', fontWeight: '600', color: performanceSummary.monthGrowth >= 0 ? '#10B981' : '#EF4444' }}>{performanceSummary.monthGrowth >= 0 ? '+' : ''}{formatCurrency(performanceSummary.monthGrowth)}</div></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />
                <div style={{ paddingLeft: '24px' }}>
                  <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>💼 My Investments</h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => {
                          const allExpanded = {};
                          investments.forEach(inv => allExpanded[inv.id] = true);
                          setExpandedInvestments(allExpanded);
                        }} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '10px' }}>▼</span> Expand All
                        </button>
                        <button onClick={() => setExpandedInvestments({})} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '10px' }}>▲</span> Collapse All
                        </button>
                        <button onClick={() => setShowAddInvestment(true)} style={{ padding: '8px 14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                      </div>
                    </div>
                    <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                      {investments.map(inv => (
                        <InvestmentCard key={inv.id} investment={inv} isExpanded={expandedInvestments[inv.id]} onToggle={() => toggleInvestment(inv.id)} totalPortfolio={totalInvestments} progressData={progressData} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>No Investments Yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Import from your brokerage or add manually</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setActiveView('upload')} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>📄 Import CSV</button>
                <button onClick={() => setShowAddInvestment(true)} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>+ Add Manually</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === 'upload' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>📄 Import from Brokerage</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Upload your performance CSV from Ameriprise or other brokerages</p>

            {!uploadedFile && (
              <div style={{ border: '2px dashed rgba(139, 92, 246, 0.4)', borderRadius: '16px', padding: '48px', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('fileUpload').click()}>
                <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} id="fileUpload" />
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Drop CSV file or click to upload</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Supports Ameriprise, Fidelity, Vanguard, and more</div>
              </div>
            )}

            {importStatus === 'processing' && <div style={{ textAlign: 'center', padding: '40px' }}><div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div><div>Processing...</div></div>}

            {importStatus === 'ready' && (
              <div>
                <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px' }}>✅</span>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '16px' }}>Found {accountBreakdown.length} accounts!</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Total: {formatCurrency(accountBreakdown.reduce((sum, a) => sum + a.value, 0))} • {progressData.filter(p => !p.account).length} months history</div>
                    </div>
                  </div>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                  {accountBreakdown.map((acc, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderRadius: '8px' }}>
                      <div><div style={{ fontWeight: '500', fontSize: '14px' }}>{acc.name}</div><div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{acc.type} • {acc.owner}</div></div>
                      <div style={{ textAlign: 'right' }}><div style={{ fontWeight: '600', color: '#10B981' }}>{formatCurrency(acc.value)}</div>{acc.ytdReturn && <div style={{ fontSize: '11px', color: acc.ytdReturn.includes('-') ? '#EF4444' : '#10B981' }}>YTD: {acc.ytdReturn}</div>}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={clearImport} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={importAccounts} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Import {accountBreakdown.length} Accounts</button>
                </div>
              </div>
            )}

            {importStatus === 'error' && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>❌</div>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>Could not parse file</div>
                <button onClick={clearImport} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Try Again</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Market Overview Section */}
      <div style={{ marginTop: '24px', background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📈 Market Overview
            <span style={{ fontSize: '10px', fontWeight: '400', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>Live</span>
          </h3>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px' }}>
          {[
            { symbol: 'DJI', name: 'Dow Jones', value: 44910.65, change: 0.42, up: true },
            { symbol: 'SPX', name: 'S&P 500', value: 6032.38, change: 0.56, up: true },
            { symbol: 'IXIC', name: 'Nasdaq', value: 19218.17, change: 0.83, up: true },
            { symbol: 'RUT', name: 'Russell 2000', value: 2434.73, change: -0.12, up: false },
            { symbol: 'GC=F', name: 'Gold', value: 2651.70, change: 0.31, up: true },
            { symbol: 'SI=F', name: 'Silver', value: 30.58, change: 0.85, up: true },
            { symbol: 'BTC-USD', name: 'Bitcoin', value: 97425.00, change: 1.24, up: true },
            { symbol: 'ETH-USD', name: 'Ethereum', value: 3648.50, change: 2.15, up: true }
          ].map((market, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: `1px solid ${market.up ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontWeight: '600' }}>{market.symbol}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>
                {market.symbol.includes('BTC') || market.symbol.includes('ETH') ? `$${market.value.toLocaleString()}` : market.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '10px', color: market.up ? '#10B981' : '#EF4444', fontWeight: '500' }}>
                {market.up ? '▲' : '▼'} {Math.abs(market.change).toFixed(2)}%
              </div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{market.name}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '12px' }}>
          {[
            { symbol: 'CL=F', name: 'Crude Oil', value: 68.15, change: -0.73, up: false },
            { symbol: 'VIX', name: 'VIX (Fear)', value: 13.51, change: -2.45, up: false },
            { symbol: '^TNX', name: '10Y Treasury', value: 4.193, change: 0.02, up: true },
            { symbol: 'DX-Y.NYB', name: 'US Dollar', value: 105.87, change: -0.15, up: false }
          ].map((market, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600' }}>{market.name}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{market.symbol}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: '600' }}>{market.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div style={{ fontSize: '9px', color: market.up ? '#10B981' : '#EF4444' }}>{market.up ? '▲' : '▼'} {Math.abs(market.change).toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Data for illustration. Real-time data requires market data subscription.</div>
      </div>

      {showAddInvestment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddInvestment(false)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '32px', width: '420px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>💼 Add Investment</h3>
            {[
              { label: 'Name', key: 'name', placeholder: 'e.g., Vanguard S&P 500' },
              { label: 'Type', key: 'type', type: 'select', options: Object.keys(ACCOUNT_COLORS) },
              { label: 'Value ($)', key: 'value', placeholder: '10000', inputType: 'number' },
              { label: 'Institution', key: 'institution', placeholder: 'e.g., Fidelity' }
            ].map((field, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{field.label}</label>
                {field.type === 'select' ? (
                  <select value={newInvestment[field.key]} onChange={e => setNewInvestment({ ...newInvestment, [field.key]: e.target.value })}
                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px' }}>
                    {field.options.map(opt => <option key={opt} value={opt} style={{ background: '#1E1B38' }}>{opt}</option>)}
                  </select>
                ) : (
                  <input type={field.inputType || 'text'} value={newInvestment[field.key]} onChange={e => setNewInvestment({ ...newInvestment, [field.key]: e.target.value })} placeholder={field.placeholder}
                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowAddInvestment(false)} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={addInvestment} style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Add</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.5); border-radius: 3px; }
      `}</style>
    </div>
  );
}
