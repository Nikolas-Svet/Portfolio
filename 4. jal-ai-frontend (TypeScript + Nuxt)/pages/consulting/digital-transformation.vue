<script lang="ts" setup>

import ComponentConsultingMain from "@/components/consulting/componentConsultingMain.vue";
import ComponentConsultingPurpose from "@/components/consulting/componentConsultingPurpose.vue";
import type ITitle from "@/types/UiTitle";
import ComponentConsultingApproach from "@/components/consulting/componentConsultingApproach.vue";
import type {IFeature} from "@/types/Features";
import FeaturesIcon1 from "@/assets/images/consulting/features/digital-transformation/icon1.svg";
import FeaturesIcon2 from "@/assets/images/consulting/features/digital-transformation/icon2.svg";
import FeaturesIcon3 from "@/assets/images/consulting/features/digital-transformation/icon3.svg";
import FeaturesIcon4 from "@/assets/images/consulting/features/digital-transformation/icon4.svg";
import ComponentConsultingFeatures from "@/components/consulting/componentConsultingFeatures.vue";
import type {IPromotion} from "@/types/Promotion";
import ComponentConsultingPromotion from "@/components/consulting/componentConsultingPromotion.vue";
import type {IProcedure} from "@/types/Procedure";
import ComponentConsultingProcedure from "@/components/consulting/componentConsultingProcedure.vue";
import type {IBlocks} from "@/types/ComponentWithRectangle";
import type {IStep} from "@/types/Steps";
import ComponentConsultingSteps from "@/components/consulting/componentConsultingSteps.vue";
import {Consts} from "@/consts";

useHead({
  title: 'Consulting — Digital Transformation',
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
    name: 'Prozesse digitalisieren',
    description: 'Abläufe strukturiert erfassen und digital abbilden.',
    iconSvg: FeaturesIcon1,
  },
  {
    name: 'Passende Software finden',
    description: 'Tools auswählen und mit Partnern integrieren.',
    iconSvg: FeaturesIcon2,
  },
  {
    name: 'Teams schulen',
    description: 'Mitarbeitende praxisnah einbinden und befähigen.',
    iconSvg: FeaturesIcon3,
  },
  {
    name: 'Förderprogramme nutzen',
    description: 'Wir beraten zu Programmen wie Digitalbonus Bayern oder go-digital.',
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
  description_p2: 'Wir analysieren Ihre Prozesse und begleiten Sie bei der digitalen Transformation – von der Auswahl der Tools bis zur Fördermittelbeantragung.',
  description_span1: 'Ansatz',
  title: 'Ansatz',
})

const purpose = [
  {
    name: "Effiziente IT-Lösungen",
    description: "Systeme einführen, die Prozesse messbar verbessern.",
    count_rectangle: 1
  },
  {
    name: "Automatisierung steigern",
    description: "Wiederkehrende Aufgaben digital abbilden.",
    count_rectangle: 2
  },
  {
    name: "Mitarbeitende entlasten",
    description: "Mehr aus bestehenden Systemen herausholen.",
    count_rectangle: 3
  },
  {
    name: "Fördermittel nutzen",
    description: "Staatliche Programme gezielt einsetzen.",
    count_rectangle: 4
  }
]

const title_data_promotion = ref<ITitle>({
  description_p1_1: '',
  description_p1_2: 'für Ihre Digitalisierungsberatung',
  description_p2: 'Bis zu 50 % der Beratungskosten können durch regionale oder bundesweite Programme erstattet werden.',
  description_span1: 'Förderung',
  title: 'Förderung',
})

const promotions = ref<IPromotion[]>([
  {
    name: 'SPAREN',
    description: 'Beratungskosten werden durch Förderprogramme deutlich reduziert.'
  },
  {
    name: 'ENTLASTEN',
    description: 'Förderantrag wird für Sie übernommen – minimaler Aufwand für Ihr Team.'
  },
  {
    name: 'UMSETZEN',
    description: 'Schnelle und praxisnahe Umsetzung ohne langwierige Projektphasen.'
  }
])

const title_data_procedure = ref<ITitle>({
  description_p1_1: 'Erfassung der Digitalisierungspotenziale – Unser',
  description_p1_2: '',
  description_p2: 'Digitalisierung ist kein Selbstzweck – sie muss individuell auf das Unternehmen abgestimmt werden.',
  description_p2_2: 'Bevor wir digitale Lösungen empfehlen oder Fördermittel beantragen, erfassen wir zunächst umfassend die aktuelle IT- und Prozesslandschaft des Unternehmens. Unsere Vorgehensweise ist methodisch klar aufgebaut:',
  description_span1: 'strukturiertes Vorgehen',
  title: 'Vorgehen',
})

