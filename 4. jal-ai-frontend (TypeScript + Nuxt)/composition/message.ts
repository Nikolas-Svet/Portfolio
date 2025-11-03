import {nextTick} from "vue";
import {botMessageApi} from "@/api/botMessage";
import {useMessagesStore} from "@/stores/messages";
import type {IMessage, IMessagesBot} from "@/types/api";
import {botSessionApi} from "@/api/botSession";
import Validation from "@/composition/validation";
import {Consts} from "@/consts";

export interface IMessagePayload {
    sessionId: number | null;
    messageId: number | null;
    text: string | null;
    file: File | null;
}

class Message {
    sessionId: number | null;
    messageId: number | null;
    text: string | null;
    file: File | null;

    constructor(data: IMessagePayload | null) {
        if (!data) {
            this.sessionId = null;
            this.messageId = null;
            this.text = null;
            this.file = null;
            return
        }
        this.sessionId = data!.sessionId;
        this.messageId = data!.messageId;
        this.text = data!.text;
        this.file = data!.file;
    }

    public async sendMessage(): Promise<boolean> {
        const messagesStore = useMessagesStore()
        const email = localStorage.getItem('email')

        if (!email) {
            console.log("[Log] email в локальном хранилище пустой, выполняем запрос /login для добавления почты")
            const validation = new Validation()
            if (!await validation.checkEmail(String(this.text))) {
                return false;
            }
            localStorage.setItem('email', String(this.text))
            const mes = {
                id: 0,
                slug: "0",
                value: String(this.text),
                required: false,
                answer_type: "0",
                template: 1,
                is_user: true,
                file_name: null,
                file_size: null,
            }
            messagesStore.addMessage(mes)
            await this.loadMessages()
            await this.addMessage()
            return true
        }
        console.log(`[Log] отправляем запрос /answers с параметрами sessionId = ${this.sessionId}, messageId = ${this.messageId}, text = ${this.text}, file = ${this.file!}`)

        if (!this.messageId || !this.sessionId) {
            console.error('messageId or sessionId is missing');
        }

        if (this.text === '' && !this.file) {
            console.error('text and file is missing');
        }

        await nextTick()

        if (messagesStore.currentMessageIdEdit > 0) {
            this.messageId = messagesStore.currentMessageIdEdit
        }

        const response = await botMessageApi.sendMessage(
            this.sessionId!,
            this.messageId!,
            this.text!,
            this.file!,
        )

        if (response.success) {
            const validation = new Validation()

            if (messagesStore.currentMessageIdEdit > 0) {
                for (let i = 0; i < messagesStore.messages.length; i++) {
                    if (messagesStore.messages[i]!.question === messagesStore.currentMessageIdEdit) {
                        messagesStore.messages[i]!.value = this.text
                    }
                }
                messagesStore.currentMessageIdEdit = 0
                messagesStore.value = ''
                messagesStore.deleteLastMessage()
                this.addMessage()
                return response.success
            }
            messagesStore.progress += 1
            let postalCode = await validation.checkIsPostcodeMessgae(response.data.value);
            const new_message: IMessage = {
                id: response.data.id,
                request: response.data.request,
                question: response.data.question,
                question_text: response.data.question_text,
                value: postalCode ? postalCode : response.data.value,
                file: response.data.file,
                file_url: response.data.file_url,
                file_name: response.data.file_name,
                file_size: response.data.file_size,
                is_user: true,
                question_choices: response.data.question_choices,
                transcript: response.data.transcript,
                transcribing: response.data.transcribing
            }
            messagesStore.addMessage(new_message)
            await this.addMessage()
        }

        await this.loadProgress()

        return response.success
    }

