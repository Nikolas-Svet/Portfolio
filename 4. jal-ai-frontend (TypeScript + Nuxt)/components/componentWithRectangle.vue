<script lang="ts" setup>
import type {IBlocks} from "@/types/ComponentWithRectangle";
import ArrowIcon from "@/assets/images/arrow.svg";

const props = defineProps({
  blocks: {
    type: Array as PropType<IBlocks[]>,
    required: true
  },
  is_button: {
    type: String,
    required: false
  }
})
</script>

<template>
  <section class="blocks">
    <div v-for="(block, index) in props.blocks" :key="index" :style="{width: `${100 / props.blocks.length}%`}"
         class="blocks__item">
      <div class="blocks__rectangle">
        <div v-for="n in (index + 1)" :key="n"></div>
      </div>
      <h4 class="blocks__name">{{ block.name }}</h4>
      <p class="blocks__description">{{ block.description }}</p>
    </div>
  </section>
  <button v-if="props.is_button" class="blocks__action baseButton__primaryGreen baseButton__w270">
    <span>{{ props.is_button }}</span>
    <ArrowIcon/>
  </button>
</template>

<style lang="scss" scoped>
.blocks {
  width: 100%;
  display: flex;
  margin-top: calc($primary-margin-sections * 0.75);

  &__item {
    padding-right: calc($primary-margin-sections * 0.5);
    display: flex;
    flex-direction: column;
  }

  &__rectangle {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;

    div {
      background-color: $primary-green;
      height: 20px;
      width: 20px;
      border-radius: calc($primary-radius * 0.5);
    }
  }

  &__name {
    flex: 1;
    font-family: $Manrope-Medium;
    font-weight: 500;
    font-size: clamp(20px, 2vw, 28px);
    line-height: 1;
    color: $default-white;
    text-transform: uppercase;
    margin-bottom: calc(0.25 * $primary-margin-sections);
  }

  &__description {
    font-family: $Inter-Regular;
    font-size: 16px;
    color: $primary-light-gray;
    font-weight: 400;
  }

  &__action {
    margin-top: calc(0.5 * $primary-margin-sections);
    max-width: none !important;

    svg {
      margin-left: 12px;
    }
  }
}

@media (width < 960px) {
  .blocks {
    flex-wrap: wrap;
    gap: 32px 0;
    &__item {
      width: 50% !important;
    }
  }
}

@media (width < 960px) {
  .blocks {
    &__item {
      width: 100% !important;
    }
  }
}

</style>