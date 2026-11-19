import { POINT } from "../../core/types/location.js";

export interface Game {
  id: string;
  location: POINT;
  name: string;
  code: string;
  players: number;
  created_at: Date;
  ended_at: Date | null;
}
