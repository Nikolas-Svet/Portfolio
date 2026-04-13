import { onMounted } from 'vue'
import { resetScrollBehavior, scrollToSectionFromHash } from '@/services/scroll.service'

export const useInstantScrollOnMount = () => {
  onMounted(() => {
    resetScrollBehavior()
  })
}

export const useScrollToHashOnMount = (allowedTargets: string[]) => {
  onMounted(() => {
    void scrollToSectionFromHash(allowedTargets)
  })
}
