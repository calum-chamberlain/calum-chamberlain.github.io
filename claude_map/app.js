/* Earthquake catalogue map
 * Leaflet + noUiSlider, no build step. Works on GitHub Pages.
 *
 * To add a catalogue, add an entry to CATALOGUES below. Each GeoJSON file must
 * be a FeatureCollection of Point features: coordinates [lon, lat, depth_km].
 * Magnitude, time, depth and place are auto-detected from common property names
 * (USGS, GeoNet, ISC-style). Override with `fields` if yours differ.
 */
(() => {
  'use strict';

  // ---------------------------------------------------------------- config
  const CATALOGUES = [
    {
      id: 'pre-kaikoure',
      name: 'Pre-Kaikoura NLL locations',
      url: 'data/pre-kaik_nll_nomags.geojson',
      color: '#d6336c',
      default: true
    },
    {
      id: 'usgs-month',
      name: 'USGS – past 30 days (live)',
      url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
      color: '#111111'
    },
    {
      id: 'geonet',
      name: 'GeoNet NZ – MMI ≥ 3 (live)',
      url: 'https://api.geonet.org.nz/quake?MMI=3',
      color: '#0b5fff'
    }
    // Your own catalogue, with optional field overrides:
    // {
    //   id: 'mycat', name: 'My catalogue', url: 'data/my_catalogue.geojson', color: '#2b8a3e',
    //   fields: { mag: 'ML', time: 'origin_time', depth: 'depth_km', place: 'region' }
    // }
  ];

  // Fault overlay: GeoJSON converted from the GNS Science NZ Community Fault
  // Model shapefile (see tools/convert_cfm.py). CC BY 4.0, credit GNS Science.
  const FAULTS = {
    url: 'data/nz_cfm_faults.geojson',
    shortName: 'NZ CFM faults',
    attribution: 'Faults: NZ Community Fault Model v1.0 &copy; GNS Science (CC BY 4.0)',
    style: { color: '#0e7490', weight: 1.4, opacity: 0.85 }
  };

  const MAP_START = { center: [-41, 174], zoom: 5 };
  const DEPTH_MAX = 700;   // km, top of the depth slider
  const MAG_MAX = 9;
  const DAY = 86400000;

  // depth (km) -> colour, using the "plasma" colourmap (10 evenly spaced samples).
  // Depths are spaced unevenly so that the shallow crust, where most
  // earthquakes occur, gets more of the colour range.
  // Set REVERSE_COLOURMAP = true to make shallow = yellow, deep = dark blue.
  const REVERSE_COLOURMAP = true;
  const PLASMA = ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786',
                  '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'];
  const STOP_DEPTHS = [0, 10, 20, 30, 40, 60, 80, 100, 200, 400];   // km
  const DEPTH_STOPS = STOP_DEPTHS.map((d, i) =>
    [d, PLASMA[REVERSE_COLOURMAP ? PLASMA.length - 1 - i : i]]);

  // ------------------------------------------------------------- utilities
  const state = {
    events: {},          // id -> normalised events
    visible: new Set(),  // selected catalogue ids
    sizeScale: 1,
    depthEnabled: false,
    timeTouched: false,
    faultsOn: false
  };
  // Declared up here (not next to scheduleRedraw) because noUiSlider fires its
  // 'update' handlers as soon as they are attached, which happens long before
  // the rendering section further down is reached.
  let redrawQueued = false;

  const $ = (id) => document.getElementById(id);
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (ms) => new Date(ms).toISOString().slice(0, 10);
  const fmtDateTime = (ms) => new Date(ms).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  function hexToRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function depthColour(d) {
    const x = Math.min(Math.max(d, 0), DEPTH_STOPS[DEPTH_STOPS.length - 1][0]);
    for (let i = 1; i < DEPTH_STOPS.length; i++) {
      const [d1, c1] = DEPTH_STOPS[i];
      if (x <= d1) {
        const [d0, c0] = DEPTH_STOPS[i - 1];
        const t = (x - d0) / (d1 - d0);
        const a = hexToRgb(c0), b = hexToRgb(c1);
        return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(',')})`;
      }
    }
    return DEPTH_STOPS[DEPTH_STOPS.length - 1][1];
  }

  // radius in px; grows exponentially with magnitude
  const radiusFor = (m) => Math.max(1.5, 1.6 * Math.pow(1.5, m - 2)) * state.sizeScale;

  // ------------------------------------------------------ data normalising
  function firstDefined(props, names) {
    for (const n of names) {
      if (n && props[n] !== undefined && props[n] !== null && props[n] !== '') return props[n];
    }
    return undefined;
  }
  function parseTime(v) {
    if (v === undefined || v === null) return NaN;
    if (typeof v === 'number') return v < 1e11 ? v * 1000 : v;  // seconds or ms
    if (/^\d+(\.\d+)?$/.test(v)) return parseTime(Number(v));
    return Date.parse(v);
  }

  function normalise(geojson, cat) {
    const f = cat.fields || {};
    const out = [];
    for (const ft of geojson.features || []) {
      if (!ft.geometry || ft.geometry.type !== 'Point') continue;
      const [lon, lat, z] = ft.geometry.coordinates;
      const p = ft.properties || {};

      const mag = Number(firstDefined(p, [f.mag, 'mag', 'magnitude', 'Magnitude', 'MAG', 'M']));
      const time = parseTime(firstDefined(p, [f.time, 'time', 'origintime', 'origin_time', 'datetime', 'date']));
      let depth = Number(firstDefined(p, [f.depth, 'depth', 'Depth', 'depth_km']));
      if (!Number.isFinite(depth)) depth = Number(z);
      const place = firstDefined(p, [f.place, 'place', 'locality', 'location', 'region', 'title']) || '';

      if (![mag, time, depth, lat, lon].every(Number.isFinite)) continue;
      out.push({ cat: cat.id, lon, lat, mag, time, depth, place });
    }
    return out;
  }

  // ------------------------------------------------------------------ map
  const map = L.map('map', { preferCanvas: true }).setView(MAP_START.center, MAP_START.zoom);

  const basemaps = {
    'OpenStreetMap': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
    }),
    'Light grey (Esri)': L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, maxNativeZoom: 16,
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
      }),
    'Satellite': L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18, attribution: 'Tiles &copy; Esri'
      })
  };
  basemaps['Light grey (Esri)'].addTo(map);
  L.control.layers(basemaps, null, { position: 'topright' }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);

  const renderer = L.canvas({ padding: 0.5 });
  const quakeLayer = L.layerGroup().addTo(map);

  // --------------------------------------------------------------- legend
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    this._div = L.DomUtil.create('div', 'legend');
    this.update();
    return this._div;
  };
  legend.update = function () {
    const grad = DEPTH_STOPS.map(([, c], i) =>
      `${c} ${(i / (DEPTH_STOPS.length - 1) * 100).toFixed(1)}%`).join(',');
    const ticks = DEPTH_STOPS.map(([d]) => `<span>${d}</span>`).join('');
    const faultRow = state.faultsOn
      ? `<div class="fault-key"><span class="fault-line" style="border-top-color:${FAULTS.style.color}"></span>${escapeHtml(FAULTS.shortName)}</div>`
      : '';
    const sizes = [3, 5, 7].map((m) => {
      const r = radiusFor(m);
      return `<div><svg width="${2 * r + 2}" height="${2 * r + 2}">
        <circle cx="${r + 1}" cy="${r + 1}" r="${r}" fill="#ccc" stroke="#555"/></svg><br>M${m}</div>`;
    }).join('');
    this._div.innerHTML =
      `<h4>Depth (km)</h4><div class="bar" style="background:linear-gradient(to right,${grad})"></div>
       <div class="ticks">${ticks}</div><div class="sizes">${sizes}</div>${faultRow}`;
  };
  legend.addTo(map);

  // --------------------------------------------------------------- faults
  // Fault lines get their own SVG pane above the earthquake canvas. A canvas
  // layer swallows clicks for anything beneath it, so putting faults on top
  // keeps both the fault popups and the earthquake popups clickable.
  map.createPane('faults');
  map.getPane('faults').style.zIndex = 450;
  $('faults-swatch').style.borderTopColor = FAULTS.style.color;

  let faultLayer = null;   // built the first time the overlay is switched on

  function faultName(props) {
    for (const k of ['Name', 'name', 'NAME', 'FaultName', 'Fault_Name', 'fault_name', 'FAULT_NAME']) {
      if (props[k]) return String(props[k]);
    }
    return '';
  }

  function faultPopup(props) {
    const rows = Object.entries(props)
      .filter(([, v]) => v !== null && v !== '')
      .map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`)
      .join('');
    const title = faultName(props);
    return `${title ? `<strong>${escapeHtml(title)}</strong>` : ''}<table class="fault-table">${rows}</table>`;
  }

  function faultStyle(feature) {
    const isArea = /Polygon/.test(feature.geometry.type);
    return Object.assign({}, FAULTS.style,
      isArea ? { fill: true, fillColor: FAULTS.style.color, fillOpacity: 0.12 } : { fill: false });
  }

  async function loadFaults() {
    if (faultLayer) return true;
    const status = $('faults-status');
    status.textContent = 'loading…';
    try {
      const res = await fetch(FAULTS.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const gj = await res.json();
      faultLayer = L.geoJSON(gj, {
        pane: 'faults',
        renderer: L.svg({ pane: 'faults' }),
        style: faultStyle,
        attribution: FAULTS.attribution,
        onEachFeature: (feature, layer) => {
          const props = feature.properties || {};
          const name = faultName(props);
          if (name) layer.bindTooltip(escapeHtml(name), { sticky: true });
          layer.bindPopup(() => faultPopup(props), { maxWidth: 320 });
          layer.on('mouseover', () => layer.setStyle({ weight: FAULTS.style.weight + 2 }));
          layer.on('mouseout', () => faultLayer.resetStyle(layer));
        }
      });
      status.textContent = `${(gj.features || []).length.toLocaleString()} features`;
      return true;
    } catch (err) {
      console.error(`Could not load fault overlay from ${FAULTS.url}:`, err,
        '\nCreate it with tools/convert_cfm.py from the GNS Science shapefile.');
      status.textContent = 'file not found';
      return false;
    }
  }

  $('faults-toggle').addEventListener('change', async (e) => {
    if (e.target.checked) {
      const ok = await loadFaults();
      if (!ok) { e.target.checked = false; return; }
      if (!e.target.checked) return;   // switched off again while loading
      faultLayer.addTo(map);
      state.faultsOn = true;
    } else {
      if (faultLayer) map.removeLayer(faultLayer);
      state.faultsOn = false;
    }
    legend.update();
  });

  // -------------------------------------------------------------- sliders
  function makeSlider(el, opts) {
    noUiSlider.create(el, Object.assign({
      connect: true,
      behaviour: 'drag',
      format: { to: (v) => Number(v), from: (v) => Number(v) }
    }, opts));
    return el.noUiSlider;
  }

  const now = Date.now();
  const timeSlider = makeSlider($('time-slider'), {
    start: [now - 30 * DAY, now],
    range: { min: now - 30 * DAY, max: now },
    step: DAY
  });
  const magSlider = makeSlider($('mag-slider'), {
    start: [0, MAG_MAX], range: { min: 0, max: MAG_MAX }, step: 0.1
  });
  const depthSlider = makeSlider($('depth-slider'), {
    start: [0, DEPTH_MAX], range: { min: 0, max: DEPTH_MAX }, step: 1
  });
  $('time-slider').setAttribute('disabled', true);
  $('depth-slider').setAttribute('disabled', true);

  timeSlider.on('slide', () => { state.timeTouched = true; });
  timeSlider.on('update', (v) => {
    $('time-label').textContent = `${fmtDate(v[0])}  →  ${fmtDate(v[1])}`;
    scheduleRedraw();
  });
  magSlider.on('update', (v) => {
    $('mag-label').textContent = `M ${v[0].toFixed(1)}  →  M ${v[1].toFixed(1)}`;
    scheduleRedraw();
  });
  depthSlider.on('update', (v) => {
    $('depth-label').textContent = `${Math.round(v[0])}  →  ${Math.round(v[1])} km`;
    scheduleRedraw();
  });

  $('depth-enable').addEventListener('change', (e) => {
    state.depthEnabled = e.target.checked;
    if (state.depthEnabled) $('depth-slider').removeAttribute('disabled');
    else $('depth-slider').setAttribute('disabled', true);
    scheduleRedraw();
  });
  $('size-scale').addEventListener('input', (e) => {
    state.sizeScale = Number(e.target.value);
    legend.update();
    scheduleRedraw();
  });

  // Re-fit the time slider to the catalogues currently selected
  function updateTimeExtent() {
    let min = Infinity, max = -Infinity;
    for (const id of state.visible) {
      for (const ev of state.events[id] || []) {
        if (ev.time < min) min = ev.time;
        if (ev.time > max) max = ev.time;
      }
    }
    if (!Number.isFinite(min)) {
      $('time-slider').setAttribute('disabled', true);
      return;
    }
    min = Math.floor(min / DAY) * DAY;
    max = Math.ceil(max / DAY) * DAY;
    if (max === min) max = min + DAY;

    const prev = timeSlider.get(true);
    timeSlider.updateOptions({ range: { min, max }, step: DAY }, false);
    if (state.timeTouched) {
      timeSlider.set([Math.max(min, prev[0]), Math.min(max, prev[1])]);
    } else {
      timeSlider.set([min, max]);
    }
    $('time-slider').removeAttribute('disabled');
  }

  // ------------------------------------------------------------ rendering
  function scheduleRedraw() {
    if (redrawQueued) return;
    redrawQueued = true;
    requestAnimationFrame(() => { redrawQueued = false; redraw(); });
  }

  function popupHtml(ev) {
    const cat = CATALOGUES.find((c) => c.id === ev.cat);
    return `<strong>M ${ev.mag.toFixed(1)}</strong>${ev.place ? ' – ' + escapeHtml(ev.place) : ''}<br>
      ${fmtDateTime(ev.time)}<br>
      Depth: ${ev.depth.toFixed(1)} km<br>
      Location: ${ev.lat.toFixed(3)}, ${ev.lon.toFixed(3)}<br>
      <small>${escapeHtml(cat ? cat.name : ev.cat)}</small>`;
  }

  function redraw() {
    quakeLayer.clearLayers();

    const [t0, t1] = timeSlider.get(true);
    const [m0, m1] = magSlider.get(true);
    const [d0, d1] = depthSlider.get(true);
    const timeReady = !$('time-slider').hasAttribute('disabled');

    let total = 0;
    const selected = [];
    for (const id of state.visible) {
      for (const ev of state.events[id] || []) {
        total++;
        if (timeReady && (ev.time < t0 || ev.time >= t1 + DAY)) continue;
        if (ev.mag < m0 || ev.mag > m1) continue;
        if (state.depthEnabled && (ev.depth < d0 || ev.depth > d1)) continue;
        selected.push(ev);
      }
    }

    // draw biggest first so small events stay visible on top
    selected.sort((a, b) => b.mag - a.mag);

    for (const ev of selected) {
      const cat = CATALOGUES.find((c) => c.id === ev.cat);
      L.circleMarker([ev.lat, ev.lon], {
        renderer,
        radius: radiusFor(ev.mag),
        fillColor: depthColour(ev.depth),
        fillOpacity: 0.8,
        color: cat ? cat.color : '#000',
        weight: 1,
        opacity: 0.9
      }).bindPopup(() => popupHtml(ev)).addTo(quakeLayer);
    }

    $('stats').textContent = state.visible.size
      ? `Showing ${selected.length.toLocaleString()} of ${total.toLocaleString()} events`
      : 'No catalogue selected';
  }

  // ------------------------------------------------------- catalogue list
  function setStatus(id, text) {
    const el = document.querySelector(`[data-status="${id}"]`);
    if (el) el.textContent = text;
  }

  async function loadCatalogue(cat) {
    if (state.events[cat.id]) return true;
    setStatus(cat.id, 'loading…');
    try {
      const res = await fetch(cat.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const events = normalise(await res.json(), cat);
      state.events[cat.id] = events;
      setStatus(cat.id, `${events.length.toLocaleString()} events`);
      return true;
    } catch (err) {
      console.error(`Could not load ${cat.name}:`, err);
      setStatus(cat.id, 'failed to load');
      return false;
    }
  }

  async function onCatalogueToggle(cat, checkbox) {
    if (!checkbox.checked) {
      state.visible.delete(cat.id);
      updateTimeExtent();
      redraw();
      return;
    }
    const ok = await loadCatalogue(cat);
    if (!ok) { checkbox.checked = false; return; }

    state.visible.add(cat.id);
    updateTimeExtent();
    redraw();

    const evs = state.events[cat.id];
    if (evs.length) {
      map.fitBounds(L.latLngBounds(evs.map((e) => [e.lat, e.lon])), { maxZoom: 7, padding: [30, 30] });
    }
  }

  function buildCatalogueList() {
    const list = $('catalogue-list');
    for (const cat of CATALOGUES) {
      const row = document.createElement('label');
      row.className = 'cat-row';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.addEventListener('change', () => onCatalogueToggle(cat, cb));

      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.borderColor = cat.color;

      const name = document.createElement('span');
      name.className = 'cat-name';
      name.textContent = cat.name;

      const status = document.createElement('span');
      status.className = 'cat-status';
      status.dataset.status = cat.id;

      row.append(cb, sw, name, status);
      list.appendChild(row);

      if (cat.default) { cb.checked = true; onCatalogueToggle(cat, cb); }
    }
  }

  buildCatalogueList();
  redraw();
})();
