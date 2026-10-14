# Anukala website

Static React site (no backend). Handcrafted nameplates, paintings and home decor, with Contact Us / Commission pages that
link to WhatsApp, Instagram, Facebook and email.

## Run it on your computer

```bash
cd client
npm install        # once
npm run dev        # http://localhost:5173
```

Production build (what gets hosted):

```bash
cd client
npm run build      # writes client/dist  (plus 404.html and .nojekyll for GitHub Pages)
npm run preview    # test the built site at http://localhost:4173
```

## Where things live

| What | Where |
|---|---|
| Products (name, description, photos, featured flag) | `client/public/data/products.json` |
| Contact details, socials, announcement bar, founders | `client/public/data/site.json` |
| Category names, order, blurbs | `client/public/data/categories.json` |
| Instagram reels on the home page | `client/public/data/reels.json` |
| Facebook reviews (section hides while empty) | `client/public/data/reviews.json` |
| Product photos (WebP) | `client/public/images/full` and `thumb` |
| Hero slideshow photos | `client/public/hero` |
| Reel videos | `client/public/reels` |
| Custom domain | `client/public/CNAME` (`anukala.com`) |
| Automatic deploy to GitHub Pages | `.github/workflows/deploy.yml` |

Edit any `.json` file, commit and push, and the site updates itself.

### Reviews
`client/public/data/reviews.json`:
```json
[{ "name": "Reviewer Name", "rating": 5, "date": "March 2025", "text": "Review text copied from Facebook" }]
```

### Reels
Download the reel as an MP4, put it in `client/public/reels/` and add it to `reels.json`:
```json
{ "url": "https://www.instagram.com/reel/XXXXXXXXXXX/", "video": "reels/XXXXXXXXXXX.mp4", "poster": "reels/XXXXXXXXXXX.jpg" }
```

## Catalogue scripts (optional, need Python and Pillow)
Run from the repo folder. They read the sorted photos in `../organized_pictures`.

```bash
python scripts/build_catalog.py        # photos -> WebP + products.json (keeps your edits)
python scripts/curate_catalog.py       # removes discontinued items, merges duplicate designs
python scripts/enrich_descriptions.py  # rewrites the long descriptions (overwrites hand edits)
python scripts/prune_images.py         # deletes photos no product uses
```

## Notes
- `server/` is an optional Express API from the earlier version. The live site does not use it. It is there in case you
  want a backend and database later.
