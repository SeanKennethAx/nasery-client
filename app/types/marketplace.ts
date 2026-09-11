export interface MarketplaceTicketType {
  id: number
  name: string
  price: number
  capacity: number | null
}

export interface MarketplaceEvent {
  id: number
  name: string
  event_type: string
  description: string | null
  event_date: string | null
  start_time: string | null
  end_time: string | null
  status: string
  location: string | null
  organizer: {
    id: number
    slug: string
    name: string
    banner_color: string
  }
  ticket_types: MarketplaceTicketType[]
  registration_open: boolean
  registration_path: string | null
}

export interface MarketplaceResponse {
  data: MarketplaceEvent[]
}
