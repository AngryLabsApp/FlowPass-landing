# Graph Report - FlowPass-landing  (2026-11-18)

## Corpus Check
- 100 files · ~315,820 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 468 nodes · 672 edges · 36 communities (29 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `13318a40`
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
- livePricing.svelte.ts
- pricingData.js
- compilerOptions
- signup.ts
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
- registro/+page.svelte
- Testimonials.svelte
- blog/index.ts
- como-cobrar-mensualidades-sin-perseguir.md

## God Nodes (most connected - your core abstractions)
1. `fire()` - 14 edges
2. `FlowPass CRM V1 — Dev Spec (Fase 1)` - 14 edges
3. `compilerOptions` - 11 edges
4. `Sistema de Leads — FlowPass` - 11 edges
5. `load()` - 9 edges
6. `siteConfig` - 8 edges
7. `6. Lógica de `priority` (calculada en n8n)` - 8 edges
8. `scripts` - 7 edges
9. `👋 Hola, dev — léeme primero` - 7 edges
10. `Buenas prácticas que esperamos en toda la implementación` - 7 edges

## Surprising Connections (you probably didn't know these)
- `paisIso()` --calls--> `detectCountryCode()`  [EXTRACTED]
  src/lib/components/CalEmbed.svelte → src/lib/utils/country.ts
- `load()` --calls--> `postBySlug()`  [EXTRACTED]
  src/routes/blog/[slug]/+page.ts → src/lib/blog/index.ts
- `metaMetadata()` --calls--> `metaCookies()`  [EXTRACTED]
  src/lib/components/CalEmbed.svelte → src/lib/tracking/meta.ts
- `load()` --calls--> `disciplinaBySlug()`  [EXTRACTED]
  src/routes/software/[slug]/+page.ts → src/lib/data/disciplinas.ts
- `fallback()` --calls--> `trackPricingFallback()`  [EXTRACTED]
  src/lib/livePricing.svelte.ts → src/lib/tracking/track.ts

## Import Cycles
- None detected.

## Communities (36 total, 7 thin omitted)

### Community 0 - "site.ts"
Cohesion: 0.06
Nodes (19): socials, i(), small, aboutSEO, contactSEO, defaultSEO, homeSEO, privacySEO (+11 more)

### Community 1 - "FlowPass CRM V1 — Dev Spec (Fase 1)"
Cohesion: 0.05
Nodes (43): 10. Checklist de QA antes de pasar a producción, 1. Resumen, 2.bis Flujo visual, 2. Entregables, 3.1 Ya en producción, 3.2 Migraciones a aplicar, 3.3 Diccionario — qué guarda cada item y por qué, 3. Schema — estado actual + cambios (+35 more)

### Community 2 - "dependencies"
Cohesion: 0.07
Nodes (27): flowbite, flowbite-svelte, @heroicons/react, @lucide/svelte, dependencies, flowbite, flowbite-svelte, @heroicons/react (+19 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (37): autoprefixer, devDependencies, autoprefixer, postcss, svelte, svelte-check, @sveltejs/adapter-auto, @sveltejs/adapter-static (+29 more)

### Community 4 - "Sistema de Leads — FlowPass"
Cohesion: 0.09
Nodes (21): 10. Roadmap simplificado, 1. ¿Qué estamos construyendo?, 2. Herramientas que usamos, 3. Decisiones tomadas (no las re-discutas), 4. Schema de la tabla `leads` en Supabase, 5. Tareas pendientes (checklist), 6. Lógica de `priority` (calculada en n8n), 7. Stack de eventos de tracking (Pixel / GA) (+13 more)

### Community 5 - "llms-full.txt/+server.ts"
Cohesion: 0.16
Nodes (18): whatsappPackages, faqMainEntity, breadcrumbSchema(), buildAboutGraph(), buildHomeGraph(), faqPageSchema(), offersFromPlans(), organizationSchema() (+10 more)

### Community 6 - "track.ts"
Cohesion: 0.10
Nodes (21): dismiss(), install(), BIPEvent, pwaInstall, PwaInstallState, FbqArgs, fire(), GtagArgs (+13 more)

### Community 7 - "livePricing.svelte.ts"
Cohesion: 0.11
Nodes (27): applyCountry(), buildOptions(), DEFAULT_OPTION, fallback(), LIVE_PRICING_STATUS, LivePricingStatus, load(), loadLivePricing() (+19 more)

### Community 8 - "pricingData.js"
Cohesion: 0.08
Nodes (23): closeBenefits(), handleModalKeydown(), taxLabels, billingCycles, countries, CURRENCY_SYMBOL, EXTRA_SITE_FROM, FLOWY_BETA_BADGE (+15 more)

### Community 9 - "compilerOptions"
Cohesion: 0.14
Nodes (13): ./.svelte-kit/tsconfig.json, compilerOptions, allowImportingTsExtensions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution (+5 more)

### Community 10 - "signup.ts"
Cohesion: 0.23
Nodes (9): elegir(), verBeneficios(), FALLBACK_COUNTRIES, signupConfig(), signupLandingPlanId(), signupOpenFor(), signupSelfService(), signupTierKey() (+1 more)

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
Nodes (17): active, auto, baseTabs, inView, leadText, onKey(), paused, t (+9 more)

### Community 33 - "registro/+page.svelte"
Cohesion: 0.17
Nodes (5): loaded, metaMetadata(), paisIso(), cookie(), metaCookies()

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
- **196 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `WaCountryStore` connect `WaCountryStore` to `site.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06334841628959276 - nodes in this community are weakly interconnected._
- **Should `FlowPass CRM V1 — Dev Spec (Fase 1)` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._