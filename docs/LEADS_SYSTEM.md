# Sistema de Leads — FlowPass

> Documento de referencia para el equipo. Resume **qué hay que hacer**, **por qué**, **cómo**, y **quién**.
> Léelo de arriba a abajo antes de tocar nada.

---

## 1. ¿Qué estamos construyendo?

Un sistema sencillo para capturar prospectos (leads) interesados en FlowPass y darles seguimiento.

**Flujo completo:**

```
1. Persona entra al landing
2. Click en "Agendar demo" → va al form /agenda
3. Llena el form (nombre, WhatsApp, país, datos de su academia, etc.)
4. n8n recibe la data y la guarda en Supabase
5. Equipo comercial entra a Retool y ve los leads nuevos (revisión manual)
6. Equipo comercial escribe al lead por WhatsApp (manual, desde la app)
7. Si el lead avanza, el rep actualiza el `status` en Retool
8. Si el lead no responde, queda como "dormido" — se le manda oferta a los 3 meses
```

---

## 2. Herramientas que usamos

| Tool | Para qué | Costo | Estado |
|---|---|---|---|
| **SvelteKit landing** | Form `/agenda` | $0 | ✅ Listo |
| **n8n** | Pegamento: recibe form, valida y escribe en Supabase | Self-hosted | 🟡 Falta workflow |
| **Supabase** | Base de datos centralizada (única fuente de verdad) | Plan actual | 🟡 Falta tabla `leads` |
| **Retool** | CRM interno para que el equipo comercial gestione leads | Plan actual | 🟡 Falta dashboard |
| **WhatsApp Business App** | Comunicación con leads (manual) | $0 | ✅ Ya en uso |

> ❌ **NO usar todavía:** WhatsApp Business API (caro y complejo para nuestro volumen), CRM externos (HubSpot/Pipedrive/Close), marketing automation. Build for 100 leads/mes, no para 10.000.

---

## 3. Decisiones tomadas (no las re-discutas)

Para no perder tiempo en debates ya cerrados:

- **Asignación de leads a reps:** manual desde Retool, no auto por país.
- **Tracking de interacciones:** campo `notes` simple en la tabla. NO tabla `lead_interactions` aparte por ahora.
- **UTMs:** sí, los guardamos (para medir campañas Meta/Google Ads).
- **WhatsApp:** todo manual desde la app por 3-6 meses. Sin BSP (Twilio/360dialog/Wati). Cuando lleguemos a 300+ leads/mes, evaluamos.
- **Volumen esperado:** ~100 leads/mes en los primeros 3 meses. Diseñamos para eso, no más.

---

## 4. Schema de la tabla `leads` en Supabase

Esta es la migración SQL completa. Cópiala y pégala en el SQL Editor de Supabase para correrla.

