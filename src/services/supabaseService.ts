// Real Supabase integration for Fianex Backoffice
const SUPABASE_URL = 'https://gnduehhwlxxqvaczaujr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZHVlaGh3bHh4cXZhY3phdWpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjczNzA1NiwiZXhwIjoyMDg4MzEzMDU2fQ.f-z4H44uTQLJLX3Q2_E0VZ5vuV28WNMqKwwWsFE5iPs';

export interface SupabaseProfileView {
  profile_id: number;
  auth_uuid: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  id_document_url: string | null;
  certificate_url: string | null;
  verification_status_id: number;
  verification_status_name: string;
  province_id: number | null;
  province_name: string | null;
  is_verified: boolean | null;
  role_id: number;
  current_mode_id?: number | null;
  status: number;
}

export interface SupabaseServiceRequestView {
  request_id: string;
  created_at: string;
  problem_description: string;
  preferred_date: string;
  status: string;
  proposed_price: number | null;
  client_first_name: string;
  client_last_name: string;
  client_avatar_url: string | null;
  client_phone_number: string;
  expert_first_name: string;
  expert_last_name: string;
  profession_name: string;
}

export async function fetchLiveSupabaseProfiles(): Promise<SupabaseProfileView[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/vw_profile_settings?select=*&limit=50`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Supabase fetch profiles warning, fallback to cache:', err);
    return [];
  }
}

export async function fetchLiveServiceRequests(): Promise<SupabaseServiceRequestView[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/vw_service_requests_details?select=*&order=created_at.desc&limit=30`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Supabase fetch requests warning, fallback to cache:', err);
    return [];
  }
}

export async function updateSupabaseVerificationStatus(
  profileId: number,
  statusId: number,
  isVerified: boolean
): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${profileId}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        verification_status_id: statusId,
        is_verified: isVerified
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}
