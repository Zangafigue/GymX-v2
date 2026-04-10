/**
 * Edge Function : create-subscription
 * Endpoint pour initier un paiement via Wave Money / Orange Money Burkina.
 */

import { corsHeaders } from '../_shared/cors.ts';
import { getAuthenticatedUser } from '../_shared/auth.ts';

interface SubscriptionRequest {
  plan: 'basic' | 'premium' | 'elite';
  payment_method: 'wave' | 'orange_money' | 'stripe';
}

const PRICES = {
  basic:   { amount: 49000,  currency: 'XOF' },
  premium: { amount: 89000,  currency: 'XOF' },
  elite:   { amount: 149000, currency: 'XOF' },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await getAuthenticatedUser(req);
    const { plan, payment_method }: SubscriptionRequest = await req.json();

    const price = PRICES[plan as keyof typeof PRICES];
    if (!price) throw new Error('Invalid plan selected');

    if (payment_method === 'wave') {
      // Mock: Wave Money Integration Redirect
      // In production this connects to Wave APIs and creates a checkout_url
      return new Response(JSON.stringify({ 
        success: true, 
        checkout_url: `https://mock.way.example.com/pay?amount=${price.amount}&currency=${price.currency}` 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
    }

    if (payment_method === 'orange_money') {
      // Mock: Orange Money Integration Redirect
      return new Response(JSON.stringify({ 
        success: true, 
        checkout_url: `https://mock.orangemoney.example.com/pay?amount=${price.amount}&currency=${price.currency}` 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
    }

    if (payment_method === 'stripe') {
      throw new Error('Stripe integration coming soon');
    }

    throw new Error('Unknown payment method');

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
