import enforceFooBar, { RULE_NAME as enforceFooBarName } from './rules/enforce-foo-bar'

export default {
  rules: {
    [enforceFooBarName]: enforceFooBar,
  },
}
