"""Builds the website catalogue from the organised picture folders.

Reads   : ../organized_pictures/<group>/<category>/[<artwork-folder>/]<photos>
Writes  : client/public/images/full|thumb/<hash>.jpg   (web-sized copies, shared by duplicates)
          client/public/data/products.json             (edit this file to refine names/descriptions)
Run     : python scripts/build_catalog.py
Products whose id already exists in products.json keep their edited name/description/featured flag.
"""
import os, json, hashlib
from concurrent.futures import ProcessPoolExecutor
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(os.path.dirname(ROOT), 'organized_pictures')
OUT = os.path.join(ROOT, 'client', 'public', 'images')
DATA = os.path.join(ROOT, 'client', 'public', 'data', 'products.json')
Image.MAX_IMAGE_PIXELS = None

GROUPS = {'nameplates': 'nameplates', 'paintings': 'paintings', 'home-decor': 'home-decor', 'other': 'home-decor'}  # NB: other/mdf-cutouts is no longer sold and is skipped below
SUB_LABEL = {
    'ethnic': 'Ethnic', 'floral': 'Floral', 'clay': 'Clay', 'acrylic': 'Acrylic', 'modern': 'Modern',
    'resin': 'Resin', 'devotional': 'Devotional', 'kids': 'Kids',
    'palette': 'Palette', 'texture': 'Texture', 'abstract': 'Abstract', 'traditional': 'Traditional', 'devotionals': 'Devotionals',
    'coaster': 'Coasters', 'tray': 'Trays', 'clock': 'Clocks', 'keyholder': 'Key Holders', 'personalized-gifts': 'Personalised Gifts',
    'tealight': 'Tealight Holders', 'magnets': 'Fridge Magnets', 'lamps': 'Lanterns & Lamps', 'jewellery': 'Jewellery',
}
SINGULAR = {
    'ethnic': 'Ethnic Nameplate', 'floral': 'Floral Nameplate', 'clay': 'Clay Nameplate', 'acrylic': 'Acrylic Nameplate',
    'modern': 'Modern Nameplate', 'resin': 'Resin Nameplate', 'devotional': 'Devotional Nameplate', 'kids': 'Kids Nameplate',
    'palette': 'Palette Knife Painting', 'texture': 'Textured Painting', 'abstract': 'Abstract Painting',
    'traditional': 'Traditional Painting', 'devotionals': 'Devotional Painting',
    'coaster': 'Coaster Set', 'tray': 'Serving Tray', 'clock': 'Wall Clock', 'keyholder': 'Key Holder',
    'personalized-gifts': 'Personalised Gift', 'tealight': 'Tealight Holder', 'magnets': 'Fridge Magnet',
    'lamps': 'Lantern', 'jewellery': 'Hand-painted Earrings',
}
POSS = {'aafis': "Aafi's", 'chandras': "Chandra's", 'pawars': "Pawar's", 'kumars': "Kumar's", 'rawats': "Rawat's",
        'moms': "Mom's", 'bhatnagars': "Bhatnagar's"}


def titleize(slug):
    words = [POSS.get(w, w.capitalize()) for w in slug.split('-')]
    return ' '.join(words).replace(' And ', ' & ').replace('Mdf', 'MDF')


OPEN = {
    'nameplates': ['A handcrafted {n} for your entrance.', 'A one-of-a-kind {n}, made by hand at Anukala.',
                   'Welcome guests with this handcrafted {n}.'],
    'paintings': ['A hand-painted artwork for your walls.', 'An original painting made by hand at Anukala.',
                  'A statement piece painted by hand in our Pune studio.'],
    'home-decor': ['A handcrafted piece to bring character to your home.', 'Made by hand at Anukala to add warmth to your space.',
                   'A hand-finished decor piece, made in Pune.'],
}
SUB_LINE = {
    'ethnic': 'Inspired by traditional Indian art motifs and warm, earthy finishes.',
    'floral': 'Sculpted and painted blooms give it a fresh, garden-like feel.',
    'clay': 'Details are modelled in clay and painted by hand for a charming 3D look.',
    'acrylic': 'Clean acrylic detailing gives it a sleek, contemporary finish.',
    'modern': 'A clean, contemporary design that suits any entrance.',
    'resin': 'Finished in glossy resin for depth and shine.',
    'devotional': 'Carries an auspicious touch with devotional motifs and lettering.',
    'kids': "Playful colours and characters make it perfect for a kids' space.",
    'palette': 'Layered with a palette knife for rich, expressive texture.',
    'texture': 'Built up in raised texture that catches the light.',
    'abstract': 'Bold colour and flowing form that sparks conversation.',
    'traditional': 'Rooted in classic Indian folk and traditional art styles.',
    'devotionals': 'A calming, devotional piece for your home or prayer space.',
    'coaster': 'Hand-painted and sealed to protect your tabletop.',
    'tray': 'Hand-painted and sturdy, great for serving or display.',
    'clock': 'Keeps time while doubling as wall art.',
    'keyholder': 'Keeps keys organised by the door while adding colour.',
    'personalized-gifts': 'Can be personalised to make a memorable gift.',
    'tealight': 'Hand-painted base that glows beautifully with tealights.',
    'magnets': 'Hand-painted wooden magnet to brighten your fridge.',
    'lamps': 'Cut-work panels cast a warm, patterned glow.',
    'jewellery': 'Lightweight, hand-painted and one of a kind.',
}


