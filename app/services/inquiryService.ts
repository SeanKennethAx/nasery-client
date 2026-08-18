export interface ClientInquiry {
    id: number
    client_id: number
    event_title: string | null
    event_type: string
    event_date: string
    location: string
    expected_guests: number
    budget_range: string
    additional_details: string | null
    created_at: string
    updated_at: string
}

export interface ClientInquiryResponse {
    data: ClientInquiry[]
}

export const inquiryService = {
    async getClientInquiries(
        token: string
    ): Promise<ClientInquiryResponse> {
        const config = useRuntimeConfig()

        return await $fetch<ClientInquiryResponse>(
            `${config.public.apiBaseURL}/inquiries/client`,
            {
                method: 'GET',

                headers: {
                    Accept:
                        'application/json',

                    Authorization:
                        `Bearer ${token}`,
                },
            }
        )
    },
}