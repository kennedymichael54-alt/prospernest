import React, { useState } from 'react';

// ============================================================================
// COLLAPSIBLE SECTION COMPONENT
// Use this throughout the app for consistent collapsible sections
// Matches the BizBudget Hub style for uniformity
// ============================================================================

export const CollapsibleSection = ({ 
  title, 
  icon = null,
  badge = null,
  badgeColor = '#6366f1',
  defaultExpanded = true, 
  children, 
  isDarkMode = false,
  headerRight = null,
  noPadding = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const styles = {
    container: {
      backgroundColor: isDarkMode ? '#16213e' : '#ffffff',
      borderRadius: '16px',
      marginBottom: '20px',
      boxShadow: isDarkMode 
        ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
        : '0 2px 8px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
      transition: 'all 0.2s ease',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      cursor: 'pointer',
      userSelect: 'none',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
      borderBottom: isExpanded 
        ? `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` 
        : 'none',
      transition: 'background-color 0.2s ease',
    },
    headerHover: {
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    icon: {
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1e293b',
      margin: 0,
    },
    badge: {
      padding: '3px 10px',
      backgroundColor: `${badgeColor}20`,
      color: badgeColor,
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    chevron: {
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.3s ease, background-color 0.2s ease',
      transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
    },
    chevronIcon: {
      fontSize: '14px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },
    content: {
      padding: noPadding ? 0 : '20px',
      maxHeight: isExpanded ? '5000px' : '0',
      opacity: isExpanded ? 1 : 0,
      overflow: 'hidden',
      transition: 'max-height 0.4s ease, opacity 0.3s ease, padding 0.3s ease',
    },
    contentCollapsed: {
      padding: 0,
    },
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container} className={className}>
      <div 
        style={{
          ...styles.header,
          ...(isHovered ? styles.headerHover : {})
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.titleContainer}>
          {icon && <span style={styles.icon}>{icon}</span>}
          <h3 style={styles.title}>{title}</h3>
          {badge && <span style={styles.badge}>{badge}</span>}
        </div>
        <div style={styles.rightSection}>
          {headerRight}
          <div style={styles.chevron}>
            <span style={styles.chevronIcon}>▼</span>
          </div>
        </div>
      </div>
      <div style={{
        ...styles.content,
        ...(!isExpanded ? styles.contentCollapsed : {})
      }}>
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// COLLAPSIBLE CARD - Simpler version for inline use
// ============================================================================

export const CollapsibleCard = ({
  title,
  subtitle = null,
  icon = null,
  defaultExpanded = true,
  children,
  isDarkMode = false,
  accentColor = '#6366f1',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  return (
    <div style={{
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      marginBottom: '16px',
    }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          cursor: 'pointer',
          borderLeft: `3px solid ${accentColor}`,
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: isDarkMode ? '#ffffff' : '#1e293b',
            }}>{title}</div>
            {subtitle && (
              <div style={{
                fontSize: '12px',
                color: isDarkMode ? '#94a3b8' : '#64748b',
                marginTop: '2px',
              }}>{subtitle}</div>
            )}
          </div>
        </div>
        <span style={{
          fontSize: '12px',
          color: isDarkMode ? '#64748b' : '#94a3b8',
          transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s ease',
        }}>▼</span>
      </div>
      <div style={{
        maxHeight: isExpanded ? '2000px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ padding: '16px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// KPI CARD WITH COLLAPSIBLE DETAILS
// ============================================================================

export const CollapsibleKPICard = ({
  title,
  value,
  change = null,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon = null,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  details = null,
  isDarkMode = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const changeColors = {
    positive: '#22c55e',
    negative: '#ef4444',
    neutral: '#94a3b8',
  };
  
  return (
    <div style={{
      background: gradient,
      borderRadius: '16px',
      padding: '20px',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
      cursor: details ? 'pointer' : 'default',
    }} onClick={() => details && setShowDetails(!showDetails)}>
      {/* Background icon */}
      {icon && (
        <span style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '48px',
          opacity: 0.2,
        }}>{icon}</span>
      )}
      
      <div style={{
        fontSize: '12px',
        fontWeight: '500',
        opacity: 0.9,
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>{title}</div>
      
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: change ? '8px' : 0,
      }}>{value}</div>
      
      {change && (
        <div style={{
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span style={{ color: changeColors[changeType] }}>
            {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'}
          </span>
          {change}
        </div>
      )}
      
      {/* Expandable details */}
      {details && showDetails && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.2)',
        }}>
          {details}
        </div>
      )}
      
      {/* Expand indicator */}
      {details && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px',
          opacity: 0.6,
        }}>
          {showDetails ? '▲ Less' : '▼ More'}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
// In any tab component:

import { CollapsibleSection, CollapsibleCard } from './CollapsibleComponents';

// Basic section:
<CollapsibleSection 
  title="Pipeline Overview" 
  icon="🎯" 
  badge="2 active"
  isDarkMode={isDarkMode}
>
  {pipelineContent}
</CollapsibleSection>

// With header actions:
<CollapsibleSection 
  title="Recent Transactions" 
  icon="💳"
  isDarkMode={isDarkMode}
  headerRight={
    <button onClick={handleAdd}>+ Add</button>
  }
>
  {transactionsList}
</CollapsibleSection>

// Card style:
<CollapsibleCard
  title="Tax Deductions"
  subtitle="Track your write-offs"
  icon="💡"
  accentColor="#22c55e"
  isDarkMode={isDarkMode}
>
  {deductionsList}
</CollapsibleCard>
*/

export default CollapsibleSection;
