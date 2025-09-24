<script setup lang="ts">
import HeaderComponent from "@/components/header.vue";

import {useRouter} from 'vue-router';
import {computed, onMounted, ref, watch} from "vue";
import {apiGames} from "@/api/games.ts";
import {apiTeam} from "@/api/team.ts";
import {useTeamStore} from "@/store/team"
import {useTeamOpponentStore} from "@/store/teamOpponent.ts";
import {apiTeamOpponent} from "@/api/teamOpponent.ts";
import type {IGame} from "@/types/games.ts";
import {useGamesStore} from "@/store/games.ts";
import {useUserStore} from "@/store/user.ts";
import {parseJwt} from "@/services/jwt.ts";
import {status_start_game} from "@/services/consts.ts";

const router = useRouter();

const teamStore = useTeamStore();
const gamesStore = useGamesStore();
const teamOpponentStore = useTeamOpponentStore();

const userStore = useUserStore();

const games = computed(() => {
  return gamesStore.games;
})



const activeGames = computed(() => {
  return games.value.filter(game => game.status === "upcoming");
});

const activeInGames = computed(() => {
  return games.value.filter(game => game.status === status_start_game);
});

const finishedGames = computed(() => {
  return games.value.filter(game => game.status === "finished");
});

const opponentActive = computed(() => {
  return teamOpponent.value.filter(team => activeGames.value.find(game => team.id === game.opponent));
});

const opponentFinished = computed(() => {
  return teamOpponent.value.filter(team => finishedGames.value.find(game => team.id === game.opponent));
});

const opponentActiveInGames = computed(() => {
  return teamOpponent.value.filter(team => activeInGames.value.find(game => team.id === game.opponent));
});

const gameStatistics = ref<{ [key: number]: any }>({});

watch(finishedGames, async (newFinishedGames: any) => {
  for (const game of newFinishedGames) {
    if (!gameStatistics.value[game.id]) {
      try {
        console.log(`📊 Загружаем статистику для игры ID: ${game.id}`);
        const stats = await apiGames.getStatistic(game.id);
        gameStatistics.value[game.id] = stats;
      } catch (error) {
        console.error(`❌ Ошибка загрузки статистики для игры ID ${game.id}:`, error);
      }
    }
  }
}, { deep: true, immediate: true });

const team = computed(() => {
  return {
    teamId: teamStore.teamId,
    nameTeam: teamStore.nameTeam,
    color: teamStore.color,
    coachId: teamStore.coachId
  }
});

const teamOpponent = computed(() => {
  return teamOpponentStore.opponentTeams
});

const startGame = (gameId: number) => {
  localStorage.removeItem("game_quarter")
  localStorage.removeItem("game_time")
  router.push(`/games/${gameId}/`);
};

async function fetchGames() {
  for (const game of games.value) {
    const data = await apiGames.getGame(game.id);
    console.log("Данные игры:", data);
  }
}

async function fetchTeam() {
  for (const game of games.value) {
    const data = await apiTeam.getTeam(game.team);
    teamStore.setTeam(data.id, data.name, data.color, data.coach)
    console.log("Данные команды:", data);
    return
  }
}

async function fetchTeamOpponent() {
  const gamesFetch = [] as any[]
  for (const game of games.value) {
    const data = await apiTeamOpponent.getOpponentTeam(game.opponent);
    gamesFetch.push(data)
    // teamStore.setTeam(data.id, data.name, data.color, data.coach)
    console.log("Данные команды соперника:", data);
  }
  teamOpponentStore.setTeamOpponent(gamesFetch)
}

async function removeGame(game: IGame) {
  const responce = await apiGames.deleteGame(game.id)
  if (responce) {
    console.log("Succsesfull delete!")
    gamesStore.removeGames(game.id)
  } else {
    console.error("Error delete!")
  }
}

onMounted(async () => {
  try {
    const gamesMounted = await apiGames.getGames();

    if (!userStore.userId) {
      const refreshToken = localStorage.getItem('refresh_token');

      const refreshPayload = parseJwt(refreshToken);

      if (refreshPayload.user_id) {
        userStore.setUserId(refreshPayload.user_id);
      }
    }

    if (gamesMounted.length > 0) {
      gamesStore.setGames(gamesMounted);
      await fetchGames();
      await fetchTeam();
      await fetchTeamOpponent();
    }
  } catch (error) {
    console.error("Ошибка загрузки игр:", error);
  }
});

