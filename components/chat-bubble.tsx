import { formatToTimeAgo } from "@/lib/utils";
import UserAvatar from "./user-avatar";

interface ChatBubbleProps {
  isOwner: boolean;

  avatar: string | null;
  username: string;
  payload: string;
  created_at: Date;
}

const ChatBubble = ({
  avatar,
  created_at,
  isOwner,
  payload,
  username,
}: ChatBubbleProps) => {
  return (
    <div
      data-owner={isOwner ? "true" : "false"}
      className="flex gap-2 items-start data-[owner=true]:justify-end"
    >
      {!isOwner && (
        <UserAvatar
          avatar={avatar}
          username={username}
          width={50}
          height={50}
          className="size-8"
        />
      )}
      <div className="flex flex-col gap-1 data-[owner=false]:items-end">
        <span className="bg-orange-500 p-2.5 rounded-md">{payload}</span>
        <span className="text-xs">
          {formatToTimeAgo(created_at.toString())}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;
