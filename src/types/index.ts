export type PlantOrgan = 'Foliage / Leaf' | 'Stem & Base' | 'Fruit & Pod' | 'Root & Soil';

export interface SymptomItem {
  id: string;
  name: string;
  organ: PlantOrgan;
  description: string;
  correlatedConditions: string[];
  severityWeight: number; // 1-5
}

export interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  category: 'Cereals & Grains' | 'Vegetables & Solanaceae' | 'Fruits & Orchards' | 'Cash & Plantation';
  description: string;
  keyDiseases: {
    name: string;
    pathogen: string;
    symptoms: string;
    severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  }[];
  optimalTemp: string;
  optimalHumidity: string;
  soilRequirements: string;
  scoutingTips: string;
}

export interface PresetSample {
  id: string;
  cropName: string;
  conditionName: string;
  category: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Nutrient' | 'Healthy';
  severity: 'Healthy' | 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  imageUrl: string;
  thumbnailUrl: string;
  fieldNotes: string;
  symptoms: string[];
  environment: {
    temperature: number;
    humidity: number;
    recentRainfall: string;
    soilCondition: string;
  };
}

export interface DifferentialDiagnosis {
  condition: string;
  distinguishingMarker: string;
}

export interface CureProduct {
  id: string;
  name: string;
  category: 'Organic Bio-Fungicide' | 'Systemic Curative' | 'Protective Contact' | 'Bio-Bactericide' | 'Nutrient Foliar' | 'Bio-Insecticide' | 'Soil Remediation';
  activeIngredient: string;
  targetInfections: string[];
  description: string;
  dosageInstructions: string;
  safetyIntervalDays: number;
  price: number;
  unit: string;
  certifiedOrganic: boolean;
  inStock: boolean;
  rating?: number;
}

export interface CartItem {
  product: CureProduct;
  quantity: number;
}

export interface DiagnosticResult {
  isPlantOrCrop: boolean;
  nonPlantDetected?: string;
  guidanceForRescan?: string;
  cropIdentified: string;
  confidenceScore: number;
  conditionName: string;
  conditionCategory: string;
  severityLevel: 'Healthy' | 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  severityScore: number;
  affectedOrgans: string[];
  progressionStage: string;
  detectedVisualMarkers: string[];
  causalOrganism: string;
  pathologySummary: string;
  urgency: string;
  yieldImpactEstimate: string;
  environmentalRiskFactors: string[];
  immediateContainmentSteps: string[];
  organicTreatments: string[];
  chemicalTreatments: string[];
  culturalPractices: string[];
  differentialDiagnoses: DifferentialDiagnosis[];
  preventativeGuidelines: string[];
  prescribedCures?: CureProduct[];
  timestamp?: string;
  id?: string;
  sampleImage?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    regionName?: string;
  };
}

export interface EnvironmentalContext {
  temperature: number;
  humidity: number;
  recentRainfall: 'None' | 'Light Dew / Showers' | 'Heavy Continuous Rain' | 'Flooding';
  soilCondition: 'Well-Drained Sandy Loam' | 'Heavy Clay / Waterlogged' | 'Dry / Drought-Stressed' | 'Saline / Compacted';
  gpsLocation?: {
    lat: number;
    lng: number;
    address?: string;
    regionName?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
