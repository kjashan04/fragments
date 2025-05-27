import js from '@eslint/js';
import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  js.configs.recommended,
  //{ files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node, ...globals.jest } },
  },
  //{ files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
];
