#!/usr/bin/env node
/**
 * Copies Git hook scripts from scripts/git-hooks/ into .git/hooks/
 * so branch and commit message conventions are enforced.
 */

import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const hooksSrc = join(repoRoot, 'scripts', 'git-hooks');
const hooksDest = join(repoRoot, '.git', 'hooks');

const hookNames = ['commit-msg', 'pre-push'];

if (!existsSync(join(repoRoot, '.git', 'HEAD'))) {
  console.error('Not a Git repo (no .git/HEAD). Run this from the repo root.');
  process.exit(1);
}

if (!existsSync(hooksSrc)) {
  console.error('scripts/git-hooks not found.');
  process.exit(1);
}

if (!existsSync(hooksDest)) {
  mkdirSync(hooksDest, { recursive: true });
}

for (const name of hookNames) {
  const src = join(hooksSrc, name);
  const dest = join(hooksDest, name);
  if (!existsSync(src)) {
    console.warn('Skip (missing):', name);
    continue;
  }
  copyFileSync(src, dest);
  console.log('Installed:', name);
}

console.log('Git hooks are installed. See CONVENTIONS.md for branch and commit formats.');
