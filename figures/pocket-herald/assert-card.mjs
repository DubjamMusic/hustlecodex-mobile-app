import { readFileSync } from 'node:fs';

const REQUIRED_CARD = ['streak', 'nextAction', 'densityLever', 'tone', 'offlineOk'];
const ALLOWED_STREAK = new Set(['alive', 'broken', 'at-risk']);
const ALLOWED_LEVER = new Set(['N', 'V', 'S', 'D']);

const raw = JSON.parse(readFileSync(new URL('./glance-card.json', import.meta.url), 'utf8'));
if (raw.figure !== 'pocket-herald') throw new Error('wrong figure');
if (raw.readSecondsMax > 5) throw new Error('card too slow');
const keys = Object.keys(raw.card);
if (keys.length !== REQUIRED_CARD.length || REQUIRED_CARD.some((k) => !keys.includes(k))) {
  throw new Error(`card keys must be exactly ${REQUIRED_CARD.join(',')}`);
}
if (!ALLOWED_STREAK.has(raw.card.streak)) throw new Error('bad streak');
if (!ALLOWED_LEVER.has(raw.card.densityLever)) throw new Error('bad lever');
if (raw.card.tone !== 'recovery-informed') throw new Error('tone drift');
if (raw.card.offlineOk !== true) throw new Error('offline required');
console.log('ok pocket-herald card');
