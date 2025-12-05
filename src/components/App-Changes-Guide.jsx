// ============================================================================
// APP.JSX CHANGES GUIDE - ProsperNest Real Estate Command Center Integration
// ============================================================================
// This file contains all the changes needed in App.jsx to add:
// 1. RealEstateCommandCenter import and conditional routing
// 2. sideHustle field in profile for profession type
// 3. Sidebar badge styling is already correct (no changes needed)
// ============================================================================

// ============================================================================
// CHANGE 1: ADD IMPORT (Around line 14, after BizBudgetHub import)
// ============================================================================
// ADD this line:
import RealEstateCommandCenter from './components/RealEstateCommandCenter';


// ============================================================================
// CHANGE 2: UPDATE PROFILE STATE (Around line 1572-1581)
// ============================================================================
// REPLACE the existing profile useState with this:
const [profile, setProfile] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  photoUrl: '',
  sidehustleName: '',
  sideHustle: '' // NEW: 'real-estate', 'photographer', 'hair-stylist', etc.
});


// ============================================================================
// CHANGE 3: UPDATE saveProfileToDB FUNCTION (Around line 1337-1349)
// ============================================================================
// REPLACE the upsert object to include side_hustle:
const { error } = await sb.from('user_profiles').upsert({
  user_id: userId,
  first_name: profile.firstName,
  last_name: profile.lastName,
  email: profile.email,
  phone: profile.phone,
  date_of_birth: profile.dateOfBirth,
  gender: profile.gender,
  photo_url: profile.photoUrl,
  sidehustle_name: profile.sidehustleName,
  side_hustle: profile.sideHustle, // NEW: Save the profession type
  account_labels: profile.accountLabels ? JSON.stringify(profile.accountLabels) : null,
  updated_at: new Date().toISOString()
}, { onConflict: 'user_id' });


// ============================================================================
// CHANGE 4: UPDATE dbToAppProfile FUNCTION (Around line 1358-1380)
// ============================================================================
// ADD sideHustle to the returned object:
const dbToAppProfile = (p) => {
  let accountLabels = { personal: 'Personal', sidehustle: 'Side Hustle' };
  if (p.account_labels) {
    try {
      const parsed = typeof p.account_labels === 'string' 
        ? JSON.parse(p.account_labels) 
        : p.account_labels;
      if (parsed && typeof parsed === 'object') {
        accountLabels = parsed;
      }
    } catch (e) {
      console.error('Failed to parse account labels:', e);
    }
  }
  return {
    firstName: p.first_name || '',
    lastName: p.last_name || '',
    email: p.email || '',
    phone: p.phone || '',
    dateOfBirth: p.date_of_birth || '',
    gender: p.gender || '',
    photoUrl: p.photo_url || '',
    sidehustleName: p.sidehustle_name || '',
    sideHustle: p.side_hustle || '', // NEW: Load the profession type
    accountLabels: accountLabels,
    bizbudgetBusinessName: p.bizbudget_business_name || ''
  };
};


// ============================================================================
// CHANGE 5: UPDATE SALES TAB RENDERING (Around line 3609-3610)
// ============================================================================
// REPLACE the 'sales' case with conditional rendering:
case 'sales':
  // Conditional rendering based on side hustle type
  if (profile.sideHustle === 'real-estate') {
    return (
      <GradientSection tab="sales">
        <RealEstateCommandCenter 
          theme={theme} 
          lastImportDate={lastImportDate} 
          userId={user?.id} 
          userEmail={user?.email}
          profile={profile}
          onUpdateProfile={saveProfileToDB}
        />
      </GradientSection>
    );
  }
  return (
    <GradientSection tab="sales">
      <SalesTrackerTab 
        theme={theme} 
        lastImportDate={lastImportDate} 
        userId={user?.id} 
        userEmail={user?.email}
        sideHustle={profile.sideHustle}
        profile={profile}
      />
    </GradientSection>
  );


