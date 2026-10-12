// Entrada sutil al hacer scroll (opacidad + 16px). Solo anima lo que está bajo
// el pliegue al cargar: lo visible en el primer frame queda quieto, y el HTML
// pre-renderizado siempre muestra todo el contenido (sin JS no se oculta nada).
export function reveal(node: HTMLElement, delay = 0) {
  if (
    typeof IntersectionObserver === 'undefined' ||
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    node.getBoundingClientRect().top < innerHeight
  ) {
    return {};
  }

  node.classList.add('rv', 'pre');
  node.style.transitionDelay = `${delay}ms`;
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        node.classList.remove('pre');
        io.disconnect();
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  io.observe(node);

  return { destroy: () => io.disconnect() };
}
