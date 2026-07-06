import { confirm, intro, isCancel, log, outro } from '@clack/prompts';
import fs from 'fs-extra';
import path from 'path';
import { findImporters } from '../lib/find-importers.js';
import { assertValidSliceName, toKebabCase } from '../lib/naming.js';
import { assertNextProject, resolveProjectRoot } from '../lib/project-paths.js';
import {
  getSliceDir,
  getSliceImportLabel,
  isSliceType,
  SLICE_TYPES,
  type SliceType,
} from '../lib/slices.js';

export interface RemoveCommandOptions {
  force?: boolean;
}

async function countFiles(dir: string): Promise<number> {
  if (!(await fs.pathExists(dir))) {
    return 0;
  }

  let count = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await countFiles(fullPath);
    } else {
      count += 1;
    }
  }

  return count;
}

export async function removeCommand(
  type: string,
  name: string,
  projectRoot = process.cwd(),
  options: RemoveCommandOptions = {},
): Promise<void> {
  const root = resolveProjectRoot(projectRoot);
  assertNextProject(root);
  assertValidSliceName(name);

  if (!isSliceType(type)) {
    throw new Error(`Unknown type "${type}". Use: ${SLICE_TYPES.join(', ')}`);
  }

  const sliceType = type as SliceType;
  const kebabName = toKebabCase(name);
  const sliceDir = getSliceDir(sliceType, name, root);
  const layerDir = path.relative(path.join(root, 'src'), sliceDir).split(path.sep)[0];

  intro('next-arch remove');

  if (!(await fs.pathExists(sliceDir))) {
    outro(`${type} "${kebabName}" not found at src/${layerDir}/${kebabName}`);
    process.exit(1);
  }

  const importers = await findImporters(name, sliceType, root);

  if (importers.length > 0) {
    log.warn(
      `Found ${importers.length} file(s) importing from ${getSliceImportLabel(sliceType, name)}:`,
    );
    for (const file of importers) {
      log.message(`  ${file}`);
    }
    log.message('These imports will break after removal.');
  }

  const fileCount = await countFiles(sliceDir);
  log.step(`Will remove: ${layerDir}/${kebabName}/ (${fileCount} file${fileCount === 1 ? '' : 's'})`);

  if (!options.force) {
    const confirmed = await confirm({
      message: `Remove ${type} "${kebabName}"? This cannot be undone.`,
      initialValue: false,
    });

    if (isCancel(confirmed) || !confirmed) {
      outro('Cancelled.');
      return;
    }
  }

  await fs.remove(sliceDir);
  outro(`Removed ${type} "${kebabName}"`);
}
