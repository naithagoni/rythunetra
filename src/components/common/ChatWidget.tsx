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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/utils/cn'

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
    const skipLoadRef = useRef(false)
    const activeSessionRef = useRef<string | null>(null)

    const { data: sessionsResult } = useQuery({
        queryKey: ['chat-sessions', user?.id],
        queryFn: () => getChatSessions(user!.id),
        enabled: open && !!user,
    })
    const sessions: ChatSession[] =
        (sessionsResult?.data as ChatSession[] | null) ?? []

    const transport = useMemo(
        () =>
            new DefaultChatTransport({
                api: '/api/ai/chat',
                headers: session?.accessToken
                    ? { Authorization: `Bearer ${session.accessToken}` }
                    : undefined,
                body: { language: currentLanguage },
            }),
        [currentLanguage, session?.accessToken],
    )

    activeSessionRef.current = activeSessionId

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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

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

        if (!activeSessionId && user) {
            skipLoadRef.current = true
            const { data } = await createChatSession(user.id)
            if (data) {
                setActiveSessionId(data.id)
                activeSessionRef.current = data.id
                queryClient.invalidateQueries({
                    queryKey: ['chat-sessions'],
                })
                sendMessage({ text })
                await saveChatMessage(data.id, 'user', text)
                return
            }
        } else if (activeSessionId) {
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
        <TooltipProvider>
            {/* Floating Action Button */}
            {user && !open && (
                <div className="fixed bottom-24 md:bottom-6 right-4 z-50 group">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => AI_ENABLED && setOpen(true)}
                                disabled={!AI_ENABLED}
                                size="icon-lg"
                                className={cn(
                                    'w-14 h-14 rounded-full shadow-elevated',
                                    AI_ENABLED
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'bg-muted text-muted-foreground cursor-not-allowed',
                                )}
                            >
                                <Bot className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                {AI_ENABLED && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-background" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        {!AI_ENABLED && (
                            <TooltipContent side="left">
                                {t('settings.aiDisabledMessage')}
                            </TooltipContent>
                        )}
                    </Tooltip>
                </div>
            )}

            {/* Chat Panel */}
            {user && open && (
                <div className="fixed bottom-0 right-0 md:bottom-6 md:right-4 z-50 w-full h-full md:w-96 md:h-128 md:rounded-2xl bg-popover shadow-lg border border-border flex flex-col overflow-hidden md:max-h-[calc(100vh-3rem)]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
                        <div className="flex items-center gap-2">
                            {showSessions ? (
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => setShowSessions(false)}
                                    className="text-primary-foreground hover:bg-primary-foreground/10"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
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
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => setShowSessions(true)}
                                        title={t('chat.history')}
                                        className="text-primary-foreground hover:bg-primary-foreground/10"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={handleNewChat}
                                        disabled={initializing}
                                        title={t('chat.newChat')}
                                        className="text-primary-foreground hover:bg-primary-foreground/10"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => {
                                    setOpen(false)
                                    setShowSessions(false)
                                }}
                                className="text-primary-foreground hover:bg-primary-foreground/10 hidden md:inline-flex"
                            >
                                <Minimize2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => {
                                    setOpen(false)
                                    setShowSessions(false)
                                }}
                                className="text-primary-foreground hover:bg-primary-foreground/10 md:hidden"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Sessions list */}
                    {showSessions ? (
                        <ScrollArea className="flex-1">
                            {sessions.length === 0 ? (
                                <p className="text-xs text-muted-foreground p-4 text-center">
                                    {t('chat.noSessions')}
                                </p>
                            ) : (
                                sessions.map((s) => (
                                    <div
                                        key={s.id}
                                        className={cn(
                                            'flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-muted text-sm border-b border-border',
                                            activeSessionId === s.id &&
                                                'bg-primary/5 border-l-2 border-l-primary',
                                        )}
                                        onClick={() => {
                                            setActiveSessionId(s.id)
                                            setShowSessions(false)
                                        }}
                                    >
                                        <span className="truncate flex-1">
                                            {s.title}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteSession(s.id)
                                            }}
                                            className="text-destructive hover:text-destructive shrink-0"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    ) : (
                        <>
                            {/* Messages */}
                            <ScrollArea className="flex-1 px-3 py-3">
                                <div className="space-y-3">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-2 pt-8">
                                            <Avatar size="lg">
                                                <AvatarFallback className="bg-primary/10">
                                                    <Bot className="h-6 w-6 text-primary" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-sm font-semibold">
                                                    {t('chat.welcome')}
                                                </h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {t('chat.welcomeDesc')}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-1.5 w-full">
                                                {suggestions.map((s, i) => (
                                                    <Button
                                                        key={i}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setInput(s)
                                                        }
                                                        className="text-left justify-start h-auto py-2 text-xs font-normal"
                                                    >
                                                        {s}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map(
                                            (message: UIMessage) => (
                                                <div
                                                    key={message.id}
                                                    className={cn(
                                                        'flex gap-2',
                                                        message.role ===
                                                            'user' &&
                                                            'justify-end',
                                                    )}
                                                >
                                                    {message.role ===
                                                        'assistant' && (
                                                        <Avatar size="sm">
                                                            <AvatarFallback className="bg-primary/10">
                                                                <Bot className="h-3.5 w-3.5 text-primary" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <div
                                                        className={cn(
                                                            'max-w-[85%] rounded-xl px-3 py-2 text-sm',
                                                            message.role ===
                                                                'user'
                                                                ? 'bg-primary text-primary-foreground whitespace-pre-wrap'
                                                                : 'bg-muted text-foreground chat-markdown',
                                                        )}
                                                    >
                                                        {message.role ===
                                                        'assistant' ? (
                                                            <Markdown>
                                                                {getMessageText(
                                                                    message,
                                                                )}
                                                            </Markdown>
                                                        ) : (
                                                            getMessageText(
                                                                message,
                                                            )
                                                        )}
                                                    </div>
                                                    {message.role ===
                                                        'user' && (
                                                        <Avatar size="sm">
                                                            <AvatarFallback>
                                                                <User className="h-3.5 w-3.5" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                </div>
                                            ),
                                        )
                                    )}
                                    {isLoading && (
                                        <div className="flex gap-2">
                                            <Avatar size="sm">
                                                <AvatarFallback className="bg-primary/10">
                                                    <Bot className="h-3.5 w-3.5 text-primary" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="bg-muted rounded-xl px-3 py-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            </div>
                                        </div>
                                    )}
                                    {status === 'error' && (
                                        <div className="flex gap-2 items-start">
                                            <Avatar size="sm">
                                                <AvatarFallback className="bg-destructive/10">
                                                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="bg-destructive/5 border border-destructive/20 rounded-xl px-3 py-2 text-sm text-destructive max-w-[85%]">
                                                <p>{t('chat.error')}</p>
                                                <Button
                                                    variant="ghost"
                                                    size="xs"
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
                                                    className="mt-1 text-destructive hover:text-destructive gap-1"
                                                >
                                                    <RefreshCw className="h-3 w-3" />
                                                    {t('chat.retry')}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <form
                                onSubmit={onSubmit}
                                className="px-3 py-2.5 border-t border-border shrink-0 safe-bottom"
                            >
                                <div className="flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        placeholder={t(
                                            'chat.inputPlaceholder',
                                        )}
                                        className="flex-1 text-sm"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !input.trim()}
                                        size="icon"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1 text-center">
                                    {t('chat.disclaimer')}
                                </p>
                            </form>
                        </>
                    )}
                </div>
            )}
        </TooltipProvider>
    )
}
