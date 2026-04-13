<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, type PropType, ref, watch} from "vue";
import {useSendStatisticStore} from "@/store/sendStatistic.ts";
import type {IPlayer} from "@/types/player";
import {useRoute} from "vue-router";
import {apiGames} from "@/api/games.ts";
import {statisticsApi} from "@/api/statistics.ts";
import {useStatisticsStore} from "@/store/statistics.ts";
import {useWebSocketStore} from "@/store/storeWebSocket.ts";
import {useNotificationStore} from "@/store/notification.ts";
import type {IteamOpponent} from "@/types/teamOpponent";

const storeNotification = useNotificationStore();

const errorFlag = ref(false);

const route = useRoute();

const statisticsStore = useStatisticsStore();
const storeSendStatistic = useSendStatisticStore();
const storeStatistic = useStatisticsStore();
const storeWebSocket = useWebSocketStore();

const asistFlag = ref(false);

const props = defineProps({
  isPortrait: Boolean,
  isTimerRunning: Boolean,
  players: Array as PropType<IPlayer[]>,
  teamOpponent: Object as PropType<IteamOpponent | null>
});

// ✅ Теперь `activePlayers` работает корректно
const activePlayers = computed(() => (props.players || []).filter(player => player.is_active));

const selectUserFlag = computed(() => storeSendStatistic.leftPanelSelected);
const goalOpponent = computed(() => storeSendStatistic.goalOpponent);

const buttonSize = ref("50px");
const selectedButtonIndex = ref<number | null>(null);
const selectedPlayerIndex = ref<number | null>(null);
const selectedPlayerIndexAsist = ref<number | null>(null);

function updateButtonSize() {
  nextTick(() => {
    const container = document.querySelector(".rightPanel__button") as HTMLElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const buttonContainer = document.querySelector(".rightPanel__button") as HTMLElement;
    const gap = parseFloat(getComputedStyle(buttonContainer).gap) || 0;

    const buttonWidth = (containerWidth / 2 - gap / 2) - 1;
    const buttonHeight = (containerHeight / 3 - gap / 2) - 1;
    const size = Math.min(buttonWidth, buttonHeight);

    buttonSize.value = `${size}`;
  });
}

onMounted(() => {
  setTimeout(() => {
    updateButtonSize();
  }, 5);
  window.addEventListener("resize", updateButtonSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateButtonSize);
});

// **Функция обработки клика по кнопке**
const handleButtonClick = (index: number, action: string) => {
  if (!props.isTimerRunning) {
    storeNotification.notification.message = 'Action cannot be assigned because the game has not started or is currently paused.'
    return
  }
  selectedButtonIndex.value = selectedButtonIndex.value === index ? null : index;
  if (action === 'def' || action === 'off') {
    console.log(action.toUpperCase() + "_RB")
    storeSendStatistic.statistic.action = action.toUpperCase() + "_RB"
  } else {
    console.log(action.toUpperCase())
    storeSendStatistic.statistic.action = action.toUpperCase()
  }
  if (selectedButtonIndex.value === null) {
    storeSendStatistic.setRightPanelSelected(false)
  } else {
    storeSendStatistic.setRightPanelSelected(true)
  }
};
const handlePlayer = (id: number, index: number) => {
  if (asistFlag.value) {
    storeSendStatistic.statistic.assistant = id
    storeSendStatistic.statistic.game = Number(route.params.id);
    selectedPlayerIndexAsist.value = index
    return
  }
  if (id !== -1) {
    storeSendStatistic.statistic.player = id
  }
  selectedPlayerIndex.value = index
  console.log(id)
  if (!goalOpponent.value && index !== -1) {
    console.log(1)
    asistFlag.value = true
  }
}

