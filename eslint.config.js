const stylisticJs = require('@stylistic/eslint-plugin-js');

module.exports = {
    plugins: {
        '@stylistic/js': stylisticJs
    },
    extends: "eslint:recommended",
    env: {
        "node": true,
        "browser": true,
        "es6": true,
        "jest": true
    },
    parserOptions: {
        "sourceType": "module",
        "ecmaVersion": 9
    },
    rules: {
        "comma-dangle": ["error", "never"],
        '@stylistic/js/indent': ['error', 4],
        "no-cond-assign": "off",
        "semi": ["error", "always"],
        "no-unused-vars": "off",
        "no-control-regex": "off",
        "no-console": "off",
        "no-constant-condition": "off"
    }
};
