import { IResponse } from "../../core/base/Response.js";

export interface UserDetails extends IResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: Date;
}
