"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

/**
 * 채팅방 메세지 DB에 저장
 * @param payload 메세지
 * @param chatRoomId 채팅방 ID
 */
export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
}
