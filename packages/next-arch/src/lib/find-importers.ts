import fs from 'fs-extra';
import path from 'path';
import { toKebabCase } from './naming.js';
import { SLICE_LAYER_DIRS, type SliceType } from './slices.js';

const ALIAS_PREFIXES: Record<string, string> = {
  '@/': '',
  '@features/': 'features/',
  '@views/': 'views/',
  '@widgets/': 'widgets/',
  '@entities/': 'entities/',
};

const IMPORT_RE =
  /(?:import\s+(?:type\s+)?(?:(?:[\w*{}\s,]+)\s+from\s+)?|export\s+(?:type\s+)?(?:[\w*{}\s,]+)\s+from\s+)['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

const SKIP_DIRS = new Set(['node_modules', '.next', '_examples']);

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/');
}

function resolveImportSource(
  importSource: string,
  currentFile: string,
  srcRoot: string,
): string | null {
  for (const [alias, prefix] of Object.entries(ALIAS_PREFIXES)) {
    if (importSource === alias.slice(0, -1) || importSource.startsWith(alias)) {
      const rest = importSource.slice(alias.length);
      return normalizePath(`${prefix}${rest}`).replace(/\/$/, '');
    }
  }

  if (!importSource.startsWith('.')) {
    return null;
  }

  const resolved = normalizePath(path.resolve(path.dirname(currentFile), importSource));
  const srcRootNormalized = normalizePath(srcRoot);

  if (!resolved.startsWith(srcRootNormalized)) {
    return null;
  }

  return resolved.slice(srcRootNormalized.length + 1);
}

function extractImports(content: string): string[] {
  const imports: string[] = [];
  let match: RegExpExecArray | null;

  IMPORT_RE.lastIndex = 0;
  while ((match = IMPORT_RE.exec(content)) !== null) {
    const source = match[1] ?? match[2];
    if (source) imports.push(source);
  }

  const REQUIRE_RE = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  REQUIRE_RE.lastIndex = 0;
  while ((match = REQUIRE_RE.exec(content)) !== null) {
    if (match[1]) imports.push(match[1]);
  }

  return imports;
}

async function collectSourceFiles(dir: string, files: string[] = []): Promise<string[]> {
  if (!(await fs.pathExists(dir))) {
    return files;
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await collectSourceFiles(path.join(dir, entry.name), files);
      continue;
    }

    if (/\.(tsx?|jsx?|mts)$/.test(entry.name)) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

function importsSlice(resolved: string, slicePrefix: string): boolean {
  return resolved === slicePrefix || resolved.startsWith(`${slicePrefix}/`);
}

export async function findImporters(
  name: string,
  type: SliceType,
  projectRoot: string,
): Promise<string[]> {
  const kebabName = toKebabCase(name);
  const layerDir = SLICE_LAYER_DIRS[type];
  const slicePrefix = `${layerDir}/${kebabName}`;
  const srcDir = path.join(projectRoot, 'src');
  const sliceDir = path.join(srcDir, layerDir, kebabName);
  const sliceDirNormalized = normalizePath(sliceDir);

  const sourceFiles = await collectSourceFiles(srcDir);
  const importers: string[] = [];

  for (const filePath of sourceFiles) {
    if (normalizePath(filePath).startsWith(`${sliceDirNormalized}/`) || filePath === sliceDir) {
      continue;
    }

    const content = await fs.readFile(filePath, 'utf8');
    const imports = extractImports(content);

    const isImporter = imports.some((importSource) => {
      const resolved = resolveImportSource(importSource, filePath, srcDir);
      return resolved ? importsSlice(resolved, slicePrefix) : false;
    });

    if (isImporter) {
      importers.push(normalizePath(path.relative(projectRoot, filePath)));
    }
  }

  return importers;
}