```sql
-- ──────────────────────────────────────────────────────────────
-- Tabla `leads` — captación FlowPass
-- ──────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

create table public.leads (
  -- ── Identificadores ──────────────────────────
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null    default now(),
  updated_at timestamptz not null    default now(),

  -- ── Data del form (lo que n8n envía) ─────────
  nombre        text    not null,
  apellido      text    not null,
  email         text,                          -- opcional
  telefono      text    not null,              -- formato E.164: "+51999888777"
  pais_telefono text    not null,              -- derivado del prefijo del WhatsApp
  pais          text    not null,              -- selección explícita del form
  negocio       text    not null,              -- nombre de la academia
  tipo_academia text    not null,
  situacion     text    not null,
  rol           text    not null,
  alumnos       text    not null,              -- rango
  usa_software  boolean not null,
  fuente        text    not null,              -- "cómo nos conociste"
  origen        text    not null default 'n8n_form',

  -- ── Pipeline CRM ─────────────────────────────
  status text not null default 'new'
    check (status in (
      'new',         -- entró del form, sin contactar
      'contacted',   -- ventas le escribió por WhatsApp
      'qualified',   -- el lead confirmó interés en seguir hablando
      'won',         -- es cliente
      'lost',        -- no le interesó
      'dormido',     -- no responde
      're_engaged'   -- llenó form 2da vez (dedupe lo detectó)
    )),
  priority text not null default 'warm'
    check (priority in ('hot','warm','cold','skip')),

  -- ── Asignación al sales rep ──────────────────
  assigned_to uuid references auth.users(id) on delete set null,

  -- ── Fechas de seguimiento ────────────────────
  last_contacted_at timestamptz,
  next_followup_at  timestamptz,

  -- ── Notas (texto libre) ──────────────────────
  notes text,

  -- ── Atribución de tráfico (UTMs) ─────────────
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_content  text,
  referrer     text
);

-- ── Trigger updated_at automático ────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ── Índices ──────────────────────────────────────
create index leads_status_idx         on public.leads (status);
create index leads_priority_idx       on public.leads (priority);
create index leads_created_at_idx     on public.leads (created_at desc);
create index leads_assigned_to_idx    on public.leads (assigned_to);
create index leads_last_contacted_idx on public.leads (last_contacted_at);
create index leads_pais_idx           on public.leads (pais);
create index leads_telefono_idx       on public.leads (telefono);

-- ── RLS: solo service_role accede ─────────────────
alter table public.leads enable row level security;
```

---

## 5. Tareas pendientes (checklist)

### 🔴 Prioridad ALTA — bloqueantes para lanzar

- [ ] **TASK 1: Crear tabla `leads` en Supabase**
  - Abrir SQL Editor de Supabase.
  - Pegar la migración SQL completa (sección 4).
  - Ejecutar y verificar que la tabla existe.
  - **Owner:** Grecia (técnica).
  - **Estimado:** 15 min.

- [ ] **TASK 2: Configurar webhook de n8n**
  - Crear workflow nuevo en n8n: **"Form Lead → Supabase"**.
  - Trigger: **Webhook** (POST). Copiar la URL que genera.
  - Pegar esa URL en `.env` del landing como `PUBLIC_N8N_LEADS_WEBHOOK=...` (y en Coolify para producción).
  - Pasos del workflow:
    1. Recibir JSON del form.
    2. Calcular `priority` (ver sección 6).
    3. Verificar si ya existe el `telefono` en Supabase.
       - Si **existe**: UPDATE → `status='re_engaged'`, `last_contacted_at=null`.
       - Si **no**: INSERT con todos los campos del payload.
  - **Owner:** Grecia + un becario.
  - **Estimado:** 2 horas.

- [ ] **TASK 3: Conectar Retool a la tabla `leads`**
  - En Retool, crear un Resource nuevo apuntando a Supabase (Postgres direct, usar `service_role` key).
  - Crear app nueva: "FlowPass — Leads CRM".
  - Verificar que se pueden leer y editar leads.
  - **Owner:** Grecia.
  - **Estimado:** 1 hora.

- [ ] **TASK 4: Construir dashboard Retool básico**
  - Vistas (tabs) que necesita el equipo comercial:
    - **Mis leads**: filtra `assigned_to = current_user_id` y status no cerrado.
    - **Sin asignar**: filtra `assigned_to IS NULL` y status=`new`.
    - **Para hoy**: filtra `next_followup_at <= today`.
    - **Dormidos +90 días**: filtra para campaña de re-engagement.
  - Cada lead debe mostrar: nombre, WhatsApp (link clickeable a `https://wa.me/{telefono}`), país, tipo academia, alumnos, situación, rol, fuente, status, priority, fechas.
  - Botones de acción (lo que el rep clickea):
    - "Tomar este lead" → asigna al user actual.
    - "Marcar contactado" → actualiza `last_contacted_at = now()` y `status='contacted'`.
    - "Marcar interesado" → `status='qualified'`.
    - "Ganado" / "Perdido" / "Mover a dormido".
  - **Owner:** Grecia + becarios (Retool no requiere código duro).
  - **Estimado:** 1-2 días.

