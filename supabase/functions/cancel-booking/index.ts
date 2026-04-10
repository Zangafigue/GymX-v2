/**
 * Edge Function : cancel-booking
 * Annule une réservation existante via l'ID de la réservation.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser } from '../_shared/auth.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await getAuthenticatedUser(req);
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { booking_id }: { booking_id: string } = await req.json();

    const { data: booking, error: fetchError } = await adminClient
      .from('bookings')
      .select('user_id, status')
      .eq('id', booking_id)
      .single();

    if (fetchError || !booking) throw new Error('Booking not found');
    if (booking.user_id !== user.id) throw new Error('Unauthorized cancel attempt');
    if (booking.status === 'cancelled') throw new Error('Booking already cancelled');

    const { error: cancelError } = await adminClient
      .from('bookings')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', booking_id);

    if (cancelError) throw cancelError;

    await adminClient.from('notifications').insert([{
      user_id: user.id,
      type: 'booking_cancelled',
      title: 'Réservation annulée',
      message: 'Votre cours a été annulé avec succès.',
      link: '/dashboard/bookings',
    }]);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
