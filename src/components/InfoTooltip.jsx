import React, { useState } from 'react';

// ============================================================================
// EDUCATIONAL INFO TOOLTIP - Financial Literacy Helper
// ============================================================================
// This component provides hover tooltips with educational content to help
// users understand financial metrics, calculations, and concepts.
// ============================================================================

export function InfoTooltip({ 
  title,           // Short title for the metric
  definition,      // What does this metric mean?
  calculation,     // How is it calculated? (formula or explanation)
  interpretation,  // How to interpret the results (good vs bad)
  tips,            // Actionable tips for improvement
  isProjection = false,  // Is this a projection/estimate vs actual data?
  dataSource,      // Where does the data come from?
  isDarkMode = false,
  size = 'normal', // 'small', 'normal', 'large'
  position = 'top' // 'top', 'bottom', 'left', 'right'
}) {
  const [isVisible, setIsVisible] = useState(false);
  
  const iconSize = size === 'small' ? '14px' : size === 'large' ? '20px' : '16px';
  
  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }
  };
  
  const arrowStyles = {
    top: { bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    bottom: { top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    left: { right: '-6px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    right: { left: '-6px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' }
  };

  return (
    <div 
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Info Icon */}
      <div style={{
        width: iconSize,
        height: iconSize,
        borderRadius: '50%',
        background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'help',
        transition: 'all 0.2s ease',
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
        ...(isVisible && {
          background: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)',
          borderColor: '#8B5CF6'
        })
      }}>
        <span style={{ 
          fontSize: size === 'small' ? '10px' : size === 'large' ? '14px' : '11px',
          fontWeight: '700',
          color: isVisible ? '#8B5CF6' : (isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)')
        }}>?</span>
      </div>

      {/* Tooltip Content */}
      {isVisible && (
        <div style={{
          position: 'absolute',
          ...positionStyles[position],
          width: '320px',
          background: isDarkMode ? '#1F2937' : '#FFFFFF',
          borderRadius: '16px',
          boxShadow: isDarkMode 
            ? '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'tooltipFadeIn 0.2s ease'
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            ...arrowStyles[position],
            width: '12px',
            height: '12px',
            background: isDarkMode ? '#1F2937' : '#FFFFFF',
            boxShadow: position === 'top' || position === 'left' 
              ? '2px 2px 4px rgba(0,0,0,0.1)' 
              : '-2px -2px 4px rgba(0,0,0,0.1)'
          }} />
          
          {/* Header */}
          <div style={{
            background: isProjection 
              ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
              : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '18px' }}>
              {isProjection ? '📊' : '💡'}
            </span>
            <div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '700', 
                color: '#FFFFFF',
                letterSpacing: '-0.3px'
              }}>{title}</div>
              {isProjection && (
                <div style={{ 
                  fontSize: '10px', 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: '500',
                  marginTop: '2px'
                }}>⚠️ This is a projection/estimate</div>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div style={{ padding: '16px' }}>
            {/* Definition */}
            {definition && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  color: '#8B5CF6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>What is this?</div>
                <div style={{ 
                  fontSize: '13px', 
                  color: isDarkMode ? '#D1D5DB' : '#4B5563',
                  lineHeight: '1.5'
                }}>{definition}</div>
              </div>
            )}
            
            {/* Calculation */}
            {calculation && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  color: '#10B981',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>How it's calculated</div>
                <div style={{ 
                  fontSize: '12px', 
                  color: isDarkMode ? '#9CA3AF' : '#6B7280',
                  background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#F0FDF4',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  lineHeight: '1.6',
                  border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5'}`
                }}>{calculation}</div>
              </div>
            )}
            
            {/* Data Source */}
            {dataSource && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  color: '#3B82F6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>Data source</div>
                <div style={{ 
                  fontSize: '12px', 
                  color: isDarkMode ? '#9CA3AF' : '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>📥</span> {dataSource}
                </div>
              </div>
            )}
            
            {/* Interpretation */}
            {interpretation && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  color: '#F59E0B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>What does my score mean?</div>
                <div style={{ 
                  fontSize: '13px', 
                  color: isDarkMode ? '#D1D5DB' : '#4B5563',
                  lineHeight: '1.5'
                }}>{interpretation}</div>
              </div>
            )}
            
            {/* Tips */}
            {tips && tips.length > 0 && (
              <div style={{
                background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : '#F5F3FF',
                padding: '12px',
                borderRadius: '10px',
                border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : '#E9D5FF'}`
              }}>
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  color: '#8B5CF6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>💪</span> Tips to improve
                </div>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '16px',
                  fontSize: '12px',
                  color: isDarkMode ? '#D1D5DB' : '#4B5563',
                  lineHeight: '1.6'
                }}>
                  {tips.map((tip, i) => (
                    <li key={i} style={{ marginBottom: i < tips.length - 1 ? '4px' : 0 }}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Keyframe animation */}
      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// METRIC LABEL WITH TOOLTIP - Combined label + info icon
// ============================================================================
export function MetricLabel({
  label,
  tooltip,
  isDarkMode = false,
  fontSize = '13px',
  fontWeight = '500',
  color
}) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px' 
    }}>
      <span style={{ 
        fontSize, 
        fontWeight,
        color: color || (isDarkMode ? '#9CA3AF' : '#6B7280')
      }}>{label}</span>
      <InfoTooltip {...tooltip} isDarkMode={isDarkMode} size="small" />
    </div>
  );
}

// ============================================================================
// PROJECTION BADGE - Indicates estimated/projected data
// ============================================================================
export function ProjectionBadge({ isDarkMode = false }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      background: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7',
      color: isDarkMode ? '#FBBF24' : '#D97706',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.3px'
    }}>
      <span>📊</span> Projected
    </span>
  );
}

// ============================================================================
// ACTUAL DATA BADGE - Indicates real/actual data
// ============================================================================
export function ActualDataBadge({ isDarkMode = false }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      background: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5',
      color: isDarkMode ? '#34D399' : '#059669',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.3px'
    }}>
      <span>✓</span> Actual
    </span>
  );
}

// ============================================================================
// PREDEFINED TOOLTIP CONTENT - Financial education content
// ============================================================================
export const FINANCIAL_TOOLTIPS = {
  income: {
    title: 'Total Income',
    definition: 'The total amount of money you\'ve received, including paychecks, side hustle earnings, refunds, and any other deposits.',
    calculation: 'Sum of all positive transactions (deposits) from your bank data',
    dataSource: 'Your imported bank transactions',
    interpretation: 'This represents your total earning power. Compare it to your expenses to see if you\'re living within your means.',
    tips: [
      'Look for opportunities to increase income through side hustles',
      'Track all sources of income, not just your paycheck',
      'Consider negotiating a raise or finding higher-paying work'
    ]
  },
  
  expenses: {
    title: 'Total Expenses',
    definition: 'The total amount of money you\'ve spent, including bills, purchases, subscriptions, and any money leaving your account.',
    calculation: 'Sum of all negative transactions (withdrawals/purchases) from your bank data',
    dataSource: 'Your imported bank transactions',
    interpretation: 'If expenses exceed income, you\'re spending more than you earn. This will lead to debt over time.',
    tips: [
      'Review your spending by category to find areas to cut',
      'Cancel unused subscriptions',
      'Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings'
    ]
  },
  
  savings: {
    title: 'Net Savings',
    definition: 'The difference between your income and expenses. Positive means you saved money; negative means you overspent.',
    calculation: 'Income − Expenses = Net Savings',
    dataSource: 'Calculated from your bank transactions',
    interpretation: 'Aim for positive savings every month. Experts recommend saving at least 20% of your income.',
    tips: [
      'Pay yourself first - transfer to savings before spending',
      'Automate your savings with scheduled transfers',
      'Start small if needed, even $25/month builds the habit'
    ]
  },
  
  savingsRate: {
    title: 'Savings Rate',
    definition: 'The percentage of your income that you\'re saving rather than spending. This is one of the most important metrics for building wealth.',
    calculation: '(Income − Expenses) ÷ Income × 100 = Savings Rate %',
    dataSource: 'Calculated from your bank transactions',
    interpretation: '0-10%: Needs improvement | 10-20%: Good | 20%+: Excellent. A 20%+ rate can lead to financial independence.',
    tips: [
      'Increase savings rate by 1% each month until you reach 20%',
      'Treat savings like a bill that must be paid',
      'Every raise, save half of the increase'
    ]
  },
  
  budgetAdherence: {
    title: 'Budget Adherence',
    definition: 'How well you\'re sticking to your budget. 100% means you\'re exactly on budget; over 100% means overspending.',
    calculation: 'For each category: (Actual Spending ÷ Budget) × 100, then averaged across all categories',
    dataSource: 'Your budget settings vs. actual spending from transactions',
    interpretation: '100%: On budget | Under 100%: Under budget (great!) | Over 100%: Over budget (needs attention)',
    tips: [
      'Review overspent categories weekly',
      'Set realistic budgets based on past spending',
      'Build in a small "fun money" buffer to avoid feeling restricted'
    ]
  },
  
  emergencyFund: {
    title: 'Emergency Fund Coverage',
    definition: 'How many months of expenses you could cover if you lost your income. This is your financial safety net.',
    calculation: 'Emergency Fund Balance ÷ Average Monthly Expenses = Months Covered',
    dataSource: 'Your savings goals (emergency fund) and monthly expense average',
    interpretation: '0-1 months: Critical | 1-3 months: Building | 3-6 months: Solid | 6+ months: Excellent',
    tips: [
      'Start with a $1,000 starter emergency fund',
      'Build to 3 months of expenses, then work toward 6',
      'Keep emergency fund in a high-yield savings account'
    ]
  },
  
  debtToIncome: {
    title: 'Debt-to-Income Ratio',
    definition: 'The percentage of your income that goes toward paying debts like loans, credit cards, and mortgages.',
    calculation: 'Monthly Debt Payments ÷ Monthly Income × 100 = DTI %',
    dataSource: 'Detected from transactions containing loan, credit, or mortgage payments',
    interpretation: 'Under 20%: Healthy | 20-35%: Manageable | 35-50%: High | Over 50%: Critical',
    tips: [
      'Pay more than minimums on highest-interest debt first',
      'Consider debt consolidation for high-interest debts',
      'Avoid taking on new debt while paying off existing debt'
    ]
  },
  
  billsOnTime: {
    title: 'Bills Paid On Time',
    definition: 'The percentage of your bills that have been paid by their due date. Late payments can hurt your credit score.',
    calculation: 'Bills Paid On Time ÷ Total Bills × 100',
    dataSource: 'Your bills list with payment status',
    interpretation: '100%: Perfect! | 90-99%: Good | Under 90%: Needs attention (may affect credit score)',
    tips: [
      'Set up autopay for fixed bills',
      'Use calendar reminders for variable bills',
      'Pay bills as soon as you get paid'
    ]
  },
  
  goalProgress: {
    title: 'Goal Progress',
    definition: 'The average completion percentage across all your savings goals. Shows how close you are to achieving your financial dreams.',
    calculation: 'Average of (Current Amount ÷ Target Amount × 100) for each goal',
    dataSource: 'Your savings goals',
    interpretation: 'Every percent closer is progress! Focus on one goal at a time for faster results.',
    tips: [
      'Break big goals into smaller milestones',
      'Celebrate when you hit 25%, 50%, 75%',
      'Visualize what achieving the goal will feel like'
    ]
  },
  
  financialHealthScore: {
    title: 'Financial Health Score',
    definition: 'An overall score (0-100) that combines multiple aspects of your financial health into one easy-to-understand number.',
    calculation: `Score = 
  Savings Rate × 25% +
  Budget Adherence × 25% +
  Emergency Fund × 20% +
  Low Debt × 15% +
  Bills On Time × 10% +
  Goal Progress × 5%`,
    dataSource: 'Calculated from all your financial data',
    interpretation: '80-100: Excellent | 60-79: Good | 40-59: Fair | 0-39: Needs Work',
    tips: [
      'Focus on improving your weakest metric first',
      'Small improvements in each area add up quickly',
      'Check your score monthly to track progress'
    ]
  },
  
  netWorth: {
    title: 'Net Worth',
    definition: 'Your total wealth = what you OWN (assets) minus what you OWE (debts). This is the ultimate measure of financial progress.',
    calculation: 'Total Assets − Total Liabilities = Net Worth',
    dataSource: 'Your savings goals, retirement accounts, and detected debt payments',
    interpretation: 'Negative: You owe more than you own (common early in life) | Positive: You\'re building wealth!',
    tips: [
      'Track net worth monthly to see your progress',
      'Focus on increasing assets AND decreasing debts',
      'Net worth matters more than income for long-term wealth'
    ]
  },
  
  cashFlowForecast: {
    title: 'Cash Flow Forecast',
    definition: 'A projection of your future account balance based on your income patterns, spending habits, and upcoming bills.',
    calculation: 'Starting Balance + Expected Income − Expected Expenses − Upcoming Bills',
    dataSource: 'Your recurring transactions, bills schedule, and spending patterns',
    isProjection: true,
    interpretation: 'Green = positive cash flow | Red = may run low. Use this to plan ahead!',
    tips: [
      'Check for any dips below zero and plan accordingly',
      'Time big purchases for after paydays',
      'Build a buffer to avoid cash flow crunches'
    ]
  },
  
  recurringTransactions: {
    title: 'Recurring Transactions',
    definition: 'Subscriptions and regular bills that are automatically detected from your transaction history.',
    calculation: 'Transactions with the same merchant appearing 2+ times',
    dataSource: 'Pattern detection from your bank transactions',
    interpretation: 'Review these regularly - subscription creep can silently drain your budget!',
    tips: [
      'Audit subscriptions quarterly - cancel what you don\'t use',
      'Negotiate bills like internet and insurance annually',
      'Consider annual payments for discounts on subscriptions'
    ]
  },

  monthOverMonth: {
    title: 'Month-over-Month Change',
    definition: 'How this metric has changed compared to the previous month. Shows if you\'re trending in the right direction.',
    calculation: '((This Month − Last Month) ÷ Last Month) × 100 = % Change',
    dataSource: 'Comparing current month transactions to previous month',
    interpretation: 'Green arrow (↗): Improving | Red arrow (↘): Declining',
    tips: [
      'Look for patterns in your monthly changes',
      'Identify what caused big swings',
      'Set monthly improvement goals'
    ]
  },

  spendingByCategory: {
    title: 'Spending by Category',
    definition: 'Your expenses broken down by category, showing where your money is actually going.',
    calculation: 'Sum of all expenses in each category',
    dataSource: 'Categories from your bank transactions',
    interpretation: 'Compare to your budget. Red bars mean overspending in that category.',
    tips: [
      'Identify your top 3 spending categories',
      'Look for categories that surprise you',
      'Set specific reduction goals for problem areas'
    ]
  },

  totalAssets: {
    title: 'Total Assets',
    definition: 'Everything you OWN that has monetary value. This includes savings, retirement accounts, and recent positive cash flow.',
    calculation: `Savings Goals (current balances) +
Retirement Accounts (401k, IRA, etc.) +
Recent Positive Cash Flow`,
    dataSource: 'Your savings goals + imported retirement accounts + recent income',
    isProjection: true,
    interpretation: 'Higher is better! Assets are what build your wealth over time.',
    tips: [
      'Focus on growing assets through consistent saving',
      'Maximize retirement account contributions for tax benefits',
      'Consider diversifying across different asset types'
    ]
  },

  totalLiabilities: {
    title: 'Total Liabilities',
    definition: 'Everything you OWE to others. This includes loans, credit card balances, mortgages, and other debts.',
    calculation: `Detected loan payments × estimated years remaining +
Credit card spending × 30% (estimated carried balance)`,
    dataSource: 'Detected from transaction patterns (loans, credit, mortgage keywords)',
    isProjection: true,
    interpretation: 'Lower is better! Reducing liabilities increases your net worth.',
    tips: [
      'Pay off high-interest debt first',
      'Avoid carrying credit card balances',
      'Consider debt consolidation for multiple loans'
    ]
  },

  projectedBalance: {
    title: 'Projected Balance',
    definition: 'An estimate of what your account balance will be in the future, based on your spending patterns and upcoming bills.',
    calculation: `Current Balance +
(Daily Avg Income × Days) −
(Daily Avg Expenses × Days) −
Upcoming Bills`,
    dataSource: 'Historical transaction patterns + your bills schedule',
    isProjection: true,
    interpretation: 'Watch for dips below zero - that means potential overdrafts!',
    tips: [
      'Time big purchases for after paydays',
      'Keep a buffer for unexpected expenses',
      'Review upcoming bills to avoid surprises'
    ]
  },

  dailyAverages: {
    title: 'Daily Averages',
    definition: 'Your typical daily income and spending, calculated from your transaction history.',
    calculation: 'Total Income or Expenses ÷ Number of Days with Transactions',
    dataSource: 'Your imported bank transactions',
    interpretation: 'Use this to understand your daily "burn rate" and earning rate.',
    tips: [
      'Try to keep daily expenses below daily income',
      'Track daily spending to catch overspending early',
      'Small daily savings add up to big yearly savings'
    ]
  },

  monthOverMonthChange: {
    title: 'Month-over-Month Change',
    definition: 'How this metric has changed compared to the previous month. Shows if you\'re trending in the right direction.',
    calculation: '((This Month − Last Month) ÷ Last Month) × 100 = % Change',
    dataSource: 'Comparing current month transactions to previous month',
    interpretation: 'Green arrow (↗): Improving | Red arrow (↘): Declining. For expenses, lower is better!',
    tips: [
      'Look for patterns in your monthly changes',
      'Identify what caused big swings',
      'Set monthly improvement goals'
    ]
  },

  achievements: {
    title: 'Financial Achievements',
    definition: 'Badges you earn by hitting financial milestones. Gamification to keep you motivated!',
    calculation: 'Each achievement has specific criteria based on your actual financial data.',
    dataSource: 'Calculated from your transactions, goals, and budget adherence',
    interpretation: 'Unlock more achievements by improving your financial habits!',
    tips: [
      'Focus on one achievement at a time',
      'Achievements reflect real financial progress',
      'Share your wins to stay motivated'
    ]
  },

  streaks: {
    title: 'Financial Streaks',
    definition: 'Consecutive days or months you\'ve maintained good financial habits.',
    calculation: 'Counted from consecutive periods meeting the criteria (e.g., spending under budget)',
    dataSource: 'Your daily/monthly transaction history',
    interpretation: 'Longer streaks = better habits! Try not to break the chain.',
    tips: [
      'Start small - even a 7-day streak is progress',
      'If you break a streak, start again immediately',
      'Celebrate milestone streaks (30 days, 90 days, etc.)'
    ]
  },

  healthScoreFormula: {
    title: 'Health Score Calculation',
    definition: 'Your Financial Health Score is a weighted average of 6 key metrics, each measuring a different aspect of financial wellness.',
    calculation: `Savings Rate (25%): Are you saving enough?
Budget Adherence (25%): Are you sticking to budgets?
Emergency Fund (20%): Do you have a safety net?
Low Debt-to-Income (15%): Is debt manageable?
Bills On Time (10%): Are bills paid promptly?
Goal Progress (5%): Are you reaching goals?`,
    dataSource: 'All metrics calculated from your actual financial data',
    interpretation: '80-100: Excellent | 60-79: Good | 40-59: Fair | 0-39: Needs Work',
    tips: [
      'Improve your lowest-scoring metric first',
      'Even small improvements in each area add up',
      'Check monthly to track progress'
    ]
  },

  subscriptions: {
    title: 'Subscriptions',
    definition: 'Recurring charges for streaming, software, memberships, and other services that bill automatically.',
    calculation: 'Auto-detected from transaction descriptions matching known subscription services (Netflix, Spotify, etc.)',
    dataSource: 'Pattern matching on your bank transactions',
    interpretation: 'Review these regularly - "subscription creep" can silently drain your budget!',
    tips: [
      'Cancel subscriptions you haven\'t used in 30+ days',
      'Look for family/shared plans to split costs',
      'Consider annual plans for services you definitely keep'
    ]
  },

  fixedBills: {
    title: 'Fixed Bills',
    definition: 'Essential recurring expenses like utilities, rent, insurance, and loan payments.',
    calculation: 'Auto-detected from transaction descriptions matching bill-related keywords',
    dataSource: 'Pattern matching on your bank transactions',
    interpretation: 'These are typically non-negotiable, but some can be reduced.',
    tips: [
      'Shop around for insurance annually',
      'Negotiate internet/phone bills - ask for promotions',
      'Consider refinancing loans if rates have dropped'
    ]
  }
};

export default { 
  InfoTooltip, 
  MetricLabel, 
  ProjectionBadge, 
  ActualDataBadge, 
  FINANCIAL_TOOLTIPS 
};
