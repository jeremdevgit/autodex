<p align="center"><img src="public/icon-512.png" width="112" alt=""></p>

<h1 align="center">AutoDex</h1>

<p align="center"><b>Encuéntralo, fotografíalo, colecciónalo: un juego de colección de coches con reconocimiento de fotos en el dispositivo.</b></p>

<p align="center"><img src="https://img.shields.io/badge/%F0%9F%8E%AE%20Music%20%26%20games-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux%20%C2%B7%20Phone-c2410c?style=flat-square" alt="Música y juegos"> <a href="https://github.com/jeremdevgit/autodex/releases"><img src="https://img.shields.io/github/v/release/jeremdevgit/autodex?include_prereleases&style=flat-square&label=version" alt="version"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-555?style=flat-square" alt="GPL-3.0-or-later"></a> <a href="https://github.com/jeremdevgit/autodex/actions/workflows/ci.yml"><img src="https://github.com/jeremdevgit/autodex/actions/workflows/ci.yml/badge.svg" alt="CI"></a></p>

<p align="center"><a href="README.md">English</a> · <a href="README.fr.md">Français</a> · <b>Español</b> · <a href="README.de.md">Deutsch</a> · <a href="README.it.md">Italiano</a> · <a href="README.pt.md">Português</a> · <a href="README.zh.md">简体中文</a> · <a href="README.ja.md">日本語</a></p>

<p align="center"><a href="https://github.com/jeremdevgit/autodex/releases/latest"><b>⬇ Descargar</b></a></p>

![Colección](docs/screenshots/collection-en.png)

Haz una foto a un coche en la calle, la **IA del dispositivo** propone el modelo y la carta se desbloquea en tu colección: **543 coches de 1980 a 2026, 74 marcas, cinco niveles de rareza**. Sin cuenta, sin anuncios, sin nube.

<p><img src="docs/screenshots/detail-en.png" alt="Ficha de un coche" width="62%"> <img src="docs/screenshots/mobile-en.png" alt="En el móvil" width="30%"></p>

## De un vistazo

| | |
|---|---|
| **Categoría** | 🎮 Música y juegos |
| **Plataformas** | Windows · macOS · Linux · móviles (web) |
| **Interfaz** | 8 idiomas (EN, FR, ES, DE, IT, PT, ZH, JA) |
| **Precio** | Gratis, de código abierto, sin anuncios ni telemetría |
| **Estado** | Estable |
| **Licencia** | [GPL-3.0-or-later](LICENSE) |

## Cómo se juega

1. **Encuentra** un coche y hazle una foto (o importa una).
2. **Confirma** el modelo entre las 5 sugerencias de la IA: reconoce 196 modelos; los demás se añaden a mano.
3. **Colecciona**: la silueta se convierte en tu foto, con un modelo 3D, nombres de pintura de fábrica, potencia, energía y valor orientativo.
4. **Completa** la colección por marca, carrocería, rareza, década o año.

![Por año](docs/screenshots/years-en.png)

## Funciones

| | |
|---|---|
| Reconocimiento de fotos | ResNet-50 ejecutado **localmente** en WebAssembly; no se sube nada |
| Ordenar y filtrar | Marca, carrocería, rareza, valor, energía, década, conseguidos/pendientes; vista «Por año» |
| Copia de seguridad | Exportación completa a un JSON (fotos incluidas); importación fusionando o reemplazando |
| Móvil ↔ ordenador | La app de escritorio aloja un servidor local protegido por un código de emparejamiento de 8 caracteres; fusión foto a foto |
| Autoalojamiento | `npm run build && npm run server`, o el `Dockerfile` para un NAS |

Las fichas describen una versión representativa; los valores son orientativos.

## Instalar

Descarga la [última versión](https://github.com/jeremdevgit/autodex/releases/latest): `.exe` para Windows (por usuario), `.dmg` universal para macOS, `.deb` y `.AppImage` para Linux; compruébalos con `SHA256SUMS.txt`. Los instaladores no están firmados con un certificado de pago (SmartScreen puede pedir confirmación; en macOS usa clic derecho › **Abrir** la primera vez).

**En el móvil** no hay que instalar nada: inicia el servidor en la app de escritorio (*Ajustes › Servidor móvil*), abre la dirección que muestra en la misma Wi-Fi y añádela a la pantalla de inicio.

## Privacidad

Sin telemetría, sin cuenta, sin peticiones externas: el modelo, las fuentes y el motor van incluidos. Las fotos se quedan en la app y solo salen del dispositivo si exportas o sincronizas. El servidor de sincronización solo acepta datos validados, bloquea una dirección tras 10 códigos erróneos y está pensado para la red de casa: ponle HTTPS delante antes de exponerlo.

## Compilar

```sh
# Node.js 20+, Rust estable y los requisitos de Tauri
npm ci
npm run dev              # versión web en http://localhost:5173
npm test
npm run desktop:build    # instaladores de escritorio
docker build -t autodex . && docker run -p 4174:4174 -v autodex-data:/data autodex
```

Variables del servidor: `PORT`, `HOST`, `AUTODEX_DATA_DIR`; `AUTODEX_SERVER_PORT=4174` inicia el servidor de la app de escritorio al arrancar. Cambios: [CHANGELOG.md](CHANGELOG.md).

## Licencia

GPL-3.0-or-later — ver [LICENSE](LICENSE). Créditos del modelo y las bibliotecas: [THIRD_PARTY.md](THIRD_PARTY.md). AutoDex no está afiliado a ningún fabricante; los nombres de marcas y modelos pertenecen a sus propietarios.

---

¿Has encontrado una vulnerabilidad? Infórmala en privado (consulta [SECURITY.md](SECURITY.md)) y no en una incidencia pública.

## Más software libre de jeremdevgit

Todos gratuitos, de código abierto y sin anuncios.

**🛠️ Sistema y hardware** — [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) · [rJb](https://github.com/jeremdevgit/rjb) · [LJ Hub](https://github.com/jeremdevgit/lj-hub) · [Decklight](https://github.com/jeremdevgit/decklight)

**📒 Productividad y datos** — [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) · [JMeca](https://github.com/jeremdevgit/jmeca) · [Suite Libre](https://jeremdevgit.github.io/suite-libre/)

**🎮 Música y juegos** — [Pomme](https://github.com/jeremdevgit/pomme) · [Ludothèque](https://github.com/jeremdevgit/ludotheque) · [Batailles de France](https://github.com/jeremdevgit/batailles-de-france)
