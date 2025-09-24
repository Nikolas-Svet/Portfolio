<script setup lang="ts">
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > window.innerHeight;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
<section class="index">
  <div class="index__content container__main">
      <p>Узнавайте что-то новое каждый день.</p>
      <span>Станьте профессионалами и будьте готовы выйти в мир.</span>
  </div>
  <div :class="isScrolled ? 'index__wrap2' : 'index__wrap'"></div>
  <SearchCourses></SearchCourses>
  <Teachers></Teachers>
</section>
</template>

<style scoped lang="scss">
.index {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  &__content {
    position: relative;
    z-index: 1;
    height: 580px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
      font-size: 40px;
      color: $primary-white;
      text-align: center;
      width: 90%;
      font-family: $Golos_Text_Medium;
      font-weight: 600;
      margin-bottom: 8px;
    }
    span {
      font-size: 20px;
      color: $primary-white;
      text-align: center;
      font-family: $Golos_Text_Medium;
      font-weight: 500;
    }
  }
  &__wrap {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    background-image: url("@/assets/images/Index/background.webp");
    background-size: cover;
    width: 100%;
    height: 660px;

    &:after {
      inset: 0;
      content: "";
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      backdrop-filter: blur(1px);
    }
  }
  &__wrap2 {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    background-color: $primary-green;
    background-size: cover;
    width: 100%;
    height: 0;
  }
}
</style>
