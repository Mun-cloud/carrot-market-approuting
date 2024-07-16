"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { unstable_cache as nextCache } from "next/cache";
import { z } from "zod";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        comments: {
          select: {
            payload: true,
            created_at: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (error) {
    return null;
  }
}

export async function getCachedPost(postId: number) {
  const cachedOperation = nextCache(getPost, ["post_datail"], {
    tags: [`post-detail-${postId}`],
    revalidate: 60,
  });
  return cachedOperation(postId);
}

const getLikeStatus = async (postId: number) => {
  const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });

  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });

  return { likeCount, isLiked: Boolean(isLiked) };
};

export async function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["product-like-product"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId);
}

export const likePost = async (postId: number) => {
  await new Promise((r) => setTimeout(r, 5000));
  try {
    const session = await getSession();
    await db.like.create({
      data: {
        postId: postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (error) {}
};
export const dislikePost = async (postId: number) => {
  await new Promise((r) => setTimeout(r, 5000));
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId: postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (error) {}
};

export async function addComment(
  postId: number,
  formData: {
    userId: number;
    payload: string;
    postId: number;
  }
) {
  const session = await getSession();
  if (!postId || !session.id) return;

  await db.comment.create({
    data: {
      payload: formData.payload,
      postId,
      userId: formData.userId,
    },
    select: {
      id: true,
    },
  });
}
