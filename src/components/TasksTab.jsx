import React, { useState } from 'react';
import { CollapsibleSection } from './CollapsibleComponents';

function TasksTab({ tasks = [], onUpdateTasks, theme, lastImportDate }) {
  const isDark = theme?.mode === 'dark';
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium', category: 'Personal' });
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    statsOverview: false,
    progressBar: false,
    taskList: false
  });
  
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const filteredTasks = filter === 'all' ? tasks : 
    filter === 'todo' ? todoTasks :
    filter === 'in-progress' ? inProgressTasks : completedTasks;

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task = {
      id: Date.now(),
      ...newTask,
      status: 'todo',
      createdAt: new Date().toISOString()
    };
    onUpdateTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', category: 'Personal' });
    setShowAddModal(false);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    onUpdateTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (taskId) => {
    onUpdateTasks(tasks.filter(t => t.id !== taskId));
  };

  const priorityColors = {
    high: { bg: '#FEE2E2', color: '#DC2626', label: 'High' },
    medium: { bg: '#FEF3C7', color: '#D97706', label: 'Medium' },
    low: { bg: '#D1FAE5', color: '#059669', label: 'Low' }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px', letterSpacing: '-0.5px' }}>Tasks</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            {lastImportDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#10B98115', borderRadius: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>
                  Last import: {new Date(lastImportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: `0 4px 12px ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(79, 70, 229, 0.3)'}`
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Add Task
        </button>
      </div>

      {/* Stats Overview - Collapsible */}
      <CollapsibleSection
        title="Performance Overview"
        icon="📊"
        badge={`${tasks.length} total tasks`}
        isDarkMode={isDark}
        defaultExpanded={true}
        gradientColors={['#06B6D4', '#8B5CF6']}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {/* Total Tasks Card - Cyan */}
          <div style={{
            background: isDark ? 'linear-gradient(135deg, #164E63 0%, #0E4A5C 100%)' : 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0, 188, 212, 0.15)',
            border: `1px solid ${isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                background: isDark ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
              }}>📋</div>
              <span style={{ fontSize: '14px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Total Tasks</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064' }}>{tasks.length}</div>
          </div>

          {/* To Do Card - Orange */}
          <div style={{
            background: isDark ? 'linear-gradient(135deg, #7C2D12 0%, #6B2A0F 100%)' : 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
            border: `1px solid ${isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                background: isDark ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
              }}>📝</div>
              <span style={{ fontSize: '14px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '600' }}>To Do</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C' }}>{todoTasks.length}</div>
          </div>

          {/* In Progress Card - Purple */}
          <div style={{
            background: isDark ? 'linear-gradient(135deg, #4A1D6B 0%, #3D1A5A 100%)' : 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
            border: `1px solid ${isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                background: isDark ? 'rgba(156, 39, 176, 0.3)' : 'rgba(156, 39, 176, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
              }}>🔄</div>
              <span style={{ fontSize: '14px', color: isDark ? '#D8B4FE' : '#7B1FA2', fontWeight: '600' }}>In Progress</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#F3E5F5' : '#4A148C' }}>{inProgressTasks.length}</div>
          </div>

          {/* Completed Card - Green */}
          <div style={{
            background: isDark ? 'linear-gradient(135deg, #14532D 0%, #115E2B 100%)' : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)',
            border: `1px solid ${isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                background: isDark ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' 
              }}>✅</div>
              <span style={{ fontSize: '14px', color: isDark ? '#86EFAC' : '#2E7D32', fontWeight: '600' }}>Completed</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E8F5E9' : '#1B5E20' }}>{completedTasks.length}</div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Progress Bar Card - Collapsible */}
      <CollapsibleSection
        title="Completion Progress"
        icon="📈"
        badge={`${completionRate}% complete`}
        isDarkMode={isDark}
        defaultExpanded={true}
        gradientColors={['#10B981', '#06B6D4']}
      >
        <div style={{
          background: theme.bgCard,
          borderRadius: '20px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${theme.borderLight}`
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #10B981, #06B6D4)'
          }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>Overall Progress</div>
              <div style={{ fontSize: '13px', color: theme.textMuted, marginTop: '4px' }}>
                {completedTasks.length} of {tasks.length} tasks completed
              </div>
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: completionRate >= 75 ? '#10B981' : completionRate >= 50 ? '#F59E0B' : theme.textPrimary 
            }}>
              {completionRate}%
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '12px',
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${completionRate}%`,
              height: '100%',
              background: completionRate >= 75 
                ? 'linear-gradient(90deg, #10B981, #34D399)' 
                : completionRate >= 50 
                  ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' 
                  : 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
              borderRadius: '6px',
              transition: 'width 0.5s ease'
            }} />
          </div>
          
          {/* Progress Breakdown */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '16px', 
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: `1px solid ${theme.borderLight}`
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#F59E0B', 
                display: 'inline-block', 
                marginRight: '6px',
                verticalAlign: 'middle'
              }} />
              <span style={{ fontSize: '13px', color: theme.textMuted }}>To Do</span>
              <div style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginTop: '4px' }}>
                {todoTasks.length}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#8B5CF6', 
                display: 'inline-block', 
                marginRight: '6px',
                verticalAlign: 'middle'
              }} />
              <span style={{ fontSize: '13px', color: theme.textMuted }}>In Progress</span>
              <div style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginTop: '4px' }}>
                {inProgressTasks.length}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#10B981', 
                display: 'inline-block', 
                marginRight: '6px',
                verticalAlign: 'middle'
              }} />
              <span style={{ fontSize: '13px', color: theme.textMuted }}>Completed</span>
              <div style={{ fontSize: '18px', fontWeight: '700', color: theme.textPrimary, marginTop: '4px' }}>
                {completedTasks.length}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '20px',
        padding: '6px',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        borderRadius: '14px',
        width: 'fit-content'
      }}>
        {[
          { id: 'all', label: 'All', count: tasks.length },
          { id: 'todo', label: 'To Do', count: todoTasks.length },
          { id: 'in-progress', label: 'In Progress', count: inProgressTasks.length },
          { id: 'completed', label: 'Completed', count: completedTasks.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: filter === tab.id 
                ? (isDark ? 'rgba(139, 92, 246, 0.3)' : 'white')
                : 'transparent',
              color: filter === tab.id ? theme.primary : theme.textMuted,
              fontSize: '14px',
              fontWeight: filter === tab.id ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: filter === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
            <span style={{
              padding: '2px 8px',
              borderRadius: '10px',
              background: filter === tab.id 
                ? (isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(79, 70, 229, 0.1)')
                : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'),
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List - Collapsible */}
      <CollapsibleSection
        title="Task List"
        icon="📋"
        badge={`${filteredTasks.length} ${filter === 'all' ? '' : filter.replace('-', ' ')} tasks`}
        isDarkMode={isDark}
        defaultExpanded={true}
        gradientColors={['#8B5CF6', '#EC4899']}
      >
        {filteredTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTasks.map(task => (
              <div 
                key={task.id}
                style={{
                  background: theme.bgCard,
                  borderRadius: '16px',
                  padding: '20px',
                  border: `1px solid ${theme.borderLight}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Priority indicator bar */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#10B981'
                }} />
                
                <div style={{ flex: 1, paddingLeft: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: theme.textPrimary, 
                      margin: 0,
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      opacity: task.status === 'completed' ? 0.7 : 1
                    }}>
                      {task.title}
                    </h3>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: priorityColors[task.priority].bg,
                      color: priorityColors[task.priority].color,
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {priorityColors[task.priority].label}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p style={{ 
                      fontSize: '14px', 
                      color: theme.textMuted, 
                      margin: '0 0 12px 0',
                      lineHeight: '1.5'
                    }}>
                      {task.description}
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {task.dueDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px' }}>📅</span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: new Date(task.dueDate) < new Date() && task.status !== 'completed' 
                            ? '#EF4444' 
                            : theme.textSecondary 
                        }}>
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>🏷️</span>
                      <span style={{ fontSize: '13px', color: theme.textSecondary }}>{task.category}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${theme.borderLight}`,
                      background: theme.bgCard,
                      color: theme.textPrimary,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#FEE2E2',
                      color: '#DC2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, marginBottom: '8px' }}>
              {filter === 'all' ? 'No tasks yet' : `No ${filter.replace('-', ' ')} tasks`}
            </h3>
            <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '20px' }}>
              {filter === 'all' ? 'Create your first task to get started!' : 'Tasks with this status will appear here'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: '12px 24px',
                  background: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Create Task
              </button>
            )}
          </div>
        )}
      </CollapsibleSection>

      {/* Add Task Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: theme.bgCard, borderRadius: '20px', padding: '32px', width: '480px', maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.textPrimary }}>Add New Task</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.textMuted }}>×</button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Task Name *</label>
              <input 
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task name"
                style={{ width: '100%', padding: '12px', background: theme.inputBg || theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Description</label>
              <textarea 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Add description (optional)"
                rows={3}
                style={{ width: '100%', padding: '12px', background: theme.inputBg || theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Due Date</label>
                <input 
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: theme.inputBg || theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Priority</label>
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: theme.inputBg || theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: theme.textSecondary, marginBottom: '6px' }}>Category</label>
              <select 
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                style={{ width: '100%', padding: '12px', background: theme.inputBg || theme.bgMain, border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.textPrimary, fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Finance">Finance</option>
                <option value="Home">Home</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `1px solid ${theme.border}`, background: 'transparent', color: theme.textSecondary, fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksTab;
