import { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import Markdown from 'react-markdown'
import {
    MessageCircle,
    Send,
    Plus,
    Trash2,
    Loader2,
    Bot,
    User,
    X,
    ChevronLeft,
    Minimize2,
    AlertTriangle,
    RefreshCw,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { AI_ENABLED } from '@/config/env'
import {
    createChatSession,
    getChatSessions,
    getChatMessages,
    saveChatMessage,
    deleteChatSession,
} from '@/services/aiService'
import type { ChatSession } from '@/services/aiService'
import { useQuery, useQueryClient } from '@tanstack/react-query'

/** Extract concatenated text from UIMessage parts */
function getMessageText(msg: UIMessage): string {
    return msg.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join('')
}

export function ChatWidget() {
    const { t } = useTranslation()
    const { currentLanguage } = useLanguage()
    const { user, session } = useAuth()
    const queryClient = useQueryClient()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const [open, setOpen] = useState(false)
    const [showSessions, setShowSessions] = useState(false)
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
    const [initializing, setInitializing] = useState(false)
    const [input, setInput] = useState('')
    // Skip the session-loading effect when we just created a session in onSubmit
    const skipLoadRef = useRef(false)
    const activeSessionRef = useRef<string | null>(null)

    // Fetch sessions
    const { data: sessionsResult } = useQuery({
        queryKey: ['chat-sessions', user?.id],
        queryFn: () => getChatSessions(user!.id),
        enabled: open && !!user,
    })
    const sessions: ChatSession[] =
        (sessionsResult?.data as ChatSession[] | null) ?? []

    // Stable transport instance
    const transport = useMemo(
        () =>
            new DefaultChatTransport({
                api: '/api/ai/chat',
                headers: session?.access_token
                    ? { Authorization: `Bearer ${session.access_token}` }
                    : undefined,
                body: { language: currentLanguage },
            }),
        [currentLanguage, session?.access_token],
    )

    // Keep a ref in sync so onFinish always has current session id
    activeSessionRef.current = activeSessionId

    // Vercel AI SDK v6 chat hook
    const { messages, sendMessage, status, setMessages } = useChat({
        transport,
        onError: (err) => {
            console.error('Chat error:', err)
        },
        onFinish: async ({ message }) => {
            if (activeSessionRef.current) {
                await saveChatMessage(
                    activeSessionRef.current,
                    'assistant',
                    getMessageText(message),
                )
                queryClient.invalidateQueries({
                    queryKey: ['chat-sessions'],
                })
            }
        },
    })

    const isLoading = status === 'submitted' || status === 'streaming'

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Load messages when switching to an existing session
    useEffect(() => {
        if (!activeSessionId) return
        if (skipLoadRef.current) {
            skipLoadRef.current = false
            return
        }
        ;(async () => {
            const { data } = await getChatMessages(activeSessionId)
            if (data && data.length > 0) {
                setMessages(
                    data.map((m) => ({
                        id: m.id,
                        role: m.role as 'user' | 'assistant',
                        parts: [{ type: 'text' as const, text: m.content }],
                    })),
                )
            }
        })()
    }, [activeSessionId, setMessages])

    async function handleNewChat() {
        if (!user) return
        setInitializing(true)
        try {
            skipLoadRef.current = true
            const { data } = await createChatSession(user.id)
            if (data) {
                setActiveSessionId(data.id)
                setMessages([])
                setInput('')
                setShowSessions(false)
                queryClient.invalidateQueries({
                    queryKey: ['chat-sessions'],
                })
            }
        } finally {
            setInitializing(false)
        }
    }

    async function handleDeleteSession(id: string) {
        await deleteChatSession(id)
        if (activeSessionId === id) {
            setActiveSessionId(null)
            setMessages([])
            setInput('')
        }
        queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const text = input
        setInput('')

        // Create session if needed, but skip the load-messages effect
        if (!activeSessionId && user) {
            skipLoadRef.current = true
            const { data } = await createChatSession(user.id)
            if (data) {
                setActiveSessionId(data.id)
                activeSessionRef.current = data.id
                queryClient.invalidateQueries({
                    queryKey: ['chat-sessions'],
                })
                // Save user message to DB (for history) AFTER sendMessage
                // to avoid the effect loading it and duplicating
                sendMessage({ text })
                await saveChatMessage(data.id, 'user', text)
                return
            }
        } else if (activeSessionId) {
            // Save user message, then send — no effect race here
            await saveChatMessage(activeSessionId, 'user', text)
        }

        sendMessage({ text })
    }

    const suggestions = [
        t('chat.suggestion1'),
        t('chat.suggestion2'),
        t('chat.suggestion3'),
        t('chat.suggestion4'),
    ]

    return (
        <>
            {/* Floating Action Button - logged-in users only */}
            {user && !open && (
                <div className="fixed bottom-24 md:bottom-6 right-4 z-50 group">
                    <button
                        onClick={() => AI_ENABLED && setOpen(true)}
                        disabled={!AI_ENABLED}
                        className={`w-14 h-14 rounded-full shadow-elevated transition-all flex items-center justify-center ${
                            AI_ENABLED
                                ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-card-hover cursor-pointer'
                                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        }`}
                    >
                        <Bot className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        {AI_ENABLED && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                        )}
                    </button>
                    {!AI_ENABLED && (
                        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 right-0 w-52 px-3 py-2 text-xs text-white bg-neutral-800 rounded-lg shadow-lg text-center">
                            {t('settings.aiDisabledMessage')}
                            <div className="absolute right-5 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-800" />
                        </div>
                    )}
                </div>
            )}

            {/* Chat Panel */}
            {user && open && (
                <div className="fixed bottom-0 right-0 md:bottom-6 md:right-4 z-50 w-full h-full md:w-96 md:h-128 md:rounded-2xl bg-white shadow-modal border border-neutral-200 flex flex-col overflow-hidden md:max-h-[calc(100vh-3rem)]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary-600 text-white shrink-0">
                        <div className="flex items-center gap-2">
                            {showSessions ? (
                                <button
                                    onClick={() => setShowSessions(false)}
                                    className="p-1 rounded-lg hover:bg-primary-500"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                            ) : (
                                <Bot className="h-5 w-5" />
                            )}
                            <h2 className="font-semibold text-sm">
                                {showSessions
                                    ? t('chat.history')
                                    : t('chat.title')}
                            </h2>
                        </div>
                        <div className="flex items-center gap-1">
                            {!showSessions && (
                                <>
                                    <button
                                        onClick={() => setShowSessions(true)}
                                        className="p-1.5 rounded-lg hover:bg-primary-500"
                                        title={t('chat.history')}
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={handleNewChat}
                                        disabled={initializing}
                                        className="p-1.5 rounded-lg hover:bg-primary-500"
                                        title={t('chat.newChat')}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    setOpen(false)
                                    setShowSessions(false)
                                }}
                                className="p-1.5 rounded-lg hover:bg-primary-500 hidden md:block"
                                title="Minimize"
                            >
                                <Minimize2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setOpen(false)
                                    setShowSessions(false)
                                }}
                                className="p-1.5 rounded-lg hover:bg-primary-500 md:hidden"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Sessions list */}
                    {showSessions ? (
                        <div className="flex-1 overflow-y-auto">
                            {sessions.length === 0 ? (
                                <p className="text-xs text-neutral-400 p-4 text-center">
                                    {t('chat.noSessions')}
                                </p>
                            ) : (
                                sessions.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-neutral-50 text-sm border-b border-neutral-100 ${
                                            activeSessionId === s.id
                                                ? 'bg-primary-50 border-l-2 border-l-primary-500'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            setActiveSessionId(s.id)
                                            setShowSessions(false)
                                        }}
                                    >
                                        <span className="truncate flex-1">
                                            {s.title}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteSession(s.id)
                                            }}
                                            className="p-1 text-red-400 hover:text-red-600 shrink-0"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-2">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                            <Bot className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold">
                                                {t('chat.welcome')}
                                            </h3>
                                            <p className="text-xs text-neutral-500 mt-0.5">
                                                {t('chat.welcomeDesc')}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1.5 w-full">
                                            {suggestions.map((s, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setInput(s)}
                                                    className="text-left text-xs px-3 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((message: UIMessage) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}
                                        >
                                            {message.role === 'assistant' && (
                                                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Bot className="h-3.5 w-3.5 text-primary-600" />
                                                </div>
                                            )}
                                            <div
                                                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                                                    message.role === 'user'
                                                        ? 'bg-primary-600 text-white whitespace-pre-wrap'
                                                        : 'bg-neutral-100 text-neutral-900 chat-markdown'
                                                }`}
                                            >
                                                {message.role ===
                                                'assistant' ? (
                                                    <Markdown>
                                                        {getMessageText(
                                                            message,
                                                        )}
                                                    </Markdown>
                                                ) : (
                                                    getMessageText(message)
                                                )}
                                            </div>
                                            {message.role === 'user' && (
                                                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                                                    <User className="h-3.5 w-3.5 text-neutral-600" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                {isLoading && (
                                    <div className="flex gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                            <Bot className="h-3.5 w-3.5 text-primary-600" />
                                        </div>
                                        <div className="bg-neutral-100 rounded-xl px-3 py-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                                        </div>
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="flex gap-2 items-start">
                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                                        </div>
                                        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-700 max-w-[85%]">
                                            <p>{t('chat.error')}</p>
                                            <button
                                                onClick={() => {
                                                    const lastUserMsg = [
                                                        ...messages,
                                                    ]
                                                        .reverse()
                                                        .find(
                                                            (m) =>
                                                                m.role ===
                                                                'user',
                                                        )
                                                    if (lastUserMsg) {
                                                        sendMessage({
                                                            text: getMessageText(
                                                                lastUserMsg,
                                                            ),
                                                        })
                                                    }
                                                }}
                                                className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800"
                                            >
                                                <RefreshCw className="h-3 w-3" />
                                                {t('chat.retry')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form
                                onSubmit={onSubmit}
                                className="px-3 py-2.5 border-t border-neutral-200 shrink-0 safe-bottom"
                            >
                                <div className="flex gap-2">
                                    <input
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        placeholder={t('chat.inputPlaceholder')}
                                        className="input flex-1 text-sm py-2"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !input.trim()}
                                        className="btn-primary px-3 rounded-xl disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-neutral-400 mt-1 text-center">
                                    {t('chat.disclaimer')}
                                </p>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    )
}
