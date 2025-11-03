import {request} from './request'
import type {IMessage, IMessagesBot, IResponseLoadMessages, responseApi} from "@/types/api";
import {useMessagesStore} from "@/stores/messages";

function getCookie(name: string): string | null {
    const matches = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
    )
    return matches ? decodeURIComponent(matches[1]) : null
}

export const botMessageApi = {
    async sendMessage(
        sessionId: number,
        messageId: number,
        text: string,
        file: File | null = null
    ): Promise<responseApi> {
        let payload: any;
        let headers: Record<string, string>;

        if (file) {
            const form = new FormData();
            form.append('request', String(sessionId));
            form.append('question', String(messageId));
            form.append('value', '"' + text + '"');

            if (file.type === 'audio/webm') {
                console.log('audio/webm');
                form.append('file', file, 'voice.webm');
            } else {
                form.append('file', file, file.name);
            }

            payload = form;
            headers = {'Content-Type': 'multipart/form-data'};
        } else {
            payload = {
                request: sessionId,
                question: messageId,
                value: text
            };
            headers = {'Content-Type': 'application/json'};
        }

        const messagesStore = useMessagesStore()

        try {
            const response = await request.post(
                '/questionnaire/answers/',
                payload,
                {headers, withCredentials: true}
            );

            if (response.status === 200 || response.status === 201) {
                return {success: true, data: response.data as IMessage};
            } else {
                return {success: false, data: response.data};
            }
        } catch (error: any) {
            console.error('Не удалось:', error);
            if (error.response.data.detail === 'Неверный почтовый индекс') {

                messagesStore.postcode = true
            }
            return {success: false, data: error.response?.data || error.message};
        }
    },
    async getMessages(): Promise<responseApi> {
        try {
            const response = await request.get(`/questionnaire/requests/`)
            if (response.status === 200) {
                return {success: true, data: response.data as IResponseLoadMessages[]}
            } else {
                return {success: false, data: response.data}
            }
        } catch (error: any) {
            console.error('Не удалось создать сессию:', error)
            return {success: false, data: error.data}
        }
    },
    async getNextQuestion(sessionId: string): Promise<responseApi> {
        try {
            const response = await request.get(
                `/questionnaire/next/${sessionId}/?email=${localStorage.getItem("email")}`,
                {
                    headers: { 'X-CSRFToken': getCookie('csrftoken') },
                    withCredentials: true
                }
            );

            return response.status === 200
                ? {success: true, data: response.data as IMessagesBot}
                : {success: false, data: response.data};
        } catch (error: any) {
            console.error('Не удалось получить сообщения:', error);
            return {success: false, data: error.data};
        }
    }

}