// Recommended Project names:
// ప్రకృతి సంపద
// ప్రకృతి వనం
export const districts = [
    'Adilabad',
    'Komaram Bheem Asifabad',
    'Mancherial',
    'Nirmal',
    'Nizamabad',
    'Jagtial',
    'Peddapalli',
    'Karimnagar',
    'Rajanna Sircilla',
    'Warangal Rural',
    'Warangal Urban',
    'Jangaon',
    'Jayashankar Bhupalpally',
    'Khammam',
    'Bhadradri Kothagudem',
    'Mahabubabad',
    'Medak',
    'Siddipet',
    'Sangareddy',
    'Kamareddy',
    'Medchal-Malkajgiri',
    'Hyderabad',
    'Ranga Reddy',
    'Vikarabad',
    'Mahabubnagar (Mahbubnagar)',
    'Nagarkurnool',
    'Wanaparthy',
    'Jogulamba Gadwal',
    'Narayanpet',
    'Nalgonda',
    'Suryapet',
    'Yadadri Bhuvanagiri',
    'Mulugu',
]

export const language = {
    id: 'language-uuid-001',
    name: {
        en: 'Telugu',
        te: 'తెలుగు',
    },
    code: 'te',
}

export const languages = [language]

export const soilType = {
    id: 'soiltype-uuid-001',
    name: {
        en: 'Black Soil',
        te: 'కృష్ణ మట్టి',
    },
    phRange: [6.0, 7.5], // optional
    organicMatter: [0.3, 0.7], // optional
    waterRetention: 'Moderate', // optional
    districts: ['district-1', 'district-2'], // hardcode districts in FE locales (en.json, te.json, etc.)
    majorCrops: ['crop-uuid-001', 'crop-uuid-002'],
    characteristics: {
        en: 'Rich in clay; retains moisture well.',
        te: 'మట్టి చారాన్ని ఎక్కువగా కలిగి ఉంటుంది; నీటిని బాగా నిల్వ చేస్తుంది.',
    },
}

export const soilTypes = [soilType]

// Major crops are the main categories (e.g. Rice, Wheat, Maize), while crop varieties are specific types within those categories (e.g. Kunaram Sannalu is a variety of Rice).
export const majorCrop = {
    id: 'major-crop-uuid-001',
    name: {
        en: 'Rice',
        te: 'బియ్యం',
    },
    cropType: {
        en: 'Vegetable',
        te: 'కూరగాయ',
    },
    suitableSoilTypes: ['soiltype-uuid-001', 'soiltype-uuid-002'],
    imageUrl: 'sample_image_url.jpg',
    aliases: {
        // optional
        en: ['Tindora', 'Kovakkai'],
        te: ['తిందోరా', 'కోవక్కై'],
    },
}

// Crop varieties are specific types of a major crop, often with unique characteristics, growth requirements, and regional suitability. For example, "Kunaram Sannalu (KNM 118)" is a specific variety of the major crop "Rice".
export const cropVariety = {
    id: 'crop-uuid-001',
    name: {
        en: 'Kunaram Sannalu (KNM 118)',
        te: 'కునారం సన్నాలు (KNM 118)',
    },
    majorCrop: 'major-crop-uuid-001',
    imageUrl: 'sample_image_url.jpg', // upload
    recommendedSeasons: [
        {
            name: {
                en: 'Kharif',
                te: 'ఖరీఫ్',
            },
            durationInDays: [118, 120],
            months: {
                en: ['June', 'July', 'August'],
                te: ['జూన్', 'జూలై', 'ఆగస్టు'],
            },
        },
        {
            name: {
                en: 'Rabi',
                te: 'రబీ',
            },
            durationInDays: [120],
            months: {
                en: ['October', 'November', 'December'],
                te: ['అక్టోబర్', 'నవంబర్', 'డిసెంబర్'],
            },
        },
    ],
    districts: ['district-1', 'district-2'],
    grainCharacter: {
        // optional
        en: ['Long slender grain'],
        te: ['దీర్ఘ సన్నని ధాన్యం'],
    },
    specialCharacteristics: [
        // optional
        {
            en: 'High yield potential and good grain quality',
            te: 'అధిక దిగుబడి సామర్థ్యం మరియు మంచి ధాన్య నాణ్యత',
        },
        {
            en: 'Resistant to major pests and diseases',
            te: 'ప్రధాన కీటకాల మరియు వ్యాధుల నిరోధక',
        },
    ],
    diseases: ['disease-uuid-5678'], // optional
}

