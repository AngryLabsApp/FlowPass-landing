# Rediseño de la landing — archivos de trabajo

Artboards del canvas de diseño publicado en
https://claude.ai/code/artifact/1441a702-8d1c-4cab-905b-5944c26b0a37

**Estos son los archivos fuente.** Cualquier cambio se hace acá y se vuelve a
generar el canvas; nunca se edita el `.html` ya generado.

## Qué hay

| Archivo | Qué es |
|---|---|
| `Main.dc.html` | Landing desktop 1440 · modo noche |
| `MainDia.dc.html` | Landing desktop 1440 · modo día |
| `Mobile.dc.html` | Landing móvil 390 · modo noche |
| `MobileDia.dc.html` | Landing móvil 390 · modo día |
| `Sistema.dc.html` | Sistema visual, reglas y lista de fotos pendientes |
| `canvas.json` | Posiciones en el canvas, títulos y notas |
| `logo.svg` / `logo-dia.svg` | Logo de marca, versión clara y oscura |

Las tipografías Epoch y OktahNeue van incrustadas en base64 dentro de cada
`.dc.html` (salidas de `static/fonts/`).

## Regenerar y republicar

Con la skill `/design` de Claude Code:

```
node "<base-dir-skill>/seed-canvas.mjs" \
  --template "<base-dir-skill>/payload.template.html" \
  --out flowpass-landing-rediseno.html \
  --title "FlowPass Landing · Rediseño" \
  --artboard Main.dc.html --artboard MainDia.dc.html \
  --artboard Mobile.dc.html --artboard MobileDia.dc.html \
  --artboard Sistema.dc.html \
  --image logo.svg --image logo-dia.svg \
  --canvas canvas.json
```

Luego publicar ese `.html` con la herramienta Artifact **a la misma URL**
(`contract: "0.1.31"`, sin `capabilities`).

## Decisiones tomadas

- Dirección: **evolución seria**. Misma paleta (`#09090f`, `#01f59e`,
  `#531DD8`) y mismas tipografías. Cambia el uso, no la marca.
- Fuera: titular con degradado, glow en toda la página, grilla de 48 px,
  chips con emoji, fotos stock de laptops, slogan rotativo.
- Dentro: jerarquía por opacidad, glow solo en hero y cierre, iconos SVG de
  trazo, UI de producto dibujada, bloque «Hoy vs. con FlowPass».
- Los paneles de producto son **claros** también en la landing oscura, porque
  la app real (`FlowPass-new`) es de tema claro. Así los screenshots reales
  encajan sin rehacer nada.
- Modo día: el verde no va en botones ni texto largo (pierde contraste sobre
  blanco). Acción primaria en negro con flecha verde; verde en etiquetas,
  checks, números y estados.
- Movimiento: una sola entrada por sección — opacidad + `translateY` 16px,
  480 ms, `cubic-bezier(0.22, 1, 0.36, 1)`, desfase 60 ms entre hijos, con
  `IntersectionObserver` y respetando `prefers-reduced-motion`. Sin librería.

## Pendiente

**Fotos que faltan** (la lista con tamaños exactos está al final de
`Sistema.dc.html`):

| | Qué | Tamaño |
|---|---|---|
| A | Panel de cobranza — el hero | 1176 × 840 |
| B | Lista de alumnos con membresías | 1380 × 600 |
| C | Ingresos del mes + gráfico | 1380 × 660 |
| D | Recordatorio de WhatsApp como le llega al alumno | 1120 × 600 |
| E | App en móvil, vista de cobranza | 700 × 720 |
| F | Logos de 4 clientes reales (PNG/SVG transparente) | alto 80 |

Capturar la ventana del navegador sola: sin escritorio, sin manos, sin render
3D de laptop. Anonimizar nombres y montos si la data es real.

**Otros pendientes**

- Testimonios reales con nombre y negocio (hoy no hay ninguno en la landing).
- Implementar en Svelte. Analytics intacto: `GoogleAnalytics.svelte`,
  `MetaPixel.svelte` y `track.ts` no se tocan — los `trackSchedule` /
  `trackContact` / `trackLogin` se mueven tal cual a los botones nuevos.

## Hallazgos en las fuentes de marca

1. El `.woff2` de OktahNeue tiene **glifos rotos** en guion, barra y corchetes
   (`app.flow-pass.com` sale como `app.flow≈pass.com`). El `unicode-range` de
   `src/app.css` los tapa y **debe quedarse**. Consecuencia real: todos los
   números y signos de la landing salen en la fuente de respaldo, no en
   OktahNeue. Conviene pedirle al proveedor el archivo completo.
2. Epoch solo trae **un peso (700)**. Donde el CSS pide 800, el navegador lo
   engorda sintéticamente.
