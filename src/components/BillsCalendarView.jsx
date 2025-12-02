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

export default function BillsCalendarView({ theme: propTheme }) {
  const [localDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pn_darkMode') === 'true';
    } catch { return false; }
  });
  
  const theme = propTheme || (localDarkMode ? defaultDarkTheme : defaultLightTheme);
  const isDark = theme.mode === 'dark';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [bills, setBills] = useState([]);

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

  const statCards = [
    { label: 'Upcoming', value: 0, color: isDark ? theme.primary : '#4F46E5', icon: '📅' },
    { label: 'Overdue', value: 0, color: isDark ? theme.warning : '#F59E0B', icon: '⚠️' },
    { label: 'Paid', value: 0, color: isDark ? theme.success : '#10B981', icon: '✅' },
    { label: 'Total Due', value: '$0.00', color: isDark ? theme.secondary : '#EC4899', icon: '💰' },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            background: theme.bgCard,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span>{card.icon}</span>
              <span style={{ fontSize: '13px', color: theme.textMuted }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content - Bills List + Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Bills List */}
        <div>
          {/* Personal Bills */}
          <div style={{
            background: theme.bgCard,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🏠</span>
                <span style={{ fontWeight: '600', color: theme.textPrimary }}>Personal Bills</span>
              </div>
              <span style={{ fontSize: '13px', color: theme.textMuted }}>0 bills</span>
            </div>

            {/* Status Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: isDark ? 'rgba(79, 70, 229, 0.2)' : '#EEF2FF', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.primary }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Upcoming</div>
              </div>
              <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.warning }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Overdue</div>
              </div>
              <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
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
            padding: '24px',
            border: `1px solid ${theme.borderLight}`,
            boxShadow: theme.cardShadow
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🏢💼</span>
                <span style={{ fontWeight: '600', color: theme.textPrimary }}>Real Estate Agent Bills</span>
              </div>
              <span style={{ fontSize: '13px', color: theme.textMuted }}>0 bills</span>
            </div>

            {/* Status Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: isDark ? 'rgba(79, 70, 229, 0.2)' : '#EEF2FF', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.primary }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Upcoming</div>
              </div>
              <div style={{ background: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: theme.warning }}>0</div>
                <div style={{ fontSize: '11px', color: theme.textMuted }}>Overdue</div>
              </div>
              <div style={{ background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
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
          boxShadow: theme.cardShadow
        }}>
          {/* Calendar Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <button
              onClick={prevMonth}
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
              onClick={nextMonth}
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
    </div>
  );
}
