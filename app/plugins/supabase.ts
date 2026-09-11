import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    // Public browsing and Laravel authentication do not require Supabase.
    if (!config.public.supabaseUrl || !config.public.supabaseKey) return

    const supabase = createClient(
        config.public.supabaseUrl,
        config.public.supabaseKey
    )

    return {
        provide: {
            supabase,
        },
    }
})
