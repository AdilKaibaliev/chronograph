const assert = require('assert/strict');
const catalog = require('./catalog.cjs');
const {createWorldHistory} = require('./core.js');
const history = createWorldHistory(catalog);

// A rounded older period boundary must not erase Lambayeque in 1250.
// Carcedo de Mufarech (2024) dates Sicán/Lambayeque to 750–1375;
// this atlas currently ends at 1299, before that terminal date.
for (const year of [1249, 1250, 1275, 1299]) {
  const society = history.get('sican', year);
  assert(society, `Sicán is missing in ${year}`);
  assert.equal(society.phase.from, 1100);
  assert.deepEqual(society.coord, [-79.84, -6.51]);
  const territory = history.areasAt(year).filter(area => area.entry === 'sican');
  assert.equal(territory.length, 1, `Sicán territory is missing or duplicated in ${year}`);
  assert(territory[0].sources.includes('sicanContinuity'));
  assert(society.phase.sources.includes('sicanContinuity'));
}
assert(catalog.sources.sicanContinuity.title.includes('2024'));
assert(history.areasAt(1299).some(area => area.entry === 'chimu'), 'Chimú must coexist with Sicán before 1300');
// Quiriguá's secession is not the end of Copán. Test the named UNESCO
// site coordinate as well as political continuity on both sides of 738.
function contains(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > point[1]) !== (b[1] > point[1]) &&
        point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
for (const year of [610, 737, 738, 800, 849, 899]) {
  const copan = history.get('copan', year);
  assert(copan, `Copán is missing in ${year}`);
  const frames = history.areasAt(year).filter(area => area.entry === 'copan');
  assert.equal(frames.length, 1);
  assert(frames[0].polygons.some(ring => contains([-89.142, 14.838], ring)), 'Copán core must contain the UNESCO site');
  assert.equal(frames[0].kind, 'polity');
  assert.equal(frames[0].approx, true);
  assert(frames[0].sources.includes('copan'));
  if (year < 850) assert(history.get('quirigua', year), 'Copán and Quiriguá must both be represented');
}
assert.equal(history.get('copan', 738).phase.from, 738);
assert(!history.get('copan', 900), 'Do not extend the mapped kingdom beyond its approximate Classic-period phase');
assert(history.areasAt(737).find(area => area.entry === 'quirigua').name[1].includes('under Copán'));
assert(history.areasAt(738).find(area => area.entry === 'quirigua').name[1].includes('independent'));
console.log('PASS: Sicán / Túcume continues through 1299; Copán remains a separate political core after 738 and contains its documented site coordinate.');
