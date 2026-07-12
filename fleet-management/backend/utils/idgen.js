const { nanoid } = require("nanoid");

const genId = (prefix) => `${prefix}_${nanoid(8)}`;

module.exports = { genId };
