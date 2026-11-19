export interface Session {
  id: string;
  /** Empreinte SHA-256 du refresh token (le token lui-même n'est jamais stocké). */
  token_hash: string;
  user_id: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}
