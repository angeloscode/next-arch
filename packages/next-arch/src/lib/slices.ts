import path from 'path';
import { toKebabCase } from './naming.js';

export const SLICE_TYPES = ['feature', 'view', 'widget', 'entity'] as const;
export type SliceType = (typeof SLICE_TYPES)[number];

export const SLICE_LAYER_DIRS: Record<SliceType, string> = {
  feature: 'features',
  view: 'views',
  widget: 'widgets',
  entity: 'entities',
};

export function isSliceType(value: string): value is SliceType {
  return SLICE_TYPES.includes(value as SliceType);
}

export function getSliceDir(type: SliceType, name: string, projectRoot: string): string {
  const kebabName = toKebabCase(name);
  return path.join(projectRoot, 'src', SLICE_LAYER_DIRS[type], kebabName);
}

export function getSliceImportLabel(type: SliceType, name: string): string {
  const kebabName = toKebabCase(name);
  return `@/${SLICE_LAYER_DIRS[type]}/${kebabName}`;
}
