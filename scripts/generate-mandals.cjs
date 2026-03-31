#!/usr/bin/env node
/**
 * generate-mandals.cjs
 * Reads data/list-of-mandals.json + src/config/mandals.ts (existing),
 * generates a complete mandals.ts with ALL mandals from the official list.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const JSON_PATH = path.join(ROOT, 'data', 'list-of-mandals.json')
const EXISTING_TS = path.join(ROOT, 'src', 'config', 'mandals.ts')
const OUTPUT_TS = path.join(ROOT, 'src', 'config', 'mandals.ts')

// ─── District name → config key mapping ─────────────────────────────
const DISTRICT_MAP = {
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
    'Medchal–Malkajgiri': 'medchal_malkajgiri',
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

// ─── District center coordinates ─────────────────────────────────────
const DISTRICT_COORDS = {
    adilabad: { lat: 19.6641, lon: 78.532 },
    bhadradri_kothagudem: { lat: 17.5552, lon: 80.6198 },
    warangal_urban: { lat: 18.0, lon: 79.588 },
    hyderabad: { lat: 17.385, lon: 78.4867 },
    jagtial: { lat: 18.7948, lon: 78.9137 },
    jangaon: { lat: 17.725, lon: 79.152 },
    jayashankar_bhupalpally: { lat: 18.4367, lon: 79.8681 },
    jogulamba_gadwal: { lat: 16.2345, lon: 77.8058 },
    kamareddy: { lat: 18.3219, lon: 78.3339 },
    karimnagar: { lat: 18.4386, lon: 79.1288 },
    khammam: { lat: 17.2473, lon: 80.1514 },
    komaram_bheem_asifabad: { lat: 19.3601, lon: 79.2812 },
    mahabubabad: { lat: 17.5959, lon: 80.0018 },
    mahabubnagar: { lat: 16.7488, lon: 77.9848 },
    mancherial: { lat: 18.8716, lon: 79.4402 },
    medak: { lat: 18.0538, lon: 78.2601 },
    medchal_malkajgiri: { lat: 17.5294, lon: 78.4773 },
    mulugu: { lat: 18.1901, lon: 79.9426 },
    nagarkurnool: { lat: 16.4807, lon: 78.3134 },
    nalgonda: { lat: 17.0583, lon: 79.2671 },
    narayanpet: { lat: 16.7447, lon: 77.4963 },
    nirmal: { lat: 19.0968, lon: 78.344 },
    nizamabad: { lat: 18.6725, lon: 78.0942 },
    peddapalli: { lat: 18.6171, lon: 79.3734 },
    rajanna_sircilla: { lat: 18.3871, lon: 78.8099 },
    ranga_reddy: { lat: 17.2543, lon: 78.2984 },
    sangareddy: { lat: 17.6147, lon: 78.0878 },
    siddipet: { lat: 18.102, lon: 78.852 },
    suryapet: { lat: 17.1383, lon: 79.6268 },
    vikarabad: { lat: 17.338, lon: 77.905 },
    wanaparthy: { lat: 16.3625, lon: 78.0649 },
    warangal_rural: { lat: 18.0, lon: 79.588 },
    yadadri_bhuvanagiri: { lat: 17.5915, lon: 78.9576 },
}

// ─── Complete Telugu name mapping ────────────────────────────────────
const TELUGU_NAMES = {
    // Adilabad
    'Adilabad Rural': 'ఆదిలాబాద్ రూరల్',
    'Adilabad Urban': 'ఆదిలాబాద్ అర్బన్',
    Bazarhatnoor: 'బాజార్ హత్నూర్',
    Bela: 'బేల',
    Boath: 'బోత్',
    Bheempoor: 'భీంపూర్',
    Gudihathnur: 'గుడిహత్నూర్',
    Ichoda: 'ఇచ్చోడ',
    Jainad: 'జైనాద్',
    Mavala: 'మావల',
    Neradigonda: 'నేరడిగొండ',
    Sirikonda: 'సిరికొండ',
    Talamadagu: 'తాళమడుగు',
    Tamsi: 'తామ్సి',
    Gadiguda: 'గాడిగూడ',
    Inderavelly: 'ఇంద్రవెల్లి',
    Narnoor: 'నార్నూర్',
    Utnoor: 'ఉట్నూర్',

    // Bhadradri Kothagudem
    Allapalli: 'అల్లాపల్లి',
    Annapureddypally: 'అన్నాపురెడ్డిపల్లి',
    Aswaraopeta: 'అశ్వారావుపేట',
    Chandrugonda: 'చంద్రుగొండ',
    Chunchupally: 'చుంచుపల్లి',
    Dammapeta: 'దమ్మపేట',
    Gundala: 'గుండాల',
    Julurpad: 'జూలూరుపాడు',
    Kothagudem: 'కొత్తగూడెం',
    Laxmidevipalli: 'లక్ష్మీదేవిపల్లి',
    Mulakalapalle: 'ములకలపల్లి',
    Palvancha: 'పాల్వంచ',
    Sujathanagar: 'సుజాతానగర్',
    Tekulapalle: 'తేకులపల్లి',
    Yellandu: 'ఎల్లందు',
    Aswapuram: 'అశ్వాపురం',
    Bhadrachalam: 'భద్రాచలం',
    Cherla: 'చెర్ల',
    Burgampahad: 'బూర్గంపహాడ్',
    Dummugudem: 'దుమ్ముగూడెం',
    Karakagudem: 'కరకగూడెం',
    Manuguru: 'మణుగూరు',
    Pinapaka: 'పినపాక',

    // Hanamkonda (warangal_urban)
    Bheemadevarapalle: 'భీమదేవరపల్లి',
    Dharmasagar: 'ధర్మసాగర్',
    Elkathurthy: 'ఎల్కతుర్తి',
    Hanamkonda: 'హనుమకొండ',
    Hasanparthy: 'హసన్‌పర్తి',
    Inavole: 'ఇనవోలు',
    Kamalapur: 'కమలాపూర్',
    Kazipet: 'కాజీపేట',
    Velair: 'వేలేరు',
    Atmakur: 'ఆత్మకూర్',
    Damera: 'దామెర',
    Nadikuda: 'నాడికుడ',
    Parkal: 'పార్కల్',
    Shayampet: 'శాయంపేట',

    // Hyderabad
    Amberpet: 'అంబర్‌పేట',
    'Asif Nagar': 'ఆసిఫ్ నగర్',
    Bahadurpura: 'బహదూర్‌పుర',
    Bandlaguda: 'బండ్లగూడ',
    Charminar: 'చార్మినార్',
    Golkonda: 'గోల్కొండ',
    Himayathnagar: 'హిమాయత్ నగర్',
    Nampally: 'నాంపల్లి',
    Saidabad: 'సాయిదాబాద్',
    Ameerpet: 'అమీర్‌పేట',
    Khairtabad: 'ఖైరతాబాద్',
    Maredpally: 'మారేడ్‌పల్లి',
    Musheerabad: 'ముషీరాబాద్',
    Secunderabad: 'సికింద్రాబాద్',
    Shaikpet: 'షాయిఖ్‌పేట',
    Tirumalgiri: 'తిరుమలగిరి',

    // Jagtial
    Beerpur: 'బీర్పూర్',
    Buggaram: 'బుగ్గారం',
    Dharmapuri: 'ధర్మపురి',
    Gollapalle: 'గొల్లపల్లి',
    Jagtial: 'జగిత్యాల',
    'Jagtial Rural': 'జగిత్యాల రూరల్',
    Kodimial: 'కోడిమ్యాల',
    Mallial: 'మల్లియాల్',
    Pegadapalle: 'పెగడపల్లి',
    Raikal: 'రాయికల్',
    Sarangapur: 'సారంగాపూర్',
    Velgatoor: 'వేల్గటూర్',
    Ibrahimpatnam: 'ఇబ్రహీంపట్నం',
    Mallapur: 'మల్లాపూర్',
    Metpalli: 'మెట్‌పల్లి',
    Kathlapur: 'కాట్లాపూర్',
    Korutla: 'కోరుట్ల',
    Medipalle: 'మెదిపల్లి',

    // Jangaon
    Bachannapeta: 'బచ్చన్నపేట',
    Devaruppala: 'దేవరుప్పుల',
    Jangaon: 'జనగాం',
    Lingalaghanpur: 'లింగాలఘన్‌పూర్',
    Narmetta: 'నార్మెట్ట',
    Raghunathapalle: 'రఘునాథపల్లి',
    Tharigoppula: 'తాడిగొప్పుల',
    Chilpur: 'చిల్పూర్',
    Kodakandla: 'కొడకండ్ల',
    Palakurthi: 'పాలకుర్తి',
    'Station Ghanpur': 'స్టేషన్ ఘన్‌పూర్',
    Zaffergadh: 'జాఫర్‌గఢ్',

    // Jayashankar Bhupalpally
    Bhupalpally: 'భూపాలపల్లి',
    Chityal: 'చిత్యాల',
    Ghanpur: 'ఘన్‌పూర్',
    Kataram: 'కాటారం',
    Mahadevpur: 'మహాదేవపూర్',
    Malharrao: 'మల్హర్‌రావ్',
    Mogullapalle: 'మొగుళ్లపల్లి',
    'Mutharam (Mahadevpur)': 'ముత్తారం (మహాదేవపూర్)',
    Palimela: 'పాలిమెల',
    Regonda: 'రేగొండ',
    Tekumatla: 'తేకుమట్ల',

    // Jogulamba Gadwal
    Alampur: 'ఆలంపూర్',
    Dharur: 'ధారూర్',
    Gadwal: 'గద్వాల',
    Ghattu: 'ఘట్టు',
    Itikyal: 'ఇటిక్యాల',
    'Kaloor Thimmandoddi': 'కల్లూర్ తిమ్మండొడ్డి',
    Maldakal: 'మల్దకల్',
    Manopad: 'మానోపాడ్',
    Rajoli: 'రాజోలి',
    Undavelly: 'ఉందవెల్లి',

    // Kamareddy
    Banswada: 'బాన్సువాడ',
    Bhiknoor: 'భీక్నూర్',
    Bibipet: 'బీబీపేట',
    Bichkunda: 'బిచ్కుండ',
    Birkoor: 'బీర్కూర్',
    Domakonda: 'దోమకొండ',
    Gandhari: 'గాంధారి',
    Jukkal: 'జుక్కల్',
    Kamareddy: 'కామారెడ్డి',
    Lingampet: 'లింగంపేట',
    Machareddy: 'మాచారెడ్డి',
    Madnoor: 'మద్నూర్',
    Nagireddypet: 'నాగిరెడ్డిపేట',
    Nizamsagar: 'నిజాంసాగర్',
    Pitlam: 'పిట్లం',
    Rajampet: 'రాజంపేట',
    Ramareddy: 'రామారెడ్డి',
    Sadasivanagar: 'సదాశివనగర్',
    Tadwai: 'తాడ్వాయి',
    Yellareddy: 'ఎల్లారెడ్డి',

    // Karimnagar
    Chigurumamidi: 'చిగురుమామిడి',
    Choppadandi: 'చొప్పదండి',
    Gangadhara: 'గంగాధర',
    Ganneruvaram: 'గన్నేరువరం',
    Huzurabad: 'హుజూరాబాద్',
    'Huzurabad Rural': 'హుజూరాబాద్ రూరల్',
    Jammikunta: 'జమ్మికుంట',
    Karimnagar: 'కరీంనగర్',
    'Karimnagar Rural': 'కరీంనగర్ రూరల్',
    Manakondur: 'మానకొండూరు',
    Ramadugu: 'రామడుగు',
    Shankarapatnam: 'శంకరపట్నం',
    Thimmapur: 'తిమ్మాపూర్',
    Veenavanka: 'వీణవంక',

    // Khammam
    Bonakal: 'బోనకల్',
    Chinthakani: 'చింతకాని',
    Enkuru: 'ఎంకూరు',
    Kallur: 'కల్లూరు',
    'Khammam Rural': 'ఖమ్మం రూరల్',
    'Khammam Urban': 'ఖమ్మం అర్బన్',
    Konijerla: 'కొనిజెర్ల',
    Kusumanchi: 'కూసుమంచి',
    Madhira: 'మధిర',
    Mudigonda: 'ముదిగొండ',
    Nelakondapalle: 'నేలకొండపల్లి',
    Penuballi: 'పెనుబల్లి',
    Raghunadhapalem: 'రఘునాధపాలెం',
    Sathupalle: 'సత్తుపల్లి',
    Singareni: 'సింగరేణి',
    Thallada: 'తల్లాడ',
    Tirumalayapalem: 'తిరుమలాయపాలెం',
    Vemsoor: 'వేమ్సూర్',
    Wyra: 'వైరా',
    Yerrupalem: 'ఎర్రుపాలెం',

    // Komaram Bheem Asifabad
    Asifabad: 'ఆసిఫాబాద్',
    Bejjur: 'బెజ్జూర్',
    Chintalamanepally: 'చింతలమానేపల్లి',
    Dahegaon: 'దహేగాం',
    Jainoor: 'జైనూర్',
    Kagaznagar: 'కాగజ్‌నగర్',
    Kerameri: 'కెరమెరి',
    Kouthala: 'కౌతాల',
    Lingapur: 'లింగాపూర్',
    Penchikalpet: 'పెంచికల్‌పేట',
    Rebbena: 'రెబ్బెన',
    'Sirpur (T)': 'సిర్పూర్ (టి)',
    'Sirpur (U)': 'సిర్పూర్ (యు)',
    Tiryani: 'తిర్యాణి',
    Wankidi: 'వాంకిడి',

    // Mahabubabad
    Bayyaram: 'బయ్యారం',
    Chinnagudur: 'చిన్నగూడూరు',
    Danthalapally: 'దంతాలపల్లి',
    Dornakal: 'దొర్నకల్',
    Gangaram: 'గంగారాం',
    Garla: 'గార్ల',
    Gudur: 'గూడూరు',
    Kesamudram: 'కేసముద్రం',
    Kothaguda: 'కొత్తగూడ',
    Kuravi: 'కురవి',
    Mahabubabad: 'మహబూబాబాద్',
    Maripeda: 'మరిపెడ',
    Narsimhulapet: 'నర్సింహులపేట',
    Nellikudur: 'నెల్లికుదురు',
    Peddavangara: 'పెద్దవంగర',
    Seerole: 'సీరోలు',
    Thorrur: 'తొర్రూరు',

    // Mahabubnagar
    Addakal: 'అద్దాకల్',
    Balanagar: 'బాలానగర్',
    Bhoothpur: 'భూత్‌పూర్',
    'Chinna Chintakunta': 'చిన్న చింతకుంట',
    Devarkadra: 'దేవరకద్ర',
    Hanwada: 'హన్వాడ',
    Jadcherla: 'జడ్చెర్ల',
    Koilkonda: 'కోయిల్‌కొండ',
    Mahabubnagar: 'మహబూబ్‌నగర్',
    Midjil: 'మిడ్జిల్',
    Mohammadabad: 'మొహమ్మదాబాద్',
    Moosapet: 'మూసాపేట',
    Nawabpet: 'నవాబ్‌పేట',
    Rajapur: 'రాజాపూర్',

    // Mancherial
    Bellampalle: 'బెల్లంపల్లి',
    Bheemaram: 'భీమారం',
    Chennur: 'చెన్నూరు',
    Dandepalle: 'దండేపల్లి',
    Hajipur: 'హాజీపూర్',
    Jaipur: 'జైపూర్',
    Jannaram: 'జన్నారం',
    Kasipet: 'కాసిపేట',
    Kotapalle: 'కోటపల్లి',
    Luxettipet: 'లక్సెట్టిపేట',
    Mancherial: 'మంచిర్యాల',
    Mandamarri: 'మందమర్రి',
    Naspur: 'నాస్‌పూర్',
    Nennel: 'నెన్నెల్',
    Tandur: 'తాండూరు',
    Vemanpalle: 'వేమన్‌పల్లి',

    // Medak
    Alladurg: 'అల్లాదుర్గ్',
    Chegunta: 'చేగుంట',
    Havelighanpur: 'హవేళి ఘన్‌పూర్',
    Kulcharam: 'కుల్చారం',
    Medak: 'మెదక్',
    Narsapur: 'నర్సాపూర్',
    Papannapet: 'పాపన్నపేట',
    Ramayampet: 'రామాయంపేట',
    Regode: 'రేగోడ్',
    'Shankarampet-A': 'శంకరంపేట-ఎ',
    'Shankarampet-R': 'శంకరంపేట-ఆర్',
    Tekmal: 'తేక్మల్',
    Tupran: 'తూప్రాన్',
    Yeldurthy: 'ఎల్దుర్తి',

    // Medchal-Malkajgiri
    Alwal: 'అల్వాల్',
    Bachupally: 'బాచుపల్లి',
    // "Balanagar" already defined for Mahabubnagar; handled as duplicate
    'Dundigal Gandimaisamma': 'దుండిగల్ గండిమైసమ్మ',
    Ghatkesar: 'ఘట్‌కేసర్',
    Jagadgirigutta: 'జగద్గిరిగుట్ట',
    Kapra: 'కాప్ర',
    Keesara: 'కీసర',
    Kukatpally: 'కూకట్‌పల్లి',
    Malkajgiri: 'మల్కాజ్‌గిరి',
    Medchal: 'మేడ్చల్',
    Quthbullapur: 'కుత్బుల్లాపూర్',
    Shamirpet: 'శామీర్‌పేట',
    Uppal: 'ఉప్పల్',

    // Mulugu
    Eturnagaram: 'ఏటూర్‌నాగారం',
    Govindaraopet: 'గోవిందరావుపేట',
    Kannaigudem: 'కన్నాయిగూడెం',
    Mangapet: 'మంగపేట',
    Mulugu: 'ములుగు',
    Tadvai: 'తాడ్వాయి',
    Venkatapur: 'వెంకటాపూర్',
    Venkatapuram: 'వెంకటాపురం',
    Wazeedu: 'వాజీడు',

    // Nagarkurnool
    Achampet: 'ఆచంపేట',
    Amrabad: 'అమ్రాబాద్',
    Balmoor: 'బాల్మూర్',
    Bijinapalle: 'బీజినపల్లి',
    Charakonda: 'చారకొండ',
    Kalwakurthy: 'కల్వకుర్తి',
    Kollapur: 'కొల్లాపూర్',
    Kodair: 'కోడేరు',
    Lingal: 'లింగాల్',
    Nagarkurnool: 'నాగర్‌కర్నూల్',
    Peddakothapally: 'పెద్దకోతపల్లి',
    Pentlavelli: 'పెంట్లవెల్లి',
    Telkapally: 'తెల్కపల్లి',
    Thimmajipet: 'తిమ్మాజీపేట',
    Uppununthala: 'ఉప్పునుంతల',
    Vangoor: 'వంగూరు',

    // Nalgonda
    Anumula: 'అనుముల',
    Chandampet: 'చందంపేట',
    Chandur: 'చందూరు',
    // "Chityal" already defined for Jayashankar Bhupalpally; handled as duplicate
    Damaracherla: 'దామరచెర్ల',
    Devarakonda: 'దేవరకొండ',
    Gundlapally: 'గుండ్లపల్లి',
    Gurrampode: 'గుర్రంపోడే',
    Kangal: 'కంగల్',
    Kattangoor: 'కట్టంగూరు',
    Kethepally: 'కేతేపల్లి',
    Munugode: 'మునుగోడు',
    Nakadapally: 'నకారేకల్',
    Nalgonda: 'నల్గొండ',
    // "Nampally" already defined for Hyderabad; handled as duplicate
    Narketpally: 'నార్కట్‌పల్లి',
    Nidamanoor: 'నిడమనూరు',
    'Pedda Adiserlapally': 'పెద్ద ఆదిశెర్లపల్లి',
    Thipparthy: 'తిప్పర్తి',
    Tirumalagiri: 'తిరుమలగిరి',
    Tripuraram: 'త్రిపురారం',

    // Narayanpet
    Damaragidda: 'దామరగిద్ద',
    Dhanwada: 'ధన్వాడ',
    Kosgi: 'కోస్గి',
    Krishna: 'కృష్ణ',
    Maddur: 'మద్దూరు',
    Maganoor: 'మాగనూరు',
    Makthal: 'మక్తల్',
    Marikal: 'మరికాల్',
    Narayanpet: 'నారాయణపేట',
    Narva: 'నర్వ',
    Utkoor: 'ఉట్కూర్',

    // Nirmal
    Basar: 'బాసర',
    Bhainsa: 'భైంసా',
    Dasturabad: 'దస్తూరాబాద్',
    Dilawarpur: 'దిలావర్‌పూర్',
    'Kaddam Peddur': 'కద్దం పెద్దూరు',
    Khanapur: 'ఖానాపూర్',
    Kubeer: 'కుబీర్',
    Laxmanchanda: 'లక్ష్మణచంద',
    Lokeshwaram: 'లోకేశ్వరం',
    Mamda: 'మాంద',
    Mudhole: 'ముధోల్',
    'Narsapur-G': 'నర్సాపూర్-జి',
    Nirmal: 'నిర్మల్',
    Pembi: 'పెంబి',
    // "Sarangapur" already defined for Jagtial; handled as duplicate
    Soan: 'సోన్',

    // Nizamabad
    Armur: 'ఆర్మూర్',
    Balkonda: 'బాల్కొండ',
    Bheemgal: 'భీమ్‌గల్',
    Bodhan: 'బోధన్',
    Dharpally: 'ధార్పల్లి',
    Dichpally: 'డిచ్‌పల్లి',
    Indalwai: 'ఇందల్‌వాయి',
    Jakranpally: 'జాక్రన్‌పల్లి',
    Kammarpally: 'కమ్మర్‌పల్లి',
    Kotgiri: 'కొత్‌గిరి',
    Makloor: 'మాక్లూర్',
    Mendora: 'మెండోర',
    Mortad: 'మోర్తాడ్',
    Mugpal: 'ముగ్పల్',
    Nandipet: 'నందిపేట',
    Navipet: 'నవీపేట',
    'Nizamabad North': 'నిజామాబాద్ నార్త్',
    'Nizamabad South': 'నిజామాబాద్ సౌత్',
    Renjal: 'రెంజల్',
    Rudrur: 'రుద్రూరు',
    Sirkonda: 'సిర్కొండ',
    Varni: 'వర్ణి',
    Yedapally: 'ఎదపల్లి',

    // Peddapalli
    Anthergaon: 'అంతర్‌గాం',
    Dharmaram: 'ధర్మారం',
    Eligaid: 'ఎలిగైడ్',
    Julapalli: 'జూలపల్లి',
    Kamanpur: 'కమాన్‌పూర్',
    Manthani: 'మంథని',
    'Mutharam (Manthani)': 'ముత్తారం (మంథని)',
    Odela: 'ఓదెల',
    Peddapalli: 'పెద్దపల్లి',
    Ramagiri: 'రామగిరి',
    Srirampur: 'శ్రీరాంపూర్',
    Sultanabad: 'సుల్తానాబాద్',

    // Rajanna Sircilla
    Boinpalli: 'బోయిన్‌పల్లి',
    Chandurthi: 'చందుర్తి',
    Ellanthakunta: 'ఎల్లంతకుంట',
    Gambhiraopet: 'గంభీరావుపేట',
    Konaraopet: 'కొనరావుపేట',
    Mustabad: 'ముస్తాబాద్',
    Rudrangi: 'రుద్రంగి',
    Sircilla: 'సిరిసిల్ల',
    Thangallapalli: 'తంగళ్లపల్లి',
    Veernapalli: 'వీర్నపల్లి',
    Vemulawada: 'వేములవాడ',

    // Ranga Reddy
    Abdullapurmet: 'అబ్దుల్లాపూర్‌మెట్',
    Amangal: 'ఆమన్‌గల్',
    Chevella: 'చేవెళ్ల',
    Farooqnagar: 'ఫారూఖ్‌నగర్',
    // "Ibrahimpatnam" already defined for Jagtial; handled as duplicate
    Kandukur: 'కందుకూరు',
    Keshampet: 'కేశంపేట',
    Maheshwaram: 'మహేశ్వరం',
    Manchal: 'మంచాల్',
    Moinabad: 'మొయినాబాద్',
    Nandigama: 'నందిగామ',
    Rajendranagar: 'రాజేంద్రనగర్',
    Saroornagar: 'సరూర్‌నగర్',
    Serilingampally: 'శేరిలింగంపల్లి',
    Shabad: 'షాబాద్',
    Shamshabad: 'శంషాబాద్',
    Shankarpally: 'శంకర్‌పల్లి',
    Talakondapally: 'తాళకొండపల్లి',
    Yacharam: 'యాచారం',

    // Sangareddy
    Ameenpur: 'అమీన్‌పూర్',
    Andole: 'ఆందోలు',
    Gummadidala: 'గుమ్మడిదల',
    Hathnoora: 'హత్నూర',
    Jharasangam: 'ఝరాసంగం',
    Kandi: 'కండి',
    Kangti: 'కంగ్టి',
    Kohir: 'కోహీర్',
    Kondapur: 'కొండాపూర్',
    Manoor: 'మానూరు',
    Munipally: 'మునిపల్లి',
    Nagalgidda: 'నాగల్‌గిద్ద',
    Narayanakhed: 'నారాయణఖేడ్',
    Nyalkal: 'న్యాల్కల్',
    Patancheru: 'పటాన్చెరు',
    Pulkal: 'పుల్కల్',
    Raikode: 'రాయికోడ్',
    Ramachandrapuram: 'రామచంద్రపురం',
    Sadasivpet: 'సదాశివపేట',
    Sangareddy: 'సంగారెడ్డి',
    Sirgapoor: 'సిర్గాపూర్',
    Vatpally: 'వాట్పల్లి',
    Zahirabad: 'జహీరాబాద్',

    // Siddipet
    Akkannapet: 'అక్కన్నపేట',
    Bejjanki: 'బెజ్జంకి',
    Chinnakodur: 'చిన్నకోడూరు',
    Cheriyal: 'చేర్యాల',
    Doulthabad: 'దౌల్తాబాద్',
    Dubbak: 'దుబ్బాక',
    Gajwel: 'గజ్వేల్',
    Husnabad: 'హుస్నాబాద్',
    Jagdevpur: 'జగ్‌దేవ్‌పూర్',
    Koheda: 'కోహెడ',
    Kondapak: 'కొండపాక్',
    Markook: 'మార్కూక్',
    Mirdoddi: 'మిర్దొడ్డి',
    // "Mulugu" already defined for Mulugu district; handled as duplicate
    Nangnoor: 'నాంగ్‌నూర్',
    Raipole: 'రాయిపోలు',
    Siddipet: 'సిద్దిపేట',
    Thoguta: 'తొగుట',
    Wargal: 'వర్గల్',

    // Suryapet
    Ananthagiri: 'అనంతగిరి',
    'Athmakur-S': 'ఆత్మకూర్-ఎస్',
    Chilkur: 'చిల్కూర్',
    Chivvemla: 'చివ్వెమ్ల',
    Garidepally: 'గరిదేపల్లి',
    Huzurnagar: 'హుజూర్‌నగర్',
    Kodad: 'కోడాడ',
    Mattampally: 'మట్టంపల్లి',
    'Mella Cheruvu': 'మెల్ల చెరువు',
    Mothey: 'మోతె',
    Munagala: 'మునగాల',
    Nadigudem: 'నాడిగూడెం',
    Nagaram: 'నాగారం',
    Neredcherla: 'నేరెడ్‌చెర్ల',
    Penpahad: 'పెన్‌పహాడ్',
    Suryapet: 'సూర్యాపేట',
    Thirumalagiri: 'తిరుమలగిరి',
    Thungathurthy: 'తుంగతుర్తి',

    // Vikarabad
    Bantwaram: 'బంట్వారం',
    Basheerabad: 'బషీరాబాద్',
    Bomraspet: 'బొమ్రాస్‌పేట',
    Chowdapur: 'చౌడాపూర్',
    // "Dharur" already defined for Jogulamba Gadwal; handled as duplicate
    Doma: 'దోమ',
    Kodangal: 'కోడంగల్',
    Kotepally: 'కోటేపల్లి',
    Kulkacharla: 'కుల్కచర్ల',
    Marpally: 'మార్పల్లి',
    Mominpet: 'మోమిన్‌పేట',
    // "Nawabpet" already defined for Mahabubnagar; handled as duplicate
    Pargi: 'పర్గి',
    Pudur: 'పూడూరు',
    // "Tandur" already defined for Mancherial; handled as duplicate
    Vikarabad: 'వికారాబాద్',
    Yalal: 'యాలాల్',

    // Wanaparthy
    Amarchinta: 'అమర్‌చింత',
    // "Atmakur" already defined for warangal_urban; handled as duplicate
    Chinnambavi: 'చిన్నంబావి',
    // "Ghanpur" already defined for Jayashankar Bhupalpally; handled as duplicate
    Kothakota: 'కొత్తకోట',
    Madanapur: 'మదనాపూర్',
    Pangal: 'పాంగల్',
    Pebbair: 'పెబ్బేరు',
    Revally: 'రేవల్లి',
    Srirangapur: 'శ్రీరంగాపూర్',
    Wanaparthy: 'వనపర్తి',

    // Warangal
    Chennaraopet: 'చెన్నారావుపేట',
    Duggondi: 'దుగ్గొండి',
    Geesugonda: 'గీసుగొండ',
    // "Khanapur" already defined for Nirmal; handled as duplicate
    Nallabelly: 'నల్లబెల్లి',
    Narsampet: 'నర్సంపేట',
    Nekkonda: 'నెక్కొండ',
    Parvathagiri: 'పర్వతగిరి',
    Raiparthy: 'రాయిపర్తి',
    Sangem: 'సంగెం',
    Wardhannapet: 'వర్ధన్నపేట',

    // Yadadri Bhuvanagiri
    Addaguduru: 'అడ్డగూడూరు',
    Alair: 'ఆలేరు',
    'Atmakur-M': 'ఆత్మకూర్-ఎం',
    Bibinagar: 'బీబీనగర్',
    Bhongir: 'భోంగిర్',
    Bommalaramaram: 'బొమ్మలరామారం',
    Choutuppal: 'చౌటుప్పల్',
    // "Gundala" already defined for Bhadradri Kothagudem; handled as duplicate
    Motakondur: 'మోటకొండూరు',
    Mothkur: 'మొత్కూరు',
    Narayanpur: 'నారాయణపూర్',
    Pochampally: 'పొచంపల్లి',
    Rajapet: 'రాజాపేట',
    Ramannapet: 'రామన్నపేట',
    Thurkapally: 'తుర్కపల్లి',
    Valigonda: 'వాలిగొండ',
    Yadagirigutta: 'యాదగిరిగుట్ట',
}

// ─── Helper: Generate mandal key from English name ───────────────────
function generateKey(name) {
    return name
        .toLowerCase()
        .replace(/\s*\(([^)]+)\)\s*/g, '_$1') // "(T)" → "_t"
        .replace(/[-–]/g, '_') // hyphens → underscore
        .replace(/[^a-z0-9_]/g, '_') // other chars → underscore
        .replace(/_+/g, '_') // collapse multiple underscores
        .replace(/^_|_$/g, '') // trim leading/trailing underscores
}

