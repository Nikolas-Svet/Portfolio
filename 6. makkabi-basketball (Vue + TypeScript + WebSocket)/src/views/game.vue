<script setup lang="ts">
import rightPanel from "@/components/game/rightPanel.vue";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import leftPanel from "@/components/game/leftPanel.vue";
import {apiGames} from "@/api/games.ts";
import {useRoute, useRouter} from "vue-router";
import type {IGame} from "@/types/games";
import type {IteamOpponent} from "@/types/teamOpponent";
import type {Iteam} from "@/types/team";
import type {IPlayer} from "@/types/player";
import {apiTeam} from "@/api/team.ts";
import {apiTeamOpponent} from "@/api/teamOpponent.ts";
import MenuPlayers from "@/components/game/menuPlayers.vue";
import {apiPlayers} from "@/api/players.ts";
import {usePlayersStore} from "@/store/players.ts";
import {useScreen} from "@/services/useScreen";
import {useWebSocketStore} from "@/store/storeWebSocket";
import {useWebSocket} from "@/api/webSocket";
import {useSendStatisticStore} from "@/store/sendStatistic.ts";
import {statisticsApi} from "@/api/statistics.ts";
import {useStatisticsStore} from "@/store/statistics.ts";
import {useNotificationStore} from "@/store/notification.ts";
import {status_end_game, status_start_game, timer_notification} from "@/services/consts.ts";

const QUARTER_DURATION = 240;
const TOTAL_QUARTERS = 10;

const storeNotification = useNotificationStore();
const {isPortrait} = useScreen();
const playersStore = usePlayersStore();
const storeSendStatistic = useSendStatisticStore();
const webSocketStore = useWebSocketStore();
const statisticsStore = useStatisticsStore();


const acceptCancelEventFlag = ref(false);
const firstStartGame = ref(false);
const message_notification = ref<string | null>(null);
const showNotification = ref(false);
const notifications = computed(() => webSocketStore.messages ?? []);
const router = useRouter();
const menuLayerFlag = ref(false);
const isWebSocketEnabled = ref(false);
const isTimerRunning = ref<boolean>(false);
const gameTimer = ref<number>(parseInt(localStorage.getItem("game_time") || "240", 10)); // 10:00 или сохраненное значение
const currentQuarter = ref<number>(1);
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null);

const route = useRoute();
const gameId = route.params.id;
const game = ref<IGame | null>(null);
const team = ref<Iteam | null>(null);
const teamOpponent = ref<IteamOpponent | null>(null);
const players = ref<IPlayer[] | []>([]);

const forceStop = ref(false); // Флаг принудительной остановки таймера

function stopTimer() {
  console.log("⏹ Принудительная остановка таймера...");

  forceStop.value = true; // Устанавливаем флаг

  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }

  isTimerRunning.value = false;
  gameTimer.value = 0;
  currentQuarter.value = TOTAL_QUARTERS + 1;

  storeSendStatistic.statistic.game_time = "04:00";
  storeSendStatistic.statistic.quarter = 1;

  console.log("✅ Таймер полностью остановлен!");
}


onMounted(async () => {
  try {
    const data = await apiGames.getGame(Number(gameId));
    game.value = data;
    team.value = await apiTeam.getTeam(Number(game.value?.team));
    teamOpponent.value = await apiTeamOpponent.getOpponentTeam(Number(game.value?.opponent));
    players.value = await apiPlayers.getPlayers();
    playersStore.setPlayers(players.value);

    statisticsStore.statistic = await statisticsApi.getStatistic(Number(gameId))

    if (game.value?.status === "in_progress" && game.value?.date) {
      console.log("⏳ Обновляем таймер с бэка...");
      if (!await updateGameTime()) {
        stopTimer();
        return
      }

      // Гарантируем, что startTimer() запустится только после обновления gameTimer
      nextTick(async () => {
        console.log("🚀 Запускаем таймер после обновления времени");
        await startTimer();
      });

      firstStartGame.value = true;
      isWebSocketEnabled.value = true;
    } else {
      console.log("🚫 Таймер не запущен, статус игры:", game.value?.status, game.value?.date);
    }

    storeSendStatistic.statistic.game_time = formatTime(gameTimer.value);
    storeSendStatistic.statistic.quarter = currentQuarter.value;

    if (game.value?.status === "in_progress") {
      isWebSocketEnabled.value = true;
    }

    if (isWebSocketEnabled.value) {
      useWebSocket(Number(gameId))
    }
  } catch (error) {
    console.error("Ошибка загрузки игры:", error);
  }
});


