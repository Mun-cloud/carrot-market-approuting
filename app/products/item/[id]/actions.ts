"use server";

import { unstable_cache as nextCache } from "next/cache";
import db from "@/lib/db";

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

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});
