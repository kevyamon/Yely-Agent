// src/pages/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Crown } from 'lucide-react';
import api from '../services/api';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Appel à ton backend qui utilise getLeaderboard dans agentController.js
      const response = await api.get('/leaderboard');
      if (response.data.success) {
        setLeaders(response.data.data.leaderboard);
      }
    } catch (error) {
      console.error("Erreur de chargement du classement", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Crown className="w-6 h-6 text-yely-gold" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300" />;
      case 2: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-yely-softGray font-bold w-6 text-center">{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yely-richBlack">
        <div className="w-10 h-10 border-4 border-yely-charcoal border-t-yely-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yely-richBlack pb-20">
      <header className="bg-yely-charcoal border-b border-yely-white/5 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 -ml-2 rounded-full hover:bg-yely-richBlack transition-colors text-yely-softGray"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="ml-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yely-gold" />
            <h1 className="text-xl font-bold text-yely-white">Top Ambassadeurs</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-yely-gold tracking-widest uppercase">Classement Elite</h2>
          <p className="text-yely-softGray text-sm mt-2">Les meilleurs recruteurs de Yély</p>
        </div>

        <div className="space-y-4">
          {leaders.length === 0 ? (
            <div className="bg-yely-charcoal/50 rounded-2xl p-8 text-center border border-yely-white/5">
              <p className="text-yely-softGray">Le classement est en cours de calcul...</p>
            </div>
          ) : (
            leaders.map((agent, index) => (
              <div 
                key={agent.agentId} 
                className={`flex items-center justify-between p-5 rounded-2xl border ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yely-charcoal to-yely-black border-yely-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.15)] transform scale-[1.02]' 
                    : 'bg-yely-charcoal border-yely-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yely-gold/10' : 'bg-yely-richBlack'}`}>
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <p className={`font-bold ${index === 0 ? 'text-yely-gold text-lg' : 'text-yely-white'}`}>
                      {agent.name}
                    </p>
                    <p className="text-yely-softGray text-xs">{agent.agentId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black tracking-tight ${index === 0 ? 'text-2xl text-yely-gold' : 'text-xl text-yely-success'}`}>
                    {agent.totalEarned?.toLocaleString('fr-FR')} <span className="text-sm font-bold">F</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}