// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, CheckCircle, ArrowLeft, Copy } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handlePhoneChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: onlyNumbers });
  };

  const handleNameChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setError('Le numéro de téléphone doit comporter exactement 10 chiffres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/register', formData);
      if (response.data.success) {
        const newAgentId = response.data.data.agentId;
        setSuccessData(newAgentId);
        localStorage.setItem('savedAgentId', newAgentId);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(successData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (successData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yely-richBlack px-4 sm:px-6">
        <div className="w-full max-w-md bg-yely-charcoal rounded-3xl shadow-2xl p-6 sm:p-8 border border-yely-gold/30 text-center animate-fade-in">
          <CheckCircle className="h-16 w-16 text-yely-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-yely-offWhite mb-2">Inscription Réussie !</h2>
          <p className="text-yely-softGray mb-6 text-sm">
            Voici votre identifiant. Il a été sauvegardé sur cet appareil pour vos futures connexions.
          </p>
          
          <div className="bg-yely-black py-4 px-6 rounded-xl border border-yely-gold border-dashed mb-4 flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-yely-gold tracking-widest">{successData}</span>
            <button 
              onClick={handleCopy}
              className="p-2 bg-yely-charcoal hover:bg-yely-richBlack rounded-lg transition-colors border border-yely-white/10"
              title="Copier l'identifiant"
            >
              <Copy className={`w-5 h-5 ${copied ? 'text-yely-success' : 'text-yely-gold'}`} />
            </button>
          </div>
          {copied && <p className="text-yely-success text-xs mb-4 font-medium">Copié dans le presse-papier !</p>}

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-yely-gold hover:bg-yely-goldLight text-yely-black font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-yely-richBlack">
      <header className="px-4 py-4 flex items-center border-b border-yely-charcoal">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-yely-charcoal transition-colors text-yely-softGray">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-yely-white font-bold ml-2">Retour</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-yely-charcoal rounded-3xl shadow-2xl p-6 sm:p-8 border border-yely-black">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-yely-gold tracking-wider">REJOINDRE YÉLY</h1>
            <p className="text-yely-softGray mt-2 text-sm">Devenez Ambassadeur Terrain</p>
          </div>

          {error && (
            <div className="bg-yely-danger/20 border border-yely-danger text-yely-offWhite px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-yely-softGray text-sm font-medium mb-2">Nom Complet</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-yely-gold" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Jean Kouassi"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-yely-black border border-yely-charcoal rounded-xl text-yely-white placeholder-yely-softGray/50 focus:outline-none focus:border-yely-gold focus:ring-1 focus:ring-yely-gold transition-colors text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-yely-softGray text-sm font-medium mb-2">Numéro de Téléphone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-yely-gold" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Ex: 0708091011"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-yely-black border border-yely-charcoal rounded-xl text-yely-white placeholder-yely-softGray/50 focus:outline-none focus:border-yely-gold focus:ring-1 focus:ring-yely-gold transition-colors text-base tracking-widest"
                />
              </div>
              <p className="text-xs text-yely-softGray/50 mt-2 text-right">{formData.phone.length}/10 chiffres</p>
            </div>

            <button
              type="submit"
              disabled={loading || formData.phone.length !== 10}
              className="w-full bg-yely-gold hover:bg-yely-goldLight text-yely-black font-bold py-4 rounded-xl transition-colors disabled:opacity-50 text-lg mt-4"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          {/* LE NOUVEAU LIEN EST ICI */}
          <div className="mt-8 text-center">
            <p className="text-yely-softGray text-sm">
              Déjà un compte ? <Link to="/login" className="text-yely-gold hover:underline font-medium">Se connecter</Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}