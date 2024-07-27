import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getChatRooms() {
  const session = await getSession();
  if (!session.id) return;
  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session.id,
        },
      },
    },
    select: {
      id: true,
      updated_at: true,
      users: {
        where: {
          NOT: {
            id: session.id,
          },
        },
        select: {
          avatar: true,
          username: true,
        },
      },
      messages: {
        orderBy: {
          created_at: "desc",
        },
        select: {
          payload: true,
        },
        take: 1,
      },
    },
  });
  

  return chatRooms;
}
