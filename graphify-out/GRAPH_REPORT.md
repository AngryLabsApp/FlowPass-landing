# Graph Report - FlowPass-landing  (2026-09-11)

## Corpus Check
- 48 files · ~201,886 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 291 nodes · 353 edges · 28 communities (22 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6fbd260a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- site.ts
- FlowPass CRM V1 — Dev Spec (Fase 1)
- dependencies
- devDependencies
- Sistema de Leads — FlowPass
- schemas.ts
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

## God Nodes (most connected - your core abstractions)
1. `FlowPass CRM V1 — Dev Spec (Fase 1)` - 14 edges
2. `compilerOptions` - 11 edges
3. `Sistema de Leads — FlowPass` - 11 edges
4. `siteConfig` - 8 edges
5. `fire()` - 8 edges
6. `6. Lógica de `priority` (calculada en n8n)` - 8 edges
7. `scripts` - 7 edges
8. `👋 Hola, dev — léeme primero` - 7 edges
9. `Buenas prácticas que esperamos en toda la implementación` - 7 edges
10. `buildHomeGraph()` - 6 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (28 total, 6 thin omitted)

### Community 0 - "site.ts"
Cohesion: 0.10
Nodes (13): aboutSEO, defaultSEO, SEOPage, termsSEO, siteConfig, CountryCode, VALID, waCountry (+5 more)

### Community 1 - "FlowPass CRM V1 — Dev Spec (Fase 1)"
Cohesion: 0.06
Nodes (30): 10. Checklist de QA antes de pasar a producción, 1. Resumen, 2.bis Flujo visual, 2. Entregables, 3.1 Ya en producción, 3.2 Migraciones a aplicar, 3.3 Diccionario — qué guarda cada item y por qué, 3. Schema — estado actual + cambios (+22 more)

### Community 2 - "dependencies"
Cohesion: 0.07
Nodes (27): flowbite, flowbite-svelte, @heroicons/react, @lucide/svelte, dependencies, flowbite, flowbite-svelte, @heroicons/react (+19 more)

### Community 3 - "devDependencies"
Cohesion: 0.08
Nodes (25): autoprefixer, devDependencies, autoprefixer, postcss, svelte, svelte-check, @sveltejs/adapter-auto, @sveltejs/adapter-static (+17 more)

### Community 4 - "Sistema de Leads — FlowPass"
Cohesion: 0.09
Nodes (21): 10. Roadmap simplificado, 1. ¿Qué estamos construyendo?, 2. Herramientas que usamos, 3. Decisiones tomadas (no las re-discutas), 4. Schema de la tabla `leads` en Supabase, 5. Tareas pendientes (checklist), 6. Lógica de `priority` (calculada en n8n), 7. Stack de eventos de tracking (Pixel / GA) (+13 more)

### Community 5 - "schemas.ts"
Cohesion: 0.15
Nodes (19): homeSEO, plans, whatsappPackages, faqMainEntity, breadcrumbSchema(), buildAboutGraph(), buildHomeGraph(), faqPageSchema() (+11 more)

### Community 6 - "track.ts"
Cohesion: 0.15
Nodes (14): BIPEvent, pwaInstall, PwaInstallState, FbqArgs, fire(), GtagArgs, trackContact(), trackEmailClick() (+6 more)

### Community 7 - "PricingSection.svelte"
Cohesion: 0.17
Nodes (3): closeBenefits(), handleModalKeydown(), taxLabels

### Community 8 - "pricingData.js"
Cohesion: 0.17
Nodes (13): billingCycles, countries, FLOWY_BETA_BADGE, formatPrice(), formatPriceParts(), getPlanPrice(), getPromoCountryConfig(), getPromoPrice() (+5 more)

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

## Knowledge Gaps
- **139 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+134 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `FlowPass CRM V1 — Dev Spec (Fase 1)` connect `FlowPass CRM V1 — Dev Spec (Fase 1)` to `Buenas prácticas que esperamos en toda la implementación`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _139 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `FlowPass CRM V1 — Dev Spec (Fase 1)` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._