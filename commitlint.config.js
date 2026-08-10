/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Permite tipos em PT-BR alinhados com o AGENTS.md
    "type-enum": [
      2,
      "always",
      [
        "feat", // nova funcao
        "fix", // correcao
        "refactor", // melhoria (refator)
        "perf", // melhoria de performance
        "chore", // infra / manutencao
        "ci", // CI/CD
        "docs", // documentacao
        "test", // testes
        "style", // formatacao (sem logica)
      ],
    ],
    // Mensagem de commit: min 10 chars, max 100
    "subject-min-length": [2, "always", 10],
    "subject-max-length": [2, "always", 100],
    // Sem ponto final no subject
    "subject-full-stop": [2, "never", "."],
    // Body max 500 chars
    "body-max-length": [1, "always", 500],
  },
};
