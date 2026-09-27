export default defineNuxtRouteMiddleware(() => {
    const {
        user,
        token,
    } = useAuth()

    if (
        !token.value ||
        !user.value
    ) {
        return navigateTo('/superadmin/login')
    }

    if (
        user.value.role !==
        'superadmin'
    ) {
        if (user.value.role === 'organizer') {
            return navigateTo('/organizer/home')
        }

        if (user.value.role === 'team_member') {
            return navigateTo('/team/dashboard')
        }

        if (user.value.role === 'client') {
            return navigateTo('/client/my-events')
        }

        return navigateTo('/superadmin/login')
    }
})
