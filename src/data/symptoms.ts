import { SymptomItem } from '../types';

export const SYMPTOMS_LIST: SymptomItem[] = [
  // Foliage / Leaf
  {
    id: 'foliar-chlorosis-interveinal',
    name: 'Interveinal Chlorosis (Yellowing Between Veins)',
    organ: 'Foliage / Leaf',
    description: 'Leaf tissue turns yellow or pale while the primary veins remain distinctly green.',
    correlatedConditions: ['Iron Deficiency', 'Magnesium Deficiency', 'Sudden Death Syndrome', 'Tomato Yellow Leaf Curl'],
    severityWeight: 2,
  },
  {
    id: 'foliar-water-soaked-spots',
    name: 'Water-Soaked Margins / Dark Lesions',
    organ: 'Foliage / Leaf',
    description: 'Dark, greasy or translucent spots that appear wet and rapidly expand under high humidity.',
    correlatedConditions: ['Late Blight', 'Bacterial Leaf Blight', 'Bacterial Spot', 'Phytophthora Blight'],
    severityWeight: 4,
  },
  {
    id: 'foliar-concentric-rings',
    name: 'Concentric Target-Board Rings (Necrosis)',
    organ: 'Foliage / Leaf',
    description: 'Circular brown or dark lesions containing visible concentric target rings with yellow halos.',
    correlatedConditions: ['Early Blight (Alternaria)', 'Septoria Blotch', 'Frogeye Leaf Spot'],
    severityWeight: 3,
  },
  {
    id: 'foliar-white-powdery-coating',
    name: 'White Powdery / Dusty Film',
    organ: 'Foliage / Leaf',
    description: 'Superficial flour-like white fungal coating on the upper leaf surface and tender shoots.',
    correlatedConditions: ['Powdery Mildew', 'Downy Mildew (abaxial)', 'Oidium'],
    severityWeight: 3,
  },
  {
    id: 'foliar-rust-pustules',
    name: 'Raised Orange / Cinnamon Rust Pustules',
    organ: 'Foliage / Leaf',
    description: 'Elevated blisters releasing powdery orange, yellow, or reddish-brown spores upon touch.',
    correlatedConditions: ['Stripe Rust (Yellow Rust)', 'Common Corn Rust', 'Asian Soybean Rust', 'Cedar Apple Rust'],
    severityWeight: 4,
  },
  {
    id: 'foliar-leaf-curl-distortion',
    name: 'Leaf Curling / Cupping / Puckering',
    organ: 'Foliage / Leaf',
    description: 'Leaf margins curl upward or downward, puckering with stunted or thickened laminar tissue.',
    correlatedConditions: ['Tomato Yellow Leaf Curl Virus', 'Aphid Feeding Damage', 'Peach Leaf Curl', 'Herbicide Drift'],
    severityWeight: 3,
  },
  {
    id: 'foliar-mosaic-mottling',
    name: 'Mosaic Mottling / Light-Dark Green Patches',
    organ: 'Foliage / Leaf',
    description: 'Irregular mosaic pattern of alternating light green, yellow, and deep green patches.',
    correlatedConditions: ['Tobacco Mosaic Virus (TMV)', 'Cucumber Mosaic Virus (CMV)', 'Citrus Greening (HLB)'],
    severityWeight: 4,
  },
  {
    id: 'foliar-shot-holes',
    name: 'Shot-Holes (Perforated Leaf Drop-Outs)',
    organ: 'Foliage / Leaf',
    description: 'Dead necrotic spots dry out and fall out of the leaf blade, leaving ragged holes like buckshot.',
    correlatedConditions: ['Bacterial Spot', 'Coryneum Blight (Shot Hole)', 'Flea Beetle Damage'],
    severityWeight: 2,
  },

  // Stem & Base
  {
    id: 'stem-dark-canker',
    name: 'Dark Sunken Stem Cankers / Lesions',
    organ: 'Stem & Base',
    description: 'Localized dead necrotic areas on the stem that may girdle the branch and cause collapse.',
    correlatedConditions: ['Late Blight Stem Canker', 'Anthracnose', 'Blackleg', 'Fire Blight'],
    severityWeight: 4,
  },
  {
    id: 'stem-vascular-browning',
    name: 'Internal Vascular Core Browning',
    organ: 'Stem & Base',
    description: 'When the stem is sliced lengthwise, internal xylem conduits show dark reddish-brown discoloration.',
    correlatedConditions: ['Fusarium Wilt', 'Verticillium Wilt', 'Bacterial Wilt (Ralstonia)'],
    severityWeight: 5,
  },
  {
    id: 'stem-shepherds-crook',
    name: 'Terminal Shoot Wilting (Shepherd\'s Crook)',
    organ: 'Stem & Base',
    description: 'Young branch tips wilt and hook downward sharply resembling a shepherd\'s crook staff.',
    correlatedConditions: ['Fire Blight (Erwinia)', 'Shoot Borer Infestation'],
    severityWeight: 4,
  },
  {
    id: 'stem-stunting-dwarfing',
    name: 'Shortened Internodes & Severe Stunting',
    organ: 'Stem & Base',
    description: 'Plant fails to achieve standard vegetative height; dense bunched leaves with short node gaps.',
    correlatedConditions: ['Viral Dwarf Infection', 'Zinc Deficiency', 'Nematode Damage'],
    severityWeight: 3,
  },

  // Fruit & Pod
  {
    id: 'fruit-sunken-dark-rot',
    name: 'Sunken Concentric Fruit Lesions (Anthracnose)',
    organ: 'Fruit & Pod',
    description: 'Circular saucer-shaped depressions on fruit skin producing salmon-pink spore droplets in moisture.',
    correlatedConditions: ['Anthracnose Fruit Rot', 'Alternaria Fruit Rot', 'Black Rot'],
    severityWeight: 4,
  },
  {
    id: 'fruit-blossom-end-rot',
    name: 'Black Leathery Blossom-End Flattening',
    organ: 'Fruit & Pod',
    description: 'Bottom of developing fruit (opposite stem) turns dark brown, sunken, dry, and leathery.',
    correlatedConditions: ['Calcium Deficiency (Blossom End Rot)', 'Irregular Moisture Fluctuation'],
    severityWeight: 3,
  },
  {
    id: 'fruit-corky-scabbing',
    name: 'Corky Rough Scab / Wart-Like Pustules',
    organ: 'Fruit & Pod',
    description: 'Rough, cracked, brown corky eruptions across the fruit epidermis reducing market grade.',
    correlatedConditions: ['Apple Scab', 'Citrus Canker', 'Common Scab (Tuber)'],
    severityWeight: 3,
  },
  {
    id: 'fruit-premature-drop',
    name: 'Premature Fruit / Flower Abortion & Drop',
    organ: 'Fruit & Pod',
    description: 'Flowers and unripened fruit abscise and fall to the ground in mass quantities.',
    correlatedConditions: ['Citrus Greening (HLB)', 'Extreme Heat Stress', 'Severe Blight'],
    severityWeight: 4,
  },

  // Root & Soil
  {
    id: 'root-wilting-wet-soil',
    name: 'Daytime Wilting Despite Adequate Soil Moisture',
    organ: 'Root & Soil',
    description: 'Canopy wilts limp under sunlight even though the root zone is completely moist or soaked.',
    correlatedConditions: ['Phytophthora Root Rot', 'Pythium Damping-Off', 'Bacterial Wilt'],
    severityWeight: 5,
  },
  {
    id: 'root-knot-galls',
    name: 'Swollen Root Nodules / Knots (Galls)',
    organ: 'Root & Soil',
    description: 'Roots exhibit irregular lumpy swellings, lacking fine feeder root hairs.',
    correlatedConditions: ['Root-Knot Nematodes (Meloidogyne)', 'Clubroot (Brassicaceae)'],
    severityWeight: 4,
  },
];

