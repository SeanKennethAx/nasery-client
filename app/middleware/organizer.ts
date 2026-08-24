export default defineNuxtRouteMiddleware(() => {
    const {
        user,
        token,
    } = useAuth()

    if (
        !token.value ||
        !user.value
    ) {
        return navigateTo('/login')
    }

    if (
        user.value.role !==
        'organizer'
    ) {
        if (
            user.value.role ===
            'client'
        ) {
            return navigateTo(
                '/client/my-events'
            )
        }

        return navigateTo('/login')
    }
})