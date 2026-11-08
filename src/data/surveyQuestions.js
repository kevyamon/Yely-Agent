// src/data/surveyQuestions.js
// QUESTIONNAIRES OFFICIELS YÉLY — EXPÉDITION MAFÉRÉ (GUIDE TERRAIN 2026)
// Règle d'or : Chaque question est un prétexte d'accroche pour qualifier le contact.

export const TARGET_TYPES = {
  driver: {
    id: 'driver',
    label: 'Chauffeur',
    category: 'Cible 2 : Flotte',
    subtitle: 'Taxis communaux & Tricycles',
    reward: 500,
    posture: 'Respectueuse (« Chef/Vieux père »), pragmatique, axée sur les économies d\'essence.',
    questions: [
      {
        id: 'q1',
        title: 'Q1. Dans votre journée de travail, combien de temps passez-vous à rouler à vide pour chercher des clients ?',
        options: [
          'R1 : 1 à 2 heures cumulées par jour.',
          'R2 : Je préfère stationner à la gare et faire le rang.'
        ],
        actionAdvice: '« Yély vous alerte dès qu\'un client sonne dans votre secteur. »'
      },
      {
        id: 'q2',
        title: 'Q2. Combien dépensez-vous environ par jour en carburant pour ces trajets à vide ?',
        options: [
          'R1 : 2 000 à 3 000 FCFA perdus inutilement.',
          'R2 : C\'est variable mais ça réduit la recette du patron.'
        ],
        actionAdvice: 'Démontrer l\'économie directe de carburant grâce au bip client.'
      },
      {
        id: 'q3',
        title: 'Q3. Aimeriez-vous recevoir des courses directes depuis les cours et domiciles sans négocier le tarif ?',
        options: [
          'R1 : Oui, si le prix de la course est fixe et garanti.',
          'R2 : Oui, surtout pendant les heures creuses (milieu de journée).'
        ],
        actionAdvice: 'Présenter les forfaits fixes garantis (400 F / 700 F).'
      },
      {
        id: 'q4',
        title: 'Q4. Que pensez-vous d’un service sans commission par course, avec un accès illimité à 1 000 F/mois ?',
        options: [
          'R1 : C\'est très avantageux si les clients commandent vraiment.',
          'R2 : Je préfère tester avant de payer un engagement.'
        ],
        actionAdvice: 'Verrouiller le statut Pionnier : offre réservée aux 20 premiers.'
      },
      {
        id: 'q5',
        title: 'Q5. Avez-vous un smartphone Android avec GPS pour recevoir les alertes sonores de courses ?',
        options: [
          'R1 : Oui, j\'ai un Android tactile en bon état.',
          'R2 : J\'ai un Android mais la batterie se décharge vite.'
        ],
        actionAdvice: 'Activer le mode chauffeur et tester une fausse alerte sonore.'
      }
    ]
  },

  seller: {
    id: 'seller',
    label: 'Commerçant',
    category: 'Cible 3 : Marchands',
    subtitle: 'Boutiques, Maquis, Dépôts & Boutiques',
    reward: 500,
    posture: 'Professionnelle, concise, axée sur l\'augmentation du chiffre d\'affaires quotidien.',
    questions: [
      {
        id: 'q1',
        title: 'Q1. Les clients qui habitent loin dans les quartiers de Maféré commandent-ils souvent chez vous ?',
        options: [
          'R1 : Uniquement les habitués qui m\'appellent par téléphone.',
          'R2 : Rarement, la plupart viennent physiquement au magasin.'
        ],
        actionAdvice: '« Yély affiche vos produits sur le téléphone de toute la ville. »'
      },
      {
        id: 'q2',
        title: 'Q2. Quand un client demande à être livré à domicile, comment gérez-vous l\'expédition ?',
        options: [
          'R1 : J\'envoie un apprenti ou je cherche un taxi au carrefour.',
          'R2 : Je refuse souvent car je n\'ai pas de livreur dédié.'
        ],
        actionAdvice: 'Expliquer que les taxis Yély assurent la livraison express.'
      },
      {
        id: 'q3',
        title: 'Q3. Quels sont les 3 articles ou plats qui se vendent le plus vite dans votre commerce ?',
        options: [
          'R1 : Produits d\'épicerie / boissons / packs de maison.',
          'R2 : Plats cuisinés / vêtements / articles de beauté.'
        ],
        actionAdvice: 'Noter les 3 références pour création immédiate sur le store.'
      },
      {
        id: 'q4',
        title: 'Q4. Aimeriez-vous avoir une vitrine en ligne sans payer les frais d’un deuxième magasin physique ?',
        options: [
          'R1 : Oui, si cela ne demande pas de compétences compliquées.',
          'R2 : Oui, pour écouler rapidement les stocks en fin de mois.'
        ],
        actionAdvice: 'Montrer la fluidité de la Marketplace Yély sur l\'écran démo.'
      },
      {
        id: 'q5',
        title: 'Q5. Êtes-vous d\'accord pour qu\'AirMax passe photographier vos articles pour les mettre en ligne ?',
        options: [
          'R1 : Oui, fixons un créneau calme dans la matinée.',
          'R2 : Oui, je prépare les prix affichés dès aujourd\'hui.'
        ],
        actionAdvice: 'Programmer le passage de validation et valider le contact.'
      }
    ]
  },

  rider: {
    id: 'rider',
    label: 'Passager / Client',
    category: 'Cible 1 : Usagers',
    subtitle: 'Passagers & Acheteurs marché',
    reward: 250,
    posture: 'Aimable, dynamique, orienté gain de temps. Objectif : Installation immédiate et compte créé.',
    questions: [
      {
        id: 'q1',
        title: 'Q1. Quand vous quittez la maison, comment faites-vous d’habitude pour avoir un taxi rapidement ?',
        options: [
          'R1 : Je marche jusqu\'au goudron/carrefour et j\'attends.',
          'R2 : J\'appelle un chauffeur connu (souvent indisponible).'
        ],
        actionAdvice: '« Avec Yély, le taxi arrive devant votre cour en 3 minutes. »'
      },
      {
        id: 'q2',
        title: 'Q2. Combien de temps perdez-vous en moyenne à attendre un véhicule aux heures de pointe ?',
        options: [
          'R1 : 5 à 10 minutes sous le soleil ou la pluie.',
          'R2 : Plus de 20 minutes (parfois aucun taxi ne passe).'
        ],
        actionAdvice: 'Montrer la carte en direct avec les taxis disponibles.'
      },
      {
        id: 'q3',
        title: 'Q3. Vous arrive-t-il de renoncer à un achat au marché par manque de temps ou pour éviter le transport ?',
        options: [
          'R1 : Oui régulièrement, surtout pour les petits besoins.',
          'R2 : Non, je suis obligé(e) d\'y aller moi-même à pied.'
        ],
        actionAdvice: 'Présenter l\'onglet Marketplace et la livraison à domicile.'
      },
      {
        id: 'q4',
        title: 'Q4. Avez-vous un smartphone Android avec de la place disponible pour une application légère (40 Mo) ?',
        options: [
          'R1 : Oui, j\'ai Play Store et WhatsApp.',
          'R2 : Oui, mais je n\'ai pas de pass internet actuellement.'
        ],
        actionAdvice: 'Partager le point d\'accès Wi-Fi de l\'agent et installer l\'app.'
      },
      {
        id: 'q5',
        title: 'Q5. Comment préférez-vous payer vos courses et vos achats au quotidien ?',
        options: [
          'R1 : En espèces (monnaie physique).',
          'R2 : Par Wave ou Mobile Money.'
        ],
        actionAdvice: 'Expliquer que Yély gère le Cash et Wave sans frais cachés.'
      }
    ]
  }
};

