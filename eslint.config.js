// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // eslint-plugin-react-hooks v6 (React Compiler-aware) can't tell a
    // Reanimated shared value from React state, so it flags the idiomatic
    // `sharedValue.value = withSpring(...)` writes in our animation handlers.
    // Those mutations are exactly how Reanimated is meant to be driven.
    rules: {
      'react-hooks/immutability': 'off',
    },
  },
]);
