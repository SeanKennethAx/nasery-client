export default defineNuxtRouteMiddleware(() => {
    const { user, token } = useAuth()
    if (!token.value || !user.value) return navigateTo('/login')
    if (user.value.role !== 'team_member') return navigateTo(user.value.role === 'organizer' ? '/organizer/home' : '/client/my-events')
})
