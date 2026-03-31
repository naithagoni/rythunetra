import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '@/config/env'

export const supabase = createClient(SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
