const fs = require('fs')
const path = require('path')

// 1. Read official JSON
const officialJson = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '..', 'data', 'list-of-mandals.json'),
        'utf8',
    ),
)

// 2. Parse mandals.ts to extract existing mandal data
const tsContent = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'config', 'mandals.ts'),
    'utf8',
)

// Extract district blocks: key: [ ... ]
// We'll parse the TS object by finding each district key and its mandals
function parseMandalsTs(content) {
    const districts = {}
    // Match district key and its array of mandals
    // Pattern: districtKey: [
    const districtRegex = /^\s{4}(\w+):\s*\[/gm
    let match
    const districtPositions = []

    while ((match = districtRegex.exec(content)) !== null) {
        districtPositions.push({
            key: match[1],
            start: match.index + match[0].length,
        })
    }

    for (let i = 0; i < districtPositions.length; i++) {
        const districtKey = districtPositions[i].key
        const start = districtPositions[i].start
        // Find the closing ] for this district's array
        let depth = 1
        let pos = start
        while (depth > 0 && pos < content.length) {
            if (content[pos] === '[') depth++
            if (content[pos] === ']') depth--
            pos++
        }
        const arrayContent = content.substring(start, pos - 1)

        // Extract mandal objects from the array
        const mandals = []
        const mandalRegex =
            /\{\s*key:\s*'([^']+)',\s*en:\s*'([^']+)',\s*te:\s*'([^']+)',\s*lat:\s*([\d.]+),\s*lon:\s*([\d.]+)\s*\}/g
        // Also handle multi-line format
        const mandalRegexML =
            /\{\s*\n?\s*key:\s*'([^']+)',?\s*\n?\s*en:\s*'([^']+)',?\s*\n?\s*te:\s*'([^']+)',?\s*\n?\s*lat:\s*([\d.]+),?\s*\n?\s*lon:\s*([\d.]+),?\s*\n?\s*\}/g

        let m
        // Try single-line first
        while ((m = mandalRegex.exec(arrayContent)) !== null) {
            mandals.push({
                key: m[1],
                en: m[2],
                te: m[3],
                lat: parseFloat(m[4]),
                lon: parseFloat(m[5]),
            })
        }

        // If none found, try multi-line
        if (mandals.length === 0) {
            while ((m = mandalRegexML.exec(arrayContent)) !== null) {
                mandals.push({
                    key: m[1],
                    en: m[2],
                    te: m[3],
                    lat: parseFloat(m[4]),
                    lon: parseFloat(m[5]),
                })
            }
        }

        // If still none, use a more flexible regex
        if (mandals.length === 0) {
            const flexRegex =
                /key:\s*'([^']+)'[\s\S]*?en:\s*'([^']+)'[\s\S]*?te:\s*'([^']+)'[\s\S]*?lat:\s*([\d.]+)[\s\S]*?lon:\s*([\d.]+)/g
            while ((m = flexRegex.exec(arrayContent)) !== null) {
                mandals.push({
                    key: m[1],
                    en: m[2],
                    te: m[3],
                    lat: parseFloat(m[4]),
                    lon: parseFloat(m[5]),
                })
            }
        }

        districts[districtKey] = mandals
    }

    return districts
}

const tsDistricts = parseMandalsTs(tsContent)

// 3. District name mapping (JSON name → TS key)
const districtMapping = {
    Adilabad: 'adilabad',
    'Bhadradri Kothagudem': 'bhadradri_kothagudem',
    Hanamkonda: 'warangal_urban',
    Hyderabad: 'hyderabad',
    Jagtial: 'jagtial',
    Jangaon: 'jangaon',
    'Jayashankar Bhupalpally': 'jayashankar_bhupalpally',
    'Jogulamba Gadwal': 'jogulamba_gadwal',
    Kamareddy: 'kamareddy',
    Karimnagar: 'karimnagar',
    Khammam: 'khammam',
    'Komaram Bheem Asifabad': 'komaram_bheem_asifabad',
    Mahabubabad: 'mahabubabad',
    Mahabubnagar: 'mahabubnagar',
    Mancherial: 'mancherial',
    Medak: 'medak',
    'Medchal\u2013Malkajgiri': 'medchal_malkajgiri',
    Mulugu: 'mulugu',
    Nagarkurnool: 'nagarkurnool',
    Nalgonda: 'nalgonda',
    Narayanpet: 'narayanpet',
    Nirmal: 'nirmal',
    Nizamabad: 'nizamabad',
    Peddapalli: 'peddapalli',
    'Rajanna Sircilla': 'rajanna_sircilla',
    'Ranga Reddy': 'ranga_reddy',
    Sangareddy: 'sangareddy',
    Siddipet: 'siddipet',
    Suryapet: 'suryapet',
    Vikarabad: 'vikarabad',
    Wanaparthy: 'wanaparthy',
    Warangal: 'warangal_rural',
    'Yadadri Bhuvanagiri': 'yadadri_bhuvanagiri',
}

// 4. Fuzzy matching helpers
function normalize(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/rural|urban/g, '')
        .trim()
}

function fuzzyMatch(a, b) {
    const na = normalize(a)
    const nb = normalize(b)
    if (na === nb) return true
    if (na.includes(nb) || nb.includes(na)) return true
    // Levenshtein distance for close matches
    if (na.length > 3 && nb.length > 3) {
        const dist = levenshtein(na, nb)
        const maxLen = Math.max(na.length, nb.length)
        if (dist / maxLen <= 0.25) return true
    }
    return false
}

