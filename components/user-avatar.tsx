import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  avatar: string | null;
  username?: string;
  width?: number;
  height?: number;
  className?: string;
}

const UserAvatar = ({
  avatar,
  username,
  className,
  width = 40,
  height = 40,
}: UserAvatarProps) => {
  if (!!avatar) {
    return (
      <Image
        className={cn("rounded-full object-fill", className)}
        src={avatar}
        alt={username ?? ""}
        width={width}
        height={height}
      />
    );
  }

  return <UserIcon className="size-10" />;
};

export default UserAvatar;
