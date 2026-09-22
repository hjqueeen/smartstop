# SmartStop — 자막 / Voice-over 타임코드 자리

**포맷:** 25 fps · 60초 · 1920×1080  
**용도:** VSE / Premiere / DaVinci에 올릴 플레이스홀더  
**상태:** 텍스트만 (실녹음·최종 자막 디자인 전)

| TC 시작 | TC 끝 | Shot | 화면 자막 (KO/DE 초안) | Voice-over (DE) |
|--------|------|------|------------------------|-----------------|
| 00:00 | 00:06 | 1 | Wann kommt mein Bus? | _(음악/비만)_ |
| 00:06 | 00:11 | 2 | — | Warten kann einfacher sein. |
| 00:11 | 00:19 | 3 | Live informiert. | — |
| 00:19 | 00:27 | 4 | Ohne Smartphone. | Alle wichtigen Informationen — auch ohne Smartphone. |
| 00:27 | 00:35 | 5 | Einfach für alle. | Linie M10 kommt in drei Minuten. _(UI 안내)_ |
| 00:35 | 00:43 | 6 | Netzinfo auf einen Blick. | Schnell orientiert — für Berlin und seine Gäste. |
| 00:43 | 00:50 | 7 | Sicher. Nachhaltig. | Solar unterstützt. LED beleuchtet. |
| 00:50 | 00:56 | 8 | JETZT | Wissen, wann es weitergeht. |
| 00:56 | 01:00 | 9 | SmartStop Berlin / The Bus Stop that is ready for the Future. | _(짧은 음악 종결)_ |

## Blender 프레임 환산 (frame = sec×25 + 1)
- Shot1 자막: f1–150  
- Shot2 VO: f151–275  
- Shot3 자막: f276–475  
- Shot4: f476–675  
- Shot5: f676–875  
- Shot6: f876–1075  
- Shot7: f1076–1250  
- Shot8: f1251–1400  
- Shot9: f1401–1500  

## 다음 단계
1. Premiere/DaVinci에 위 TC로 타이틀 레이어 생성  
2. VO 러프 녹음(스마트폰 OK) 후 길이만 맞춤  
3. 최종 자막 스타일(큰 산세리프, 고대비)은 화면 합성 단계에서
