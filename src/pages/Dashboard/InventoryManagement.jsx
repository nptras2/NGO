import React, { useEffect, useState } from 'react'
import { db } from '../../services/db'
import { useAuth } from '../../context/AuthContext'
import { Droplet, Plus, Minus, ShieldAlert, Award, AlertTriangle, CheckCircle2 } from 'lucide-react'

export const InventoryManagement = () => {
  const { user, permissions } = useAuth()
  const [inventory, setInventory] = useState({})
  const [loading, setLoading] = useState(true)
  
  // Custom adjust state
  const [adjustingGroup, setAdjustingGroup] = useState(null)
  const [adjustUnits, setAdjustUnits] = useState(1)
  const [adjustAction, setAdjustAction] = useState('add') // 'add' or 'deduct'

  const TARGET_THRESHOLD = 8 // Under 8 units triggers low-stock warning

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    setLoading(true)
    const data = await db.getInventory()
    setInventory(data)
    setLoading(false)
  }

  const handleAdjustInventory = async (e) => {
    e.preventDefault()
    if (!adjustingGroup) return

    try {
      const updated = await db.adjustInventory(adjustingGroup, adjustUnits, adjustAction, user)
      setInventory(updated)
      setAdjustingGroup(null)
      setAdjustUnits(1)
    } catch (err) {
      console.error(err)
    }
  }

  const userCanAdjust = permissions.canAdjustInventory()

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div className="border-b pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider">Blood Inventory Management</h2>
          <span className="text-xs text-text-secondary font-light">Monitor volume levels, review reserves, and balance stockpile indicators.</span>
        </div>
      </div>

      {/* RBAC Warning Banner */}
      {!userCanAdjust && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
          <ShieldAlert size={16} />
          <span>Your current role (<strong>{user?.post}</strong>) is restricted from making direct stock adjustments. Contact the President or Admin for overrides.</span>
        </div>
      )}

      {/* Inventory Grid meters */}
      {loading ? (
        <div className="text-xs text-text-secondary text-center py-10">Fetching stockpile data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Object.entries(inventory).map(([group, val]) => {
            const isLow = val < TARGET_THRESHOLD
            const percentage = Math.min(100, (val / 60) * 100) // scale out of 60 max pints

            return (
              <div 
                key={group}
                className={`border rounded-xl p-5 bg-bg-primary shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow duration-300 ${
                  isLow ? 'border-primary-red/35 bg-primary-red/5' : 'border-border-color/20'
                }`}
              >
                {/* Details top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplet 
                      size={24} 
                      className={isLow ? 'text-primary-red fill-primary-red pulse-red' : 'text-text-primary'} 
                    />
                    <span className="font-black text-lg tracking-wide">{group} Group</span>
                  </div>
                  
                  {isLow ? (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase text-primary-red bg-primary-red/10 border border-primary-red/20">
                      <AlertTriangle size={10} /> Low Stock
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase text-green-600 bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 size={10} /> Stable
                    </span>
                  )}
                </div>

                {/* Progress bar visual */}
                <div className="space-y-1.5">
                  <div className="flex items-end justify-between text-xs">
                    <span className="font-light text-text-secondary">Available Stock:</span>
                    <span className="font-mono font-bold text-base">{val} Pints</span>
                  </div>
                  <div className="w-full h-2.5 bg-bg-secondary rounded-full overflow-hidden border border-border-color/10">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow ? 'bg-primary-red' : 'bg-charcoal dark:bg-pure-white'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-text-secondary font-light">
                    <span>Target: {TARGET_THRESHOLD} Pints</span>
                    <span>Max: 60 Pints</span>
                  </div>
                </div>

                {/* Rapid adjustment button */}
                <button
                  disabled={!userCanAdjust}
                  onClick={() => {
                    setAdjustingGroup(group)
                    setAdjustAction('add')
                  }}
                  className={`w-full py-1.5 border hover:bg-bg-secondary text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 transition-colors ${
                    !userCanAdjust ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''
                  }`}
                >
                  <Plus size={10} /> Adjust Reserves
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Adjustment Form Modal */}
      {adjustingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setAdjustingGroup(null)} className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" />
          <form 
            onSubmit={handleAdjustInventory}
            className="relative w-full max-w-sm bg-bg-primary border border-border-color/40 rounded-xl p-5 shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2 flex items-center gap-2">
              <Award size={16} className="text-primary-red" />
              Adjust {adjustingGroup} Reserves
            </h3>

            {/* Action selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Adjustment Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustAction('add')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    adjustAction === 'add'
                      ? 'bg-green-600 border-transparent text-pure-white shadow-sm'
                      : 'border-border-color hover:bg-bg-secondary text-text-secondary'
                  }`}
                >
                  <Plus size={12} className="inline mr-1" /> Add Units
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustAction('deduct')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    adjustAction === 'deduct'
                      ? 'bg-primary-red border-transparent text-pure-white shadow-sm'
                      : 'border-border-color hover:bg-bg-secondary text-text-secondary'
                  }`}
                >
                  <Minus size={12} className="inline mr-1" /> Deduct Units
                </button>
              </div>
            </div>

            {/* Units Input */}
            <div className="space-y-1">
              <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Units (Pints)</label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={adjustUnits}
                onChange={(e) => setAdjustUnits(e.target.value)}
                className="w-full h-10 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none focus:border-primary-red"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAdjustingGroup(null)}
                className="flex-1 py-2 border border-border-color hover:bg-bg-secondary text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-charcoal dark:bg-bg-secondary hover:bg-primary-red hover:dark:bg-primary-red text-pure-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow"
              >
                Save Adjustment
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
export default InventoryManagement
