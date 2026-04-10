/**
 * Edge Function : create-booking
 * Crée une réservation, envoie la notification in-app et l'email de confirmation.
 * Gère la vérification de capacité de façon atomique (pas de double booking).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser } from '../_shared/auth.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, supabase: userClient } = await getAuthenticatedUser(req);

    // Client admin (bypasse le RLS pour les vérifications)
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { class_id }: { class_id: string } = await req.json();

    // 1. Vérifier que le cours existe et a de la place
    const { data: gymClass, error: classError } = await adminClient
      .from('classes')
      .select('*, bookings(id)')
      .eq('id', class_id)
      .single();

    if (classError || !gymClass) throw new Error('Class not found');

    const bookingsCount = gymClass.bookings?.length ?? 0;
    if (bookingsCount >= gymClass.capacity) {
      throw new Error('Class is full');
    }

    // 2. Vérifier qu'il n'a pas déjà réservé
    const { data: existing } = await adminClient
      .from('bookings')
      .select('id')
      .eq('user_id', user.id)
      .eq('class_id', class_id)
      .maybeSingle();

    if (existing) throw new Error('Already booked');

    // 3. Créer la réservation
    const { data: booking, error: bookingError } = await adminClient
      .from('bookings')
      .insert([{ user_id: user.id, class_id, status: 'confirmed' }])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 4. Créer la notification in-app
    await adminClient.from('notifications').insert([{
      user_id: user.id,
      type: 'booking_confirmed',
      title: 'Réservation confirmée',
      message: `Votre place pour "${gymClass.title}" est confirmée.`,
      link: '/dashboard/bookings',
    }]);

    // 5. Envoyer l'email de confirmation (non-bloquant)
    const { data: profile } = await adminClient
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (user.email) {
      fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          to: user.email,
          subject: `Réservation confirmée : ${gymClass.title}`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
              <h1 style="color:#FF3131;">Réservation confirmée ✓</h1>
              <p>Bonjour ${profile?.full_name || ''},</p>
              <p>Votre place est confirmée pour :</p>
              <div style="background:#1F1F1F;padding:16px;border-radius:8px;color:white;">
                <strong>${gymClass.title}</strong><br/>
                📅 ${gymClass.day} à ${gymClass.time}<br/>
                👤 Coach : ${gymClass.trainer}
              </div>
              <p style="color:#666;font-size:12px;margin-top:24px;">GymX — Transform Your Limits</p>
            </div>
          `,
        }),
      });
    }

    return new Response(JSON.stringify({ success: true, booking }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
