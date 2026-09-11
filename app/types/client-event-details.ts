export interface TicketType {
    id: number

    event_id?: number

    name: string

    price: string | number

    capacity: number

    issued?: number

    remaining?: number | null

    sold_count?: number

    remaining_capacity?: number

    sold_out?: boolean
}

export interface EventItem {
    id: number

    name: string

    event_type: string

    description: string | null

    event_date: string | null

    location: string | null

    expected_guests: number | null

    start_time: string | null

    end_time: string | null

    status: string

    public_registration: boolean

    public_registration_token: string | null

    require_approval: boolean

    waitlist_enabled: boolean

    contact_name: string | null

    contact_email: string | null

    contact_phone: string | null

    ticket_types?: TicketType[]
}

export interface Inclusion {
    id: number

    description: string
}

export interface QuotationItem {
    id: number

    quotation_amount: string | number

    package_name: string | null

    timeline: string | null

    quotation_details: string | null

    inclusions: Inclusion[]
}

export interface OrganizerUser {
    firstname?: string

    middlename?: string | null

    lastname?: string
}

export interface OrganizerItem {
    id: number

    name?: string

    company_name?: string

    user?: OrganizerUser
}

export interface ClientEventData {
    event: EventItem

    quotation: QuotationItem

    organizer?: OrganizerItem
}

export interface ClientEventResponse {
    data: ClientEventData
}

export interface TicketEvent {
    id: number

    name: string

    event_type: string

    event_date: string | null

    location: string | null

    start_time: string | null

    end_time: string | null
}

export interface EventTicket {
    id: number

    name: string

    email: string | null

    ticket_type: TicketType | null

    ticket_id: string

    qr_token?: string

    qr_value?: string

    source: string

    payment_status: string

    status: 'registered' | 'checked_in'

    checked_in_at: string | null

    created_at: string

    event?: TicketEvent

    download_url?: string
}

export interface TicketListResponse {
    data: EventTicket[]
}

export interface CreateTicketResponse {
    message?: string

    data: EventTicket
}

export interface TicketEmailResponse {
    message: string

    data?: {
        email?: string

        ticket_id?: string
    }
}

export interface ApiErrorResponse {
    data?: {
        message?: string

        errors?: Record<string, string[]>
    }

    message?: string
}

export interface RegistrationForm {
    name: string

    email: string

    ticketTypeId: number | null
}