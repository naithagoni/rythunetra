import { generateText, Output } from 'ai'
import { z } from 'zod'
import {
    createModel,
    getAIConfig,
    notConfiguredResponse,
    errorResponse,
} from './config.js'
import { getWeatherForDistrict, buildWeatherContext } from './weather.js'
import { authenticateRequest } from '../middleware/auth.js'
import { checkAIRateLimit } from '../middleware/rateLimit.js'

const SYSTEM_PROMPT = `You are an expert organic agricultural scientist specializing in soil science and crop selection for Telangana, India.

Based on the farmer's soil type, pH level, season, district, and available irrigation, recommend the best-suited crops to grow using organic farming methods.

IMPORTANT: RythuNetra is an organic-farming-only platform. All tips, soil improvement advice, and growing recommendations must be organic. NEVER suggest chemical fertilizers (urea, DAP, MOP, etc.), synthetic pesticides, or any inorganic inputs. Recommend organic alternatives like vermicompost, green manure, bio-fertilizers, neem cake, etc.

Guidelines:
- Recommend 4-6 crops ordered by suitability (best first).
- Consider local climate, soil conditions, market demand, and water requirements.
- Include both commercial and subsistence crops when appropriate.
- Provide practical organic growing tips specific to the farmer's conditions.
- Factor in the growing season (Kharif = June-Oct monsoon, Rabi = Nov-Mar winter, Zaid = Mar-Jun summer).
- Consider crops actually grown in Telangana districts.
- Give realistic expected yield ranges per acre for organic farming.
- If irrigation is limited, prioritize drought-tolerant crops.
- Provide the response suitable for small and medium organic farmers.`

const cropRecommendationSchema = z.object({
    recommendations: z.array(
        z.object({
            cropName: z.string().describe('Crop name in English'),
            cropNameTe: z.string().describe('Crop name in Telugu'),
            suitabilityScore: z
                .number()
                .min(0)
                .max(100)
                .describe('Suitability percentage for given conditions'),
            category: z
                .enum([
                    'cereal',
                    'pulse',
                    'oilseed',
                    'vegetable',
                    'fruit',
                    'spice',
                    'commercial',
                    'fiber',
                ])
                .describe('Crop category'),
            expectedYield: z
                .string()
                .describe(
                    'Expected yield per acre in English (e.g. "8-12 quintals/acre")',
                ),
            expectedYieldTe: z
                .string()
                .describe('Expected yield per acre in Telugu'),
            waterRequirement: z
                .enum(['low', 'moderate', 'high'])
                .describe('Water requirement level'),
            growingDuration: z
                .string()
                .describe(
                    'Approximate growing duration in English (e.g. "90-120 days")',
                ),
            growingDurationTe: z
                .string()
                .describe('Approximate growing duration in Telugu'),
            tips: z
                .array(z.string())
                .describe(
                    '2-3 practical growing tips in English for this crop with given soil',
                ),
            tipsTe: z
                .array(z.string())
                .describe(
                    '2-3 practical growing tips in Telugu for this crop with given soil',
                ),
            marketDemand: z
                .enum(['low', 'moderate', 'high'])
                .describe('Current market demand'),
        }),
    ),
    soilAnalysis: z
        .string()
        .describe('Brief analysis of the soil conditions described'),
    soilAnalysisTe: z.string().describe('Soil analysis translated to Telugu'),
    generalAdvice: z
        .string()
        .describe('General soil improvement tips for the farmer'),
    generalAdviceTe: z.string().describe('General advice translated to Telugu'),
})

export async function POST(req: Request) {
    try {
        // Rate limit check
        const rateLimited = checkAIRateLimit(req)
        if (rateLimited) return rateLimited

        // Require authentication
        const user = await authenticateRequest(req)
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const config = getAIConfig()
        if (!config.apiKey) return notConfiguredResponse()

        const {
            soilType,
            soilSubType,
            phLevel,
            season,
            district,
            mandal,
            irrigation,
            language,
        } = await req.json()

        if (!soilType || !season) {
            return new Response(
                JSON.stringify({
                    error: 'Soil type and season are required',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        }

        const model = await createModel()

        // Fetch weather context for the farmer's location (non-blocking on failure)
        let weatherContext = ''
        if (district) {
            const districtKey = district
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[()]/g, '')
            const mandalKey = mandal
                ? mandal.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '')
                : undefined
            const weather = await getWeatherForDistrict(districtKey, mandalKey)
            const locationName = mandal ? `${mandal}, ${district}` : district
            weatherContext = buildWeatherContext(weather, locationName)
        }

        const prompt = `Recommend the best crops for a farmer with these conditions:
            - Soil Type: ${soilType}
            - Soil Sub-Type: ${soilSubType || 'unknown'}
            - Soil pH: ${phLevel || 'unknown'}
            - Season: ${season}
            - District: ${district || 'Telangana region'}
            - Irrigation: ${irrigation || 'available'}
            ${language === 'te' ? '\nProvide Telugu translations and tips suitable for Telugu-speaking farmers.' : ''}
            ${weatherContext ? `\nCurrent weather conditions:\n${weatherContext}` : ''}`

        const { output } = await generateText({
            model,
            system: SYSTEM_PROMPT,
            prompt,
            output: Output.object({ schema: cropRecommendationSchema }),
            maxRetries: config.maxRetries,
        })

        return new Response(JSON.stringify(output), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error: unknown) {
        console.error('Recommendation error:', error)
        return errorResponse(error)
    }
}
