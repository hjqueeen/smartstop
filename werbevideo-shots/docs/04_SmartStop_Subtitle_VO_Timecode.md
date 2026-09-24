# SmartStop — Untertitel / Voice-over Timecode-Platzhalter

**Format:** 25 fps · 60 Sekunden · 1920×1080  
**Zweck:** Platzhalter für VSE / Premiere / DaVinci  
**Status:** Nur Text (vor finaler Aufnahme und finalem Untertitel-Design)

| TC Start | TC Ende | Shot | Bildschirm-Untertitel (KO/DE Entwurf) | Voice-over (DE) |
|--------|------|------|------------------------|-----------------|
| 00:00 | 00:06 | 1 | Wann kommt mein Bus? | _(Musik/Regen)_ |
| 00:06 | 00:11 | 2 | — | Warten kann einfacher sein. |
| 00:11 | 00:19 | 3 | Live informiert. | — |
| 00:19 | 00:27 | 4 | Ohne Smartphone. | Alle wichtigen Informationen — auch ohne Smartphone. |
| 00:27 | 00:35 | 5 | Einfach für alle. | Linie M10 kommt in drei Minuten. _(UI-Hinweis)_ |
| 00:35 | 00:43 | 6 | Netzinfo auf einen Blick. | Schnell orientiert — für Berlin und seine Gäste. |
| 00:43 | 00:50 | 7 | Sicher. Nachhaltig. | Solar unterstützt. LED beleuchtet. |
| 00:50 | 00:56 | 8 | JETZT | Wissen, wann es weitergeht. |
| 00:56 | 01:00 | 9 | SmartStop Berlin / The Bus Stop that is ready for the Future. | _(kurzer Musik-Abschluss)_ |

## Blender-Frame-Umrechnung (frame = sec×25 + 1)
- Shot1 Untertitel: f1–150  
- Shot2 VO: f151–275  
- Shot3 Untertitel: f276–475  
- Shot4: f476–675  
- Shot5: f676–875  
- Shot6: f876–1075  
- Shot7: f1076–1250  
- Shot8: f1251–1400  
- Shot9: f1401–1500  

## Preview-Untertitel-Stil (Burn-in)
- **Schrift:** Helvetica Neue Medium — **gleiche Größe über alle Abschnitte (30pt)**
- **Stil:** halbtransparente abgerundete Pill + gelber Akzentbalken links (kein Unterstrich / keine Hero-Vergrößerung)
- **Datei:** `../review/videos/shot01_09_rough.mp4` (ohne: `shot01_09_rough_nosub.mp4`)

## Nächste Schritte
1. In Premiere/DaVinci Titel-Layer mit obigen TC anlegen  
2. VO-Rough aufnehmen (Smartphone OK), danach nur Länge anpassen  
3. Final durch Motion Graphics ersetzbar (aktueller Stil als Referenz)
