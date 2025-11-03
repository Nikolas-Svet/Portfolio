<script lang="ts" setup>
import ComponentConsultingMain from "@/components/consulting/componentConsultingMain.vue";
import ComponentConsultingPurpose from "@/components/consulting/componentConsultingPurpose.vue";
import type ITitle from "@/types/UiTitle";
import ComponentConsultingApproach from "@/components/consulting/componentConsultingApproach.vue";
import FeaturesIcon1 from '@/assets/images/consulting/features/business/icon1.svg';
import FeaturesIcon2 from '@/assets/images/consulting/features/business/icon2.svg';
import FeaturesIcon3 from '@/assets/images/consulting/features/business/icon3.svg';
import FeaturesIcon4 from '@/assets/images/consulting/features/business/icon4.svg';
import type {IFeature} from "@/types/Features";
import ComponentConsultingFeatures from "@/components/consulting/componentConsultingFeatures.vue";
import ComponentConsultingPromotion from "@/components/consulting/componentConsultingPromotion.vue";
import type {IPromotion} from "@/types/Promotion";
import ComponentConsultingProcedure from "@/components/consulting/componentConsultingProcedure.vue";
import type {IProcedure} from "@/types/Procedure";
import type {IBlocks} from "@/types/ComponentWithRectangle";
import ComponentConsultingSteps from "@/components/consulting/componentConsultingSteps.vue";
import type {IStep} from "@/types/Steps";
import {Consts} from "@/consts";

