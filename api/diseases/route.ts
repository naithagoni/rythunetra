import { z } from 'zod'
import { requireRole } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit } from '../middleware/rateLimit.js'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const createDiseaseSchema = z.object({
    slug: z
        .string()
        .min(3)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
    affected_crops: z.array(z.string()).min(1),
    land_type_ids: z.array(z.number()).min(1),
    translations: z
        .array(
            z.object({
                language: z.enum(['en', 'te']),
                title: z.string().min(3),
                description: z.string().min(10),
                symptoms: z.string().optional(),
                organic_solutions: z.string().optional(),
                aliases: z.array(z.string()).optional(),
            }),
        )
        .min(1),
})

export async function POST(req: Request) {
    // 0. Rate limit check
    const rateLimited = checkRateLimit(req)
    if (rateLimited) return rateLimited

    // 1. Auth + Role check
    const auth = await requireRole('admin')(req)
    if (auth instanceof Response) return auth

    // 2. Validate
    const data = await validateBody(req, createDiseaseSchema)
    if (data instanceof Response) return data

    // 3. Create disease
    const { data: disease, error: diseaseError } = await supabase
        .from('diseases')
        .insert({
            slug: data.slug,
            affected_crops: data.affected_crops,
            land_type_ids: data.land_type_ids,
            created_by: auth.id,
        })
        .select()
        .single()

    if (diseaseError) {
        console.error('Disease creation error:', diseaseError.message)
        return new Response(
            JSON.stringify({ error: 'Failed to create disease' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        )
    }

    // 4. Create translations
    const translations = data.translations.map((t) => ({
        disease_id: disease.id,
        ...t,
    }))

    await supabase.from('disease_translations').insert(translations)

    // 5. Audit log
    await supabase.from('audit_logs').insert({
        user_id: auth.id,
        action: 'disease_created',
        resource_type: 'disease',
        resource_id: disease.id,
        metadata: { slug: data.slug },
    })

    return new Response(JSON.stringify({ data: disease }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    })
}
