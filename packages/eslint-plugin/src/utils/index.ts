import { ESLintUtils } from '@typescript-eslint/utils'

export const createRule = ESLintUtils.RuleCreator(
  (ruleName) => `https://github.com/`,
  //   (ruleName) => `https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/${ruleName}.md`,
)
