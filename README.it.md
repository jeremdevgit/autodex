<p align="center"><img src="public/icon-512.png" width="112" alt=""></p>

<h1 align="center">AutoDex</h1>

<p align="center"><b>Avvistala, fotografala, collezionala: un gioco di collezione di auto con riconoscimento foto sul dispositivo.</b></p>

<p align="center"><img src="https://img.shields.io/badge/%F0%9F%8E%AE%20Music%20%26%20games-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux%20%C2%B7%20Phone-c2410c?style=flat-square" alt="Musica e giochi"> <a href="https://github.com/jeremdevgit/autodex/releases"><img src="https://img.shields.io/github/v/release/jeremdevgit/autodex?include_prereleases&style=flat-square&label=version" alt="version"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-555?style=flat-square" alt="GPL-3.0-or-later"></a> <a href="https://github.com/jeremdevgit/autodex/actions/workflows/ci.yml"><img src="https://github.com/jeremdevgit/autodex/actions/workflows/ci.yml/badge.svg" alt="CI"></a></p>

<p align="center"><a href="README.md">English</a> · <a href="README.fr.md">Français</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <b>Italiano</b> · <a href="README.pt.md">Português</a> · <a href="README.zh.md">简体中文</a> · <a href="README.ja.md">日本語</a></p>

<p align="center"><a href="https://github.com/jeremdevgit/autodex/releases/latest"><b>⬇ Scarica</b></a></p>

![Collezione](docs/screenshots/collection-en.png)

Fotografa un'auto per strada, l'**IA sul dispositivo** suggerisce il modello e la carta si sblocca nella tua collezione: **543 auto dal 1980 al 2026, 74 marchi, cinque livelli di rarità**. Niente account, pubblicità o cloud.

<p><img src="docs/screenshots/detail-en.png" alt="Scheda di un'auto" width="62%"> <img src="docs/screenshots/mobile-en.png" alt="Su smartphone" width="30%"></p>

## In breve

| | |
|---|---|
| **Categoria** | 🎮 Musica e giochi |
| **Piattaforme** | Windows · macOS · Linux · smartphone (web) |
| **Interfaccia** | 8 lingue (EN, FR, ES, DE, IT, PT, ZH, JA) |
| **Prezzo** | Gratuito, open source, senza pubblicità né telemetria |
| **Stato** | Stabile |
| **Licenza** | [GPL-3.0-or-later](LICENSE) |

## Come si gioca

1. **Avvista** un'auto e scatta una foto (o importane una).
2. **Conferma** il modello tra i 5 suggerimenti dell'IA: ne riconosce 196, gli altri si aggiungono a mano.
3. **Colleziona**: la sagoma diventa la tua foto, con modello 3D, nomi delle vernici originali, potenza, alimentazione e valore indicativo.
4. **Completa** la collezione per marchio, carrozzeria, rarità, decennio o anno.

![Per anno](docs/screenshots/years-en.png)

## Funzioni

| | |
|---|---|
| Riconoscimento foto | ResNet-50 eseguito **in locale** in WebAssembly; nulla viene caricato |
| Ordinamento e filtri | Marchio, carrozzeria, rarità, valore, alimentazione, decennio, posseduta/mancante; vista «Per anno» |
| Backup | Esportazione completa in un file JSON (foto comprese); importazione unendo o sostituendo |
| Smartphone ↔ computer | L'app desktop ospita un server locale protetto da un codice di abbinamento di 8 caratteri; unione foto per foto |
| Self-hosting | `npm run build && npm run server`, o il `Dockerfile` per un NAS |

Le schede descrivono una versione rappresentativa; i valori sono indicativi.

## Installazione

Scarica la [versione più recente](https://github.com/jeremdevgit/autodex/releases/latest): `.exe` per Windows (per utente), `.dmg` universale per macOS, `.deb` e `.AppImage` per Linux; verifica con `SHA256SUMS.txt`. Gli installer non sono firmati con un certificato a pagamento (SmartScreen può chiedere conferma; su macOS usa clic destro › **Apri** la prima volta).

**Su smartphone** non serve installare nulla: avvia il server nell'app desktop (*Impostazioni › Server mobile*), apri l'indirizzo mostrato sulla stessa rete Wi-Fi e aggiungilo alla schermata Home.

## Privacy

Niente telemetria, account o richieste esterne: modello, font e runtime sono inclusi. Le foto restano nell'app e lasciano il dispositivo solo se esporti o sincronizzi. Il server di sincronizzazione accetta solo dati validati, blocca un indirizzo dopo 10 codici errati ed è pensato per la rete di casa: mettici davanti HTTPS prima di esporlo.

## Compilare

```sh
# Node.js 20+, Rust stable e i prerequisiti di Tauri
npm ci
npm run dev              # versione web su http://localhost:5173
npm test
npm run desktop:build    # installer desktop
docker build -t autodex . && docker run -p 4174:4174 -v autodex-data:/data autodex
```

Variabili del server: `PORT`, `HOST`, `AUTODEX_DATA_DIR`; `AUTODEX_SERVER_PORT=4174` avvia il server dell'app desktop all'apertura. Modifiche: [CHANGELOG.md](CHANGELOG.md).

## Licenza

GPL-3.0-or-later — vedi [LICENSE](LICENSE). Crediti del modello e delle librerie: [THIRD_PARTY.md](THIRD_PARTY.md). AutoDex non è affiliato ad alcun costruttore; i nomi di marchi e modelli appartengono ai rispettivi proprietari.

---

Hai trovato una vulnerabilità? Segnalala in privato (vedi [SECURITY.md](SECURITY.md)) e non in una issue pubblica.

## Altro software libero di jeremdevgit

Tutti gratuiti, open source e senza pubblicità.

**🛠️ Sistema e hardware** — [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) · [rJb](https://github.com/jeremdevgit/rjb) · [LJ Hub](https://github.com/jeremdevgit/lj-hub) · [Decklight](https://github.com/jeremdevgit/decklight)

**📒 Produttività e dati** — [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) · [JMeca](https://github.com/jeremdevgit/jmeca) · [Suite Libre](https://jeremdevgit.github.io/suite-libre/)

**🎮 Musica e giochi** — [Pomme](https://github.com/jeremdevgit/pomme) · [Ludothèque](https://github.com/jeremdevgit/ludotheque) · [Batailles de France](https://github.com/jeremdevgit/batailles-de-france)
