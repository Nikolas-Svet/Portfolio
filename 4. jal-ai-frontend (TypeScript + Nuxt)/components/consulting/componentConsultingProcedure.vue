<script lang="ts" setup>
import type ITitle from "@/types/UiTitle";
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ArrowIcon from "@/assets/images/arrowPath.svg";
import type {IProcedure} from "@/types/Procedure";
import type {IBlocks} from "@/types/ComponentWithRectangle";
import {boolean} from "zod";
// import type {IProcedure} from "@/types/Procedure";

const currentIndex = ref<number>(-1);

const props = defineProps({
  procedures: {
    type: Array as PropType<IProcedure[]>,
    required: false
  },
  title_data: {
    type: Object as PropType<ITitle>,
    required: true
  },
  title_data_second: {
    type: Object as PropType<ITitle>,
    required: false
  },
  blocks: {
    type: Object as PropType<IBlocks>,
    required: true
  },
  is_button: {
    type: String,
    required: false
  }
})

const setIndex = (index: number): void => {
  console.log(props.procedures)
  if (currentIndex.value === index) {
    currentIndex.value = -1;
  } else {
    currentIndex.value = index;
  }
}
</script>

<template>
  <section class="procedure">
    <component-ui-title
        :description-p1_1="props.title_data?.description_p1_1"
        :description-p1_2="props.title_data?.description_p1_2"
        :description-p2="props.title_data?.description_p2"
        :description-p2_2="props.title_data?.description_p2_2"
        :description-span1="props.title_data?.description_span1"
        :title="props.title_data?.title"/>
    <div v-if="props.procedures" class="procedure__content">
      <div v-for="(procedure, index) in props.procedures" :key="index" class="accordion">
        <div class="accordion__header" @click="setIndex(index)">
          <div class="accordion__header--left">
            <span>{{ index + 1 }}.</span>
            <span>{{ procedure.title }}</span>
          </div>
          <div :class="{accordion__activeSvg: currentIndex == index}" class="accordion__header--right">
            <ArrowIcon/>
          </div>
        </div>
        <div :class="{accordion__active: currentIndex === index}" class="accordion__content">
          <div v-for="(item, index_item) in procedure.items" :key="index_item" class="accordion__content--item">
            <div class="accordion__content--header">
              <span>{{index + 1}}.{{ index_item + 1}}</span>
              <span>{{ item.heading }}</span>
            </div>
            <ul :style="{display: item.subItems.length ? 'block' : 'none'}" v-for="(subItem, index_text) in item.subItems" :key="index_text" class="accordion__content--block">
              <li>
                {{ subItem }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <component-ui-title
        v-if="props.title_data_second"
        :description-p1_1="props.title_data_second?.description_p1_1"
        :description-p1_2="props.title_data_second?.description_p1_2"
        :description-p2="props.title_data_second?.description_p2"
        :description-p2_2="props.title_data_second?.description_p2_2"
        :description-span1="props.title_data_second?.description_span1"
        :title="props.title_data_second?.title"/>
    <component-with-rectangle :is_button="props.is_button" :blocks="props.blocks"/>
  </section>
</template>

<style lang="scss" scoped>

.accordion {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: calc($primary-margin-sections * 0.25) 0;
  border-bottom: 1px solid $color-border;

  &__header {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &--left {
      display: flex;
      span {
        font-family: $Manrope-Medium;
        font-weight: 500;
        font-size: clamp(18px, 2vw, 26px);
        line-height: 1;
        color: $default-white;
        text-transform: uppercase;

        &:first-child {
          margin-right: calc($primary-margin-sections * 0.25);
        }
      }
    }
    &--right {
      margin-left: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      background-color: $primary-green;
      border-radius: calc($primary-radius * 0.5);
      svg {
        transform: rotate(90deg) scale(1.5);
        transition: all 0.3s ease;
      }
    }
  }

  &__activeSvg {
    svg {
      transform: rotate(-90deg) scale(1.5) !important;
    }
  }

  &__active {
    padding-top: calc($primary-margin-sections * 0.25) !important;
    clip-path: inset(0 0 0 0) !important;
    max-height: 500px !important;
    transition: all 0.3s ease !important;
  }

  &__content {
    transition: all 0.3s ease;
    clip-path: inset(0 0 100% 0);
    opacity: 1;
    max-height: 0;
    padding-top: 0;
    &--header {
      display: flex;
      margin-bottom: calc($primary-margin-sections * 0.25);
      span {
        font-family: $Manrope-Regular;
        font-weight: 400;
        font-size: clamp(17px, 1.8vw, 22px);
        line-height: 1.2;
        color: $default-white;

        &:first-child {
          margin-right: calc($primary-margin-sections * 0.25);
        }
      }
    }
    &--item {
      margin-top: calc($primary-margin-sections * 0.25) !important;
    }
    &--block {
      padding-left: calc($primary-margin-sections * 0.9);
      li {
        font-family: $Inter-Regular;
        font-size: 16px;
        color: $default-white;
        opacity: 0.8;
        line-height: 2;
        font-weight: 400;
      }
    }
  }
}
.procedure {
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
    padding-top: calc($primary-margin-sections * 0.5);
    margin-bottom: calc($primary-margin-sections * 0.75);
  }
}


@media (width < 375px) {
  .accordion__header--right {
    margin-left: 10px;
    min-width: 24px;
    height: 24px;

    svg {
      transform: rotate(90deg) scale(1.3);
    }
  }
}
</style>