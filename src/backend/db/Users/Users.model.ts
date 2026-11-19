export interface User {
  id: string;
  elo: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  bio: string | null;
  created_at: Date;
}

export type NewUser = Pick<
  User,
  "email" | "first_name" | "last_name" | "password"
>;
