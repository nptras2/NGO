import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Calendar } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Siddharth Roy',
    role: 'Leukemia Survivor',
    quote: 'LifeSaver NGO connected us with an AB- donor within 35 minutes when my chemotherapy levels dropped critically. They did not just find blood, they literally gave me my father back. The verification system is a godsend.',
    location: 'Kolkata, WB',
    date: 'April 2026',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces'
  },
  {
    id: 2,
    name: 'Dr. Archana Sen',
    role: 'Chief Surgeon, Fortis',
    quote: 'Emergency surgery cannot wait. Having a searchable registry where we can filter donors by city and immediate eligibility saves hours of administrative telephone calls. This is the healthcare gold standard.',
    location: 'Delhi NCR',
    date: 'June 2026',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces'
  },
  {
    id: 3,
    name: 'Manpreet Singh',
    role: 'Active O- Donor',
    quote: 'I check my eligibility status directly on the portal. Once the 90 days are up, I get notified and book a slot at the nearest camp. The entire process is premium, digital, and completely transparent.',
    location: 'Chandigarh',
    date: 'May 2026',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces'
  }
]

export const TestimonialsSlider = () => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(timer)
  }, [index])

  const handlePrev = () => {
    setDirection(-1)
    setIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir < 0 ? 120 : -120,
      opacity: 0
    })
  }

  const current = testimonials[index]

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 text-primary-red/5 dark:text-primary-red/10 pointer-events-none transform -translate-x-6 -translate-y-6">
        <Quote size={120} fill="currentColor" className="stroke-none" />
      </div>

      <div className="min-h-[260px] relative flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full glass-panel rounded-2xl p-6 md:p-10 border flex flex-col md:flex-row items-center md:items-start gap-8 z-10"
          >
            {/* User Photo */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-primary-red/30 shadow-lg">
                <img 
                  src={current.photo} 
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-red rounded-full flex items-center justify-center text-pure-white shadow-md">
                <Quote size={12} fill="currentColor" />
              </div>
            </div>

            {/* Testimonial details */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <p className="text-base md:text-lg italic font-light text-text-primary leading-relaxed">
                "{current.quote}"
              </p>
              
              <div className="pt-2 border-t border-border-color/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base tracking-wide">{current.name}</h4>
                  <span className="text-xs text-primary-red font-semibold uppercase tracking-wider">{current.role}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-3 text-xs text-text-secondary">
                  <span>{current.location}</span>
                  <span className="text-border-color">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {current.date}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Controllers */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={handlePrev}
          className="p-2 border border-border-color hover:border-primary-red hover:text-primary-red rounded-full bg-bg-primary hover:bg-bg-secondary transition-all shadow-sm"
          aria-label="Previous story"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > index ? 1 : -1)
                setIndex(idx)
              }}
              className={`h-2 rounded-full transition-all ${
                idx === index ? 'w-6 bg-primary-red' : 'w-2 bg-border-color'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 border border-border-color hover:border-primary-red hover:text-primary-red rounded-full bg-bg-primary hover:bg-bg-secondary transition-all shadow-sm"
          aria-label="Next story"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
export default TestimonialsSlider
