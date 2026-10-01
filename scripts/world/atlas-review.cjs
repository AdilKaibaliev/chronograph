'use strict';
// Dated map anchors. A profile anchor is not a claim of uninterrupted capital
// status. Archived narrative records remain available without being rewritten.
module.exports=c=>{
 c.mapAnchors={
  'korea':[[1300,1392,[126.55,37.97]]],
  'late-ottoman':[[1453,1923,[28.98,41.01]]],
  'early-ottoman-egypt-sham':[[1798,1946,[31.24,30.04]]],
  'late-hre':[[1867,1946,[13.4,52.52]]],
  '1914-italy':[[1849,1865,[7.69,45.07]],[1865,1871,[11.25,43.77]],[1871,1943,[12.5,41.9]],[1943,1944,[17.94,40.64]],[1944,1946,[12.5,41.9]]],
  'late-france':[[1420,1436,[2.4,47.08]]],
  'japan':[[1940,1946,[139.75,35.68]]],
  'early-johor':[[1940,1946,[103.92,1.58]]],
  '1789-saint-domingue':[[1807,1816,[-72.34,18.54]]]
 };
 return require('./outline-policy.cjs').apply(c);
};
