import React, { useEffect, useState } from 'react'
import { db } from '../services/db'
import { Users, Award, Calendar, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { PremiumCard } from '../components/PremiumCard'

export const Members = () => {
  const [members, setMembers] = useState([])
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const data = await db.getMembers()
    setMembers(data)
  }

  // Filter members by status if active-only is enabled
  const filteredMembers = showActiveOnly 
    ? members.filter(m => m.status === 'Active')
    : members

  // Group members by hierarchical category
  const categories = [
    { name: 'Board Executives', posts: ['President', 'Vice President', 'Secretary', 'Treasurer'] },
    { name: 'Technical & Data Staff', posts: ['Data Entry Operator'] },
    { name: 'Volunteer Force', posts: ['Volunteer'] }
  ]

  const getMembersByPosts = (posts) => {
    return filteredMembers.filter(m => posts.includes(m.post))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="border-b pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide uppercase flex items-center gap-2">
            <Users size={28} className="text-primary-red" />
            NGO Team & Cabinet
          </h1>
          <p className="text-text-secondary text-sm font-light mt-2 max-w-xl">
            Meet the dedicated healthcare advocates, administrative staff, and volunteer operators keeping the AZAAD HUMAN RIGHTS ASSOCIATION running 24/7.
          </p>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-bg-secondary/20 hover:bg-bg-secondary/50 transition-all text-xs font-bold uppercase tracking-wider self-start md:self-end"
        >
          {showActiveOnly ? (
            <ToggleRight className="text-primary-red" size={24} />
          ) : (
            <ToggleLeft className="text-text-secondary" size={24} />
          )}
          <span>Active Staff Only</span>
        </button>
      </div>

      {/* Categorized Grids */}
      <div className="space-y-12">
        {categories.map((cat) => {
          const list = getMembersByPosts(cat.posts)
          if (list.length === 0) return null

          return (
            <div key={cat.name} className="space-y-6">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-primary-red flex items-center gap-1.5 border-b pb-2 border-border-color/30">
                <Award size={14} />
                {cat.name} ({list.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {list.map((member) => (
                  <PremiumCard
                    key={member.id}
                    className="flex flex-col items-center text-center space-y-4 relative bg-var-card border border-var-border/60 p-5"
                    hoverLift={true}
                    borderGlow={true}
                  >
                    {/* Status indicator */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${
                        member.status === 'Active'
                          ? 'text-green-600 bg-green-500/10 border-green-500/20'
                          : 'text-text-secondary bg-var-surface border-var-border/40'
                      }`}>
                        {member.status}
                      </span>
                    </div>

                    {/* Member Photo */}
                    <div className="relative pt-2">
                      <img
                        src={member.photo}
                        alt={member.fullName}
                        className="w-20 h-20 rounded-full object-cover border-[3px] border-primary-red/10 shadow-inner"
                      />
                      {/* Blood group indicator */}
                      <div className="absolute bottom-0 -right-1 w-7 h-7 bg-primary-red border border-pure-white dark:border-charcoal rounded-full flex items-center justify-center text-pure-white font-black text-[10px] shadow-md select-none">
                        {member.bloodGroup}
                      </div>
                    </div>

                    {/* Name & Post */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-base leading-tight truncate max-w-[180px]">{member.fullName}</h4>
                      <p className="text-xs text-primary-red font-semibold uppercase tracking-wider">{member.post}</p>
                    </div>

                    {/* Service & Email logs */}
                    <div className="w-full border-t border-var-border/40 pt-4 flex flex-col gap-1 text-[11px] text-text-secondary font-light text-left">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary-red shrink-0" />
                        Years of Service: <strong>{member.yearsOfService} yrs</strong>
                      </span>
                      <span className="truncate block font-mono text-[10px] select-all mt-1 opacity-80" title={member.email}>
                        {member.email}
                      </span>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
export default Members
