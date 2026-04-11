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
    // Affiche le bouton ScrollToTop à la moitié de l'écran environ
    const handleScroll = () => setShowScrollTop(window.scrollY > window.innerHeight / 2);
    window.addEventListener('scroll', handleScroll);
    
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

  const handleScrollToTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // LOGIQUE SECRET CEO (Long press 10s exactes)
  const startLongPress = (e) => {
    // Empêche le clic droit ou la sélection sur mobile
    if (e.type === 'touchstart') e.preventDefault(); 
    
    longPressTimer.current = setTimeout(() => {
      toast.info("Identification CEO requise...", { autoClose: 1500 });
      navigate('/darkyelydb42');
    }, 10000); 
  };

  const stopLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <div className="min-h-screen bg-yely-richBlack text-yely-white overflow-x-hidden selection:bg-yely-gold selection:text-yely-black font-sans">
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-yely-gold origin-left z-50" style={{ scaleX }} />

      {/* Background Lumineux */}
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

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 bg-yely-gold/10 border border-yely-gold/20 px-5 py-2.5 rounded-full mb-10 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-yely-gold animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yely-goldLight">
            Reseau de parrainage n.1 en CI
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter italic">
            YELY <span className="text-yely-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">AGENT</span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="max-w-2xl text-lg md:text-2xl text-yely-softGray mb-14 font-medium leading-relaxed px-4"
        >
          Transformez chaque parrainage en cash instantané. 
          Devenez le moteur de la croissance Yely sur le terrain.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-xl px-6">
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="w-full bg-yely-gold text-yely-black py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            DEVENIR AGENT
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.button>

          {deferredPrompt && (
            <motion.button 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleInstallClick}
              className="w-full sm:w-auto bg-yely-white/5 border border-yely-white/10 text-yely-white px-8 py-6 rounded-[2rem] font-bold text-sm flex items-center justify-center gap-3 hover:bg-yely-white/10 transition-all uppercase tracking-widest"
            >
              <Download className="w-5 h-5 text-yely-gold" />
              Installer l'app
            </motion.button>
          )}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          onClick={() => navigate('/login')}
          className="mt-10 text-yely-softGray text-xs font-black uppercase tracking-widest cursor-pointer hover:text-yely-gold transition-colors"
        >
          Deja membre ? Se connecter
        </motion.div>
      </main>

      {/* SECTION DES ARGUMENTS */}
      <section className="max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-3 gap-10 relative z-10">
        {[
          { icon: Zap, title: "Cash Flow", desc: "Retraits directs sur Wave CI sans delais de traitement." },
          { icon: Shield, title: "Bank Grade", desc: "Vos donnees et vos gains sont proteges par notre Iron Dome." },
          { icon: Star, title: "Elite Club", desc: "Bonus exclusifs pour le Top 5 des meilleurs ambassadeurs." }
        ].map((item, idx) => (
          <motion.div
            key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}
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

      {/* BOUTON SCROLL TO TOP & EASTER EGG CEO */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            
            onClick={handleScrollToTopClick}
            
            // Events pour le Long Press (10s)
            onMouseDown={startLongPress}
            onMouseUp={stopLongPress}
            onMouseLeave={stopLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={stopLongPress}
            
            // CSS critiques pour mobile : empeche le clic droit / selection
            style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
            
            className="fixed bottom-10 right-10 p-5 bg-yely-gold text-yely-black rounded-full shadow-[0_10px_40px_rgba(212,175,55,0.4)] z-50 active:scale-90 transition-transform cursor-pointer overflow-hidden group"
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
    </div>
  );
}