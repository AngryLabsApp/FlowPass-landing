<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  /**
   * Dos páginas ("antes" / "después") que en pantallas ≤900px se apilan como un libro:
   * la de adelante gira desde el lomo para mostrar la de atrás. En pantallas grandes
   * no hace nada: las dos páginas quedan como hijos directos del layout del padre
   * (el contenedor usa `display: contents`), así el padre decide el diseño de escritorio.
   *
   * La primera vez que el libro entra en pantalla pasa la página solo; después el
   * visitante va y vuelve con los botones. El padre puede animar el contenido según
   * el estado con `:global(.book.flipped) .algo`.
   */
  let {
    labels,
    groupLabel,
    class: cls = '',
    autoFlipMs = 2500,
    front,
    back
  }: {
    labels: [string, string];
    groupLabel: string;
    class?: string;
    autoFlipMs?: number;
    front: Snippet;
    back: Snippet;
  } = $props();

  let flipped = $state(false);
  let touched = false;
  let bookEl = $state<HTMLElement>();

  const show = (v: boolean) => {
    touched = true;
    flipped = v;
  };

  onMount(() => {
    if (!bookEl || !matchMedia('(max-width: 900px)').matches) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(t);
        if (e.isIntersecting && !touched) t = setTimeout(() => !touched && show(true), autoFlipMs);
      },
      { rootMargin: '-30% 0px' }
    );
    io.observe(bookEl);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  });
</script>

<div class="seg flip-ctrl" role="group" aria-label={groupLabel}>
  <button type="button" aria-pressed={!flipped} onclick={() => show(false)}>{labels[0]}</button>
  <button type="button" aria-pressed={flipped} onclick={() => show(true)}>{labels[1]}</button>
</div>

<div class="book {cls}" class:flipped bind:this={bookEl}>
  <div class="page front" inert={flipped || undefined}>{@render front()}</div>
  <div class="page back">{@render back()}</div>
</div>

<style>
  /* div. para ganarle a '.home .seg' (inline-flex) sin !important */
  div.flip-ctrl { display: none; }
  .page { display: contents; }

  @media (max-width: 900px) {
    div.flip-ctrl { display: flex; width: 100%; margin-top: 20px; }
    .flip-ctrl button { flex: 1; position: relative; overflow: hidden; transition: background 0.3s, color 0.3s, box-shadow 0.3s; }
    /* Botón de "después" activo: verde de marca con un brillo que lo recorre */
    .flip-ctrl button:last-child[aria-pressed='true'] {
      background: linear-gradient(135deg, #01f59e, #00d68a);
      color: #04150e;
      box-shadow: 0 6px 18px -6px rgba(1, 245, 158, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }
    .flip-ctrl button:last-child[aria-pressed='true']::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.75) 50%, transparent 65%);
      translate: -120% 0;
      animation: shine 2.6s ease-in-out 0.4s infinite;
    }

    /* Libro: las dos páginas en la misma celda; la de adelante gira desde el lomo */
    .book { display: grid; margin-top: 12px; perspective: 1800px; }
    .page { display: grid; position: relative; grid-area: 1 / 1; border-radius: var(--book-radius, 20px); }
    .front {
      z-index: 2;
      transform-origin: left center;
      backface-visibility: hidden;
      transition: transform 0.9s cubic-bezier(0.6, 0.05, 0.3, 1), opacity 0.9s ease, box-shadow 0.9s ease;
      box-shadow: 8px 0 24px -12px rgba(0, 0, 0, 0.35);
    }
    .flipped .front { transform: rotateY(-110deg); opacity: 0; pointer-events: none; box-shadow: 40px 0 60px -20px rgba(0, 0, 0, 0.5); }
    .book:not(.flipped) .back { visibility: hidden; transition: visibility 0s 0.9s; }

    /* Brillo que recorre la hoja mientras gira */
    .front::after,
    .back::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
    .front::after { background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.55) 70%, transparent); opacity: 0; transition: opacity 0.45s ease; }
    .flipped .front::after { opacity: 1; }
    /* Sombra que la hoja deja sobre la página de abajo; se va al terminar de pasar */
    .back::after { background: linear-gradient(90deg, rgba(9, 9, 15, 0.35), transparent 70%); transition: opacity 0.9s ease 0.15s; }
    .flipped .back::after { opacity: 0; }
  }

  @keyframes shine { 0% { translate: -120% 0; } 45%, 100% { translate: 120% 0; } }

  @media (max-width: 900px) and (prefers-reduced-motion: reduce) {
    .front, .front::after, .back::after, .book:not(.flipped) .back { transition: none; }
    .flip-ctrl button::after { animation: none !important; }
  }
</style>
