import React, { useState, useMemo, useEffect } from 'react';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const ASSET_COLORS = {
  'Stocks': '#8B5CF6',
  'Bonds': '#3B82F6',
  'Mutual Funds': '#10B981',
  'ETFs': '#F59E0B',
  'Cash': '#6B7280',
  'Real Estate': '#EC4899',
  'Crypto': '#F97316',
  'Other': '#6366F1'
};

// Retirement Calculator Component
function RetirementCalculator({ color }) {
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('67');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [calculated, setCalculated] = useState(false);

  const results = useMemo(() => {
    const age = parseInt(currentAge) || 0;
    const retire = parseInt(retirementAge) || 67;
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const returnRate = (parseFloat(annualReturn) || 7) / 100;

    const yearsToRetire = Math.max(retire - age, 0);
    const monthsToRetire = yearsToRetire * 12;
    const monthlyRate = returnRate / 12;

    // Future value calculation
    // FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
    let futureValue = savings;
    if (monthlyRate > 0) {
      futureValue = savings * Math.pow(1 + monthlyRate, monthsToRetire) +
        monthly * ((Math.pow(1 + monthlyRate, monthsToRetire) - 1) / monthlyRate);
    } else {
      futureValue = savings + (monthly * monthsToRetire);
    }

    const totalContributions = savings + (monthly * monthsToRetire);
    const totalGrowth = futureValue - totalContributions;

    return {
      years: yearsToRetire,
      futureValue,
      initialBalance: savings,
      totalContributions: monthly * monthsToRetire,
      totalGrowth,
      initialPercent: futureValue > 0 ? (savings / futureValue * 100).toFixed(0) : 0,
      contributionsPercent: futureValue > 0 ? ((monthly * monthsToRetire) / futureValue * 100).toFixed(0) : 0,
      growthPercent: futureValue > 0 ? (totalGrowth / futureValue * 100).toFixed(0) : 0
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn]);

  const handleCalculate = () => {
    setCalculated(true);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {/* Left Side - Input Form */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Enter Your Information</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Enter your current age</label>
          <input 
            type="number" 
            value={currentAge} 
            onChange={(e) => setCurrentAge(e.target.value)}
            placeholder="30"
            style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Enter the age you plan to retire</label>
          <input 
            type="number" 
            value={retirementAge} 
            onChange={(e) => setRetirementAge(e.target.value)}
            placeholder="67"
            style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
            If you were born in 1960 or later, 67 years old is the age at which you can retire with full benefits.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>About how much money do you currently have in investments?</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}>$</span>
            <input 
              type="number" 
              value={currentSavings} 
              onChange={(e) => setCurrentSavings(e.target.value)}
              placeholder="50,000"
              style={{ width: '100%', padding: '14px', paddingLeft: '28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
            This should be the total of all your investment accounts including 401(k)s, IRAs, mutual funds, etc.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>How much will you contribute monthly?</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}>$</span>
            <input 
              type="number" 
              value={monthlyContribution} 
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="500"
              style={{ width: '100%', padding: '14px', paddingLeft: '28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
            This is the amount you invest each month. We recommend investing 15% of your paycheck.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>What do you think your annual return will be?</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              value={annualReturn} 
              onChange={(e) => setAnnualReturn(e.target.value)}
              placeholder="7"
              style={{ width: '100%', padding: '14px', paddingRight: '28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
            />
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }}>%</span>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
            This is the return your investment will generate over time. Historically, the 30-year return of the S&P 500 has been roughly 10-12%.
          </p>
        </div>

        <button 
          onClick={handleCalculate}
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: `linear-gradient(135deg, ${color}, ${color}CC)`, 
            border: 'none', 
            borderRadius: '12px', 
            color: 'white', 
            fontSize: '16px', 
            fontWeight: '600', 
            cursor: 'pointer' 
          }}
        >
          Calculate
        </button>
      </div>

      {/* Right Side - Results */}
      <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>Your Results</h3>
        
        {/* Estimated Retirement Savings */}
        <div style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, borderRadius: '16px', padding: '24px', marginBottom: '24px', border: `1px solid ${color}30` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Estimated Retirement Savings</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                In {results.years} years, your investment could be worth:
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#10B981' }}>
              {formatCurrency(results.futureValue)}
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '28px' }}>🎯</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>Want to make a plan to meet your retirement goals?</div>
            </div>
            <button style={{ padding: '10px 20px', background: `linear-gradient(135deg, ${color}, ${color}CC)`, border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Work With a Pro
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '28px' }}>💰</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>Are you saving enough to retire the way you want?</div>
            </div>
            <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Find Out
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <span style={{ fontSize: '28px' }}>📚</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>Want to boost your investing knowledge?</div>
            </div>
            <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Learn for Free
            </button>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Initial Balance</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#8B5CF6' }}>{formatCurrency(results.initialBalance)}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{results.initialPercent}% of Total</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Contributions</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#3B82F6' }}>{formatCurrency(results.totalContributions)}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{results.contributionsPercent}% of Total</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Growth</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981' }}>{formatCurrency(results.totalGrowth)}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{results.growthPercent}% of Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Investment Allocation Donut Chart
function AllocationChart({ investments }) {
  const total = investments.reduce((sum, inv) => sum + inv.value, 0);
  if (total === 0) return null;

  let currentAngle = 0;
  const paths = investments.map((inv, i) => {
    const percentage = inv.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const largeArc = angle > 180 ? 1 : 0;

    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);

    return (
      <path
        key={i}
        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={ASSET_COLORS[inv.type] || ASSET_COLORS['Other']}
        opacity="0.9"
      />
    );
  });

  return (
    <svg viewBox="0 0 200 200" style={{ width: '200px', height: '200px' }}>
      {paths}
      <circle cx="100" cy="100" r="50" fill="#1E1B38" />
      <text x="100" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Total</text>
      <text x="100" y="115" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">{formatCurrency(total)}</text>
    </svg>
  );
}

export default function RetirementTab() {
  const [activeView, setActiveView] = useState('calculator');
  const [investments, setInvestments] = useState([]);
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [newInvestment, setNewInvestment] = useState({ name: '', type: 'Stocks', value: '', institution: '' });
  const [uploadedFile, setUploadedFile] = useState(null);

  const sideHustleName = useMemo(() => {
    try { return localStorage.getItem('ff_sidehustle_name') || 'Side Hustle'; } catch { return 'Side Hustle'; }
  }, []);

  const totalInvestments = investments.reduce((sum, inv) => sum + parseFloat(inv.value || 0), 0);
  
  const investmentsByType = useMemo(() => {
    const grouped = {};
    investments.forEach(inv => {
      const type = inv.type || 'Other';
      if (!grouped[type]) grouped[type] = 0;
      grouped[type] += parseFloat(inv.value || 0);
    });
    return Object.entries(grouped).map(([type, value]) => ({ type, value })).sort((a, b) => b.value - a.value);
  }, [investments]);

  const addInvestment = () => {
    if (!newInvestment.name || !newInvestment.value) return;
    const inv = {
      id: Date.now(),
      name: newInvestment.name,
      type: newInvestment.type,
      value: parseFloat(newInvestment.value),
      institution: newInvestment.institution,
      dateAdded: new Date().toISOString()
    };
    setInvestments([...investments, inv]);
    setNewInvestment({ name: '', type: 'Stocks', value: '', institution: '' });
    setShowAddInvestment(false);
  };

  const deleteInvestment = (id) => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  // Save investments to localStorage whenever they change
  useEffect(() => {
    if (investments.length > 0) {
      localStorage.setItem('ff_investments', JSON.stringify(investments));
    }
  }, [investments]);

  // Load investments from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ff_investments');
      if (saved) {
        setInvestments(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading investments:', e);
    }
  }, []);

  const [importStatus, setImportStatus] = useState(null);
  const [importedData, setImportedData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [showMappingModal, setShowMappingModal] = useState(false);

  // Detect asset type from investment name
  const detectAssetType = (name) => {
    const nameLower = (name || '').toLowerCase();
    if (nameLower.includes('etf') || nameLower.includes('ishares') || nameLower.includes('spdr') || nameLower.includes('vanguard') && nameLower.includes('index')) return 'ETFs';
    if (nameLower.includes('mutual') || nameLower.includes('fund') || nameLower.includes('fidelity') || nameLower.includes('american funds')) return 'Mutual Funds';
    if (nameLower.includes('bond') || nameLower.includes('treasury') || nameLower.includes('fixed income') || nameLower.includes('govt')) return 'Bonds';
    if (nameLower.includes('money market') || nameLower.includes('cash') || nameLower.includes('savings') || nameLower.includes('sweep')) return 'Cash';
    if (nameLower.includes('reit') || nameLower.includes('real estate') || nameLower.includes('property')) return 'Real Estate';
    if (nameLower.includes('crypto') || nameLower.includes('bitcoin') || nameLower.includes('ethereum')) return 'Crypto';
    if (nameLower.includes('stock') || nameLower.includes('equity') || nameLower.includes('common') || nameLower.includes('preferred')) return 'Stocks';
    // Default to stocks for individual tickers
    if (/^[A-Z]{1,5}$/.test(name.trim())) return 'Stocks';
    return 'Mutual Funds'; // Most brokerage holdings are mutual funds
  };

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return { headers: [], data: [] };
    
    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/"/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/"/g, ''));
      
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx];
        });
        data.push(row);
      }
    }
    
    return { headers, data };
  };

  // Auto-detect column mappings
  const autoDetectMapping = (headers) => {
    const mapping = { name: '', value: '', type: '', symbol: '', shares: '' };
    const headerLower = headers.map(h => h.toLowerCase());
    
    // Name/Description detection
    const namePatterns = ['name', 'description', 'security', 'investment', 'holding', 'fund name', 'asset'];
    for (const pattern of namePatterns) {
      const idx = headerLower.findIndex(h => h.includes(pattern));
      if (idx !== -1) { mapping.name = headers[idx]; break; }
    }
    
    // Value/Amount detection
    const valuePatterns = ['value', 'market value', 'current value', 'amount', 'balance', 'total', 'worth'];
    for (const pattern of valuePatterns) {
      const idx = headerLower.findIndex(h => h.includes(pattern) && !h.includes('change'));
      if (idx !== -1) { mapping.value = headers[idx]; break; }
    }
    
    // Symbol/Ticker detection
    const symbolPatterns = ['symbol', 'ticker', 'cusip'];
    for (const pattern of symbolPatterns) {
      const idx = headerLower.findIndex(h => h.includes(pattern));
      if (idx !== -1) { mapping.symbol = headers[idx]; break; }
    }
    
    // Type/Category detection
    const typePatterns = ['type', 'category', 'asset class', 'class'];
    for (const pattern of typePatterns) {
      const idx = headerLower.findIndex(h => h.includes(pattern));
      if (idx !== -1) { mapping.type = headers[idx]; break; }
    }
    
    // Shares/Quantity detection
    const sharesPatterns = ['shares', 'quantity', 'units', 'qty'];
    for (const pattern of sharesPatterns) {
      const idx = headerLower.findIndex(h => h.includes(pattern));
      if (idx !== -1) { mapping.shares = headers[idx]; break; }
    }
    
    return mapping;
  };

  // Parse currency string to number
  const parseCurrency = (str) => {
    if (!str) return 0;
    const cleaned = str.toString().replace(/[$,\s()]/g, '').replace(/^\((.+)\)$/, '-$1');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.abs(num);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file.name);
    setImportStatus('processing');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const { headers, data } = parseCSV(text);
        
        if (headers.length === 0 || data.length === 0) {
          setImportStatus('error');
          return;
        }

        setCsvHeaders(headers);
        setImportedData(data);
        
        // Auto-detect column mappings
        const detected = autoDetectMapping(headers);
        setColumnMapping(detected);
        
        // If we have name and value, we can proceed
        if (detected.name && detected.value) {
          setImportStatus('mapped');
        } else {
          setImportStatus('needs-mapping');
          setShowMappingModal(true);
        }
      } catch (error) {
        console.error('CSV parsing error:', error);
        setImportStatus('error');
      }
    };

    reader.onerror = () => {
      setImportStatus('error');
    };

    reader.readAsText(file);
  };

  // Import the mapped data as investments
  const importInvestments = () => {
    if (!columnMapping.name || !columnMapping.value) {
      alert('Please map at least the Name and Value columns');
      return;
    }

    const newInvestments = importedData
      .map((row, idx) => {
        const name = row[columnMapping.name] || '';
        const value = parseCurrency(row[columnMapping.value]);
        const symbol = columnMapping.symbol ? row[columnMapping.symbol] : '';
        const type = columnMapping.type ? row[columnMapping.type] : detectAssetType(name + ' ' + symbol);
        
        // Skip rows with no name or zero value
        if (!name || value === 0) return null;
        
        return {
          id: Date.now() + idx,
          name: symbol ? `${name} (${symbol})` : name,
          type: type,
          value: value,
          institution: uploadedFile ? uploadedFile.replace('.csv', '').replace('.CSV', '') : 'Imported',
          dateAdded: new Date().toISOString()
        };
      })
      .filter(inv => inv !== null);

    if (newInvestments.length > 0) {
      setInvestments(prev => [...prev, ...newInvestments]);
      setImportStatus('success');
      setActiveView('investments');
    } else {
      setImportStatus('no-data');
    }
  };

  const clearImport = () => {
    setUploadedFile(null);
    setImportStatus(null);
    setImportedData([]);
    setColumnMapping({});
    setCsvHeaders([]);
  };

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            🏖️ Retirement Planning
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>
            Plan your future and track your investments
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'calculator', label: '🧮 Retirement Calculator', icon: '🧮' },
          { id: 'investments', label: '📊 My Investments', icon: '📊' },
          { id: 'upload', label: '📄 Import Statements', icon: '📄' }
        ].map(view => (
          <button key={view.id} onClick={() => setActiveView(view.id)}
            style={{ 
              padding: '12px 20px', 
              background: activeView === view.id ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.1)', 
              border: 'none', 
              borderRadius: '10px', 
              color: 'white', 
              fontSize: '14px', 
              fontWeight: activeView === view.id ? '600' : '400', 
              cursor: 'pointer' 
            }}>
            {view.label}
          </button>
        ))}
      </div>

      {/* Calculator View */}
      {activeView === 'calculator' && (
        <RetirementCalculator color="#8B5CF6" />
      )}

      {/* Investments View */}
      {activeView === 'investments' && (
        <div>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>💰 Total Portfolio</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{formatCurrency(totalInvestments)}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>📈 Asset Classes</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{investmentsByType.length}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>🏦 Investments</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{investments.length}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>📊 Largest Holding</div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>
                {investments.length > 0 ? formatCurrency(Math.max(...investments.map(i => i.value))) : '$0'}
              </div>
            </div>
          </div>

          {/* Split View */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0' }}>
            {/* Left - Allocation Chart */}
            <div style={{ paddingRight: '24px' }}>
              <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '24px' }}>🥧</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Portfolio Allocation</h3>
                </div>

                {investments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
                    <div style={{ fontSize: '14px' }}>Add investments to see your allocation</div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                      <AllocationChart investments={investmentsByType} />
                    </div>
                    
                    {/* Legend */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {investmentsByType.map((inv, i) => (
                        <div key={inv.type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: ASSET_COLORS[inv.type] || ASSET_COLORS['Other'] }} />
                          <span style={{ fontSize: '12px', flex: 1 }}>{inv.type}</span>
                          <span style={{ fontSize: '12px', fontWeight: '600' }}>{((inv.value / totalInvestments) * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />

            {/* Right - Investment List */}
            <div style={{ paddingLeft: '24px' }}>
              <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px', position: 'relative' }}>
                  <span style={{ fontSize: '24px' }}>💼</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>My Investments</h3>
                  <button onClick={() => setShowAddInvestment(true)}
                    style={{ position: 'absolute', right: 0, padding: '8px 14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                    + Add
                  </button>
                </div>

                {investments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
                    <div style={{ fontSize: '14px', marginBottom: '16px' }}>No investments added yet</div>
                    <button onClick={() => setShowAddInvestment(true)}
                      style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                      Add Your First Investment
                    </button>
                  </div>
                ) : (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {investments.map(inv => (
                      <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '10px', border: `1px solid ${ASSET_COLORS[inv.type] || ASSET_COLORS['Other']}30` }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${ASSET_COLORS[inv.type] || ASSET_COLORS['Other']}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: ASSET_COLORS[inv.type] || ASSET_COLORS['Other'] }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>{inv.name}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{inv.type} • {inv.institution || 'No institution'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', fontSize: '16px', color: '#10B981' }}>{formatCurrency(inv.value)}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{((inv.value / totalInvestments) * 100).toFixed(1)}%</div>
                        </div>
                        <button onClick={() => deleteInvestment(inv.id)}
                          style={{ padding: '6px 10px', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '6px', color: '#EF4444', fontSize: '12px', cursor: 'pointer' }}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload View */}
      {activeView === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              📄 Import Financial Statements
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              Export your holdings as CSV from your brokerage and upload here to import your investments.
            </p>

            {/* Upload Area */}
            {!uploadedFile && (
              <div style={{ border: '2px dashed rgba(139, 92, 246, 0.4)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
                <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} id="fileUpload" />
                <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Drop your CSV file here or click to upload</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Supports .CSV files exported from your brokerage</div>
                </label>
              </div>
            )}

            {/* Processing Status */}
            {importStatus === 'processing' && (
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                <div style={{ fontWeight: '600' }}>Processing {uploadedFile}...</div>
              </div>
            )}

            {/* Mapping Success */}
            {importStatus === 'mapped' && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>✅</span>
                    <div>
                      <div style={{ fontWeight: '600' }}>{uploadedFile}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Found {importedData.length} investments ready to import</div>
                    </div>
                  </div>
                </div>

                {/* Column Mapping Preview */}
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Column Mapping (Auto-Detected)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Name:</span>
                      <span style={{ fontWeight: '600', fontSize: '12px' }}>{columnMapping.name || 'Not found'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Value:</span>
                      <span style={{ fontWeight: '600', fontSize: '12px' }}>{columnMapping.value || 'Not found'}</span>
                    </div>
                    {columnMapping.symbol && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Symbol:</span>
                        <span style={{ fontWeight: '600', fontSize: '12px' }}>{columnMapping.symbol}</span>
                      </div>
                    )}
                    {columnMapping.type && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Type:</span>
                        <span style={{ fontWeight: '600', fontSize: '12px' }}>{columnMapping.type}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Table */}
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Preview (First 5 rows)</h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {importedData.slice(0, 5).map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderRadius: '6px' }}>
                        <span style={{ fontSize: '13px', flex: 1 }}>{row[columnMapping.name]}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#10B981' }}>${parseCurrency(row[columnMapping.value]).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={clearImport}
                    style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={() => setShowMappingModal(true)}
                    style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                    Edit Mapping
                  </button>
                  <button onClick={importInvestments}
                    style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    Import {importedData.length} Investments
                  </button>
                </div>
              </div>
            )}

            {/* Needs Manual Mapping */}
            {importStatus === 'needs-mapping' && (
              <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: '600' }}>Column mapping needed</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>We couldn't auto-detect all columns. Please map them manually.</div>
                  </div>
                </div>
                <button onClick={() => setShowMappingModal(true)}
                  style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  Map Columns
                </button>
              </div>
            )}

            {/* Error State */}
            {importStatus === 'error' && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>❌</span>
                  <div>
                    <div style={{ fontWeight: '600' }}>Error parsing file</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Please make sure you're uploading a valid CSV file.</div>
                  </div>
                </div>
                <button onClick={clearImport} style={{ marginTop: '12px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>
                  Try Again
                </button>
              </div>
            )}

            {/* Success State */}
            {importStatus === 'success' && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>🎉</span>
                  <div>
                    <div style={{ fontWeight: '600' }}>Investments imported successfully!</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>View them in the "My Investments" tab.</div>
                  </div>
                </div>
              </div>
            )}

            {/* How to Export Instructions */}
            <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>💡</span> How to Export from Your Brokerage
              </h4>
              <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
                <li>Log in to your brokerage account (Ameriprise, Fidelity, Vanguard, etc.)</li>
                <li>Go to "Holdings", "Positions", or "Portfolio" page</li>
                <li>Look for "Export", "Download", or "⬇️" button</li>
                <li>Select CSV or Excel format</li>
                <li>Upload the downloaded file here</li>
              </ol>
            </div>

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Supported Brokerages</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Ameriprise', 'Fidelity', 'Vanguard', 'Charles Schwab', 'TD Ameritrade', 'E*TRADE', 'Robinhood', 'Merrill Lynch', 'Morgan Stanley', 'Edward Jones'].map(inst => (
                  <span key={inst} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '12px' }}>{inst}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              🔗 Connect Accounts
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              Connect directly to your brokerage for automatic updates. Coming soon!
            </p>

            <div style={{ opacity: 0.6 }}>
              {['Plaid Integration', 'Direct Brokerage Sync', 'Real-time Updates'].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🔒</span>
                  <span style={{ fontSize: '14px' }}>{feature}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '11px', padding: '4px 10px', background: 'rgba(251, 191, 36, 0.2)', borderRadius: '6px', color: '#FBBF24' }}>Coming Soon</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Column Mapping Modal */}
      {showMappingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowMappingModal(false)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '32px', width: '500px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>🗂️ Map CSV Columns</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Match your CSV columns to the required fields. Name and Value are required.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Investment Name Column *</label>
              <select value={columnMapping.name} onChange={e => setColumnMapping({ ...columnMapping, name: e.target.value })}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px' }}>
                <option value="" style={{ background: '#1E1B38' }}>-- Select Column --</option>
                {csvHeaders.map(h => <option key={h} value={h} style={{ background: '#1E1B38' }}>{h}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Value/Amount Column *</label>
              <select value={columnMapping.value} onChange={e => setColumnMapping({ ...columnMapping, value: e.target.value })}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px' }}>
                <option value="" style={{ background: '#1E1B38' }}>-- Select Column --</option>
                {csvHeaders.map(h => <option key={h} value={h} style={{ background: '#1E1B38' }}>{h}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Symbol/Ticker Column (Optional)</label>
              <select value={columnMapping.symbol || ''} onChange={e => setColumnMapping({ ...columnMapping, symbol: e.target.value })}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px' }}>
                <option value="" style={{ background: '#1E1B38' }}>-- None --</option>
                {csvHeaders.map(h => <option key={h} value={h} style={{ background: '#1E1B38' }}>{h}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Asset Type Column (Optional)</label>
              <select value={columnMapping.type || ''} onChange={e => setColumnMapping({ ...columnMapping, type: e.target.value })}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px' }}>
                <option value="" style={{ background: '#1E1B38' }}>-- Auto-Detect --</option>
                {csvHeaders.map(h => <option key={h} value={h} style={{ background: '#1E1B38' }}>{h}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowMappingModal(false)}
                style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => { setShowMappingModal(false); if (columnMapping.name && columnMapping.value) setImportStatus('mapped'); }}
                style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Apply Mapping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Investment Modal */}
      {showAddInvestment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddInvestment(false)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '32px', width: '420px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>💼 Add Investment</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Investment Name</label>
              <input value={newInvestment.name} onChange={e => setNewInvestment({ ...newInvestment, name: e.target.value })} placeholder="e.g., Vanguard S&P 500 ETF"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Asset Type</label>
              <select value={newInvestment.type} onChange={e => setNewInvestment({ ...newInvestment, type: e.target.value })}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}>
                {Object.keys(ASSET_COLORS).map(type => (
                  <option key={type} value={type} style={{ background: '#1E1B38' }}>{type}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Current Value ($)</label>
              <input type="number" value={newInvestment.value} onChange={e => setNewInvestment({ ...newInvestment, value: e.target.value })} placeholder="10000"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Institution (Optional)</label>
              <input value={newInvestment.institution} onChange={e => setNewInvestment({ ...newInvestment, institution: e.target.value })} placeholder="e.g., Fidelity"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowAddInvestment(false)}
                style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={addInvestment}
                style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Add Investment
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