const procedures = ref<IProcedure[]>([
  {
    title: 'Kick-off-Gespräch zur Zieldefinition',
    items: [
      {
        heading: 'Klärung der Ausgangslage und der Erwartungen an die Digitalisierung:',
        subItems: ['Welche Prozesse bereiten derzeit die größten Herausforderungen?', 'Wo entstehen hohe manuelle Aufwände oder Fehleranfälligkeit?', 'Welche Ziele verfolgt die Geschäftsleitung durch die Digitalisierung (z. B. schnellere Bearbeitungszeiten, mehr Transparenz, Skalierung)?']
      },
      {
        heading: 'Besprechung vorhandener Softwarelösungen und IT-Strukturen:',
        subItems: ['Gibt es bereits CRM-, ERP-, Buchhaltungs- oder Dokumentenmanagementsysteme?', 'Wie gut sind diese in die bestehenden Abläufe integriert?']
      }
    ]
  },
  {
    title: 'Erfassung und Analyse der bestehenden Geschäftsprozesse',
    items: [
      {
        heading: 'Strukturierte Aufnahme der Kernprozesse (z. B. Auftragserfassung, Rechnungsstellung, Lagerverwaltung, Kundenkommunikation).',
        subItems: []
      },
      {
        heading: 'Bewertung',
        subItems: ['Welche Prozesse sind bereits teil- oder vollautomatisiert?', 'Wo bestehen noch manuelle Schnittstellen (z. B. Excel-Listen, Papierformulare, E-Mail-Kommunikation)?']
      },
      {
        heading: 'Identifikation von Medienbrüchen und Doppelarbeiten.',
        subItems: []
      }
    ]
  },
  {
    title: 'Analyse der IT- und Softwarelandschaft',
    items: [
      {
        heading: 'Sichtung aller eingesetzten Programme und Tools:',
        subItems: ['Welche Systeme sind vorhanden?', 'Wie werden diese genutzt (intensiv, teilweise, kaum)?']
      },
      {
        heading: 'Bewertung der Systemlandschaft hinsichtlich:',
        subItems: ['Kompatibilität und Integrationsfähigkeit', 'Potenzial für Automatisierung', 'Skalierbarkeit und Zukunftsfähigkeit']
      }
    ]
  },
  {
    title: 'Digitalisierungspotenzial ermitteln',
    items: [
      {
        heading: 'Erstellung einer Potenzialanalyse:',
        subItems: ['Wo können durch Digitalisierung spürbare Effizienzgewinne erzielt werden?', 'Welche manuellen Prozesse lassen sich automatisieren?', 'Welche neuen digitalen Tools könnten den Arbeitsalltag vereinfachen oder beschleunigen?']
      },
      {
        heading: 'Erste Identifikation passender Softwarelösungen auf Basis der Anforderungen (z. B. Dokumentenmanagement, Workflow-Management, CRM-Systeme).',
        subItems: []
      }
    ]
  },
  {
    title: 'Auswahl und Abstimmung passender Lösungen',
    items: [
      {
        heading: 'Gemeinsame Abstimmung mit dem Kunden:',
        subItems: ['Welche Systeme passen zu den Anforderungen, zur Unternehmensgröße und zum Budget?', 'Auswahl zwischen Bestandsoptimierung (Optimierung vorhandener Systeme) und Neueinführung (Integration neuer Tools).']
      },
      {
        heading: 'Kooperation mit erfahrenen Implementierungspartnern (Softwareanbieter, IT-Dienstleister).',
        subItems: []
      }
    ]
  },
  {
    title: 'Fördermittelmanagement',
    items: [
      {
        heading: 'Prüfung und Auswahl geeigneter Förderprogramme je nach Unternehmenssitz (z. B. Digitalbonus Bayern, go-digital, regionale Digitalisierungsprogramme).',
        subItems: []
      },
      {
        heading: 'Übernahme der gesamten Antragsstellung inklusive Förderfähigkeitsprüfung und Begleitung durch das Bewilligungsverfahren.',
        subItems: []
      }
    ]
  },
  {
    title: 'Onboarding und Schulung',
    items: [
      {
        heading: 'Begleitung bei der technischen Einführung neuer Systeme:',
        subItems: ['Einrichtung, Anpassung an Unternehmensanforderungen', 'Durchführung von Testläufen']
      },
      {
        heading: 'Schulung der Mitarbeiter:',
        subItems: ['Einführungstrainings', 'Erstellung von leicht verständlichen Anleitungen', 'Begleitung der ersten Wochen nach Einführung (First-Level-Support)']
      }
    ]
  }
])

