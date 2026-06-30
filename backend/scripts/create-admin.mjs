import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const envFiles = ['.env.local', '.env', '../.env.local', '../.env'];

for (const envFile of envFiles) {
  const fullPath = resolve(process.cwd(), envFile);
  if (!existsSync(fullPath)) continue;

  const lines = readFileSync(fullPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'admin@nextgen.local';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456!';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env.local');
  process.exit(1);
}

if (
  supabaseUrl.includes('your-project-id') ||
  serviceRoleKey.includes('your-supabase') ||
  serviceRoleKey.includes('never-share-this')
) {
  console.error('Supabase config still contains placeholder values.');
  console.error('Put your real NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env.local.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function findUserByEmail(email) {
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

const existingUser = await findUserByEmail(adminEmail);
let user = existingUser;

if (existingUser) {
  const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      ...(existingUser.user_metadata || {}),
      is_admin: true,
    },
  });

  if (error) throw error;
  user = data.user;
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      is_admin: true,
    },
  });

  if (error) throw error;
  user = data.user;
}

const { error: profileError } = await supabase.from('users').upsert({
  id: user.id,
  email: adminEmail,
  is_admin: true,
});

if (profileError) throw profileError;

console.log(`Admin user ready: ${adminEmail}`);
console.log(`Admin password: ${adminPassword}`);
