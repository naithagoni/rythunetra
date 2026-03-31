#!/usr/bin/env python3
"""
Generate 002_seed.sql from telangana_ap_real_agri_dataset.json
matching the new JSONB schema in 001_schema.sql.

Tables:
  soil_types       → name JSONB, characteristics JSONB, ph_range, organic_matter, water_retention, districts
  crops            → name JSONB, crop_type JSONB, image_url, aliases JSONB
  diseases         → name JSONB, type JSONB, severity, image_urls, symptoms JSONB, primary_cause JSONB,
                     favorable_conditions JSONB, preventions JSONB, treatments JSONB, aliases JSONB
  remedies         → name JSONB, type JSONB, how_it_works JSONB, usage_instructions JSONB,
                     preparation_instructions JSONB, ingredients JSONB, effectiveness, aliases JSONB
  soil_type_crops  → junction
  crop_diseases    → junction
  disease_remedies → junction
"""
import json
import uuid
import re
import sys
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
INPUT = os.path.join(DATA_DIR, 'telangana_ap_real_agri_dataset.json')
MIGRATIONS_DIR = os.path.join(os.path.dirname(__file__), '..', 'supabase', 'migrations')

# Also pull richer soil data from verified dataset
VERIFIED = os.path.join(DATA_DIR, 'telangana_ap_verified_dataset_2026.json')

# Diseases per chunk (625 total → ~63 per file ≈ ~80KB each)
DISEASE_CHUNK_SIZE = 63


def esc(s: str) -> str:
    """Escape single quotes for SQL."""
    if s is None:
        return ''
    return s.replace("'", "''")


def json_lit(obj) -> str:
    """Return a SQL literal for a JSONB value."""
    return "'" + esc(json.dumps(obj, ensure_ascii=False)) + "'"


def lt(en: str, te: str) -> dict:
    """LocalizedText helper."""
    return {"en": en or "", "te": te or ""}


def lta(en_list: list, te_list: list) -> dict:
    """LocalizedTextArray helper."""
    return {"en": en_list or [], "te": te_list or []}


def lt_array(pairs: list[tuple[str, str]]) -> list[dict]:
    """List of LocalizedText from list of (en, te) tuples."""
    return [{"en": en, "te": te} for en, te in pairs]


# ── Soil type enrichment from verified dataset ────────────────────
def load_verified_soil_data():
    """Load richer soil data: ph_range, organic_matter, water_retention, regions."""
    try:
        with open(VERIFIED, 'r') as f:
            vd = json.load(f)
        lookup = {}
        for s in vd.get('soil_types', []):
            name_lower = s['name_en'].lower()
            ph = s.get('ph_range', '')
            om = s.get('organic_matter', '')
            wr = s.get('water_retention', '')
            regions = s.get('regions', [])
            # Parse ph_range like "6.5-7.5"
            ph_arr = None
            if ph:
                m = re.findall(r'[\d.]+', ph)
                if len(m) >= 2:
                    ph_arr = [float(m[0]), float(m[1])]
            # Parse organic_matter like "Low (0.3-0.5%)"
            om_arr = None
            if om:
                m = re.findall(r'[\d.]+', om)
                if len(m) >= 2:
                    om_arr = [float(m[0]), float(m[1])]
            lookup[name_lower] = {
                'ph_range': ph_arr,
                'organic_matter': om_arr,
                'water_retention': wr,
                'regions': regions,
            }
        return lookup
    except Exception:
        return {}