    public async loadMessages() {
        console.log(`[Log] загрузка сообщений, email = ${String(localStorage.getItem('email'))}`);
        const response = await botSessionApi.sendEmail(String(localStorage.getItem('email')))
        const messagesStore = useMessagesStore()
        if (response.success) {

            const message = response.data

            const sessionId = Number(localStorage.getItem("sessionId"))

            if (!sessionId) {
                console.log(`[Log] Отсутствует sessionId, добавляем новый: `, message.id)
                localStorage.setItem("sessionId", message.id)
            } else if (sessionId !== message.id) {
                console.log(`[Log] sessionId устарел, обновляем старый ${sessionId} на новый: `, message.id)
                localStorage.setItem("sessionId", message.id)
            }
            if (message.template === Consts.Template.second) {
                console.log(`[Log] response.template == ${Consts.Template.second}, добавляем приветственное сообщение для второго шаблона`)
                const mes: IMessagesBot = {
                    id: 0,
                    slug: "0",
                    order: 0,
                    template: message.template,
                    text: `Herzlichen Glückwunsch und willkommen! \n\nLieber ${message.salutation} ${message.last_name}, \n\nzunächst möchten wir Ihnen herzlich gratulieren – Sie haben den ersten wichtigen Schritt bereits geschafft: Ihr Unternehmen erfüllt die grundlegenden Voraussetzungen, um über staatliche Förderprogramme unterstützt zu werden. Das ist ein bedeutender Vorteil und eröffnet spannende Möglichkeiten für Ihre Weiterentwicklung.\n\nDamit wir für Sie die bestmögliche, zugleich aber auch kosteneffiziente Lösung erarbeiten können, bitten wir Sie nun, die folgenden Fragen sorgfältig und so vollständig wie möglich zu beantworten. Je präziser Ihre Angaben sind, desto gezielter können wir auf Ihre individuelle Situation eingehen und passende Maßnahmen vorschlagen, die sowohl Ihre Prozesse verbessern als auch förderfähig sind.Durch die detaillierte Beantwortung dieser Fragen ermöglichen Sie uns, Ihnen passende Lösungen anzubieten, mit denen Sie:\n\n●	täglich weniger Zeit für administrative Aufgaben benötigen,\n●	mehr Aufträge effizienter und wirtschaftlicher abwickeln können,\n●	wettbewerbsfähigere Preise für Ihre Kunden anbieten,\n●	und gleichzeitig die Effizienz und Qualität Ihrer Arbeit spürbar steigern.\n\nUnsere Leistungen sind zudem förderfähig – Sie erhalten je nach Programm zwischen 50 und 80 % der Beratungskosten rückerstattet.\n\nBitte nehmen Sie sich etwas Zeit für die Fragen. Je genauer Ihre Antworten, desto effektiver und nachhaltiger können wir Sie unterstützen.\n\nWir freuen uns auf Ihre Antworten und darauf, gemeinsam mit Ihnen den nächsten Schritt zu gehen.\n\nMit besten Grüßen\nIhre digitale Assistentin Sara`,
                    required: false,
                    answer_type: "0",
                    is_user: false,
                }
                messagesStore.addMessage(mes)
            }
            // else if (message.template === Consts.Template.first) {
            //     const mes = {
            //         id: 0,
            //         slug: "0",
            //         value: localStorage.getItem("email"),
            //         required: false,
            //         answer_type: "0",
            //         template: 1,
            //         is_user: true,
            //         file_name: null,
            //         file_size: null,
            //     }
            //     messagesStore.addMessage(mes)
            // }

            if (!localStorage.getItem("currentTemplate")) {
                console.log(`[Log] в локальном хранилище нету currentTemplate, устанавливаем его: `, message.template)
                localStorage.setItem("currentTemplate", message.template);
            } else if (Number(localStorage.getItem("currentTemplate")) !== message.template) {
                console.log(`[Log] В локальном хранилище не совпадает шаблон с шаблоном из запроса, обновляем шаблон в хранилище: `, message.template)
                localStorage.setItem("currentTemplate", JSON.stringify(message.template))
                messagesStore.progress = 0
            }
            messagesStore.count_messages = message.template === Consts.Template.first ? message.total_questions + 1 : message.total_questions
            if (messagesStore.progress === 0) {
                messagesStore.progress = message.template === Consts.Template.first ? message.answers.length + 1 : message.answers.length
            }
            for (const answer of message.answers) {
                const botMessage: IMessagesBot = {
                    id: 0,
                    slug: "0",
                    order: 0,
                    template: answer.template,
                    text: answer.question_text,
                    choices: answer.choices,
                    required: false,
                    answer_type: "0",
                    is_user: false,
                }

                messagesStore.addMessage(botMessage)

                const validation = new Validation()

                let postalCode = await validation.checkIsPostcodeMessgae(answer.value);

                const userMessage: IMessage = {
                    id: 0,
                    request: 0,
                    question: answer.question,
                    question_text: answer.question_text,
                    value: postalCode ? postalCode : answer.value,
                    question_choices: answer.question_choices,
                    file: answer.file,
                    file_url: answer.file_url,
                    file_name: answer.file_name,
                    file_size: answer.file_size,
                    transcript: answer.transcript,
                    transcribing: answer.transcribing,
                    is_user: true,
                }

                messagesStore.addMessage(userMessage)
            }

            messagesStore.progress = response.data.template === Consts.Template.first ? response.data.answered_questions + 1 : response.data.answered_questions
            messagesStore.count_messages = response.data.template === Consts.Template.first ? response.data.total_questions + 1 : response.data.total_questions
            return true
        } else {
            return false
        }
    }