async function sendStatistic() {
  if (selectedPlayerIndex.value === null) {
    errorFlag.value = true;
    setTimeout(() => {
      errorFlag.value = false;
    }, 500)
    return
  }
  storeSendStatistic.leftPanelSelected = false
  storeSendStatistic.statistic.is_successful = true
  storeSendStatistic.goalOpponent = false
  storeSendStatistic.statistic.game = Number(route.params.id)
  if (storeSendStatistic.statistic.action?.includes('PT') && storeSendStatistic.statistic.player) {
    if (storeSendStatistic.statistic.action && storeSendStatistic.statistic.action.length > 0) {
      storeWebSocket.currentScoreTeam = storeStatistic.statistic.team_score + Number(storeSendStatistic?.statistic.action[0])
    } else {
      console.error("❌ Ошибка: `storeSendStatistic.statistic.action` пустой или undefined");
    }
    storeWebSocket.currentScoreOpponent = storeStatistic.statistic.opponent_score
  } else if (storeSendStatistic.statistic.action?.includes('PT') && !storeSendStatistic.statistic.player) {
    storeWebSocket.currentScoreTeam = storeStatistic.statistic.team_score
    storeWebSocket.currentScoreOpponent = storeStatistic.statistic.opponent_score + Number(storeSendStatistic?.statistic.action[0])
    // if (storeSendStatistic.statistic.action && storeSendStatistic.statistic.action.length > 0) {
    //   storeWebSocket.currentScoreOpponent = storeStatistic.statistic.opponent_score + Number(storeSendStatistic.statistic.action[0])
    // } else {
    //   console.error("❌ Ошибка: `storeSendStatistic.statistic.action` пустой или undefined");
    // }

  }
  await apiGames.setStatsGame(storeSendStatistic.statistic)
  statisticsStore.statistic = await statisticsApi.getStatistic(Number(route.params.id))
  storeSendStatistic.clearStats()
  selectedPlayerIndex.value = null
  asistFlag.value = false
  selectedPlayerIndexAsist.value = null
}

function back() {
  asistFlag.value = false;
  selectedPlayerIndex.value = null;
  selectedPlayerIndexAsist.value = null;
  storeSendStatistic.statistic.assistant = null;
}

watch(() => storeSendStatistic.rightPanelSelected, (newValue) => {
  console.log(newValue)
  if (!newValue) {
    selectedButtonIndex.value = null
  }
})

watch(() => storeSendStatistic.leftPanelSelected, (newValue) => {
  console.log(newValue)
  if (newValue) {
    selectedButtonIndex.value = null
    selectedPlayerIndex.value = null
    selectedPlayerIndexAsist.value = null
    asistFlag.value = false
    storeSendStatistic.statistic.assistant = null
    storeSendStatistic.statistic.player = null
  }
})
</script>

<template>
  <section class="rightPanel">
    <div
        style="max-width: 324px"
        v-if="!selectUserFlag"
        :style="{ minHeight: `${Number(buttonSize) * 3}px` }"
        :class="{ 'rightPanel__horizontal': !isPortrait, 'rightPanel__vertical': isPortrait }"
        class="rightPanel__button"
    >
      <button
          v-for="(button, index) in ['def', 'off', 'to', 'stl', 'ast', 'blk']"
          :key="index"
          :style="{ width: `${buttonSize}px`, height: `${buttonSize}px` }"
          :class="{
          rightPanel__hover: selectedButtonIndex === index,
          rightPanel__inactive: (selectedButtonIndex !== null && selectedButtonIndex !== index) || goalOpponent
        }"
          :disabled="(selectedButtonIndex !== null && selectedButtonIndex !== index) || goalOpponent"
          @click="handleButtonClick(index, button)"
      >
        <span>{{ button }}</span>
        <p v-if="index < 2">reb</p>
      </button>
    </div>
    <div
        style="max-width: 324px"
        v-if="selectUserFlag"
        :style="{ minHeight: `${Number(buttonSize) * 3}px` }"
        :class="{ 'rightPanel__horizontal': !isPortrait, 'rightPanel__vertical': isPortrait, 'rightPanel__button--error': errorFlag }"
        class="rightPanel__button"
    >
      <button
          style="border-radius: 12px"
          v-for="(player, index) in activePlayers"
          :key="index"
          :style="{ width: `${buttonSize}px`, height: `${buttonSize}px` }"
          :class="{
          rightPanel__inactive: selectedPlayerIndex === index || selectedPlayerIndexAsist === index
          }"
          :disabled="selectedButtonIndex === index || selectedPlayerIndexAsist === index"
          @click="handlePlayer(player.number, index)"
      >
        <span style="font-size: 32px">{{ player.number }}</span>
        <p>{{ player.name }}</p>
      </button>
      <span v-if="asistFlag" class="assist"
            :style="{ width: `${buttonSize}px`, height: `${buttonSize}px` }">Assisted by</span>
      <button v-else
              :class="{rightPanel__inactive: selectedPlayerIndex === -1, 'rightPanel__button--error': errorFlag}"
              :disabled="selectedButtonIndex === -1"
              @click="handlePlayer(-1, -1)"
              class="assist"
              :style="{ width: `${buttonSize}px`, height: `${buttonSize}px` }">
        <span class="player" style="border-radius: 50%"
              :style="{backgroundColor: teamOpponent?.color, minWidth: `${Number(buttonSize) * 0.5}px`, minHeight: `${Number(buttonSize) * 0.5}px` }"></span>
      </button>
    </div>
    <div v-if="!selectUserFlag" class="rightPanel__bottom">
      <button
          @click="handleButtonClick(-1, 'FOUL')"
          :class="{
          rightPanel__inactive: selectedButtonIndex !== -1 && selectedButtonIndex !== null
          }"
          :disabled="selectedButtonIndex !== -1 && selectedButtonIndex !== null">FOUL
      </button>
    </div>
    <div v-if="selectUserFlag" class="rightPanel__goal">
      <button @click="storeSendStatistic.leftPanelSelected = false;storeSendStatistic.goalOpponent = false "
              v-if="!asistFlag" :style="{ width: `${buttonSize}px` }">Cancel
      </button>
      <button @click="back"
              class="rightPanel__goal--back" v-if="asistFlag" :style="{ width: `${buttonSize}px` }">Back
      </button>
      <button @click="sendStatistic" :style="{ width: `${buttonSize}px` }">Submit</button>
    </div>
  </section>