const procedures_blocks = ref<IBlocks[]>([
  {
    name: 'INDIVIDUELL',
    description: 'Digitale Lösungen, die exakt zu Ihrem Unternehmen passen – keine Standardsoftware.'
  },
  {
    name: 'ANALYSIERT',
    description: 'Strukturiertes Vorgehen basierend auf einer fundierten IT- und Prozessanalyse.'
  },
  {
    name: 'GEFÖRDERT',
    description: 'Optimale Ausschöpfung von Fördermitteln zur Senkung Ihrer Investitionskosten.'
  },
  {
    name: 'SCHNELL',
    description: 'Umsetzung innerhalb von 90 Tagen – für sichtbare Ergebnisse in kurzer Zeit.'
  }
])

const title_data_procedure_second = ref<ITitle>({
  description_p1_1: 'Unser',
  description_p1_2: 'in der Digitalisierungsberatung:',
  description_p2: 'Unsere Digitalisierungsberatung ist förderfähig – wir sichern Ihnen mindestens 50 % Rückerstattung über Programme wie Digitalbonus Bayern oder go-digital und übernehmen die komplette Antragstellung.',
  description_p2_2: '',
  description_span1: 'Anspruch',
  title: '',
})

const title_data_steps = ref<ITitle>({
  description_p1_1: 'So funktioniert unsere Digitalisierungsberatung – ',
  description_p1_2: '',
  description_p2: 'Nur wer Prozesse und Strukturen wirklich versteht, kann digitale Lösungen sinnvoll einsetzen. Deshalb beginnen wir mit einer fundierten Analyse',
  description_p2_2: '',
  description_span1: 'Schritt für Schritt',
  title: 'Schritt',
})

const steps = ref<IStep[]>([
  {
    title: 'Analyse Ihrer Geschäftsprozesse',
    subtitle: 'Wir erfassen und dokumentieren alle wesentlichen Abläufe – vom Vertrieb über Administration bis hin zur Buchhaltung.'
  },
  {
    title: 'Bewertung der IT- und Systemlandschaft',
    subtitle: 'Wir prüfen, welche digitalen Systeme bereits vorhanden sind, wie intensiv sie genutzt werden und wo Optimierungspotenziale bestehen.'
  },
  {
    title: 'Ermittlung des Digitalisierungspotenzials',
    subtitle: 'Wir identifizieren, welche manuellen Prozesse automatisiert werden können und welche neuen Lösungen sinnvoll eingeführt werden können.'
  },
  {
    title: 'Auswahl und Koordination passender Lösungen',
    subtitle: 'Gemeinsam mit Ihnen wählen wir geeignete Tools aus und stimmen Integrationen sowie Erweiterungen genau auf Ihre Bedürfnisse ab.'
  },
  {
    title: 'Fördergelder optimal nutzen',
    subtitle: 'Wir prüfen passende Programme (z. B. Digitalbonus Bayern, go-digital) und übernehmen die komplette Antragstellung für Sie.'
  },
  {
    title: 'Implementierung und Schulung',
    subtitle: 'Wir begleiten die Einführung neuer Systeme, schulen Ihre Mitarbeitenden und sorgen für einen reibungslosen Ablauf der neuen Prozesse im Alltag.'
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
    name: 'Digitalisierungsberatung',
    path: Consts.Routes.consultingDigitalTransformation
  }
])
</script>

<template>
  <div class="digital-transformation">
    <component-consulting-main
        :path="path"
        name_button="Digitalisierungsberatung anfragen"
        sub_title="Nach der Prozessoptimierung wird die Modernisierung der IT-Infrastruktur zum nächsten logischen Schritt. Wir helfen Unternehmen, digitale Lösungen einzuführen, Arbeitsaufwand zu reduzieren und staatliche Fördermittel zu nutzen."
        title_1_1=""
        title_1_2="für zukunftssichere Prozesse und smarte Systeme"
        title_span="Digitalisierungsberatung"
    />
    <component-consulting-purpose :purpose="purpose" :title_data="title_data"/>
    <component-consulting-approach :title_data="title_data_approach"/>
    <component-consulting-features :features="features"/>
    <component-consulting-promotion :promotions="promotions" :title_data="title_data_promotion"/>
    <component-consulting-procedure :blocks="procedures_blocks" :procedures="procedures"
                                    :title_data="title_data_procedure"
                                    :title_data_second="title_data_procedure_second"/>
    <component-consulting-steps :blocks_data="steps" :title_data="title_data_steps"/>
  </div>
</template>

<style lang="scss">
.digital-transformation {
  .mainConsulting__title {
    max-width: 902px !important;

    span {
      display: flex !important;
    }
  }

  .approach__content {
    .approach__image {
      &:first-child {
        background-image: url("assets/images/consulting/approach/digital-transformation1.webp");
      }

      &:last-child {
        background-image: url("assets/images/consulting/approach/digital-transformation2.webp");
      }
    }
  }

  .features__block {
    &:first-child, &:nth-child(3) {
      h3 {
        padding-right: 50%;
      }
    }
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
        span {
          max-width: 950px;
        }
        p {
          max-width: 304px !important;
        }
      }
    }
  }
}
</style>
