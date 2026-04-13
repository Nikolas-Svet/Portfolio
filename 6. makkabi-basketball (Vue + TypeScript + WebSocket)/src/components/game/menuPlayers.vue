<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, onMounted } from "vue";
import type { PropType } from "vue";
import type { IPlayer } from "@/types/player.ts";
import { usePlayersStore } from "@/store/players.ts";
import { apiPlayers } from "@/api/players.ts";

const props = defineProps({
  players: Array as PropType<IPlayer[]>,
  isTimerRunning: Boolean,
  isPortrait: Boolean
});

const emit = defineEmits(["close", "update_players"]);
const playersStore = usePlayersStore();

// **Храним оригинальные данные при открытии**
const originalPlayers = ref<IPlayer[]>([]);
const modifiedPlayers = ref<IPlayer[]>([]);

// **Выбранные индексы игроков (по текущему списку, а не оригинальному)**
const selectedMainIndex = ref<number | null>(null);
const selectedSubIndex = ref<number | null>(null);

// **Загружаем оригинальный список при открытии**
onMounted(() => {
  console.log("Исходный массив:", props.players)
  originalPlayers.value = JSON.parse(JSON.stringify(props.players || [])); // Создаем копию
  modifiedPlayers.value = JSON.parse(JSON.stringify(props.players || [])); // Создаем редактируемый массив
});

// **Фильтрация активных и запасных игроков (обновленный индекс)**
const activePlayers = computed(() =>
    modifiedPlayers.value
        .filter((player) => player.is_active)
        .map((player, index) => ({ ...player, currentIndex: index })) // ✅ Присваиваем правильный индекс
);

const inactivePlayers = computed(() =>
    modifiedPlayers.value
        .filter((player) => !player.is_active)
        .map((player, index) => ({ ...player, currentIndex: index })) // ✅ Присваиваем правильный индекс
);

// **Форматирование имени (Имя + первая буква фамилии)**
const getShortName = (fullName: string) => {
  const parts = fullName.split(" ");
  const firstName = parts[0];
  const lastInitial = parts.length > 1 ? parts[1].charAt(0) + "." : "";
  return `${firstName} ${lastInitial}`.trim();
};

// **Функция выбора игрока слева (активный)**
const selectMainPlayer = (playerIndex: number) => {
  selectedMainIndex.value = selectedMainIndex.value === playerIndex ? null : playerIndex;
  console.log(selectedMainIndex.value);
  checkSwap();
};

// **Функция выбора игрока справа (запасной)**
const selectSubPlayer = (playerIndex: number) => {
  selectedSubIndex.value = selectedSubIndex.value === playerIndex ? null : playerIndex;
  console.log(selectedSubIndex.value);
  checkSwap();
};

// **Функция смены игроков, сохраняя индексы**
const checkSwap = () => {
  if (selectedMainIndex.value !== null && selectedSubIndex.value !== null) {
    const activeList = activePlayers.value;
    const inactiveList = inactivePlayers.value;

    const mainPlayer = activeList[selectedMainIndex.value];
    const subPlayer = inactiveList[selectedSubIndex.value];

    mainPlayer.is_active = false;
    subPlayer.is_active = true;

    activeList[selectedMainIndex.value] = subPlayer
    inactiveList[selectedSubIndex.value] = mainPlayer

    modifiedPlayers.value = [...activeList, ...inactiveList]

    selectedMainIndex.value = null;
    selectedSubIndex.value = null;

    // console.log("mainPlayer", mainPlayer)
    // console.log("subPlayer", subPlayer)
    //
    // console.log("Массив до смены", modifiedPlayers.value);
    //
    // if (mainPlayer && subPlayer) {
    //   modifiedPlayers.value = modifiedPlayers.value.map((player) => {
    //     if (player.id === mainPlayer.id) return { ...player, is_active: false };
    //     if (player.id === subPlayer.id) return { ...player, is_active: true };
    //     return player;
    //   });
    //
    //   // **Сбрасываем выделение**
    //   selectedMainIndex.value = null;
    //   selectedSubIndex.value = null;
    // }
    //
    // console.log("Массив после смены", modifiedPlayers.value);
  }
};

