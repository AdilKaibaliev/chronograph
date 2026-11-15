"""Compile the published PaleoMIST grid, not hand-drawn coast polygons.

Usage: python build.py reconstruction_0.25_degree.nc output.json.gz
Offline build dependencies: numpy, netCDF4, scipy, contourpy, shapely.
The deployment reads the reviewed compact archive; it needs none of these.
"""
import sys, json, gzip, hashlib, pathlib
import numpy as np
from netCDF4 import Dataset
from scipy.ndimage import label
from contourpy import contour_generator
from shapely.geometry import Polygon, MultiPolygon, mapping, box, Point
from shapely.ops import unary_union
from shapely import make_valid, set_precision

source=pathlib.Path(sys.argv[1]); target=pathlib.Path(sys.argv[2])
TOLERANCE=.035

def polygons(g):
 if g.is_empty: return []
 if g.geom_type=='Polygon': return [g]
 if hasattr(g,'geoms'): return [p for c in g.geoms for p in polygons(c)]
 return []

def valid(g):
 return unary_union(polygons(make_valid(g)))

def geometry(g):
 # Topology-preserving quantization prevents narrow shelf slivers crossing
 # themselves when their coordinates are rounded for the web archive.
 ps=[p for p in polygons(set_precision(valid(g),.0001,mode='valid_output')) if p.area>.008]
 out=[[[[round(float(x),4)+0.,round(float(y),4)+0.] for x,y in ring.coords] for ring in [p.exterior,*p.interiors]] for p in ps]
 assert all(Polygon(p[0],p[1:]).is_valid for p in out)
 return out

def contours(z,level):
 # Continuous interpolation within the published 0.25 degree spatial grid.
 # Temporal frames are never interpolated.
 points,offsets=contour_generator(x=lon,y=lat,z=z,fill_type='OuterOffset').filled(level,float('inf'))
 ps=[]
 for pts,offset in zip(points,offsets):
  rings=[pts[a:b] for a,b in zip(offset[:-1],offset[1:])]
  if len(rings[0])>3:ps.extend(polygons(make_valid(Polygon(rings[0],rings[1:]))))
 g=valid(unary_union(ps).simplify(TOLERANCE,preserve_topology=True))
 assert g.is_valid
 return g

def coastal_field(z):
 # Isolated below-sea-level depressions are not an ocean transgression.
 # Their present-reference outline is retained; this product reconstructs
 # marine coasts, not lake levels or rivers.
 labels,count=label(z<0)
 marine=set(np.unique(np.r_[labels[0,:],labels[-1,:],labels[:,0],labels[:,-1]]))-{0}
 for x,y in [(-150,0),(-30,0),(80,-20),(0,85)]:
  marine.add(int(labels[round((y+90)*4),round((x+180)*4)]))
 marine.discard(0)
 interior=(z<0)&~np.isin(labels,list(marine))
 out=z.copy();out[interior]=1
 return out,interior

with Dataset(source) as f:
 lon=np.array(f['lon'][:]);lat=np.array(f['lat'][:]);times=np.array(f['time'][:])
 assert np.allclose(np.diff(lon),.25) and np.allclose(np.diff(lat),.25)
 assert list(times)==list(range(-80000,1,2500))
 reference=np.asarray(f['paleo_topography'][-1]);_,inland=coastal_field(reference)
 modern=contours(reference,0)
 frames=[]
 point_coords={'bering-strait':[-169,66],'north-sea':[3,55],'torres-strait':[138,-10],'bass-strait':[146,-40],'wallacea-sea':[125,-10],'chicago':[-87.6,41.8],'stockholm':[18.1,59.3]}
 for i,time in enumerate(times):
  topo=np.asarray(f['paleo_topography'][i]);thickness=np.asarray(f['ice_thickness'][i]);age=int(-time)
  assert np.isfinite(topo).all() and np.isfinite(thickness).all()
  coast,_=coastal_field(topo);coast[inland]=reference[inland]
  land=contours(coast,0)
  ice=valid(contours(thickness,10).intersection(land))
  shelf=valid(land.difference(modern).difference(ice))
  probes={k:{'land':bool(land.covers(Point(*xy))),'ice':bool(ice.covers(Point(*xy)))} for k,xy in point_coords.items()}
  ordinal=1950-age;year=ordinal if ordinal>0 else ordinal-1
  frame={'bp':age,'year':year,'land':geometry(land),'ice':geometry(ice),'shelf':geometry(shelf),'probes':probes}
  # The 180-degree map cut must not generate a line across the world.
  for kind in ['land','ice','shelf']:
   for poly in frame[kind]:
    for ring in poly:
     assert ring[0]==ring[-1]
     for a,b in zip(ring,ring[1:]):
      # A contour can close within rounding distance of the polar grid edge.
      assert abs(a[0]-b[0])<=180 or (abs(a[1])>89.99 and abs(b[1])>89.99 and a[1]*b[1]>0), (age,kind,a,b)
  frames.append(frame)
  print(json.dumps({'bp':age,'landPolygons':len(frame['land']),'icePolygons':len(frame['ice'])}),flush=True)
 data={'schemaVersion':1,'source':{'title':'Gowan, E. J. (2019, updated 2021). Global ice sheet reconstruction for the past 80000 years. PaleoMIST 1.0. PANGAEA.', 'doi':'10.1594/PANGAEA.905800','url':'https://doi.pangaea.de/10.1594/PANGAEA.905800','license':'CC BY 4.0','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'file':source.name,'variant':'standard, minimal MIS 3 North America','spatialDegrees':.25,'stepYears':2500,'bpReference':1950},'processing':{'coast':'0 m contour of paleo_topography, including GIA and regional relative sea level','ice':'10 m grounded-ice thickness contour; numerical fringe removed','inlandWater':'Unconnected negative-elevation basins retain the 0 BP reference; lake levels and rivers are not reconstructed','simplificationDegrees':TOLERANCE,'minimumPolygonSquareDegrees':.008,'temporalInterpolation':False},'modern':geometry(modern),'frames':frames}
 target.parent.mkdir(parents=True,exist_ok=True)
 raw=json.dumps(data,separators=(',',':'),ensure_ascii=False).encode()
 with open(target,'wb') as out:
  with gzip.GzipFile(fileobj=out,mode='wb',mtime=0,filename='') as zipped:zipped.write(raw)
 # Bounded versioned source files; no 554 MB NetCDF is deployed.
 folder=target.parent/'paleogeography';folder.mkdir(parents=True,exist_ok=True)
 def write_part(name,value):
  body=json.dumps(value,separators=(',',':'),ensure_ascii=False).encode()
  with open(folder/name,'wb') as out:
   with gzip.GzipFile(fileobj=out,mode='wb',mtime=0,filename='') as zipped:zipped.write(body)
 for frame in frames:write_part(str(frame['bp'])+'.json.gz',frame)
 write_part('manifest.json.gz',{**{k:v for k,v in data.items() if k!='frames'},'frameFiles':[str(f['bp'])+'.json.gz' for f in frames]})
 print(json.dumps({'frames':len(frames),'bytes':len(raw),'gzipBytes':target.stat().st_size,'pass':True}),flush=True)
