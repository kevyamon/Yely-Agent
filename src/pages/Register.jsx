// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, CheckCircle, ArrowLeft, Copy, UserCheck } from 'lucide-react';
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
      setError('Le numero de telephone doit comporter exactement 10 chiffres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Correction : Endpoint /agents/register
      const response = await api.post('/agents/register', formData);
      if (response.data.success) {
        const newAgentId = response.data.data.agentId;
        setSuccessData(newAgentId);
        localStorage.setItem('savedAgentId', newAgentId);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
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
        <div className="w-full max-w-md bg-yely-charcoal rounded-3xl shadow-2xl p-8 border border-yely-gold/30 text-center">
          <CheckCircle className="h-16 w-16 text-yely-success mx-auto mb-4" />
          <h2 className="text-2xl font-black text-yely-offWhite mb-2 uppercase tracking-tighter">Bienvenue dans l'Elite</h2>
          <p className="text-yely-softGray mb-6 text-xs uppercase font-bold tracking-tighter">
            Votre identifiant a ete genere et sauvegarde localement.
          </p>
          
          <div className="bg-yely-black py-4 px-6 rounded-xl border border-yely-gold border-dashed mb-4 flex items-center justify-between">
            <span className="text-3xl font-black text-yely-gold tracking-[0.2em]">{successData}</span>
            <button 
              onClick={handleCopy}
              className="p-2 bg-yely-charcoal hover:bg-yely-richBlack rounded-lg transition-colors border border-yely-white/10 text-yely-gold"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copied && <p className="text-yely-success text-[10px] mb-4 font-black uppercase">Copie reussie !</p>}

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-yely-gold hover:bg-yely-goldLight text-yely-black font-black py-4 rounded-xl transition-all text-lg uppercase shadow-xl"
          >
            Se Connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-yely-richBlack">
      <header className="px-4 py-4 flex items-center border-b border-yely-charcoal">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-yely-charcoal text-yely-softGray">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-yely-white font-bold ml-2 text-sm uppercase tracking-widest">Retour</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-yely-charcoal rounded-3xl shadow-2xl p-8 border border-yely-black">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-yely-gold tracking-widest uppercase italic">Rejoindre Yely</h1>
            <p className="text-yely-softGray mt-2 text-xs uppercase tracking-tighter font-bold">Devenez Ambassadeur de terrain</p>
          </div>

          {error && (
            <div className="bg-yely-danger/20 border border-yely-danger text-yely-offWhite px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-yely-softGray text-xs font-bold uppercase mb-2 ml-1">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yely-gold" />
                <input
                  type="text"
                  placeholder="NOM ET PRENOMS"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-yely-black border border-yely-charcoal rounded-xl text-yely-white font-bold uppercase outline-none focus:border-yely-gold transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-yely-softGray text-xs font-bold uppercase mb-2 ml-1">Telephone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yely-gold" />
                <input
                  type="tel"
                  placeholder="0700000000"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-yely-black border border-yely-charcoal rounded-xl text-yely-white tracking-[0.3em] font-bold outline-none focus:border-yely-gold transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || formData.phone.length !== 10}
              className="w-full bg-yely-gold hover:bg-yely-goldLight text-yely-black font-black py-4 rounded-xl transition-all disabled:opacity-30 text-lg uppercase shadow-lg flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              {loading ? 'Creation...' : 'Creer mon compte'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-yely-softGray text-xs uppercase font-bold">
              Deja un compte ? <Link to="/login" className="text-yely-gold hover:underline">Se connecter</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}