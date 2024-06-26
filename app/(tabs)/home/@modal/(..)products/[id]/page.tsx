import db from "@/lib/db";
import getSession from "@/lib/session";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";
import ModalBackBtn from "../../_components/ModalBackBtn";
import Image from "next/image";

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

  return (
    <div className="absolute h-full w-full z-50 bg-black items-center left-0 top-0 flex justify-center bg-opacity-60">
      <ModalBackBtn />
      <div className="max-w-screen-sm w-full flex justify-center h-1/2">
        <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex items-center justify-center">
          <Image
            src={`${product.photo}/public`}
            alt={product.title}
            width={300}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
