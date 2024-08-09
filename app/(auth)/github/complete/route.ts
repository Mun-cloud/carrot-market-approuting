import {
  accessTokenGithub,
  userEmailGithub,
  userProfileGithub,
} from "@/lib/auth";
import db from "@/lib/db";
import { href } from "@/lib/href";
import { setSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return new Response(null, { status: 400 });
  }

  const access_token = await accessTokenGithub(code);

  const { avatar_url, id, login } = await userProfileGithub(access_token);

  const email = await userEmailGithub(access_token);

  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await setSession(user.id);
    return redirect(href.profile.home);
  }

  const isExistUsername = await db.user.findFirst({
    where: {
      username: login,
    },
  });

  const newUser = await db.user.create({
    data: {
      github_id: id + "",
      avatar: avatar_url,
      username: isExistUsername ? login + "_github" : login,
      email,
    },
  });

  await setSession(newUser.id);

  return redirect(href.profile.home);
}
