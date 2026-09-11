export function inquiryRedirect(value: unknown): string | undefined {
  return value === '/client/post-event' ? value : undefined
}
