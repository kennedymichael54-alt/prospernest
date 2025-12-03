// ============================================================================
// SUPABASE DATABASE HELPERS
// ProsperNest - Family Finance Dashboard
// All CRUD operations for transactions, retirement, bills, goals, etc.
// ============================================================================

import { supabase } from './supabaseClient';

// ============================================================================
// PROFILE HELPERS
// ============================================================================

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};

export const updateProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  return data;
};

// ============================================================================
// USER SETTINGS HELPERS
// ============================================================================

export const getUserSettings = async (userId) => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching settings:', error);
    return null;
  }
  return data;
};

export const updateUserSettings = async (userId, settings) => {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
  return data;
};

// ============================================================================
// TRANSACTION HELPERS
// ============================================================================

export const getTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(10000);
  
  // Optional filters
  if (options.startDate) {
    query = query.gte('date', options.startDate);
  }
  if (options.endDate) {
    query = query.lte('date', options.endDate);
  }
  if (options.category) {
    query = query.eq('category', options.category);
  }
  if (options.accountType) {
    query = query.eq('account_type', options.accountType);
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
  return data || [];
};

export const addTransaction = async (userId, transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      date: transaction.date,
      description: transaction.description,
      original_description: transaction.originalDescription || transaction.description,
      category: transaction.category,
      amount: transaction.amount,
      status: transaction.status || 'Posted',
      account_type: transaction.accountType || 'personal',
      notes: transaction.notes,
      tags: transaction.tags
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
  return data;
};

export const updateTransaction = async (transactionId, updates) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', transactionId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
  return data;
};

export const deleteTransaction = async (transactionId) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId);
  
  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
  return true;
};

