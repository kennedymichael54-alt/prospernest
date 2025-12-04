import React, { useState, useEffect } from 'react';

// ============================================================================
// MANAGE ACCOUNT MODAL - Updated with Side Hustle Selection
// Fun, intuitive design matching the rest of the app
// ============================================================================

// Side Hustle Options
const SIDE_HUSTLE_OPTIONS = [
  { value: null, label: 'No side hustle', icon: '🏠', description: 'Just personal finances' },
  { value: 'real-estate', label: 'Realtor / Real Estate Agent', icon: '🏠', description: 'Buying & selling properties', isRealEstate: true },
  { value: 'photographer', label: 'Photographer', icon: '📸', description: 'Capturing life\'s moments' },
  { value: 'hair-stylist', label: 'Hair Stylist / Barber', icon: '💇', description: 'Making people look great' },
  { value: 'makeup-artist', label: 'Makeup Artist', icon: '💄', description: 'Beauty transformations' },
  { value: 'fitness-trainer', label: 'Personal Trainer', icon: '💪', description: 'Fitness & wellness coaching' },
  { value: 'freelance-creative', label: 'Designer / Artist', icon: '🎨', description: 'Creative professional' },
  { value: 'content-creator', label: 'Content Creator', icon: '📱', description: 'Social media & influencing' },
  { value: 'music-dj', label: 'Music Producer / DJ', icon: '🎵', description: 'Making beats & spinning tracks' },
  { value: 'consultant', label: 'Consultant / Coach', icon: '💼', description: 'Professional services' },
  { value: 'event-planner', label: 'Event Planner', icon: '🎉', description: 'Creating memorable events' },
  { value: 'ecommerce', label: 'E-commerce Seller', icon: '🛒', description: 'Online store owner' },
  { value: 'handyman', label: 'Handyman / Contractor', icon: '🔧', description: 'Fixing & building' },
  { value: 'pet-services', label: 'Pet Services', icon: '🐕', description: 'Caring for furry friends' },
  { value: 'notary', label: 'Notary / Loan Signing', icon: '📝', description: 'Document services' },
  { value: 'general-sales', label: 'Sales Professional', icon: '🎯', description: 'B2B or direct sales' },
  { value: 'other', label: 'Other Business', icon: '✨', description: 'Something else amazing' },
];

