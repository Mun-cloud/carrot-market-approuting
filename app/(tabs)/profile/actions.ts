"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { href } from "@/lib/href";
import { revalidatePath } from "next/cache";

export async function editAvatar(formData: FormData) {
  const avatar = formData.get("photo") as string;
  const session = await getSession();
  if (!session) return "로그인이 필요합니다.";
  if (!avatar) return "이미지가 없습니다.";
  await db.user.update({
    where: {
      id: session.id,
    },
    data: {
      avatar,
    },
  });
  revalidatePath(href.profile);
}
