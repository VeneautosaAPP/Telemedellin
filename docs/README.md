# Documentación — Webinfografía Telemedellín 2026

Esta carpeta centraliza la documentación del proyecto para que la webinfografía escale de forma ordenada a lo largo del tiempo.

## Contenido

- **Procesos de escalabilidad** — cómo agregar secciones, páginas y activos nuevos sin romper lo existente.
- **Fuentes institucionales** — enlaces y documentos oficiales (MIPG Talento Humano, matriz 2026) que sustentan el contenido.
- **Notas de versión** — registro incremental de cambios por despliegue.

## Estructura del proyecto

```
├── client/               # Frontend (React + Vite + TypeScript)
│   ├── public/           # Imágenes y activos estáticos (servidos en /)
│   └── src/
│       ├── pages/        # Páginas (Home = webinfografía principal)
│       ├── components/   # Componentes reutilizables (ui/, Map, ErrorBoundary…)
│       ├── hooks/        # Hooks de composición y responsive
│       ├── contexts/     # Contextos globales (ThemeContext)
│       └── lib/          # Utilidades
├── server/               # Servidor Express (sirve el build en producción)
├── shared/               # Constantes compartidas cliente/servidor
├── patches/              # Parches de dependencias (pnpm)
└── docs/                 # Documentación (esta carpeta)
```

## Cómo escalar

### Nuevas imágenes o medios
1. Coloca el archivo en `client/public/`.
2. Referéncialo con la ruta raíz: `/nombre-archivo.ext`.
3. Usa nombres descriptivos y considera una subcarpeta si el volumen crece (ej. `client/public/medios/`).

### Nuevas secciones en la infografía
Cada sección vive en `client/src/pages/Home.tsx` dentro de `sections`. Para una sección nueva:
1. Añade su entrada al arreglo `sections` (id, short, label, presenter).
2. Crea el bloque `Reveal` correspondiente respetando el patrón existente (Eyebrow + contenido + identificador de voz).
3. Actualiza `presentation` si aplica (modo presentación).

### Despliegues
- Configuración en `vercel.json` (build `pnpm build`, salida `dist/public`, rewrite SPA).
- El repo vive en `https://github.com/VeneautosaAPP/Telemedellin` (rama `main`).
- Vercel reconstruye automáticamente en cada push a `main`.

## Fuentes institucionales
- Matriz: `matriz_telemedellin_2026 (1).xlsx`
- Análisis de cumplimiento: `Analisis_Cumplimiento_MIPG_TalentoHumano_Telemedellin.pdf`
- Sala de prensa Alcaldía de Medellín (Canal Parque)

## Notas de versión
- **v1.0.0 (2026-09-12)** — Integración del video de YouTube (`L6DBHjF9s0o`), corrección del despliegue en Vercel (`vercel.json`), logo y fotografía del Canal Parque servidos desde `client/public/`, y creación de esta carpeta de documentación.