### 🟡 Prioridad MEDIA — para próxima iteración

- [ ] **TASK 5: UTMs en el form**
  - El landing debe capturar UTMs de la URL (`?utm_source=meta&utm_medium=cpc&...`) y enviarlos al webhook.
  - Modificar `LeadForm.svelte` para leer `URLSearchParams` al montar.
  - Agregar al payload que va a n8n.
  - **Owner:** Grecia.
  - **Estimado:** 1 hora.

### 🟢 Prioridad BAJA — para más adelante

- [ ] **TASK 6: Campaña de re-engagement a 90 días**
  - Botón en Retool "Mandar oferta a dormidos".
  - Filtra leads con `last_contacted_at < now() - 90 days` y status `dormido` o `lost`.
  - Trigger a n8n que les manda WhatsApp manual (o template cuando tengamos BSP).
  - **Owner:** Grecia + comercial.
  - **Estimado:** 1 día.

- [ ] **TASK 7: Métricas / KPIs en Retool**
  - Dashboard con números:
    - Leads esta semana / mes
    - % aceptación de interés (`qualified / contacted`)
    - % cierre (`won / qualified`)
    - Leads dormidos +90 días (para campaña)
    - Atribución por `fuente` y `utm_source`
  - **Owner:** Grecia.
  - **Estimado:** 1 día.

- [ ] **TASK 8: WhatsApp Business API (cuando lleguemos a 300+ leads/mes)**
  - Evaluar **360dialog** o **Wati** como proveedor (BSP).
  - Sacar segundo número (Meta no permite coexistencia con la app).
  - Mantener el número actual para chat humano.
  - **Owner:** evaluar más adelante.
  - **Estimado:** N/A.

---

## 6. Lógica de `priority` (calculada en n8n)

La prioridad sale de combinar **3 cosas del form**:
- **`situacion`** — ¿ya tiene academia o todavía no?
- **`rol`** — ¿es dueño, staff, coach o alumno?
- **`alumnos`** — tamaño del centro.

### Las 4 categorías y por qué

| Priority | Significa | Por qué priorizar así |
|---|---|---|
| 🔥 **hot** | Dueño activo con academia funcionando | Decision-maker + necesidad real → cierra rápido |
| 🟡 **warm** | Staff o coach de academia activa | Influencer, no decide solo, pero abre puerta al dueño |
| 🟢 **cold** | Va a abrir academia en los próximos meses | Interesado pero todavía no listo para comprar |
| ⚫ **skip** | Alumno o "solo busca dónde entrenar" | No es nuestro cliente, no perder tiempo |

### Reglas exactas (en orden de evaluación)

n8n evalúa de arriba hacia abajo. Se queda con la primera regla que matchea.

**1. SKIP** — descartar de una:
```
SI rol = 'Alumno'
   O situacion = 'No, solo busco dónde entrenar/estudiar'
→ priority = 'skip'
```
*No es cliente potencial. No mover a ventas.*

---

**2. HOT** — dueño con academia funcionando:
```
SI situacion = 'Sí, ya tengo una'
   Y rol = 'Dueño/Propietario/Gerente'
   Y alumnos ≠ 'Aún no está abierto'
→ priority = 'hot'
```
*Tiene negocio activo, manda él, tamaño definido. Mejor lead posible.*

---

**3. WARM** — staff o coach de academia funcionando:
```
SI situacion = 'Sí, ya tengo una'
   Y rol IN ('Staff de la academia', 'Coach/Instructor')
   Y alumnos ≠ 'Aún no está abierto'
→ priority = 'warm'
```
*Trabaja en la academia pero no decide la compra. Hay que ganarse al dueño a través de él.*

---

