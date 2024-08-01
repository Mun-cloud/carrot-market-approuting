"use client";

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatBubbleOvalLeftEllipsisIcon,
  VideoCameraIcon as SolidVideoCameraIcon,
  UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatBubbleOvalLeftEllipsisIcon,
  VideoCameraIcon as OutlineVideoCameraIcon,
  UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { href } from "@/lib/href";

const TabBar = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-sm grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white bg-neutral-800">
      <Link href={href.home} className="flex flex-col items-center gap-px">
        {pathname === href.home ? (
          <SolidHomeIcon className="w-7 h-7" />
        ) : (
          <OutlineHomeIcon className="w-7 h-7" />
        )}
        <span>홈</span>
      </Link>
      <Link href={href.life} className="flex flex-col items-center gap-px">
        {pathname === href.life ? (
          <SolidNewspaperIcon className="w-7 h-7" />
        ) : (
          <OutlineNewspaperIcon className="w-7 h-7" />
        )}
        <span>동네생활</span>
      </Link>
      <Link href={href.chats} className="flex flex-col items-center gap-px">
        {pathname === href.chats ? (
          <SolidChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />
        ) : (
          <OutlineChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />
        )}
        <span>채팅</span>
      </Link>
      <Link href={href.live} className="flex flex-col items-center gap-px">
        {pathname === href.live ? (
          <SolidVideoCameraIcon className="w-7 h-7" />
        ) : (
          <OutlineVideoCameraIcon className="w-7 h-7" />
        )}
        <span>쇼핑</span>
      </Link>
      <Link href={href.profile} className="flex flex-col items-center gap-px">
        {pathname === href.profile ? (
          <SolidUserIcon className="w-7 h-7" />
        ) : (
          <OutlineUserIcon className="w-7 h-7" />
        )}
        <span>나의 당근</span>
      </Link>
    </div>
  );
};

export default TabBar;
