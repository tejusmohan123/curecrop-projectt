import { CureProduct } from '../types';

export const CURES_CATALOG: CureProduct[] = [
  // FUNGAL BLIGHTS & LEAF SPOTS (Late Blight, Early Blight, Anthracnose, Leaf Spot)
  {
    id: 'cure-copper-octanoate',
    name: 'Cueva® / Blitox-50 Copper Oxychloride & Soap Formulation',
    category: 'Organic Bio-Fungicide',
    activeIngredient: 'Copper Oxychloride 50% WP / Copper Octanoate 10.0%',
    targetInfections: ['Late Blight', 'Early Blight', 'Bacterial Spot', 'Anthracnose', 'Downy Mildew'],
    description: 'Broad-spectrum contact bactericide and protective fungicide. Bonds to foliage to create a micro-layer preventing zoospore germination and mycelial fungal penetration.',
    dosageInstructions: '2.5 to 3.0 g per litre of water (or 500g in 200L water per acre). Apply every 7 to 10 days during cloudy or rainy weather.',
    safetyIntervalDays: 0,
    price: 360,
    unit: '500g Pack',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.9,
  },
  {
    id: 'cure-bacillus-subtilis',
    name: 'Serenade® / Bio-Bactillus Subtilis Bio-Fungicide',
    category: 'Organic Bio-Fungicide',
    activeIngredient: 'Bacillus subtilis / amyloliquefaciens (1x10^9 CFU/ml)',
    targetInfections: ['Late Blight', 'Early Blight', 'Bacterial Wilt', 'Powdery Mildew', 'Botrytis Gray Mold', 'Black Rot'],
    description: 'Natural biological antagonist bactericide and fungicide. Colonizes plant tissue to block pathogens and secretes lipopeptide enzymes that rupture pathogenic cell walls.',
    dosageInstructions: '3 to 5 ml per litre of water (600 ml - 1 Litre per acre). Spray during early morning or late evening.',
    safetyIntervalDays: 0,
    price: 490,
    unit: '1 Litre Bottle',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.8,
  },
  {
    id: 'cure-mancozeb-wp',
    name: 'Dithane® M-45 (Mancozeb 75% WP)',
    category: 'Protective Contact',
    activeIngredient: 'Mancozeb 75% WP (Ethylene bisdithiocarbamate with Zinc & Manganese)',
    targetInfections: ['Early Blight', 'Late Blight', 'Septoria Leaf Spot', 'Rust', 'Apple Scab', 'Anthracnose'],
    description: 'Standard multi-site contact fungicide trusted across Indian horticulture. Disrupts lipid metabolism and cell respiration with zero pathogen resistance.',
    dosageInstructions: '2.0 to 2.5 g per litre of water (400-500g per acre). Ensure thorough coverage on lower leaf surfaces.',
    safetyIntervalDays: 5,
    price: 310,
    unit: '500g Pack',
    certifiedOrganic: false,
    inStock: true,
    rating: 4.7,
  },
  {
    id: 'cure-azoxystrobin-systemic',
    name: 'Amistar® / Quadris® (Azoxystrobin 23% SC)',
    category: 'Systemic Curative',
    activeIngredient: 'Azoxystrobin 23% SC (Strobilurin class)',
    targetInfections: ['Late Blight', 'Early Blight', 'Rice Blast', 'Powdery Mildew', 'Apple Scab', 'Downy Mildew'],
    description: 'High-potency systemic xylem-mobile curative fungicide. Halts fungal electron transport and inhibits spore germination with translaminar foliage penetration.',
    dosageInstructions: '1 ml per litre of water (200 ml per acre in 200L water). Alternate with contact protectants.',
    safetyIntervalDays: 3,
    price: 850,
    unit: '200 ml Bottle',
    certifiedOrganic: false,
    inStock: true,
    rating: 4.9,
  },

  // MILDEWS & RUSTS (Powdery Mildew, Downy Mildew, Rusts)
  {
    id: 'cure-potassium-bicarbonate',
    name: 'Karathane® / Potassium Bicarbonate SP Curative',
    category: 'Organic Bio-Fungicide',
    activeIngredient: 'Potassium Bicarbonate 85.0% SP + Wetting Agent',
    targetInfections: ['Powdery Mildew', 'Downy Mildew', 'Black Spot', 'Alternaria'],
    description: 'Fast-action contact curative foliar formulation. Causes cell collapse and osmotic disruption of active powdery mildew mycelium within 24 hours.',
    dosageInstructions: '3.0 to 4.0 g per litre of water (600g per acre). Spray at the initial sign of whitish powdery spots.',
    safetyIntervalDays: 0,
    price: 420,
    unit: '1 kg Pack',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.8,
  },
  {
    id: 'cure-pure-neem-oil',
    name: 'Cold-Pressed Pure Neem Oil (10,000 PPM Azadirachtin)',
    category: 'Bio-Insecticide',
    activeIngredient: 'Pure Cold Pressed Neem Oil (Azadirachtin 10,000 PPM EC)',
    targetInfections: ['Powdery Mildew', 'Rust', 'Aphids', 'Spider Mites', 'Whiteflies', 'Leafminers'],
    description: 'Certified organic botanical fungicide and insect anti-feedant. Smothers overwintering mildew spores and halts sap-sucking pest proliferation.',
    dosageInstructions: '3 to 5 ml per litre of water with a mild emulsifier. Spray foliage until run-off during late afternoon.',
    safetyIntervalDays: 0,
    price: 280,
    unit: '500 ml Bottle',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.6,
  },

  // BACTERIAL WILTS, CANKERS & BLIGHTS
  {
    id: 'cure-bactericide-copper-hydroxide',
    name: 'Kocide® 3000 (Copper Hydroxide 46.1% DF)',
    category: 'Bio-Bactericide',
    activeIngredient: 'Copper Hydroxide 46.1% DF (30% Metallic Copper Equivalent)',
    targetInfections: ['Bacterial Canker', 'Citrus Canker', 'Bacterial Spot', 'Fire Blight', 'Bacterial Speck', 'Black Rot'],
    description: 'Bio-active submicron copper crystals delivering maximum Cu2+ bactericidal ions to coagulate pathogen proteins without leaf phytotoxicity.',
    dosageInstructions: '1.5 to 2.0 g per litre of water (300g per acre). Agitate tank thoroughly.',
    safetyIntervalDays: 0,
    price: 520,
    unit: '500g Pack',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.9,
  },
  {
    id: 'cure-oxytetracycline-bactericide',
    name: 'Plantomycin® / Streptocycline Bactericide',
    category: 'Systemic Curative',
    activeIngredient: 'Streptomycin Sulphate 90% + Tetracycline Hydrochloride 10% SP',
    targetInfections: ['Fire Blight', 'Bacterial Spot', 'Bacterial Wilt', 'Citrus Canker', 'Black Rot'],
    description: 'Specialty agricultural bactericide pouch for systemic control of devastating bacterial wilt and foliar canker complexes.',
    dosageInstructions: '6g pouch in 60-120 litres of water (approx 0.5g/L). Add copper protectant for synergistic suppression.',
    safetyIntervalDays: 14,
    price: 180,
    unit: '6g x 5 Pouches (30g Box)',
    certifiedOrganic: false,
    inStock: true,
    rating: 4.7,
  },

  // ROOT ROTS, DAMPING-OFF & SOIL PATHOGENS
  {
    id: 'cure-trichoderma-inoculant',
    name: 'Sanjivani® Trichoderma Viride / Harzianum Bio-Agent',
    category: 'Soil Remediation',
    activeIngredient: 'Trichoderma viride / harzianum (2x10^8 CFU/g WP)',
    targetInfections: ['Root Rot', 'Fusarium Wilt', 'Pythium Damping Off', 'Rhizoctonia', 'Phytophthora Root Rot'],
    description: 'Living beneficial fungal bio-inoculant. Hyper-parasitizes pathogenic root fungi and establishes a biological defensive buffer around crop roots.',
    dosageInstructions: '1 kg mixed with 100 kg farmyard manure (FYM) for soil application, or 5g per litre for nursery drench.',
    safetyIntervalDays: 0,
    price: 240,
    unit: '1 kg Pack',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.9,
  },

  // NUTRIENT DEFICIENCIES & FOLIAR RECOVERY
  {
    id: 'cure-chelated-micronutrients',
    name: 'Multiplex® Chelated Micronutrient Foliar Formulation',
    category: 'Nutrient Foliar',
    activeIngredient: 'Chelated Fe-EDTA 4%, Zn 6%, Mn 2%, Cu 0.5%, B 1%, Mo 0.05%',
    targetInfections: ['Nitrogen Deficiency', 'Iron Chlorosis', 'Magnesium Deficiency', 'Zinc Deficiency', 'Interveinal Chlorosis'],
    description: '100% water-soluble EDTA chelated micronutrient formula. Instantly corrects leaf chlorosis, yellowing, and nutrient deficiency stunting within 72 hours.',
    dosageInstructions: '1.5 to 2.0 g per litre of water (300-400g per acre). Spray during early vegetative or peak flush stage.',
    safetyIntervalDays: 0,
    price: 290,
    unit: '500g Pack',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.8,
  },
  {
    id: 'cure-calcium-boron-foliar',
    name: 'Cal-Bor® Liquid Calcium & Boron Foliar Booster',
    category: 'Nutrient Foliar',
    activeIngredient: 'Water Soluble Calcium (Ca 11.0%) + Boron (B 0.2%)',
    targetInfections: ['Blossom End Rot', 'Tip Burn', 'Calcium Deficiency', 'Fruit Cracking'],
    description: 'Liquid calcium-boron complex that reinforces fruit cell wall pectin structure and cures blossom end rot in tomatoes, chillies, and bell peppers.',
    dosageInstructions: '2.5 to 3.0 ml per litre of water (500 ml per acre). Spray every 10 days starting at flower initiation.',
    safetyIntervalDays: 0,
    price: 340,
    unit: '500 ml Bottle',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.9,
  },

  // INSECT / VECTOR / PEST DAMAGE
  {
    id: 'cure-spinosad-organic',
    name: 'Tracer® / Spinosad 45% SC Bio-Pesticide',
    category: 'Bio-Insecticide',
    activeIngredient: 'Spinosad 45% SC (Naturalyte Insect Control)',
    targetInfections: ['Caterpillar Damage', 'Thrips (Tomato Spotted Wilt Vector)', 'Armyworms', 'Leafminers', 'Colorado Potato Beetle'],
    description: 'Fermentation-derived bacterial insect neurotoxin. Extremely lethal against thrips, worms, and borers while preserving beneficial predators once dried.',
    dosageInstructions: '0.3 to 0.4 ml per litre of water (60-75 ml per acre in 150-200L water). Spray in early morning or evening.',
    safetyIntervalDays: 3,
    price: 720,
    unit: '75 ml Bottle',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.8,
  },
  {
    id: 'cure-bio-stimulant-seaweed',
    name: 'Biozyme® / Sagarika Seaweed Extract Bio-Stimulant',
    category: 'Soil Remediation',
    activeIngredient: 'Ascophyllum Nodosum Pure Seaweed Extract 28% Liquid with Amino Acids',
    targetInfections: ['Abiotic Stress', 'Drought Shock', 'Heat Stress', 'Healthy Specimen Vigor Booster'],
    description: 'Natural plant growth promoter manufactured from marine algae. Stimulates root growth, increases chlorophyll synthesis, and enhances immunity against stress.',
    dosageInstructions: '2.0 ml per litre of water (400-500 ml per acre) as foliar spray or drip irrigation.',
    safetyIntervalDays: 0,
    price: 380,
    unit: '500 ml Bottle',
    certifiedOrganic: true,
    inStock: true,
    rating: 4.9,
  },
];

