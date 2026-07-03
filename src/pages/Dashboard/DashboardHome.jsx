import React, { useEffect, useState } from 'react'
import { db } from '../../services/db'
import { supabase } from '../../services/supabaseClient'
import { DashboardSkeleton } from '../../components/SkeletonLoader'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Droplet, Users, ShieldAlert, Calendar, ClipboardList, CheckCircle, Clock } from 'lucide-react'
import { PremiumCard } from '../../components/PremiumCard'

// Mock monthly metrics for AreaChart
const donationTrendData = [
  { month: 'Jan', donations: 34, requests: 28 },
  { month: 'Feb', donations: 42, requests: 31 },
  { month: 'Mar', donations: 47, requests: 39 },
  { month: 'Apr', donations: 56, requests: 42 },
  { month: 'May', donations: 68, requests: 50 },
  { month: 'Jun', donations: 72, requests: 58 },
  { month: 'Jul', donations: 85, requests: 62 }
]

export const DashboardHome = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    donorsCount: 0,
    pendingRequests: 0,
    upcomingCampsCount: 0,
    lowStockGroups: []
  })
  const [inventoryChartData, setInventoryChartData] = useState([])
  const [recentAudits, setRecentAudits] = useState([])

  const loadDashboardData = async () => {
    try {
      // Fetch data
      const donorsList = await db.getDonors()
      const requestsList = await db.getRequests()
      const campsList = await db.getCamps()
      const inventoryData = await db.getInventory()
      const logs = await db.getAuditLogs()

      // Compute metrics
      const pendingReqs = requestsList.filter(r => r.status === 'Pending').length
      const upcomingCamps = campsList.filter(c => c.status === 'Upcoming').length
      
      // Find low stocks (< 6 units)
      const lowStocks = []
      Object.entries(inventoryData).forEach(([grp, val]) => {
        if (val < 6) {
          lowStocks.push({ grp, val })
        }
      })

      setStats({
        donorsCount: donorsList.length,
        pendingRequests: pendingReqs,
        upcomingCampsCount: upcomingCamps,
        lowStockGroups: lowStocks
      })

      // Format Recharts inventory data
      const chartData = Object.entries(inventoryData).map(([name, units]) => ({
        name,
        units,
        fill: units < 6 ? '#E53935' : '#222222'
      }))
      setInventoryChartData(chartData)

      setRecentAudits(logs.slice(0, 5))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const initData = async () => {
      setLoading(true)
      await loadDashboardData()
      setLoading(false)
    }
    initData()

    if (!supabase) return

    // Set up Realtime subscriptions to update automatically on any mutations
    const channel = supabase
      .channel('dashboard-sync-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_requests' },
        () => {
          loadDashboardData()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_inventory' },
        () => {
          loadDashboardData()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donors' },
        () => {
          loadDashboardData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-8 select-none">
      
      {/* 1. KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Registered Donors */}
        <PremiumCard className="flex items-center justify-between bg-var-card border border-var-border/60 p-5" hoverLift={true} borderGlow={true}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Registered Donors</span>
            <span className="text-2xl font-black">{stats.donorsCount}</span>
            <span className="text-[9px] text-green-600 font-medium block">Active in directory</span>
          </div>
          <div className="w-10 h-10 bg-primary-red/10 border border-primary-red/20 text-primary-red rounded-lg flex items-center justify-center">
            <Users size={20} />
          </div>
        </PremiumCard>

        {/* Card 2: Pending Filings */}
        <PremiumCard className="flex items-center justify-between bg-var-card border border-var-border/60 p-5" hoverLift={true} borderGlow={true}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Requests Queue</span>
            <span className="text-2xl font-black">{stats.pendingRequests}</span>
            <span className="text-[9px] text-primary-red font-semibold block">Pending Triage</span>
          </div>
          <div className="w-10 h-10 bg-primary-red/10 border border-primary-red/20 text-primary-red rounded-lg flex items-center justify-center">
            <Droplet size={20} />
          </div>
        </PremiumCard>

        {/* Card 3: Active Camps */}
        <PremiumCard className="flex items-center justify-between bg-var-card border border-var-border/60 p-5" hoverLift={true} borderGlow={true}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Upcoming Camps</span>
            <span className="text-2xl font-black">{stats.upcomingCampsCount}</span>
            <span className="text-[9px] text-text-secondary font-light block">Scheduled this month</span>
          </div>
          <div className="w-10 h-10 bg-primary-red/10 border border-primary-red/20 text-primary-red rounded-lg flex items-center justify-center">
            <Calendar size={20} />
          </div>
        </PremiumCard>

        {/* Card 4: Low Stock Warnings */}
        <PremiumCard className="flex items-center justify-between bg-var-card border border-var-border/60 p-5" hoverLift={true} borderGlow={true}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Low Stock Alerts</span>
            <span className={`text-2xl font-black ${stats.lowStockGroups.length > 0 ? 'text-primary-red' : ''}`}>
              {stats.lowStockGroups.length}
            </span>
            <span className="text-[9px] text-text-secondary font-light block">Below 6 unit target</span>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
            stats.lowStockGroups.length > 0
              ? 'bg-primary-red/10 border-primary-red/30 text-primary-red animate-pulse'
              : 'bg-primary-red/10 border-primary-red/20 text-primary-red'
          }`}>
            <ShieldAlert size={20} />
          </div>
        </PremiumCard>
      </div>

      {/* 2. INVENTORY HEALTH ALERTS (Conditional) */}
      {stats.lowStockGroups.length > 0 && (
        <div className="bg-primary-red/5 border border-primary-red/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-primary-red shrink-0" size={20} />
            <div className="text-xs">
              <strong className="text-primary-red font-extrabold uppercase">CRITICAL INVENTORY ALERT:</strong>
              <span className="text-text-secondary font-light ml-1">
                The following groups are running dangerously low: {stats.lowStockGroups.map(x => `${x.grp} (${x.val} units)`).join(', ')}.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-red shrink-0 underline decoration-dotted">
            Dispatch Request Alerts
          </span>
        </div>
      )}

      {/* 3. CHARTS SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Blood Inventory Volume */}
        <div className="lg:col-span-2 border border-border-color/20 rounded-xl p-6 bg-bg-primary shadow-sm flex flex-col justify-between h-96">
          <div className="mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider">Blood Inventory Volume</h3>
            <span className="text-xs text-text-secondary font-light">Available units (pints) mapped across subgroups.</span>
          </div>
          
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="units" fill="#222222" radius={[4, 4, 0, 0]}>
                  {inventoryChartData.map((entry, index) => (
                    <Bar key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Trends */}
        <div className="border border-border-color/20 rounded-xl p-6 bg-bg-primary shadow-sm flex flex-col justify-between h-96">
          <div className="mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider">Supply & Demand Trend</h3>
            <span className="text-xs text-text-secondary font-light">Comparing monthly donations and requests.</span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationTrendData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="donations" stroke="#E53935" fill="rgba(229,57,53,0.08)" strokeWidth={2} />
                <Area type="monotone" dataKey="requests" stroke="#222222" fill="rgba(34,34,34,0.08)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. RECENT AUDIT LOGS */}
      <div className="border border-border-color/20 rounded-xl p-6 bg-bg-primary shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardList size={16} className="text-primary-red" />
            System Audit logs
          </h3>
          <span className="text-xs text-text-secondary font-light">Recent administrative changes recorded in the active ledger.</span>
        </div>

        <div className="divide-y divide-border-color/20 text-xs font-light text-text-secondary">
          {recentAudits.map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary uppercase">{log.action}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-secondary font-medium">
                    {log.actor} ({log.role})
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed font-light">{log.details}</p>
              </div>
              
              <span className="font-mono text-[10px] text-text-secondary shrink-0 whitespace-nowrap self-start sm:self-center">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
export default DashboardHome
