/** @type {import("prettier").Config} */
module.exports = {
  // Evita parênteses em arrow functions de um único argumento. Ex: x => x
  arrowParens: 'avoid',
  // Adiciona espaços entre chaves em objetos. Ex: { foo: bar }
  bracketSpacing: true,
  // Usa aspas simples em vez de duplas.
  singleQuote: true,
  // Adiciona vírgula no final de objetos e arrays. Ajuda nos diffs do git.
  trailingComma: 'all',
  // Adiciona ponto e vírgula no final das linhas.
  semi: true,
  // Define o tamanho da tabulação como 2 espaços.
  tabWidth: 2,
};
