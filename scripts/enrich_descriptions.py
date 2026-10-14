"""Expands each product's one-line summary into a fuller description.

Keeps the original one-liner in `summary` (card/SEO text) and writes the longer text to `description`.
Safe to re-run: it always rebuilds from `summary`. Edit server/data/products.json by hand afterwards if
you want to change any individual product (re-running this script will overwrite those edits, so run it first).
Run: python scripts/enrich_descriptions.py
"""
import json, os, hashlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'client', 'public', 'data', 'products.json')

CRAFT = {
    'nameplates': [
        "Every nameplate is designed, painted and finished by hand in our Pune studio, so the colours, lettering and small details are made around your family.",
        "It is built, painted and finished by hand, with the lettering and details placed carefully so the name stays easy to read from a distance.",
    ],
    'paintings': [
        "This is a hand-painted piece made in our Pune studio, with brushwork and colour you can see up close and feel from across the room.",
        "Each painting is created by hand, one at a time, so small differences in texture and brushwork make every piece unique.",
    ],
    'home-decor': [
        "It is made and finished by hand in our Pune studio, with the same attention we give to our nameplates and paintings.",
        "Each piece is hand-painted and hand-finished, so you get something personal rather than mass produced.",
    ],
}
SUB = {
    'ethnic': "The design draws on traditional Indian motifs and warm, earthy tones, and sits well with wooden doors and classic interiors.",
    'floral': "Soft, handcrafted flowers and leaves bring a fresh, garden-like feel to your entrance.",
    'clay': "Figures and details are modelled in clay first and then painted, which gives the piece a charming three-dimensional character.",
    'acrylic': "The clean acrylic finish gives it a crisp, contemporary look that works on modern doors and walls.",
    'modern': "Simple lines and a clean layout keep the focus on your name while suiting contemporary homes and offices.",
    'resin': "A glossy resin finish adds depth and shine, making the piece feel like a small work of art.",
    'devotional': "Auspicious symbols and lettering make it a meaningful welcome at the entrance of a home.",
    'kids': "Playful colours and characters make it a fun, personal sign for a child's room or a family entrance.",
    'palette': "Thick, layered strokes applied with a palette knife give the surface real depth that shifts with the light.",
    'texture': "The raised, sculpted surface catches the light and invites a closer look, adding texture to a plain wall.",
    'abstract': "Bold colour and flowing form make it a statement piece that starts conversations.",
    'traditional': "It carries the character of classic Indian folk and traditional art, adapted for today's homes.",
    'devotionals': "A calming, devotional artwork that suits a living room, a prayer corner or a quiet study.",
    'coaster': "Practical and pretty, it protects your tables while adding a pop of hand-painted colour.",
    'tray': "Sturdy enough for everyday use and attractive enough to display, it works for serving or as a table centrepiece.",
    'clock': "It keeps time while doubling as wall art, adding a handcrafted focal point to a living room, bedroom or cafe corner.",
    'keyholder': "Mounted near the door, it keeps keys organised and gives your entryway a splash of personality.",
    'personalized-gifts': "A thoughtful gift for weddings, anniversaries, housewarmings and birthdays, made to carry a personal message.",
    'tealight': "The hand-painted base glows beautifully when lit, making it ideal for Diwali, dinners and quiet evenings.",
    'magnets': "A small, cheerful detail for the fridge, a magnetic board or a gift for kids.",
    'lamps': "Cut-work panels cast a warm, patterned glow, perfect for evenings, festivals and cosy corners.",
    'mdf-cutouts': "A ready-to-paint base for art classes, DIY projects, festive decor or your own colour ideas.",
    'jewellery': "Light to wear and hand-painted in bold colour, it makes a statement with everyday outfits.",
}
# (keywords, sentence) - every rule that matches the product name adds a sentence (max 2)
KEYWORDS = [
    (('ganesh',), "Lord Ganesha is revered as the remover of obstacles, which is why he is a popular choice for a new home, a doorway or a prayer corner."),
    (('buddha',), "The Buddha's calm, meditative expression brings a feeling of peace to living rooms, studies and meditation spaces."),
    (('radha krishna', 'krishna'), "Radha and Krishna symbolise divine love, making this a graceful choice for living rooms and bedrooms."),
    (('shiva',), "Shiva's serene presence suits a prayer room or a quiet corner of the living room."),
    (('saraswati',), "Goddess Saraswati is the patron of art, music and learning, which makes this a lovely piece for a study or a child's room."),
    (('madhubani',), "Madhubani art comes from the Mithila region of Bihar and is known for its intricate patterns, bold outlines and nature-inspired motifs."),
    (('warli',), "Warli art comes from Maharashtra and uses simple geometric figures to tell stories of village life and celebration."),
    (('pattachitra',), "Pattachitra is a traditional painting style from Odisha, known for fine line work and mythological themes."),
    (('kathakali',), "Kathakali is the classical dance-drama of Kerala, famous for its dramatic, colourful face makeup."),
    (('lippan',), "Lippan is a traditional mud-and-mirror craft from Kutch, reimagined here as a sculpted wall piece."),
    (('mandala',), "Mandalas are circular designs that symbolise harmony and focus, and every line here is drawn by hand."),
    (('lotus',), "The lotus stands for purity and new beginnings in Indian art."),
    (('elephant',), "Elephants are a symbol of strength, wisdom and good fortune."),
    (('peacock',), "The peacock symbolises grace and beauty in Indian art."),
    (('swan',), "Swans are a symbol of grace and discernment."),
    (('marathi', 'devanagari'), "The lettering is in Devanagari, and we can customise it in Marathi, Hindi or English."),
    (('resin',), "Resin is poured and cured by hand, so the flow of colour is unique to each piece."),
    (('clay',), "Because the clay details are modelled by hand, no two pieces are ever exactly alike."),
    (('bird', 'owl', 'parrot'), "The birds add colour and movement, and bring a cheerful, welcoming feel."),
    (('house', 'home'), "The little house motif adds a sense of warmth and belonging."),
    (('family',), "It can be made to reflect your own family, from the number of members to pets and favourite colours."),
]
PLACE = {
    'nameplates': "Ready to mount on a door or wall, and can be made in different sizes. Wipe gently with a dry or slightly damp cloth.",
    'paintings': "Suitable for living rooms, bedrooms, offices and entryways. Keep away from direct sunlight and damp to protect the colours.",
    'home-decor': "Wipe clean with a soft, dry or slightly damp cloth, and keep away from prolonged moisture.",
}
CUSTOM = {
    'nameplates': "Customisation is available: share your name, flat or house number, preferred colours and size, and we will tailor it for you.",
    'paintings': "Custom sizes, colour changes and commissions are available on request, so you can match the piece to your wall.",
    'home-decor': "Customisation is available on request, including colours, names and messages. Contact us to discuss your idea.",
}
SPECIAL_PLACE = {
    'tealight': "Use with standard tealights and never leave a burning candle unattended.",
    'lamps': "Use with a flameless LED tealight or a small LED light for a safe, warm glow.",
    'mdf-cutouts': "Supplied unpainted; prime and seal after painting to protect the finish.",
    'magnets': "Sticks to any magnetic surface such as a fridge, whiteboard or metal cabinet.",
    'keyholder': "Mount on a sturdy wall near the entrance at a convenient height.",
    'jewellery': "Hand-painted and sealed; avoid contact with water and perfume to keep the colours bright.",
}
SPECIAL_CUSTOM = {
    'mdf-cutouts': "Different shapes and sizes can be made to order. Contact us with what you have in mind.",
    'personalized-gifts': "Share the names, date and message you would like and we will make it uniquely yours.",
}