async function updateGameTime() {
  if (!game.value?.date) {
    console.log("❌ Нет game.date, не можем обновить время");
    return;
  }

  const gameStartTime = new Date(game.value.date).getTime() / 1000;
  const now = Date.now() / 1000;
  const elapsedTime = Math.floor(now - gameStartTime);

  currentQuarter.value = Math.min(TOTAL_QUARTERS, Math.floor(elapsedTime / QUARTER_DURATION) + 1);
  gameTimer.value = Math.max(0, QUARTER_DURATION - (elapsedTime % QUARTER_DURATION));


  storeSendStatistic.statistic.quarter = currentQuarter.value
  storeSendStatistic.statistic.game_time = formatTime(gameTimer.value)
  console.log(`🕒 Прошло: ${elapsedTime} сек`);
  console.log(`🏀 Текущий период: ${currentQuarter.value}`);
  console.log(`⏳ Оставшееся время: ${formatTime(gameTimer.value)}`);

  if (elapsedTime > 2400) {
    await apiGames.startGame(status_end_game, Number(gameId));
    return false
  }
  return  true
}

// **Форматирование времени в "MM:SS"**
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

async function startTimer() {
  if (isTimerRunning.value || gameTimer.value <= 0 || currentQuarter.value > QUARTER_DURATION) {
    console.log("⏸️ Таймер уже запущен или время истекло");
    return;
  }

  console.log("▶️ Запускаем таймер!");
  isTimerRunning.value = true;

  timerInterval.value = setInterval(() => {
    if (forceStop.value) {
      console.log("⛔ Таймер принудительно остановлен, очищаем `setInterval`...");
      clearInterval(Number(timerInterval.value));
      timerInterval.value = null;
      return;
    }

    if (gameTimer.value > 0) {
      gameTimer.value -= 1;
      storeSendStatistic.statistic.game_time = formatTime(gameTimer.value);
    } else {
      console.log("⏳ Период завершён, переключаем...");
      nextQuarter();
    }
  }, 1000);
}

// **Переход к следующему периоду**
async function nextQuarter() {
  if (currentQuarter.value < TOTAL_QUARTERS) {
    currentQuarter.value += 1;
    gameTimer.value = QUARTER_DURATION;
    console.log(`🏀 Начался ${currentQuarter.value}-й период`);
  } else {
    if (gameTimer.value === -1) { return }
    await apiGames.startGame(status_end_game, Number(gameId));
    console.log("🏆 Игра окончена!");
    clearInterval(timerInterval.value!);
  }
}

// **Старт игры**
async function start_game() {
  if (!firstStartGame.value && !isTimerRunning.value) {
    storeSendStatistic.statistic.game_time = "04:00"
    storeSendStatistic.statistic.quarter = 1;
    firstStartGame.value = true;
    useWebSocket(Number(gameId));
    await apiGames.startGame(status_start_game, Number(gameId));
    // await apiGames.updateGame(Number(game.value?.opponent), "in_progress", Number(gameId), String(game.value?.date));
  }
  console.log("✅ Игра запущена!");
  startTimer();
}


const acceptExit = ref(false);

function exit() {
  if (firstStartGame.value) {
    acceptExit.value = true;
    return
  }

  router.back();
}

async function accept_exit(action: string) {
  if (action === "end_game") {
    await apiGames.updateGame(Number(game.value?.opponent), "finished", Number(gameId), String(game.value?.date));
  }
  const now = new Date();
  console.log(now.toUTCString());

  acceptExit.value = false;
  router.back();
}

async function acceptCancelEvent() {
  await apiGames.cancelEvent(Number(gameId));
  statisticsStore.statistic = await statisticsApi.getStatistic(Number(gameId))
  acceptCancelEventFlag.value = false;
}

function updatePlayers() {
  const players_pinia = playersStore.players;
  players.value = players_pinia;
}

