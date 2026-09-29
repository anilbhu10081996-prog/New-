import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types';

const STORAGE_KEY_CONFIG = 'anywork_supabase_config';

// Default config from user's canonical project
const defaultUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ijnqwlinfgznavhachhb.supabase.co';
const defaultKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_DypR578Ny2vGlP1Afkgn5A_-XvcLwKg';

let supabaseInstance: SupabaseClient | null = null;

export const CANONICAL_SUPABASE_URL = 'https://ijnqwlinfgznavhachhb.supabase.co';
export const CANONICAL_SUPABASE_KEY = 'sb_publishable_DypR578Ny2vGlP1Afkgn5A_-XvcLwKg';
export const AI_STUDY_FUNCTION = 'anywork-ai-study';

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse Supabase config from storage', e);
  }

  return {
    url: defaultUrl,
    anonKey: defaultKey,
    isConnected: false,
    lastChecked: undefined,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  // Reset instance so it re-initializes on next call
  supabaseInstance = null;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
      return null;
    }
  }

  return null;
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  if (!url || !key) {
    return {
      success: false,
      message: 'Both Supabase Project URL and Anon Public Key are required.',
    };
  }

  if (!url.startsWith('https://')) {
    return {
      success: false,
      message: 'Invalid Project URL. URL must start with https://',
    };
  }

  try {
    const testClient = createClient(url, key);
    // Ping Supabase auth system or health check
    const { error } = await testClient.auth.getSession();
    if (error) {
      return {
        success: false,
        message: `Supabase responded with error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase database & authentication service!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Failed to establish network connection with Supabase server.',
    };
  }
}

export async function callAnyworkAIStudy(
  mode: 'study_material' | 'quiz' | 'doubt' | 'lesson_plan',
  questionOrPrompt: string,
  level: string = 'General'
): Promise<string> {
  const cleanPrompt = questionOrPrompt.trim();
  if (!cleanPrompt) {
    throw new Error('Please enter a question or topic for AI Study.');
  }

  const client = getSupabaseClient() || createClient(CANONICAL_SUPABASE_URL, CANONICAL_SUPABASE_KEY);

  let authToken = CANONICAL_SUPABASE_KEY;
  try {
    const session = await client.auth.getSession();
    if (session.data?.session?.access_token) {
      authToken = session.data.session.access_token;
    }
  } catch (e) {
    console.warn('Session check fallback', e);
  }

  const endpoint = `${CANONICAL_SUPABASE_URL}/functions/v1/${AI_STUDY_FUNCTION}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CANONICAL_SUPABASE_KEY,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        mode,
        question: cleanPrompt,
        prompt: cleanPrompt,
        level,
        language: 'hi',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const raw = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(raw);
    } catch {
      data = { text: raw };
    }

    if (!res.ok) {
      throw new Error(data?.error?.message || data?.error || `AI Study Edge Function error: ${res.status}`);
    }

    const answer =
      data?.answer ||
      data?.content ||
      data?.text ||
      data?.result?.answer ||
      data?.result?.content ||
      data?.result?.text ||
      '';

    if (!answer) {
      throw new Error('AI responded with an empty answer. Please check your query or try again.');
    }

    return answer;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('AI Study Edge Function took longer than 30 seconds to respond. Please try a more specific topic.');
    }
    throw err;
  }
}