const logOut = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  router.push("/sign-in/");
};

const addGame = () => {
  console.log("Добавление игры");
  router.push("/add-game/");
};
</script>

<template>
  <section class="index container__main">
    <HeaderComponent
        leftText="Log out"
        centerText="Games"
        rightText="Add Game"
        :onLeftClick="logOut"
        :onRightClick="addGame"
    />
    <div class="index__content">
      <div class="index__active">
        <h2 v-if="activeInGames.length > 0" class="index__active--title">
          Active games
        </h2>
        <div v-if="activeInGames.length > 0" v-for="(game, index) in activeInGames" :key="index + '-teamOpponent'"
             class="game_info">
          <div v-if="!game.is_home_game" class="game_info__title">
            <div class="game_info__teams">
              <!--              <span :style="{backgroundColor: team.color! }"></span>-->
              <span :style="{ backgroundColor: opponentActiveInGames[index]?.color ?? '#ffffff' }"></span>
              <img src="@/assets/images/logo.webp" alt="logo_team">
            </div>
            <div class="game_info__nameTeams">
              <span>{{ opponentActiveInGames[index]?.name || "Not name" }}</span>
              <span>{{ team.nameTeam }}</span>
            </div>
            <div style="display: none">{{ game.id }}</div>
          </div>
          <div v-else class="game_info__title">
            <div class="game_info__teams">
              <!--              <span :style="{backgroundColor: team.color! }"></span>-->
              <img src="@/assets/images/logo.webp" alt="logo_team">
              <span :style="{ backgroundColor: opponentActiveInGames[index]?.color ?? '#ffffff' }"></span>
            </div>
            <div class="game_info__nameTeams">
              <span>{{ team.nameTeam }}</span>
              <span>{{ opponentActiveInGames[index]?.name || "Not name" }}</span>
            </div>
            <div style="display: none">{{ game.id }}</div>
          </div>

          <div class="game_info__actions">
            <button class="game_info__start" @click="startGame(game.id)">Start</button>
            <button class="game_info__delete" @click="removeGame(activeGames[index])">Delete</button>
          </div>
        </div>
        <h2 class="index__active--title">
          upcoming games
        </h2>
        <div v-if="games.length > 0" v-for="(game, index) in activeGames" :key="index + '-teamOpponent'"
             class="game_info">
          <div v-if="!game.is_home_game" class="game_info__title">
            <div class="game_info__teams">
              <!--              <span :style="{backgroundColor: team.color! }"></span>-->
              <span :style="{ backgroundColor: opponentActive[index]?.color ?? '#ffffff' }"></span>
              <img src="@/assets/images/logo.webp" alt="logo_team">
            </div>
            <div class="game_info__nameTeams">
              <span>{{ opponentActive[index]?.name || "Not name" }}</span>
              <span>{{ team.nameTeam }}</span>
            </div>
            <div style="display: none">{{ game.id }}</div>
          </div>
          <div v-else class="game_info__title">
            <div class="game_info__teams">
              <!--              <span :style="{backgroundColor: team.color! }"></span>-->
              <img src="@/assets/images/logo.webp" alt="logo_team">
              <span :style="{ backgroundColor: opponentActive[index]?.color ?? '#ffffff' }"></span>
            </div>
            <div class="game_info__nameTeams">
              <span>{{ team.nameTeam }}</span>
              <span>{{ opponentActive[index]?.name || "Not name" }}</span>
            </div>
            <div style="display: none">{{ game.id }}</div>
          </div>

          <div class="game_info__actions">
            <button class="game_info__start" @click="startGame(game.id)">Start</button>
            <button class="game_info__delete" @click="removeGame(activeGames[index])">Delete</button>
          </div>
        </div>

        <div style="margin-top: 48px" class="index__inactive">
          <h2 class="index__inactive--title">
            Past games
          </h2>
          <div v-if="finishedGames.length > 0" v-for="(game, index) in finishedGames" :key="index + '-teamOpponent-finished'"
               class="game_info">
            <div v-if="!game.is_home_game" class="game_info__title">
              <div class="game_info__teams">
                <!--              <span :style="{backgroundColor: team.color! }"></span>-->
                <span :style="{ backgroundColor: opponentFinished[index]?.color ?? '#ffffff' }"></span>
                <img src="@/assets/images/logo.webp" alt="logo_team">
              </div>
              <div class="game_info__nameTeams">
                <span>{{ opponentFinished[index]?.name || "Not name" }}</span>
                <span>{{ team.nameTeam }}</span>
              </div>
             <div v-if="gameStatistics" class="game_info__scores">
               <span :class="{'game_info__winner': gameStatistics[game.id]?.team_score < gameStatistics[game.id]?.opponent_score}">{{ gameStatistics[game.id]?.opponent_score }}</span>
               <span :class="{'game_info__winner': gameStatistics[game.id]?.team_score > gameStatistics[game.id]?.opponent_score}">{{ gameStatistics[game.id]?.team_score }}</span>
             </div>
              <div style="display: none">{{ game.id }}</div>
            </div>
            <div v-else class="game_info__title">
              <div class="game_info__teams">
                <!--              <span :style="{backgroundColor: team.color! }"></span>-->
                <img src="@/assets/images/logo.webp" alt="logo_team">
                <span :style="{ backgroundColor: opponentFinished[index]?.color ?? '#ffffff' }"></span>
              </div>
              <div class="game_info__nameTeams">
                <span>{{ team.nameTeam }}</span>
                <span>{{ opponentFinished[index]?.name || "Not name" }}</span>
              </div>
              <div v-if="gameStatistics" class="game_info__scores">
                <span :class="{'game_info__winner': gameStatistics[game.id]?.team_score > gameStatistics[game.id]?.opponent_score}">{{ gameStatistics[game.id]?.team_score }}</span>
                <span :class="{'game_info__winner': gameStatistics[game.id]?.team_score < gameStatistics[game.id]?.opponent_score}">{{ gameStatistics[game.id]?.opponent_score }}</span>
              </div>
              <div style="display: none">{{ game.id }}</div>
            </div>

            <div class="game_info__actions">
              <button style="width: 100%;" class="game_info__delete" @click="removeGame(finishedGames[index])">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.index {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;

  &__content {
    padding: 20px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 48px;
  }

  &__active {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;

    &--title {
      width: 100%;
      text-align: left;
      font-family: $Inter-SemiBold;
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;
      color: $primary-green;
      text-transform: uppercase;
    }
  }

  &__inactive {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;

    &--title {
      width: 100%;
      text-align: left;
      font-family: $Inter-SemiBold;
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;
      color: $black-color;
      text-transform: uppercase;
    }
  }

  &__game {
    background-color: $white-color;
    width: 100%;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &--title {
      width: 100%;
      padding: 8px 12px;
      border-bottom: 1px solid $back-color-opacity;

      div {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:first-child {
          margin-right: 24px;
          width: 30%;
          display: flex;
          align-items: center;
          justify-content: space-around;

          span {
            min-width: 48px;
            height: 48px;
            background-color: red;
          }
        }

        &:last-child {
          display: flex;
          width: 70%;
          align-items: flex-start;

          span {
            font-family: $Inter-SemiBold;
            font-weight: 600;
            font-size: 16px;
            line-height: 1.2;
            color: $black-color;

            &:last-child {
              color: $primary-grey !important;
            }
          }
        }
      }
    }
  }
}

.game_info {
  background-color: $white-color;
  width: 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &__winner {
    color: $primary-green !important;
  }

  &__scores {
    display: flex;
    flex-direction: column;
    font-family: $Inter-SemiBold;
    font-weight: 600;
    font-size: 16px;
    line-height: 1.2;
    color: $black-color;
  }

  &__title {
    width: 100%;
    padding: 8px 12px;
    border-bottom: 1px solid $back-color-opacity;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  &__teams {
    width: 100%;
    max-width: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      min-width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: red;
    }

    img {
      min-width: 52px;
      height: 52px;
      border-radius: 50%;
    }
  }

  &__nameTeams {
    display: flex;
    width: 70%;
    align-items: flex-start;
    flex-direction: column;

    span {
      font-family: $Inter-SemiBold;
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;
      color: $black-color;

      &:last-child {
        color: $primary-grey !important;
      }
    }
  }

  &__actions {
    width: 100%;
    display: flex;
    align-items: center;

    button {
      background-color: transparent;
      border: none;
      height: 32px;
      width: 50%;
      border: none;
      font-family: $Inter-SemiBold;
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;
      text-transform: uppercase;
    }
  }

  &__start {
    color: $primary-green;
  }

  &__delete {
    color: $primary-red;
  }
}
</style>