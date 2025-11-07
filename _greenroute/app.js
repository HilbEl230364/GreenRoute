// app.js
// Simple frontend/backend split in one file for demo purposes.
// In a larger project you'd split logic into modules.

/* ---------- Backend (Logik) ---------- */

// Einfacher CO2-Rechner (kg)
const Co2Calculator = {
  // distance in km, mode: 'walk'|'bike'|'transit'|'car'
  calculate: function(distanceKm, mode) {
    // grobe angenommene Emissionsfaktoren (kg/km)
    const factors = {
      walk: 0.0,
      bike: 0.0,
      transit: 0.05, // 50 g/km
      car: 0.18      // 180 g/km
    };
    const factor = factors[mode] ?? 0.18;
    return distanceKm * factor;
  }
};

// Dummy-Routendienst (gibt Schritte + Polyline)
const RouteService = {
  // In der echten App würdet ihr eine API aufrufen (OpenRouteService, Mapbox, Google)
  // Hier liefern wir Mock-Daten: route as latlngs, steps, distance
  getRoute: function(start, goal) {
    // simple demo: make up coordinates near Vienna (or random), here fixed example
    const route = {
      distanceKm: Math.max(0.8, (Math.random() * 6 + 0.5)), // 0.5 - 6.5 km
      path: [
        [48.2082, 16.3738],
        [48.2100, 16.3700],
        [48.2130, 16.3660],
      ],
      steps: [
        `Starte: ${start}`,
        'Folge der Hauptstraße für 1 km',
        'Biege links ab Richtung Park',
        `Ziel: ${goal}`
      ]
    };
    return route;
  }
};

/* ---------- Frontend (UI) ---------- */

// initial map
let map = L.map('map').setView([48.2082, 16.3738], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let routeLayer = null;

const el = {
  start: document.getElementById('start'),
  goal: document.getElementById('goal'),
  mode: document.getElementById('mode'),
  calcBtn: document.getElementById('calcBtn'),
  locateBtn: document.getElementById('locateBtn'),
  distance: document.getElementById('distance'),
  co2: document.getElementById('co2'),
  steps: document.getElementById('steps')
};

function renderRouteOnMap(path) {
  // clear previous
  if (routeLayer) map.removeLayer(routeLayer);
  routeLayer = L.polyline(path, {color: '#2b9348', weight:5}).addTo(map);
  map.fitBounds(routeLayer.getBounds(), {padding:[40,40]});
}

function renderSteps(steps) {
  el.steps.innerHTML = '';
  steps.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    el.steps.appendChild(li);
  });
}

function formatKg(val) {
  return `${val.toFixed(2)} kg`;
}

// Button events
el.calcBtn.addEventListener('click', () => {
  const start = el.start.value.trim() || 'Start';
  const goal = el.goal.value.trim() || 'Ziel';
  const mode = el.mode.value; // 'walk','bike','transit','car'

  const route = RouteService.getRoute(start, goal);
  const distanceKm = route.distanceKm;
  const co2 = Co2Calculator.calculate(distanceKm, mode);

  // Update UI
  el.distance.textContent = `${distanceKm.toFixed(2)} km`;
  el.co2.textContent = formatKg(co2);
  renderSteps(route.steps);
  renderRouteOnMap(route.path);
});

// locate button: tries to center on user position
el.locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation wird von deinem Browser nicht unterstützt.');
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    map.setView([lat, lon], 14);
    L.marker([lat, lon]).addTo(map).bindPopup('Du bist hier').openPopup();
  }, err => {
    alert('Position konnte nicht bestimmt werden: ' + err.message);
  });
});

// small demo: auto-calc a default route on load
window.addEventListener('load', () => {
  el.start.value = 'Schule';
  el.goal.value = 'Park';
  el.mode.value = 'bike';
  el.calcBtn.click();
});
