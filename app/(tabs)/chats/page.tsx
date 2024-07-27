import Image from "next/image";
import { getChatRooms } from "./actions";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";

const ChatPage = async () => {
  const chatRooms = await getChatRooms();

  return (
    <div className="flex flex-col">
      {chatRooms?.map((room) => (
        <Link
          className="py-5 px-4 border-b last:border-b-0 flex gap-3 text-white"
          href={`/chats/${room.id}`}
          key={room.id}
        >
          <Image
            src={room.users[0].avatar!}
            alt={room.users[0].username}
            className="aspect-square object-cover rounded-xl"
            width={50}
            height={50}
          />
          <div className="grow flex flex-col gap-0.5">
            <div className="flex justify-between items-center">
              <span className="font-bold">{room.users[0].username}</span>
              <span className="text-[12px] text-white/50">
                {formatToTimeAgo(room.updated_at.toString())}
              </span>
            </div>
            <p className="text-[14px] line-clamp-1">
              {room.messages[0]?.payload}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChatPage;
