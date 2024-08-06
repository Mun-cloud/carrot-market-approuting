"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

import { z } from "zod";

const postUploadSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해 주세요")
    .max(100, "제목은 100자 이하로 입력해주세요"),
  description: z
    .string()
    .max(1000, "내용은 1000자 이하로 입력해주세요")
    .optional(),
});

export async function uploadPost(data: z.infer<typeof postUploadSchema>) {
  const validatedData = postUploadSchema.safeParse(data);

  if (validatedData.success) {
    const session = await getSession();
    const createdPost = await db.post.create({
      data: {
        userId: session.id!,
        ...validatedData.data,
      },
      select: {
        id: true,
      },
    });
    redirect(`/posts/${createdPost.id}`);
  } else {
    return validatedData.error.flatten();
  }
}
