# SmartStop Berlin — Blender Projects

Sammlung der Werbevideo- und Prototyp-Arbeiten für SmartStop (HWR-Projekt).

## Zuerst ansehen

| Zweck | Pfad |
|------|------|
| **Aktuelle Video-Review** | [`werbevideo-shots/review/`](werbevideo-shots/review/) |
| **Empfohlene Vorschau (mit VO)** | [`werbevideo-shots/review/videos/shot01_18_rough_vo.mp4`](werbevideo-shots/review/videos/shot01_18_rough_vo.mp4) |
| **Shotlist / Animatic-Dokumente** | [`werbevideo-shots/docs/`](werbevideo-shots/docs/) |
| **Display-UI-Prototyp** | [`display-prototype/`](display-prototype/) |

Ausführliche Hinweise: [`werbevideo-shots/README.md`](werbevideo-shots/README.md)

## Ordnerstruktur

```
blender-projects/
├── README.md                 ← diese Datei
├── blender/                  ← Blender-Szenen
│   ├── SmartStop_Werbevideo_Shots.blend   # Haupt-Shot-Szene
│   └── SmartStop_BerlinNEW.blend          # Modell-/Szenen-Quelle
├── werbevideo-shots/         ← Shotlist, Review-Videos, VO, Storyboard
├── display-prototype/        ← Haltestellen-Display-UI (Web → PNG-Export)
└── storyboard-prototype/     ← Storyboard-Webskizze
```

## Kurzüberblick der Komponenten

### `werbevideo-shots/`
Planung, Rough-Renders und Review-Material für den ca. 60-Sekunden-Werbespot. Für die Team-Review reicht **`review/`**. Unter `work/` liegen Zwischenstände (Frame-Sequenzen, Schrift-Tests usw.).

### `blender/`
- **SmartStop_Werbevideo_Shots.blend** — Hauptdatei mit Kameras und Shot-Timeline  
- **SmartStop_BerlinNEW.blend** — SmartStop-Modell und Umgebungsquelle

### `display-prototype/`
Haltestellen-Display-UI (Live-Abfahrten, Großschrift, Netzinfo). Unter `exports/` liegen PNGs für Blender/Compositing.

```bash
cd display-prototype && npm install
# index.html im Browser öffnen oder PNGs mit export-png.mjs exportieren
```

### `storyboard-prototype/`
Statisches HTML für das frühe Storyboard-Layout.

## Aktueller Stand (Rough)

- 18-Shot-Animatic-Rough inkl. Untertitel- und VO-Mix vorhanden  
- Final-Render, echte UI-Texturen und Hero-Framing noch in Arbeit → [`review/notes/`](werbevideo-shots/review/notes/)
