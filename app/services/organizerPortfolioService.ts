import type {
  OrganizerDirectoryResponse,
  OrganizerPortfolioResponse,
} from '~/types/portfolio'

export function useOrganizerDirectory() {
  const config = useRuntimeConfig()

  return useFetch<OrganizerDirectoryResponse>(
    `${config.public.apiBaseURL}/organizers`,
    {
      key: 'public-organizer-directory',
      headers: { Accept: 'application/json' },
    }
  )
}

export function useOrganizerPortfolio(identifier: MaybeRefOrGetter<string>) {
  const config = useRuntimeConfig()

  return useFetch<OrganizerPortfolioResponse>(
    () => `${config.public.apiBaseURL}/organizers/${encodeURIComponent(toValue(identifier))}`,
    {
      key: () => `public-organizer-${toValue(identifier)}`,
      headers: { Accept: 'application/json' },
    }
  )
}
