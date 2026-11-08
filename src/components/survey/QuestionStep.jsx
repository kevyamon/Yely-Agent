// src/components/survey/QuestionStep.jsx
// ÉTAPE DE QUESTIONNAIRE — Rendu dynamique des 5 questions du Guide Maféré
// Senior UI/UX : Aides à la vente en direct, sélection instantanée.

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Lightbulb, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuestionStep({
  targetConfig,
  currentQuestionIndex,
  currentAnswer,
  onSaveAnswer,
  onNext,
  onPrev,
  onCancel
}) {
  const question = targetConfig.questions[currentQuestionIndex];
  const totalQuestions = targetConfig.questions.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const [selectedOption, setSelectedOption] = useState(currentAnswer || '');
  const [customText, setCustomText] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleSelect = (optionText) => {
    setSelectedOption(optionText);
    setIsCustom(false);
    onSaveAnswer(question.id, optionText);
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomText(val);
    setSelectedOption(val);
    onSaveAnswer(question.id, val);
  };

  const canProceed = Boolean(selectedOption.trim());

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Barre de navigation haute & progression */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={currentQuestionIndex === 0 ? onCancel : onPrev}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-yely-softGray hover:text-yely-white uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentQuestionIndex === 0 ? 'Changer de profil' : 'Question précédente'}
          </button>
          <span className="text-xs font-black text-yely-gold uppercase tracking-widest">
            {targetConfig.label} • {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Jauge de progression */}
        <div className="w-full h-1.5 bg-yely-charcoal rounded-full overflow-hidden border border-yely-white/5">
          <div
            className="h-full bg-gradient-to-r from-yely-gold to-yely-goldLight transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Intitulé de la question */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-yely-charcoal/90 rounded-3xl p-6 border border-yely-white/5 space-y-6 shadow-xl"
      >
        <div className="space-y-2">
          <p className="text-xs uppercase font-black text-yely-gold tracking-widest">
            Question n°{currentQuestionIndex + 1}
          </p>
          <h3 className="text-lg md:text-xl font-bold text-yely-white leading-snug">
            {question.title}
          </h3>
        </div>

        {/* Choix des réponses pré-formatées du Guide */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                  isSelected
                    ? 'border-yely-gold bg-yely-gold/10 text-yely-white'
                    : 'border-yely-white/5 bg-yely-richBlack/60 text-yely-softGray hover:border-yely-white/20'
                }`}
              >
                <span className="text-sm font-medium leading-relaxed">
                  {option}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'border-yely-gold bg-yely-gold text-black'
                      : 'border-yely-white/20'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </button>
            );
          })}

          {/* Option réponse libre */}
          <div>
            {!isCustom ? (
              <button
                type="button"
                onClick={() => {
                  setIsCustom(true);
                  setSelectedOption('');
                }}
                className="text-xs text-yely-gold font-bold uppercase tracking-wider hover:underline pt-1 inline-block"
              >
                + Réponse personnalisée ou autre
              </button>
            ) : (
              <textarea
                value={customText}
                onChange={handleCustomChange}
                placeholder="Notez la réponse exacte de l'interlocuteur..."
                rows={2}
                className="w-full mt-2 p-3.5 bg-yely-richBlack border border-yely-gold/40 rounded-xl text-sm text-yely-white focus:outline-none focus:border-yely-gold"
              />
            )}
          </div>
        </div>

        {/* Encadré d'or : Conduite à tenir & Action terrain de l'agent */}
        <div className="bg-gradient-to-r from-yely-gold/10 to-transparent border-l-4 border-yely-gold rounded-r-2xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-yely-gold text-xs font-black uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            Conduite à tenir & Action terrain
          </div>
          <p className="text-xs text-yely-white/90 font-medium leading-relaxed">
            {question.actionAdvice}
          </p>
        </div>
      </motion.div>

      {/* Bouton Suivant */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full bg-yely-gold hover:bg-yely-goldLight text-yely-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider disabled:opacity-40 text-sm shadow-lg active:scale-98"
      >
        <span>{currentQuestionIndex === totalQuestions - 1 ? 'Accéder au Registre terrain' : 'Question suivante'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

