import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Body parser with 30mb limit for high-res crop leaf images
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Helper function to call Gemini with model fallback
  async function callGeminiWithFallback(params: {
    parts: any[];
    systemInstruction: string;
    responseMimeType?: string;
    responseSchema?: any;
  }) {
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const config: any = {
          systemInstruction: params.systemInstruction,
        };
        if (params.responseMimeType) {
          config.responseMimeType = params.responseMimeType;
        }
        if (params.responseSchema) {
          config.responseSchema = params.responseSchema;
        }

        const response = await ai.models.generateContent({
          model,
          contents: { parts: params.parts },
          config,
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed, trying next fallback:`, err.message || err);
        lastError = err;
      }
    }

    throw lastError || new Error('All model attempts failed');
  }
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(apiKey),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Crop Diagnosis Endpoint
  app.post('/api/diagnose', async (req, res) => {
    try {
      const {
        imageBase64,
        imageMimeType,
        cropHint,
        selectedSymptoms,
        environmentalContext,
      } = req.body;

      if (!apiKey) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check your environment variables.',
        });
      }

      // Build multimodal parts
      const parts: any[] = [];

      if (imageBase64) {
        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.includes(';base64,')
          ? imageBase64.split(';base64,')[1]
          : imageBase64;

        parts.push({
          inlineData: {
            mimeType: imageMimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }

      const promptText = `
You are an expert plant pathologist, agronomist, and agricultural AI specialist.
Perform a thorough, clinical diagnostic analysis of this specimen.

STEP 1: BOTANICAL SPECIMEN VERIFICATION & NON-PLANT DIFFERENTIATION
Carefully inspect the specimen image before anything else:
- Determine if the image is actually a botanical specimen (such as a plant, leaf, foliage, stem, crop, blossom, fruit, vegetable, tree, seedling, or root).
- If the image contains a RANDOM NON-PLANT OBJECT, person, animal/pet, vehicle, indoor furniture, electronic gadget, tool, building, document, clothing, abstract image, or anything that is NOT plant tissue:
  * You MUST set "isPlantOrCrop": false.
  * Set "nonPlantDetected": Identify clearly what is actually shown in the image (e.g., "Motor vehicle / Car", "Indoor furniture / Chair", "Human face / Selfie", "Domestic cat", "Laptop computer", "Wristwatch").
  * Set "guidanceForRescan": Explain clearly why this cannot be diagnosed and provide practical instructions for photographing crop leaves, stems, or fruits (e.g., "Please capture a clear, well-lit close-up photograph of the affected plant leaf or stem with visible lesion margins.").
  * Set "cropIdentified": "Non-Botanical Object".
  * Set "conditionName": "Non-Plant Subject Detected".
  * Set "conditionCategory": "Non-Plant Object".
  * Set "severityLevel": "Healthy".
  * Set "severityScore": 0.
  * Set "confidenceScore": 99.
  * Set "causalOrganism": "None (Non-botanical subject)".
  * Set "pathologySummary": "The uploaded photograph depicts a non-botanical subject rather than agricultural crop foliage or plant tissue. Botanical pathology analysis requires images of leaves, stems, pods, or fruits.",
  * Set "urgency": "Re-photograph Crop Specimen".
  * Set "yieldImpactEstimate": "N/A".
  * Set "affectedOrgans": ["None"].
  * Set "detectedVisualMarkers": ["Non-plant textures/materials detected"].
  * Set "environmentalRiskFactors": [].
  * Set "immediateContainmentSteps": ["Please upload or capture a photo of a crop leaf, stem, or fruit."].
  * Set "organicTreatments": [].
  * Set "chemicalTreatments": [].
  * Set "culturalPractices": [].
  * Set "differentialDiagnoses": [].
  * Set "preventativeGuidelines": [].

- If the image IS a botanical specimen (or if no image is supplied and diagnosis is driven by selected symptoms):
  * Set "isPlantOrCrop": true.
  * Set "nonPlantDetected": "".
  * Set "guidanceForRescan": "".
  * Proceed with the full agronomic pathology diagnosis.

SPECIMEN & OBSERVATION INPUTS:
- Crop Species Identification: Detect and identify the plant or crop species automatically from macroscopic visual features in the image (common name and Latin botanical binomial).
- User-Observed Visual Symptoms: ${Array.isArray(selectedSymptoms) && selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : 'None explicitly specified (derive entirely from image)'}
- Environmental & Microclimate Data:
  * Temperature: ${environmentalContext?.temperature ? environmentalContext.temperature + '°C' : 'Unspecified'}
  * Humidity / Wetness: ${environmentalContext?.humidity ? environmentalContext.humidity + '%' : 'Unspecified'}
  * Recent Rainfall / Foliar Wetness: ${environmentalContext?.recentRainfall || 'Normal / Unspecified'}
  * Soil Condition / Drainage: ${environmentalContext?.soilCondition || 'Unspecified'}

TASK INSTRUCTIONS (For Plant Specimens):
1. Identify the crop or plant species (common name and scientific name), botanical family, and plant organ shown (e.g. leaf, stem, fruit, pod, ear).
2. If healthy, identify as "Healthy" condition with high vigor.
3. If diseased or stressed, accurately diagnose the primary pathology (fungal, bacterial, viral, nutrient deficiency, insect/pest damage, or environmental abiotic stress).
4. Evaluate visual markers on the plant tissue (e.g. chlorotic halos, necrotic concentric rings, water-soaked margins, fungal sporulation, vein yellowing, stunting).
5. Specify severity score (0 to 100) and severity level (Healthy, Mild, Moderate, Severe, Critical).
6. Provide immediate containment triage, actionable eco-friendly/organic treatments, specific chemical fungicide/bactericide/insecticide options (including active ingredient names and application cautions), and agronomic cultural adjustments.
7. Provide 2-3 differential diagnoses (lookalike diseases) and how a field scout can differentiate them.
8. Assess yield impact risk if left untreated within 7-14 days.

Return the response adhering strictly to the JSON schema.
`;

      parts.push({ text: promptText });

      const responseText = await callGeminiWithFallback({
        parts,
        systemInstruction:
          'You are a senior agricultural research scientist and plant disease diagnostic expert. Deliver rigorous, evidence-based agronomic diagnoses with clear biological distinctions, actionable treatment schedules, and risk assessments. You must strictly verify whether the image is actually a plant or random object before diagnosing.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPlantOrCrop: {
              type: Type.BOOLEAN,
              description: 'True if the image is a plant, leaf, crop, fruit, or botanical tissue; false if it is a random non-plant object, vehicle, furniture, animal, person, tool, or non-botanical item.',
            },
            nonPlantDetected: {
              type: Type.STRING,
              description: 'If isPlantOrCrop is false, description of the detected non-plant object (e.g. Automobile, Pet cat, Chair).',
            },
            guidanceForRescan: {
              type: Type.STRING,
              description: 'Guidance on how to properly photograph a plant or crop leaf for accurate diagnosis.',
            },
            cropIdentified: {
              type: Type.STRING,
              description: 'Full common name and scientific botanical name of the crop, or Non-Botanical Object.',
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'Diagnostic confidence level from 0 to 100.',
            },
            conditionName: {
              type: Type.STRING,
              description: 'Name of the primary diagnosis (e.g. Late Blight, Apple Scab, Nitrogen Deficiency, Healthy Specimen, or Non-Plant Subject Detected).',
            },
            conditionCategory: {
              type: Type.STRING,
              description: 'Category: Fungal, Bacterial, Viral, Pest Damage, Nutrient Deficiency, Abiotic Stress, Healthy, or Non-Plant Object.',
            },
            severityLevel: {
              type: Type.STRING,
              description: 'Healthy, Mild, Moderate, Severe, or Critical.',
            },
            severityScore: {
              type: Type.NUMBER,
              description: 'Severity index from 0 (completely healthy) to 100 (total devastation).',
            },
            affectedOrgans: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Plant organs showing symptoms (e.g. Foliage/Leaves, Stem, Petiole, Fruit, Root).',
            },
            progressionStage: {
              type: Type.STRING,
              description: 'Disease progression phase (e.g. Early Incubation, Active Sporulation, Advanced Necrotic Collapse).',
            },
            detectedVisualMarkers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific visual pathological patterns recognized on the tissue.',
            },
            causalOrganism: {
              type: Type.STRING,
              description: 'Causal organism (scientific name of pathogen or deficiency physiological cause).',
            },
            pathologySummary: {
              type: Type.STRING,
              description: 'Concise botanical explanation of how this condition attacks plant physiology and cellular structure.',
            },
            urgency: {
              type: Type.STRING,
              description: 'Urgency rating: Routine Monitoring, Advisory Action, Urgent Triage, or Emergency Quarantine.',
            },
            yieldImpactEstimate: {
              type: Type.STRING,
              description: 'Projected yield loss percentage and timeframe if untreated.',
            },
            environmentalRiskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Weather and microclimate triggers that accelerate this condition.',
            },
            immediateContainmentSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Steps to take immediately in the next 24-48 hours.',
            },
            organicTreatments: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Certified organic, bio-fungicide, microbial, and natural remediation tactics.',
            },
            chemicalTreatments: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Standard agronomic active ingredients, application methods, and pre-harvest intervals.',
            },
            culturalPractices: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Cultural controls (crop rotation, irrigation scheduling, pruning, spacing).',
            },
            differentialDiagnoses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  distinguishingMarker: { type: Type.STRING },
                },
                required: ['condition', 'distinguishingMarker'],
              },
              description: 'Alternative lookalike conditions and key differentiator.',
            },
            preventativeGuidelines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Next-season and ongoing prevention recommendations.',
            },
          },
          required: [
            'isPlantOrCrop',
            'cropIdentified',
            'confidenceScore',
            'conditionName',
            'conditionCategory',
            'severityLevel',
            'severityScore',
            'affectedOrgans',
            'progressionStage',
            'detectedVisualMarkers',
            'causalOrganism',
            'pathologySummary',
            'urgency',
            'yieldImpactEstimate',
            'environmentalRiskFactors',
            'immediateContainmentSteps',
            'organicTreatments',
            'chemicalTreatments',
            'culturalPractices',
            'differentialDiagnoses',
            'preventativeGuidelines',
          ],
        },
      });

      const parsedData = JSON.parse(responseText || '{}');

      return res.json({
        success: true,
        diagnosis: parsedData,
      });
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to process crop diagnostic analysis',
      });
    }
  });

  // AI Agronomist Consultation Chat
  app.post('/api/consult', async (req, res) => {
    try {
      const { diagnosisSummary, question, chatHistory } = req.body;

      if (!apiKey) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured on the server.',
        });
      }

      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required' });
      }

      const prompt = `
You are an expert field agronomist and crop pathologist answering a grower or field scout's inquiry.
DIAGNOSTIC CONTEXT:
${diagnosisSummary ? JSON.stringify(diagnosisSummary, null, 2) : 'General Agronomic Query'}

PREVIOUS MESSAGES:
${Array.isArray(chatHistory) ? chatHistory.map((m: any) => `${m.role}: ${m.content}`).join('\n') : 'None'}

FARMER / SCOUT QUESTION:
"${question}"

Provide a clear, practical, expert agricultural response with safe dosage guidelines, spray timing tips (avoiding hot sun/wind), environmental precautions, and step-by-step guidance. Keep it professional, structured, and easy to read in the field.
`;

      const answerText = await callGeminiWithFallback({
        parts: [{ text: prompt }],
        systemInstruction:
          'You are an authoritative agricultural consultant and extension specialist. Provide practical, accurate, and safety-conscious farming recommendations.',
      });

      return res.json({
        success: true,
        answer: answerText || 'Unable to generate response at this time.',
      });
    } catch (err: any) {
      console.error('Consultation error:', err);
      return res.status(500).json({
        error: err.message || 'Agronomist consultation failed.',
      });
    }
  });

  // Serve static files in production or Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CureCrop Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