// ─── Helper: Normalize name for fuzzy matching ──────────────────────
function normalize(name) {
    return name
        .toLowerCase()
        .replace(/[\s\-–_()]/g, '')
        .replace(/[^a-z0-9]/g, '')
}

// ─── Read and parse existing mandals.ts to extract coordinates ──────
function parseExistingMandals(tsContent) {
    // Build a lookup: normalized(en) → { lat, lon, te }
    const lookup = {}
    // Match mandal objects: { key: '...', en: '...', te: '...', lat: N, lon: N }
    const regex =
        /\{\s*key:\s*'([^']+)',\s*en:\s*'([^']+)',\s*te:\s*'([^']+)',\s*lat:\s*([\d.]+),\s*lon:\s*([\d.]+)\s*,?\s*\}/g
    let match
    while ((match = regex.exec(tsContent)) !== null) {
        const [, , en, te, lat, lon] = match
        const normKey = normalize(en)
        if (!lookup[normKey]) {
            lookup[normKey] = { lat: parseFloat(lat), lon: parseFloat(lon), te }
        }
    }
    return lookup
}

// ─── Get Telugu name for a mandal (with context disambiguation) ─────
function getTeluguName(mandalName, districtKey, existingLookup) {
    // First try the exact name from the provided TELUGU_NAMES map
    if (TELUGU_NAMES[mandalName]) {
        return TELUGU_NAMES[mandalName]
    }
    // Fallback: check existing data by normalized name
    const norm = normalize(mandalName)
    if (existingLookup[norm] && existingLookup[norm].te) {
        return existingLookup[norm].te
    }
    // Last resort: return the English name with a Telugu script placeholder
    console.warn(
        `WARNING: No Telugu name found for "${mandalName}" in ${districtKey}`,
    )
    return mandalName
}

