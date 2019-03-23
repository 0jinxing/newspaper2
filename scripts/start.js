// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('@babel/register')({
  presets: ['@babel/env'],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
  ]
})
require("@babel/polyfill")

// Import the rest of our application.
module.exports = require('../src/index')
