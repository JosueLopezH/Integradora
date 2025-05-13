import { createClient } from "@supabase/supabase-js";

//import AsyncStorage from '@react-native-async-storage/async-storage'
const supabaseUrl = "https://vrwewouswfkpwhwjhrzr.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyd2V3b3Vzd2ZrcHdod2pocnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMjM5MzMsImV4cCI6MjA1NTU5OTkzM30.im3qRYy02hWprYSg_R5vaTIe2ekcGlBsO-T8fF8Nlak"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        //storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
