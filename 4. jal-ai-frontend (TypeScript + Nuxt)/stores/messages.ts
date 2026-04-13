import { nextTick } from 'vue'
import { defineStore } from 'pinia'
import type { BotConversationMessage, IMessage } from '@/types/api'
import { scrollBotDialogToBottom } from '@/services/chatDom'

export const useMessagesStore = defineStore('messages', {
    state: () => ({
        messages: [] as BotConversationMessage[],
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
        setMessages(messages: BotConversationMessage[]) {
            this.messages = messages
        },

        addMessage(message: BotConversationMessage) {
            this.messages.push(message)

            if (typeof document === 'undefined') {
                return
            }

            nextTick(() => {
                scrollBotDialogToBottom()
            })
        },

        setCurrentMessageId(id: number) {
            this.currentMessageId = id
        },

        setIsLastMessage(isLastMessage: boolean) {
            this.isLastMessage = isLastMessage
        },

        setIsOpenDialog(isOpenDialog: boolean) {
            this.isOpenDialog = isOpenDialog
        },

        resetDraft() {
            this.value = ''
            this.currentMessageIdEdit = 0
            this.choices = []
        },

        clearDraftContent() {
            this.value = ''
            this.choices = []
        },

        startEditMessage(message: IMessage) {
            this.currentMessageIdEdit = message.question
            this.choices = message.question_choices ?? []
            this.value = message.value
        },

        resetConversation() {
            this.messages = []
            this.currentMessageId = 0
            this.isLastMessage = false
            this.count_messages = 0
            this.progress = 0
            this.postcode = false
            this.resetDraft()
        },

        deleteLastMessage() {
            this.messages.pop()
        }
    },
})
