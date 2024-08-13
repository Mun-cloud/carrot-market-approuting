import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import ChatMessagesList from "./_components/chat-messages-list";
import { getMessages, getRoom, getUserProfile } from "../actions";
import NavHeader from "@/components/nav-header";

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

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
    <div className="flex flex-col min-h-screen">
      <NavHeader>
        {room.users.find((user) => user.id !== session.id)?.username}
      </NavHeader>
      <ChatMessagesList
        chatRoomId={params.id}
        userId={session.id!}
        username={user.username}
        avatar={user.avatar}
        initialMessages={initialMessages}
      />
    </div>
  );
};

export default ChatRoom;
