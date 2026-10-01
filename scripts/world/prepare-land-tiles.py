"""Optional import step; runtime/build need Node only. pip install shapely."""
import json, sys
from pathlib import Path
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union
from shapely.geometry.polygon import orient

data=json.loads(Path(sys.argv[1]).read_text())
land=unary_union([shape(f['geometry']) for f in data['features']])
tiles=[]
for x in range(-180,180,15):
    for y in range(-90,90,15):
        cut=land.intersection(box(x,y,x+15,y+15))
        if cut.is_empty: continue
        parts=[cut] if cut.geom_type=='Polygon' else [p for p in cut.geoms if p.geom_type=='Polygon']
        rings=[]
        for p in parts:
            p=orient(p,sign=1)
            rings.extend([list(p.exterior.coords)[:-1],*[list(r.coords)[:-1] for r in p.interiors]])
        if rings: tiles.append({'bounds':[x,y,x+15,y+15],'rings':rings})
Path(__file__).with_name('land-coast-tiles.json').write_text(json.dumps(tiles,separators=(',',':')))
print(json.dumps({'landTiles':len(tiles),'vertices':sum(len(r) for t in tiles for r in t['rings'])}))
