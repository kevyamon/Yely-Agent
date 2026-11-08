// src/pages/SurveyFlow.jsx
// ORCHESTRATEUR DE FLUX D'ENQUÊTE & ENRÔLEMENT — Expédition Terrain
// Senior UI/UX : Navigation fluide, étapes séquentielles, contrôle anti-fraude.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { TARGET_TYPES } from '../data/surveyQuestions';
import TargetSelector from '../components/survey/TargetSelector';
import QuestionStep from '../components/survey/QuestionStep';
import RegistryVerificationStep from '../components/survey/RegistryVerificationStep';
import SurveyResultModal from '../components/survey/SurveyResultModal';

export default function SurveyFlow() {
  const navigate = useNavigate();

  // Étape courante : 'TARGET' -> 'QUESTIONS' -> 'REGISTRY'
  const [currentStep, setCurrentStep] = useState('TARGET');
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Réponses aux 5 questions
  const [answers, setAnswers] = useState({});

  // Données de Registre
  const [registryData, setRegistryData] = useState({
    fullName: '',
    neighborhood: '',
    phone: '',
    appInstalled: false,
    vehiclePlate: '',
    packValidated: 'A_RELANCER',
    shopName: '',
    businessSector: '',
    managerName: '',
    photoAppointment: { scheduled: false, date: '' },
    topProducts: []
  });

  // Données de Confirmation Compte Yély (Anti-Fraude)
  const [accountData, setAccountData] = useState({
    declaredPhone: '',
    declaredEmail: '',
    isAccountCreated: true
  });

  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const activeTargetConfig = selectedTargetId ? TARGET_TYPES[selectedTargetId] : null;

  // Choix initial de la cible
  const handleSelectTarget = (targetId) => {
    setSelectedTargetId(targetId);
    setAnswers({});
    setQuestionIndex(0);
    setCurrentStep('QUESTIONS');
  };

  // Enregistrement de la réponse courante
  const handleSaveAnswer = (questionId, answerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  // Passage à la question suivante ou au registre
  const handleNextQuestion = () => {
    if (!activeTargetConfig) return;
    if (questionIndex < activeTargetConfig.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentStep('REGISTRY');
    }
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
    } else {
      setCurrentStep('TARGET');
    }
  };

  // Modifications du Registre
  const handleRegistryChange = (key, value) => {
    setRegistryData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Modifications de la Vérification Compte
  const handleAccountChange = (key, value) => {
    setAccountData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Soumission finale vers l'API Yély
  const handleSubmitSurvey = async () => {
    setLoading(true);
    try {
      const payload = {
        targetType: selectedTargetId,
        answers,
        registry: registryData,
        accountVerification: accountData
      };

      const response = await api.post('/agents/survey', payload);

      if (response.data.success) {
        const data = response.data.data;
        setResultData({
          verificationStatus: data.verificationStatus,
          commissionAmount: data.commissionAmount,
          rejectionReason: data.rejectionReason
        });
        setIsResultOpen(true);

        if (data.verificationStatus === 'VERIFIED') {
          toast.success(`Succès ! Prime de +${data.commissionAmount} FCFA accordée.`);
        } else {
          toast.info('Recensement enregistré. Vérification en attente de création de compte.');
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de l'enregistrement.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation pour un nouveau recensement
  const handleReset = () => {
    setIsResultOpen(false);
    setResultData(null);
    setSelectedTargetId(null);
    setQuestionIndex(0);
    setAnswers({});
    setRegistryData({
      fullName: '',
      neighborhood: '',
      phone: '',
      appInstalled: false,
      vehiclePlate: '',
      packValidated: 'A_RELANCER',
      shopName: '',
      businessSector: '',
      managerName: '',
      photoAppointment: { scheduled: false, date: '' },
      topProducts: []
    });
    setAccountData({
      declaredPhone: '',
      declaredEmail: '',
      isAccountCreated: true
    });
    setCurrentStep('TARGET');
  };

  return (
    <div className="min-h-screen bg-yely-richBlack text-yely-white px-4 py-8 flex flex-col justify-center">
      {currentStep === 'TARGET' && (
        <TargetSelector onSelectTarget={handleSelectTarget} />
      )}

      {currentStep === 'QUESTIONS' && activeTargetConfig && (
        <QuestionStep
          targetConfig={activeTargetConfig}
          currentQuestionIndex={questionIndex}
          currentAnswer={answers[activeTargetConfig.questions[questionIndex].id]}
          onSaveAnswer={handleSaveAnswer}
          onNext={handleNextQuestion}
          onPrev={handlePrevQuestion}
          onCancel={() => setCurrentStep('TARGET')}
        />
      )}

      {currentStep === 'REGISTRY' && activeTargetConfig && (
        <RegistryVerificationStep
          targetConfig={activeTargetConfig}
          registryData={registryData}
          accountData={accountData}
          onChangeRegistry={handleRegistryChange}
          onChangeAccount={handleAccountChange}
          onSubmit={handleSubmitSurvey}
          onPrev={() => setCurrentStep('QUESTIONS')}
          loading={loading}
        />
      )}

      <SurveyResultModal
        isOpen={isResultOpen}
        resultData={resultData}
        onNewSurvey={handleReset}
        onGoToDashboard={() => navigate('/dashboard')}
      />
    </div>
  );
}