// Bulk insert transactions (for CSV import)
export const bulkInsertTransactions = async (userId, transactions) => {
  const formattedTransactions = transactions.map(t => ({
    user_id: userId,
    date: t.date,
    description: t.description,
    original_description: t.originalDescription || t.description,
    category: t.category || 'Uncategorized',
    amount: parseFloat(t.amount),
    status: t.status || 'Posted',
    account_type: t.accountType || 'personal',
    import_batch_id: new Date().toISOString()
  }));
  
  // Insert in batches of 500 to avoid timeout
  const batchSize = 500;
  let inserted = 0;
  
  for (let i = 0; i < formattedTransactions.length; i += batchSize) {
    const batch = formattedTransactions.slice(i, i + batchSize);
    const { error } = await supabase
      .from('transactions')
      .insert(batch);
    
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      throw error;
    }
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${formattedTransactions.length} transactions`);
  }
  
  return inserted;
};

// Clear all transactions for a user (use with caution!)
export const clearAllTransactions = async (userId) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error clearing transactions:', error);
    throw error;
  }
  return true;
};

// ============================================================================
// RETIREMENT ACCOUNT HELPERS
// ============================================================================

export const getRetirementAccounts = async (userId) => {
  const { data, error } = await supabase
    .from('retirement_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('current_value', { ascending: false });
  
  if (error) {
    console.error('Error fetching retirement accounts:', error);
    return [];
  }
  return data || [];
};

export const addRetirementAccount = async (userId, account) => {
  const { data, error } = await supabase
    .from('retirement_accounts')
    .insert({
      user_id: userId,
      name: account.name,
      account_type: account.type,
      account_number: account.accountNumber,
      institution: account.institution || 'Ameriprise Financial',
      owner_name: account.owner,
      current_value: account.value,
      ytd_return: account.ytdReturn,
      one_year_return: account.oneYearReturn,
      three_year_return: account.threeYearReturn,
      five_year_return: account.fiveYearReturn,
      inception_date: account.inceptionDate,
      risk_tolerance: account.riskTolerance,
      investment_timeframe: account.timeframe
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding retirement account:', error);
    throw error;
  }
  return data;
};

export const updateRetirementAccount = async (accountId, updates) => {
  const { data, error } = await supabase
    .from('retirement_accounts')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', accountId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating retirement account:', error);
    throw error;
  }
  return data;
};

// Bulk insert retirement accounts
export const bulkInsertRetirementAccounts = async (userId, accounts) => {
  const formattedAccounts = accounts.map(a => ({
    user_id: userId,
    name: a.name,
    account_type: a.type,
    account_number: a.accountNumber,
    institution: a.institution || 'Ameriprise Financial',
    owner_name: a.owner,
    current_value: a.value,
    ytd_return: a.ytdReturn,
    one_year_return: a.oneYearReturn,
    three_year_return: a.threeYearReturn,
    five_year_return: a.fiveYearReturn,
    inception_date: a.inceptionDate,
    risk_tolerance: a.riskTolerance,
    investment_timeframe: a.timeframe
  }));
  
  const { data, error } = await supabase
    .from('retirement_accounts')
    .insert(formattedAccounts)
    .select();
  
  if (error) {
    console.error('Error inserting retirement accounts:', error);
    throw error;
  }
  return data;
};

// ============================================================================
// RETIREMENT SNAPSHOT HELPERS
// ============================================================================

export const getRetirementSnapshots = async (userId, months = 12) => {
  const { data, error } = await supabase
    .from('retirement_household_snapshots')
    .select('*')
    .eq('user_id', userId)
    .order('snapshot_date', { ascending: false })
    .limit(months);
  
  if (error) {
    console.error('Error fetching retirement snapshots:', error);
    return [];
  }
  return data || [];
};

export const addRetirementSnapshot = async (userId, snapshot) => {
  const { data, error } = await supabase
    .from('retirement_household_snapshots')
    .upsert({
      user_id: userId,
      snapshot_date: snapshot.snapshotDate,
      month_label: snapshot.month,
      starting_balance: snapshot.startingBalance,
      net_contributions: snapshot.netContributions,
      change_in_value: snapshot.changeInValue,
      ending_balance: snapshot.endingBalance
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding retirement snapshot:', error);
    throw error;
  }
  return data;
};

// Bulk insert retirement snapshots
export const bulkInsertRetirementSnapshots = async (userId, snapshots) => {
  const formattedSnapshots = snapshots.map(s => {
    // Parse month like "November 2025" to date
    const [monthName, year] = s.month.split(' ');
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
    const snapshotDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
    
    return {
      user_id: userId,
      snapshot_date: snapshotDate,
      month_label: s.month,
      starting_balance: s.startingBalance,
      net_contributions: s.netContributions,
      change_in_value: s.changeInValue,
      ending_balance: s.endingBalance
    };
  });
  
  const { data, error } = await supabase
    .from('retirement_household_snapshots')
    .upsert(formattedSnapshots, { onConflict: 'user_id,snapshot_date' })
    .select();
  
  if (error) {
    console.error('Error inserting retirement snapshots:', error);
    throw error;
  }
  return data;
};

// ============================================================================
// BILLS HELPERS
// ============================================================================

export const getBills = async (userId) => {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('due_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching bills:', error);
    return [];
  }
  return data || [];
};

export const addBill = async (userId, bill) => {
  const { data, error } = await supabase
    .from('bills')
    .insert({
      user_id: userId,
      name: bill.name,
      amount: bill.amount,
      due_date: bill.dueDate,
      due_day_of_month: bill.dueDayOfMonth,
      frequency: bill.frequency || 'monthly',
      category: bill.category,
      icon: bill.icon,
      is_autopay: bill.isAutopay || false,
      notes: bill.notes,
      reminder_days: bill.reminderDays || 3
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding bill:', error);
    throw error;
  }
  return data;
};

export const updateBill = async (billId, updates) => {
  const { data, error } = await supabase
    .from('bills')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', billId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating bill:', error);
    throw error;
  }
  return data;
};

export const deleteBill = async (billId) => {
  const { error } = await supabase
    .from('bills')
    .update({ is_active: false })
    .eq('id', billId);
  
  if (error) {
    console.error('Error deleting bill:', error);
    throw error;
  }
  return true;
};

// ============================================================================
// GOALS HELPERS
// ============================================================================

export const getGoals = async (userId) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('priority', { ascending: true });
  
  if (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
  return data || [];
};

export const addGoal = async (userId, goal) => {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      name: goal.name,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount || 0,
      target_date: goal.targetDate,
      category: goal.category,
      icon: goal.icon,
      color: goal.color,
      priority: goal.priority || 1,
      notes: goal.notes
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
  return data;
};

export const updateGoal = async (goalId, updates) => {
  const updateData = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Check if goal is being completed
  if (updates.currentAmount >= updates.targetAmount && !updates.is_completed) {
    updateData.is_completed = true;
    updateData.completed_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('goals')
    .update(updateData)
    .eq('id', goalId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
  return data;
};

export const deleteGoal = async (goalId) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);
  
  if (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
  return true;
};

// ============================================================================
// TASKS HELPERS
// ============================================================================

export const getTasks = async (userId, includeCompleted = false) => {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true });
  
  if (!includeCompleted) {
    query = query.eq('is_completed', false);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  return data || [];
};

export const addTask = async (userId, task) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: task.title,
      description: task.description,
      due_date: task.dueDate,
      priority: task.priority || 'medium',
      category: task.category,
      reminder_at: task.reminderAt
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding task:', error);
    throw error;
  }
  return data;
};

export const updateTask = async (taskId, updates) => {
  const updateData = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  if (updates.is_completed && !updates.completed_at) {
    updateData.completed_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }
  return data;
};

export const deleteTask = async (taskId) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
  return true;
};

// ============================================================================
// BUDGETS HELPERS
// ============================================================================

export const getBudgets = async (userId) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('category', { ascending: true });
  
  if (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
  return data || [];
};

export const setBudget = async (userId, budget) => {
  const { data, error } = await supabase
    .from('budgets')
    .upsert({
      user_id: userId,
      category: budget.category,
      monthly_limit: budget.monthlyLimit,
      color: budget.color,
      icon: budget.icon,
      is_active: true
    }, { onConflict: 'user_id,category' })
    .select()
    .single();
  
  if (error) {
    console.error('Error setting budget:', error);
    throw error;
  }
  return data;
};

export const deleteBudget = async (userId, category) => {
  const { error } = await supabase
    .from('budgets')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('category', category);
  
  if (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
  return true;
};

// ============================================================================
// IMPORT HISTORY HELPERS
// ============================================================================

export const logImport = async (userId, importData) => {
  const { data, error } = await supabase
    .from('import_history')
    .insert({
      user_id: userId,
      import_type: importData.type,
      file_name: importData.fileName,
      records_imported: importData.recordsImported,
      records_skipped: importData.recordsSkipped || 0,
      date_range_start: importData.dateRangeStart,
      date_range_end: importData.dateRangeEnd,
      status: 'completed'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error logging import:', error);
    throw error;
  }
  return data;
};

export const getImportHistory = async (userId) => {
  const { data, error } = await supabase
    .from('import_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('Error fetching import history:', error);
    return [];
  }
  return data || [];
};

// ============================================================================
// COMPREHENSIVE DATA LOADER
// Load all user data in one call (for initial app load)
// ============================================================================

export const loadAllUserData = async (userId) => {
  console.log('📊 Loading all user data for:', userId);
  
  const [
    profile,
    settings,
    transactions,
    retirementAccounts,
    retirementSnapshots,
    bills,
    goals,
    tasks,
    budgets
  ] = await Promise.all([
    getProfile(userId),
    getUserSettings(userId),
    getTransactions(userId),
    getRetirementAccounts(userId),
    getRetirementSnapshots(userId),
    getBills(userId),
    getGoals(userId),
    getTasks(userId),
    getBudgets(userId)
  ]);
  
  console.log('✅ Loaded:', {
    profile: !!profile,
    settings: !!settings,
    transactions: transactions.length,
    retirementAccounts: retirementAccounts.length,
    retirementSnapshots: retirementSnapshots.length,
    bills: bills.length,
    goals: goals.length,
    tasks: tasks.length,
    budgets: budgets.length
  });
  
  return {
    profile,
    settings,
    transactions,
    retirementAccounts,
    retirementSnapshots,
    bills,
    goals,
    tasks,
    budgets
  };
};

// ============================================================================
// DATA MIGRATION HELPER
// Import default data to database for new users
// ============================================================================

export const migrateDefaultDataToDatabase = async (userId, defaultTransactions, defaultRetirementData) => {
  console.log('🚀 Migrating default data to database...');
  
  try {
    // Insert transactions
    if (defaultTransactions?.length) {
      console.log(`📝 Inserting ${defaultTransactions.length} transactions...`);
      await bulkInsertTransactions(userId, defaultTransactions);
    }
    
    // Insert retirement accounts
    if (defaultRetirementData?.accounts?.length) {
      console.log(`📝 Inserting ${defaultRetirementData.accounts.length} retirement accounts...`);
      await bulkInsertRetirementAccounts(userId, defaultRetirementData.accounts);
    }
    
    // Insert retirement snapshots
    if (defaultRetirementData?.monthlyProgress?.length) {
      console.log(`📝 Inserting ${defaultRetirementData.monthlyProgress.length} retirement snapshots...`);
      await bulkInsertRetirementSnapshots(userId, defaultRetirementData.monthlyProgress);
    }
    
    // Log the import
    await logImport(userId, {
      type: 'bank',
      fileName: 'Initial Migration',
      recordsImported: defaultTransactions?.length || 0,
      dateRangeStart: defaultTransactions?.[defaultTransactions.length - 1]?.date,
      dateRangeEnd: defaultTransactions?.[0]?.date
    });
    
    // Update settings with last import date
    await updateUserSettings(userId, {
      last_import_date: new Date().toISOString()
    });
    
    console.log('✅ Migration complete!');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};
