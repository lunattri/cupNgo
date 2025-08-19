import jwt, { type Secret, type SignOptions, type JwtPayload } from "jsonwebtoken";

const JWT_SECRET: Secret = (() => {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("Missing JWT_SECRET environment variable");
  return value;
})();

export type JwtUserPayload = {
  userId: string;
  email: string;
};

export function signAuthToken(payload: JwtUserPayload, expiresIn: string = "7d"): string {
  const options: SignOptions = { expiresIn: expiresIn as unknown as any };
  return jwt.sign(payload as unknown as JwtPayload, JWT_SECRET, options);
}

export function verifyAuthToken(token: string): JwtUserPayload {
  return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
}