// ============================================================================
// CHANGE 6: UPDATE handleMergeProfile FUNCTION (Around line 1804-1811)
// ============================================================================
// ADD sideHustle to the merge:
const mergedProfile = {
  firstName: newProfile.firstName || profile.firstName,
  lastName: newProfile.lastName || profile.lastName,
  email: newProfile.email || profile.email,
  phone: newProfile.phone || profile.phone,
  dateOfBirth: newProfile.dateOfBirth || profile.dateOfBirth,
  gender: newProfile.gender || profile.gender,
  photoUrl: newProfile.photoUrl || profile.photoUrl,
  sidehustleName: newProfile.sidehustleName || profile.sidehustleName,
  sideHustle: newProfile.sideHustle || profile.sideHustle // NEW
};


// ============================================================================
// CHANGE 7: UPDATE loadProfile default object (Around line 3264-3271)
// ============================================================================
// ADD sideHustle to the default profile:
{
  firstName: profile.firstName || '',
  lastName: profile.lastName || '',
  email: profile.email || user?.email || '',
  phone: profile.phone || '',
  dateOfBirth: profile.dateOfBirth || '',
  gender: profile.gender || '',
  photoUrl: profile.photoUrl || '',
  sidehustleName: profile.sidehustleName || '',
  sideHustle: profile.sideHustle || '' // NEW
}


// ============================================================================
// DATABASE MIGRATION (Run in Supabase SQL Editor)
// ============================================================================
/*
-- Add the side_hustle column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS side_hustle TEXT DEFAULT '';

-- Optional: Add comment for documentation
COMMENT ON COLUMN user_profiles.side_hustle IS 'User profession type: real-estate, photographer, hair-stylist, makeup-artist, fitness-trainer, freelance-creative, content-creator, music-dj, consultant, event-planner, ecommerce, handyman, pet-services, notary, general-sales, other';
*/


// ============================================================================
// SIDEBAR BADGE STYLING - NO CHANGES NEEDED
// ============================================================================
// Current styling (lines 3953-4004) is already correct:
// - BETA badge: padding 2px 8px, fontSize 9px, flexShrink 0 ✅
// - ADMIN badge: padding 2px 8px, fontSize 9px, flexShrink 0 ✅  
// - TESTER badge: padding 2px 8px, fontSize 9px, flexShrink 0 ✅
// - OWNER badge: padding 2px 8px, fontSize 9px, flexShrink 0 ✅
// - SiteStatusIndicator is on line 4004 ✅
//
// If the online dot needs resizing, update SiteStatusIndicator component:
// Change the dot from 10px to 8px with flexShrink: 0


// ============================================================================
// SIDE HUSTLE OPTIONS (For reference - used in ManageAccountModal)
// ============================================================================
const SIDE_HUSTLE_OPTIONS = [
  { id: 'real-estate', label: 'Real Estate Agent', icon: '🏠', featured: true },
  { id: 'photographer', label: 'Photographer', icon: '📸' },
  { id: 'hair-stylist', label: 'Hair Stylist', icon: '💇' },
  { id: 'makeup-artist', label: 'Makeup Artist', icon: '💄' },
  { id: 'fitness-trainer', label: 'Fitness Trainer', icon: '💪' },
  { id: 'freelance-creative', label: 'Freelance Creative', icon: '🎨' },
  { id: 'content-creator', label: 'Content Creator', icon: '📱' },
  { id: 'music-dj', label: 'Musician / DJ', icon: '🎵' },
  { id: 'consultant', label: 'Consultant', icon: '💼' },
  { id: 'event-planner', label: 'Event Planner', icon: '🎉' },
  { id: 'ecommerce', label: 'E-commerce Seller', icon: '🛒' },
  { id: 'handyman', label: 'Handyman / Contractor', icon: '🔧' },
  { id: 'pet-services', label: 'Pet Services', icon: '🐕' },
  { id: 'notary', label: 'Notary / Mobile Services', icon: '📋' },
  { id: 'general-sales', label: 'General Sales', icon: '💰' },
  { id: 'other', label: 'Other', icon: '✨' }
];

export { SIDE_HUSTLE_OPTIONS };