    public async addMessage() {
        console.log(`[Log] добавляем новый вопрос`)
        const messagesStore = useMessagesStore()
        if (localStorage.getItem("sessionId")) {
            const response = await botMessageApi.getNextQuestion(String(localStorage.getItem("sessionId")))

            if (response.data[0].text && response.data[0].text.includes('https://') && localStorage.getItem("currentTemplate") === '4') {
                console.log(`[Log] последнее сообщение в шаблоне ${localStorage.getItem("currentTemplate")}`)

                const botMessage: IMessagesBot = {
                    id: 0,
                    slug: "0",
                    text: response.data[0].text.trim(),
                    required: false,
                    answer_type: "0",
                    order: 0,
                    template: Number(localStorage.getItem("currentTemplate")),
                    is_user: false,
                }
                messagesStore.addMessage(botMessage)
                messagesStore.setIsLastMessage(true)
                return
            }
            if (response.success && response.data.length) {
                messagesStore.setIsLastMessage(false)

                let flag = false
                messagesStore.messages.forEach((message: any) => {
                    if (message.id === response.data[0].id) {
                        flag = true
                    }
                })

                if (!flag) {
                    messagesStore.setCurrentMessageId(response.data[0].id)
                    response.data[0].is_user = false
                    messagesStore.addMessage(response.data[0])
                }
            }
        }
    }
    private async loadProgress() {
        const response = await botSessionApi.sendEmail(String(localStorage.getItem('email')))
        console.log('[Log] загрузка прогресса')

        const messagesStore = useMessagesStore()

        if (response.success && response.data) {
            messagesStore.progress = response.data.template === Consts.Template.first ? response.data.answered_questions + 1 : response.data.answered_questions
            messagesStore.count_messages = response.data.template === Consts.Template.first ? response.data.total_questions + 1 : response.data.total_questions

            if (response.data.template === Consts.Template.second && response.data.answered_questions === response.data.total_questions) {
                const mes: IMessagesBot = {
                    id: 0,
                    slug: "0",
                    order: 0,
                    template: response.data.template,
                    text: `Herzlichen Glückwunsch und vielen Dank für Ihre Zeit und Ihre Offenheit!\n\nNur etwa 5 % aller Unternehmer beschäftigen sich aktiv mit der detaillierten Beschreibung und digitalen Erfassung ihrer eigenen Arbeitsabläufe und Geschäftsprozesse – Sie gehören nun dazu.\n\nWir werten Ihre Angaben nun sorgfältig aus. Innerhalb von 72 Stunden erhalten Sie von uns:\n\n●	eine übersichtliche Zusammenfassung Ihrer Unternehmensstruktur und Prozesslandschaft,\n●	ein individuelles, unverbindliches Angebot mit konkreten Optimierungsvorschlägen,\n●	sowie die Möglichkeit, direkt einen kostenfreien Termin mit einem unserer Berater zur Durchsprache zu vereinbaren.\n\nSollten bei der Analyse Rückfragen zu einzelnen Punkten auftauchen, werden wir Sie per E-Mail kontaktieren und um kurze Ergänzungen bitten.\n\nAuch wenn wir moderne KI-Technologie zur strukturierten Datenerfassung einsetzen, prüfen unsere qualifizierten Berater alle Angaben persönlich und final. Denn wir glauben an die Kombination aus Digitalisierung und menschlichem Verstand.\n\nWas wir empfehlen, wenden wir übrigens selbst täglich an – inklusive Automatisierung, digitaler Zusammenarbeit und effizienter Prozessgestaltung.\n\nWir freuen uns auf die nächsten Schritte mit Ihnen!`,
                    required: false,
                    answer_type: "0",
                    is_user: false,
                }
                messagesStore.addMessage(mes)
                messagesStore.setIsLastMessage(true)
            }
        }
    }
}

export default Message;