export interface NearbyOrganizer {
    id: number
    user_id: number
    slug?: string
    display_name?: string | null
    full_name?: string | null
    avatar_url?: string | null
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
    user?: {
        firstname?: string | null
        middlename?: string | null
        lastname?: string | null
    } | null
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
