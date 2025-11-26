import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, Plus, Trash2, Download, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Filter, Search, ArrowUpDown } from 'lucide-react';
import { NetWorthDashboard } from './components/NetWorthDashboard';
import { FIRECalculator } from './components/FIRECalculator';
import { GoalsTracker } from './components/GoalsTracker';

// CORRECTED STATE SECTION - COPY THIS ENTIRE BLOCK
// Replace lines 10-50 in your App.jsx with this exact code

const FinanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentDate] = useState(new Date());
  const [lastImportDate, setLastImportDate] = useState(new Date('2024-11-23'));
  const [comparisonView, setComparisonView] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('');
  const [transactionSort, setTransactionSort] = useState('date-desc');
  const [cpaFilter, setCpaFilter] = useState('');
  const [cpaSort, setCpaSort] = useState('date-desc');
  const [selectedRetirementAccountType, setSelectedRetirementAccountType] = useState('');
  const [cpaExportSoftware, setCpaExportSoftware] = useState('xero');

  const [billDates, setBillDates] = useState([
    { id: 1, name: 'Mortgage', amount: 2200, dueDate: '2024-11-20' },
    { id: 2, name: 'Electric Bill', amount: 180, dueDate: '2024-11-23' },
    { id: 3, name: 'Car Insurance', amount: 220, dueDate: '2024-11-28' }
  ]);

  const [budgetData, setBudgetData] = useState({
    income: [
      { id: 1, name: 'Primary Salary', amount: 8500 },
      { id: 2, name: 'Freelance', amount: 2000 }
    ],
    expenses: [
      { id: 1, name: 'Mortgage', amount: 2200 },
      { id: 2, name: 'Utilities', amount: 300 },
      { id: 3, name: 'Groceries', amount: 450 },
      { id: 4, name: 'Insurance', amount: 220 }
    ]
  });
  
  const [marketData, setMarketData] = useState({   
    dow: { value: 44296.51, change: 0.28 },
    sp500: { value: 5969.34, change: 0.35 },
    nasdaq: { value: 19003.65, change: 0.63 }
  });
  
  const [transactions, setTransactions] = useState([
    // Sample data across multiple months for comparison
    { id: 1, date: '2024-11-15', description: 'Salary - Tech Corp', vendor: 'Tech Corp', amount: 8500, type: 'income', category: 'Salary', source: 'Primary Job' },
    { id: 2, date: '2024-11-15', description: 'Freelance Project', vendor: 'ABC Consulting', amount: 2000, type: 'income', category: 'Freelance', source: 'Side Business' },
    { id: 3, date: '2024-11-20', description: 'Mortgage Payment', vendor: 'Bank of America', amount: -2200, type: 'expense', category: 'Housing', source: 'Mortgage' },
    { id: 4, date: '2024-11-22', description: 'Grocery Store', vendor: 'Whole Foods', amount: -450, type: 'expense', category: 'Food', source: 'Groceries' },
    { id: 5, date: '2024-11-23', description: 'Electric Bill', vendor: 'Georgia Power', amount: -180, type: 'expense', category: 'Utilities', source: 'Electric' },
    { id: 6, date: '2024-11-25', description: 'Gas Bill', vendor: 'Atlanta Gas Light', amount: -120, type: 'expense', category: 'Utilities', source: 'Gas' },
    { id: 7, date: '2024-11-28', description: 'Car Insurance', vendor: 'State Farm', amount: -220, type: 'expense', category: 'Insurance', source: 'Auto' },
    { id: 8, date: '2024-11-30', description: 'Restaurant', vendor: 'The Cheesecake Factory', amount: -85, type: 'expense', category: 'Food', source: 'Dining Out' },
    // October data
    { id: 9, date: '2024-10-15', description: 'Salary - Tech Corp', vendor: 'Tech Corp', amount: 8500, type: 'income', category: 'Salary', source: 'Primary Job' },
    { id: 10, date: '2024-10-15', description: 'Freelance Project', vendor: 'XYZ Inc', amount: 1500, type: 'income', category: 'Freelance', source: 'Side Business' },
    { id: 11, date: '2024-10-20', description: 'Mortgage Payment', vendor: 'Bank of America', amount: -2200, type: 'expense', category: 'Housing', source: 'Mortgage' },
    { id: 12, date: '2024-10-22', description: 'Grocery Store', vendor: 'Kroger', amount: -520, type: 'expense', category: 'Food', source: 'Groceries' },
    { id: 13, date: '2024-10-28', description: 'Car Insurance', vendor: 'State Farm', amount: -220, type: 'expense', category: 'Insurance', source: 'Auto' },
    // September data
    { id: 14, date: '2024-09-15', description: 'Salary - Tech Corp', vendor: 'Tech Corp', amount: 8500, type: 'income', category: 'Salary', source: 'Primary Job' },
    { id: 15, date: '2024-09-20', description: 'Mortgage Payment', vendor: 'Bank of America', amount: -2200, type: 'expense', category: 'Housing', source: 'Mortgage' },
    { id: 16, date: '2024-09-22', description: 'Grocery Store', vendor: 'Publix', amount: -480, type: 'expense', category: 'Food', source: 'Groceries' },
    // August data
    { id: 17, date: '2024-08-15', description: 'Salary - Tech Corp', vendor: 'Tech Corp', amount: 8500, type: 'income', category: 'Salary', source: 'Primary Job' },
    { id: 18, date: '2024-08-20', description: 'Mortgage Payment', vendor: 'Bank of America', amount: -2200, type: 'expense', category: 'Housing', source: 'Mortgage' },
    // 2023 data for year comparison
    { id: 19, date: '2023-11-15', description: 'Salary - Tech Corp', vendor: 'Tech Corp', amount: 7500, type: 'income', category: 'Salary', source: 'Primary Job' },
    { id: 20, date: '2023-11-20', description: 'Mortgage Payment', vendor: 'Bank of America', amount: -2000, type: 'expense', category: 'Housing', source: 'Mortgage' },
  ]);

  const [investments, setInvestments] = useState([
  { id: 1, type: '401(k)', accountType: '401k', currentValue: 250000, targetValue: 1000000, contributionRate: 15, uploadDate: new Date().toISOString() },
  { id: 2, type: 'Roth IRA', accountType: 'Roth IRA', currentValue: 85000, targetValue: 500000, contributionRate: 10, uploadDate: new Date().toISOString() },
  { id: 3, type: 'Taxable Brokerage', accountType: 'Traditional IRA', currentValue: 120000, targetValue: 300000, contributionRate: 8, uploadDate: new Date().toISOString() },
  { id: 4, type: 'Real Estate', accountType: 'VUL', currentValue: 180000, targetValue: 500000, contributionRate: 5, uploadDate: new Date().toISOString() },
]);

