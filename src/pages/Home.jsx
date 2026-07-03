import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '../components/AnimatedCounter'
import { PremiumCard } from '../components/PremiumCard'
import { db } from '../services/db'
import { useTheme } from '../context/ThemeContext'
import { Canvas } from '@react-three/fiber'
import { Sparkles as ThreeSparkles } from '@react-three/drei'
import { 
  Shield, Zap, Sparkles, Building, Calendar, ArrowRight, 
  CheckCircle, UserPlus, Heart, Award, Quote, MapPin, Droplet, Users
} from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Siddharth Roy',
    role: 'Leukemia Survivor',
    quote: 'LifeSaver NGO connected us with an AB- donor within 35 minutes when my chemotherapy levels dropped critically. They did not just find blood, they literally gave me my father back.',
    location: 'Kolkata, WB',
    impact: '1 Life Saved',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    group: 'AB-'
  },
  {
    id: 2,
    name: 'Dr. Archana Sen',
    role: 'Chief Surgeon, Fortis',
    quote: 'Emergency surgery cannot wait. Having a searchable registry where we can filter donors by city and immediate eligibility saves hours of administrative telephone calls. This is the healthcare standard.',
    location: 'Delhi NCR',
    impact: '120+ Surgeries Supported',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
    group: 'A+'
  },
  {
    id: 3,
    name: 'Manpreet Singh',
    role: 'Active O- Donor',
    quote: 'I check my eligibility status directly on the portal. Once the 90 days are up, I get notified and book a slot at the nearest camp. The entire process is premium, digital, and completely transparent.',
    location: 'Chandigarh',
    impact: '9 Donations Logged',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    group: 'O-'
  }
]