// ─── Get coordinates for a mandal ───────────────────────────────────
function getCoordinates(
    mandalName,
    districtKey,
    index,
    totalMandals,
    existingLookup,
) {
    const norm = normalize(mandalName)
    if (existingLookup[norm]) {
        return { lat: existingLookup[norm].lat, lon: existingLookup[norm].lon }
    }

    // Generate deterministic coords from district center
    const center = DISTRICT_COORDS[districtKey]
    if (!center) {
        console.warn(`WARNING: No district center for ${districtKey}`)
        return { lat: 17.385, lon: 78.4867 } // Hyderabad fallback
    }

    let latOffset = index * 0.015 - totalMandals * 0.0075
    let lonOffset = index * 0.012 - totalMandals * 0.006

    // Clamp offsets
    latOffset = Math.max(-0.15, Math.min(0.15, latOffset))
    lonOffset = Math.max(-0.15, Math.min(0.15, lonOffset))

    return {
        lat: Math.round((center.lat + latOffset) * 10000) / 10000,
        lon: Math.round((center.lon + lonOffset) * 10000) / 10000,
    }
}

// ─── Friendly district display name ─────────────────────────────────
const DISTRICT_DISPLAY = {}
for (const [displayName, key] of Object.entries(DISTRICT_MAP)) {
    DISTRICT_DISPLAY[key] = displayName
}

