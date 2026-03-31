import { z } from 'zod'
import { authenticateRequest } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit } from '../middleware/rateLimit.js'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const createPreparationSchema = z.object({
    remedy_id: z.string().uuid(),
    custom_name: z.string().optional(),
    prepared_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    quantity: z.string().optional(),
    notes: z.string().optional(),
})

export async function POST(req: Request) {
    // Rate limit check
    const rateLimited = checkRateLimit(req)
    if (rateLimited) return rateLimited

    const user = await authenticateRequest(req)
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const data = await validateBody(req, createPreparationSchema)
    if (data instanceof Response) return data

    // Get shelf life for the remedy
    const { data: remedy } = await supabase
        .from('remedies')
        .select('shelf_life_days')
        .eq('id', data.remedy_id)
        .single()

    const shelfLifeDays = remedy?.shelf_life_days ?? 30

    // Calculate expiry date
    const expiryDate = new Date(data.prepared_date)
    expiryDate.setDate(expiryDate.getDate() + shelfLifeDays)

    const { data: preparation, error } = await supabase
        .from('preparations')
        .insert({
            user_id: user.id,
            remedy_id: data.remedy_id,
            custom_name: data.custom_name,
            prepared_date: data.prepared_date,
            expiry_date: expiryDate.toISOString().split('T')[0],
            quantity: data.quantity,
            notes: data.notes,
            status: 'active',
        })
        .select()
        .single()

    if (error) {
        console.error('Preparation creation error:', error.message)
        return new Response(
            JSON.stringify({ error: 'Failed to create preparation' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        )
    }

    return new Response(JSON.stringify({ data: preparation }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    })
}

export async function GET(req: Request) {
    // Rate limit check
    const rateLimited = checkRateLimit(req)
    if (rateLimited) return rateLimited

    const user = await authenticateRequest(req)
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const { data: preparations, error } = await supabase
        .from('preparations')
        .select(
            `
      *,
      remedy:remedies(
        id, slug, category,
        remedy_translations(name, language)
      )
    `,
        )
        .eq('user_id', user.id)
        .order('expiry_date', { ascending: true })

    if (error) {
        console.error('Preparation fetch error:', error.message)
        return new Response(
            JSON.stringify({ error: 'Failed to fetch preparations' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        )
    }

    return new Response(JSON.stringify({ data: preparations }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}
