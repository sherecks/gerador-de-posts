import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { carouselSchema, type Carousel } from './carousel';

/**
 * Repo root: the viewer lives in <repo>/web, the generations in <repo>/data.
 * KARAGUA_DATA_DIR overrides it (absolute path) for a different working set.
 */
export function dataDir(): string {
  const override = process.env.KARAGUA_DATA_DIR;
  if (override) return path.resolve(override);
  return path.resolve(process.cwd(), '..', 'data', 'carousels');
}

export function repoRoot(): string {
  return path.resolve(process.cwd(), '..');
}

export class CarouselReadError extends Error {
  constructor(
    readonly file: string,
    readonly detail: string,
  ) {
    super(`${file}: ${detail}`);
    this.name = 'CarouselReadError';
  }
}

export type LoadResult = {
  carousels: Carousel[];
  errors: CarouselReadError[];
};

async function parseFile(dir: string, file: string): Promise<Carousel | CarouselReadError> {
  const raw = await readFile(/* turbopackIgnore: true */ path.join(dir, file), 'utf8');

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (cause) {
    return new CarouselReadError(file, `JSON inválido: ${(cause as Error).message}`);
  }

  const parsed = carouselSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const where = first ? first.path.join('.') || '(raiz)' : '(raiz)';
    const why = first ? first.message : 'formato desconhecido';
    return new CarouselReadError(file, `fora do contrato em "${where}": ${why}`);
  }
  return parsed.data;
}

/** Reads every generation on disk. A malformed file is reported, never swallowed. */
export async function loadCarousels(): Promise<LoadResult> {
  const dir = dataDir();

  let entries: string[];
  try {
    // Local-first tool: the data dir is outside the build, never traced for deploy.
    entries = await readdir(/* turbopackIgnore: true */ dir);
  } catch (cause) {
    const err = cause as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return { carousels: [], errors: [] };
    throw cause;
  }

  const files = entries.filter((name) => name.endsWith('.json')).sort();
  const results = await Promise.all(files.map((file) => parseFile(dir, file)));

  const carousels: Carousel[] = [];
  const errors: CarouselReadError[] = [];
  for (const result of results) {
    if (result instanceof CarouselReadError) errors.push(result);
    else carousels.push(result);
  }

  carousels.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { carousels, errors };
}

export async function loadCarousel(id: string): Promise<Carousel | null> {
  const { carousels } = await loadCarousels();
  return carousels.find((item) => item.id === id) ?? null;
}

/**
 * Resolves a slide image path (repo-relative) to an absolute path, refusing
 * anything that escapes the repo. Traversal is a bug, not a warning.
 */
export function resolveAsset(relative: string): string {
  const root = repoRoot();
  const absolute = path.resolve(root, relative);
  if (absolute !== root && !absolute.startsWith(root + path.sep)) {
    throw new Error(`asset path escapes the repo: ${relative}`);
  }
  return absolute;
}
