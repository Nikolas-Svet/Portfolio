import { request, getCookie } from './request'
import type { IMessage, IMessagesBot, IResponseLoadMessages, responseApi } from '@/types/api'

export const botMessageApi = {
    async sendMessage(
        sessionId: number,
        messageId: number,
        text: string,
        file: File | Blob | null = null
    ): Promise<responseApi<IMessage>> {
        let payload: FormData | { request: number; question: number; value: string }
        let headers: Record<string, string>

        if (file) {
            const form = new FormData()
            form.append('request', String(sessionId))
            form.append('question', String(messageId))
            form.append('value', `"${text}"`)

            if (file.type === 'audio/webm') {
                form.append('file', file, 'voice.webm')
            } else {
                form.append('file', file, file instanceof File ? file.name : 'voice.webm')
            }

            payload = form
            headers = {'Content-Type': 'multipart/form-data'}
        } else {
            payload = {
                request: sessionId,
                question: messageId,
                value: text
            }
            headers = {'Content-Type': 'application/json'}
        }

        try {
            const response = await request.post(
                '/questionnaire/answers/',
                payload,
                {headers, withCredentials: true}
            )

            if (response.status === 200 || response.status === 201) {
                return {success: true, data: response.data as IMessage}
            } else {
                return {success: false, data: response.data as IMessage}
            }
        } catch (error: unknown) {
            console.error('Не удалось:', error)
            const responseData = error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined

            return {success: false, data: (responseData ?? {}) as IMessage}
        }
    },
    async getMessages(): Promise<responseApi<IResponseLoadMessages[]>> {
        try {
            const response = await request.get(`/questionnaire/requests/`)
            if (response.status === 200) {
                return {success: true, data: response.data as IResponseLoadMessages[]}
            } else {
                return {success: false, data: response.data as IResponseLoadMessages[]}
            }
        } catch (error: unknown) {
            console.error('Не удалось создать сессию:', error)
            return {success: false, data: []}
        }
    },
    async getNextQuestion(sessionId: string): Promise<responseApi<IMessagesBot[]>> {
        try {
            const response = await request.get(
                `/questionnaire/next/${sessionId}/?email=${localStorage.getItem("email")}`,
                {
                    headers: { 'X-CSRFToken': getCookie('csrftoken') ?? '' },
                    withCredentials: true
                }
            )

            return response.status === 200
                ? {success: true, data: response.data as IMessagesBot[]}
                : {success: false, data: response.data as IMessagesBot[]}
        } catch (error: unknown) {
            console.error('Не удалось получить сообщения:', error)
            return {success: false, data: []}
        }
    }

}
