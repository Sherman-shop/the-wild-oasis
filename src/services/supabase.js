import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://bugzqcreertaddjyyear.supabase.co'
const supabaseKey = 'sb_publishable_Cb741AL6S-ArmSp8WHXWew_w2ZS51yt'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;