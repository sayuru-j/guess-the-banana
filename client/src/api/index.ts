import { getGravatarUrl } from "../utils/gravatar";

export const API_PREFIX = "http://localhost:8080/api";

export const commonHeaders = new Headers();
commonHeaders.append("Content-Type", "application/json");

export const register = async (username: string, pin: string) => {
  try {
    const avatarUrl = getGravatarUrl(username);

    const raw = {
      username,
      pin,
      avatarUrl,
    };
    const response = await fetch(`${API_PREFIX}/register`, {
      method: "POST",
      body: JSON.stringify(raw),
      headers: commonHeaders,
    });

    return response.ok ? await response.json() : undefined;
  } catch (err) {
    console.error(err);
  }
};
