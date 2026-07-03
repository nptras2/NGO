import React from 'react'

export const CardSkeleton = () => {
  return (
    <div className="border border-border-color/30 rounded-xl p-5 bg-bg-secondary/40 shadow-sm animate-pulse flex flex-col space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-border-color/40 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border-color/40 rounded w-2/3" />
          <div className="h-3 bg-border-color/40 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3.5 bg-border-color/40 rounded w-full" />
        <div className="h-3.5 bg-border-color/40 rounded w-5/6" />
      </div>
      <div className="flex gap-2 pt-3">
        <div className="h-9 bg-border-color/40 rounded flex-1" />
        <div className="h-9 bg-border-color/40 rounded flex-1" />
      </div>
    </div>
  )
}

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full border border-border-color/30 rounded-xl overflow-hidden bg-bg-secondary/20 animate-pulse">
      <div className="h-12 bg-border-color/30 border-b border-border-color/30" />
      <div className="divide-y divide-border-color/30">
        {[...Array(rows)].map((_, idx) => (
          <div key={idx} className="h-16 flex items-center px-6 gap-4">
            <div className="w-8 h-8 bg-border-color/40 rounded-full" />
            <div className="h-4 bg-border-color/40 rounded w-1/4" />
            <div className="h-4 bg-border-color/40 rounded w-1/6" />
            <div className="h-4 bg-border-color/40 rounded w-1/6" />
            <div className="h-4 bg-border-color/40 rounded w-1/12 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 border border-border-color/30 rounded-xl bg-bg-secondary/40 p-5 space-y-3" />
        ))}
      </div>
      {/* Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 border border-border-color/30 rounded-xl bg-bg-secondary/40" />
        <div className="h-96 border border-border-color/30 rounded-xl bg-bg-secondary/40" />
      </div>
    </div>
  )
}

export default { CardSkeleton, TableSkeleton, DashboardSkeleton }
