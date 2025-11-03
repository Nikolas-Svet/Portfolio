import {defineStore} from 'pinia';
import type {IMessage, IMessagesBot} from "@/types/api";

export const useMessagesStore = defineStore('messages', {
    state: () => ({
        messages: [] as IMessagesBot[] | IMessage[],
        currentMessageId: 0 as number,
        isLastMessage: false,
        isOpenDialog: false,
        count_messages: 0,
        progress: 0,
        postcode: false,
        value: '' as string,
        currentMessageIdEdit: 0 as number,
        choices: [] as string[]
    }),

    actions: {
        setMessages(messages: IMessagesBot[]) {
            console.log("✅ Добавление сообщений:", messages);

            this.messages = messages;
        },

        addMessage(message: IMessagesBot | IMessage) {
            console.log("✅ Добавление сообщения");
            this.messages.push(message as any);

            nextTick(() => {
                const container = document.querySelector<HTMLElement>('.bot__dialog--content')
                if (container) {
                    if (container.scrollHeight > container.clientHeight) {
                        container.scrollTop = container.scrollHeight
                    }
                }
            })
        },

        setCurrentMessageId(id: number) {
            console.log("✅ Добавление сообщения id", id);
            this.currentMessageId = id
        },

        setIsLastMessage(isLastMessage: boolean) {
            this.isLastMessage = isLastMessage;
        },

        setIsOpenDialog(isOpenDialog: boolean) {
            this.isOpenDialog = isOpenDialog;
        },

        deleteLastMessage() {
            this.messages.splice(this.messages.length - 1, 1);
        }
    },
});