// UPDATE newTransaction state initialization (around line 100)
const [newTransaction, setNewTransaction] = useState({
  date: '',
  description: '',
  vendor: '',
  amount: '',
  type: 'expense',
  category: '',
  source: '',
  institution: '',
  recurring: false,
  frequency: 'monthly'
});

  const categories = {
    income: ['Salary', 'Freelance', 'Investment Income', 'Other Income'],
    expense: ['Housing', 'Food', 'Utilities', 'Transportation', 'Insurance', 'Healthcare', 'Entertainment', 'Other']
  };

  const retirementAccountTypes = ['401k', 'Roth IRA', 'Traditional IRA', 'VUL', 'IUL'];

// Parse CSV file
const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
};

// Parse PDF file (basic text extraction)
const parsePDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const transactions = [];
        
        lines.forEach(line => {
          const dateMatch = line.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
          const amountMatch = line.match(/\$?\-?([\d,]+\.\d{2})/);
          
          if (dateMatch && amountMatch) {
            const amountIndex = line.indexOf(amountMatch[0]);
            const description = line.substring(0, amountIndex).trim();
            
            transactions.push({
              date: dateMatch[1],
              description: description || 'Transaction',
              amount: amountMatch[1].replace(/,/g, ''),
              category: 'Uncategorized'
            });
          }
        });
        
        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};


  
  // Map transaction description to GL Account
  const mapToGLAccount = (description, category, type) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('mortgage') && desc.includes('interest')) return { number: '6009', description: 'Mortgage Interest (Paid)' };
    if (desc.includes('mortgage')) return { number: '2001', description: 'Mortgage' };
    if (desc.includes('insurance')) return { number: '6006', description: 'Insurance' };
    if (desc.includes('utilities') || desc.includes('electric') || desc.includes('gas') || desc.includes('water')) return { number: '6013', description: 'Utilities' };
    if (desc.includes('maintenance') || desc.includes('repair')) return { number: '6004', description: 'Maintenance' };
    if (desc.includes('travel') || desc.includes('conference')) return { number: '6003', description: 'Travel' };
    if (desc.includes('restaurant') || desc.includes('meal') || desc.includes('dining')) return { number: '6016', description: 'Meals & Entertainment' };
    if (desc.includes('tax')) return { number: '6012', description: 'Taxes' };
    if (desc.includes('salary') || desc.includes('payroll')) return { number: '4007', description: 'Payroll' };
    if (desc.includes('rent')) return { number: '4004', description: 'Rent' };
    if (desc.includes('vehicle') || desc.includes('car')) return { number: '1003', description: 'Vehicles' };
    if (desc.includes('cleaning')) return { number: '6002', description: 'Cleaning Fees' };
    if (desc.includes('advertising')) return { number: '6001', description: 'Advertising' };
    if (desc.includes('commission')) return { number: '6005', description: 'Commissions' };
    if (desc.includes('legal') || desc.includes('professional')) return { number: '6007', description: 'Legal / Professional Fees' };
    if (desc.includes('management')) return { number: '6008', description: 'Management Fees' };
    if (desc.includes('office')) return { number: '6011', description: 'Office Supplies' };
    if (desc.includes('grocery') || desc.includes('groceries')) return { number: '6016', description: 'Meals & Entertainment' };
    if (desc.includes('childcare')) return { number: '6015', description: 'Miscellaneous' };
    if (desc.includes('client gifts')) return { number: '6016', description: 'Meals & Entertainment' };
    
    if (category === 'Housing') return { number: '2001', description: 'Mortgage' };
    if (category === 'Food') return { number: '6016', description: 'Meals & Entertainment' };
    if (category === 'Transportation') return { number: '1003', description: 'Vehicles' };
    if (category === 'Healthcare') return { number: '6015', description: 'Miscellaneous' };
    if (category === 'Entertainment') return { number: '6016', description: 'Meals & Entertainment' };
    
    if (type === 'income') return { number: '4008', description: 'Rental Revenue' };
    
    return { number: '1007', description: 'Cash' };
  };

  // UPDATE THE filteredTransactions useMemo
// Find this section around line 250 and replace it

