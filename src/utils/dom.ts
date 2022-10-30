export const refocus = (e: Event) =>
  window.setTimeout(() => (e.target as HTMLInputElement).focus(), 0)
