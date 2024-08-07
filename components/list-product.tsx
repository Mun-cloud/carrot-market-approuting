import {
  formatToTimeAgo,
  formatToWon,
  imageUrlWithSize,
  toCloudflareImageUrl,
} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

const ListProduct = ({
  id,
  title,
  price,
  photo,
  created_at,
}: ListProductProps) => {
  return (
    <Link href={`/products/item/${id}`} className="flex gap-5">
      <div className="relative size-28 rounded-md overflow-hidden">
        <Image
          src={imageUrlWithSize(photo, "avatar")}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div
        className="flex flex-col gap-1 *:text-white
      "
      >
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
};

export default ListProduct;
