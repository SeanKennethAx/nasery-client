export interface AdminOrganizerSummary {
    id: number
    name: string
    email: string | null
    phone: string | null
    location: string | null
    joined: string
    events_count: number
    revenue: number
    rating: number
    reviews_count: number
}

export interface AdminOrganizerEvent {
    id: number
    name: string
    client: string
    event_date: string | null
    location: string | null
    status: string
    tickets_sold: number
    capacity: number
    revenue: number
}

export interface AdminOrganizerReview {
    id: number
    client: string
    rating: number
    review: string | null
    created_at: string
}

export interface AdminOrganizerQuotation {
    id: number
    client: string
    event: string
    amount: number
    status: string
    submitted_at: string
}

export interface AdminOrganizerDetail extends AdminOrganizerSummary {
    bio: string | null
    website: string | null
    bids_count: number
    won_bids_count: number
    win_rate: number
    clients: string[]
    events: AdminOrganizerEvent[]
    quotations: AdminOrganizerQuotation[]
    reviews: AdminOrganizerReview[]
}

export interface AdminClientSummary {
    id: number
    name: string
    email: string | null
    phone: string | null
    joined: string
    inquiries_count: number
    events_count: number
    total_spend: number
}

export interface AdminClientInquiry {
    id: number
    event_title: string | null
    event_type: string
    event_date: string | null
    status: string
    budget_range: string | null
    quotations_count: number
    created_at: string
}

export interface AdminClientEvent {
    id: number
    name: string
    organizer: string
    event_date: string | null
    location: string | null
    status: string
    amount: number
}

export interface AdminClientReview {
    id: number
    organizer: string
    rating: number
    review: string | null
    created_at: string
}

export interface AdminClientDetail extends AdminClientSummary {
    address: string | null
    inquiries: AdminClientInquiry[]
    events: AdminClientEvent[]
    reviews: AdminClientReview[]
}

export interface AdminPlatformEvent {
    id: number
    name: string
    event_type: string
    organizer: string
    organizer_id: number
    client: string
    client_id: number
    event_date: string | null
    location: string | null
    status: string
    expected_guests: number
    tickets_sold: number
    capacity: number
    revenue: number
}

export interface AdminActivityItem {
    type: string
    icon: string
    label: string
    at: string
}

export interface AdminPendingQuotation {
    id: number
    organizer: string
    event: string
    amount: number
    submitted_at: string
}

export interface AdminOverview {
    organizer_count: number
    client_count: number
    event_count: number
    active_event_count: number
    new_organizers_this_month: number
    new_clients_this_month: number
    new_events_this_month: number
    total_revenue: number
    avg_organizer_rating: number
    bids_this_month: number
    pending_quotations_count: number
    pending_quotations: AdminPendingQuotation[]
    top_organizers: Array<{ id: number, name: string, events_count: number, revenue: number }>
    recent_activity: Array<{ type: string, label: string, at: string }>
}

export interface AdminAnalytics {
    revenue_by_month: Array<{ label: string, value: number }>
    signups_by_month: Array<{ label: string, organizers: number, clients: number }>
    events_by_status: Array<{ status: string, total: number }>
    quotations_by_status: Array<{ status: string, total: number }>
}

export interface AdminEventTag {
    id: number
    name: string
}

function authHeaders(token: string) {
    return {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

export const superAdminService = {
    async getOverview(token: string): Promise<{ data: AdminOverview }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/overview`, {
            method: 'GET',
            headers: authHeaders(token),
        })
    },

    async getOrganizers(token: string, search = ''): Promise<{ data: AdminOrganizerSummary[] }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/organizers`, {
            method: 'GET',
            query: search ? { search } : undefined,
            headers: authHeaders(token),
        })
    },

    async getOrganizer(token: string, id: number | string): Promise<{ data: AdminOrganizerDetail }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/organizers/${id}`, {
            method: 'GET',
            headers: authHeaders(token),
        })
    },

    async getClients(token: string, search = ''): Promise<{ data: AdminClientSummary[] }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/clients`, {
            method: 'GET',
            query: search ? { search } : undefined,
            headers: authHeaders(token),
        })
    },

    async getClient(token: string, id: number | string): Promise<{ data: AdminClientDetail }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/clients/${id}`, {
            method: 'GET',
            headers: authHeaders(token),
        })
    },

    async getEvents(token: string, search = '', status = ''): Promise<{ data: AdminPlatformEvent[] }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/events`, {
            method: 'GET',
            query: {
                ...(search ? { search } : {}),
                ...(status ? { status } : {}),
            },
            headers: authHeaders(token),
        })
    },

    async getActivity(token: string): Promise<{ data: AdminActivityItem[] }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/activity`, {
            method: 'GET',
            headers: authHeaders(token),
        })
    },

    async getAnalytics(token: string): Promise<{ data: AdminAnalytics }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/analytics`, {
            method: 'GET',
            headers: authHeaders(token),
        })
    },

    async getEventTags(token: string): Promise<{ data: AdminEventTag[] }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/event-tags`, {
            method: 'GET',
            headers: authHeaders(token),
        })
    },

    async createEventTag(token: string, name: string): Promise<{ message: string, data: AdminEventTag }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/event-tags`, {
            method: 'POST',
            body: { name },
            headers: authHeaders(token),
        })
    },

    async updateEventTag(token: string, id: number, name: string): Promise<{ message: string, data: AdminEventTag }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/event-tags/${id}`, {
            method: 'PUT',
            body: { name },
            headers: authHeaders(token),
        })
    },

    async deleteEventTag(token: string, id: number): Promise<{ message: string }> {
        const config = useRuntimeConfig()

        return await $fetch(`${config.public.apiBaseURL}/superadmin/event-tags/${id}`, {
            method: 'DELETE',
            headers: authHeaders(token),
        })
    },
}
