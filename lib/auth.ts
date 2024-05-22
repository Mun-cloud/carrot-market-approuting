export const accessTokenGithub = async (code: string) => {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenCall = await fetch(
    `https://github.com/login/oauth/access_token?${accessTokenParams}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const { access_token } = await accessTokenCall.json();
  return access_token as string;
};

export const userProfileGithub = async (access_token: string) => {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  const {
    login,
    id,
    avatar_url,
  }: {
    login: string;
    id: number;
    avatar_url: string;
  } = await userProfileResponse.json();

  return { login, id, avatar_url };
};

interface githubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export const userEmailGithub = async (access_token: string) => {
  const userProfileResponse = await fetch(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    }
  );

  const emails: githubEmail[] = await userProfileResponse.json();

  const primaryEmail = emails.find((email) => email.primary)!;
  return primaryEmail.email;
};
