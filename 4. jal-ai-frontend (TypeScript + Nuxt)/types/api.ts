export type responseApi<T = unknown> = {
    success: boolean
    data: T
}

export interface responseSession {
    id: number
    template: number
    status: string
    active_templates: number[]
    answered_questions?: number
    created_at: string
    answers: IResponseLoadMessage[]
    last_name: string | null
    salutation: string | null
    total_questions: number
}

export interface responseEmail {
    id: number
    template: number
    status: string
    active_templates: number[]
    created_at: string
    answers: IResponseLoadMessage[]
}

// {
//     "id":3,
//     "request":1,
//     "question":2,
//     "value":"...",
//     "file":null,
//     "transcript":null,
//     "transcribing":false
// }

export interface IMessage {
    id: number
    request: number
    question: number
    question_text: string
    value: string
    file: string | null
    file_url: string | null
    question_choices: string[]
    file_name?: string | null
    file_size?: number | null
    transcript: string | null
    transcribing: boolean
    is_user?: boolean
    date?: string | null
}

export interface IMessagesBot {
    id: number
    slug: string
    text?: string | null
    required: boolean
    value?: string | null
    answer_type: string
    order: number
    template: number
    choices?: string[]
    is_user: boolean
    date?: string | null

}

export interface IQuestion {
    id: number
    slug: string
    text: string
    required: boolean
    value: string
    answer_type: string
    order: number
    template: number
    choices: string[] | null
    is_user: boolean

}

export interface IResponseLoadMessages {
    id: number
    template: number
    status: string
    active_templates: number[]
    created_at: string
    answers: IResponseLoadMessage[]
}

export interface IResponseLoadMessage {
    id: number
    request: number
    question: number
    template: number
    question_text: string
    value: string
    file: string | null
    file_url?: string | null
    file_name?: string | null
    file_size?: number | null
    question_choices: string[]
    choices?: string[]
    transcript: string | null
    transcribing: boolean
}

export type BotConversationMessage = IMessagesBot | IMessage