export const Home = () => {
  const [camps, setCamps] = useState([])
  const { theme } = useTheme()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const moveX = (clientX - window.innerWidth / 2) / 40
    const moveY = (clientY - window.innerHeight / 2) / 40
    setMousePos({ x: moveX, y: moveY })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
  }

  useEffect(() => {
    const fetchCamps = async () => {
      const data = await db.getCamps()
      setCamps(data.slice(0, 3))
    }
    fetchCamps()
  }, [])

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }

  const containerStagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="relative w-full bg-bg-primary text-text-primary transition-all duration-300">
      
      {/* 1. HERO SECTION (Full Viewport) */}
      <section 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[calc(100vh-6.5rem)] flex flex-col justify-between overflow-hidden pt-12 pb-6 px-4 sm:px-6 lg:px-8 z-10"
      >
        {/* Ambient red glows & spot lighting for premium cinematic atmosphere (dark mode specific) */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-primary-red/5 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-[10%] w-[300px] h-[300px] bg-primary-red/10 rounded-full blur-[90px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-pure-white/[0.02] rounded-full blur-[70px] pointer-events-none z-0" />
            
            {/* Tiny floating red particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Canvas camera={{ position: [0, 0, 5] }} gl={{ alpha: true }}>
                <ambientLight intensity={0.4} />
                <ThreeSparkles count={55} scale={8} size={1.8} speed={0.3} color="#E53935" opacity={0.65} />
              </Canvas>
            </div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full py-6">
            
            {/* LEFT SIDE (45%) */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary-red/30 bg-primary-red/5 text-primary-red text-[10px] font-bold tracking-widest uppercase w-fit mx-auto lg:mx-0 select-none"
              >
                <Heart size={10} className="fill-primary-red text-primary-red pulse-red" />
                Empowering Community Healthcare
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-4xl sm:text-[56px] lg:text-[68px] font-extrabold tracking-tight leading-[1.08]"
              >
                <span className="text-text-primary">Your Blood</span> <br />
                <span className="text-primary-red glow-text-red bg-gradient-to-r from-primary-red to-[#FF5252] bg-clip-text text-transparent">
                  Can Save A Life.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-sm sm:text-base text-text-secondary font-light max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                LifeSaver NGO is a premium verified blood bank alliance. We bridge the critical gap between volunteer donors and healthcare centers in real-time. Fast, secure, and 100% free.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link
                  to="/find-blood"
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary-red hover:bg-dark-red text-pure-white font-bold tracking-wide rounded-xl shadow-lg hover:shadow-primary-red/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Find Blood Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/directory"
                  className="w-full sm:w-auto px-8 py-3.5 border border-border-color hover:border-primary-red hover:text-primary-red text-text-primary font-bold tracking-wide rounded-xl bg-bg-primary hover:bg-bg-secondary transition-all flex items-center justify-center cursor-pointer"
                >
                  Register as Donor
                </Link>
              </motion.div>
            </div>
            
            {/* RIGHT SIDE (55%) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex justify-center items-center relative py-6 w-full h-[400px] sm:h-[480px]"
            >
              {/* Soft glows behind model */}
              <div className="absolute w-[260px] h-[260px] md:w-[380px] md:h-[380px] bg-primary-red/10 dark:bg-primary-red/15 rounded-full blur-[80px] z-0 pointer-events-none" />
              <div className="absolute w-[180px] h-[180px] md:w-[260px] md:h-[260px] bg-pure-white/[0.04] dark:bg-pure-white/[0.02] rounded-full blur-[50px] z-0 pointer-events-none" />
              
              {/* Circular glowing platform container under model */}
              <div className="absolute bottom-[20px] md:bottom-[45px] left-1/2 -translate-x-1/2 w-[280px] md:w-[380px] h-[50px] bg-gradient-to-r from-transparent via-primary-red/25 to-transparent border-t border-primary-red/40 rounded-full blur-[1px] opacity-75 transform scale-y-[0.35] z-0 pointer-events-none flex flex-col justify-end" />
              
              {/* Red glowing EKG pulse lines below the platform */}
              <div className="absolute bottom-[0px] md:bottom-[15px] w-[240px] md:w-[320px] h-[30px] z-0 pointer-events-none opacity-80">
                <svg className="w-full h-full text-primary-red/90" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M0,10 L30,10 L33,4 L36,16 L39,10 L45,10 L48,2 L51,18 L54,10 L60,10 L63,4 L66,16 L69,10 L100,10" 
                    stroke="currentColor" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>

              {/* Transparent PNG with parallax and floating effect */}
              <div 
                className="animate-float-slow z-10 flex justify-center items-center max-w-[85%] md:max-w-full relative"
                style={{ 
                  transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
                  transition: 'transform 0.15s ease-out'
                }}
              >
                <img 
                  src="/blood_bag_heart.png" 
                  alt="Blood Bag & Heart Connection"
                  className="w-[280px] sm:w-[350px] md:w-[420px] h-auto object-contain drop-shadow-[0_15px_30px_rgba(229,57,53,0.2)] selection:bg-transparent"
                  draggable="false"
                />
              </div>
            </motion.div>
          </div>
          
          {/* STATS glass container at bottom of hero */}
          <div className="w-full mt-6 mb-2 bg-card-bg border border-border-color rounded-2xl p-5 md:p-6 backdrop-blur-md shadow-xl relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              
              {/* Stat 1: Registered Donors */}
              <div className="flex items-center gap-3.5 justify-start md:justify-center">
                <div className="w-11 h-11 bg-primary-red/10 border border-primary-red/20 rounded-full flex items-center justify-center text-primary-red shrink-0 shadow-sm">
                  <Users size={18} />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-2xl font-black text-text-primary tracking-tight">
                    <AnimatedCounter value={4820} suffix="+" />
                  </p>
                  <p className="text-[9px] sm:text-xs text-text-secondary font-semibold uppercase tracking-wider">Registered Donors</p>
                </div>
              </div>

              {/* Stat 2: Units Collected */}
              <div className="flex items-center gap-3.5 justify-start md:justify-center">
                <div className="w-11 h-11 bg-primary-red/10 border border-primary-red/20 rounded-full flex items-center justify-center text-primary-red shrink-0 shadow-sm">
                  <Droplet size={18} />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-2xl font-black text-text-primary tracking-tight">
                    <AnimatedCounter value={12450} suffix="+" />
                  </p>
                  <p className="text-[9px] sm:text-xs text-text-secondary font-semibold uppercase tracking-wider">Units Collected</p>
                </div>
              </div>

              {/* Stat 3: Lives Saved */}
              <div className="flex items-center gap-3.5 justify-start md:justify-center">
                <div className="w-11 h-11 bg-primary-red/10 border border-primary-red/20 rounded-full flex items-center justify-center text-primary-red shrink-0 shadow-sm">
                  <Heart size={18} />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-2xl font-black text-text-primary tracking-tight">
                    <AnimatedCounter value={14380} suffix="+" />
                  </p>
                  <p className="text-[9px] sm:text-xs text-text-secondary font-semibold uppercase tracking-wider">Lives Saved</p>
                </div>
              </div>

              {/* Stat 4: Active Camps */}
              <div className="flex items-center gap-3.5 justify-start md:justify-center">
                <div className="w-11 h-11 bg-primary-red/10 border border-primary-red/20 rounded-full flex items-center justify-center text-primary-red shrink-0 shadow-sm">
                  <Building size={18} />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-2xl font-black text-text-primary tracking-tight">
                    <AnimatedCounter value={18} suffix="+" />
                  </p>
                  <p className="text-[9px] sm:text-xs text-text-secondary font-semibold uppercase tracking-wider">Active Camps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW BLOOD DONATION WORKS */}
      <section className="py-24 bg-bg-primary relative border-t border-border-color/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-wide uppercase mb-3">
              How Blood Donation Works
            </h2>
            <p className="text-var-txt-secondary text-sm font-light">
              Follow our simplified coordinate system to become a medical volunteer and support hospitals.
            </p>
          </div>

          {/* Cards Process Container */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Horizontal connection line for tablet/desktop */}
            <div className="hidden md:block absolute top-[68px] left-[15%] right-[15%] h-[1.5px] border-t border-dashed border-var-border/60 z-0" />

            {/* Step 1 */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="z-10"
            >
              <PremiumCard className="h-full flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary-red/10 rounded-2xl flex items-center justify-center text-primary-red shadow-sm border border-primary-red/10">
                  <UserPlus size={26} />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-primary-red uppercase tracking-wider">Step 01</span>
                  <h3 className="text-lg font-bold">Register as Donor</h3>
                  <p className="text-xs text-var-txt-secondary font-light leading-relaxed">
                    Submit your basic contacts and blood group details to join our secure public-facing emergency registry.
                  </p>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="z-10"
            >
              <PremiumCard className="h-full flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary-red/10 rounded-2xl flex items-center justify-center text-primary-red shadow-sm border border-primary-red/10">
                  <Heart size={26} />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-primary-red uppercase tracking-wider">Step 02</span>
                  <h3 className="text-lg font-bold">Donate at Camp</h3>
                  <p className="text-xs text-var-txt-secondary font-light leading-relaxed">
                    Book priority slots, attend our safe ISO-certified community drives, and donate 1 pint under medical protocol.
                  </p>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="z-10"
            >
              <PremiumCard className="h-full flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary-red/10 rounded-2xl flex items-center justify-center text-primary-red shadow-sm border border-primary-red/10">
                  <Award size={26} />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-primary-red uppercase tracking-wider">Step 03</span>
                  <h3 className="text-lg font-bold">Save Lives</h3>
                  <p className="text-xs text-var-txt-secondary font-light leading-relaxed">
                    Your pint is verified, logged into the dashboard, and instantly dispatched to emergency hospital transfusions.
                  </p>
                </div>
              </PremiumCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-20 bg-var-surface/50 border-t border-var-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-wide uppercase mb-3">
              Standardized Healthcare Operations
            </h2>
            <p className="text-var-txt-secondary text-sm font-light">
              We focus on absolute verification, rapid coordination, and strict medical protocol guidelines.
            </p>
          </div>

          <motion.div 
            variants={containerStagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Card 1 */}
            <motion.div variants={fadeInUp}>
              <PremiumCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-primary-red/10 rounded-xl flex items-center justify-center text-primary-red mb-5">
                    <CheckCircle size={22} />
                  </div>
                  <h3 className="text-base font-bold mb-2">Verified Donors</h3>
                  <p className="text-var-txt-secondary text-xs font-light leading-relaxed">
                    All donor logs are linked to real cell numbers, verified identities, and calculated eligibility records.
                  </p>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp}>
              <PremiumCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-primary-red/10 rounded-xl flex items-center justify-center text-primary-red mb-5">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-base font-bold mb-2">Emergency Support</h3>
                  <p className="text-var-txt-secondary text-xs font-light leading-relaxed">
                    Direct WhatsApp integration and automated urgency dashboards dispatch requests to donors instantly.
                  </p>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp}>
              <PremiumCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-primary-red/10 rounded-xl flex items-center justify-center text-primary-red mb-5">
                    <Shield size={22} />
                  </div>
                  <h3 className="text-base font-bold mb-2">Safe Collection</h3>
                  <p className="text-var-txt-secondary text-xs font-light leading-relaxed">
                    All collection procedures follow strict ISO protocols led by experienced licensed pathologists.
                  </p>
                </div>
              </PremiumCard>
            </motion.div>

            {/* Card 4 */}
            <motion.div variants={fadeInUp}>
              <PremiumCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-primary-red/10 rounded-xl flex items-center justify-center text-primary-red mb-5">
                    <Building size={22} />
                  </div>
                  <h3 className="text-base font-bold mb-2">Trusted NGO Network</h3>
                  <p className="text-var-txt-secondary text-xs font-light leading-relaxed">
                    Integrated directly with local hospitals and government blood cells to guarantee transparency.
                  </p>
                </div>
              </PremiumCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. UPCOMING BLOOD CAMPS */}
      <section className="py-20 bg-var-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-wide uppercase mb-2">Upcoming Donation Camps</h2>
              <p className="text-var-txt-secondary text-sm font-light">Find local field campaigns and register to donate near you.</p>
            </div>
            <Link to="/camps" className="text-primary-red hover:underline text-sm font-semibold flex items-center gap-1">
              View All Campaigns
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {camps.map((camp) => (
              <PremiumCard key={camp.id} className="p-0 overflow-hidden flex flex-col h-full bg-var-surface/20" hoverLift={true} borderGlow={true}>
                <div className="h-44 relative bg-dark-gray overflow-hidden">
                  <img 
                    src={camp.photo} 
                    alt={camp.campName}
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-primary-red text-pure-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow">
                    {camp.status}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base tracking-wide line-clamp-1">{camp.campName}</h3>
                    <p className="text-xs text-var-txt-secondary flex items-center gap-1.5 font-light">
                      <Calendar size={13} className="text-primary-red shrink-0" />
                      {new Date(camp.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-var-txt-secondary leading-relaxed font-light line-clamp-2">
                      Venue: {camp.venue}
                    </p>
                  </div>
                  
                  <Link
                    to="/camps"
                    className="w-full py-2 bg-charcoal dark:bg-var-surface hover:bg-primary-red hover:dark:bg-primary-red text-pure-white text-xs font-bold tracking-wider uppercase text-center rounded-lg transition-colors border border-var-border/10"
                  >
                    Details & RSVP
                  </Link>
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SUCCESS STORIES */}
      <section className="py-24 bg-var-surface border-y border-var-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-wide uppercase mb-3">Success Stories</h2>
            <p className="text-var-txt-secondary text-sm font-light">Real statements from patients and surgeons supported by Lifesaver.</p>
          </div>
          
          {/* Testimonials Grid matching: Mobile: 1, Tablet/Desktop: 2, Large screen: 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <PremiumCard key={test.id} className="flex flex-col justify-between space-y-5 h-full" borderGlow={true}>
                <div className="space-y-4">
                  {/* Quote icon and badge */}
                  <div className="flex justify-between items-center">
                    <Quote size={20} className="text-primary-red rotate-180 opacity-60" fill="currentColor" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 shadow-sm">
                      {test.impact}
                    </span>
                  </div>

                  <p className="text-xs italic font-light text-var-txt-primary leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>

                {/* Profile row */}
                <div className="flex items-center gap-3 pt-4 border-t border-var-border/40">
                  <img 
                    src={test.photo} 
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border border-var-border"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs truncate">{test.name}</h4>
                    <p className="text-[10px] text-var-txt-secondary truncate">{test.role} • {test.location}</p>
                  </div>
                  {/* Blood Group Badge */}
                  <div className="w-8 h-8 rounded-lg bg-primary-red/10 border border-primary-red/25 flex items-center justify-center text-primary-red font-bold text-xs shrink-0 select-none">
                    {test.group}
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PARTNER ORGANIZATIONS */}
      <section className="py-16 bg-var-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-var-txt-secondary font-bold uppercase tracking-widest mb-10">Affiliated Medical Councils & Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-45 dark:opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="flex items-center gap-1 text-sm font-bold tracking-wider"><Building size={20} className="text-primary-red" /> APOLLO LABS</div>
            <div className="flex items-center gap-1 text-sm font-bold tracking-wider"><Building size={20} className="text-primary-red" /> FORTIS HEALTHCARE</div>
            <div className="flex items-center gap-1 text-sm font-bold tracking-wider"><Building size={20} className="text-primary-red" /> MAX HOSPITALS</div>
            <div className="flex items-center gap-1 text-sm font-bold tracking-wider"><Building size={20} className="text-primary-red" /> RED CROSS COUNCILS</div>
            <div className="flex items-center gap-1 text-sm font-bold tracking-wider"><Building size={20} className="text-primary-red" /> GOVT. BLOOD BANK</div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-24 bg-gradient-to-br from-dark-red to-charcoal text-pure-white text-center relative overflow-hidden border-t border-var-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,57,53,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-wide uppercase">
            Become someone's reason to smile.
          </h2>
          <p className="text-soft-silver text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
            Your single donation of 1 unit can save up to three lives. Join our community registry, keep track of your eligibility, and answer the call.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/directory"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary-red hover:bg-pure-white hover:text-primary-red text-pure-white font-bold tracking-wide rounded-xl shadow-lg transition-all"
            >
              Become Donor
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 border border-soft-silver/40 hover:border-pure-white text-pure-white font-bold tracking-wide rounded-xl transition-all"
            >
              Contact Alliance
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Home
