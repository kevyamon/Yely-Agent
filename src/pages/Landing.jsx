// src/pages/Landing.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Wallet, BadgeCheck, Zap, ShieldCheck, ArrowUp, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export default function Landing() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    // Apparition du bouton scroll à partir de 300px
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    
    // Intercepte l'événement d'installation PWA
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

  // LOGIQUE SECRET CEO (10 secondes exactes)
  const startLongPress = (e) => {
    if (e.type === 'touchstart') e.preventDefault(); // Bloque la sélection sur mobile
    longPressTimer.current = setTimeout(() => {
      toast.info("Identification CEO...");
      navigate('/darkyelydb42');
    }, 10000); 
  };

  const stopLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-yely-richBlack text-yely-white font-sans selection:bg-yely-gold selection:text-black flex flex-col relative overflow-hidden">
      
      {/* Effets de lumiere en arriere-plan (Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yely-gold opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yely-gold opacity-5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-yely-white/5 bg-yely-richBlack/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yely-goldLight to-yely-goldDark rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <span className="text-black font-bold text-xl tracking-tighter">Y</span>
          </div>
          <span className="text-2xl font-black text-white tracking-widest uppercase">
            Yély <span className="text-yely-gold font-light">Agent</span>
          </span>
        </div>
        
        <div className="flex gap-4 items-center">
          <Link 
            to="/login" 
            className="hidden md:block text-yely-softGray hover:text-yely-gold transition-colors font-medium px-4 py-2"
          >
            Espace Agent
          </Link>
          <Link 
            to="/register" 
            className="bg-yely-gold/10 hover:bg-yely-gold border border-yely-gold text-yely-gold hover:text-black font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            Rejoindre
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yely-white/5 border border-yely-white/10 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-yely-success animate-pulse"></span>
          <span className="text-sm font-medium text-yely-softGray tracking-wide">Recrutement ouvert a Maféré</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-yely-softGray mb-6 tracking-tight leading-tight max-w-4xl">
          Transformez votre réseau en <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yely-goldLight via-yely-gold to-yely-goldDark">
            Revenus Illimités
          </span>
        </h1>
        
        <p className="text-yely-softGray text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light">
          Devenez le visage officiel de la révolution VTC. Accompagnez les habitants dans l'installation de l'application et recevez des commissions instantanées pour chaque compte validé.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* CTA Principal Survitaminé */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/register" 
              className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-yely-gold to-yely-goldDark text-black font-black text-lg py-5 px-10 rounded-full transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 uppercase tracking-wide">Devenir Agent</span>
              <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Bouton d'Installation PWA */}
          {deferredPrompt && (
            <motion.button 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-yely-white/5 border border-yely-white/10 hover:bg-yely-white/10 text-yely-white font-medium py-5 px-8 rounded-full transition-all"
            >
              <Download className="w-5 h-5 text-yely-gold" />
              Installer l'App
            </motion.button>
          )}
        </div>

        {/* Feature Cards (Glassmorphism intact) */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4">
          <div className="bg-yely-charcoal/40 backdrop-blur-md p-8 rounded-3xl border border-yely-white/5 hover:border-yely-gold/30 transition-colors group text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yely-gold/5 rounded-bl-[100px] -z-10 group-hover:bg-yely-gold/10 transition-colors"></div>
            <Wallet className="w-12 h-12 text-yely-gold mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">Commissions Directes</h3>
            <p className="text-yely-softGray leading-relaxed">Une remuneration transparente et versee immediatement sur votre solde pour chaque utilisateur actif que vous connectez au reseau.</p>
          </div>

          <div className="bg-yely-charcoal/40 backdrop-blur-md p-8 rounded-3xl border border-yely-white/5 hover:border-yely-gold/30 transition-colors group text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yely-gold/5 rounded-bl-[100px] -z-10 group-hover:bg-yely-gold/10 transition-colors"></div>
            <BadgeCheck className="w-12 h-12 text-yely-gold mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">Statut Officiel</h3>
            <p className="text-yely-softGray leading-relaxed">Travailler avec nous vous donne droit a une dotation complete : badges d'identification, t-shirts premium et materiel marketing.</p>
          </div>

          <div className="bg-yely-charcoal/40 backdrop-blur-md p-8 rounded-3xl border border-yely-white/5 hover:border-yely-gold/30 transition-colors group text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yely-gold/5 rounded-bl-[100px] -z-10 group-hover:bg-yely-gold/10 transition-colors"></div>
            <ShieldCheck className="w-12 h-12 text-yely-gold mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">Formation Premium</h3>
            <p className="text-yely-softGray leading-relaxed">Developpez vos competences commerciales. Nous vous formons gratuitement aux meilleures techniques de vente sur le terrain.</p>
          </div>
        </div>
      </main>

      {/* BOUTON SCROLL TO TOP & EASTER EGG CEO */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            
            onClick={handleScrollToTopClick}
            
            onMouseDown={startLongPress}
            onMouseUp={stopLongPress}
            onMouseLeave={stopLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={stopLongPress}
            
            // Sécurité anti-sélection texte sur mobile
            style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
            
            className="fixed bottom-8 right-8 p-4 bg-yely-gold text-black rounded-full shadow-[0_5px_20px_rgba(212,175,55,0.4)] z-50 group active:scale-90 transition-transform cursor-pointer"
          >
            <ArrowUp className="w-6 h-6 font-black group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="relative z-10 py-8 text-center border-t border-yely-white/5 bg-yely-richBlack/80 mt-12">
        <p className="text-yely-softGray/50 text-sm tracking-wide">
          © {currentYear} Yély. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}