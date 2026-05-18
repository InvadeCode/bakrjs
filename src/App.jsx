import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useInView, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight, Menu, X, ArrowRight } from 'lucide-react';

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600&display=swap');
      
      :root {
        --bg-color: #000000;
        --text-color: #ffffff;
      }

      body {
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family: 'Montserrat', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }

      .font-bebas {
        font-family: 'Bebas Neue', sans-serif;
      }

      .font-montserrat {
        font-family: 'Montserrat', sans-serif;
      }

      @media (min-width: 768px) {
        body, a, button, [role="button"], input, select, textarea {
          cursor: none;
        }
      }

      ::selection {
        background-color: #ffffff;
        color: #000000;
      }

      ::-webkit-scrollbar {
        display: none;
      }
      
      .noise-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.04;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      }

      .text-outline {
        color: transparent;
        -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        transition: all 0.3s ease;
      }
      
      .group:hover .text-outline {
        color: #ffffff;
        -webkit-text-stroke: 1px #ffffff;
      }

      /* Logo Filter: Strip colors and ensure stark B&W contrast */
      .logo-filter {
        filter: grayscale(1) invert(1) brightness(1.5);
      }
    `
  }} />
);

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

const CustomCursor = () => {
  const { x, y } = useMousePosition();
  const [hoverState, setHoverState] = useState(null);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('.hover-trigger')) {
        setHoverState('view');
      } else if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('button') || target.closest('a')) {
        setHoverState('element');
      } else {
        setHoverState(null);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full mix-blend-difference pointer-events-none z-[10000] hidden md:flex items-center justify-center"
      animate={{
        x: x - 6,
        y: y - 6,
        scale: hoverState === 'view' ? 5 : hoverState === 'element' ? 1.5 : 1,
        opacity: x === 0 && y === 0 ? 0 : 1
      }}
      transition={{ type: 'spring', stiffness: 800, damping: 35, mass: 0.5 }}
    >
      {hoverState === 'view' && <span className="text-[4px] text-black font-bold mix-blend-normal font-montserrat">ENTER</span>}
    </motion.div>
  );
};

const MagneticElement = ({ children, className }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.4;
    const y = (e.clientY - (top + height / 2)) * 0.4;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const EliteButton = ({ children, onClick }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.3;
    const y = (e.clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="group relative overflow-hidden bg-white text-black px-10 py-4 font-montserrat font-bold uppercase tracking-widest text-xs transition-all duration-500"
    >
      <div className="absolute inset-0 bg-neutral-900 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0" />
      <span className="relative z-10 group-hover:text-white transition-colors duration-500 flex items-center gap-4">
        <ScrambleText text={children} />
        <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 w-4 h-4" />
      </span>
    </motion.button>
  );
};

const ScrambleText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  const handleMouseEnter = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((letter, index) => {
        if(index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      if(iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <span onMouseEnter={handleMouseEnter} className={className}>
      {displayText}
    </span>
  );
};

const LiveTelemetry = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-10 right-6 md:right-12 flex flex-col items-end gap-1 font-montserrat text-[9px] text-neutral-500 tracking-[0.2em] uppercase z-20">
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
        <span>SYS.ONLINE</span>
      </div>
      <span className="text-right">
        PUNE, IND — {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
};

const ScrollIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.5, duration: 1 }}
    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
  >
    <span 
      className="font-montserrat text-[8px] tracking-[0.4em] uppercase text-neutral-500"
      style={{ writingMode: 'vertical-rl' }}
    >
      Scroll
    </span>
    <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-[20%] bg-white"
        animate={{ top: ["-20%", "120%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
    </div>
  </motion.div>
);

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 100);
      const easedProgress = progress < 50 ? 2 * progress * progress / 100 : 100 - Math.pow(-2 * progress / 100 + 2, 2) * 100 / 2;
      
      setCount(Math.floor(easedProgress));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-end justify-end p-8 bg-black"
      exit={{ y: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="font-bebas text-[20vw] leading-none text-white mix-blend-difference">
        {count}%
      </div>
    </motion.div>
  );
};

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoUrl = "https://static.wixstatic.com/media/548938_6262d3750486469083351e547d9f61b7~mv2.png";

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-50 mix-blend-difference text-white py-8 md:py-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="h-10 md:h-14 cursor-pointer flex items-center">
            <img 
              src={logoUrl} 
              alt="BAKR.JS Logo" 
              className="h-full w-auto logo-filter object-contain"
            />
          </div>

          <div className="hidden md:flex items-center gap-12 font-montserrat text-[10px] font-bold tracking-widest uppercase text-white">
            {['Solutions', 'Capabilities', 'Scale'].map((item) => (
              <MagneticElement key={item}>
                <a href={`#${item.toLowerCase()}`} className="hover:opacity-50 transition-opacity p-2 block">
                  {item}
                </a>
              </MagneticElement>
            ))}
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-white text-black flex flex-col justify-center px-8"
          >
            <button className="absolute top-6 right-6" onClick={() => setMobileMenuOpen(false)}>
              <X size={32} />
            </button>
            <div className="flex flex-col gap-8 font-bebas text-7xl tracking-normal uppercase">
              {['Solutions', 'Capabilities', 'Scale', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="hover:text-neutral-500 transition-colors"
                >
                  <ScrambleText text={item} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const GridElements = ({ color = "white" }) => {
  const opacityClass = color === "white" ? "bg-white" : "bg-black";
  const textClass = color === "white" ? "text-white/40" : "text-black/20";
  const borderClass = color === "white" ? "border-white/20" : "border-black/10";
  const pulseClass = color === "white" ? "bg-white" : "bg-black/60";

  return (
    <>
      <div className={`absolute left-[10%] top-0 bottom-0 w-[1px] ${opacityClass}/10`} />
      <div className={`absolute left-[40%] top-0 bottom-0 w-[1px] ${opacityClass}/5`} />
      <div className={`absolute left-[75%] top-0 bottom-0 w-[1px] ${opacityClass}/10`} />
      <div className={`absolute left-[90%] top-0 bottom-0 w-[1px] ${opacityClass}/5`} />
      
      <div className={`absolute top-[25%] left-0 right-0 h-[1px] ${opacityClass}/10`} />
      <div className={`absolute top-[60%] left-0 right-0 h-[1px] ${opacityClass}/5`} />
      <div className={`absolute top-[92%] left-0 right-0 h-[1px] ${opacityClass}/10`} />
      
      <div className={`absolute top-[25%] left-[40%] w-2 h-2 ${opacityClass} -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />
      <div className={`absolute top-[60%] left-[75%] w-16 h-16 border ${borderClass} -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center`}>
        <div className={`w-1 h-1 ${pulseClass} rounded-full animate-pulse`} />
      </div>
      
      <div className={`absolute top-[92%] left-[10%] text-[8px] font-montserrat ${textClass} -translate-y-full pl-3 pb-1 tracking-[0.2em] uppercase`}>INFRA_SC</div>
      <div className={`absolute top-[25%] left-[90%] text-[8px] font-montserrat ${textClass} -translate-y-full pl-3 pb-1 tracking-[0.2em] uppercase`}>LLM_ENV</div>
      <div className={`absolute top-[60%] left-[10%] text-[8px] font-montserrat ${textClass} translate-y-2 pl-3 tracking-[0.2em] uppercase`}>AI_CORE</div>
      
      <div className={`absolute top-0 left-[40%] w-[1px] h-[200%] ${opacityClass}/5 origin-top-left -rotate-[35deg]`} />
    </>
  );
};

const HeroBackground = ({ mouseX, mouseY }) => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-[#020202]">
      <div className="absolute inset-0 w-full h-full opacity-30">
        <GridElements color="white" />
      </div>

      <motion.div 
        className="absolute inset-0 w-full h-full opacity-100"
        style={{
          maskImage: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,1), rgba(255,255,255,0) 60%)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,1), rgba(255,255,255,0) 60%)`
        }}
      >
        <GridElements color="white" />
      </motion.div>
    </div>
  );
};

const StatementBackground = () => {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
      <motion.div style={{ y: yParallax }} className="absolute inset-0 w-full h-full">
        <div className="absolute left-[5%] top-0 bottom-0 w-[1px] bg-black/5" />
        <div className="absolute left-[25%] top-0 bottom-0 w-[1px] bg-black/10" />
        <div className="absolute left-[65%] top-0 bottom-0 w-[1px] bg-black/5" />
        <div className="absolute left-[85%] top-0 bottom-0 w-[1px] bg-black/10" />
        
        <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-black/5" />
        <div className="absolute top-[45%] left-0 right-0 h-[1px] bg-black/10" />
        <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-black/5" />
        
        <motion.div 
          className="absolute left-[25%] top-0 w-[1px] h-32 bg-black/40"
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute left-[85%] top-0 w-[1px] h-48 bg-black/30"
          animate={{ top: ["110%", "-10%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="absolute top-[45%] left-[25%] w-1.5 h-1.5 bg-black -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-[15%] left-[65%] w-1 h-1 bg-black/40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-[75%] left-[5%] text-[7px] font-montserrat text-black/30 -translate-y-full pl-2 tracking-widest uppercase">DATA_LINK_04</div>
      </motion.div>
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const textX = useSpring(useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [15, -15]), springConfig);
  const textY = useSpring(useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [15, -15]), springConfig);

  const handleMouseMove = ({ clientX, clientY }) => {
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  return (
    <section className="relative h-screen flex flex-col justify-center overflow-hidden bg-black" onMouseMove={handleMouseMove}>
      <HeroBackground mouseX={mouseX} mouseY={mouseY} />
      
      <motion.div style={{ y, opacity }} className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-start mt-12 md:mt-24 pointer-events-none">
        
        <div className="mb-8 flex items-center gap-6 overflow-hidden">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
          />
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-12 h-[1px] bg-white/40"
          />
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-montserrat text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-neutral-400"
          >
            Enterprise AI Systems
          </motion.span>
        </div>

        <motion.div 
          style={{ x: textX, y: textY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col font-bebas text-[22vw] md:text-[18vw] leading-[0.75] mb-8"
        >
          <div className="overflow-hidden py-2">
            <motion.div 
              initial={{y: "100%"}} 
              animate={{y: 0}} 
              transition={{delay: 0.1, duration: 1, ease: [0.76, 0, 0.24, 1]}}
              className="text-white drop-shadow-2xl"
            >
              Intelligent
            </motion.div>
          </div>
          <div className="overflow-hidden py-2 flex items-center gap-4">
            <motion.div 
              initial={{y: "100%"}} 
              animate={{y: 0}} 
              transition={{delay: 0.2, duration: 1, ease: [0.76, 0, 0.24, 1]}} 
              className="text-transparent pl-2 md:pl-12" 
              style={{ WebkitTextStroke: "2px rgba(255,255,255,0.9)" }}
            >
              Systems.
            </motion.div>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-montserrat text-[11px] md:text-xs text-neutral-400 max-w-sm font-light mb-12 leading-relaxed border-l border-white/20 pl-6"
        >
          We engineer scalable AI solutions and enterprise-grade IT infrastructure. Building the cognitive backbone for modern industry at infinite scale.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="pointer-events-auto"
        >
          <EliteButton>
            Request Demo
          </EliteButton>
        </motion.div>
      </motion.div>

      <LiveTelemetry />
      <ScrollIndicator />
    </section>
  );
};

const Statement = () => {
  return (
    <section className="py-40 md:py-64 bg-white text-black px-6 md:px-12 overflow-hidden relative">
      <StatementBackground />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col gap-2">
          
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="font-bebas text-[14vw] md:text-[10vw] leading-[0.8] uppercase"
            >
              Cognitive
            </motion.h2>
          </div>

          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="font-bebas text-[14vw] md:text-[10vw] leading-[0.8] uppercase text-neutral-400"
            >
              Infrastructure.
            </motion.h2>
          </div>

          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="font-bebas text-[14vw] md:text-[10vw] leading-[0.8] uppercase"
            >
              Distributed.
            </motion.h2>
          </div>

          <div className="mt-16 flex flex-col md:flex-row md:items-end justify-between gap-12 pt-12 border-t border-black/10">
             <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="font-montserrat text-[10px] md:text-xs text-neutral-500 max-w-md leading-relaxed uppercase tracking-[0.2em]"
            >
              Engineering the next era of IT. Distributed intelligence built for infinite enterprise scale. We solve the impossible with clarity and precision.
            </motion.p>
            
            <motion.div 
               initial={{ scaleX: 0 }}
               whileInView={{ scaleX: 1 }}
               transition={{ duration: 1.5, delay: 0.6 }}
               viewport={{ once: true }}
               className="h-[1px] bg-black w-24 origin-left hidden md:block"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

const Work = () => {
  const projects = [
    { name: "Neural Core", category: "Custom LLM", year: "26" },
    { name: "Apex Engine", category: "Predictive Analytics", year: "25" },
    { name: "Cloud Genesis", category: "Auto-Scaling Infra", year: "25" },
    { name: "Sentinel", category: "Enterprise Cyber AI", year: "24" }
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { x, y } = useMousePosition();
  
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const cursorX = useSpring(x, springConfig);
  const cursorY = useSpring(y, springConfig);

  return (
    <section id="work" className="py-32 container mx-auto px-6 md:px-12 relative">
      <div className="mb-20 flex justify-between items-end border-b border-white/20 pb-6">
        <h2 className="font-montserrat text-xs font-bold tracking-widest uppercase">Solution Index</h2>
        <span className="font-montserrat text-[10px] text-neutral-500">(04)</span>
      </div>

      <div className="flex flex-col relative z-10">
        {projects.map((project, i) => (
          <div 
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-white/10 cursor-pointer hover-trigger transition-colors duration-500 hover:border-white"
          >
            <div className="flex items-center gap-6 md:gap-12">
              <span className="font-montserrat text-xs text-neutral-600 transition-colors group-hover:text-white">0{i+1}</span>
              <h3 className="font-bebas text-6xl md:text-[8vw] uppercase text-outline leading-none group-hover:text-white group-hover:-webkit-text-stroke-[0px]">
                {project.name}
              </h3>
            </div>
            <div className="flex items-center gap-8 mt-2 md:mt-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-neutral-400">{project.category}</span>
              <span className="font-montserrat text-[10px]">{project.year}</span>
            </div>
          </div>
        ))}
      </div>

      <motion.div 
        className="fixed top-0 left-0 pointer-events-none z-0 hidden md:block mix-blend-difference"
        style={{ x: cursorX, y: cursorY }}
      >
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -5, x: "-50%", y: "-50%" }}
              animate={{ opacity: 0.2, scale: 1, rotate: 0, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.8, rotate: 5, x: "-50%", y: "-50%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-[25vw] h-[35vw] bg-white rounded-sm absolute"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

const Capabilities = () => {
  const items = [
    "Generative AI Models",
    "Cloud Scale Architecture",
    "Predictive Intelligence",
    "Distributed Networks",
    "Automated Systems"
  ];

  return (
    <section id="capabilities" className="py-32 bg-white text-black">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row justify-between items-start gap-16">
        
        <div className="lg:w-1/3 sticky top-40">
          <h2 className="font-bebas text-[8vw] md:text-[6vw] leading-none uppercase mb-6">Expertise.</h2>
          <p className="font-montserrat text-xs text-neutral-500 max-w-[280px] leading-relaxed">
            High-performance IT infrastructure and AI implementation. We don't just build software; we build intelligence that scales with your ambition.
          </p>
        </div>

        <div className="lg:w-1/2 flex flex-col w-full mt-12 lg:mt-0">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="py-8 border-b border-black/20 hover:border-black flex justify-between items-center group cursor-pointer transition-colors"
            >
              <h3 className="font-bebas text-4xl md:text-6xl uppercase transition-transform duration-300 group-hover:translate-x-4">
                {item}
              </h3>
              <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300 w-6 h-6" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-40 flex flex-col items-center justify-center text-center px-6">
      <p className="font-montserrat text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-6">Scale Today</p>
      <h2 className="font-bebas text-[16vw] md:text-[12vw] leading-[0.8] uppercase mb-12">
        Upgrade Your<br/>Intelligence.
      </h2>
      <EliteButton>
        Contact Enterprise
      </EliteButton>
    </section>
  );
};

const Footer = () => {
  const logoUrl = "https://static.wixstatic.com/media/548938_6262d3750486469083351e547d9f61b7~mv2.png";
  return (
    <footer className="border-t border-white/10 pt-20 pb-16">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center">
        <div className="h-12 md:h-16 mb-12">
            <img 
              src={logoUrl} 
              alt="BAKR.JS Logo" 
              className="h-full w-auto logo-filter opacity-70 hover:opacity-100 transition-opacity object-contain"
            />
        </div>
        
        <div className="flex gap-12 font-montserrat text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">API Status</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
        
        <div className="mt-16 font-montserrat text-[8px] tracking-[0.4em] uppercase text-neutral-700">
          © 2026 BAKR.JS — INTELLIGENT SYSTEMS AT SCALE
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; }
  }, []);

  return (
    <>
      <GlobalStyles />
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {loading ? (
          <Preloader key="preloader" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="noise-overlay" />
            <Navigation />
            
            <main>
              <Hero />
              <Statement />
              <Work />
              <Capabilities />
              <FinalCTA />
            </main>
            
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
