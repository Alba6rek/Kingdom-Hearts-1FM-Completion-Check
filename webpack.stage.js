const prod = require("./webpack.prod.js");

module.exports = {
  ...prod,
  output: {
    ...prod.output,
    path: `${__dirname}/stage`
  }
};
