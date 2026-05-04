// Thin wrapper around vite-plugin-pwa's auto-registration helper.
// Kept in its own module so the app boot path stays small.

import { registerSW as register } from 'virtual:pwa-register';

export function registerSW(): void {
  register({ immediate: true });
}
