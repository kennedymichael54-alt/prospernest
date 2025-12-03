import React, { useState } from 'react';

// Currency formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Goal icons mapping
const goalIcons = {
  'Emergency Fund': '🛡️',
  'Vacation Fund': '✈️',
  'New Car': '🚗',
  'Home Down Payment': '🏠',
  'Education': '🎓',
  'Retirement': '🏖️',
  'Wedding': '💒',
  'Business': '💼',
  'default': '🎯'
};

// Milestone markers for the slider
const MilestoneMarkers = ({ progress, theme }) => {
  const milestones = [0, 25, 50, 75, 100];
  
  return (
    <div style={{ position: 'relative', height: '20px', marginTop: '8px' }}>
      {milestones.map((milestone) => (
        <div
          key={milestone}
          style={{
            position: 'absolute',
            left: `${milestone}%`,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: progress >= milestone ? '#3B82F6' : '#E5E7EB',
              border: progress >= milestone ? '2px solid #3B82F6' : '2px solid #D1D5DB',
              transition: 'all 0.3s ease'
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Progress Slider Component
const ProgressSlider = ({ value, max, onChange, theme }) => {
  const progress = (value / max) * 100;
  
  return (
    <div style={{ width: '100%', marginBottom: '8px' }}>
      {/* Track container */}
      <div style={{ position: 'relative', height: '12px', borderRadius: '6px', background: '#E5E7EB' }}>
        {/* Filled progress */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress}%`,
            borderRadius: '6px',
            background: 'linear-gradient(90deg, #22C55E 0%, #3B82F6 100%)',
            transition: 'width 0.3s ease'
          }}
        />
        {/* Slider input */}
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            position: 'absolute',
            top: '-4px',
            left: 0,
            width: '100%',
            height: '20px',
            WebkitAppearance: 'none',
            appearance: 'none',
            background: 'transparent',
            cursor: 'pointer',
            zIndex: 2
          }}
        />
        {/* Thumb position indicator */}
        <div
          style={{
            position: 'absolute',
            left: `${progress}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'white',
            border: '3px solid #3B82F6',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
            transition: 'left 0.3s ease'
          }}
        />
      </div>
      {/* Milestone markers */}
      <MilestoneMarkers progress={progress} theme={theme} />
    </div>
  );
};

// Single Goal Card Component
const GoalCard = ({ goal, onUpdate, theme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(goal.currentAmount);
  
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const icon = goalIcons[goal.name] || goalIcons.default;
  
  const handleSliderChange = (newValue) => {
    setEditAmount(newValue);
  };
  
  const handleSave = () => {
    onUpdate({ ...goal, currentAmount: editAmount });
    setIsEditing(false);
  };

  return (
    <div
      style={{
        background: theme.bgCard,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: theme.cardShadow,
        border: `1px solid ${theme.borderLight}`
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: `${goal.color || '#3B82F6'}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px'
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.textPrimary }}>
            {goal.name}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: theme.textMuted }}>
            {goal.description || 'Financial goal'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: goal.color || '#3B82F6' }}>
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </div>
          <div style={{ fontSize: '12px', color: theme.textMuted }}>
            {formatCurrency(remaining)} remaining
          </div>
        </div>
      </div>

      {/* Progress Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: theme.textSecondary }}>Progress</span>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#22C55E' }}>
          {Math.round(progress)}% complete
        </span>
      </div>

      {/* Slider Progress Bar */}
      {isEditing ? (
        <div>
          <ProgressSlider
            value={editAmount}
            max={goal.targetAmount}
            onChange={handleSliderChange}
            theme={theme}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '14px', color: theme.textSecondary }}>
              New amount: <strong style={{ color: theme.textPrimary }}>{formatCurrency(editAmount)}</strong>
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setIsEditing(false); setEditAmount(goal.currentAmount); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.border}`,
                  background: 'transparent',
                  color: theme.textSecondary,
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#3B82F6',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Static progress bar */}
          <div style={{ position: 'relative', height: '12px', borderRadius: '6px', background: '#E5E7EB', marginBottom: '8px' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${Math.min(progress, 100)}%`,
                borderRadius: '6px',
                background: 'linear-gradient(90deg, #22C55E 0%, #3B82F6 100%)',
                transition: 'width 0.5s ease'
              }}
            />
            {/* Milestone dots on the track */}
            {[25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                style={{
                  position: 'absolute',
                  left: `${milestone}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: progress >= milestone ? '#3B82F6' : 'white',
                  border: `2px solid ${progress >= milestone ? '#3B82F6' : '#D1D5DB'}`,
                  zIndex: 1
                }}
              />
            ))}
            {/* Current position indicator */}
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(progress, 100)}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'white',
                border: '3px solid #3B82F6',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                zIndex: 2
              }}
            />
          </div>
          <MilestoneMarkers progress={progress} theme={theme} />
        </div>
      )}

      {/* Footer with dates and edit button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <div style={{ fontSize: '12px', color: theme.textMuted }}>
          Started {goal.startDate || 'Recently'}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: isEditing ? theme.bgMain : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            color: isEditing ? theme.textSecondary : 'white',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isEditing ? 'none' : '0 2px 8px rgba(59, 130, 246, 0.3)'
          }}
        >
          {isEditing ? 'Cancel Edit' : '+ Update Progress'}
        </button>
        <div style={{ fontSize: '12px', color: theme.textMuted }}>
          Target {goal.targetDate || 'TBD'}
        </div>
      </div>

      {/* Slider styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3B82F6;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3B82F6;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

// Add Goal Modal
const AddGoalModal = ({ isOpen, onClose, onAdd, theme }) => {
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    targetAmount: 1000,
    currentAmount: 0,
    targetDate: '',
    color: '#3B82F6'
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      onAdd({
        ...newGoal,
        id: Date.now(),
        startDate: new Date().toLocaleDateString()
      });
      setNewGoal({
        name: '',
        description: '',
        targetAmount: 1000,
        currentAmount: 0,
        targetDate: '',
        color: '#3B82F6'
      });
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: theme.bgCard,
        borderRadius: '20px',
        padding: '32px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: '700', color: theme.textPrimary }}>
          Add New Goal
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
            Goal Name
          </label>
          <input
            type="text"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            placeholder="e.g., Emergency Fund"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: `1px solid ${theme.border}`,
              background: theme.inputBg,
              color: theme.textPrimary,
              fontSize: '15px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
            Description
          </label>
          <input
            type="text"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            placeholder="What's this goal for?"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: `1px solid ${theme.border}`,
              background: theme.inputBg,
              color: theme.textPrimary,
              fontSize: '15px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
              Target Amount
            </label>
            <input
              type="number"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseFloat(e.target.value) || 0 })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
              Starting Amount
            </label>
            <input
              type="number"
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal({ ...newGoal, currentAmount: parseFloat(e.target.value) || 0 })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: `1px solid ${theme.border}`,
                background: theme.inputBg,
                color: theme.textPrimary,
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
            Target Date
          </label>
          <input
            type="date"
            value={newGoal.targetDate}
            onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: `1px solid ${theme.border}`,
              background: theme.inputBg,
              color: theme.textPrimary,
              fontSize: '15px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              background: 'transparent',
              color: theme.textSecondary,
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Add New Goal
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Goals Timeline Component
// LastImportIndicator component for showing last import date
function LastImportIndicator({ lastImportDate }) {
  if (!lastImportDate) return null;
  
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px', 
      padding: '4px 10px', 
      background: '#10B98115', 
      borderRadius: '8px',
      marginLeft: '12px'
    }}>
      <div style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        background: '#10B981' 
      }} />
      <span style={{ 
        fontSize: '12px', 
        color: '#10B981', 
        fontWeight: '500' 
      }}>
        Last import: {new Date(lastImportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    </div>
  );
}

function GoalsTimelineWithCelebration({ goals = [], onUpdateGoals, theme, lastImportDate }) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Default sample goals if none provided
  const displayGoals = goals.length > 0 ? goals : [
    { 
      id: 1, 
      name: 'Emergency Fund', 
      description: '6 months of expenses',
      targetAmount: 15000, 
      currentAmount: 12500, 
      color: '#8B5CF6',
      startDate: '12/31/2023',
      targetDate: '12/30/2024'
    },
    { 
      id: 2, 
      name: 'Vacation Fund', 
      description: 'Dream vacation to Europe',
      targetAmount: 5000, 
      currentAmount: 2800, 
      color: '#3B82F6',
      startDate: '2/28/2024',
      targetDate: '7/31/2024'
    },
    { 
      id: 3, 
      name: 'New Car', 
      description: 'Down payment for new vehicle',
      targetAmount: 25000, 
      currentAmount: 8500, 
      color: '#EF4444',
      startDate: '6/31/2023',
      targetDate: '5/01/2025'
    }
  ];

  const handleUpdateGoal = (updatedGoal) => {
    const newGoals = displayGoals.map(g => 
      g.id === updatedGoal.id ? updatedGoal : g
    );
    if (onUpdateGoals) {
      onUpdateGoals(newGoals);
    }
  };

  const handleAddGoal = (newGoal) => {
    const newGoals = [...displayGoals, newGoal];
    if (onUpdateGoals) {
      onUpdateGoals(newGoals);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span style={{ fontSize: '24px' }}>🎯</span>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: theme.textPrimary }}>
            Financial Goals
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '36px' }}>
          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <LastImportIndicator lastImportDate={lastImportDate} />
        </div>
      </div>

      {/* Goals List */}
      <div>
        {displayGoals.map((goal) => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onUpdate={handleUpdateGoal}
            theme={theme} 
          />
        ))}
      </div>

      {/* Add New Goal Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '14px 32px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          + Add New Goal
        </button>
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddGoal}
        theme={theme}
      />
    </div>
  );
}

export default GoalsTimelineWithCelebration;
