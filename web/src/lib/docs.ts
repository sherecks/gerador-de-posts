import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Brand } from './carousel';
import { repoRoot } from './store';

/**
 * The generator's rulebook, read straight from `docs/` at request time. This
 * is the same file the human editorial process points to (PRD §7): the
 * prompt never forks the rules into a second copy that can drift.
 *
 * RENDER-RULES.md is shared: it governs how the renderer breaks lines and
 * picks contrast, mechanics that don't change per brand. The other three are
 * editorial voice, and every brand gets its own file at `docs/<brand>/*.md`
 * except karagua, whose files predate the brand split and still live at the
 * repo root (docs/decisions/004).
 */
const SHARED_FILES = ['RENDER-RULES.md'] as const;
const VOICE_FILES = ['COPY-ENGINE.md', 'COMMUNICATION-MANUAL.md', 'EDITORIAL-REFERENCE.md'] as const;

function docPaths(brand: Brand): string[] {
  const voiceDir = brand === 'karagua' ? '' : brand;
  // turbopackIgnore: brand is a runtime request field, so this join can never be constant-folded;
  // the actual read (below) is already scoped under <repoRoot>/docs and carries its own ignore.
  return [...SHARED_FILES, ...VOICE_FILES.map((file) => path.join(/* turbopackIgnore: true */ voiceDir, file))];
}

const cache = new Map<Brand, string>();

export async function loadRuleDocs(brand: Brand): Promise<string> {
  const hit = cache.get(brand);
  if (hit) return hit;

  const root = path.join(repoRoot(), 'docs');
  const sections = await Promise.all(
    docPaths(brand).map(async (relative) => {
      const text = await readFile(/* turbopackIgnore: true */ path.join(root, relative), 'utf8');
      return `### ${relative}\n\n${text.trim()}`;
    }),
  );

  const joined = sections.join('\n\n---\n\n');
  cache.set(brand, joined);
  return joined;
}
