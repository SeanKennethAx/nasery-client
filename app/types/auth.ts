export type UserRole =
    | 'organizer'
    | 'client'
    | 'team_member'

export interface OrganizerAuthProfile {
    id: number
    company_name?: string | null
    location?: string | null
    google_place_id?: string | null
    latitude?: number | null
    longitude?: number | null
    service_radius_km?: number | null
}

export interface User {
    id: number

    firstname: string
    middlename: string | null
    lastname: string

    email: string | null
    phone: string | null
    address: string | null
    avatar_url?: string | null
    cover_url?: string | null

    role: UserRole

    client_id?: number | null
    organizer_id?: number | null
    team_member_id?: number | null

    organizer?: OrganizerAuthProfile | null
}

export interface RegisterPayload {
    firstname: string
    middlename?: string
    lastname: string

    email: string
    email_verification_token: string
    phone: string
    address: string

    password: string
    role: UserRole

    location?: string
    google_place_id?: string

    latitude?: number | null
    longitude?: number | null

    service_radius_km?: number
}

export interface RegisterResponse {
    message: string

    data: User
}

export type LoginPayload =
    | {
        email: string
        phone?: never
        password: string
    }
    | {
        phone: string
        email?: never
        password: string
    }

export interface LoginResponse {
    message: string

    token: string

    user: User
}

export interface LaravelValidationError {
    message: string

    errors: Record<
        string,
        string[]
    >
}

export interface CurrentUserResponse {
    user: User
}
