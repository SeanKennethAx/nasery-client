import type { MarketplaceResponse } from '~/types/marketplace'

export function useEventMarketplace() {
  const config = useRuntimeConfig()

  return useFetch<MarketplaceResponse>(
    `${config.public.apiBaseURL}/marketplace/events`,
    {
      key: 'public-event-marketplace',
      headers: { Accept: 'application/json' },
    }
  )
}
