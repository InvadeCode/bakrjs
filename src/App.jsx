import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue, useMotionTemplate, useInView } from 'framer-motion';
import { ArrowUpRight, Menu, X, ArrowRight, ShieldCheck, Cpu, Database, Activity, ArrowUp, Terminal, Sliders, Layers, Server, ShieldAlert, CheckCircle2 } from 'lucide-react';

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700&display=swap');
      
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
        -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
      }
      
      .group:hover .text-outline {
        color: #ffffff;
        -webkit-text-stroke: 1.5px #ffffff;
      }

      .text-outline-dark {
        color: transparent;
        -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.7);
        transition: all 0.3s ease;
      }
      
      .group:hover .text-outline-dark {
        color: #000000;
        -webkit-text-stroke: 1.5px #000000;
      }

      .logo-filter {
        filter: grayscale(1) invert(1) brightness(2);
      }

      .footer-input {
        background: transparent;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        transition: border-color 0.4s ease;
        border-radius: 0;
      }
      .footer-input:focus {
        outline: none;
        border-bottom-color: rgba(255, 255, 255, 1);
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: #ffffff;
        border-radius: 50%;
        cursor: pointer;
      }

      .scanning-bar {
        background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
        animation: scan 2s linear infinite;
      }

      @keyframes scan {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(500%); }
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
      } else if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('button') || target.closest('a') || target.closest('input') || target.closest('select')) {
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

const EliteButton = ({ children, onClick, variant = "primary", disabled = false }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.3;
    const y = (e.clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const baseStyle = variant === "primary" 
    ? "bg-white text-black border border-white" 
    : "bg-transparent text-white border border-white/20 hover:border-white active:border-white";

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`group relative overflow-hidden px-6 sm:px-8 py-3.5 font-montserrat font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-500 w-full sm:w-auto text-center justify-center flex ${baseStyle} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {!disabled && <div className={`absolute inset-0 ${variant === 'primary' ? 'bg-neutral-900' : 'bg-white'} translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0 hidden md:block`} />}
      <span className={`relative z-10 flex items-center gap-3 transition-colors duration-500 ${variant === 'primary' && !disabled ? 'md:group-hover:text-white' : !disabled ? 'md:group-hover:text-black' : ''}`}>
        <ScrambleText text={children} runOnMount={true} />
        {!disabled && <ArrowUpRight className="md:group-hover:translate-x-1 md:group-hover:-translate-y-1 transition-transform duration-500 w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
      </span>
    </motion.button>
  );
};

const ScrambleText = ({ text, className, trigger = null, runOnMount = false }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const hasRun = useRef(false);
  
  const scramble = () => {
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

  useEffect(() => {
    if (trigger !== null) {
      scramble();
    }
  }, [trigger]);

  useEffect(() => {
    if (runOnMount && !hasRun.current) {
      scramble();
      hasRun.current = true;
    }
  }, [runOnMount]);

  return (
    <span onMouseEnter={scramble} className={className}>
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
    <div className="absolute bottom-10 hidden md:flex flex-col items-end gap-1 font-montserrat text-[9px] text-neutral-500 tracking-[0.2em] uppercase z-20" style={{ right: 'max(1.5rem, 3%)' }}>
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
    className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
  >
    <span 
      className="font-montserrat text-[8px] tracking-[0.4em] uppercase text-neutral-500"
      style={{ writingMode: 'vertical-rl' }}
    >
      Scroll
    </span>
    <div className="w-[1px] h-12 sm:h-16 bg-white/10 relative overflow-hidden">
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
    const duration = 1200;
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
        setTimeout(onComplete, 200);
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

const Navigation = ({ onNavigate, currentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoUrl = "https://static.wixstatic.com/media/548938_6262d3750486469083351e547d9f61b7~mv2.png";

  const handleNav = (target) => {
    setMobileMenuOpen(false);
    onNavigate(target);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'about', label: 'About Us' },
    { id: 'tech', label: 'Why We Rock' },
    { id: 'blogs', label: 'Insights' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-50 mix-blend-difference text-white py-6 md:py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="w-full flex items-center justify-between" style={{ paddingLeft: 'max(1.25rem, 1.5%)', paddingRight: 'max(1.25rem, 1.5%)' }}>
          <div className="h-[22px] sm:h-[26px] md:h-[36px] cursor-pointer flex items-center shrink-0" onClick={() => handleNav('home')}>
            <img 
              src={logoUrl} 
              alt="BAKR.JS Logo" 
              className="h-full w-auto logo-filter object-contain"
            />
          </div>

          <div className="hidden lg:flex items-center gap-10 font-montserrat text-[10px] font-bold tracking-widest uppercase text-white">
            {navLinks.filter(l => l.id !== 'home').map((link) => (
              <MagneticElement key={link.id}>
                <button 
                  onClick={() => handleNav(link.id)} 
                  className={`hover:opacity-50 transition-opacity p-2 block ${currentPage === link.id ? 'underline decoration-2 underline-offset-4' : ''}`}
                >
                  {link.label}
                </button>
              </MagneticElement>
            ))}
          </div>

          <button className="lg:hidden p-2 text-white active:scale-95 transition-transform" onClick={() => setMobileMenuOpen(true)}>
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
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-white text-black flex flex-col justify-center px-8"
          >
            <button className="absolute top-6 right-6 p-4 text-black active:scale-90 transition-transform" onClick={() => setMobileMenuOpen(false)}>
              <X size={32} />
            </button>
            <div className="flex flex-col gap-6 sm:gap-8 font-bebas text-5xl sm:text-6xl md:text-7xl tracking-normal uppercase">
              {navLinks.map((link, i) => (
                <div key={link.id} className="overflow-hidden">
                  <motion.button 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ delay: 0.1 + (i * 0.05), duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    onClick={() => handleNav(link.id)} 
                    className="text-left hover:text-neutral-500 transition-colors block w-full"
                  >
                    {link.label}
                  </motion.button>
                </div>
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
      <div className={`absolute left-[3%] sm:left-[max(1.5rem,3%)] top-0 bottom-0 w-[1px] ${opacityClass}/10`} />
      <div className={`absolute left-[40%] top-0 bottom-0 w-[1px] ${opacityClass}/5 hidden sm:block`} />
      <div className={`absolute left-[75%] top-0 bottom-0 w-[1px] ${opacityClass}/10 hidden sm:block`} />
      <div className={`absolute right-[3%] sm:right-[max(1.5rem,3%)] top-0 bottom-0 w-[1px] ${opacityClass}/10`} />
      
      <div className={`absolute top-[25%] left-0 right-0 h-[1px] ${opacityClass}/10`} />
      <div className={`absolute top-[60%] left-0 right-0 h-[1px] ${opacityClass}/5`} />
      <div className={`absolute top-[92%] left-0 right-0 h-[1px] ${opacityClass}/10`} />
      
      <div className={`absolute top-[25%] left-[40%] w-2 h-2 ${opacityClass} -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.8)] hidden sm:block`} />
      <div className={`absolute top-[60%] right-[3%] sm:right-[max(1.5rem,3%)] w-12 h-12 sm:w-16 sm:h-16 border ${borderClass} translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center`}>
        <div className={`w-1 h-1 ${pulseClass} rounded-full animate-pulse`} />
      </div>
      
      <div className={`absolute top-[92%] left-[max(1.5rem,3%)] text-[6px] sm:text-[8px] font-montserrat ${textClass} -translate-y-full pl-2 sm:pl-3 pb-1 tracking-[0.2em] uppercase`}>IT_INFRA</div>
      <div className={`absolute top-[25%] right-[max(1.5rem,3%)] text-[6px] sm:text-[8px] font-montserrat ${textClass} -translate-y-full pr-2 sm:pr-3 pb-1 tracking-[0.2em] uppercase`}>AI_CORE</div>
      <div className={`absolute top-[60%] left-[max(1.5rem,3%)] text-[6px] sm:text-[8px] font-montserrat ${textClass} translate-y-2 pl-2 sm:pl-3 tracking-[0.2em] uppercase`}>SEC_NODE</div>
      
      <div className={`absolute top-0 left-[40%] w-[1px] h-[200%] ${opacityClass}/5 origin-top-left -rotate-[35deg] hidden sm:block`} />
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
        className="absolute inset-0 w-full h-full opacity-100 hidden md:block"
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
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none opacity-40 hidden sm:block">
      <motion.div style={{ y: yParallax }} className="absolute inset-0 w-full h-full">
        <div className="absolute left-[3%] top-0 bottom-0 w-[1px] bg-black/10" />
        <div className="absolute left-[25%] top-0 bottom-0 w-[1px] bg-black/5" />
        <div className="absolute left-[65%] top-0 bottom-0 w-[1px] bg-black/5" />
        <div className="absolute right-[3%] top-0 bottom-0 w-[1px] bg-black/10" />
        
        <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-black/5" />
        <div className="absolute top-[45%] left-0 right-0 h-[1px] bg-black/10" />
        <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-black/5" />
        
        <motion.div 
          className="absolute left-[25%] top-0 w-[1px] h-32 bg-black/40"
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute right-[3%] top-0 w-[1px] h-48 bg-black/30"
          animate={{ top: ["110%", "-10%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="absolute top-[45%] left-[25%] w-1.5 h-1.5 bg-black -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-[15%] left-[65%] w-1 h-1 bg-black/40 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </div>
  );
};

const Hero = ({ onNavigate }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const textX = useSpring(useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [10, -10]), springConfig);
  const textY = useSpring(useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [10, -10]), springConfig);

  const handleMouseMove = ({ clientX, clientY }) => {
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  return (
    <section className="relative h-[100svh] min-h-[600px] flex flex-col justify-center overflow-hidden bg-black" onMouseMove={handleMouseMove}>
      <HeroBackground mouseX={mouseX} mouseY={mouseY} />
      
      <motion.div 
        style={{ y, opacity, paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }} 
        className="w-full relative z-10 flex flex-col items-start pointer-events-none mt-8 md:mt-24"
      >
        <div className="mb-6 md:mb-8 flex items-center gap-4 sm:gap-6 overflow-hidden">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse"
          />
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-8 sm:w-12 h-[1px] bg-white/40"
          />
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-montserrat text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-neutral-400"
          >
            Enterprise IT & AI Solutions
          </motion.span>
        </div>

        {/* Clamped typography scale for flawless rendering across all devices */}
        <motion.div 
          style={{ x: textX, y: textY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col font-bebas text-[20vw] sm:text-[16vw] lg:text-[11vw] leading-[0.8] md:leading-[0.75] mb-6 sm:mb-8 w-full"
        >
          <div className="overflow-hidden py-1 md:py-2">
            <motion.div 
              initial={{y: "100%"}} 
              animate={{y: 0}} 
              transition={{delay: 0.1, duration: 1, ease: [0.76, 0, 0.24, 1]}}
              className="text-white drop-shadow-2xl"
            >
              Smarter IT.
            </motion.div>
          </div>
          <div className="overflow-hidden py-1 md:py-2 flex items-center gap-2 sm:gap-4">
            <motion.div 
              initial={{y: "100%"}} 
              animate={{y: 0}} 
              transition={{delay: 0.2, duration: 1, ease: [0.76, 0, 0.24, 1]}} 
              className="text-transparent pl-1 sm:pl-4 md:pl-12" 
              style={{ WebkitTextStroke: "max(1px, 0.15vw) rgba(255,255,255,0.9)" }}
            >
              Better AI.
            </motion.div>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-montserrat text-[10px] sm:text-[11px] md:text-xs text-neutral-400 max-w-[280px] sm:max-w-sm md:max-w-md font-light mb-8 sm:mb-12 leading-relaxed border-l border-white/20 pl-4 sm:pl-6"
        >
          We build industry-leading IT infrastructure and highly effective AI systems. We eliminate inefficiencies and build tech that actually works. Plain and simple, we give your business a massive competitive edge.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="pointer-events-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <EliteButton onClick={() => onNavigate('contact')}>
            Start a Project
          </EliteButton>
          <EliteButton variant="secondary" onClick={() => onNavigate('solutions')}>
            Explore Potential
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
    <section 
      className="py-32 sm:py-40 md:py-64 bg-white text-black overflow-hidden relative"
      style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
    >
      <StatementBackground />
      
      <div className="w-full relative z-10">
        <div className="flex flex-col gap-1 sm:gap-2">
          
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="font-bebas text-[16vw] sm:text-[14vw] md:text-[10vw] leading-[0.85] sm:leading-[0.8] uppercase text-black"
            >
              Elite IT.
            </motion.h2>
          </div>

          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="font-bebas text-[16vw] sm:text-[14vw] md:text-[10vw] leading-[0.85] sm:leading-[0.8] uppercase text-outline-dark"
            >
              Scalable AI.
            </motion.h2>
          </div>

          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="font-bebas text-[16vw] sm:text-[14vw] md:text-[10vw] leading-[0.85] sm:leading-[0.8] uppercase text-black"
            >
              Proven Results.
            </motion.h2>
          </div>

          <div className="mt-10 sm:mt-16 flex flex-col md:flex-row md:items-end justify-between gap-8 sm:gap-12 pt-8 sm:pt-12 border-t border-black/10">
             <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="font-montserrat text-[10px] sm:text-xs text-neutral-500 max-w-[280px] sm:max-w-md leading-relaxed uppercase tracking-[0.2em]"
            >
              We deliver the best IT engineering and AI automation for growing enterprises. No jargon, just reliable systems built to scale. We are the best at what we do.
            </motion.p>
            
            <motion.div 
               initial={{ scaleX: 0 }}
               whileInView={{ scaleX: 1 }}
               transition={{ duration: 1.5, delay: 0.4 }}
               viewport={{ once: true }}
               className="h-[1px] bg-black w-16 sm:w-24 origin-left"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

const Work = () => {
  const projects = [
    { name: "Global Data Lake", category: "IT Infrastructure", year: "26" },
    { name: "Predictive Supply AI", category: "Automation", year: "25" },
    { name: "Cloud Migration", category: "Enterprise IT", year: "25" },
    { name: "Threat Detection", category: "Cybersecurity", year: "24" }
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { x, y } = useMousePosition();
  
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const cursorX = useSpring(x, springConfig);
  const cursorY = useSpring(y, springConfig);

  return (
    <section 
      id="work" 
      className="py-24 sm:py-32 w-full relative"
      style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
    >
      <div className="mb-12 sm:mb-20 flex justify-between items-end border-b border-white/20 pb-4 sm:pb-6">
        <h2 className="font-montserrat text-[10px] sm:text-xs font-bold tracking-widest uppercase">Solution Index</h2>
        <span className="font-montserrat text-[9px] sm:text-[10px] text-neutral-500">(04)</span>
      </div>

      <div className="flex flex-col relative z-10 w-full">
        {projects.map((project, i) => (
          <div 
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group flex flex-col md:flex-row md:items-center justify-between py-6 sm:py-10 border-b border-white/10 cursor-pointer hover-trigger transition-colors duration-500 hover:border-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 md:gap-12">
              <span className="font-montserrat text-[10px] sm:text-xs text-neutral-600 transition-colors group-hover:text-white">0{i+1}</span>
              <h3 className="font-bebas text-4xl sm:text-6xl md:text-[8vw] uppercase md:text-outline leading-none group-hover:text-white group-hover:-webkit-text-stroke-[0px]">
                {project.name}
              </h3>
            </div>
            <div className="flex items-center gap-8 mt-4 md:mt-0 opacity-60 md:opacity-0 group-hover:opacity-100 transition-all duration-300 md:translate-y-2 group-hover:translate-y-0">
              <span className="font-montserrat text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-neutral-400">{project.category}</span>
              <span className="font-montserrat text-[9px] sm:text-[10px]">{project.year}</span>
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
    "Enterprise IT Infrastructure",
    "Custom AI Integration",
    "Legacy System Modernization",
    "Data Engineering",
    "Cloud & Security"
  ];

  return (
    <section 
      id="capabilities" 
      className="py-24 sm:py-32 bg-white text-black"
      style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
    >
      <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-12 sm:gap-16">
        
        <div className="lg:w-1/3 sticky top-40">
          <h2 className="font-bebas text-[12vw] sm:text-[8vw] md:text-[6vw] leading-none uppercase mb-4 sm:mb-6 text-black">Core Capabilities.</h2>
          <p className="font-montserrat text-xs text-neutral-500 max-w-[280px] leading-relaxed">
            We are industry leaders in IT modernization and AI deployment. We don't just upgrade software; we fundamentally improve how your business operates.
          </p>
        </div>

        <div className="lg:w-1/2 flex flex-col w-full mt-4 lg:mt-0">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="py-6 sm:py-8 border-b border-black/20 hover:border-black flex justify-between items-center group cursor-pointer transition-colors"
            >
              <h3 className="font-bebas text-3xl sm:text-4xl md:text-6xl uppercase md:transition-transform md:duration-300 md:group-hover:translate-x-4">
                {item}
              </h3>
              <ArrowRight className="opacity-0 md:group-hover:opacity-100 transition-opacity md:-translate-x-4 md:group-hover:translate-x-0 duration-300 w-5 h-5 sm:w-6 sm:h-6 hidden md:block" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* TOOL 1: IT & AI AUTOMATION CHECKER (WORKFLOW ANALYZER)                     */
/* -------------------------------------------------------------------------- */
const WorkflowAnalyzer = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ objective: '', friction: '', debt: '', volume: 50, timeline: '' });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const isStepValid = () => {
    if (step === 1) return data.objective !== '';
    if (step === 2) return data.friction !== '';
    if (step === 3) return data.debt !== '';
    if (step === 4) return true; // Slider always has a value
    if (step === 5) return data.timeline !== '';
    return false;
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      let score = 75 + Math.floor(Math.random() * 20); // 75-95%
      let arch = "CLOUD AI + DATA LAKE INFRASTRUCTURE";
      if (data.friction.includes('Visual')) arch = "EDGE VISION KERNELS + K8S ARRAY";
      if (data.friction.includes('Silos')) arch = "DISTRIBUTED RAG + VECTOR SHARDING";
      if (data.debt.includes('Severe')) arch = "COMPLETE BARE-METAL OVERHAUL + AI CORE";
      
      setResult({ score, arch });
      setAnalyzing(false);
      setStep(6);
    }, 3200);
  };

  const reset = () => {
    setData({ objective: '', friction: '', debt: '', volume: 50, timeline: '' });
    setStep(1);
    setResult(null);
  };

  return (
    <div className="w-full min-h-[420px]">
      <div className="flex flex-col lg:flex-row gap-10 sm:gap-16">
        <div className="lg:w-1/3">
          <h2 className="font-bebas text-3xl sm:text-4xl text-white uppercase leading-none mb-4">Automation Auditor</h2>
          <p className="font-montserrat text-[10px] sm:text-xs text-neutral-500 leading-relaxed mb-6 sm:mb-8">
            Complete this 5-stage diagnostic. Our engine will calculate your operational friction and propose a custom, enterprise-grade AI architecture.
          </p>
          <div className="h-[1px] bg-white/10 w-full mb-6 sm:mb-8" />
          <div className="font-mono text-[8px] sm:text-[9px] text-neutral-600 space-y-1">
            <p>AUDIT ID: 0x{Math.floor(Math.random()*16777215).toString(16).toUpperCase()}</p>
            <p>PHASE: 0{step} OF 05</p>
          </div>
        </div>

        <div className="lg:w-2/3 bg-[#050505] border border-white/5 p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden min-h-[380px]">
          <AnimatePresence mode="wait">
            
            {step === 1 && !analyzing && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">01 // Identify Primary Strategic Objective</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Maximize Compute Throughput', 'Eradicate Human Error', 'Slash Operational Overhead', 'Modernize Legacy Infrastructure'].map(opt => (
                    <button 
                      key={opt} onClick={() => setData({...data, objective: opt})}
                      className={`py-3 sm:py-4 px-4 text-left border text-[9px] sm:text-[10px] font-montserrat tracking-widest uppercase transition-all active:scale-[0.98] ${data.objective === opt ? 'border-white text-black bg-white' : 'border-white/10 text-neutral-500 md:hover:border-white/30 md:hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <EliteButton variant="secondary" onClick={() => setStep(2)} disabled={!isStepValid()}>Next Phase</EliteButton>
                </div>
              </motion.div>
            )}

            {step === 2 && !analyzing && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">02 // Select Core Data Friction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Fragmented Database Silos', 'High-Volume Unstructured Text', 'Real-Time Processing Bottlenecks', 'Complex Visual/Spatial Pipelines'].map(opt => (
                    <button 
                      key={opt} onClick={() => setData({...data, friction: opt})}
                      className={`py-3 sm:py-4 px-4 text-left border text-[9px] sm:text-[10px] font-montserrat tracking-widest uppercase transition-all active:scale-[0.98] ${data.friction === opt ? 'border-white text-black bg-white' : 'border-white/10 text-neutral-500 md:hover:border-white/30 md:hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center gap-4">
                  <button onClick={() => setStep(1)} className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white shrink-0">Go Back</button>
                  <EliteButton variant="secondary" onClick={() => setStep(3)} disabled={!isStepValid()}>Next Phase</EliteButton>
                </div>
              </motion.div>
            )}

            {step === 3 && !analyzing && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">03 // Assess Current Technical Debt</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Severe (Frequent Failures)', 'Moderate (Legacy Apps)', 'Light (Needs Optimization)', 'None (Greenfield)'].map(opt => (
                    <button 
                      key={opt} onClick={() => setData({...data, debt: opt})}
                      className={`py-3 sm:py-4 px-4 text-left border text-[9px] sm:text-[10px] font-montserrat tracking-widest uppercase transition-all active:scale-[0.98] ${data.debt === opt ? 'border-white text-black bg-white' : 'border-white/10 text-neutral-500 md:hover:border-white/30 md:hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center gap-4">
                  <button onClick={() => setStep(2)} className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white shrink-0">Go Back</button>
                  <EliteButton variant="secondary" onClick={() => setStep(4)} disabled={!isStepValid()}>Next Phase</EliteButton>
                </div>
              </motion.div>
            )}

            {step === 4 && !analyzing && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">04 // Define Operational Scale</h3>
                <div className="w-full">
                  <div className="flex justify-between font-montserrat text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-4">
                    <span>{data.volume}K QUERIES</span>
                    <span>10M+ QUERIES</span>
                  </div>
                  <input 
                    type="range" min="10" max="1000" value={data.volume} 
                    onChange={(e) => setData({...data, volume: Number(e.target.value)})}
                    className="w-full h-[2px] bg-neutral-800 appearance-none cursor-pointer accent-white"
                  />
                </div>
                <div className="mt-4 flex justify-between items-center gap-4">
                  <button onClick={() => setStep(3)} className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white shrink-0">Go Back</button>
                  <EliteButton variant="secondary" onClick={() => setStep(5)}>Next Phase</EliteButton>
                </div>
              </motion.div>
            )}

            {step === 5 && !analyzing && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">05 // Target Deployment Horizon</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Immediate Execution', 'Near-Term (Q2-Q3)', 'Long-Term (Q4+)', 'Exploratory Phase'].map(opt => (
                    <button 
                      key={opt} onClick={() => setData({...data, timeline: opt})}
                      className={`py-3 sm:py-4 px-4 text-left border text-[9px] sm:text-[10px] font-montserrat tracking-widest uppercase transition-all active:scale-[0.98] ${data.timeline === opt ? 'border-white text-black bg-white' : 'border-white/10 text-neutral-500 md:hover:border-white/30 md:hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center gap-4">
                  <button onClick={() => setStep(4)} className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white shrink-0">Go Back</button>
                  <EliteButton onClick={runAnalysis} disabled={!isStepValid()}>Analyze</EliteButton>
                </div>
              </motion.div>
            )}

            {analyzing && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-6 py-12">
                <div className="absolute left-0 w-full h-32 pointer-events-none z-0 scanning-bar opacity-20" />
                <Terminal className="text-white w-6 h-6 sm:w-8 sm:h-8 animate-pulse relative z-10" />
                <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase relative z-10 text-center"><ScrambleText text="CALCULATING POTENTIAL..." trigger={analyzing} /></h3>
                <div className="font-mono text-[8px] sm:text-[9px] text-neutral-500 text-center space-y-2 relative z-10">
                  <p>MAPPING DATA ARCHITECTURE...</p>
                  <p>ESTIMATING LOAD: {data.volume}K OPS/DAY</p>
                </div>
              </motion.div>
            )}

            {step === 6 && result && !analyzing && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6 w-full">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase">AUDIT COMPLETE</h3>
                </div>
                <div className="p-4 sm:p-6 border border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <span className="font-montserrat text-[9px] sm:text-[10px] tracking-widest text-neutral-400 uppercase">AUTOMATION PROBABILITY</span>
                  <span className="font-bebas text-4xl sm:text-5xl text-white tracking-widest">{result.score}%</span>
                </div>
                <div className="p-4 sm:p-6 border border-white/10 flex flex-col gap-2">
                  <span className="font-montserrat text-[8px] sm:text-[9px] tracking-widest text-neutral-500 uppercase">RECOMMENDED IT & AI STACK</span>
                  <span className="font-bebas text-xl sm:text-2xl text-white tracking-wider">{result.arch}</span>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row justify-between sm:items-center border-t border-white/10 pt-6 gap-4">
                  <button onClick={reset} className="font-montserrat text-[8px] sm:text-[9px] tracking-widest uppercase text-neutral-500 hover:text-white">Run New Audit</button>
                  <a href="#contact" className="font-montserrat text-[9px] sm:text-[10px] font-bold text-white tracking-widest uppercase underline underline-offset-4">Get Detailed Blueprint</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TOOL 2: INFRASTRUCTURE ROI CALCULATOR                                      */
/* -------------------------------------------------------------------------- */
const ROICalculator = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ setup: '', spend: 10000, goal: '' });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const isStepValid = () => {
    if (step === 1) return data.setup !== '';
    if (step === 2) return true; // Slider
    if (step === 3) return data.goal !== '';
    return false;
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      let savingsMultiplier = 0.35; // base 35% savings
      if (data.setup.includes('Legacy')) savingsMultiplier = 0.55;
      if (data.setup.includes('Fragmented')) savingsMultiplier = 0.45;
      
      let annualSpend = data.spend * 12;
      let savings = Math.floor(annualSpend * savingsMultiplier);
      
      let arch = "AUTONOMOUS CLOUD GENESIS";
      if (data.goal.includes('Security')) arch = "SENTINEL SECURE INFRASTRUCTURE";
      if (data.goal.includes('Speed')) arch = "BARE-METAL EDGE CLUSTER";
      
      setResult({ savings, arch });
      setAnalyzing(false);
      setStep(4);
    }, 2500);
  };

  const reset = () => {
    setData({ setup: '', spend: 10000, goal: '' });
    setStep(1);
    setResult(null);
  };

  return (
    <div className="w-full min-h-[420px]">
      <div className="flex flex-col lg:flex-row gap-10 sm:gap-16">
        <div className="lg:w-1/3">
          <h2 className="font-bebas text-3xl sm:text-4xl text-white uppercase leading-none mb-4">Infrastructure ROI Calculator</h2>
          <p className="font-montserrat text-[10px] sm:text-xs text-neutral-500 leading-relaxed mb-6 sm:mb-8">
            Stop overpaying for inefficient cloud configurations. See exactly how much capital you can reclaim by modernizing your IT infrastructure with BAKR.JS.
          </p>
          <div className="h-[1px] bg-white/10 w-full mb-6 sm:mb-8" />
          <div className="font-mono text-[8px] sm:text-[9px] text-neutral-600 space-y-1">
            <p>PHASE: 0{step} OF 03</p>
          </div>
        </div>

        <div className="lg:w-2/3 bg-[#050505] border border-white/5 p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden min-h-[380px]">
          <AnimatePresence mode="wait">
            
            {step === 1 && !analyzing && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">01 // Current IT Setup</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['On-Premise Legacy Servers', 'Basic Cloud (AWS/GCP)', 'Fragmented Multi-Cloud', 'No Dedicated IT Setup'].map(opt => (
                    <button 
                      key={opt} onClick={() => setData({...data, setup: opt})}
                      className={`py-3 sm:py-4 px-4 text-left border text-[9px] sm:text-[10px] font-montserrat tracking-widest uppercase transition-all active:scale-[0.98] ${data.setup === opt ? 'border-white text-black bg-white' : 'border-white/10 text-neutral-500 md:hover:border-white/30 md:hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <EliteButton variant="secondary" onClick={() => setStep(2)} disabled={!isStepValid()}>Next Phase</EliteButton>
                </div>
              </motion.div>
            )}

            {step === 2 && !analyzing && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">02 // Monthly IT / Cloud Spend (USD)</h3>
                <div className="w-full">
                  <div className="flex justify-between font-montserrat text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-4">
                    <span>$5K</span>
                    <span className="text-white">${data.spend.toLocaleString()} / MO</span>
                    <span>$250K+</span>
                  </div>
                  <input 
                    type="range" min="5000" max="250000" step="5000" value={data.spend} 
                    onChange={(e) => setData({...data, spend: Number(e.target.value)})}
                    className="w-full h-[2px] bg-neutral-800 appearance-none cursor-pointer accent-white"
                  />
                </div>
                <div className="mt-4 flex justify-between items-center gap-4">
                  <button onClick={() => setStep(1)} className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white shrink-0">Go Back</button>
                  <EliteButton variant="secondary" onClick={() => setStep(3)}>Next Phase</EliteButton>
                </div>
              </motion.div>
            )}

            {step === 3 && !analyzing && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">03 // Primary Infrastructure Goal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Drastically Reduce Costs', 'Increase Execution Speed', 'Enhance Cyber Security', 'Enable Global Scalability'].map(opt => (
                    <button 
                      key={opt} onClick={() => setData({...data, goal: opt})}
                      className={`py-3 sm:py-4 px-4 text-left border text-[9px] sm:text-[10px] font-montserrat tracking-widest uppercase transition-all active:scale-[0.98] ${data.goal === opt ? 'border-white text-black bg-white' : 'border-white/10 text-neutral-500 md:hover:border-white/30 md:hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center gap-4">
                  <button onClick={() => setStep(2)} className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white shrink-0">Go Back</button>
                  <EliteButton onClick={runAnalysis} disabled={!isStepValid()}>Calculate ROI</EliteButton>
                </div>
              </motion.div>
            )}

            {analyzing && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-6 py-12">
                <div className="absolute left-0 w-full h-32 pointer-events-none z-0 scanning-bar opacity-20" />
                <Activity className="text-white w-6 h-6 sm:w-8 sm:h-8 animate-pulse relative z-10" />
                <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase relative z-10 text-center"><ScrambleText text="CALCULATING EFFICIENCY..." trigger={analyzing} /></h3>
              </motion.div>
            )}

            {step === 4 && result && !analyzing && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6 w-full">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase">AUDIT COMPLETE</h3>
                </div>
                <div className="p-4 sm:p-6 border border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <span className="font-montserrat text-[9px] sm:text-[10px] tracking-widest text-neutral-400 uppercase">PROJECTED YEARLY SAVINGS</span>
                  <span className="font-bebas text-4xl sm:text-5xl text-white tracking-widest">${result.savings.toLocaleString()}</span>
                </div>
                <div className="p-4 sm:p-6 border border-white/10 flex flex-col gap-2">
                  <span className="font-montserrat text-[8px] sm:text-[9px] tracking-widest text-neutral-500 uppercase">OPTIMIZED IT STACK</span>
                  <span className="font-bebas text-xl sm:text-2xl text-white tracking-wider">{result.arch}</span>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row justify-between sm:items-center border-t border-white/10 pt-6 gap-4">
                  <button onClick={reset} className="font-montserrat text-[8px] sm:text-[9px] tracking-widest uppercase text-neutral-500 hover:text-white">Recalculate</button>
                  <a href="#contact" className="font-montserrat text-[9px] sm:text-[10px] font-bold text-white tracking-widest uppercase underline underline-offset-4">Claim Your Savings</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TOOL 3: SECURITY THREAT SCANNER                                            */
/* -------------------------------------------------------------------------- */
const SecurityScanner = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ sensitivity: '', compliance: '', defense: '' });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const isStepValid = () => {
    if (step === 1) return data.sensitivity !== '';
    if (step === 2) return data.compliance !== '';
    if (step === 3) return data.defense !== '';
    return false;
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      let riskScore = 40; 
      if (data.sensitivity.includes('PII') || data.sensitivity.includes('Top Secret')) riskScore += 30;
      if (data.defense.includes('Basic') || data.defense.includes('Standard')) riskScore += 20;
      if (data.compliance.includes('None')) riskScore += 10;
      
      let arch = "SENTINEL CYBER AI + ZERO TRUST KERNELS";
      if (data.sensitivity.includes('Top Secret')) arch = "AIR-GAPPED DECENTRALIZED NODE ARRAY";
      
      setResult({ riskScore, arch });
      setAnalyzing(false);
      setStep(4);
    }, 2200);
  };

  const reset = () => {
    setData({ sensitivity: '', compliance: '', defense: '' });
    setStep(1);
    setResult(null);
  };

  return (
    <div className="w-full min-h-[420px]">
      <div className="flex flex-col lg:flex-row gap-10 sm:gap-16">
        <div className="lg:w-1/3">
          <h2 className="font-bebas text-3xl sm:text-4xl text-white uppercase leading-none mb-4">Security Surface Scanner</h2>
          <p className="font-montserrat text-[10px] sm:text-xs text-neutral-500 leading-relaxed mb-6 sm:mb-8">
            Evaluate your current data handling and defensive protocols. Uncover vulnerabilities before they become critical breaches.
          </p>
          <div className="h-[1px] bg-white/10 w-full mb-6 sm:mb-8" />
          <div className="font-mono text-[8px] sm:text-[9px] text-neutral-600 space-y-1">
            <p>PROTOCOL: ISO-27701 CHECK</p>
          </div>
        </div>

        <div className="lg:w-2/3 bg-[#050505] border border-white/5 p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden min-h-[380px]">
          <AnimatePresence mode="wait">
            {step === 1 && !analyzing && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">01 // Primary Data Sensitivity Level</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Public / Marketing Data', 'Internal Operations Data', 'PII & Financial Records', 'Top Secret / Defense Data'].map(opt => (
                    <button 
                      key={opt} onClick={() => setData({...data, sensitivity: opt})}
                      className={`py-3 sm:py-4 px-4 text-left border text-[9px] sm:text-[10px] font-montserrat tracking-widest uppercase transition-all active:scale-[0.98] ${data.sensitivity === opt ? 'border-white text-black bg-white' : 'border-white/10 text-neutral-500 md:hover:border-white/30 md:hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <EliteButton variant="secondary" onClick={() => setStep(2)} disabled={!isStepValid()}>Next Phase</EliteButton>
                </div>
              </motion.div>
            )}

            {step === 2 && !analyzing && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">02 // Regulatory Compliance Requirements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['SOC 2 Type II', 'HIPAA / Medical', 'GDPR / Regional Standard', 'None Currently Mandated'].map(opt => (
                    <button 
                      key={opt} onClick={() => setData({...data, compliance: opt})}
                      className={`py-3 sm:py-4 px-4 text-left border text-[9px] sm:text-[10px] font-montserrat tracking-widest uppercase transition-all active:scale-[0.98] ${data.compliance === opt ? 'border-white text-black bg-white' : 'border-white/10 text-neutral-500 md:hover:border-white/30 md:hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center gap-4">
                  <button onClick={() => setStep(1)} className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white shrink-0">Go Back</button>
                  <EliteButton variant="secondary" onClick={() => setStep(3)} disabled={!isStepValid()}>Next Phase</EliteButton>
                </div>
              </motion.div>
            )}

            {step === 3 && !analyzing && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase">03 // Current Defense Protocol</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Basic Perimeter Firewall', 'Standard Antivirus Software', 'Enterprise EDR/MDR', 'Strict Zero-Trust Architecture'].map(opt => (
                    <button 
                      key={opt} onClick={() => setData({...data, defense: opt})}
                      className={`py-3 sm:py-4 px-4 text-left border text-[9px] sm:text-[10px] font-montserrat tracking-widest uppercase transition-all active:scale-[0.98] ${data.defense === opt ? 'border-white text-black bg-white' : 'border-white/10 text-neutral-500 md:hover:border-white/30 md:hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center gap-4">
                  <button onClick={() => setStep(2)} className="font-montserrat text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white shrink-0">Go Back</button>
                  <EliteButton onClick={runAnalysis} disabled={!isStepValid()}>Scan Surface</EliteButton>
                </div>
              </motion.div>
            )}

            {analyzing && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-6 py-12">
                <div className="absolute left-0 w-full h-32 pointer-events-none z-0 scanning-bar opacity-20" />
                <ShieldAlert className="text-red-500 w-6 h-6 sm:w-8 sm:h-8 animate-pulse relative z-10" />
                <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase relative z-10 text-center"><ScrambleText text="PROBING VECTORS..." trigger={analyzing} /></h3>
              </motion.div>
            )}

            {step === 4 && result && !analyzing && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6 w-full">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase">AUDIT COMPLETE</h3>
                </div>
                <div className="p-4 sm:p-6 border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2" style={{ backgroundColor: result.riskScore > 60 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)' }}>
                  <span className="font-montserrat text-[9px] sm:text-[10px] tracking-widest text-neutral-400 uppercase">THREAT VULNERABILITY SCORE</span>
                  <span className={`font-bebas text-4xl sm:text-5xl tracking-widest ${result.riskScore > 60 ? 'text-red-500' : 'text-white'}`}>{result.riskScore}%</span>
                </div>
                <div className="p-4 sm:p-6 border border-white/10 flex flex-col gap-2">
                  <span className="font-montserrat text-[8px] sm:text-[9px] tracking-widest text-neutral-500 uppercase">RECOMMENDED DEFENSE UPGRADE</span>
                  <span className="font-bebas text-xl sm:text-2xl text-white tracking-wider">{result.arch}</span>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row justify-between sm:items-center border-t border-white/10 pt-6 gap-4">
                  <button onClick={reset} className="font-montserrat text-[8px] sm:text-[9px] tracking-widest uppercase text-neutral-500 hover:text-white">Run New Scan</button>
                  <a href="#contact" className="font-montserrat text-[9px] sm:text-[10px] font-bold text-white tracking-widest uppercase underline underline-offset-4">Secure Infrastructure Now</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* COMPONENT: DIAGNOSTIC LAB WRAPPER                                          */
/* -------------------------------------------------------------------------- */
const DiagnosticLab = () => {
  const [activeTab, setActiveTab] = useState('automation');

  return (
    <div className="mb-24 sm:mb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 border-b border-white/10 pb-4 gap-4">
        <div>
          <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">INTERACTIVE TOOLS</span>
          <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase leading-none">Diagnostic Suite</h2>
        </div>
        
        {/* Tab Controls */}
        <div className="flex flex-wrap sm:flex-nowrap bg-white/5 border border-white/10 p-1 rounded-sm w-full md:w-auto">
          {[
            { id: 'automation', label: 'Automation' },
            { id: 'roi', label: 'IT ROI' },
            { id: 'security', label: 'Security' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 font-montserrat text-[8px] sm:text-[9px] font-bold tracking-widest uppercase transition-colors rounded-sm ${activeTab === tab.id ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#020202] border border-white/10 rounded-sm p-6 sm:p-8 md:p-12 relative overflow-hidden group">
        <AnimatePresence mode="wait">
          {activeTab === 'automation' && <motion.div key="automation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><WorkflowAnalyzer /></motion.div>}
          {activeTab === 'roi' && <motion.div key="roi" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><ROICalculator /></motion.div>}
          {activeTab === 'security' && <motion.div key="security" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><SecurityScanner /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/* COMPONENT: 50+ ENTERPRISE SOLUTIONS MATRIX                                 */
/* -------------------------------------------------------------------------- */
const SolutionsMatrix = () => {
  const extendedSolutions = [
    { name: "Legacy System Migration", cat: "IT Infra" }, { name: "Automated Contract Parsing", cat: "Legal" },
    { name: "Supply Chain Optimization", cat: "Logistics" }, { name: "Real-Time Threat Detection", cat: "Security" },
    { name: "Medical Record Digitization", cat: "Healthcare" }, { name: "Cloud Server Load Balancing", cat: "IT Infra" },
    { name: "Enterprise Knowledge Search", cat: "Enterprise" }, { name: "Custom API Development", cat: "Engineering" },
    { name: "Multi-Cloud Deployments", cat: "IT Infra" }, { name: "High-Frequency Trading Engines", cat: "Financial" },
    { name: "Predictive Maintenance", cat: "Industrial" }, { name: "Data Lake Architecture", cat: "Data" },
    { name: "Voice-to-Text Automation", cat: "Ops" }, { name: "Automated Quality Control", cat: "Manufacturing" },
    { name: "Zero-Trust Network Setup", cat: "Security" }, { name: "Customer Support Chatbots", cat: "Service" },
    { name: "Inventory Demand Forecasting", cat: "Retail" }, { name: "Employee Onboarding Systems", cat: "HR" },
    { name: "Synthetic Training Data", cat: "AI Models" }, { name: "Secure Payment Gateways", cat: "Financial" },
    { name: "Customer Churn Prediction", cat: "Analytics" }, { name: "Automated Report Drafting", cat: "Ops" },
    { name: "Dynamic Pricing Algorithms", cat: "Commerce" }, { name: "Biometric Access Control", cat: "Security" },
    { name: "Serverless Architecture", cat: "IT Infra" }, { name: "Database Sharding & Scaling", cat: "Data" },
    { name: "Social Sentiment Analysis", cat: "Marketing" }, { name: "ERP System Integration", cat: "Enterprise" },
    { name: "Energy Grid Balancing", cat: "Energy" }, { name: "Fleet Tracking Software", cat: "Logistics" },
    { name: "Network Deep Packet Scan", cat: "Security" }, { name: "On-Premise AI Deployment", cat: "IT Infra" },
    { name: "Clinical Trial Analysis", cat: "Healthcare" }, { name: "Content Moderation AI", cat: "Social" },
    { name: "Warehouse Automation IT", cat: "Retail" }, { name: "Phishing Email Firewalls", cat: "Security" },
    { name: "Video Feed Summarization", cat: "Media" }, { name: "Cross-lingual Translation", cat: "Global" },
    { name: "Robotic Process Automation", cat: "Ops" }, { name: "Personalized Marketing Gen", cat: "Marketing" },
    { name: "Healthcare Diagnostics IT", cat: "Healthcare" }, { name: "Custom Machine Learning", cat: "AI Models" },
    { name: "Algorithmic Risk Scoring", cat: "Financial" }, { name: "Regulatory Compliance Scans", cat: "Legal" },
    { name: "Disaster Recovery Systems", cat: "IT Infra" }, { name: "Behavioral Analytics Dashboard", cat: "Analytics" },
    { name: "Multi-Agent AI Systems", cat: "Enterprise" }, { name: "End-to-End Data Encryption", cat: "Security" },
    { name: "Continuous IT Auditing", cat: "Security" }, { name: "Adaptive Logistics Routing", cat: "Logistics" }
  ];

  return (
    <div className="py-16 sm:py-24 border-t border-white/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 sm:gap-6">
        <div>
          <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-3 sm:mb-4">PROVEN CAPABILITIES</span>
          <h2 className="font-bebas text-4xl sm:text-5xl md:text-7xl uppercase leading-none text-white">Custom IT Implementations</h2>
        </div>
        <p className="font-montserrat text-[11px] sm:text-xs text-neutral-400 max-w-sm leading-relaxed">
          We don't just talk. We build. Here are over 50 specific IT and AI systems we engineer for modern enterprises.
        </p>
      </div>

      {/* Dense Technical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-1 w-full border-t border-white/5 pt-8">
        {extendedSolutions.map((sol, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 group md:hover:border-white/30 transition-colors cursor-default">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[8px] text-neutral-600 md:group-hover:text-white transition-colors">{(i+1).toString().padStart(2, '0')}</span>
              <span className="font-montserrat text-[9px] sm:text-[10px] md:text-[11px] text-neutral-300 uppercase tracking-widest font-bold md:group-hover:text-white transition-colors line-clamp-1">{sol.name}</span>
            </div>
            <span className="font-mono text-[7px] sm:text-[8px] tracking-widest text-neutral-600 uppercase border border-white/5 px-2 py-0.5 rounded-sm shrink-0 ml-4">{sol.cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


/* SOLUTIONS HUB VIEW */
const SolutionsView = () => {
  const coreModules = [
    {
      id: "it-infra", name: "Enterprise IT Setup", subtitle: "Bulletproof infrastructure and cloud servers",
      specs: ["99.99% Uptime SLA", "Multi-Cloud Deployments", "Zero-Trust Security", "Automated Backups"],
      detail: "We replace outdated servers with blazing fast, secure IT infrastructure. We handle the complex engineering so you can focus on your business."
    },
    {
      id: "ai-automation", name: "AI Process Automation", subtitle: "Replacing manual work with smart algorithms",
      specs: ["Custom LLM Integration", "Data Parsing Pipelines", "Automated Reporting", "Reduced Human Error"],
      detail: "Stop paying for repetitive tasks. We build AI systems that read documents, analyze data, and execute tasks faster and cheaper than ever before."
    },
    {
      id: "data-engineering", name: "Data Engineering", subtitle: "Making your business data actually useful",
      specs: ["Data Lakes & Warehouses", "Real-Time Dashboards", "API Integrations", "Predictive Analytics"],
      detail: "Most companies have data they can't use. We clean, organize, and connect your systems so you get crystal clear insights in real time."
    },
    {
      id: "cyber-security", name: "Advanced Security", subtitle: "Protecting your operations from modern threats",
      specs: ["End-to-End Encryption", "Continuous Auditing", "SOC 2 Type II Standards", "Threat Detection"],
      detail: "Your data is your biggest asset. We build military-grade security walls around your IT systems, ensuring you are protected and compliant."
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-32 sm:pt-40 pb-24 bg-black min-h-screen">
      <div className="w-full" style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}>
        
        <div className="border-b border-white/10 pb-8 sm:pb-12 mb-12 sm:mb-20">
          <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-4">WHAT WE BUILD</span>
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl uppercase leading-none text-white">IT & AI Solutions</h1>
          <p className="font-montserrat text-[11px] sm:text-xs text-neutral-400 max-w-xl mt-6 leading-relaxed">
            We don't use off-the-shelf templates. We engineer custom IT solutions and fine-tuned AI models that outperform standard setups by every metric. We are simply the best at building reliable software.
          </p>
        </div>

        <DiagnosticLab />

        <div className="mb-12">
          <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase mb-8">Our Primary Services</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 w-full">
            {coreModules.map((sol, index) => (
              <motion.div key={sol.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.1 }} viewport={{ once: true }} className="p-6 sm:p-8 md:p-12 border border-white/10 bg-neutral-950 flex flex-col justify-between md:hover:border-white transition-all duration-500 w-full">
                <div>
                  <span className="font-mono text-[10px] sm:text-xs text-neutral-600 block mb-2">0{index + 1} // SERVICE_{sol.id.toUpperCase()}</span>
                  <h2 className="font-bebas text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">{sol.name}</h2>
                  <p className="font-montserrat text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mb-4 sm:mb-6 font-semibold">{sol.subtitle}</p>
                  <p className="font-montserrat text-[11px] sm:text-xs text-neutral-500 leading-relaxed mb-8">{sol.detail}</p>
                </div>
                <div className="border-t border-white/5 pt-6">
                  <span className="font-montserrat text-[8px] sm:text-[9px] text-neutral-500 tracking-widest uppercase block mb-3">KEY DELIVERABLES</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {sol.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2 font-montserrat text-[9px] sm:text-[10px] text-neutral-400">
                        <span className="w-1 h-1 bg-white shrink-0 rounded-full" /><span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <SolutionsMatrix />

      </div>
    </motion.div>
  );
};

/* ABOUT US VIEW */
const AboutView = () => {
  const stats = [
    { value: "48ms", label: "AVERAGE RESPONSE TIME" },
    { value: "99.99%", label: "SYSTEM UPTIME GUARANTEE" },
    { value: "500+", label: "SUCCESSFUL IT DEPLOYMENTS" },
    { value: "1", label: "GOAL: YOUR SUCCESS" }
  ];

  const team = [
    { name: "Balasaheb Palve", role: "Chief Sales Officer", dept: "Business Dev." },
    { name: "Anant Amar", role: "Chief Design & Dev. Officer", dept: "Design & Dev." },
    { name: "Kushal Karera", role: "Chief Sales Runner", dept: "Business Dev." },
    { name: "Rohan Shah", role: "Chief Sales Operator", dept: "Business Dev." },
    { name: "Jayant Mehta", role: "Chief Sales Engineer", dept: "Business Dev." },
    { name: "Sagar Deshpande", role: "Chief Sales Architect", dept: "Business Dev." }
  ];

  const milestones = [
    { year: "2024", title: "Company Founded", desc: "Established in Pune, India with a simple mission: build better, faster IT systems for serious businesses." },
    { year: "2025", title: "Enterprise Expansion", desc: "Successfully deployed our first large-scale automated data lakes and AI pipelines for global clients." },
    { year: "2026", title: "Industry Leaders", desc: "Recognized as a premier IT and AI firm, delivering unmatched speed and reliability in our software." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pt-32 sm:pt-40 pb-16 bg-black min-h-screen"
    >
      <div 
        className="w-full py-8 sm:py-16 border-b border-white/10"
        style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
      >
        <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-6">
          COMPANY OVERVIEW
        </span>
        
        <h1 className="font-bebas text-[14vw] sm:text-[12vw] md:text-[8vw] uppercase leading-none mb-8 text-white">
          Elite Engineering.<br />
          <span className="text-outline">Unmatched Execution.</span>
        </h1>
        
        <p className="font-montserrat text-[11px] sm:text-xs md:text-sm text-neutral-400 max-w-xl leading-relaxed">
          Based in Pune, India, BAKR.JS is a top-tier IT and AI company. We partner with serious businesses to replace outdated tech with smart, automated systems. We are simply the best at building reliable software that scales.
        </p>
      </div>

      <div 
        className="w-full py-16 sm:py-24 grid grid-cols-2 lg:grid-cols-4 gap-8"
        style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
      >
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="font-bebas text-4xl sm:text-5xl md:text-7xl text-white tracking-widest">{stat.value}</span>
            <span className="font-montserrat text-[8px] sm:text-[9px] text-neutral-500 tracking-wider uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="py-16 sm:py-24 border-t border-white/10 bg-[#050505]">
        <div className="w-full" style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}>
          <div className="mb-12 sm:mb-16">
            <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-neutral-500 block mb-3">OUR HISTORY</span>
            <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase">How We Got Here</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 w-full">
            {milestones.map((stone, i) => (
              <div key={i} className="border-l border-white/20 pl-4 sm:pl-6 py-2 sm:py-4 w-full">
                <span className="font-bebas text-2xl sm:text-3xl text-white tracking-widest block mb-2">{stone.year}</span>
                <h3 className="font-montserrat text-[11px] sm:text-xs font-bold text-white uppercase mb-2">{stone.title}</h3>
                <p className="font-montserrat text-[10px] sm:text-[11px] text-neutral-500 leading-relaxed">{stone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 sm:py-24 w-full" style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}>
        <div className="mb-12 sm:mb-16">
          <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-neutral-500 block mb-3">THE LEADERSHIP</span>
          <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase">Meet The Experts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          {team.map((member, i) => (
            <div key={i} className="p-6 sm:p-8 border border-white/10 md:hover:border-white transition-colors duration-500 bg-black w-full">
              <span className="font-mono text-[9px] text-neutral-600 block mb-4">0{i+1} // LEADERSHIP</span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white mb-1 uppercase tracking-wider">{member.name}</h3>
              <p className="font-montserrat text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest mb-4">{member.role}</p>
              <div className="h-[1px] bg-white/10 w-full mb-4" />
              <span className="font-montserrat text-[8px] sm:text-[9px] text-neutral-500 uppercase tracking-wider block">FOCUS: {member.dept}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white text-black py-16 sm:py-24 md:py-36">
        <div 
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start"
          style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
        >
          <div className="lg:col-span-5 sticky top-24 sm:top-40">
            <span className="font-montserrat text-[10px] tracking-widest uppercase text-neutral-500 block mb-4">OUR PROMISE</span>
            <h2 className="font-bebas text-4xl sm:text-5xl md:text-7xl uppercase leading-none text-black">
              Why We Are The Best
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col gap-10 sm:gap-12 w-full">
            <div>
              <h3 className="font-bebas text-2xl sm:text-3xl uppercase mb-2 sm:mb-3 text-black">01 / We Build It Right</h3>
              <p className="font-montserrat text-[11px] sm:text-xs text-neutral-600 leading-relaxed">
                We don't use cheap templates or messy code. We engineer IT systems from the ground up to ensure they are fast, secure, and perfectly suited to your business.
              </p>
            </div>
            <div>
              <h3 className="font-bebas text-2xl sm:text-3xl uppercase mb-2 sm:mb-3 text-black">02 / We Focus on Results</h3>
              <p className="font-montserrat text-[11px] sm:text-xs text-neutral-600 leading-relaxed">
                We measure our success by how much time and money we save you. We deliver rock-solid IT and AI automation that directly improves your bottom line.
              </p>
            </div>
            <div>
              <h3 className="font-bebas text-2xl sm:text-3xl uppercase mb-2 sm:mb-3 text-black">03 / No Excuses</h3>
              <p className="font-montserrat text-[11px] sm:text-xs text-neutral-600 leading-relaxed">
                When you hire us, you get a system that works 24/7. We guarantee uptime, handle the maintenance, and provide unparalleled technical support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* TECH STACK VIEW */
const TechView = () => {
  const [sliderVal, setSliderVal] = useState(50);
  
  const bakrLatency = Math.max((2.4 - (sliderVal / 100) * 1.5), 0.4).toFixed(1);
  const standardLatency = Math.max((18.4 - (sliderVal / 100) * 4.0), 12.0).toFixed(1);

  const pillars = [
    { title: "Custom Code architecture", desc: "We don't rely on bloated third-party plugins. We write clean, optimized code that runs exponentially faster than standard IT setups.", icon: Cpu },
    { title: "Smart Data Structuring", desc: "We organize your databases so efficiently that queries which used to take minutes now process in milliseconds.", icon: Database },
    { title: "Fail-Proof Cloud Servers", desc: "We deploy on distributed networks. If one server goes down, another takes over instantly. You experience zero downtime.", icon: Layers }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pt-32 sm:pt-40 pb-24 bg-black min-h-screen"
    >
      <div className="w-full" style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}>
        <div className="border-b border-white/10 pb-8 sm:pb-12 mb-12 sm:mb-20">
          <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-4">OUR ADVANTAGE</span>
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl uppercase leading-none text-white">Why We Rock</h1>
          <p className="font-montserrat text-[11px] sm:text-xs text-neutral-400 max-w-xl mt-6 leading-relaxed">
            We are the best because we care about the engineering. Most IT firms stack heavy, slow software together. We build streamlined, powerful systems that outpace the competition.
          </p>
        </div>

        {/* Interactive Benchmark Tool */}
        <div className="bg-[#050505] p-6 sm:p-8 md:p-12 border border-white/10 rounded-sm mb-16 sm:mb-24 relative overflow-hidden w-full">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-[8px] tracking-widest text-neutral-500">SPEED TEST</span>
          </div>

          <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase mb-2">See the Speed Difference</h3>
          <p className="font-montserrat text-[10px] sm:text-[11px] text-neutral-500 max-w-md mb-8">
            Move the slider to increase the workload and see how our custom IT systems stay fast while generic systems slow down.
          </p>

          <div className="mb-10 max-w-xl">
            <div className="flex justify-between font-montserrat text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2">
              <span>WORKLOAD SIZE</span>
              <span className="text-white">{sliderVal * 10} TASKS</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="150" 
              value={sliderVal} 
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full h-[2px] bg-neutral-800 appearance-none cursor-pointer accent-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-white/5 w-full">
            <div className="p-4 sm:p-6 bg-neutral-900/50 border border-white/5 w-full">
              <span className="font-montserrat text-[9px] sm:text-[10px] text-neutral-500 block mb-1 uppercase tracking-wider">BAKR.JS IT SYSTEM</span>
              <span className="font-bebas text-4xl sm:text-5xl text-white tracking-widest">{bakrLatency} MS</span>
              <span className="font-montserrat text-[8px] sm:text-[9px] text-neutral-600 block mt-2">Lightning fast execution</span>
            </div>
            <div className="p-4 sm:p-6 bg-neutral-900/20 border border-white/5 opacity-50 w-full">
              <span className="font-montserrat text-[9px] sm:text-[10px] text-neutral-500 block mb-1 uppercase tracking-wider">GENERIC IT SETUP</span>
              <span className="font-bebas text-4xl sm:text-5xl text-neutral-500 tracking-widest">{standardLatency} MS</span>
              <span className="font-montserrat text-[8px] sm:text-[9px] text-neutral-600 block mt-2">Slow, bloated processing</span>
            </div>
          </div>
        </div>

        {/* Pillars of Engineering */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 w-full">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="flex flex-col items-start gap-4 p-6 sm:p-8 border border-white/5 bg-neutral-950 w-full">
                <div className="p-3 bg-white/5 text-white border border-white/10 mb-2">
                  <Icon size={20} />
                </div>
                <h3 className="font-bebas text-xl sm:text-2xl text-white uppercase tracking-wider">{pillar.title}</h3>
                <p className="font-montserrat text-[11px] sm:text-xs text-neutral-500 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

/* INSIGHTS / BLOGS VIEW */
const BlogsView = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const articles = [
    {
      id: "it-modernization",
      title: "Why Legacy IT is Costing You Millions",
      category: "IT STRATEGY",
      date: "MAY 18, 2026",
      desc: "An honest look at how outdated software and slow servers kill productivity, and how modernizing your stack fixes it."
    },
    {
      id: "ai-practical",
      title: "Real AI for Real Businesses",
      category: "AI AUTOMATION",
      date: "APR 22, 2026",
      desc: "Forget the hype. Here is exactly how we use Artificial Intelligence to automate boring tasks and save companies money."
    },
    {
      id: "cloud-security",
      title: "Bulletproof Your Business Data",
      category: "SECURITY",
      date: "MAR 10, 2026",
      desc: "A breakdown of our enterprise-grade security protocols and why keeping your data safe is our top priority."
    },
    {
      id: "fast-software",
      title: "Speed is a Feature: Designing High-Performance Tech",
      category: "ENGINEERING",
      date: "FEB 14, 2026",
      desc: "Why we obsess over making our software run fast, and how it directly improves your team's workflow."
    }
  ];

  const categories = ['ALL', 'IT STRATEGY', 'AI AUTOMATION', 'SECURITY', 'ENGINEERING'];

  const filteredArticles = activeFilter === 'ALL' 
    ? articles 
    : articles.filter(art => art.category === activeFilter);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pt-32 sm:pt-40 pb-24 bg-black min-h-screen"
    >
      <div className="w-full" style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}>
        <div className="border-b border-white/10 pb-8 sm:pb-12 mb-8 sm:mb-12">
          <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-4">OUR EXPERTISE</span>
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl uppercase leading-none text-white">Insights & News</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-12 sm:mb-16 font-montserrat text-[8px] sm:text-[9px] tracking-widest uppercase font-bold text-neutral-500 w-full">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 sm:px-4 py-2 border transition-all ${activeFilter === cat ? 'border-white text-white bg-white/5' : 'border-white/10 md:hover:border-white/30 text-neutral-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Rows */}
        <div className="flex flex-col w-full">
          {filteredArticles.map((art, i) => (
            <motion.div 
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group py-8 sm:py-12 border-b border-white/10 md:hover:border-white transition-colors duration-500 flex flex-col md:flex-row justify-between gap-6 sm:gap-8 cursor-pointer w-full"
            >
              <div className="md:w-3/4">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 font-montserrat text-[9px] sm:text-[10px] text-neutral-500">
                  <span>{art.date}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-white uppercase tracking-wider">{art.category}</span>
                </div>
                <h3 className="font-bebas text-2xl sm:text-3xl md:text-5xl text-white md:group-hover:text-neutral-300 transition-colors mb-3 sm:mb-4">{art.title}</h3>
                <p className="font-montserrat text-[11px] sm:text-xs text-neutral-500 leading-relaxed max-w-2xl">{art.desc}</p>
              </div>
              <div className="md:w-1/4 flex items-start md:items-end justify-end">
                <span className="p-2 sm:p-3 border border-white/10 md:group-hover:border-white rounded-full transition-colors duration-300 text-white">
                  <ArrowUpRight size={16} className="md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* CONTACT VIEW */
const ContactView = () => {
  const [formState, setFormState] = useState({ name: '', email: '', sector: 'IT Modernization', timeframe: 'Immediately', scope: 'Full Build' });
  const [transmitting, setTransmitting] = useState(false);
  const [transmissionComplete, setTransmissionComplete] = useState(false);

  const handleTransmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;

    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      setTransmissionComplete(true);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pt-32 sm:pt-40 pb-24 bg-black min-h-screen"
    >
      <div 
        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16"
        style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
      >
        <div className="lg:col-span-5">
          <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-4">START A PROJECT</span>
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl uppercase leading-none text-white mb-6">Let's Build</h1>
          <p className="font-montserrat text-[11px] sm:text-xs text-neutral-400 leading-relaxed mb-8">
            Tell us about your IT goals. Our engineering team will review your needs and reach out to discuss how we can upgrade your systems.
          </p>

          <div className="flex flex-col gap-4 font-montserrat text-[10px] sm:text-[11px] text-neutral-500 uppercase tracking-widest pt-6 border-t border-white/10 w-full">
            <div>
              <span className="text-white">EMAIL US</span>
              <p className="font-normal mt-1">hello@bakr.js</p>
            </div>
            <div>
              <span className="text-white">CALL US</span>
              <p className="font-normal mt-1">+91 20 4805 2600</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#050505] border border-white/10 p-6 sm:p-8 md:p-12 rounded-sm w-full">
          {!transmissionComplete ? (
            <form onSubmit={handleTransmit} className="flex flex-col gap-6 sm:gap-8 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat text-[8px] sm:text-[9px] text-neutral-500 tracking-wider font-bold uppercase">YOUR NAME</label>
                  <input 
                    type="text" 
                    value={formState.name}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    className="footer-input py-2 sm:py-3 text-[10px] sm:text-xs uppercase w-full bg-transparent" 
                    placeholder="John Doe"
                    required
                    disabled={transmitting}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat text-[8px] sm:text-[9px] text-neutral-500 tracking-wider font-bold uppercase">YOUR EMAIL</label>
                  <input 
                    type="email" 
                    value={formState.email}
                    onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    className="footer-input py-2 sm:py-3 text-[10px] sm:text-xs w-full bg-transparent" 
                    placeholder="john@company.com"
                    required
                    disabled={transmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat text-[8px] sm:text-[9px] text-neutral-500 tracking-wider font-bold uppercase">PROJECT TYPE</label>
                  <select 
                    value={formState.sector}
                    onChange={(e) => setFormState(prev => ({ ...prev, sector: e.target.value }))}
                    className="bg-black border border-white/10 text-white py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-xs tracking-widest uppercase focus:outline-none focus:border-white rounded-none w-full appearance-none"
                    disabled={transmitting}
                  >
                    <option>IT Modernization</option>
                    <option>AI Automation</option>
                    <option>Cloud Architecture</option>
                    <option>Cyber Security Audit</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat text-[8px] sm:text-[9px] text-neutral-500 tracking-wider font-bold uppercase">TIMEFRAME</label>
                  <select 
                    value={formState.timeframe}
                    onChange={(e) => setFormState(prev => ({ ...prev, timeframe: e.target.value }))}
                    className="bg-black border border-white/10 text-white py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-xs tracking-widest uppercase focus:outline-none focus:border-white rounded-none w-full appearance-none"
                    disabled={transmitting}
                  >
                    <option>Immediately</option>
                    <option>1-3 Months</option>
                    <option>3-6 Months</option>
                    <option>Just exploring</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-white text-black py-4 font-montserrat font-bold text-[10px] sm:text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 active:scale-[0.98]"
                disabled={transmitting}
              >
                {transmitting ? <Terminal className="animate-spin w-4 h-4" /> : null}
                <span>{transmitting ? "SENDING MESSAGE..." : "SUBMIT INQUIRY"}</span>
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12 sm:py-16 flex flex-col items-center justify-center w-full"
            >
              <div className="p-4 bg-white/5 border border-white/10 rounded-full text-white mb-6">
                <CheckCircle2 size={32} className="sm:w-10 sm:h-10" />
              </div>
              <h3 className="font-bebas text-3xl sm:text-4xl text-white mb-2">INQUIRY RECEIVED</h3>
              <p className="font-montserrat text-[10px] sm:text-[11px] text-neutral-500 max-w-sm mb-8 leading-relaxed">
                Thank you. We have received your project details. One of our senior IT architects will be in touch with you shortly.
              </p>
              <button 
                onClick={() => { setTransmissionComplete(false); }} 
                className="font-montserrat text-[8px] sm:text-[9px] font-bold text-white tracking-widest uppercase underline"
              >
                Send Another Message
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

/* PRIVACY VIEW */
const PrivacyView = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pt-32 sm:pt-40 pb-24 bg-black min-h-screen w-full"
    style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
  >
    <div className="border-b border-white/10 pb-8 sm:pb-12 mb-12 sm:mb-16 w-full">
      <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-4">PRIVACY COMPLIANCE</span>
      <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl uppercase leading-none text-white">Privacy Strategy</h1>
      <p className="font-mono text-[8px] sm:text-[9px] text-neutral-500 mt-4">LAST MODIFIED: 18 MAY 2026 // COMPLIANT WITH ISO-27701</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start w-full">
      <div className="lg:col-span-4 sticky top-24 sm:top-40">
        <h2 className="font-bebas text-2xl sm:text-3xl uppercase mb-4 text-neutral-400">Core Objectives</h2>
        <p className="font-montserrat text-[11px] sm:text-xs text-neutral-500 leading-relaxed">
          This document explains our zero-knowledge custody mechanisms, telemetry capture policies, and how we minimize database retention footprints.
        </p>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-10 sm:gap-12 font-montserrat text-[11px] sm:text-xs text-neutral-400 leading-relaxed w-full">
        <div>
          <h3 className="font-bebas text-xl sm:text-2xl text-white mb-3">1.0 Data Custody Architecture</h3>
          <p className="mb-4">
            Our systems run under a strict zero-knowledge paradigm. This means we do not store, intercept, or interpret private enterprise operational data that flows through active cognitive routing pipelines. All localized weight matrices remain on client infrastructure.
          </p>
        </div>

        <div>
          <h3 className="font-bebas text-xl sm:text-2xl text-white mb-3">2.0 Edge Telemetry Storage</h3>
          <p className="mb-4">
            Edge performance statistics (processing duration, ping delay, output length) are collected strictly in aggregate. No identifiable personal datasets, human-readable prompts, or strategic corporate documents are ever transferred to centralized cloud logs.
          </p>
        </div>

        <div>
          <h3 className="font-bebas text-xl sm:text-2xl text-white mb-3">3.0 Third-Party Handshakes</h3>
          <p className="mb-4">
            BAKR.JS does not participate in data broking, model marketing, or external metadata telemetry monetization. Compliance boundaries prohibit sharing cluster usage metrics with third-party analytical firms.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

/* TERMS OF CUSTODY VIEW */
const TermsView = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pt-32 sm:pt-40 pb-24 bg-black min-h-screen w-full"
    style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
  >
    <div className="border-b border-white/10 pb-8 sm:pb-12 mb-12 sm:mb-16 w-full">
      <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-4">LICENSING FRAMEWORK</span>
      <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl uppercase leading-none text-white">Terms of Custody</h1>
      <p className="font-mono text-[8px] sm:text-[9px] text-neutral-500 mt-4">REVISED OPERATING STATUS: v2.6 // ENTERPRISE BOUNDS APPLIED</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start w-full">
      <div className="lg:col-span-4 sticky top-24 sm:top-40">
        <h2 className="font-bebas text-2xl sm:text-3xl uppercase mb-4 text-neutral-400">Usage Boundaries</h2>
        <p className="font-montserrat text-[11px] sm:text-xs text-neutral-500 leading-relaxed">
          By utilizing cognitive clusters developed by BAKR.JS, you agree to these resource constraints, computing metrics, and intellectual covenants.
        </p>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-10 sm:gap-12 font-montserrat text-[11px] sm:text-xs text-neutral-400 leading-relaxed w-full">
        <div>
          <h3 className="font-bebas text-xl sm:text-2xl text-white mb-3">1.0 Licensed Resource Allocations</h3>
          <p className="mb-4">
            Compute licenses are granted on a node-locked basis. You may not deploy localized weight matrices onto environments exceeding your registered cluster parameters. If throughput surpasses safe CPU/GPU thermal ceilings, the client assumes operational custody of hardware.
          </p>
        </div>

        <div>
          <h3 className="font-bebas text-xl sm:text-2xl text-white mb-3">2.0 Neural Reverse Engineering</h3>
          <p className="mb-4">
            Unless authorized by custom enterprise agreement, compiling, deconstructing, or applying predictive attacks to original BAKR.JS clustering algorithms is strictly prohibited. Violators face immediate runtime licensing revocation.
          </p>
        </div>

        <div>
          <h3 className="font-bebas text-xl sm:text-2xl text-white mb-3">3.0 Liability Thresholds</h3>
          <p className="mb-4">
            BAKR.JS engineers high-performance IT structures. In no event shall our institute be held liable for synthetic output anomalies, network connectivity interruptions, or hardware overhead under unauthorized self-managed cluster deployment conditions.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

/* SERVICE LEVEL AGREEMENT (SLA) VIEW */
const SLAView = () => {
  const metrics = [
    { title: "Core Cluster Uptime", stat: "99.99%", detail: "Guaranteed system availability via node replication" },
    { title: "Maximum Failover Response", stat: "< 180s", detail: "Automatic edge container failover execution" },
    { title: "Data Storage Compliance", stat: "100%", detail: "Zero data leakage on node disconnect" },
    { title: "Security Protocols", stat: "AES-GCM", detail: "Military-grade encryption for regional transport" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pt-32 sm:pt-40 pb-24 bg-black min-h-screen"
    >
      <div className="w-full" style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}>
        
        {/* Editorial Heading */}
        <div className="border-b border-white/10 pb-8 sm:pb-12 mb-12 sm:mb-16 w-full">
          <span className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-4">SECURITY PORTAL</span>
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-8xl uppercase leading-none text-white">SLA & Security Hub</h1>
          <p className="font-montserrat text-[11px] sm:text-xs text-neutral-400 max-w-lg mt-4 sm:mt-6 leading-relaxed">
            Our systems are built for mission-critical operations. We maintain absolute transparency regarding uptime commitments, cognitive latency limits, and active security compliance policies.
          </p>
        </div>

        {/* SLA Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-24 w-full">
          {metrics.map((metric, i) => (
            <div key={i} className="p-6 sm:p-8 border border-white/10 bg-neutral-950 flex flex-col justify-between hover:border-white/30 transition-colors w-full">
              <div>
                <span className="font-bebas text-3xl sm:text-4xl text-white block mb-1">{metric.stat}</span>
                <span className="font-montserrat text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-3 sm:mb-4">{metric.title}</span>
              </div>
              <p className="font-montserrat text-[10px] sm:text-[11px] text-neutral-500 leading-relaxed">{metric.detail}</p>
            </div>
          ))}
        </div>

        {/* Compliance Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start w-full">
          <div className="lg:col-span-4">
            <h2 className="font-bebas text-3xl sm:text-4xl uppercase mb-4 text-white">Enterprise Safety Covenants</h2>
            <p className="font-montserrat text-[11px] sm:text-xs text-neutral-500 leading-relaxed">
              We operate under heavy structural frameworks to support critical financial, administrative, and operations clusters.
            </p>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-10 sm:gap-12 font-montserrat text-[11px] sm:text-xs text-neutral-400 leading-relaxed w-full">
            <div className="flex items-start gap-4">
              <ShieldCheck className="text-white shrink-0 w-5 h-5 mt-1" />
              <div>
                <h3 className="font-bebas text-xl sm:text-2xl text-white mb-2">SOC 2 Type II Audited</h3>
                <p>
                  Every system, log node, and architecture element created by BAKR.JS complies strictly with trust principles of security, processing integrity, and continuous availability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Cpu className="text-white shrink-0 w-5 h-5 mt-1" />
              <div>
                <h3 className="font-bebas text-xl sm:text-2xl text-white mb-2">Air-Gapped Network Readiness</h3>
                <p>
                  To secure sensitive parameters, our clusters can operate in fully air-gapped environments, completely isolated from public internet access.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Database className="text-white shrink-0 w-5 h-5 mt-1" />
              <div>
                <h3 className="font-bebas text-xl sm:text-2xl text-white mb-2">De-centralized Failover Protocol</h3>
                <p>
                  Should any hardware pod disconnect, workload calculations are split dynamically and rerouted to active nodes within milliseconds, maintaining peak platform performance.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

/* Pre-Footer */
const PreFooter = ({ onNavigate }) => {
  return (
    <section className="py-16 sm:py-24 border-t border-white/10 bg-[#050505] relative overflow-hidden">
      <div 
        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center relative z-10"
        style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}
      >
        <div className="lg:col-span-5">
          <span className="font-montserrat text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-500 block mb-4">
            READY TO UPGRADE?
          </span>
          <h2 className="font-bebas text-4xl sm:text-5xl md:text-7xl uppercase leading-none mb-4 sm:mb-6 text-white">
            Modernize your tech.
          </h2>
          <p className="font-montserrat text-[11px] sm:text-xs text-neutral-400 leading-relaxed mb-6 sm:mb-8 max-w-sm">
            Stop guessing. Answer a few questions about your business and see exactly how much time and money AI and modern IT can save you.
          </p>
          <EliteButton onClick={() => onNavigate('solutions')} variant="secondary">
            Check Automation Potential
          </EliteButton>
        </div>
      </div>
    </section>
  );
};

/* Detailed Professional Footer */
const Footer = ({ onNavigate }) => {
  const logoUrl = "https://static.wixstatic.com/media/548938_6262d3750486469083351e547d9f61b7~mv2.png";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#020202] border-t border-white/10 pt-16 sm:pt-20 pb-10 sm:pb-12">
      <div className="w-full" style={{ paddingLeft: 'max(1.5rem, 3%)', paddingRight: 'max(1.5rem, 3%)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 mb-12 sm:mb-16 w-full">
          
          {/* Logo, pitch & telemetry info */}
          <div className="lg:col-span-4 flex flex-col items-start w-full">
            <div className="h-[22px] sm:h-[26px] md:h-[31px] mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
              <img 
                src={logoUrl} 
                alt="BAKR.JS Logo" 
                className="h-full w-auto logo-filter object-contain"
              />
            </div>
            <p className="font-montserrat text-[10px] sm:text-[11px] text-neutral-500 leading-relaxed uppercase tracking-wider max-w-xs sm:max-w-sm mb-6 sm:mb-8">
              Building world-class IT and AI systems for enterprise scale. We deliver the tech that runs modern business.
            </p>
            <div className="flex flex-col gap-1 font-mono text-[8px] sm:text-[9px] text-neutral-600">
              <span>LOC: PUNE, INDIA</span>
              <span>COORDINATES: 18.5204° N, 73.8567° E</span>
            </div>
          </div>

          {/* Sitemaps */}
          <div className="lg:col-span-2 flex flex-col gap-4 w-full">
            <span className="font-montserrat text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Company
            </span>
            <ul className="flex flex-col gap-2 sm:gap-2.5 font-montserrat text-[10px] sm:text-[11px] text-neutral-500">
              <li><button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors text-left w-full sm:w-auto">Our Solutions</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors text-left w-full sm:w-auto">About Us</button></li>
              <li><button onClick={() => onNavigate('tech')} className="hover:text-white transition-colors text-left w-full sm:w-auto">Why We Are Best</button></li>
              <li><button onClick={() => onNavigate('blogs')} className="hover:text-white transition-colors text-left w-full sm:w-auto">Insights</button></li>
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4 w-full">
            <span className="font-montserrat text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Compliance
            </span>
            <ul className="flex flex-col gap-2 sm:gap-2.5 font-montserrat text-[10px] sm:text-[11px] text-neutral-500">
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors text-left w-full sm:w-auto">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors text-left w-full sm:w-auto">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('sla')} className="hover:text-white transition-colors text-left w-full sm:w-auto">Security Hub</button></li>
            </ul>
          </div>

          {/* Interactive Newsletter / Dispatch Signup */}
          <div className="lg:col-span-4 flex flex-col gap-4 w-full">
            <span className="font-montserrat text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Join Our Newsletter
            </span>
            <p className="font-montserrat text-[10px] sm:text-[11px] text-neutral-500 leading-normal">
              Get the latest IT trends and AI automation strategies sent directly to your inbox. No spam.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2 w-full">
              <div className="relative w-full">
                <input 
                  type="email" 
                  placeholder="ENTER WORK EMAIL" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full footer-input py-3 text-[9px] sm:text-[10px] tracking-widest uppercase pl-1 pr-10"
                  required
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-neutral-400 p-2">
                  <ArrowRight size={14} />
                </button>
              </div>
              <AnimatePresence>
                {subscribed && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[8px] sm:text-[9px] text-green-500 tracking-wider"
                  >
                    THANK YOU FOR SUBSCRIBING.
                  </motion.span>
                )}
              </AnimatePresence>
            </form>
          </div>

        </div>

        {/* Bottom Bar with coordinates, compliance info, copyright & back-to-top */}
        <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-montserrat text-[8px] sm:text-[9px] tracking-[0.3em] text-neutral-600 uppercase text-center md:text-left">
              © 2026 BAKR.JS — ELITE IT ENGINEERING
            </span>
          </div>

          <div className="flex gap-6 sm:gap-8 items-center w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex gap-4 sm:gap-6 font-montserrat text-[9px] sm:text-[10px] font-bold tracking-[0.1em] uppercase text-neutral-500">
              <a href="#" className="hover:text-white transition-colors">TWITTER</a>
              <a href="#" className="hover:text-white transition-colors">LINKEDIN</a>
              <a href="#" className="hover:text-white transition-colors">GITHUB</a>
            </div>
            
            <button 
              onClick={scrollToTop}
              className="p-2 sm:p-3 border border-white/10 hover:border-white text-neutral-400 hover:text-white rounded-full transition-colors group shrink-0"
              title="Return to top"
            >
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigation = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            className="relative flex flex-col min-h-screen justify-between w-full"
          >
            <div className="noise-overlay" />
            <Navigation onNavigate={handleNavigation} currentPage={currentPage} />
            
            <main className="grow w-full">
              <AnimatePresence mode="wait">
                {currentPage === 'home' && (
                  <motion.div key="home" exit={{ opacity: 0 }}>
                    <Hero onNavigate={handleNavigation} />
                    <Statement />
                    <Work />
                    <Capabilities />
                  </motion.div>
                )}

                {currentPage === 'solutions' && (
                  <SolutionsView key="solutions" />
                )}

                {currentPage === 'about' && (
                  <AboutView key="about" />
                )}

                {currentPage === 'tech' && (
                  <TechView key="tech" />
                )}

                {currentPage === 'blogs' && (
                  <BlogsView key="blogs" />
                )}

                {currentPage === 'contact' && (
                  <ContactView key="contact" />
                )}

                {currentPage === 'privacy' && (
                  <PrivacyView key="privacy" />
                )}

                {currentPage === 'terms' && (
                  <TermsView key="terms" />
                )}

                {currentPage === 'sla' && (
                  <SLAView key="sla" />
                )}
              </AnimatePresence>
              
              <PreFooter onNavigate={handleNavigation} />
            </main>
            
            <Footer onNavigate={handleNavigation} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