/**
 * Returns tailored cure products matching the diagnosed condition, category, or crop.
 */
export function getTailoredCuresForCondition(
  conditionName: string = '',
  category: string = '',
  _cropIdentified: string = ''
): CureProduct[] {
  const normalizedCond = conditionName.toLowerCase();
  const normalizedCat = category.toLowerCase();

  // If healthy
  if (normalizedCond.includes('healthy') || normalizedCat.includes('healthy')) {
    return [
      CURES_CATALOG.find((c) => c.id === 'cure-bio-stimulant-seaweed')!,
      CURES_CATALOG.find((c) => c.id === 'cure-trichoderma-inoculant')!,
      CURES_CATALOG.find((c) => c.id === 'cure-chelated-micronutrients')!,
    ].filter(Boolean);
  }

  // Bacterial infections
  if (normalizedCat.includes('bacterial') || normalizedCond.includes('bacterial') || normalizedCond.includes('canker') || normalizedCond.includes('wilt')) {
    const cures = [
      CURES_CATALOG.find((c) => c.id === 'cure-bactericide-copper-hydroxide')!,
      CURES_CATALOG.find((c) => c.id === 'cure-bacillus-subtilis')!,
      CURES_CATALOG.find((c) => c.id === 'cure-oxytetracycline-bactericide')!,
      CURES_CATALOG.find((c) => c.id === 'cure-copper-octanoate')!,
    ].filter(Boolean);
    return cures;
  }

  // Nutrient deficiencies
  if (normalizedCat.includes('nutrient') || normalizedCond.includes('deficiency') || normalizedCond.includes('chlorosis')) {
    return [
      CURES_CATALOG.find((c) => c.id === 'cure-chelated-micronutrients')!,
      CURES_CATALOG.find((c) => c.id === 'cure-calcium-boron-foliar')!,
      CURES_CATALOG.find((c) => c.id === 'cure-bio-stimulant-seaweed')!,
    ].filter(Boolean);
  }

  // Insect or viral vectors
  if (normalizedCat.includes('pest') || normalizedCat.includes('viral') || normalizedCond.includes('virus') || normalizedCond.includes('mosaic') || normalizedCond.includes('thrip')) {
    return [
      CURES_CATALOG.find((c) => c.id === 'cure-spinosad-organic')!,
      CURES_CATALOG.find((c) => c.id === 'cure-pure-neem-oil')!,
      CURES_CATALOG.find((c) => c.id === 'cure-bio-stimulant-seaweed')!,
    ].filter(Boolean);
  }

  // Mildews & Rusts
  if (normalizedCond.includes('mildew') || normalizedCond.includes('rust')) {
    return [
      CURES_CATALOG.find((c) => c.id === 'cure-potassium-bicarbonate')!,
      CURES_CATALOG.find((c) => c.id === 'cure-copper-octanoate')!,
      CURES_CATALOG.find((c) => c.id === 'cure-azoxystrobin-systemic')!,
      CURES_CATALOG.find((c) => c.id === 'cure-pure-neem-oil')!,
    ].filter(Boolean);
  }

  // Root or Soil Rots
  if (normalizedCond.includes('root') || normalizedCond.includes('damping') || normalizedCond.includes('fusarium') || normalizedCond.includes('rhizoctonia')) {
    return [
      CURES_CATALOG.find((c) => c.id === 'cure-trichoderma-inoculant')!,
      CURES_CATALOG.find((c) => c.id === 'cure-bacillus-subtilis')!,
      CURES_CATALOG.find((c) => c.id === 'cure-copper-octanoate')!,
    ].filter(Boolean);
  }

  // Fungal blights, leaf spots, anthracnose, blast, scab (Default fungal)
  return [
    CURES_CATALOG.find((c) => c.id === 'cure-copper-octanoate')!,
    CURES_CATALOG.find((c) => c.id === 'cure-bacillus-subtilis')!,
    CURES_CATALOG.find((c) => c.id === 'cure-azoxystrobin-systemic')!,
    CURES_CATALOG.find((c) => c.id === 'cure-mancozeb-wp')!,
  ].filter(Boolean);
}
