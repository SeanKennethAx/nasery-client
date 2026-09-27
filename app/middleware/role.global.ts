const VALID_ROLES = [
    'client',
    'organizer',
    'team_member',
    'superadmin',
]

function redirectPathForRole(role: string): string {
    if (role === 'organizer') return '/organizer/home'
    if (role === 'team_member') return '/team/dashboard'
    if (role === 'superadmin') return '/superadmin/overview'
    return '/client/my-events'
}

export default defineNuxtRouteMiddleware((to) => {
    const {
        user,
        token,
        logout,
    } = useAuth()

    /*
     * A cookie can outlive a role rename (e.g. an old session saved
     * before "admin" became "superadmin"). Treat any role that no
     * longer exists as an expired session instead of silently
     * falling through to the wrong dashboard.
     */
    if (
        user.value &&
        !VALID_ROLES.includes(user.value.role)
    ) {
        logout()
    }

    const isClientRoute =
        to.path === '/client' ||
        to.path.startsWith('/client/')

    const isOrganizerRoute =
        to.path === '/organizer' ||
        to.path.startsWith('/organizer/')

    const isTeamRoute =
        to.path === '/team' || to.path.startsWith('/team/')

    const isAdminLoginRoute =
        to.path === '/superadmin/login'

    const isAdminRoute =
        !isAdminLoginRoute &&
        (to.path === '/superadmin' || to.path.startsWith('/superadmin/'))

    if (isAdminLoginRoute) {
        if (token.value && user.value) {
            return navigateTo(redirectPathForRole(user.value.role), { replace: true })
        }

        return
    }

    if (
        !isClientRoute &&
        !isOrganizerRoute &&
        !isTeamRoute &&
        !isAdminRoute
    ) {
        return
    }

    if (
        !token.value ||
        !user.value
    ) {
        if (isAdminRoute) {
            return navigateTo('/superadmin/login', { replace: true })
        }

        return navigateTo({ path: '/login', query: inquiryRedirect(to.path) ? { redirect: to.path } : {} }, {
            replace: true,
        })
    }

    if (isAdminRoute) {
        if (user.value.role !== 'superadmin') {
            return navigateTo(redirectPathForRole(user.value.role), { replace: true })
        }

        return
    }

    if (user.value.role === 'superadmin') {
        return navigateTo('/superadmin/overview', { replace: true })
    }

    if (isTeamRoute && user.value.role !== 'team_member') {
        return navigateTo(user.value.role === 'organizer' ? '/organizer/home' : '/client/my-events', { replace: true })
    }

    if (!isTeamRoute && user.value.role === 'team_member') {
        return navigateTo('/team/dashboard', { replace: true })
    }
    if (
        isOrganizerRoute &&
        user.value.role === 'client'
    ) {
        return navigateTo(
            '/client/my-events',
            {
                replace: true,
            }
        )
    }
    if (
        isClientRoute &&
        user.value.role === 'organizer'
    ) {
        return navigateTo(
            '/organizer/home',
            {
                replace: true,
            }
        )
    }
})
