import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export type JwtUserPayload = {
  userId: string;
  email: string;
};

export function signAuthToken(payload: JwtUserPayload, expiresIn: string = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyAuthToken(token: string): JwtUserPayload {
  return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
}


