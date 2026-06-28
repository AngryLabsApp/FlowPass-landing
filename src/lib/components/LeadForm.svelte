<script lang="ts">
  import { PUBLIC_N8N_LEADS_WEBHOOK } from "$env/static/public";
  import { onMount, tick } from "svelte";
  import { page } from "$app/stores";
  import { z } from "zod";
  import {
    parsePhoneNumberFromString,
    type CountryCode,
  } from "libphonenumber-js";
  import { trackLead } from "$lib/tracking/track";

  type Props = {
    calLink?: string;
  };

  let { calLink = "" }: Props = $props();

  function flag(code: string): string {
    return code
      .toUpperCase()
      .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  }

  const countries = [
    { code: "PE", name: "Perú", dial: "+51" },
    { code: "MX", name: "México", dial: "+52" },
    { code: "CL", name: "Chile", dial: "+56" },
    { code: "CO", name: "Colombia", dial: "+57" },
    { code: "AR", name: "Argentina", dial: "+54" },
    { code: "EC", name: "Ecuador", dial: "+593" },
    { code: "BO", name: "Bolivia", dial: "+591" },
  ] as const;

  const tiposAcademia = [
    "Gimnasio",
    "Pilates / Yoga / Barre",
    "CrossFit",
    "Entrenamiento funcional",
    "Indoor cycling",
    "Box",
    "Artes marciales",
    "Academia de baile",
    "Academia deportiva (fútbol, vóley, etc.)",
    "Natación",
    "Escuela de música / arte",
    "Escuela de teatro",
    "Escuela de idiomas",
    "Centro de capacitación / formación",
    "Centro de estimulación temprana",
    "Coach deportivo / personal trainer",
    "Otros",
  ];

  const situaciones = [
    "Sí, ya tengo una",
    "No, pero abriré en menos de 3 meses",
    "No, pero estoy pensando en abrir una",
    "No, solo busco dónde entrenar/estudiar",
  ];

  const roles = [
    "Dueño/Propietario/Gerente",
    "Coach/Instructor",
    "Staff de la academia",
    "Alumno",
  ];

  const paises = ["Perú", "México", "Chile", "Colombia", "Argentina", "Ecuador", "Bolivia"];

  const tamanos = [
    "Aún no está abierto",
    "Menos de 30",
    "Entre 30 y 80",
    "Entre 80 y 200",
    "Entre 200 y 350",
    "+350",
  ];

  const softwareOpts = ["Sí", "No"];

  const fuentes = [
    "Vi un anuncio",
    "Me lo recomendó alguien",
    "Busqué en Google",
    "Otro",
  ];

  // Defaults usados cuando un campo opcional queda vacío al enviar,
  // para mantener compatibilidad con CHECK constraints del CRM.
  const DEFAULTS = {
    pais: "Otro",
    negocio: "—",
    rol: "Dueño/Propietario/Gerente",
    usaSoftware: "No",
    fuente: "Otro",
  } as const;

  let nombre = $state("");
  let apellido = $state("");
  let countryCode = $state("PE");
  let telefono = $state("");
  let email = $state("");
  let negocio = $state("");
  let tipoAcademia = $state("");
  let situacion = $state("");
  let rol = $state("");
  let pais = $state("");
  let alumnos = $state("");
  let usaSoftware = $state("");
  let fuente = $state("");
  let website = $state(""); // honeypot — debe quedar vacío

  let currentStep = $state(1);
  const totalSteps = 2;

  let status = $state<"idle" | "loading" | "success" | "error">("idle");
  let errorMsg = $state("");
  let fieldErrors = $state<Record<string, string>>({});
  let formLoadedAt = 0;

  // Autodetect país por IP (ipapi.co — gratis, sin key). Cae a 'PE' si falla.
  onMount(async () => {
    formLoadedAt = Date.now();
    // Autofocus en primer campo del wizard (nombre)
    await tick();
    const first = document.getElementById("nombre");
    if (first && typeof (first as HTMLElement).focus === "function") {
      (first as HTMLElement).focus();
    }
    if (telefono) return; // si el user ya empezó a escribir, no lo cambies
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 2500);
      const res = await fetch("https://ipapi.co/json/", {
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) return;
      const data = await res.json();
      const cc = String(data?.country_code ?? "").toUpperCase();
      if (countries.some((c) => c.code === cc)) {
        countryCode = cc;
      }
    } catch {
      // silencio: no afecta UX
    }
  });
  let touched = $state<Record<string, boolean>>({});

  const tiposAcademiaValues = tiposAcademia as readonly string[];
  const situacionesValues = situaciones as readonly string[];
  const rolesValues = roles as readonly string[];
  const paisesValues = paises as readonly string[];
  const tamanosValues = tamanos as readonly string[];
  const softwareValues = softwareOpts as readonly string[];
  const fuentesValues = fuentes as readonly string[];

  // Solo letras (incluye acentos, ñ), espacios, apóstrofes y guiones.
  const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿÑñ' -]+$/;

  const baseSchema = z.object({
    nombre: z
      .string()
      .trim()
      .min(2, "Ingresa tu nombre.")
      .regex(NAME_REGEX, "El nombre solo debe contener letras."),
    apellido: z
      .string()
      .trim()
      .min(2, "Ingresa tu apellido.")
      .regex(NAME_REGEX, "El apellido solo debe contener letras."),
    email: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        "Ingresa un correo válido.",
      ),
    // OPCIONAL: si llega vacío, se rellena con default antes de enviar.
    negocio: z.string().trim().optional(),
    // REQUERIDO
    tipoAcademia: z
      .string()
      .refine((v) => tiposAcademiaValues.includes(v), "Selecciona una opción."),
    // REQUERIDO
    situacion: z
      .string()
      .refine((v) => situacionesValues.includes(v), "Selecciona una opción."),
    // OPCIONAL — si llega, debe ser válido
    rol: z
      .string()
      .optional()
      .refine(
        (v) => !v || rolesValues.includes(v),
        "Selecciona una opción válida.",
      ),
    // OPCIONAL — si llega, debe ser válido
    pais: z
      .string()
      .optional()
      .refine(
        (v) => !v || paisesValues.includes(v),
        "Selecciona una opción válida.",
      ),
    // REQUERIDO
    alumnos: z
      .string()
      .refine((v) => tamanosValues.includes(v), "Selecciona una opción."),
    // OPCIONAL
    usaSoftware: z
      .string()
      .optional()
      .refine(
        (v) => !v || softwareValues.includes(v),
        "Selecciona una opción válida.",
      ),
    // OPCIONAL
    fuente: z
      .string()
      .optional()
      .refine(
        (v) => !v || fuentesValues.includes(v),
        "Selecciona una opción válida.",
      ),
  });

  function validatePhone(raw: string, country: CountryCode): string | null {
    if (!raw.trim()) return "Ingresa tu número de WhatsApp.";
    const parsed = parsePhoneNumberFromString(raw, country);
    if (!parsed || !parsed.isValid()) {
      return "Número inválido para el país seleccionado.";
    }
    return null;
  }

  function valueOf(field: string): unknown {
    switch (field) {
      case "nombre":
        return nombre;
      case "apellido":
        return apellido;
      case "email":
        return email;
      case "negocio":
        return negocio;
      case "tipoAcademia":
        return tipoAcademia;
      case "situacion":
        return situacion;
      case "rol":
        return rol;
      case "pais":
        return pais;
      case "alumnos":
        return alumnos;
      case "usaSoftware":
        return usaSoftware;
      case "fuente":
        return fuente;
      default:
        return "";
    }
  }

  function validateField(field: string, mode: "live" | "full" = "full") {
    if (field === "telefono") {
      // En live, ignora si todavía no escribió números reales
      if (mode === "live" && telefono.replace(/\D/g, "").length < 3) {
        const next = { ...fieldErrors };
        delete next.telefono;
        fieldErrors = next;
        return;
      }
      const err = validatePhone(telefono, countryCode as CountryCode);
      const next = { ...fieldErrors };
      if (err) next.telefono = err;
      else delete next.telefono;
      fieldErrors = next;
      return;
    }
    const shape = (baseSchema.shape as Record<string, z.ZodTypeAny>)[field];
    if (!shape) return;
    const value = valueOf(field);
    const result = shape.safeParse(value);
    let msg = "";
    if (!result.success) {
      let issues = result.error.issues;
      // En live: ignora "muy corto" si todavía está escribiendo. Mantén errores de formato (regex/email).
      if (mode === "live" && typeof value === "string" && value.length > 0) {
        issues = issues.filter((i) => i.code !== "too_small");
      }
      // En live con valor vacío: no grites todavía.
      if (mode === "live" && typeof value === "string" && value.length === 0) {
        issues = [];
      }
      msg = issues[0]?.message ?? "";
    }
    const next = { ...fieldErrors };
    if (msg) next[field] = msg;
    else delete next[field];
    fieldErrors = next;
  }

  function markTouched(field: string) {
    touched = { ...touched, [field]: true };
    validateField(field, "full");
  }

  // Valida en vivo desde la 1a tecla — sólo errores de formato, no de longitud.
  function liveValidate(field: string) {
    validateField(field, touched[field] ? "full" : "live");
  }

  // Validación de paso 1: nombre, apellido, telefono (obligatorios) + email (si llega)
  function validateStep1(): boolean {
    ["nombre", "apellido", "email", "telefono"].forEach((f) =>
      validateField(f, "full"),
    );
    const blockers = ["nombre", "apellido", "telefono", "email"];
    return blockers.every((f) => !fieldErrors[f]);
  }

  async function goNext() {
    if (!validateStep1()) {
      // foco en el primer error
      const order = ["nombre", "apellido", "telefono", "email"];
      const first = order.find((f) => fieldErrors[f]);
      if (first) {
        const id = first === "telefono" ? "telefono" : first;
        const el = document.getElementById(id);
        if (el) (el as HTMLElement).focus();
      }
      return;
    }
    currentStep = 2;
    await tick();
    const sit = document.querySelector<HTMLElement>('input[name="situacion"]');
    if (sit) sit.focus();
    // scroll al top del card al cambiar de paso
    const card = document.querySelector<HTMLElement>(".lead-card");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function goBack() {
    currentStep = 1;
    await tick();
    const card = document.querySelector<HTMLElement>(".lead-card");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (status === "loading") return;

    // Honeypot: bot rellenó campo invisible → fingir éxito y descartar.
    if (website.trim() !== "") {
      status = "success";
      return;
    }

    // Time-to-fill: humanos tardan >3s. Submit más rápido = bot.
    if (formLoadedAt && Date.now() - formLoadedAt < 3000) {
      status = "success";
      return;
    }

    const lastSubmit = localStorage.getItem("last_lead_submit");
    if (lastSubmit) {
      const timeSince = Date.now() - parseInt(lastSubmit, 10);
      if (timeSince < 60 * 1000) {
        status = "success";
        return;
      }
    }

    const errs: Record<string, string> = {};

    const parsedFields = baseSchema.safeParse({
      nombre,
      apellido,
      email,
      negocio,
      tipoAcademia,
      situacion,
      rol,
      pais,
      alumnos,
      usaSoftware,
      fuente,
    });

    if (!parsedFields.success) {
      for (const issue of parsedFields.error.issues) {
        const key = issue.path[0] as string;
        if (key && !errs[key]) errs[key] = issue.message;
      }
    }

    const phoneErr = validatePhone(telefono, countryCode as CountryCode);
    if (phoneErr) errs.telefono = phoneErr;

    fieldErrors = errs;

    if (Object.keys(errs).length > 0) {
      // Si el error está en paso 1, devolver al usuario al paso 1
      const step1Keys = ["nombre", "apellido", "email", "telefono"];
      if (step1Keys.some((k) => errs[k])) {
        currentStep = 1;
        await tick();
        const first = step1Keys.find((k) => errs[k]);
        if (first) {
          const el = document.getElementById(first);
          if (el) (el as HTMLElement).focus();
        }
      }
      errorMsg = "Revisa los campos marcados.";
      status = "error";
      return;
    }

    const country = countries.find((c) => c.code === countryCode)!;
    const phone = parsePhoneNumberFromString(
      telefono,
      countryCode as CountryCode,
    )!;
    const data = parsedFields.data!;

    // Defaults para campos opcionales vacíos (compat con CRM).
    const negocioFinal = (data.negocio ?? "").trim() || DEFAULTS.negocio;
    const paisFinal = data.pais || DEFAULTS.pais;
    const rolFinal = data.rol || DEFAULTS.rol;
    const usaSoftwareFinal = data.usaSoftware || DEFAULTS.usaSoftware;
    const fuenteFinal = data.fuente || DEFAULTS.fuente;

    const payload = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email ?? "",
      telefono: phone.format("E.164"),
      pais_telefono: country.name,
      pais: paisFinal,
      negocio: negocioFinal,
      tipo_academia: data.tipoAcademia,
      situacion: data.situacion,
      rol: rolFinal,
      alumnos: data.alumnos,
      usa_software: usaSoftwareFinal === "Sí",
      fuente: fuenteFinal,
      origen: "n8n_form",
      created_at: new Date().toISOString(),
      utm_source: $page.url.searchParams.get("utm_source") || "",
      utm_medium: $page.url.searchParams.get("utm_medium") || "",
      utm_campaign: $page.url.searchParams.get("utm_campaign") || "",
      utm_content: $page.url.searchParams.get("utm_content") || "",
      promo_code: ($page.url.searchParams.get("promo") || $page.url.searchParams.get("promo_code") || "").toUpperCase().trim(),
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };

    status = "loading";
    errorMsg = "";

    try {
      if (!PUBLIC_N8N_LEADS_WEBHOOK) {
        throw new Error("Webhook no configurado. Avisa al equipo.");
      }

      const res = await fetch(PUBLIC_N8N_LEADS_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(
          `No pudimos enviar tu información (código ${res.status}). Intenta de nuevo.`,
        );
      }

      trackLead("agenda_form", {
        pais: payload.pais,
        tipo_academia: payload.tipo_academia,
        alumnos: payload.alumnos,
        fuente: payload.fuente,
      });

      localStorage.setItem("last_lead_submit", Date.now().toString());
      status = "success";

      if (calLink) {
        setTimeout(() => {
          window.location.href = calLink;
        }, 1000);
      }
    } catch (err) {
      status = "error";
      errorMsg =
        err instanceof Error
          ? err.message
          : "No pudimos enviar tu información. Intenta de nuevo.";
    }
  }
