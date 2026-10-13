import { error } from '@sveltejs/kit';
import { disciplinas, disciplinaBySlug } from '$lib/data/disciplinas';
import type { EntryGenerator, PageLoad } from './$types';

// Se pre-renderiza una página por disciplina.
export const entries: EntryGenerator = () => disciplinas.map((d) => ({ slug: d.slug }));

export const load: PageLoad = ({ params }) => {
  const d = disciplinaBySlug(params.slug);
  if (!d) error(404, 'No encontrada');
  return { d };
};
