import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import ChatMessagesList from "./_components/chat-messages-list";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true },
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

const getMessages = async (chatRoomId: string) => {
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

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

const getUserProfile = async () => {
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

const ChatRoom = async ({ params }: { params: { id: string } }) => {
  const room = await getRoom(params.id);

  if (!room) notFound();

  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const user = await getUserProfile();

  if (!user) {
    return notFound();
  }
  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar}
      initialMessages={initialMessages}
    />
  );
};

export default ChatRoom;
