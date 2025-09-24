import { ref, onUnmounted } from "vue";
import { useWebSocketStore } from "@/store/storeWebSocket";
import {useStatisticsStore} from "@/store/statistics.ts";
import {statisticsApi} from "@/api/statistics.ts";

const { VITE_WEBSOCKET_URL } = import.meta.env;

export function useWebSocket(gameId: number) {
    const socket = ref<WebSocket | null>(null);
    const messageData = ref<any>(null);
    const isConnected = ref(false);
    console.log("afhkjashfjashdjksahdjkashdasjkdas", gameId);
    const webSocketStore = useWebSocketStore();
    const statisticsStore = useStatisticsStore();


    const connectWebSocket = () => {
        console.log("gameId", gameId)
        // console.log("afhkjashfjashdjksahdjkashdasjkdas", gameId)
        if (!gameId) return;

        socket.value = new WebSocket(`${VITE_WEBSOCKET_URL}/ws/game/${gameId}/`);

        socket.value.onopen = () => {
            console.log("✅ WebSocket подключен");
            isConnected.value = true;
        };

        socket.value.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            console.log("📊 Обновление статистики:", data);
            statisticsStore.statistic = await statisticsApi.getStatistic(Number(gameId))
            if (data.event === "game_stats_updated") {
                console.log("AFTER", webSocketStore.messages)
                webSocketStore.shiftMessages()
                console.log("BEFORE", webSocketStore.messages)
                return
            }
            messageData.value = data;
            webSocketStore.addMessage(data);
            if (Number(data.action[0])) {
                webSocketStore.messages[0].currentScoreTeam = statisticsStore.statistic.team_score
                webSocketStore.messages[0].currentScoreOpponent = statisticsStore.statistic.opponent_score
                webSocketStore.currentScoreOpponent = statisticsStore.statistic.opponent_score
                webSocketStore.currentScoreTeam = statisticsStore.statistic.team_score
            }
        };

        socket.value.onerror = (error) => {
            console.error("❌ WebSocket ошибка:", error);
        };

        socket.value.onclose = () => {
            console.log("🔴 WebSocket отключен");
            isConnected.value = false;
        };
    };

    connectWebSocket();

    onUnmounted(() => {
        console.log("🔌 Закрытие WebSocket");
        if (socket.value) {
            socket.value.close();
        }
    });

    return { messageData, isConnected };
}
