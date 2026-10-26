const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'hostelhub_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

module.exports = { generateToken };
