#!/usr/bin/env node
import { readFileSync } from 'fs';

const pulse = JSON.parse(readFileSync(new URL('./pulse.json', import.meta.url)));
const density = Math.pow(pulse.nodes * pulse.velocity * pulse.streak * pulse.decision, 0.25);
const ok = Math.abs(density - pulse.expectedDensity) < 0.01 && pulse.figure === 'pulse-runner';
console.log(ok ? `ok pulse-runner density=${density.toFixed(3)}` : 'fail');
process.exit(ok ? 0 : 1);
