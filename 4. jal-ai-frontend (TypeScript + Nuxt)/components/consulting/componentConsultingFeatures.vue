<script setup lang="ts">
import type {IFeature} from "@/types/Features";

const props = defineProps<{
  features: IFeature[]
}>();
</script>

<template>
<section class="features">
  <div v-for="(feature, index) in props.features" :key="index" class="features__block">
    <component :is="feature.iconSvg" class="features__icon" />
    <h3 class="features__title">{{ feature.name }}</h3>
    <p class="features__subtitle">{{ feature.description }}</p>
  </div>
</section>
</template>

<style scoped lang="scss">
.features {
  margin-top: calc( 0.75 * $primary-margin-sections);
  margin-bottom: $primary-margin-sections;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border: 1px solid $primary-gray-number;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    bottom: calc(-1 * $primary-margin-sections);
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $primary-light-gray;
    opacity: 0.1;
  }

  &__block {
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
    border-right: 1px solid $primary-gray-number;

    &:last-child {
      border-right: none;
    }
  }

  &__icon {
    height: 50px;
    width: 50px;
    margin-bottom: calc( 1.25 * $primary-margin-sections);
  }

  &__title {
    font-family: $Manrope-Medium;
    color: $default-white;
    font-size: clamp(23px, 2vw, 28px);
    font-weight: 500;
    line-height: 1;
    margin-bottom: 16px;
  }

  &__subtitle {
    flex: 1;
    align-content: flex-end;
    font-family: $Inter-Regular;
    color: $default-white;
    font-size: 16.2px;
    font-weight: 400;
  }
}

@media (width < 1000px) {
  .features {
    &__block {
      width: 50%;

      &:first-child, &:nth-child(2) {
        border-bottom: 1px solid $primary-gray-number;
      }
    }

    &__icon {
      transform: scale(0.8);
    }
  }
}

@media (width < 580px) {
  .features {
    &__block {
      width: 100%;

      &:nth-child(3) {
        border-bottom: 1px solid $primary-gray-number;
      }
    }
    &__icon {
      transform: scale(0.7);
    }
  }
}
</style>