**4. COLD** — va a abrir academia pronto:
```
SI situacion IN (
     'No, pero abriré en menos de 3 meses',
     'No, pero estoy pensando en abrir una'
   )
   Y rol ≠ 'Alumno'
→ priority = 'cold'
   (alumnos da igual, no importa)
```
*Le falta para arrancar. Vale la pena nutrir pero no es prioridad.*

---

**5. Fallback** — cualquier otra combinación cae acá:
```
SINO → priority = 'cold'
```

### Ejemplos para entender

| situacion | rol | alumnos | Resultado |
|---|---|---|---|
| Sí, ya tengo una | Dueño/Propietario/Gerente | Entre 80 y 200 | 🔥 hot |
| Sí, ya tengo una | Dueño/Propietario/Gerente | +350 | 🔥 hot |
| Sí, ya tengo una | Coach/Instructor | Menos de 30 | 🟡 warm |
| Sí, ya tengo una | Staff de la academia | Entre 30 y 80 | 🟡 warm |
| No, pero abriré en menos de 3 meses | Dueño/Propietario/Gerente | Aún no está abierto | 🟢 cold |
| No, pero estoy pensando en abrir una | Coach/Instructor | Aún no está abierto | 🟢 cold |
| No, solo busco dónde entrenar/estudiar | (cualquiera) | (cualquiera) | ⚫ skip |
| (cualquiera) | Alumno | (cualquiera) | ⚫ skip |

### Regla de oro para el equipo comercial

**Atacar los 🔥 hot primero**. Después 🟡 warm. Los 🟢 cold los persigues solo si tienes tiempo. Los ⚫ skip nunca.

Esto es el principio 80/20: 20% de los leads (los hot) traen 80% del revenue.

---

### 🧑‍💻 Para el dev junior — cómo implementarlo en n8n

Esta lógica vive en el workflow de n8n (TASK 2). En el nodo "Function" (o "Code") justo después de recibir el webhook, pega esto:

```js
// Inputs que vienen del form (n8n los recibe en `items[0].json`)
const { situacion, rol, alumnos } = items[0].json;

// Función pura — calcula la priority a partir de los 3 campos
function calcularPriority(situacion, rol, alumnos) {
  // 1. SKIP — descarta de una si es alumno o solo busca dónde entrenar
  if (rol === 'Alumno') return 'skip';
  if (situacion === 'No, solo busco dónde entrenar/estudiar') return 'skip';

  // 2. HOT — dueño con academia activa y con alumnos reales
  if (
    situacion === 'Sí, ya tengo una' &&
    rol === 'Dueño/Propietario/Gerente' &&
    alumnos !== 'Aún no está abierto'
  ) {
    return 'hot';
  }

  // 3. WARM — staff o coach de academia activa
  if (
    situacion === 'Sí, ya tengo una' &&
    (rol === 'Staff de la academia' || rol === 'Coach/Instructor') &&
    alumnos !== 'Aún no está abierto'
  ) {
    return 'warm';
  }

  // 4. COLD — va a abrir academia (no importa cuántos alumnos)
  if (
    situacion === 'No, pero abriré en menos de 3 meses' ||
    situacion === 'No, pero estoy pensando en abrir una'
  ) {
    return 'cold';
  }

  // 5. Fallback — cualquier caso raro cae acá
  return 'cold';
}

const priority = calcularPriority(situacion, rol, alumnos);

// Agrega `priority` al payload que se va a insertar en Supabase
items[0].json.priority = priority;
return items;
```

### 💡 Lo que necesita entender el junior

1. **El orden importa.** Si pones la regla de "HOT" antes que la de "SKIP", un alumno con un negocio grande sería marcado HOT (mal). Por eso SKIP va primero — descarta antes de evaluar las demás.

2. **`!==` vs `===`** — JavaScript usa **triple igual** (`===`) para comparar strings exactos. No uses `==` (doble) porque tiene reglas raras de conversión.

