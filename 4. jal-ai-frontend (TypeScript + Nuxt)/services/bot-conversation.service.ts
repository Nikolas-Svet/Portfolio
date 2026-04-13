import { nextTick } from 'vue'
import { botMessageApi } from '@/api/botMessage'
import { botSessionApi } from '@/api/botSession'
import { Consts } from '@/consts'
import { useMessagesStore } from '@/stores/messages'
import type { IMessage, IMessagesBot, IResponseLoadMessage, responseSession } from '@/types/api'
import ValidationService from '@/services/validation.service'

export interface BotMessagePayload {
    sessionId: number | null
    messageId: number | null
    text: string | null
    file: File | Blob | null
}

const SECOND_TEMPLATE_INTRO_MESSAGE = `Herzlichen Glückwunsch und willkommen! \n\nLieber ${'${salutation}'} ${'${lastName}'}, \n\nzunächst möchten wir Ihnen herzlich gratulieren – Sie haben den ersten wichtigen Schritt bereits geschafft: Ihr Unternehmen erfüllt die grundlegenden Voraussetzungen, um über staatliche Förderprogramme unterstützt zu werden. Das ist ein bedeutender Vorteil und eröffnet spannende Möglichkeiten für Ihre Weiterentwicklung.\n\nDamit wir für Sie die bestmögliche, zugleich aber auch kosteneffiziente Lösung erarbeiten können, bitten wir Sie nun, die folgenden Fragen sorgfältig und so vollständig wie möglich zu beantworten. Je präziser Ihre Angaben sind, desto gezielter können wir auf Ihre individuelle Situation eingehen und passende Maßnahmen vorschlagen, die sowohl Ihre Prozesse verbessern als auch förderfähig sind.Durch die detaillierte Beantwortung dieser Fragen ermöglichen Sie uns, Ihnen passende Lösungen anzubieten, mit denen Sie:\n\n●\ttäglich weniger Zeit für administrative Aufgaben benötigen,\n●\tmehr Aufträge effizienter und wirtschaftlicher abwickeln können,\n●\twettbewerbsfähigere Preise für Ihre Kunden anbieten,\n●\tund gleichzeitig die Effizienz und Qualität Ihrer Arbeit spürbar steigern.\n\nUnsere Leistungen sind zudem förderfähig – Sie erhalten je nach Programm zwischen 50 und 80 % der Beratungskosten rückerstattet.\n\nBitte nehmen Sie sich etwas Zeit für die Fragen. Je genauer Ihre Antworten, desto effektiver und nachhaltiger können wir Sie unterstützen.\n\nWir freuen uns auf Ihre Antworten und darauf, gemeinsam mit Ihnen den nächsten Schritt zu gehen.\n\nMit besten Grüßen\nIhre digitale Assistentin Sara`

const SECOND_TEMPLATE_FINISH_MESSAGE = `Herzlichen Glückwunsch und vielen Dank für Ihre Zeit und Ihre Offenheit!\n\nNur etwa 5 % aller Unternehmer beschäftigen sich aktiv mit der detaillierten Beschreibung und digitalen Erfassung ihrer eigenen Arbeitsabläufe und Geschäftsprozesse – Sie gehören nun dazu.\n\nWir werten Ihre Angaben nun sorgfältig aus. Innerhalb von 72 Stunden erhalten Sie von uns:\n\n●\teine übersichtliche Zusammenfassung Ihrer Unternehmensstruktur und Prozesslandschaft,\n●\tein individuelles, unverbindliches Angebot mit konkreten Optimierungsvorschlägen,\n●\tsowie die Möglichkeit, direkt einen kostenfreien Termin mit einem unserer Berater zur Durchsprache zu vereinbaren.\n\nSollten bei der Analyse Rückfragen zu einzelnen Punkten auftauchen, werden wir Sie per E-Mail kontaktieren und um kurze Ergänzungen bitten.\n\nAuch wenn wir moderne KI-Technologie zur strukturierten Datenerfassung einsetzen, prüfen unsere qualifizierten Berater alle Angaben persönlich und final. Denn wir glauben an die Kombination aus Digitalisierung und menschlichem Verstand.\n\nWas wir empfehlen, wenden wir übrigens selbst täglich an – inklusive Automatisierung, digitaler Zusammenarbeit und effizienter Prozessgestaltung.\n\nWir freuen uns auf die nächsten Schritte mit Ihnen!`

