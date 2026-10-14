"""Converts the site's JPG photos to WebP (about half the size) and deletes the JPGs. Safe to re-run."""
import os
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'client', 'public')
QUALITY = {'full': 80, 'thumb': 76, 'hero': 80, 'other': 82}


def conv(path):
    kind = 'full' if os.sep + 'full' + os.sep in path else 'thumb' if os.sep + 'thumb' + os.sep in path else 'hero' if os.sep + 'hero' + os.sep in path else 'other'
    out = os.path.splitext(path)[0] + '.webp'
    im = Image.open(path).convert('RGB')
    im.save(out, 'WEBP', quality=QUALITY[kind], method=5)
    os.remove(path)
    return os.path.getsize(out)


def main():
    files = []
    for sub in ('images', 'hero'):
        for d, _, fs in os.walk(os.path.join(PUB, sub)):
            files += [os.path.join(d, f) for f in fs if f.lower().endswith(('.jpg', '.jpeg'))]
    files.append(os.path.join(PUB, 'founders.jpg')) if os.path.exists(os.path.join(PUB, 'founders.jpg')) else None
    with ProcessPoolExecutor() as ex:
        sizes = list(ex.map(conv, files, chunksize=16))
    print(f'converted {len(files)} files, now {sum(sizes) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
