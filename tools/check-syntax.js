#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIRS = ['js', 'lang', 'tools'];

function listJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push.apply(out, listJsFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.js')) {
      out.push(fullPath);
    }
  }

  return out;
}

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}

function runSyntaxCheck() {
  const files = [];
  for (let i = 0; i < TARGET_DIRS.length; i++) {
    const dir = path.join(ROOT, TARGET_DIRS[i]);
    if (fs.existsSync(dir)) {
      files.push.apply(files, listJsFiles(dir));
    }
  }

  if (!files.length) {
    console.log('[check-syntax] No JS files found.');
    return;
  }

  const failed = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const src = fs.readFileSync(file, 'utf8');
      new vm.Script(src, { filename: rel(file) });
    } catch (err) {
      failed.push({
        file: rel(file),
        stderr: err && err.message ? err.message : String(err)
      });
    }
  }

  if (failed.length) {
    console.error('[check-syntax] Failed files (' + failed.length + '):');
    for (let i = 0; i < failed.length; i++) {
      console.error('  - ' + failed[i].file);
      if (failed[i].stderr) console.error('    ' + failed[i].stderr);
    }
    process.exit(1);
  }

  console.log('[check-syntax] OK (' + files.length + ' files)');
}

if (require.main === module) {
  runSyntaxCheck();
}

module.exports = runSyntaxCheck;
