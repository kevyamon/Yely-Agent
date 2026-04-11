// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ agentId: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedId = localStorage.getItem('savedAgentId');
    if (savedId) {
      setFormData((prev) => ({ ...prev, agentId: savedId }));
    }
  }, []);

  const handlePhoneChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: onlyNumbers });
  };

  const handleIdChange = (e) => {
    setFormData({ ...formData, agentId: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setError('Le numero doit comporter exactement 10 chiffres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanData = {
        agentId: formData.agentId.trim(),
        phone: formData.phone
      };

      const response = await api.post('/agents/login', cleanData);
      
      if (response.data.success) {
        localStorage.setItem('agentToken', response.data.data.accessToken);
        localStorage.setItem('agentInfo', JSON.stringify(response.data.data.agent));
        localStorage.setItem('savedAgentId', cleanData.agentId);
        
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Identifiants incorrects.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-black text-yely-gold tracking-widest uppercase italic">Yely Agent</h1>
            <p className="text-yely-softGray mt-2 text-xs uppercase tracking-tighter">Acces Partenaire Securise</p>
          </div>

          {error && (
            <div className="bg-yely-danger/20 border border-yely-danger text-yely-offWhite px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-yely-softGray text-xs font-bold uppercase mb-2 ml-1">ID Ambassadeur</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yely-gold" />
                <input
                  type="text"
                  placeholder="YELY-XXXX"
                  value={formData.agentId}
                  onChange={handleIdChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-yely-black border border-yely-charcoal rounded-xl text-yely-white outline-none focus:border-yely-gold uppercase transition-all font-bold"
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
                  className="w-full pl-12 pr-4 py-4 bg-yely-black border border-yely-charcoal rounded-xl text-yely-white outline-none focus:border-yely-gold tracking-[0.3em] transition-all font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || formData.phone.length !== 10 || !formData.agentId}
              className="w-full bg-yely-gold hover:bg-yely-goldLight text-yely-black font-black py-4 rounded-xl transition-all disabled:opacity-30 text-lg uppercase shadow-lg shadow-yely-gold/10 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              {loading ? 'Verification...' : 'Ouvrir ma Session'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-yely-softGray text-xs">
              Pas encore de compte ? <Link to="/register" className="text-yely-gold hover:underline font-bold uppercase">Rejoindre l'equipe</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}