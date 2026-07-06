import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateCommand } from '../src/commands/generate.js';
import { findImporters } from '../src/lib/find-importers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tmpDir = path.join(__dirname, '.tmp-find-importers');

async function setupProject(): Promise<void> {
  await fs.ensureDir(path.join(tmpDir, 'src', 'features'));
  await fs.ensureDir(path.join(tmpDir, 'src', 'views'));
  await fs.ensureDir(path.join(tmpDir, 'src', 'widgets'));
  await fs.ensureDir(path.join(tmpDir, 'src', 'entities'));
  await fs.ensureDir(path.join(tmpDir, 'src', 'app'));
  await fs.writeJson(path.join(tmpDir, 'package.json'), { name: 'find-importers-test' });
  await generateCommand('feature', 'payments', tmpDir);
  await generateCommand('feature', 'billing', tmpDir);
  await generateCommand('widget', 'cart-summary', tmpDir);
  await generateCommand('entity', 'user', tmpDir);
}

async function writeImporter(relativePath: string, content: string): Promise<void> {
  const filePath = path.join(tmpDir, relativePath);
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content);
}

describe('findImporters — alias imports', () => {
  beforeEach(async () => {
    await fs.remove(tmpDir);
    await setupProject();
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('detects @/features/<name> public import', async () => {
    await writeImporter('src/views/CheckoutView.tsx', "import { Payments } from '@/features/payments';\n");
    expect(await findImporters('payments', 'feature', tmpDir)).toContain('src/views/CheckoutView.tsx');
  });

  it('detects @features/<name> alias without slash', async () => {
    await writeImporter('src/views/CheckoutView.tsx', "import { Payments } from '@features/payments';\n");
    expect(await findImporters('payments', 'feature', tmpDir)).toContain('src/views/CheckoutView.tsx');
  });

  it('detects deep imports into the slice', async () => {
    await writeImporter(
      'src/widgets/cart/ui/Cart.tsx',
      "import { Payments } from '@/features/payments/ui/Payments';\n",
    );
    expect(await findImporters('payments', 'feature', tmpDir)).toContain('src/widgets/cart/ui/Cart.tsx');
  });

  it('detects export-from re-exports', async () => {
    await writeImporter('src/views/index.ts', "export { Payments } from '@/features/payments';\n");
    expect(await findImporters('payments', 'feature', tmpDir)).toContain('src/views/index.ts');
  });

  it('detects dynamic import()', async () => {
    await writeImporter(
      'src/views/LazyView.tsx',
      "const load = () => import('@/features/payments');\n",
    );
    expect(await findImporters('payments', 'feature', tmpDir)).toContain('src/views/LazyView.tsx');
  });

  it('detects require()', async () => {
    await writeImporter(
      'src/lib/legacy.ts',
      "const payments = require('@/features/payments');\n",
    );
    expect(await findImporters('payments', 'feature', tmpDir)).toContain('src/lib/legacy.ts');
  });
});

describe('findImporters — relative imports', () => {
  beforeEach(async () => {
    await fs.remove(tmpDir);
    await setupProject();
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('detects relative path from views to feature', async () => {
    await writeImporter(
      'src/views/CheckoutView.tsx',
      "import { Payments } from '../features/payments';\n",
    );
    expect(await findImporters('payments', 'feature', tmpDir)).toContain('src/views/CheckoutView.tsx');
  });

  it('detects relative path from app route', async () => {
    await writeImporter(
      'src/app/checkout/page.tsx',
      "import { Payments } from '../../features/payments';\n",
    );
    expect(await findImporters('payments', 'feature', tmpDir)).toContain('src/app/checkout/page.tsx');
  });
});

describe('findImporters — exclusions and precision', () => {
  beforeEach(async () => {
    await fs.remove(tmpDir);
    await setupProject();
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('returns empty when nothing imports the slice', async () => {
    await writeImporter('src/views/Home.tsx', "import { Billing } from '@/features/billing';\n");
    expect(await findImporters('payments', 'feature', tmpDir)).toEqual([]);
  });

  it('does not report files inside the slice directory', async () => {
    const importers = await findImporters('payments', 'feature', tmpDir);
    expect(importers.every((file) => !file.includes('src/features/payments/'))).toBe(true);
  });

  it('ignores _examples directory', async () => {
    await writeImporter(
      'src/features/_examples/demo/ui/Demo.tsx',
      "import { Payments } from '@/features/payments';\n",
    );
    expect(await findImporters('payments', 'feature', tmpDir)).toEqual([]);
  });

  it('ignores node_modules if present under src', async () => {
    await writeImporter(
      'src/node_modules/pkg/index.ts',
      "import { Payments } from '@/features/payments';\n",
    );
    expect(await findImporters('payments', 'feature', tmpDir)).toEqual([]);
  });

  it('finds multiple importers', async () => {
    await writeImporter('src/views/A.tsx', "import '@/features/payments';\n");
    await writeImporter('src/views/B.tsx', "import '@/features/payments';\n");
    await writeImporter('src/widgets/C.tsx', "import '@/features/payments';\n");

    const importers = await findImporters('payments', 'feature', tmpDir);
    expect(importers).toHaveLength(3);
    expect(importers).toContain('src/views/A.tsx');
    expect(importers).toContain('src/views/B.tsx');
    expect(importers).toContain('src/widgets/C.tsx');
  });

  it('does not match similarly named slices', async () => {
    await writeImporter('src/views/Pay.tsx', "import { X } from '@/features/payments-v2';\n");
    expect(await findImporters('payments', 'feature', tmpDir)).toEqual([]);
  });

  it('resolves PascalCase slice name to kebab-case folder', async () => {
    await writeImporter('src/views/V.tsx', "import { Payments } from '@/features/payments';\n");
    expect(await findImporters('Payments', 'feature', tmpDir)).toContain('src/views/V.tsx');
  });
});

describe('findImporters — other slice types', () => {
  beforeEach(async () => {
    await fs.remove(tmpDir);
    await setupProject();
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('detects widget importers', async () => {
    await writeImporter('src/views/Home.tsx', "import { CartSummary } from '@/widgets/cart-summary';\n");
    expect(await findImporters('cart-summary', 'widget', tmpDir)).toContain('src/views/Home.tsx');
  });

  it('detects entity importers', async () => {
    await writeImporter('src/features/payments/ui/Pay.tsx', "import { User } from '@/entities/user';\n");
    expect(await findImporters('user', 'entity', tmpDir)).toContain('src/features/payments/ui/Pay.tsx');
  });

  it('detects view importers from app layer', async () => {
    await generateCommand('view', 'checkout', tmpDir);
    await writeImporter('src/app/page.tsx', "import { Checkout } from '@/views/checkout';\n");
    expect(await findImporters('checkout', 'view', tmpDir)).toContain('src/app/page.tsx');
  });
});
