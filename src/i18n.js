export const LANGS = [['fr', 'Français'], ['en', 'English'], ['es', 'Español'], ['de', 'Deutsch'], ['it', 'Italiano'], ['pt', 'Português'], ['zh', '简体中文'], ['ja', '日本語']];
const ORDER = LANGS.map(([c]) => c);

// Each entry: [fr, en, es, de, it, pt, zh, ja]
const S = {
  title: ['AutoDex — Collection automobile', 'AutoDex — Car collection', 'AutoDex — Colección de coches', 'AutoDex — Autosammlung', 'AutoDex — Collezione di auto', 'AutoDex — Coleção de carros', 'AutoDex — 汽车图鉴', 'AutoDex — 自動車図鑑'],
  tagline: ['Photographiez, identifiez, collectionnez', 'Snap, identify, collect', 'Fotografía, identifica, colecciona', 'Fotografieren, erkennen, sammeln', 'Fotografa, riconosci, colleziona', 'Fotografe, identifique, colecione', '拍照、识别、收集', '撮って、見分けて、集めよう'],
  progress: ['Voitures débloquées', 'Unlocked cars', 'Coches desbloqueados', 'Freigeschaltete Autos', 'Auto sbloccate', 'Carros desbloqueados', '已解锁车辆', '解放した車'],
  collection: ['Collection', 'Collection', 'Colección', 'Sammlung', 'Collezione', 'Coleção', '图鉴', '図鑑'],
  by_year: ['Par année', 'By year', 'Por año', 'Nach Jahr', 'Per anno', 'Por ano', '按年份', '年別'],
  settings: ['Réglages', 'Settings', 'Ajustes', 'Einstellungen', 'Impostazioni', 'Definições', '设置', '設定'],
  filters: ['Filtres', 'Filters', 'Filtros', 'Filter', 'Filtri', 'Filtros', '筛选', 'フィルター'],
  search: ['Rechercher une marque, un modèle, une année…', 'Search brand, model, year…', 'Buscar marca, modelo, año…', 'Marke, Modell, Jahr suchen…', 'Cerca marca, modello, anno…', 'Pesquisar marca, modelo, ano…', '搜索品牌、车型、年份…', 'メーカー・車種・年式で検索…'],
  brand: ['Marque', 'Brand', 'Marca', 'Marke', 'Marca', 'Marca', '品牌', 'メーカー'],
  all_brands: ['Toutes les marques', 'All brands', 'Todas las marcas', 'Alle Marken', 'Tutte le marche', 'Todas as marcas', '全部品牌', 'すべてのメーカー'],
  type_label: ['Type', 'Type', 'Tipo', 'Typ', 'Tipo', 'Tipo', '类型', 'タイプ'],
  all_types: ['Tous les types', 'All types', 'Todos los tipos', 'Alle Typen', 'Tutti i tipi', 'Todos os tipos', '全部类型', 'すべてのタイプ'],
  rarity_label: ['Rareté', 'Rarity', 'Rareza', 'Seltenheit', 'Rarità', 'Raridade', '稀有度', 'レア度'],
  all_rarities: ['Toutes les raretés', 'All rarities', 'Todas las rarezas', 'Alle Seltenheiten', 'Tutte le rarità', 'Todas as raridades', '全部稀有度', 'すべてのレア度'],
  value: ['Valeur indicative', 'Indicative value', 'Valor orientativo', 'Richtwert', 'Valore indicativo', 'Valor indicativo', '参考价值', '参考価格'],
  all_values: ['Toutes les valeurs', 'All values', 'Todos los valores', 'Alle Werte', 'Tutti i valori', 'Todos os valores', '全部价值', 'すべての価格'],
  energy_label: ['Énergie', 'Energy', 'Energía', 'Antrieb', 'Alimentazione', 'Energia', '能源', '動力'],
  all_energies: ['Toutes les énergies', 'All energies', 'Todas las energías', 'Alle Antriebe', 'Tutte le alimentazioni', 'Todas as energias', '全部能源', 'すべての動力'],
  decade: ['Décennie', 'Decade', 'Década', 'Jahrzehnt', 'Decennio', 'Década', '年代', '年代'],
  all_decades: ['Toutes les décennies', 'All decades', 'Todas las décadas', 'Alle Jahrzehnte', 'Tutti i decenni', 'Todas as décadas', '全部年代', 'すべての年代'],
  status: ['État', 'Status', 'Estado', 'Status', 'Stato', 'Estado', '状态', '状態'],
  all_status: ['Toutes', 'All', 'Todos', 'Alle', 'Tutte', 'Todos', '全部', 'すべて'],
  owned: ['Débloquées', 'Unlocked', 'Desbloqueados', 'Freigeschaltet', 'Sbloccate', 'Desbloqueados', '已解锁', '解放済み'],
  missing: ['À trouver', 'To find', 'Por encontrar', 'Noch zu finden', 'Da trovare', 'Por encontrar', '待发现', '未発見'],
  sort: ['Tri', 'Sort', 'Orden', 'Sortierung', 'Ordine', 'Ordenar', '排序', '並べ替え'],
  'sort.year': ['Plus récentes', 'Newest', 'Más recientes', 'Neueste', 'Più recenti', 'Mais recentes', '最新', '新しい順'],
  'sort.rarity': ['Les plus rares', 'Rarest', 'Más raros', 'Seltenste', 'Più rare', 'Mais raros', '最稀有', 'レア順'],
  'sort.value': ['Les plus chères', 'Most valuable', 'Más caros', 'Wertvollste', 'Più costose', 'Mais caros', '最贵', '高い順'],
  'sort.hp': ['Les plus puissantes', 'Most powerful', 'Más potentes', 'Stärkste', 'Più potenti', 'Mais potentes', '最强马力', 'パワー順'],
  'sort.name': ['Nom', 'Name', 'Nombre', 'Name', 'Nome', 'Nome', '名称', '名前'],
  results: ['{n} voitures', '{n} cars', '{n} coches', '{n} Autos', '{n} auto', '{n} carros', '{n} 辆车', '{n} 台'],
  year_owned: ['{a}/{b} débloquées', '{a}/{b} unlocked', '{a}/{b} desbloqueados', '{a}/{b} freigeschaltet', '{a}/{b} sbloccate', '{a}/{b} desbloqueados', '已解锁 {a}/{b}', '{a}/{b} 解放'],
  show_more: ['Afficher plus', 'Show more', 'Mostrar más', 'Mehr anzeigen', 'Mostra altro', 'Mostrar mais', '显示更多', 'もっと見る'],
  capture: ['Capturer une voiture', 'Capture a car', 'Capturar un coche', 'Auto erfassen', 'Cattura un’auto', 'Capturar um carro', '捕获车辆', '車をキャプチャ'],
  close: ['Fermer', 'Close', 'Cerrar', 'Schließen', 'Chiudi', 'Fechar', '关闭', '閉じる'],
  'type.city': ['Citadine', 'City car', 'Urbano', 'Kleinwagen', 'Citycar', 'Citadino', '小型车', 'コンパクトカー'],
  'type.compact': ['Compacte', 'Hatchback', 'Compacto', 'Kompaktwagen', 'Compatta', 'Compacto', '紧凑型', 'ハッチバック'],
  'type.sedan': ['Berline', 'Sedan', 'Berlina', 'Limousine', 'Berlina', 'Sedã', '轿车', 'セダン'],
  'type.wagon': ['Break', 'Estate', 'Familiar', 'Kombi', 'Station wagon', 'Perua', '旅行车', 'ワゴン'],
  'type.coupe': ['Coupé', 'Coupe', 'Cupé', 'Coupé', 'Coupé', 'Cupê', '轿跑', 'クーペ'],
  'type.convertible': ['Cabriolet', 'Convertible', 'Descapotable', 'Cabrio', 'Cabriolet', 'Conversível', '敞篷车', 'オープンカー'],
  'type.minivan': ['Monospace', 'MPV', 'Monovolumen', 'Van', 'Monovolume', 'Monovolume', 'MPV', 'ミニバン'],
  'type.suv': ['SUV', 'SUV', 'SUV', 'SUV', 'SUV', 'SUV', 'SUV', 'SUV'],
  'type.pickup': ['Pick-up', 'Pickup', 'Pick-up', 'Pick-up', 'Pick-up', 'Picape', '皮卡', 'ピックアップ'],
  'type.van': ['Utilitaire', 'Van', 'Furgoneta', 'Transporter', 'Furgone', 'Furgão', '厢式车', 'バン'],
  'type.sports': ['Sportive', 'Sports car', 'Deportivo', 'Sportwagen', 'Sportiva', 'Esportivo', '跑车', 'スポーツカー'],
  'type.supercar': ['Supercar', 'Supercar', 'Superdeportivo', 'Supersportwagen', 'Supercar', 'Superesportivo', '超级跑车', 'スーパーカー'],
  'energy.petrol': ['Essence', 'Petrol', 'Gasolina', 'Benzin', 'Benzina', 'Gasolina', '汽油', 'ガソリン'],
  'energy.diesel': ['Diesel', 'Diesel', 'Diésel', 'Diesel', 'Diesel', 'Diesel', '柴油', 'ディーゼル'],
  'energy.hybrid': ['Hybride', 'Hybrid', 'Híbrido', 'Hybrid', 'Ibrida', 'Híbrido', '混合动力', 'ハイブリッド'],
  'energy.electric': ['Électrique', 'Electric', 'Eléctrico', 'Elektrisch', 'Elettrica', 'Elétrico', '纯电动', '電気'],
  'rarity.common': ['Commune', 'Common', 'Común', 'Häufig', 'Comune', 'Comum', '普通', 'コモン'],
  'rarity.uncommon': ['Peu commune', 'Uncommon', 'Poco común', 'Ungewöhnlich', 'Non comune', 'Incomum', '少见', 'アンコモン'],
  'rarity.rare': ['Rare', 'Rare', 'Rara', 'Selten', 'Rara', 'Rara', '稀有', 'レア'],
  'rarity.epic': ['Épique', 'Epic', 'Épica', 'Episch', 'Epica', 'Épica', '史诗', 'エピック'],
  'rarity.legendary': ['Légendaire', 'Legendary', 'Legendaria', 'Legendär', 'Leggendaria', 'Lendária', '传说', 'レジェンド'],
  'paint.white': ['Blanc', 'White', 'Blanco', 'Weiß', 'Bianco', 'Branco', '白色', 'ホワイト'],
  'paint.black': ['Noir', 'Black', 'Negro', 'Schwarz', 'Nero', 'Preto', '黑色', 'ブラック'],
  'paint.silver': ['Gris argent', 'Silver', 'Plata', 'Silber', 'Argento', 'Prata', '银色', 'シルバー'],
  'paint.red': ['Rouge', 'Red', 'Rojo', 'Rot', 'Rosso', 'Vermelho', '红色', 'レッド'],
  'paint.blue': ['Bleu', 'Blue', 'Azul', 'Blau', 'Blu', 'Azul', '蓝色', 'ブルー'],
  ai_recognizable: ['reconnue par l’IA', 'AI-recognisable', 'reconocible por IA', 'KI-erkennbar', 'riconoscibile dall’IA', 'reconhecível pela IA', '可由 AI 识别', 'AI 認識対応'],
  hp: ['ch', 'hp', 'CV', 'PS', 'CV', 'cv', '马力', '馬力'],
  power: ['Puissance', 'Power', 'Potencia', 'Leistung', 'Potenza', 'Potência', '功率', '出力'],
  paints: ['Teintes de carrosserie', 'Paint colours', 'Colores de carrocería', 'Lackfarben', 'Colori carrozzeria', 'Cores de pintura', '车漆颜色', 'ボディカラー'],
  photos: ['Vos photos', 'Your photos', 'Tus fotos', 'Deine Fotos', 'Le tue foto', 'Suas fotos', '你的照片', 'あなたの写真'],
  verified_ai: ['validée par l’IA ({pct} %)', 'AI-verified ({pct}%)', 'validada por IA ({pct} %)', 'KI-bestätigt ({pct} %)', 'verificata dall’IA ({pct}%)', 'validada pela IA ({pct}%)', 'AI 验证（{pct}%）', 'AI 確認済み（{pct}%）'],
  manual: ['ajout manuel', 'manual entry', 'añadido manual', 'manuell hinzugefügt', 'aggiunta manuale', 'adição manual', '手动添加', '手動追加'],
  delete_photo: ['Supprimer la photo', 'Delete photo', 'Eliminar foto', 'Foto löschen', 'Elimina foto', 'Excluir foto', '删除照片', '写真を削除'],
  specs_note: ['Caractéristiques d’une version représentative et valeur indicative actuelle : elles varient selon la finition, le marché et l’état.', 'Specifications of a representative version and indicative current value: they vary with trim, market and condition.', 'Datos de una versión representativa y valor orientativo actual: varían según acabado, mercado y estado.', 'Daten einer repräsentativen Version und aktueller Richtwert: abhängig von Ausstattung, Markt und Zustand.', 'Dati di una versione rappresentativa e valore indicativo attuale: variano per allestimento, mercato e condizioni.', 'Dados de uma versão representativa e valor indicativo atual: variam conforme versão, mercado e estado.', '数据为代表性版本，价值为当前参考值，会因配置、市场和车况而不同。', '代表的なグレードの諸元と現在の参考価格です。グレード・市場・状態で変わります。'],
  locked_text: ['Fiche verrouillée. Photographiez cette voiture pour débloquer sa puissance, son énergie, sa valeur, ses teintes et sa description.', 'Locked entry. Photograph this car to unlock its power, energy, value, paint colours and description.', 'Ficha bloqueada. Fotografía este coche para desbloquear su potencia, energía, valor, colores y descripción.', 'Gesperrter Eintrag. Fotografiere dieses Auto, um Leistung, Antrieb, Wert, Farben und Beschreibung freizuschalten.', 'Scheda bloccata. Fotografa quest’auto per sbloccare potenza, alimentazione, valore, colori e descrizione.', 'Ficha bloqueada. Fotografe este carro para desbloquear potência, energia, valor, cores e descrição.', '尚未解锁。拍下这辆车即可解锁功率、能源、价值、车漆和介绍。', '未解放です。この車を撮影すると、出力・動力・価格・カラー・解説が解放されます。'],
  add_photo: ['Ajouter une photo', 'Add a photo', 'Añadir una foto', 'Foto hinzufügen', 'Aggiungi foto', 'Adicionar foto', '添加照片', '写真を追加'],
  capture_this: ['Capturer cette voiture', 'Capture this car', 'Capturar este coche', 'Dieses Auto erfassen', 'Cattura quest’auto', 'Capturar este carro', '捕获这辆车', 'この車をキャプチャ'],
  capture_of: ['Capturer : {name}', 'Capture: {name}', 'Capturar: {name}', 'Erfassen: {name}', 'Cattura: {name}', 'Capturar: {name}', '捕获：{name}', 'キャプチャ：{name}'],
  shoot: ['Déclencher', 'Take picture', 'Disparar', 'Auslösen', 'Scatta', 'Fotografar', '拍摄', '撮影'],
  take_photo: ['Prendre une photo', 'Take a photo', 'Hacer una foto', 'Foto aufnehmen', 'Scatta una foto', 'Tirar foto', '拍照', '写真を撮る'],
  choose_photo: ['Choisir une photo', 'Choose a photo', 'Elegir una foto', 'Foto auswählen', 'Scegli una foto', 'Escolher foto', '选择照片', '写真を選ぶ'],
  photo_tip: ['Cadrez la voiture entière, de trois quarts, sans trop de reflets. L’analyse se fait sur cet appareil.', 'Frame the whole car from a three-quarter angle, avoiding strong reflections. Analysis runs on this device.', 'Encuadra el coche entero en tres cuartos, sin reflejos fuertes. El análisis se hace en este dispositivo.', 'Das ganze Auto schräg von vorn aufnehmen, ohne starke Spiegelungen. Die Analyse läuft auf diesem Gerät.', 'Inquadra l’auto intera di tre quarti, senza riflessi forti. L’analisi avviene su questo dispositivo.', 'Enquadre o carro inteiro em três quartos, sem reflexos fortes. A análise é feita neste aparelho.', '请以斜前方角度拍下整车，避免强反光。识别在本设备上完成。', '車全体を斜め前から、強い反射を避けて撮影してください。解析はこの端末内で行われます。'],
  analysing: ['Analyse en cours…', 'Analysing…', 'Analizando…', 'Analyse läuft…', 'Analisi in corso…', 'Analisando…', '正在识别…', '解析中…'],
  ai_unavailable: ['IA indisponible : choisissez la voiture manuellement.', 'AI unavailable: pick the car manually.', 'IA no disponible: elige el coche manualmente.', 'KI nicht verfügbar: Auto manuell auswählen.', 'IA non disponibile: scegli l’auto manualmente.', 'IA indisponível: escolha o carro manualmente.', 'AI 不可用：请手动选择车辆。', 'AI を利用できません。手動で選んでください。'],
  bad_image: ['Image illisible ou trop lourde.', 'Unreadable or oversized image.', 'Imagen ilegible o demasiado grande.', 'Bild unlesbar oder zu groß.', 'Immagine illeggibile o troppo grande.', 'Imagem ilegível ou grande demais.', '图片无法读取或过大。', '画像を読めないか、大きすぎます。'],
  ai_confident: ['L’IA est assez sûre d’elle. Confirmez la bonne voiture :', 'The AI is fairly confident. Confirm the right car:', 'La IA está bastante segura. Confirma el coche correcto:', 'Die KI ist recht sicher. Bestätige das richtige Auto:', 'L’IA è abbastanza sicura. Conferma l’auto giusta:', 'A IA está bastante confiante. Confirme o carro certo:', 'AI 较有把握，请确认正确车型：', 'AI はかなり自信があります。正しい車を確認してください：'],
  ai_unsure: ['L’IA hésite. Choisissez une proposition ou passez en mode manuel.', 'The AI is unsure. Pick a suggestion or switch to manual mode.', 'La IA duda. Elige una propuesta o usa el modo manual.', 'Die KI ist unsicher. Vorschlag wählen oder manuell eintragen.', 'L’IA è incerta. Scegli un suggerimento o usa la modalità manuale.', 'A IA está indecisa. Escolha uma sugestão ou use o modo manual.', 'AI 不确定。请选择候选或改用手动模式。', 'AI は迷っています。候補を選ぶか手動モードにしてください。'],
  preset_not_found: ['La voiture visée n’apparaît pas dans les propositions de l’IA. Vous pouvez la valider manuellement.', 'The selected car is not among the AI suggestions. You can confirm it manually.', 'El coche elegido no aparece entre las propuestas. Puedes confirmarlo manualmente.', 'Das gewählte Auto ist nicht unter den Vorschlägen. Du kannst es manuell bestätigen.', 'L’auto scelta non è tra i suggerimenti. Puoi confermarla manualmente.', 'O carro escolhido não está entre as sugestões. Você pode confirmá-lo manualmente.', '所选车辆不在 AI 候选中，可手动确认。', '選択した車は候補にありません。手動で確認できます。'],
  this_one: ['C’est elle', 'This one', 'Es este', 'Das ist es', 'È lei', 'É este', '就是它', 'これ'],
  confirm_manual: ['Valider « {name} » manuellement', 'Confirm “{name}” manually', 'Confirmar «{name}» manualmente', '„{name}“ manuell bestätigen', 'Conferma «{name}» manualmente', 'Confirmar “{name}” manualmente', '手动确认“{name}”', '「{name}」を手動で確定'],
  back_to_ai: ['Revenir aux propositions', 'Back to suggestions', 'Volver a las propuestas', 'Zurück zu den Vorschlägen', 'Torna ai suggerimenti', 'Voltar às sugestões', '返回候选', '候補に戻る'],
  manual_mode: ['Mode manuel', 'Manual mode', 'Modo manual', 'Manueller Modus', 'Modalità manuale', 'Modo manual', '手动模式', '手動モード'],
  retake: ['Autre photo', 'Another photo', 'Otra foto', 'Anderes Foto', 'Altra foto', 'Outra foto', '换一张', '撮り直す'],
  manual_note: ['L’ajout manuel débloque aussi la fiche ; il est signalé comme non vérifié par l’IA.', 'Manual entries unlock the card too, marked as not AI-verified.', 'El añadido manual también desbloquea la ficha, marcada como no verificada por IA.', 'Manuelle Einträge schalten die Karte ebenfalls frei und sind als nicht KI-geprüft markiert.', 'Anche l’aggiunta manuale sblocca la scheda, segnata come non verificata dall’IA.', 'A adição manual também desbloqueia a ficha, marcada como não verificada pela IA.', '手动添加同样会解锁，并标记为未经 AI 验证。', '手動追加でも解放されますが、AI 未確認と表示されます。'],
  language: ['Langue', 'Language', 'Idioma', 'Sprache', 'Lingua', 'Idioma', '语言', '言語'],
  backup: ['Sauvegarde complète', 'Full backup', 'Copia completa', 'Vollständige Sicherung', 'Backup completo', 'Cópia completa', '完整备份', '完全バックアップ'],
  backup_note: ['L’export contient toutes vos photos et captures dans un seul fichier JSON. L’import peut fusionner ou remplacer la collection.', 'The export holds every photo and capture in one JSON file. Import can merge with or replace the collection.', 'La exportación incluye todas tus fotos y capturas en un único JSON. La importación puede fusionar o reemplazar.', 'Der Export enthält alle Fotos und Funde in einer JSON-Datei. Der Import kann zusammenführen oder ersetzen.', 'L’esportazione contiene tutte le foto e catture in un unico JSON. L’importazione può unire o sostituire.', 'A exportação contém todas as fotos e capturas num único JSON. A importação pode mesclar ou substituir.', '导出文件为单个 JSON，包含全部照片与收集记录。导入可合并或替换。', 'エクスポートはすべての写真と記録を 1 つの JSON にまとめます。インポートは統合または置き換えができます。'],
  export: ['Exporter', 'Export', 'Exportar', 'Exportieren', 'Esporta', 'Exportar', '导出', 'エクスポート'],
  import: ['Importer', 'Import', 'Importar', 'Importieren', 'Importa', 'Importar', '导入', 'インポート'],
  import_mode: ['Mode d’import', 'Import mode', 'Modo de importación', 'Importmodus', 'Modalità di importazione', 'Modo de importação', '导入方式', 'インポート方法'],
  import_merge: ['Fusionner', 'Merge', 'Fusionar', 'Zusammenführen', 'Unisci', 'Mesclar', '合并', '統合'],
  import_replace: ['Remplacer', 'Replace', 'Reemplazar', 'Ersetzen', 'Sostituisci', 'Substituir', '替换', '置き換え'],
  server: ['Serveur mobile', 'Mobile server', 'Servidor móvil', 'Mobil-Server', 'Server mobile', 'Servidor móvel', '移动端服务器', 'モバイル用サーバー'],
  server_note: ['Diffuse AutoDex sur votre réseau local : ouvrez l’adresse sur votre téléphone (même Wi-Fi) et synchronisez avec le code. Arrêtez le serveur après usage.', 'Serves AutoDex on your local network: open the address on your phone (same Wi-Fi) and sync with the code. Stop the server when done.', 'Publica AutoDex en tu red local: abre la dirección en el móvil (misma Wi-Fi) y sincroniza con el código. Detén el servidor al terminar.', 'Stellt AutoDex im lokalen Netz bereit: Adresse am Handy öffnen (gleiches WLAN) und mit dem Code synchronisieren. Danach Server stoppen.', 'Pubblica AutoDex sulla rete locale: apri l’indirizzo sul telefono (stessa Wi-Fi) e sincronizza con il codice. Ferma il server dopo l’uso.', 'Publica o AutoDex na rede local: abra o endereço no celular (mesmo Wi-Fi) e sincronize com o código. Pare o servidor depois.', '在局域网内提供 AutoDex：在同一 Wi-Fi 的手机上打开地址，并用配对码同步。用完请停止服务器。', 'ローカルネットワークで AutoDex を公開します。同じ Wi-Fi のスマホでアドレスを開き、コードで同期してください。使用後は停止してください。'],
  port: ['Port', 'Port', 'Puerto', 'Port', 'Porta', 'Porta', '端口', 'ポート'],
  server_start: ['Démarrer le serveur', 'Start server', 'Iniciar servidor', 'Server starten', 'Avvia server', 'Iniciar servidor', '启动服务器', 'サーバー起動'],
  server_stop: ['Arrêter le serveur', 'Stop server', 'Detener servidor', 'Server stoppen', 'Ferma server', 'Parar servidor', '停止服务器', 'サーバー停止'],
  server_urls: ['Ouvrez une de ces adresses sur le téléphone :', 'Open one of these addresses on the phone:', 'Abre una de estas direcciones en el móvil:', 'Öffne eine dieser Adressen am Handy:', 'Apri uno di questi indirizzi sul telefono:', 'Abra um destes endereços no celular:', '在手机上打开以下地址之一：', 'スマホで次のいずれかを開いてください：'],
  pairing_code: ['Code de jumelage', 'Pairing code', 'Código de emparejamiento', 'Kopplungscode', 'Codice di abbinamento', 'Código de pareamento', '配对码', 'ペアリングコード'],
  sync: ['Synchronisation', 'Sync', 'Sincronización', 'Synchronisierung', 'Sincronizzazione', 'Sincronização', '同步', '同期'],
  sync_note: ['Synchronise cet appareil avec un serveur AutoDex (application de bureau ou serveur auto-hébergé).', 'Syncs this device with an AutoDex server (desktop app or self-hosted server).', 'Sincroniza este dispositivo con un servidor AutoDex (aplicación de escritorio o servidor propio).', 'Synchronisiert dieses Gerät mit einem AutoDex-Server (Desktop-App oder eigener Server).', 'Sincronizza questo dispositivo con un server AutoDex (app desktop o server personale).', 'Sincroniza este aparelho com um servidor AutoDex (app de computador ou servidor próprio).', '将本设备与 AutoDex 服务器（桌面应用或自建服务器）同步。', 'この端末を AutoDex サーバー（デスクトップアプリまたは自前サーバー）と同期します。'],
  sync_host_note: ['Cette page est servie par un serveur AutoDex : saisissez son code de jumelage pour synchroniser.', 'This page is served by an AutoDex server: enter its pairing code to sync.', 'Esta página la sirve un servidor AutoDex: introduce su código para sincronizar.', 'Diese Seite stammt von einem AutoDex-Server: Kopplungscode eingeben, um zu synchronisieren.', 'Questa pagina è servita da un server AutoDex: inserisci il codice per sincronizzare.', 'Esta página é servida por um servidor AutoDex: digite o código para sincronizar.', '此页面由 AutoDex 服务器提供：输入配对码即可同步。', 'このページは AutoDex サーバーから配信されています。コードを入力して同期してください。'],
  server_address: ['Adresse du serveur', 'Server address', 'Dirección del servidor', 'Serveradresse', 'Indirizzo del server', 'Endereço do servidor', '服务器地址', 'サーバーアドレス'],
  sync_now: ['Synchroniser', 'Sync now', 'Sincronizar', 'Jetzt synchronisieren', 'Sincronizza', 'Sincronizar', '立即同步', '今すぐ同期'],
  last_sync: ['Dernière synchronisation :', 'Last sync:', 'Última sincronización:', 'Letzte Synchronisierung:', 'Ultima sincronizzazione:', 'Última sincronização:', '上次同步：', '最終同期：'],
  syncing: ['Synchronisation…', 'Syncing…', 'Sincronizando…', 'Synchronisiere…', 'Sincronizzazione…', 'Sincronizando…', '同步中…', '同期中…'],
  synced: ['Collection synchronisée.', 'Collection synced.', 'Colección sincronizada.', 'Sammlung synchronisiert.', 'Collezione sincronizzata.', 'Coleção sincronizada.', '图鉴已同步。', '図鑑を同期しました。'],
  imported: ['Import terminé.', 'Import complete.', 'Importación completada.', 'Import abgeschlossen.', 'Importazione completata.', 'Importação concluída.', '导入完成。', 'インポート完了。'],
  'err.bad_code': ['Code de jumelage incorrect.', 'Wrong pairing code.', 'Código incorrecto.', 'Falscher Kopplungscode.', 'Codice errato.', 'Código incorreto.', '配对码错误。', 'コードが違います。'],
  'err.rate_limited': ['Trop d’essais : patientez une minute.', 'Too many attempts: wait a minute.', 'Demasiados intentos: espera un minuto.', 'Zu viele Versuche: eine Minute warten.', 'Troppi tentativi: attendi un minuto.', 'Muitas tentativas: aguarde um minuto.', '尝试次数过多，请稍候一分钟。', '試行回数が多すぎます。1 分待ってください。'],
  'err.sync_failed': ['Serveur injoignable.', 'Server unreachable.', 'Servidor inaccesible.', 'Server nicht erreichbar.', 'Server non raggiungibile.', 'Servidor inacessível.', '无法连接服务器。', 'サーバーに接続できません。'],
  'err.bad_url': ['Adresse invalide (http ou https).', 'Invalid address (http or https).', 'Dirección no válida (http o https).', 'Ungültige Adresse (http oder https).', 'Indirizzo non valido (http o https).', 'Endereço inválido (http ou https).', '地址无效（需 http 或 https）。', 'アドレスが無効です（http/https）。'],
  'err.invalid': ['Fichier ou données invalides.', 'Invalid file or data.', 'Archivo o datos no válidos.', 'Ungültige Datei oder Daten.', 'File o dati non validi.', 'Arquivo ou dados inválidos.', '文件或数据无效。', 'ファイルまたはデータが無効です。'],
  'err.too_large': ['Fichier trop volumineux.', 'File too large.', 'Archivo demasiado grande.', 'Datei zu groß.', 'File troppo grande.', 'Arquivo grande demais.', '文件过大。', 'ファイルが大きすぎます。'],
  about: ['AutoDex par jeremdevgit — logiciel libre (GPL-3.0-or-later), sans compte ni publicité. Vos photos restent sur vos appareils.', 'AutoDex by jeremdevgit — free software (GPL-3.0-or-later), no account, no ads. Your photos stay on your devices.', 'AutoDex de jeremdevgit — software libre (GPL-3.0-or-later), sin cuenta ni anuncios. Tus fotos se quedan en tus dispositivos.', 'AutoDex von jeremdevgit — freie Software (GPL-3.0-or-later), ohne Konto und Werbung. Deine Fotos bleiben auf deinen Geräten.', 'AutoDex di jeremdevgit — software libero (GPL-3.0-or-later), senza account né pubblicità. Le foto restano sui tuoi dispositivi.', 'AutoDex por jeremdevgit — software livre (GPL-3.0-or-later), sem conta nem anúncios. Suas fotos ficam nos seus aparelhos.', 'AutoDex 由 jeremdevgit 开发 — 自由软件（GPL-3.0-or-later），无需账户、无广告。照片只保存在你的设备上。', 'AutoDex（jeremdevgit 作）— フリーソフトウェア（GPL-3.0-or-later）。アカウント・広告なし。写真は端末内に残ります。'],
  credits: ['Reconnaissance : ResNet-50 Stanford Cars de ZEDEDA (Apache-2.0), quantifié en int8. 196 modèles reconnaissables ; les autres se valident manuellement.', 'Recognition: ZEDEDA ResNet-50 Stanford Cars (Apache-2.0), int8-quantised. 196 recognisable models; others are confirmed manually.', 'Reconocimiento: ResNet-50 Stanford Cars de ZEDEDA (Apache-2.0), cuantizado int8. 196 modelos reconocibles; el resto se confirma a mano.', 'Erkennung: ZEDEDA ResNet-50 Stanford Cars (Apache-2.0), int8-quantisiert. 196 erkennbare Modelle; andere manuell bestätigen.', 'Riconoscimento: ResNet-50 Stanford Cars di ZEDEDA (Apache-2.0), quantizzato int8. 196 modelli riconoscibili; gli altri si confermano a mano.', 'Reconhecimento: ResNet-50 Stanford Cars da ZEDEDA (Apache-2.0), quantizado int8. 196 modelos reconhecíveis; os demais são confirmados manualmente.', '识别模型：ZEDEDA ResNet-50 Stanford Cars（Apache-2.0），int8 量化。可识别 196 款车型，其余需手动确认。', '認識モデル：ZEDEDA ResNet-50 Stanford Cars（Apache-2.0、int8 量子化）。196 車種を認識し、その他は手動で確定します。'],
};

