const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const MAX_LONG = Number.MAX_SAFE_INTEGER;
const MIN_LONG = Number.MIN_SAFE_INTEGER;

const coerceLong = value => {
  if (value == '') {
    throw new TypeError('Long cannot represent non 52-bit signed integer value: (empty string)');
  }
  const num = Number(value);
  if (num <= MAX_LONG && num >= MIN_LONG) {
    return num < 0 ? Math.ceil(num) : Math.floor(num);
  }
  throw new TypeError('Long cannot represent non 52-bit signed integer value: ' + String(value));
};

const parseLiteral = ast => {
  if (ast.kind == Kind.INT) {
    num = parseInt(ast.value, 10);
    if (num <= MAX_LONG && num >= MIN_LONG) {
      return num;
    }
    return null;
  }
};

module.exports = new GraphQLScalarType({
  name: 'Long',
  description: 'The `Long` scalar type represents 52-bit integers',
  serialize: coerceLong,
  parseValue: coerceLong,
  parseLiteral: parseLiteral,
});