watch(() => storeNotification.notification.message, (newMessage) => {
  if (newMessage) {
    showNotification.value = true
    message_notification.value = newMessage;
    setTimeout(() => {
      showNotification.value = false
      setTimeout(() => {
        message_notification.value = null;
        storeNotification.notification.message = null
      }, 500)
    }, timer_notification)
  }
})


onUnmounted(() => {
  stopTimer();
});


</script>

<template>
  <section :class="{ 'vertical': isPortrait, 'horizontal': !isPortrait }">
    <div class="game__left">
      <leftPanel :teamOpponent="teamOpponent" :isTimerRunning="isTimerRunning" :isPortrait="isPortrait"
                 @open="menuLayerFlag = true"
                 :players="players"/>
    </div>
    <div
        :style="{ margin: !isPortrait ? 'auto 0' : '0',height: !isPortrait ? '100%' : '100dvw', maxHeight: !isPortrait ? '550px' : 'none' }"
        class="game__center">
      <div v-if="game?.is_home_game" class="game__center--header">
        <div class="game__center--team">
          <div :style="{ backgroundColor: team?.color }" class="game__center--team__title"></div>
        </div>
        <div class="score">
          <span class="score__team">{{ statisticsStore.statistic.team_score }}</span>
          -
          <span class="score__opponent">{{ statisticsStore.statistic.opponent_score }}</span>
        </div>
        <div class="game__center--team">
          <div :style="{ backgroundColor: teamOpponent?.color }" class="game__center--team__title"></div>
        </div>
      </div>
      <div v-else class="game__center--header">
        <div class="game__center--team">
          <div :style="{ backgroundColor: teamOpponent?.color }" class="game__center--team__title"></div>
        </div>
        <div class="score">
          <span class="score__opponent">{{ statisticsStore.statistic.opponent_score }}</span>
          -
          <span class="score__team">{{ statisticsStore.statistic.team_score }}</span>
        </div>
        <div class="game__center--team">
          <div :style="{ backgroundColor: team?.color }" class="game__center--team__title"></div>
        </div>
      </div>
      <div class="game__center--time">
        <span class="time__period">Q{{ storeSendStatistic.statistic.quarter }}</span>
        <span class="time__remainder">{{ storeSendStatistic.statistic.game_time }}</span>
      </div>
      <div class="game__center--actions">
        <span class="notification" :style="{opacity: showNotification ? '1' : '0'}">{{ message_notification }}</span>
        <ul v-if="notifications.length">
          <li
              v-for="(notification) in notifications"
          >
            <div>
              <span
                  v-if="notification.player.id && Number(notification.action[0]) && notification.action.includes('PT') && game?.is_home_game"
                  :class="{'action__successful': notification.player.id, 'action__error': !notification.player.id}">
                {{ notification.action[0] }} pt
                /
                <p class="action__score"> {{ notification.currentScoreTeam }} </p>
                -
                {{ notification.currentScoreOpponent }}
              </span>
              <span
                  v-if="notification.player.id && Number(notification.action[0]) && notification.action.includes('PT') && !game?.is_home_game"
                  :class="{'action__successful': notification.player.id, 'action__error': !notification.player.id}">
                {{ notification.action[0] }} pt
                /
                {{ notification.currentScoreOpponent }}
                -
                <p class="action__score"> {{ notification.currentScoreTeam }} </p>
              </span>
              <span v-if="notification.action.includes('ATT')"
                    class="action__error">
                {{ notification.player.id ? 'Attempted' : 'Opponent attempted' }} a {{ notification.action[0] }}PT shot
              </span>
              <span v-if="notification.action === 'TO' "
                    :class="{'action__successful': !notification.player.id,'action__error': notification.player.id }">
                {{ notification.player.id ? 'Turnover' : 'Opponent Turnover' }}
              </span>
              <span v-if="notification.action === 'DEF_RB' "
                    :class="{'action__successful': notification.player.id,'action__error': !notification.player.id }">
                {{ notification.player.id ? 'Defensive Rebound' : 'Opponent Defensive Rebound' }}
              </span>
              <span v-if="notification.action === 'OFF_RB' "
                    :class="{'action__successful': notification.player.id,'action__error': !notification.player.id }">
                {{ notification.player.id ? 'Offensive Rebound' : 'Opponent Offensive Rebound' }}
              </span>
              <span v-if="notification.action === 'STL' "
                    :class="{'action__successful': notification.player.id,'action__error': !notification.player.id }">
                {{ notification.player.id ? 'Steal' : 'Opponent steal' }}
              </span>
              <span v-if="notification.action === 'AST' "
                    :class="{'action__successful': notification.player.id,'action__error': !notification.player.id }">
                {{ notification.player.id ? 'Assist' : 'Opponent assist' }}
              </span>
              <span v-if="notification.action === 'BLK' "
                    :class="{'action__successful': notification.player.id,'action__error': !notification.player.id }">
                {{ notification.player.id ? 'Block' : 'Opponent block' }}
              </span>
              <span v-if="notification.action === 'FOUL' "
                    :class="{'action__successful': !notification.player.id,'action__error': notification.player.id }">
                {{ notification.player.id ? 'Foul' : 'Opponent foul' }}
              </span>
              <span v-if="!notification.player.id && game?.is_home_game && notification.action.includes('PT')"
                    :class="{'action__successful': notification.player.id, 'action__error': !notification.player.id}">
                {{ notification.action[0] }} pt
                /
                {{ notification.currentScoreTeam }} -
                <p class="action__score"> {{ notification.currentScoreOpponent }} </p>
              </span>
              <span v-if="!notification.player.id && !game?.is_home_game && notification.action.includes('PT')"
                    :class="{'action__successful': notification.player.id, 'action__error': !notification.player.id}">
                {{ notification.action[0] }} pt
                /
                <p class="action__score"> {{ notification.currentScoreOpponent }} </p>
                 -
                {{ notification.currentScoreTeam }}
              </span>
            </div>
            <div v-if="notification.player.id">
              <span>#{{ notification.player.number }} {{ notification.player.name }}</span>
              <span
                  v-if="notification.assistant?.id">(#{{ notification.assistant?.number }} {{
                  notification.assistant?.name
                }})</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="game__center--buttons">
        <button @click="acceptCancelEventFlag = true" class="buttons__cancel">
          <span></span>
        </button>
        <button :style="{opacity: isTimerRunning ? '0.8' : '1'}" @click="start_game" class="buttons__start">
          <img src="@/assets/icons/ball.svg" alt=""/>
        </button>
        <button @click="exit" class="buttons__menu">
          <img src="@/assets/icons/menu.svg" alt=""/>
        </button>
      </div>

      <div v-if="acceptExit" class="exit">
        <span>Do you really want to end the game?</span>
        <div>
          <button @click="accept_exit('end_game');">End game</button>
          <button @click="accept_exit('menu');">Menu</button>
        </div>
        <div>
          <button @click="acceptExit = false">Back</button>
        </div>
      </div>

      <div v-if="acceptCancelEventFlag" class="exit_2">
        <span>Do you really want to delete the last event?</span>
        <div>
          <button @click="acceptCancelEvent">Del event</button>
          <button @click="acceptCancelEventFlag = false">Back</button>
        </div>
      </div>
    </div>
    <div class="game__right">
      <rightPanel :teamOpponent="teamOpponent" :isTimerRunning="isTimerRunning" :isPortrait="isPortrait"
                  :players="players"/>
    </div>
    <menu-players
        :style="{ maxHeight: !isPortrait ? '800px' : 'none', margin: !isPortrait ? 'auto 0' : 'none' }"
        v-if="menuLayerFlag"
        @close="menuLayerFlag = false"
        @update_players="updatePlayers"
        :players="players"
        :isTimerRunning="isTimerRunning"
        :isPortrait="isPortrait"
    ></menu-players>
    <div v-if="menuLayerFlag" class="game__wrap"></div>
  </section>
