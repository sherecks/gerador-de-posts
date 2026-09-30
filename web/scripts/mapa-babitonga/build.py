"""
Builds the `mapa` figure's base map: the standard OpenStreetMap rendering of
the Baía da Babitonga region, stitched from its tiles into one image
(public/mapas/babitonga.png), plus src/lib/mapa-babitonga.ts with the places a
`mapa` figure may point at, already projected onto that image.

Why a build step instead of x/y from the generator: the generator used to
invent each point's position over a hand-drawn shape, so "Barra do Sul" landed
wherever the model guessed. Now it can only name a place from LUGARES, and the
position comes from real coordinates.

Why a stitched image instead of live tiles: the slide must render (and export
to PNG) without network, and a post should not change when OSM does. That is
~16 tiles fetched once, with a real User-Agent, cached in ./tiles, which is
within the OSM tile usage policy. The figure prints "© OpenStreetMap".

Sources (© OpenStreetMap contributors, ODbL):
  - tiles: https://tile.openstreetmap.org/{z}/{x}/{y}.png, standard style
  - osm-coastline.json (Overpass, natural=coastline in the region): only to
    check that each town falls on land and each water name on water
  - LUGARES coordinates: Nominatim search

Run: python scripts/mapa-babitonga/build.py   (needs shapely >= 2 and Pillow)
"""

import json
import math
import time
import urllib.request
from pathlib import Path

from PIL import Image
from shapely.geometry import LineString, Point, box
from shapely.ops import polygonize, unary_union

HERE = Path(__file__).parent
WEB = HERE.parent.parent
OUT_TS = WEB / 'src' / 'lib' / 'mapa-babitonga.ts'
OUT_PNG = WEB / 'public' / 'mapas' / 'babitonga.png'
TILES = HERE / 'tiles'

# lon_min, lat_min, lon_max, lat_max: Joinville to the open sea, Itapoá to Barra do Sul.
BBOX = (-48.90, -26.49, -48.47, -26.07)
# Zoom 11: at feed size the town names on the tiles are still readable; at 12 they shrink to texture.
ZOOM = 11
USER_AGENT = 'gerador-de-posts/1.0 (static base map for social media posts, fetched once)'

# id -> (display name, lat, lon, kind, label side)
#   kind 'cidade': dot + label; 'area': label only, uppercase; 'agua': label only, italic.
#   side: which way the label grows from its anchor ('centro' = centered on it), chosen so it stays on the map.
LUGARES = {
    'joinville': ('Joinville', -26.3045, -48.8487, 'cidade', 'direita'),
    'sao-francisco-do-sul': ('São Francisco do Sul', -26.2495, -48.6308, 'cidade', 'direita'),
    'itapoa': ('Itapoá', -26.1162, -48.6180, 'cidade', 'esquerda'),
    'araquari': ('Araquari', -26.3703, -48.7211, 'cidade', 'esquerda'),
    'barra-do-sul': ('Balneário Barra do Sul', -26.4598, -48.6061, 'cidade', 'esquerda'),
    'vila-da-gloria': ('Vila da Glória', -26.2217, -48.6801, 'cidade', 'esquerda'),
    'laranjeiras': ('Laranjeiras', -26.2783, -48.6652, 'cidade', 'direita'),
    'praia-itaguacu': ('Praia de Itaguaçu', -26.1864, -48.5281, 'cidade', 'esquerda'),
    'ilha-sao-francisco': ('Ilha de São Francisco', -26.3300, -48.5900, 'area', 'centro'),
    'baia-babitonga': ('Baía da Babitonga', -26.2723, -48.7362, 'agua', 'centro'),
    'oceano': ('Oceano Atlântico', -26.3900, -48.4880, 'agua', 'esquerda'),
}

# Fallback anchors for water names, tried in order when the first one collides
# with a named point: the bay and the ocean are what make the map recognizable,
# so they move before they disappear. Each must be on water.
ANCORAS_EXTRA = {
    'baia-babitonga': [(-26.2104, -48.6334), (-26.3224, -48.7253)],
    'oceano': [(-26.1300, -48.4950), (-26.4500, -48.5000), (-26.3000, -48.4900)],
}

# Shown on every map whether or not the generation names them: they orient the reader.
CONTEXTO = ['baia-babitonga', 'oceano']


def mercator(lon: float, lat: float) -> tuple[float, float]:
    """Global pixel position at ZOOM, the tiles' own projection."""
    n = 256 * 2**ZOOM
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y


def tile(x: int, y: int) -> Image.Image:
    TILES.mkdir(exist_ok=True)
    cached = TILES / f'{ZOOM}-{x}-{y}.png'
    if not cached.exists():
        request = urllib.request.Request(
            f'https://tile.openstreetmap.org/{ZOOM}/{x}/{y}.png', headers={'User-Agent': USER_AGENT}
        )
        cached.write_bytes(urllib.request.urlopen(request, timeout=30).read())
        time.sleep(0.3)
    return Image.open(cached).convert('RGB')


