import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  getSliceDir,
  getSliceImportLabel,
  isSliceType,
  SLICE_LAYER_DIRS,
  SLICE_TYPES,
} from '../src/lib/slices.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '.tmp-slices-ref');

describe('slices.ts', () => {
  it('lists all FSD slice types', () => {
    expect(SLICE_TYPES).toEqual(['feature', 'view', 'widget', 'entity']);
  });

  it('maps slice types to layer directories', () => {
    expect(SLICE_LAYER_DIRS).toEqual({
      feature: 'features',
      view: 'views',
      widget: 'widgets',
      entity: 'entities',
    });
  });

  it('isSliceType validates known types', () => {
    expect(isSliceType('feature')).toBe(true);
    expect(isSliceType('page')).toBe(false);
    expect(isSliceType('')).toBe(false);
  });

  it.each([
    ['feature', 'payments', 'src/features/payments'],
    ['view', 'UserProfile', 'src/views/user-profile'],
    ['widget', 'site_header', 'src/widgets/site-header'],
    ['entity', 'OrderItem', 'src/entities/order-item'],
  ] as const)('getSliceDir(%s, %s)', (type, name, expectedSuffix) => {
    expect(getSliceDir(type, name, projectRoot)).toBe(path.join(projectRoot, expectedSuffix));
  });

  it.each([
    ['feature', 'payments', '@/features/payments'],
    ['view', 'dashboard', '@/views/dashboard'],
    ['widget', 'header', '@/widgets/header'],
    ['entity', 'user', '@/entities/user'],
  ] as const)('getSliceImportLabel(%s, %s)', (type, name, label) => {
    expect(getSliceImportLabel(type, name)).toBe(label);
  });
});
