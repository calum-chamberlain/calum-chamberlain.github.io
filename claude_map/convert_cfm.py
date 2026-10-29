#!/usr/bin/env python3
"""Convert the NZ Community Fault Model shapefile to a web-friendly GeoJSON.

The GNS Science download is in NZTM2000 (EPSG:2193); Leaflet needs WGS84 lon/lat.

Usage
-----
    pip install pyshp pyproj
    python convert_cfm.py NZ_CFM_v1_0_shapefile.zip ../data/nz_cfm_faults.geojson

The first argument can be the downloaded .zip, an unzipped folder, or a .shp
file. Download (CC BY 4.0, credit "(C) GNS Science"):
https://gns.cri.nz/data-and-resources/new-zealand-community-fault-model

Options
-------
    --decimals N   coordinate precision (default 5, roughly 1 m)
    --src-crs STR  override the CRS if the .prj is missing (default EPSG:2193)
"""
import argparse
import json
import math
import sys
import tempfile
import zipfile
from pathlib import Path

try:
    import shapefile                      # pyshp
    from pyproj import CRS, Transformer
except ImportError:
    sys.exit("Missing dependencies. Run:  pip install pyshp pyproj")


def find_shp(path: Path, workdir: Path) -> Path:
    """Return the .shp inside a zip, a folder, or the path itself."""
    if path.is_file() and path.suffix.lower() == ".zip":
        with zipfile.ZipFile(path) as zf:
            zf.extractall(workdir)
        path = workdir
    if path.is_dir():
        shps = sorted(path.rglob("*.shp"))
        if not shps:
            sys.exit(f"No .shp file found in {path}")
        if len(shps) > 1:
            print("Several shapefiles found, using the first:", *[f"\n  {s}" for s in shps])
        return shps[0]
    if path.suffix.lower() == ".shp":
        return path
    sys.exit(f"Don't know how to read {path}")


def load_crs(shp: Path, override):
    if override:
        return CRS.from_user_input(override)
    prj = shp.with_suffix(".prj")
    if prj.exists():
        try:
            return CRS.from_wkt(prj.read_text())
        except Exception as exc:   # unparseable .prj: fall back to NZTM
            print(f"Could not parse {prj.name} ({exc}); assuming EPSG:2193")
    return CRS.from_epsg(2193)


def clean(value):
    """Make a shapefile attribute JSON-safe."""
    if isinstance(value, bytes):
        value = value.decode("utf-8", "replace")
    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
        return None
    if hasattr(value, "isoformat"):
        return value.isoformat()
    if isinstance(value, str):
        value = value.strip()
    return value


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source", type=Path, help=".zip, folder or .shp")
    ap.add_argument("output", type=Path, help="GeoJSON file to write")
    ap.add_argument("--decimals", type=int, default=5)
    ap.add_argument("--src-crs", default=None)
    args = ap.parse_args()

    with tempfile.TemporaryDirectory() as tmp:
        shp = find_shp(args.source, Path(tmp))
        crs = load_crs(shp, args.src_crs)
        tf = Transformer.from_crs(crs, "EPSG:4326", always_xy=True)
        nd = args.decimals

        def conv(coords):
            # a coordinate is a sequence of numbers; anything else is a list of them
            if coords and isinstance(coords[0], (int, float)):
                lon, lat = tf.transform(coords[0], coords[1])   # drops any Z/M values
                # return [round(lon, nd), round(lat, nd)]
                lon = lon % 360
                return [lon, lat]
            return [conv(c) for c in coords]

        features, skipped = [], 0
        with shapefile.Reader(str(shp), encoding="utf-8", encodingErrors="replace") as sf:
            names = [f[0] for f in sf.fields[1:]]
            for sr in sf.iterShapeRecords():
                if sr.shape.shapeType == shapefile.NULL:
                    skipped += 1
                    continue
                geom = sr.shape.__geo_interface__
                props = {k: clean(v) for k, v in zip(names, sr.record)}
                features.append({
                    "type": "Feature",
                    "properties": props,
                    "geometry": {"type": geom["type"], "coordinates": conv(geom["coordinates"])},
                })

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as fh:
        json.dump({"type": "FeatureCollection", "features": features}, fh,
                  separators=(",", ":"), ensure_ascii=False)

    kinds = sorted({f["geometry"]["type"] for f in features})
    print(f"Read {shp.name} ({crs.name})")
    print(f"Wrote {len(features)} features ({', '.join(kinds)}) to {args.output}"
          f" [{args.output.stat().st_size / 1024:.0f} KB]"
          + (f"; skipped {skipped} empty" if skipped else ""))
    print("Attribute fields:", ", ".join(names))


if __name__ == "__main__":
    main()
