import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Target, TrendingUp, Calendar, DollarSign, CheckCircle, Edit2, Trash2, Save, X, Award } from 'lucide-react';

export function GoalsTracker() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [form, setForm] = useState({
    title: '',
    target_amount: '',
    current_amount: '',
    category: 'savings',
    target_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const goalData = {
        ...form,
        target_amount: parseFloat(form.target_amount),
        current_amount: parseFloat(form.current_amount || 0),
        target_date: form.target_date || null,
        user_id: user.id
      };

      if (editingGoal) {
        const { error } = await supabase
          .from('goals')
          .update(goalData)
          .eq('id', editingGoal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('goals')
          .insert([goalData]);
        if (error) throw error;
      }

      await fetchGoals();
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleUpdateProgress = async (goalId, newAmount) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ current_amount: newAmount })
        .eq('id', goalId);

      if (error) throw error;
      await fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const startEdit = (goal) => {
    setEditingGoal(goal);
    setForm({
      title: goal.title,
      target_amount: goal.target_amount.toString(),
      current_amount: goal.current_amount.toString(),
      category: goal.category,
      target_date: goal.target_date || '',
      notes: goal.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      target_amount: '',
      current_amount: '',
      category: 'savings',
      target_date: '',
      notes: ''
    });
    setEditingGoal(null);
    setShowModal(false);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'emergency_fund':
        return <Award className="w-5 h-5 text-red-400" />;
      case 'debt_payoff':
        return <TrendingUp className="w-5 h-5 text-orange-400" />;
      case 'savings':
        return <DollarSign className="w-5 h-5 text-green-400" />;
      case 'investment':
        return <Target className="w-5 h-5 text-purple-400" />;
      case 'retirement':
        return <Calendar className="w-5 h-5 text-cyan-400" />;
      case 'fire':
        return <CheckCircle className="w-5 h-5 text-pink-400" />;
      default:
        return <Target className="w-5 h-5 text-slate-400" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'emergency_fund':
        return 'red';
      case 'debt_payoff':
        return 'orange';
      case 'savings':
        return 'green';
      case 'investment':
        return 'purple';
      case 'retirement':
        return 'cyan';
      case 'fire':
        return 'pink';
      default:
        return 'slate';
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateTimeRemaining = (targetDate) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  // Calculate overall statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.current_amount >= g.target_amount).length;
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.current_amount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Financial Goals</h2>
            <p className="text-white/90">Track your progress toward financial milestones</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-400" />
            <div className="text-sm text-slate-400">Total Goals</div>
          </div>
          <div className="text-3xl font-bold text-slate-200">{totalGoals}</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="text-sm text-slate-400">Completed</div>
          </div>
          <div className="text-3xl font-bold text-green-400">{completedGoals}</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            <div className="text-sm text-slate-400">Total Target</div>
          </div>
          <div className="text-2xl font-bold text-slate-200">
            ${totalTargetAmount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <div className="text-sm text-slate-400">Overall Progress</div>
          </div>
          <div className="text-3xl font-bold text-orange-400">{overallProgress.toFixed(1)}%</div>
        </div>
      </div>

      {/* Goals List */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            const isCompleted = progress >= 100;
            const timeRemaining = calculateTimeRemaining(goal.target_date);
            const color = getCategoryColor(goal.category);

            return (
              <div key={goal.id} className={`bg-slate-800 rounded-lg p-6 border-2 ${isCompleted ? 'border-green-500/50' : 'border-slate-700'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getCategoryIcon(goal.category)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-200 mb-1">{goal.title}</h3>
                      <div className="text-sm text-slate-400 capitalize">{goal.category.replace('_', ' ')}</div>
                      {goal.target_date && (
                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {timeRemaining}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(goal)}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Progress</span>
                    <span className="text-lg font-semibold text-slate-200">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className={`bg-${color}-400 h-3 rounded-full transition-all relative`}
                      style={{ width: `${progress}%` }}
                    >
                      {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">
                      ${goal.current_amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-slate-400">
                      ${goal.target_amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    ${(goal.target_amount - goal.current_amount).toLocaleString('en-US', { minimumFractionDigits: 0 })} remaining
                  </div>
                </div>

                {/* Quick Update Progress */}
                {!isCompleted && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-400 mb-2">Quick Update</div>
                    <div className="flex gap-2">
                      {[100, 500, 1000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleUpdateProgress(goal.id, goal.current_amount + amount)}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          +${amount}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {goal.notes && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-400">{goal.notes}</div>
                  </div>
                )}

                {/* Completed Badge */}
                {isCompleted && (
                  <div className="mt-4 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 justify-center">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">Goal Achieved!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg p-12 text-center">
          <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No Goals Yet</h3>
          <p className="text-slate-400 mb-6">Start tracking your financial goals to stay motivated and accountable.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-200">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h3>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Goal Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="emergency_fund">Emergency Fund</option>
                  <option value="debt_payoff">Debt Payoff</option>
                  <option value="savings">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="retirement">Retirement</option>
                  <option value="fire">FIRE Number</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Target Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.target_amount}
                    onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Current Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.current_amount}
                    onChange={(e) => setForm({ ...form, current_amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Target Date (Optional)</label>
                <input
                  type="date"
                  value={form.target_date}
                  onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes (Optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Why is this goal important to you?"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
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
