import type { LanguageModel } from 'ai'

export type AIProvider =
    | 'google'
    | 'openai'
    | 'azure'
    | 'anthropic'
    | 'mistral'
    | 'perplexity'
    | 'azure'

export interface AIConfig {
    provider: AIProvider
    apiKey: string
    model: string
    apiVersion?: string
    baseURL?: string
    maxRetries: number
}

export function getAIConfig(): AIConfig {
    const provider = (process.env.AI_PROVIDER || '') as AIProvider
    const apiKey = process.env.AI_API_KEY || ''
    const model = process.env.AI_MODEL || ''
    const apiVersion = process.env.AI_API_VERSION || undefined
    const baseURL = process.env.AI_BASE_URL || undefined
    const maxRetries = parseInt(process.env.AI_MAX_RETRIES || '1', 10)

    return { provider, apiKey, model, apiVersion, baseURL, maxRetries }
}

export async function createModel(): Promise<LanguageModel> {
    const config = getAIConfig()

    if (!config.apiKey) {
        throw new Error('AI_API_KEY is not set. Provide your API key in .env')
    }

    if (!config.provider) {
        throw new Error(
            'AI_PROVIDER is not set. Set it in .env (google, openai, anthropic, mistral, perplexity)',
        )
    }

    if (!config.model) {
        throw new Error(
            'AI_MODEL is not set. Set it in .env (e.g. gemini-2.0-flash, gpt-4o-mini)',
        )
    }

    switch (config.provider) {
        case 'google': {
            const { createGoogleGenerativeAI } = await import('@ai-sdk/google')
            const google = createGoogleGenerativeAI({
                apiKey: config.apiKey,
                ...(config.baseURL && { baseURL: config.baseURL }),
                ...(config.apiVersion && { apiVersion: config.apiVersion }),
            })
            return google(config.model)
        }

        case 'openai': {
            const { createOpenAI } = await import('@ai-sdk/openai')
            const openai = createOpenAI({
                apiKey: config.apiKey,
                ...(config.baseURL && { baseURL: config.baseURL }),
                ...(config.apiVersion && { apiVersion: config.apiVersion }),
            })
            return openai(config.model)
        }

        case 'azure': {
            //   {baseURL}/deployments/{model}/chat/completions?api-version={apiVersion}
            const { createAzure } = await import('@ai-sdk/azure')

            if (!config.baseURL) {
                throw new Error('AI_BASE_URL is required for azure provider')
            }

            const base = config.baseURL.replace(/\/$/, '')
            const azureProvider = createAzure({
                apiKey: config.apiKey,
                baseURL: `${base}/openai`,
                headers: { 'Ocp-Apim-Subscription-Key': config.apiKey },
                apiVersion: config.apiVersion || '2024-08-01-preview',
                useDeploymentBasedUrls: true,
            })
            // .chat() forces Chat Completions API (not Responses API)
            return azureProvider.chat(config.model) as LanguageModel
        }

        case 'perplexity': {
            // Perplexity uses OpenAI-compatible API
            const { createOpenAI } = await import('@ai-sdk/openai')
            const perplexity = createOpenAI({
                apiKey: config.apiKey,
                baseURL: config.baseURL || 'https://api.perplexity.ai',
                ...(config.apiVersion && { apiVersion: config.apiVersion }),
            })
            return perplexity(config.model)
        }

        default:
            throw new Error(
                `Unsupported AI_PROVIDER: "${config.provider}". ` +
                    'Supported: google, openai, azure, perplexity',
            )
    }
}

/** Check if an error is a quota/rate-limit error */
export function isQuotaError(error: unknown): boolean {
    if (!(error instanceof Error)) return false
    const msg = error.message?.toLowerCase() || ''
    return (
        msg.includes('quota') ||
        msg.includes('429') ||
        msg.includes('resource_exhausted') ||
        msg.includes('rate_limit') ||
        msg.includes('rate limit')
    )
}

/** Standard JSON error response */
export function errorResponse(error: unknown): Response {
    const quota = isQuotaError(error)
    return new Response(
        JSON.stringify({
            error: quota
                ? 'AI service quota exceeded. Please try again later.'
                : 'AI service error. Please try again.',
            code: quota ? 'QUOTA_EXCEEDED' : 'INTERNAL_ERROR',
        }),
        {
            status: quota ? 429 : 500,
            headers: { 'Content-Type': 'application/json' },
        },
    )
}

/** Response for missing API key */
export function notConfiguredResponse(): Response {
    return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
}
