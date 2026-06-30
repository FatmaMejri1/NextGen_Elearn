import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const migrationFile = resolve(process.cwd(), 'supabase/migrations/006_site_content.sql');

if (!existsSync(migrationFile)) {
  console.error(`Migration file not found: ${migrationFile}`);
  process.exit(1);
}

const sql = readFileSync(migrationFile, 'utf8');
const result = spawnSync('npx', ['supabase', 'db', 'query', '--linked'], {
  input: sql,
  encoding: 'utf8',
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe'],
});

const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();

if (output) {
  process.stdout.write(output.endsWith('\n') ? output : `${output}\n`);
}

if (result.status !== 0) {
  if (/already exists/i.test(output)) {
    console.log('site_content table already exists — setup is complete.');
    process.exit(0);
  }

  console.error('Failed to apply site_content migration.');
  process.exit(result.status ?? 1);
}

console.log('site_content table is ready.');
