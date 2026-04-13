<template>
  <component-main/>
  <component-counseling/>
  <component-us/>
  <component-projects/>
  <component-steps/>
  <component-reviews/>
  <component-board/>
</template>
<script setup lang="ts">
import ComponentMain from "@/components/index/componentMain.vue";
import ComponentCounseling from "@/components/index/componentCounseling.vue";
import ComponentUs from "@/components/index/componentUs.vue";
import ComponentProjects from "@/components/index/componentProjects.vue";
import ComponentBoard from "@/components/index/componentBoard.vue";
import ComponentSteps from "@/components/index/componentSteps.vue";
import ComponentReviews from "@/components/index/componentReviews.vue";
import {Consts} from "@/consts";

useHead({
  title: 'Home',
})

useScrollToHashOnMount([
  Consts.Routes.homeBeratungsrichtungen,
  Consts.Routes.homeUs,
  Consts.Routes.homeProjects,
])

definePageMeta({
  layout: 'layout-default'
})
</script>

<style scoped lang="scss">
</style>
