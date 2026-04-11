// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, DollarSign, LogOut, Lock, ArrowLeft, Eye, EyeOff, CheckCircle2, RefreshCcw, AlertTriangle, ExternalLink } from 'lucide-react';
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

  // État pour le Modal de Confirmation avec option Wave
  const [confirmModal, setConfirmModal] = useState({ show: false, type: '', data: null, step: 'init' });

  const fetchAdminData = async (pwd) => {
    try {
      const response = await api.get('/darkyelydb42', { headers: { 'x-admin-password': pwd || password } });
      if (response.data.success) {
        setAgents(response.data.data.agents);
        setTotalDistributed(response.data.data.totalDistributed);
      }
    } catch (error) {
      if (error.response?.status === 403) toast.error("Mot de passe incorrect.");
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.get('/darkyelydb42', { headers: { 'x-admin-password': password } });
      if (response.data.success) {
        setAgents(response.data.data.agents);
        setTotalDistributed(response.data.data.totalDistributed);
        setIsAuthenticated(true);
      }
    } catch (error) { toast.error("Erreur d'acces."); }
    finally { setLoading(false); }
  };

  // ÉTAPE 1 : Lancer Wave
  const launchWavePayment = (phone, amount) => {
    // Format Deep Link Wave pour la Cote d'Ivoire
    // Note: Si l'app Wave est installée, ce lien l'ouvrira directement
    const waveUrl = `https://wave.com/pay/send?phone=${phone}&amount=${amount}`;
    window.open(waveUrl, '_blank');
    
    // On passe à l'étape de confirmation dans le modal
    setConfirmModal(prev => ({ ...prev, step: 'verify' }));
  };

  // ÉTAPE 2 : Confirmer la remise à zéro sur le serveur
  const executeFinalPayout = async () => {
    const { type, data } = confirmModal;
    setConfirmModal({ ...confirmModal, show: false, step: 'init' });

    try {
      if (type === 'single') {
        const res = await api.post(`/darkyelydb42/payout/${data.id}`, {}, { headers: { 'x-admin-password': password } });
        if (res.data.success) {
          toast.success(`Le compte de ${data.name} a ete remis a zero.`);
          fetchAdminData();
        }
      } else {
        const res = await api.post('/darkyelydb42/payout-all', {}, { headers: { 'x-admin-password': password } });
        if (res.data.success) {
          toast.success("Tous les comptes ont ete réinitialisés.");
          fetchAdminData();
        }
      }
    } catch (e) { toast.error("Erreur technique lors de la remise a zero."); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-yely-richBlack">
        <header className="px-4 py-4 border-b border-yely-charcoal flex items-center">
          <ArrowLeft className="w-6 h-6 text-yely-softGray cursor-pointer" onClick={() => navigate('/')} />
          <span className="ml-2 text-yely-white font-bold">Retour</span>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <form onSubmit={handleUnlock} className="w-full max-w-md bg-yely-charcoal p-8 rounded-3xl border border-yely-danger/30">
            <ShieldAlert className="w-12 h-12 text-yely-danger mx-auto mb-4" />
            <h1 className="text-2xl font-black text-yely-white text-center mb-6 tracking-widest uppercase">Espace CEO</h1>
            <div className="relative mb-6">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yely-danger" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-yely-black border border-yely-white/10 rounded-xl text-yely-white text-center font-bold" placeholder="Mot de passe" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-yely-softGray">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button type="submit" className="w-full bg-yely-danger text-white font-bold py-4 rounded-xl">DEVERROUILLER</button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yely-richBlack pb-20">
      <header className="bg-yely-charcoal border-b border-yely-danger/30 sticky top-0 z-10 p-4 flex justify-between items-center text-yely-white">
        <div className="flex items-center gap-2 font-black uppercase tracking-tighter"><ShieldAlert className="text-yely-danger w-6 h-6" /> Yely CEO</div>
        <button onClick={() => setIsAuthenticated(false)} className="p-2 bg-yely-danger/10 text-yely-danger rounded-xl"><LogOut className="w-5 h-5" /></button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-yely-charcoal p-6 rounded-3xl border border-yely-danger/30">
            <h2 className="text-yely-danger text-xs font-bold uppercase mb-2">Dette Totale Agents</h2>
            <p className="text-3xl font-black text-white">{totalDistributed.toLocaleString('fr-FR')} <span className="text-lg text-yely-danger">FCFA</span></p>
          </div>
          <div className="bg-yely-charcoal p-6 rounded-3xl border border-yely-white/5 flex justify-between items-end">
            <div><h2 className="text-yely-softGray text-xs font-bold uppercase mb-2">Ambassadeurs</h2><p className="text-3xl font-black text-yely-gold">{agents.length}</p></div>
            <button onClick={() => setConfirmModal({ show: true, type: 'all', data: null, step: 'init' })} className="flex items-center gap-2 bg-yely-danger text-white text-xs font-bold px-4 py-2 rounded-lg"><RefreshCcw className="w-4 h-4" /> Reset Global</button>
          </div>
        </div>

        <section className="bg-yely-charcoal rounded-3xl border border-yely-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="bg-yely-black/50 text-yely-softGray text-xs uppercase"><th className="p-4">Agent</th><th className="p-4">Gain</th><th className="p-4 text-right">Action</th></tr></thead>
            <tbody className="divide-y divide-yely-white/5">
              {agents.map((a) => (
                <tr key={a._id} className="hover:bg-yely-richBlack">
                  <td className="p-4"><p className="font-bold text-yely-white">{a.name}</p><p className="text-xs text-yely-gold">{a.agentId}</p></td>
                  <td className="p-4 font-black text-yely-success">{a.totalEarned.toLocaleString('fr-FR')} F</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setConfirmModal({ show: true, type: 'single', data: { id: a._id, name: a.name, amount: a.totalEarned, phone: a.phone }, step: 'init' })} disabled={a.totalEarned === 0} className="bg-yely-success/10 text-yely-success px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ml-auto disabled:opacity-20"><CheckCircle2 className="w-4 h-4" /> Solder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* MODAL DE PAIEMENT & CONFIRMATION SMART */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-yely-black/90 backdrop-blur-md">
          <div className="bg-yely-charcoal w-full max-w-sm rounded-3xl border border-yely-gold/20 p-8 shadow-2xl">
            {confirmModal.step === 'init' ? (
              <>
                <div className="bg-yely-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><DollarSign className="text-yely-gold w-8 h-8" /></div>
                <h3 className="text-xl font-bold text-yely-white text-center mb-2">Paiement Agent</h3>
                <p className="text-yely-softGray text-center text-sm mb-8">
                  Voulez-vous payer <strong>{confirmModal.data?.amount} F</strong> à <strong>{confirmModal.data?.name}</strong> via Wave ?
                </p>
                <div className="space-y-3">
                  <button onClick={() => launchWavePayment(confirmModal.data.phone, confirmModal.data.amount)} className="w-full py-4 bg-yely-gold text-yely-black font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-tight"><ExternalLink className="w-5 h-5" /> Ouvrir Wave CI</button>
                  <button onClick={() => setConfirmModal({ show: false, step: 'init' })} className="w-full py-3 text-yely-softGray font-bold">Plus tard</button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-yely-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="text-yely-success w-8 h-8" /></div>
                <h3 className="text-xl font-bold text-yely-white text-center mb-2">Verification</h3>
                <p className="text-yely-softGray text-center text-sm mb-8">
                  Avez-vous confirme le virement dans Wave ? Cliquer sur "Confirmer" pour vider son compteur Yely.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmModal({ show: false, step: 'init' })} className="flex-1 py-4 border border-yely-white/10 text-yely-white font-bold rounded-xl uppercase text-xs">Annuler</button>
                  <button onClick={executeFinalPayout} className="flex-1 py-4 bg-yely-success text-white font-black rounded-xl uppercase text-xs">Oui, Confirmer</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}