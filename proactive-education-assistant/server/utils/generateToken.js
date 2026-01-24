import jwt from "jsonwebtoken";

export const generateToken = ({ userId, role, orgId }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      userId,
      role,
      orgId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