# ── Crop type classification ────────────────────
CROP_TYPES = {
    'paddy': lt('Cereal', 'ధాన్యం'),
    'maize': lt('Cereal', 'ధాన్యం'),
    'sorghum': lt('Cereal (Millet)', 'చిరు ధాన్యం'),
    'pearl-millet': lt('Cereal (Millet)', 'చిరు ధాన్యం'),
    'finger-millet': lt('Cereal (Millet)', 'చిరు ధాన్యం'),
    'cotton': lt('Fibre Crop', 'నార పంట'),
    'groundnut': lt('Oilseed', 'నూనెగింజ'),
    'sunflower': lt('Oilseed', 'నూనెగింజ'),
    'sesame': lt('Oilseed', 'నూనెగింజ'),
    'castor': lt('Oilseed', 'నూనెగింజ'),
    'chilli': lt('Spice / Vegetable', 'మసాల / కూరగాయ'),
    'turmeric': lt('Spice', 'మసాల'),
    'onion': lt('Vegetable', 'కూరగాయ'),
    'tomato': lt('Vegetable', 'కూరగాయ'),
    'brinjal': lt('Vegetable', 'కూరగాయ'),
    'okra': lt('Vegetable', 'కూరగాయ'),
    'red-gram': lt('Pulse', 'పప్పు దినుసు'),
    'bengal-gram': lt('Pulse', 'పప్పు దినుసు'),
    'green-gram': lt('Pulse', 'పప్పు దినుసు'),
    'black-gram': lt('Pulse', 'పప్పు దినుసు'),
    'sugarcane': lt('Sugar Crop', 'చక్కెర పంట'),
    'banana': lt('Fruit', 'పండ్లు'),
    'mango': lt('Fruit', 'పండ్లు'),
    'papaya': lt('Fruit', 'పండ్లు'),
    'citrus': lt('Fruit', 'పండ్లు'),
}

# ── Remedy type classification ────────────────────
REMEDY_TYPES = {
    'trichoderma-seed-treatment': lt('Biological', 'జీవ నియంత్రణ'),
    'pseudomonas-foliar-spray': lt('Biological', 'జీవ నియంత్రణ'),
    'beauveria-biocontrol-spray': lt('Biological', 'జీవ నియంత్రణ'),
    'bacillus-subtilis-foliar': lt('Biological', 'జీవ నియంత్రణ'),
    'trichoderma-soil-application': lt('Biological', 'జీవ నియంత్రణ'),
    'neem-oil-emulsion': lt('Botanical', 'వృక్ష ఆధారిత'),
    'neem-seed-kernel-extract': lt('Botanical', 'వృక్ష ఆధారిత'),
    'garlic-chilli-botanical-extract': lt('Botanical', 'వృక్ష ఆధారిత'),
    'ginger-garlic-fermented-spray': lt('Botanical', 'వృక్ష ఆధారిత'),
    'bordo-mix-fungicidal-spray': lt('Chemical (Copper-based)', 'రసాయన (రాగి ఆధారిత)'),
    'cow-dung-urine-fermented-extract': lt('Traditional / Organic', 'సాంప్రదాయ / సేంద్రీయ'),
    'baking-soda-leaf-protectant': lt('Home Remedy', 'ఇంటి చిట్కా'),
    'whey-sour-milk-spray': lt('Home Remedy', 'ఇంటి చిట్కా'),
    'soil-solarization-bed-treatment': lt('Cultural Practice', 'సస్యరక్షణ పద్ధతి'),
}

# Soil type code → crop name mapping (which crops grow in which soil)
SOIL_CROP_MAP = {
    'red-soil': ['Paddy', 'Cotton', 'Maize', 'Groundnut', 'Red Gram', 'Sorghum', 'Castor', 'Sesame'],
    'black-soil': ['Cotton', 'Paddy', 'Chilli', 'Sunflower', 'Bengal Gram', 'Sugarcane', 'Turmeric', 'Sorghum'],
    'sandy-soil': ['Groundnut', 'Pearl Millet', 'Finger Millet', 'Sesame', 'Onion', 'Castor'],
    'alluvial-soil': ['Paddy', 'Sugarcane', 'Banana', 'Maize', 'Tomato', 'Okra', 'Brinjal', 'Papaya'],
    'laterite-soil': ['Mango', 'Citrus', 'Cashew', 'Black Gram', 'Green Gram', 'Red Gram'],
}


