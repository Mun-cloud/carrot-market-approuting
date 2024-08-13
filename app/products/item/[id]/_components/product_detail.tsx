import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { IProductDetail } from "../page";
import { formatToWon } from "@/lib/utils";
import { createChatRoom } from "../actions";

interface ProductDetailProps {
  id: number;
  product: IProductDetail;
  isOwner: boolean;
}
const ProductDetail = ({ id, product, isOwner }: ProductDetailProps) => {
  return (
    <div className="flex flex-col bg-neutral-900 rounded-b-lg grow relative overflow-y-auto pb-[104px]">
      <div className="relative aspect-square overflow-hidden">
        <Image
          className="object-cover rounded-t-lg"
          fill
          src={`${product!.photo}/public`}
          alt={product!.title}
        />
      </div>
      <div className="flex items-center justify-between p-5 border-b border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full overflow-hidden">
            {product!.user.avatar !== null ? (
              <Image
                className="object-cover w-full h-full"
                src={product!.user.avatar}
                alt={product!.user.username}
                width={40}
                height={40}
              />
            ) : (
              <UserIcon className="size-10" />
            )}
          </div>
          <div className="">
            <h3>{product!.user.username}</h3>
          </div>
        </div>
        <div className="flex gap-2">
          {isOwner && (
            <Link
              href={`/products/item/${id}/edit`}
              className="border px-2 py-1 rounded-md border-orange-500 hover:bg-orange-500 hover:text-inherit hover:border-transparent transition-colors"
            >
              수정
            </Link>
          )}

          {isOwner && (
            <form action="">
              <button className="border px-2 py-1 rounded-md text-red-500 border-red-500 hover:bg-red-500 hover:text-inherit hover:border-transparent transition-colors">
                {/* 클릭 이벤트 만들기(로그아웃 버튼 참고) */}
                삭제
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product!.title}</h1>
        <p>{product!.description}</p>
      </div>
      <div className="absolute w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product!.price)}
        </span>
        <form action={createChatRoom}>
          {!isOwner && (
            <>
              <input
                type="hidden"
                value={product!.userId}
                name="productOwnerId"
              />
              <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
                채팅하기
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductDetail;
