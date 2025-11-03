<script lang="ts" setup>
import StarIcon from '@/assets/images/star.svg';
const reviews = [
  {
    name: "Online-Händler",
    description: "Durch gezielte Analyse und den Start auf einer neuen Plattform konnten wir unseren Umsatz in nur fünf Monaten um 312 % steigern – ganz ohne zusätzliches Personal oder Mehrkosten. Endlich arbeitet unser Sortiment für uns.",
    rating: 5
  },
  {
    name: "Inhaber Einer Pizzeria",
    description: "Mit ein paar gezielten digitalen Maßnahmen haben wir den Umsatz um 38 % gesteigert – ohne mehr Personal oder längere Arbeitszeiten. Unsere Abläufe sind einfacher, unsere Kunden zufriedener.",
    rating: 5
  },
  {
    name: "Produzierendes Gewerbe",
    description: "Durch die Zusammenarbeit konnten wir unsere Abläufe klar strukturieren. Jetzt reagieren wir schneller auf Kundenanfragen und sparen spürbar Zeit im Alltag. Das Ergebnis hat unsere Erwartungen übertroffen.",
    rating: 5
  },
  {
    name: "B2B-Dienstleistungen",
    description: "Dank der CRM-Einführung konnten wir über 20 % mehr Verträge verwalten – ohne zusätzliches Personal oder Mehraufwand. Ein echter Effizienzgewinn",
    rating: 5
  },
]
</script>

<template>
  <div class="reviews-blocks">
    <div v-for="(review, index) in reviews" :style="{opacity: review.name === '' ? '0' : '1'}" :key="index" class="reviews-blocks__block">
      <p class="reviews-blocks__name">{{ review.name }}</p>
      <div class="reviews-blocks__rating"> <StarIcon v-for="n in review.rating" :key="n" /></div>
      <span class="reviews-blocks__description">{{ review.description }}</span>
    </div>
  </div>
  <button class="reviews-blocks__action">
    Alle Erfolgsgeschichten entdecken
  </button>
</template>

<style lang="scss" scoped>
.reviews-blocks {
  margin-top: calc($primary-margin-sections * 0.75);
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  &__action {
    margin-top: calc($primary-margin-sections * 0.5);
    width: 100%;
    height: 52px;
    //box-shadow: 0 4px 12px 0 #1E988B40;
    font-family: $Inter-Medium;
    font-weight: 500;
    font-size: 16px;
    text-transform: uppercase;
    color: $default-white;
    border-radius: 8px;
    border: 1px solid $default-white;
    transition: all 0.3s ease;
    background-color: transparent;

    &:hover {
      background-color: rgba(255, 255, 255, 0.07);
    }
  }

  &__block {
    position: relative;
    padding: 20px;
    display: flex;
    flex-direction: column;
    background-color: $default-white;
    border: none;
    width: calc(25% - 6px);
    border-radius: $primary-radius;
  }

  &__name {
    font-family: $Inter-Medium;
    font-weight: 500;
    font-size: 16px;
    line-height: 1;
    color: $default-black;
    margin-bottom: 8px;
  }

  &__rating {
    margin-bottom: 16px;

    svg {
      * {
        fill: #F58052;
      }
    }
  }

  &__description {
    display: flex;
    align-items: flex-end;
    flex: 1;
    color: $default-black;
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
  }
}

@media (width < 1200px) {
  .reviews-blocks {
    &__description {
      font-size: 15px;
    }
  }
}

@media (width < 1000px) {
  .reviews-blocks {
    &__block {
      width: calc(50% - 4px);
    }
  }
}

@media (width < 600px) {
  .reviews-blocks {
    &__block {
      width: 100%;

      &:last-child {
        display: none;
      }
    }
  }
  .reviews-blocks__rating {
    margin-bottom: 52px;
  }
  .reviews-blocks__action {
    margin-top: 32px;
  }
}
</style>