"use server";

import db from "@/lib/db";
import { href } from "@/lib/href";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

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
  revalidatePath(href.chats + `/${chatRoomId}`);
  revalidatePath(href.chats);
}

/**
 * 채팅방 메세지 리스트 조회
 * @param chatRoomId 채팅방 ID
 */
export const getMessages = async (chatRoomId: string) => {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return messages;
};

/**
 * 채팅방 정보 조회 (채팅방에 포함된 유저가 아니면 return null;)
 * @param id 채팅방 ID
 */
export async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true, username: true },
      },
    },
  });

  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));

    if (!canSee) {
      return null;
    }
  }
  return room;
}

/**
 * 유저 프로필(username,avatar) 조회
 */
export const getUserProfile = async () => {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
};