def describe(cat, sub, key):
    h = int(hashlib.md5(key.encode()).hexdigest(), 16)
    d = OPEN[cat][h % len(OPEN[cat])].format(n=SINGULAR[sub].lower()) + ' ' + SUB_LINE[sub]
    if cat == 'nameplates':
        d += ' Handcrafted in Pune and fully customisable with your name, size and colours.'
    elif cat == 'paintings':
        d += ' Available as shown; custom sizes and commissions on request.'
    else:
        d += ' Customisation available on request.'
    return d


def proc(path):
    h = hashlib.md5(open(path, 'rb').read()).hexdigest()[:16]
    f = os.path.join(OUT, 'full', h + '.webp')
    t = os.path.join(OUT, 'thumb', h + '.webp')
    if not (os.path.exists(f) and os.path.exists(t)):
        try:
            im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
            a = im.copy(); a.thumbnail((1200, 1200)); a.save(f, 'WEBP', quality=72, method=6)
            b = im.copy(); b.thumbnail((520, 520)); b.save(t, 'WEBP', quality=70, method=6)
        except Exception as e:
            print('skip', path, e)
            return None
    return h


def main():
    os.makedirs(os.path.join(OUT, 'full'), exist_ok=True)
    os.makedirs(os.path.join(OUT, 'thumb'), exist_ok=True)
    old = {}
    if os.path.exists(DATA):
        for p in json.load(open(DATA, encoding='utf8')):
            old[p['id']] = p
    entries = []
    for g, cat in GROUPS.items():
        gp = os.path.join(SRC, g)
        if not os.path.isdir(gp):
            continue
        for sub in sorted(os.listdir(gp)):
            sp = os.path.join(gp, sub)
            if not os.path.isdir(sp) or sub not in SUB_LABEL:
                continue
            files = sorted(f for f in os.listdir(sp) if os.path.isfile(os.path.join(sp, f)))
            for i, f in enumerate(files):
                entries.append((cat, sub, None, [os.path.join(sp, f)], i + 1))
            for d in sorted(os.listdir(sp)):
                dp = os.path.join(sp, d)
                if os.path.isdir(dp):
                    entries.append((cat, sub, d, sorted(os.path.join(dp, f) for f in os.listdir(dp)), 0))
    allpaths = sorted({p for e in entries for p in e[3]})
    print('images to process:', len(allpaths))
    with ProcessPoolExecutor() as ex:
        hs = dict(zip(allpaths, ex.map(proc, allpaths, chunksize=8)))
    products = []
    for cat, sub, grp, paths, n in entries:
        imgs = []
        for p in paths:
            h = hs[p]
            if h and h not in imgs:
                imgs.append(h)
        if not imgs:
            continue
        if grp:
            slug, name = grp, titleize(grp)
        else:
            slug, name = f'{sub}-{n}-{imgs[0][:6]}', f'{SINGULAR[sub]} No. {n}'
        pid = f'{cat}-{sub}-{slug}'
        base = dict(id=pid, name=name, category=cat, subcategory=sub, subcategoryLabel=SUB_LABEL[sub],
                    description=describe(cat, sub, pid), images=imgs[:10], featured=False)
        if pid in old:
            for k in ('name', 'description', 'featured'):
                base[k] = old[pid].get(k, base[k])
        products.append(base)
    if not any(p['featured'] for p in products):
        for cat in ('nameplates', 'paintings', 'home-decor'):
            pool = sorted([p for p in products if p['category'] == cat and len(p['images']) >= 3], key=lambda p: -len(p['images']))
            for p in pool[:8]:
                p['featured'] = True
    json.dump(products, open(DATA, 'w', encoding='utf8'), indent=1, ensure_ascii=False)
    print('products:', len(products))


if __name__ == '__main__':
    main()
