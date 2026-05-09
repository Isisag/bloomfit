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

## Patrones de UI — reglas obligatorias

Antes de implementar cualquier componente de interacción, revisar estas reglas. Son contratos del sistema de diseño.

### Navegación / volver atrás
- **Siempre** usar `<BloomIcon name="back" size={40} />` dentro de un `<a>` blanco (40×40, borderRadius:14, boxShadow: shadowSoft).
- **Nunca** usar X, close, ✕ ni `IconClose` para navegación de página — esos íconos son solo para cerrar modals/dialogs dentro de una pantalla.
- Patrón estándar de header:
  ```tsx
  <div style={{ padding:'52px 24px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
    <a href="/" style={{ display:'flex', textDecoration:'none' }}>
      <BloomIcon name="back" size={40} />
    </a>
    <div style={{ fontSize:14, fontWeight:800, color:'#5A4A5C' }}>Título</div>
    <div style={{ width:40 }} />  {/* spacer o acción secundaria */}
  </div>
  ```

### Íconos
- **Fuente única**: `BloomIcon` y `IconBadge` de `@/components/islands/BloomIcons.tsx`.
- **No definir SVGs inline** en nuevos componentes — agregar el ícono a `BloomIcons.tsx` si falta.
- Para badges con fondo: `<IconBadge name="yoga" size={42} bg={color} radius={12} />`

### Layouts de tarjeta con múltiples elementos
- Si una fila tiene badge + contenido + chips/extras, separar en **dos filas** dentro del card para evitar overflow en pantallas pequeñas.
- Ejemplo correcto (Duration card):
  ```
  Fila 1: [badge 42px] [label + stepper]
  Fila 2: [chips flexWrap]
  ```
- **No usar** `flexShrink:0` en grupos de chips que compiten con contenido dinámico.

### Botones primarios
- CTA principal: `background: '#5A4A5C'` (ink), texto blanco, `borderRadius:22`, `boxShadow: shadowDark`.
- CTA secundario: `background: '#fff'`, texto ink/inkSoft, mismo border radius, `boxShadow: shadowSoft`.
- Nunca gradiente rosa en CTAs — solo en cards decorativas.

### Paleta de íconos disponibles
Ver `src/components/islands/BloomIcons.tsx` para la lista completa. Nombres clave:
`home`, `cardio`, `flower`, `user`, `bell`, `chart`, `timer`, `drop`, `check`, `close`, `back`, `plus`, `mail`, `lock`, `petal`, `sparkle`, `flame`, `yoga`, `strength`, `stretch`, `hiit`, `walk`, `faceSleep`, `faceCalm`, `faceHappy`, `faceStar`, `faceLove`

## Features y estado

| # | Feature | Estado |
|---|---------|--------|
| Paso 0 | Setup técnico | ✅ |
| F1 | Auth | ✅ |
| F2 | Onboarding | ✅ |
| F3 | Sistema de temas | ✅ |
| F4 | Layout + navegación | ✅ |
| F5 | Dashboard | ✅ |
| F6 | Timer | ✅ |
| F7 | Registro workout | ✅ |
| F8 | Metas | ✅ |
| F9 | Flor evolutiva SVG | ✅ |
| F10 | Desbloqueables | ✅ |
| F11 | Flower Builder | ✅ |
| F12 | Mensajes motivacionales | ✅ |
| F13 | PWA offline | ✅ |
| F14 | Partículas | ✅ |
| F15 | Sonidos | ✅ |
| F16 | Optimización + A11y | ✅ |
