import React, { useState, useEffect } from 'react';

// Cohesive design system for Family Finance
const colors = {
  primary: '#0F172A',      // Deep navy
  secondary: '#1E293B',    // Slate
  accent1: '#10B981',      // Emerald (Home)
  accent2: '#6366F1',      // Indigo (Business)
  accent3: '#F59E0B',      // Amber (REI)
  gold: '#D4AF37',
  surface: '#F8FAFC',
  text: '#0F172A',
  textMuted: '#64748B',
};

// Animated gradient mesh background
const GradientMesh = ({ color1, color2 }) => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
      </filter>
      <radialGradient id={`grad-${color1}`} cx="30%" cy="30%" r="60%">
        <stop offset="0%" stopColor={color1} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color2} stopOpacity="0.1" />
      </radialGradient>
    </defs>
    <rect fill={`url(#grad-${color1})`} width="100%" height="100%" />
  </svg>
);

// HomeBudget Hub Icon
const HomeBudgetIcon = ({ animate }) => (
  <div className="relative w-48 h-48">
    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30 transition-all duration-700 ${animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-300/20 rounded-full blur-xl" />
      </div>
      
      {/* House Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          {/* House body */}
          <path
            d="M50 15 L85 45 L85 85 L15 85 L15 45 Z"
            fill="white"
            fillOpacity="0.95"
            className={`transition-all duration-1000 delay-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Roof */}
          <path
            d="M50 10 L90 45 L85 50 L50 20 L15 50 L10 45 Z"
            fill="white"
            className={`transition-all duration-700 delay-200 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Door */}
          <rect
            x="42" y="55" width="16" height="30" rx="2"
            fill="#10B981"
            className={`transition-all duration-500 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Windows */}
          <rect
            x="22" y="50" width="14" height="14" rx="2"
            fill="#10B981"
            fillOpacity="0.7"
            className={`transition-all duration-500 delay-600 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          <rect
            x="64" y="50" width="14" height="14" rx="2"
            fill="#10B981"
            fillOpacity="0.7"
            className={`transition-all duration-500 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Dollar sign in roof area */}
          <text
            x="50" y="45"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#10B981"
            className={`transition-all duration-500 delay-800 ${animate ? 'opacity-100' : 'opacity-0'}`}
          >
            $
          </text>
        </svg>
      </div>
      
      {/* Floating coins */}
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full bg-yellow-400 shadow-lg transition-all duration-1000 delay-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <span className="absolute inset-0 flex items-center justify-center text-yellow-700 text-xs font-bold">$</span>
      </div>
      <div className={`absolute bottom-6 left-4 w-5 h-5 rounded-full bg-yellow-300 shadow-md transition-all duration-1000 delay-900 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <span className="absolute inset-0 flex items-center justify-center text-yellow-600 text-xs font-bold">¢</span>
      </div>
    </div>
  </div>
);

// BizBudget Hub Icon
const BizBudgetIcon = ({ animate }) => (
  <div className="relative w-48 h-48">
    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 transition-all duration-700 ${animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-xl" />
      </div>
      
      {/* Chart/Building hybrid icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          {/* Background grid lines */}
          <g opacity="0.2" stroke="white" strokeWidth="0.5">
            <line x1="15" y1="20" x2="15" y2="80" />
            <line x1="35" y1="20" x2="35" y2="80" />
            <line x1="55" y1="20" x2="55" y2="80" />
            <line x1="75" y1="20" x2="75" y2="80" />
            <line x1="15" y1="40" x2="85" y2="40" />
            <line x1="15" y1="60" x2="85" y2="60" />
          </g>
          
          {/* Rising bars */}
          <rect
            x="20" y="55" width="12" height="25" rx="2"
            fill="white"
            className={`transition-all duration-500 delay-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          <rect
            x="37" y="40" width="12" height="40" rx="2"
            fill="white"
            fillOpacity="0.9"
            className={`transition-all duration-500 delay-400 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          <rect
            x="54" y="30" width="12" height="50" rx="2"
            fill="white"
            fillOpacity="0.95"
            className={`transition-all duration-500 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          <rect
            x="71" y="18" width="12" height="62" rx="2"
            fill="white"
            className={`transition-all duration-500 delay-600 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Trend arrow */}
          <path
            d="M25 50 L45 35 L62 25 L78 12"
            fill="none"
            stroke="#FCD34D"
            strokeWidth="3"
            strokeLinecap="round"
            className={`transition-all duration-700 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          <circle
            cx="78" cy="12" r="4"
            fill="#FCD34D"
            className={`transition-all duration-300 delay-900 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          />
        </svg>
      </div>
      
      {/* Floating elements */}
      <div className={`absolute top-3 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 transition-all duration-700 delay-800 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
        <span className="text-white text-xs font-semibold">+24%</span>
      </div>
      <div className={`absolute bottom-4 right-3 transition-all duration-700 delay-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
);

// REI Hub Icon
const REIHubIcon = ({ animate }) => (
  <div className="relative w-48 h-48">
    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-2xl shadow-orange-500/30 transition-all duration-700 ${animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-300/20 rounded-full blur-xl" />
      </div>
      
      {/* Building/Property icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          {/* Main building */}
          <rect
            x="30" y="25" width="40" height="55" rx="3"
            fill="white"
            className={`transition-all duration-500 delay-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Windows grid */}
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`window-${row}-${col}`}
                x={36 + col * 11}
                y={30 + row * 12}
                width="7"
                height="8"
                rx="1"
                fill="#F59E0B"
                fillOpacity={0.6 + Math.random() * 0.4}
                className={`transition-all duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${400 + (row * 3 + col) * 50}ms` }}
              />
            ))
          )}
          
          {/* Door */}
          <rect
            x="45" y="65" width="10" height="15" rx="1"
            fill="#F59E0B"
            className={`transition-all duration-500 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Side building */}
          <rect
            x="70" y="45" width="18" height="35" rx="2"
            fill="white"
            fillOpacity="0.8"
            className={`transition-all duration-500 delay-400 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
          />
          
          {/* Small building */}
          <rect
            x="12" y="55" width="18" height="25" rx="2"
            fill="white"
            fillOpacity="0.7"
            className={`transition-all duration-500 delay-500 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
          />
          
          {/* Magnifying glass overlay */}
          <circle
            cx="72" cy="28" r="14"
            fill="none"
            stroke="white"
            strokeWidth="3"
            className={`transition-all duration-500 delay-800 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          />
          <line
            x1="82" y1="38" x2="92" y2="48"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            className={`transition-all duration-300 delay-900 ${animate ? 'opacity-100' : 'opacity-0'}`}
          />
        </svg>
      </div>
      
      {/* Floating elements */}
      <div className={`absolute top-4 left-3 bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center transition-all duration-700 delay-1000 ${animate ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-45'}`}>
        <span className="text-white text-sm font-bold">📍</span>
      </div>
      <div className={`absolute bottom-3 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 transition-all duration-700 delay-1100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <span className="text-white text-xs font-semibold">ROI</span>
      </div>
    </div>
  </div>
);

// Product Card Component
const ProductCard = ({ title, subtitle, description, icon: Icon, accentColor, delay }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className={`group relative transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="relative bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-2 transition-all duration-500">
        {/* Subtle gradient accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem] opacity-80"
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }}
        />
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <Icon animate={animate} />
        </div>
        
        {/* Content */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
            {subtitle}
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Hover button */}
        <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button 
            className="px-6 py-2 rounded-full text-white text-sm font-semibold shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: accentColor }}
          >
            Explore →
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function FamilyFinanceProducts() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  const products = [
    {
      title: 'HomeBudget Hub',
      subtitle: 'Personal Finance',
      description: 'Smart household budgeting that grows with your family. Track expenses, set goals, and build wealth together.',
      icon: HomeBudgetIcon,
      accentColor: '#10B981',
      delay: 100,
    },
    {
      title: 'BizBudget Hub',
      subtitle: 'Business Finance',
      description: 'Enterprise-grade financial tools scaled for growing businesses. Insights that drive decisions.',
      icon: BizBudgetIcon,
      accentColor: '#6366F1',
      delay: 300,
    },
    {
      title: 'REBudget Hub',
      subtitle: 'Real Estate Intelligence',
      description: 'Analyze properties, forecast returns, and build your real estate portfolio with confidence.',
      icon: REIHubIcon,
      accentColor: '#F59E0B',
      delay: 500,
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl translate-x-1/2" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-amber-100/50 rounded-full blur-3xl translate-y-1/2" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Family Finance
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Choose Your Hub
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Three powerful tools designed to master every aspect of your financial journey
          </p>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={product.title} {...product} />
          ))}
        </div>
        
        {/* Footer badge */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-3 text-slate-400 text-sm">
            <div className="flex -space-x-1">
              <div className="w-3 h-3 bg-emerald-400 rounded-full" />
              <div className="w-3 h-3 bg-indigo-400 rounded-full" />
              <div className="w-3 h-3 bg-amber-400 rounded-full" />
            </div>
            One platform • Three solutions • Infinite possibilities
          </div>
        </div>
      </div>
    </div>
  );
}
