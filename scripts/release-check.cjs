'use strict';

const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const checks = [
  'scripts/support/contact-test.cjs',
  'scripts/support/contact-ui-test.cjs',
  'scripts/i18n/build.cjs',
  'scripts/ancient/test.cjs',
  'scripts/ancient/boundary-test.cjs',
  'scripts/ancient/continuity-test.cjs',
  'scripts/world/test.cjs',
  'scripts/world/render-test.cjs',
  'scripts/world/continuity-test.cjs',
  'scripts/world/steppe-contours-test.cjs',
  'scripts/world/harsha-frontier-test.cjs',
  'scripts/world/namibia-meridian-test.cjs',
  'scripts/world/canada-north-test.cjs',
  'scripts/world/vancouver-island-test.cjs',
  'scripts/world/krakow-oregon-test.cjs',
  'scripts/world/source-review-142-test.cjs',
  'scripts/world/russia-empire-review-test.cjs',
  'scripts/world/cache-test.cjs',
  'scripts/world/labels-test.cjs',
  'scripts/world/pagination-test.cjs',
  'scripts/world/content-audit-test.cjs',
  'scripts/world/education-test.cjs',
  'scripts/world/maghreb-outline-test.cjs',
  'scripts/late/test.cjs',
  'scripts/early/test.cjs',
  'scripts/to1789/test.cjs',
  'scripts/to1815/test.cjs',
  'scripts/to1848/test.cjs',
  'scripts/to1914/test.cjs',
  'scripts/to1918/test.cjs',
  'scripts/world/to1939-test.cjs',
  'scripts/world/to1945-test.cjs',
  'scripts/world/to1960-test.cjs',
  'scripts/world/to1991-test.cjs',
  'scripts/world/arctic-test.cjs',
  'scripts/world/to2000-test.cjs',
  'scripts/world/to2010-test.cjs',
  'scripts/world/frontier-review-test.cjs',
  'scripts/world/shared-frontiers-test.cjs',
  'scripts/world/legacy-frontiers-test.cjs',
  'scripts/world/early-boundary-review-test.cjs',
  'scripts/world/mediterranean-review-test.cjs',
  'scripts/world/anatolian-review-test.cjs',
  'scripts/world/europe-central-review-test.cjs',
  'scripts/world/frankish-partitions-test.cjs',
  'scripts/world/frankish-outer-frontiers-test.cjs',
  'scripts/world/treaty-frontiers-test.cjs',
  'scripts/world/global-review-135-test.cjs',
  'scripts/world/survey-136-test.cjs',
  'scripts/world/survey-137-test.cjs',
  'scripts/world/survey-138-test.cjs',
  'scripts/world/survey-139-test.cjs',
  'scripts/world/survey-140-test.cjs',
  'scripts/world/survey-141-test.cjs',
  'scripts/world/arabia-khitai-review-test.cjs',
  'scripts/world/altai-jochi-review-test.cjs',
  'scripts/world/taurus-china-review-test.cjs',
  'scripts/world/maghreb-frontier-review-test.cjs',
  'scripts/incidents/test.cjs',
  'scripts/world/coasts-occupation-test.cjs',
  'scripts/world/all-borders-test.cjs',
  'scripts/world/universal-borders-test.cjs',
  'scripts/world/map-stability-test.cjs',
  'scripts/world/border-review-test.cjs',
  'scripts/world/kyrgyz-test.cjs',
  'scripts/world/kyrgyz-study-test.cjs',
  'scripts/world/russia-outline-test.cjs',
  'scripts/world/cartography-test.cjs',
  'scripts/expansion/test.cjs',
  'scripts/future/test.cjs',
  'scripts/future/illustrations-test.cjs',
  'scripts/i18n/test.cjs',
  'scripts/support/test.cjs',
  'scripts/biographies-test.cjs',
  'scripts/history-test.cjs',
  'scripts/unified-map-test.cjs',
  'scripts/seo/build.cjs',
  'scripts/seo/test.cjs'
];

// This exhaustive annual comparison only reads the completed atlas and writes
// its own verification report. Run it alongside the other tests, with at most
// two children, so the full suite stays within the hosting build time limit.
// Both builds remain serial and every check must pass before packaging.
const parallelCheck = 'scripts/world/survey-141-test.cjs';
let frontierProcess;
let frontierResult;
let completed = 0;

async function runChecks() {
  for (const file of checks) {
    if (file === parallelCheck) continue;
    if (file === 'scripts/seo/build.cjs') {
      const result = await frontierResult;
      if (!result || result.code !== 0) throw new Error(`${parallelCheck} failed (${result?.code ?? 'not started'})`);
      completed++;
    }
    console.log(`Running ${file}`);
    const result = spawnSync(process.execPath, [file], { cwd: projectRoot, stdio: 'inherit' });
    if (result.error || result.status !== 0) throw new Error(`${file}: ${result.error?.message || `exit ${result.status}`}`);
    completed++;
    if (file === 'scripts/i18n/build.cjs') {
      console.log(`Running ${parallelCheck} (independent annual comparison)`);
      frontierProcess = spawn(process.execPath, [parallelCheck], { cwd: projectRoot, stdio: 'inherit' });
      frontierResult = new Promise(resolve => {
        frontierProcess.once('error', error => { console.error(error.message); resolve({ code: 1 }); });
        frontierProcess.once('close', code => resolve({ code }));
      });
    }
  }
  if (completed !== checks.length) throw new Error(`Incomplete release checks: ${completed}/${checks.length}`);
  console.log(JSON.stringify({ pass: true, releaseChecks: completed }));
}

runChecks().catch(error => {
  if (frontierProcess && frontierProcess.exitCode === null) frontierProcess.kill();
  console.error(error.message);
  process.exitCode = 1;
});
