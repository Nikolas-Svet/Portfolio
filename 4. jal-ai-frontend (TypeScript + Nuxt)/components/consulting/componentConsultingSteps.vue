<script setup lang="ts">
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import type ITitle from "@/types/UiTitle";
import type {IStep} from "@/types/Steps";
import ArrowIcon from "@/assets/images/arrow.svg";
import {boolean} from "zod";

const props = defineProps({
  title_data: {
    type: Object as PropType<ITitle>,
    required: true
  },
  blocks_data: {
    type: Object as PropType<IStep>,
    required: true
  }
})
</script>

<template>
  <section class="consulting-steps">
    <component-ui-title
        :description-p1_1="props.title_data?.description_p1_1"
        :description-p1_2="props.title_data?.description_p1_2"
        :description-p2="props.title_data?.description_p2"
        :description-span1="props.title_data?.description_span1"
        :title="props.title_data?.title"/>
    <div class="consulting-steps__blocks">
      <div v-for="(block, index) in props.blocks_data" :key="index" class="consulting-steps__block">
        <span class="consulting-steps__number">0{{ index+1 }}</span>
        <h3 class="consulting-steps__title">{{ block.title }}</h3>
        <span class="consulting-steps__subtitle">{{ block.subtitle }}</span>
      </div>
    </div>
    <button class="baseButton__primaryGreen baseButton__w270 consulting-steps__action">
      Kostenloses Erstgespräch vereinbaren
      <ArrowIcon/>
    </button>
  </section>
</template>

<style lang="scss" scoped>
.consulting-steps {
  margin-top: calc($primary-margin-sections * 2);
  margin-bottom: $primary-margin-sections;
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

  &__blocks {
    width: 100%;
    padding-top: calc(0.75 * $primary-margin-sections);
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__block {
    position: relative;
    padding: 20px;
    background-color: $primary-gray-block;
    border: 1px solid $primary-gray-number;
    width: calc(33% - 3px);
    border-radius: $primary-radius;
  }

  &__title {
    font-family: $Manrope-Medium;
    font-weight: 500;
    font-size: clamp(19px, 2vw, 28px);
    line-height: 1;
    color: $primary-green;
    text-transform: uppercase;
    margin-bottom: calc(0.25 * $primary-margin-sections);
  }

  &__number {
    display: flex;
    font-family: $Manrope-Regular;
    font-weight: 400;
    font-size: 70px;
    line-height: 1;
    color: $primary-gray-number;
    padding-bottom: calc(0.25 * $primary-margin-sections);
    border-bottom: 1px solid $color-border;
    margin-bottom: 72px;
  }

  &__subtitle {
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
    color: $default-white;
    opacity: 0.8;
    display: flex;
  }

  &__action {
    margin-top: calc(0.5 * $primary-margin-sections);
    max-width: none !important;

    svg {
      min-width: 20px;
      margin-left: 12px;
    }
  }
}

@media (width < 1024px) {
  .consulting-steps {
    &__number {
      font-size: 60px;
      margin-bottom: 62px;
    }
    &__block {
      width: calc(50% - 4px);
    }
  }
}


@media (width < 720px) {
  .consulting-steps {
    &__blocks {
      margin-bottom: 32px;
    }
    &__number {
      font-size: 44px;
      margin-bottom: 42px;
    }
    &__block {
      width: 100%;
    }
  }
}
</style>