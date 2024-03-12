const { v4: uuidv4 } = require('uuid');

const generateUniqueId = () => uuidv4();

module.exports = {
  generateUniqueId,
};