useHead({
  title: 'Consulting — Business',
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

const features = ref<IFeature[]>([
  {
    name: 'Prozesse analysieren',
    description: 'Wir untersuchen alle Abläufe im Unternehmen und erkennen Optimierungspotenziale.',
    iconSvg: FeaturesIcon1,
  },
  {
    name: 'Umsetzung begleiten',
    description: 'Wir unterstützen bei der Einführung neuer Prozesse oder begleiten die Umsetzung.',
    iconSvg: FeaturesIcon2,
  },
  {
    name: 'Praktische Lösungen entwickeln',
    description: 'Wir erstellen umsetzbare Vorschläge zur Prozessverbesserung – individuell und effizient.',
    iconSvg: FeaturesIcon3,
  },
  {
    name: 'Tools und Partner integrieren',
    description: 'Wir finden passende technische Lösungen und integrieren bewährte Tools wie Microsoft Workflows.',
    iconSvg: FeaturesIcon4,
  }
])

const title_data = ref<ITitle>({
  description_p1_1: '',
  description_p1_2: 'messbare Verbesserungen in Ihren Abläufen, Systemen und Strukturen',
  description_p2: '',
  description_span1: 'Unsere Ziele:',
  title: 'Ziele',
})

const title_data_approach = ref<ITitle>({
  description_p1_1: 'Unser',
  description_p1_2: '',
  description_p2: 'Wir setzen auf eine strukturierte Analyse und individuelle Beratung, um Prozesse messbar effizienter zu gestalten',
  description_span1: 'Ansatz',
  title: 'Ansatz',
  description_p2_2: 'Unser Ziel: praktische, nachhaltige Optimierung Ihrer Prozesse, Strukturen und Tools.',
})

const title_data_promotion = ref<ITitle>({
  description_p1_1: '',
  description_p1_2: 'für Ihre Beratung',
  description_p2: 'Unsere Leistungen sind förderfähig – als registrierte BAFA-Berater erhalten Sie mindestens 50 % der Kosten zurück.',
  description_span1: 'Förderung',
  title: 'Förderung',
})

const promotions = ref<IPromotion[]>([
  {
    name: 'Umsatzsteigerung',
    description: 'Mehr Verkaufserfolg durch gezielte Prozessoptimierung.'
  },
  {
    name: 'Еffizienz',
    description: 'Weniger Zeit- und Personalaufwand dank effizienter Abläufe.'
  },
  {
    name: 'Kostenersparnis',
    description: 'Bis zu 50 % Zuschuss durch BAFA-Förderung möglich.'
  }
])

const purpose = [
  {
    name: "Effizientere Prozesse",
    description: "Abläufe vereinfachen und verbessern.",
    count_rectangle: 1
  },
  {
    name: "Bessere Einkaufskonditionen",
    description: "Neue Partner finden und smarter verhandeln.",
    count_rectangle: 2
  },
  {
    name: "IT sinnvoll nutzen",
    description: "Mehr aus bestehenden Systemen herausholen.",
    count_rectangle: 3
  },
  {
    name: "Weniger Routine",
    description: "Zeit sparen durch Automatisierung.",
    count_rectangle: 4
  }
]

const title_data_procedure = ref<ITitle>({
  description_p1_1: 'Erfassung der Ausgangssituation – Unser ',
  description_p1_2: '',
  description_p2: 'Bevor wir Optimierungs- oder Digitalisierungsmaßnahmen empfehlen, legen wir größten Wert auf eine gründliche Analyse der aktuellen Unternehmenssituation.',
  description_p2_2: 'Unsere Vorgehensweise zur Feststellung der Ausgangslage ist systematisch und bewährt:',
  description_span1: 'strukturiertes Vorgehen',
  title: 'Vorgehen',
})

const procedures = ref<IProcedure[]>([
  {
    title: 'Erstgespräch und Zielklärung',
    items: [
      {
        heading: 'In einem persönlichen Gespräch mit der Geschäftsführung und ggf. weiteren Schlüsselpersonen klären wir zunächst die Rahmenbedingungen',
        subItems: ['Was ist die aktuelle Unternehmensstruktur?', 'Welche Bereiche sollen betrachtet werden (z. B. Vertrieb, Einkauf, Buchhaltung, Produktion)?', 'Welche Themen sind für die Geschäftsführung besonders dringlich?']
      },
      {
        heading: 'In einem persönlichen Gespräch mit der Geschäftsführung und ggf. weiteren Schlüsselpersonen klären wir zunächst die Rahmenbedingungen',
        subItems: []
      }
    ]
  },
  {
    title: 'Unternehmensaufnahme und Betriebsbegehung',
    items: [
      {
        heading: 'Vor-Ort-Analyse: Wir besuchen das Unternehmen persönlich, um die tatsächlichen Abläufe zu beobachten und besser zu verstehen.',
        subItems: []
      },
      {
        heading: 'Dokumentation der organisatorischen Struktur:',
        subItems: ['Wer macht was?', 'Wie laufen Aufträge, Bestellungen, Rechnungen, Kundenkontakte oder Lieferantenprozesse ab?']
      },
      {
        heading: 'Aufnahme der vorhandenen IT- und Softwaresysteme:',
        subItems: ['Welche Systeme sind im Einsatz (z.B. Buchhaltungsprogramme, CRM, ERP)?', 'Wie intensiv und in welchen Bereichen werden sie genutzt?']
      }
    ]
  },
  {
    title: 'Dokumentensichtung',
    items: [
      {
        heading: 'Analyse vorhandener interner Dokumente:',
        subItems: ['Organigramme', 'Prozessbeschreibungen', 'Arbeitsanweisungen', 'Abläufe für Angebotserstellung, Auftragsbearbeitung, Reklamationen, Abrechnung etc.']
      },
      {
        heading: 'Überprüfung, ob Prozesse formalisiert oder eher informell gehandhabt werden.',
        subItems: []
      }
    ]
  },
  {
    title: 'Interviews mit Mitarbeitern',
    items: [
      {
        heading: 'Gespräche mit ausgewählten Mitarbeitenden aus unterschiedlichen Abteilungen (z. B. Sachbearbeitung, Einkauf, Vertrieb, Buchhaltung).',
        subItems: []
      },
      {
        heading: 'Ziel:',
        subItems: ['Verstehen, wie die tägliche Arbeit abläuft.', 'Aufdecken, wo Zeitverluste oder Fehlerquellen entstehen.', 'Ermittlung von Verbesserungsideen direkt aus der Praxis.']
      }
    ]
  },
  {
    title: 'Analyse der Systemnutzung und Digitalisierungsgrad',
    items: [
      {
        heading: 'Bewertung der Nutzung vorhandener digitaler Werkzeuge:',
        subItems: ['Wird Software effizient eingesetzt oder manuell ergänzt?', 'Besteht Potenzial zur Automatisierung oder Vereinfachung?']
      },
      {
        heading: 'Ermittlung des Digitalisierungsgrades:',
        subItems: ['Papierbasierte Prozesse vs. elektronische Prozesse', 'Schnittstellen zwischen verschiedenen IT-Systemen']
      }
    ]
  },
  {
    title: 'Zusammenfassung der Ausgangslage',
    items: [
      {
        heading: 'Erstellung einer strukturierten Übersicht der IST-Situation:',
        subItems: ['Stärken und Schwächen der aktuellen Abläufe', 'Risiken (z. B. Abhängigkeit von einzelnen Personen, manuelle Fehlerquellen)', 'Ungenutzte Chancen (z. B. Effizienzsteigerung durch Softwareoptimierung)']
      },
      {
        heading: 'Diese Zusammenfassung bildet die Grundlage für die Entwicklung einer individuellen Strategieempfehlung.',
        subItems: []
      }
    ]
  }
])
const procedures_blocks = ref<IBlocks[]>([
  {
    name: 'BESTANDSAUFNAHME',
    description: 'Der Investition werden durch das BAFA erstattet – dank unserer Akkreditierung.'
  },
  {
    name: 'ANALYSE',
    description: 'Praxisorientiert und auf Augenhöhe mit Geschäftsführung und Team.'
  },
  {
    name: 'VERSTÄNDNIS',
    description: 'Für reale Herausforderungen statt theoretischer Idealprozesse.'
  },
  {
    name: 'EMPFEHLUNGEN',
    description: 'Individuell und maßgeschneidert auf Ihre Unternehmenssituation.'
  }
])

const title_data_procedure_second = ref<ITitle>({
  description_p1_1: 'Unser',
  description_p1_2: 'in dieser Phase:',
  description_p2: 'Nur wer die aktuelle Situation wirklich versteht, kann nachhaltige Optimierungen entwickeln. Deshalb legen wir so viel Wert auf eine umfassende und praxisnahe Erfassung der Ausgangslage.',
  description_p2_2: '',
  description_span1: 'Anspruch',
  title: '',
})

const title_data_steps = ref<ITitle>({
  description_p1_1: 'So funktioniert unsere Managementberatung ',
  description_p1_2: '',
  description_p2: 'Denn nur wer die Ausgangslage ganzheitlich versteht, kann Prozesse nachhaltig verbessern – deshalb starten wir mit einer fundierten Analyse Ihrer aktuellen Situation.',
  description_p2_2: '',
  description_span1: '– Schritt für Schritt',
  title: 'Schritt',
})

const steps = ref<IStep[]>([
  {
    title: 'Analyse der Geschäftsprozesse',
    subtitle: 'Wir erfassen und dokumentieren alle zentralen Arbeitsabläufe – von Vertrieb über Einkauf, Administration bis hin zur Auftragsabwicklung.'
  },
  {
    title: 'Bewertung der Organisationsstrukturen',
    subtitle: 'Wir überprüfen bestehende Zuständigkeiten, Kommunikationswege und die Organisation der Prozesse auf Effizienz und mögliche Engpässe.'
  },
  {
    title: 'Identifikation von Optimierungspotenzialen',
    subtitle: 'Wir identifizieren ineffiziente Prozesse, Medienbrüche und unnötige Kostenfaktoren und zeigen konkrete Verbesserungspotenziale auf.'
  },
  {
    title: 'Entwicklung individueller Optimierungsstrategien',
    subtitle: 'Gemeinsam mit Ihnen entwickeln wir praxisnahe Maßnahmenpläne zur Vereinfachung von Prozessen, Kostensenkung und Effizienzsteigerung.'
  },
  {
    title: 'Auswahl unterstützender technischer Lösungen',
    subtitle: 'Wir integrieren passende Software und Tools, um Ihre Arbeitsprozesse zu automatisieren und Ihre Ressourcen optimal zu nutzen.'
  },
  {
    title: 'Umsetzung & Unterstützung',
    subtitle: 'Wir unterstützen Sie aktiv bei der Einführung neuer Prozesse und beraten Ihre Teams bei der Implementierung und Stabilisierung.'
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
    name: 'Unternehmensberatung',
    path: Consts.Routes.consultingBusiness
  }
])
</script>

<template>
  <div class="business">
    <component-consulting-main
        :path="path"
        name_button="Corporate Consulting anfragen"
        sub_title="Viele Unternehmen verlieren Effizienz durch veraltete Prozesse und ungenutzte IT-Lösungen. Unser Corporate Consulting hilft, Strukturen zu optimieren, Kosten zu senken und den Fokus auf das Wesentliche zu richten"
        title_1_1=""
        title_1_2="für effizientere Prozesse und starke Strukturen"
        title_span="Corporate Consulting"
    />
    <component-consulting-purpose :purpose="purpose" :title_data="title_data"/>
    <component-consulting-approach :title_data="title_data_approach"/>
    <component-consulting-features :features="features"/>
    <component-consulting-promotion :promotions="promotions" :title_data="title_data_promotion"/>
    <component-consulting-procedure :blocks="procedures_blocks" :procedures="procedures"
                                    :title_data="title_data_procedure" :title_data_second="title_data_procedure_second"/>
    <component-consulting-steps :blocks_data="steps" :title_data="title_data_steps"/>
  </div>
</template>

<style lang="scss">
.business {
  .approach__content {
    .approach__image {
      &:first-child {
        background-image: url("assets/images/consulting/approach/business1.webp");
      }

      &:last-child {
        transform: scaleX(-1);
        background-image: url("assets/images/consulting/approach/business2.webp");
      }
    }
  }

  .features__block {
    &:first-child, &:nth-child(2) {
      h3 {
        padding-right: 50%;
      }
    }
  }

  .promotions__subtitle {
    width: 89%;
  }

  .procedure {
    .section-header {
      &:first-child {
        .section-header__description {
          display: flex;
          flex-wrap: wrap;
          column-gap: calc(0.5 * $primary-margin-sections);
        }
      }

      .section-header__full {
        p {
          max-width: 300px !important;
        }
      }
    }
  }
}
</style>
