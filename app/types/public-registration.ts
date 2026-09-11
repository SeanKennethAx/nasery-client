import type {
    EventItem,
    EventTicket,
    TicketType,
} from '~/types/client-event-details'

export interface PublicTicketType extends TicketType {
    issued: number

    remaining: number | null

    sold_out: boolean
}

export interface PublicEvent
    extends Omit<
        EventItem,
        'ticket_types'
    > {
    ticket_types: PublicTicketType[]
}

export interface AttendeeForm {
    name: string

    email: string

    event_ticket_type_id: number | null
}

export interface RegisteredTicket
    extends Omit<
        EventTicket,
        'ticket_type' | 'qr_token' | 'qr_value'
    > {
    qr_token: string

    qr_value: string

    ticket_type: PublicTicketType | null
}

export interface PublicRegistrationResponse {
    registration_open: boolean

    data: {
        event: PublicEvent
    }
}

export interface PublicRegistrationSubmitResponse {
    message: string

    data: {
        event: {
            id: number

            name: string
        }

        tickets: RegisteredTicket[]
    }
}