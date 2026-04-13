<script setup lang="ts">
defineProps<{
  leftText?: string;
  centerText?: string;
  rightText?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
}>();
</script>

<template>
  <section class="header">
    <button class="header--left" @click="onLeftClick">
      <img src="@/assets/icons/arrow.svg" alt="">
      {{ leftText }}
    </button>
    <div class="header--center">{{ centerText }}</div>
    <button class="header--right" @click="onRightClick">{{ rightText }}</button>
  </section>
</template>


<style scoped lang="scss">
.header {
  width: 100%;
  background-color: $primary-color;
  padding: 36px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  color: $white-color;
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

  &--center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: $Inter-SemiBold;
    font-weight: 600;
    font-size: 20px;
    line-height: 1.2;
  }

  &--right {
    border: none;
    background-color: transparent;
    font-family: $Inter-SemiBold;
    font-weight: 600;
    font-size: 16px;
    line-height: 1.2;
    color: $white-color;
  }
}
</style>