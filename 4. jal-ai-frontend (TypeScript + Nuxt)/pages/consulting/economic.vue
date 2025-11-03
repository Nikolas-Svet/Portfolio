<script lang="ts" setup>

import ComponentConsultingMain from "@/components/consulting/componentConsultingMain.vue";
import ComponentConsultingPurpose from "@/components/consulting/componentConsultingPurpose.vue";
import type ITitle from "@/types/UiTitle";
import ComponentConsultingApproach from "@/components/consulting/componentConsultingApproach.vue";
import type {IPromotion} from "@/types/Promotion";
import ComponentConsultingPromotion from "@/components/consulting/componentConsultingPromotion.vue";
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ComponentConsultingSteps from "@/components/consulting/componentConsultingSteps.vue";
import ComponentConsultingProcedure from "@/components/consulting/componentConsultingProcedure.vue";
import type {IProcedure} from "@/types/Procedure";
import type {IBlocks} from "@/types/ComponentWithRectangle";
import type {IStep} from "@/types/Steps";
import {Consts} from "@/consts";

useHead({
  title: 'Consulting — Economic',
})

definePageMeta({
  layout: 'layout-default'
})

onMounted(() => {
  document.documentElement.style.scrollBehavior = 'auto'

  setTimeout(() => {
    document.documentElement.style.scrollBehavior = ''
  }, 1000)
})

const title_data = ref<ITitle>({
  description_p1_1: '',
  description_p1_2: 'messbare Verbesserungen in Ihren Abläufen, Systemen und Strukturen',
  description_p2: '',
  description_span1: 'Unsere Ziele:',
  title: 'Ziele',
})

const purpose = [
  {
    name: "Finanzprozesse optimieren",
    description: "Abläufe effizienter gestalten und automatisieren.",
    count_rectangle: 1
  },
  {
    name: "Dokumentenmanagement digitalisieren",
    description: "Papierkram reduzieren, Überblick gewinnen.",
    count_rectangle: 2
  },
  {
    name: "Berichtswesen vorbereiten",
    description: "Reporting professionell und fristgerecht erstellen.",
    count_rectangle: 3
  },
  {
    name: "Mit Steuerexperten kooperieren",
    description: "Reibungslose Zusammenarbeit mit Kanzleien.",
    count_rectangle: 4
  }
]

const title_data_approach = ref<ITitle>({
  description_p1_1: 'Unser',
  description_p1_2: '',
  description_p2: 'Wir analysieren Ihre Prozesse und begleiten Sie bei der digitalen Transformation – von der Auswahl der Tools bis zur Fördermittelbeantragung.',
  description_span1: 'Ansatz',
  title: 'Ansatz',
})

const title_data_promotion = ref<ITitle>({
  description_p1_1: 'So',
  description_p1_2: 'wir Sie',
  description_p2: 'Wir verbinden Beratung, Koordination und Umsetzung – alles aus einer Hand.',
  description_span1: 'unterstützen',
  title: 'Unsere Rolle',
})

const promotions = ref<IPromotion[]>([
  {
    name: 'Geschäftsprozesse optimieren',
    description: 'Wir unterstützen Sie bei der effizienten Gestaltung Ihrer Finanz- und Buchhaltungsprozesse – digital, klar und rechtskonform.'
  },
  {
    name: 'Zusammenarbeit koordinieren',
    description: 'Wir koordinieren die Zusammenarbeit mit Steuerberatern, Juristen und Wirtschaftsprüfern für einen reibungslosen Ablauf.'
  },
  {
    name: 'Strategien umsetzen',
    description: 'Wir bringen steuerliche und rechtliche Strategien in die praktische Umsetzung – direkt im Alltag Ihres Unternehmens.'
  }
])

const title_data_block = ref<ITitle>({
  description_p1_1: '',
  description_p1_2: 'Hinweis',
  description_p2: 'Die JAL Consulting GmbH ist keine Steuer- oder Rechtsberatungskanzlei. Steuerliche und rechtliche Beratungen erfolgen ausschließlich durch zugelassene Experten, insbesondere durch Fachkräfte der wirtschaftsrechtlichen Kanzlei Beratergruppe GmbH. Unsere Rolle besteht in der unternehmerischen Begleitung, Koordination und praktischen Umsetzung von Maßnahmen im Unternehmen.',
  description_span1: 'Rechtlicher',
  title: 'Hinweis',
})

const title_data_procedure = ref<ITitle>({
  description_p1_1: 'Darum',
  description_p1_2: '',
  description_p2: 'Individuelle Businessberatung – rechtssicher, digital und mit starkem Expertennetzwerk.',
  description_span1: 'lohnt es sich für Sie',
  title: 'Mehrwert',
})


const procedures_blocks = ref<IBlocks[]>([
  {
    name: 'Experten an Ihrer Seite',
    description: 'Unterstützung durch Experten für Steuern, Recht, Unternehmen und Strategie'
  },
  {
    name: 'Digitale Finanzprozesse',
    description: 'Vollständig digitale, zeitsparende Buchhaltungs- und Finanzprozesse'
  },
  {
    name: 'Finanzabschlüsse',
    description: 'Erstellung von Finanzberichten und Jahresabschlüssen'
  },
  {
    name: 'Steuerstrategie sichern',
    description: 'Steuervorteile gesetzeskonform nutzen – mit unserem Expertennetzwerk'
  }
])


