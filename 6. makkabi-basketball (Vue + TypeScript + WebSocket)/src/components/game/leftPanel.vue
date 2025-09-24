<script setup lang="ts">
import {computed, defineProps, nextTick, onBeforeUnmount, onMounted, type PropType, ref, watch} from "vue";
import {defineEmits} from "vue";
import type {IPlayer} from "@/types/player.ts";
import {useSendStatisticStore} from "@/store/sendStatistic.ts";
import {useNotificationStore} from "@/store/notification.ts";
import {apiGames} from "@/api/games.ts";
import {statisticsApi} from "@/api/statistics.ts";
import {useStatisticsStore} from "@/store/statistics.ts";
import {useRoute} from "vue-router";
import type {IteamOpponent} from "@/types/teamOpponent.ts";

const errorFlag = ref(false);

const route = useRoute();

const statisticsStore = useStatisticsStore();
const storeSendStatistic = useSendStatisticStore();
const storeNotification = useNotificationStore();

const selectUserFlag = computed(() => storeSendStatistic.rightPanelSelected);

const selectedPlayerIndex = ref<number | null>(null);
const handlePlayer = (id: number, index: number) => {
  if (id !== -1) {
    storeSendStatistic.statistic.player = id
  }
  selectedPlayerIndex.value = index
}


const selectUserFlag2 = computed(() => storeSendStatistic.leftPanelSelected);

watch(selectUserFlag2, (newValue) => {
  if (!newValue) {
    selectedButtonIndex.value = null
    console.log("⚠️ Внимание! Нет активных игроков.");
  }
});

const props = defineProps({
  isPortrait: Boolean,
  isTimerRunning: Boolean,
  players: Array as PropType<IPlayer[]>,
  teamOpponent: Object as PropType<IteamOpponent | null>
});

const activePlayers = computed(() =>
    (props.players || []).filter((player) => player.is_active).sort((a, b) => a.number - b.number)
);


const buttonSize = ref("50px");
const selectedButtonIndex = ref<number | null>(null);

