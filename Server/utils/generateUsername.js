import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);

// Generate a clean base
function sanitizeBase(base) {
  return base.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "user";
}

export async function generateUsername(base) {
  const clean = sanitizeBase(base);
  return `${clean}_${nanoid()}`; // e.g. "john_ab12x"
}
