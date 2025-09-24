import { defineStore } from "pinia";

interface WebSocketMessage {
    event: string;
    game_id: number;
    player: {
        id: number;
        number: number;
        name: string;
    };
    assistant?: {
        id: number;
        number: number;
        name: string;
    }
    action: string;
    is_successful: boolean;
    game_time: string;
    quarter: number;
    currentScoreTeam?: number;
    currentScoreOpponent?: number;

}

export const useWebSocketStore = defineStore("webSocketStore", {
    state: () => ({
        messages: [] as WebSocketMessage[],
        currentScoreTeam: 0 as number,
        currentScoreOpponent: 0 as number,
    }),

    actions: {
        addMessage(message: WebSocketMessage) {
            console.log("📩 Новое сообщение WebSocket:", message);

            const isDuplicate = this.messages.some(
                (msg) => msg.event === message.event &&
                    msg.game_id === message.game_id &&
                    msg.game_time === message.game_time
            );

            if (!isDuplicate) {
                this.messages.unshift(message);
            } else {
                console.log("⚠️ Дубликат! Сообщение не добавлено.");
            }
        },

        shiftMessages() {
            this.messages.shift()
        },

        clearMessages() {
            console.log("🗑 Очистка всех сообщений WebSocket");
            this.messages = [];
        }
    },
});
