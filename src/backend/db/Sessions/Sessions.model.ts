export interface Session {
  id: string;
  token_hash: string;
  user_id: string;
  created_at: Date;
  ended_at: Date | null;
}
