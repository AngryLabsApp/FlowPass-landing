<script lang="ts">
  import { onMount } from 'svelte';
  import { reveal } from '$lib/actions/reveal';
  import { siteConfig } from '$lib/config/site';
  import { trackContact, trackSchedule } from '$lib/tracking/track';
  import {
    plans as allPlans,
    billingCycles,
    whatsappPackages,
    sunatPackages,
    getPlanPrice,
    formatPriceParts
  } from '$lib/data/pricingData.js';

  type Country = 'PE' | 'MX' | 'US';
  const plans = allPlans.filter((p) => !p.quoteBased);
  const enterprise = allPlans.find((p) => p.quoteBased);
  const minOf = (p: (typeof plans)[number], i: number) => (i === 0 ? 0 : plans[i - 1].maxActiveStudents ?? 0);

  let country = $state<Country>('PE');
  let cycle = $state('mensual');
  let students = $state(45);

  // País según la zona horaria del navegador (sin pedir permisos ni llamar a otro servicio).
  // Perú → soles, México → pesos, cualquier otro lugar → dólares. El visitante puede cambiarlo.
  onMount(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
      const MX = ['Mexico_City', 'Cancun', 'Merida', 'Monterrey', 'Matamoros', 'Chihuahua', 'Ciudad_Juarez', 'Ojinaga', 'Mazatlan', 'Bahia_Banderas', 'Hermosillo', 'Tijuana'];
      if (tz === 'America/Lima') country = 'PE';
      else if (MX.some((c) => tz === `America/${c}`)) country = 'MX';
      else if (tz) country = 'US';
    } catch { /* se queda en Perú */ }
  });

  // Cotizador
  let quotePlan = $state<string | null>(null);
  let hasSites = $state(false);
  let sites = $state<string[]>(['pocket']);
  let sunat = $state(0);
  let waPack = $state(0);

  const fit = $derived(plans.find((p) => students <= (p.maxActiveStudents ?? 0)) ?? null);
  const qPlan = $derived(plans.find((p) => p.id === (quotePlan ?? fit?.id ?? 'ultra'))!);
  const priceOf = (p: (typeof plans)[number]) => getPlanPrice(p, cycle, country) ?? 0;
  const money = (v: number) => {
    const x = formatPriceParts(v, country);
    return `${x.symbol}${x.number}`;
  };
  const code = $derived(formatPriceParts(0, country).code || 'PEN');
  const sizeLabel = (p: (typeof plans)[number], i: number) =>
    minOf(p, i) === 0 ? `Hasta ${p.maxActiveStudents}` : `${minOf(p, i)} – ${p.maxActiveStudents}`;
  const months = $derived(cycle === 'trimestral' ? 3 : cycle === 'anual' ? 12 : 1);

  const quote = $derived.by(() => {
    const lines: [string, string][] = [];
    let total = priceOf(qPlan);
    let pending = false;
    lines.push([`${qPlan.name}${cycle === 'mensual' ? '' : ` (${cycle})`}`, money(priceOf(qPlan))]);
    if (hasSites) {
      sites.forEach((id, i) => {
        const sp = plans.find((p) => p.id === id)!;
        const label = `Sede ${i + 2} (hasta ${sp.maxActiveStudents} alumnos)`;
        if (country === 'PE' && sp.extraSiteFee?.PE) {
          total += sp.extraSiteFee.PE;
          lines.push([label, money(sp.extraSiteFee.PE)]);
        } else {
          pending = true;
          lines.push([label, 'A consultar']);
        }
      });
    }
    if (country === 'PE' && sunat) {
      const pk = sunatPackages.find((s) => s.vouchers === sunat)!;
      total += pk.prices.PE;
      lines.push([`SUNAT: ${sunat} comprobantes`, money(pk.prices.PE)]);
    }
    if (waPack) {
      const pk = whatsappPackages.find((w) => w.reminders === waPack)!;
      const v = pk.prices[country as keyof typeof pk.prices];
      total += v;
      lines.push([`WhatsApp: +${waPack} mensajes`, money(v)]);
    }
    return { lines, total, pending };
  });

  const waNumber = $derived(country === 'MX' ? siteConfig.phones.MX : siteConfig.phones.PE);
  const waLink = (text: string) => `${waNumber.whatsapp}?text=${encodeURIComponent(text)}`;
  const quoteText = $derived(
    `¡Hola! Armé esta cotización en la web de FlowPass:\n${quote.lines.map(([a, b]) => `• ${a}: ${b}`).join('\n')}\nTotal al mes: ${money(quote.total)}${quote.pending ? ' + sedes' : ''}`
  );
  const taxLine = $derived(country === 'PE' ? 'IGV incluido.' : country === 'MX' ? 'IVA incluido.' : 'Sin impuestos extra.');
