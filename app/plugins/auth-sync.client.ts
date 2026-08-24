export default defineNuxtPlugin(() => {
    const router = useRouter()

    window.addEventListener(
        'storage',
        async (event) => {
            if (
                event.key !==
                'auth_session_changed'
            ) {
                return
            }
            window.location.reload()
        }
    )
})