import { createRule } from '../utils'

export const RULE_NAME = 'enforce-foo-bar'

type MessageIds = 'fooBar'

type Options = []

export default createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: "Enforce that a variable named `foo` can only be assigned a value of 'bar'.",
    },
    fixable: 'code',
    schema: [],
    messages: {
      fooBar: 'Value other than "bar" assigned to `const foo`. Unexpected value: {{ notBar }}.',
    },
  },
  defaultOptions: [],
  create(context: any) {
    return {
      // Performs action in the function on every variable declarator
      VariableDeclarator(node: any) {
        // Check if a `const` variable declaration
        if (node.parent.kind === 'const') {
          // Check if variable name is `foo`
          if (node.id.type === 'Identifier' && node.id.name === 'foo') {
            // Check if value of variable is "bar"
            if (node.init && node.init.type === 'Literal' && node.init.value !== 'bar') {
              /*
               * Report error to ESLint. Error message uses
               * a message placeholder to include the incorrect value
               * in the error message.
               * Also includes a `fix(fixer)` function that replaces
               * any values assigned to `const foo` with "bar".
               */
              context.report({
                node,
                messageId: 'fooBar',
                data: {
                  notBar: node.init.value,
                },
                fix(fixer: any) {
                  return fixer.replaceText(node.init, '"bar"')
                },
              })
            }
          }
        }
      },
    }
  },
})
