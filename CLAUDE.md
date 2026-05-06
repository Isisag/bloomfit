# BloomFit — Contexto del Proyecto

App web mobile-first PWA de motivación para el ejercicio, estética cozy kawaii.
Plan completo: `C:\Users\Isis\Documents\proyectos\BloomFit_Plan.md`
Spec técnica: `C:\Users\Isis\Downloads\BloomFit_Definicion_Tecnica.md`

## Diseño de referencia — OBLIGATORIO leer antes de implementar UI

URL del handoff de Claude Design (mockups HTML/CSS de todas las pantallas):
```
https://api.anthropic.com/v1/design/h/52MDsOey9ZNVtHNWaQ1Upw?open_file=BloomFit+Mockups.html
```

**Antes de implementar cualquier pantalla o componente visual, fetchear este URL y leer `screens.jsx` del bundle.**
El bundle es un tar.gz. Para extraerlo: descomprimir el gzip → extraer el tar → leer `bloomfit/project/screens.jsx` y `bloomfit/project/flower.jsx`.

Tokens de diseño extraídos (usar siempre):
- Font: `'Quicksand', 'Nunito'` — cargada en `MainLayout.astro`
- Ink (texto + botones primarios): `#5A4A5C`
- inkSoft (texto secundario): `#8E7B92`
- Pink primario: `#FFB7C5` | Pink deep (accents): `#FF69B4`
- Shadow estándar: `0 8px 24px rgba(255, 105, 180, 0.12)`
- Border radius: 14–24px en todo
- **Todos los CTA principales van en ink `#5A4A5C`** — nunca gradiente rosa

## Stack

| Capa | Tecnología | Notas |
|------|------------|-------|
| Framework | **Astro 6.2.2** | `@latest` instaló v6 (spec dice v5, pero v6 es superior) |
| Interactividad | React 19 (islands) | Solo donde se necesita |
| Estilos | Tailwind CSS 4 | Vite plugin, sin tailwind.config.js, `@import "tailwindcss"` en global.css |
| Animaciones | Framer Motion | |
| Base de datos | Firebase Firestore | |
| Auth | Firebase Auth | email/password + Google |
| PWA | Pendiente (Feature 13) | `@vite-pwa/astro` no soporta Astro 6 aún — revisar al llegar a F13 |

## Reglas críticas

- Variables de entorno Firebase usan prefijo `PUBLIC_` (Astro expone al browser solo vars con ese prefijo)
- Firebase offline: usar `persistentLocalCache()` — `enableIndexedDbPersistence` está deprecated en Firebase 9+
- Islands solo donde se necesita interactividad — respetar directivas del plan (client:visible, client:load, etc.)
- No agregar features fuera del scope MVP sin aprobación (ver sección 1.3 de la spec)

## Path aliases

- `@/*` → `src/*`

## Variables de entorno

Copiar `.env.local.example` → `.env.local` y completar con datos del proyecto Firebase.

## Estructura de carpetas

```
src/
  components/
    ui/          ← componentes atómicos Astro
    islands/     ← React islands (.tsx)
    sections/    ← secciones Astro para páginas
  lib/           ← firebase.ts, themes.ts, messages.ts, flower-parts.ts
  layouts/       ← MainLayout.astro
  pages/         ← index.astro, login.astro, onboarding.astro, workout.astro
  styles/        ← global.css (Tailwind import)
  workers/       ← timer.worker.ts
public/
  icons/         ← iconos PWA (192, 512)
  sounds/        ← efectos de audio (<50KB)
```

## Features y estado

| # | Feature | Estado |
|---|---------|--------|
| Paso 0 | Setup técnico | ✅ |
| F1 | Auth | ✅ |
| F2 | Onboarding | ✅ |
| F3 | Sistema de temas | ✅ |
| F4 | Layout + navegación | ⬜ |
| F5 | Dashboard | ⬜ |
| F6 | Timer | ⬜ |
| F7 | Registro workout | ⬜ |
| F8 | Metas | ⬜ |
| F9 | Flor evolutiva SVG | ⬜ |
| F10 | Desbloqueables | ⬜ |
| F11 | Flower Builder | ⬜ |
| F12 | Mensajes motivacionales | ⬜ |
| F13 | PWA offline | ⬜ |
| F14 | Partículas | ⬜ |
| F15 | Sonidos | ⬜ |
| F16 | Optimización + A11y | ⬜ |