/**
 * Calculates live correlation scores against candidate conditions given selected symptoms
 */
export function calculateSymptomCorrelations(selectedSymptomIds: string[]) {
  if (selectedSymptomIds.length === 0) {
    return [];
  }

  const conditionScores: Record<
    string,
    {
      condition: string;
      matchedSymptoms: string[];
      score: number;
      category: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Nutrient Deficiency' | 'Abiotic';
    }
  > = {};

  const categoryMap: Record<string, 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Nutrient Deficiency' | 'Abiotic'> = {
    'Late Blight': 'Fungal',
    'Early Blight (Alternaria)': 'Fungal',
    'Powdery Mildew': 'Fungal',
    'Downy Mildew (abaxial)': 'Fungal',
    'Apple Scab': 'Fungal',
    'Stripe Rust (Yellow Rust)': 'Fungal',
    'Common Corn Rust': 'Fungal',
    'Asian Soybean Rust': 'Fungal',
    'Anthracnose Fruit Rot': 'Fungal',
    'Fusarium Wilt': 'Fungal',
    'Phytophthora Root Rot': 'Fungal',
    'Bacterial Leaf Blight': 'Bacterial',
    'Bacterial Spot': 'Bacterial',
    'Fire Blight': 'Bacterial',
    'Citrus Canker': 'Bacterial',
    'Tomato Yellow Leaf Curl Virus': 'Viral',
    'Tobacco Mosaic Virus (TMV)': 'Viral',
    'Citrus Greening (HLB)': 'Bacterial',
    'Iron Deficiency': 'Nutrient Deficiency',
    'Magnesium Deficiency': 'Nutrient Deficiency',
    'Calcium Deficiency (Blossom End Rot)': 'Nutrient Deficiency',
    'Root-Knot Nematodes (Meloidogyne)': 'Pest',
    'Aphid Feeding Damage': 'Pest',
  };

  selectedSymptomIds.forEach((symId) => {
    const symptom = SYMPTOMS_LIST.find((s) => s.id === symId);
    if (!symptom) return;

    symptom.correlatedConditions.forEach((cond) => {
      if (!conditionScores[cond]) {
        conditionScores[cond] = {
          condition: cond,
          matchedSymptoms: [],
          score: 0,
          category: categoryMap[cond] || 'Fungal',
        };
      }
      conditionScores[cond].matchedSymptoms.push(symptom.name);
      conditionScores[cond].score += symptom.severityWeight * 15;
    });
  });

  return Object.values(conditionScores)
    .map((item) => ({
      ...item,
      confidenceEstimate: Math.min(96, Math.max(25, item.score)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
