"""Deletes photos in client/public/images that no product uses any more (keeps the site small)."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'client', 'public', 'images')
used = {h for p in json.load(open(os.path.join(ROOT, 'client', 'public', 'data', 'products.json'), encoding='utf8')) for h in p['images']}
removed = kept = 0
for size in ('full', 'thumb'):
    d = os.path.join(IMG, size)
    for f in os.listdir(d):
        if os.path.splitext(f)[0] in used:
            kept += 1
        else:
            os.remove(os.path.join(d, f))
            removed += 1
print(f'kept {kept} files, removed {removed}')
