import "react-native-url-polyfill/auto"
import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

const supabaseUrl = "https://bwevgryyzzshdjtsfiih.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZXZncnl5enpzaGRqdHNmaWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQwMTEwNTgsImV4cCI6MTk4OTU4NzA1OH0.Pz7nvpFGt22snSBlmxlCqmr9A3qhi13_dhLY5ojF39c"
export const supabseStorageUrl =
  supabaseUrl + "/storage/v1/object/public/flashcard-pictures/public/"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
