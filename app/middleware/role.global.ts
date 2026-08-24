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

    if (
        !isClientRoute &&
        !isOrganizerRoute
    ) {
        return
    }
    if (
        !token.value ||
        !user.value
    ) {
        return navigateTo('/login', {
            replace: true,
        })
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