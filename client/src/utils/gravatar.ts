import md5 from "md5";

const GRAVATAR_BASE_URL = "https://www.gravatar.com/avatar/";

export const getGravatarUrl = (username: string, size: number = 200) => {
  const hash = md5(username.toLowerCase());

  const params = new URLSearchParams({
    d: "retro",
    s: size.toString(),
    r: "pg",
  });

  return `${GRAVATAR_BASE_URL}${hash}?${params.toString()}`;
};