</template>

<style scoped lang="scss">

.assist {
  display: flex !important;
  align-items: center;
  justify-content: center;
  color: $white-color;
  font-family: $Inter-Regular;
  font-weight: 400;
  font-size: 20px;
  border-radius: 12px !important;
}

.player {
  box-shadow: 2px 6px 10px 0 #00000026;
}

.rightPanel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;

  &__goal {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 32px !important;
    margin-top: 24px !important;
    gap: 24px;

    &--back {
      background-color: transparent !important;
      border: 1.5px solid $primary-red !important;
      color: $primary-red !important;
    }

    button {
      height: 100%;
      border-radius: 6px;
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 18px;
      text-transform: uppercase;

      &:first-child {
        background-color: $primary-red;
        border: none;
        color: $white-color
      }

      &:last-child {
        background-color: $primary-green;
        border: none;
        color: $white-color
      }
    }
  }

  &__vertical {
    height: calc(100dvw - 80px) !important;
    gap: 12px !important;
    max-height: 459px !important;

    button {
      min-width: calc(17dvw - 52px) !important;
      max-height: 145px;
    }
  }

  &__hover {
    transform: scale(1.1);
    border: 4px solid $white-color !important;
  }

  &__inactive {
    opacity: 0.6;
  }

  &__button {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    gap: 24px;

    &--error {
      animation: fast-blink 0.3s ease-in-out;

      @keyframes fast-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    }

    button {
      display: block;
      width: calc(50% - 12px);
      max-width: 150px;
      max-height: 150px;
      aspect-ratio: 1 / 1;
      background: linear-gradient(153.31deg, #0F5FA4 11.31%, #004784 91.64%), linear-gradient(0deg, #004784, #004784);
      box-shadow: 2px 6px 10px 0 #00000026;
      border-radius: 50%;
      border: 2px solid $white-color;

      span {
        font-family: $Inter-Regular;
        font-weight: 400;
        font-size: 24px;
        line-height: 0.66;
        color: $white-color;
      }

      p {
        font-family: $Inter-Regular;
        font-weight: 400;
        font-size: 16px;
        color: $white-color;
        opacity: 0.8;
      }
    }
  }

  &__bottom {
    gap: 24px;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 32px;
    margin-top: 24px !important;

    button {
      border: none;
      background-color: transparent;
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 24px;
      line-height: 16px;
      color: $white-color;
    }
  }
}

@media (max-height: 570px) and (max-width: 1000px) {
  .rightPanel {
    &__players {
      margin-top: 12px !important;
    }

    &__horizontal {
      //height: calc(100dvh - 80px) !important;
      gap: 12px !important;
      //max-height: calc(93% - 36px) !important;

      //button {
      //width: auto !important;
      //min-width: 33%;
      //height: calc(33% - 6px) !important;
      //}
    }
  }
}

@media (max-width: 900px) and (max-height: 300px) {
  .rightPanel {
    &__horizontal {
      //height: calc(100dvh - 80px) !important;
      //gap: 12px !important;

      button {
        //width: auto !important;
        //min-width: 33%;
        //height: calc(33% - 6px) !important;
      }
    }

    &__vertical {
      //height: calc(100dvw - 80px) !important;
      //gap: 12px !important;

      button {
        //width: auto !important;
        //max-height: 145px !important;
        //
        //min-height: calc(31% - 12px) !important;
      }
    }
  }
}
</style>