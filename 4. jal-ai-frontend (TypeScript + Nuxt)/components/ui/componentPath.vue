<script setup lang="ts">
import ArrowIcon from '@/assets/images/arrowPath.svg'
import type { IBreadcrumb } from '@/types/navigation'

const props = defineProps<{
  path: IBreadcrumb[]
}>()

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div v-if="props.path.length" class="breadcrumbs">
    <NuxtLink
      v-for="(item, index) in props.path"
      :key="index"
      class="breadcrumbs__item"
      :class="{ 'breadcrumbs__item--last': index === props.path.length - 1 }"
      :to="item.path"
    >
      {{ item.name }}
      <ArrowIcon v-if="index !== props.path.length - 1" />
    </NuxtLink>
  </div>
  <button class="breadcrumbs__mobile" type="button" @click="goBack">
    <ArrowIcon />
    Zurück
  </button>
</template>

<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &__item {
    margin-bottom: calc(0.5 * $primary-margin-sections);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: 8px;
    font-family: $Inter-Regular;
    font-weight: 400;
    color: $default-white;
    text-decoration: none;

    &--last {
      color: $primary-green !important;
    }
  }

  &__mobile {
    display: none;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: $Inter-Regular;
    font-size: 14px;
    font-weight: 400;
    color: $default-white;

    svg {
      margin-right: 8px;
      transform: rotate(180deg) translateY(1px);
    }
  }
}

@media (width < 600px) {
  .breadcrumbs {
    display: none;

    &__mobile {
      display: flex;
    }
  }
}
</style>
