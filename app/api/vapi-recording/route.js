import { supabase } from '@/services/supabase-client';
import { NextResponse } from 'next/server';

const EventType = async (data) => {
    const callId = data?.call?.id;
    const recordingUrl = data?.recordingUrl;
    console.log('recordingUrl-----------------------------');

    if (!callId || !recordingUrl) {
        return NextResponse.json({ error: 'Missing callId or recordingUrl' }, { status: 400 });
    }

    console.log("🎧 Received both callId and recording");

    const { data: interviewRow, error: fetchError } = await supabase
        .from('Interview-feedback')
        .select('id')
        .eq('call_id', callId)
        .single();

    if (fetchError || !interviewRow) {
        console.error("❌ No interview found for callId:", callId);
        return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const { error: updateError } = await supabase
        .from('Interview-feedback')
        .update({ recording_url: recordingUrl })
        .eq('call_id', callId);

    if (updateError) {
        console.error("❌ Failed to update recording URL");
        return NextResponse.json({ error: 'Failed to save recording URL' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
};

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("📥 Webhook received:");


        const { message: data } = body;

        // ✅ Handle end-of-call event (includes recording URL)
        if (data.type === 'end-of-call-report') {
            console.log('Enter----------------------', 'End Call');
            setTimeout(() => {
                EventType(data);
            }, 10000);
        } else if (data.type === 'hang') {
            console.log('Enter----------------------', 'Hang');
            setTimeout(() => {
                EventType(data);
            }, 10000);
        }

        // 🔁 Optional: Log and ignore other events
        console.log(`ℹ️ Ignored event type: ${data?.type}`);
        return NextResponse.json({ ignored: true });

    } catch (err) {
        console.error('❌ Server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}