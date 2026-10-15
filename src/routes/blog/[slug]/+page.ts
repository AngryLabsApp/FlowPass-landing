import { error } from '@sveltejs/kit';
import { posts, postBySlug } from '$lib/blog';
import type { EntryGenerator, PageLoad } from './$types';

// Se pre-renderiza una página por artículo.
export const entries: EntryGenerator = () => posts.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
  const post = postBySlug(params.slug);
  if (!post) error(404, 'No encontrado');
  return { post };
};
