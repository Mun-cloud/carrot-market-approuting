import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { HandThumbUpIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as OutlineHandThumbUpIcon,
  EyeIcon as OutlineEyeIcon,
} from "@heroicons/react/24/outline";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

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

function getCachedPost(postId: number) {
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

function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["product-like-product"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId);
}

const PostDetailPage = async ({ params }: { params: { id: number } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }

  const likePost = async () => {
    "use server";
    const session = await getSession();
    try {
      await db.like.create({
        data: {
          postId: id,
          userId: session.id!,
        },
      });
      revalidateTag(`like-status-${id}`);
    } catch (error) {}
  };
  const dislikePost = async () => {
    "use server";
    const session = await getSession();
    try {
      await db.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id!,
          },
        },
      });
      revalidateTag(`like-status-${id}`);
    } catch (error) {}
  };

  const { isLiked, likeCount } = await getCachedLikeStatus(id);
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <form action={isLiked ? dislikePost : likePost}>
          <button
            className={`flex items-center gap-2 text-sm border rounded-full p-2 ${
              isLiked
                ? "bg-orange-500 text-white border-orange-500"
                : "text-neutral-400 border-neutral-400 hover:bg-neutral-800"
            }`}
          >
            {isLiked ? (
              <>
                <HandThumbUpIcon className="size-5" />
                <span>{likeCount}</span>
              </>
            ) : (
              <>
                <OutlineHandThumbUpIcon className="size-5" />
                <span>공감하기 ({likeCount})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostDetailPage;
