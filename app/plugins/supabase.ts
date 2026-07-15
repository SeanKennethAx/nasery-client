import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    console.log(config.public)

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