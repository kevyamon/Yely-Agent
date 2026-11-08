// src/components/survey/TargetSelector.jsx
// ÉCRAN SÉLECTEUR D'ENTITÉ — "Qui êtes-vous ?"
// Senior UI/UX : Ergonomie terrain, zéro couleur inline, zéro icône étoile.

import { Car, Store, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { TARGET_TYPES } from '../../data/surveyQuestions';

export default function TargetSelector({ onSelectTarget }) {
  const targets = [
    {
      ...TARGET_TYPES.driver,
      icon: Car,
      colorClass: 'border-yely-gold/40 hover:border-yely-gold bg-yely-charcoal/80',
      badgeClass: 'bg-yely-gold/15 text-yely-gold',
    },
    {
      ...TARGET_TYPES.seller,
      icon: Store,
      colorClass: 'border-yely-gold/40 hover:border-yely-gold bg-yely-charcoal/80',
      badgeClass: 'bg-yely-gold/15 text-yely-gold',
    },
    {
      ...TARGET_TYPES.rider,
      icon: Users,
      colorClass: 'border-yely-white/10 hover:border-yely-gold/50 bg-yely-charcoal/80',
      badgeClass: 'bg-yely-white/10 text-yely-white',
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yely-gold/10 text-yely-gold text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Enquête & Enrôlement Terrain
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-yely-white tracking-tight uppercase">
          Qui êtes-vous ?
        </h2>
        <p className="text-yely-softGray text-sm font-medium leading-relaxed max-w-md mx-auto">
          Posez cette question à votre interlocuteur afin d'adapter immédiatement l'argumentaire et le questionnaire.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-2">
        {targets.map((target, idx) => {
          const Icon = target.icon;
          return (
            <motion.button
              key={target.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTarget(target.id)}
              className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all shadow-lg group ${target.colorClass}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-yely-richBlack/80 border border-yely-white/5 flex items-center justify-center text-yely-gold group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-yely-white uppercase tracking-tight group-hover:text-yely-gold transition-colors">
                      {target.label}
                    </span>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase ${target.badgeClass}`}>
                      +{target.reward} FCFA
                    </span>
                  </div>
                  <p className="text-xs text-yely-softGray font-medium">
                    {target.subtitle}
                  </p>
                  <p className="text-[10px] text-yely-muted italic line-clamp-1">
                    Posture : {target.posture}
                  </p>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-yely-richBlack flex items-center justify-center text-yely-gold group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

