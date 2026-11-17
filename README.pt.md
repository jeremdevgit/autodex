<p align="center"><img src="public/icon-512.png" width="112" alt=""></p>

<h1 align="center">AutoDex</h1>

<p align="center"><b>Encontre, fotografe, colecione: um jogo de coleção de carros com reconhecimento de fotos no dispositivo.</b></p>

<p align="center"><img src="https://img.shields.io/badge/%F0%9F%8E%AE%20Music%20%26%20games-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux%20%C2%B7%20Phone-c2410c?style=flat-square" alt="Música e jogos"> <a href="https://github.com/jeremdevgit/autodex/releases"><img src="https://img.shields.io/github/v/release/jeremdevgit/autodex?include_prereleases&style=flat-square&label=version" alt="version"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-555?style=flat-square" alt="GPL-3.0-or-later"></a> <a href="https://github.com/jeremdevgit/autodex/actions/workflows/ci.yml"><img src="https://github.com/jeremdevgit/autodex/actions/workflows/ci.yml/badge.svg" alt="CI"></a></p>

<p align="center"><a href="README.md">English</a> · <a href="README.fr.md">Français</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.it.md">Italiano</a> · <b>Português</b> · <a href="README.zh.md">简体中文</a> · <a href="README.ja.md">日本語</a></p>

<p align="center"><a href="https://github.com/jeremdevgit/autodex/releases/latest"><b>⬇ Transferir</b></a></p>

![Coleção](docs/screenshots/collection-en.png)

Fotografe um carro na rua, a **IA no dispositivo** sugere o modelo e a carta é desbloqueada na sua coleção: **543 carros de 1980 a 2026, 74 marcas, cinco níveis de raridade**. Sem conta, sem anúncios, sem nuvem.

<p><img src="docs/screenshots/detail-en.png" alt="Ficha de um carro" width="62%"> <img src="docs/screenshots/mobile-en.png" alt="No telemóvel" width="30%"></p>

## Em resumo

| | |
|---|---|
| **Categoria** | 🎮 Música e jogos |
| **Plataformas** | Windows · macOS · Linux · telemóveis (web) |
| **Interface** | 8 idiomas (EN, FR, ES, DE, IT, PT, ZH, JA) |
| **Preço** | Gratuito, de código aberto, sem anúncios nem telemetria |
| **Estado** | Estável |
| **Licença** | [GPL-3.0-or-later](LICENSE) |

## Como jogar

1. **Encontre** um carro e tire uma foto (ou importe uma).
2. **Confirme** o modelo entre as 5 sugestões da IA — reconhece 196 modelos; os restantes adicionam-se à mão.
3. **Colecione**: a silhueta passa a ser a sua foto, com modelo 3D, nomes das pinturas de origem, potência, energia e valor indicativo.
4. **Complete** a coleção por marca, carroçaria, raridade, década ou ano.

![Por ano](docs/screenshots/years-en.png)

## Funções

| | |
|---|---|
| Reconhecimento de fotos | ResNet-50 executado **localmente** em WebAssembly; nada é enviado |
| Ordenar e filtrar | Marca, carroçaria, raridade, valor, energia, década, obtidos/em falta; vista «Por ano» |
| Cópia de segurança | Exportação completa para um ficheiro JSON (fotos incluídas); importação por fusão ou substituição |
| Telemóvel ↔ computador | A app de computador aloja um servidor local protegido por um código de emparelhamento de 8 caracteres; fusão foto a foto |
| Alojamento próprio | `npm run build && npm run server`, ou o `Dockerfile` para um NAS |

As fichas descrevem uma versão representativa; os valores são indicativos.

## Instalar

Obtenha a [versão mais recente](https://github.com/jeremdevgit/autodex/releases/latest): `.exe` para Windows (por utilizador), `.dmg` universal para macOS, `.deb` e `.AppImage` para Linux; verifique com `SHA256SUMS.txt`. Os instaladores não estão assinados com um certificado pago (o SmartScreen pode pedir confirmação; no macOS use clique direito › **Abrir** na primeira vez).

**No telemóvel** não há nada a instalar: inicie o servidor na app de computador (*Definições › Servidor móvel*), abra o endereço indicado na mesma rede Wi-Fi e adicione-o ao ecrã principal.

## Privacidade

Sem telemetria, sem conta, sem pedidos externos: o modelo, os tipos de letra e o motor vêm incluídos. As fotos ficam na app e só saem do dispositivo se exportar ou sincronizar. O servidor de sincronização só aceita dados validados, bloqueia um endereço após 10 códigos errados e destina-se à rede de casa — ponha HTTPS à frente antes de o expor.

## Compilar

```sh
# Node.js 20+, Rust estável e os pré-requisitos do Tauri
npm ci
npm run dev              # versão web em http://localhost:5173
npm test
npm run desktop:build    # instaladores de computador
docker build -t autodex . && docker run -p 4174:4174 -v autodex-data:/data autodex
```

Variáveis do servidor: `PORT`, `HOST`, `AUTODEX_DATA_DIR`; `AUTODEX_SERVER_PORT=4174` inicia o servidor da app de computador no arranque. Alterações: [CHANGELOG.md](CHANGELOG.md).

## Licença

GPL-3.0-or-later — ver [LICENSE](LICENSE). Créditos do modelo e das bibliotecas: [THIRD_PARTY.md](THIRD_PARTY.md). O AutoDex não está afiliado a nenhum fabricante; os nomes de marcas e modelos pertencem aos respetivos proprietários.

---

Encontrou uma vulnerabilidade? Comunique-a em privado (consulte [SECURITY.md](SECURITY.md)) e não num issue público.

## Mais software livre de jeremdevgit

Todos gratuitos, de código aberto e sem anúncios.

**🛠️ Sistema e hardware** — [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) · [rJb](https://github.com/jeremdevgit/rjb) · [LJ Hub](https://github.com/jeremdevgit/lj-hub) · [Decklight](https://github.com/jeremdevgit/decklight)

**📒 Produtividade e dados** — [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) · [JMeca](https://github.com/jeremdevgit/jmeca) · [Suite Libre](https://jeremdevgit.github.io/suite-libre/)

**🎮 Música e jogos** — [Pomme](https://github.com/jeremdevgit/pomme) · [Ludothèque](https://github.com/jeremdevgit/ludotheque) · [Batailles de France](https://github.com/jeremdevgit/batailles-de-france)
