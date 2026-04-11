//src/pages/Landing.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Wallet, BadgeCheck, ShieldCheck, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ScrollToTop from '../components/ScrollToTop';
import Footer from '../components/Footer';

export default function Landing() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.info("L'application est déjà installée sur cet appareil.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-full bg-yely-richBlack text-yely-white font-sans selection:bg-yely-gold selection:text-black flex flex-col relative overflow-x-hidden">
      
      {/* ANCRE ABSOLUE POUR LE SCROLL TO TOP */}
      <div id="top-anchor"></div>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yely-gold opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yely-gold opacity-5 rounded-full blur-[100px] pointer-events-none"></div>

      <nav className="relative z-10 px-8 py-6 flex justify-center items-center border-b border-yely-white/5 bg-yely-richBlack/50 backdrop-blur-md">
        <span className="text-3xl font-black text-white tracking-widest uppercase">
          Yély <span className="text-yely-gold font-light">Agent</span>
        </span>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-24 text-center w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yely-white/5 border border-yely-white/10 mb-6 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-yely-success animate-pulse"></span>
          <span className="text-sm font-medium text-yely-softGray tracking-wide">Recrutement ouvert à Maféré</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-yely-softGray mb-4 tracking-tight leading-tight max-w-4xl"
        >
          Transformez votre réseau en <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yely-goldLight via-yely-gold to-yely-goldDark">
            Revenus Illimités
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-yely-softGray text-lg md:text-xl max-w-2xl mb-8 leading-relaxed font-light"
        >
          Devenez le visage officiel de la révolution VTC. Accompagnez les habitants dans l'installation de l'application et recevez des commissions instantanées pour chaque compte validé.
        </motion.p>

        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="w-full"
          >
            <Link 
              to="/register" 
              className="group flex items-center justify-center gap-4 bg-yely-gold text-black font-black text-2xl py-6 px-10 rounded-[2rem] transition-all hover:scale-105 shadow-[0_0_40px_rgba(212,175,55,0.5)] animate-pulse hover:animate-none overflow-hidden relative w-full"
            >
              <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              <span className="relative z-10 uppercase tracking-widest">Devenir Agent</span>
              <ArrowRight className="relative z-10 w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
             onClick={() => navigate('/login')}
             className="text-yely-softGray text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-yely-gold transition-colors mb-2"
          >
             Déjà membre ? Se connecter
          </motion.div>

          <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            onClick={handleInstallClick}
            className="flex items-center gap-3 bg-yely-white/5 border border-yely-white/10 hover:bg-yely-white/10 text-yely-white font-bold py-4 px-8 rounded-[2rem] transition-all uppercase text-sm tracking-widest w-full justify-center"
          >
            <Download className="w-5 h-5 text-yely-gold" />
            Installer l'Application
          </motion.button>
        </div>

        <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
          {[
            { icon: Wallet, title: "Commissions Directes", desc: "Une rémunération transparente et versée immédiatement sur votre solde pour chaque utilisateur actif." },
            { icon: BadgeCheck, title: "Statut Officiel", desc: "Travailler avec nous vous donne droit à une dotation : badges d'identification, t-shirts et matériel marketing." },
            { icon: ShieldCheck, title: "Formation Premium", desc: "Développez vos compétences. Nous vous formons gratuitement aux meilleures techniques de vente." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              className="bg-yely-charcoal/40 backdrop-blur-md p-10 rounded-3xl border border-yely-white/5 hover:border-yely-gold/30 transition-colors group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yely-gold/5 rounded-bl-[100px] -z-10 group-hover:bg-yely-gold/10 transition-colors"></div>
              <item.icon className="w-14 h-14 text-yely-gold mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-yely-softGray leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}