const {
    useBabelRc,
    addBabelPlugin,
    override
} = require('customize-cra');

module.exports = override(
    useBabelRc(),
    addBabelPlugin("@babel/plugin-proposal-nullish-coalescing-operator")
);