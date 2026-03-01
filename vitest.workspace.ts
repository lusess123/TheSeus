import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/theseus-shared',
  'packages/theseus-server',
  'packages/theseus-database',
  'apps/theseus-api',
]);
