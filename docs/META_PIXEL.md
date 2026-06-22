# Meta Pixel — Resumen de implementación

Documento de referencia para entender qué se cambió al integrar el Meta Pixel (Facebook) junto con Google Analytics 4 en el landing de FlowPass.

Commit principal: `b01775d — Add Meta Pixel and unified tracking helpers`

---

## 1. Arquitectura general

```
┌────────────────────────────┐
│  Componentes Svelte        │
│  (Hero, Navbar, Contact,   │
│   WhatsappBubble, PWA…)    │
└─────────────┬──────────────┘
              │ llaman helpers semánticos
              ▼
┌────────────────────────────┐
│  src/lib/tracking/track.ts │  ← un solo punto
└─────────────┬──────────────┘
              │ fan-out
        ┌─────┴─────┐
        ▼           ▼
   Meta Pixel    GA4 (gtag)
```

Los componentes **no** llaman a `fbq` ni a `gtag` directamente. Llaman funciones como `trackContact('hero')` y el helper se encarga del fan-out. Así, si mañana agregamos TikTok Pixel o LinkedIn Insight, solo se toca `track.ts`.

---

## 2. Archivos creados

### `src/lib/components/MetaPixel.svelte`
Monta el snippet oficial de Meta (`fbevents.js`) y dispara `PageView`.

Puntos clave:
- Solo corre en **producción** (`!dev`) y en el navegador (`browser`).
- Solo corre si `PUBLIC_META_PIXEL_ID` está configurado.
- Evita doble carga del script con un check `document.querySelector('script[src*="fbevents.js"]')`.
- Dispara `PageView` inicial al montar.
- Reactivo a cambios de ruta SPA (`$page.url.pathname`) → dispara `PageView` adicional con un `setTimeout(100ms)` para que el título de la página ya esté actualizado.
- Incluye `<noscript>` con el pixel image fallback (1x1) para usuarios sin JS.

### `src/lib/tracking/track.ts`
Helpers semánticos exportados:

### Tabla técnica

| Función | Evento Meta | Evento GA4 | Cuándo dispara |
|---|---|---|---|
| `trackSchedule(source)` | `Schedule` | `schedule_demo_click` | Click "Agendar demo" (Hero, Navbar, ContactSection) → navega a `/agenda` |
| `trackLead(source, params)` | `Lead` | `generate_lead` | Form `/agenda` enviado con éxito |
| `trackContact(source)` | `Contact` | `whatsapp_click` | Click en burbuja WhatsApp / botones "Escríbenos" |
| `trackEmailClick(source)` | `Contact` | `email_click` | Click en enlace `mailto:` (correo) |
| `trackLogin(source)` | `LoginClick` (custom) | `login_click` | Click "Ingresar" del navbar (va a la plataforma) |
| `trackPwaInstallClick(source)` | `PwaInstallClick` (custom) | `pwa_install_click` | Click "Crear acceso directo" — intent, aún no instalado |
| `trackPwaInstalled(source)` | `Lead` + `PwaInstall` | `pwa_install_success` | Navegador confirmó instalación de la PWA |

### Guía para el equipo comercial

Cómo leer cada evento sin tener que abrir el código:

- **`Schedule` / `schedule_demo_click`** — *Prospect tibio.* Vio el sitio, le interesó la demo, clickeó "Agendar demo". Aún no llenó el form. No tienes su contacto.
- **`Lead` / `generate_lead`** — *Lead calificado.* Llenó el form `/agenda` con todos sus datos (nombre, WhatsApp, país, tipo de academia, etc.). YA tienes su contacto en la tabla `leads` de Supabase. **Iniciar contacto comercial.**
- **`Contact` / `whatsapp_click`** — *Alta intención de chatear.* Clickeó WhatsApp pero no completó el form. Puede iniciar conversación contigo en WhatsApp directamente — revisa cola de chats.
- **`Contact` / `email_click`** — *Prefiere correo.* Perfil más formal (B2B / corporativo). Esperar que escriba al inbox.
- **`LoginClick` / `login_click`** — *Cliente activo.* No es lead, es alguien que ya tiene cuenta entrando al sistema. Útil para separar tráfico de clientes vs prospectos.
- **`PwaInstallClick` / `pwa_install_click`** — *Intención de instalar la app.* Aún no instalada (el SO o el user pueden cancelar).
- **`Lead` + `PwaInstall` / `pwa_install_success`** — *Instaló FlowPass como app.* Engagement fuerte. Puede ser un cliente activo o un prospect muy interesado.

**Ratios clave:**
- `Lead / Schedule` = tasa de conversión del form. Ideal **>40%**. Si baja, el form tiene fricción (campos confusos, errores, lentitud).
- `Schedule / sesiones` = tasa de interés del sitio. Ideal **>3%**.

Función interna `fire()`:
- En `dev` solo loguea a consola (`console.debug('[track]', …)`) → no contamina métricas.
- Envuelve cada llamada en `try/catch` → analytics nunca rompe la UI.
- Acepta `source` (ej: `'hero'`, `'navbar'`, `'pricing'`) para distinguir de dónde viene cada click en los reportes.

