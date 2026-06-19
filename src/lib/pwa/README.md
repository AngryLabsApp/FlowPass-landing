# PWA Install — Temporal

Toda la UI y lógica del "instalar como PWA" vive aquí. Es temporal hasta lanzar la app nativa de FlowPass.

## Contenido

- `usePwaInstall.svelte.ts` — estado reactivo compartido (`beforeinstallprompt`, `appinstalled`, detección iOS / standalone).
- `InstallAppButton.svelte` — pill verde en el navbar / menú móvil ("Crear acceso directo").
- `InstallPromptToast.svelte` — toast deslizable que aparece a los 3s.
- `index.ts` — barrel re-export.

## Cómo se conecta al resto del proyecto

| Lugar | Qué hace |
|---|---|
| `src/lib/components/Navbar.svelte` | Importa `InstallAppButton` y lo monta en desktop + menú móvil. |
| `src/routes/+layout.svelte` | Importa `InstallPromptToast` (siempre montado). |
| `src/routes/launch/+page.svelte` | Página `start_url` del PWA — redirige a `app.flow-pass.com/login`. |
| `static/site.webmanifest` | Define icons, theme color, `start_url: "/launch"`. |
| `src/app.html` | `<link rel="manifest">` + `<meta name="theme-color">` + favicons. |

## Cómo retirar todo cuando salga la app nativa

1. Borra esta carpeta entera: `src/lib/pwa/`.
2. Borra la ruta `src/routes/launch/`.
3. En `src/lib/components/Navbar.svelte`:
   - Quita `import InstallAppButton from "$lib/pwa/InstallAppButton.svelte"`.
   - Quita el `<InstallAppButton />` en desktop y en mobile.
4. En `src/routes/+layout.svelte`:
   - Quita `import InstallPromptToast from '$lib/pwa/InstallPromptToast.svelte'`.
   - Quita `<InstallPromptToast />`.
5. Decide qué hacer con el manifest:
   - Si todavía quieres favicons / theme color → mantén `site.webmanifest`, pero cambia `start_url` a `/`.
   - Si no necesitas PWA para nada → borra `static/site.webmanifest` y la línea `<link rel="manifest">` en `src/app.html`.
6. (Opcional) Considera eliminar el service worker auto-generado por SvelteKit si ya no quieres caching offline.

Después de retirar nada queda colgando: no hay imports a esta carpeta fuera de los puntos listados arriba.