def write_file(filename: str, lines: list[str], label: str):
    """Write a migration file and print stats."""
    path = os.path.join(MIGRATIONS_DIR, filename)
    sql = "\n".join(lines)
    with open(path, 'w') as f:
        f.write(sql)
    size_kb = len(sql.encode('utf-8')) / 1024
    print(f"  {filename}: {len(lines)} lines, {size_kb:.0f} KB — {label}")


def main():
    with open(INPUT, 'r') as f:
        data = json.load(f)

    verified_soil = load_verified_soil_data()

    soil_types = data['soil_types']
    crops = data['crops']
    remedies = data['remedies']
    diseases = data['diseases']

    # Generate stable UUIDs: code/slug → UUID
    soil_ids = {s['code']: str(uuid.uuid5(uuid.NAMESPACE_DNS, f"soil.{s['code']}")) for s in soil_types}
    crop_ids = {c['slug']: str(uuid.uuid5(uuid.NAMESPACE_DNS, f"crop.{c['slug']}")) for c in crops}
    remedy_ids = {r['slug']: str(uuid.uuid5(uuid.NAMESPACE_DNS, f"remedy.{r['slug']}")) for r in remedies}
    disease_ids = {d['slug']: str(uuid.uuid5(uuid.NAMESPACE_DNS, f"disease.{d['slug']}")) for d in diseases}

    # Build crop name → slug lookup
    crop_name_to_slug = {}
    for c in crops:
        en_name = c['translations']['en']['name']
        crop_name_to_slug[en_name] = c['slug']

    # Remove old monolithic seed file if present
    old_seed = os.path.join(MIGRATIONS_DIR, '002_seed.sql')
    if os.path.exists(old_seed):
        os.remove(old_seed)
        print(f"  Removed old {old_seed}")

    # ──────────────────────────────────────────────────
    # FILE 1: 002_seed_soil_crops_remedies.sql
    # ──────────────────────────────────────────────────
    lines = []
    lines.append("-- 002: Soil types, Crops, Remedies")
    lines.append("BEGIN;")
    lines.append("")

    # SOIL TYPES
    lines.append("-- ═══ SOIL TYPES ═══")
    lines.append("")
    for s in soil_types:
        sid = soil_ids[s['code']]
        name = lt(s['name_en'], s['name_te'])
        desc_en = s.get('description_en', '')
        desc_te = s.get('description_te', '')
        characteristics = lt(desc_en, desc_te) if desc_en else None
        regions = s.get('regions', [])

        v = None
        for vkey in verified_soil:
            if s['name_en'].lower().split()[0] in vkey:
                v = verified_soil[vkey]
                break

        ph_range = v['ph_range'] if v and v.get('ph_range') else None
        organic_matter = v['organic_matter'] if v and v.get('organic_matter') else None
        water_retention = v['water_retention'] if v and v.get('water_retention') else s.get('water_retention')

        ph_sql = f"ARRAY[{ph_range[0]}, {ph_range[1]}]" if ph_range else 'NULL'
        om_sql = f"ARRAY[{organic_matter[0]}, {organic_matter[1]}]" if organic_matter else 'NULL'
        wr_sql = f"'{esc(water_retention)}'" if water_retention else 'NULL'
        districts_sql = "ARRAY[" + ", ".join(f"'{esc(r)}'" for r in regions) + "]" if regions else "ARRAY[]::TEXT[]"
        char_sql = json_lit(characteristics) if characteristics else 'NULL'

        lines.append(f"INSERT INTO soil_types (id, name, ph_range, organic_matter, water_retention, districts, characteristics)")
        lines.append(f"VALUES ('{sid}', {json_lit(name)}, {ph_sql}, {om_sql}, {wr_sql}, {districts_sql}, {char_sql});")
        lines.append("")

    # CROPS
    lines.append("-- ═══ CROPS ═══")
    lines.append("")
    for c in crops:
        cid = crop_ids[c['slug']]
        en = c['translations']['en']
        te = c['translations']['te']
        name = lt(en['name'], te['name'])
        crop_type = CROP_TYPES.get(c['slug'])
        ct_sql = json_lit(crop_type) if crop_type else 'NULL'

        lines.append(f"INSERT INTO crops (id, name, crop_type)")
        lines.append(f"VALUES ('{cid}', {json_lit(name)}, {ct_sql});")
        lines.append("")

    # REMEDIES
    lines.append("-- ═══ REMEDIES ═══")
    lines.append("")
    for r in remedies:
        rid = remedy_ids[r['slug']]
        en = r['translations']['en']
        te = r['translations']['te']
        name = lt(en['name'], te['name'])

        rtype = REMEDY_TYPES.get(r['slug'])
        type_sql = json_lit(rtype) if rtype else 'NULL'

        how_en = en.get('mode_of_action', '')
        how_te = te.get('mode_of_action', '')
        how_sql = json_lit(lt(how_en, how_te)) if how_en or how_te else 'NULL'

        prep_en = en.get('preparation_steps', [])
        prep_te = te.get('preparation_steps', [])
        prep_items = []
        for i in range(max(len(prep_en), len(prep_te))):
            e = prep_en[i] if i < len(prep_en) else ''
            t = prep_te[i] if i < len(prep_te) else ''
            prep_items.append(lt(e, t))
        prep_sql = json_lit(prep_items) if prep_items else "'[]'"

        usage_en = en.get('application_method', '')
        usage_te = te.get('application_method', '')
        usage_items = [lt(usage_en, usage_te)] if usage_en or usage_te else []
        tu_en = en.get('target_usage', '')
        tu_te = te.get('target_usage', '')
        if tu_en or tu_te:
            usage_items.append(lt(tu_en, tu_te))
        usage_sql = json_lit(usage_items) if usage_items else "'[]'"

        ben_en = en.get('benefits', [])
        ben_te = te.get('benefits', [])
        ing_items = []
        for i in range(max(len(ben_en), len(ben_te))):
            e = ben_en[i] if i < len(ben_en) else ''
            t = ben_te[i] if i < len(ben_te) else ''
            ing_items.append(lt(e, t))
        ing_sql = json_lit(ing_items) if ing_items else "'[]'"

        effectiveness = 'Moderate'

        lines.append(f"INSERT INTO remedies (id, name, type, how_it_works, preparation_instructions, usage_instructions, ingredients, effectiveness)")
        lines.append(f"VALUES ('{rid}', {json_lit(name)}, {type_sql}, {how_sql}, {prep_sql}, {usage_sql}, {ing_sql}, '{effectiveness}');")
        lines.append("")

    lines.append("COMMIT;")
    lines.append("")
    write_file('002_seed_soil_crops_remedies.sql', lines, f'{len(soil_types)} soils, {len(crops)} crops, {len(remedies)} remedies')

    # ──────────────────────────────────────────────────
    # FILES 003-00N: Disease chunks
    # ──────────────────────────────────────────────────
    disease_file_num = 3
    for chunk_start in range(0, len(diseases), DISEASE_CHUNK_SIZE):
        chunk = diseases[chunk_start:chunk_start + DISEASE_CHUNK_SIZE]
        chunk_end = min(chunk_start + DISEASE_CHUNK_SIZE, len(diseases))
        fname = f'{disease_file_num:03d}_seed_diseases_{chunk_start + 1}_to_{chunk_end}.sql'

        lines = []
        lines.append(f"-- Diseases {chunk_start + 1}–{chunk_end} of {len(diseases)}")
        lines.append("BEGIN;")
        lines.append("")

        for d in chunk:
            did = disease_ids[d['slug']]
            en = d['translations']['en']
            te = d['translations']['te']
            name = lt(en.get('title', ''), te.get('title', ''))

            disease_type = infer_disease_type(en.get('title', ''), en.get('description', ''))
            type_sql = json_lit(disease_type)
            severity = 'moderate'

            symp_en = en.get('symptoms', '')
            symp_te = te.get('symptoms', '')
            symp_items = []
            if symp_en:
                parts_en = [s.strip() for s in re.split(r'[,;]', symp_en) if s.strip()]
                parts_te = [s.strip() for s in re.split(r'[,;]', symp_te) if s.strip()] if symp_te else []
                for i in range(max(len(parts_en), len(parts_te))):
                    e = parts_en[i] if i < len(parts_en) else ''
                    t = parts_te[i] if i < len(parts_te) else ''
                    symp_items.append(lt(e, t))
            symp_sql = json_lit(symp_items) if symp_items else "'[]'"

            desc_en = en.get('description', '')
            desc_te = te.get('description', '')
            cause_sql = json_lit(lt(desc_en, desc_te)) if desc_en else 'NULL'

            org_en = en.get('organic_solutions', '')
            org_te = te.get('organic_solutions', '')
            prev_items = []
            if org_en:
                parts_en = [s.strip() for s in re.split(r'[,;]', org_en) if s.strip() and len(s.strip()) > 5]
                parts_te = [s.strip() for s in re.split(r'[,;]', org_te) if s.strip() and len(s.strip()) > 5] if org_te else []
                for i in range(max(len(parts_en), len(parts_te))):
                    e = parts_en[i] if i < len(parts_en) else ''
                    t = parts_te[i] if i < len(parts_te) else ''
                    prev_items.append(lt(e, t))
            prev_sql = json_lit(prev_items) if prev_items else "'[]'"

            aliases_en = en.get('aliases', [])
            aliases_te = te.get('aliases', [])
            aliases = lta(aliases_en, aliases_te) if aliases_en or aliases_te else None
            aliases_sql = json_lit(aliases) if aliases else "'{\"en\":[],\"te\":[]}'"

            lines.append(f"INSERT INTO diseases (id, name, type, severity, symptoms, primary_cause, preventions, treatments, aliases)")
            lines.append(f"VALUES ('{did}', {json_lit(name)}, {type_sql}, '{severity}', {symp_sql}, {cause_sql}, {prev_sql}, '[]', {aliases_sql});")
            lines.append("")

        lines.append("COMMIT;")
        lines.append("")
        write_file(fname, lines, f'{len(chunk)} diseases')
        disease_file_num += 1

    # ──────────────────────────────────────────────────
    # JUNCTION FILE: soil_type_crops + crop_diseases
    # Split crop_diseases into chunks to stay under 100KB
    # ──────────────────────────────────────────────────
    junc_file_num = disease_file_num

    # Collect all crop_disease pairs first
    crop_disease_pairs = []
    seen_cd = set()
    for d in diseases:
        did = disease_ids[d['slug']]
        for cn in d.get('affected_crops', []):
            slug = crop_name_to_slug.get(cn)
            if slug and slug in crop_ids:
                pair = (crop_ids[slug], did)
                if pair not in seen_cd:
                    seen_cd.add(pair)
                    crop_disease_pairs.append(pair)

    lines = []
    lines.append("-- Junction tables: soil_type_crops, crop_diseases")
    lines.append("BEGIN;")
    lines.append("")

    lines.append("-- ═══ soil_type_crops ═══")
    lines.append("")
    stc_count = 0
    for soil_code, crop_names in SOIL_CROP_MAP.items():
        if soil_code not in soil_ids:
            continue
        sid = soil_ids[soil_code]
        for cn in crop_names:
            slug = crop_name_to_slug.get(cn)
            if slug and slug in crop_ids:
                cid = crop_ids[slug]
                lines.append(f"INSERT INTO soil_type_crops (soil_type_id, crop_id) VALUES ('{sid}', '{cid}');")
                stc_count += 1
    lines.append("")

    lines.append("-- ═══ crop_diseases ═══")
    lines.append("")
    for pair in crop_disease_pairs:
        lines.append(f"INSERT INTO crop_diseases (crop_id, disease_id) VALUES ('{pair[0]}', '{pair[1]}');")
    lines.append("")

    lines.append("COMMIT;")
    lines.append("")
    write_file(f'{junc_file_num:03d}_seed_junctions_soil_crop.sql', lines,
               f'{stc_count} soil_type_crops, {len(crop_disease_pairs)} crop_diseases')

    # ──────────────────────────────────────────────────
    # JUNCTION FILES: disease_remedies (split into 2 halves)
    # ──────────────────────────────────────────────────
    dr_pairs = []
    seen_dr = set()
    for d in diseases:
        did = disease_ids[d['slug']]
        for rem in d.get('remedies', []):
            rslug = rem.get('remedy_slug', '')
            if rslug in remedy_ids:
                pair = (did, remedy_ids[rslug])
                if pair not in seen_dr:
                    seen_dr.add(pair)
                    dr_pairs.append(pair)

    mid = len(dr_pairs) // 2
    for part_idx, chunk in enumerate([dr_pairs[:mid], dr_pairs[mid:]]):
        junc_file_num += 1
        lines = []
        lines.append(f"-- Junction table: disease_remedies (part {part_idx + 1}/2)")
        lines.append("BEGIN;")
        lines.append("")
        for pair in chunk:
            lines.append(f"INSERT INTO disease_remedies (disease_id, remedy_id) VALUES ('{pair[0]}', '{pair[1]}');")
        lines.append("")
        lines.append("COMMIT;")
        lines.append("")
        write_file(f'{junc_file_num:03d}_seed_disease_remedies_part{part_idx + 1}.sql', lines,
                   f'{len(chunk)} disease_remedies')

    print(f"\nDone! Generated {junc_file_num - 1} seed files in {MIGRATIONS_DIR}/")
    print(f"  Total: {len(soil_types)} soils, {len(crops)} crops, {len(remedies)} remedies, {len(diseases)} diseases")
    print(f"  Junctions: {stc_count} soil_type_crops, {len(crop_disease_pairs)} crop_diseases, {len(dr_pairs)} disease_remedies")