def pick(seq, key):
    return seq[int(hashlib.md5(key.encode()).hexdigest(), 16) % len(seq)]


def build(p):
    cat, sub, name = p['category'], p['subcategory'], p['name']
    lower = name.lower()
    parts = [p['summary'], pick(CRAFT[cat], p['id']), SUB[sub]]
    extra = []
    for keys, sentence in KEYWORDS:
        if any(k in lower for k in keys):
            extra.append(sentence)
        if len(extra) == 2:
            break
    if extra:
        parts.append(' '.join(extra))
    parts.append(SPECIAL_PLACE.get(sub, PLACE[cat]))
    parts.append(SPECIAL_CUSTOM.get(sub, CUSTOM[cat]))
    # paragraphs: description / craft+style / story / care / customisation
    paras = [parts[0], ' '.join(parts[1:3])]
    if extra:
        paras.append(parts[3])
    paras.append(' '.join(parts[-2:]))
    return '\n\n'.join(paras)


def main():
    data = json.load(open(DATA, encoding='utf8'))
    for p in data:
        p.setdefault('summary', p['description'])
        p['description'] = build(p)
    json.dump(data, open(DATA, 'w', encoding='utf8'), indent=1, ensure_ascii=False)
    print('enriched', len(data))


if __name__ == '__main__':
    main()
