import React, { useState } from 'react';

// ============================================================================
// PRODUCT SHOWCASE - Dark Theme with Flashy Centered Icons
// ============================================================================

export default function ProductShowcase() {
  const [selectedHub, setSelectedHub] = useState('home');

  return (
    <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>
          Everything Your Family Needs
        </h2>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)' }}>
          Purpose-built tools for modern family finances
        </p>
      </div>

      {/* 3-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* HomeBudget Hub - Most Popular */}
        <div 
          onClick={() => setSelectedHub('home')}
          style={{ 
            position: 'relative', 
            background: selectedHub === 'home' ? 'rgba(30, 27, 56, 0.9)' : 'rgba(30, 27, 56, 0.8)', 
            backdropFilter: 'blur(20px)', 
            borderRadius: '24px', 
            padding: '32px', 
            border: selectedHub === 'home' ? '2px solid rgba(139, 92, 246, 0.6)' : '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: selectedHub === 'home' ? '0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 30px rgba(139, 92, 246, 0.1)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Most Popular Badge */}
          <div style={{ 
            position: 'absolute', 
            top: '-12px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            padding: '6px 16px', 
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '600',
            color: 'white'
          }}>
            Most Popular
          </div>

          {/* Centered Flashy Icon */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '28px', 
              background: 'linear-gradient(135deg, #10B981, #059669, #14B8A6)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.3), inset 0 -4px 20px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Shine effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                animation: 'shine 3s infinite'
              }} />
              <svg viewBox="0 0 100 100" style={{ width: '56px', height: '56px', position: 'relative', zIndex: 1 }}>
                {/* House body */}
                <path d="M50 18 L85 48 L85 85 L15 85 L15 48 Z" fill="white" fillOpacity="0.95"/>
                {/* Roof */}
                <path d="M50 10 L92 48 L85 55 L50 25 L15 55 L8 48 Z" fill="white"/>
                {/* Door */}
                <rect x="42" y="58" width="16" height="27" rx="2" fill="#10B981"/>
                <circle cx="54" cy="72" r="2" fill="white"/>
                {/* Windows */}
                <rect x="22" y="52" width="14" height="14" rx="2" fill="#10B981" fillOpacity="0.7"/>
                <line x1="29" y1="52" x2="29" y2="66" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
                <line x1="22" y1="59" x2="36" y2="59" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
                <rect x="64" y="52" width="14" height="14" rx="2" fill="#10B981" fillOpacity="0.7"/>
                <line x1="71" y1="52" x2="71" y2="66" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
                <line x1="64" y1="59" x2="78" y2="59" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
                {/* Dollar sign */}
                <text x="50" y="46" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#10B981">$</text>
                {/* Chimney */}
                <rect x="68" y="28" width="10" height="18" rx="2" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px', color: 'white', textAlign: 'center' }}>
            HomeBudget Hub
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5, textAlign: 'center' }}>
            Track spending, manage bills, and build budgets that actually work for your family.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Automatic transaction categorization', 'Bill reminders & payment tracking', 'Family spending insights', 'Goal setting & progress tracking'].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <span style={{ color: '#10B981' }}>✓</span> {feature}
              </div>
            ))}
          </div>
        </div>

        {/* BizBudget Hub - Coming Soon */}
        <div 
          onClick={() => setSelectedHub('business')}
          style={{ 
            position: 'relative', 
            background: selectedHub === 'business' ? 'rgba(30, 27, 56, 0.7)' : 'rgba(30, 27, 56, 0.5)', 
            backdropFilter: 'blur(20px)', 
            borderRadius: '24px', 
            padding: '32px', 
            border: selectedHub === 'business' ? '2px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: selectedHub === 'business' ? '0 0 20px rgba(139, 92, 246, 0.2)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Coming Soon Badge */}
          <div style={{ 
            position: 'absolute', 
            top: '-12px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            padding: '6px 16px', 
            background: 'rgba(251, 191, 36, 0.2)', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#FBBF24' 
          }}>
            Coming Soon
          </div>

          {/* Centered Flashy Icon */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '28px', 
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(99, 102, 241, 0.5), 0 0 60px rgba(139, 92, 246, 0.3), inset 0 -4px 20px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Shine effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                animation: 'shine 3s infinite 0.5s'
              }} />
              <svg viewBox="0 0 100 100" style={{ width: '56px', height: '56px', position: 'relative', zIndex: 1 }}>
                {/* Grid lines */}
                <g opacity="0.2" stroke="white" strokeWidth="1">
                  <line x1="15" y1="25" x2="15" y2="85"/>
                  <line x1="15" y1="45" x2="90" y2="45"/>
                  <line x1="15" y1="65" x2="90" y2="65"/>
                  <line x1="15" y1="85" x2="90" y2="85"/>
                </g>
                {/* Rising bars */}
                <rect x="22" y="58" width="14" height="27" rx="3" fill="white" fillOpacity="0.8"/>
                <rect x="42" y="42" width="14" height="43" rx="3" fill="white" fillOpacity="0.9"/>
                <rect x="62" y="28" width="14" height="57" rx="3" fill="white"/>
                {/* Trend line */}
                <path d="M29 52 L49 36 L69 22" fill="none" stroke="#FCD34D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Arrow head */}
                <circle cx="69" cy="22" r="6" fill="#FCD34D"/>
                <circle cx="69" cy="22" r="3" fill="#6366F1"/>
                {/* Growth badge */}
                <rect x="58" y="8" width="32" height="16" rx="8" fill="rgba(252,211,77,0.3)"/>
                <text x="74" y="19" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">+24%</text>
              </svg>
            </div>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px', color: 'white', textAlign: 'center' }}>
            BizBudget Hub
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5, textAlign: 'center' }}>
            Powerful tools for freelancers and small business owners to manage cash flow.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Cash flow forecasting', 'Expense management', 'Team access controls', 'Financial reports'].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <span style={{ color: '#10B981' }}>✓</span> {feature}
              </div>
            ))}
          </div>
        </div>

        {/* REBudget Hub - Coming Soon */}
        <div 
          onClick={() => setSelectedHub('real-estate')}
          style={{ 
            position: 'relative', 
            background: selectedHub === 'real-estate' ? 'rgba(30, 27, 56, 0.7)' : 'rgba(30, 27, 56, 0.5)', 
            backdropFilter: 'blur(20px)', 
            borderRadius: '24px', 
            padding: '32px', 
            border: selectedHub === 'real-estate' ? '2px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: selectedHub === 'real-estate' ? '0 0 20px rgba(139, 92, 246, 0.2)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Coming Soon Badge */}
          <div style={{ 
            position: 'absolute', 
            top: '-12px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            padding: '6px 16px', 
            background: 'rgba(251, 191, 36, 0.2)', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#FBBF24' 
          }}>
            Coming Soon
          </div>

          {/* Centered Flashy Icon */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '28px', 
              background: 'linear-gradient(135deg, #F59E0B, #F97316, #EF4444)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(245, 158, 11, 0.5), 0 0 60px rgba(249, 115, 22, 0.3), inset 0 -4px 20px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Shine effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                animation: 'shine 3s infinite 1s'
              }} />
              <svg viewBox="0 0 100 100" style={{ width: '56px', height: '56px', position: 'relative', zIndex: 1 }}>
                {/* Main building */}
                <rect x="28" y="30" width="44" height="55" rx="3" fill="white"/>
                {/* Windows grid */}
                <rect x="34" y="36" width="10" height="10" rx="1" fill="#F59E0B" fillOpacity="0.8"/>
                <rect x="56" y="36" width="10" height="10" rx="1" fill="#F59E0B" fillOpacity="0.7"/>
                <rect x="34" y="52" width="10" height="10" rx="1" fill="#F59E0B" fillOpacity="0.6"/>
                <rect x="56" y="52" width="10" height="10" rx="1" fill="#F59E0B" fillOpacity="0.9"/>
                <rect x="34" y="68" width="10" height="10" rx="1" fill="#F59E0B" fillOpacity="0.7"/>
                <rect x="56" y="68" width="10" height="10" rx="1" fill="#F59E0B" fillOpacity="0.8"/>
                {/* Door */}
                <rect x="45" y="72" width="10" height="13" rx="1" fill="#F59E0B"/>
                {/* Side building */}
                <rect x="72" y="50" width="18" height="35" rx="2" fill="white" fillOpacity="0.8"/>
                <rect x="76" y="56" width="6" height="6" rx="1" fill="#F59E0B" fillOpacity="0.6"/>
                <rect x="76" y="68" width="6" height="6" rx="1" fill="#F59E0B" fillOpacity="0.7"/>
                {/* Small building */}
                <rect x="10" y="60" width="18" height="25" rx="2" fill="white" fillOpacity="0.7"/>
                <rect x="14" y="66" width="6" height="6" rx="1" fill="#F59E0B" fillOpacity="0.5"/>
                {/* Magnifying glass */}
                <circle cx="78" cy="22" r="12" fill="none" stroke="white" strokeWidth="4"/>
                <line x1="87" y1="31" x2="95" y2="39" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="78" cy="22" r="6" fill="rgba(255,255,255,0.3)"/>
                {/* ROI badge */}
                <rect x="8" y="12" width="28" height="14" rx="7" fill="rgba(255,255,255,0.25)"/>
                <text x="22" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">ROI</text>
              </svg>
            </div>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px', color: 'white', textAlign: 'center' }}>
            REBudget Hub
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5, textAlign: 'center' }}>
            Analyze real estate investments with professional-grade tools and insights.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Property analysis tools', 'Rental income tracking', 'Market comparisons', 'Equity growth tracking'].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <span style={{ color: '#10B981' }}>✓</span> {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animation for shine effect */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          50%, 100% { transform: translateX(100%) rotate(45deg); }
        }
      `}</style>
    </section>
  );
}
