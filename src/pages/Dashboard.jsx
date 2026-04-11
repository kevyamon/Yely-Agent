// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Wallet, UserPlus, History, CheckCircle, Trophy, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import PhoneInput from '../components/PhoneInput';

export default function Dashboard() {
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [recentClaims, setRecentClaims] = useState([]);
  const [countryCode, setCountryCode] = useState('+225');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Correction : Endpoint /agents/dashboard
      const response = await api.get('/agents/dashboard');
      if (response.data.success) {
        setAgent(response.data.data.agent);
        setRecentClaims(response.data.data.recentClaims);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (phone.length < 8) return;

    setClaimLoading(true);
    try {
      const fullInternationalPhone = `${countryCode}${phone}`;
      
      // Correction : Endpoint /agents/claim
      const response = await api.post('/agents/claim', { clientPhone: fullInternationalPhone });
      if (response.data.success) {
        toast.success(`Succes ! +${response.data.data.amountAdded} FCFA ajoutes.`);
        setPhone(''); 
        fetchDashboardData();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la reclamation.';
      toast.error(errorMsg);
    } finally {
      setClaimLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agentToken');
    localStorage.removeItem('agentInfo');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yely-richBlack">
        <div className="w-10 h-10 border-4 border-yely-charcoal border-t-yely-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yely-richBlack pb-20">
      <header className="bg-yely-charcoal border-b border-yely-white/5 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-yely-white uppercase tracking-tighter">Dashboard</h1>
            <p className="text-yely-gold text-sm font-black">{agent?.name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 bg-yely-danger/10 text-yely-danger rounded-xl hover:bg-yely-danger/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-gradient-to-br from-yely-charcoal to-yely-black rounded-3xl p-6 border border-yely-gold/20 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-yely-gold/5">
            <Wallet className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <p className="text-yely-softGray text-xs font-bold uppercase mb-1">Portefeuille Commission</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-yely-gold tracking-tight">
                {agent?.totalEarned?.toLocaleString('fr-FR')}
              </span>
              <span className="text-yely-goldLight font-bold">FCFA</span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 bg-yely-success/10 text-yely-success px-3 py-1 rounded-full text-xs font-bold uppercase">
              <CheckCircle className="w-3 h-3" /> Agent Verifie
            </div>
          </div>
        </section>

        <button 
          onClick={() => navigate('/leaderboard')}
          className="w-full bg-yely-charcoal hover:bg-yely-richBlack border border-yely-gold/30 rounded-2xl p-4 flex items-center justify-between transition-colors group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="bg-yely-gold/10 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-yely-gold" />
            </div>
            <span className="text-yely-white font-bold uppercase text-xs tracking-widest group-hover:text-yely-gold transition-colors">Classement Elite</span>
          </div>
          <ChevronRight className="text-yely-gold w-6 h-6" />
        </button>

        <section className="bg-yely-charcoal rounded-3xl p-6 border border-yely-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yely-gold/10 p-3 rounded-xl text-yely-gold">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-yely-white uppercase tracking-tight">Nouvelle Declaration</h2>
              <p className="text-yely-softGray text-[10px] uppercase font-bold">Le client doit etre inscrit au prealable</p>
            </div>
          </div>

          <form onSubmit={handleClaim} className="space-y-6">
            <PhoneInput 
              countryCode={countryCode} 
              setCountryCode={setCountryCode} 
              phone={phone} 
              setPhone={setPhone} 
            />
            
            <button
              type="submit"
              disabled={claimLoading || phone.length < 8}
              className="w-full bg-yely-gold hover:bg-yely-goldLight text-yely-black font-black py-4 rounded-xl transition-colors disabled:opacity-50 text-base uppercase"
            >
              {claimLoading ? 'Verification...' : 'Enregistrer la Prime'}
            </button>
          </form>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 px-2 uppercase">
            <History className="w-4 h-4 text-yely-softGray" />
            <h3 className="text-yely-white text-xs font-bold tracking-widest">Historique (7 jours)</h3>
          </div>

          <div className="space-y-3">
            {recentClaims.length === 0 ? (
              <div className="bg-yely-charcoal/50 rounded-2xl p-6 text-center border border-yely-white/5">
                <p className="text-yely-softGray text-xs uppercase font-medium">Aucune activite recente</p>
              </div>
            ) : (
              recentClaims.map((claim) => (
                <div key={claim._id} className="bg-yely-charcoal rounded-2xl p-4 flex justify-between items-center border border-yely-white/5">
                  <div>
                    <p className="text-yely-white font-bold tracking-widest text-sm">{claim.clientPhone}</p>
                    <p className="text-yely-softGray text-[10px] uppercase mt-1">
                      {new Date(claim.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-yely-success font-black text-lg">+{claim.amount} F</p>
                    <p className="text-yely-softGray text-[10px] uppercase font-bold">{claim.clientRole === 'driver' ? 'Chauffeur' : 'Passager'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}