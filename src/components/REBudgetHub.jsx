import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// RE BUDGET HUB - Real Estate Investment Analysis Dashboard
// A comprehensive real estate deal analyzer with beautiful visualizations
// ═══════════════════════════════════════════════════════════════════════════════

const REBudgetHub = ({ theme: themeProp = {}, profile, initialTab = 'analyzer' }) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Default theme values for safety
  const theme = {
    bgCard: themeProp.bgCard || '#FFFFFF',
    bgMain: themeProp.bgMain || '#F9FAFB',
    cardShadow: themeProp.cardShadow || '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderLight: themeProp.borderLight || '#E5E7EB',
    textPrimary: themeProp.textPrimary || '#111827',
    textSecondary: themeProp.textSecondary || '#6B7280',
    textMuted: themeProp.textMuted || '#9CA3AF',
    mode: themeProp.mode || 'light',
    border: themeProp.border || '#E5E7EB',
    primary: themeProp.primary || '#6366F1',
    success: themeProp.success || '#10B981',
    danger: themeProp.danger || '#EF4444',
    ...themeProp
  };
  
  // Map 'ai' to 'aianalysis' for tab matching
  const mappedInitialTab = initialTab === 'ai' ? 'aianalysis' : initialTab;
  const [activeTab, setActiveTab] = useState(mappedInitialTab);
  const [collapsedSections, setCollapsedSections] = useState({});
  
  // Simulation Criteria State
  const [simulationCriteria, setSimulationCriteria] = useState({
    minCashOnCash: 8,
    minCapRate: 5,
    minMonthlyCashFlow: 200,
    minAnnualCashFlow: 2400,
    maxLTV: 80,
    minDSCR: 1.2,
    minTotalROI: 12,
    maxPurchasePrice: 500000,
    minEquityYear5: 100000,
    maxVacancyRate: 5,
    minAppreciation: 3,
    maxDebtToIncome: 45
  });
  
  const updateCriteria = (field, value) => {
    setSimulationCriteria(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };
  
  // Property Input State
  const [propertyData, setPropertyData] = useState({
    // Property Details
    propertyAddress: '1234 Main St, City, State 12345',
    propertyType: 'sfh', // sfh, duplex, triplex, quadplex, small-multi, large-multi
    unitCount: 1, // Number of doors/units
    arv: 440000,
    purchasePrice: 440000,
    sellerConcessions: 3000,
    downPaymentPercent: 25,
    closingCostsPercent: 1.1,
    rentReadyCosts: 3000,
    
    // Mortgage
    mortgageAmount: 330000,
    interestRate: 6.875,
    loanTermYears: 30,
    pmiRate: 0,
    dropPmiLtv: 80,
    
    // Income
    monthlyRent: 3600,
    otherIncome: 0,
    
    // Expenses (Annual)
    vacancyRate: 3,
    propertyTaxRate: 0.715,
    propertyInsurance: 1500,
    hoaDues: 350,
    utilities: 0,
    otherExpenses1: 0,
    otherExpenses2: 0,
    maintenancePercent: 10,
    capEx: 0,
    managementPercent: 10,
    
    // Depreciation
    landValuePercent: 15,
    depreciationType: 'R', // R = Residential (27.5 years)
    effectiveTaxRate: 20,
    
    // Appreciation & Growth
    annualAppreciation: 3,
    annualRentGrowth: 2,
    
    // Sale Assumptions
    realEstateCommission: 3,
    closingCostsAtSale: 1,
    capitalGainsTaxRate: 15,
    depreciationRecaptureRate: 25
  });
  
  // Property Type Options
  const propertyTypes = [
    { value: 'sfh', label: 'Single Family Home', units: 1 },
    { value: 'duplex', label: 'Duplex', units: 2 },
    { value: 'triplex', label: 'Triplex', units: 3 },
    { value: 'quadplex', label: 'Quadplex', units: 4 },
    { value: 'small-multi', label: 'Small Multi-Family (5-10)', units: 0 },
    { value: 'large-multi', label: 'Large Multi-Family (10+)', units: 0 }
  ];
  
  // Deal Comparison State (up to 4 deals)
  const [savedDeals, setSavedDeals] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  
  // Chart Filter State
  const [chartFilter, setChartFilter] = useState({
    viewType: 'all', // all, yearly, monthly
    yearRange: 20,
    showMetric: 'all' // all, cashflow, roi, equity, breakeven
  });
  
  // Save current deal for comparison
  const saveCurrentDeal = () => {
    if (savedDeals.length >= 4) {
      alert('Maximum 4 deals can be compared. Remove a deal first.');
      return;
    }
    const dealCopy = {
      id: Date.now(),
      name: propertyData.propertyAddress,
      data: { ...propertyData },
      calculations: { ...calculations }
    };
    setSavedDeals(prev => [...prev, dealCopy]);
  };
  
  // Remove deal from comparison
  const removeDeal = (id) => {
    setSavedDeals(prev => prev.filter(d => d.id !== id));
  };

  // Toggle section collapse
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Update property data
  const updateProperty = (field, value) => {
    setPropertyData(prev => ({ ...prev, [field]: value }));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const calculations = useMemo(() => {
    const p = propertyData;
    
    // Basic Calculations
    const downPayment = p.purchasePrice * (p.downPaymentPercent / 100);
    const closingCosts = p.purchasePrice * (p.closingCostsPercent / 100);
    const totalInvested = downPayment + closingCosts + p.rentReadyCosts - p.sellerConcessions;
    const loanAmount = p.purchasePrice - downPayment;
    
    // Monthly Mortgage Payment (P&I) - with safeguard for 0% interest
    const monthlyRate = p.interestRate / 100 / 12;
    const numPayments = p.loanTermYears * 12;
    let monthlyPI = 0;
    if (monthlyRate > 0 && numPayments > 0) {
      const factor = Math.pow(1 + monthlyRate, numPayments);
      monthlyPI = loanAmount * (monthlyRate * factor) / (factor - 1);
    } else if (numPayments > 0) {
      // 0% interest - simple division
      monthlyPI = loanAmount / numPayments;
    }
    // Handle NaN
    if (isNaN(monthlyPI) || !isFinite(monthlyPI)) monthlyPI = 0;
    const annualPI = monthlyPI * 12;
    
    // Income
    const grossPotentialIncome = p.monthlyRent * 12 + p.otherIncome * 12;
    const vacancyLoss = grossPotentialIncome * (p.vacancyRate / 100);
    const effectiveGrossIncome = grossPotentialIncome - vacancyLoss;
    
    // Operating Expenses
    const propertyTaxes = p.purchasePrice * (p.propertyTaxRate / 100);
    const maintenance = effectiveGrossIncome * (p.maintenancePercent / 100);
    const management = effectiveGrossIncome * (p.managementPercent / 100);
    const totalOperatingExpenses = propertyTaxes + p.propertyInsurance + p.hoaDues + p.utilities + 
      p.otherExpenses1 + p.otherExpenses2 + maintenance + p.capEx + management;
    
    // Net Operating Income (NOI)
    const noi = effectiveGrossIncome - totalOperatingExpenses;
    
    // Cash Flow
    const annualCashFlow = noi - annualPI;
    const monthlyCashFlow = annualCashFlow / 12;
    
    // Depreciation
    const buildingValue = p.purchasePrice * (1 - p.landValuePercent / 100);
    const depreciationYears = p.depreciationType === 'R' ? 27.5 : 39;
    const annualDepreciation = buildingValue / depreciationYears;
    const cashFlowFromDepreciation = annualDepreciation * (p.effectiveTaxRate / 100);
    
    // True Cash Flow (including tax benefits)
    const trueCashFlow = annualCashFlow + cashFlowFromDepreciation;
    const monthlyTrueCashFlow = trueCashFlow / 12;
    
    // Returns - with safeguards for division by zero
    const safePurchasePrice = p.purchasePrice || 1;
    const safeTotalInvested = totalInvested || 1;
    const capRate = (noi / safePurchasePrice) * 100;
    const cashOnCashReturn = (annualCashFlow / safeTotalInvested) * 100;
    const trueCashOnCashReturn = (trueCashFlow / safeTotalInvested) * 100;
    
    // First Year Interest vs Principal
    let remainingBalance = loanAmount;
    let totalInterestYear1 = 0;
    let totalPrincipalYear1 = 0;
    for (let month = 0; month < 12; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPI - interestPayment;
      totalInterestYear1 += interestPayment;
      totalPrincipalYear1 += principalPayment;
      remainingBalance -= principalPayment;
    }
    
    // Equity Year 1
    const equityYear1 = downPayment + totalPrincipalYear1;
    
    // ROI Quadrants (Year 1)
    const appreciationReturn = p.purchasePrice * (p.annualAppreciation / 100);
    const appreciationROI = (appreciationReturn / safeTotalInvested) * 100;
    const cashFlowROI = (annualCashFlow / safeTotalInvested) * 100;
    const debtPaydownROI = (totalPrincipalYear1 / safeTotalInvested) * 100;
    const depreciationROI = (cashFlowFromDepreciation / safeTotalInvested) * 100;
    const totalROI = appreciationROI + cashFlowROI + debtPaydownROI + depreciationROI;
    
    // Generate multi-year projections
    const years = 18;
    const projections = [];
    let currentValue = p.purchasePrice;
    let currentRent = p.monthlyRent;
    let loanBalance = loanAmount;
    let cumulativeAppreciation = 0;
    let cumulativeCashFlow = 0;
    let cumulativeDebtPaydown = 0;
    let cumulativeDepreciation = 0;
    
    for (let year = 1; year <= years; year++) {
      // Property Value & Rent Growth
      if (year > 1) {
        currentValue *= (1 + p.annualAppreciation / 100);
        currentRent *= (1 + p.annualRentGrowth / 100);
      }
      
      // Recalculate for this year
      const yearGrossIncome = currentRent * 12;
      const yearVacancy = yearGrossIncome * (p.vacancyRate / 100);
      const yearEffectiveIncome = yearGrossIncome - yearVacancy;
      const yearNOI = yearEffectiveIncome - totalOperatingExpenses;
      const yearCashFlow = yearNOI - annualPI;
      
      // Calculate loan paydown for this year
      let yearPrincipal = 0;
      let yearInterest = 0;
      let tempBalance = loanBalance;
      for (let month = 0; month < 12; month++) {
        const interest = tempBalance * monthlyRate;
        const principal = monthlyPI - interest;
        yearPrincipal += principal;
        yearInterest += interest;
        tempBalance -= principal;
      }
      loanBalance = tempBalance;
      
      // Equity
      const equity = currentValue - loanBalance;
      const ltv = currentValue > 0 ? (loanBalance / currentValue) * 100 : 0;
      
      // Appreciation this year
      const yearAppreciation = year === 1 
        ? p.purchasePrice * (p.annualAppreciation / 100)
        : currentValue * (p.annualAppreciation / 100) / (1 + p.annualAppreciation / 100);
      
      // Cumulative totals
      cumulativeAppreciation += yearAppreciation;
      cumulativeCashFlow += yearCashFlow;
      cumulativeDebtPaydown += yearPrincipal;
      cumulativeDepreciation += cashFlowFromDepreciation;
      
      const totalReturn = cumulativeAppreciation + cumulativeCashFlow + cumulativeDebtPaydown + cumulativeDepreciation;
      
      // Cash-out Refi calculations
      const maxLTV = 75;
      const cashOutRefiEquity = equity * (maxLTV / 100) - loanBalance;
      const costToAccessEquity = currentValue * 0.015; // 1.5% refi cost
      const trueNetEquity = equity - costToAccessEquity;
      
      // Safe ROI calculations
      const safeROI = safeTotalInvested > 0 ? (totalReturn / safeTotalInvested) * 100 : 0;
      const safeAnnualizedROI = safeTotalInvested > 0 ? Math.pow(1 + totalReturn / safeTotalInvested, 1 / year) - 1 : 0;
      
      projections.push({
        year,
        propertyValue: currentValue,
        monthlyRent: currentRent,
        annualCashFlow: yearCashFlow,
        monthlyCashFlow: yearCashFlow / 12,
        loanBalance,
        equity,
        ltv,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        appreciation: yearAppreciation,
        cumulativeAppreciation,
        cumulativeCashFlow,
        cumulativeDebtPaydown,
        cumulativeDepreciation,
        totalReturn,
        roi: safeROI,
        annualizedROI: safeAnnualizedROI,
        capRate: (yearNOI / currentValue) * 100,
        cashOnCash: (yearCashFlow / totalInvested) * 100,
        cashOutRefiEquity: Math.max(0, cashOutRefiEquity),
        trueNetEquity,
        costToAccessEquity
      });
    }
    
    return {
      // Basic
      downPayment,
      closingCosts,
      totalInvested,
      loanAmount,
      
      // Mortgage
      monthlyPI,
      annualPI,
      
      // Income
      grossPotentialIncome,
      vacancyLoss,
      effectiveGrossIncome,
      
      // Expenses
      propertyTaxes,
      maintenance,
      management,
      totalOperatingExpenses,
      
      // NOI & Cash Flow
      noi,
      annualCashFlow,
      monthlyCashFlow,
      
      // Depreciation
      buildingValue,
      annualDepreciation,
      cashFlowFromDepreciation,
      
      // True Cash Flow
      trueCashFlow,
      monthlyTrueCashFlow,
      
      // Returns
      capRate,
      cashOnCashReturn,
      trueCashOnCashReturn,
      
      // Year 1 Details
      totalInterestYear1,
      totalPrincipalYear1,
      equityYear1,
      
      // ROI Quadrants
      appreciationReturn,
      appreciationROI,
      cashFlowROI,
      debtPaydownROI,
      depreciationROI,
      totalROI,
      
      // Projections
      projections
    };
  }, [propertyData]);

  // ═══════════════════════════════════════════════════════════════════════════
  // FORMATTERS
  // ═══════════════════════════════════════════════════════════════════════════
  const safeNumber = (value, fallback = 0) => {
    if (typeof value === 'number' && isFinite(value) && !isNaN(value)) return value;
    return fallback;
  };
  
  const formatCurrency = (value) => {
    const safeValue = safeNumber(value, 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(safeValue);
  };

  const formatPercent = (value, decimals = 2) => {
    const safeValue = safeNumber(value, 0);
    return `${safeValue.toFixed(decimals)}%`;
  };
  
  const safeFixed = (value, decimals = 2) => {
    return safeNumber(value, 0).toFixed(decimals);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPONENT STYLES
  // ═══════════════════════════════════════════════════════════════════════════
  const cardStyle = {
    background: theme.bgCard,
    borderRadius: '20px',
    padding: '24px',
    boxShadow: theme.cardShadow,
    border: `1px solid ${theme.borderLight}`,
    position: 'relative',
    overflow: 'hidden'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1px solid ${theme.borderLight}`,
    background: theme.bgMain,
    color: theme.textPrimary,
    fontSize: '14px',
    fontWeight: '500'
  };

  const labelStyle = {
    fontSize: '12px',
    color: theme.textMuted,
    marginBottom: '6px',
    display: 'block',
    fontWeight: '500'
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SUB-TABS
  // ═══════════════════════════════════════════════════════════════════════════
  const tabs = [
    { id: 'analyzer', label: 'Deal Analyzer', icon: '🏠', color: '#10B981' },
    { id: 'compare', label: 'Compare Deals', icon: '⚖️', color: '#06B6D4' },
    { id: 'cashflow', label: 'Cash Flow', icon: '💵', color: '#3B82F6' },
    { id: 'roi', label: 'ROI Analysis', icon: '📈', color: '#8B5CF6' },
    { id: 'equity', label: 'Equity Tracker', icon: '💰', color: '#F59E0B' },
    { id: 'sale', label: 'Sale Projections', icon: '🏷️', color: '#EC4899' },
    { id: 'simulation', label: 'Deal Simulation', icon: '🎯', color: '#EF4444' },
    { id: 'aianalysis', label: 'AI Analysis', icon: '🪙', color: '#F472B6' }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: DEAL ANALYZER TAB
  // ═══════════════════════════════════════════════════════════════════════════
  const renderAnalyzerTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
      {/* Left Column - Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Property Address */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #3B82F6)' }} />
          <input
            type="text"
            value={propertyData.propertyAddress}
            onChange={(e) => updateProperty('propertyAddress', e.target.value)}
            style={{ ...inputStyle, fontSize: '16px', fontWeight: '600', textAlign: 'center', marginBottom: '16px' }}
          />
          
          {/* Property Type Selector */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '16px' }}>🏘️</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Property Classification</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: theme.textSecondary, display: 'flex', alignItems: 'center' }}>Property Type</span>
              <select 
                value={propertyData.propertyType} 
                onChange={(e) => {
                  const selected = propertyTypes.find(t => t.value === e.target.value);
                  updateProperty('propertyType', e.target.value);
                  if (selected && selected.units > 0) {
                    updateProperty('unitCount', selected.units);
                  }
                }}
                style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px', gridColumn: 'span 1' }}
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              
              <span style={{ color: theme.textSecondary, display: 'flex', alignItems: 'center' }}>Units/Doors</span>
              <input
                type="number"
                min="1"
                value={propertyData.unitCount}
                onChange={(e) => updateProperty('unitCount', parseInt(e.target.value) || 1)}
                disabled={!['small-multi', 'large-multi'].includes(propertyData.propertyType)}
                style={{ 
                  ...inputStyle, 
                  padding: '8px 10px', 
                  textAlign: 'right', 
                  fontSize: '13px',
                  opacity: ['small-multi', 'large-multi'].includes(propertyData.propertyType) ? 1 : 0.5,
                  cursor: ['small-multi', 'large-multi'].includes(propertyData.propertyType) ? 'text' : 'not-allowed'
                }}
              />
            </div>
            
            {/* Property Type Visual Indicator */}
            <div style={{ 
              marginTop: '12px', 
              padding: '10px 14px', 
              background: theme.mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)', 
              borderRadius: '10px', 
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>
                {propertyData.propertyType === 'sfh' ? '🏠' : 
                 propertyData.propertyType === 'duplex' ? '🏘️' : 
                 propertyData.propertyType === 'triplex' ? '🏢' : 
                 propertyData.propertyType === 'quadplex' ? '🏬' : '🏗️'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: theme.textPrimary }}>
                  {propertyTypes.find(t => t.value === propertyData.propertyType)?.label || 'SFH'}
                </div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>
                  {propertyData.unitCount} {propertyData.unitCount === 1 ? 'Door' : 'Doors'} • ${(propertyData.monthlyRent / propertyData.unitCount).toFixed(0)}/door/mo
                </div>
              </div>
            </div>
            
            {/* Save for Comparison Button */}
            <button
              onClick={saveCurrentDeal}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px 16px',
                background: savedDeals.length >= 4 
                  ? 'rgba(107, 114, 128, 0.2)' 
                  : 'linear-gradient(135deg, #06B6D4, #0891B2)',
                border: 'none',
                borderRadius: '10px',
                color: savedDeals.length >= 4 ? theme.textMuted : 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: savedDeals.length >= 4 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>⚖️</span>
              Save for Comparison ({savedDeals.length}/4)
            </button>
          </div>
          
          {/* Purchase Inputs */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '16px' }}>🏷️</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Purchase Inputs</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px', fontSize: '13px' }}>
              {[
                { label: 'ARV', field: 'arv', prefix: '$' },
                { label: 'Purchase Price', field: 'purchasePrice', prefix: '$' },
                { label: 'Seller Concessions', field: 'sellerConcessions', prefix: '$' },
                { label: 'Down Payment', field: 'downPaymentPercent', suffix: '%' },
                { label: 'Closing Costs', field: 'closingCostsPercent', suffix: '%' },
                { label: 'Rent Ready Costs', field: 'rentReadyCosts', prefix: '$' }
              ].map(item => (
                <React.Fragment key={item.field}>
                  <span style={{ color: theme.textSecondary, display: 'flex', alignItems: 'center' }}>{item.label}</span>
                  <div style={{ position: 'relative' }}>
                    {item.prefix && <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '12px' }}>{item.prefix}</span>}
                    <input
                      type="number"
                      value={propertyData[item.field]}
                      onChange={(e) => updateProperty(item.field, parseFloat(e.target.value) || 0)}
                      style={{ ...inputStyle, padding: item.prefix ? '8px 10px 8px 20px' : '8px 10px', textAlign: 'right', fontSize: '13px' }}
                    />
                    {item.suffix && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '12px' }}>{item.suffix}</span>}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div style={{ marginTop: '12px', padding: '10px 14px', background: theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>Total Invested</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#10B981' }}>{formatCurrency(calculations.totalInvested)}</span>
              </div>
            </div>
          </div>
          
          {/* Mortgage */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '16px' }}>🏦</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Mortgage</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px', fontSize: '13px' }}>
              {[
                { label: 'Loan Amount', value: formatCurrency(calculations.loanAmount), readonly: true },
                { label: 'Interest Rate', field: 'interestRate', suffix: '%' },
                { label: 'Loan Term', field: 'loanTermYears', suffix: ' yrs' },
                { label: 'PMI Rate', field: 'pmiRate', suffix: '%' },
                { label: 'Drop PMI LTV', field: 'dropPmiLtv', suffix: '%' }
              ].map(item => (
                <React.Fragment key={item.field || item.label}>
                  <span style={{ color: theme.textSecondary, display: 'flex', alignItems: 'center' }}>{item.label}</span>
                  {item.readonly ? (
                    <div style={{ ...inputStyle, padding: '8px 10px', textAlign: 'right', fontSize: '13px', background: theme.bgMain, color: '#10B981', fontWeight: '600' }}>{item.value}</div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        step={item.field === 'interestRate' ? '0.125' : '1'}
                        value={propertyData[item.field]}
                        onChange={(e) => updateProperty(item.field, parseFloat(e.target.value) || 0)}
                        style={{ ...inputStyle, padding: '8px 10px', textAlign: 'right', fontSize: '13px' }}
                      />
                      {item.suffix && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '11px' }}>{item.suffix}</span>}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Income */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '16px' }}>💵</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Income</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: theme.textSecondary }}>Monthly Rent</span>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '12px' }}>$</span>
                <input
                  type="number"
                  value={propertyData.monthlyRent}
                  onChange={(e) => updateProperty('monthlyRent', parseFloat(e.target.value) || 0)}
                  style={{ ...inputStyle, padding: '8px 10px 8px 20px', textAlign: 'right', fontSize: '13px' }}
                />
              </div>
              <span style={{ color: theme.textSecondary }}>Other Income</span>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '12px' }}>$</span>
                <input
                  type="number"
                  value={propertyData.otherIncome}
                  onChange={(e) => updateProperty('otherIncome', parseFloat(e.target.value) || 0)}
                  style={{ ...inputStyle, padding: '8px 10px 8px 20px', textAlign: 'right', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Annual Expenses */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Annual Expenses</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: theme.textMuted, fontWeight: '600' }}>Expense</span>
            <span style={{ color: theme.textMuted, fontWeight: '600', textAlign: 'center' }}>Rate</span>
            <span style={{ color: theme.textMuted, fontWeight: '600', textAlign: 'right' }}>Dollars</span>
            
            <span style={{ color: theme.textSecondary }}>Vacancy Rate</span>
            <input type="number" step="0.1" value={propertyData.vacancyRate} onChange={(e) => updateProperty('vacancyRate', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px', textAlign: 'center' }} />
            <span style={{ color: '#EF4444', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(calculations.vacancyLoss)}</span>
            
            <span style={{ color: theme.textSecondary }}>Property Taxes</span>
            <input type="number" step="0.01" value={propertyData.propertyTaxRate} onChange={(e) => updateProperty('propertyTaxRate', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px', textAlign: 'center' }} />
            <span style={{ color: '#EF4444', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(calculations.propertyTaxes)}</span>
            
            <span style={{ color: theme.textSecondary }}>Property Insurance</span>
            <span style={{ textAlign: 'center', color: theme.textMuted }}>—</span>
            <input type="number" value={propertyData.propertyInsurance} onChange={(e) => updateProperty('propertyInsurance', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px', textAlign: 'right' }} />
            
            <span style={{ color: theme.textSecondary }}>HOA Dues</span>
            <span style={{ textAlign: 'center', color: theme.textMuted }}>—</span>
            <input type="number" value={propertyData.hoaDues} onChange={(e) => updateProperty('hoaDues', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px', textAlign: 'right' }} />
            
            <span style={{ color: theme.textSecondary }}>Maintenance</span>
            <input type="number" step="1" value={propertyData.maintenancePercent} onChange={(e) => updateProperty('maintenancePercent', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px', textAlign: 'center' }} />
            <span style={{ color: '#EF4444', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(calculations.maintenance)}</span>
            
            <span style={{ color: theme.textSecondary }}>Management</span>
            <input type="number" step="1" value={propertyData.managementPercent} onChange={(e) => updateProperty('managementPercent', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '6px 8px', fontSize: '12px', textAlign: 'center' }} />
            <span style={{ color: '#EF4444', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(calculations.management)}</span>
          </div>
          
          <div style={{ marginTop: '14px', padding: '10px 14px', background: theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: theme.textSecondary }}>Total Operating Expenses</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#EF4444' }}>{formatCurrency(calculations.totalOperatingExpenses)}</span>
            </div>
          </div>
        </div>
        
        {/* Depreciation */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '16px' }}>📉</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Depreciation Details</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: theme.textSecondary }}>Land Value %</span>
            <input type="number" step="1" value={propertyData.landValuePercent} onChange={(e) => updateProperty('landValuePercent', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '8px 10px', textAlign: 'right', fontSize: '13px' }} />
            
            <span style={{ color: theme.textSecondary }}>Depreciation Type</span>
            <select value={propertyData.depreciationType} onChange={(e) => updateProperty('depreciationType', e.target.value)} style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px' }}>
              <option value="R">Residential (27.5)</option>
              <option value="C">Commercial (39)</option>
            </select>
            
            <span style={{ color: theme.textSecondary }}>Effective Tax Rate</span>
            <input type="number" step="1" value={propertyData.effectiveTaxRate} onChange={(e) => updateProperty('effectiveTaxRate', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, padding: '8px 10px', textAlign: 'right', fontSize: '13px' }} />
          </div>
          
          <div style={{ marginTop: '14px', padding: '10px 14px', background: theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: theme.textSecondary }}>Annual Depreciation</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#8B5CF6' }}>{formatCurrency(calculations.annualDepreciation)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Dashboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Chart Filter Bar */}
        <div style={{ 
          ...cardStyle, 
          padding: '16px 20px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>📊</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Chart View</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* View Type Filter */}
            <div style={{ display: 'flex', gap: '4px', background: theme.bgMain, borderRadius: '10px', padding: '4px' }}>
              {[
                { value: 'all', label: 'All Charts' },
                { value: 'yearly', label: 'Yearly' },
                { value: 'monthly', label: 'Monthly' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setChartFilter(prev => ({ ...prev, viewType: option.value }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: chartFilter.viewType === option.value ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                    color: chartFilter.viewType === option.value ? 'white' : theme.textSecondary,
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* Metric Filter */}
            <select
              value={chartFilter.showMetric}
              onChange={(e) => setChartFilter(prev => ({ ...prev, showMetric: e.target.value }))}
              style={{
                ...inputStyle,
                padding: '8px 12px',
                fontSize: '12px',
                minWidth: '150px'
              }}
            >
              <option value="all">All Metrics</option>
              <option value="cashflow">Cash Flow</option>
              <option value="roi">Return on Investment</option>
              <option value="equity">Equity & Access</option>
              <option value="breakeven">Break-Even Analysis</option>
              <option value="returns">Returns if Sold</option>
              <option value="expenses">Expenses Breakdown</option>
            </select>
            
            {/* Year Range */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: theme.textMuted }}>Years:</span>
              <select
                value={chartFilter.yearRange}
                onChange={(e) => setChartFilter(prev => ({ ...prev, yearRange: parseInt(e.target.value) }))}
                style={{
                  ...inputStyle,
                  padding: '8px 12px',
                  fontSize: '12px',
                  width: '70px'
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Monthly Cash Flow Chart */}
        {(chartFilter.showMetric === 'all' || chartFilter.showMetric === 'cashflow') && (
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Monthly Cash Flow - Year 1</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* Monthly Cash Flow Bar */}
            <div style={{ background: theme.bgMain, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '12px' }}>Monthly Cash Flow</div>
              <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{ 
                  width: '60px', 
                  height: `${Math.min(100, Math.abs(calculations.monthlyCashFlow) / 10)}%`,
                  background: calculations.monthlyCashFlow >= 0 
                    ? 'linear-gradient(180deg, #10B981, #059669)' 
                    : 'linear-gradient(180deg, #EF4444, #DC2626)',
                  borderRadius: '8px 8px 0 0',
                  position: 'relative'
                }}>
                  <span style={{ 
                    position: 'absolute', 
                    top: '-25px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: calculations.monthlyCashFlow >= 0 ? '#10B981' : '#EF4444'
                  }}>
                    {formatCurrency(calculations.monthlyCashFlow)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Cash Flow from Depreciation Bar */}
            <div style={{ background: theme.bgMain, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '12px' }}>Cash Flow from Depreciation™</div>
              <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{ 
                  width: '60px', 
                  height: `${Math.min(100, (calculations.cashFlowFromDepreciation / 12) / 10)}%`,
                  background: 'linear-gradient(180deg, #F59E0B, #D97706)',
                  borderRadius: '8px 8px 0 0',
                  position: 'relative'
                }}>
                  <span style={{ 
                    position: 'absolute', 
                    top: '-25px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#F59E0B'
                  }}>
                    {formatCurrency(calculations.cashFlowFromDepreciation / 12)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* True Cash Flow Bar */}
            <div style={{ background: theme.bgMain, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '12px' }}>True Cash Flow™</div>
              <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{ 
                  width: '60px', 
                  height: `${Math.min(100, Math.abs(calculations.monthlyTrueCashFlow) / 10)}%`,
                  background: calculations.monthlyTrueCashFlow >= 0 
                    ? 'linear-gradient(180deg, #3B82F6, #2563EB)' 
                    : 'linear-gradient(180deg, #EF4444, #DC2626)',
                  borderRadius: '8px 8px 0 0',
                  position: 'relative'
                }}>
                  <span style={{ 
                    position: 'absolute', 
                    top: '-25px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: calculations.monthlyTrueCashFlow >= 0 ? '#3B82F6' : '#EF4444'
                  }}>
                    {formatCurrency(calculations.monthlyTrueCashFlow)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        
        {/* Key Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Cap Rate', value: formatPercent(calculations.capRate), color: '#10B981', icon: '📊' },
            { label: 'Cash on Cash', value: formatPercent(calculations.cashOnCashReturn), color: '#3B82F6', icon: '💰' },
            { label: 'NOI', value: formatCurrency(calculations.noi), color: '#8B5CF6', icon: '📈' },
            { label: 'Monthly P&I', value: formatCurrency(calculations.monthlyPI), color: '#F59E0B', icon: '🏦' }
          ].map((metric, i) => (
            <div key={i} style={{ ...cardStyle, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{metric.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: metric.color, marginBottom: '4px' }}>{metric.value}</div>
              <div style={{ fontSize: '12px', color: theme.textMuted }}>{metric.label}</div>
            </div>
          ))}
        </div>
        
        {/* Return on Investment - Year 1 */}
        {(chartFilter.showMetric === 'all' || chartFilter.showMetric === 'roi') && (
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #3B82F6, #F59E0B, #EC4899)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Return on Investment - Year 1</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
            {/* ROI Quadrants */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Appreciation', value: calculations.appreciationROI, color: '#3B82F6' },
                { label: 'Cash Flow', value: calculations.cashFlowROI, color: calculations.cashFlowROI >= 0 ? '#10B981' : '#EF4444' },
                { label: 'Debt Paydown', value: calculations.debtPaydownROI, color: '#F59E0B' },
                { label: 'Cash Flow from Depreciation™', value: calculations.depreciationROI, color: '#8B5CF6' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                  <span style={{ flex: 1, fontSize: '13px', color: theme.textSecondary }}>{item.label}</span>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: item.color,
                    padding: '4px 10px',
                    background: `${item.color}15`,
                    borderRadius: '6px'
                  }}>{formatPercent(item.value)}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: '10px', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>Total Return on Investment</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#10B981' }}>{formatPercent(calculations.totalROI)}</span>
                </div>
              </div>
            </div>
            
            {/* Stacked Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>
                  {[
                    { value: Math.max(0, calculations.appreciationROI), color: '#3B82F6' },
                    { value: Math.max(0, calculations.cashFlowROI), color: '#10B981' },
                    { value: Math.max(0, calculations.debtPaydownROI), color: '#F59E0B' },
                    { value: Math.max(0, calculations.depreciationROI), color: '#8B5CF6' }
                  ].reverse().map((segment, i) => (
                    <div 
                      key={i}
                      style={{ 
                        height: `${(segment.value / Math.max(calculations.totalROI, 1)) * 160}px`,
                        background: segment.color,
                        minHeight: segment.value > 0 ? '8px' : '0'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Metrics Labels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ textAlign: 'center', padding: '12px 16px', background: theme.bgMain, borderRadius: '12px' }}>
                  <div style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px' }}>Year 1</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#10B981' }}>{formatPercent(calculations.totalROI)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        
        {/* Return in Dollars - Year 1 */}
        {(chartFilter.showMetric === 'all' || chartFilter.showMetric === 'roi') && (
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #3B82F6, #F59E0B)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Return in Dollars - Year 1</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { 
                label: 'RIDQ™', 
                value: calculations.appreciationReturn + calculations.annualCashFlow + calculations.totalPrincipalYear1 + calculations.cashFlowFromDepreciation,
                subtitle: 'Return in Dollars Quadrant™',
                color: '#3B82F6'
              },
              { 
                label: 'RIDQ+R6™', 
                value: (calculations.appreciationReturn + calculations.annualCashFlow + calculations.totalPrincipalYear1 + calculations.cashFlowFromDepreciation) * 1.05,
                subtitle: 'With 6mo Reserves',
                color: '#10B981'
              },
              { 
                label: 'RIDQ+R12™', 
                value: (calculations.appreciationReturn + calculations.annualCashFlow + calculations.totalPrincipalYear1 + calculations.cashFlowFromDepreciation) * 1.12,
                subtitle: 'With 12mo Reserves',
                color: '#8B5CF6'
              }
            ].map((item, i) => (
              <div key={i} style={{ background: theme.bgMain, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>{item.subtitle}</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: item.color, marginBottom: '4px' }}>{formatCurrency(item.value)}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        )}
        
        {/* Cash on Cash ROI & Cap Rate - Years 1-5 */}
        {(chartFilter.showMetric === 'all' || chartFilter.showMetric === 'roi') && (
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Cash on Cash ROI & Cap Rate - Years 1-5</h3>
          
          <div style={{ display: 'flex', gap: '20px', height: '200px', alignItems: 'flex-end', padding: '0 20px' }}>
            {calculations.projections.slice(0, 5).map((proj, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '150px' }}>
                  {/* Cash on Cash Bar */}
                  <div style={{
                    width: '30px',
                    height: `${Math.min(150, Math.max(10, proj.cashOnCash * 15))}px`,
                    background: 'linear-gradient(180deg, #10B981, #059669)',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative'
                  }}>
                    <span style={{ 
                      position: 'absolute', 
                      top: '-20px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#10B981',
                      whiteSpace: 'nowrap'
                    }}>
                      {proj.cashOnCash.toFixed(1)}%
                    </span>
                  </div>
                  {/* Cap Rate Bar */}
                  <div style={{
                    width: '30px',
                    height: `${Math.min(150, Math.max(10, proj.capRate * 15))}px`,
                    background: 'linear-gradient(180deg, #06B6D4, #0891B2)',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative'
                  }}>
                    <span style={{ 
                      position: 'absolute', 
                      top: '-20px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#06B6D4',
                      whiteSpace: 'nowrap'
                    }}>
                      {proj.capRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: theme.textSecondary }}>Year {proj.year}</div>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10B981' }} />
              <span style={{ fontSize: '12px', color: theme.textSecondary }}>Cash on Cash ROI</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#06B6D4' }} />
              <span style={{ fontSize: '12px', color: theme.textSecondary }}>Cap Rate</span>
            </div>
          </div>
        </div>
        )}
        
        {/* Returns if Sold (ROI and IRR) */}
        {(chartFilter.showMetric === 'all' || chartFilter.showMetric === 'returns') && (
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Returns if Sold (ROI and IRR)</h3>
          
          <div style={{ position: 'relative', height: '200px', marginBottom: '16px' }}>
            {/* Y-axis labels */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {[30, 20, 10, 0, -10].map((val, i) => (
                <div key={i} style={{ fontSize: '10px', color: theme.textMuted }}>{val}%</div>
              ))}
            </div>
            
            {/* Chart area */}
            <div style={{ marginLeft: '55px', height: '100%', position: 'relative', borderBottom: `1px solid ${theme.borderLight}`, borderLeft: `1px solid ${theme.borderLight}` }}>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((pos, i) => (
                <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${pos * 100}%`, borderTop: `1px dashed ${theme.borderLight}`, opacity: 0.5 }} />
              ))}
              
              {/* Data lines - Annualized ROI */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  points={calculations.projections.slice(0, chartFilter.yearRange).map((proj, i) => {
                    const x = (i / (chartFilter.yearRange - 1)) * 100;
                    const y = 100 - ((proj.annualizedROI * 100 + 10) / 40 * 100);
                    return `${x}%,${Math.max(0, Math.min(100, y))}%`;
                  }).join(' ')}
                />
                {/* Compound ROI line */}
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  points={calculations.projections.slice(0, chartFilter.yearRange).map((proj, i) => {
                    const x = (i / (chartFilter.yearRange - 1)) * 100;
                    const compoundROI = proj.roi;
                    const y = 100 - ((compoundROI + 10) / 40 * 100);
                    return `${x}%,${Math.max(0, Math.min(100, y))}%`;
                  }).join(' ')}
                />
              </svg>
              
              {/* X-axis labels */}
              <div style={{ position: 'absolute', bottom: '-25px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
                {[1, 5, 10, 15, 20].filter(y => y <= chartFilter.yearRange).map(year => (
                  <span key={year} style={{ fontSize: '10px', color: theme.textMuted }}>{year}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '3px', background: '#8B5CF6' }} />
              <span style={{ fontSize: '12px', color: theme.textSecondary }}>Annualized ROI</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '3px', background: '#10B981' }} />
              <span style={{ fontSize: '12px', color: theme.textSecondary }}>Compound ROI</span>
            </div>
          </div>
        </div>
        )}
        
        {/* Equities and Cost-To-Access */}
        {(chartFilter.showMetric === 'all' || chartFilter.showMetric === 'equity') && (
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #F59E0B, #EC4899)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Equities and Cost-To-Access</h3>
          
          <div style={{ position: 'relative', height: '200px', marginBottom: '16px' }}>
            {/* Chart area */}
            <div style={{ height: '100%', position: 'relative', borderBottom: `1px solid ${theme.borderLight}`, borderLeft: `1px solid ${theme.borderLight}`, marginLeft: '60px' }}>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((pos, i) => (
                <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${pos * 100}%`, borderTop: `1px dashed ${theme.borderLight}`, opacity: 0.5 }} />
              ))}
              
              {/* Area chart for equity */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                {/* True Net Equity area */}
                <polygon
                  fill="rgba(16, 185, 129, 0.2)"
                  stroke="#10B981"
                  strokeWidth="2"
                  points={`0,100% ${calculations.projections.slice(0, chartFilter.yearRange).map((proj, i) => {
                    const x = (i / (chartFilter.yearRange - 1)) * 100;
                    const maxEquity = calculations.projections[chartFilter.yearRange - 1]?.equity || 1;
                    const y = 100 - (proj.equity / maxEquity * 100);
                    return `${x}%,${Math.max(0, y)}%`;
                  }).join(' ')} 100%,100%`}
                />
                
                {/* Cash-out Refi Equity line */}
                <polyline
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  points={calculations.projections.slice(0, chartFilter.yearRange).map((proj, i) => {
                    const x = (i / (chartFilter.yearRange - 1)) * 100;
                    const maxEquity = calculations.projections[chartFilter.yearRange - 1]?.equity || 1;
                    const y = 100 - (proj.cashOutRefiEquity / maxEquity * 100);
                    return `${x}%,${Math.max(0, y)}%`;
                  }).join(' ')}
                />
              </svg>
              
              {/* X-axis labels */}
              <div style={{ position: 'absolute', bottom: '-25px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
                {[1, 5, 10, 15, 20].filter(y => y <= chartFilter.yearRange).map(year => (
                  <span key={year} style={{ fontSize: '10px', color: theme.textMuted }}>{year}</span>
                ))}
              </div>
            </div>
            
            {/* Y-axis labels */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '55px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '5px' }}>
              {[
                formatCurrency(calculations.projections[chartFilter.yearRange - 1]?.equity || 0),
                formatCurrency((calculations.projections[chartFilter.yearRange - 1]?.equity || 0) * 0.5),
                '$0'
              ].map((val, i) => (
                <div key={i} style={{ fontSize: '9px', color: theme.textMuted, textAlign: 'right' }}>{val}</div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10B981' }} />
              <span style={{ fontSize: '12px', color: theme.textSecondary }}>True Net Equity™</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '3px', background: '#F59E0B', borderStyle: 'dashed' }} />
              <span style={{ fontSize: '12px', color: theme.textSecondary }}>Cash-Out Refi Equity</span>
            </div>
          </div>
        </div>
        )}
        
        {/* Annual Non-Loan Expenses - Year 1 */}
        {(chartFilter.showMetric === 'all' || chartFilter.showMetric === 'expenses') && (
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Annual Non-Loan Expenses - Year 1</h3>
          
          <div style={{ display: 'flex', gap: '12px', height: '180px', alignItems: 'flex-end', padding: '0 10px' }}>
            {[
              { label: 'Vacancy', value: calculations.vacancyLoss, color: '#EF4444' },
              { label: 'Property Taxes', value: calculations.propertyTaxes || propertyData.purchasePrice * (propertyData.propertyTaxRate / 100), color: '#F59E0B' },
              { label: 'Insurance', value: propertyData.propertyInsurance, color: '#3B82F6' },
              { label: 'HOA', value: propertyData.hoaDues, color: '#8B5CF6' },
              { label: 'Utilities', value: propertyData.utilities, color: '#06B6D4' },
              { label: 'Other Exp 1', value: propertyData.otherExpenses1, color: '#10B981' },
              { label: 'Other Exp 2', value: propertyData.otherExpenses2, color: '#EC4899' },
              { label: 'Maintenance', value: calculations.effectiveGrossIncome * (propertyData.maintenancePercent / 100), color: '#84CC16' },
              { label: 'CapEx', value: propertyData.capEx, color: '#A855F7' },
              { label: 'Management', value: calculations.effectiveGrossIncome * (propertyData.managementPercent / 100), color: '#F97316' }
            ].map((item, i) => {
              const maxValue = Math.max(...[
                calculations.vacancyLoss,
                propertyData.purchasePrice * (propertyData.propertyTaxRate / 100),
                propertyData.propertyInsurance,
                propertyData.hoaDues,
                propertyData.utilities,
                propertyData.otherExpenses1,
                propertyData.otherExpenses2,
                calculations.effectiveGrossIncome * (propertyData.maintenancePercent / 100),
                propertyData.capEx,
                calculations.effectiveGrossIncome * (propertyData.managementPercent / 100)
              ], 1);
              
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '100%',
                    height: `${Math.max(5, (item.value / maxValue) * 140)}px`,
                    background: `linear-gradient(180deg, ${item.color}, ${item.color}99)`,
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    minHeight: '5px'
                  }}>
                    {item.value > 0 && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '-22px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        fontSize: '9px',
                        fontWeight: '700',
                        color: item.color,
                        whiteSpace: 'nowrap'
                      }}>
                        {formatCurrency(item.value)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '8px', color: theme.textMuted, textAlign: 'center', maxWidth: '50px', lineHeight: '1.2' }}>{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
        )}
        
        {/* Break-Even Analysis */}
        {(chartFilter.showMetric === 'all' || chartFilter.showMetric === 'breakeven') && (
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #06B6D4, #10B981)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Break-Even Analysis</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {(() => {
              // Calculate break-even year (when cumulative cash flow equals initial investment)
              let breakEvenYear = 'N/A';
              for (let i = 0; i < calculations.projections.length; i++) {
                if (calculations.projections[i].cumulativeCashFlow >= calculations.totalInvested) {
                  breakEvenYear = `Year ${i + 1}`;
                  break;
                }
              }
              
              // Calculate break-even with all returns
              let fullBreakEvenYear = 'N/A';
              for (let i = 0; i < calculations.projections.length; i++) {
                if (calculations.projections[i].totalReturn >= calculations.totalInvested) {
                  fullBreakEvenYear = `Year ${i + 1}`;
                  break;
                }
              }
              
              return [
                { 
                  label: 'Cash Flow Break-Even', 
                  value: breakEvenYear, 
                  subtitle: 'When cash flow recovers investment',
                  color: '#10B981',
                  icon: '💵'
                },
                { 
                  label: 'Total ROI Break-Even', 
                  value: fullBreakEvenYear, 
                  subtitle: 'Including appreciation & equity',
                  color: '#3B82F6',
                  icon: '📈'
                },
                { 
                  label: 'Minimum Rent for Break-Even', 
                  value: formatCurrency(calculations.monthlyPI + (calculations.totalOperatingExpenses / 12)), 
                  subtitle: 'Monthly rent to cover all expenses',
                  color: '#F59E0B',
                  icon: '🏠'
                }
              ];
            })().map((item, i) => (
              <div key={i} style={{ background: theme.bgMain, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: item.color, marginBottom: '4px' }}>{item.value}</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: theme.textPrimary, marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '10px', color: theme.textMuted }}>{item.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
        )}
        
        {/* Annual Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Gross Potential Income', value: formatCurrency(calculations.grossPotentialIncome), color: '#10B981' },
            { label: 'Gross Operating Income', value: formatCurrency(calculations.effectiveGrossIncome), color: '#3B82F6' },
            { label: 'Operating Expenses', value: formatCurrency(calculations.totalOperatingExpenses), color: '#EF4444' },
            { label: 'Net Operating Income', value: formatCurrency(calculations.noi), color: '#8B5CF6' }
          ].map((metric, i) => (
            <div key={i} style={{ background: theme.bgMain, borderRadius: '16px', padding: '20px', textAlign: 'center', border: `1px solid ${theme.borderLight}` }}>
              <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{metric.label}</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: metric.color }}>{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: COMPARE DEALS TAB
  // ═══════════════════════════════════════════════════════════════════════════
  const renderCompareTab = () => {
    const compareMetrics = [
      { key: 'purchasePrice', label: 'Purchase Price', format: formatCurrency },
      { key: 'totalInvested', label: 'Total Invested', format: formatCurrency, isCalc: true },
      { key: 'monthlyRent', label: 'Monthly Rent', format: formatCurrency },
      { key: 'monthlyCashFlow', label: 'Monthly Cash Flow', format: formatCurrency, isCalc: true },
      { key: 'annualCashFlow', label: 'Annual Cash Flow', format: formatCurrency, isCalc: true },
      { key: 'capRate', label: 'Cap Rate', format: formatPercent, isCalc: true },
      { key: 'cashOnCashReturn', label: 'Cash on Cash ROI', format: formatPercent, isCalc: true },
      { key: 'totalROI', label: 'Total ROI (Year 1)', format: formatPercent, isCalc: true },
      { key: 'noi', label: 'Net Operating Income', format: formatCurrency, isCalc: true },
      { key: 'monthlyPI', label: 'Monthly P&I', format: formatCurrency, isCalc: true }
    ];

    const getBestValue = (metric, deals) => {
      if (deals.length === 0) return null;
      const values = deals.map(d => metric.isCalc ? d.calculations[metric.key] : d.data[metric.key]);
      if (metric.key.includes('Expense') || metric.key === 'monthlyPI') {
        return Math.min(...values); // Lower is better for expenses
      }
      return Math.max(...values); // Higher is better for income/returns
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #06B6D4, #0891B2)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px' }}>
                ⚖️ Deal Comparison
              </h2>
              <p style={{ fontSize: '13px', color: theme.textMuted }}>
                Compare up to 4 deals side-by-side to find the best investment
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSavedDeals([])}
                disabled={savedDeals.length === 0}
                style={{
                  padding: '10px 20px',
                  background: savedDeals.length === 0 ? 'rgba(107, 114, 128, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${savedDeals.length === 0 ? theme.borderLight : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: '10px',
                  color: savedDeals.length === 0 ? theme.textMuted : '#EF4444',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: savedDeals.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {savedDeals.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary, marginBottom: '12px' }}>
              No Deals to Compare
            </h3>
            <p style={{ fontSize: '14px', color: theme.textMuted, maxWidth: '400px', margin: '0 auto 24px' }}>
              Go to the Deal Analyzer tab and save deals you want to compare. You can save up to 4 deals for side-by-side comparison.
            </p>
            <button
              onClick={() => setActiveTab('analyzer')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🏠 Go to Deal Analyzer
            </button>
          </div>
        ) : (
          <>
            {/* Deal Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${savedDeals.length}, 1fr)`, gap: '16px' }}>
              {savedDeals.map((deal, index) => (
                <div key={deal.id} style={{ ...cardStyle, padding: '20px' }}>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px', 
                    background: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][index] 
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][index],
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Deal {index + 1}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary }}>
                        {deal.name.length > 25 ? deal.name.substring(0, 25) + '...' : deal.name}
                      </div>
                    </div>
                    <button
                      onClick={() => removeDeal(deal.id)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        color: '#EF4444',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>
                    {propertyTypes.find(t => t.value === deal.data.propertyType)?.label || 'SFH'} • {deal.data.unitCount} unit(s)
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div style={cardStyle}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>
                📈 Metrics Comparison
              </h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px 16px', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: theme.textMuted,
                        borderBottom: `1px solid ${theme.borderLight}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Metric
                      </th>
                      {savedDeals.map((deal, index) => (
                        <th key={deal.id} style={{ 
                          textAlign: 'right', 
                          padding: '12px 16px', 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][index],
                          borderBottom: `1px solid ${theme.borderLight}`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Deal {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareMetrics.map((metric, i) => {
                      const bestValue = getBestValue(metric, savedDeals);
                      return (
                        <tr key={metric.key} style={{ background: i % 2 === 0 ? 'transparent' : theme.bgMain }}>
                          <td style={{ 
                            padding: '14px 16px', 
                            fontSize: '13px', 
                            color: theme.textSecondary,
                            borderBottom: `1px solid ${theme.borderLight}`
                          }}>
                            {metric.label}
                          </td>
                          {savedDeals.map((deal, index) => {
                            const value = metric.isCalc ? deal.calculations[metric.key] : deal.data[metric.key];
                            const isBest = value === bestValue && savedDeals.length > 1;
                            return (
                              <td key={deal.id} style={{ 
                                textAlign: 'right', 
                                padding: '14px 16px', 
                                fontSize: '14px', 
                                fontWeight: isBest ? '700' : '500',
                                color: isBest ? '#10B981' : theme.textPrimary,
                                borderBottom: `1px solid ${theme.borderLight}`,
                                background: isBest ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                              }}>
                                {metric.format(value)}
                                {isBest && <span style={{ marginLeft: '6px', fontSize: '12px' }}>✓</span>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Comparison Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {/* Cash Flow Comparison */}
              <div style={cardStyle}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #3B82F6)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary, marginBottom: '16px' }}>
                  💵 Monthly Cash Flow
                </h4>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px' }}>
                  {savedDeals.map((deal, index) => {
                    const maxCF = Math.max(...savedDeals.map(d => Math.abs(d.calculations.monthlyCashFlow)));
                    const height = maxCF > 0 ? (Math.abs(deal.calculations.monthlyCashFlow) / maxCF) * 120 : 0;
                    return (
                      <div key={deal.id} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: deal.calculations.monthlyCashFlow >= 0 ? '#10B981' : '#EF4444',
                          marginBottom: '8px'
                        }}>
                          {formatCurrency(deal.calculations.monthlyCashFlow)}
                        </div>
                        <div style={{
                          height: `${height}px`,
                          background: `linear-gradient(180deg, ${['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][index]}, ${['#059669', '#2563EB', '#7C3AED', '#D97706'][index]})`,
                          borderRadius: '8px 8px 0 0',
                          margin: '0 auto',
                          width: '100%',
                          maxWidth: '60px'
                        }} />
                        <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '8px' }}>Deal {index + 1}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total ROI Comparison */}
              <div style={cardStyle}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }} />
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: theme.textPrimary, marginBottom: '16px' }}>
                  📈 Total ROI (Year 1)
                </h4>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px' }}>
                  {savedDeals.map((deal, index) => {
                    const maxROI = Math.max(...savedDeals.map(d => Math.abs(d.calculations.totalROI)));
                    const height = maxROI > 0 ? (Math.abs(deal.calculations.totalROI) / maxROI) * 120 : 0;
                    return (
                      <div key={deal.id} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          color: deal.calculations.totalROI >= 0 ? '#8B5CF6' : '#EF4444',
                          marginBottom: '8px'
                        }}>
                          {formatPercent(deal.calculations.totalROI)}
                        </div>
                        <div style={{
                          height: `${height}px`,
                          background: `linear-gradient(180deg, ${['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][index]}, ${['#059669', '#2563EB', '#7C3AED', '#D97706'][index]})`,
                          borderRadius: '8px 8px 0 0',
                          margin: '0 auto',
                          width: '100%',
                          maxWidth: '60px'
                        }} />
                        <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '8px' }}>Deal {index + 1}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recommendation */}
            {savedDeals.length >= 2 && (
              <div style={{ 
                ...cardStyle, 
                background: theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '40px' }}>🏆</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#10B981', marginBottom: '4px' }}>
                      Best Overall Deal
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>
                      {savedDeals.reduce((best, current) => 
                        current.calculations.totalROI > best.calculations.totalROI ? current : best
                      ).name}
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textMuted, marginTop: '4px' }}>
                      Based on highest Total ROI of {formatPercent(Math.max(...savedDeals.map(d => d.calculations.totalROI)))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: CASH FLOW TAB
  // ═══════════════════════════════════════════════════════════════════════════
  const renderCashFlowTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Cash Flow Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {[
          { label: 'Annual Cash Flow', value: formatCurrency(calculations.annualCashFlow), color: calculations.annualCashFlow >= 0 ? '#10B981' : '#EF4444', icon: '💵' },
          { label: 'Monthly Cash Flow', value: formatCurrency(calculations.monthlyCashFlow), color: calculations.monthlyCashFlow >= 0 ? '#10B981' : '#EF4444', icon: '📅' },
          { label: 'Cash on Cash ROI', value: formatPercent(calculations.cashOnCashReturn), color: '#3B82F6', icon: '📊' },
          { label: 'Cap Rate', value: formatPercent(calculations.capRate), color: '#8B5CF6', icon: '🎯' },
          { label: 'True Cash Flow™', value: formatCurrency(calculations.trueCashFlow), color: '#F59E0B', icon: '✨' }
        ].map((metric, i) => (
          <div key={i} style={{ ...cardStyle, textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{metric.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: metric.color, marginBottom: '8px' }}>{metric.value}</div>
            <div style={{ fontSize: '13px', color: theme.textMuted }}>{metric.label}</div>
          </div>
        ))}
      </div>
      
      {/* Multi-Year Cash Flow Chart */}
      <div style={cardStyle}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #3B82F6)' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '24px' }}>Cash Flow Projection - 18 Years</h3>
        
        <div style={{ height: '300px', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 900 280" preserveAspectRatio="xMidYMid meet">
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1="50" y1={40 + i * 50} x2="870" y2={40 + i * 50} stroke={theme.borderLight} strokeWidth="1" opacity="0.5" />
            ))}
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map(i => {
              const maxCF = Math.max(...calculations.projections.map(p => p.annualCashFlow));
              const minCF = Math.min(...calculations.projections.map(p => p.annualCashFlow), 0);
              const range = maxCF - minCF;
              const value = maxCF - (i / 4) * range;
              return (
                <text key={i} x="45" y={45 + i * 50} fill={theme.textMuted} fontSize="11" textAnchor="end">{formatCurrency(value)}</text>
              );
            })}
            
            {/* Bars */}
            {calculations.projections.map((proj, i) => {
              const maxCF = Math.max(...calculations.projections.map(p => p.annualCashFlow));
              const minCF = Math.min(...calculations.projections.map(p => p.annualCashFlow), 0);
              const range = maxCF - minCF || 1;
              const barHeight = ((proj.annualCashFlow - minCF) / range) * 200;
              const yPos = 240 - barHeight;
              
              return (
                <g key={i}>
                  <rect
                    x={60 + i * 45}
                    y={yPos}
                    width="35"
                    height={barHeight}
                    fill={proj.annualCashFlow >= 0 ? '#10B981' : '#EF4444'}
                    rx="4"
                    opacity="0.9"
                  />
                  <text x={77.5 + i * 45} y="260" fill={theme.textMuted} fontSize="10" textAnchor="middle">{proj.year}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      
      {/* Cash Flow Table */}
      <div style={cardStyle}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Detailed Cash Flow Analysis</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: theme.bgMain }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.textMuted, fontWeight: '600', borderBottom: `2px solid ${theme.borderLight}` }}>Year</th>
                {calculations.projections.slice(0, 10).map((_, i) => (
                  <th key={i} style={{ padding: '12px 8px', textAlign: 'right', color: theme.textMuted, fontWeight: '600', borderBottom: `2px solid ${theme.borderLight}` }}>{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Annual Cash Flow', key: 'annualCashFlow', format: 'currency', colorLogic: true },
                { label: 'Monthly Cash Flow', key: 'monthlyCashFlow', format: 'currency', colorLogic: true },
                { label: 'Cash on Cash ROI', key: 'cashOnCash', format: 'percent', colorLogic: true },
                { label: 'Cap Rate', key: 'capRate', format: 'percent' },
                { label: 'Property Value', key: 'propertyValue', format: 'currency' },
                { label: 'Monthly Rent', key: 'monthlyRent', format: 'currency' }
              ].map((row, rowIdx) => (
                <tr key={rowIdx} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                  <td style={{ padding: '10px 16px', color: theme.textSecondary, fontWeight: '500' }}>{row.label}</td>
                  {calculations.projections.slice(0, 10).map((proj, i) => {
                    const value = proj[row.key];
                    const displayValue = row.format === 'currency' ? formatCurrency(value) : formatPercent(value);
                    const color = row.colorLogic 
                      ? (value >= 0 ? '#10B981' : '#EF4444')
                      : theme.textPrimary;
                    return (
                      <td key={i} style={{ padding: '10px 8px', textAlign: 'right', color, fontWeight: '500' }}>{displayValue}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: ROI ANALYSIS TAB
  // ═══════════════════════════════════════════════════════════════════════════
  const renderROITab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ROI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Appreciation ROI', value: calculations.appreciationROI, color: '#3B82F6', icon: '📈' },
          { label: 'Cash Flow ROI', value: calculations.cashFlowROI, color: '#10B981', icon: '💵' },
          { label: 'Debt Paydown ROI', value: calculations.debtPaydownROI, color: '#F59E0B', icon: '🏦' },
          { label: 'Depreciation ROI', value: calculations.depreciationROI, color: '#8B5CF6', icon: '📉' }
        ].map((metric, i) => (
          <div key={i} style={{ ...cardStyle, textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{metric.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: metric.color, marginBottom: '8px' }}>{formatPercent(metric.value)}</div>
            <div style={{ fontSize: '13px', color: theme.textMuted }}>{metric.label}</div>
          </div>
        ))}
      </div>
      
      {/* Total ROI Card */}
      <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)'}, ${theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'})`, textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '18px', color: theme.textSecondary, marginBottom: '8px' }}>Total Return on Investment - Year 1</div>
        <div style={{ fontSize: '64px', fontWeight: '800', color: '#10B981', marginBottom: '8px' }}>{formatPercent(calculations.totalROI)}</div>
        <div style={{ fontSize: '14px', color: theme.textMuted }}>Based on {formatCurrency(calculations.totalInvested)} invested</div>
      </div>
      
      {/* ROI Over Time Chart */}
      <div style={cardStyle}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #3B82F6, #F59E0B, #8B5CF6)' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '24px' }}>Cumulative ROI Over Time</h3>
        
        <div style={{ height: '350px', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 900 320" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="roiGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line key={i} x1="60" y1={30 + i * 45} x2="870" y2={30 + i * 45} stroke={theme.borderLight} strokeWidth="1" opacity="0.5" />
            ))}
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const maxROI = Math.max(...calculations.projections.map(p => p.roi));
              const value = maxROI - (i / 5) * maxROI;
              return (
                <text key={i} x="55" y={35 + i * 45} fill={theme.textMuted} fontSize="11" textAnchor="end">{formatPercent(value, 0)}</text>
              );
            })}
            
            {/* Area Fill */}
            <path
              d={`M 70 ${255 - (calculations.projections[0]?.roi / Math.max(...calculations.projections.map(p => p.roi))) * 225} 
                ${calculations.projections.map((p, i) => `L ${70 + i * 45} ${255 - (p.roi / Math.max(...calculations.projections.map(p => p.roi))) * 225}`).join(' ')} 
                L ${70 + (calculations.projections.length - 1) * 45} 255 L 70 255 Z`}
              fill="url(#roiGradient)"
            />
            
            {/* Line */}
            <path
              d={`M 70 ${255 - (calculations.projections[0]?.roi / Math.max(...calculations.projections.map(p => p.roi))) * 225} 
                ${calculations.projections.map((p, i) => `L ${70 + i * 45} ${255 - (p.roi / Math.max(...calculations.projections.map(p => p.roi))) * 225}`).join(' ')}`}
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Data Points */}
            {calculations.projections.map((p, i) => (
              <g key={i}>
                <circle 
                  cx={70 + i * 45} 
                  cy={255 - (p.roi / Math.max(...calculations.projections.map(p => p.roi))) * 225}
                  r="5"
                  fill="#10B981"
                  stroke="white"
                  strokeWidth="2"
                />
                <text x={70 + i * 45} y="280" fill={theme.textMuted} fontSize="10" textAnchor="middle">{p.year}</text>
              </g>
            ))}
          </svg>
        </div>
        
        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
          {[
            { label: 'Appreciation', color: '#3B82F6' },
            { label: 'Cash Flow', color: '#10B981' },
            { label: 'Debt Paydown', color: '#F59E0B' },
            { label: 'Depreciation', color: '#8B5CF6' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
              <span style={{ fontSize: '12px', color: theme.textSecondary }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* ROI Comparison Table */}
      <div style={cardStyle}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #EC4899, #8B5CF6)' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>ROI Before & After Taxes</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: theme.bgMain }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.textMuted, fontWeight: '600', borderBottom: `2px solid ${theme.borderLight}` }}>Metric</th>
                {calculations.projections.slice(0, 10).map((_, i) => (
                  <th key={i} style={{ padding: '12px 8px', textAlign: 'right', color: theme.textMuted, fontWeight: '600', borderBottom: `2px solid ${theme.borderLight}` }}>Year {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Cumulative ROI', key: 'roi', colorStart: '#10B981' },
                { label: 'Annualized ROI', key: 'annualizedROI', multiplier: 100, colorStart: '#3B82F6' },
                { label: 'Total Return $', key: 'totalReturn', format: 'currency', colorStart: '#8B5CF6' }
              ].map((row, rowIdx) => (
                <tr key={rowIdx} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                  <td style={{ padding: '10px 16px', color: theme.textSecondary, fontWeight: '500' }}>{row.label}</td>
                  {calculations.projections.slice(0, 10).map((proj, i) => {
                    let value = proj[row.key];
                    if (row.multiplier) value *= row.multiplier;
                    const displayValue = row.format === 'currency' ? formatCurrency(value) : formatPercent(value);
                    return (
                      <td key={i} style={{ padding: '10px 8px', textAlign: 'right', color: row.colorStart, fontWeight: '500' }}>{displayValue}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: EQUITY TRACKER TAB
  // ═══════════════════════════════════════════════════════════════════════════
  const renderEquityTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Equity Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Year 1 Equity', value: formatCurrency(calculations.projections[0]?.equity || 0), color: '#10B981', icon: '💰' },
          { label: 'Year 5 Equity', value: formatCurrency(calculations.projections[4]?.equity || 0), color: '#3B82F6', icon: '📈' },
          { label: 'Year 10 Equity', value: formatCurrency(calculations.projections[9]?.equity || 0), color: '#8B5CF6', icon: '🚀' },
          { label: 'Year 18 Equity', value: formatCurrency(calculations.projections[17]?.equity || 0), color: '#F59E0B', icon: '🏆' }
        ].map((metric, i) => (
          <div key={i} style={{ ...cardStyle, textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{metric.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: metric.color, marginBottom: '8px' }}>{metric.value}</div>
            <div style={{ fontSize: '13px', color: theme.textMuted }}>{metric.label}</div>
          </div>
        ))}
      </div>
      
      {/* Equity Growth Chart */}
      <div style={cardStyle}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6)' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '24px' }}>Equity & Property Value Growth</h3>
        
        <div style={{ height: '350px', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 900 320" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="equityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line key={i} x1="70" y1={30 + i * 45} x2="870" y2={30 + i * 45} stroke={theme.borderLight} strokeWidth="1" opacity="0.5" />
            ))}
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const maxValue = Math.max(...calculations.projections.map(p => p.propertyValue));
              const value = maxValue - (i / 5) * maxValue;
              return (
                <text key={i} x="65" y={35 + i * 45} fill={theme.textMuted} fontSize="10" textAnchor="end">{formatCurrency(value)}</text>
              );
            })}
            
            {/* Property Value Line */}
            <path
              d={`M 80 ${255 - (calculations.projections[0]?.propertyValue / Math.max(...calculations.projections.map(p => p.propertyValue))) * 225} 
                ${calculations.projections.map((p, i) => `L ${80 + i * 44} ${255 - (p.propertyValue / Math.max(...calculations.projections.map(p => p.propertyValue))) * 225}`).join(' ')}`}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            
            {/* Equity Area Fill */}
            <path
              d={`M 80 ${255 - (calculations.projections[0]?.equity / Math.max(...calculations.projections.map(p => p.propertyValue))) * 225} 
                ${calculations.projections.map((p, i) => `L ${80 + i * 44} ${255 - (p.equity / Math.max(...calculations.projections.map(p => p.propertyValue))) * 225}`).join(' ')} 
                L ${80 + (calculations.projections.length - 1) * 44} 255 L 80 255 Z`}
              fill="url(#equityGradient)"
            />
            
            {/* Equity Line */}
            <path
              d={`M 80 ${255 - (calculations.projections[0]?.equity / Math.max(...calculations.projections.map(p => p.propertyValue))) * 225} 
                ${calculations.projections.map((p, i) => `L ${80 + i * 44} ${255 - (p.equity / Math.max(...calculations.projections.map(p => p.propertyValue))) * 225}`).join(' ')}`}
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Loan Balance Line */}
            <path
              d={`M 80 ${255 - (calculations.projections[0]?.loanBalance / Math.max(...calculations.projections.map(p => p.propertyValue))) * 225} 
                ${calculations.projections.map((p, i) => `L ${80 + i * 44} ${255 - (p.loanBalance / Math.max(...calculations.projections.map(p => p.propertyValue))) * 225}`).join(' ')}`}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
            />
            
            {/* X-axis labels */}
            {calculations.projections.map((p, i) => (
              <text key={i} x={80 + i * 44} y="280" fill={theme.textMuted} fontSize="10" textAnchor="middle">{p.year}</text>
            ))}
          </svg>
        </div>
        
        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '3px', background: '#10B981', borderRadius: '2px' }} />
            <span style={{ fontSize: '13px', color: theme.textSecondary }}>Equity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '3px', background: '#3B82F6', borderRadius: '2px', borderStyle: 'dashed' }} />
            <span style={{ fontSize: '13px', color: theme.textSecondary }}>Property Value</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '3px', background: '#EF4444', borderRadius: '2px' }} />
            <span style={{ fontSize: '13px', color: theme.textSecondary }}>Loan Balance</span>
          </div>
        </div>
      </div>
      
      {/* Equity Table */}
      <div style={cardStyle}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #F59E0B, #EC4899)' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Equity & Refinance Analysis</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: theme.bgMain }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.textMuted, fontWeight: '600', borderBottom: `2px solid ${theme.borderLight}` }}>Year</th>
                {calculations.projections.slice(0, 10).map((_, i) => (
                  <th key={i} style={{ padding: '12px 8px', textAlign: 'right', color: theme.textMuted, fontWeight: '600', borderBottom: `2px solid ${theme.borderLight}` }}>{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Property Value', key: 'propertyValue', format: 'currency', color: '#3B82F6' },
                { label: 'Loan Balance', key: 'loanBalance', format: 'currency', color: '#EF4444' },
                { label: 'Equity', key: 'equity', format: 'currency', color: '#10B981' },
                { label: 'LTV', key: 'ltv', format: 'percent', color: '#F59E0B' },
                { label: 'Cash-Out Refi Equity (75% LTV)', key: 'cashOutRefiEquity', format: 'currency', color: '#8B5CF6' },
                { label: 'True Net Equity™', key: 'trueNetEquity', format: 'currency', color: '#EC4899' }
              ].map((row, rowIdx) => (
                <tr key={rowIdx} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                  <td style={{ padding: '10px 16px', color: theme.textSecondary, fontWeight: '500' }}>{row.label}</td>
                  {calculations.projections.slice(0, 10).map((proj, i) => {
                    const value = proj[row.key];
                    const displayValue = row.format === 'currency' ? formatCurrency(value) : formatPercent(value);
                    return (
                      <td key={i} style={{ padding: '10px 8px', textAlign: 'right', color: row.color, fontWeight: '500' }}>{displayValue}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: SALE PROJECTIONS TAB
  // ═══════════════════════════════════════════════════════════════════════════
  const renderSaleTab = () => {
    // Calculate sale projections
    const saleProjections = calculations.projections.map(proj => {
      const salePrice = proj.propertyValue;
      const realEstateCommission = salePrice * (propertyData.realEstateCommission / 100);
      const closingCosts = salePrice * (propertyData.closingCostsAtSale / 100);
      const grossProfit = salePrice - proj.loanBalance - calculations.totalInvested;
      const cumulativeDepreciation = calculations.annualDepreciation * proj.year;
      const depreciationRecapture = cumulativeDepreciation * (propertyData.depreciationRecaptureRate / 100);
      const capitalGains = Math.max(0, grossProfit - cumulativeDepreciation);
      const capitalGainsTax = capitalGains * (propertyData.capitalGainsTaxRate / 100);
      const totalTaxes = depreciationRecapture + capitalGainsTax;
      const netProfitAfterTaxes = grossProfit - realEstateCommission - closingCosts - totalTaxes;
      const totalReturn = proj.cumulativeCashFlow + netProfitAfterTaxes;
      const roi = (totalReturn / calculations.totalInvested) * 100;
      
      return {
        ...proj,
        salePrice,
        realEstateCommission,
        closingCostsAtSale: closingCosts,
        grossProfit,
        cumulativeDepreciation,
        depreciationRecapture,
        capitalGains,
        capitalGainsTax,
        totalTaxes,
        netProfitAfterTaxes,
        totalReturnWithSale: totalReturn,
        roiWithSale: roi
      };
    });
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Sale Projections Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'If Sold Year 1', value: formatCurrency(saleProjections[0]?.totalReturnWithSale || 0), sub: formatPercent(saleProjections[0]?.roiWithSale || 0) + ' ROI', color: saleProjections[0]?.totalReturnWithSale >= 0 ? '#10B981' : '#EF4444' },
            { label: 'If Sold Year 5', value: formatCurrency(saleProjections[4]?.totalReturnWithSale || 0), sub: formatPercent(saleProjections[4]?.roiWithSale || 0) + ' ROI', color: '#3B82F6' },
            { label: 'If Sold Year 10', value: formatCurrency(saleProjections[9]?.totalReturnWithSale || 0), sub: formatPercent(saleProjections[9]?.roiWithSale || 0) + ' ROI', color: '#8B5CF6' },
            { label: 'If Sold Year 18', value: formatCurrency(saleProjections[17]?.totalReturnWithSale || 0), sub: formatPercent(saleProjections[17]?.roiWithSale || 0) + ' ROI', color: '#F59E0B' }
          ].map((metric, i) => (
            <div key={i} style={{ ...cardStyle, textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '12px' }}>{metric.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: metric.color, marginBottom: '4px' }}>{metric.value}</div>
              <div style={{ fontSize: '14px', color: metric.color, opacity: 0.8 }}>{metric.sub}</div>
            </div>
          ))}
        </div>
        
        {/* Sale Settings */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #EC4899, #F59E0B)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Sale Assumptions</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { label: 'Real Estate Commission', field: 'realEstateCommission', suffix: '%' },
              { label: 'Closing Costs at Sale', field: 'closingCostsAtSale', suffix: '%' },
              { label: 'Capital Gains Tax Rate', field: 'capitalGainsTaxRate', suffix: '%' },
              { label: 'Depreciation Recapture', field: 'depreciationRecaptureRate', suffix: '%' }
            ].map((item, i) => (
              <div key={i}>
                <label style={labelStyle}>{item.label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.5"
                    value={propertyData[item.field]}
                    onChange={(e) => updateProperty(item.field, parseFloat(e.target.value) || 0)}
                    style={{ ...inputStyle, paddingRight: '30px' }}
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }}>{item.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sale Returns Chart */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #3B82F6)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '24px' }}>Returns if Sold (ROI)</h3>
          
          <div style={{ height: '300px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 900 280" preserveAspectRatio="xMidYMid meet">
              {/* Grid Lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="60" y1={40 + i * 50} x2="870" y2={40 + i * 50} stroke={theme.borderLight} strokeWidth="1" opacity="0.5" />
              ))}
              
              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4].map(i => {
                const maxROI = Math.max(...saleProjections.map(p => p.roiWithSale));
                const value = maxROI - (i / 4) * maxROI;
                return (
                  <text key={i} x="55" y={45 + i * 50} fill={theme.textMuted} fontSize="11" textAnchor="end">{formatPercent(value, 0)}</text>
                );
              })}
              
              {/* Line */}
              <path
                d={`M 70 ${240 - (saleProjections[0]?.roiWithSale / Math.max(...saleProjections.map(p => p.roiWithSale))) * 200} 
                  ${saleProjections.map((p, i) => `L ${70 + i * 45} ${240 - (p.roiWithSale / Math.max(...saleProjections.map(p => p.roiWithSale))) * 200}`).join(' ')}`}
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Data Points */}
              {saleProjections.map((p, i) => (
                <g key={i}>
                  <circle 
                    cx={70 + i * 45} 
                    cy={240 - (p.roiWithSale / Math.max(...saleProjections.map(p => p.roiWithSale))) * 200}
                    r="5"
                    fill="#10B981"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text x={70 + i * 45} y="265" fill={theme.textMuted} fontSize="10" textAnchor="middle">{p.year}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
        
        {/* Sale Analysis Table */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Sale of Property - Detailed Analysis</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: theme.bgMain }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: theme.textMuted, fontWeight: '600', borderBottom: `2px solid ${theme.borderLight}` }}>If Sold in Year</th>
                  {[1, 2, 3, 5, 7, 10, 15, 18].map(year => (
                    <th key={year} style={{ padding: '12px 8px', textAlign: 'right', color: theme.textMuted, fontWeight: '600', borderBottom: `2px solid ${theme.borderLight}` }}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Sale Price (ARV)', key: 'salePrice', format: 'currency', color: '#3B82F6' },
                  { label: 'Loan Balance', key: 'loanBalance', format: 'currency', color: '#EF4444' },
                  { label: 'Gross Profit', key: 'grossProfit', format: 'currency', colorLogic: true },
                  { label: 'Commission + Closing', key: 'realEstateCommission', format: 'currency', color: '#EF4444', addKey: 'closingCostsAtSale' },
                  { label: 'Total Taxes', key: 'totalTaxes', format: 'currency', color: '#EF4444' },
                  { label: 'Net Profit After Taxes', key: 'netProfitAfterTaxes', format: 'currency', colorLogic: true },
                  { label: 'Cumulative Cash Flow', key: 'cumulativeCashFlow', format: 'currency', color: '#10B981' },
                  { label: 'Total Return', key: 'totalReturnWithSale', format: 'currency', color: '#10B981', bold: true },
                  { label: 'ROI', key: 'roiWithSale', format: 'percent', color: '#8B5CF6', bold: true }
                ].map((row, rowIdx) => (
                  <tr key={rowIdx} style={{ borderBottom: `1px solid ${theme.borderLight}`, background: row.bold ? (theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.03)') : 'transparent' }}>
                    <td style={{ padding: '10px 16px', color: theme.textSecondary, fontWeight: row.bold ? '600' : '500' }}>{row.label}</td>
                    {[1, 2, 3, 5, 7, 10, 15, 18].map(year => {
                      const proj = saleProjections[year - 1];
                      if (!proj) return <td key={year} style={{ padding: '10px 8px', textAlign: 'right' }}>—</td>;
                      
                      let value = proj[row.key];
                      if (row.addKey) value += proj[row.addKey];
                      
                      const displayValue = row.format === 'currency' ? formatCurrency(value) : formatPercent(value);
                      const color = row.colorLogic ? (value >= 0 ? '#10B981' : '#EF4444') : row.color;
                      
                      return (
                        <td key={year} style={{ padding: '10px 8px', textAlign: 'right', color, fontWeight: row.bold ? '700' : '500' }}>{displayValue}</td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: SIMULATION TAB - Pass/Fail Criteria Checker
  // ═══════════════════════════════════════════════════════════════════════════
  const renderSimulationTab = () => {
    // Calculate all criteria results
    const criteriaResults = [
      {
        id: 'cashOnCash',
        name: 'Cash on Cash Return',
        icon: '💰',
        actual: calculations.cashOnCashReturn,
        target: simulationCriteria.minCashOnCash,
        unit: '%',
        comparison: 'min',
        category: 'returns',
        importance: 'critical',
        explanation: 'Cash on Cash Return measures annual cash flow as a percentage of total cash invested. Industry standard for good deals is 8-12%.'
      },
      {
        id: 'capRate',
        name: 'Cap Rate',
        icon: '📊',
        actual: calculations.capRate,
        target: simulationCriteria.minCapRate,
        unit: '%',
        comparison: 'min',
        category: 'returns',
        importance: 'critical',
        explanation: 'Capitalization Rate shows the property\'s return independent of financing. Higher cap rates indicate better income potential but may come with more risk.'
      },
      {
        id: 'monthlyCashFlow',
        name: 'Monthly Cash Flow',
        icon: '📅',
        actual: calculations.monthlyCashFlow,
        target: simulationCriteria.minMonthlyCashFlow,
        unit: '$',
        comparison: 'min',
        category: 'cashflow',
        importance: 'critical',
        explanation: 'Positive monthly cash flow ensures the property pays for itself. Aim for at least $100-200/month per door as a safety buffer.'
      },
      {
        id: 'annualCashFlow',
        name: 'Annual Cash Flow',
        icon: '💵',
        actual: calculations.annualCashFlow,
        target: simulationCriteria.minAnnualCashFlow,
        unit: '$',
        comparison: 'min',
        category: 'cashflow',
        importance: 'high',
        explanation: 'Total yearly cash flow after all expenses and debt service. This is your actual profit from the property.'
      },
      {
        id: 'ltv',
        name: 'Loan-to-Value (LTV)',
        icon: '🏦',
        actual: (calculations.loanAmount / propertyData.purchasePrice) * 100,
        target: simulationCriteria.maxLTV,
        unit: '%',
        comparison: 'max',
        category: 'risk',
        importance: 'high',
        explanation: 'Lower LTV means more equity and less risk. Most lenders require 75-80% LTV for investment properties.'
      },
      {
        id: 'dscr',
        name: 'Debt Service Coverage Ratio',
        icon: '🛡️',
        actual: calculations.annualPI > 0 ? calculations.noi / calculations.annualPI : 0,
        target: simulationCriteria.minDSCR,
        unit: 'x',
        comparison: 'min',
        category: 'risk',
        importance: 'critical',
        explanation: 'DSCR measures ability to cover debt payments. Lenders typically require 1.2-1.25x minimum. Higher is safer.'
      },
      {
        id: 'totalROI',
        name: 'Total ROI (Year 1)',
        icon: '📈',
        actual: calculations.totalROI,
        target: simulationCriteria.minTotalROI,
        unit: '%',
        comparison: 'min',
        category: 'returns',
        importance: 'high',
        explanation: 'Total return including appreciation, cash flow, debt paydown, and tax benefits. Aim for 12-20% for good deals.'
      },
      {
        id: 'purchasePrice',
        name: 'Purchase Price',
        icon: '🏷️',
        actual: propertyData.purchasePrice,
        target: simulationCriteria.maxPurchasePrice,
        unit: '$',
        comparison: 'max',
        category: 'affordability',
        importance: 'medium',
        explanation: 'Ensure the purchase price fits within your investment budget and risk tolerance.'
      },
      {
        id: 'equityYear5',
        name: 'Projected Equity (Year 5)',
        icon: '💎',
        actual: calculations.projections[4]?.equity || 0,
        target: simulationCriteria.minEquityYear5,
        unit: '$',
        comparison: 'min',
        category: 'growth',
        importance: 'medium',
        explanation: 'Equity build-up provides options for refinancing, selling, or leveraging into more properties.'
      },
      {
        id: 'vacancyRate',
        name: 'Vacancy Rate',
        icon: '🏚️',
        actual: propertyData.vacancyRate,
        target: simulationCriteria.maxVacancyRate,
        unit: '%',
        comparison: 'max',
        category: 'risk',
        importance: 'medium',
        explanation: 'Conservative vacancy estimates protect against income loss. 3-5% is typical for stable markets, 8-10% for riskier areas.'
      }
    ];
    
    // Calculate pass/fail for each criteria
    const results = criteriaResults.map(criteria => {
      let passed;
      if (criteria.comparison === 'min') {
        passed = criteria.actual >= criteria.target;
      } else {
        passed = criteria.actual <= criteria.target;
      }
      return { ...criteria, passed };
    });
    
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    const passRate = (passedCount / totalCount) * 100;
    const criticalFails = results.filter(r => !r.passed && r.importance === 'critical');
    
    // Overall deal grade
    let dealGrade, gradeColor, gradeEmoji;
    if (passRate >= 90 && criticalFails.length === 0) {
      dealGrade = 'A+'; gradeColor = '#10B981'; gradeEmoji = '🏆';
    } else if (passRate >= 80 && criticalFails.length === 0) {
      dealGrade = 'A'; gradeColor = '#10B981'; gradeEmoji = '✨';
    } else if (passRate >= 70 && criticalFails.length <= 1) {
      dealGrade = 'B'; gradeColor = '#3B82F6'; gradeEmoji = '👍';
    } else if (passRate >= 60) {
      dealGrade = 'C'; gradeColor = '#F59E0B'; gradeEmoji = '⚠️';
    } else if (passRate >= 40) {
      dealGrade = 'D'; gradeColor = '#EF4444'; gradeEmoji = '🚨';
    } else {
      dealGrade = 'F'; gradeColor = '#DC2626'; gradeEmoji = '❌';
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Overall Score Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Grade Card */}
          <div style={{ 
            ...cardStyle, 
            background: `linear-gradient(135deg, ${gradeColor}15, ${gradeColor}05)`,
            border: `2px solid ${gradeColor}30`,
            textAlign: 'center',
            padding: '32px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{gradeEmoji}</div>
            <div style={{ fontSize: '72px', fontWeight: '900', color: gradeColor, lineHeight: 1 }}>{dealGrade}</div>
            <div style={{ fontSize: '16px', color: theme.textSecondary, marginTop: '12px', fontWeight: '600' }}>Deal Grade</div>
            <div style={{ 
              marginTop: '20px', 
              padding: '12px 20px', 
              background: theme.bgMain, 
              borderRadius: '12px',
              display: 'inline-block'
            }}>
              <span style={{ fontSize: '24px', fontWeight: '800', color: gradeColor }}>{passedCount}</span>
              <span style={{ color: theme.textMuted, fontSize: '14px' }}> / {totalCount} criteria passed</span>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div style={cardStyle}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${gradeColor}, #8B5CF6)` }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>Deal Simulation Summary</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Pass Rate', value: `${safeFixed(passRate, 0)}%`, color: passRate >= 70 ? '#10B981' : '#EF4444' },
                { label: 'Critical Fails', value: criticalFails.length, color: criticalFails.length === 0 ? '#10B981' : '#EF4444' },
                { label: 'High Priority Fails', value: results.filter(r => !r.passed && r.importance === 'high').length, color: '#F59E0B' },
                { label: 'Areas to Improve', value: results.filter(r => !r.passed).length, color: '#8B5CF6' }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '16px', background: theme.bgMain, borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Quick Verdict */}
            <div style={{ 
              padding: '16px 20px', 
              background: `${gradeColor}10`, 
              borderRadius: '12px',
              border: `1px solid ${gradeColor}30`
            }}>
              <div style={{ fontWeight: '700', color: gradeColor, marginBottom: '8px', fontSize: '15px' }}>
                {passRate >= 70 ? '✅ Deal Recommendation: PROCEED WITH CAUTION' : '⚠️ Deal Recommendation: NEEDS IMPROVEMENT'}
              </div>
              <div style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: 1.6 }}>
                {criticalFails.length > 0 
                  ? `This deal fails ${criticalFails.length} critical criteria: ${criticalFails.map(f => f.name).join(', ')}. Consider renegotiating terms or finding a better deal.`
                  : passRate >= 80 
                    ? 'This deal meets most of your investment criteria and appears to be a solid opportunity.'
                    : 'This deal has potential but needs improvement in several areas before moving forward.'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Criteria Settings */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>🎯 Your Investment Criteria</h3>
            <span style={{ fontSize: '12px', color: theme.textMuted }}>Customize your pass/fail thresholds</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Min Cash on Cash %', field: 'minCashOnCash', suffix: '%' },
              { label: 'Min Cap Rate %', field: 'minCapRate', suffix: '%' },
              { label: 'Min Monthly Cash Flow', field: 'minMonthlyCashFlow', prefix: '$' },
              { label: 'Min Annual Cash Flow', field: 'minAnnualCashFlow', prefix: '$' },
              { label: 'Max LTV %', field: 'maxLTV', suffix: '%' },
              { label: 'Min DSCR', field: 'minDSCR', suffix: 'x' },
              { label: 'Min Total ROI %', field: 'minTotalROI', suffix: '%' },
              { label: 'Max Purchase Price', field: 'maxPurchasePrice', prefix: '$' },
              { label: 'Min Equity Year 5', field: 'minEquityYear5', prefix: '$' },
              { label: 'Max Vacancy Rate %', field: 'maxVacancyRate', suffix: '%' }
            ].map((item, i) => (
              <div key={i}>
                <label style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px', display: 'block' }}>{item.label}</label>
                <div style={{ position: 'relative' }}>
                  {item.prefix && <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '12px' }}>{item.prefix}</span>}
                  <input
                    type="number"
                    step={item.field.includes('DSCR') ? '0.1' : '1'}
                    value={simulationCriteria[item.field]}
                    onChange={(e) => updateCriteria(item.field, e.target.value)}
                    style={{ ...inputStyle, padding: item.prefix ? '10px 10px 10px 22px' : '10px', fontSize: '13px', textAlign: 'right' }}
                  />
                  {item.suffix && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '11px' }}>{item.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Detailed Results */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10B981, #EF4444)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>📋 Detailed Criteria Analysis</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((result, i) => (
              <div 
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 1fr 120px 120px 100px',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: result.passed 
                    ? (theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)')
                    : (theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)'),
                  borderRadius: '12px',
                  border: `1px solid ${result.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                }}
              >
                <div style={{ fontSize: '28px', textAlign: 'center' }}>{result.icon}</div>
                
                <div>
                  <div style={{ fontWeight: '600', color: theme.textPrimary, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {result.name}
                    {result.importance === 'critical' && (
                      <span style={{ fontSize: '9px', padding: '2px 6px', background: '#EF444420', color: '#EF4444', borderRadius: '4px', fontWeight: '700' }}>CRITICAL</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textMuted, lineHeight: 1.4 }}>{result.explanation}</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '4px' }}>Your Target</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: theme.textSecondary }}>
                    {result.comparison === 'min' ? '≥' : '≤'} {result.unit === '$' ? formatCurrency(result.target) : `${result.target}${result.unit}`}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '4px' }}>Actual</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: result.passed ? '#10B981' : '#EF4444' }}>
                    {result.unit === '$' ? formatCurrency(result.actual) : `${safeFixed(result.actual, 2)}${result.unit}`}
                  </div>
                </div>
                
                <div style={{ 
                  textAlign: 'center',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: result.passed ? '#10B98120' : '#EF444420',
                  color: result.passed ? '#10B981' : '#EF4444',
                  fontWeight: '700',
                  fontSize: '14px'
                }}>
                  {result.passed ? '✓ PASS' : '✗ FAIL'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Failed Criteria Deep Dive */}
        {results.filter(r => !r.passed).length > 0 && (
          <div style={cardStyle}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px' }}>🔧 How to Fix Failed Criteria</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {results.filter(r => !r.passed).map((result, i) => {
                let fixSuggestion = '';
                const gap = result.comparison === 'min' 
                  ? result.target - result.actual 
                  : result.actual - result.target;
                
                switch(result.id) {
                  case 'cashOnCash':
                    fixSuggestion = `Increase rent by ${formatCurrency(gap * calculations.totalInvested / 100 / 12)}/month, reduce purchase price by ${formatCurrency(gap * calculations.totalInvested / 100 / 0.08)}, or increase down payment.`;
                    break;
                  case 'capRate':
                    fixSuggestion = `Negotiate a lower purchase price or find ways to increase NOI through higher rent or lower expenses.`;
                    break;
                  case 'monthlyCashFlow':
                    fixSuggestion = `Increase rent by ${formatCurrency(Math.abs(gap))}/month, reduce expenses, or refinance at a lower rate.`;
                    break;
                  case 'dscr':
                    fixSuggestion = `Increase NOI by ${formatCurrency((gap * calculations.annualPI))}/year through higher rent or lower expenses.`;
                    break;
                  case 'ltv':
                    fixSuggestion = `Increase your down payment by ${formatCurrency((result.actual - result.target) / 100 * propertyData.purchasePrice)} to meet LTV requirements.`;
                    break;
                  default:
                    fixSuggestion = `Review and adjust your inputs or negotiate better terms with the seller.`;
                }
                
                return (
                  <div key={i} style={{ 
                    padding: '16px', 
                    background: theme.bgMain, 
                    borderRadius: '12px',
                    border: `1px solid ${theme.borderLight}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{result.icon}</span>
                      <span style={{ fontWeight: '600', color: '#EF4444' }}>{result.name}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: 1.5 }}>
                      <strong>Gap:</strong> {result.unit === '$' ? formatCurrency(Math.abs(gap)) : `${safeFixed(Math.abs(gap), 2)}${result.unit}`} {result.comparison === 'min' ? 'below' : 'above'} target
                    </div>
                    <div style={{ fontSize: '13px', color: theme.textPrimary, marginTop: '8px', lineHeight: 1.5 }}>
                      <strong>💡 Suggestion:</strong> {fixSuggestion}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: AI ANALYSIS TAB - Penny's Insights
  // ═══════════════════════════════════════════════════════════════════════════
  const renderAIAnalysisTab = () => {
    // Generate AI insights based on the deal
    const generateInsights = () => {
      const insights = [];
      
      // Cash Flow Analysis
      if (calculations.monthlyCashFlow < 0) {
        insights.push({
          type: 'warning',
          category: 'Cash Flow',
          title: 'Negative Cash Flow Alert',
          message: `This property is projected to lose ${formatCurrency(Math.abs(calculations.monthlyCashFlow))}/month. You'll need to subsidize ${formatCurrency(Math.abs(calculations.annualCashFlow))}/year from other income.`,
          recommendation: 'Consider increasing rent, negotiating a lower price, or increasing your down payment to improve cash flow.'
        });
      } else if (calculations.monthlyCashFlow < 200) {
        insights.push({
          type: 'caution',
          category: 'Cash Flow',
          title: 'Thin Cash Flow Margins',
          message: `Monthly cash flow of ${formatCurrency(calculations.monthlyCashFlow)} leaves little room for unexpected expenses or vacancies.`,
          recommendation: 'Build a 6-month reserve fund and consider ways to increase rental income.'
        });
      } else {
        insights.push({
          type: 'positive',
          category: 'Cash Flow',
          title: 'Healthy Cash Flow',
          message: `Strong monthly cash flow of ${formatCurrency(calculations.monthlyCashFlow)} provides good protection against vacancies and repairs.`,
          recommendation: 'Consider reinvesting excess cash flow into property improvements or your next investment.'
        });
      }
      
      // Cap Rate Analysis
      if (calculations.capRate < 4) {
        insights.push({
          type: 'warning',
          category: 'Returns',
          title: 'Below-Market Cap Rate',
          message: `A ${formatPercent(calculations.capRate)} cap rate is below the typical 5-8% range for most markets.`,
          recommendation: 'This may indicate an overpriced property or a premium market. Ensure appreciation potential justifies the low cap rate.'
        });
      } else if (calculations.capRate >= 8) {
        insights.push({
          type: 'positive',
          category: 'Returns',
          title: 'Strong Cap Rate',
          message: `A ${formatPercent(calculations.capRate)} cap rate exceeds market averages and indicates strong income potential.`,
          recommendation: 'Verify the numbers are accurate and investigate why the cap rate is high - there may be hidden risks.'
        });
      }
      
      // DSCR Analysis
      const dscr = calculations.annualPI > 0 ? calculations.noi / calculations.annualPI : 0;
      if (dscr < 1.0) {
        insights.push({
          type: 'critical',
          category: 'Risk',
          title: 'DSCR Below 1.0 - High Risk',
          message: `A DSCR of ${safeFixed(dscr, 2)}x means the property cannot cover its debt payments from rental income alone.`,
          recommendation: 'This deal is risky. Increase down payment or negotiate better terms before proceeding.'
        });
      } else if (dscr < 1.25) {
        insights.push({
          type: 'caution',
          category: 'Risk',
          title: 'DSCR Below Lender Threshold',
          message: `Most lenders require DSCR of 1.25x minimum. Your ${safeFixed(dscr, 2)}x may affect financing options.`,
          recommendation: 'Consider increasing rent or down payment to improve DSCR above 1.25x.'
        });
      }
      
      // LTV Analysis
      const ltv = propertyData.purchasePrice > 0 ? (calculations.loanAmount / propertyData.purchasePrice) * 100 : 0;
      if (ltv > 80) {
        insights.push({
          type: 'caution',
          category: 'Financing',
          title: 'High Leverage Position',
          message: `An ${formatPercent(ltv)} LTV means you have limited equity cushion if property values decline.`,
          recommendation: 'Consider a larger down payment to reduce risk and potentially eliminate PMI.'
        });
      }
      
      // ROI Analysis
      if (calculations.totalROI > 20) {
        insights.push({
          type: 'positive',
          category: 'Returns',
          title: 'Exceptional Total ROI',
          message: `A ${formatPercent(calculations.totalROI)} total ROI significantly outperforms stock market averages (7-10%).`,
          recommendation: 'Double-check all assumptions. If accurate, this is an excellent opportunity.'
        });
      } else if (calculations.totalROI < 8) {
        insights.push({
          type: 'caution',
          category: 'Returns',
          title: 'Below-Average Total ROI',
          message: `A ${formatPercent(calculations.totalROI)} total ROI is below the typical 12-15% target for real estate investments.`,
          recommendation: 'Consider whether the low return justifies the effort and risk of owning rental property.'
        });
      }
      
      // Expense Ratio Analysis
      const expenseRatio = calculations.grossPotentialIncome > 0 ? (calculations.totalOperatingExpenses / calculations.grossPotentialIncome) * 100 : 0;
      if (expenseRatio > 50) {
        insights.push({
          type: 'caution',
          category: 'Expenses',
          title: 'High Operating Expense Ratio',
          message: `Operating expenses consume ${formatPercent(expenseRatio)} of gross income, above the typical 35-45% range.`,
          recommendation: 'Review expense categories for potential savings, especially property taxes and insurance.'
        });
      }
      
      // Appreciation Assumption
      if (propertyData.annualAppreciation > 5) {
        insights.push({
          type: 'caution',
          category: 'Assumptions',
          title: 'Aggressive Appreciation Assumption',
          message: `${propertyData.annualAppreciation}% annual appreciation exceeds historical averages (3-4% nationally).`,
          recommendation: 'Consider using more conservative appreciation estimates for risk analysis.'
        });
      }
      
      // True Cash Flow Impact
      if (calculations.trueCashFlow > calculations.annualCashFlow * 1.5) {
        insights.push({
          type: 'positive',
          category: 'Tax Benefits',
          title: 'Strong Tax Advantage',
          message: `Depreciation adds ${formatCurrency(calculations.cashFlowFromDepreciation)}/year in tax benefits, significantly boosting your true returns.`,
          recommendation: 'Consult a tax professional to maximize depreciation benefits and explore cost segregation.'
        });
      }
      
      return insights;
    };
    
    const insights = generateInsights();
    const positiveCount = insights.filter(i => i.type === 'positive').length;
    const cautionCount = insights.filter(i => i.type === 'caution').length;
    const warningCount = insights.filter(i => i.type === 'warning' || i.type === 'critical').length;
    
    // Industry Benchmarks
    const safeDSCR = calculations.annualPI > 0 ? calculations.noi / calculations.annualPI : 0;
    const safeExpenseRatio = calculations.grossPotentialIncome > 0 ? (calculations.totalOperatingExpenses / calculations.grossPotentialIncome) * 100 : 0;
    const benchmarks = [
      { metric: 'Cap Rate', yours: calculations.capRate, industry: '5-8%', status: calculations.capRate >= 5 ? 'good' : 'low' },
      { metric: 'Cash on Cash', yours: calculations.cashOnCashReturn, industry: '8-12%', status: calculations.cashOnCashReturn >= 8 ? 'good' : 'low' },
      { metric: 'DSCR', yours: safeDSCR, industry: '1.25-1.5x', status: safeDSCR >= 1.25 ? 'good' : 'low' },
      { metric: 'Expense Ratio', yours: safeExpenseRatio, industry: '35-45%', status: safeExpenseRatio <= 45 ? 'good' : 'high' },
      { metric: 'Total ROI', yours: calculations.totalROI, industry: '12-20%', status: calculations.totalROI >= 12 ? 'good' : 'low' }
    ];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Penny Header */}
        <div style={{ 
          ...cardStyle, 
          background: `linear-gradient(135deg, ${theme.mode === 'dark' ? 'rgba(244, 114, 182, 0.15)' : 'rgba(244, 114, 182, 0.08)'}, ${theme.mode === 'dark' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)'})`,
          border: '2px solid rgba(244, 114, 182, 0.3)',
          padding: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            {/* Penny Avatar - Penny's Face */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #EC4899, #F472B6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)',
              flexShrink: 0,
              padding: '8px'
            }}>
              {/* Penny Logo SVG */}
              <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                <defs>
                  <linearGradient id="pennyGradAI" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE135" />
                    <stop offset="50%" stopColor="#FFEC8B" />
                    <stop offset="100%" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="28" fill="url(#pennyGradAI)" />
                <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                <text x="32" y="18" textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold" fontFamily="Arial">$</text>
                <ellipse cx="24" cy="28" rx="3" ry="3.5" fill="#1a1a1a"/>
                <ellipse cx="40" cy="28" rx="3" ry="3.5" fill="#1a1a1a"/>
                <ellipse cx="25" cy="27" rx="1.2" ry="1.2" fill="#FFFFFF"/>
                <ellipse cx="41" cy="27" rx="1.2" ry="1.2" fill="#FFFFFF"/>
                <path d="M24 40 Q32 46 40 40" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <ellipse cx="17" cy="34" rx="3.5" ry="2.5" fill="#FFCCCB" opacity="0.5"/>
                <ellipse cx="47" cy="34" rx="3.5" ry="2.5" fill="#FFCCCB" opacity="0.5"/>
              </svg>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: theme.textPrimary, margin: 0 }}>
                  Penny's Deal Analysis
                </h2>
                <span style={{ 
                  padding: '4px 12px', 
                  background: 'linear-gradient(135deg, #EC4899, #F472B6)', 
                  borderRadius: '20px', 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>AI Powered</span>
              </div>
              <p style={{ fontSize: '15px', color: theme.textSecondary, margin: 0, lineHeight: 1.6 }}>
                Hi there! 👋 I've analyzed your investment property at <strong>{propertyData.propertyAddress}</strong> and 
                here's what I found. I'll highlight the strengths, flag potential concerns, and give you actionable 
                recommendations to maximize your returns!
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
            {[
              { label: 'Positive Signals', value: positiveCount, icon: '✅', color: '#10B981' },
              { label: 'Caution Areas', value: cautionCount, icon: '⚠️', color: '#F59E0B' },
              { label: 'Warnings', value: warningCount, icon: '🚨', color: '#EF4444' },
              { label: 'Total Insights', value: insights.length, icon: '💡', color: '#8B5CF6' }
            ].map((stat, i) => (
              <div key={i} style={{ 
                textAlign: 'center', 
                padding: '16px', 
                background: theme.bgCard, 
                borderRadius: '12px',
                border: `1px solid ${theme.borderLight}`
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: theme.textMuted }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Executive Summary */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #EC4899, #8B5CF6)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📊</span> Executive Summary
          </h3>
          
          <div style={{ 
            padding: '24px', 
            background: theme.bgMain, 
            borderRadius: '16px',
            border: `1px solid ${theme.borderLight}`,
            lineHeight: 1.8
          }}>
            <p style={{ fontSize: '15px', color: theme.textPrimary, margin: 0 }}>
              This <strong>{formatCurrency(propertyData.purchasePrice)}</strong> property with <strong>{formatCurrency(propertyData.monthlyRent)}/month</strong> rent 
              {calculations.monthlyCashFlow >= 0 
                ? ` generates positive cash flow of ${formatCurrency(calculations.monthlyCashFlow)}/month (${formatCurrency(calculations.annualCashFlow)}/year).`
                : ` has negative cash flow of ${formatCurrency(Math.abs(calculations.monthlyCashFlow))}/month.`}
            </p>
            <p style={{ fontSize: '15px', color: theme.textPrimary, margin: '16px 0 0 0' }}>
              With a <strong>{formatPercent(calculations.capRate)} cap rate</strong> and <strong>{formatPercent(calculations.cashOnCashReturn)} cash-on-cash return</strong>, 
              this deal {calculations.cashOnCashReturn >= 8 ? 'meets' : 'falls below'} typical investor thresholds. 
              Your total Year 1 ROI including appreciation, debt paydown, and tax benefits is <strong>{formatPercent(calculations.totalROI)}</strong>.
            </p>
            <p style={{ fontSize: '15px', color: theme.textPrimary, margin: '16px 0 0 0' }}>
              After 5 years, you're projected to have <strong>{formatCurrency(calculations.projections[4]?.equity || 0)}</strong> in equity, 
              and if held for 18 years, <strong>{formatCurrency(calculations.projections[17]?.equity || 0)}</strong>. 
              True Cash Flow™ (including depreciation benefits) is <strong>{formatCurrency(calculations.trueCashFlow)}/year</strong>.
            </p>
          </div>
        </div>
        
        {/* Industry Benchmarks */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #3B82F6, #10B981)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📈</span> Industry Benchmark Comparison
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {benchmarks.map((b, i) => (
              <div key={i} style={{ 
                padding: '20px', 
                background: theme.bgMain, 
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${b.status === 'good' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '8px' }}>{b.metric}</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: b.status === 'good' ? '#10B981' : '#EF4444', marginBottom: '4px' }}>
                  {typeof b.yours === 'number' ? (b.metric.includes('Ratio') || b.metric.includes('Rate') || b.metric.includes('ROI') || b.metric.includes('Cash') ? formatPercent(b.yours) : safeFixed(b.yours, 2) + 'x') : b.yours}
                </div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Industry: {b.industry}</div>
                <div style={{ 
                  marginTop: '8px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: b.status === 'good' ? '#10B98120' : '#EF444420',
                  color: b.status === 'good' ? '#10B981' : '#EF4444'
                }}>
                  {b.status === 'good' ? '✓ MEETS STANDARD' : '✗ BELOW STANDARD'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Detailed Insights */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💡</span> Detailed Analysis & Recommendations
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {insights.map((insight, i) => {
              const typeStyles = {
                positive: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.3)', icon: '✅', color: '#10B981' },
                caution: { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.3)', icon: '⚠️', color: '#F59E0B' },
                warning: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.3)', icon: '🚨', color: '#EF4444' },
                critical: { bg: 'rgba(220, 38, 38, 0.1)', border: 'rgba(220, 38, 38, 0.4)', icon: '🔴', color: '#DC2626' }
              };
              const style = typeStyles[insight.type];
              
              return (
                <div key={i} style={{
                  padding: '20px',
                  background: theme.mode === 'dark' ? style.bg : style.bg.replace('0.08', '0.04'),
                  borderRadius: '12px',
                  border: `1px solid ${style.border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ fontSize: '24px', marginTop: '2px' }}>{style.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '700', color: style.color, fontSize: '16px' }}>{insight.title}</span>
                        <span style={{ 
                          padding: '2px 8px', 
                          background: theme.bgMain, 
                          borderRadius: '6px', 
                          fontSize: '10px', 
                          color: theme.textMuted,
                          fontWeight: '600'
                        }}>{insight.category}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: theme.textSecondary, margin: '0 0 12px 0', lineHeight: 1.6 }}>
                        {insight.message}
                      </p>
                      <div style={{ 
                        padding: '12px 16px', 
                        background: theme.bgCard, 
                        borderRadius: '8px',
                        border: `1px solid ${theme.borderLight}`
                      }}>
                        <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                          💡 Penny's Recommendation
                        </div>
                        <div style={{ fontSize: '13px', color: theme.textPrimary, lineHeight: 1.5 }}>
                          {insight.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Action Items */}
        <div style={cardStyle}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✅</span> Next Steps Checklist
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { task: 'Verify rental income with current market comps', priority: 'high' },
              { task: 'Get property inspection and estimate repairs', priority: 'high' },
              { task: 'Confirm property taxes with county assessor', priority: 'medium' },
              { task: 'Shop for best mortgage rates (compare 3+ lenders)', priority: 'high' },
              { task: 'Review HOA rules and financial health', priority: 'medium' },
              { task: 'Calculate reserves (6 months expenses minimum)', priority: 'high' },
              { task: 'Consult with CPA on tax implications', priority: 'medium' },
              { task: 'Run worst-case scenario (10% vacancy, 20% expense increase)', priority: 'medium' }
            ].map((item, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '14px 16px',
                background: theme.bgMain,
                borderRadius: '10px',
                border: `1px solid ${theme.borderLight}`
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: `2px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}>
                </div>
                <span style={{ fontSize: '13px', color: theme.textPrimary, flex: 1 }}>{item.task}</span>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600',
                  background: item.priority === 'high' ? '#EF444420' : '#F59E0B20',
                  color: item.priority === 'high' ? '#EF4444' : '#F59E0B'
                }}>
                  {item.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Final Verdict */}
        <div style={{ 
          ...cardStyle, 
          background: `linear-gradient(135deg, ${theme.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)'}, ${theme.mode === 'dark' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)'})`,
          border: '2px solid rgba(139, 92, 246, 0.3)',
          textAlign: 'center',
          padding: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {calculations.cashOnCashReturn >= 8 && calculations.monthlyCashFlow > 0 ? '🎉' : calculations.monthlyCashFlow > 0 ? '🤔' : '⚠️'}
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: theme.textPrimary, marginBottom: '12px' }}>
            Penny's Final Verdict
          </h3>
          <p style={{ fontSize: '18px', color: theme.textSecondary, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            {calculations.cashOnCashReturn >= 10 && calculations.monthlyCashFlow > 200
              ? "This looks like a solid deal! Strong cash flow and returns make this an attractive investment opportunity. Do your due diligence and move forward with confidence."
              : calculations.cashOnCashReturn >= 6 && calculations.monthlyCashFlow > 0
                ? "This deal has potential but isn't a home run. Consider negotiating better terms or increasing rent to improve returns before committing."
                : "I'd recommend passing on this deal in its current form. The numbers don't support a strong investment case. Look for opportunities with better cash flow or negotiate significantly better terms."}
          </p>
          <div style={{ 
            marginTop: '24px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '12px 24px',
            background: theme.bgCard,
            borderRadius: '12px',
            border: `1px solid ${theme.borderLight}`
          }}>
            <span style={{ fontSize: '20px' }}>🪙</span>
            <span style={{ fontSize: '14px', color: theme.textMuted }}>Analysis generated by Penny AI • ProsperNest</span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10B981, #3B82F6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
          }}>
            🏠
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.textPrimary, margin: 0 }}>
              RE Budget Hub
            </h1>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
              Real Estate Investment Analysis & Deal Calculator
            </p>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'analyzer' && renderAnalyzerTab()}
      {activeTab === 'compare' && renderCompareTab()}
      {activeTab === 'cashflow' && renderCashFlowTab()}
      {activeTab === 'roi' && renderROITab()}
      {activeTab === 'equity' && renderEquityTab()}
      {activeTab === 'sale' && renderSaleTab()}
      {activeTab === 'simulation' && renderSimulationTab()}
      {activeTab === 'aianalysis' && renderAIAnalysisTab()}
    </div>
  );
};

export default REBudgetHub;
