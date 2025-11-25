import React, { useState } from 'react';
import { useNetWorth } from '../hooks/useNetWorth';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Plus, TrendingUp, TrendingDown, DollarSign, Edit2, Trash2, Save, X } from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function NetWorthDashboard() {
  const { 
    assets, 
    liabilities, 
    snapshots, 
    loading, 
    addAsset, 
    updateAsset, 
    deleteAsset,
    addLiability,
    updateLiability,
    deleteLiability,
    createSnapshot
  } = useNetWorth();

  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showLiabilityModal, setShowLiabilityModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [editingLiability, setEditingLiability] = useState(null);

  // Form states
  const [assetForm, setAssetForm] = useState({
    name: '',
    type: 'cash',
    value: '',
    account_number: '',
    notes: ''
  });

  const [liabilityForm, setLiabilityForm] = useState({
    name: '',
    type: 'credit_card',
    balance: '',
    interest_rate: '',
    monthly_payment: '',
    account_number: '',
    notes: ''
  });

  // Calculate totals
  const totalAssets = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + (liability.balance || 0), 0);
  const netWorth = totalAssets - totalLiabilities;
  const previousNetWorth = snapshots[1]?.net_worth || netWorth;
  const netWorthChange = netWorth - previousNetWorth;
  const netWorthChangePercent = previousNetWorth !== 0 ? ((netWorthChange / previousNetWorth) * 100).toFixed(1) : 0;

  // Asset allocation data for pie chart
  const assetAllocation = assets.reduce((acc, asset) => {
    const existing = acc.find(item => item.name === asset.type);
    if (existing) {
      existing.value += asset.value;
    } else {
      acc.push({ name: asset.type, value: asset.value });
    }
    return acc;
  }, []);

  // Snapshot history for line chart
  const snapshotData = [...snapshots].reverse().map(snapshot => ({
    date: new Date(snapshot.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    netWorth: snapshot.net_worth,
    assets: snapshot.total_assets,
    liabilities: snapshot.total_liabilities
  }));

  const handleAddAsset = async (e) => {
    e.preventDefault();
    await addAsset({
      ...assetForm,
      value: parseFloat(assetForm.value)
    });
    setAssetForm({ name: '', type: 'cash', value: '', account_number: '', notes: '' });
    setShowAssetModal(false);
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    await updateAsset(editingAsset.id, {
      ...assetForm,
      value: parseFloat(assetForm.value)
    });
    setEditingAsset(null);
    setAssetForm({ name: '', type: 'cash', value: '', account_number: '', notes: '' });
  };

  const handleAddLiability = async (e) => {
    e.preventDefault();
    await addLiability({
      ...liabilityForm,
      balance: parseFloat(liabilityForm.balance),
      interest_rate: liabilityForm.interest_rate ? parseFloat(liabilityForm.interest_rate) : null,
      monthly_payment: liabilityForm.monthly_payment ? parseFloat(liabilityForm.monthly_payment) : null
    });
    setLiabilityForm({ name: '', type: 'credit_card', balance: '', interest_rate: '', monthly_payment: '', account_number: '', notes: '' });
    setShowLiabilityModal(false);
  };

  const handleUpdateLiability = async (e) => {
    e.preventDefault();
    await updateLiability(editingLiability.id, {
      ...liabilityForm,
      balance: parseFloat(liabilityForm.balance),
      interest_rate: liabilityForm.interest_rate ? parseFloat(liabilityForm.interest_rate) : null,
      monthly_payment: liabilityForm.monthly_payment ? parseFloat(liabilityForm.monthly_payment) : null
    });
    setEditingLiability(null);
    setLiabilityForm({ name: '', type: 'credit_card', balance: '', interest_rate: '', monthly_payment: '', account_number: '', notes: '' });
  };

  const startEditAsset = (asset) => {
    setEditingAsset(asset);
    setAssetForm({
      name: asset.name,
      type: asset.type,
      value: asset.value.toString(),
      account_number: asset.account_number || '',
      notes: asset.notes || ''
    });
  };

  const startEditLiability = (liability) => {
    setEditingLiability(liability);
    setLiabilityForm({
      name: liability.name,
      type: liability.type,
      balance: liability.balance.toString(),
      interest_rate: liability.interest_rate?.toString() || '',
      monthly_payment: liability.monthly_payment?.toString() || '',
      account_number: liability.account_number || '',
      notes: liability.notes || ''
    });
  };

  const handleTakeSnapshot = async () => {
    await createSnapshot();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading net worth data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Net Worth Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-2">Total Net Worth</h2>
            <div className="text-4xl font-bold mb-2">
              ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2">
              {netWorthChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-300" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-300" />
              )}
              <span className={netWorthChange >= 0 ? 'text-green-300' : 'text-red-300'}>
                ${Math.abs(netWorthChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                ({netWorthChangePercent}%)
              </span>
              <span className="text-white/80 text-sm">from last snapshot</span>
            </div>
          </div>
          <button
            onClick={handleTakeSnapshot}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Take Snapshot
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-white/80 text-sm mb-1">Total Assets</div>
            <div className="text-2xl font-semibold">
              ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-white/80 text-sm mb-1">Total Liabilities</div>
            <div className="text-2xl font-semibold">
              ${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Pie Chart */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Asset Allocation</h3>
          {assetAllocation.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              No assets yet. Add your first asset to see allocation.
            </div>
          )}
        </div>

        {/* Net Worth Trend Line Chart */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Net Worth Trend</h3>
          {snapshotData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={snapshotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="netWorth" stroke="#8b5cf6" strokeWidth={2} name="Net Worth" />
                <Line type="monotone" dataKey="assets" stroke="#10b981" strokeWidth={2} name="Assets" />
                <Line type="monotone" dataKey="liabilities" stroke="#ef4444" strokeWidth={2} name="Liabilities" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              No snapshots yet. Take your first snapshot to see trends.
            </div>
          )}
        </div>
      </div>

      {/* Assets and Liabilities Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Table */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Assets</h3>
            <button
              onClick={() => setShowAssetModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </button>
          </div>
          <div className="space-y-2">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <div key={asset.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="font-medium text-slate-200">{asset.name}</span>
                      </div>
                      <div className="text-sm text-slate-400 mt-1 capitalize">{asset.type.replace('_', ' ')}</div>
                      {asset.account_number && (
                        <div className="text-xs text-slate-500 mt-1">Account: {asset.account_number}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-400">
                        ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => startEditAsset(asset)}
                          className="text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {asset.notes && (
                    <div className="text-sm text-slate-400 mt-2 border-t border-slate-600 pt-2">
                      {asset.notes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                No assets yet. Add your first asset to start tracking your net worth.
              </div>
            )}
          </div>
        </div>

        {/* Liabilities Table */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Liabilities</h3>
            <button
              onClick={() => setShowLiabilityModal(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Liability
            </button>
          </div>
          <div className="space-y-2">
            {liabilities.length > 0 ? (
              liabilities.map((liability) => (
                <div key={liability.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-red-400" />
                        <span className="font-medium text-slate-200">{liability.name}</span>
                      </div>
                      <div className="text-sm text-slate-400 mt-1 capitalize">{liability.type.replace('_', ' ')}</div>
                      {liability.interest_rate && (
                        <div className="text-xs text-slate-500 mt-1">APR: {liability.interest_rate}%</div>
                      )}
                      {liability.monthly_payment && (
                        <div className="text-xs text-slate-500">Monthly: ${liability.monthly_payment.toLocaleString()}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-red-400">
                        ${liability.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => startEditLiability(liability)}
                          className="text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLiability(liability.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {liability.notes && (
                    <div className="text-sm text-slate-400 mt-2 border-t border-slate-600 pt-2">
                      {liability.notes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                No liabilities yet. Add any debts or loans you want to track.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Asset Modal */}
      {(showAssetModal || editingAsset) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-200">
                {editingAsset ? 'Edit Asset' : 'Add Asset'}
              </h3>
              <button
                onClick={() => {
                  setShowAssetModal(false);
                  setEditingAsset(null);
                  setAssetForm({ name: '', type: 'cash', value: '', account_number: '', notes: '' });
                }}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={editingAsset ? handleUpdateAsset : handleAddAsset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Chase Savings"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                <select
                  value={assetForm.type}
                  onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cash">Cash/Savings</option>
                  <option value="investment">Investment</option>
                  <option value="retirement">Retirement (401k/IRA)</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={assetForm.value}
                  onChange={(e) => setAssetForm({ ...assetForm, value: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Account Number (Optional)</label>
                <input
                  type="text"
                  value={assetForm.account_number}
                  onChange={(e) => setAssetForm({ ...assetForm, account_number: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Last 4 digits"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes (Optional)</label>
                <textarea
                  value={assetForm.notes}
                  onChange={(e) => setAssetForm({ ...assetForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="2"
                  placeholder="Additional details..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingAsset ? 'Update' : 'Add'} Asset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssetModal(false);
                    setEditingAsset(null);
                    setAssetForm({ name: '', type: 'cash', value: '', account_number: '', notes: '' });
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Liability Modal */}
      {(showLiabilityModal || editingLiability) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-200">
                {editingLiability ? 'Edit Liability' : 'Add Liability'}
              </h3>
              <button
                onClick={() => {
                  setShowLiabilityModal(false);
                  setEditingLiability(null);
                  setLiabilityForm({ name: '', type: 'credit_card', balance: '', interest_rate: '', monthly_payment: '', account_number: '', notes: '' });
                }}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={editingLiability ? handleUpdateLiability : handleAddLiability} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={liabilityForm.name}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Chase Credit Card"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                <select
                  value={liabilityForm.type}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="mortgage">Mortgage</option>
                  <option value="auto_loan">Auto Loan</option>
                  <option value="student_loan">Student Loan</option>
                  <option value="personal_loan">Personal Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={liabilityForm.balance}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, balance: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Interest Rate (%) (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={liabilityForm.interest_rate}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, interest_rate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 18.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Monthly Payment (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={liabilityForm.monthly_payment}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, monthly_payment: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Account Number (Optional)</label>
                <input
                  type="text"
                  value={liabilityForm.account_number}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, account_number: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Last 4 digits"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes (Optional)</label>
                <textarea
                  value={liabilityForm.notes}
                  onChange={(e) => setLiabilityForm({ ...liabilityForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="2"
                  placeholder="Additional details..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingLiability ? 'Update' : 'Add'} Liability
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLiabilityModal(false);
                    setEditingLiability(null);
                    setLiabilityForm({ name: '', type: 'credit_card', balance: '', interest_rate: '', monthly_payment: '', account_number: '', notes: '' });
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