</script>

<section id="precios" class="wrap" aria-labelledby="pr-title">
  <div use:reveal>
    <p class="eyebrow">Precios</p>
    <h2 id="pr-title" class="sec-title">Descubre el plan ideal para el tamaño de tu negocio.</h2>
  </div>

  <div class="finder" use:reveal>
    <label for="n-alumnos">¿Cuántos alumnos activos tienes hoy?</label>
    <div class="finder-row">
      <input id="n-alumnos" type="range" min="1" max="400" bind:value={students} />
      <output for="n-alumnos">
        {#if fit}
          Con <b>{students}</b> alumnos activos te corresponde <b>{fit.name}</b>: {money(priceOf(fit))} al mes.
        {:else}
          Con <b>{students}</b> alumnos activos te conviene <b>Flow Enterprise</b>, a medida.
        {/if}
      </output>
    </div>
  </div>

  <div class="controls">
    <div class="seg" role="group" aria-label="País">
      {#each [['PE', 'Perú'], ['MX', 'México'], ['US', 'Otros']] as [c, l] (c)}
        <button type="button" aria-pressed={country === c} onclick={() => (country = c as Country)}>{l}</button>
      {/each}
    </div>
    <div class="seg" role="group" aria-label="Ciclo de pago">
      {#each billingCycles as b (b.id)}
        <button type="button" aria-pressed={cycle === b.id} onclick={() => (cycle = b.id)}>
          {b.label}{b.discount ? ` −${Math.round(b.discount * 100)}%` : ''}
        </button>
      {/each}
    </div>
  </div>

  <div class="plans">
    {#each plans as p, i (p.id)}
      <article class="plan" class:match={fit?.id === p.id} aria-label={`Plan ${p.name}`}>
        {#if p.highlight}<span class="pop">MÁS POPULAR</span>{/if}
        <span class="tag">{p.tagline}</span>
        <h3>{p.name}</h3>
        <div class="size">{sizeLabel(p, i)} alumnos activos<small>{p.registeredStudents}</small></div>
        <div class="amt">{money(priceOf(p))} <small>{code} / mes</small></div>
        <p class="per">
          {cycle === 'mensual' ? 'Pago mes a mes' : `Se cobra ${money(priceOf(p) * months)} ${cycle === 'trimestral' ? 'cada 3 meses' : 'una vez al año'}`}
        </p>
        <p class="yours">{fit?.id === p.id ? 'Este es tu plan' : ''}</p>
        <p class="key">{p.whatsappIncluded?.total} mensajes de WhatsApp al mes</p>
        <a
          class="btn plan-btn"
          class:mine={fit?.id === p.id}
          href={`/agenda?plan=${p.id}`}
          onclick={() => trackSchedule(`pricing_plan_${p.id}`)}
          >Elegir {p.name.replace('Flow ', '')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a
        >
      </article>
    {/each}
  </div>

  <details class="compare">
    <summary><span>Comparar planes</span></summary>
    <div class="cmp-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col"><span class="sr">Característica</span></th>
            {#each plans as p, i (p.id)}<th scope="col" class={`c${i}`} class:hl={fit?.id === p.id}>{p.name.replace('Flow ', '')}</th>{/each}
          </tr>
        </thead>
        <tbody>
          <tr class="grp"><th scope="rowgroup" colspan="5">Tamaño</th></tr>
          <tr><th scope="row">Alumnos activos</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}>{sizeLabel(p, i)}</td>{/each}</tr>
          <tr><th scope="row">Alumnos registrados</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}>{p.registeredStudents?.replace(' alumnos registrados', '')}</td>{/each}</tr>
          <tr><th scope="row">Accesos para tu equipo</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}>{p.teamSeats ? `Hasta ${p.teamSeats}` : 'Ilimitados'}</td>{/each}</tr>
          <tr class="grp"><th scope="rowgroup" colspan="5">WhatsApp</th></tr>
          <tr><th scope="row">Mensajes al mes</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}><b>{p.whatsappIncluded?.total}</b></td>{/each}</tr>
          <tr><th scope="row">Automáticos</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}>{p.whatsappIncluded?.auto}</td>{/each}</tr>
          <tr><th scope="row">Manuales</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}>{p.whatsappIncluded?.manual}</td>{/each}</tr>
          <tr class="grp"><th scope="rowgroup" colspan="5">Funciones</th></tr>
          {#each ['Alumnos, asistencia y membresías', 'Ventas, ingresos, gastos e inventario', 'Estadísticas y reportes', 'Flowy, asistente de IA (beta)'] as f (f)}
            <tr><th scope="row">{f}</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}><span class="yes" aria-label="Incluido">✓</span></td>{/each}</tr>
          {/each}
          <tr><th scope="row">Varias membresías por alumno</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}>{#if p.features.find((f) => f.label.startsWith('Membresías simultáneas'))?.included}<span class="yes" aria-label="Incluido">✓</span>{:else}<span class="nope" aria-label="No incluido">–</span>{/if}</td>{/each}</tr>
          {#if country === 'PE'}
          <tr class="same"><th scope="row">Facturación SUNAT</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}>Opcional · desde S/30</td>{/each}</tr>
          {/if}
          <tr class="same"><th scope="row">Sedes adicionales</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}>{country === 'PE' ? 'Opcional · desde S/30 por sede' : 'Opcional · a consultar'}</td>{/each}</tr>
          <tr class="grp"><th scope="rowgroup" colspan="5">Soporte</th></tr>
          <tr><th scope="row">Nivel de soporte</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}>{p.features.find((f) => f.label.startsWith('Soporte'))?.label.replace('Soporte ', '')}</td>{/each}</tr>
          <tr class="grp"><th scope="rowgroup" colspan="5">Precio</th></tr>
          <tr><th scope="row">Al mes</th>{#each plans as p, i (p.id)}<td class={`c${i}`} class:hl={fit?.id === p.id}><b>{money(priceOf(p))}</b></td>{/each}</tr>
        </tbody>
      </table>
    </div>
    <p class="cmp-note">¿Abres otra sede? Súmala cuando la necesites. Cada sede paga según su propio tamaño: si tu sede principal es grande y abres una pequeña, esa sede suma desde S/30.</p>
  </details>

  <!-- Extras y cotizador: plegados para que lo primero sea simple (tu plan y su precio) -->
  <details class="more">
    <summary><span>¿Sedes, facturación SUNAT o más mensajes? <b>Arma tu cotización</b></span></summary>
    <div class="more-body">
    <div class="extras" class:three={country === 'PE'}>
      {#if enterprise}
        <div class="extra ent">
          <span class="x-tag">Flow Enterprise</span>
          <h3>¿Más de {plans.at(-1)?.maxActiveStudents} alumnos activos o varias marcas?</h3>
          <p>Sedes ilimitadas incluidas, reportes consolidados, migración asistida y desarrollo a medida.</p>
          <a class="btn ent-btn" href={waLink('¡Hola! Quiero conocer Flow Enterprise.')} target="_blank" rel="noopener noreferrer" onclick={() => trackContact('pricing_plan_enterprise')}>Hablar con el equipo</a>
        </div>
      {/if}
      <div class="extra">
        <span class="x-tag">Extra · WhatsApp</span>
        <h3>¿Te quedas corto de mensajes?</h3>
        <p>Suma un pack de recordatorios al mes, solo si lo necesitas:</p>
        <div class="packs">
          {#each whatsappPackages as w (w.name)}<span><b>+{w.reminders}</b>{money(w.prices[country as keyof typeof w.prices])} / mes</span>{/each}
        </div>
      </div>
      {#if country === 'PE'}
        <div class="extra">
          <span class="x-tag">Extra · Solo Perú</span>
          <h3>Facturación electrónica SUNAT</h3>
          <p>Todos los planes se pueden conectar con SUNAT para emitir boletas y facturas. Pagas según cuántos comprobantes emites:</p>
          <div class="packs">
            {#each sunatPackages as s (s.vouchers)}<span><b>{s.vouchers}</b>comprobantes · S/{s.prices.PE}</span>{/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Cotizador -->
    <div class="quote" id="cotizador">
      <div class="q-form">
        <p class="eyebrow">Arma tu plan</p>
        <h3>Calcula cuánto pagarías al mes.</h3>

        <fieldset>
          <legend>1. Tu plan</legend>
          <div class="seg" role="group" aria-label="Plan">
            {#each plans as p (p.id)}
              <button type="button" aria-pressed={qPlan.id === p.id} onclick={() => (quotePlan = p.id)}>{p.name.replace('Flow ', '')}</button>
            {/each}
          </div>
          <p class="hint">
            Hasta {qPlan.maxActiveStudents} alumnos activos · {qPlan.whatsappIncluded?.total} mensajes de WhatsApp · {qPlan.teamSeats ? `hasta ${qPlan.teamSeats} accesos` : 'accesos ilimitados'}
          </p>
        </fieldset>

        <fieldset>
          <legend>2. ¿Tienes o vas a abrir otra sede?</legend>
          <div class="seg" role="group" aria-label="Sedes adicionales">
            <button type="button" aria-pressed={!hasSites} onclick={() => (hasSites = false)}>No, solo una</button>
            <button type="button" aria-pressed={hasSites} onclick={() => (hasSites = true)}>Sí</button>
          </div>
          {#if hasSites}
            <div class="sites">
              {#each sites as _, i (i)}
                <div class="site-row">
                  <label for={`sede-${i}`}>Sede {i + 2}</label>
                  <select id={`sede-${i}`} bind:value={sites[i]}>
                    {#each plans as p (p.id)}
                      <option value={p.id}>Hasta {p.maxActiveStudents} alumnos{country === 'PE' && p.extraSiteFee?.PE ? ` · ${money(p.extraSiteFee.PE)}` : ''}</option>
                    {/each}
                  </select>
                  {#if sites.length > 1}
                    <button type="button" class="rm" aria-label={`Quitar sede ${i + 2}`} onclick={() => (sites = sites.filter((_, j) => j !== i))}>×</button>
                  {/if}
                </div>
              {/each}
              {#if sites.length < 10}
                <button type="button" class="add" onclick={() => (sites = [...sites, 'pocket'])}>+ Agregar otra sede</button>
              {/if}
            </div>
          {/if}
          <p class="hint">Cada sede paga según su tamaño, desde S/30. Tiene sus propios alumnos, mensajes y accesos.</p>
        </fieldset>

        {#if country === 'PE'}
          <fieldset>
            <legend>3. ¿Necesitas emitir boletas y facturas con SUNAT?</legend>
            <div class="seg" role="group" aria-label="Comprobantes SUNAT">
              <button type="button" aria-pressed={sunat === 0} onclick={() => (sunat = 0)}>No</button>
              {#each sunatPackages as s (s.vouchers)}
                <button type="button" aria-pressed={sunat === s.vouchers} onclick={() => (sunat = s.vouchers)}>{s.vouchers}</button>
              {/each}
            </div>
            <p class="hint">Comprobantes al mes. Depende de cuánto facturas.</p>
          </fieldset>
        {/if}

        <fieldset>
          <legend>{country === 'PE' ? '4' : '3'}. ¿Mensajes de WhatsApp extra?</legend>
          <div class="seg" role="group" aria-label="Pack de WhatsApp">
            <button type="button" aria-pressed={waPack === 0} onclick={() => (waPack = 0)}>No</button>
            {#each whatsappPackages as w (w.name)}
              <button type="button" aria-pressed={waPack === w.reminders} onclick={() => (waPack = w.reminders)}>+{w.reminders}</button>
            {/each}
          </div>
          <p class="hint">Tu plan ya trae {qPlan.whatsappIncluded?.total} al mes. Suma un pack solo si te quedas corto.</p>
        </fieldset>
      </div>

      <aside class="q-sum" aria-live="polite">
        <p class="q-title">Tu cotización</p>
        <ul>
          {#each quote.lines as [a, b] (a)}<li><span>{a}</span><b>{b}</b></li>{/each}
        </ul>
        <div class="q-total"><span>Total al mes</span><b>{money(quote.total)}{quote.pending ? ' + sedes' : ''}</b></div>
        <p class="q-foot">
          {taxLine}
          {cycle === 'mensual' ? 'Sin permanencia.' : `El plan se cobra ${cycle === 'trimestral' ? 'cada 3 meses' : 'una vez al año'}; los extras, mes a mes.`}
          {quote.pending ? 'El precio por sede fuera de Perú te lo damos por WhatsApp.' : ''}
        </p>
        <a class="btn wa-btn" href={waLink(quoteText)} target="_blank" rel="noopener noreferrer" onclick={() => trackContact('pricing_quote')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4 5.2 5.2 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" /></svg>
          Hablar con un asesor
        </a>
        <p class="wa-note">Te llega esta cotización por WhatsApp y te responde una persona.</p>
      </aside>
    </div>

    </div>
  </details>
</section>

<style>
  .finder { margin-top: 36px; padding: 22px 24px; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); display: grid; gap: 12px; }
  .finder label { font-weight: 600; }
  .finder-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 22px; }
  .finder input { flex: 1 1 260px; min-width: 0; accent-color: var(--accent-text); }
  .finder output { font-size: 15px; color: var(--fg-2); }
  .finder output b { color: var(--fg); font-variant-numeric: tabular-nums; }
  .controls { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }

  .plans { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: 28px; }
  .plan { position: relative; border: 1px solid var(--line); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 8px; background: var(--panel); }
  .plan.match { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
  .pop { position: absolute; top: -11px; left: 20px; background: var(--fg); color: var(--bg); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; padding: 3px 10px; border-radius: 999px; }
  .tag { font-size: 12px; color: var(--fg-3); }
  .plan h3 { font-size: 22px; }
  .size { font-family: var(--display); font-size: 20px; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
  .size small { display: block; font-family: var(--body); font-size: 13px; color: var(--fg-3); letter-spacing: 0; margin-top: 2px; }
  .amt { font-family: var(--display); font-size: 36px; letter-spacing: -0.02em; margin-top: 8px; font-variant-numeric: tabular-nums; }
  .amt small { font-family: var(--body); font-size: 14px; color: var(--fg-3); letter-spacing: 0; }
  .per { font-size: 12px; color: var(--fg-3); }
  .yours { font-size: 12px; font-weight: 700; color: var(--accent-text); min-height: 16px; }
  .key { font-size: 14px; color: var(--fg-2); padding-top: 12px; border-top: 1px solid var(--line); }
  .plan .btn { margin-top: auto; justify-content: center; }
  /* Todos los planes con botón sólido; el que le corresponde, en verde */
  .plan-btn { background: var(--fg); color: var(--bg); border-radius: 999px; }
  .plan-btn.mine { background: #01f59e; color: #04150e; }

  .more { margin-top: 18px; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); }
  .more summary { cursor: pointer; list-style: none; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 15px; color: var(--fg-2); }
  .more summary b { color: var(--fg); }
  .more summary::-webkit-details-marker { display: none; }
  .more summary::after { content: '+'; color: var(--accent-text); font-size: 20px; line-height: 1; flex: none; }
  .more[open] summary { border-bottom: 1px solid var(--line); }
  .more[open] summary::after { content: '–'; }
  .more-body { padding: 4px 18px 22px; }
  .more-body > :first-child { margin-top: 18px; }
  .compare { margin-top: 18px; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); }
  .compare summary { cursor: pointer; list-style: none; padding: 18px 22px; display: flex; justify-content: center; gap: 10px; font-weight: 600; }
  .compare summary::-webkit-details-marker { display: none; }
  .compare summary span { border-bottom: 0; }
  .compare summary::after { content: '+'; color: var(--accent-text); font-size: 20px; line-height: 1; }
  .compare[open] summary { border-bottom: 1px solid var(--line); }
  .compare[open] summary::after { content: '–'; }
  .cmp-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 560px; }
  th, td { padding: 11px 14px; text-align: center; border-bottom: 1px solid var(--line); font-variant-numeric: tabular-nums; }
  thead th { font-family: var(--display); font-size: 16px; background: var(--panel); }
  tbody th { text-align: left; font-weight: 500; color: var(--fg-2); position: sticky; left: 0; background: var(--panel); min-width: 150px; }
  tr.grp th { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-3); padding-top: 20px; position: static; }
  .hl { background: color-mix(in srgb, #01f59e 12%, var(--panel)); }
  .yes { color: var(--accent-text); font-weight: 700; }
  .nope { color: var(--fg-3); }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .cmp-note { padding: 14px 22px 18px; font-size: 13.5px; color: var(--fg-2); }

  .extras { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
  .extras.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .extra { border: 1px solid var(--line); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; background: var(--panel); box-shadow: var(--shadow); }
  .x-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; background: #531dd8; padding: 4px 10px; border-radius: 999px; }
  .ent { background: #09090f; border-color: #09090f; color: #fff; }
  .ent .x-tag { background: #01f59e; color: #04150e; }
  .ent h3 { color: #fff; }
  .extra.ent p { color: rgba(255, 255, 255, 0.75); }
  .ent-btn { margin-top: auto; background: #01f59e; color: #04150e; border-radius: 999px; }
  .extra h3 { font-size: 19px; }
  .extra p { color: var(--fg-2); font-size: 14.5px; }
  .packs { display: flex; flex-wrap: wrap; gap: 8px; }
  .packs span { border: 1px solid color-mix(in srgb, #531dd8 30%, var(--line)); background: color-mix(in srgb, #531dd8 7%, var(--panel)); border-radius: 10px; padding: 8px 12px; font-size: 13px; font-variant-numeric: tabular-nums; }
  .packs b { display: block; font-size: 14px; }

  .quote { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 20px; margin-top: 28px; align-items: start; }
  .q-form { border: 1px solid var(--line); border-radius: 16px; padding: 28px; background: var(--panel); display: grid; gap: 22px; }
  .q-form h3 { font-size: 24px; margin-top: -10px; }
  fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 10px; min-width: 0; }
  legend { font-weight: 700; font-size: 15px; padding: 0; margin-bottom: 10px; }
  .hint { font-size: 13px; color: var(--fg-3); }
  .sites { display: grid; gap: 8px; }
  .site-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .site-row label { font-size: 14px; color: var(--fg-2); min-width: 56px; }
  .site-row select { flex: 1 1 200px; min-width: 0; padding: 9px 10px; border-radius: 9px; border: 1px solid var(--line); background: var(--bg); color: var(--fg); font: 500 14px var(--body); }
  .rm { appearance: none; width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--line); background: none; color: var(--fg-2); font-size: 18px; cursor: pointer; }
  .add { appearance: none; justify-self: start; background: none; border: 1px dashed var(--line); border-radius: 9px; padding: 8px 14px; color: var(--accent-text); font: 600 14px var(--body); cursor: pointer; }
  .q-sum { position: sticky; top: 96px; border: 1px solid var(--accent); border-radius: 16px; padding: 26px; background: var(--panel); display: flex; flex-direction: column; gap: 14px; }
  .q-title { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; color: var(--accent-text); }
  .q-sum ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .q-sum li { display: flex; justify-content: space-between; gap: 14px; font-size: 14.5px; color: var(--fg-2); }
  .q-sum li b { color: var(--fg); font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .q-total { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; border-top: 1px solid var(--line); padding-top: 14px; }
  .q-total b { font-family: var(--display); font-size: 34px; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .q-foot { font-size: 12.5px; color: var(--fg-3); }
  .q-sum .btn { justify-content: center; }
  .wa-btn { background: #01f59e; color: #04150e; border-radius: 999px; }
  .wa-note { font-size: 12px; color: var(--fg-3); text-align: center; margin-top: -6px !important; }
  @media (max-width: 900px) {
    .plans { grid-template-columns: 1fr 1fr; }
    .extras, .extras.three, .quote { grid-template-columns: 1fr; }
    .q-sum { position: static; }
  }
  /* Celular: una tarjeta por fila, compacta (nombre y precio arriba, botón abajo) */
  @media (max-width: 560px) {
    .finder { margin-top: 22px; padding: 16px; gap: 10px; border-radius: 14px; }
    .finder label { font-size: 14.5px; }
    .finder output { font-size: 13.5px; }
    .controls { margin-top: 14px; gap: 8px; }
    .controls .seg { display: flex; width: 100%; flex-wrap: nowrap; }
    .controls .seg button { flex: 1; padding: 8px 4px; font-size: 12px; white-space: nowrap; }
    .plans { grid-template-columns: 1fr; gap: 14px; margin-top: 20px; }
    .plan {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-areas: 'name amt' 'size size' 'per per' 'yours yours' 'key key' 'btn btn';
      gap: 2px 12px;
      padding: 16px;
      border-radius: 14px;
    }
    .tag { display: none; }
    .plan h3 { grid-area: name; font-size: 18px; align-self: end; }
    .size { grid-area: size; font-size: 13.5px; font-family: var(--body); font-weight: 600; }
    .size { margin-top: 6px; }
    .size small { display: inline; font-size: 12px; font-weight: 400; }
    .size small::before { content: ' · '; }
    .amt { grid-area: amt; font-size: 24px; margin: 0; text-align: right; align-self: end; }
    .amt small { font-size: 11px; }
    .per { grid-area: per; font-size: 11.5px; }
    .yours { grid-area: yours; min-height: 0; }
    .yours:empty { display: none; }
    .key { grid-area: key; font-size: 13px; margin-top: 8px; padding-top: 10px; }
    .plan .btn { grid-area: btn; margin-top: 10px; padding: 10px 14px; font-size: 13.5px; }
    .q-form { padding: 18px 16px; gap: 18px; }
    .q-form h3 { font-size: 20px; }
    legend { font-size: 14px; margin-bottom: 8px; }
    .hint { font-size: 12px; }
    .q-form .seg { display: flex; width: 100%; flex-wrap: nowrap; }
    .q-form .seg button { flex: 1; padding: 8px 2px; font-size: 12px; white-space: nowrap; }
    .q-sum { padding: 18px 16px; }
    .q-sum li { font-size: 13px; }
    .q-total b { font-size: 28px; }
    /* Celular: cada fila = nombre arriba y los 4 planes lado a lado debajo */
    .cmp-wrap { overflow: visible; }
    table, thead, tbody { display: block; min-width: 0; font-size: 11.5px; }
    tr { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid var(--line); }
    th, td { border: 0; padding: 3px 2px 8px; }
    thead th:first-child { display: none; }
    thead th { font-size: 12px; padding: 10px 2px; }
    tbody th { grid-column: 1 / -1; position: static; min-width: 0; padding: 8px 14px 2px; font-size: 11px; color: var(--fg-3); background: none; }
    tr.grp { border-bottom: 0; }
    /* Filas iguales en todos los planes: un solo valor a lo ancho */
    tr.same td { display: none; }
    tr.same td:nth-of-type(1) { display: block; grid-column: 1 / -1; background: none; }
    tr.grp th { padding: 14px 14px 2px; font-size: 10px; color: var(--accent-text); }
    .compare summary { padding: 12px 16px; font-size: 13px; }
  }
</style>
