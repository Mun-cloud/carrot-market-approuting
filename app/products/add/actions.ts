"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { productEditSchema } from "../[id]/edit/schema";
import { href } from "@/lib/href";

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          photo: result.data.photo,
          price: result.data.price,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      revalidatePath(href.home);
      redirect(`/products/${product.id}`);
    }
  }
}

export const editProduct = async (formData: FormData) => {
  const data = {
    id: formData.get("id"),
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productEditSchema.safeParse(data);

  if (result.success) {
    const product = await db.product.update({
      where: {
        id: result.data.id,
      },
      data: {
        photo: result.data.photo,
        title: result.data.title,
        price: result.data.price,
        description: result.data.description,
      },
    });

    revalidatePath("home");
    revalidateTag("product-detail");
    redirect(`/products/${product.id}`);
  } else {
    return result.error.flatten();
  }
};

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    }
  );

  const data = await response.json();
  return data;
}
