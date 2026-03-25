import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const RESET_SECRET = process.env.RESET_PASSWORD_SECRET || "reset_secret_key";
const RESET_EXPIRATION = process.env.RESET_PASSWORD_EXPIRATION || "1h";

/**
 * @param {string} userId
 * @param {string} email
 * @returns {string}
 */
export const generateResetToken = (userId, email) => {
  return jwt.sign(
    {
      id: userId,
      email,
      type: "password_reset",
    },
    RESET_SECRET,
    { expiresIn: RESET_EXPIRATION },
  );
};

/**
 * @param {string} token
 * @returns {Object|null}
 */
export const verifyResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, RESET_SECRET);

    if (decoded.type !== "password_reset") {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

export default {
  generateResetToken,
  verifyResetToken,
};
