import React, { useState } from 'react';

// ============================================================================
// MONTH/YEAR SELECTOR COMPONENT
// A reusable component for selecting year and month to filter financial data
// ============================================================================

export default function MonthYearSelector({ 
  selectedYear, 
  setSelectedYear, 
  selectedMonth, 
  setSelectedMonth,
  showAllYear = true 
}) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  
  const months = [
    { num: 0, short: 'Jan', full: 'January' },
    { num: 1, short: 'Feb', full: 'February' },
    { num: 2, short: 'Mar', full: 'March' },
    { num: 3, short: 'Apr', full: 'April' },
    { num: 4, short: 'May', full: 'May' },
    { num: 5, short: 'Jun', full: 'June' },
    { num: 6, short: 'Jul', full: 'July' },
    { num: 7, short: 'Aug', full: 'August' },
    { num: 8, short: 'Sep', full: 'September' },
    { num: 9, short: 'Oct', full: 'October' },
    { num: 10, short: 'Nov', full: 'November' },
    { num: 11, short: 'Dec', full: 'December' }
  ];

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const handleMonthClick = (monthNum) => {
    setSelectedMonth(monthNum);
  };

  const handleAllYearClick = () => {
    setSelectedMonth(null); // null = all months (entire year)
  };

  return (
    <div style={{
      background: 'rgba(30, 27, 56, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '24px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Year Selection Row */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.5)', 
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Select Year
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {years.map(year => (
            <button
              key={year}
              onClick={() => handleYearClick(year)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: selectedYear === year 
                  ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' 
                  : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '14px',
                fontWeight: selectedYear === year ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedYear === year 
                  ? '0 4px 15px rgba(139, 92, 246, 0.4)' 
                  : 'none'
              }}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Entire Year Button + Month Grid */}
      <div>
        <div style={{ 
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.5)', 
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Select Month
        </div>

        {/* Entire Year Button */}
        {showAllYear && (
          <button
            onClick={handleAllYearClick}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: selectedMonth === null 
                ? 'linear-gradient(135deg, #10B981, #14B8A6)' 
                : 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '14px',
              fontWeight: selectedMonth === null ? '600' : '400',
              cursor: 'pointer',
              marginBottom: '12px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: selectedMonth === null 
                ? '0 4px 15px rgba(16, 185, 129, 0.4)' 
                : 'none'
            }}
          >
            <span>📅</span> Entire Year {selectedYear}
          </button>
        )}

        {/* 4x3 Month Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px'
        }}>
          {months.map(month => {
            const isSelected = selectedMonth === month.num;
            const isCurrentMonth = month.num === new Date().getMonth() && selectedYear === currentYear;
            
            return (
              <button
                key={month.num}
                onClick={() => handleMonthClick(month.num)}
                style={{
                  padding: '14px 8px',
                  borderRadius: '12px',
                  border: isCurrentMonth && !isSelected 
                    ? '2px solid rgba(139, 92, 246, 0.5)' 
                    : 'none',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' 
                    : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: isSelected ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  boxShadow: isSelected 
                    ? '0 4px 15px rgba(139, 92, 246, 0.4)' 
                    : 'none'
                }}
              >
                {month.short}
                {isCurrentMonth && !isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10B981'
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Selection Display */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '10px',
        textAlign: 'center',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.8)'
      }}>
        📊 Viewing: {' '}
        <span style={{ fontWeight: '600', color: '#8B5CF6' }}>
          {selectedMonth !== null 
            ? `${months[selectedMonth].full} ${selectedYear}` 
            : `All of ${selectedYear}`
          }
        </span>
      </div>
    </div>
  );
}