const DEFAULT_GREETING_MESSAGE: IMessagesBot = {
    id: 0,
    slug: '0',
    text: 'Hallo, ich bin Sara ihre digitale Assistentin. Nutzen Sie Ihre Chance auf staatliche Unterstützung! Beantworten Sie kurz die folgenden Fragen – unser System prüft sofort, ob Sie förderfähig sind.',
    required: false,
    answer_type: '0',
    is_user: false,
    template: Consts.Template.first,
}

const DEFAULT_EMAIL_REQUEST_MESSAGE: IMessagesBot = {
    id: -1,
    slug: '0',
    text: 'Um Sie immer so präzise wie möglich beraten zu können brauchen wir Ihre E-Mail Adresse, bitte geben Sie die ein',
    required: false,
    answer_type: '0',
    template: Consts.Template.first,
    is_user: false,
}

const buildBotMessage = (message: Partial<IMessagesBot> & Pick<IMessagesBot, 'template'>): IMessagesBot => ({
    id: message.id ?? 0,
    slug: message.slug ?? '0',
    text: message.text ?? null,
    required: message.required ?? false,
    value: message.value,
    answer_type: message.answer_type ?? '0',
    order: message.order ?? 0,
    template: message.template,
    choices: message.choices,
    is_user: message.is_user ?? false,
})

const buildUserMessage = (message: Partial<IMessage> & Pick<IMessage, 'question' | 'value'>): IMessage => ({
    id: message.id ?? 0,
    request: message.request ?? 0,
    question: message.question,
    question_text: message.question_text ?? '',
    value: message.value,
    file: message.file ?? null,
    file_url: message.file_url ?? null,
    question_choices: message.question_choices ?? [],
    file_name: message.file_name ?? null,
    file_size: message.file_size ?? null,
    transcript: message.transcript ?? null,
    transcribing: message.transcribing ?? false,
    is_user: message.is_user ?? true,
})

const buildUserMessageFromResponse = (
    responseMessage: IResponseLoadMessage,
    valueOverride?: string | null
): IMessage => ({
    id: 0,
    request: responseMessage.request,
    question: responseMessage.question,
    question_text: responseMessage.question_text,
    value: valueOverride ?? responseMessage.value,
    file: responseMessage.file ?? null,
    file_url: responseMessage.file_url ?? null,
    question_choices: responseMessage.question_choices ?? [],
    file_name: responseMessage.file_name ?? null,
    file_size: responseMessage.file_size ?? null,
    transcript: responseMessage.transcript,
    transcribing: responseMessage.transcribing,
    is_user: true,
})

const getStoredValue = (key: string): string | null => {
    if (typeof window === 'undefined') {
        return null
    }

    return localStorage.getItem(key)
}

const setStoredValue = (key: string, value: string): void => {
    if (typeof window === 'undefined') {
        return
    }

    localStorage.setItem(key, value)
}

const isResponseDetail = (value: unknown): value is { detail?: string } => {
    return Boolean(value) && typeof value === 'object' && 'detail' in value
}

export default class BotConversationService {
    private readonly validation = new ValidationService()

    constructor(private readonly payload: BotMessagePayload | null) {}

