# Changelog / Historique

## 0.1.0 — 2026-11-11

### English
- First public version, rebuilt from the original prototype.
- Catalogue of 543 cars (1980–2026, 74 brands) with rarity, indicative value, power, energy and factory paint names.
- On-device recognition (ResNet-50, int8, 196 models) with top-5 suggestions; fixed the label order that made the prototype wrong most of the time (accuracy on the test set: 7/24 → 22/24).
- Manual capture for every car, marked as not AI-verified.
- Rotatable 3D model per body type, filters, sorting and "by year" view.
- Full JSON backup with merge or replace import.
- Local server in the desktop app (pairing code, rate limiting, validated data) and a Node/Docker server for self-hosting; per-photo merge with deletions.
- Interface in 8 languages; bundled runtime, no external requests.
- Installers for Windows, macOS (universal) and Linux.

### Français
- Première version publique, reconstruite à partir du prototype.
- Catalogue de 543 voitures (1980–2026, 74 marques) avec rareté, valeur indicative, puissance, énergie et noms de teintes d'usine.
- Reconnaissance sur l'appareil (ResNet-50, int8, 196 modèles) avec cinq propositions ; correction de l'ordre des étiquettes qui faisait se tromper le prototype la plupart du temps (précision sur le jeu de test : 7/24 → 22/24).
- Capture manuelle pour toutes les voitures, signalée comme non vérifiée par l'IA.
- Modèle 3D orientable par carrosserie, filtres, tris et vue « Par année ».
- Sauvegarde JSON complète, import en fusion ou en remplacement.
- Serveur local dans l'app de bureau (code de jumelage, limitation des tentatives, données validées) et serveur Node/Docker pour l'auto-hébergement ; fusion photo par photo avec suppressions.
- Interface en 8 langues ; moteur inclus, aucune requête externe.
- Installateurs Windows, macOS (universel) et Linux.
