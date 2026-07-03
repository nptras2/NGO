import React, { useEffect, useState } from 'react'
import { db } from '../../services/db'
import { useAuth } from '../../context/AuthContext'
import { FileDown, Printer, Database, ShieldAlert, ClipboardList, Info, Sparkles } from 'lucide-react'

export const ReportsManagement = () => {
  const { user, permissions } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    const allLogs = await db.getAuditLogs()
    setLogs(allLogs)
    setLoading(false)
  }

  // Generate CSV exports client side
  const exportDonorsCSV = async () => {
    const list = await db.getDonors()
    let csv = 'ID,Name,Age,Gender,Blood Group,Phone,Email,City,District,Eligible,Last Donation\n'
    list.forEach(d => {
      csv += `"${d.id}","${d.fullName}",${d.age},"${d.gender}","${d.bloodGroup}","${d.phone}","${d.email}","${d.city}","${d.district}",${d.eligible},"${d.lastDonationDate || 'None'}"\n`
    })
    triggerCSVDownload(csv, 'lifesaver_donors_export')
  }

  const exportCampsCSV = async () => {
    const list = await db.getCamps()
    let csv = 'ID,Camp Name,Date,Venue,Organizer,Status,Total Donors,Units Collected\n'
    list.forEach(c => {
      csv += `"${c.id}","${c.campName}","${c.date}","${c.venue}","${c.organizer}","${c.status}",${c.totalDonors},${c.unitsCollected}\n`
    })
    triggerCSVDownload(csv, 'lifesaver_camps_export')
  }

  const triggerCSVDownload = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrintReport = () => {
    window.print()
  }

  const userCanBackup = permissions.canBackupDatabase()
  const userCanViewLogs = permissions.canViewReports()

  return (
    <div className="space-y-8 select-none print:p-0 print:m-0">
      
      {/* Header bar (hidden in print mode) */}
      <div className="border-b pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider">Reports, Audits & Backups</h2>
          <span className="text-xs text-text-secondary font-light">Generate clinical files, audit change history, and manage secure JSON backups.</span>
        </div>

        {/* Print report trigger */}
        <button
          onClick={handlePrintReport}
          className="px-5 py-2.5 bg-charcoal dark:bg-bg-secondary hover:bg-primary-red hover:dark:bg-primary-red text-pure-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow transition-colors border border-border-color/10 cursor-pointer"
        >
          <Printer size={14} />
          Print Status Report
        </button>
      </div>

      {/* Renders a print-friendly document header when page print is opened */}
      <div className="hidden print:block space-y-4 mb-8">
        <div className="border-b-2 border-charcoal pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider">LIFESAVER NGO SYSTEM REPORT</h1>
            <span className="text-xs font-mono">Date Generated: {new Date().toLocaleString()}</span>
          </div>
          <div className="text-right text-xs">
            <strong>Certified ISO 9001 Network</strong> <br />
            emergency@lifesaverngo.org
          </div>
        </div>
        <p className="text-xs italic">This is a verified snapshot of the active NGO donor directory, camps, and audit ledger logs.</p>
      </div>

      {/* Action cards row (hidden in print mode) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        {/* Card 1: Data Reports */}
        <div className="border border-border-color/20 rounded-xl p-5 bg-bg-primary shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <FileDown size={16} className="text-primary-red" />
            CSV Data Exports
          </h3>
          <p className="text-[11px] text-text-secondary font-light leading-relaxed">
            Download raw database tables formatted as CSV files for import into Microsoft Excel or Google Sheets.
          </p>
          <div className="space-y-2 pt-2 flex flex-col">
            <button
              onClick={exportDonorsCSV}
              className="py-2 px-3 border hover:border-primary-red hover:text-primary-red rounded text-[10px] font-bold uppercase tracking-wider text-left transition-colors flex items-center justify-between"
            >
              <span>Export Donors Directory</span>
              <FileDown size={12} />
            </button>
            <button
              onClick={exportCampsCSV}
              className="py-2 px-3 border hover:border-primary-red hover:text-primary-red rounded text-[10px] font-bold uppercase tracking-wider text-left transition-colors flex items-center justify-between"
            >
              <span>Export Donation Camps</span>
              <FileDown size={12} />
            </button>
          </div>
        </div>

        {/* Card 2: Backup Systems */}
        <div className="border border-border-color/20 rounded-xl p-5 bg-bg-primary shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Database size={16} className="text-primary-red" />
            Database Backup
          </h3>
          <p className="text-[11px] text-text-secondary font-light leading-relaxed">
            Download the entire application state (donors, logs, requests, inventory) as a single structured JSON database file.
          </p>
          <div className="pt-2">
            <button
              disabled={!userCanBackup}
              onClick={db.exportBackup}
              className={`w-full py-2.5 bg-primary-red hover:bg-dark-red text-pure-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow ${
                !userCanBackup ? 'opacity-35 cursor-not-allowed hover:bg-primary-red' : 'cursor-pointer'
              }`}
            >
              <Database size={12} />
              Download JSON Database
            </button>
            {!userCanBackup && (
              <span className="text-[9px] text-text-secondary font-light mt-1.5 block leading-relaxed">
                * restricted to President and Admin accounts only.
              </span>
            )}
          </div>
        </div>

        {/* Card 3: NGO Accreditations */}
        <div className="border border-border-color/20 rounded-xl p-5 bg-bg-secondary/15 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-primary-red uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} className="pulse-red" />
              Verified Certificate
            </span>
            <h4 className="font-bold text-xs uppercase">Compliance Standards</h4>
            <p className="text-[11px] text-text-secondary font-light leading-relaxed">
              This node operates under direct ISO guidelines, keeping complete logs of all inventory and triage operations for legal inspections.
            </p>
          </div>
          <div className="text-[10px] text-text-primary bg-bg-primary p-2 border rounded-md font-mono mt-4">
            Compliance Node: LIFESAVER-IN-062
          </div>
        </div>
      </div>

      {/* Renders logs ledger table */}
      <div className="border border-border-color/20 rounded-xl p-6 bg-bg-primary shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardList size={16} className="text-primary-red" />
            Complete Audit Ledger Logs
          </h3>
          <span className="text-xs text-text-secondary font-light print:hidden">Ledger tracking all administrative mutations. Sorted chronologically.</span>
        </div>

        {!userCanViewLogs ? (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl p-4 text-xs flex items-center gap-2.5">
            <ShieldAlert size={18} className="shrink-0" />
            <span>Your current role (<strong>{user?.post}</strong>) does not have access permissions to view the complete system ledger files.</span>
          </div>
        ) : loading ? (
          <div className="text-xs text-text-secondary text-center py-6">Loading ledger logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center text-xs text-text-secondary py-6">Ledger empty.</div>
        ) : (
          <div className="divide-y divide-border-color/20 text-xs font-light text-text-secondary max-h-[400px] overflow-y-auto pr-2">
            {logs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-text-primary uppercase tracking-wide bg-bg-secondary px-1.5 py-0.5 rounded border">
                      {log.action}
                    </span>
                    <span className="font-semibold text-charcoal dark:text-soft-silver">
                      by {log.actor} ({log.role})
                    </span>
                  </div>
                  <p className="text-text-secondary font-light leading-relaxed">{log.details}</p>
                </div>
                <span className="font-mono text-[10px] text-text-secondary shrink-0 whitespace-nowrap self-start sm:self-center">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
export default ReportsManagement