const filteredTransactions = useMemo(() => {
  // If "All" months selected (-1), show all transactions for the year
  if (selectedMonth === -1) {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === selectedYear;
    });
  }
  
  // Otherwise filter by specific month
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === selectedMonth && 
           transactionDate.getFullYear() === selectedYear;
  });
}, [transactions, selectedMonth, selectedYear]);

  // Calculate totals for selected period
  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return {
      income,
      expenses,
      netIncome: income - expenses
    };
  }, [filteredTransactions]);

  // Helper functions
  const getTransactionsForPeriod = (month, year) => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const getQuarterTransactions = (quarter, year) => {
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    return transactions.filter(t => {
      const date = new Date(t.date);
      const month = date.getMonth();
      return date.getFullYear() === year && month >= startMonth && month <= endMonth;
    });
  };

  // Calculate comparison data
  const comparisonData = useMemo(() => {
    const currentMonth = getTransactionsForPeriod(selectedMonth, selectedYear);
    const lastMonth = selectedMonth === 0 
      ? getTransactionsForPeriod(11, selectedYear - 1)
      : getTransactionsForPeriod(selectedMonth - 1, selectedYear);
    
    const currentMonthIncome = currentMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const lastMonthIncome = lastMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const currentMonthExpenses = currentMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const lastMonthExpenses = lastMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const currentQuarter = Math.floor(selectedMonth / 3) + 1;
    const lastQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
    const lastQuarterYear = currentQuarter === 1 ? selectedYear - 1 : selectedYear;
    
    const currentQuarterTrans = getQuarterTransactions(currentQuarter, selectedYear);
    const lastQuarterTrans = getQuarterTransactions(lastQuarter, lastQuarterYear);
    
    const currentQuarterIncome = currentQuarterTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const lastQuarterIncome = lastQuarterTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const currentQuarterExpenses = currentQuarterTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const lastQuarterExpenses = lastQuarterTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const currentYearTrans = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);
    const lastYearTrans = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear - 1);
    
    const currentYearIncome = currentYearTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const lastYearIncome = lastYearTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const currentYearExpenses = currentYearTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const lastYearExpenses = lastYearTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      monthOverMonth: {
        income: { current: currentMonthIncome, previous: lastMonthIncome, change: lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome * 100) : 0 },
        expenses: { current: currentMonthExpenses, previous: lastMonthExpenses, change: lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100) : 0 }
      },
      quarterOverQuarter: {
        income: { current: currentQuarterIncome, previous: lastQuarterIncome, change: lastQuarterIncome > 0 ? ((currentQuarterIncome - lastQuarterIncome) / lastQuarterIncome * 100) : 0 },
        expenses: { current: currentQuarterExpenses, previous: lastQuarterExpenses, change: lastQuarterExpenses > 0 ? ((currentQuarterExpenses - lastQuarterExpenses) / lastQuarterExpenses * 100) : 0 }
      },
      yearOverYear: {
        income: { current: currentYearIncome, previous: lastYearIncome, change: lastYearIncome > 0 ? ((currentYearIncome - lastYearIncome) / lastYearIncome * 100) : 0 },
        expenses: { current: currentYearExpenses, previous: lastYearExpenses, change: lastYearExpenses > 0 ? ((currentYearExpenses - lastYearExpenses) / lastYearExpenses * 100) : 0 }
      }
    };
  }, [transactions, selectedMonth, selectedYear]);

  // Income/Expense by source for comparison view
  const comparisonSourceData = useMemo(() => {
    if (!comparisonView) return { income: [], expenses: [] };

    let currentPeriod, previousPeriod;

    if (comparisonView === 'month') {
      currentPeriod = getTransactionsForPeriod(selectedMonth, selectedYear);
      previousPeriod = selectedMonth === 0 
        ? getTransactionsForPeriod(11, selectedYear - 1)
        : getTransactionsForPeriod(selectedMonth - 1, selectedYear);
    } else if (comparisonView === 'quarter') {
      const currentQuarter = Math.floor(selectedMonth / 3) + 1;
      const lastQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
      const lastQuarterYear = currentQuarter === 1 ? selectedYear - 1 : selectedYear;
      currentPeriod = getQuarterTransactions(currentQuarter, selectedYear);
      previousPeriod = getQuarterTransactions(lastQuarter, lastQuarterYear);
    } else {
      currentPeriod = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear);
      previousPeriod = transactions.filter(t => new Date(t.date).getFullYear() === selectedYear - 1);
    }

    const incomeBySource = {};
    const expensesByCategory = {};

    currentPeriod.filter(t => t.type === 'income').forEach(t => {
      incomeBySource[t.source] = (incomeBySource[t.source] || 0) + t.amount;
    });

    currentPeriod.filter(t => t.type === 'expense').forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Math.abs(t.amount);
    });

    return {
      income: Object.entries(incomeBySource).map(([name, value]) => ({ name, value })),
      expenses: Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))
    };
  }, [comparisonView, transactions, selectedMonth, selectedYear]);

  // Trend data
  const incomeTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    for (let i = 0; i < 12; i++) {
      const currentYearTrans = getTransactionsForPeriod(i, selectedYear);
      const lastYearTrans = getTransactionsForPeriod(i, selectedYear - 1);
      
      const currentIncome = currentYearTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const lastYearIncome = lastYearTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        month: months[i],
        currentYear: currentIncome,
        lastYear: lastYearIncome
      });
    }
    
    return data;
  }, [transactions, selectedYear]);

  const expenseTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    for (let i = 0; i < 12; i++) {
      const currentYearTrans = getTransactionsForPeriod(i, selectedYear);
      const lastYearTrans = getTransactionsForPeriod(i, selectedYear - 1);
      
      const currentExpenses = currentYearTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const lastYearExpenses = lastYearTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      data.push({
        month: months[i],
        currentYear: currentExpenses,
        lastYear: lastYearExpenses
      });
    }
    
    return data;
  }, [transactions, selectedYear]);

  const incomeBySource = useMemo(() => {
    const grouped = {};
    filteredTransactions.filter(t => t.type === 'income').forEach(t => {
      grouped[t.source] = (grouped[t.source] || 0) + t.amount;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const expensesByCategory = useMemo(() => {
    const grouped = {};
    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  // UPDATE filteredAndSortedTransactions useMemo
// Replace around line 450

const filteredAndSortedTransactions = useMemo(() => {
  let filtered = transactions.filter(t => {
    if (!transactionFilter) return true;
    const searchTerm = transactionFilter.toLowerCase();
    return (
      t.description.toLowerCase().includes(searchTerm) ||
      t.vendor.toLowerCase().includes(searchTerm) ||
      t.category.toLowerCase().includes(searchTerm) ||
      t.source.toLowerCase().includes(searchTerm) ||
      (t.institution && t.institution.toLowerCase().includes(searchTerm))
    );
  });

  return filtered.sort((a, b) => {
    switch (transactionSort) {
      case 'date-desc': return new Date(b.date) - new Date(a.date);
      case 'date-asc': return new Date(a.date) - new Date(b.date);
      case 'amount-desc': return Math.abs(b.amount) - Math.abs(a.amount);
      case 'amount-asc': return Math.abs(a.amount) - Math.abs(b.amount);
      case 'vendor': return a.vendor.localeCompare(b.vendor);
      case 'description': return a.description.localeCompare(b.description);
      case 'category': return a.category.localeCompare(b.category);
      case 'source': return a.source.localeCompare(b.source);
      case 'institution': return (a.institution || '').localeCompare(b.institution || '');
      default: return 0;
    }
  });
}, [transactions, transactionFilter, transactionSort]);

    return filtered.sort((a, b) => {
      switch (transactionSort) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return Math.abs(b.amount) - Math.abs(a.amount);
        case 'amount-asc': return Math.abs(a.amount) - Math.abs(b.amount);
        case 'vendor': return a.vendor.localeCompare(b.vendor);
        default: return 0;
      }
    });
  }, [transactions, transactionFilter, transactionSort]);

  // CPA filtered and sorted
  const cpaFilteredAndSorted = useMemo(() => {
    let filtered = transactions.filter(t => {
      if (!cpaFilter) return true;
      const searchTerm = cpaFilter.toLowerCase();
      const glAccount = mapToGLAccount(t.description, t.category, t.type);
      return (
        t.description.toLowerCase().includes(searchTerm) ||
        t.vendor.toLowerCase().includes(searchTerm) ||
        glAccount.description.toLowerCase().includes(searchTerm)
      );
    });

    return filtered.sort((a, b) => {
      switch (cpaSort) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return Math.abs(b.amount) - Math.abs(a.amount);
        case 'amount-asc': return Math.abs(a.amount) - Math.abs(b.amount);
        case 'vendor': return a.vendor.localeCompare(b.vendor);
        default: return 0;
      }
    });
  }, [transactions, cpaFilter, cpaSort]);

  // ADD THIS NEW useMemo:
const retirementByAccountType = useMemo(() => {
  const grouped = {};
  investments.forEach(inv => {
    grouped[inv.accountType] = (grouped[inv.accountType] || 0) + inv.currentValue;
  });
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}, [investments]);

const getBudgetSummary = useMemo(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const totalIncome = budgetData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = budgetData.expenses.reduce((sum, item) => sum + item.amount, 0);
  
  return months.map((month) => ({
    month,
    income: totalIncome,
    expenses: totalExpenses,
    net: totalIncome - totalExpenses
  }));
}, [budgetData]);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

 // UPDATE handleAddTransaction function (around line 800)
const handleAddTransaction = () => {
  if (newTransaction.date && newTransaction.description && newTransaction.amount && newTransaction.vendor) {
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount) * (newTransaction.type === 'expense' ? -1 : 1)
    };
    
    setTransactions([...transactions, transaction]);
    
    // If recurring expense, automatically add to bill dates
    if (newTransaction.recurring && newTransaction.type === 'expense') {
      const transactionDate = new Date(newTransaction.date);
      
      // Calculate next occurrence based on frequency
      const getNextDate = (date, frequency) => {
        const next = new Date(date);
        switch (frequency) {
          case 'weekly':
            next.setDate(next.getDate() + 7);
            break;
          case 'bi-weekly':
            next.setDate(next.getDate() + 14);
            break;
          case 'monthly':
          default:
            next.setMonth(next.getMonth() + 1);
            break;
        }
        return next;
      };
      
      const nextDueDate = getNextDate(transactionDate, newTransaction.frequency);
      
      // Add to bill dates calendar
      const newBill = {
        id: Date.now() + 1, // Ensure unique ID
        name: newTransaction.description,
        amount: Math.abs(parseFloat(newTransaction.amount)),
        dueDate: nextDueDate.toISOString().split('T')[0],
        recurring: true,
        frequency: newTransaction.frequency
      };
      
      setBillDates([...billDates, newBill]);
      
      // Show confirmation message
      alert(`✅ Transaction added and scheduled as recurring ${newTransaction.frequency} bill starting ${nextDueDate.toLocaleDateString()}`);
    }
    
    setNewTransaction({ 
      date: '', 
      description: '', 
      vendor: '', 
      amount: '', 
      type: 'expense', 
      category: '', 
      source: '',
      institution: '',
      recurring: false,
      frequency: 'monthly'
    });
    setLastImportDate(new Date());
  }
};

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    if (file.name.toLowerCase().endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const parsed = parseCSV(text);
          const newTransactions = [];
          
          for (let i = 0; i < parsed.length; i++) {
            const row = parsed[i];
            if (row.date || row.Date) {
              newTransactions.push({
                id: Date.now() + i,
                date: row.date || row.Date,
                description: row.description || row.Description || 'Transaction',
                vendor: row.vendor || row.Vendor || 'Unknown',
                amount: parseFloat(row.amount || row.Amount || '0'),
                type: parseFloat(row.amount || row.Amount || '0') > 0 ? 'income' : 'expense',
                category: row.category || row.Category || 'Uncategorized',
                source: row.source || row.Source || 'Unknown'
              });
            }
          }
          
          if (newTransactions.length > 0) {
            setTransactions([...transactions, ...newTransactions]);
            setLastImportDate(new Date());
            alert(`Successfully imported ${newTransactions.length} transactions from CSV`);
          }
        } catch (error) {
          alert('Error parsing CSV file. Please ensure it follows the correct format.');
        }
      };
      reader.readAsText(file);
    } else if (file.name.toLowerCase().endsWith('.pdf')) {
      const parsed = await parsePDF(file);
      const newTransactions = [];
      
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        const amount = parseFloat(item.amount);
        newTransactions.push({
          id: Date.now() + i,
          date: item.date,
          description: item.description,
          vendor: item.description.split(' ')[0] || 'Unknown',
          amount: amount,
          type: amount > 0 ? 'income' : 'expense',
          category: item.category || 'Uncategorized',
          source: 'PDF Import'
        });
      }
      
      if (newTransactions.length > 0) {
        setTransactions([...transactions, ...newTransactions]);
        setLastImportDate(new Date());
        alert(`Successfully imported ${newTransactions.length} transactions from PDF`);
      } else {
        alert('No transaction data found in PDF.');
      }
    } else {
      alert('Please upload a CSV or PDF file');
    }
  } catch (error) {
    alert('Error processing file: ' + error.message);
  }
};

  // ADD THIS ENTIRE NEW FUNCTION HERE:
const handleRetirementFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!selectedRetirementAccountType) {
    alert('Please select an account type before uploading');
    return;
  }

  try {
    if (file.name.toLowerCase().endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const parsed = parseCSV(text);
          
          let totalValue = 0;
          parsed.forEach(row => {
            const value = parseFloat(
              row.value || row.Value || 
              row.balance || row.Balance || 
              row.amount || row.Amount || '0'
            );
            if (!isNaN(value)) {
              totalValue += Math.abs(value);
            }
          });

          if (totalValue > 0) {
            const newInvestment = {
              id: Date.now(),
              type: selectedRetirementAccountType,
              accountType: selectedRetirementAccountType,
              currentValue: totalValue,
              targetValue: totalValue * 2,
              contributionRate: 10,
              uploadDate: new Date().toISOString()
            };
            
            setInvestments([...investments, newInvestment]);
            setLastImportDate(new Date());
            alert(`Successfully imported ${selectedRetirementAccountType} account with value $${totalValue.toLocaleString()}`);
            setSelectedRetirementAccountType('');
          } else {
            alert('No valid balance data found in CSV');
          }
        } catch (error) {
          alert('Error parsing CSV file: ' + error.message);
        }
      };
      reader.readAsText(file);
    } else if (file.name.toLowerCase().endsWith('.pdf')) {
      const parsed = await parsePDF(file);
      
      let totalValue = 0;
      parsed.forEach(item => {
        const value = Math.abs(parseFloat(item.amount));
        if (!isNaN(value)) {
          totalValue += value;
        }
      });

      if (totalValue > 0) {
        const newInvestment = {
          id: Date.now(),
          type: selectedRetirementAccountType,
          accountType: selectedRetirementAccountType,
          currentValue: totalValue,
          targetValue: totalValue * 2,
          contributionRate: 10,
          uploadDate: new Date().toISOString()
        };

      
        setInvestments([...investments, newInvestment]);
        setLastImportDate(new Date());
        alert(`Successfully imported ${selectedRetirementAccountType} from PDF with value $${totalValue.toLocaleString()}`);
        setSelectedRetirementAccountType('');
      } else {
        alert('No valid balance data found in PDF');
      }
    } else {
      alert('Please upload a CSV or PDF file');
    }
  } catch (error) {
    alert('Error processing file: ' + error.message);
  }
};

  // Add bill date
const addBillDate = (bill) => {
  setBillDates([...billDates, { ...bill, id: Date.now() }]);
};

// Delete bill
const deleteBill = (id) => {
  setBillDates(billDates.filter(bill => bill.id !== id));
};

// Add income source
const addIncome = (income) => {
  setBudgetData({
    ...budgetData,
    income: [...budgetData.income, { ...income, id: Date.now() }]
  });
};

// Delete income
const deleteIncome = (id) => {
  setBudgetData({
    ...budgetData,
    income: budgetData.income.filter(item => item.id !== id)
  });
};

// Add expense
const addExpense = (expense) => {
  setBudgetData({
    ...budgetData,
    expenses: [...budgetData.expenses, { ...expense, id: Date.now() }]
  });
};