</template>


<style scoped lang="scss">

.exit {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
  width: 364px;
  background-color: $white-color;
  border-radius: 24px;
  padding: 32px 48px 40px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  span {
    color: $black-color;
    font-family: $Inter-SemiBold;
    font-weight: 600;
    font-size: 18px;
    line-height: 1.4;
    max-width: 193px;
    width: 100%;
    margin-bottom: 28px;
  }

  div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:last-child {
      justify-content: center;
      margin-top: 20px;

      button {
        background-color: $primary-red !important;
      }
    }

    button {
      width: 44%;
      height: 43px;
      border-radius: 8px;
      color: $white-color;
      border: none;
      text-transform: uppercase;
      font-family: $Inter-SemiBold;
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;

      &:first-child {
        background-color: $primary-green;
      }

      &:last-child {
        background-color: $primary-green;
      }
    }
  }
}

.exit_2 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
  width: 364px;
  background-color: $white-color;
  border-radius: 24px;
  padding: 32px 48px 40px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  span {
    color: $black-color;
    font-family: $Inter-SemiBold;
    font-weight: 600;
    font-size: 18px;
    line-height: 1.4;
    max-width: 193px;
    width: 100%;
    margin-bottom: 28px;
  }

  div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      width: 44%;
      height: 43px;
      border-radius: 8px;
      color: $white-color;
      border: none;
      text-transform: uppercase;
      font-family: $Inter-SemiBold;
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;

      &:first-child {
        background-color: $primary-green;
      }

      &:last-child {
        background-color: $primary-red;
      }
    }
  }
}