function levenshtein(a, b) {
    const matrix = []
    for (let i = 0; i <= b.length; i++) matrix[i] = [i]
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1,
                )
            }
        }
    }
    return matrix[b.length][a.length]
}

// 5. Compare
console.log('='.repeat(80))
console.log('MANDALS COMPARISON REPORT')
console.log('Official JSON vs mandals.ts')
console.log('='.repeat(80))
console.log()

let totalOfficialMandals = 0
let totalTsMandals = 0
let totalMissing = 0
let totalExtra = 0
let totalFuzzyMatched = 0

// Count total TS mandals across all districts
for (const [distKey, mandals] of Object.entries(tsDistricts)) {
    totalTsMandals += mandals.length
}

// Count total official mandals
for (const [distName, mandals] of Object.entries(officialJson)) {
    totalOfficialMandals += mandals.length
}

console.log(`Total mandals in official JSON: ${totalOfficialMandals}`)
console.log(`Total mandals in mandals.ts:    ${totalTsMandals}`)
console.log(
    `Total districts in official JSON: ${Object.keys(officialJson).length}`,
)
console.log(
    `Total districts in mandals.ts:    ${Object.keys(tsDistricts).length}`,
)
console.log()

// Check for TS district keys not in mapping
const mappedTsKeys = new Set(Object.values(districtMapping))
const unmappedTsKeys = Object.keys(tsDistricts).filter(
    (k) => !mappedTsKeys.has(k),
)
if (unmappedTsKeys.length > 0) {
    console.log(
        'WARNING: Districts in mandals.ts with NO mapping from official JSON:',
    )
    unmappedTsKeys.forEach((k) => {
        console.log(`  - ${k} (${tsDistricts[k].length} mandals)`)
    })
    console.log()
}

// Check for JSON districts not in mapping
const unmappedJsonDists = Object.keys(officialJson).filter(
    (d) => !districtMapping[d],
)
if (unmappedJsonDists.length > 0) {
    console.log('WARNING: Districts in official JSON with NO mapping:')
    unmappedJsonDists.forEach((d) => {
        console.log(`  - "${d}" (${officialJson[d].length} mandals)`)
    })
    console.log()
}

console.log('-'.repeat(80))
console.log('PER-DISTRICT COMPARISON')
console.log('-'.repeat(80))

for (const [jsonDistName, officialMandals] of Object.entries(officialJson)) {
    const tsKey = districtMapping[jsonDistName]
    if (!tsKey) {
        console.log(`\n[${jsonDistName}] → NO MAPPING FOUND, skipping`)
        continue
    }

    const tsMandals = tsDistricts[tsKey] || []
    const tsEnNames = tsMandals.map((m) => m.en)

    console.log(`\n▸ ${jsonDistName} → "${tsKey}"`)
    console.log(
        `  Official: ${officialMandals.length} mandals | TS: ${tsMandals.length} mandals`,
    )

    // Find missing mandals (in JSON but not in TS)
    const missing = []
    const fuzzyMatches = []
    for (const officialName of officialMandals) {
        // Exact match
        if (
            tsEnNames.some(
                (en) => en.toLowerCase() === officialName.toLowerCase(),
            )
        ) {
            continue
        }
        // Fuzzy match
        const fuzzy = tsEnNames.find((en) => fuzzyMatch(en, officialName))
        if (fuzzy) {
            fuzzyMatches.push({ official: officialName, matched: fuzzy })
            continue
        }
        missing.push(officialName)
    }

    // Find extra mandals (in TS but not in JSON)
    const extra = []
    for (const tsMandal of tsMandals) {
        const tsName = tsMandal.en
        // Exact match
        if (
            officialMandals.some(
                (om) => om.toLowerCase() === tsName.toLowerCase(),
            )
        ) {
            continue
        }
        // Fuzzy match
        const fuzzy = officialMandals.find((om) => fuzzyMatch(om, tsName))
        if (fuzzy) {
            continue // already counted in fuzzyMatches
        }
        extra.push(tsName)
    }

    if (fuzzyMatches.length > 0) {
        console.log(`  Fuzzy matches (${fuzzyMatches.length}):`)
        fuzzyMatches.forEach((fm) => {
            console.log(`    ~ "${fm.official}" ↔ "${fm.matched}"`)
        })
        totalFuzzyMatched += fuzzyMatches.length
    }

    if (missing.length > 0) {
        console.log(`  MISSING from mandals.ts (${missing.length}):`)
        missing.forEach((m) => console.log(`    ✗ ${m}`))
        totalMissing += missing.length
    }

    if (extra.length > 0) {
        console.log(`  EXTRA in mandals.ts (${extra.length}):`)
        extra.forEach((e) => console.log(`    + ${e}`))
        totalExtra += extra.length
    }

    if (
        missing.length === 0 &&
        extra.length === 0 &&
        fuzzyMatches.length === 0
    ) {
        console.log(`  ✓ Perfect match!`)
    }
}

console.log()
console.log('='.repeat(80))
console.log('SUMMARY')
console.log('='.repeat(80))
console.log(`Total mandals in official JSON: ${totalOfficialMandals}`)
console.log(`Total mandals in mandals.ts:    ${totalTsMandals}`)
console.log(`Fuzzy matched:                  ${totalFuzzyMatched}`)
console.log(`Total MISSING (in JSON, not TS): ${totalMissing}`)
console.log(`Total EXTRA (in TS, not JSON):   ${totalExtra}`)
console.log('='.repeat(80))
