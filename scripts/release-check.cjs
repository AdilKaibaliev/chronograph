'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const checks = [
  'scripts/i18n/build.cjs',
  'scripts/world/test.cjs',
  'scripts/world/render-test.cjs',
  'scripts/world/content-audit-test.cjs',
  'scripts/world/education-test.cjs',
  'scripts/world/maghreb-outline-test.cjs',
  'scripts/future/test.cjs',
  'scripts/future/illustrations-test.cjs',
  'scripts/i18n/test.cjs',
  'scripts/support/test.cjs',
  'scripts/biographies-test.cjs',
  'scripts/history-test.cjs',
  'scripts/unified-map-test.cjs'
];

for (const file of checks) {
  console.log(`Running ${file}`);
  const result = spawnSync(process.execPath, [file], {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status || 1);
}
