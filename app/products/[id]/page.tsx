import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCachedProduct } from "./actions";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }

  return false;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProduct(Number(params.id));
  return { title: product?.title };
}

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  return (
    <div>
      <div className="relative aspect-square">
        <Image fill src={`${product.photo}/public`} alt={product.title} />
      </div>
      <div className="flex items-center justify-between p-5 border-b border-neutral-700">
        <div className="flex items-center gap-3">
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
        <div className="flex gap-2">
          {isOwner && (
            <Link
              href={`/products/${id}/edit`}
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
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}
        </span>
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
};

export default ProductDetailPage;

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: { id: true },
  });
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}
