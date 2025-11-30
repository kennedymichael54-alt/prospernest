import React, { useState } from 'react';

// ============================================================================
// BILLS & CALENDAR VIEW
// Split layout: Bills list on left, Interactive calendar on right
// ============================================================================

export default function BillsCalendarView() {
  const [bills, setBills] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newBill, setNewBill] = useState({ name: '', amount: '', emoji: '📄' });

  // Calendar helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const emojiOptions = ['📄', '🏠', '⚡', '📶', '🚗', '📱', '💳', '🎬', '🏥', '💰', '🛡️', '📺'];

  // Get bills for a specific date
  const getBillsForDate = (day) => {
    return bills.filter(bill => {
      const billDate = new Date(bill.dueDate);
      return billDate.getDate() === day && 
             billDate.getMonth() === month && 
             billDate.getFullYear() === year;
    });
  };

  // Calculate totals
  const totalDue = bills.filter(b => b.status !== 'paid').reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const upcomingCount = bills.filter(b => b.status === 'upcoming').length;
  const overdueCount = bills.filter(b => b.status === 'overdue').length;
  const paidCount = bills.filter(b => b.status === 'paid').length;

  // Add new bill
  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount || !selectedDate) return;
    
    const dueDate = new Date(year, month, selectedDate);
    const isOverdue = dueDate < today;
    
    setBills([...bills, {
      id: Date.now(),
      name: newBill.name,
      amount: parseFloat(newBill.amount),
      dueDate: dueDate,
      status: isOverdue ? 'overdue' : 'upcoming',
      emoji: newBill.emoji
    }]);
    
    setNewBill({ name: '', amount: '', emoji: '📄' });
    setShowAddModal(false);
    setSelectedDate(null);
  };

  // Mark bill as paid
  const markAsPaid = (billId) => {
    setBills(bills.map(b => 
      b.id === billId ? { ...b, status: 'paid' } : b
    ));
  };

  // Delete bill
  const deleteBill = (billId) => {
    setBills(bills.filter(b => b.id !== billId));
  };

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Header Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{ 
          background: 'rgba(30, 27, 56, 0.8)', 
          borderRadius: '16px', 
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
            📅 Upcoming
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#8B5CF6' }}>
            {upcomingCount}
          </div>
        </div>
        <div style={{ 
          background: 'rgba(30, 27, 56, 0.8)', 
          borderRadius: '16px', 
          padding: '20px',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
            ⚠️ Overdue
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#EF4444' }}>
            {overdueCount}
          </div>
        </div>
        <div style={{ 
          background: 'rgba(30, 27, 56, 0.8)', 
          borderRadius: '16px', 
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
            ✅ Paid
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#10B981' }}>
            {paidCount}
          </div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', 
          borderRadius: '16px', 
          padding: '20px'
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
            💸 Total Due
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>
            ${totalDue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Split Layout: Bills List | Calendar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '24px' 
      }}>
        {/* LEFT: Bills & Payments List */}
        <div style={{ 
          background: 'rgba(30, 27, 56, 0.8)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '20px', 
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 Bills & Payments
          </h3>

          {bills.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'rgba(255,255,255,0.5)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>No bills added yet</div>
              <div style={{ fontSize: '14px' }}>Click on a date in the calendar to add a bill</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
              {bills.sort((a, b) => a.dueDate - b.dueDate).map(bill => {
                const isOverdue = bill.status === 'overdue';
                const isPaid = bill.status === 'paid';
                const daysUntil = Math.ceil((bill.dueDate - today) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={bill.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: isOverdue 
                        ? 'rgba(239, 68, 68, 0.1)' 
                        : isPaid 
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      border: isOverdue 
                        ? '1px solid rgba(239, 68, 68, 0.3)' 
                        : isPaid
                          ? '1px solid rgba(16, 185, 129, 0.3)'
                          : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontSize: '24px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '10px'
                      }}>
                        {bill.emoji}
                      </span>
                      <div>
                        <div style={{ 
                          fontWeight: '500',
                          textDecoration: isPaid ? 'line-through' : 'none',
                          opacity: isPaid ? 0.6 : 1
                        }}>
                          {bill.name}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: isOverdue ? '#EF4444' : isPaid ? '#10B981' : 'rgba(255,255,255,0.5)'
                        }}>
                          {isPaid 
                            ? '✅ Paid' 
                            : isOverdue 
                              ? `${Math.abs(daysUntil)} days overdue`
                              : daysUntil === 0 
                                ? 'Due today!'
                                : `Due in ${daysUntil} days`
                          }
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: '600', fontSize: '16px' }}>
                        ${bill.amount.toFixed(2)}
                      </span>
                      {!isPaid ? (
                        <button
                          onClick={() => markAsPaid(bill.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#10B981',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteBill(bill.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'transparent',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Interactive Calendar */}
        <div style={{ 
          background: 'rgba(30, 27, 56, 0.8)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '20px', 
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Calendar Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <button
              onClick={prevMonth}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ←
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={nextMonth}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              →
            </button>
          </div>

          {/* Day Names */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '4px',
            marginBottom: '8px'
          }}>
            {dayNames.map(day => (
              <div 
                key={day} 
                style={{ 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  color: 'rgba(255,255,255,0.5)',
                  padding: '8px'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '4px'
          }}>
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} style={{ padding: '12px' }} />;
              }

              const dayBills = getBillsForDate(day);
              const isToday = day === today.getDate() && 
                             month === today.getMonth() && 
                             year === today.getFullYear();
              const hasOverdue = dayBills.some(b => b.status === 'overdue');
              const hasUpcoming = dayBills.some(b => b.status === 'upcoming');
              const isSelected = selectedDate === day;

              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(day);
                    setShowAddModal(true);
                  }}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '10px',
                    border: isToday 
                      ? '2px solid #8B5CF6' 
                      : isSelected
                        ? '2px solid #EC4899'
                        : 'none',
                    background: hasOverdue 
                      ? 'rgba(239, 68, 68, 0.2)'
                      : hasUpcoming 
                        ? 'rgba(139, 92, 246, 0.2)'
                        : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    cursor: 'pointer',
                    position: 'relative',
                    minHeight: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: isToday ? '700' : '400' 
                  }}>
                    {day}
                  </span>
                  {dayBills.length > 0 && (
                    <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {dayBills.slice(0, 3).map((bill, i) => (
                        <span key={i} style={{ fontSize: '10px' }}>{bill.emoji}</span>
                      ))}
                      {dayBills.length > 3 && (
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>
                          +{dayBills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginTop: '16px',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(139, 92, 246, 0.4)' }} />
              Upcoming
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.4)' }} />
              Overdue
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '2px solid #8B5CF6' }} />
              Today
            </div>
          </div>

          {/* Quick tip */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.7)'
          }}>
            💡 Click on any date to add a bill
          </div>
        </div>
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => {
            setShowAddModal(false);
            setSelectedDate(null);
          }}
        >
          <div 
            style={{
              background: 'rgba(30, 27, 56, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              width: '400px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
              ➕ Add Bill
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              Due: {monthNames[month]} {selectedDate}, {year}
            </p>

            {/* Emoji Selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Icon
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {emojiOptions.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setNewBill({ ...newBill, emoji })}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      border: newBill.emoji === emoji ? '2px solid #8B5CF6' : 'none',
                      background: newBill.emoji === emoji ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.1)',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Bill Name
              </label>
              <input
                value={newBill.name}
                onChange={e => setNewBill({ ...newBill, name: e.target.value })}
                placeholder="e.g., Electric Bill"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Amount ($)
              </label>
              <input
                type="number"
                value={newBill.amount}
                onChange={e => setNewBill({ ...newBill, amount: e.target.value })}
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedDate(null);
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBill}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add Bill
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
