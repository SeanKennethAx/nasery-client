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
        user.value.role !== 'client'
    ) {
        if (
            user.value.role ===
            'organizer'
        ) {
            return navigateTo(
                '/organizer/home'
            )
        }

        return navigateTo('/login')
    }
})