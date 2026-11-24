// Single source of truth for the prototype's password gate (DdPasswordGate),
// after CB Fish's gate-password.ts. A casual client-side deterrent, not access
// control: see the note in DdPasswordGate.astro.
export const GATE_PASSWORD = 'esa';
export const GATE_STORAGE_KEY = 'dd-gate-unlocked';
