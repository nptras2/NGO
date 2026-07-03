import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Float } from '@react-three/drei'
import { Droplet, ShieldCheck, Heart, Award, Landmark, User, Clock, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { PremiumCard } from '../components/PremiumCard'

// Floating particles background for About page
const AboutBG = () => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5] }}
      gl={{ alpha: true }}
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
    >
      <ambientLight intensity={0.5} />
      <Sparkles count={60} scale={8} size={2.5} speed={0.2} color="#E53935" opacity={0.5} />
      
      {/* A couple of larger slow rotating cells */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-2, 1, -2]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#C62828" opacity={0.35} transparent />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[2.5, -1.5, -3]}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshBasicMaterial color="#E53935" opacity={0.25} transparent />
        </mesh>
      </Float>
    </Canvas>
  )
}

const milestones = [
  { year: '2020', title: 'Alliance Founding', desc: 'Started as a localized WhatsApp coordination group during medical shortages, managing emergency requests for O- type blood.' },
  { year: '2022', title: 'ISO 9001 Integration', desc: 'Registered officially as a healthcare NGO. Adopted ISO standards for screening, donor records, and storage coordination.' },
  { year: '2024', title: 'Digital Directory Launch', desc: 'Launched the central web registry mapping over 2,000 certified donors across major metropolitan districts.' },
  { year: '2026', title: 'National Expansion', desc: 'Linked operations with 12 government medical clinics, deploying monthly mobile camps and maintaining real-time dashboards.' }
]

export const About = () => {
  return (
    <div className="relative w-full overflow-hidden">
      
      {/* 3D background canvas */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <AboutBG />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 space-y-24">
        
        {/* Section 1: NGO Story / Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-red">Our Founding Heritage</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Bridging the Critical Gap in <br />
              <span className="text-primary-red">Emergency Transfusion.</span>
            </h1>
            <p className="text-text-secondary text-sm sm:text-base font-light leading-relaxed">
              Every two seconds, someone needs blood. Often, hospitals face critical shortages of specific subgroups, and families are forced to search frantically. Lifesaver NGO was established to solve this structural deficit. We design digital registry pipelines that connect patients with certified, eligible local donors instantly.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 text-xs font-semibold text-text-secondary">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary-red" />
                ISO 9001 Certified Networks
              </div>
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-primary-red" />
                100% Free Public Coordination
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Glass Box */}
            <div className="glass-panel p-8 border rounded-2xl max-w-sm shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-red/5 rounded-full blur-2xl" />
              <Droplet size={48} className="text-primary-red fill-primary-red" />
              <h3 className="font-bold text-lg">National Blood Alliance</h3>
              <p className="text-xs text-text-secondary font-light leading-relaxed">
                By maintaining a direct-communication loop between donors and medical staff, we bypass legacy administrative delays.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PremiumCard className="p-8 bg-var-card border border-var-border/60" hoverLift={true} borderGlow={true}>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Heart className="text-primary-red" size={20} />
              Our Core Mission
            </h3>
            <p className="text-var-txt-secondary text-sm font-light leading-relaxed">
              To secure a zero-deficit blood supply system where no patient suffers due to lookup delays. We achieve this by educating the youth on regular donations, building high-grade software infrastructure, and coordinating safe community blood collection campaigns.
            </p>
          </PremiumCard>

          <PremiumCard className="p-8 bg-var-card border border-var-border/60" hoverLift={true} borderGlow={true}>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Award className="text-primary-red" size={20} />
              Our Vision
            </h3>
            <p className="text-var-txt-secondary text-sm font-light leading-relaxed">
              To scale a global, decentralised network of verified blood donors that integrates seamlessly with national emergency grids, providing hospitals with rapid, digital access to life-saving subgroups within minutes of request filing.
            </p>
          </PremiumCard>
        </div>

        {/* Section 3: Founder Message */}
        <div className="glass-panel p-8 md:p-12 border rounded-2xl bg-bg-primary shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden border-[3px] border-primary-red/10 shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=faces" 
              alt="Dr. Manoj Prabhakar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-red">Message from our Founder</span>
            <blockquote className="text-sm sm:text-base italic font-light text-text-primary leading-relaxed">
              "Providing blood isn't just a clinical process; it is a shared human covenant. Technology allows us to organize this covenant efficiently, transforming chaotic emergency searches into peaceful, structured community support. We are humbled by the donors who log in daily to offer the gift of life."
            </blockquote>
            <div>
              <h4 className="font-bold text-sm">Dr. Manoj Prabhakar</h4>
              <p className="text-xs text-text-secondary font-light">Founder & President, Lifesaver Alliance</p>
            </div>
          </div>
        </div>

        {/* Section 4: Milestones Timeline */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Milestones Timeline</h2>
            <p className="text-text-secondary text-xs font-light mt-1">Our path from a localized volunteer group to a national network.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative before:absolute before:top-4 before:left-4 md:before:left-0 md:before:right-0 before:h-[2px] before:bg-border-color/20">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0 md:pt-8 space-y-2">
                {/* node dot */}
                <div className="absolute left-3 top-1.5 md:left-0 md:top-0 w-[14px] h-[14px] bg-primary-red rounded-full transform -translate-y-1.5 border-2 border-pure-white" />
                <span className="text-2xl font-black text-primary-red block font-mono">{ms.year}</span>
                <h4 className="font-bold text-sm">{ms.title}</h4>
                <p className="text-xs text-text-secondary font-light leading-relaxed">{ms.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Achievements & Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <PremiumCard className="p-6 bg-var-card border border-var-border/60 flex flex-col justify-center items-center space-y-2" hoverLift={true} borderGlow={true}>
            <Landmark size={32} className="text-primary-red mb-2" />
            <h4 className="text-3xl font-extrabold text-var-txt-primary">12+</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-var-txt-secondary">Hospital Partners</p>
            <p className="text-xs text-var-txt-secondary font-light">Direct integration with city medical centers.</p>
          </PremiumCard>
          
          <PremiumCard className="p-6 bg-var-card border border-var-border/60 flex flex-col justify-center items-center space-y-2" hoverLift={true} borderGlow={true}>
            <User size={32} className="text-primary-red mb-2" />
            <h4 className="text-3xl font-extrabold text-var-txt-primary">4,800+</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-var-txt-secondary">Active Members</p>
            <p className="text-xs text-var-txt-secondary font-light">Volunteers supporting camps and coordination.</p>
          </PremiumCard>
          
          <PremiumCard className="p-6 bg-var-card border border-var-border/60 flex flex-col justify-center items-center space-y-2" hoverLift={true} borderGlow={true}>
            <Star size={32} className="text-primary-red mb-2" />
            <h4 className="text-3xl font-extrabold text-var-txt-primary">98.5%</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-var-txt-secondary">Success Rate</p>
            <p className="text-xs text-var-txt-secondary font-light">Resolved emergency filings within 2 hours.</p>
          </PremiumCard>
        </div>

      </div>
    </div>
  )
}
export default About
