<script lang="ts" setup>
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ComponentReviewsBlocks from "@/components/index/componentReviewsBlocks.vue";
</script>

<template>
  <section class="reviews">
    <component-ui-title
        description-p1_1="Was unsere Kunden erreicht haben – mit"
        description-p1_2="und"
        description-p2="Reale Erfolgsgeschichten
                      aus unterschiedlichen Branchen,
                      die zeigen, wie smarte Prozesse echten Unterschied machen."
        description-span1="Klarheit, Struktur"
        title="Bewertungen"/>
    <div class="reviews__content">
      <component-reviews-blocks/>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.reviews {
  margin-top: $primary-margin-sections;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  &__content {
    width: 100%;
  }
}
</style>