# Graph Report - FlowPass-landing  (2026-11-09)

## Corpus Check
- 96 files · ~308,954 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 438 nodes · 612 edges · 37 communities (30 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `02caf959`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- site.ts
- FlowPass CRM V1 — Dev Spec (Fase 1)
- dependencies
- devDependencies
- Sistema de Leads — FlowPass
- llms-full.txt/+server.ts
- track.ts
- PricingSection.svelte
- pricingData.js
- compilerOptions
- Buenas prácticas que esperamos en toda la implementación
- package.json
- sv
- PWA Install — Temporal
- WaCountryStore
- app.d.ts
- service-worker.ts
- prerender
- svelte.config.js
- tailwind.config.js
- Rediseño de la landing — archivos de trabajo
- prerender
- routes/+page.svelte
- supabase.ts
- Testimonials.svelte
- blog/index.ts
- como-cobrar-mensualidades-sin-perseguir.md

## God Nodes (most connected - your core abstractions)
1. `FlowPass CRM V1 — Dev Spec (Fase 1)` - 14 edges
2. `fire()` - 13 edges
3. `compilerOptions` - 11 edges
4. `Sistema de Leads — FlowPass` - 11 edges
5. `siteConfig` - 8 edges
6. `6. Lógica de `priority` (calculada en n8n)` - 8 edges
7. `scripts` - 7 edges
8. `👋 Hola, dev — léeme primero` - 7 edges
9. `Buenas prácticas que esperamos en toda la implementación` - 7 edges
10. `buildHomeGraph()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `load()` --calls--> `postBySlug()`  [EXTRACTED]
  src/routes/blog/[slug]/+page.ts → src/lib/blog/index.ts
- `money()` --calls--> `formatPriceParts()`  [EXTRACTED]
  src/lib/components/home/HomePricing.svelte → src/lib/data/pricingData.js
- `load()` --calls--> `disciplinaBySlug()`  [EXTRACTED]
  src/routes/software/[slug]/+page.ts → src/lib/data/disciplinas.ts
- `install()` --calls--> `trackPwaInstallClick()`  [EXTRACTED]
  src/lib/pwa/InstallPromptToast.svelte → src/lib/tracking/track.ts
- `install()` --calls--> `trackPwaInstalled()`  [EXTRACTED]
  src/lib/pwa/InstallPromptToast.svelte → src/lib/tracking/track.ts

## Import Cycles
- None detected.

## Communities (37 total, 7 thin omitted)

### Community 0 - "site.ts"
Cohesion: 0.07
Nodes (17): socials, small, aboutSEO, contactSEO, defaultSEO, privacySEO, SEOPage, studentTermsSEO (+9 more)

### Community 1 - "FlowPass CRM V1 — Dev Spec (Fase 1)"
Cohesion: 0.06
Nodes (30): 10. Checklist de QA antes de pasar a producción, 1. Resumen, 2.bis Flujo visual, 2. Entregables, 3.1 Ya en producción, 3.2 Migraciones a aplicar, 3.3 Diccionario — qué guarda cada item y por qué, 3. Schema — estado actual + cambios (+22 more)

### Community 2 - "dependencies"
Cohesion: 0.07
Nodes (29): flowbite, flowbite-svelte, @heroicons/react, @lucide/svelte, dependencies, flowbite, flowbite-svelte, @heroicons/react (+21 more)

### Community 3 - "devDependencies"
Cohesion: 0.08
Nodes (25): autoprefixer, devDependencies, autoprefixer, postcss, svelte, svelte-check, @sveltejs/adapter-auto, @sveltejs/adapter-static (+17 more)

### Community 4 - "Sistema de Leads — FlowPass"
Cohesion: 0.09
Nodes (21): 10. Roadmap simplificado, 1. ¿Qué estamos construyendo?, 2. Herramientas que usamos, 3. Decisiones tomadas (no las re-discutas), 4. Schema de la tabla `leads` en Supabase, 5. Tareas pendientes (checklist), 6. Lógica de `priority` (calculada en n8n), 7. Stack de eventos de tracking (Pixel / GA) (+13 more)

### Community 5 - "llms-full.txt/+server.ts"
Cohesion: 0.15
Nodes (19): homeSEO, plans, faqMainEntity, breadcrumbSchema(), buildAboutGraph(), buildHomeGraph(), faqPageSchema(), offersFromPlans() (+11 more)

### Community 6 - "track.ts"
Cohesion: 0.12
Nodes (21): dismiss(), install(), BIPEvent, pwaInstall, PwaInstallState, FbqArgs, fire(), GtagArgs (+13 more)

### Community 7 - "PricingSection.svelte"
Cohesion: 0.25
Nodes (3): closeBenefits(), handleModalKeydown(), taxLabels

### Community 8 - "pricingData.js"
Cohesion: 0.13
Nodes (19): elegir(), money(), verBeneficios(), billingCycles, countries, EXTRA_SITE_FROM, FLOWY_BETA_BADGE, formatPrice() (+11 more)

### Community 9 - "compilerOptions"
Cohesion: 0.14
Nodes (13): ./.svelte-kit/tsconfig.json, compilerOptions, allowImportingTsExtensions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution (+5 more)

### Community 10 - "Buenas prácticas que esperamos en toda la implementación"
Cohesion: 0.15
Nodes (13): Antes de empezar, asegúrate de tener acceso a:, 🗄️ Base de datos, Buenas prácticas que esperamos en toda la implementación, Cómo está organizado este doc, 📦 Datos, 👋 Hola, dev — léeme primero, 📊 Observabilidad, 🧪 Pruebas (+5 more)

### Community 11 - "package.json"
Cohesion: 0.15
Nodes (12): name, packageManager, private, scripts, build, check, check:watch, dev (+4 more)

### Community 12 - "sv"
Cohesion: 0.40
Nodes (4): Building, Creating a project, Developing, sv

### Community 13 - "PWA Install — Temporal"
Cohesion: 0.40
Nodes (4): Contenido, Cómo retirar todo cuando salga la app nativa, Cómo se conecta al resto del proyecto, PWA Install — Temporal

### Community 28 - "Rediseño de la landing — archivos de trabajo"
Cohesion: 0.29
Nodes (6): Decisiones tomadas, Hallazgos en las fuentes de marca, Pendiente, Qué hay, Rediseño de la landing — archivos de trabajo, Regenerar y republicar

### Community 31 - "routes/+page.svelte"
Cohesion: 0.07
Nodes (16): active, auto, baseTabs, inView, leadText, paused, t, tabs (+8 more)

### Community 33 - "supabase.ts"
Cohesion: 0.09
Nodes (15): isOpen, scrolled, SIGNUP_COUNTRIES, signupConfig(), signupLandingPlanId(), signupOpenFor(), signupSelfService(), signupTierKey() (+7 more)

### Community 34 - "Testimonials.svelte"
Cohesion: 0.28
Nodes (4): loadInstagram(), processEmbeds(), googleRating, googleReviews

### Community 35 - "blog/index.ts"
Cohesion: 0.11
Nodes (17): esc(), files, inline(), parse(), Post, postBySlug(), posts, render() (+9 more)

### Community 36 - "como-cobrar-mensualidades-sin-perseguir.md"
Cohesion: 0.25
Nodes (7): 1. Cobra siempre el mismo día, 2. Avisa antes, no después, 3. Que cada alumno vea su estado solo, 4. Revisa una sola lista de deudores, 5. Facilita el pago, ¿Por qué tus alumnos se atrasan?, ¿Y si lo hace un sistema por ti?

## Knowledge Gaps
- **185 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `WaCountryStore` connect `WaCountryStore` to `site.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _185 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07053140096618357 - nodes in this community are weakly interconnected._
- **Should `FlowPass CRM V1 — Dev Spec (Fase 1)` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._