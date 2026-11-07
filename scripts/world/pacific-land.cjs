'use strict';
// Islands below the resolution of the existing Natural Earth 1:50m land.
// Each ring is a physical shoreline, independent of the selected year.
const {samoa}=require('./world-corridors.json');
module.exports=[...samoa.manua,...samoa.rose,...samoa.swains];
