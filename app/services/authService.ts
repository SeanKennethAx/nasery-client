import type {
    CurrentUserResponse,
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
} from '~/types/auth'


export const authService = {
    async register(
        payload: RegisterPayload
    ): Promise<RegisterResponse> {
        const config = useRuntimeConfig()

        const body: RegisterPayload = {
            ...payload,

            firstname:
                payload.firstname
                    .trim(),

            ...(payload.middlename
                ? {
                    middlename:
                        payload.middlename
                            .trim(),
                }
                : {}),

            lastname:
                payload.lastname
                    .trim(),

            email:
                payload.email
                    .trim()
                    .toLowerCase(),

            phone:
                payload.phone
                    .trim(),

            address:
                payload.address
                    .trim(),

            password:
                payload.password,

            role:
                payload.role,

            ...(payload.role === 'organizer'
                ? {
                    location:
                        payload.location
                            ?.trim()
                        || payload.address.trim(),

                    google_place_id:
                        payload.google_place_id
                        || undefined,

                    latitude:
                        payload.latitude,

                    longitude:
                        payload.longitude,

                    service_radius_km:
                        payload.service_radius_km
                        ?? 25,
                }
                : {}),
        }

        console.log(
            'REGISTER API BODY:',
            body
        )

        return await $fetch<RegisterResponse>(
            `${config.public.apiBaseURL}/auth/register`,
            {
                method: 'POST',

                headers: {
                    Accept:
                        'application/json',

                    'Content-Type':
                        'application/json',
                },

                body,
            }
        )
    },


    async login(
        payload: LoginPayload
    ): Promise<LoginResponse> {
        const config = useRuntimeConfig()

        return await $fetch<LoginResponse>(
            `${config.public.apiBaseURL}/auth/login`,
            {
                method: 'POST',

                headers: {
                    Accept:
                        'application/json',

                    'Content-Type':
                        'application/json',
                },

                body: payload,
            }
        )
    },


    async getCurrentUser(
        token: string
    ): Promise<CurrentUserResponse> {
        const config = useRuntimeConfig()

        return await $fetch<CurrentUserResponse>(
            `${config.public.apiBaseURL}/auth/me`,
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