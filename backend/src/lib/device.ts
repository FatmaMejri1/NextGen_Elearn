import { sendEmail } from './resend';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Generates a SHA-256 device fingerprint based on IP address and User-Agent.
 * Runtime-agnostic using the standard Web Crypto API (supported in Edge and Node).
 */
export async function generateDeviceFingerprint(ip: string, userAgent: string): Promise<string> {
  const cleanIp = ip || 'unknown-ip';
  const cleanUserAgent = userAgent || 'unknown-ua';
  const input = `${cleanIp}-${cleanUserAgent}`;

  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface ValidationResult {
  valid: boolean;
  deviceRegistered: boolean;
  message?: string;
}

/**
 * Validates the user's device fingerprint. Registers it if none is set.
 * Returns false and sends an alert email if there is a mismatch.
 */
export async function validateDevice(
  userId: string,
  email: string,
  currentFingerprint: string,
  supabaseAdmin: SupabaseClient
): Promise<ValidationResult> {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('device_fingerprint')
    .eq('id', userId)
    .single();

  if (error || !user) {
    console.error('Error fetching user for device verification:', error);
    return { valid: false, deviceRegistered: false, message: 'User profile not found.' };
  }

  // Case 1: First login, no device registered yet. Register it.
  if (!user.device_fingerprint) {
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ device_fingerprint: currentFingerprint })
      .eq('id', userId);

    if (updateError) {
      console.error('Error registering device fingerprint:', updateError);
      return { valid: false, deviceRegistered: false, message: 'Failed to register device.' };
    }
    return { valid: true, deviceRegistered: true };
  }

  // Case 2: Matching device fingerprint.
  if (user.device_fingerprint === currentFingerprint) {
    return { valid: true, deviceRegistered: false };
  }

  // Case 3: Device mismatch. Lock account and send alert email.
  await sendEmail({
    to: email,
    subject: '⚠️ Tentative de connexion suspecte - Compte verrouillé',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #d9534f; margin-top: 0;">Sécurité : Accès restreint</h2>
        <p>Bonjour,</p>
        <p>Une tentative de connexion à votre compte NextGen Academy a été bloquée car elle a été effectuée depuis un <strong>deuxième appareil</strong> ou un navigateur différent de celui enregistré.</p>
        <p>Conformément à nos conditions d'accès (limité à <strong>un seul appareil par utilisateur</strong>), l'accès à vos vidéos et cours est temporairement suspendu pour cet appareil.</p>
        <p>Si vous avez changé d'appareil ou réinstallé votre système, merci de contacter le support ou l'administrateur afin de réinitialiser votre empreinte numérique.</p>
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999999;">Ceci est un message de sécurité automatisé. Merci de ne pas y répondre directement.</p>
      </div>
    `,
  });

  return { 
    valid: false, 
    deviceRegistered: false, 
    message: 'Device Locked: This account is already active on another device.' 
  };
}