const TYPE_TEXT = {
  city: ['Une citadine pensée pour la ville et les trajets du quotidien.', 'A city car built for urban streets and everyday trips.', 'Un urbano pensado para la ciudad y el día a día.', 'Ein Kleinwagen für die Stadt und den Alltag.', 'Una citycar pensata per la città e la vita di ogni giorno.', 'Um citadino pensado para a cidade e o dia a dia.', '一款为城市和日常通勤打造的小型车。', '街乗りと日常の移動のためのコンパクトカー。'],
  compact: ['Une compacte polyvalente, référence de sa catégorie.', 'A versatile hatchback and a benchmark in its class.', 'Un compacto polivalente, referente de su categoría.', 'Ein vielseitiger Kompaktwagen und Maßstab seiner Klasse.', 'Una compatta versatile, punto di riferimento della categoria.', 'Um compacto versátil, referência na sua categoria.', '一款全能紧凑型车，同级标杆。', 'クラスの基準となる万能ハッチバック。'],
  sedan: ['Une berline équilibrée pour voyager confortablement.', 'A balanced sedan made for comfortable journeys.', 'Una berlina equilibrada para viajar con confort.', 'Eine ausgewogene Limousine für komfortable Reisen.', 'Una berlina equilibrata per viaggiare comodi.', 'Um sedã equilibrado para viajar com conforto.', '一款均衡舒适、适合长途的轿车。', '快適な長距離移動のためのバランスの取れたセダン。'],
  wagon: ['Un break spacieux, taillé pour les familles et les longs trajets.', 'A roomy estate made for families and long trips.', 'Un familiar espacioso para familias y viajes largos.', 'Ein geräumiger Kombi für Familien und lange Strecken.', 'Una station wagon spaziosa per famiglie e lunghi viaggi.', 'Uma perua espaçosa para famílias e viagens longas.', '一款宽敞的旅行车，适合家庭与长途。', '家族と長旅のための広々としたワゴン。'],
  coupe: ['Un coupé élégant au caractère affirmé.', 'An elegant coupe with a strong personality.', 'Un cupé elegante con mucho carácter.', 'Ein elegantes Coupé mit ausgeprägtem Charakter.', 'Una coupé elegante dal carattere deciso.', 'Um cupê elegante e cheio de personalidade.', '一款个性鲜明的优雅轿跑。', '個性際立つエレガントなクーペ。'],
  convertible: ['Un cabriolet pour rouler cheveux au vent.', 'A convertible for open-air driving.', 'Un descapotable para conducir al aire libre.', 'Ein Cabrio für Fahrten unter freiem Himmel.', 'Una cabriolet per guidare a cielo aperto.', 'Um conversível para dirigir a céu aberto.', '一款享受敞篷驾驶乐趣的车型。', '風を感じて走るオープンカー。'],
  minivan: ['Un monospace modulable, conçu pour l’espace à bord.', 'A flexible MPV designed around interior space.', 'Un monovolumen modular pensado para el espacio interior.', 'Ein variabler Van mit viel Platz im Innenraum.', 'Una monovolume modulabile pensata per lo spazio.', 'Um monovolume versátil pensado para o espaço interno.', '一款以车内空间为核心的多功能 MPV。', '室内空間を重視した多用途ミニバン。'],
  suv: ['Un SUV à la position de conduite haute et polyvalent.', 'A versatile SUV with a high driving position.', 'Un SUV polivalente con posición de conducción elevada.', 'Ein vielseitiger SUV mit erhöhter Sitzposition.', 'Un SUV versatile con posizione di guida rialzata.', 'Um SUV versátil com posição de condução elevada.', '一款坐姿高、用途广的 SUV。', '視点が高く多用途に使える SUV。'],
  pickup: ['Un pick-up robuste, fait pour travailler et tracter.', 'A tough pickup built for work and towing.', 'Un pick-up robusto para trabajar y remolcar.', 'Ein robuster Pick-up für Arbeit und Anhängerbetrieb.', 'Un pick-up robusto per lavorare e trainare.', 'Uma picape robusta para trabalho e reboque.', '一款坚固耐用、适合工作和拖拽的皮卡。', '仕事と牽引のための頑丈なピックアップ。'],
  van: ['Un utilitaire pratique, pensé pour transporter.', 'A practical van designed to carry people or cargo.', 'Una furgoneta práctica pensada para transportar.', 'Ein praktischer Transporter für Personen oder Ladung.', 'Un furgone pratico pensato per trasportare.', 'Um furgão prático pensado para transportar.', '一款实用的厢式车，专为运输设计。', '人や荷物を運ぶための実用的なバン。'],
  sports: ['Une sportive tournée vers le plaisir de conduite.', 'A sports car built for driving pleasure.', 'Un deportivo pensado para el placer de conducir.', 'Ein Sportwagen für puren Fahrspaß.', 'Una sportiva pensata per il piacere di guida.', 'Um esportivo feito para o prazer de dirigir.', '一款专注驾驶乐趣的跑车。', '運転の楽しさを追求したスポーツカー。'],
  supercar: ['Une machine d’exception, recherchée pour ses performances et sa rareté.', 'An exceptional machine prized for performance and rarity.', 'Una máquina excepcional, codiciada por sus prestaciones y rareza.', 'Eine außergewöhnliche Maschine, begehrt für Leistung und Seltenheit.', 'Una macchina eccezionale, ricercata per prestazioni e rarità.', 'Uma máquina excepcional, cobiçada pelo desempenho e raridade.', '一台以性能和稀有度著称的非凡座驾。', '性能と希少性で憧れの的となる特別なマシン。'],
};

