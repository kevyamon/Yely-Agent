// src/pages/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      // On sauvegarde le mot de passe maitre temporairement pour cette session
      sessionStorage.setItem('adminPassword', password.trim());
      navigate('/admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-yely-richBlack">
      <header className="px-4 py-4 flex items-center border-b border-yely-charcoal">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-yely-charcoal transition-colors text-yely-softGray">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-yely-white font-bold ml-2">Retour</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-yely-charcoal rounded-3xl shadow-2xl p-6 sm:p-8 border border-yely-danger/30 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yely-danger via-yely-gold to-yely-danger"></div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yely-danger/10 mb-4">
              <Shield className="w-8 h-8 text-yely-danger" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-yely-white tracking-wider">ACCÈS CEO</h1>
            <p className="text-yely-softGray mt-2 text-sm">Espace d'administration securise</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-yely-danger" />
              </div>
              <input
                type="password"
                placeholder="Mot de passe Maître"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-yely-black border border-yely-white/10 rounded-xl text-yely-white placeholder-yely-softGray/50 focus:outline-none focus:border-yely-danger focus:ring-1 focus:ring-yely-danger transition-colors text-lg tracking-widest font-bold text-center"
              />
            </div>
            
            <button
              type="submit"
              disabled={!password}
              className="w-full bg-yely-danger hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 text-base shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              Debloquer le Backoffice
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}