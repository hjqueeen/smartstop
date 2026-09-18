(() => {
  const SCENES = [
    {
      time: "0:00 – 0:06",
      scene: "Szene 1 · Problem",
      title: "Kein Smartphone. Kein Plan.",
      text: "Abend an der Haltestelle. Akku leer. Der Papierfahrplan hilft nicht weiter.",
      shot: "Nahaufnahme leeres Handy + unlesbarer Fahrplan, dunkle Straße.",
      visual: "problem",
    },
    {
      time: "0:06 – 0:12",
      scene: "Szene 2 · Entdeckung",
      title: "Licht. Display. Ankommen.",
      text: "SmartStop Berlin: beleuchteter Wartebereich und ein klares Infodisplay.",
      shot: "Weitwinkel Blender-Modell, Abendlicht + LED, H-Schild.",
      visual: "discover",
    },
    {
      time: "0:12 – 0:18",
      scene: "Szene 3 · Live-Info",
      title: "Abfahrten ohne App.",
      text: "Linie, Richtung, Auslastung und Minuten — direkt an der Haltestelle.",
      shot: "Display Live-Ansicht (HTML/Figma) als Overlay auf dem 3D-Screen.",
      visual: "live",
    },
    {
      time: "0:18 – 0:24",
      scene: "Szene 4 · Barrierefreiheit",
      title: "Großschrift. Sofort lesbar.",
      text: "Für ältere Fahrgäste: große Kontraste, wenige klare Zeilen.",
      shot: "Schnitt zur Großschrift-Ansicht, kurze Hand-Geste oder Blick.",
      visual: "access",
    },
    {
      time: "0:24 – 0:30",
      scene: "Szene 5 · Orientierung",
      title: "Wohin geht die Linie?",
      text: "Netzinfo zeigt Linien und Umgebung — auch für Tourist:innen.",
      shot: "Netzinfo-Screen + kurze Kartenbewegung.",
      visual: "netz",
    },
    {
      time: "0:30 – 0:36",
      scene: "Szene 6 · Nachhaltigkeit",
      title: "Solar lädt Display und Licht.",
      text: "Photovoltaik auf dem Dach, LED-Beleuchtung — nachhaltig und sicher.",
      shot: "Dach/Solar-Detail aus dem 3D-Modell, Status „Solar OK“.",
      visual: "solar",
    },
    {
      time: "0:36 – 0:42",
      scene: "Szene 7 · Lösung",
      title: "Bus kommt. Ruhig einsteigen.",
      text: "Die Information war rechtzeitig da. Der Wartebereich fühlte sich sicher an.",
      shot: "Bus nähert sich, Person steigt ein, warmes Licht.",
      visual: "resolve",
    },
    {
      time: "0:42 – 0:45",
      scene: "Szene 8 · Claim",
      title: "Ready for the Future.",
      text: "SmartStop Berlin — die Haltestelle mit Live-Info, Licht und Solar.",
      shot: "Logo/Claim auf dunklem Grund, Soft-Outro.",
      visual: "slogan",
    },
  ];

  const VISUAL_HTML = {
    problem: `
      <div class="v v--problem">
        <div class="moon"></div>
        <div class="phone"></div>
        <div class="paper"></div>
      </div>`,
    discover: `
      <div class="v v--discover">
        <div class="solar"></div>
        <div class="roof"></div>
        <div class="shelter"></div>
        <div class="light"></div>
        <div class="sign">H</div>
      </div>`,
    live: `
      <div class="v v--live">
        <div class="panel">
          <h3>SmartStop · Live</h3>
          <div class="row"><span class="tag">100</span><span>Zoo</span><span>2 Min</span></div>
          <div class="row"><span class="tag m">M41</span><span>Hbf</span><span>5 Min</span></div>
          <div class="row"><span class="tag">200</span><span>Prenzl.</span><span>9 Min</span></div>
        </div>
      </div>`,
    access: `
      <div class="v v--access">
        <div class="big">
          <div class="big-row"><span class="ln">M41</span><span class="dest">Hauptbahnhof</span><span class="eta">5</span></div>
          <div class="big-row"><span class="ln">100</span><span class="dest">Zoo</span><span class="eta">2</span></div>
        </div>
      </div>`,
    netz: `
      <div class="v v--netz">
        <svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="320" height="220" fill="#f7fafc"/>
          <path d="M20 170 C70 150 120 90 160 80 S250 50 300 70" fill="none" stroke="#e6b800" stroke-width="6"/>
          <path d="M30 40 C90 70 130 140 170 170 S250 210 300 180" fill="none" stroke="#e30613" stroke-width="6"/>
          <path d="M20 110 H300" fill="none" stroke="#2f7de1" stroke-width="5"/>
          <circle cx="160" cy="110" r="10" fill="#122033"/>
          <text x="176" y="115" fill="#122033" font-size="14" font-family="IBM Plex Sans, sans-serif">Alex</text>
        </svg>
      </div>`,
    solar: `
      <div class="v v--solar">
        <div class="panels"><span></span><span></span><span></span><span></span></div>
        <div class="roof-block"></div>
        <div class="bolt">⚡</div>
        <div class="cap">Solar OK · LED Auto</div>
      </div>`,
    resolve: `
      <div class="v v--resolve">
        <div class="bus"><div class="win"></div></div>
        <div class="person"></div>
      </div>`,
    slogan: `
      <div class="v v--slogan">
        <div>
          <div class="mark">Smart<span>Stop</span></div>
          <div class="line">The Bus Stop that is ready for the Future</div>
        </div>
      </div>`,
  };

  const stage = document.getElementById("stage");
  const progress = document.getElementById("progress");
  const dots = document.getElementById("dots");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  let index = 0;

  function render() {
    const s = SCENES[index];
    stage.innerHTML = `
      <article class="card" id="card">
        <div class="card__visual">${VISUAL_HTML[s.visual]}</div>
        <div class="card__body">
          <p class="card__time">${s.time}</p>
          <p class="card__scene">${s.scene}</p>
          <h2 class="card__title">${s.title}</h2>
          <p class="card__text">${s.text}</p>
          <p class="card__shot">${s.shot}</p>
        </div>
      </article>
    `;

    progress.textContent = `${index + 1} / ${SCENES.length}`;
    prev.disabled = index === 0;
    next.textContent = index === SCENES.length - 1 ? "Ende ✓" : "Weiter →";
    next.disabled = false;

    [...dots.children].forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
    });

    stage.focus({ preventScroll: true });
  }

  function go(delta) {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= SCENES.length) return;
    index = nextIndex;
    render();
  }

  SCENES.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Szene ${i + 1}`);
    b.addEventListener("click", () => {
      index = i;
      render();
    });
    dots.appendChild(b);
  });

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => {
    if (index < SCENES.length - 1) go(1);
  });

  stage.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    if (index < SCENES.length - 1) go(1);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      go(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  });

  render();
})();