const DESC = [
  '{name}, modèle {year}. {type} Version représentative : environ {hp} ch, motorisation {energy}.',
  '{name}, {year} model. {type} Representative version: about {hp} hp, {energy} powertrain.',
  '{name}, modelo de {year}. {type} Versión representativa: unos {hp} CV, motor {energy}.',
  '{name}, Modelljahr {year}. {type} Repräsentative Version: rund {hp} PS, Antrieb {energy}.',
  '{name}, modello {year}. {type} Versione rappresentativa: circa {hp} CV, alimentazione {energy}.',
  '{name}, modelo {year}. {type} Versão representativa: cerca de {hp} cv, motorização {energy}.',
  '{name}（{year} 年款）。{type}代表性版本：约 {hp} 马力，{energy}动力。',
  '{name}（{year} 年式）。{type}代表的なグレード：約 {hp} 馬力、{energy}。',
];

function idx(lang) {
  const i = ORDER.indexOf(lang);
  return i < 0 ? 1 : i;
}

function fill(text, vars) {
  return text.replace(/\{(\w+)\}/g, (_, k) => vars?.[k] ?? '');
}

export function makeT(lang) {
  const i = idx(lang);
  return (key, vars) => {
    const row = S[key];
    if (!row) return '';
    return fill(row[i] || row[1], vars);
  };
}

export function describe(lang, car) {
  const i = idx(lang);
  const energy = S[`energy.${car.energy}`][i];
  return fill(DESC[i], {
    name: `${car.brand} ${car.model}`,
    year: car.year,
    type: TYPE_TEXT[car.type][i],
    hp: car.hp,
    energy: i < 6 ? energy.toLowerCase() : energy,
  });
}

export function detectLang() {
  const nav = (typeof navigator !== 'undefined' && navigator.language || 'fr').toLowerCase();
  const code = nav.split('-')[0];
  return ORDER.includes(code) ? code : 'en';
}

export const KEYS = Object.keys(S);
export const ROWS = S;
export const TYPE_ROWS = TYPE_TEXT;
