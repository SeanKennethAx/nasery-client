import type {
    LoginPayload,
    RegisterPayload,
    User,
} from '~/types/auth'

import { authService } from '~/services/authService'

type AuthRole =
    | 'client'
    | 'organizer'
    | 'team_member'

export function useAuth(
    role?: AuthRole
) {
    const isLoading = ref(false)
    const errorMessage = ref('')

    const token =
        useCookie<string | null>(
            'auth_token',
            {
                default: () => null,
                sameSite: 'lax',
            }
        )

    const user =
        useCookie<User | null>(
            'auth_user',
            {
                default: () => null,
                sameSite: 'lax',
            }
        )

    const hasRequiredRole =
        computed(() => {
            if (!role) {
                return true
            }

            return (
                user.value?.role ===
                role
            )
        })

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
        return (
            user.value?.firstname ??
            ''
        )
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
        if (
            user.value?.role ===
            'client'
        ) {
            return 'Client'
        }

        if (
            user.value?.role ===
            'organizer'
        ) {
            return 'Organizer'
        }

        if (user.value?.role === 'team_member') {
            return 'Team Member'
        }

        return ''
    })

    const isAuthenticated =
        computed(() => {
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
            const registrationPayload:
                RegisterPayload = {
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

                email_verification_token:
                    payload.email_verification_token,

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

            const authenticatedUser =
                response.user

            token.value =
                response.token

            user.value =
                authenticatedUser

            if (import.meta.client) {
                localStorage.setItem(
                    'auth_session_changed',
                    JSON.stringify({
                        role:
                            authenticatedUser.role,

                        userId:
                            authenticatedUser.id,

                        timestamp:
                            Date.now(),
                    })
                )
            }

            return authenticatedUser

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

        if (authenticatedUser.role === 'team_member') {
            return await navigateTo('/team/dashboard')
        }

        throw new Error(
            'Invalid user role.'
        )
    }

    function logout() {
        token.value = null
        user.value = null
        errorMessage.value = ''

        if (import.meta.client) {
            localStorage.setItem(
                'auth_session_changed',
                JSON.stringify({
                    role: null,

                    timestamp:
                        Date.now(),
                })
            )
        }
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

            message?: string
        }

        if (
            apiError.data?.errors
        ) {
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

        if (
            apiError.data?.message
        ) {
            return apiError.data.message
        }

        if (
            apiError.message
        ) {
            return apiError.message
        }

        return (
            'Something went wrong. ' +
            'Please try again.'
        )
    }

    return {
        user,
        token,

        isLoading,
        errorMessage,
        isAuthenticated,
        hasRequiredRole,

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