</script>

<div class="lead-card">
  {#if status === "success"}
    <div class="success-container" role="status" aria-live="polite">
      <div class="success-icon-wrap">
        <svg class="success-icon" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="success-circle" cx="26" cy="26" r="24" stroke="#01f59e" stroke-width="3" fill="none" />
          <path class="success-check" d="M15 27l7 7 15-15" stroke="#01f59e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        </svg>
        <div class="success-pulse"></div>
      </div>

      <h2 class="success-title">¡Listo, {nombre}!</h2>
      <div class="success-divider"></div>
      <p class="success-body">
        Recibimos tus datos. En breve te escribimos por WhatsApp para coordinar tu asesoría 1:1 de 30 min con FlowPass.
      </p>

      {#if calLink}
        <p class="success-redirect">Te llevamos a elegir el horario…</p>
      {/if}
    </div>
  {:else}
    <!-- Progress indicator -->
    <div class="stepper" aria-label="Progreso del formulario">
      <div class="step-bar">
        <div
          class="step-bar-fill"
          style:width="{(currentStep / totalSteps) * 100}%"
        ></div>
      </div>
      <div class="step-meta">
        <span class="step-num">Paso {currentStep} de {totalSteps}</span>
        <span class="step-name">
          {currentStep === 1 ? "Datos de contacto" : "Sobre tu academia"}
        </span>
      </div>
    </div>

    <form onsubmit={handleSubmit} novalidate>
      <div class="honeypot" aria-hidden="true">
        <label for="website">No completar este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabindex="-1"
          autocomplete="off"
          bind:value={website}
        />
      </div>

      <!-- ───────────── PASO 1 ───────────── -->
      {#if currentStep === 1}
        <section class="section" aria-labelledby="step1-title">
          <h3 id="step1-title" class="section-title">Datos de contacto</h3>
          <div class="grid">
            <div class="field">
              <label for="nombre">Nombre <span class="req" aria-hidden="true">*</span></label>
              <input
                id="nombre"
                type="text"
                autocomplete="given-name"
                placeholder="Ej. María"
                bind:value={nombre}
                oninput={() => liveValidate("nombre")}
                onblur={() => markTouched("nombre")}
                aria-invalid={!!fieldErrors.nombre}
                aria-describedby={fieldErrors.nombre ? "err-nombre" : undefined}
                aria-required="true"
                required
              />
              {#if fieldErrors.nombre}
                <span id="err-nombre" class="err">{fieldErrors.nombre}</span>
              {/if}
            </div>

            <div class="field">
              <label for="apellido">Apellido <span class="req" aria-hidden="true">*</span></label>
              <input
                id="apellido"
                type="text"
                autocomplete="family-name"
                placeholder="Ej. Gómez"
                bind:value={apellido}
                oninput={() => liveValidate("apellido")}
                onblur={() => markTouched("apellido")}
                aria-invalid={!!fieldErrors.apellido}
                aria-describedby={fieldErrors.apellido ? "err-apellido" : undefined}
                aria-required="true"
                required
              />
              {#if fieldErrors.apellido}
                <span id="err-apellido" class="err">{fieldErrors.apellido}</span>
              {/if}
            </div>

            <div class="field field--full">
              <label for="telefono">WhatsApp de contacto <span class="req" aria-hidden="true">*</span></label>
              <div class="phone">
                <select
                  id="country"
                  aria-label="Código de país"
                  bind:value={countryCode}
                  onchange={() => liveValidate("telefono")}
                >
                  {#each countries as c}
                    <option value={c.code}>{flag(c.code)} {c.dial}</option>
                  {/each}
                </select>
                <input
                  id="telefono"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  placeholder="999 888 777"
                  bind:value={telefono}
                  oninput={() => liveValidate("telefono")}
                  onblur={() => markTouched("telefono")}
                  aria-invalid={!!fieldErrors.telefono}
                  aria-describedby={fieldErrors.telefono ? "err-telefono" : undefined}
                  aria-required="true"
                  required
                />
              </div>
              {#if fieldErrors.telefono}
                <span id="err-telefono" class="err">{fieldErrors.telefono}</span>
              {/if}
            </div>

            <div class="field field--full">
              <label for="email">Mail <span class="opt">(opcional)</span></label>
              <input
                id="email"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="tu@correo.com"
                bind:value={email}
                oninput={() => liveValidate("email")}
                onblur={() => markTouched("email")}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "err-email" : undefined}
              />
              {#if fieldErrors.email}
                <span id="err-email" class="err">{fieldErrors.email}</span>
              {/if}
            </div>
          </div>
        </section>

        <div class="nav-row">
          <button
            type="button"
            class="cta"
            onclick={goNext}
          >
            Siguiente
            <span class="cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>

        <p class="micro-trust">Gratuita · Sin compromiso · Te respondemos por WhatsApp</p>
      {/if}

      <!-- ───────────── PASO 2 ───────────── -->
      {#if currentStep === 2}
        <section class="section" aria-labelledby="step2-title">
          <h3 id="step2-title" class="section-title">Sobre tu academia</h3>
          <div class="grid">
            <div class="field">
              <label for="pais">¿En qué país está tu academia? <span class="opt">(opcional)</span></label>
              <select
                id="pais"
                bind:value={pais}
                onchange={() => markTouched("pais")}
                onblur={() => markTouched("pais")}
                aria-invalid={!!fieldErrors.pais}
                aria-describedby={fieldErrors.pais ? "err-pais" : undefined}
              >
                <option value="" disabled>Selecciona</option>
                {#each paises as p}
                  <option value={p}>{p}</option>
                {/each}
              </select>
              {#if fieldErrors.pais}
                <span id="err-pais" class="err">{fieldErrors.pais}</span>
              {/if}
            </div>

            <div class="field">
              <label for="negocio">Nombre de tu academia <span class="opt">(opcional)</span></label>
              <input
                id="negocio"
                type="text"
                autocomplete="organization"
                placeholder="Ej. Estudio Flow"
                bind:value={negocio}
                oninput={() => liveValidate("negocio")}
                onblur={() => markTouched("negocio")}
                aria-invalid={!!fieldErrors.negocio}
                aria-describedby={fieldErrors.negocio ? "err-negocio" : undefined}
              />
              {#if fieldErrors.negocio}
                <span id="err-negocio" class="err">{fieldErrors.negocio}</span>
              {/if}
            </div>

            <fieldset class="field field--full radios">
              <legend>¿Ya tienes tu academia? <span class="req" aria-hidden="true">*</span></legend>
              <div class="radio-group">
                {#each situaciones as opt, i}
                  <label class="radio">
                    <input
                      type="radio"
                      name="situacion"
                      value={opt}
                      bind:group={situacion}
                      onchange={() => markTouched("situacion")}
                      required={i === 0}
                    />
                    <span class="dot" aria-hidden="true"></span>
                    <span>{opt}</span>
                  </label>
                {/each}
              </div>
              {#if fieldErrors.situacion}
                <span class="err">{fieldErrors.situacion}</span>
              {/if}
            </fieldset>

            <fieldset class="field field--full radios">
              <legend>¿Qué función cumples en la academia? <span class="opt">(opcional)</span></legend>
              <div class="radio-group">
                {#each roles as opt, i}
                  <label class="radio">
                    <input
                      type="radio"
                      name="rol"
                      value={opt}
                      bind:group={rol}
                      onchange={() => markTouched("rol")}
                    />
                    <span class="dot" aria-hidden="true"></span>
                    <span>{opt}</span>
                  </label>
                {/each}
              </div>
              {#if fieldErrors.rol}
                <span class="err">{fieldErrors.rol}</span>
              {/if}
            </fieldset>

            <div class="field">
              <label for="tipo">Tipo de academia <span class="req" aria-hidden="true">*</span></label>
              <select
                id="tipo"
                bind:value={tipoAcademia}
                onchange={() => markTouched("tipoAcademia")}
                onblur={() => markTouched("tipoAcademia")}
                aria-invalid={!!fieldErrors.tipoAcademia}
                aria-describedby={fieldErrors.tipoAcademia ? "err-tipo" : undefined}
                aria-required="true"
                required
              >
                <option value="" disabled>Selecciona</option>
                {#each tiposAcademia as t}
                  <option value={t}>{t}</option>
                {/each}
              </select>
              {#if fieldErrors.tipoAcademia}
                <span id="err-tipo" class="err">{fieldErrors.tipoAcademia}</span>
              {/if}
            </div>

            <fieldset class="field field--full radios">
              <legend>¿Cuántos alumnos tiene el centro? <span class="req" aria-hidden="true">*</span></legend>
              <div class="radio-group radio-group--cols2">
                {#each tamanos as opt, i}
                  <label class="radio">
                    <input
                      type="radio"
                      name="alumnos"
                      value={opt}
                      bind:group={alumnos}
                      onchange={() => markTouched("alumnos")}
                      required={i === 0}
                    />
                    <span class="dot" aria-hidden="true"></span>
                    <span>{opt}</span>
                  </label>
                {/each}
              </div>
              {#if fieldErrors.alumnos}
                <span class="err">{fieldErrors.alumnos}</span>
              {/if}
            </fieldset>

            <fieldset class="field radios">
              <legend>¿Usas algún software de gestión? <span class="opt">(opcional)</span></legend>
              <div class="radio-group radio-group--inline">
                {#each softwareOpts as opt}
                  <label class="radio">
                    <input
                      type="radio"
                      name="usaSoftware"
                      value={opt}
                      bind:group={usaSoftware}
                      onchange={() => markTouched("usaSoftware")}
                    />
                    <span class="dot" aria-hidden="true"></span>
                    <span>{opt}</span>
                  </label>
                {/each}
              </div>
              {#if fieldErrors.usaSoftware}
                <span class="err">{fieldErrors.usaSoftware}</span>
              {/if}
            </fieldset>

            <fieldset class="field radios">
              <legend>¿Cómo nos conociste? <span class="opt">(opcional)</span></legend>
              <div class="radio-group">
                {#each fuentes as opt}
                  <label class="radio">
                    <input
                      type="radio"
                      name="fuente"
                      value={opt}
                      bind:group={fuente}
                      onchange={() => markTouched("fuente")}
                    />
                    <span class="dot" aria-hidden="true"></span>
                    <span>{opt}</span>
                  </label>
                {/each}
              </div>
              {#if fieldErrors.fuente}
                <span class="err">{fieldErrors.fuente}</span>
              {/if}
            </fieldset>
          </div>
        </section>

        {#if status === "error" && errorMsg}
          <div class="alert" role="alert">{errorMsg}</div>
        {/if}

        <p class="legal">
          Al continuar, acepto los
          <a href="/terminos" target="_blank" rel="noopener"
            >Términos y condiciones</a
          >.
        </p>

        <div class="nav-row nav-row--split">
          <button
            type="button"
            class="cta cta--ghost"
            onclick={goBack}
            disabled={status === "loading"}
          >
            <span class="cta-arrow cta-arrow--back" aria-hidden="true">←</span>
            Atrás
          </button>
          <button type="submit" class="cta" disabled={status === "loading"}>
            {#if status === "loading"}
              Enviando…
            {:else}
              Agenda tu asesoría
              <span class="cta-arrow" aria-hidden="true">→</span>
            {/if}
          </button>
        </div>

        <p class="micro-trust">Gratuita · Sin compromiso · Te respondemos por WhatsApp</p>
      {/if}
    </form>
  {/if}
</div>

<style>
  .honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }

  .lead-card {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    box-shadow:
      0 0 0 1px rgba(83, 29, 216, 0.18),
      0 18px 48px rgba(83, 29, 216, 0.28),
      0 4px 18px rgba(17, 17, 38, 0.18);
    padding: 16px;
    color: #111122;
    font-family: "Oktah Neue", system-ui, sans-serif;
  }

  /* ── Stepper ───────────────────────────── */
  .stepper {
    margin-bottom: 14px;
  }
  .step-bar {
    width: 100%;
    height: 4px;
    background: rgba(83, 29, 216, 0.1);
    border-radius: 999px;
    overflow: hidden;
  }
  .step-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #531dd8 0%, #01f59e 100%);
    border-radius: 999px;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .step-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 8px;
    gap: 8px;
  }
  .step-num {
    font-size: 0.7rem;
    font-weight: 700;
    color: #531dd8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .step-name {
    font-size: 0.72rem;
    font-weight: 600;
    color: #14142b;
  }

  .section {
    margin-bottom: 14px;
  }

  .section-title {
    font-family: 'Epoch', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: #531dd8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(83, 29, 216, 0.12);
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  .grid > .field > input,
  .grid > .field > select,
  .grid > .field > textarea {
    margin-top: auto;
  }

  .field--full {
    grid-column: 1 / -1;
  }

  label,
  legend {
    font-size: 0.72rem;
    font-weight: 600;
    color: #14142b;
    letter-spacing: 0.005em;
    line-height: 1.3;
  }

  legend {
    padding: 0;
    margin-bottom: 4px;
  }

  .opt {
    color: #8a8aa0;
    font-weight: 400;
    font-size: 0.64rem;
    margin-left: 2px;
  }

  input[type="text"],
  input[type="email"],
  input[type="tel"],
  select {
    width: 100%;
    height: 40px;
    padding: 0 12px;
    font-size: 16px;
    font-family: inherit;
    color: #111122;
    background: #f6f6f9;
    border: 1px solid rgba(17, 17, 38, 0.08);
    border-radius: 8px;
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
    box-sizing: border-box;
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23531DD8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 34px;
  }

  input::placeholder {
    color: #9a9aae;
    font-size: 0.86rem;
  }

  /* Select sin valor (placeholder) gris como inputs */
  select:has(option[value=""]:checked) {
    color: #7d7d93;
  }

  input:focus,
  select:focus {
    border-color: #531dd8;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(83, 29, 216, 0.18);
  }

  input[aria-invalid="true"],
  select[aria-invalid="true"] {
    border-color: #e44a5b;
    background: #fff7f8;
  }

  .phone {
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 6px;
  }

  .phone select {
    padding: 0 22px 0 8px;
    background-position: right 6px center;
  }

  .radios {
    border: none;
    padding: 0;
    margin: 0;
  }

  .radio-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .radio-group--inline {
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .radio-group--cols2 {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .radio {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 6px 10px;
    background: #f6f6f9;
    border: 1px solid rgba(17, 17, 38, 0.08);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    color: #2a2a3c;
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
  }

  .radio:hover {
    background: #efeff5;
  }

  .radio:has(input:checked) {
    border-color: #531dd8;
    background: #f1edff;
    color: #1d1d2e;
  }

  .radio:has(input:focus-visible) {
    box-shadow: 0 0 0 3px rgba(83, 29, 216, 0.18);
  }

  /* Radio nativo oculto; el dot visible lo dibuja .dot */
  .radio input[type="radio"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  .radio .dot {
    width: 16px;
    height: 16px;
    border: 1.5px solid rgba(83, 29, 216, 0.4);
    border-radius: 50%;
    background: #ffffff;
    flex-shrink: 0;
    transition:
      border-color 0.15s ease,
      background 0.15s ease,
      box-shadow 0.15s ease;
  }

  .radio:hover .dot {
    border-color: #531dd8;
  }

  .radio:has(input:checked) .dot {
    border-color: #01f59e;
    background: #01f59e;
    box-shadow: inset 0 0 0 3px #ffffff;
  }

  .radio:has(input:focus-visible) .dot {
    box-shadow: 0 0 0 3px rgba(83, 29, 216, 0.25);
  }

  .radio:has(input:focus-visible:checked) .dot {
    box-shadow:
      inset 0 0 0 3px #ffffff,
      0 0 0 3px rgba(83, 29, 216, 0.25);
  }

  .radio span {
    font-size: 0.78rem;
    line-height: 1.25;
  }

  .req {
    color: #531dd8;
    margin-left: 2px;
    font-weight: 700;
  }

  .err {
    color: #c0263a;
    font-size: 0.7rem;
    line-height: 1.3;
    margin-top: 2px;
  }

  .alert {
    margin-top: 8px;
    padding: 8px 10px;
    background: #fff0f2;
    border: 1px solid #f3b5bd;
    border-radius: 8px;
    color: #9a1f31;
    font-size: 0.78rem;
  }

  .legal {
    margin: 10px 0 8px;
    font-size: 0.68rem;
    color: #5a5a70;
    line-height: 1.4;
  }

  .legal a {
    color: #531dd8;
    text-decoration: underline;
  }

  /* ── Botones de navegación / CTA ──────── */
  .nav-row {
    display: flex;
    justify-content: stretch;
    margin-top: 14px;
  }
  .nav-row--split {
    gap: 8px;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
    min-height: 44px;
    padding: 0 18px;
    background: #01f59e;
    color: #0a0a1a;
    font-family: "Epoch", "Oktah Neue", system-ui, sans-serif;
    font-size: 0.94rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
  }

  .cta--ghost {
    background: transparent;
    color: #531dd8;
    border: 1px solid rgba(83, 29, 216, 0.25);
    flex: 0 0 auto;
    min-width: 100px;
  }

  .cta--ghost:hover:not(:disabled) {
    background: rgba(83, 29, 216, 0.06);
    border-color: rgba(83, 29, 216, 0.45);
    transform: none;
    box-shadow: none;
  }

  .cta-arrow {
    display: inline-block;
    transition: transform 0.18s ease;
  }
  .cta-arrow--back {
    margin-right: 2px;
  }

  .cta:hover:not(:disabled) .cta-arrow:not(.cta-arrow--back) {
    transform: translateX(3px);
  }
  .cta--ghost:hover:not(:disabled) .cta-arrow--back {
    transform: translateX(-3px);
  }

  .cta:hover:not(:disabled) {
    background: #00dd8d;
    box-shadow: 0 6px 18px rgba(1, 245, 158, 0.3);
    transform: translateY(-1px);
  }

  .cta:focus-visible {
    outline: 3px solid #531dd8;
    outline-offset: 2px;
  }

  .cta--ghost:focus-visible {
    outline: 3px solid #531dd8;
    outline-offset: 2px;
  }

  .cta:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .micro-trust {
    margin: 10px 0 0;
    text-align: center;
    color: #5a5a70;
    font-size: 0.72rem;
    font-weight: 500;
    line-height: 1.4;
  }

  /* ── Success State ─────────────────────────── */

  .success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px 20px 36px;
    min-height: 420px;
    justify-content: center;
    animation: fadeInUp 0.5s ease both;
  }

  .success-icon-wrap {
    position: relative;
    width: 72px;
    height: 72px;
    margin-bottom: 24px;
  }

  .success-icon {
    width: 72px;
    height: 72px;
    position: relative;
    z-index: 1;
  }

  .success-circle {
    stroke-dasharray: 151;
    stroke-dashoffset: 151;
    animation: drawCircle 0.6s 0.1s ease forwards;
  }

  .success-check {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: drawCheck 0.4s 0.6s ease forwards;
  }

  .success-pulse {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid rgba(1, 245, 158, 0.3);
    animation: pulseRing 1.8s 0.9s ease-out infinite;
    z-index: 0;
  }

  .success-title {
    font-family: "Epoch", "Oktah Neue", system-ui, sans-serif;
    font-size: 1.35rem;
    font-weight: 800;
    color: #1d1d2e;
    margin: 0 0 10px;
    animation: fadeInUp 0.5s 0.3s ease both;
  }

  .success-body {
    color: #5a5a70;
    font-size: 0.92rem;
    line-height: 1.6;
    max-width: 380px;
    margin: 0 0 20px;
    animation: fadeInUp 0.5s 0.45s ease both;
  }

  .success-divider {
    width: 48px;
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(90deg, #531dd8, #01f59e);
    margin: 0 auto 20px;
    animation: fadeInUp 0.5s 0.55s ease both;
  }

  .success-redirect {
    margin-top: 18px;
    color: #9a9aae;
    font-size: 0.82rem;
    font-style: italic;
    animation: fadeInUp 0.4s 1s ease both;
  }

  @keyframes drawCircle {
    to { stroke-dashoffset: 0; }
  }

  @keyframes drawCheck {
    to { stroke-dashoffset: 0; }
  }

  @keyframes pulseRing {
    0% { transform: scale(1); opacity: 0.6; }
    70% { transform: scale(1.35); opacity: 0; }
    100% { transform: scale(1.35); opacity: 0; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 640px) {
    .lead-card {
      max-width: 540px;
      padding: 22px 24px;
      border-radius: 14px;
    }

    label,
    legend {
      font-size: 0.78rem;
    }

    .section-title {
      font-size: 0.78rem;
    }

    .step-name {
      font-size: 0.78rem;
    }

    .grid {
      grid-template-columns: 1fr 1fr;
      gap: 10px 12px;
    }

    .radio-group--cols2 {
      grid-template-columns: 1fr 1fr;
      gap: 4px 6px;
    }

    .radio {
      min-height: 40px;
      padding: 6px 10px;
    }

    .radio span {
      font-size: 0.78rem;
    }
  }


  @media (prefers-reduced-motion: reduce) {
    input,
    select,
    .radio,
    .cta,
    .step-bar-fill {
      transition: none;
    }
  }
</style>
