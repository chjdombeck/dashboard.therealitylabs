// ─── Supabase Client ──────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://dguvrsexocanthiakzrm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0RZugUFn5spq-Y6KOsmYtQ_89A6XS9o';

const { createClient } = supabase;
window.sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
