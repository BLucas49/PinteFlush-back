import { CookieOptions, Response } from "express";
import { getEnv } from "../config/config.js";
import { ACCESS_TOKEN_TTL_MS, REFRESH_TOKEN_TTL_MS } from "./tokens.js";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";
const ACCESS_COOKIE_PATH = "/";
const REFRESH_COOKIE_PATH = "/api/renew";

const baseOptions = (path: string): CookieOptions => ({
  httpOnly: true,
  secure: getEnv().isProduction, // HTTPS uniquement en prod
  sameSite: "strict",
  path,
});

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseOptions(ACCESS_COOKIE_PATH),
    maxAge: ACCESS_TOKEN_TTL_MS,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseOptions(REFRESH_COOKIE_PATH),
    maxAge: REFRESH_TOKEN_TTL_MS,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, baseOptions(ACCESS_COOKIE_PATH));
  res.clearCookie(REFRESH_COOKIE, baseOptions(REFRESH_COOKIE_PATH));
}
