import { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import {
    MessageCircle,
    Send,
    Plus,
    Trash2,
    Loader2,
    Bot,
    User,
    ChevronLeft,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { usePageTitle } from '@/hooks/usePageTitle'
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

export function ChatPage() {
    const { t } = useTranslation()
    const { currentLanguage } = useLanguage()
    const { user, session } = useAuth()
    usePageTitle('AI Farm Advisor — Chat')
    const queryClient = useQueryClient()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
    const [showSidebar, setShowSidebar] = useState(false)
    const [initializing, setInitializing] = useState(false)
    const [input, setInput] = useState('')

    // User's district and mandal for weather-aware AI advisory
    const district = user?.district || ''
    const mandal = user?.mandal || ''

    // Fetch sessions
    const { data: sessionsResult } = useQuery({
        queryKey: ['chat-sessions', user?.id],
        queryFn: () => getChatSessions(user!.id),
        enabled: !!user,
    })
    const sessions: ChatSession[] =
        (sessionsResult?.data as ChatSession[] | null) ?? []

    // Stable transport instance (recreated when language, district or mandal changes)
    const transport = useMemo(
        () =>
            new DefaultChatTransport({
                api: '/api/ai/chat',
                headers: session?.accessToken
                    ? { Authorization: `Bearer ${session.accessToken}` }
                    : undefined,
                body: { language: currentLanguage, district, mandal },
            }),
        [currentLanguage, district, mandal, session?.accessToken],
    )

    // Vercel AI SDK v6 chat hook
    const { messages, sendMessage, status, setMessages } = useChat({
        transport,
        onFinish: async ({ message }) => {
            // Save assistant response to DB
            if (activeSessionId) {
                await saveChatMessage(
                    activeSessionId,
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

    // Load messages when session changes
    useEffect(() => {
        if (!activeSessionId) return
        ;(async () => {
            const { data } = await getChatMessages(activeSessionId)
            if (data) {
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
            const { data } = await createChatSession(user.id)
            if (data) {
                setActiveSessionId(data.id)
                setMessages([])
                setInput('')
                setShowSidebar(false)
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
        if (!input.trim()) return

        const text = input
        setInput('')

        // Auto-create session if none active
        if (!activeSessionId && user) {
            const { data } = await createChatSession(user.id)
            if (data) {
                setActiveSessionId(data.id)
                queryClient.invalidateQueries({
                    queryKey: ['chat-sessions'],
                })
                // Save user message to DB
                await saveChatMessage(data.id, 'user', text)
            }
        } else if (activeSessionId) {
            await saveChatMessage(activeSessionId, 'user', text)
        }

        sendMessage({ text })
    }

    // Suggestion chips for empty state
    const suggestions = [
        t('chat.suggestion1'),
        t('chat.suggestion2'),
        t('chat.suggestion3'),
        t('chat.suggestion4'),
    ]

    return (
        <div className="flex h-[calc(100vh-8rem)] max-w-4xl mx-auto">
            {/* Sidebar - sessions list */}
            <div
                className={`${
                    showSidebar
                        ? 'fixed inset-0 z-50 bg-card md:static md:z-auto'
                        : 'hidden'
                } md:block w-full md:w-64 border-r border-border flex flex-col shrink-0`}
            >
                <div className="p-3 border-b border-border flex items-center justify-between">
                    <h2 className="font-semibold text-sm">
                        {t('chat.history')}
                    </h2>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={handleNewChat}
                            disabled={initializing}
                            title={t('chat.newChat')}
                        >
                            <Plus />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="md:hidden"
                            onClick={() => setShowSidebar(false)}
                        >
                            <ChevronLeft />
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                    {sessions.length === 0 ? (
                        <p className="text-xs text-muted-foreground p-3">
                            {t('chat.noSessions')}
                        </p>
                    ) : (
                        sessions.map((s) => (
                            <div
                                key={s.id}
                                className={`group/session flex items-center justify-between gap-1 px-3 py-2.5 cursor-pointer text-sm transition-colors hover:bg-surface-hover ${
                                    activeSessionId === s.id ? 'bg-accent' : ''
                                }`}
                                onClick={() => {
                                    setActiveSessionId(s.id)
                                    setShowSidebar(false)
                                }}
                            >
                                <span className="truncate flex-1">
                                    {s.title}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    className="shrink-0 text-destructive hover:text-destructive opacity-0 group-hover/session:opacity-100"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteSession(s.id)
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Chat header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="md:hidden p-1 rounded-lg hover:bg-muted"
                    >
                        <MessageCircle className="size-5" />
                    </button>
                    <div className="size-8 rounded-xl bg-muted flex items-center justify-center shadow-sm">
                        <Bot className="size-4 text-muted-foreground" />
                    </div>
                    <h1 className="font-semibold text-foreground">
                        {t('chat.title')}
                    </h1>
                </div>

                {/* Messages */}
                <div className="flex flex-col flex-1 overflow-y-auto px-4 py-4 gap-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                            <div className="size-16 rounded-2xl bg-muted flex items-center justify-center shadow-sm">
                                <Bot className="size-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h2 className="text-display-sm text-foreground">
                                    {t('chat.welcome')}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {t('chat.welcomeDesc')}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(s)}
                                        className="text-left text-sm px-3.5 py-2.5 rounded-xl border border-border hover:bg-muted hover:border-border transition-all duration-200"
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
                                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <Bot className="size-4 text-muted-foreground" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                                        message.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-foreground border border-border'
                                    }`}
                                >
                                    {getMessageText(message)}
                                </div>
                                {message.role === 'user' && (
                                    <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <User className="size-4 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <Bot className="size-4 text-muted-foreground" />
                            </div>
                            <div className="bg-secondary border border-border rounded-xl px-4 py-2.5">
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                    onSubmit={onSubmit}
                    className="px-4 py-3 border-t border-border"
                >
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('chat.inputPlaceholder')}
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="size-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                        {t('chat.disclaimer')}
                    </p>
                </form>
            </div>
        </div>
    )
}
