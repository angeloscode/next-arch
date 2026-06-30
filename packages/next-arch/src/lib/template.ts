import fs from 'fs-extra';
import path from 'path';

export async function renderTemplateDir(
  templateDir: string,
  targetDir: string,
  replacements: Record<string, string>,
): Promise<string[]> {
  const created: string[] = [];

  if (!(await fs.pathExists(templateDir))) {
    throw new Error(`Template "${path.basename(templateDir)}" not found.`);
  }

  const entries = await fs.readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(templateDir, entry.name);
    const renderedName = Object.entries(replacements).reduce(
      (name, [from, to]) => name.replaceAll(from, to),
      entry.name,
    );
    const targetPath = path.join(targetDir, renderedName);

    if (entry.isDirectory()) {
      await fs.ensureDir(targetPath);
      created.push(...(await renderTemplateDir(sourcePath, targetPath, replacements)));
      continue;
    }

    await fs.ensureDir(path.dirname(targetPath));
    let content = await fs.readFile(sourcePath, 'utf8');
    for (const [from, to] of Object.entries(replacements)) {
      content = content.replaceAll(from, to);
    }
    await fs.writeFile(targetPath, content);
    created.push(targetPath);
  }

  return created;
}

export async function copyTemplateTree(
  sourceDir: string,
  targetDir: string,
): Promise<string[]> {
  const created: string[] = [];

  if (!(await fs.pathExists(sourceDir))) {
    return created;
  }

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await fs.ensureDir(targetPath);
      created.push(...(await copyTemplateTree(sourcePath, targetPath)));
      continue;
    }

    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(sourcePath, targetPath);
    created.push(targetPath);
  }

  return created;
}

export function buildReplacements(name: string, pascalName: string, kebabName: string): Record<string, string> {
  return {
    '{{Name}}': pascalName,
    '{{name}}': kebabName,
    '{{NAME}}': name.toUpperCase(),
  };
}
