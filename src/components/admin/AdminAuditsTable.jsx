// src/components/admin/AdminAuditsTable.jsx
// TABLEAU D'AUDIT ANTI-FRAUDE & ARBITRAGE CEO
// Senior UI/UX : Détection des anomalies, comparaison temps réel avec la base User.

import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  AlertTriangle,
  UserCheck,
  Check,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function AdminAuditsTable({ password }) {
  const [audits, setAudits] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [targetFilter, setTargetFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const params = {};
      if (targetFilter) params.targetType = targetFilter;
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/agents/darkyelydb42/audits', {
        headers: { 'x-admin-password': password },
        params
      });

      if (res.data.success) {
        setAudits(res.data.data.surveys || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (err) {
      toast.error('Erreur lors du chargement des audits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [targetFilter, statusFilter]);

  const handleDecision = async (surveyId, action) => {
    const confirmPrompt =
      action === 'APPROVE'
        ? 'Valider manuellement cette fiche et créditer la prime ?'
        : 'Rejeter cette fiche et annuler toute prime associée ?';

    if (!window.confirm(confirmPrompt)) return;

    setActionLoadingId(surveyId);
    try {
      const res = await api.post(
        `/agents/darkyelydb42/audit/${surveyId}`,
        { action, reason: action === 'APPROVE' ? 'Validation manuelle par le CEO.' : 'Rejeté pour non-conformité.' },
        { headers: { 'x-admin-password': password } }
      );
      if (res.data.success) {
        toast.success(action === 'APPROVE' ? 'Fiche validée.' : 'Fiche rejetée.');
        fetchAudits();
      }
    } catch (err) {
      toast.error("Erreur lors de l'arbitrage.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barre de filtres et recherche */}
      <div className="bg-yely-charcoal p-4 rounded-2xl border border-yely-white/5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtre Cible */}
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
            className="p-2.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-xs text-yely-white font-bold uppercase focus:border-yely-gold outline-none"
          >
            <option value="">Toutes les entités</option>
            <option value="driver">Chauffeurs</option>
            <option value="seller">Commerçants</option>
            <option value="rider">Passagers</option>
          </select>

          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-xs text-yely-white font-bold uppercase focus:border-yely-gold outline-none"
          >
            <option value="">Tous les statuts</option>
            <option value="VERIFIED">Vérifiés (Validés)</option>
            <option value="PENDING">En Attente</option>
            <option value="REJECTED">Rejetés</option>
          </select>
        </div>

        {/* Recherche rapide */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchAudits();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher nom, n°..."
            className="p-2 bg-yely-richBlack border border-yely-white/10 rounded-xl text-xs text-yely-white focus:border-yely-gold outline-none w-44"
          />
          <button
            type="submit"
            className="p-2 bg-yely-gold text-black rounded-xl text-xs font-bold uppercase hover:bg-yely-goldLight"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Liste des audits */}
      <div className="bg-yely-charcoal rounded-3xl border border-yely-white/5 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-yely-white/5 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-yely-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-yely-danger" />
            Registre d'Audit Terrain ({total} fiches)
          </h3>
          <span className="text-[10px] text-yely-softGray font-bold uppercase">
            Surveillance Anti-Fraude
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-yely-softGray text-xs">
            Chargement des audits en cours...
          </div>
        ) : audits.length === 0 ? (
          <div className="p-12 text-center text-yely-softGray text-xs uppercase font-bold">
            Aucun recensement correspondant aux critères.
          </div>
        ) : (
          <div className="divide-y divide-yely-white/5">
            {audits.map((item) => {
              const status = item.accountVerification?.verificationStatus;
              const isVerified = status === 'VERIFIED';
              const isPending = status === 'PENDING' || status === 'NO_ACCOUNT';
              const isRejected = status === 'REJECTED';
              const flags = item.fraudDetection?.suspicionFlags || [];

              return (
                <div key={item._id} className="p-4 hover:bg-yely-richBlack/40 transition-colors space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    {/* Colonne Agent */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-yely-gold uppercase">
                          {item.agent?.name || 'Agent'}
                        </span>
                        <span className="text-[10px] font-mono bg-yely-white/5 text-yely-softGray px-1.5 py-0.5 rounded">
                          {item.agent?.agentId}
                        </span>
                      </div>
                      <p className="text-[11px] text-yely-white font-bold">
                        Cible : <span className="uppercase text-yely-goldLight">{item.targetType}</span>
                      </p>
                    </div>

                    {/* Données Déclarées */}
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white">
                        {item.registry?.fullName || item.registry?.shopName || 'Sans nom'}
                      </p>
                      <p className="text-xs font-mono text-yely-softGray">
                        {item.accountVerification?.declaredPhone || item.registry?.phone || 'N/A'}
                      </p>
                      {item.registry?.neighborhood && (
                        <p className="text-[10px] text-yely-muted">Quartier : {item.registry.neighborhood}</p>
                      )}
                      {item.registry?.vehiclePlate && (
                        <p className="text-[10px] text-yely-muted">Plaque : {item.registry.vehiclePlate}</p>
                      )}
                    </div>

                    {/* Statut Vérification Compte DB */}
                    <div className="text-right space-y-1">
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 bg-yely-success/15 text-yely-success px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Compte Confirmé (+{item.commission?.amount} F)
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 bg-yely-warning/15 text-yely-warning px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                          <Clock className="w-3.5 h-3.5" />
                          En Attente de Compte
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 bg-yely-danger/15 text-yely-danger px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejeté
                        </span>
                      )}
                      <p className="text-[10px] text-yely-muted">
                        {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Alertes d'anomalies / Triche */}
                  {flags.length > 0 && (
                    <div className="bg-yely-danger/10 border border-yely-danger/30 rounded-xl p-2.5 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yely-danger shrink-0" />
                      <div className="text-[11px] text-yely-danger font-bold flex flex-wrap gap-2">
                        {flags.map((f, i) => (
                          <span key={i} className="bg-yely-danger/20 px-2 py-0.5 rounded">
                            ⚠️ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Motif de rejet ou statut DB */}
                  {item.accountVerification?.rejectionReason && (
                    <p className="text-[11px] text-yely-softGray italic bg-yely-black/40 p-2 rounded-lg">
                      Diagnostic : {item.accountVerification.rejectionReason}
                    </p>
                  )}

                  {/* Actions d'arbitrage manuel */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-yely-white/5">
                    {!isVerified && (
                      <button
                        onClick={() => handleDecision(item._id, 'APPROVE')}
                        disabled={actionLoadingId === item._id}
                        className="px-3 py-1.5 bg-yely-success/15 hover:bg-yely-success/25 text-yely-success rounded-lg text-[10px] font-black uppercase flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Forcer Validation
                      </button>
                    )}
                    {!isRejected && (
                      <button
                        onClick={() => handleDecision(item._id, 'REJECT')}
                        disabled={actionLoadingId === item._id}
                        className="px-3 py-1.5 bg-yely-danger/15 hover:bg-yely-danger/25 text-yely-danger rounded-lg text-[10px] font-black uppercase flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Rejeter Prime
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