def infer_disease_type(title: str, description: str) -> dict:
    """Infer disease type (Fungal / Bacterial / Viral / Pest / Nutritional) from text."""
    text = (title + ' ' + description).lower()
    if any(w in text for w in ['fung', 'mildew', 'blight', 'rust', 'rot', 'wilt', 'scab', 'smut', 'anthracnose', 'blast', 'damping', 'leaf spot', 'dieback', 'cercospora', 'alternaria', 'fusarium', 'phytophthora', 'pythium', 'botrytis']):
        return lt('Fungal', 'శిలీంధ్ర వ్యాధి')
    if any(w in text for w in ['bacteri', 'xanthomonas', 'erwinia', 'pseudomonas disease', 'bacterial']):
        return lt('Bacterial', 'బాక్టీరియా వ్యాధి')
    if any(w in text for w in ['virus', 'viral', 'mosaic', 'leaf curl', 'yellow vein', 'enation', 'streak', 'stunt', 'tungro']):
        return lt('Viral', 'వైరస్ వ్యాధి')
    if any(w in text for w in ['nematode', 'root knot', 'cyst nematode']):
        return lt('Nematode', 'సూత్ర కృమి')
    if any(w in text for w in ['borer', 'aphid', 'whitefly', 'thrip', 'mite', 'caterpillar', 'weevil', 'beetle', 'fly', 'leafhopper', 'hopper', 'jassid', 'bollworm', 'armyworm', 'earworm', 'pod borer', 'stem borer', 'shoot borer', 'fruit borer', 'mealy', 'scale insect', 'pest', 'insect']):
        return lt('Pest', 'కీటక')
    if any(w in text for w in ['deficien', 'nutrient', 'yellowing due to lack']):
        return lt('Nutritional Disorder', 'పోషక లోపం')
    return lt('Disease', 'వ్యాధి')


if __name__ == '__main__':
    main()
