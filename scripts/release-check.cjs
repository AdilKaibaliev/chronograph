'use strict';

const { spawn } = require('node:child_process');
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
  'scripts/world/province-gaps-test.cjs',
  'scripts/world/paint-composition-test.cjs',
  'scripts/world/kyrgyz-frontiers-test.cjs',
  'scripts/world/kyrgyz-frontiers-ui-test.cjs',
  'scripts/world/kyrgyz-territories-test.cjs',
  'scripts/world/kyrgyz-territories-ui-test.cjs',
  'scripts/world/continuity-test.cjs',
  'scripts/world/steppe-contours-test.cjs',
  'scripts/world/harsha-frontier-test.cjs',
  'scripts/world/namibia-meridian-test.cjs',
  'scripts/world/canada-north-test.cjs',
  'scripts/world/vancouver-island-test.cjs',
  'scripts/world/krakow-oregon-test.cjs',
  'scripts/world/source-review-142-test.cjs',
  'scripts/world/source-review-143-test.cjs',
  'scripts/world/source-review-144-test.cjs',
  'scripts/world/source-review-145-test.cjs',
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
  'scripts/world/kyrgyz-movement-test.cjs',
  'scripts/world/tian-shan-review-test.cjs',
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
  'scripts/seo/test.cjs',
  'scripts/seo/loading-test.cjs'
];

// The completed catalogue is immutable during verification. Each test runs in
// its own process; the few generated reports have distinct paths. Two workers
// avoid recompiling the source catalogue serially for every independent check.
// Both build steps remain exclusive barriers. No check or assertion is skipped.
async function runChecks() {
  const active = new Set(), completed = new Set();
  let failed = false;
  function run(file) {
    console.log(`Running ${file}`);
    const started = Date.now();
    return new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [file], { cwd: projectRoot, stdio: 'inherit' });
      active.add(child);
      child.once('error', error => { failed = true; reject(new Error(`${file}: ${error.message}`)); });
      child.once('close', code => {
        active.delete(child);
        if (code !== 0) { failed = true; reject(new Error(`${file}: exit ${code}`)); return; }
        completed.add(file);
        console.log(`Passed ${file} (${Math.round((Date.now() - started) / 1000)}s)`);
        resolve();
      });
    });
  }
  try {
    const build = checks.indexOf('scripts/i18n/build.cjs');
    const packaging = checks.indexOf('scripts/seo/build.cjs');
    for (const file of checks.slice(0, build + 1)) await run(file);
    const pending = checks.slice(build + 1, packaging);
    // Start the exhaustive annual comparison early so it cannot become a
    // serial tail. It shares the same two-worker limit as all other tests.
    const annual = pending.indexOf('scripts/world/survey-141-test.cjs');
    pending.unshift(...pending.splice(annual, 1));
    let next = 0;
    async function worker() {
      while (!failed && next < pending.length) await run(pending[next++]);
    }
    await Promise.all([worker(), worker()]);
    for (const file of checks.slice(packaging)) await run(file);
    if (completed.size !== checks.length) throw new Error(`Incomplete release checks: ${completed.size}/${checks.length}`);
    console.log(JSON.stringify({ pass: true, releaseChecks: completed.size }));
  } catch (error) {
    failed = true;
    for (const child of active) if (child.exitCode === null) child.kill();
    throw error;
  }
}

module.exports = { checks, runChecks };
if (require.main === module) runChecks().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
