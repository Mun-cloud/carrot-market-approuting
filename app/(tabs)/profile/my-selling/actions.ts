"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { unstable_cache as nextCache } from "next/cache";

export async function getInitialMySellingProducts() {
  const session = await getSession();
  if (!session.id) return;
  const products = await db.product.findMany({
    where: {
      userId: session.id,
    },
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

export const cachedMySellingProducts = nextCache(
  getInitialMySellingProducts,
  ["my-selling-products"],
  {
    tags: ["my-selling-products"],
    revalidate: 10 * 60 * 1000,
  }
);
