// src/components/survey/SurveyResultModal.jsx
// MODAL DE RÉSULTAT DU RECENSEMENT — Feedback immédiat sur la vérification
// Senior UI/UX : Visuel haut de gamme, explications claires, zéro icône étoile.

import { CheckCircle2, Clock, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SurveyResultModal({
  isOpen,
  resultData,
  onNewSurvey,
  onGoToDashboard
}) {
  if (!isOpen || !resultData) return null;

  const { verificationStatus, commissionAmount, rejectionReason } = resultData;
  const isVerified = verificationStatus === 'VERIFIED';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-yely-charcoal border border-yely-white/10 rounded-3xl p-6 md:p-8 space-y-6 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Halo lumineux de fond */}
          <div
            className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
              isVerified ? 'bg-yely-success' : 'bg-yely-warning'
            }`}
          />

          {/* Icône de statut */}
          <div className="flex justify-center">
            {isVerified ? (
              <div className="w-20 h-20 rounded-full bg-yely-success/15 border-2 border-yely-success flex items-center justify-center text-yely-success shadow-[0_0_30px_rgba(39,174,96,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-yely-warning/15 border-2 border-yely-warning flex items-center justify-center text-yely-warning shadow-[0_0_30px_rgba(243,156,18,0.3)]">
                <Clock className="w-10 h-10" />
              </div>
            )}
          </div>

          {/* Textes de verdict */}
          <div className="space-y-2">
            <span
              className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                isVerified
                  ? 'bg-yely-success/20 text-yely-success'
                  : 'bg-yely-warning/20 text-yely-warning'
              }`}
            >
              {isVerified ? 'Compte Vérifié en Base' : 'Fiche Enregistrée • En Attente'}
            </span>

            <h3 className="text-2xl font-black text-yely-white uppercase tracking-tight">
              {isVerified ? 'Prime Validée !' : 'En Attente de Compte'}
            </h3>

            {isVerified ? (
              <div className="pt-2">
                <span className="text-4xl font-black text-yely-gold tracking-tight">
                  +{commissionAmount}
                </span>
                <span className="text-yely-goldLight font-bold text-sm ml-1.5 uppercase">FCFA</span>
                <p className="text-xs text-yely-softGray mt-2 font-medium">
                  Le compte a été identifié avec succès dans la base Yély. La prime est créditée immédiatement sur votre solde.
                </p>
              </div>
            ) : (
              <p className="text-xs text-yely-softGray mt-2 font-medium leading-relaxed">
                {rejectionReason ||
                  "La fiche a été archivée avec succès. Cependant, aucun compte correspondant n'a été détecté pour le moment dans la base Yély. Dès que le contact finalisera son compte, votre prime sera débloquée."}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={onNewSurvey}
              className="w-full bg-yely-gold hover:bg-yely-goldLight text-yely-black font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider text-xs transition-transform active:scale-98 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Faire un nouveau recensement
            </button>

            <button
              onClick={onGoToDashboard}
              className="w-full bg-yely-richBlack hover:bg-black text-yely-white font-bold py-3.5 rounded-xl border border-yely-white/10 flex items-center justify-center gap-2 uppercase tracking-wider text-xs transition-colors"
            >
              <span>Accéder au Tableau de Bord</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

