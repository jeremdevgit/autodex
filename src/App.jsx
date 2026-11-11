import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Check, ChevronLeft, Download, Gauge, Grid3x3, ImagePlus, Lock, Search, Server, Settings, Sparkles, Trash2, Upload, X, Zap, CalendarRange, RefreshCw } from 'lucide-react';
import { catalog, byId, brands, years, TYPES, ENERGIES, RARITIES, VALUE_BANDS, rarityRank } from './catalog';
import { readState, writeState, readSettings, writeSettings, newSighting, deleteSighting, importFile, exportState, compressPhoto } from './storage';
import { liveSightings, mergeStates } from './merge';
import { recognize, preload, CONFIDENT } from './recognition';
import { detectHostServer, isDesktop, syncWithServer, startDesktopServer, stopDesktopServer, desktopServerStatus } from './sync';
import { LANGS, makeT, detectLang, describe } from './i18n';
import { silhouetteSvg } from './shapes';
import Car3D from './Car3D';

const PAGE = 60;

function Silhouette({ type, color, locked }) {
  const s = silhouetteSvg(type);
  return (
    <svg className={`silhouette ${locked ? 'locked' : ''}`} viewBox={s.viewBox} aria-hidden="true">
      <polygon points={s.body} fill={locked ? 'currentColor' : color} />
      {!locked && <polygon points={s.glass} fill="#1b2630" opacity=".85" />}
      {s.wheels.map((w, i) => <circle key={i} cx={w.cx} cy={w.cy} r={w.r} fill={locked ? 'currentColor' : '#15191c'} />)}
    </svg>
  );
}