// **Функция сохранения изменений с `PUT` запросом**
const saveChanges = async () => {
  const updatedPlayers = modifiedPlayers.value.filter((player) => {
    const originalPlayer = originalPlayers.value.find((orig) => orig.id === player.id);
    return originalPlayer && player.is_active !== originalPlayer.is_active;
  });

  console.log("✅ Отправляем PUT запрос для игроков:", updatedPlayers);

  try {
    // if (props.isTimerRunning) {
    //   const updatedPlayerData  = {
    //     game: updatedPlayers[0].id,
    //     name: player.name,
    //     number: player.number,
    //     position: player.position,
    //     team: player.team,
    //     is_active: player.is_active, // Обновленный параметр
    //   };
    // }
    for (const player of updatedPlayers) {
      const updatedPlayerData: IPlayer = {
        id: player.id,
        name: player.name,
        number: player.number,
        position: player.position,
        team: player.team,
        is_active: player.is_active, // Обновленный параметр
      };

      await apiPlayers.updatePlayer(player.id!, updatedPlayerData); // ✅ Отправляем полный объект игрока
    }
    playersStore.setPlayers(modifiedPlayers.value);
    emit("update_players");
  } catch (error) {
    console.error("❌ Ошибка при обновлении игроков:", error);
  }

  closeMenu();
};

// **Закрытие меню без изменений**
function closeMenu() {
  modifiedPlayers.value = JSON.parse(JSON.stringify(originalPlayers.value)); // ❌ Откатываем изменения
  emit("close");
}
</script>

<template>
  <section :style="{height: !isPortrait ? '100dvh' : '100dvw'}" class="menuPlayers">
    <div class="menuPlayers__header">
      <button @click="closeMenu" class="menuPlayers__header--left">
        <img src="@/assets/icons/arrow.svg" alt="" />
        Game
      </button>
      <h2 class="menuPlayers__title">Substitution</h2>
      <button @click="saveChanges" class="menuPlayers__header--right">Save</button>
    </div>
    <div class="menuPlayers__content">
      <!-- **Игроки в игре (левая панель)** -->
      <div class="menuPlayers__left">
        <div>Playing</div>
        <button
            v-for="(player, index) in activePlayers"
            :key="player.id"
            :class="{ 'active__main': selectedMainIndex === index }"
            @click="selectMainPlayer(index)"
        >
          <span class="menuPlayers__number">{{ player.number }}</span>
          <p class="menuPlayers__name">{{ getShortName(player.name) }}</p>
        </button>
      </div>

      <!-- **Запасные игроки (правая панель)** -->
      <div class="menuPlayers__right">
        <button
            v-for="(player, index) in inactivePlayers"
            :key="player.id"
            :class="{ 'active': selectedSubIndex === index }"
            @click="selectSubPlayer(index)"
        >
          <span class="menuPlayers__number">{{ player.number }}</span>
          <p class="menuPlayers__name">{{ getShortName(player.name) }}</p>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.active__main {
  border: 2px solid $primary-red !important;
}

.active {
  border: 2px solid $primary-green !important;
}
.menuPlayers {
  height: 100dvh;
  max-width: 1200px;
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  background-color: $primary-color;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.290196078);


  &__header {
    background-color: $primary-color_3;
    width: 100%;
    position: relative;
    padding: 14px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &--left {
      border: none;
      background-color: transparent;
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 16px;
      line-height: 1.2;
      color: $white-color;

      img {
        width: 6px;
        margin-right: 6px;
      }
    }

    &--right {
      border: none;
      background-color: transparent;
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 16px;
      line-height: 1.2;
      color: $white-color;
    }
  }

  &__title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 20px;
    color: $white-color;
  }

  &__content {
    width: 100%;
    padding: 12px 40px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__left {
    height: 100%;
    max-height: 320px;
    max-width: 208px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    div {
      height: calc(33% - 11px);
      max-height: 96px;
      aspect-ratio: 1/1;
      align-content: center;
      text-align: center;
      font-family: $Inter-SemiBold;
      font-weight: 700;
      font-size: 16px;
      line-height: 1.2;
      color: $white-color;
      text-transform: uppercase;
    }

    button {
      padding: 12px 2px;
      flex-direction: column;
      height: calc(33% - 11px);
      max-height: 96px;
      aspect-ratio: 1/1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $white-color;
      border: 2px solid $primary-green;
      border-radius: 12px;
      background-color: $primary-color_3;
    }
  }

  &__right {
    overflow: auto;
    height: 100%;
    max-height: 320px;
    max-width: 320px;
    justify-content: flex-end;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    button {
      padding: 12px 2px;
      flex-direction: column;
      height: calc(33% - 11px);
      max-height: 96px;
      aspect-ratio: 1/1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $white-color;
      border: 2px solid $white-color;
      border-radius: 12px;
      background-color: $primary-color_3;
    }
  }

  &__number {
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 32px;
    color: $white-color;
    margin-bottom: 4px;
  }

  &__name {
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
    color: $white-color;
  }

}

@media (max-height: 400px) {
  .menuPlayers {

    &__left, &__right {
      gap: 6px;

      div, button {
        height: calc(33% - 4px);
      }
    }
    &__number {
      font-size: 26px;
    }

    &__name {
      font-size: 14px;
    }
  }
}
</style>