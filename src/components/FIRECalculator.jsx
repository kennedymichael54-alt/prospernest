import React, { useState, useEffect } from 'react';
import { useNetWorth } from '../hooks/useNetWorth';
import { TrendingUp, DollarSign, Calendar, Target, Zap, Mountain, Award } from 'lucide-react';

export function FIRECalculator() {
  const { assets, liabilities } = useNetWorth();
  
  // Form inputs
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [currentAge, setCurrentAge] = useState(35);
  const [annualIncome, setAnnualIncome] = useState(80000);
  const [annualSavings, setAnnualSavings] = useState(20000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  // Calculate current net worth
  const totalAssets = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + (liability.balance || 0), 0);
  const currentNetWorth = totalAssets - totalLiabilities;

  // Calculate savings rate
  const savingsRate = annualIncome > 0 ? ((annualSavings / annualIncome) * 100).toFixed(1) : 0;

  // Calculate FIRE numbers for different scenarios
  const leanFIRENumber = annualExpenses * 0.7 * (100 / withdrawalRate); // 30% less expenses
  const regularFIRENumber = annualExpenses * (100 / withdrawalRate); // Standard 4% rule
  const fatFIRENumber = annualExpenses * 1.5 * (100 / withdrawalRate); // 50% more expenses

  // Calculate years to FIRE for each scenario
  const calculateYearsToFIRE = (fireNumber) => {
    if (annualSavings <= 0) return null;
    const realReturn = ((1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1) * 100;
    const monthlyReturn = realReturn / 100 / 12;
    const monthlySavings = annualSavings / 12;
    
    if (currentNetWorth >= fireNumber) return 0;
    
    let balance = currentNetWorth;
    let months = 0;
    const maxMonths = 600; // 50 years max
    
    while (balance < fireNumber && months < maxMonths) {
      balance = balance * (1 + monthlyReturn) + monthlySavings;
      months++;
    }
    
    return months >= maxMonths ? null : (months / 12).toFixed(1);
  };

  const yearsToLeanFIRE = calculateYearsToFIRE(leanFIRENumber);
  const yearsToRegularFIRE = calculateYearsToFIRE(regularFIRENumber);
  const yearsToFatFIRE = calculateYearsToFIRE(fatFIRENumber);

  // Calculate Coast FIRE (amount needed to coast to retirement at 65)
  const calculateCoastFIRE = () => {
    const yearsUntil65 = 65 - currentAge;
    if (yearsUntil65 <= 0) return regularFIRENumber;
    const realReturn = ((1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1);
    return regularFIRENumber / Math.pow(1 + realReturn, yearsUntil65);
  };

  const coastFIRENumber = calculateCoastFIRE();
  const hasReachedCoastFIRE = currentNetWorth >= coastFIRENumber;

  // Calculate Barista FIRE (part-time work to cover expenses)
  const baristaFIRENumber = regularFIRENumber * 0.5; // Need half, work covers the rest
  const yearsToBarista = calculateYearsToFIRE(baristaFIRENumber);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-pink-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">FIRE Calculator</h2>
        <p className="text-white/90">Financial Independence, Retire Early</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Your Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Annual Income</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Annual Savings</label>
                <input
                  type="number"
                  value={annualSavings}
                  onChange={(e) => setAnnualSavings(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="text-sm text-slate-400 mt-1">Savings Rate: {savingsRate}%</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Annual Expenses</label>
                <input
                  type="number"
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Expected Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Inflation Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Safe Withdrawal Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={withdrawalRate}
                  onChange={(e) => setWithdrawalRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Current Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Net Worth</span>
                <span className="text-lg font-semibold text-green-400">
                  ${currentNetWorth.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Savings Rate</span>
                <span className="text-lg font-semibold text-cyan-400">{savingsRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Monthly Savings</span>
                <span className="text-lg font-semibold text-purple-400">
                  ${(annualSavings / 12).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* FIRE Scenarios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lean FIRE */}
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-green-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-slate-200">Lean FIRE</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Target Amount</div>
                <div className="text-2xl font-bold text-green-400">
                  ${leanFIRENumber.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400 mt-2">Annual Budget</div>
                <div className="text-lg text-slate-300">
                  ${(annualExpenses * 0.7).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="pt-3 border-t border-slate-700 mt-3">
                  <div className="text-sm text-slate-400">Years to Lean FIRE</div>
                  <div className="text-3xl font-bold text-green-400 mt-1">
                    {yearsToLeanFIRE ? `${yearsToLeanFIRE} years` : 'N/A'}
                  </div>
                  {yearsToLeanFIRE && (
                    <div className="text-sm text-slate-400 mt-1">
                      Age {(currentAge + parseFloat(yearsToLeanFIRE)).toFixed(0)}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-2">Minimal lifestyle, 70% of current expenses</div>
              </div>
            </div>

            {/* Regular FIRE */}
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-cyan-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-slate-200">Regular FIRE</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Target Amount</div>
                <div className="text-2xl font-bold text-cyan-400">
                  ${regularFIRENumber.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400 mt-2">Annual Budget</div>
                <div className="text-lg text-slate-300">
                  ${annualExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="pt-3 border-t border-slate-700 mt-3">
                  <div className="text-sm text-slate-400">Years to FIRE</div>
                  <div className="text-3xl font-bold text-cyan-400 mt-1">
                    {yearsToRegularFIRE ? `${yearsToRegularFIRE} years` : 'N/A'}
                  </div>
                  {yearsToRegularFIRE && (
                    <div className="text-sm text-slate-400 mt-1">
                      Age {(currentAge + parseFloat(yearsToRegularFIRE)).toFixed(0)}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-2">Maintain current lifestyle, 4% rule</div>
              </div>
            </div>

            {/* Fat FIRE */}
            <div className="bg-slate-800 rounded-lg p-6 border-2 border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-slate-200">Fat FIRE</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Target Amount</div>
                <div className="text-2xl font-bold text-purple-400">
                  ${fatFIRENumber.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400 mt-2">Annual Budget</div>
                <div className="text-lg text-slate-300">
                  ${(annualExpenses * 1.5).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="pt-3 border-t border-slate-700 mt-3">
                  <div className="text-sm text-slate-400">Years to Fat FIRE</div>
                  <div className="text-3xl font-bold text-purple-400 mt-1">
                    {yearsToFatFIRE ? `${yearsToFatFIRE} years` : 'N/A'}
                  </div>
                  {yearsToFatFIRE && (
                    <div className="text-sm text-slate-400 mt-1">
                      Age {(currentAge + parseFloat(yearsToFatFIRE)).toFixed(0)}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-2">Luxury lifestyle, 150% of current expenses</div>
              </div>
            </div>
          </div>

          {/* Alternative FIRE Paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coast FIRE */}
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-200">Coast FIRE</h3>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-slate-400">
                  Amount needed to coast to retirement at 65 (no more savings needed)
                </div>
                <div className="text-3xl font-bold text-blue-400">
                  ${coastFIRENumber.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                {hasReachedCoastFIRE ? (
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">Congratulations! You've reached Coast FIRE!</span>
                  </div>
                ) : (
                  <div className="text-slate-400">
                    <div className="flex justify-between items-center">
                      <span>Current Progress</span>
                      <span className="font-semibold">
                        {((currentNetWorth / coastFIRENumber) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((currentNetWorth / coastFIRENumber) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-2">
                  Your money will grow to your FIRE number by age 65 without additional savings
                </div>
              </div>
            </div>

            {/* Barista FIRE */}
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-slate-200">Barista FIRE</h3>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-slate-400">
                  Semi-retire with part-time work covering half your expenses
                </div>
                <div className="text-3xl font-bold text-orange-400">
                  ${baristaFIRENumber.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400">Years to Barista FIRE</div>
                <div className="text-2xl font-bold text-orange-400">
                  {yearsToBarista ? `${yearsToBarista} years` : 'N/A'}
                </div>
                {yearsToBarista && (
                  <div className="text-sm text-slate-400">
                    Age {(currentAge + parseFloat(yearsToBarista)).toFixed(0)}
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-2">
                  Work part-time to cover ${(annualExpenses / 2).toLocaleString('en-US', { minimumFractionDigits: 0 })}/year
                </div>
              </div>
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Path to FIRE Progress</h3>
            <div className="space-y-4">
              {[
                { name: 'Lean FIRE', target: leanFIRENumber, color: 'green' },
                { name: 'Regular FIRE', target: regularFIRENumber, color: 'cyan' },
                { name: 'Fat FIRE', target: fatFIRENumber, color: 'purple' }
              ].map((scenario) => {
                const progress = (currentNetWorth / scenario.target) * 100;
                return (
                  <div key={scenario.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 font-medium">{scenario.name}</span>
                      <span className="text-slate-400">
                        {progress.toFixed(1)}% • ${(scenario.target - currentNetWorth).toLocaleString('en-US', { minimumFractionDigits: 0 })} remaining
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className={`bg-${scenario.color}-400 h-3 rounded-full transition-all`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">💡 Key Insights</h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-2">
                <div className="text-cyan-400 mt-1">•</div>
                <div>
                  Your current savings rate of <span className="font-semibold text-cyan-400">{savingsRate}%</span> means 
                  you save ${(annualSavings / 12).toLocaleString('en-US', { minimumFractionDigits: 0 })} per month.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-green-400 mt-1">•</div>
                <div>
                  At your current pace, your portfolio will generate <span className="font-semibold text-green-400">
                  ${(currentNetWorth * (withdrawalRate / 100)).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span> annually 
                  using the {withdrawalRate}% safe withdrawal rate.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-orange-400 mt-1">•</div>
                <div>
                  Increasing your savings rate by 10% would reduce your time to FIRE by approximately{' '}
                  <span className="font-semibold text-orange-400">
                    {yearsToRegularFIRE ? (parseFloat(yearsToRegularFIRE) * 0.2).toFixed(1) : 'N/A'}
                  </span> years.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-purple-400 mt-1">•</div>
                <div>
                  Every $10,000 in additional savings brings you approximately{' '}
                  <span className="font-semibold text-purple-400">
                    {(10000 / annualExpenses * 12).toFixed(1)} months
                  </span> closer to financial independence.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