def base_map() -> tuple[int, int, float, float]:
    """Stitches the crop from tiles; returns its size and its top-left global pixel."""
    left, top = mercator(BBOX[0], BBOX[3])
    right, bottom = mercator(BBOX[2], BBOX[1])
    tx0, ty0, tx1, ty1 = int(left // 256), int(top // 256), int(right // 256), int(bottom // 256)
    sheet = Image.new('RGB', (256 * (tx1 - tx0 + 1), 256 * (ty1 - ty0 + 1)))
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            sheet.paste(tile(tx, ty), ((tx - tx0) * 256, (ty - ty0) * 256))
    crop = (round(left - tx0 * 256), round(top - ty0 * 256), round(right - tx0 * 256), round(bottom - ty0 * 256))
    image = sheet.crop(crop)
    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUT_PNG, optimize=True)
    return image.width, image.height, left, top


def land_polygon():
    """Approximate land from the coastline, only to sanity-check the gazetteer."""
    bb = box(*BBOX)
    raw = json.loads((HERE / 'osm-coastline.json').read_text(encoding='utf8'))
    lines = [LineString([(p['lon'], p['lat']) for p in el['geometry']]) for el in raw['elements'] if el['type'] == 'way']
    faces = polygonize(unary_union([unary_union(lines).intersection(bb), bb.boundary]))

    def is_land(face) -> bool:
        # OSM coastlines run with the land on their left.
        pt = face.representative_point()
        line = min(lines, key=lambda candidate: candidate.distance(pt))
        s = line.project(pt)
        a = line.interpolate(max(s - 1e-5, 0))
        b = line.interpolate(min(s + 1e-5, line.length))
        near = line.interpolate(s)
        return (b.x - a.x) * (pt.y - near.y) - (b.y - a.y) * (pt.x - near.x) > 0

    return unary_union([face for face in faces if is_land(face)]).buffer(0.0005)


def main() -> None:
    width, height, left, top = base_map()
    land = land_polygon()

    def percent(lon: float, lat: float) -> dict:
        x, y = mercator(lon, lat)
        return {'x': round((x - left) / width * 100, 2), 'y': round((y - top) / height * 100, 2)}

    def on_water(lid: str, lat: float, lon: float) -> dict:
        if land.contains(Point(lon, lat)):
            raise SystemExit(f'{lid}: ({lat}, {lon}) should be on water')
        return percent(lon, lat)

    lugares = {}
    for lid, (nome, lat, lon, tipo, lado) in LUGARES.items():
        if tipo == 'agua':
            on_water(lid, lat, lon)
        elif tipo == 'cidade' and not land.contains(Point(lon, lat)):
            raise SystemExit(f'{lid} should be on land')
        lugares[lid] = {'nome': nome, **percent(lon, lat), 'tipo': tipo, 'lado': lado}
        if lid in ANCORAS_EXTRA:
            lugares[lid]['ancoras'] = [on_water(lid, a_lat, a_lon) for a_lat, a_lon in ANCORAS_EXTRA[lid]]

    # Mercator x is linear in longitude: 5 km at the map's mid-latitude.
    km_per_deg_lon = 111.32 * math.cos(math.radians((BBOX[1] + BBOX[3]) / 2))
    five_km_pct = round(5 / km_per_deg_lon / (BBOX[2] - BBOX[0]) * 100, 2)

    ids = list(LUGARES)
    OUT_TS.write_text(
        '/* Generated by scripts/mapa-babitonga/build.py. Do not edit by hand. */\n'
        '/* Base map and places: © OpenStreetMap contributors (ODbL). */\n\n'
        f"export const MAPA_IMAGEM = '/mapas/{OUT_PNG.name}';\n"
        f'export const MAPA_VIEW_W = {width};\n'
        f'export const MAPA_VIEW_H = {height};\n'
        '/** Width of 5 km, in percent of the map width. */\n'
        f'export const MAPA_5KM_PCT = {five_km_pct};\n\n'
        f'export const LUGAR_IDS = {json.dumps(ids)} as const;\n'
        'export type LugarId = (typeof LUGAR_IDS)[number];\n\n'
        'export type Lugar = {\n'
        '  nome: string;\n'
        '  /** Percent of the map box, from the left. */\n'
        '  x: number;\n'
        '  /** Percent of the map box, from the top. */\n'
        '  y: number;\n'
        "  tipo: 'cidade' | 'area' | 'agua';\n"
        "  lado: 'esquerda' | 'direita' | 'centro';\n"
        '  /** Water names only: where else the label may sit when its own spot is taken. */\n'
        '  ancoras?: { x: number; y: number }[];\n'
        '};\n\n'
        f'export const LUGARES: Record<LugarId, Lugar> = {json.dumps(lugares, ensure_ascii=False, indent=2)};\n\n'
        f'export const LUGARES_CONTEXTO: readonly LugarId[] = {json.dumps(CONTEXTO)};\n',
        encoding='utf8',
    )
    print(f'{OUT_PNG.name}: {width}x{height} (z{ZOOM}); {OUT_TS.name}: {len(lugares)} lugares')


if __name__ == '__main__':
    main()
