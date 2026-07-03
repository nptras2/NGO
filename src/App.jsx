import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'
import LoadingScreen from './components/LoadingScreen'
import EmergencyCallButton from './components/EmergencyCallButton'

// Lazy loaded public pages
const Home = lazy(() => import('./pages/Home'))
const FindBlood = lazy(() => import('./pages/FindBlood'))
const DonorDirectory = lazy(() => import('./pages/DonorDirectory'))
const Camps = lazy(() => import('./pages/Camps'))
const Members = lazy(() => import('./pages/Members'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

// Lazy loaded dashboard pages
const DashboardLayout = lazy(() => import('./pages/Dashboard/DashboardLayout'))
const DashboardHome = lazy(() => import('./pages/Dashboard/DashboardHome'))
const DonorsManagement = lazy(() => import('./pages/Dashboard/DonorsManagement'))
const InventoryManagement = lazy(() => import('./pages/Dashboard/InventoryManagement'))
const CampsManagement = lazy(() => import('./pages/Dashboard/CampsManagement'))
const MembersManagement = lazy(() => import('./pages/Dashboard/MembersManagement'))
const RequestsManagement = lazy(() => import('./pages/Dashboard/RequestsManagement'))
const ReportsManagement = lazy(() => import('./pages/Dashboard/ReportsManagement'))

export const App = () => {
  const location = useLocation()

  // 1. Lenis Smooth Scroll Integration (Public Pages only)
  useEffect(() => {
    const isAdminPage = location.pathname.startsWith('/admin')
    if (isAdminPage) return // Bypassed for fast, native dashboard navigation
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Cubic easing
      smoothWheel: true,
      touchMultiplier: 1.5
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [location.pathname])

  // 2. Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Pre-loader screen */}
      <LoadingScreen />

      {/* Global Navigation Header (Hidden on admin layouts) */}
      <Navbar />

      {/* Main Workspace content */}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="w-full h-[60vh] flex items-center justify-center text-xs tracking-widest text-text-secondary uppercase animate-pulse">
            Syncing workspace...
          </div>
        }>
          <Routes>
            {/* Public Portal Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/find-blood" element={<FindBlood />} />
            <Route path="/directory" element={<DonorDirectory />} />
            <Route path="/camps" element={<Camps />} />
            <Route path="/members" element={<Members />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Console Workspace (RBAC Secured Layout) */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="donors" element={<DonorsManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="camps" element={<CampsManagement />} />
              <Route path="requests" element={<RequestsManagement />} />
              <Route path="members" element={<MembersManagement />} />
              <Route path="reports" element={<ReportsManagement />} />
            </Route>
          </Routes>
        </Suspense>
      </main>

      {/* Floating 24/7 Hotline Call Button */}
      <EmergencyCallButton />

      {/* Mobile Drawer menu */}
      <MobileNav />

      {/* Footer Banner */}
      <Footer />
    </div>
  )
}

export default App