const title_data_steps = ref<ITitle>({
  description_p1_1: '',
  description_p1_2: '- Modell unserer Unternehmensberatung',
  description_p2: 'Jeder Schritt bringt Sie näher zu einem effizienteren und nachhaltigeren Geschäftsmodell.',
  description_p2_2: '',
  description_span1: 'Schritt-für-Schritt',
  title: 'Schritt',
})

const steps = ref<IStep[]>([
  {
    title: 'Analyse der Buchhaltungs-und Finanzprozesse',
    subtitle: 'Wir erfassen und dokumentieren den aktuellen Stand der Buchhaltung, der Dokumentenverarbeitung und des Finanzmanagements.'
  },
  {
    title: 'Digitalisierung & Prozesseffizienz',
    subtitle: 'Wir analysieren den Einsatz digitaler Systeme und identifizieren Potenziale zur Verbesserung von Arbeitsabläufen und Dokumentation.'
  },
  {
    title: 'Optimierung der Buchhaltungsprozesse',
    subtitle: 'Wir entwickeln neue, effizientere Prozesse für die digitale Dokumentenverarbeitung, Freigabe und revisionssichere Archivierung.'
  },
  {
    title: 'Digitale Integration & Schnittstellen',
    subtitle: 'Wir entwickeln neue Systeme und sorgen für optimale Schnittstellen zu Steuerberatern und anderen Partnern.'
  },
  {
    title: 'Steuerstrukturierung mit Experten',
    subtitle: 'Gemeinsam mit der Beratergruppe GmbH begleiten wir die Umsetzung steuerlicher und rechtlicher Strukturen.'
  },
  {
    title: 'Laufende Betreuung & Optimierung',
    subtitle: 'Auch nach der Umsetzung stehen wir Ihnen weiterhin beratend zur Seite und unterstützen Sie bei der Weiterentwicklung Ihrer Finanzorganisation'
  }
])

const path = ref<any[]>([
  {
    name: 'Startseite',
    path: Consts.Routes.home
  },
  {
    name: 'Beratungsrichtungen',
    path: Consts.Routes.homeBeratungsrichtungen
  },
  {
    name: 'Wirtschaftsberatung',
    path: Consts.Routes.consultingEconomic
  }
])
</script>

<template>
  <div class="economic">
    <component-consulting-main
        :path="path"
        name_button="Kostenloses Erstgespräch vereinbaren"
        sub_title="Viele Unternehmen verlieren Zeit und Geld durch ineffiziente Buchhaltung, mangelnde Digitalisierung und ungenutzte steuerliche Möglichkeiten. Wir helfen, Prozesse zu verbessern und die Zusammenarbeit mit Steuerberatern zu vereinfachen."
        title_1_1=""
        title_1_2="für effiziente Finanzprozesse und klare Dokumentation"
        title_span="Wirtschaftsberatung"
    />
    <component-consulting-purpose :purpose="purpose" :title_data="title_data"/>
    <component-consulting-approach :title_data="title_data_approach"/>
    <component-consulting-promotion :promotions="promotions" :title_data="title_data_promotion"/>
    <div class="economic__titleBlock baseBorderBottom">
      <component-ui-title
          :description-p1_1="title_data_block.description_p1_1"
          :description-p2 = 'title_data_block.description_p2'
          :description-p1_2="title_data_block.description_p1_2"
          :description-span1="title_data_block.description_span1"
          :title="title_data_block.title"/>
    </div>
    <component-consulting-procedure style="display: none" :blocks="procedures_blocks"
                                    :title_data="title_data_procedure" is_button="Kostenloses Erstgespräch vereinbaren"
    />
    <component-consulting-steps :blocks_data="steps" :title_data="title_data_steps" />
  </div>
</template>

<style lang="scss">
.economic {
  .mainConsulting__title {
    max-width: 902px !important;

    span {
      display: flex !important;
    }
  }

  .approach__content {
    .approach__image {
      &:first-child {
        background-image: url("assets/images/consulting/approach/economic1.webp");
      }

      &:last-child {
        background-image: url("assets/images/consulting/approach/economic2.webp");
      }
    }
  }

  .promotion__title {
    width: 95%;
  }

  &__titleBlock {
    padding-top: $primary-margin-sections;
    .section-header__description p {
      max-width: 90% !important;
      font-size: 20px;
    }
  }

  .consulting-steps {
    margin-top: calc($primary-margin-sections * 1);
    .section-header {
      display: none;
    }
    &__blocks {
      display: none;
    }
  }

  .consulting-steps__block {
    &:first-child {
      h3 {
        letter-spacing: -0.4px;
      }
    }
  }

  .blocks__item {
    padding-right: 0;
  }
  .blocks__name {
    font-size: 23px;
  }
}
</style>
