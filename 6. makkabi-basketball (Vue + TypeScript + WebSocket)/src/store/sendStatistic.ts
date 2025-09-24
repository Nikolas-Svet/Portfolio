import { defineStore } from "pinia";
import { ref } from "vue";

interface Statistic {
    game?: number | null;
    player?: number | null;
    assistant?: number | null;
    action?: string | null;
    is_successful?: boolean | null;
    quarter?: number | null;
    game_time?: string | null;
}

export const useSendStatisticStore = defineStore("sendStatistic", () => {
    const statistic = ref<Statistic>({});

    const flagGame = ref(false);
    const leftPanelSelected = ref(false);
    const goalOpponent = ref(false);
    const rightPanelSelected = ref(false);

    // **Функция обновления всего объекта `statistic`**
    function setStatistic(value: Partial<Statistic>) {
        console.log("setStatistic вызван:", value);
        statistic.value = { ...statistic.value, ...value };
    }

    // **Функция обновления отдельного поля**
    function setStatisticField<K extends keyof Statistic>(key: K, value: Statistic[K]) {
        console.log(`Обновление статистики: ${key} ->`, value);
        statistic.value[key] = value;
    }

    // **Функции установки `leftPanelSelected` и `rightPanelSelected`**
    function setLeftPanelSelected(value: boolean) {
        leftPanelSelected.value = value;
    }

    function setRightPanelSelected(value: boolean) {
        rightPanelSelected.value = value;
    }

    function clearStats() {
        statistic.value.game = null;
        statistic.value.player = null;
        statistic.value.assistant = null;
        statistic.value.action = null;
    }

    return {
        leftPanelSelected,
        rightPanelSelected,
        statistic,
        goalOpponent,
        setStatistic,
        setStatisticField,
        setLeftPanelSelected,
        setRightPanelSelected,
        clearStats,
        flagGame
    };
});
