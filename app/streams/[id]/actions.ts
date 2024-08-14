"use server";

import db from "@/lib/db";
import { href } from "@/lib/href";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function getStream(id: number) {
  return await db.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      stream_id: true,
      stream_key: true,
      replay_id: true,
      userId: true,
      live_message: {
        select: {
          id: true,
          payload: true,
          created_at: true,
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export async function endStream(formData: FormData) {
  const form = {
    id: formData.get("id"),
    streamId: formData.get("streamId"),
  };
  const result = z
    .object({
      id: z.coerce.number(),
      streamId: z.string(),
    })
    .safeParse(form);

  if (result.success) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${result.data.streamId}/videos`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (data?.result && data.result.length > 0) {
      const videoData = data.result[0];
      await db.liveStream.update({
        where: {
          id: result.data.id,
          stream_id: result.data.streamId,
        },
        data: {
          replay_id: videoData.uid,
        },
        select: {
          id: true,
        },
      });

      revalidatePath(`${href.stream.home}/${result.data.id}`);
    }
  }
}

export async function deleteStream(formdata: FormData) {
  const id = Number(formdata.get("id"));
  await db.liveStream.delete({
    where: {
      id,
    },
  });
  revalidatePath(href.stream.home);
  redirect(href.stream.home);
}
