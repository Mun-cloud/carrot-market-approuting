"use server";

import { unstable_cache as nextCache } from "next/cache";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { href } from "@/lib/href";

async function getProduct(id: number) {
  return await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

export async function createChatRoom(formData: FormData) {
  const productOwnerId = Number(formData.get("productOwnerId") as string);
  const session = await getSession();

  if (productOwnerId === session.id) return;

  const room = await db.chatRoom.create({
    data: {
      users: {
        connect: [{ id: productOwnerId }, { id: session.id }],
      },
    },
    select: {
      id: true,
    },
  });

  redirect(`${href.chats}/${room.id}`);
}

export async function getIsProductOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }

  return false;
}
