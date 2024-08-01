import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import ModalBackBtn from "../../../_components/ModalBackBtn";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { formatToWon } from "@/lib/utils";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }

  return false;
}

async function getProduct(id: number) {
  return await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(Number(params.id));
  return { title: product?.title };
}

const Modal = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);
  const createChatRoom = async () => {
    "use server";
    const session = await getSession()!;
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [{ id: product.userId }, { id: session.id }],
        },
      },
      select: {
        id: true,
      },
    });

    redirect(`/chats/${room.id}`);
  };

  return (
    <div className="absolute h-full w-full z-50 bg-black items-center left-0 top-0 flex justify-center bg-opacity-60 overflow-auto">
      <ModalBackBtn />
      <div className="max-w-[80vw] w-full flex justify-center h-[80vh] overflow-auto">
        <div className="bg-neutral-900 text-neutral-200 rounded-md flex flex-col items-center w-full overflow-auto">
          <Image
            src={product.photo}
            alt={product.title}
            className="w-full rounded-md"
            width={300}
            height={300}
          />
          <div className="w-full">
            <div className="w-full px-10 flex items-center gap-3 border-b border-neutral-700 py-5">
              <div className="size-10 rounded-full overflow-hidden">
                {product.user.avatar !== null ? (
                  <Image
                    className="object-fill"
                    src={product.user.avatar}
                    alt={product.user.username}
                    width={40}
                    height={40}
                  />
                ) : (
                  <UserIcon className="size-10" />
                )}
              </div>
              <div className="">
                <h3>{product.user.username}</h3>
              </div>
            </div>
            <div className="py-5 px-10">
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              <p>{product.description}</p>
            </div>
            <div className="py-5 px-10 flex justify-between items-center border-t border-neutral-700">
              <span className="font-semibold text-xl">
                {formatToWon(product.price)}
              </span>
              <form action={createChatRoom}>
                <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
                  채팅하기
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
