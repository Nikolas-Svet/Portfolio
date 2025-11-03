<script lang="ts" setup>
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import type ITitle from "@/types/UiTitle";
import type {IPromotion} from "@/types/Promotion";
import ArrowIcon from "@/assets/images/arrow.svg";

const props = defineProps({
  promotions: {
    type: Array as PropType<IPromotion[]>,
    required: true
  },
  title_data: {
    type: Object as PropType<ITitle>,
    required: true
  }
})
</script>

<template>
  <section class="promotion">
    <component-ui-title
        :description-p1_1="props.title_data?.description_p1_1"
        :description-p1_2="props.title_data?.description_p1_2"
        :description-p2="props.title_data?.description_p2"
        :description-span1="props.title_data?.description_span1"
        :title="props.title_data?.title"/>
    <div class="promotion__content">
      <div class="promotion__blocks">
        <div v-for="(promotion, index) in props.promotions" :key="index" class="promotion__block">
          <h4 class="promotion__title">{{ promotion.name }}</h4>
          <span class="promotion__subtitle">{{ promotion.description }}</span>
        </div>
      </div>
      <button class="baseButton__primaryGreen baseButton__w270 promotion__action">
        Kostenloses Erstgespräch vereinbaren
        <ArrowIcon/>
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.promotion {
  padding-top: $primary-margin-sections;
  margin-bottom: $primary-margin-sections;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
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

  &__content {
    width: $width-default-block;
  }

  &__blocks {
    width: 100%;
    padding-top: calc(0.75 * $primary-margin-sections);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__block {
    position: relative;
    width: 33%;
    border-radius: $primary-radius;
  }

  &__title {
    font-family: $Manrope-Medium;
    font-weight: 500;
    font-size: clamp(16px, 2vw, 28px);
    line-height: 1;
    color: $default-white;
    text-transform: uppercase;
  }

  &__subtitle {
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
    color: $primary-light-gray;
    margin-top: calc(0.25 * $primary-margin-sections);
    display: flex;
    width: 89%;
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


@media (width < 768px) {
  .promotion {
    &__title {
      font-size: clamp(18px, 2vw, 28px);
    }
  }
}

@media (width < 670px) {
  .promotion {
    &__blocks {
      margin-bottom: 32px;
      gap: 32px;
    }
    &__block {
      width: 100%;
    }
    &__title {
      font-size: clamp(23px, 2vw, 28px);
    }
  }
}
</style>