const ManageAccountModal = ({
  isOpen,
  onClose,
  user,
  onSave,
  isDarkMode = false,
  avatars = [], // List of available avatar options
}) => {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [sideHustle, setSideHustle] = useState(null);
  const [avatar, setAvatar] = useState('');
  
  // UI state
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSideHustlePicker, setShowSideHustlePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
      setDob(user.dob || '');
      setGender(user.gender || '');
      setSideHustle(user.sideHustle || null);
      setAvatar(user.avatar || '');
    }
  }, [user, isOpen]);
  
  if (!isOpen) return null;
  
  const selectedHustle = SIDE_HUSTLE_OPTIONS.find(h => h.value === sideHustle) || SIDE_HUSTLE_OPTIONS[0];
  
  const filteredHustles = SIDE_HUSTLE_OPTIONS.filter(h => 
    h.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSave = () => {
    onSave({
      ...user,
      firstName,
      lastName,
      phone,
      dob,
      gender,
      sideHustle,
      avatar,
    });
    onClose();
  };
  
  // Colors
  const bgColor = isDarkMode ? '#1e293b' : '#ffffff';
  const cardBg = isDarkMode ? '#16213e' : '#f8fafc';
  const textColor = isDarkMode ? '#ffffff' : '#1e293b';
  const mutedColor = isDarkMode ? '#94a3b8' : '#64748b';
  const borderColor = isDarkMode ? '#334155' : '#e2e8f0';
  const inputBg = isDarkMode ? '#0f172a' : '#ffffff';
  
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)',
    },
    modal: {
      backgroundColor: bgColor,
      borderRadius: '20px',
      width: '95%',
      maxWidth: '480px',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: `1px solid ${borderColor}`,
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: textColor,
    },
    closeButton: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      color: mutedColor,
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      padding: '24px',
    },
    avatarSection: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    avatarContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#e9d5ff',
      margin: '0 auto 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      cursor: 'pointer',
      border: '3px solid #a855f7',
      transition: 'transform 0.2s ease',
    },
    avatarLink: {
      color: '#6366f1',
      fontSize: '14px',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: mutedColor,
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: '10px',
      border: `1px solid ${borderColor}`,
      backgroundColor: inputBg,
      color: textColor,
      fontSize: '14px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    select: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: '10px',
      border: `1px solid ${borderColor}`,
      backgroundColor: inputBg,
      color: textColor,
      fontSize: '14px',
      boxSizing: 'border-box',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '16px',
    },
    sectionDivider: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '28px 0 20px',
      position: 'relative',
    },
    sectionLine: {
      flex: 1,
      height: '1px',
      backgroundColor: borderColor,
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#6366f1',
      whiteSpace: 'nowrap',
    },
    hustleSelector: {
      padding: '16px',
      borderRadius: '14px',
      border: `2px solid ${borderColor}`,
      backgroundColor: cardBg,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    hustleSelectorActive: {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
    },
    hustleInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    hustleIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      backgroundColor: isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
    },
    hustleLabel: {
      fontSize: '15px',
      fontWeight: '600',
      color: textColor,
    },
    hustleDesc: {
      fontSize: '13px',
      color: mutedColor,
      marginTop: '2px',
    },
    hustleArrow: {
      fontSize: '16px',
      color: mutedColor,
    },
    realtorBadge: {
      marginTop: '8px',
      padding: '6px 12px',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#22c55e',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    saveButton: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '24px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
    },
    membershipSection: {
      marginTop: '24px',
      padding: '20px',
      backgroundColor: cardBg,
      borderRadius: '14px',
    },
    membershipTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: textColor,
      marginBottom: '12px',
    },
    membershipRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    planInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    currentPlan: {
      fontSize: '14px',
      color: textColor,
    },
    planName: {
      color: '#22c55e',
      fontWeight: '600',
    },
    planDesc: {
      fontSize: '12px',
      color: mutedColor,
      marginTop: '2px',
    },
    upgradeButton: {
      padding: '8px 20px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#22c55e',
      color: '#ffffff',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    cancelButton: {
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: `1px solid #ef4444`,
      backgroundColor: 'transparent',
      color: '#ef4444',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '16px',
    },
    // Side Hustle Picker Modal
    pickerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      padding: '20px',
    },
    pickerModal: {
      backgroundColor: bgColor,
      borderRadius: '20px',
      width: '100%',
      maxWidth: '400px',
      maxHeight: '70vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    pickerHeader: {
      padding: '20px',
      borderBottom: `1px solid ${borderColor}`,
    },
    pickerTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: textColor,
      marginBottom: '12px',
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px',
      paddingLeft: '40px',
      borderRadius: '10px',
      border: `1px solid ${borderColor}`,
      backgroundColor: inputBg,
      color: textColor,
      fontSize: '14px',
      boxSizing: 'border-box',
      outline: 'none',
    },
    pickerList: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px',
    },
    pickerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '14px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
      marginBottom: '4px',
    },
    pickerItemSelected: {
      backgroundColor: isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
    },
    pickerItemIcon: {
      width: '42px',
      height: '42px',
      borderRadius: '10px',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    },
    pickerItemLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: textColor,
    },
    pickerItemDesc: {
      fontSize: '12px',
      color: mutedColor,
      marginTop: '2px',
    },
    pickerItemCheck: {
      marginLeft: 'auto',
      color: '#6366f1',
      fontWeight: 'bold',
      fontSize: '18px',
    },
    realtorHighlight: {
      border: '2px solid #22c55e',
      backgroundColor: isDarkMode ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.05)',
    },
  };

  // Side Hustle Picker
  const renderSideHustlePicker = () => (
    <div style={styles.pickerOverlay} onClick={() => setShowSideHustlePicker(false)}>
      <div style={styles.pickerModal} onClick={e => e.stopPropagation()}>
        <div style={styles.pickerHeader}>
          <div style={styles.pickerTitle}>💼 What's Your Side Hustle?</div>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '16px',
              opacity: 0.5,
            }}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search hustles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div style={styles.pickerList}>
          {filteredHustles.map((hustle) => (
            <div
              key={hustle.value || 'none'}
              style={{
                ...styles.pickerItem,
                ...(sideHustle === hustle.value ? styles.pickerItemSelected : {}),
                ...(hustle.isRealEstate ? styles.realtorHighlight : {}),
              }}
              onClick={() => {
                setSideHustle(hustle.value);
                setShowSideHustlePicker(false);
                setSearchTerm('');
              }}
            >
              <div style={styles.pickerItemIcon}>{hustle.icon}</div>
              <div>
                <div style={styles.pickerItemLabel}>
                  {hustle.label}
                  {hustle.isRealEstate && (
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      backgroundColor: '#22c55e',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                    }}>PRO</span>
                  )}
                </div>
                <div style={styles.pickerItemDesc}>{hustle.description}</div>
              </div>
              {sideHustle === hustle.value && (
                <span style={styles.pickerItemCheck}>✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.title}>Manage Account</span>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        {/* Content */}
        <div style={styles.content}>
          {/* Avatar */}
          <div style={styles.avatarSection}>
            <div 
              style={styles.avatarContainer}
              onClick={() => setShowAvatarPicker(true)}
            >
              {avatar || '🧑‍💼'}
            </div>
            <span 
              style={styles.avatarLink}
              onClick={() => setShowAvatarPicker(true)}
            >
              Change Avatar
            </span>
          </div>
          
          {/* Name Row */}
          <div style={styles.row}>
            <div>
              <label style={styles.label}>First Name</label>
              <input
                style={styles.input}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div>
              <label style={styles.label}>Last Name</label>
              <input
                style={styles.input}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>
          
          {/* Email & Phone Row */}
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Your email</label>
              <input
                style={{...styles.input, backgroundColor: isDarkMode ? '#0a0f1a' : '#f1f5f9'}}
                value={user?.email || ''}
                disabled
              />
            </div>
            <div>
              <label style={styles.label}>Phone Number</label>
              <input
                style={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-5555"
              />
            </div>
          </div>
          
          {/* DOB & Gender Row */}
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Date of Birth</label>
              <input
                style={styles.input}
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div>
              <label style={styles.label}>Gender</label>
              <select
                style={styles.select}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          </div>
          
          {/* Side Hustle Section */}
          <div style={styles.sectionDivider}>
            <div style={styles.sectionLine} />
            <div style={styles.sectionTitle}>
              <span>💼</span>
              Side Hustle
            </div>
            <div style={styles.sectionLine} />
          </div>
          
          <div
            style={{
              ...styles.hustleSelector,
              ...(showSideHustlePicker ? styles.hustleSelectorActive : {})
            }}
            onClick={() => setShowSideHustlePicker(true)}
          >
            <div style={styles.hustleInfo}>
              <div style={styles.hustleIcon}>{selectedHustle.icon}</div>
              <div>
                <div style={styles.hustleLabel}>{selectedHustle.label}</div>
                <div style={styles.hustleDesc}>{selectedHustle.description}</div>
                {selectedHustle.isRealEstate && (
                  <div style={styles.realtorBadge}>
                    ⭐ Unlocks Real Estate Command Center
                  </div>
                )}
              </div>
            </div>
            <span style={styles.hustleArrow}>▼</span>
          </div>
          
          <p style={{ fontSize: '12px', color: mutedColor, marginTop: '10px', lineHeight: 1.5 }}>
            Your Command Center will be customized with {selectedHustle.isRealEstate ? 'real estate-specific ' : ''}
            terminology, tax deductions, and tips tailored to your hustle!
          </p>
          
          {/* Save Button */}
          <button 
            style={styles.saveButton}
            onClick={handleSave}
          >
            Save Changes
          </button>
          
          {/* Membership Section */}
          <div style={styles.membershipSection}>
            <div style={styles.membershipTitle}>Membership</div>
            <div style={styles.membershipRow}>
              <div style={styles.planInfo}>
                <div style={styles.currentPlan}>
                  Current Plan: <span style={styles.planName}>{user?.plan || 'Starter (Free)'}</span>
                </div>
                <div style={styles.planDesc}>Basic features included</div>
              </div>
              <button style={styles.upgradeButton}>Upgrade</button>
            </div>
          </div>
          
          {/* Cancel Account */}
          <button style={styles.cancelButton}>
            Cancel Account
          </button>
        </div>
        
        {/* Side Hustle Picker Modal */}
        {showSideHustlePicker && renderSideHustlePicker()}
      </div>
    </div>
  );
};

export default ManageAccountModal;
