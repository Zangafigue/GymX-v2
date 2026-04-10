/**
 * Edge Function : send-class-reminders
 * 
 * Target: Scheduled CRON task (e.g. every hour).
 * logic: Finds classes starting in exactly 2 hours and notifies members.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Get current time + 2 hours (simplified logic for demonstration)
    // In a real app, you'd calculate the exact ISO timestamp or use DB intervals
    const now = new Date();
    const notificationWindow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    // Simplistic match: find classes scheduled for Today and roughly at notificationWindow time
    // For a real production app, use Postgres 'at time zone' logic
    
    const { data: classes, error: classesError } = await adminClient
      .from('classes')
      .select('*, bookings(user_id, profiles(email, full_name))')
      .eq('day', getDayName(notificationWindow)) 
      // Filter by time logic would go here
    
    if (classesError) throw classesError;

    let sentCount = 0;

    for (const gymClass of classes || []) {
      const attendees = gymClass.bookings || [];
      
      for (const booking of attendees) {
        const profile = booking.profiles;
        if (!profile?.email) continue;

        // Notify in-app
        await adminClient.from('notifications').insert([{
          user_id: booking.user_id,
          type: 'class_reminder',
          title: 'Class Reminder!',
          message: `Don't forget: "${gymClass.title}" starts in 2 hours.`,
          link: '/dashboard',
        }]);

        // Trigger email (via our internal send-email function)
        fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: profile.email,
            subject: `Reminder: ${gymClass.title} in 2 hours!`,
            html: `<h1>Time to sweat!</h1><p>Hi ${profile.full_name}, your class starts soon at ${gymClass.time}.</p>`
          })
        });

        sentCount++;
      }
    }

    return new Response(JSON.stringify({ success: true, reminders_sent: sentCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getDayName(date: Date) {
  const daysFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return daysFr[date.getDay()];
}
