import React, { useState, useEffect } from 'react';

// Default themes
const defaultLightTheme = {
  mode: 'light',
  primary: '#4F46E5',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bgMain: '#F5F6FA',
  bgCard: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  cardShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const defaultDarkTheme = {
  mode: 'dark',
  primary: '#8B5CF6',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bgMain: '#0c0a1d',
  bgCard: '#1e1b38',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  border: 'rgba(139, 92, 246, 0.2)',
  borderLight: 'rgba(255,255,255,0.1)',
  cardShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export default function BillsCalendarView({ theme: propTheme, lastImportDate }) {
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [bills, setBills] = useState([]);
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    billsList: false,
    calendar: false
  });
  
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div>
      {/* Header - matching Dashboard style */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px', letterSpacing: '-0.5px' }}>Bills</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
              Track and manage your recurring bills
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
        <button style={{
          padding: '10px 20px',
          background: theme.primary,
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: `0 4px 12px ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(79, 70, 229, 0.3)'}`
        }}>
          + Add Bill
        </button>
      </div>

      {/* Stat Cards with Gradients - 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Upcoming Card - Cyan */}
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
            }}>📅</div>
            <span style={{ fontSize: '14px', color: isDark ? '#67E8F9' : '#00838F', fontWeight: '600' }}>Upcoming</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E0F7FA' : '#006064' }}>0</div>
        </div>

        {/* Overdue Card - Orange */}
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
            }}>⚠️</div>
            <span style={{ fontSize: '14px', color: isDark ? '#FDBA74' : '#E65100', fontWeight: '600' }}>Overdue</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#FFF3E0' : '#BF360C' }}>0</div>
        </div>

        {/* Paid Card - Green */}
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
            <span style={{ fontSize: '14px', color: isDark ? '#86EFAC' : '#2E7D32', fontWeight: '600' }}>Paid</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#E8F5E9' : '#1B5E20' }}>0</div>
        </div>

        {/* Total Due Card - Purple */}
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
            }}>💰</div>
            <span style={{ fontSize: '14px', color: isDark ? '#D8B4FE' : '#7B1FA2', fontWeight: '600' }}>Total Due</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: isDark ? '#F3E5F5' : '#4A148C' }}>$0.00</div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BILLS LIST (Collapsible Section) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div 
        onClick={() => toggleSection('billsList')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: collapsedSections.billsList ? '24px' : '16px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          width: '4px', 
          height: '24px', 
          background: 'linear-gradient(180deg, #EC4899 0%, #8B5CF6 100%)', 
          borderRadius: '2px' 
        }} />
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.textPrimary, 
          margin: 0,
          letterSpacing: '-0.3px'
        }}>Bills Overview</h2>
        <span style={{ 
          fontSize: '12px', 
          color: theme.textMuted,
          background: theme.bgMain,
          padding: '4px 10px',
          borderRadius: '6px'
        }}>Manage your bills</span>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '12px', 
          color: theme.textMuted,
          transition: 'transform 0.2s',
          transform: collapsedSections.billsList ? 'rotate(-90deg)' : 'rotate(0deg)'
        }}>▼</span>
      </div>

      {/* Main Content - Bills List + Calendar */}
      {!collapsedSections.billsList && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Bills List */}
        <div>
          {/* Personal Bills */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Gradient top accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🏠</span>
                <span style={{ fontWeight: '600', color: theme.textPrimary, fontSize: '15px' }}>Personal Bills</span>
              </div>
              <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>0 bills</span>
            </div>

            {/* Status Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: isDark ? 'rgba(79, 70, 229, 0.2)' : '#EEF2FF', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.primary }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Upcoming</div>
              </div>
              <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.warning }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Overdue</div>
              </div>
              <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.success }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Paid</div>
              </div>
            </div>

            {/* Total Due */}
            <div style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💰 Total Due</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>$0.00</div>
            </div>

            <div style={{ textAlign: 'center', padding: '20px', color: theme.textMuted }}>
              No bills added yet
            </div>
          </div>

          {/* Real Estate Agent Bills */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Gradient top accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🏢💼</span>
                <span style={{ fontWeight: '600', color: theme.textPrimary, fontSize: '15px' }}>Real Estate Agent Bills</span>
              </div>
              <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.bgMain, padding: '4px 10px', borderRadius: '6px' }}>0 bills</span>
            </div>

            {/* Status Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: isDark ? 'rgba(79, 70, 229, 0.2)' : '#EEF2FF', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.primary }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Upcoming</div>
              </div>
              <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.warning }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Overdue</div>
              </div>
              <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.success }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Paid</div>
              </div>
            </div>

            {/* Total Due */}
            <div style={{
              background: `linear-gradient(135deg, ${theme.secondary}, ${theme.danger})`,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💰 Total Due</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>$0.00</div>
            </div>

            <div style={{ textAlign: 'center', padding: '20px', color: theme.textMuted }}>
              No bills added yet
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div style={{
          background: theme.bgCard,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${theme.borderLight}`,
          boxShadow: theme.cardShadow,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Gradient top accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)'
          }} />
          {/* Calendar Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); prevMonth(); }}
              style={{
                width: '36px',
                height: '36px',
                background: theme.bgMain,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                color: theme.textPrimary,
                fontSize: '16px'
              }}
            >
              ‹
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: theme.textPrimary, margin: 0 }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); nextMonth(); }}
              style={{
                width: '36px',
                height: '36px',
                background: theme.bgMain,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                color: theme.textPrimary,
                fontSize: '16px'
              }}
            >
              ›
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {dayNames.map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', color: theme.textMuted, padding: '8px' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ aspectRatio: '1', padding: '8px' }} />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === new Date().getDate() && 
                currentDate.getMonth() === new Date().getMonth() && 
                currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div
                  key={day}
                  style={{
                    aspectRatio: '1',
                    padding: '8px',
                    background: isToday ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` : 'transparent',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isToday ? 'white' : theme.textPrimary,
                    fontWeight: isToday ? '600' : '400',
                    fontSize: '14px',
                    cursor: 'pointer',
                    border: `1px solid ${isToday ? 'transparent' : theme.borderLight}`
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
