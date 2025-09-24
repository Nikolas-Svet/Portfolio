<script setup lang="ts">
import HeaderComponent from "@/components/header.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { apiGames } from "@/api/games";
import {apiTeamOpponent} from "@/api/teamOpponent.ts";
import {timer_notification} from "@/services/consts.ts";

const errorMessage = ref<string | null>(null);
const errorMessageFlag = ref(false);
const router = useRouter();
const userStore = useUserStore();

const flagHome = ref(false);

const teamName = ref("");
const teamColor = ref("#000000");

const Games = () => {
  router.push("/");
};

const saveGame = async () => {
  console.log("Добавление игры");

  if (!teamName.value) {
    console.warn("Название команды не введено!");
    return;
  }

  try {
    // Получаем ID текущего пользователя (тренера)
    const coachId = userStore.userId;
    if (!coachId) {
      console.error("Ошибка: не удалось получить user_id");
      return;
    }

    // 1. Создаём команду противника
    const opponent = await apiTeamOpponent.createOpponentTeam(teamName.value, teamColor.value)

    if (opponent.success === false) {
      errorMessageFlag.value = true;
      errorMessage.value = opponent.error[0]
      setTimeout(() => {
        errorMessageFlag.value = false;
        setTimeout(()=>{
          errorMessage.value = null
        }, 500)
      }, timer_notification)
      return;
    }
    if (!opponent || !opponent.id) {
      console.error("Ошибка при создании команды противника");
      return;
    }

    // console.log("Создана команда противника, ID:", opponent.id);
    console.log("Создана команда противника, ID:", opponent);

    // 2. Создаём игру с этой командой
    const game = await apiGames.createGame(opponent.id, flagHome.value);
    if (!game || !game.id) {
      console.error("Ошибка при создании игры");
      return;
    }

    console.log("Игра успешно создана, ID:", game);
    router.push("/"); // После создания переходим на главную

  } catch (error) {
    console.error("Ошибка при создании игры:", error);
  }
};
</script>

<template>
  <section class="add-game container__main">
    <HeaderComponent
        leftText="Games"
        centerText="Add Game"
        rightText="Save Game"
        :onLeftClick="Games"
        :onRightClick="saveGame"
    />
    <div class="add-game__content">
      <form class="add-game__form" @submit.prevent="saveGame">
        <div class="add-game__team">
          <div class="add-game__logo">
            <img src="@/assets/images/team.webp" alt="">
            <div :style="{backgroundColor: teamColor}" class="color__container">
              <input type="color" v-model="teamColor" class="add-game__color">
            </div>
          </div>
          <span style="cursor: pointer" @click="flagHome = !flagHome">{{ flagHome ? 'HOME' : 'AWAY' }}</span>
        </div>
        <input type="text" v-model="teamName" class="add-game__nameTeam" placeholder="Name team"/>
      </form>
      <span class="add-game__error" :style="{opacity: errorMessageFlag ? '1' : '0'}"> {{ errorMessage }}</span>
    </div>

  </section>
</template>


<style scoped lang="scss">

.color__container {
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
}

.add-game {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;

  &__error {
    max-width: 300px;
    width: 100%;
    background-color: $primary-color;
    color: $white_color;
    border-radius: 6px;
    padding: 8px;
    transition: opacity 0.5s ease;
    box-shadow: inset 0 0 10px $primary-red;
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 15px;
    text-align: left;
  }

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

  &__form {
    width: 100%;
    padding: 12px;
    background-color: $white-color;
    border-radius: 12px;
    box-shadow: 0 4px 10px 0 #0A2F1326;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 8px;
  }

  &__nameTeam {
    height: 46px;
    width: 100%;
    border: 1px solid $back-color-opacity;
    border-radius: 4px;

    font-family: $Inter-SemiBold;
    font-weight: 600;
    font-size: 18px;
    line-height: 1.2;
    text-align: center;
    color: $black-color;
  }

  &__color {
    padding: 10px;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    outline: none;
    border: none;
    opacity: 0;
  }

  &__team {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    &:after {
      content: "";
      width: 1px;
      height: 100%;
      background-color: $black-color;
      opacity: 0.3;
      left: 50%;
      transform: translate(-50%);
      top: 0;
      position: absolute;
    }

    span {
      width: 51%;
      text-align: center;
      color: $primary-grey;
      text-transform: uppercase;
      font-family: $Inter-SemiBold;
      font-weight: 600;
      font-size: 18px;
      line-height: 1.2;
    }
  }

  &__logo {
    width: 49%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    img {
      width: 64px;
    }
  }
}
</style>