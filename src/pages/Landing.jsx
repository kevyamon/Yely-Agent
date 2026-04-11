// src/pages/Landing.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { UserCheck, Shield, Zap, ArrowUp, ChevronRight, Download, Star, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Landing() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const longPressTimer = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    
    // Ecouteur pour l'installation PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // LOGIQUE SECRET CEO (Long press 10s)
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      toast.info("Identification CEO requise...");
      navigate('/darkyelydb42');
    }, 10000); // 10 secondes exactes
  };

  const stopLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <div className="min-h-screen bg-yely-richBlack text-yely-white overflow-x-hidden selection:bg-yely-gold selection:text-yely-black font-sans">
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-yely-gold origin-left z-50" style={{ scaleX }} />

      {/* Ambiance Visuelle (Cercles Lumineux) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-yely-gold rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ x: [0, 50, 0], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-yely-danger rounded-full blur-[130px]" 
        />
      </div>

      <main className="relative z-10">
        {/* HERO SECTION DYNAMIQUE */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-yely-gold/10 border border-yely-gold/20 px-5 py-2.5 rounded-full mb-10 shadow-lg shadow-yely-gold/5"
          >
            <Sparkles className="w-4 h-4 text-yely-gold animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yely-goldLight">
              Reseau de parrainage n.1 en CI
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter italic">
              YELY <span className="text-yely-gold text-glow">AGENT</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl text-lg md:text-2xl text-yely-softGray mb-14 font-medium leading-relaxed px-4"
          >
            Transformez chaque parrainage en cash instantané. 
            Devenez le moteur de la croissance Yely sur le terrain.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-xl px-6">
            {/* BOUTON DEVENIR AGENT (MAÎTRE) */}
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,175,55,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="w-full bg-yely-gold text-yely-black py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              DEVENIR AGENT
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </motion.button>

            {/* BOUTON INSTALLER PWA */}
            {deferredPrompt && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleInstallClick}
                className="w-full sm:w-auto bg-yely-white/5 border border-yely-white/10 text-yely-white px-8 py-6 rounded-[2rem] font-bold text-sm flex items-center justify-center gap-3 hover:bg-yely-white/10 transition-all uppercase tracking-widest"
              >
                <Download className="w-5 h-5 text-yely-gold" />
                Installer l'app
              </motion.button>
            )}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => navigate('/login')}
            className="mt-10 text-yely-softGray text-xs font-black uppercase tracking-widest cursor-pointer hover:text-yely-gold transition-colors"
          >
            Deja membre ? Se connecter
          </motion.div>
        </section>

        {/* ARGUMENTS DE VENTE */}
        <section className="max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-3 gap-10">
          {[
            { icon: Zap, title: "Cash Flow", desc: "Retraits directs sur Wave CI sans delais de traitement." },
            { icon: Shield, title: "Bank Grade", desc: "Vos donnees et vos gains sont proteges par notre Iron Dome." },
            { icon: Star, title: "Elite Club", desc: "Bonus exclusifs pour le Top 5 des meilleurs ambassadeurs." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-yely-charcoal/30 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-yely-white/5 hover:border-yely-gold/20 transition-all group"
            >
              <div className="bg-yely-black w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-yely-white/5 group-hover:border-yely-gold/40 transition-all">
                <item.icon className="text-yely-gold w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{item.title}</h3>
              <p className="text-yely-softGray text-sm leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>

      {/* SECRET SCROLL TO TOP & CEO TRIGGER */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            onMouseDown={startLongPress}
            onMouseUp={stopLongPress}
            onMouseLeave={stopLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={stopLongPress}
            className="fixed bottom-10 right-10 p-5 bg-yely-gold text-yely-black rounded-full shadow-[0_10px_40px_rgba(212,175,55,0.4)] z-50 group active:scale-90 transition-transform"
          >
            <ArrowUp className="w-7 h-7 font-black group-hover:-translate-y-1 transition-transform" />
            <div className="absolute inset-0 rounded-full border-4 border-yely-black/10 scale-110"></div>
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="py-20 text-center">
        <p className="text-[10px] text-yely-softGray font-black uppercase tracking-[0.5em] opacity-40">
          &copy; 2026 Yely Mobile S.A. | Iron Dome Protection
        </p>
      </footer>

      <style jsx="true">{`
        .text-glow {
          text-shadow: 0 0 30px rgba(212,175,55,0.3);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}