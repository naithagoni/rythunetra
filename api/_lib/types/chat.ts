import type { UIMessage } from 'ai'

export interface ChatRequestBody {
    messages: UIMessage[]
    language?: string
    district?: string
    mandal?: string
}
