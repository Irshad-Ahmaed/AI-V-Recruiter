import { supabase } from '@/services/supabase-client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    const { callId } = body;

    if (!callId) {
      return NextResponse.json(
        { error: 'Missing interviewId or callId' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('Interview-feedback')
      .upsert([
        { call_id: callId }
      ]);

    if (error) {
      console.error('❌ Supabase update error:', error);
      return NextResponse.json(
        { error: 'Failed to update call_id in Supabase' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}