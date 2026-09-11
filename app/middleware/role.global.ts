export default defineNuxtRouteMiddleware((to) => {
    const {
        user,
        token,
    } = useAuth()

    const isClientRoute =
        to.path === '/client' ||
        to.path.startsWith('/client/')

    const isOrganizerRoute =
        to.path === '/organizer' ||
        to.path.startsWith('/organizer/')

    const isTeamRoute =
        to.path === '/team' || to.path.startsWith('/team/')

    if (
        !isClientRoute &&
        !isOrganizerRoute &&
        !isTeamRoute
    ) {
        return
    }

    if (
        !token.value ||
        !user.value
    ) {
        return navigateTo({ path: '/login', query: inquiryRedirect(to.path) ? { redirect: to.path } : {} }, {
            replace: true,
        })
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
