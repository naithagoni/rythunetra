import { z, type ZodSchema } from 'zod'

export async function validateBody<T>(
    req: Request,
    schema: ZodSchema<T>,
): Promise<T | Response> {
    try {
        const body = await req.json()
        return schema.parse(body)
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Return user-friendly field errors without exposing internal schema details
            const errors = error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }))
            return new Response(JSON.stringify({ errors }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
