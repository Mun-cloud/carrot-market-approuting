import AddLink from "@/components/add-link";
import db from "@/lib/db";
import { href } from "@/lib/href";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterTextIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";

async function getPosts() {
  return await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
}

export const metadata = {
  title: "동네생활",
};

const LifePage = async () => {
  const posts = await getPosts();

  return (
    <div className="p-5 flex flex-col">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col last:border-b-0 last:mb-0 gap-2"
        >
          <h2 className="text-white text-lg font-semibold line-clamp-1">
            {post.title}
          </h2>
          <p className="line-clamp-3">{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>.</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterTextIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
      <AddLink href={href.life.add} />
    </div>
  );
};

export default LifePage;
