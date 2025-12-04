// ============================================================================
// SIDEBAR HEADER BADGE STYLING FIX
// Proper alignment of BETA, OWNER badges with online indicator
// ============================================================================

/*
 * ISSUE: The green online indicator dot doesn't fit properly next to 
 * the BETA and OWNER badges in the sidebar header.
 * 
 * SOLUTION: Scale down badges slightly and add proper flexbox alignment
 */

// CSS-in-JS styles for the sidebar header
export const sidebarHeaderStyles = {
  // Main container for the logo and badges area
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    gap: '8px',
  },
  
  // Left side with logo
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '0 0 auto',
  },
  
  // Penny icon
  pennyIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
  },
  
  // Logo text
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
  },
  logoTextHighlight: {
    color: '#22c55e',
  },
  
  // Right side with badges and indicator
  badgeSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flex: '0 0 auto',
  },
  
  // Badge wrapper for proper alignment
  badgeWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  
  // BETA badge - scaled down
  betaBadge: {
    padding: '2px 6px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: 1.2,
  },
  
  // OWNER badge - scaled down
  ownerBadge: {
    padding: '2px 6px',
    backgroundColor: '#22c55e',
    color: '#ffffff',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: 1.2,
  },
  
  // ADMIN badge
  adminBadge: {
    padding: '2px 6px',
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: 1.2,
  },
  
  // TESTER badge
  testerBadge: {
    padding: '2px 6px',
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: 1.2,
  },
  
  // Online indicator dot
  onlineIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)',
    flexShrink: 0,
  },
  
  // Offline indicator
  offlineIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#94a3b8',
    flexShrink: 0,
  },
  
  // Collapse button
  collapseButton: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginLeft: '8px',
    flexShrink: 0,
    transition: 'background-color 0.2s ease',
  },
};

// React component for the sidebar header
export const SidebarHeader = ({ 
  userRole = 'user', // 'owner', 'admin', 'tester', 'user'
  isOnline = true,
  showBeta = true,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const getRoleBadgeStyle = () => {
    switch (userRole) {
      case 'owner': return sidebarHeaderStyles.ownerBadge;
      case 'admin': return sidebarHeaderStyles.adminBadge;
      case 'tester': return sidebarHeaderStyles.testerBadge;
      default: return null;
    }
  };

  const getRoleBadgeText = () => {
    switch (userRole) {
      case 'owner': return 'OWNER';
      case 'admin': return 'ADMIN';
      case 'tester': return 'TESTER';
      default: return null;
    }
  };

  const roleBadgeStyle = getRoleBadgeStyle();
  const roleBadgeText = getRoleBadgeText();

  return (
    <div style={sidebarHeaderStyles.headerContainer}>
      {/* Logo Section */}
      <div style={sidebarHeaderStyles.logoSection}>
        <div style={sidebarHeaderStyles.pennyIcon}>
          {/* Penny Icon - use your actual Penny image here */}
          <span style={{ fontSize: '20px' }}>🪙</span>
        </div>
        {!isCollapsed && (
          <span style={sidebarHeaderStyles.logoText}>
            Prosper<span style={sidebarHeaderStyles.logoTextHighlight}>Nest</span>
          </span>
        )}
      </div>
      
      {/* Badges Section */}
      {!isCollapsed && (
        <div style={sidebarHeaderStyles.badgeSection}>
          <div style={sidebarHeaderStyles.badgeWrapper}>
            {showBeta && (
              <span style={sidebarHeaderStyles.betaBadge}>BETA</span>
            )}
            {roleBadgeText && (
              <span style={roleBadgeStyle}>{roleBadgeText}</span>
            )}
          </div>
          
          {/* Online Indicator */}
          <div style={isOnline ? sidebarHeaderStyles.onlineIndicator : sidebarHeaderStyles.offlineIndicator} />
          
          {/* Collapse Button */}
          {onToggleCollapse && (
            <button 
              style={sidebarHeaderStyles.collapseButton}
              onClick={onToggleCollapse}
            >
              «
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// INTEGRATION GUIDE
// ============================================================================

/*
To integrate this into your existing App.jsx sidebar:

1. Find the sidebar header section (around the "ProsperNest" logo area)

2. Replace the existing badge styles with these scaled-down versions:

BEFORE:
<span style={{ padding: '3px 8px', fontSize: '10px', ... }}>BETA</span>

AFTER:
<span style={{ 
  padding: '2px 6px', 
  fontSize: '9px', 
  fontWeight: '700',
  borderRadius: '4px',
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  letterSpacing: '0.5px',
}}>BETA</span>

3. Wrap badges and online indicator in a flex container:

<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
  <span style={betaBadgeStyle}>BETA</span>
  <span style={ownerBadgeStyle}>OWNER</span>
  <div style={{
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)',
    flexShrink: 0,
  }} />
</div>

4. Add collapse button with proper margin:

<button style={{
  ...collapseButtonStyle,
  marginLeft: '8px',
  flexShrink: 0,
}}>
  «
</button>

KEY CHANGES:
- Badge padding: 3px 8px → 2px 6px
- Badge font size: 10px → 9px  
- Added letterSpacing: 0.5px for readability at smaller size
- Online dot: 10px → 8px
- Added flexShrink: 0 to prevent squishing
- Gap between badges: 6px → 4px
- Added wrapper div with gap: 4px for tight grouping
*/

// Alternative: Compact version for very tight spaces
export const sidebarHeaderCompactStyles = {
  badgeWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  
  betaBadge: {
    padding: '1px 5px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '3px',
    fontSize: '8px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    lineHeight: 1.2,
  },
  
  ownerBadge: {
    padding: '1px 5px',
    backgroundColor: '#22c55e',
    color: '#ffffff',
    borderRadius: '3px',
    fontSize: '8px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    lineHeight: 1.2,
  },
  
  onlineIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 4px rgba(34, 197, 94, 0.6)',
    flexShrink: 0,
  },
};

export default SidebarHeader;
