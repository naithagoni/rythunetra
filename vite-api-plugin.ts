import dotenv from 'dotenv'
import { IncomingMessage, ServerResponse } from 'http'
import path from 'path'
import type { Plugin, ViteDevServer } from 'vite'

dotenv.config()

export function vercelApiPlugin(): Plugin {
    return {
        name: 'vercel-api-routes',
        configureServer(server: ViteDevServer) {
            server.middlewares.use(
                async (
                    req: IncomingMessage,
                    res: ServerResponse,
                    next: () => void,
                ) => {
                    if (!req.url?.startsWith('/api/')) {
                        return next()
                    }

                    // Strip query string for file resolution
                    const urlPath = req.url.split('?')[0]

                    // Try to resolve the API route file
                    // e.g. /api/ai/chat → api/ai/chat.ts
                    const possiblePaths = [
                        path.resolve(process.cwd(), `${urlPath.slice(1)}.ts`),
                        path.resolve(
                            process.cwd(),
                            `${urlPath.slice(1)}/route.ts`,
                        ),
                    ]

                    let routeModule: Record<
                        string,
                        (...args: unknown[]) => unknown
                    > | null = null
                    for (const filePath of possiblePaths) {
                        try {
                            // Use Vite's ssrLoadModule so we get HMR and TS support
                            const mod = await server.ssrLoadModule(filePath)
                            routeModule = mod
                            break
                        } catch {
                            // File doesn't exist, try next
                        }
                    }

                    if (!routeModule) {
                        return next()
                    }

                    const method = (req.method || 'GET').toUpperCase()
                    const handler = routeModule[method] || routeModule.default

                    if (typeof handler !== 'function') {
                        res.statusCode = 405
                        res.end(
                            JSON.stringify({
                                error: `Method ${method} not allowed`,
                            }),
                        )
                        return
                    }

                    try {
                        // Collect request body
                        const chunks: Buffer[] = []
                        for await (const chunk of req) {
                            chunks.push(chunk as Buffer)
                        }
                        const bodyBuffer = Buffer.concat(chunks)

                        // Build a Web Request object (what Vercel handlers expect)
                        const protocol = 'http'
                        const host = req.headers.host || 'localhost'
                        const url = `${protocol}://${host}${req.url}`

                        const headers = new Headers()
                        for (const [key, value] of Object.entries(
                            req.headers,
                        )) {
                            if (value) {
                                if (Array.isArray(value)) {
                                    value.forEach((v) => headers.append(key, v))
                                } else {
                                    headers.set(key, value)
                                }
                            }
                        }

                        const webRequest = new Request(url, {
                            method,
                            headers,
                            body:
                                method !== 'GET' && method !== 'HEAD'
                                    ? bodyBuffer
                                    : undefined,
                            duplex: 'half',
                        })

                        // Call the handler
                        const response = (await handler(webRequest)) as Response

                        // Write status and headers
                        res.statusCode = response.status
                        response.headers.forEach((value, key) => {
                            res.setHeader(key, value)
                        })

                        // Stream the response body
                        if (response.body) {
                            const reader = response.body.getReader()
                            const pump = async () => {
                                while (true) {
                                    const { done, value } = await reader.read()
                                    if (done) {
                                        res.end()
                                        return
                                    }
                                    res.write(value)
                                }
                            }
                            await pump()
                        } else {
                            res.end()
                        }
                    } catch (err) {
                        console.error(`API route error [${req.url}]:`, err)
                        if (!res.headersSent) {
                            res.statusCode = 500
                            res.setHeader('Content-Type', 'application/json')
                            res.end(
                                JSON.stringify({
                                    error: 'Internal server error',
                                }),
                            )
                        }
                    }
                },
            )
        },
    }
}