    public async bootstrapConversation(): Promise<void> {
        const messagesStore = useMessagesStore()
        messagesStore.resetConversation()

        const email = getStoredValue('email')
        const currentTemplate = Number(getStoredValue('currentTemplate'))
        const sessionId = getStoredValue('sessionId')

        if (currentTemplate === Consts.Template.first || !email) {
            messagesStore.addMessage(DEFAULT_GREETING_MESSAGE)
            messagesStore.addMessage(DEFAULT_EMAIL_REQUEST_MESSAGE)
        }

        if (email && sessionId) {
            if (currentTemplate === Consts.Template.first) {
                messagesStore.addMessage(
                    buildUserMessage({
                        id: 0,
                        request: Number(sessionId),
                        question: 0,
                        value: email,
                        question_choices: [],
                        question_text: '',
                    })
                )
            }

            await this.loadMessages()
            await this.addMessage()
        }
    }

    public async sendMessage(): Promise<boolean> {
        const messagesStore = useMessagesStore()

        if (!this.payload) {
            return false
        }

        const email = getStoredValue('email')

        if (!email) {
            if (!this.payload.text || !this.validation.isEmail(this.payload.text)) {
                return false
            }

            setStoredValue('email', this.payload.text)
            messagesStore.addMessage(
                buildUserMessage({
                    id: 0,
                    request: 0,
                    question: 0,
                    value: this.payload.text,
                    question_choices: [],
                    question_text: '',
                })
            )

            await this.loadMessages()
            await this.addMessage()

            return true
        }

        if (!this.payload.sessionId || !this.payload.messageId) {
            return false
        }

        if (!this.payload.text && !this.payload.file) {
            return false
        }

        await nextTick()

        const requestMessageId = messagesStore.currentMessageIdEdit > 0
            ? messagesStore.currentMessageIdEdit
            : this.payload.messageId

        const response = await botMessageApi.sendMessage(
            this.payload.sessionId,
            requestMessageId,
            this.payload.text ?? '',
            this.payload.file
        )

        if (!response.success) {
            this.handlePostcodeError(response.data)
            return false
        }

        const sentMessage = response.data

        if (messagesStore.currentMessageIdEdit > 0) {
            this.updateEditedMessage(sentMessage)
            messagesStore.deleteLastMessage()
            messagesStore.resetDraft()
            await this.addMessage()
            return true
        }

        messagesStore.progress += 1
        const formattedValue = this.validation.formatPostalCodeValue(sentMessage.value)

        messagesStore.addMessage(
            buildUserMessage({
                id: sentMessage.id,
                request: sentMessage.request,
                question: sentMessage.question,
                question_text: sentMessage.question_text,
                value: formattedValue ?? sentMessage.value,
                file: sentMessage.file,
                file_url: sentMessage.file_url,
                file_name: sentMessage.file_name,
                file_size: sentMessage.file_size,
                question_choices: sentMessage.question_choices,
                transcript: sentMessage.transcript,
                transcribing: sentMessage.transcribing,
            })
        )

        await this.addMessage()
        await this.loadProgress()

        return true
    }

    public async loadMessages(): Promise<boolean> {
        const email = getStoredValue('email')
        if (!email) {
            return false
        }

        const response = await botSessionApi.sendEmail(email)
        const messagesStore = useMessagesStore()

        if (!response.success) {
            return false
        }

        const session = response.data
        this.syncSession(session, messagesStore)

        if (session.template === Consts.Template.second) {
            messagesStore.addMessage(
                buildBotMessage({
                    id: 0,
                    slug: '0',
                    order: 0,
                    template: session.template,
                    text: SECOND_TEMPLATE_INTRO_MESSAGE
                        .replace('${salutation}', session.salutation ?? '')
                        .replace('${lastName}', session.last_name ?? ''),
                    required: false,
                    answer_type: '0',
                    is_user: false,
                })
            )
        }

        if (session.template === Consts.Template.first) {
            messagesStore.progress = session.answered_questions ? session.answered_questions + 1 : session.answers.length + 1
        } else {
            messagesStore.progress = session.answered_questions ?? session.answers.length
        }

        messagesStore.count_messages = session.template === Consts.Template.first
            ? session.total_questions + 1
            : session.total_questions

        for (const answer of session.answers) {
            messagesStore.addMessage(
                buildBotMessage({
                    id: 0,
                    slug: '0',
                    order: 0,
                    template: answer.template,
                    text: answer.question_text,
                    choices: answer.choices,
                    required: false,
                    answer_type: '0',
                    is_user: false,
                })
            )

            const formattedValue = this.validation.formatPostalCodeValue(answer.value)

            messagesStore.addMessage(buildUserMessageFromResponse(answer, formattedValue ?? answer.value))
        }

        return true
    }

