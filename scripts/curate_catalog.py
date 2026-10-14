"""Curates client/public/data/products.json: removes discontinued items and merges near-identical products.

- MDF cutouts are no longer sold: the whole subcategory and its products are removed.
- Tealight holders, fridge magnets and earrings had many photos of the same few designs listed as separate
  products. Each group below becomes ONE product whose gallery holds all the photos.
Safe to re-run. After running it, run `python scripts/enrich_descriptions.py` to rewrite the descriptions,
then `python scripts/prune_images.py` to delete photos no product uses any more.
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'client', 'public', 'data')

REMOVE_SUBS = {'mdf-cutouts'}
REMOVE_NAMES = {('magnets', 'Wooden Cutout Magnet Set'), ('magnets', 'Astronaut Wooden Cutouts')}

# (subcategory, new name, new summary, [names to merge, first one is the lead photo])
MERGES = [
    ('tealight', 'Fish Tealight Holders', 'Round yin-yang tealight holders hand-painted with Madhubani-style fish, in orange and in blue and red.',
     ['Orange Fish Tealight Holder', 'Blue Red Fish Tealight Holder', 'Fish Yin-Yang Tealight Holder Pair']),
    ('tealight', 'Lotus Tealight Holders', 'Yellow and green tealight holders painted with pink lotus flowers, glowing beautifully at Diwali.',
     ['Yellow Green Lotus Tealight Holder', 'Diwali Lotus Tealight Holders']),
    ('tealight', 'Rose Tealight Holders', 'Tealight holders finished with little hand-made roses, in peach-orange and in green.',
     ['Orange Rose Tealight Holders', 'Green Rose Tealight Holder']),
    ('tealight', 'Flower-Shaped Tealight Holders', 'Flower-shaped tealight holders in orange and blue, edged with tiny dots.',
     ['Flower-Shaped Tealight Holders']),
    ('tealight', 'Warli and Peacock Tealight Holders', 'Round tealight holders painted with Warli-style patterns and a Madhubani-style peacock.',
     ['Warli Blue Red Tealight Holders', 'Peacock Tealight Holder']),
    ('tealight', 'Four-Tealight Wooden Tray', 'A dark wooden holder for four tealights, decorated with tiny pebble-like details.',
     ['Four Tealight Wooden Tray']),
    ('tealight', 'Tealight Holder Collection', 'A mixed set of hand-painted round tealight holders in orange, blue, green and yellow.',
     ['Tealight Holder Collection']),
    ('magnets', 'Kids Fridge Magnet Set', 'A set of hand-painted wooden magnets: dinosaurs, a panda, unicorns, a fish, giraffes, an octopus and more.',
     ['Kids Fridge Magnet Set', 'Fish Fridge Magnet', 'Flower Pot Fridge Magnet', 'Octopus Giraffe Fish Magnets', 'Purple Octopus Fridge Magnet',
      'Giraffe Fridge Magnet', 'Superman Fridge Magnet', 'Panda Giraffe Magnets', 'Superman Magnets']),
    ('magnets', 'Dinosaur Fridge Magnets', 'Wooden dinosaur cutouts, hand-painted in green and orange.', ['Dinosaur Fridge Magnets']),
    ('magnets', 'Unicorn and Octopus Magnets', 'Sparkly rainbow unicorn and a teal octopus, hand-painted fridge magnets.', ['Unicorn and Octopus Magnets']),
    ('jewellery', 'Bride Glasses Earrings', 'Round hand-painted earrings with a red-veiled bride wearing quirky glasses.',
     ['Bride Glasses Earrings', 'Round Face Earrings']),
    ('jewellery', 'Split Face Earrings', 'Round earrings painted with a bold half-green, half-red face and golden details.', ['Split Face Earrings']),
]


def main():
    path = os.path.join(DATA, 'products.json')
    data = json.load(open(path, encoding='utf8'))
    before = len(data)
    data = [p for p in data if p['subcategory'] not in REMOVE_SUBS and (p['subcategory'], p['name']) not in REMOVE_NAMES]

    for sub, new_name, summary, names in MERGES:
        group = []
        for n in names:
            group += [p for p in data if p['subcategory'] == sub and p['name'] == n]
        if not group:
            continue
        lead = group[0]
        imgs = []
        for p in group:
            for h in p['images']:
                if h not in imgs:
                    imgs.append(h)
        lead.update(name=new_name, summary=summary, images=imgs[:10], featured=any(p.get('featured') for p in group))
        drop = {id(p) for p in group[1:]}
        data = [p for p in data if id(p) not in drop]

    json.dump(data, open(path, 'w', encoding='utf8'), indent=1, ensure_ascii=False)

    cpath = os.path.join(DATA, 'categories.json')
    cats = json.load(open(cpath, encoding='utf8'))
    for c in cats:
        c['subcategories'] = [s for s in c['subcategories'] if s not in REMOVE_SUBS]
    json.dump(cats, open(cpath, 'w', encoding='utf8'), indent=2, ensure_ascii=False)
    print(f'products: {before} -> {len(data)}')


if __name__ == '__main__':
    main()
