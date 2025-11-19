import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  subscription_plan: 'free' | 'basic' | 'premium' | 'pro' | null;
  subscription_status: 'active' | 'canceled' | 'expired' | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type SkinAnalysis = {
  id: string;
  user_id: string;
  image_url: string;
  analysis_result: any;
  skin_score: number;
  created_at: string;
};
