// https://docs.expo.dev/guides/using-eslint/
const expo = require('eslint-config-expo');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

/**
 * Este é o novo formato "flat config" do ESLint.
 * É mais simples e a direção futura da ferramenta.
 * `eslint-config-expo` já inclui as principais regras para React Native.
 * `eslint-config-prettier` desativa regras que conflitam com o Prettier.
 */
module.exports = [
  ...expo,
  prettierConfig,
  {
    // Adiciona o plugin do Prettier
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Ativa a regra do Prettier, que reportará problemas de formatação como erros do ESLint.
      // A configuração para o Prettier está no arquivo `prettier.config.js`.
      'prettier/prettier': 'error',

      // Mantive as regras que você já tinha:
      'import/prefer-default-export': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/prop-types': 'off',
    },
  },
];

