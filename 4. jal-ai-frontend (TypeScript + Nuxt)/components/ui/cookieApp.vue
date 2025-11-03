<script lang="ts" setup>
import ArrowIcon from "@/assets/images/arrow.svg";

const isShowCookies = ref<boolean>(false);

onMounted(() => {
  const cookiesAccepted = localStorage.getItem('cookiesAccepted') === '1';
  isShowCookies.value = cookiesAccepted ? false : true;
})

const acceptCookies = () => {
  isShowCookies.value = false
  localStorage.setItem('cookiesAccepted', '1')
}
</script>

<template>
  <section :style="{bottom: isShowCookies ? '20px' : '-800px'}" class="cookies">
    <div class="cookies__content">
      <p class="cookies__text">
        Wir setzen Cookies ein, um die Nutzung der Webseite für den Besucher einfacher und bequemer zu gestalten bzw.
        bestimmte Funktionen überhaupt erst zu ermöglichen. Durch die Nutzung dieser Webseite erklären Sie sich mit der
        Verwendung von Cookies einverstanden. Weitere Infos entnehmen Sie unserer Datenschutzerklärung.
      </p>
      <button class="cookies__action baseButton__primaryGreen baseButton__w270" @click="acceptCookies">
        Ich akzeptiere
        <ArrowIcon/>
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cookies {
  position: fixed;
  z-index: 2;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1300px;
  width: 100%;
  padding: 0 20px;
  transition: bottom 0.3s ease;

  &__content {
    width: 100%;
    border-radius: $primary-radius;
    background-color: $default-white;
    padding: 20px;
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }

  &__text {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 16px;
    color: $default-black;
    max-width: 900px;
    width: 100%;
  }

  &__action {
    //min-width: 256px;
  }
}

@media (width < 768px) {
  .cookies__content {
    flex-direction: column;
  }
}
</style>