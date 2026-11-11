# Security / Sécurité

Report security issues privately using GitHub's **Report a vulnerability** feature. Please include the version, platform and steps to reproduce, and do not publish an exploit before a fix is available.

Signalez une faille en privé via **Report a vulnerability** sur GitHub, avec la version, la plateforme et les étapes de reproduction. Merci de ne pas publier d'exploit avant la correction.

## Design / Conception

- No account, telemetry or external request. The AI model and its WebAssembly runtime are bundled.
- Imported files and synced data are validated: known fields only, ids limited to `a-z0-9-`, photos limited to base64 JPEG/PNG/WebP data URLs (no SVG), bounded counts and sizes.
- The sync server (desktop and Node) requires an 8-character random pairing code compared in constant time, blocks an address for 10 minutes after 10 wrong codes, limits request bodies to 250 MB, refuses path traversal and sends `nosniff`, `no-referrer` and `DENY` framing headers.
- The server speaks plain HTTP and is designed for a trusted home network. Put it behind an HTTPS reverse proxy before exposing it to the Internet. The pairing code protects the collection, not the app files, which are public.
- The desktop window uses a restrictive Content Security Policy and only exposes three commands (start, stop and status of the local server).

- Aucun compte, aucune télémétrie, aucune requête externe. Le modèle et son moteur WebAssembly sont inclus.
- Les fichiers importés et les données synchronisées sont validés : champs connus uniquement, identifiants `a-z0-9-`, photos limitées aux data URL base64 JPEG/PNG/WebP (pas de SVG), nombres et tailles bornés.
- Le serveur de synchro exige un code aléatoire de 8 caractères comparé en temps constant, bloque une adresse 10 minutes après 10 codes erronés, limite les envois à 250 Mo et refuse la traversée de chemins.
- Le serveur parle en HTTP simple et est prévu pour un réseau domestique de confiance. Placez-le derrière un proxy HTTPS avant toute exposition sur Internet.
