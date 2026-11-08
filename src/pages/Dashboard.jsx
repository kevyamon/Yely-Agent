// src/pages/Dashboard.jsx
// TABLEAU DE BORD AGENT — Supervision Terrain & Suivi Multi-Cibles
// Senior UI/UX : Métriques en temps réel, réconciliation à la demande, zéro icône étoile.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Wallet,
  Trophy,
  ChevronRight,
  Car,
  Store,
  Users,
  CheckCircle2,
  Clock,
  RotateCcw,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    driverCount: 0,
    sellerCount: 0,
    riderCount: 0,
    verifiedCount: 0,
    pendingCount: 0
  });
  const [recentSurveys, setRecentSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reverifyLoadingId, setReverifyLoadingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/agents/dashboard');
      if (response.data.success) {
        const data = response.data.data;
        setAgent(data.agent);
        if (data.stats) setStats(data.stats);
        if (data.recentSurveys) setRecentSurveys(data.recentSurveys);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Réconciliation / Retest de vérification en direct d'un clic
  const handleReverify = async (surveyId) => {
    setReverifyLoadingId(surveyId);
    try {
      const res = await api.post(`/agents/survey/${surveyId}/reverify`);
      if (res.data.success) {
        if (res.data.data.verified) {
          toast.success(res.data.message || 'Compte confirmé et prime créditée !');
        } else {
          toast.info(res.data.message || 'Le compte n\'est toujours pas créé en base.');
        }
        fetchDashboardData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la vérification.';
      toast.error(msg);
    } finally {
      setReverifyLoadingId(null);
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
        <div className="w-10 h-10 border-4 border-yely-charcoal border-t-yely-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yely-richBlack pb-24 text-yely-white">
      {/* Header collant */}
      <header className="bg-yely-charcoal/90 border-b border-yely-white/5 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black uppercase tracking-tight text-white">Yély Agent</span>
              <span className="text-[10px] bg-yely-gold/15 text-yely-gold font-bold px-2 py-0.5 rounded-full uppercase">
                Terrain
              </span>
            </div>
            <p className="text-xs text-yely-softGray font-bold">{agent?.name} ({agent?.agentId})</p>
          </div>
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            className="p-2.5 bg-yely-danger/10 text-yely-danger rounded-xl hover:bg-yely-danger/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* CARTE SOLDE & COMMISSIONS */}
        <section className="bg-gradient-to-br from-yely-charcoal via-yely-charcoal to-yely-black rounded-3xl p-6 border border-yely-gold/25 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 text-yely-gold/5 pointer-events-none">
            <Wallet className="w-48 h-48" />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-yely-softGray text-xs font-bold uppercase tracking-wider">
              Portefeuille Commissions Validées
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-yely-gold tracking-tight">
                {agent?.totalEarned?.toLocaleString('fr-FR') || 0}
              </span>
              <span className="text-yely-goldLight font-bold text-lg uppercase">FCFA</span>
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-yely-success/15 text-yely-success px-3 py-1 rounded-full text-xs font-bold uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {stats.verifiedCount} Validés
              </span>
              <span className="inline-flex items-center gap-1.5 bg-yely-warning/15 text-yely-warning px-3 py-1 rounded-full text-xs font-bold uppercase">
                <Clock className="w-3.5 h-3.5" />
                {stats.pendingCount} En Attente
              </span>
            </div>
          </div>
        </section>

        {/* BOUTON D'ACTION PRINCIPAL : NOUVEAU RECENSEMENT */}
        <button
          onClick={() => navigate('/survey')}
          className="w-full bg-gradient-to-r from-yely-gold to-yely-goldLight hover:from-yely-goldLight hover:to-yely-gold text-yely-black font-black p-5 rounded-2xl flex items-center justify-between transition-all shadow-[0_10px_30px_rgba(212,175,55,0.25)] active:scale-98 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black text-yely-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-base font-black uppercase tracking-tight">
                Lancer un Recensement
              </p>
              <p className="text-xs text-black/80 font-bold">
                Interroger : Chauffeur, Commerçant ou Client
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 stroke-[3] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* RÉPARTITION PAR CIBLE (3 BLOCS DE STATISTIQUES) */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-yely-charcoal rounded-2xl p-4 border border-yely-white/5 space-y-1 text-center">
            <div className="w-8 h-8 rounded-lg bg-yely-gold/15 text-yely-gold flex items-center justify-center mx-auto mb-2">
              <Car className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-white">{stats.driverCount}</p>
            <p className="text-[10px] text-yely-softGray font-bold uppercase">Chauffeurs</p>
          </div>

          <div className="bg-yely-charcoal rounded-2xl p-4 border border-yely-white/5 space-y-1 text-center">
            <div className="w-8 h-8 rounded-lg bg-yely-gold/15 text-yely-gold flex items-center justify-center mx-auto mb-2">
              <Store className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-white">{stats.sellerCount}</p>
            <p className="text-[10px] text-yely-softGray font-bold uppercase">Commerçants</p>
          </div>

          <div className="bg-yely-charcoal rounded-2xl p-4 border border-yely-white/5 space-y-1 text-center">
            <div className="w-8 h-8 rounded-lg bg-yely-white/10 text-yely-white flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-white">{stats.riderCount}</p>
            <p className="text-[10px] text-yely-softGray font-bold uppercase">Passagers</p>
          </div>
        </div>

        {/* ACCÈS AU CLASSEMENT */}
        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full bg-yely-charcoal hover:bg-yely-charcoal/80 border border-yely-gold/20 rounded-2xl p-4 flex items-center justify-between transition-colors shadow-lg group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-yely-gold/15 p-2 rounded-xl text-yely-gold">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-yely-white font-black uppercase text-xs tracking-wider group-hover:text-yely-gold transition-colors">
              Classement Général des Agents
            </span>
          </div>
          <ChevronRight className="text-yely-gold w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* HISTORIQUE DES RECENSEMENTS RÉCENTS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-yely-softGray flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-yely-gold" />
              Recensements Récents ({recentSurveys.length})
            </h3>
          </div>

          {recentSurveys.length === 0 ? (
            <div className="bg-yely-charcoal/50 rounded-2xl p-8 text-center border border-yely-white/5 space-y-2">
              <p className="text-sm font-bold text-yely-white uppercase">Aucune fiche enregistrée</p>
              <p className="text-xs text-yely-muted">
                Démarrez votre première enquête terrain en cliquant sur le bouton doré ci-dessus.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSurveys.map((survey) => {
                const isVerified = survey.accountVerification?.verificationStatus === 'VERIFIED';
                const isPending = survey.accountVerification?.verificationStatus === 'PENDING' || survey.accountVerification?.verificationStatus === 'NO_ACCOUNT';

                const targetLabel =
                  survey.targetType === 'driver'
                    ? 'Chauffeur'
                    : survey.targetType === 'seller'
                    ? 'Commerçant'
                    : 'Passager';

                const displayName =
                  survey.registry?.fullName ||
                  survey.registry?.shopName ||
                  survey.accountVerification?.declaredPhone ||
                  'Contact Terrain';

                const displayPhone =
                  survey.accountVerification?.declaredPhone ||
                  survey.registry?.phone ||
                  'N/A';

                return (
                  <div
                    key={survey._id}
                    className="bg-yely-charcoal rounded-2xl p-4 border border-yely-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{displayName}</span>
                        <span className="text-[10px] bg-yely-white/5 text-yely-softGray px-2 py-0.5 rounded font-bold uppercase">
                          {targetLabel}
                        </span>
                      </div>
                      <p className="text-xs text-yely-softGray font-mono">{displayPhone}</p>
                      <p className="text-[10px] text-yely-muted">
                        {new Date(survey.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-yely-white/5">
                      <div className="text-left md:text-right">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-yely-success font-black text-sm uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            +{survey.commission?.amount || 0} F
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-yely-warning font-black text-xs uppercase">
                            <Clock className="w-3.5 h-3.5" />
                            En Attente
                          </span>
                        )}
                      </div>

                      {/* Bouton de réconciliation à la demande si en attente */}
                      {isPending && (
                        <button
                          onClick={() => handleReverify(survey._id)}
                          disabled={reverifyLoadingId === survey._id}
                          className="px-3 py-1.5 bg-yely-warning/15 hover:bg-yely-warning/25 text-yely-warning rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${reverifyLoadingId === survey._id ? 'animate-spin' : ''}`} />
                          <span>Revérifier</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
