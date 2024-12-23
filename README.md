# Cnull Script - RGPD Quiz AutoFill

![Logo](https://intranet.cnil.fr/logo/CNULL.png)

## Description
Ce script utilisateur (UserScript) pour Tampermonkey automatise le remplissage des réponses aux questionnaires RGPD sur le site atelier-rgpd.cnil.fr. Il permet de remplir automatiquement les réponses correctes pour chaque module du cours avec une option de navigation automatique.

## Fonctionnalités
- Détection automatique des modules (1 à 4)
- Remplissage automatique des réponses
- Option de navigation automatique entre les questions
- Support pour tous les types de questions :
  - Questions à choix unique (QCU)
  - Questions à choix multiple (QCM)
  - Questions Vrai/Faux
  - Questions d'appariement (matching)

## Installation

### 1. Installation de Tampermonkey
1. Installez l'extension Tampermonkey pour votre navigateur :
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/fr/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 2. Installation Manuelle Alternative
1. Ouvrez le gestionnaire de scripts Tampermonkey (cliquez sur l'icône de l'extension)
2. Sélectionnez "Créer un nouveau script"
3. Copiez le contenu entier du [script](https://raw.githubusercontent.com/Pixnop/Cnull/main/quiz-autofill-script-generated.js)
4. Sauvegardez avec Ctrl+S

## Utilisation

1. **Accédez à un quiz**
   - Rendez-vous sur [atelier-rgpd.cnil.fr](https://atelier-rgpd.cnil.fr)
   - Sélectionnez un module et commencez un quiz

2. **Interface de Contrôle**
   - Un panneau apparaît en haut à droite avec :
     - Module détecté
     - Bouton "Remplir les réponses"
     - Case à cocher "Auto" (pour navigation automatique)

3. **Remplissage des Réponses**
   - Cliquez sur "Remplir les réponses"
   - Si "Auto" est coché : passage automatique à la question suivante
   - Si "Auto" est décoché : navigation manuelle requise

4. **État Sauvegardé**
   - L'option "Auto" est mémorisée entre les sessions
   - Pas besoin de recocher à chaque page

## Compatibilité
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Opera
- ❌ Internet Explorer

## Remarques
- Script à usage éducatif uniquement
- Les réponses sont actualisées selon les dernières versions des questionnaires
- Il est recommandé de comprendre les questions plutôt que de simplement les remplir automatiquement

## Support & Bugs
Pour signaler un bug ou suggérer une amélioration :
1. Ouvrez une [issue sur GitHub](https://github.com/Pixnop/Cnull/issues)
2. Fournissez :
   - Description du problème
   - Étapes pour reproduire
   - Captures d'écran si possible

## Crédits
- Développé par [Léon Fievet](https://github.com/Pixnop)

## License
MIT License - voir [LICENSE](https://github.com/Pixnop/Cnull/blob/main/LICENSE) pour plus de détails