function updateButtonSize() {
  nextTick(() => {
    const container = document.querySelector(".leftPanel__button") as HTMLElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const buttonContainer = document.querySelector(".leftPanel__button") as HTMLElement;
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

const emit = defineEmits(["open"]);

function openMenu() {
  emit("open");
}

// **Функция обработки клика по кнопке**
const handleButtonClick = (index: number, point: number) => {
  if (!props.isTimerRunning) {
    storeNotification.notification.message = 'Action cannot be assigned because the game has not started or is currently paused.'
    return
  }
  let action
  if (index % 2 === 0) {
    action = `${point}PT`
    storeSendStatistic.statistic.action = action
  } else {
    action = `${point}ATT`
    storeSendStatistic.goalOpponent = true
    storeSendStatistic.statistic.action = action
  }

  if (selectedButtonIndex.value === index) {
    storeSendStatistic.goalOpponent = false
  }

  selectedButtonIndex.value = selectedButtonIndex.value === index ? null : index;
  if (selectedButtonIndex.value === null) {
    storeSendStatistic.setLeftPanelSelected(false)
  } else {
    storeSendStatistic.setLeftPanelSelected(true)
  }

};

async function sendStatistic() {
  if (selectedPlayerIndex.value === null) {
    errorFlag.value = true;
    setTimeout(() => {
      errorFlag.value = false;
    }, 500)
    return
  }
  storeSendStatistic.rightPanelSelected = false
  storeSendStatistic.statistic.is_successful = true
  storeSendStatistic.goalOpponent = false
  storeSendStatistic.statistic.game = Number(route.params.id)
  await apiGames.setStatsGame(storeSendStatistic.statistic)
  statisticsStore.statistic = await statisticsApi.getStatistic(Number(route.params.id))
  storeSendStatistic.clearStats()
  selectedPlayerIndex.value = null
}

watch(() => storeSendStatistic.rightPanelSelected, (newValue) => {
  console.log(newValue)
  if (newValue) {
    selectedButtonIndex.value = null
    selectedPlayerIndex.value = null
    storeSendStatistic.statistic.assistant = null
    storeSendStatistic.statistic.player = null
  }
})
</script>

<template>
  <section class="leftPanel">
    <div
        style="max-width: 324px"
        v-if="!selectUserFlag"
        :style="{ minHeight: `${Number(buttonSize) * 3}px` }"
        :class="{ 'leftPanel__horizontal': !isPortrait, 'leftPanel__vertical': isPortrait }"
        class="leftPanel__button"
    >
      <button
          v-for="(point, index) in [3, 3, 2, 2, 1, 1]"
          :key="index"
          :style="{ width: `${buttonSize}px`, height: `${buttonSize}px` }"
          :class="{
          leftPanel__hover: selectedButtonIndex === index,
          leftPanel__inactive: selectedButtonIndex !== null && selectedButtonIndex !== index,
          leftPanel__activeRed: index % 2 !== 0 && selectedButtonIndex === index,
          leftPanel__activeGreen: index % 2 === 0 && selectedButtonIndex === index,
        }"
          :disabled="selectedButtonIndex !== null && selectedButtonIndex !== index"
          @click="handleButtonClick(index, point)"
      >
        <span>{{ point }}pt</span>
      </button>
    </div>
    <div
        style="max-width: 324px"
        v-if="selectUserFlag"
        :style="{ minHeight: `${Number(buttonSize) * 3}px` }"
        :class="{ 'leftPanel__horizontal': !isPortrait, 'leftPanel__vertical': isPortrait }"
        class="leftPanel__button"
    >
      <button
          style="border-radius: 12px"
          v-for="(player, index) in activePlayers"
          :key="index"
          class="leftPanel__selects"
          :style="{ width: `${buttonSize}px`, height: `${buttonSize}px` }"
          :class="{leftPanel__inactive: selectedPlayerIndex === index, 'leftPanel__button--error': errorFlag}"
          :disabled="selectedButtonIndex === index"
          @click="handlePlayer(player.number, index)"
      >
        <span style="font-size: 32px">{{ player.number }}</span>
        <p>{{ player.name }}</p>
      </button>
      <button
          :class="{leftPanel__inactive: selectedPlayerIndex === -1, 'leftPanel__button--error': errorFlag}"
          :disabled="selectedButtonIndex === -1"
          @click="handlePlayer(-1, -1)"
          class="assist"
          :style="{ width: `${buttonSize}px`, height: `${buttonSize}px` }">
        <span class="player" style="border-radius: 50%"
              :style="{backgroundColor: teamOpponent?.color, minWidth: `${Number(buttonSize) * 0.5}px`, minHeight: `${Number(buttonSize) * 0.5}px` }"></span>
      </button>
    </div>
    <button v-if="!selectUserFlag" @click="openMenu" class="leftPanel__players">
      <div v-for="(player, index) in activePlayers" :key="index + '-player'">{{ player.number }}</div>
    </button>
    <div v-if="selectUserFlag" class="leftPanel__goal">
      <button @click="storeSendStatistic.rightPanelSelected = false;" :style="{ width: `${buttonSize}px` }">Cancel
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
  border: 2px solid $white-color !important;
  font-family: $Inter-Regular;
  font-weight: 400;
  font-size: 20px;
  border-radius: 12px !important;
}

.player {
  box-shadow: 2px 6px 10px 0 #00000026;
}

.leftPanel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;

  &__activeGreen {
    border: 4px solid $primary-green !important;
  }

  &__activeRed {
    border: 4px solid $primary-red !important;
  }

  &__hover {
    transform: scale(1.1);
    //background-color: #ffcc00 !important;
    //border-color: #ffaa00 !important;
    //color: #000 !important;
  }

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
      width: 44%;
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

  &__inactive {
    opacity: 0.7;
    pointer-events: none;
  }

  &__vertical {
    height: calc(100dvw - 80px) !important;
    gap: 12px !important;
    max-height: 459px !important;

    button {
      min-width: calc(17dvw - 52px);
      max-height: 145px;
    }
  }

  &__selects {
    border: 2px solid $white-color !important;
  }

  &__button {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    gap: 24px;
    transition: background 0.3s ease;
    opacity: 1;

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

      &:nth-child(even) {
        border: 2px solid $primary-red;
      }

      &:nth-child(odd) {
        border: 2px solid $primary-green;
      }

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

  &__players {
    width: 100%;
    max-width: 200px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 24px;
    gap: 6px;
    height: 32px;
    background-color: transparent;
    border: none;

    div {
      aspect-ratio: 1/1;
      max-width: 32px;
      width: 100%;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $background-player;
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 18px;
      color: $white-color;
    }
  }
}

@media (max-height: 570px) and (max-width: 1000px) {
  .leftPanel {
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
  .leftPanel {
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