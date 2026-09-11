export interface PortfolioEvent {
  id: number
  title: string
  category: string
  date: string | null
  year: number | null
  venue: string | null
  description: string | null
}

export interface OrganizerPortfolio {
  id: number
  slug: string
  name: string
  location: string | null
  bio: string | null
  years_experience: string | null
  specialties: string[]
  banner_color: string
  portfolio_events_count: number
  average_rating: number
  reviews_count: number
  tags?: string[]
  website?: string | null
  facebook?: string | null
  instagram?: string | null
  events: PortfolioEvent[]
}

export type OrganizerPortfolioSummary = Omit<OrganizerPortfolio, 'events'>

export interface OrganizerDirectoryResponse {
  data: OrganizerPortfolioSummary[]
}

export interface OrganizerPortfolioResponse {
  data: OrganizerPortfolio
}
