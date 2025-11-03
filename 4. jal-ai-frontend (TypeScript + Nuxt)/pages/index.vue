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

const links = ref<string[]>([Consts.Routes.homeUs, Consts.Routes.homeBeratungsrichtungen, Consts.Routes.homeProjects]);

onMounted(() => {
  setTimeout(() => {
    const hash = window.location.hash

    if (links.value.includes('/' + hash)) {

      document.documentElement.style.scrollBehavior = 'auto'

      nextTick(() => {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
      })

      setTimeout(() => {
        document.documentElement.style.scrollBehavior = ''
      }, 10)
    }
  }, 1)
})

definePageMeta({
  layout: 'layout-default'
})
</script>

<style scoped lang="scss">
</style>