// ─── MAIN ────────────────────────────────────────────────────────────
function main() {
    // 1. Read official mandal list
    const jsonData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'))

    // 2. Read existing mandals.ts
    const existingTs = fs.readFileSync(EXISTING_TS, 'utf-8')
    const existingLookup = parseExistingMandals(existingTs)
    console.log(
        `Parsed ${Object.keys(existingLookup).length} existing mandals from mandals.ts`,
    )

    // 3. Build the new data structure
    const allDistricts = {}
    let totalMandals = 0
    const warnings = []

    for (const [jsonDistrictName, mandals] of Object.entries(jsonData)) {
        const districtKey = DISTRICT_MAP[jsonDistrictName]
        if (!districtKey) {
            warnings.push(
                `WARNING: No mapping for district "${jsonDistrictName}"`,
            )
            continue
        }

        // Sort mandals alphabetically by English name
        const sortedMandals = [...mandals].sort((a, b) => a.localeCompare(b))

        const mandalEntries = sortedMandals.map((mandalName, i) => {
            const key = generateKey(mandalName)
            const te = getTeluguName(mandalName, districtKey, existingLookup)
            const coords = getCoordinates(
                mandalName,
                districtKey,
                i,
                sortedMandals.length,
                existingLookup,
            )
            return { key, en: mandalName, te, lat: coords.lat, lon: coords.lon }
        })

        allDistricts[districtKey] = mandalEntries
        totalMandals += mandalEntries.length
    }

    // 4. Sort districts by key
    const sortedDistrictKeys = Object.keys(allDistricts).sort()

    // 5. Generate TypeScript output
    let output = ''
    output += `export interface Mandal {\n`
    output += `    key: string\n`
    output += `    en: string\n`
    output += `    te: string\n`
    output += `    lat: number\n`
    output += `    lon: number\n`
    output += `}\n\n`
    output += `/** District key → array of mandals with coordinates */\n`
    output += `export const DISTRICT_MANDALS: Record<string, Mandal[]> = {\n`

    for (const districtKey of sortedDistrictKeys) {
        const mandals = allDistricts[districtKey]
        const displayName = DISTRICT_DISPLAY[districtKey] || districtKey
        output += `    // ─── ${displayName} (${mandals.length} mandals) ───${'─'.repeat(Math.max(0, 50 - displayName.length - String(mandals.length).length))}\n`
        output += `    ${districtKey}: [\n`

        for (const m of mandals) {
            const enEscaped = m.en.replace(/'/g, "\\'")
            const teEscaped = m.te.replace(/'/g, "\\'")
            output += `        {\n`
            output += `            key: '${m.key}',\n`
            output += `            en: '${enEscaped}',\n`
            output += `            te: '${teEscaped}',\n`
            output += `            lat: ${m.lat},\n`
            output += `            lon: ${m.lon},\n`
            output += `        },\n`
        }

        output += `    ],\n\n`
    }

    output += `}\n\n`

    // Add utility functions
    output += `/** Get mandals for a district */\n`
    output += `export function getMandalsForDistrict(districtKey: string): Mandal[] {\n`
    output += `    return DISTRICT_MANDALS[districtKey] || []\n`
    output += `}\n\n`

    output += `/** Find mandal coordinates by district and mandal key */\n`
    output += `export function getMandalCoords(\n`
    output += `    districtKey: string,\n`
    output += `    mandalKey: string,\n`
    output += `): { lat: number; lon: number } | null {\n`
    output += `    const mandals = DISTRICT_MANDALS[districtKey]\n`
    output += `    if (!mandals) return null\n`
    output += `    const mandal = mandals.find((m) => m.key === mandalKey)\n`
    output += `    return mandal ? { lat: mandal.lat, lon: mandal.lon } : null\n`
    output += `}\n\n`

    output += `/** Get total count of mandals across all districts */\n`
    output += `export function getTotalMandalCount(): number {\n`
    output += `    return Object.values(DISTRICT_MANDALS).reduce(\n`
    output += `        (sum, mandals) => sum + mandals.length,\n`
    output += `        0,\n`
    output += `    )\n`
    output += `}\n\n`

    output += `/** Search mandals by name (English or Telugu) across all districts */\n`
    output += `export function searchMandals(\n`
    output += `    query: string,\n`
    output += `): (Mandal & { district: string })[] {\n`
    output += `    const lowerQuery = query.toLowerCase()\n`
    output += `    const results: (Mandal & { district: string })[] = []\n`
    output += `    for (const [district, mandals] of Object.entries(DISTRICT_MANDALS)) {\n`
    output += `        for (const mandal of mandals) {\n`
    output += `            if (\n`
    output += `                mandal.en.toLowerCase().includes(lowerQuery) ||\n`
    output += `                mandal.te.includes(query)\n`
    output += `            ) {\n`
    output += `                results.push({ ...mandal, district })\n`
    output += `            }\n`
    output += `        }\n`
    output += `    }\n`
    output += `    return results\n`
    output += `}\n`

    // 6. Write to file
    fs.writeFileSync(OUTPUT_TS, output, 'utf-8')

    // 7. Report
    console.log(`\n========== GENERATION COMPLETE ==========`)
    console.log(`Total districts: ${sortedDistrictKeys.length}`)
    console.log(`Total mandals: ${totalMandals}`)

    if (warnings.length > 0) {
        console.log(`\nWarnings:`)
        warnings.forEach((w) => console.log(`  ${w}`))
    }

    // Show first 3 mandals of Adilabad
    console.log(`\n--- First 3 mandals of Adilabad ---`)
    const adilabad = allDistricts['adilabad']
    if (adilabad) {
        adilabad.slice(0, 3).forEach((m) => {
            console.log(
                `  ${m.key}: en="${m.en}", te="${m.te}", lat=${m.lat}, lon=${m.lon}`,
            )
        })
    }

    // Show first 3 mandals of Hyderabad
    console.log(`\n--- First 3 mandals of Hyderabad ---`)
    const hyderabad = allDistricts['hyderabad']
    if (hyderabad) {
        hyderabad.slice(0, 3).forEach((m) => {
            console.log(
                `  ${m.key}: en="${m.en}", te="${m.te}", lat=${m.lat}, lon=${m.lon}`,
            )
        })
    }

    console.log(`\nOutput written to: ${OUTPUT_TS}`)
}

main()
