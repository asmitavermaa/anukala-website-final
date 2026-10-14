"""Re-encodes the gallery photos smaller: full 1200px / quality 72, thumbnails 520px / quality 70."""
import os
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'client', 'public', 'images')


def shrink(p):
    full = (os.sep + 'full' + os.sep) in p
    im = Image.open(p).convert('RGB')
    m = 1200 if full else 520
    im.thumbnail((m, m))
    im.save(p, 'WEBP', quality=72 if full else 70, method=6)
    return os.path.getsize(p)


if __name__ == '__main__':
    files = [os.path.join(d, f) for d, _, fs in os.walk(IMG) for f in fs if f.endswith('.webp')]
    with ProcessPoolExecutor() as ex:
        sizes = list(ex.map(shrink, files, chunksize=16))
    print(len(files), 'files,', round(sum(sizes) / 1e6, 1), 'MB')
