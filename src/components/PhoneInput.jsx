// src/components/PhoneInput.jsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Phone } from 'lucide-react';

const COUNTRIES = [
  { id: 'CI', code: '+225', name: 'Cote d\'Ivoire' },
  { id: 'SN', code: '+221', name: 'Senegal' },
  { id: 'ML', code: '+223', name: 'Mali' },
  { id: 'BF', code: '+226', name: 'Burkina Faso' },
  { id: 'TG', code: '+228', name: 'Togo' },
  { id: 'BJ', code: '+229', name: 'Benin' },
  { id: 'GN', code: '+224', name: 'Guinee' },
  { id: 'CM', code: '+237', name: 'Cameroun' },
  { id: 'GH', code: '+233', name: 'Ghana' },
  { id: 'FR', code: '+33', name: 'France' }
];

export default function PhoneInput({ countryCode, setCountryCode, phone, setPhone }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  const handlePhoneChange = (e) => {
    // On n'accepte que les chiffres, plus de limite a 10
    const onlyNumbers = e.target.value.replace(/\D/g, '');
    setPhone(onlyNumbers);
  };

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-yely-softGray text-sm font-medium mb-2">Numero de Telephone</label>
      
      <div className="flex bg-yely-black border border-yely-charcoal rounded-xl focus-within:border-yely-gold focus-within:ring-1 focus-within:ring-yely-gold transition-colors">
        
        {/* Bouton Selecteur de Pays */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-4 border-r border-yely-charcoal hover:bg-yely-charcoal/50 transition-colors rounded-l-xl text-yely-white"
        >
          <span className="text-xs font-bold text-yely-softGray">{selectedCountry.id}</span>
          <span className="font-medium">{selectedCountry.code}</span>
          <ChevronDown className={`w-4 h-4 text-yely-gold transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Champ de Saisie */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-4 w-4 text-yely-gold/50" />
          </div>
          <input
            type="tel"
            placeholder="Ex: 0708091011"
            value={phone}
            onChange={handlePhoneChange}
            required
            className="w-full pl-10 pr-4 py-4 bg-transparent text-yely-white placeholder-yely-softGray/50 focus:outline-none text-base tracking-widest font-medium"
          />
        </div>
      </div>

      {/* Menu Deroulant avec Recherche */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 w-72 bg-yely-charcoal border border-yely-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-3 border-b border-yely-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yely-softGray" />
              <input 
                type="text"
                placeholder="Rechercher un pays..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-yely-black border border-yely-white/5 rounded-lg text-sm text-yely-white focus:outline-none focus:border-yely-gold"
              />
            </div>
          </div>
          
          <ul className="max-h-60 overflow-y-auto">
            {filteredCountries.map(country => (
              <li key={country.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCountryCode(country.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-yely-richBlack transition-colors text-left"
                >
                  <span className="text-yely-white text-sm">{country.name}</span>
                  <span className="text-yely-softGray text-sm font-medium">{country.code}</span>
                </button>
              </li>
            ))}
            {filteredCountries.length === 0 && (
              <li className="px-4 py-3 text-yely-softGray text-sm text-center">Aucun pays trouve</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}