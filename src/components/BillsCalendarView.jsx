import React, { useState, useMemo } from 'react';

// ============================================================================
// BILLS & CALENDAR VIEW - Split Personal/Side Hustle
// ============================================================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export default function BillsCalendarView() {
  const [bills, setBills] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newBill, setNewBill] = useState({ name: '', amount: '', emoji: '📄', type: 'personal' });

  const sideHustleName = useMemo(() => {
    try { return localStorage.getItem('ff_sidehustle_name') || 'Side Hustle'; } catch { return 'Side Hustle'; }
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const emojiOptions = ['📄', '🏠', '⚡', '📶', '🚗', '📱', '💳', '🎬', '🏥', '💰', '🛡️', '📺', '💼', '🏢', '📊'];

  const getBillsForDate = (day, type = null) => {
    return bills.filter(bill => {
      const billDate = new Date(bill.dueDate);
      const dateMatch = billDate.getDate() === day && billDate.getMonth() === month && billDate.getFullYear() === year;
      if (type) return dateMatch && bill.type === type;
      return dateMatch;
    });
  };

  const personalBills = bills.filter(b => b.type !== 'sidehustle');
  const sideHustleBills = bills.filter(b => b.type === 'sidehustle');
  const hasSideHustleBills = sideHustleBills.length > 0;

  const getStats = (billsList) => ({
    totalDue: billsList.filter(b => b.status !== 'paid').reduce((sum, b) => sum + parseFloat(b.amount), 0),
    upcoming: billsList.filter(b => b.status === 'upcoming').length,
    overdue: billsList.filter(b => b.status === 'overdue').length,
    paid: billsList.filter(b => b.status === 'paid').length
  });

  const personalStats = getStats(personalBills);
  const sideHustleStats = getStats(sideHustleBills);

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
      emoji: newBill.emoji,
      type: newBill.type
    }]);
    setNewBill({ name: '', amount: '', emoji: '📄', type: 'personal' });
    setShowAddModal(false);
    setSelectedDate(null);
  };

  const markAsPaid = (billId) => setBills(bills.map(b => b.id === billId ? { ...b, status: 'paid' } : b));
  const deleteBill = (billId) => setBills(bills.filter(b => b.id !== billId));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  // Bills Panel Component
  const BillsPanel = ({ title, icon, color, billsList, stats }) => (
    <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{title}</h3>
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{billsList.length} bills</span>
      </div>

      {/* Mini Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(251, 191, 36, 0.15)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#FBBF24' }}>{stats.upcoming}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Upcoming</div>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#EF4444' }}>{stats.overdue}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Overdue</div>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>{stats.paid}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Paid</div>
        </div>
      </div>

      {/* Total Due */}
      <div style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>💵 Total Due</div>
        <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(stats.totalDue)}</div>
      </div>

      {/* Bills List */}
      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {billsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No bills added yet</div>
        ) : (
          billsList.map(bill => (
            <div key={bill.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '8px', border: `1px solid ${bill.status === 'overdue' ? 'rgba(239, 68, 68, 0.3)' : bill.status === 'paid' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 191, 36, 0.3)'}` }}>
              <span style={{ fontSize: '20px' }}>{bill.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '13px' }}>{bill.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Due {new Date(bill.dueDate).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{formatCurrency(bill.amount)}</div>
                <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: bill.status === 'paid' ? 'rgba(16, 185, 129, 0.2)' : bill.status === 'overdue' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(251, 191, 36, 0.2)', color: bill.status === 'paid' ? '#10B981' : bill.status === 'overdue' ? '#EF4444' : '#FBBF24' }}>
                  {bill.status}
                </span>
              </div>
              {bill.status !== 'paid' && (
                <button onClick={() => markAsPaid(bill.id)} style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', border: 'none', borderRadius: '4px', color: '#10B981', fontSize: '10px', cursor: 'pointer' }}>✓</button>
              )}
              <button onClick={() => deleteBill(bill.id)} style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '4px', color: '#EF4444', fontSize: '10px', cursor: 'pointer' }}>✕</button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Summary Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '14px', padding: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>📋 Upcoming</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#FBBF24' }}>{personalStats.upcoming + sideHustleStats.upcoming}</div>
        </div>
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '14px', padding: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>⚠️ Overdue</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#EF4444' }}>{personalStats.overdue + sideHustleStats.overdue}</div>
        </div>
        <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '14px', padding: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>✅ Paid</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#10B981' }}>{personalStats.paid + sideHustleStats.paid}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>💰 Total Due</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{formatCurrency(personalStats.totalDue + sideHustleStats.totalDue)}</div>
        </div>
      </div>

      {/* Split View - Always show both panels centered */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 1fr', gap: '0', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Left Side - Bills Lists */}
        <div style={{ paddingRight: '20px' }}>
          <BillsPanel title="👤 Personal Bills" icon="🏠" color="#8B5CF6" billsList={personalBills} stats={personalStats} />
          <BillsPanel title={`💼 ${sideHustleName} Bills`} icon="💼" color="#EC4899" billsList={sideHustleBills} stats={sideHustleStats} />
        </div>

        {/* Divider */}
        <div style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))', borderRadius: '2px' }} />

        {/* Right Side - Calendar */}
        <div style={{ paddingLeft: '20px' }}>
          <div style={{ background: 'rgba(30, 27, 56, 0.8)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Calendar Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px 12px', color: 'white', cursor: 'pointer', fontSize: '16px' }}>←</button>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{monthNames[month]} {year}</h3>
              <button onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px 12px', color: 'white', cursor: 'pointer', fontSize: '16px' }}>→</button>
            </div>

            {/* Day Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
              {dayNames.map(day => (
                <div key={day} style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', padding: '8px' }}>{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={i} />;
                const dayBills = getBillsForDate(day);
                const personalDayBills = dayBills.filter(b => b.type !== 'sidehustle');
                const sideHustleDayBills = dayBills.filter(b => b.type === 'sidehustle');
                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                const hasOverdue = dayBills.some(b => b.status === 'overdue');

                return (
                  <div key={i}
                    onClick={() => { setSelectedDate(day); setShowAddModal(true); }}
                    style={{ aspectRatio: '1', background: isToday ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: hasOverdue ? '2px solid #EF4444' : '1px solid rgba(255,255,255,0.1)', position: 'relative', padding: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: isToday ? '700' : '500' }}>{day}</span>
                    {dayBills.length > 0 && (
                      <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                        {personalDayBills.length > 0 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B5CF6' }} />}
                        {sideHustleDayBills.length > 0 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EC4899' }} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6', marginRight: '4px' }}></span>Personal</span>
              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#EC4899', marginRight: '4px' }}></span>{sideHustleName}</span>
              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', marginRight: '4px' }}></span>Today</span>
            </div>

            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              💡 Click on any date to add a bill
            </div>
          </div>
        </div>
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: 'rgba(30, 27, 56, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '28px', width: '380px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>📅 Add Bill for {monthNames[month]} {selectedDate}</h3>

            {/* Bill Type Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Bill Type</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setNewBill({ ...newBill, type: 'personal' })}
                  style={{ flex: 1, padding: '12px', background: newBill.type === 'personal' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.05)', border: newBill.type === 'personal' ? '2px solid #8B5CF6' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>
                  👤 Personal
                </button>
                <button onClick={() => setNewBill({ ...newBill, type: 'sidehustle' })}
                  style={{ flex: 1, padding: '12px', background: newBill.type === 'sidehustle' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255,255,255,0.05)', border: newBill.type === 'sidehustle' ? '2px solid #EC4899' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>
                  💼 {sideHustleName}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Icon</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {emojiOptions.map(emoji => (
                  <button key={emoji} onClick={() => setNewBill({ ...newBill, emoji })}
                    style={{ width: '36px', height: '36px', borderRadius: '8px', border: newBill.emoji === emoji ? '2px solid #8B5CF6' : 'none', background: newBill.emoji === emoji ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.1)', fontSize: '18px', cursor: 'pointer' }}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Bill Name</label>
              <input value={newBill.name} onChange={e => setNewBill({ ...newBill, name: e.target.value })} placeholder="e.g., Electric Bill"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Amount ($)</label>
              <input type="number" value={newBill.amount} onChange={e => setNewBill({ ...newBill, amount: e.target.value })} placeholder="0.00"
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAddBill} style={{ flex: 1, padding: '12px', background: newBill.type === 'sidehustle' ? 'linear-gradient(135deg, #EC4899, #DB2777)' : 'linear-gradient(135deg, #8B5CF6, #7C3AED)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Add Bill</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