3. **Los strings tienen que ser idénticos** a los del form (mismas mayúsculas, acentos, signos). Si el form dice `"Dueño/Propietario/Gerente"` y el código compara con `"Dueño/Propietario"` (sin "Gerente"), **no matchea**. Copia y pega de la lista del form si tienes dudas.

4. **La función es pura.** Solo lee `situacion`, `rol`, `alumnos`, devuelve un string. No toca base de datos, no manda mails, nada. Esto es bueno: fácil de testear.

5. **Cómo testearlo manualmente:** abre la consola del navegador (F12) → pega la función → llamala con valores de prueba:
   ```js
   calcularPriority('Sí, ya tengo una', 'Dueño/Propietario/Gerente', 'Entre 80 y 200');
   // → "hot" ✅
   calcularPriority('Sí, ya tengo una', 'Alumno', '+350');
   // → "skip" ✅  (alumno gana sobre todo lo demás)
   ```

6. **¿Y si el form agrega opciones nuevas?** Si mañana agregan `"Otro"` a `rol`, la función va a caer en el fallback (`cold`). No crashea, pero hay que actualizar la lógica para clasificarlo bien. Cuando alguien edita el form, debe avisar.

### Valores válidos (referencia rápida)

Para que el junior los tenga a la mano:

**`situacion`** (4 opciones):
- `Sí, ya tengo una`
- `No, pero abriré en menos de 3 meses`
- `No, pero estoy pensando en abrir una`
- `No, solo busco dónde entrenar/estudiar`

**`rol`** (4 opciones):
- `Dueño/Propietario/Gerente`
- `Coach/Instructor`
- `Staff de la academia`
- `Alumno`

**`alumnos`** (6 opciones):
- `Aún no está abierto`
- `Menos de 30`
- `Entre 30 y 80`
- `Entre 80 y 200`
- `Entre 200 y 350`
- `+350`

---

## 7. Stack de eventos de tracking (Pixel / GA)

Ya implementado en `src/lib/tracking/track.ts`. Para detalles del funnel completo, ver `docs/META_PIXEL.md`.

**Lo importante para este sistema:**
- Cuando el lead llena el form → dispara `Lead` (Meta) + `generate_lead` (GA4).
- Esto permite optimizar campañas de Meta Ads / Google Ads automáticamente.

---

## 8. Cosas que NO debes hacer

Para ahorrarte tiempo y dolor:

- ❌ **No construir un CRM custom**. Retool sobre Supabase ya es nuestro CRM.
- ❌ **No automatizar WhatsApp** todavía. Es caro y complejo para nuestro volumen.
- ❌ **No agregar campos al form** sin discutirlo. Cada campo extra = drop-off de conversión.
- ❌ **No olvides la migración SQL** cuando despliegues. Si la tabla no existe, n8n falla silencioso.
- ❌ **No expongas `service_role` key en el frontend**. Solo en n8n y Retool (backend).
- ❌ **No abuses del campo `notes`**. Si las notas crecen y se vuelven inmanejables, migramos a tabla `lead_interactions`.

---

## 9. ¿Algo no entendiste? Preguntale a:

- **Schema / Supabase / n8n:** Grecia
- **Retool / dashboards:** Grecia
- **Mensajería WhatsApp:** equipo comercial
- **Pixel / tracking:** ver `docs/META_PIXEL.md`

---

## 10. Roadmap simplificado

```
HOY                        SEMANA 2-3                 MES 2+
───────────────────────    ────────────────────       ───────────────────
✅ Form en landing         ⬜ UTMs                    ⬜ Campaña 90 días
🟡 Schema en Supabase                                 ⬜ KPIs en Retool
🟡 n8n workflow                                       ⬜ WhatsApp BSP (?)
🟡 Retool básico
```

Build for 100, not 10.000. **Cuando el problema duela, lo resolvemos. No antes.**
