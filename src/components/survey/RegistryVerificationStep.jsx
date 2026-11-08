// src/components/survey/RegistryVerificationStep.jsx
// ÉTAPE REGISTRE OFFICIEL & CONFIRMATION COMPTE YÉLY (ANTI-FRAUDE)
// Senior UI/UX : Formulaire contextualisé selon le profil + contrôle d'intégrité.

import { useState } from 'react';
import { ArrowLeft, Send, ShieldCheck, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import PhoneInput from '../PhoneInput';

export default function RegistryVerificationStep({
  targetConfig,
  registryData,
  accountData,
  onChangeRegistry,
  onChangeAccount,
  onSubmit,
  onPrev,
  loading
}) {
  const targetId = targetConfig.id;

  // Téléphone indicatif local
  const [countryCode, setCountryCode] = useState('+225');
  const [localPhone, setLocalPhone] = useState(registryData.phone || '');

  // Gestion du téléphone pour le registre
  const handlePhoneChange = (newPhone) => {
    setLocalPhone(newPhone);
    const fullPhone = `${countryCode}${newPhone}`;
    onChangeRegistry('phone', fullPhone);
    // Si la vérification automatique de compte utilise le même numéro
    if (!accountData.declaredPhone) {
      onChangeAccount('declaredPhone', fullPhone);
    }
  };

  const handleCountryCodeChange = (newCode) => {
    setCountryCode(newCode);
    const fullPhone = `${newCode}${localPhone}`;
    onChangeRegistry('phone', fullPhone);
    if (!accountData.declaredPhone) {
      onChangeAccount('declaredPhone', fullPhone);
    }
  };

  // Validation minimale selon la cible
  const isFormValid = () => {
    if (localPhone.length < 8) return false;
    if (targetId === 'driver' && !registryData.fullName?.trim()) return false;
    if (targetId === 'seller' && (!registryData.shopName?.trim() || !registryData.managerName?.trim())) return false;
    if (targetId === 'rider' && (!registryData.fullName?.trim() || !registryData.neighborhood?.trim())) return false;
    return true;
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Retour aux questions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-yely-softGray hover:text-yely-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au questionnaire
        </button>
        <span className="text-xs font-black text-yely-gold uppercase tracking-widest">
          {targetConfig.category}
        </span>
      </div>

      <div className="bg-yely-charcoal/90 rounded-3xl p-6 border border-yely-white/5 space-y-6 shadow-xl">
        <div className="border-b border-yely-white/10 pb-4">
          <h3 className="text-xl font-black text-yely-white uppercase tracking-tight">
            Registre {targetConfig.label}
          </h3>
          <p className="text-xs text-yely-softGray mt-1">
            Renseignez les coordonnées officielles à consigner sur place.
          </p>
        </div>

        {/* 1. CHAMPS SPÉCIFIQUES : CHAUFFEUR */}
        {targetId === 'driver' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                Nom / Surnom du Chauffeur *
              </label>
              <input
                type="text"
                value={registryData.fullName || ''}
                onChange={(e) => onChangeRegistry('fullName', e.target.value)}
                placeholder="Ex : Vieux Père Kouamé"
                className="w-full p-3.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-sm text-yely-white focus:outline-none focus:border-yely-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                Véhicule & N° Plaque d'immatriculation
              </label>
              <input
                type="text"
                value={registryData.vehiclePlate || ''}
                onChange={(e) => onChangeRegistry('vehiclePlate', e.target.value)}
                placeholder="Ex : Taxi communal 3412-AB-01"
                className="w-full p-3.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-sm text-yely-white focus:outline-none focus:border-yely-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                N° d'appel / Wave *
              </label>
              <PhoneInput
                countryCode={countryCode}
                setCountryCode={handleCountryCodeChange}
                phone={localPhone}
                setPhone={handlePhoneChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                Pack 1 000 F Pionnier
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['OUI', 'A_RELANCER'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onChangeRegistry('packValidated', status)}
                    className={`p-3 rounded-xl text-xs font-black uppercase border transition-all ${
                      (registryData.packValidated || 'A_RELANCER') === status
                        ? 'border-yely-gold bg-yely-gold/15 text-yely-gold'
                        : 'border-yely-white/10 bg-yely-richBlack/60 text-yely-softGray'
                    }`}
                  >
                    {status === 'OUI' ? 'Validé sur place' : 'À relancer'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. CHAMPS SPÉCIFIQUES : COMMERÇANT */}
        {targetId === 'seller' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                Nom du Commerce / Boutique *
              </label>
              <input
                type="text"
                value={registryData.shopName || ''}
                onChange={(e) => onChangeRegistry('shopName', e.target.value)}
                placeholder="Ex : Épicerie Chez Tantie Chantal"
                className="w-full p-3.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-sm text-yely-white focus:outline-none focus:border-yely-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                  Activité / Secteur
                </label>
                <input
                  type="text"
                  value={registryData.businessSector || ''}
                  onChange={(e) => onChangeRegistry('businessSector', e.target.value)}
                  placeholder="Ex : Alimentation générale"
                  className="w-full p-3.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-sm text-yely-white focus:outline-none focus:border-yely-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                  Nom du Responsable *
                </label>
                <input
                  type="text"
                  value={registryData.managerName || ''}
                  onChange={(e) => onChangeRegistry('managerName', e.target.value)}
                  placeholder="Ex : M. Konan"
                  className="w-full p-3.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-sm text-yely-white focus:outline-none focus:border-yely-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                N° Téléphone Contact *
              </label>
              <PhoneInput
                countryCode={countryCode}
                setCountryCode={handleCountryCodeChange}
                phone={localPhone}
                setPhone={handlePhoneChange}
              />
            </div>

            {/* Rendez-vous shooting photo */}
            <div className="p-3.5 bg-yely-richBlack/60 rounded-xl border border-yely-white/10 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(registryData.photoAppointment?.scheduled)}
                  onChange={(e) =>
                    onChangeRegistry('photoAppointment', {
                      ...registryData.photoAppointment,
                      scheduled: e.target.checked
                    })
                  }
                  className="w-4 h-4 accent-yely-gold rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-yely-white uppercase">
                  Rendez-vous shooting photo calé (AirMax)
                </span>
              </label>
              {registryData.photoAppointment?.scheduled && (
                <input
                  type="text"
                  value={registryData.photoAppointment?.date || ''}
                  onChange={(e) =>
                    onChangeRegistry('photoAppointment', {
                      ...registryData.photoAppointment,
                      date: e.target.value
                    })
                  }
                  placeholder="Préciser le jour et l'heure (ex : Mardi 10h)"
                  className="w-full p-2.5 bg-yely-charcoal border border-yely-white/10 rounded-lg text-xs text-yely-white focus:outline-none focus:border-yely-gold"
                />
              )}
            </div>

            {/* 3 articles phares */}
            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                Les 3 articles phares pour la boutique
              </label>
              <input
                type="text"
                value={(registryData.topProducts || []).join(', ')}
                onChange={(e) =>
                  onChangeRegistry(
                    'topProducts',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
                placeholder="Ex : Riz 25kg, Huile Dinor, Packs d'eau"
                className="w-full p-3.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-sm text-yely-white focus:outline-none focus:border-yely-gold"
              />
            </div>
          </div>
        )}

        {/* 3. CHAMPS SPÉCIFIQUES : USAGER / PASSAGER */}
        {targetId === 'rider' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                Nom & Prénom *
              </label>
              <input
                type="text"
                value={registryData.fullName || ''}
                onChange={(e) => onChangeRegistry('fullName', e.target.value)}
                placeholder="Ex : Aminata Traoré"
                className="w-full p-3.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-sm text-yely-white focus:outline-none focus:border-yely-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                Quartier de résidence *
              </label>
              <input
                type="text"
                value={registryData.neighborhood || ''}
                onChange={(e) => onChangeRegistry('neighborhood', e.target.value)}
                placeholder="Ex : Quartier Résidentiel / Gare"
                className="w-full p-3.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-sm text-yely-white focus:outline-none focus:border-yely-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-yely-softGray uppercase mb-1.5">
                N° WhatsApp *
              </label>
              <PhoneInput
                countryCode={countryCode}
                setCountryCode={handleCountryCodeChange}
                phone={localPhone}
                setPhone={handlePhoneChange}
              />
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-yely-richBlack/60 rounded-xl border border-yely-white/10">
              <input
                type="checkbox"
                id="appInstalled"
                checked={Boolean(registryData.appInstalled)}
                onChange={(e) => onChangeRegistry('appInstalled', e.target.checked)}
                className="w-4 h-4 accent-yely-gold rounded cursor-pointer"
              />
              <label htmlFor="appInstalled" className="text-xs font-bold text-yely-white uppercase cursor-pointer">
                Application Yély installée sur place
              </label>
            </div>
          </div>
        )}

        {/* 4. BLOC DE CONFIRMATION DE CRÉATION DE COMPTE YÉLY (ANTI-FRAUDE) */}
        <div className="pt-4 border-t border-yely-white/10 space-y-4">
          <div className="p-4 rounded-2xl bg-yely-gold/10 border border-yely-gold/30 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-yely-gold/20 text-yely-gold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-yely-gold uppercase tracking-wider">
                  Contrôle & Validation de Compte Yély
                </h4>
                <p className="text-[11px] text-yely-softGray font-medium leading-relaxed">
                  Pour valider votre prime, confirmez les identifiants utilisés pour inscrire le contact sur Yély. La base de données vérifiera instantanément l'existence effective du compte.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(accountData.isAccountCreated)}
                onChange={(e) => onChangeAccount('isAccountCreated', e.target.checked)}
                className="w-4 h-4 accent-yely-gold rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-yely-white uppercase">
                J'ai créé le compte de ce contact sur l'application Yély
              </span>
            </label>

            {accountData.isAccountCreated && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-yely-softGray uppercase mb-1">
                    Téléphone du compte Yély créé
                  </label>
                  <input
                    type="text"
                    value={accountData.declaredPhone || `${countryCode}${localPhone}`}
                    onChange={(e) => onChangeAccount('declaredPhone', e.target.value)}
                    placeholder="Numéro utilisé pour la création"
                    className="w-full p-2.5 bg-yely-richBlack border border-yely-gold/40 rounded-xl text-xs text-yely-white focus:outline-none focus:border-yely-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-yely-softGray uppercase mb-1">
                    Email du compte Yély créé (optionnel)
                  </label>
                  <input
                    type="email"
                    value={accountData.declaredEmail || ''}
                    onChange={(e) => onChangeAccount('declaredEmail', e.target.value)}
                    placeholder="email@exemple.com"
                    className="w-full p-2.5 bg-yely-richBlack border border-yely-white/10 rounded-xl text-xs text-yely-white focus:outline-none focus:border-yely-gold"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bouton de soumission finale */}
      <button
        onClick={onSubmit}
        disabled={loading || !isFormValid()}
        className="w-full bg-yely-gold hover:bg-yely-goldLight text-yely-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider disabled:opacity-40 text-sm shadow-xl active:scale-98"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Vérification en base de données...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Send className="w-4 h-4" />
            Enregistrer & Valider le Recensement
          </span>
        )}
      </button>
    </div>
  );
}

