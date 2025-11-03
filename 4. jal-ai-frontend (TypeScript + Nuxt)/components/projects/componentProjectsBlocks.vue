<script setup lang="ts">
import type {IProjectsBlocks} from "@/types/ProjectsBlocks";

const props = defineProps({
  projects_blocks: {
    type: Array as PropType<IProjectsBlocks[]>,
    required: true
  },
})
</script>

<template>
<section class="projects-blocks baseBorderBottom">
  <div v-for="(project, index) in props.projects_blocks" :key="index" class="projects-blocks__block">
    <div class="projects-blocks__left">
      <span>{{ project.title }}</span>
    </div>
    <div class="projects-blocks__right">
      <div>
        <h3 class="projects-blocks__title">{{ project.left_block.title }}</h3>
        <p class="projects-blocks__subtitle">{{ project.left_block.subtitle }}</p>
        <span class="projects-blocks__description">{{ project.left_block.description }}</span>
        <component :is="project.left_block.iconSvg"/>
      </div>
      <div>
        <h3 class="projects-blocks__title">{{ project.right_block.title }}</h3>
        <p class="projects-blocks__subtitle">{{ project.right_block.subtitle }}</p>
        <span class="projects-blocks__description">{{ project.right_block.description }}</span>
        <component :is="project.right_block.iconSvg"/>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped lang="scss">
.projects-blocks {
  display: flex;
  flex-direction: column;

  &__block {
    height: clamp(250px, 23.5vw, 301px);
    display: flex;
    width: 100%;
    padding: calc(0.25 * $primary-margin-sections) 0;
    border-bottom: 1px solid $color-border;

    &:last-child {
      padding: calc(0.25 * $primary-margin-sections) 0 0 0;
      border-bottom: none;
    }
  }

  &__left {
    span {
      font-family: $Manrope-Regular;
      font-weight: 400;
      font-size: 22px;
      line-height: 1;
      color: $default-white;
      max-width: 225px;
      display: flex;
    }
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  &__right {
    width: $width-default-block;
    display: flex;
    div {
      display: flex;
      position: relative;
      flex-direction: column;
      padding: calc(0.25 * $primary-margin-sections);

      &:first-child {
        width: 51%;
        background-color: $primary-gray-block;
        border-radius: $primary-radius 0 0 $primary-radius;
      }

      &:last-child {
        width: 49%;
        border-radius: $primary-radius;
        background-color: $primary-green;
        border: 2px dashed $default-white;
        * {
          color: $default-white !important;
        }

        h3 {
          opacity: 0.8;
        }
      }
    }

  }
  &__title {
    font-family: $Manrope-Medium;
    font-weight: 500;
    font-size: clamp(18px, 1.86vw, 24px);
    color: $primary-gray-number;
    margin-bottom: 8px;
  }
  &__subtitle {
    flex: 1;
    font-family: $Manrope-Medium;
    font-weight: 500;
    line-height: 1;
    width: 70%;
    text-transform: uppercase;
    color: $default-white;
    font-size: clamp(18px, 2vw, 28px);
  }
  &__description {
    font-family: $Manrope-Regular;
    font-weight: 400;
    font-size: clamp(16px, 1.7vw, 21px);
    line-height: 1;
    color: $default-white;
  }
  svg {
    position: absolute !important;
    top: 20px !important;
    right: 20px !important;
  }
}

@media (width < 940px) {
  .projects-blocks {
    gap: 16px;
    &__block {
      padding-bottom: 16px;
      height: auto;
      gap: 16px;
      flex-direction: column;
      div {
        width: 100% !important;
      }
    }
    &__right {
      height: 220px;
    }
  }
}

@media (width < 768px) {
  svg {
    transform: scale(0.8);
  }
}

@media (width < 600px) {
  .projects-blocks {
    &__right {
      height: auto;
      flex-direction: column;
      div {
        padding: 20px;
        height: 220px;
      }
    }

    &__subtitle {
      font-size: 22px;
    }
  }
}
</style>