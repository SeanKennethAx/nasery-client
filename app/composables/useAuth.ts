import type {
    LoginPayload,
    RegisterPayload,
    User,
} from '~/types/auth'

import { authService } from '~/services/authService'


export function useAuth() {
    const isLoading = ref(false)
    const errorMessage = ref('')

    const token = useCookie<string | null>(
        'auth_token',
        {
            default: () => null,
            sameSite: 'lax',
        }
    )

    const user = useCookie<User | null>(
        'auth_user',
        {
            default: () => null,
            sameSite: 'lax',
        }
    )


    const fullName = computed(() => {
        if (!user.value) {
            return ''
        }

        return [
            user.value.firstname,
            user.value.middlename,
            user.value.lastname,
        ]
            .filter(Boolean)
            .join(' ')
    })


    const firstName = computed(() => {
        return user.value?.firstname ?? ''
    })


    const initials = computed(() => {
        if (!user.value) {
            return ''
        }

        const first =
            user.value.firstname
                ?.charAt(0)
                .toUpperCase() ?? ''

        const last =
            user.value.lastname
                ?.charAt(0)
                .toUpperCase() ?? ''

        return `${first}${last}`
    })


    const roleLabel = computed(() => {
        if (user.value?.role === 'client') {
            return 'Client'
        }

        if (user.value?.role === 'organizer') {
            return 'Organizer'
        }

        return ''
    })


    const isAuthenticated = computed(() => {
        return Boolean(
            token.value &&
            user.value
        )
    })


    async function register(
        payload: RegisterPayload
    ): Promise<User> {
        isLoading.value = true
        errorMessage.value = ''

        try {
            const registrationPayload: RegisterPayload = {
                firstname:
                    payload.firstname,

                ...(payload.middlename
                    ? {
                        middlename:
                            payload.middlename,
                    }
                    : {}),

                lastname:
                    payload.lastname,

                email:
                    payload.email
                        .trim()
                        .toLowerCase(),

                phone:
                    payload.phone.trim(),

                address:
                    payload.address.trim(),

                password:
                    payload.password,

                role:
                    payload.role,
            }

            console.log(
                'REGISTER REQUEST:',
                registrationPayload
            )

            const response =
                await authService.register(
                    registrationPayload
                )

            return response.data

        } catch (error: unknown) {
            console.error(
                'Registration failed:',
                error
            )

            errorMessage.value =
                getErrorMessage(error)

            throw error

        } finally {
            isLoading.value = false
        }
    }


    async function login(
        payload: LoginPayload
    ): Promise<User> {
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response =
                await authService.login(
                    payload
                )

            token.value =
                response.token

            user.value =
                response.user

            return response.user

        } catch (error: unknown) {
            errorMessage.value =
                getErrorMessage(error)

            throw error

        } finally {
            isLoading.value = false
        }
    }


    async function redirectByRole(
        authenticatedUser: User
    ) {
        if (
            authenticatedUser.role ===
            'client'
        ) {
            return await navigateTo(
                '/client/my-events'
            )
        }

        if (
            authenticatedUser.role ===
            'organizer'
        ) {
            return await navigateTo(
                '/organizer/home'
            )
        }

        throw new Error(
            'Invalid user role.'
        )
    }


    function logout() {
        token.value = null
        user.value = null
        errorMessage.value = ''
    }


    function getErrorMessage(
        error: unknown
    ): string {
        if (
            typeof error !== 'object' ||
            error === null
        ) {
            return (
                'Something went wrong. ' +
                'Please try again.'
            )
        }

        const apiError = error as {
            data?: {
                message?: string
                errors?: Record<
                    string,
                    string[]
                >
            }
        }

        if (apiError.data?.errors) {
            const firstError =
                Object
                    .values(
                        apiError.data.errors
                    )
                    .flat()
                    .at(0)

            if (firstError) {
                return String(
                    firstError
                )
            }
        }

        return (
            apiError.data?.message ??
            'Something went wrong. Please try again.'
        )
    }


    return {
        user,
        token,

        isLoading,
        errorMessage,
        isAuthenticated,

        fullName,
        firstName,
        initials,
        roleLabel,

        register,
        login,
        logout,
        redirectByRole,
    }
}