import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";

import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import { getCachedLikeStatus, getCachedPost } from "./actions";
import PostComments from "./_components/post-comments";
import NavHeader from "@/components/nav-header";

const PostDetailPage = async ({ params }: { params: { id: number } }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }

  const { isLiked, likeCount } = await getCachedLikeStatus(id);
  return (
    <>
      <NavHeader>{post.title}</NavHeader>
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

          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </div>
      <PostComments
        commentsCount={post._count.comments}
        comments={post.comments}
        postId={id}
      />
    </>
  );
};

export default PostDetailPage;
