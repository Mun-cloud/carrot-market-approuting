import {
  accessTokenGithub,
  userEmailGithub,
  userProfileGithub,
} from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return new Response(null, { status: 400 });
  }

  const access_token = await accessTokenGithub(code);

  const { avatar_url, id, login } = await userProfileGithub(access_token);

  const email = await userEmailGithub(access_token);

  /**
   * TODO
   * 유저 유무 판단.
   * 이메일 중복 알고리즘
   * 세션 로그인
   * 유저 없을 시 유저 생성
   * 세션 로그인
   * 세션 로그인 함수 추가
   * 프로필 페이지로 리다이렉트
   */

  return Response.json({ hello: "world" });
}
