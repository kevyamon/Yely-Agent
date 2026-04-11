// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, DollarSign, LogOut, Lock, ArrowLeft, Eye, EyeOff, CheckCircle2, RefreshCcw, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [totalDistributed, setTotalDistributed] = useState(0);

  const [confirmModal, setConfirmModal] = useState({ show: false, type: '', data: null, step: 'init' });

  const fetchAdminData = async (pwd) => {
    try {
      const response = await api.get('/agents/darkyelydb42', { 
        headers: { 'x-admin-password': pwd || password } 
      });
      if (response.data.success) {
        setAgents(response.data.data.agents);
        setTotalDistributed(response.data.data.totalDistributed);
      }
    } catch (error) {
      if (error.response?.status === 403) toast.error("Clef d'acces invalide.");
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.get('/agents/darkyelydb42', { 
        headers: { 'x-admin-password': password } 
      });
      if (response.data.success) {
        setAgents(response.data.data.agents);
        setTotalDistributed(response.data.data.totalDistributed);
        setIsAuthenticated(true);
        toast.success("Acces CEO accorde.");
      }
    } catch (error) { 
      toast.error("Acces refuse. Verifiez votre mot de passe."); 
    } finally { setLoading(false); }
  };

  // CORRECTION : Lancement natif de l'application Wave CI
  const launchWavePayment = async (phone, amount) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    
    try {
      // 1. On copie le numéro pour faciliter le collage dans Wave
      await navigator.clipboard.writeText(cleanPhone);
      toast.success(`Numéro ${cleanPhone} copié ! Ouverture de Wave...`);
      
      // 2. On utilise le scheme URL natif pour ouvrir l'app Wave au lieu du site web
      window.location.href = "wave://";
      
      // 3. On passe le modal à l'étape de vérification après un court délai
      setTimeout(() => {
        setConfirmModal(prev => ({ ...prev, step: 'verify' }));
      }, 1500);
      
    } catch (err) {
      toast.error("Copiez le numéro manuellement svp.");
      setConfirmModal(prev => ({ ...prev, step: 'verify' }));
    }
  };

  const executeFinalPayout = async () => {
    const { type, data } = confirmModal;
    setConfirmModal({ ...confirmModal, show: false, step: 'init' });

    try {
      const headers = { 'x-admin-password': password };
      if (type === 'single') {
        const res = await api.post(`/agents/darkyelydb42/payout/${data.id}`, {}, { headers });
        if (res.data.success) {
          toast.success(`Compte de ${data.name} solde.`);
          fetchAdminData();
        }
      } else {
        const res = await api.post('/agents/darkyelydb42/payout-all', {}, { headers });
        if (res.data.success) {
          toast.success("Tous les comptes ont ete reinitialises.");
          fetchAdminData();
        }
      }
    } catch (e) { toast.error("Erreur technique sur Railway."); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-yely-richBlack">
        <header className="px-4 py-4 border-b border-yely-charcoal flex items-center">
          <ArrowLeft className="w-6 h-6 text-yely-softGray cursor-pointer" onClick={() => navigate('/')} />
          <span className="ml-2 text-yely-white font-bold uppercase text-xs tracking-widest">Retour au site</span>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <form onSubmit={handleUnlock} className="w-full max-w-md bg-yely-charcoal p-8 rounded-3xl border border-yely-danger/20 shadow-2xl">
            <ShieldAlert className="w-16 h-16 text-yely-danger mx-auto mb-6" />
            <h1 className="text-2xl font-black text-yely-white text-center mb-8 tracking-widest uppercase italic">Authentification CEO</h1>
            <div className="relative mb-8">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yely-danger" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-12 pr-12 py-5 bg-yely-black border border-yely-white/5 rounded-2xl text-yely-white text-center font-black tracking-[0.5em] outline-none focus:border-yely-danger transition-all" 
                placeholder="••••••" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-yely-softGray">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-yely-danger text-white font-black py-5 rounded-2xl uppercase tracking-widest shadow-lg shadow-yely-danger/20">
              {loading ? 'Verification...' : 'Deverrouiller le Coffre'}
            </button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yely-richBlack pb-20">
      <header className="bg-yely-charcoal border-b border-yely-danger/30 sticky top-0 z-10 p-4 flex justify-between items-center text-yely-white backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-2 font-black uppercase tracking-tighter italic">
          <ShieldAlert className="text-yely-danger w-6 h-6" /> Yely Control Tower
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="p-2 bg-yely-danger/10 text-yely-danger rounded-xl"><LogOut className="w-5 h-5" /></button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-yely-charcoal p-6 rounded-3xl border border-yely-danger/30">
            <h2 className="text-yely-danger text-[10px] font-black uppercase mb-2 tracking-widest">Dette Totale Cumulative</h2>
            <p className="text-4xl font-black text-white">{totalDistributed.toLocaleString('fr-FR')} <span className="text-lg text-yely-danger">FCFA</span></p>
          </div>
          <div className="bg-yely-charcoal p-6 rounded-3xl border border-yely-white/5 flex justify-between items-end">
            <div>
              <h2 className="text-yely-softGray text-[10px] font-black uppercase mb-2 tracking-widest">Reseau Agents</h2>
              <p className="text-4xl font-black text-yely-gold">{agents.length}</p>
            </div>
            <button onClick={() => setConfirmModal({ show: true, type: 'all', data: null, step: 'init' })} className="flex items-center gap-2 bg-yely-danger text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-tighter"><RefreshCcw className="w-4 h-4" /> Reset General</button>
          </div>
        </div>

        <section className="bg-yely-charcoal rounded-3xl border border-yely-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-yely-black/50 text-yely-softGray text-[10px] font-black uppercase tracking-widest"><th className="p-4">Ambassadeur</th><th className="p-4">Commission</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-yely-white/5">
                {agents.map((a) => (
                  <tr key={a._id} className="hover:bg-yely-black/30 transition-colors">
                    <td className="p-4">
                      <p className="font-black text-yely-white text-sm">{a.name}</p>
                      <p className="text-[10px] text-yely-gold font-bold tracking-widest">{a.agentId}</p>
                    </td>
                    <td className="p-4 font-black text-yely-success text-lg">{a.totalEarned.toLocaleString('fr-FR')} F</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setConfirmModal({ show: true, type: 'single', data: { id: a._id, name: a.name, amount: a.totalEarned, phone: a.phone }, step: 'init' })} 
                        disabled={a.totalEarned === 0} 
                        className="bg-yely-success/10 text-yely-success px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 ml-auto disabled:opacity-10 transition-all border border-yely-success/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Solder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL CEO SMART */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-yely-black/95 backdrop-blur-xl animate-fade-in">
          <div className="bg-yely-charcoal w-full max-w-sm rounded-[2rem] border border-yely-gold/20 p-8 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            {confirmModal.step === 'init' ? (
              <>
                <div className="bg-yely-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><DollarSign className="text-yely-gold w-10 h-10" /></div>
                <h3 className="text-2xl font-black text-yely-white text-center mb-2 uppercase italic">Ordre de Paiement</h3>
                <p className="text-yely-softGray text-center text-sm mb-8 leading-relaxed">
                  Confirmez-vous le virement de <strong>{confirmModal.data?.amount} FCFA</strong> vers Wave pour <strong>{confirmModal.data?.name}</strong> ?
                </p>
                <div className="space-y-4">
                  <button onClick={() => launchWavePayment(confirmModal.data.phone, confirmModal.data.amount)} className="w-full py-5 bg-yely-gold text-yely-black font-black rounded-2xl flex items-center justify-center gap-3 uppercase tracking-tighter shadow-lg"><ExternalLink className="w-5 h-5" /> Lancer Wave CI</button>
                  <button onClick={() => setConfirmModal({ show: false, step: 'init' })} className="w-full py-3 text-yely-softGray font-bold uppercase text-[10px] tracking-widest">Abandonner</button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-yely-success/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="text-yely-success w-10 h-10" /></div>
                <h3 className="text-2xl font-black text-yely-white text-center mb-2 uppercase italic">Verrouillage</h3>
                <p className="text-yely-softGray text-center text-sm mb-8 leading-relaxed">
                  Le virement a-t-il ete valide dans l'application Wave ? Cliquez sur "Confirmer" pour réinitialiser son compteur.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setConfirmModal({ show: false, step: 'init' })} className="flex-1 py-4 border border-yely-white/10 text-yely-white font-black rounded-2xl uppercase text-[10px]">Echec</button>
                  <button onClick={executeFinalPayout} className="flex-1 py-4 bg-yely-success text-white font-black rounded-2xl uppercase text-[10px] shadow-lg shadow-yely-success/20">Oui, Confirmer</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}