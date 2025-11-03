<script lang="ts" setup>
import ArrowIcon from "@/assets/images/arrowPath.svg";

const props = defineProps({
  path: {
    type: Array as PropType<any[]>,
    required: true
  }
})

const goBack = () => {
  const router = useRouter()
  router.back()
}


</script>

<template>
  <div v-if="props.path.length" class="path">
    <router-link v-for="(p, index) in props.path" :key="index" :class="{path__last: index === (props.path.length - 1)}"
                 :to="p.path">{{ p.name }}
      <ArrowIcon v-if="index !== (props.path.length - 1)"/>
    </router-link>
  </div>
  <div @click="goBack" class="path__mobile">
    <ArrowIcon/>
    Zurück
  </div>
</template>

<style lang="scss" scoped>
.path {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  a {
    text-decoration: none;
    margin-bottom: calc(0.5 * $primary-margin-sections);
    font-family: $Inter-Regular;
    font-weight: 400;
    color: $default-white;
    margin-right: 8px;
    gap: 8px;
    display: flex;
  }

  &__last {
    color: $primary-green !important;
  }

  &__mobile {
    margin-bottom: 20px;
    display: none;
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 14px;
    color: $default-white;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    svg {
      margin-right: 8px;
      transform: rotate(180deg) translateY(1px);
    }
  }
}

@media (width < 600px) {
  .path {
    display: none;

    &__mobile {
      display: flex;
    }
  }
}
</style>