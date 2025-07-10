import { jest } from '@jest/globals';

// Rendre `jest` global (utile en ESM)
globalThis.jest = jest;

// Exemple : log avant chaque test
beforeEach(() => {
  // console.log('Début d’un test');
});
