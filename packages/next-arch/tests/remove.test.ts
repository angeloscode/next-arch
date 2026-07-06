import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockConfirm } = vi.hoisted(() => ({
  mockConfirm: vi.fn(),
}));

vi.mock('@clack/prompts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@clack/prompts')>();
  return {
    ...actual,
    confirm: mockConfirm,
  };
});

import { generateCommand } from '../src/commands/generate.js';
import { removeCommand } from '../src/commands/remove.js';
import { findImporters } from '../src/lib/find-importers.js';
import { getSliceDir } from '../src/lib/slices.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tmpDir = path.join(__dirname, '.tmp-remove-test');
const cliEntry = path.join(__dirname, '../dist/index.js');

async function createMinimalProject(): Promise<void> {
  await fs.ensureDir(path.join(tmpDir, 'src', 'features'));
  await fs.ensureDir(path.join(tmpDir, 'src', 'views'));
  await fs.ensureDir(path.join(tmpDir, 'src', 'widgets'));
  await fs.ensureDir(path.join(tmpDir, 'src', 'entities'));
  await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'test-project' });
}

describe('remove command — happy path', () => {
  beforeEach(async () => {
    await fs.remove(tmpDir);
    await createMinimalProject();
    await generateCommand('feature', 'payments', tmpDir);
    mockConfirm.mockReset();
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('removes an existing feature with --force', async () => {
    await removeCommand('feature', 'payments', tmpDir, { force: true });
    expect(await fs.pathExists(path.join(tmpDir, 'src/features/payments'))).toBe(false);
  });

  it('removes after explicit confirmation', async () => {
    mockConfirm.mockResolvedValue(true);
    await removeCommand('feature', 'payments', tmpDir);
    expect(mockConfirm).toHaveBeenCalledOnce();
    expect(await fs.pathExists(path.join(tmpDir, 'src/features/payments'))).toBe(false);
  });

  it('does not remove when confirmation is declined', async () => {
    mockConfirm.mockResolvedValue(false);
    await removeCommand('feature', 'payments', tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, 'src/features/payments'))).toBe(true);
  });

  it('removes PascalCase input using kebab-case directory', async () => {
    await generateCommand('feature', 'UserProfile', tmpDir);
    await removeCommand('feature', 'UserProfile', tmpDir, { force: true });
    expect(await fs.pathExists(path.join(tmpDir, 'src/features/user-profile'))).toBe(false);
  });

  it.each(['feature', 'view', 'widget', 'entity'] as const)(
    'removes %s slice with --force',
    async (type) => {
      const names = { feature: 'billing', view: 'dashboard', widget: 'sidebar', entity: 'order' };
      await generateCommand(type, names[type], tmpDir);
      await removeCommand(type, names[type], tmpDir, { force: true });
      expect(await fs.pathExists(getSliceDir(type, names[type], tmpDir))).toBe(false);
    },
  );

  it('does not remove sibling slices', async () => {
    await generateCommand('feature', 'billing', tmpDir);
    await removeCommand('feature', 'payments', tmpDir, { force: true });
    expect(await fs.pathExists(path.join(tmpDir, 'src/features/billing'))).toBe(true);
  });

  it('leaves project root files intact', async () => {
    await fs.writeFile(path.join(tmpDir, 'README.md'), '# stay\n');
    await removeCommand('feature', 'payments', tmpDir, { force: true });
    expect(await fs.pathExists(path.join(tmpDir, 'package.json'))).toBe(true);
    expect(await fs.readFile(path.join(tmpDir, 'README.md'), 'utf8')).toBe('# stay\n');
  });
});

describe('remove command — importers warning', () => {
  beforeEach(async () => {
    await fs.remove(tmpDir);
    await createMinimalProject();
    await generateCommand('feature', 'payments', tmpDir);
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('still removes slice when importers exist and --force is set', async () => {
    await fs.ensureDir(path.join(tmpDir, 'src', 'views'));
    await fs.writeFile(
      path.join(tmpDir, 'src/views/CheckoutView.tsx'),
      "import { Payments } from '@/features/payments';\n",
    );

    const importers = await findImporters('payments', 'feature', tmpDir);
    expect(importers).toContain('src/views/CheckoutView.tsx');

    await removeCommand('feature', 'payments', tmpDir, { force: true });
    expect(await fs.pathExists(path.join(tmpDir, 'src/features/payments'))).toBe(false);
    expect(await fs.pathExists(path.join(tmpDir, 'src/views/CheckoutView.tsx'))).toBe(true);
  });

  it('finds multiple importers before removal', async () => {
    await fs.ensureDir(path.join(tmpDir, 'src', 'views'));
    await fs.writeFile(path.join(tmpDir, 'src/views/A.tsx'), "import '@/features/payments';\n");
    await fs.writeFile(path.join(tmpDir, 'src/views/B.tsx'), "import '@/features/payments';\n");

    expect(await findImporters('payments', 'feature', tmpDir)).toHaveLength(2);
  });
});

describe('remove command — errors', () => {
  beforeEach(async () => {
    await fs.remove(tmpDir);
    await createMinimalProject();
    await generateCommand('feature', 'payments', tmpDir);
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('exits when slice does not exist', async () => {
    const exit = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit');
    }) as never);

    await expect(removeCommand('feature', 'nonexistent', tmpDir, { force: true })).rejects.toThrow(
      'process.exit',
    );

    exit.mockRestore();
  });

  it('throws for unknown slice type', async () => {
    await expect(removeCommand('page', 'home', tmpDir, { force: true })).rejects.toThrow(
      /Unknown type/,
    );
  });

  it('throws for invalid slice name', async () => {
    await expect(removeCommand('feature', '../hack', tmpDir, { force: true })).rejects.toThrow();
  });

  it('throws when not a Next Architecture project', async () => {
    await fs.remove(path.join(tmpDir, 'src'));
    await expect(removeCommand('feature', 'payments', tmpDir, { force: true })).rejects.toThrow(
      /Next Architecture project/,
    );
  });
});

describe('remove CLI integration', () => {
  beforeEach(async () => {
    await fs.remove(tmpDir);
    await createMinimalProject();
    await generateCommand('feature', 'payments', tmpDir);
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('rm alias removes slice via built CLI', () => {
    execFileSync('node', [cliEntry, 'rm', 'feature', 'payments', '-f', '--cwd', tmpDir], {
      stdio: 'pipe',
    });
    expect(fs.existsSync(path.join(tmpDir, 'src/features/payments'))).toBe(false);
  });

  it('remove command fails for missing slice via built CLI', () => {
    expect(() =>
      execFileSync('node', [cliEntry, 'remove', 'feature', 'ghost', '-f', '--cwd', tmpDir], {
        stdio: 'pipe',
      }),
    ).toThrow();
  });
});