.notification {
  position: absolute;
  top: 0;
  width: calc(100% - 20px);
  left: 50%;
  transform: translateX(-50%);
  background-color: $primary-color_3;
  color: $white_color;
  border-radius: 6px;
  padding: 8px;
  transition: opacity 0.5s ease;
  box-shadow: inset 0 0 3px $primary-red;
  font-family: $Inter-Regular;
  font-weight: 400;
  font-size: 15px;
  text-align: left;
}

.horizontal {
  display: flex;
  background-color: $primary-color;
  transform-origin: center;
  width: 100vw;
  height: 100dvh;
  position: absolute;
  overflow: hidden;
}

.vertical {
  display: flex;
  background-color: $primary-color;
  width: 100vh;
  min-height: 100vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  overflow: hidden;

  .game__left {
    height: 100vw !important;
  }

  .leftPanel {
    padding: 10px 20px !important;
  }

  .game__right {
    height: 100vw !important;
  }

  .rightPanel {
    padding: 10px 20px !important;
  }
}

.action {
  &__successful {
    color: $primary-green !important;
  }

  &__error {
    color: $primary-red !important;
  }

  &__score {
    font-family: $Inter-SemiBold !important;
    font-weight: 700;
  }
}

.game {
  background-color: $primary-color;
  //transform: rotate(90deg);
  //min-width: 100vh;
  //min-height: 100vh;

  &__wrap {
    content: "";
    position: absolute;
    z-index: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
  }

  &__title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__left {
    //max-width: 300px;
    width: 34%;
    background: linear-gradient(153.31deg, #0F5FA4 11.31%, #004784 91.64%), linear-gradient(0deg, #2478B5, #2478B5);
    box-shadow: 0 2px 10px 0 #00000026;
  }

  &__center {
    margin: auto 0;
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 2.5% 0 3% 0;

    &--header {
      height: 48px;
      width: calc(100% + 20px);
      display: flex;
      align-items: center;
      background-color: $primary-color;
      box-shadow: 2px 6px 10px 0 #00000026;
      position: relative;
    }

    &--team {
      width: 48px;
      height: 48px;
      background-color: $white-color;
      display: flex;
      align-items: center;
      justify-content: center;

      &__title {
        width: 40px;
        height: 40px;
        border-radius: 50%;

      }
    }

    &--time {
      position: relative;
      max-width: 107px;
      width: 100%;
      margin-top: -8px;
      box-shadow: 2px 6px 10px 0 #00000026;
      background-color: $primary-color_2;
      display: flex;
      height: 32px;
      align-items: center;

      .time {
        &__period {
          height: 32px;
          width: 37%;
          align-content: center;
          text-align: center;
          text-transform: uppercase;
          font-family: $Inter-Regular;
          font-weight: 400;
          font-size: 16px;
          color: $white-color;
        }

        &__remainder {
          height: 32px;
          width: 63%;
          align-content: center;
          text-align: center;
          font-family: $Inter-Regular;
          font-weight: 400;
          font-size: 16px;
          color: $white-color;
          border-left: 1px solid rgba(255, 255, 255, 0.2);
        }
      }
    }

    .score {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 20px;
      color: $white-color;
    }

    &--actions {
      width: 100%;
      position: relative;
      overflow: auto;
      flex: 1;
      height: 100%;
      margin: 20px 0;

      ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 24px;

        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        div {
          display: flex;
          align-items: center;
          justify-content: center;

          &:last-child {
            flex-direction: column;
            gap: 8px;
          }
        }

        span {
          font-family: $Inter-Regular;
          font-weight: 400;
          line-height: 16px;
          text-align: center;
          color: $white-color;

          p {
            display: contents;
          }
        }
      }
    }

    &--buttons {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }

    .buttons {
      &__cancel {
        height: 40px;
        width: 40px;
        background-color: transparent;
        border: 2px solid $primary-red;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;


        span {
          height: 12px;
          width: 12px;
          position: relative;

          &:after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: 2px;
            height: 16px;
            background-color: $primary-red;
          }

          &:before {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            width: 2px;
            height: 16px;
            background-color: $primary-red;
          }
        }
      }

      &__start {
        height: 64px;
        width: 64px;
        background-color: $primary-orange;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          height: 40px;
          width: 40px;
        }
      }

      &__menu {
        height: 40px;
        width: 40px;
        background-color: transparent;
        border: 2px solid $white-color;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          height: 12px;
          width: 12px;
        }
      }
    }
  }

  &__right {
    width: 34%;
    box-shadow: -2px 0 10px 0 #00000026;
    background: linear-gradient(153.31deg, #0F5FA4 11.31%, #004784 91.64%), linear-gradient(0deg, #2478B5, #2478B5);
  }
}

