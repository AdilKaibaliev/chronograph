"""Convert the published Krapp et al. categorical mask to dated map contours.

python build-older.py icesheets_000-800_cru.nc research/paleogeography-older
numpy, netCDF4, contourpy, shapely are offline preparation dependencies only.
Source classes are 0 ocean/inland-water, 1 land, 2 ice. No temporal morphing.
"""
import sys,json,gzip,hashlib,pathlib
import numpy as np
from netCDF4 import Dataset
from contourpy import contour_generator
from shapely.geometry import Polygon,Point
from shapely.ops import unary_union
from shapely import make_valid,set_precision

source=pathlib.Path(sys.argv[1]);target=pathlib.Path(sys.argv[2]);target.mkdir(parents=True,exist_ok=True)
assert hashlib.sha256(source.read_bytes()).hexdigest()=='722f7d964fb1b947563a0974026b7f8a289875393f5e52f9af6b46972f50d8d3'
def polys(g):
 if g.is_empty:return []
 if g.geom_type=='Polygon':return [g]
 if hasattr(g,'geoms'):return [p for child in g.geoms for p in polys(child)]
 return []
def valid(g):return unary_union(polys(make_valid(g)))
def encode(g):
 g=set_precision(valid(g),.0001,mode='valid_output')
 out=[[[[round(float(x),4)+0.,round(float(y),4)+0.] for x,y in ring.coords] for ring in [p.exterior,*p.interiors]] for p in polys(g) if p.area>.008]
 assert all(Polygon(p[0],p[1:]).is_valid for p in out)
 for poly in out:
  for ring in poly:
   for a,b in zip(ring,ring[1:]):assert abs(a[0]-b[0])<=180 or (abs(a[1])==90 and a[1]==b[1]),(a,b)
 return out
def contour(mask):
 z=np.pad(mask.astype(float),((1,1),(1,1)),mode='edge')
 pts,offsets=contour_generator(x=lon,y=lat,z=z,fill_type='OuterOffset').filled(.5,2)
 out=[]
 for pp,oo in zip(pts,offsets):
  rings=[pp[a:b] for a,b in zip(oo[:-1],oo[1:])]
  if len(rings[0])>3:out.extend(polys(make_valid(Polygon(rings[0],rings[1:]))))
 return valid(unary_union(out).simplify(.035,preserve_topology=True))
def write(name,value):
 raw=json.dumps(value,separators=(',',':'),ensure_ascii=False).encode()
 with open(target/name,'wb') as f:
  with gzip.GzipFile(fileobj=f,mode='wb',mtime=0,filename='') as z:z.write(raw)
 return {'file':name,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}
points={'bering-strait':[-169,66],'north-sea':[3,55],'torres-strait':[138,-10],'bass-strait':[146,-40],'wallacea-sea':[125,-10],'chicago':[-87.6,41.8],'stockholm':[18.1,59.3],'greenland':[-40,73],'antarctica':[20,-80]}
frames=[]
with Dataset(source) as f:
 times=np.asarray(f['time'][:]);x=np.asarray(f['lon'][:]);y=np.asarray(f['lat'][:]);assert np.allclose(np.diff(x),.5) and np.allclose(np.diff(y),.5)
 assert list(times)==list(range(-799000,1,1000))
 # The numeric time values are BP ages in the paper and global attributes.
 # Do not interpret the file's placeholder CF origin 0000 as a civil year.
 lon=np.r_[-180,x,180];lat=np.r_[-90,y,90]
 modern=contour(np.asarray(f['mask'][-1])>0)
 ages=list(range(352000,80000,-1000))
 if '--sample' in sys.argv:ages=[352000,350000,250000,180000,125000,123000,122000,120000,81000,80000]
 for bp in ages:
  i=int(np.flatnonzero(times==-bp)[0]);mask=np.asarray(f['mask'][i]);assert set(np.unique(mask))<={0,1,2}
  land=contour(mask>0);ice=valid(contour(mask==2).intersection(land));shelf=valid(land.difference(modern).difference(ice))
  probes={k:{'land':bool(land.covers(Point(*p))),'ice':bool(ice.covers(Point(*p)))} for k,p in points.items()}
  frame={'bp':bp,'year':1949-bp,'source':'krapp2021','land':encode(land),'ice':encode(ice),'shelf':encode(shelf),'probes':probes}
  meta=write(str(bp)+'.json.gz',frame);frames.append({'bp':bp,'year':frame['year'],**meta})
  print(json.dumps({'bp':bp,'bytes':meta['bytes'],'landPolygons':len(frame['land']),'icePolygons':len(frame['ice']),'shelfPolygons':len(frame['shelf'])}),flush=True)
 header={'schemaVersion':1,'source':{'title':'Krapp, M. et al. (2021). A statistics-based reconstruction of high-resolution global terrestrial climate for the last 800,000 years. Scientific Data 8, 228. Land/land-ice/ocean mask.','doi':'10.1038/s41597-021-01009-3','dataDoi':'10.17605/OSF.IO/8N43X','url':'https://osf.io/8n43x/','license':'CC BY 4.0','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'file':source.name,'spatialDegrees':.5,'stepYears':1000,'bpReference':1950,'sourceClasses':{'0':'ocean or preserved inland water','1':'land','2':'ice'}},'processing':{'coast':'0.5 categorical land/sea contour; published global sea level and ETOPO1 mask','ice':'0.5 contour of published category 2; not an independently reconstructed southern-hemisphere ice history','shelf':'land minus the same dataset 0 BP land and ice','simplificationDegrees':.035,'temporalInterpolation':False,'availableBP':[80000,352000],'authorsTimeOrigin':'BP ages; CF year-0000 placeholder is not a calendar date'},'frames':frames}
 header['processing']['availableBP']=[min(ages),max(ages)]
 header['source']['licenseUrl']='https://creativecommons.org/licenses/by/4.0/'
 write('manifest.json.gz',header)
 print(json.dumps({'pass':True,'frames':len(frames),'totalJsonBytes':sum(x['bytes'] for x in frames)}),flush=True)
