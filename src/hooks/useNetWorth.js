import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useNetWorth() {
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate current net worth
  const currentNetWorth = {
    totalAssets: assets.reduce((sum, a) => sum + parseFloat(a.current_value), 0),
    totalLiabilities: liabilities.reduce((sum, l) => sum + parseFloat(l.current_balance), 0),
    netWorth: 0
  };
  currentNetWorth.netWorth = currentNetWorth.totalAssets - currentNetWorth.totalLiabilities;

  // Load all data
  useEffect(() => {
    loadNetWorthData();
  }, []);

  async function loadNetWorthData() {
    try {
      setLoading(true);
      const [assetsData, liabilitiesData, snapshotsData] = await Promise.all([
        supabase.from('assets').select('*').order('current_value', { ascending: false }),
        supabase.from('liabilities').select('*').order('current_balance', { ascending: false }),
        supabase.from('net_worth_snapshots').select('*').order('snapshot_date', { ascending: false }).limit(12)
      ]);

      if (assetsData.error) throw assetsData.error;
      if (liabilitiesData.error) throw liabilitiesData.error;
      if (snapshotsData.error) throw snapshotsData.error;

      setAssets(assetsData.data || []);
      setLiabilities(liabilitiesData.data || []);
      setSnapshots(snapshotsData.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading net worth:', err);
    } finally {
      setLoading(false);
    }
  }

  // Add asset
  async function addAsset(assetData) {
    const { data, error } = await supabase
      .from('assets')
      .insert([assetData])
      .select()
      .single();

    if (error) throw error;
    setAssets(prev => [...prev, data]);
    return data;
  }

  // Update asset
  async function updateAsset(id, updates) {
    const { data, error } = await supabase
      .from('assets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setAssets(prev => prev.map(a => a.id === id ? data : a));
    return data;
  }

  // Delete asset
  async function deleteAsset(id) {
    const { error } = await supabase.from('assets').delete().eq('id', id);
    if (error) throw error;
    setAssets(prev => prev.filter(a => a.id !== id));
  }

  // Add liability
  async function addLiability(liabilityData) {
    const { data, error } = await supabase
      .from('liabilities')
      .insert([liabilityData])
      .select()
      .single();

    if (error) throw error;
    setLiabilities(prev => [...prev, data]);
    return data;
  }

  // Update liability
  async function updateLiability(id, updates) {
    const { data, error } = await supabase
      .from('liabilities')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setLiabilities(prev => prev.map(l => l.id === id ? data : l));
    return data;
  }

  // Delete liability
  async function deleteLiability(id) {
    const { error } = await supabase.from('liabilities').delete().eq('id', id);
    if (error) throw error;
    setLiabilities(prev => prev.filter(l => l.id !== id));
  }

  // Create snapshot
  async function createSnapshot(date = new Date()) {
    const snapshotDate = date.toISOString().split('T')[0];
    
    // Calculate breakdowns
    const assetsBreakdown = {};
    assets.forEach(a => {
      assetsBreakdown[a.type] = (assetsBreakdown[a.type] || 0) + parseFloat(a.current_value);
    });

    const liabilitiesBreakdown = {};
    liabilities.forEach(l => {
      liabilitiesBreakdown[l.type] = (liabilitiesBreakdown[l.type] || 0) + parseFloat(l.current_balance);
    });

    const { data, error } = await supabase
      .from('net_worth_snapshots')
      .insert([{
        snapshot_date: snapshotDate,
        total_assets: currentNetWorth.totalAssets,
        total_liabilities: currentNetWorth.totalLiabilities,
        net_worth: currentNetWorth.netWorth,
        assets_breakdown: assetsBreakdown,
        liabilities_breakdown: liabilitiesBreakdown
      }])
      .select()
      .single();

    if (error) throw error;
    setSnapshots(prev => [data, ...prev].slice(0, 12)); // Keep last 12
    return data;
  }

  return {
    assets,
    liabilities,
    snapshots,
    currentNetWorth,
    loading,
    error,
    addAsset,
    updateAsset,
    deleteAsset,
    addLiability,
    updateLiability,
    deleteLiability,
    createSnapshot,
    refresh: loadNetWorthData
  };
}