// Delete expense
const deleteExpense = (id) => {
  setBudgetData({
    ...budgetData,
    expenses: budgetData.expenses.filter(item => item.id !== id)
  });
};

  // ... (existing function continues)

  const exportCPAData = () => {
    const headers = ['Date', 'Description', 'Vendor', 'Amount', 'Outflow/Inflow', 'GL Account', 'GL Account Offset'];
    const rows = cpaFilteredAndSorted.map(t => {
      const glAccount = mapToGLAccount(t.description, t.category, t.type);
      const isOutflow = t.amount < 0;
      
      return [
        t.date,
        t.description,
        t.vendor,
        Math.abs(t.amount).toFixed(2),
        isOutflow ? 'Outflow' : 'Inflow',
        `${glAccount.number} ${glAccount.description}`,
        '1007 Cash'
      ];
    });
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cpa-export.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  HomeBudget Hub
                </h1>
                <div className="relative">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                    BETA
                  </div>
                </div>
              </div>
              <p className="text-slate-300">🌱 Grow your finances now, safeguard your family forever.</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-slate-300 mb-1">
                <Calendar size={20} />
                <span className="text-sm">Current Date</span>
              </div>
              <p className="text-xl font-semibold text-white mb-3">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="text-sm text-slate-400">
                <span>Last Import: </span>
                <span className="text-slate-300">{lastImportDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
<div className="flex gap-2 mb-6 border-b border-slate-700">
  {['dashboard', 'transactions', 'billHistory', 'budget', 'retirement', 'cpa'].map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 font-medium transition-all ${
        activeTab === tab
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg'
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {tab === 'cpa' ? 'CPA Export' : 
       tab === 'billHistory' ? 'Bill History' :
       tab.charAt(0).toUpperCase() + tab.slice(1)}
    </button>
  ))}
</div>
        // DASHBOARD TAB - UPDATED SECTION
// Replace the "Dashboard Tab" section in your app.jsx (around line 1000-1400)

{activeTab === 'dashboard' && (
  <div className="space-y-6">
    {/* Date Selector */}
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Select Period</h3>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm text-slate-300 mb-2">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={-1}>All Months</option>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-slate-300 mb-2">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      {selectedMonth === -1 && (
        <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-sm text-blue-300">
            📊 Showing totals for entire year {selectedYear}. Comparison views are disabled for full-year view.
          </p>
        </div>
      )}
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-green-300">Total Income</h3>
          <TrendingUp className="text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white">${totals.income.toLocaleString()}</p>
        {selectedMonth === -1 && (
          <p className="text-sm text-green-300 mt-2">Full year {selectedYear}</p>
        )}
      </div>

      <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-red-300">Total Expenses</h3>
          <TrendingDown className="text-red-400" />
        </div>
        <p className="text-3xl font-bold text-white">${totals.expenses.toLocaleString()}</p>
        {selectedMonth === -1 && (
          <p className="text-sm text-red-300 mt-2">Full year {selectedYear}</p>
        )}
      </div>

      <div className={`bg-gradient-to-br ${totals.netIncome >= 0 ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'from-orange-500/20 to-orange-600/20 border-orange-500/30'} backdrop-blur-sm border rounded-xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-lg font-semibold ${totals.netIncome >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>Net Income</h3>
          <DollarSign className={totals.netIncome >= 0 ? 'text-blue-400' : 'text-orange-400'} />
        </div>
        <p className="text-3xl font-bold text-white">${totals.netIncome.toLocaleString()}</p>
        {selectedMonth === -1 && (
          <p className="text-sm text-blue-300 mt-2">Full year {selectedYear}</p>
        )}
      </div>
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">
          Income by Source
          {selectedMonth === -1 && ` (${selectedYear} Total)`}
        </h3>
        {incomeBySource.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeBySource}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeBySource.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            No income data for selected period
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">
          Expenses by Category
          {selectedMonth === -1 && ` (${selectedYear} Total)`}
        </h3>
        {expensesByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expensesByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            No expense data for selected period
          </div>
        )}
      </div>
    </div>

    {/* Comparison Selector - Only show if NOT viewing all months */}
    {selectedMonth !== -1 && (
      <>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">View Comparisons</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setComparisonView(comparisonView === 'month' ? '' : 'month')}
              className={`px-6 py-3 rounded-lg transition-all ${
                comparisonView === 'month'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Month over Month
            </button>
            <button
              onClick={() => setComparisonView(comparisonView === 'quarter' ? '' : 'quarter')}
              className={`px-6 py-3 rounded-lg transition-all ${
                comparisonView === 'quarter'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Quarter over Quarter
            </button>
            <button
              onClick={() => setComparisonView(comparisonView === 'year' ? '' : 'year')}
              className={`px-6 py-3 rounded-lg transition-all ${
                comparisonView === 'year'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Year over Year
            </button>
          </div>
        </div>

        {/* Rest of comparison views - only shown when comparisonView is active */}
        {comparisonView && (
          // ... existing comparison code remains the same ...
        )}
      </>
    )}
  </div>
)}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-green-300">Total Income</h3>
                  <TrendingUp className="text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">${totals.income.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-red-300">Total Expenses</h3>
                  <TrendingDown className="text-red-400" />
                </div>
                <p className="text-3xl font-bold text-white">${totals.expenses.toLocaleString()}</p>
              </div>

              <div className={`bg-gradient-to-br ${totals.netIncome >= 0 ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'from-orange-500/20 to-orange-600/20 border-orange-500/30'} backdrop-blur-sm border rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-semibold ${totals.netIncome >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>Net Income</h3>
                  <DollarSign className={totals.netIncome >= 0 ? 'text-blue-400' : 'text-orange-400'} />
                </div>
                <p className="text-3xl font-bold text-white">${totals.netIncome.toLocaleString()}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Income by Source</h3>
                {incomeBySource.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incomeBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {incomeBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-400">
                    No income data for selected period
                  </div>
                )}
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Expenses by Category</h3>
                {expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={expensesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                      <Bar dataKey="value" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-400">
                    No expense data for selected period
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Selector */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">View Comparisons</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setComparisonView(comparisonView === 'month' ? '' : 'month')}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    comparisonView === 'month'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Month over Month
                </button>
                <button
                  onClick={() => setComparisonView(comparisonView === 'quarter' ? '' : 'quarter')}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    comparisonView === 'quarter'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Quarter over Quarter
                </button>
                <button
                  onClick={() => setComparisonView(comparisonView === 'year' ? '' : 'year')}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    comparisonView === 'year'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Year over Year
                </button>
              </div>
            </div>

            {/* Comparison Details */}
            {comparisonView && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      {comparisonView === 'month' ? 'Month over Month' : comparisonView === 'quarter' ? 'Quarter over Quarter' : 'Year over Year'} - Income
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Current Period</span>
                        <span className="font-semibold">${comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].income.current.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Previous Period</span>
                        <span className="font-semibold">${comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].income.previous.toLocaleString()}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-700">
                        <div className={`flex items-center justify-between ${comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].income.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <span className="font-semibold">Change</span>
                          <div className="flex items-center gap-2">
                            {comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].income.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            <span className="font-bold">{Math.abs(comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].income.change).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      {comparisonView === 'month' ? 'Month over Month' : comparisonView === 'quarter' ? 'Quarter over Quarter' : 'Year over Year'} - Expenses
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Current Period</span>
                        <span className="font-semibold">${comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].expenses.current.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Previous Period</span>
                        <span className="font-semibold">${comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].expenses.previous.toLocaleString()}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-700">
                        <div className={`flex items-center justify-between ${comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].expenses.change < 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <span className="font-semibold">Change</span>
                          <div className="flex items-center gap-2">
                            {comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].expenses.change < 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                            <span className="font-bold">{Math.abs(comparisonData[comparisonView === 'month' ? 'monthOverMonth' : comparisonView === 'quarter' ? 'quarterOverQuarter' : 'yearOverYear'].expenses.change).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Income Trends */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Income Trends - {selectedYear} vs {selectedYear - 1}</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={incomeTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        formatter={(value) => `$${value.toLocaleString()}`} 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="currentYear" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        name={`${selectedYear}`}
                        dot={{ fill: '#10B981', r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lastYear" 
                        stroke="#34D399" 
                        strokeWidth={3}
                        name={`${selectedYear - 1}`}
                        dot={{ fill: '#34D399', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Income Sources Chart */}
                {comparisonSourceData.income.length > 0 && (
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Top Income Sources - Current Period</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonSourceData.income}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        <Bar dataKey="value" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Expense Trends */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Expense Trends - {selectedYear} vs {selectedYear - 1}</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={expenseTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        formatter={(value) => `$${value.toLocaleString()}`} 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="currentYear" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        name={`${selectedYear}`}
                        dot={{ fill: '#8B5CF6', r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lastYear" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        name={`${selectedYear - 1}`}
                        dot={{ fill: '#3B82F6', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Expense Categories Chart */}
                {comparisonSourceData.expenses.length > 0 && (
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Top Expense Categories - Current Period</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonSourceData.expenses}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        <Bar dataKey="value" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </div>
        )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-4 mb-4">
  <input
    type="date"
    value={newTransaction.date}
    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <input
    type="text"
    placeholder="Description"
    value={newTransaction.description}
    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <input
    type="text"
    placeholder="Vendor"
    value={newTransaction.vendor}
    onChange={(e) => setNewTransaction({ ...newTransaction, vendor: e.target.value })}
    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <input
    type="number"
    placeholder="Amount"
    value={newTransaction.amount}
    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <select
    value={newTransaction.type}
    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value, category: '' })}
    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>
  <select
    value={newTransaction.category}
    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="">Select Category</option>
    {categories[newTransaction.type].map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>
  <input
    type="text"
    placeholder="Source"
    value={newTransaction.source}
    onChange={(e) => setNewTransaction({ ...newTransaction, source: e.target.value })}
    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <select
    value={newTransaction.institution}
    onChange={(e) => setNewTransaction({ ...newTransaction, institution: e.target.value })}
    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="">Institution</option>
    <option value="Chase">Chase</option>
    <option value="Bank of America">Bank of America</option>
    <option value="Wells Fargo">Wells Fargo</option>
    <option value="Citi">Citi</option>
    <option value="Capital One">Capital One</option>
    <option value="American Express">American Express</option>
    <option value="Discover">Discover</option>
    <option value="Other">Other</option>
  </select>
  <select
    value={newTransaction.recurring ? 'recurring' : 'one-time'}
    onChange={(e) => setNewTransaction({ ...newTransaction, recurring: e.target.value === 'recurring' })}
    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    <option value="one-time">One-time</option>
    <option value="recurring">Recurring</option>
  </select>
</div>

{/* Frequency selector - only show if recurring */}
{newTransaction.recurring && (
  <div className="mb-4">
    <label className="block text-sm text-slate-300 mb-2">Frequency</label>
    <select
      value={newTransaction.frequency}
      onChange={(e) => setNewTransaction({ ...newTransaction, frequency: e.target.value })}
      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="weekly">Weekly</option>
      <option value="bi-weekly">Bi-weekly</option>
      <option value="monthly">Monthly</option>
    </select>
  </div>
)}

<button
  onClick={handleAddTransaction}
  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all"
>
  <Plus size={20} />
  Add Transaction
</button>
      
  
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-600">
          <th className="text-left py-3 px-4">
            <button
              onClick={() => setTransactionSort(transactionSort === 'date-desc' ? 'date-asc' : 'date-desc')}
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
            >
              Date
              <ArrowUpDown size={16} />
            </button>
          </th>
          <th className="text-left py-3 px-4">
            <button
              onClick={() => setTransactionSort('description')}
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
            >
              Description
              <ArrowUpDown size={16} />
            </button>
          </th>
          <th className="text-left py-3 px-4">
            <button
              onClick={() => setTransactionSort('vendor')}
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
            >
              Vendor
              <ArrowUpDown size={16} />
            </button>
          </th>
          <th className="text-left py-3 px-4">
            <button
              onClick={() => setTransactionSort('category')}
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
            >
              Category
              <ArrowUpDown size={16} />
            </button>
          </th>
          <th className="text-left py-3 px-4">
            <button
              onClick={() => setTransactionSort('source')}
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
            >
              Source
              <ArrowUpDown size={16} />
            </button>
          </th>
          <th className="text-left py-3 px-4">
            <button
              onClick={() => setTransactionSort('institution')}
              className="flex items-center gap-2 hover:text-purple-400 transition-colors"
            >
              Institution
              <ArrowUpDown size={16} />
            </button>
          </th>
          <th className="text-left py-3 px-4">Recurring</th>
          <th className="text-left py-3 px-4">Frequency</th>
          <th className="text-right py-3 px-4">
            <button
              onClick={() => setTransactionSort(transactionSort === 'amount-desc' ? 'amount-asc' : 'amount-desc')}
              className="flex items-center gap-2 ml-auto hover:text-purple-400 transition-colors"
            >
              Amount
              <ArrowUpDown size={16} />
            </button>
          </th>
          <th className="text-center py-3 px-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredAndSortedTransactions.map(t => (
          <tr key={t.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
            <td className="py-3 px-4">{t.date}</td>
            <td className="py-3 px-4">{t.description}</td>
            <td className="py-3 px-4">{t.vendor}</td>
            <td className="py-3 px-4">{t.category}</td>
            <td className="py-3 px-4">{t.source}</td>
            <td className="py-3 px-4">
              <span className="px-2 py-1 bg-slate-700 rounded text-xs">
                {t.institution || 'Manual'}
              </span>
            </td>
            <td className="py-3 px-4">
              <span className={`px-2 py-1 rounded text-xs ${t.recurring ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700 text-slate-400'}`}>
                {t.recurring ? 'Recurring' : 'One-time'}
              </span>
            </td>
            <td className="py-3 px-4">
              {t.recurring && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                  {t.frequency || 'Monthly'}
                </span>
              )}
            </td>
            <td className={`py-3 px-4 text-right font-semibold ${t.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {t.amount >= 0 ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </td>
            <td className="py-3 px-4 text-center">
              <button
                onClick={() => handleDeleteTransaction(t.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


{/* Bill History Tab - NEW */}
        {activeTab === 'billHistory' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Add New Bill</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Bill Name</label>
                  <input
                    type="text"
                    id="bill-name"
                    placeholder="e.g., Electric Bill"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Amount</label>
                  <input
                    type="number"
                    id="bill-amount"
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    id="bill-date"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  const name = document.getElementById('bill-name').value;
                  const amount = parseFloat(document.getElementById('bill-amount').value);
                  const dueDate = document.getElementById('bill-date').value;
                  
                  if (name && amount && dueDate) {
                    addBillDate({ name, amount, dueDate });
                    document.getElementById('bill-name').value = '';
                    document.getElementById('bill-amount').value = '';
                    document.getElementById('bill-date').value = '';
                  } else {
                    alert('Please fill in all fields');
                  }
                }}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all"
              >
                <Plus size={20} />
                Add Bill
              </button>
            </div>

            {/* Calendar */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  ← Previous
                </button>
                <h3 className="text-2xl font-semibold">
                  {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-bold text-slate-400 py-2">
                    {day}
                  </div>
                ))}
                
                {(() => {
                  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
                  const days = [];
                  
                  // Empty cells for days before month starts
                  for (let i = 0; i < firstDay; i++) {
                    days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
                  }
                  
                  // Days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const billsOnDay = billDates.filter(bill => {
                      const billDate = new Date(bill.dueDate);
                      return billDate.getDate() === day && 
                             billDate.getMonth() === selectedMonth && 
                             billDate.getFullYear() === selectedYear;
                    });
                    
                    days.push(
                      <div
                        key={day}
                        className="aspect-square border border-slate-600 rounded-lg p-2 bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="font-semibold text-sm mb-1">{day}</div>
                        {billsOnDay.map((bill) => (
                          <div
                            key={bill.id}
                            className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-1 py-0.5 mb-1 truncate"
                            title={`${bill.name}: $${bill.amount}`}
                          >
                            {bill.name}
                          </div>
                        ))}
                      </div>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>

            {/* Bills List */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">All Bills</h3>
              <div className="space-y-3">
                {billDates.map(bill => (
                  <div key={bill.id} className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <div className="font-semibold">{bill.name}</div>
                      <div className="text-sm text-slate-400">
                        Due: {new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold">${bill.amount.toFixed(2)}</div>
                      <button
                        onClick={() => deleteBill(bill.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        
{/* Budget Tab - NEW */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            
            {/* Income Section with Proportional Bars */}
<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
  <h3 className="text-2xl font-semibold mb-4 text-green-400">Income Sources</h3>
  
  {/* Add Income Form */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div>
      <label className="block text-sm text-slate-300 mb-2">Source Name</label>
      <input
        type="text"
        id="income-name"
        placeholder="e.g., Salary"
        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
    <div>
      <label className="block text-sm text-slate-300 mb-2">Monthly Amount</label>
      <input
        type="number"
        id="income-amount"
        placeholder="0.00"
        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
    <div className="flex items-end">
      <button
        onClick={() => {
          const name = document.getElementById('income-name').value;
          const amount = parseFloat(document.getElementById('income-amount').value);
          
          if (name && amount) {
            addIncome({ name, amount });
            document.getElementById('income-name').value = '';
            document.getElementById('income-amount').value = '';
          } else {
            alert('Please fill in all fields');
          }
        }}
        className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Income
      </button>
    </div>
  </div>

  {/* Income List with Proportional Bars */}
  <div className="space-y-2">
    {(() => {
      const maxIncome = Math.max(...budgetData.income.map(item => item.amount), 1);
      return budgetData.income.map(item => {
        const percentage = (item.amount / maxIncome) * 100;
        return (
          <div key={item.id} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-green-400 font-bold">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <button
                  onClick={() => deleteIncome(item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {/* Proportional Bar */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${percentage}%` }}
              >
                {percentage > 15 && (
                  <span className="text-xs font-semibold text-white">
                    {((item.amount / budgetData.income.reduce((sum, i) => sum + i.amount, 0)) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      });
    })()}
  </div>
</div>

            {/* Expense Section with Proportional Bars */}
<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
  <h3 className="text-2xl font-semibold mb-4 text-red-400">Expenses</h3>
  
  {/* Add Expense Form */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div>
      <label className="block text-sm text-slate-300 mb-2">Expense Name</label>
      <input
        type="text"
        id="expense-name"
        placeholder="e.g., Rent"
        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
    <div>
      <label className="block text-sm text-slate-300 mb-2">Monthly Amount</label>
      <input
        type="number"
        id="expense-amount"
        placeholder="0.00"
        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
    <div className="flex items-end">
      <button
        onClick={() => {
          const name = document.getElementById('expense-name').value;
          const amount = parseFloat(document.getElementById('expense-amount').value);
          
          if (name && amount) {
            addExpense({ name, amount });
            document.getElementById('expense-name').value = '';
            document.getElementById('expense-amount').value = '';
          } else {
            alert('Please fill in all fields');
          }
        }}
        className="w-full px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Expense
      </button>
    </div>
  </div>

  {/* Expense List with Proportional Bars */}
  <div className="space-y-2">
    {(() => {
      const maxExpense = Math.max(...budgetData.expenses.map(item => item.amount), 1);
      return budgetData.expenses.map(item => {
        const percentage = (item.amount / maxExpense) * 100;
        return (
          <div key={item.id} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-bold">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <button
                  onClick={() => deleteExpense(item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {/* Proportional Bar */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${percentage}%` }}
              >
                {percentage > 15 && (
                  <span className="text-xs font-semibold text-white">
                    {((item.amount / budgetData.expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      });
    })()}
  </div>
</div>


            {/* Yearly Summary */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Yearly Budget Summary</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Total Monthly Income</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${budgetData.income.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Total Monthly Expenses</div>
                  <div className="text-2xl font-bold text-red-400">
                    ${budgetData.expenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Monthly Net</div>
                  <div className={`text-2xl font-bold ${(budgetData.income.reduce((sum, item) => sum + item.amount, 0) - budgetData.expenses.reduce((sum, item) => sum + item.amount, 0)) >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                    ${(budgetData.income.reduce((sum, item) => sum + item.amount, 0) - budgetData.expenses.reduce((sum, item) => sum + item.amount, 0)).toLocaleString()}
                  </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Yearly Net</div>
                  <div className={`text-2xl font-bold ${(budgetData.income.reduce((sum, item) => sum + item.amount, 0) - budgetData.expenses.reduce((sum, item) => sum + item.amount, 0)) >= 0 ? 'text-purple-400' : 'text-orange-400'}`}>
                    ${((budgetData.income.reduce((sum, item) => sum + item.amount, 0) - budgetData.expenses.reduce((sum, item) => sum + item.amount, 0)) * 12).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {getBudgetSummary.map((month, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4 text-center">
                    <div className="text-sm font-semibold text-slate-400 mb-2">{month.month}</div>
                    <div className="text-xs text-green-400 mb-1">+${month.income.toLocaleString()}</div>
                    <div className="text-xs text-red-400 mb-2">-${month.expenses.toLocaleString()}</div>
                    <div className={`text-lg font-bold ${month.net >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                      ${Math.abs(month.net).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={getBudgetSummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#10B981" />
                  <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
                  <Bar dataKey="net" name="Net" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
  
  

{/* Retirement Tab */}
        {activeTab === 'retirement' && (
          <div className="space-y-6">
            
            {/* Market Performance */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Market Performance - {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Dow Jones</div>
                  <div className="text-2xl font-bold text-white">{marketData.dow.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className={`text-sm font-semibold ${marketData.dow.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {marketData.dow.change >= 0 ? '+' : ''}{marketData.dow.change}%
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">S&P 500</div>
                  <div className="text-2xl font-bold text-white">{marketData.sp500.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className={`text-sm font-semibold ${marketData.sp500.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {marketData.sp500.change >= 0 ? '+' : ''}{marketData.sp500.change}%
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">NASDAQ</div>
                  <div className="text-2xl font-bold text-white">{marketData.nasdaq.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className={`text-sm font-semibold ${marketData.nasdaq.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {marketData.nasdaq.change >= 0 ? '+' : ''}{marketData.nasdaq.change}%
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Section with Account Type Selector */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Import Retirement Account Statement</h3>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-300">
                  <strong>💡 Enhanced Import:</strong> Upload CSV or PDF statements from Ameriprise, Morgan Stanley, Fidelity, and other providers. Select your account type first!
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-2">Account Type</label>
                <select
                  value={selectedRetirementAccountType}
                  onChange={(e) => setSelectedRetirementAccountType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select account type...</option>
                  {retirementAccountTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
                <Upload size={24} />
                <span className="text-lg font-semibold">Upload Statement (CSV or PDF)</span>
                <input 
                  type="file" 
                  accept=".csv,.pdf" 
                  onChange={handleRetirementFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {investments.map(inv => {
                const progress = (inv.currentValue / inv.targetValue) * 100;
                return (
                  <div key={inv.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{inv.type}</h3>
                        <p className="text-sm text-slate-400">Account Type: {inv.accountType}</p>
                      </div>
                      <Target className="text-purple-400" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Current Value</span>
                          <span className="font-semibold">${inv.currentValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Target Value</span>
                          <span className="font-semibold">${inv.targetValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-slate-400">Contribution Rate</span>
                          <span className="font-semibold">{inv.contributionRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-slate-400">Last Updated</span>
                          <span className="font-semibold">{new Date(inv.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Progress</span>
                          <span className="font-semibold text-purple-400">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Retirement Value */}
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Total Retirement Value</h3>
              <p className="text-5xl font-bold text-white">
                ${investments.reduce((sum, inv) => sum + inv.currentValue, 0).toLocaleString()}
              </p>
            </div>

            {/* Retirement Breakdown by Account Type */}
            {retirementByAccountType.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Breakdown by Account Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={retirementByAccountType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {retirementByAccountType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Retirement Overview Bar Chart */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Retirement Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={investments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  />
                  <Legend />
                  <Bar dataKey="currentValue" name="Current Value" fill="#3B82F6" />
                  <Bar dataKey="targetValue" name="Target Value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}


 {activeTab === 'cpa' && (
  <div className="space-y-6">
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-semibold mb-4">CPA Export</h3>
      <p className="text-slate-300 mb-6">
        Export your transaction data in a format ready for your accountant or tax professional.
        Select your accounting software below.
      </p>
      
      {/* Software Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Export Format
        </label>
        <select
          value={cpaExportSoftware}
          onChange={(e) => setCpaExportSoftware(e.target.value)}
          className="w-full md:w-64 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
        >
          <option value="quickbooks">QuickBooks</option>
          <option value="xero">Xero</option>
          <option value="turbotax">TurboTax</option>
        </select>
      </div>

      <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-3">Export includes:</h4>
        <ul className="list-disc list-inside text-slate-300 space-y-1">
          <li>Transaction date, description, and vendor</li>
          <li>Amount with outflow/inflow indicator</li>
          <li>GL Account mapping based on transaction details</li>
          <li>GL Account Offset (1007 Cash)</li>
          <li>
            Format optimized for {' '}
            {cpaExportSoftware === 'quickbooks' && 'QuickBooks Desktop & Online'}
            {cpaExportSoftware === 'xero' && 'Xero Accounting'}
            {cpaExportSoftware === 'turbotax' && 'TurboTax'}
          </li>
        </ul>
      </div>

      {/* Software-specific notes */}
      {cpaExportSoftware === 'quickbooks' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-300">
            <strong>💡 QuickBooks:</strong> This export uses the IIF format compatible with QuickBooks Desktop. 
            For QuickBooks Online, you can import via the Banking → File Upload feature.
          </p>
        </div>
      )}

      {cpaExportSoftware === 'xero' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-300">
            <strong>💡 Xero:</strong> This export is formatted for Xero's bank statement import. 
            Import via Accounting → Bank Accounts → Manage Account → Import a Statement.
          </p>
        </div>
      )}

      {cpaExportSoftware === 'turbotax' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-300">
            <strong>💡 TurboTax:</strong> This export provides a transaction summary suitable for 
            Schedule C (business) or investment income reporting. Review with your tax professional.
          </p>
        </div>
      )}

      <button
        onClick={exportCPAData}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg transition-all text-lg font-semibold"
      >
        <Download size={20} />
        Export for {cpaExportSoftware === 'quickbooks' ? 'QuickBooks' : cpaExportSoftware === 'xero' ? 'Xero' : 'TurboTax'}
      </button>
    </div>

    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Preview</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Filter..."
              value={cpaFilter}
              onChange={(e) => setCpaFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={cpaSort}
            onChange={(e) => setCpaSort(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High-Low)</option>
            <option value="amount-asc">Amount (Low-High)</option>
            <option value="vendor">Vendor (A-Z)</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-2 px-3">Date</th>
              <th className="text-left py-2 px-3">Description</th>
              <th className="text-left py-2 px-3">Vendor</th>
              <th className="text-right py-2 px-3">Amount</th>
              <th className="text-left py-2 px-3">Outflow/Inflow</th>
              <th className="text-left py-2 px-3">GL Account</th>
              <th className="text-left py-2 px-3">GL Account Offset</th>
            </tr>
          </thead>
          <tbody>
            {cpaFilteredAndSorted.slice(0, 10).map(t => {
              const glAccount = mapToGLAccount(t.description, t.category, t.type);
              const isOutflow = t.amount < 0;
              return (
                <tr key={t.id} className="border-b border-slate-700">
                  <td className="py-2 px-3">{t.date}</td>
                  <td className="py-2 px-3">{t.description}</td>
                  <td className="py-2 px-3">{t.vendor}</td>
                  <td className="py-2 px-3 text-right">${Math.abs(t.amount).toFixed(2)}</td>
                  <td className="py-2 px-3">{isOutflow ? 'Outflow' : 'Inflow'}</td>
                  <td className="py-2 px-3">{glAccount.number} {glAccount.description}</td>
                  <td className="py-2 px-3">1007 Cash</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {cpaFilteredAndSorted.length > 10 && (
        <p className="text-slate-400 text-sm mt-4">Showing 10 of {cpaFilteredAndSorted.length} transactions</p>
      )}
    </div>
  </div>
)}

  {/* Net Worth Tab - UPDATED */}
        {activeTab === 'netWorth' && (
          <NetWorthDashboard />
        )}

        {/* FIRE Calculator Tab - NEW */}
        {activeTab === 'fire' && (
          <FIRECalculator />
        )}

        {/* Goals Tab - NEW */}
        {activeTab === 'goals' && (
          <GoalsTracker />
        )}

      </div>
    </div>
  );
};

export default FinanceDashboard;
