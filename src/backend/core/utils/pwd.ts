import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/** Hash factice, calculé une seule fois, pour les comparaisons « à vide ». */
let dummyHash: Promise<string> | null = null;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Effectue un bcrypt.compare inutile quand l'utilisateur n'existe pas,
 * pour que le temps de réponse ne révèle pas si un email est inscrit.
 */
export async function fakePasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword("pinteflush-dummy-password");
  await bcrypt.compare(password, await dummyHash);
}
