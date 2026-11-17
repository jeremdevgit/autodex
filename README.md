<p align="center"><img src="public/icon-512.png" width="112" alt=""></p>

<h1 align="center">AutoDex</h1>

<p align="center"><b>Spot it, snap it, collect it: a car collection game with on-device photo recognition.</b></p>

<p align="center"><img src="https://img.shields.io/badge/%F0%9F%8E%AE%20Music%20%26%20games-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux%20%C2%B7%20Phone-c2410c?style=flat-square" alt="Music & games"> <a href="https://github.com/jeremdevgit/autodex/releases"><img src="https://img.shields.io/github/v/release/jeremdevgit/autodex?include_prereleases&style=flat-square&label=version" alt="version"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-555?style=flat-square" alt="GPL-3.0-or-later"></a> <a href="https://github.com/jeremdevgit/autodex/actions/workflows/ci.yml"><img src="https://github.com/jeremdevgit/autodex/actions/workflows/ci.yml/badge.svg" alt="CI"></a></p>

<p align="center"><b>English</b> · <a href="README.fr.md">Français</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.it.md">Italiano</a> · <a href="README.pt.md">Português</a> · <a href="README.zh.md">简体中文</a> · <a href="README.ja.md">日本語</a></p>

<p align="center"><a href="https://github.com/jeremdevgit/autodex/releases/latest"><b>⬇ Download</b></a></p>

![Collection](docs/screenshots/collection-en.png)

Take a photo of a car in the street, the **on-device AI** suggests the model, and the card is unlocked in your collection: **543 cars from 1980 to 2026, 74 brands, five rarity levels**. No account, no ads, no cloud.

<p><img src="docs/screenshots/detail-en.png" alt="Car card" width="62%"> <img src="docs/screenshots/mobile-en.png" alt="On a phone" width="30%"></p>

## At a glance

| | |
|---|---|
| **Category** | 🎮 Music & games |
| **Platforms** | Windows · macOS · Linux · phones (web) |
| **Interface** | 8 languages (EN, FR, ES, DE, IT, PT, ZH, JA) |
| **Price** | Free, open source, no ads, no telemetry |
| **Status** | Stable |
| **License** | [GPL-3.0-or-later](LICENSE) |

## How to play

1. **Spot** a car and take a photo (or import one).
2. **Confirm** the model among the AI's top 5 suggestions — 196 models are recognized; others can be added by hand.
3. **Collect**: the silhouette becomes your photo, with a 3D model, factory paint names, power, energy and indicative value.
4. **Complete** your collection by brand, body type, rarity, decade or year.

![By year](docs/screenshots/years-en.png)

## Features

| | |
|---|---|
| Photo recognition | ResNet-50 running **locally** in WebAssembly; nothing is uploaded |
| Sort and filter | Brand, body, rarity, value, energy, decade, owned/missing; "By year" view |
| Backup | Full export to one JSON file (photos included); merge or replace on import |
| Phone ↔ computer | The desktop app hosts a local server protected by an 8-character pairing code; per-photo merge |
| Self-hosting | `npm run build && npm run server`, or the `Dockerfile` for a NAS |

Specs describe a representative version; values are indicative.

## Install

Get the [latest release](https://github.com/jeremdevgit/autodex/releases/latest): Windows `.exe` (per user), macOS universal `.dmg`, Linux `.deb` and `.AppImage`; verify with `SHA256SUMS.txt`. Installers are not signed with a paid certificate (SmartScreen may ask; on macOS use right-click › **Open** the first time).

**On a phone**, nothing to install: start the server in the desktop app (*Settings › Mobile server*), open the address it shows on the same Wi-Fi and add it to your home screen.

## Privacy

No telemetry, no account, no external request: the model, fonts and runtime are bundled. Photos stay in the app and leave the device only when you export or sync. The sync server accepts only validated data, blocks an address after 10 wrong codes and is meant for a home network — put HTTPS in front before exposing it.

## Build from source

```sh
# Node.js 20+, Rust stable and the Tauri prerequisites
npm ci
npm run dev              # web version on http://localhost:5173
npm test
npm run desktop:build    # desktop installers
docker build -t autodex . && docker run -p 4174:4174 -v autodex-data:/data autodex
```

Server variables: `PORT`, `HOST`, `AUTODEX_DATA_DIR`; `AUTODEX_SERVER_PORT=4174` starts the desktop app's server at launch. Changes: [CHANGELOG.md](CHANGELOG.md).

## License

GPL-3.0-or-later — see [LICENSE](LICENSE). Model and library credits: [THIRD_PARTY.md](THIRD_PARTY.md). AutoDex is not affiliated with any car manufacturer; brand and model names belong to their owners.

---

Found a vulnerability? Please report it privately (see [SECURITY.md](SECURITY.md)) rather than in a public issue.

## More free software by jeremdevgit

All free, open source and ad-free.

**🛠️ System & hardware** — [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) · [rJb](https://github.com/jeremdevgit/rjb) · [LJ Hub](https://github.com/jeremdevgit/lj-hub) · [Decklight](https://github.com/jeremdevgit/decklight)

**📒 Productivity & data** — [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) · [JMeca](https://github.com/jeremdevgit/jmeca) · [Suite Libre](https://jeremdevgit.github.io/suite-libre/)

**🎮 Music & games** — [Pomme](https://github.com/jeremdevgit/pomme) · [Ludothèque](https://github.com/jeremdevgit/ludotheque) · [Batailles de France](https://github.com/jeremdevgit/batailles-de-france)
