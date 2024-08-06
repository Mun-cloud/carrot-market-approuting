import AddLink from "@/components/add-link";
import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { href } from "@/lib/href";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const revalidate = 100;

const ProductsPage = async () => {
  const initialProducts = await getInitialProducts();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <AddLink href={href.product.add} />
    </div>
  );
};

export default ProductsPage;
