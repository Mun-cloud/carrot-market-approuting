import db from "@/lib/db";
import getSession from "@/lib/session";
import { ReceiptTextIcon, TvIcon, UserIcon } from "lucide-react";

import { notFound, redirect } from "next/navigation";
import UserAvatar from "./_components/user-avatar";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

const ProfilePage = async () => {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/");
  };
  return (
    <div>
      <div className="flex items-center gap-2 py-5">
        <UserAvatar username={user.username} avatar={user.avatar!} />
        <h1>{user.username}</h1>
      </div>

      <div>
        <div className="font-bold text-[20px]">메뉴</div>
        <div className="flex flex-col *:py-2 *:text-start *:flex *:gap-2">
          <button>
            <ReceiptTextIcon className="size-[20px]" /> 나의 판매 목록
          </button>
          <button>
            <TvIcon className="size-[20px]" />
            나의 라이브 목록
          </button>
          <form action={logOut}>
            <button className="flex items-center gap-2">
              <UserIcon className="size-[20px]" /> 로그아웃
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
