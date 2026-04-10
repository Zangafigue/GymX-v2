/**
 * email.ts — Email Delivery Service
 *
 * In Development mode or if VITE_RESEND_API_KEY is missing:
 * → Emails are logged to the console (mock).
 *
 * In Production mode:
 * → Emails should pass through a Supabase Edge Function
 *   to avoid exposing the API key on the client side.
 *   Ref: supabase/functions/send-email/index.ts (Phase 3)
 */

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email via Supabase Edge Function.
 * In dev, simulates delivery by logging to the console.
 */
export const sendEmail = async ({ to, subject, html }: EmailPayload) => {
  const isDev = import.meta.env.DEV;

  if (isDev) {
    console.info('[Email Mock]', { to, subject });
    return { success: true, mode: 'mock' };
  }

  // In production: call the Edge Function
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({ to, subject, html }),
    });
    
    if (!res.ok) throw new Error(`Email service error: ${res.status}`);
    return { success: true, mode: 'production' };
  } catch (err) {
    console.error('[Email Error]', err);
    return { success: false, error: err };
  }
};

/**
 * Booking confirmation email
 */
export const sendBookingConfirmation = async (
  userEmail: string,
  className: string,
  day: string,
  time: string
) => {
  return sendEmail({
    to: userEmail,
    subject: `Booking confirmed: ${className}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #FF3131;">Booking confirmed ✓</h1>
        <p>Your spot is reserved for:</p>
        <div style="background: #1F1F1F; padding: 16px; border-radius: 8px; color: white;">
          <strong>${className}</strong><br/>
          ${day} à ${time}
        </div>
        <p style="color: #666; font-size: 12px;">GymX — Transform Your Limits</p>
      </div>
    `,
  });
};

/**
 * Welcome email after registration
 */
export const sendWelcomeEmail = async (userEmail: string, fullName: string) => {
  return sendEmail({
    to: userEmail,
    subject: 'Welcome to GymX!',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #FF3131;">Welcome, ${fullName}!</h1>
        <p>Your GymX account is ready. You can start booking your classes now.</p>
        <a href="${import.meta.env.VITE_APP_URL}/dashboard"
           style="background:#FF3131;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;font-weight:bold;">
          Go to my dashboard
        </a>
      </div>
    `,
  });
};
