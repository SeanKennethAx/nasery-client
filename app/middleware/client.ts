export default defineNuxtRouteMiddleware((to) => {
    const {
        user,
        token,
    } = useAuth()

    if (
        !token.value ||
        !user.value
    ) {
        return navigateTo({ path: '/login', query: inquiryRedirect(to.path) ? { redirect: to.path } : {} })
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
