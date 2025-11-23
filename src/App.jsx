import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, Plus, Trash2, Download, TrendingUp, TrendingDown, DollarSign, Target, Calendar } from 'lucide-react';

const FinanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentDate] = useState(new Date());
  const [lastImportDate, setLastImportDate] = useState(new Date('2024-11-23'));
  
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-11-15', description: 'Salary', amount: 8500, type: 'income', category: 'Salary', source: 'Primary Job' },
    { id: 2, date: '2024-11-15', description: 'Freelance', amount: 2000, type: 'income', category: 'Freelance', source: 'Side Business' },
    { id: 3, date: '2024-11-20', description: 'Mortgage', amount: -2200, type: 'expense', category: 'Housing', source: 'Mortgage' },
    { id: 4, date: '2024-11-22', description: 'Groceries', amount: -450, type: 'expense', category: 'Food', source: 'Groceries' },
    { id: 5, date: '2024-10-15', description: 'Salary', amount: 8500, type: 'income', category: 'Salary', source: 'Primary Job' },
    { id: 6, date: '2024-10-20', description: 'Mortgage', amount: -2200, type: 'expense', category: 'Housing', source: 'Mortgage' },
    { id: 7, date: '2023-11-15', description: 'Salary', amount: 7500, type: 'income', category: 'Salary', source: 'Primary Job' }
  ]);

  const [investments] = useState([
    { id: 1, type: '401k', currentValue: 250000, targetValue: 1000000, contributionRate: 15 },
    { id: 2, type: 'Roth IRA', currentValue: 85000, targetValue: 500000, contributionRate: 10 }
  ]);

  const [newTransaction, setNewTransaction] = useState({ date: '', description: '', amount: '', type: 'expense', category: '', source: '' });

  const categories = {
    income: ['Salary', 'Freelance', 'Investment Income', 'Other Income'],
    expense: ['Housing', 'Food', 'Utilities', 'Transportation', 'Insurance', 'Healthcare', 'Entertainment', 'Other']
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expenses, netIncome: income - expenses };
  }, [filteredTransactions]);

  const getTransactionsForPeriod = (month, year) => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const incomeTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    for (let i = 0; i < 12; i++) {
      const curr = getTransactionsForPeriod(i, selectedYear).filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const last = getTransactionsForPeriod(i, selectedYear - 1).filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      data.push({ month: months[i], currentYear: curr, lastYear: last });
    }
    return data;
  }, [transactions, selectedYear]);

  const expenseTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    for (let i = 0; i < 12; i++) {
      const curr = getTransactionsForPeriod(i, selectedYear).filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
      const last = getTransactionsForPeriod(i, selectedYear - 1).filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
      data.push({ month: months[i], currentYear: curr, lastYear: last });
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
  }, [filt
