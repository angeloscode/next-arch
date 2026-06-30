import { cancel, isCancel, select } from '@clack/prompts';
import {
  DEFAULT_PAGE_PRESET,
  PAGE_PRESET_LABELS,
  PAGE_PRESETS,
  type PagePreset,
} from './page-presets.js';

function exitOnCancel<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel('Cancelled');
    process.exit(0);
  }
  return value;
}

export async function promptPagePreset(options: {
  yes?: boolean;
  preset?: PagePreset;
}): Promise<PagePreset> {
  if (options.preset) {
    if (!PAGE_PRESETS.includes(options.preset)) {
      throw new Error(`Unknown preset "${options.preset}". Use: ${PAGE_PRESETS.join(', ')}`);
    }
    return options.preset;
  }

  if (options.yes) {
    return DEFAULT_PAGE_PRESET;
  }

  return exitOnCancel(
    await select<PagePreset>({
      message: 'What page template do you want?',
      options: PAGE_PRESETS.map((preset) => ({
        value: preset,
        label: PAGE_PRESET_LABELS[preset],
      })),
      initialValue: 'blank',
    }),
  );
}
