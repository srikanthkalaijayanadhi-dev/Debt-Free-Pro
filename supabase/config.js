// ==========================================================================
// DEBT FREE PRO - Supabase Configuration
// ==========================================================================

// Replace these with your actual Supabase Project URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client
// We assume the Supabase library is loaded via CDN in the HTML file
let supabaseClient = null;

try {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully.');
    } else {
        console.error('Supabase library not loaded. Make sure the CDN script is included.');
    }
} catch (error) {
    console.error('Error initializing Supabase:', error);
}

// Export for other modules if needed, or make it global
window.supabaseClient = supabaseClient;