### `.env.example`
Plantilla con las dos variables públicas:

```env
PUBLIC_META_PIXEL_ID=
PUBLIC_GA_MEASUREMENT_ID=
```

> ⚠️ El prefijo `PUBLIC_` es obligatorio en SvelteKit para que la variable se exponga al cliente. Los IDs de Pixel y GA son públicos por diseño, no son secretos.

---

## 3. Archivos modificados

### `src/routes/+layout.svelte`
Se importa y monta `<MetaPixel />` junto a `<GoogleAnalytics />` para que ambos arranquen en todas las páginas.

### Componentes que ahora usan los helpers
- `src/lib/components/Hero.svelte` — botón "Agendar demo" → `trackSchedule('hero')`.
- `src/lib/components/ContactSection.svelte` — WhatsApp y email.
- `src/lib/components/WhatsappBubble.svelte` — burbuja flotante.
- `src/lib/components/Navbar.svelte` — botón demo + botón "Ingresar".
- `src/lib/pwa/InstallAppButton.svelte` — click en instalar PWA.
- `src/lib/pwa/InstallPromptToast.svelte` — click + outcome `accepted`.
- `src/lib/components/LeadForm.svelte` — submit exitoso del form `/agenda` → `trackLead('agenda_form', { pais, tipo_academia, alumnos, fuente })`.

Antes estos componentes llamaban `gtag(...)` inline. Ahora llaman al helper y reportan a Meta + GA al mismo tiempo.

### Embudo "Agendar demo" → `/agenda` → `Lead`

Todos los CTAs "Agendar demo" del sitio (Hero, Navbar desktop/mobile, ContactSection) ahora **navegan a la ruta `/agenda`** en vez de abrir el calendario de Google. El calendario externo quedó retirado.

Flujo de eventos:

1. **Click "Agendar demo"** desde landing → `trackSchedule('hero' | 'navbar_desktop' | 'navbar_mobile' | 'contact_section')` → dispara Meta `Schedule` + GA `schedule_demo_click`. Luego navega a `/agenda`.
2. **Submit exitoso del form `/agenda`** → `trackLead('agenda_form', { pais, tipo_academia, alumnos, fuente })` → dispara Meta `Lead` + GA `generate_lead`.

Schedule = intención. Lead = conversión. Permite medir el funnel (clicks → formulario completado) por fuente.

### Evento `Lead` (form `/agenda`)
- Se dispara **solo** cuando el POST al webhook de n8n responde 2xx.
- Params enviados a Meta y GA: `pais`, `tipo_academia`, `alumnos`, `fuente`.
- `source: 'agenda_form'` distingue este Lead de `trackPwaInstalled` (que también es Lead estándar pero con `source: 'pwa'`).
- Útil para optimizar campañas en Meta Ads (evento de conversión "Lead" + segmentación por país/tipo) y para reportes de conversión en GA4 (`generate_lead` es evento estándar de GA4).

---

## 4. Configuración por ambiente (Coolify)

En el panel de variables de entorno de Coolify (o `.env` local):

```env
PUBLIC_META_PIXEL_ID=1234567890123456
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

- El Pixel ID se saca de **Meta Business Manager → Administrador de eventos → tu conjunto de datos**.
- Si la variable queda vacía, el componente simplemente no carga el script (no rompe nada).

---

## 5. Cómo verificar que funciona

1. **En desarrollo** — abre la consola, deberías ver `[track] { fbStandard: 'Contact', … }` al hacer clic en WhatsApp. **No** se envía nada a Meta/GA real.
2. **En producción**:
   - Instala la extensión **Meta Pixel Helper** en Chrome.
   - Visita el sitio, navega entre rutas, haz clic en un CTA.
   - Deberías ver `PageView`, `Contact`, `Schedule`, etc. en la extensión.
   - En **Administrador de eventos de Meta** los eventos aparecen ~20 minutos después (modo Test Events los muestra al instante).

---

## 6. Cómo agregar un evento nuevo

1. Abre `src/lib/tracking/track.ts`.
2. Agrega una función nueva, por ejemplo:
   ```ts
   export function trackSignup(source: string) {
     fire('CompleteRegistration', null, 'signup', { source });
   }
   ```
3. Importa y úsala en el componente:
   ```ts
   import { trackSignup } from '$lib/tracking/track';
   // …
   onclick={() => trackSignup('pricing')}
   ```

Los nombres estándar de Meta están aquí: <https://developers.facebook.com/docs/meta-pixel/reference>.

---

## 7. Decisiones clave (para referencia futura)

- **Centralizar en `track.ts`** — evita duplicar lógica y deja la integración de plataformas nuevas en un solo archivo.
- **`source` siempre como parámetro** — permite segmentar en Meta/GA (ej: clicks de WhatsApp desde hero vs desde pricing).
- **No correr en `dev`** — evita inflar métricas con desarrollo local.
- **Errores envueltos en try/catch** — si Meta bloquea o el adblock interfiere, la UI sigue funcionando.
- **Eventos estándar cuando existen** (`Schedule`, `Contact`, `Lead`) — habilitan optimización automática de campañas en Meta Ads sin configuración extra.
