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
        const body: RegisterPayload =
            payload.register_method === 'email'
                ? {
                    firstname: payload.firstname,

                    ...(payload.middlename
                        ? {
                            middlename:
                                payload.middlename,
                        }
                        : {}),

                    lastname: payload.lastname,

                    email:
                        payload.email
                            ?.trim()
                            .toLowerCase(),

                    password:
                        payload.password,

                    role:
                        payload.role,

                    register_method: 'email',
                }
                : {
                    firstname: payload.firstname,

                    ...(payload.middlename
                        ? {
                            middlename:
                                payload.middlename,
                        }
                        : {}),

                    lastname: payload.lastname,

                    phone:
                        payload.phone?.trim(),

                    password:
                        payload.password,

                    role:
                        payload.role,

                    register_method: 'phone',
                }
        console.log(
            'REGISTER METHOD:',
            body.register_method
        )

        console.log(
            'REGISTER API BODY:',
            body
        )


        return await $fetch<RegisterResponse>(
            `${config.public.apiBaseURL}/auth/register`,
            {
                method: 'POST',

                headers: {
                    Accept: 'application/json',
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
                    Accept: 'application/json',
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
                    Accept: 'application/json',

                    Authorization:
                        `Bearer ${token}`,
                },
            }
        )
    },
}