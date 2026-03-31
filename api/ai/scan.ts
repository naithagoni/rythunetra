import { generateText, Output } from 'ai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import {
    createModel,
    getAIConfig,
    notConfiguredResponse,
    errorResponse,
} from './config.js'
import { authenticateRequest } from '../middleware/auth.js'
import { checkAIRateLimit } from '../middleware/rateLimit.js'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const SYSTEM_PROMPT = `You are an expert organic agricultural plant pathologist specializing in crops grown in Telangana, India.

When given a photo of a plant, leaf, or crop:
1. Identify the plant/crop if possible.
2. Identify any visible disease, pest damage, or nutrient deficiency.
3. Assess the severity (low, moderate, high, critical).
4. List the key symptoms you observe.
5. Suggest immediate organic remedies and preventive measures.

IMPORTANT: Only recommend organic, biological, or cultural remedies. NEVER suggest chemical pesticides, synthetic fungicides, or chemical fertilizers. Use neem-based solutions, bio-agents (Trichoderma, Pseudomonas), botanical extracts, and cultural practices instead.

If the image does not show a plant or crop, respond with isPlant: false.
If no disease is detected, respond with diseaseDetected: false.

Provide responses that are practical for small-scale organic farmers in Telugu-speaking regions.`

const scanResultSchema = z.object({
    isPlant: z.boolean().describe('Whether the image shows a plant/crop'),
    cropName: z.string().describe('Identified crop name, or empty if unknown'),
    diseaseDetected: z.boolean().describe('Whether a disease was detected'),
    diseaseName: z.string().describe('Name of the disease, or empty if none'),
    severity: z
        .enum(['low', 'moderate', 'high', 'critical', 'none'])
        .describe('Severity of the disease'),
    confidence: z
        .number()
        .min(0)
        .max(100)
        .describe('Confidence percentage of the diagnosis'),
    symptoms: z.array(z.string()).describe('List of observed symptoms'),
    causes: z.array(z.string()).describe('Possible causes of the disease'),
    remedies: z
        .array(
            z.object({
                type: z
                    .enum(['organic', 'biological', 'cultural'])
                    .describe('Type of remedy'),
                description: z.string().describe('Remedy description'),
            }),
        )
        .describe('Suggested remedies'),
    preventions: z
        .array(z.string())
        .describe('Preventive measures for the future'),
    summary: z
        .string()
        .describe('Brief summary of the diagnosis in simple language'),
    summaryTe: z.string().describe('Brief summary translated to Telugu'),
})

export type ScanResult = z.infer<typeof scanResultSchema>

/**
 * Cross-reference AI-identified disease with the database.
 * Searches by English name (case-insensitive, partial match).
 * Returns matched disease + linked remedies if found.
 */
async function findDiseaseInDB(diseaseName: string) {
    if (!diseaseName) return null

    // Search diseases by English name (case-insensitive partial match)
    const { data: diseases } = await supabase
        .from('diseases')
        .select(
            `
            id,
            name,
            type,
            severity,
            image_urls,
            symptoms,
            primary_cause,
            preventions,
            treatments,
            disease_remedies(
                remedy_id,
                remedies(
                    id,
                    name,
                    type,
                    how_it_works,
                    usage_instructions,
                    preparation_instructions,
                    ingredients,
                    effectiveness
                )
            )
        `,
        )
        .ilike('name->>en', `%${diseaseName}%`)
        .limit(1)

    if (!diseases || diseases.length === 0) return null

    const disease = diseases[0]
    const remedies =
        disease.disease_remedies?.map(
            (dr: { remedy_id: string; remedies: Record<string, unknown>[] }) =>
                dr.remedies,
        ) ?? []

    return {
        id: disease.id,
        name: disease.name,
        type: disease.type,
        severity: disease.severity,
        imageUrls: disease.image_urls ?? [],
        symptoms: disease.symptoms ?? [],
        primaryCause: disease.primary_cause,
        preventions: disease.preventions ?? [],
        treatments: disease.treatments ?? [],
        remedies,
    }
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]

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

        const formData = await req.formData()
        const imageFile = formData.get('image') as File | null

        if (!imageFile) {
            return new Response(
                JSON.stringify({ error: 'No image provided' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        }

        // Validate file size
        if (imageFile.size > MAX_IMAGE_SIZE) {
            return new Response(
                JSON.stringify({
                    error: 'Image exceeds maximum size of 10 MB',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        }

        // Validate MIME type
        const mimeType = imageFile.type || 'image/jpeg'
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid image type. Allowed: JPEG, PNG, WebP, GIF',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        }

        // Convert file to base64
        const bytes = await imageFile.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')

        const model = await createModel()

        const { output } = await generateText({
            model,
            output: Output.object({ schema: scanResultSchema }),
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            image: `data:${mimeType};base64,${base64}`,
                        },
                        {
                            type: 'text',
                            text: 'Analyze this plant image for any diseases or issues.',
                        },
                    ],
                },
            ],
            maxRetries: config.maxRetries,
        })

        // Cross-reference with database if a disease was detected
        let dbMatch = null
        if (output?.diseaseDetected && output?.diseaseName) {
            dbMatch = await findDiseaseInDB(output.diseaseName)
        }

        return new Response(JSON.stringify({ ...output, dbMatch }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error: unknown) {
        console.error('Scan error:', error)
        return errorResponse(error)
    }
}
