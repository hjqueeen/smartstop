(() => {
  const screens = {
    live: document.getElementById("screen-live"),
    large: document.getElementById("screen-large"),
    netz: document.getElementById("screen-netz"),
  };

  const clocks = [
    document.getElementById("clock"),
    document.getElementById("clock-large"),
    document.getElementById("clock-netz"),
  ];

  // Haltestelle Alexanderplatz (approx.)
  const STOP = [52.521918, 13.413215];

  /**
   * Street-aligned prototype geometries around Alexanderplatz
   * (simplified real corridors — not official BVG shapes).
   *
   * 100  ≈ Karl-Marx-Allee ↔ Karl-Liebknecht-Str. ↔ Unter den Linden (→ Zoo)
   * M41 ≈ approach via Grunerstr./Dircksenstr. then NW toward Hbf corridor
   * 200 ≈ south–north via Otto-Braun-Str. / Prenzlauer Allee
   * N5  ≈ west toward Friedrichstraße via Karl-Liebknecht / Stadtbahn axis
   */
  const ROUTES = [
    {
      line: "100",
      dest: "Zoologischer Garten",
      eta: "2 Min",
      metro: false,
      color: "#e6b800",
      progress: 0.78,
      path: [
        // Karl-Marx-Allee (east) → Alex → Karl-Liebknecht → Unter den Linden (west)
        [52.52255, 13.43580],
        [52.52248, 13.43120],
        [52.52240, 13.42640],
        [52.52228, 13.42160],
        [52.52215, 13.41780],
        [52.52205, 13.41520],
        [52.52195, 13.41380],
        STOP,
        [52.52155, 13.41040],
        [52.52110, 13.40720],
        [52.52055, 13.40380],
        [52.51985, 13.40020],
        [52.51910, 13.39640],
        [52.51840, 13.39260],
        [52.51770, 13.38890], // Unter den Linden
        [52.51720, 13.38520],
        [52.51675, 13.38140],
        [52.51640, 13.37790], // near Brandenburger Tor
      ],
    },
    {
      line: "M41",
      dest: "Hauptbahnhof",
      eta: "5 Min",
      metro: true,
      color: "#e30613",
      progress: 0.52,
      path: [
        // SE (Jannowitzbrücke / Grunerstr.) → Alex → NW (Invalidenstr. → Hbf)
        [52.51420, 13.42080],
        [52.51510, 13.41940],
        [52.51620, 13.41800],
        [52.51740, 13.41660],
        [52.51860, 13.41540],
        [52.51970, 13.41440],
        [52.52070, 13.41370],
        [52.52140, 13.41340],
        STOP,
        [52.52280, 13.41180],
        [52.52400, 13.40960],
        [52.52520, 13.40680],
        [52.52640, 13.40320],
        [52.52760, 13.39880],
        [52.52860, 13.39420],
        [52.52950, 13.38880],
        [52.53020, 13.38340],
        [52.53080, 13.37820], // Hauptbahnhof area
      ],
    },
    {
      line: "200",
      dest: "Prenzlauer Berg",
      eta: "9 Min",
      metro: false,
      color: "#2f7de1",
      progress: 0.38,
      path: [
        // south of Alex → Otto-Braun-Str. → Prenzlauer Allee (north)
        [52.51680, 13.41240],
        [52.51790, 13.41260],
        [52.51910, 13.41285],
        [52.52030, 13.41300],
        [52.52120, 13.41310],
        STOP,
        [52.52270, 13.41355],
        [52.52400, 13.41410],
        [52.52530, 13.41480],
        [52.52670, 13.41560],
        [52.52820, 13.41650],
        [52.52980, 13.41750],
        [52.53150, 13.41860],
        [52.53320, 13.41980],
        [52.53500, 13.42110], // Prenzlauer Berg
      ],
    },
    {
      line: "N5",
      dest: "Friedrichstraße",
      eta: "14 Min",
      metro: false,
      color: "#5b6670",
      progress: 0.28,
      path: [
        // slight NE approach → Alex → west along Stadtbahn / toward Friedrichstraße
        [52.52480, 13.42150],
        [52.52410, 13.41920],
        [52.52340, 13.41700],
        [52.52260, 13.41500],
        [52.52210, 13.41390],
        STOP,
        [52.52120, 13.41080],
        [52.52040, 13.40720],
        [52.51960, 13.40300],
        [52.51890, 13.39860],
        [52.51830, 13.39420],
        [52.51780, 13.39040],
        [52.51740, 13.38720], // Friedrichstraße
      ],
    },
  ];

  let map = null;

  function busIcon(line, metro) {
    const cls = metro ? "bus-marker bus-marker--metro" : "bus-marker";
    return L.divIcon({
      className: "bus-marker-wrap",
      html: `<div class="${cls}" title="Linie ${line}"><span>${line}</span></div>`,
      iconSize: [40, 28],
      iconAnchor: [20, 14],
    });
  }

  function pointOnPath(path, progress) {
    if (path.length === 1) return path[0];

    const segs = [];
    let total = 0;
    for (let i = 0; i < path.length - 1; i += 1) {
      const a = path[i];
      const b = path[i + 1];
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      segs.push({ a, b, d });
      total += d;
    }

    let remain = Math.max(0, Math.min(1, progress)) * total;
    for (const seg of segs) {
      if (remain <= seg.d || seg.d === 0) {
        const t = seg.d === 0 ? 0 : remain / seg.d;
        return [
          seg.a[0] + (seg.b[0] - seg.a[0]) * t,
          seg.a[1] + (seg.b[1] - seg.a[1]) * t,
        ];
      }
      remain -= seg.d;
    }
    return path[path.length - 1];
  }

  function drawRoute(route) {
    // Casing (transit-map look)
    L.polyline(route.path, {
      color: "#ffffff",
      weight: 8,
      opacity: 0.95,
      lineJoin: "round",
      lineCap: "round",
      interactive: false,
    }).addTo(map);

    const line = L.polyline(route.path, {
      color: route.color,
      weight: 5,
      opacity: 0.92,
      lineJoin: "round",
      lineCap: "round",
      dashArray: route.line.startsWith("N") ? "8 10" : null,
    }).addTo(map);

    line.bindPopup(
      `<strong>Linie ${route.line}</strong><br>Richtung ${route.dest}`
    );

    const busPos = pointOnPath(route.path, route.progress);
    L.marker(busPos, {
      icon: busIcon(route.line, route.metro),
      zIndexOffset: 600,
    })
      .addTo(map)
      .bindPopup(
        `<strong>Bus ${route.line}</strong><br>${route.dest}<br>in ${route.eta}<br><em>auf der Linie</em>`
      );

    return line;
  }

  function initMap() {
    if (map || typeof L === "undefined") return;

    map = L.map("live-map", {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    }).setView(STOP, 14);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    }).addTo(map);

    const stopIcon = L.divIcon({
      className: "",
      html: '<div class="stop-marker"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    L.marker(STOP, { icon: stopIcon, zIndexOffset: 500 })
      .addTo(map)
      .bindPopup("<strong>SmartStop</strong><br>Haltestelle Alexanderplatz");

    L.circle(STOP, {
      radius: 70,
      color: "#e6b800",
      weight: 1,
      fillColor: "#e6b800",
      fillOpacity: 0.12,
    }).addTo(map);

    const bounds = L.latLngBounds([STOP]);
    ROUTES.forEach((route) => {
      const line = drawRoute(route);
      bounds.extend(line.getBounds());
    });

    map.fitBounds(bounds.pad(0.08));
    setTimeout(() => map.invalidateSize(), 50);
  }

  function show(name) {
    Object.entries(screens).forEach(([key, el]) => {
      const active = key === name;
      el.classList.toggle("is-active", active);
      el.hidden = !active;
    });

    if (name === "live" && map) {
      setTimeout(() => map.invalidateSize(), 80);
    }
  }

  function tick() {
    const now = new Date();
    const text = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    clocks.forEach((el) => {
      if (el) el.textContent = text;
    });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-go]");
    if (!btn) return;
    show(btn.dataset.go);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "1") show("live");
    if (e.key === "2") show("large");
    if (e.key === "3") show("netz");
  });

  tick();
  setInterval(tick, 1000);
  show("live");
  initMap();
})();