@media (max-width: 500px) {
  .horizontal {
    .game__left {
      //height: 100dvh !important;
      width: 35% !important;
    }

    .game__center {
      //width: 30% !important;
    }

    .leftPanel {
      padding: 12px 20px !important;
    }

    .game__right {
      height: 100dvh !important;
      width: 35% !important;
    }

    .rightPanel {
      padding: 12px 20px !important;
    }
  }
  .vertical {
    display: flex;
    background-color: $primary-color;
    transform-origin: center;
    width: 100dvh;
    min-height: 100vw;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    overflow: auto;

    .game__left {
      height: 100vw !important;
      width: 35% !important;
    }

    .game__center {
      width: 30% !important;
    }

    .leftPanel {
      padding: 12px 20px !important;
    }

    .game__right {
      height: 100vw !important;
      width: 35% !important;
    }

    .rightPanel {
      padding: 12px 20px !important;
    }
  }
}

@media ((max-width: 900px) and (max-height: 350px)) or ((max-height: 900px) and (max-width: 350px)) {
  .horizontal {
    .game__left {
      //height: 100dvh !important;
      width: 25% !important;
    }

    .game__center {
      //width: 30% !important;
    }

    .leftPanel {
      padding: 12px 20px !important;
    }

    .game__right {
      height: 100dvh !important;
      width: 25% !important;
    }

    .rightPanel {
      padding: 12px 20px !important;
    }
  }
  .vertical {
    .game__left {
      width: 21% !important;
    }

    .leftPanel {
      padding: 6px 10px !important;
    }

    .game__right {
      width: 21% !important;
    }

    .rightPanel {
      padding: 6px 10px !important;
    }
  }
}

@media ((max-width: 900px) and (max-height: 300px)) or ((max-height: 900px) and (max-width: 300px)) {
  .horizontal {
    .game__left {
      //height: 100dvh !important;
      width: 21% !important;
    }

    .game__center {
      //width: 30% !important;
    }

    .leftPanel {
      padding: 12px 20px !important;
    }

    .game__right {
      height: 100dvh !important;
      width: 21% !important;
    }

    .rightPanel {
      padding: 12px 20px !important;
    }
  }
  .vertical {
    .game__left {
      width: 21% !important;
    }

    .leftPanel {
      padding: 6px 10px !important;
    }

    .game__right {
      width: 21% !important;
    }

    .rightPanel {
      padding: 6px 10px !important;
    }
  }
}
</style>