export const disease = {
    id: 'disease-uuid-5678',
    name: {
        en: 'Powdery Mildew',
        te: 'పొడికిరచిన పిండివెచ్చ',
    },
    type: {
        en: 'Fungal',
        te: 'పొడి',
    },
    cropVarieties: ['crop-uuid-001'],
    severity: 'moderate',
    imageUrl: ['sample_image_url.jpg', 'sample_image_url2.jpg'],
    symptoms: [
        {
            en: 'White powdery spots on leaves',
            te: 'ఆకులపై తెల్లని పొడికిరచిన దొరకట్టలు',
        },
    ],
    primaryCause: {
        en: 'Fungal spores spread by wind and water',
        te: 'గాలి మరియు నీటితో వ్యాప్తి చెందే ఫంగల్ స్పోర్స్',
    },
    favorableConditions: [
        { en: 'High humidity', te: 'అధిక తేమ' },
        {
            en: 'Poor air circulation',
            te: 'తక్కువ గాలి ప్రసరణ',
        },
    ],
    preventions: [
        { en: 'Crop rotation', te: 'పంట రోటేషన్' },
        {
            en: 'Resistant varieties',
            te: 'ప్రతిరోధక వేరియంట్లు',
        },
        { en: 'Proper spacing', te: 'సరైన అంతరం' },
    ],
    treatments: [
        {
            en: 'Organic methods like neem oil spray',
            te: 'నిమ్ ఆయిల్ స్ప్రే వంటి సేంద్రీయ విధానాలు',
        },
        {
            en: 'Fungicides for severe cases',
            te: 'తీవ్ర కేసుల కోసం ఫంగిసైడ్లు',
        },
    ],
    aliases: { en: ['Oidium'], te: ['ఒయిడియం'] }, // optional
    remedies: ['remedy-uuid-9012'], // optional
}

export const diseases = [disease]

export const remedy = {
    id: 'remedy-uuid-9012',
    name: {
        en: 'Neem Oil Spray',
        te: 'వేప నూనె స్ప్రే',
    },
    type: {
        en: 'Bio-fungicide',
        te: 'జీవ-ఫంగిసైడ్',
    },
    howItWorks: {
        en: 'Attacks fungal pathogens, competes for nutrients, and produces natural compounds that inhibit their growth',
        te: 'పిండివెచ్చను నాశనం చేస్తుంది, పోషకాల కోసం పోటీ చేస్తుంది, మరియు వృద్ధిని అడ్డుకునే సహజ రసాయనాలను ఉత్పత్తి చేస్తుంది',
    },
    usageInstructions: [
        {
            en: 'Spray on affected plants every 7-14 days',
            te: 'ప్రతి 7-14 రోజులలో ప్రభావిత మొక్కలపై స్ప్రే చేయండి',
        },
    ],
    preparationInstructions: [
        {
            en: 'Mix 1 part neem oil with 10 parts water and a few drops of mild soap',
            te: '1 భాగ వేప నూనెను 10 భాగాలు నీటితో మరియు కొద్దిగా మృదువైన సబ్బు తో కలపండి',
        },
    ],
    ingredients: [
        {
            en: 'Neem oil',
            te: 'వేప నూనె',
        },
    ],
    effectiveness: 'Moderate',
    aliases: {
        en: ['Azadirachtin Spray'],
        te: ['అజాదిరాక్టిన్ స్ప్రే'],
    },
}

export const remedies = [remedy]
