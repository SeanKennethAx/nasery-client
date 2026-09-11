export interface CreateInquiryPayload {
    event_title?: string
    event_type: string
    event_date: string
    start_time: string
    end_time: string
    location: string
    venue_name?: string
    venue_address: string
    google_place_id: string
    latitude: number
    longitude: number
    expected_guests: number
    budget_range: string
    additional_details?: string
}

export interface InquiryData {
    id: number
    client_id: number
    event_title: string | null
    event_type: string
    event_date: string
    start_time: string
    end_time: string
    location: string
    venue_name: string | null
    venue_address: string | null
    google_place_id: string | null
    latitude: number | null
    longitude: number | null
    expected_guests: number
    budget_range: string
    additional_details: string | null
    status: string
    created_at: string
    updated_at: string
}

export interface CreateInquiryResponse {
    message: string
    data: InquiryData
}

export interface NearbyOrganizer {
    id: number
    user_id: number
    company_name: string | null
    location: string | null
    google_place_id: string | null
    latitude: number
    longitude: number
    service_radius_km: number
    distance_km: number
    reviews_avg_rating: number
    reviews_count: number
    specialties?: string[]
    tags?: string[]
}

export interface NearbyOrganizersResponse {
    message: string
    data: {
        center: {
            latitude: number
            longitude: number
        }
        radius_km: number
        organizers: NearbyOrganizer[]
    }
}
