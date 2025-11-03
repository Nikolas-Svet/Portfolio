<script setup lang="ts">
import type ITitle from "@/types/UiTitle";
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";

const props = defineProps({
  title_data: {
    type: Object as PropType<ITitle>,
    required: true
  }
})
</script>

<template>
<section class="approach">
  <component-ui-title
      :description-p1_1="props.title_data?.description_p1_1"
      :description-p1_2="props.title_data?.description_p1_2"
      :description-p2="props.title_data?.description_p2"
      :description-span1="props.title_data?.description_span1"
      :title="props.title_data?.title"
      :description-p2_2="props.title_data?.description_p2_2"
  />
  <div class="approach__content">
    <div class="approach__image"></div>
    <div class="approach__image"></div>
  </div>
</section>
</template>

<style lang="scss">
.approach {
  padding-top: $primary-margin-sections;
  margin-bottom: $primary-margin-sections;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  position: relative;

  .section-header__description p {
    display: inline-block;
    margin-right: 16px;
  }

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
    padding-top: calc(0.75 * $primary-margin-sections);
    width: $width-default-block;
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }
  &__image {
    border-radius: $primary-radius;
    aspect-ratio: 32/19;
    background-size: cover;
    &:first-child {
      width: 64%;
    }
    &:last-child {
      width: calc(36% - 8px);
    }
  }
}

@media (width < 510px) {
  .approach {
    &__image {
      &:first-child {
        display: none;
      }
      &:last-child {
        width: 100%;
        transform: scaleX(1) !important;
      }
    }
  }
}
</style>