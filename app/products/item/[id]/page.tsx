import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { getCachedProduct, getIsProductOwner } from "./actions";
import { Prisma } from "@prisma/client";
import ProductDetail from "./_components/product-detail";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProduct(Number(params.id));
  return { title: product?.title };
}
export type IProductDetail = Prisma.PromiseReturnType<typeof getCachedProduct>;
const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }
  const isOwner = await getIsProductOwner(product.userId);

  return <ProductDetail product={product} id={id} isOwner={isOwner} />;
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
