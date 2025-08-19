// src/lib/data/work.server.ts
import fs from 'node:fs';
import path from 'node:path';
import { WORK_META } from '$lib/data/workMeta';

export type WorkItem = {
  id: string;
  slug: string;
  title: string;
  cover: string;
  gallery: string[];
  tags?: string[];
  blurb?: string;
  summary?: string;
  width?: number;
  height?: number;
};

// Accept only common image extensions
const IMG_RE = /\.(png|jpe?g|webp|gif|avif)$/i;

// Natural sort (so 1,2,10 comes in numeric order)
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function toTitle(slug: string) {
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

/**
 * Scan public/images/work/[slug] and build WorkItems with full gallery.
 */
export function listWorkFromPublic(): WorkItem[] {
  const root = path.join(process.cwd(), 'public', 'images', 'work');
  if (!fs.existsSync(root)) return [];

  const slugs = fs
    .readdirSync(root)
    .filter((name) => fs.statSync(path.join(root, name)).isDirectory())
    .sort(collator.compare);

  return slugs.map((slug) => {
    const dir = path.join(root, slug);
    let files = fs
      .readdirSync(dir)
      .filter((f) => IMG_RE.test(f))
      .sort(collator.compare);

    if (files.length === 0) {
      return {
        id: slug,
        slug,
        title: WORK_META[slug]?.title ?? toTitle(slug),
        cover: `/images/work/${slug}/cover.png`, // placeholder path
        gallery: [],
        ...WORK_META[slug],
      };
    }

    // Choose cover.* if present, otherwise first file
    const coverFile = files.find((f) => /^cover\./i.test(f)) ?? files[0];
    // Put cover first in gallery
    files = [coverFile, ...files.filter((f) => f !== coverFile)];

    const gallery = files.map((f) => `/images/work/${slug}/${f}`);
    const cover = `/images/work/${slug}/${coverFile}`;

    return {
      id: slug,
      slug,
      title: WORK_META[slug]?.title ?? toTitle(slug),
      cover,
      gallery,
      ...WORK_META[slug], // merge tags/summary/blurb/etc.
    };
  });
}