function money(value, lang) {
  return new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function Card({ car, sighting, t, onOpen }) {
  return (
    <button className={`card rarity-${car.rarity} ${sighting ? 'owned' : ''}`} onClick={() => onOpen(car.id)}>
      <div className="card-visual">
        {sighting ? <img src={sighting.photo} alt="" loading="lazy" /> : <Silhouette type={car.type} locked />}
        <span className="badge">{t(`rarity.${car.rarity}`)}</span>
        {!sighting && <Lock className="lock" size={16} />}
      </div>
      <div className="card-body">
        <strong>{car.brand} {car.model}</strong>
        <span>{car.year} · {t(`type.${car.type}`)}</span>
      </div>
    </button>
  );
}

function Detail({ car, sightings, t, lang, onClose, onCapture, onDelete }) {
  const owned = sightings.length > 0;
  const [paint, setPaint] = useState(car.paints[0]);
  useEffect(() => setPaint(car.paints[0]), [car]);
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${car.brand} ${car.model}`}>
      <div className="sheet detail">
        <button className="icon close" onClick={onClose} aria-label={t('close')}><X size={20} /></button>
        <div className="detail-hero">
          <Car3D type={car.type} color={owned ? paint.hex : '#3a4650'} />
          <div className="hero-text">
            <span className={`pill rarity-${car.rarity}`}>{t(`rarity.${car.rarity}`)}</span>
            <h2>{car.brand} {car.model}</h2>
            <p>{car.year} · {t(`type.${car.type}`)}{car.ai !== null ? ` · ${t('ai_recognizable')}` : ''}</p>
          </div>
        </div>
        {owned ? (
          <>
            <div className="stats">
              <div><Zap size={16} /><b>{car.hp} {t('hp')}</b><span>{t('power')}</span></div>
              <div><Gauge size={16} /><b>{t(`energy.${car.energy}`)}</b><span>{t('energy_label')}</span></div>
              <div><Sparkles size={16} /><b>{money(car.value, lang)}</b><span>{t('value')}</span></div>
            </div>
            <p className="description">{describe(lang, car)}</p>
            <h3>{t('paints')}</h3>
            <div className="paints">
              {car.paints.map(p => (
                <button key={p.name} className={p === paint ? 'on' : ''} onClick={() => setPaint(p)}>
                  <i style={{ background: p.hex }} />{p.generic ? t(`paint.${p.name}`) : p.name}
                </button>
              ))}
            </div>
            <h3>{t('photos')}</h3>
            <div className="photos">
              {sightings.map(s => (
                <figure key={s.id}>
                  <img src={s.photo} alt="" />
                  <figcaption>
                    {new Date(s.createdAt).toLocaleDateString(lang)} · {s.method === 'ai' ? t('verified_ai', { pct: Math.round(s.confidence * 100) }) : t('manual')}
                    <button className="icon" onClick={() => onDelete(s.id)} aria-label={t('delete_photo')}><Trash2 size={14} /></button>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="fine">{t('specs_note')}</p>
          </>
        ) : (
          <div className="locked-panel">
            <Lock size={28} />
            <p>{t('locked_text')}</p>
          </div>
        )}
        <button className="primary" onClick={() => onCapture(car.id)}><Camera size={18} />{owned ? t('add_photo') : t('capture_this')}</button>
      </div>
    </div>
  );
}

function CaptureFlow({ t, lang, presetCarId, onClose, onSave }) {
  const [photo, setPhoto] = useState(null);
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [manual, setManual] = useState(false);
  const [query, setQuery] = useState('');
  const [stream, setStream] = useState(null);
  const video = useRef(null);
  const fileInput = useRef(null);
  const preset = presetCarId ? byId.get(presetCarId) : null;

  useEffect(() => { preload(); }, []);
  useEffect(() => () => stream?.getTracks().forEach(tr => tr.stop()), [stream]);
  useEffect(() => { if (video.current && stream) video.current.srcObject = stream; }, [stream]);

  async function analyse(dataUrl) {
    setPhoto(dataUrl);
    setResults(null);
    setError('');
    setBusy(true);
    try { setResults(await recognize(dataUrl)); } catch { setError(t('ai_unavailable')); setManual(true); }
    setBusy(false);
  }
  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try { await analyse(await compressPhoto(file)); } catch { setError(t('bad_image')); }
  }
  async function openCamera() {
    try { setStream(await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })); }
    catch { fileInput.current?.click(); }
  }
  async function shoot() {
    const v = video.current;
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 960 / Math.max(v.videoWidth, v.videoHeight));
    canvas.width = Math.round(v.videoWidth * scale);
    canvas.height = Math.round(v.videoHeight * scale);
    canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height);
    stream.getTracks().forEach(tr => tr.stop());
    setStream(null);
    await analyse(canvas.toDataURL('image/jpeg', 0.82));
  }

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter(c => !q || `${c.brand} ${c.model} ${c.year}`.toLowerCase().includes(q)).slice(0, 40);
  }, [query]);
  const top = results?.[0];
  const presetMatch = preset && results?.find(r => r.car?.id === preset.id);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={t('capture')}>
      <div className="sheet capture">
        <button className="icon close" onClick={onClose} aria-label={t('close')}><X size={20} /></button>
        <h2>{preset ? t('capture_of', { name: `${preset.brand} ${preset.model}` }) : t('capture')}</h2>
        <input ref={fileInput} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
        {stream ? (
          <div className="viewfinder">
            <video ref={video} autoPlay playsInline muted />
            <button className="primary" onClick={shoot}><Camera size={18} />{t('shoot')}</button>
          </div>
        ) : !photo ? (
          <div className="pick">
            <button className="primary" onClick={openCamera}><Camera size={18} />{t('take_photo')}</button>
            <button onClick={() => fileInput.current?.click()}><ImagePlus size={18} />{t('choose_photo')}</button>
            <p className="fine">{t('photo_tip')}</p>
          </div>
        ) : (
          <div className="analysis">
            <img src={photo} alt="" />
            <div>
              {busy && <p className="busy"><RefreshCw className="spin" size={16} />{t('analysing')}</p>}
              {error && <p className="error">{error}</p>}
              {results && !manual && (
                <>
                  <p className="fine">{top.confidence >= CONFIDENT ? t('ai_confident') : t('ai_unsure')}</p>
                  {preset && !presetMatch && <p className="warn">{t('preset_not_found')}</p>}
                  <ul className="guesses">
                    {results.map(r => r.car && (
                      <li key={r.index}>
                        <span><b>{r.car.brand} {r.car.model}</b> {r.car.year}</span>
                        <meter min="0" max="1" value={r.confidence} />
                        <span className="pct">{Math.round(r.confidence * 100)} %</span>
                        <button onClick={() => onSave(r.car.id, photo, 'ai', r.confidence)}><Check size={16} />{t('this_one')}</button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {!busy && (
                <div className="row">
                  {preset && <button onClick={() => onSave(preset.id, photo, 'manual')}>{t('confirm_manual', { name: preset.model })}</button>}
                  <button onClick={() => setManual(m => !m)}>{manual ? t('back_to_ai') : t('manual_mode')}</button>
                  <button onClick={() => { setPhoto(null); setResults(null); setManual(false); }}>{t('retake')}</button>
                </div>
              )}
              {manual && (
                <div className="manual">
                  <label className="search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('search')} autoFocus /></label>
                  <ul>
                    {candidates.map(c => (
                      <li key={c.id}><button onClick={() => onSave(c.id, photo, 'manual')}>{c.brand} {c.model} <span>{c.year}</span></button></li>
                    ))}
                  </ul>
                  <p className="fine">{t('manual_note')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsPanel({ t, lang, setLang, state, setState, settings, setSettings, hostServer, onClose }) {
  const [msg, setMsg] = useState('');
  const [server, setServer] = useState(null);
  const [port, setPort] = useState(4174);
  const importer = useRef(null);
  const [importMode, setImportMode] = useState('merge');
  const desktop = isDesktop();

  useEffect(() => {
    if (desktop) desktopServerStatus().then(s => { setServer(s); if (s.running) setPort(s.port); }).catch(() => {});
  }, [desktop]);

  async function sync(target = settings) {
    setMsg(t('syncing'));
    try {
      const merged = await syncWithServer(hostServer ? '' : target.serverUrl || '', target.code || '', state);
      setState(merged);
      setSettings({ ...target, lastSync: new Date().toISOString() });
      setMsg(t('synced'));
    } catch (e) { setMsg(t(`err.${e.message}`) || t('err.sync_failed')); }
  }
  async function onImport(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try { setState(await importFile(file, state, importMode)); setMsg(t('imported')); }
    catch { setMsg(t('err.invalid')); }
  }
  async function toggleServer() {
    try {
      if (server?.running) { await stopDesktopServer(); setServer({ running: false }); }
      else {
        const s = await startDesktopServer(Number(port));
        setServer(s);
        await sync({ ...settings, serverUrl: `http://127.0.0.1:${s.port}`, code: s.code });
      }
    } catch (e) { setMsg(String(e)); }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={t('settings')}>
      <div className="sheet settings">
        <button className="icon close" onClick={onClose} aria-label={t('close')}><X size={20} /></button>
        <h2>{t('settings')}</h2>
        <section>
          <h3>{t('language')}</h3>
          <select value={lang} onChange={e => setLang(e.target.value)}>
            {LANGS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </section>
        <section>
          <h3>{t('backup')}</h3>
          <p className="fine">{t('backup_note')}</p>
          <div className="row">
            <button onClick={() => exportState(state)}><Download size={16} />{t('export')}</button>
            <select value={importMode} onChange={e => setImportMode(e.target.value)} aria-label={t('import_mode')}>
              <option value="merge">{t('import_merge')}</option>
              <option value="replace">{t('import_replace')}</option>
            </select>
            <button onClick={() => importer.current?.click()}><Upload size={16} />{t('import')}</button>
            <input ref={importer} type="file" accept="application/json,.json" hidden onChange={onImport} />
          </div>
        </section>
        {desktop && (
          <section>
            <h3><Server size={16} />{t('server')}</h3>
            <p className="fine">{t('server_note')}</p>
            <div className="row">
              <label>{t('port')} <input type="number" min="1024" max="65535" value={port} disabled={server?.running} onChange={e => setPort(e.target.value)} /></label>
              <button className={server?.running ? '' : 'primary'} onClick={toggleServer}>{server?.running ? t('server_stop') : t('server_start')}</button>
            </div>
            {server?.running && (
              <div className="server-info">
                <p>{t('server_urls')}</p>
                <ul>{server.urls.map(u => <li key={u}><code>{u}</code></li>)}</ul>
                <p>{t('pairing_code')} <code className="code">{server.code}</code></p>
              </div>
            )}
          </section>
        )}
        <section>
          <h3><RefreshCw size={16} />{t('sync')}</h3>
          <p className="fine">{hostServer ? t('sync_host_note') : t('sync_note')}</p>
          {!hostServer && <label className="field">{t('server_address')}<input value={settings.serverUrl || ''} onChange={e => setSettings({ ...settings, serverUrl: e.target.value })} placeholder="http://192.168.1.20:4174" /></label>}
          <label className="field">{t('pairing_code')}<input value={settings.code || ''} onChange={e => setSettings({ ...settings, code: e.target.value })} autoCapitalize="characters" /></label>
          <button className="primary" onClick={() => sync()}>{t('sync_now')}</button>
          {settings.lastSync && <p className="fine">{t('last_sync')} {new Date(settings.lastSync).toLocaleString(lang)}</p>}
        </section>
        {msg && <p className="status" role="status">{msg}</p>}
        <section className="about">
          <p>{t('about')}</p>
          <p className="fine">{t('credits')}</p>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLangState] = useState(detectLang());
  const t = useMemo(() => makeT(lang), [lang]);
  const [state, setStateRaw] = useState(null);
  const [settings, setSettingsRaw] = useState({});
  const [view, setView] = useState('collection');
  const [open, setOpen] = useState(null);
  const [capture, setCapture] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [hostServer, setHostServer] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [f, setF] = useState({ q: '', brand: '', type: '', rarity: '', energy: '', decade: '', value: '', status: '', sort: 'year' });

  useEffect(() => {
    readState().then(setStateRaw);
    readSettings().then(s => { setSettingsRaw(s); if (s.lang && LANGS.some(([c]) => c === s.lang)) setLangState(s.lang); });
    detectHostServer().then(setHostServer);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; document.title = t('title'); }, [lang, t]);
  useEffect(() => setLimit(PAGE), [f, view]);

  const setState = s => { setStateRaw(s); writeState(s); };
  const setSettings = s => { setSettingsRaw(s); writeSettings(s); };
  const setLang = l => { setLangState(l); setSettings({ ...settings, lang: l }); };

  const owned = useMemo(() => {
    const m = new Map();
    if (state) for (const s of liveSightings(state)) m.set(s.carId, [...(m.get(s.carId) || []), s]);
    return m;
  }, [state]);

  const filtered = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const band = f.value === '' ? null : VALUE_BANDS[Number(f.value)];
    const list = catalog.filter(c =>
      (!q || `${c.brand} ${c.model} ${c.year}`.toLowerCase().includes(q)) &&
      (!f.brand || c.brand === f.brand) && (!f.type || c.type === f.type) &&
      (!f.rarity || c.rarity === f.rarity) && (!f.energy || c.energy === f.energy) &&
      (!f.decade || Math.floor(c.year / 10) * 10 === Number(f.decade)) &&
      (!band || (c.value >= band[0] && c.value < band[1])) &&
      (!f.status || (f.status === 'owned') === owned.has(c.id)));
    const sorters = {
      year: (a, b) => b.year - a.year,
      name: (a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`),
      value: (a, b) => b.value - a.value,
      hp: (a, b) => b.hp - a.hp,
      rarity: (a, b) => rarityRank[b.rarity] - rarityRank[a.rarity] || b.value - a.value,
    };
    return list.sort(sorters[f.sort]);
  }, [f, owned]);

  if (!state) return <div className="splash">AutoDex</div>;

  const total = catalog.length;
  const count = owned.size;
  const decades = [...new Set(years.map(y => Math.floor(y / 10) * 10))];
  const set = (k, v) => setF({ ...f, [k]: v });

  function save(carId, photo, method, confidence) {
    const s = newSighting(carId, photo, method, method === 'ai' ? confidence : undefined);
    setState({ ...state, sightings: [...state.sightings, s], updatedAt: new Date().toISOString() });
    setCapture(null);
    setOpen(carId);
  }

  const car = open && byId.get(open);
  const byYear = years.map(y => ({ y, cars: filtered.filter(c => c.year === y) })).filter(g => g.cars.length);

  return (
    <div className="app">
      <header>
        <div className="brand"><span className="logo">A</span><div><h1>AutoDex</h1><small>{t('tagline')}</small></div></div>
        <div className="progress" title={t('progress')}>
          <b>{count}</b>/{total}
          <div className="bar"><i style={{ width: `${(count / total) * 100}%` }} /></div>
        </div>
        <nav>
          <button className={view === 'collection' ? 'on' : ''} onClick={() => setView('collection')}><Grid3x3 size={16} />{t('collection')}</button>
          <button className={view === 'years' ? 'on' : ''} onClick={() => setView('years')}><CalendarRange size={16} />{t('by_year')}</button>
          <button className="icon" onClick={() => setShowSettings(true)} aria-label={t('settings')}><Settings size={18} /></button>
        </nav>
      </header>

      <section className="filters" aria-label={t('filters')}>
        <label className="search"><Search size={16} /><input value={f.q} onChange={e => set('q', e.target.value)} placeholder={t('search')} /></label>
        <select value={f.brand} onChange={e => set('brand', e.target.value)} aria-label={t('brand')}><option value="">{t('all_brands')}</option>{brands.map(b => <option key={b}>{b}</option>)}</select>
        <select value={f.type} onChange={e => set('type', e.target.value)} aria-label={t('type_label')}><option value="">{t('all_types')}</option>{TYPES.map(x => <option key={x} value={x}>{t(`type.${x}`)}</option>)}</select>
        <select value={f.rarity} onChange={e => set('rarity', e.target.value)} aria-label={t('rarity_label')}><option value="">{t('all_rarities')}</option>{RARITIES.map(x => <option key={x} value={x}>{t(`rarity.${x}`)}</option>)}</select>
        <select value={f.value} onChange={e => set('value', e.target.value)} aria-label={t('value')}><option value="">{t('all_values')}</option>{VALUE_BANDS.map(([a, b], i) => <option key={i} value={i}>{b === Infinity ? `≥ ${money(a, lang)}` : `${money(a, lang)} – ${money(b, lang)}`}</option>)}</select>
        <select value={f.energy} onChange={e => set('energy', e.target.value)} aria-label={t('energy_label')}><option value="">{t('all_energies')}</option>{ENERGIES.map(x => <option key={x} value={x}>{t(`energy.${x}`)}</option>)}</select>
        <select value={f.decade} onChange={e => set('decade', e.target.value)} aria-label={t('decade')}><option value="">{t('all_decades')}</option>{decades.map(d => <option key={d} value={d}>{d}s</option>)}</select>
        <select value={f.status} onChange={e => set('status', e.target.value)} aria-label={t('status')}><option value="">{t('all_status')}</option><option value="owned">{t('owned')}</option><option value="missing">{t('missing')}</option></select>
        <select value={f.sort} onChange={e => set('sort', e.target.value)} aria-label={t('sort')}>{['year', 'rarity', 'value', 'hp', 'name'].map(x => <option key={x} value={x}>{t(`sort.${x}`)}</option>)}</select>
      </section>

      <main>
        <p className="count">{t('results', { n: filtered.length })}</p>
        {view === 'collection' ? (
          <div className="grid">{filtered.slice(0, limit).map(c => <Card key={c.id} car={c} sighting={owned.get(c.id)?.at(-1)} t={t} onOpen={setOpen} />)}</div>
        ) : (
          byYear.slice(0, Math.ceil(limit / 6)).map(g => (
            <section key={g.y} className="year">
              <h2>{g.y} <small>{t('year_owned', { a: g.cars.filter(c => owned.has(c.id)).length, b: g.cars.length })}</small></h2>
              <div className="strip">{g.cars.map(c => <Card key={c.id} car={c} sighting={owned.get(c.id)?.at(-1)} t={t} onOpen={setOpen} />)}</div>
            </section>
          ))
        )}
        {(view === 'collection' ? filtered.length > limit : byYear.length > Math.ceil(limit / 6)) && (
          <button className="more" onClick={() => setLimit(l => l + PAGE)}><ChevronLeft size={16} style={{ rotate: '-90deg' }} />{t('show_more')}</button>
        )}
      </main>

      <button className="fab" onClick={() => setCapture({ carId: null })} aria-label={t('capture')}><Camera size={26} /></button>

      {car && <Detail car={car} sightings={owned.get(car.id) || []} t={t} lang={lang} onClose={() => setOpen(null)} onCapture={id => setCapture({ carId: id })} onDelete={id => setState(deleteSighting(state, id))} />}
      {capture && <CaptureFlow t={t} lang={lang} presetCarId={capture.carId} onClose={() => setCapture(null)} onSave={save} />}
      {showSettings && <SettingsPanel t={t} lang={lang} setLang={setLang} state={state} setState={s => setState(mergeStates({ sightings: [] }, s))} settings={settings} setSettings={setSettings} hostServer={hostServer} onClose={() => setShowSettings(false)} />}
    </div>
  );
}
