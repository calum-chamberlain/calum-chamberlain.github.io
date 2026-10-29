#!/usr/bin/env python3
"""Convert an ObsPy Catalog (or any file ObsPy can read) to GeoJSON for the map.

Each earthquake becomes a GeoJSON Point:

    coordinates: [longitude, latitude, depth_km]
    properties:  id, time (UTC, ISO 8601), mag, depth (km), place,
                 plus magType / mode when the catalogue has them

which is the format app.js expects. Magnitude and origin come from the event's
preferred magnitude/origin, falling back to the first one listed.

Command line
------------
    pip install obspy
    python obspy_to_geojson.py catalogue.xml ../data/my_catalogue.geojson
    python obspy_to_geojson.py catalogue.xml out.geojson --min-mag 3 --format QUAKEML

From Python (e.g. straight after an FDSN download)
--------------------------------------------------
    from obspy import UTCDateTime
    from obspy.clients.fdsn import Client
    from obspy_to_geojson import catalog_to_geojson, write_geojson

    cat = Client("GEONET").get_events(starttime=UTCDateTime("2026-01-01"),
                                      minmagnitude=3)
    geojson, skipped = catalog_to_geojson(cat)
    write_geojson(geojson, "../data/geonet_2026.geojson")

Then register it in the CATALOGUES list at the top of app.js:

    { id: 'geonet2026', name: 'GeoNet 2026', url: 'data/geonet_2026.geojson',
      color: '#2b8a3e' }

Notes
-----
* ObsPy stores depth in metres; it is converted to kilometres here.
* Events with no origin, time, location or magnitude cannot be drawn and are
  skipped (the count is printed). Events with no depth are skipped unless you
  give --default-depth.
* Depths above sea level (negative) are set to 0 km unless you pass
  --keep-negative-depth, because the map's depth scale starts at 0.
"""
import argparse
import json
import math
import sys
from collections import Counter
from pathlib import Path


def _finite(x):
    return x is not None and isinstance(x, (int, float)) and math.isfinite(x)


def _place(event):
    """Best available human-readable location for an event."""
    descs = [d for d in (getattr(event, "event_descriptions", None) or []) if getattr(d, "text", None)]
    for wanted in ("region name", "earthquake name", "Flinn-Engdahl region"):
        for d in descs:
            if getattr(d, "type", None) == wanted:
                return d.text.strip()
    return descs[0].text.strip() if descs else ""


def _event_id(event):
    rid = getattr(getattr(event, "resource_id", None), "id", None)
    if not rid:
        return ""
    return str(rid).replace("\\", "/").rstrip("/").split("/")[-1].split("=")[-1]


def catalog_to_geojson(catalog, min_magnitude=None, default_depth_km=None,
                       clip_negative_depth=True, decimals=5):
    """Convert an ObsPy Catalog to a GeoJSON FeatureCollection dict.

    Returns (geojson, skipped) where `skipped` is a Counter of why events were
    left out ("no origin", "no time", "no location", "no depth",
    "no magnitude", "below min magnitude").
    """
    features, skipped = [], Counter()

    for event in catalog:
        origin = event.preferred_origin() or (event.origins[0] if event.origins else None)
        if origin is None:
            skipped["no origin"] += 1
            continue
        if origin.time is None:
            skipped["no time"] += 1
            continue
        lat, lon = origin.latitude, origin.longitude
        if not (_finite(lat) and _finite(lon)):
            skipped["no location"] += 1
            continue

        magnitude = event.preferred_magnitude() or (event.magnitudes[0] if event.magnitudes else None)
        if magnitude is None or not _finite(magnitude.mag):
            skipped["no magnitude"] += 1
            continue
        if min_magnitude is not None and magnitude.mag < min_magnitude:
            skipped["below min magnitude"] += 1
            continue

        depth_km = origin.depth / 1000.0 if _finite(origin.depth) else default_depth_km
        if depth_km is None:
            skipped["no depth"] += 1
            continue
        if clip_negative_depth and depth_km < 0:
            depth_km = 0.0

        props = {
            "id": _event_id(event),
            "time": origin.time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "mag": round(float(magnitude.mag), 2),
            "depth": round(depth_km, 2),
            "place": _place(event),
        }
        if getattr(magnitude, "magnitude_type", None):
            props["magType"] = magnitude.magnitude_type
        if getattr(origin, "evaluation_mode", None):
            props["mode"] = origin.evaluation_mode

        features.append({
            "type": "Feature",
            "properties": props,
            "geometry": {"type": "Point",
                         "coordinates": [round(lon, decimals), round(lat, decimals), round(depth_km, 2)]},
        })

    features.sort(key=lambda f: f["properties"]["time"])
    return {"type": "FeatureCollection", "features": features}, skipped


def write_geojson(geojson, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(geojson, fh, separators=(",", ":"), ensure_ascii=False)
    return path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input", help="catalogue file readable by obspy.read_events (QuakeML, NDK, NLLOC, ...)")
    ap.add_argument("output", type=Path, help="GeoJSON file to write")
    ap.add_argument("--format", default=None, help="ObsPy format name, e.g. QUAKEML (default: auto-detect)")
    ap.add_argument("--min-mag", type=float, default=None, help="drop events below this magnitude")
    ap.add_argument("--default-depth", type=float, default=None, metavar="KM",
                    help="depth to use for events that have none")
    ap.add_argument("--keep-negative-depth", action="store_true",
                    help="keep depths above sea level instead of setting them to 0")
    ap.add_argument("--decimals", type=int, default=5, help="lon/lat precision (default 5, about 1 m)")
    args = ap.parse_args()

    try:
        from obspy import read_events
    except ImportError:
        sys.exit("ObsPy is not installed. Run:  pip install obspy")

    catalog = read_events(args.input, format=args.format)
    geojson, skipped = catalog_to_geojson(
        catalog,
        min_magnitude=args.min_mag,
        default_depth_km=args.default_depth,
        clip_negative_depth=not args.keep_negative_depth,
        decimals=args.decimals,
    )
    out = write_geojson(geojson, args.output)

    print(f"Read {len(catalog)} events; wrote {len(geojson['features'])} to {out} "
          f"[{out.stat().st_size / 1024:.0f} KB]")
    for reason, n in skipped.most_common():
        print(f"  skipped {n}: {reason}")


if __name__ == "__main__":
    main()