    public async addMessage(): Promise<void> {
        const messagesStore = useMessagesStore()
        const sessionId = getStoredValue('sessionId')

        if (!sessionId) {
            return
        }

        const response = await botMessageApi.getNextQuestion(sessionId)

        if (!response.success || !response.data.length) {
            return
        }

        const nextQuestion = response.data[0]

        if (
            nextQuestion.text?.includes('https://') &&
            getStoredValue('currentTemplate') === String(Consts.Template.first)
        ) {
            messagesStore.addMessage(
                buildBotMessage({
                    id: 0,
                    slug: '0',
                    text: nextQuestion.text.trim(),
                    required: false,
                    answer_type: '0',
                    order: 0,
                    template: Number(getStoredValue('currentTemplate')),
                    is_user: false,
                })
            )
            messagesStore.setIsLastMessage(true)
            return
        }

        messagesStore.setIsLastMessage(false)

        const isDuplicate = messagesStore.messages.some((message) => message.id === nextQuestion.id)
        if (isDuplicate) {
            return
        }

        messagesStore.setCurrentMessageId(nextQuestion.id)
        messagesStore.addMessage({
            ...nextQuestion,
            is_user: false,
        })
    }

    private async loadProgress(): Promise<void> {
        const email = getStoredValue('email')
        if (!email) {
            return
        }

        const response = await botSessionApi.sendEmail(email)
        const messagesStore = useMessagesStore()

        if (!response.success || !response.data) {
            return
        }

        const session = response.data
        messagesStore.progress = session.template === Consts.Template.first
            ? (session.answered_questions ?? session.answers.length) + 1
            : session.answered_questions ?? session.answers.length
        messagesStore.count_messages = session.template === Consts.Template.first
            ? session.total_questions + 1
            : session.total_questions

        if (
            session.template === Consts.Template.second &&
            session.answered_questions === session.total_questions &&
            !messagesStore.isLastMessage
        ) {
            messagesStore.addMessage(
                buildBotMessage({
                    id: 0,
                    slug: '0',
                    order: 0,
                    template: session.template,
                    text: SECOND_TEMPLATE_FINISH_MESSAGE,
                    required: false,
                    answer_type: '0',
                    is_user: false,
                })
            )
            messagesStore.setIsLastMessage(true)
        }
    }

    private updateEditedMessage(message: IMessage): void {
        const messagesStore = useMessagesStore()

        messagesStore.messages = messagesStore.messages.map((storedMessage) => {
            if ('question' in storedMessage && storedMessage.question === messagesStore.currentMessageIdEdit) {
                return {
                    ...storedMessage,
                    value: this.payload?.text ?? message.value,
                }
            }

            return storedMessage
        })
    }

    private syncSession(session: responseSession, messagesStore = useMessagesStore()): void {
        const storedSessionId = Number(getStoredValue('sessionId'))
        const storedTemplate = Number(getStoredValue('currentTemplate'))

        if (!storedSessionId) {
            setStoredValue('sessionId', String(session.id))
        } else if (storedSessionId !== session.id) {
            setStoredValue('sessionId', String(session.id))
        }

        if (!storedTemplate) {
            setStoredValue('currentTemplate', String(session.template))
        } else if (storedTemplate !== session.template) {
            setStoredValue('currentTemplate', String(session.template))
            messagesStore.progress = 0
        }
    }

    private handlePostcodeError(data: unknown): void {
        const messagesStore = useMessagesStore()

        if (isResponseDetail(data) && data.detail === 'Неверный почтовый индекс') {
            messagesStore.postcode = true
        }
    }
}
