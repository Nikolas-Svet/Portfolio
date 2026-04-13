export const scrollBotDialogToBottom = (selector = '.bot__dialog-content') => {
  if (typeof document === 'undefined') {
    return
  }

  const container = document.querySelector<HTMLElement>(selector)

  if (!container) {
    return
  }

  if (container.scrollHeight > container.clientHeight) {
    container.scrollTop = container.scrollHeight
  }
}
