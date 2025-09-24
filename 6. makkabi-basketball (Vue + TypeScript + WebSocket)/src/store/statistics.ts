import { defineStore } from "pinia";
import { reactive } from "vue";
import type { Statistics } from "@/types/statistics"; // ✅ Импортируем как Type

export const useStatisticsStore = defineStore("statistics", () => {
    const statistic = reactive<Statistics>({
        game_id: 0,
        opponent_score: 0,
        team_score: 0,
        substitutions: [],
        player_stats: []
    });
    return { statistic };
});
