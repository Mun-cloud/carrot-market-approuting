"use client";

import { HandThumbUpIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as OutlineHandThumbUpIcon,
  EyeIcon as OutlineEyeIcon,
} from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

const LikeButton = ({ isLiked, likeCount, postId }: LikeButtonProps) => {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previeousState, payload: number) => ({
      isLiked: false,
      likeCount: payload,
    })
  );

  const onClick = async () => {
    reducerFn(10000);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  return (
    <button
      className={`flex items-center gap-2 text-sm border rounded-full p-2 ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500"
          : "text-neutral-400 border-neutral-400 hover:bg-neutral-800"
      }`}
      onClick={onClick}
    >
      {state.isLiked ? (
        <>
          <HandThumbUpIcon className="size-5" />
          <span>{state.likeCount}</span>
        </>
      ) : (
        <>
          <OutlineHandThumbUpIcon className="size-5" />
          <span>공감하기 ({state.likeCount})</span>
        </>
      )}
    </button>
  );
};

export default LikeButton;
